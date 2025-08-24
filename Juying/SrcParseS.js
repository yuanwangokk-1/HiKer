//本代码仅用于个人学习，请勿用于其他作用，下载后请24小时内删除，代码虽然是公开学习的，但请尊重作者，应留下说明
let recordfile = "hiker://files/rules/Src/Juying2/parse.json";//取解析设置、上次成功、手工屏蔽的
let record = fetch(recordfile);
let parseRecord = {};
if(record!=""){
    try{
        eval("parseRecord =" + record + ";");
    }catch(e){
        parseRecord = {};
    }
}

let excludeurl = parseRecord.excludeurl||[];//屏蔽的播放地址
let excludeparse = parseRecord.excludeparse||[];//屏蔽的解析
let playSet = {printlog:0,cachem3u8:0,parsemode:1,video:1,xiutannh:"web",dmRoute:0,isTest:0,mulnum:1};
let Jucfg = fetch("hiker://files/rules/Src/Juying2/config.json");
if(Jucfg != ""){
    try{
        eval("let Juconfig=" + Jucfg+ ";");
        playSet = Juconfig['playSet'] || playSet;
    }catch(e){}
}

if(!playSet.printlog){
    log = function (msg) {
        //未开启打印解析日志>不打印
    }
}
let exclude = /\/404\.m3u8|\/xiajia\.mp4|\.avif|\/余额不足\.m3u8/;//设置排除地址
let contain = /\.mp4|\.m3u8|\.flv|\.avi|\.mpeg|\.wmv|\.mov|\.rmvb|\.dat|qqBFdownload|mime=video%2F|video_mp4|\.ts\?|TG@UosVod|video\/tos\/|m3u8\?pt=m3u8|\.mpd/;//设置符合条件的正确地址
let needparse = /suoyo\.cc|fen\.laodi|ruifenglb/;//设置需要解析的视频地址

//数组去重
function uniq(array) {
    var temp = []; //一个新的临时数组
    for (var i = 0; i < array.length; i++) {
        if (temp.indexOf(array[i]) == -1) {
            temp.push(array[i]);
        }
    }
    return temp;
}
//去除指定数组元素
function removeByValue(arr, val) {
    for(var i = 0; i < arr.length; i++) {
        if(arr[i] == val) {
        arr.splice(i,1);
        break;
        }
    }
}
// 头信息字符串转对象
function headerStrToObj(str) {
    if (!str.startsWith('{') ||!str.endsWith('}')) {
        log('组多线路传入的头信息字符串不正确');
    }
    const pairs = str.slice(1, -1).split('&&');
    const obj = {};
    pairs.forEach(pair => {
        const [key, value] = pair.split('@');
        obj[key] = value.replace(/；；/g,'; ');
    });
    return obj;
}

// 头信息对象转字符串
function headerObjToStr(obj) {
    if (!obj || typeof obj !== 'object') {
        return '{}'; // 如果 obj 不是对象，返回空对象字符串
    }
    const pairs = Object.keys(obj).map(key => `${key}@${obj[key].replace(/;/g,'；；')}`);
    return `{${pairs.join('&&')}}`;
}

if(!config.聚影 && getPublicItem('聚影','')){
    initConfig({
        聚影: getPublicItem('聚影','')
    });
}
function decodeURI(input){
    if($.type(input)=="string" && input.includes("%2F%2F")){
        return decodeURIComponent(input);
    }
    return input;
}

var SrcParseS = {
    聚影: function (vipUrl, dataObj) {
        //聚影采用新的、独立的解析逻辑
        vipUrl = decodeURI(vipUrl);
        vipUrl = vipUrl.startsWith('tvbox-xg:')?vipUrl.replace('tvbox-xg:',''):vipUrl.startsWith('push://')?vipUrl.replace('push://',''):vipUrl
        let isVip = 0;
        let extrajs;
        dataObj = dataObj || {};

        if(dataObj.stype && /hipy_|py/.test(dataObj.stype)){
            let play = {url: ""};
            if(dataObj.stype=="hipy_t3"){
                let sdata = {name: dataObj.sname, url: dataObj.surl, ext: dataObj.sext}
                let {GM} = $.require(config.聚影.replace(/[^/]*$/,'') + "plugins/globalmap.js");
                let drpy = GM.defineModule("SrcJyDrpy", config.聚影.replace(/[^/]*$/,'') + "SrcJyDrpy.js").get(sdata);
                play = JSON.parse(drpy.play(dataObj.flag, vipUrl, []));
            }else if(dataObj.stype=="hipy_t4"){
                play = JSON.parse(fetch(dataObj.surl+(dataObj.surl.includes("?")?"&":"?")+'flag='+dataObj.flag+"&extend="+dataObj.sext+'&play='+vipUrl, {timeout: 10000}));
            }else if(dataObj.stype=="py"){
                if(dataObj.surl.startsWith('hiker')){
                    dataObj.surl = getPath(dataObj.surl).slice(7);
                }else if(dataObj.surl.startsWith('file://')){
                    dataObj.surl = dataObj.surl.slice(7);
                }
                //const PythonHiker = $.require("hiker://files/plugins/chaquopy/PythonHiker.js");
                //let pyModule = PythonHiker.runPy(dataObj.surl).callAttr("Spider");
                require(config.聚影.replace(/[^/]*$/,'') + "plugins/pyDriver.js");
                let pyModule = initPyModule(dataObj.surl);
                PythonHiker.callFunc(pyModule, "init", []);
                play = PythonHiker.callFunc(pyModule, "playerContent", dataObj.flag, vipUrl, []);
                if($.type(play.url) == "array"){
                    play.url = play.url[1];
                }
            }
            //log(play);
            if(play.js){
                extrajs = play.js;
            }
            
            if(play.url.startsWith('push://')){
                play.url = play.url.replace('push://', '');
            }
            if(play.url.startsWith("pics://")){
                log(dataObj.stype + "自解析完成，进入漫画模式");
                return play.url;
            }
            if(play.url.startsWith("select://")){
                let seljson = JSON.parse(play.url.replace("select://",""));
                if(seljson.options.length==1){
                    log(dataObj.stype + "自解析完成，进入直接播放");
                    return "第1部@lazyRule=.js:"+seljson.js;
                }
                log(dataObj.stype + "自解析完成，进入选择播放");
                return play.url;
            }else if(/\.mp3|\.m4a|\.mp4|\.m3u8/.test(play.url) && play.header){
                if(/.mp3|\.m4a/.test(play.url)){
                    play.url = play.url + '#isMusic=true##checkMetadata=false#';
                }
                log(dataObj.stype + "自解析完成，进入带headers播放");
                return JSON.stringify({
                    urls: [play.url],
                    headers: [play.header]
                }); 
            }else if(/do=quark|do=uc/.test(play.url) && /pan\.quark\.cn|drive\.uc\.cn/.test(vipUrl)){
                play.url = vipUrl;
            }else if(/do=ali/.test(play.url) && /alipan\.com|aliyundrive\.com/.test(vipUrl)){
                play.url = vipUrl;
            }
            vipUrl = decodeURI(play.url) || vipUrl;
        }

        log("请求地址："+vipUrl); 
        
        if (vipUrl.startsWith('ftp://') && vipUrl.includes('114s.com')) {
            if(!fileExist("hiker://files/cache/bidi.dex") || !fileExist("hiker://files/cache/libp2p.so")){
                return "toast://缺少荐片插件，播放失败";
                //log("荐片插件本地不存在，偿试下载中...");
                //requireDownload(config.聚影.replace(/[^/]*$/,'') + "plugins/bidi.dex", 'hiker://files/cache/bidi.dex');
                //requireDownload(config.聚影.replace(/[^/]*$/,'') + "plugins/libp2p.so", 'hiker://files/cache/libp2p.so');
                //log("荐片插件下载完成");
            }
            try{
                let s = loadJavaClass("hiker://files/cache/bidi.dex", "com.rule.jianpian", "hiker://files/cache/libp2p.so");
                s.init(getPath("hiker://files/_cache").replace("file://", ""));
                let url = s.JPUrlDec(vipUrl) + "#isVideo=true#";
                return url;
            } catch (e) {
                return "toast://荐片播放失败";
            }
        }else if (/(xunlei|magnet:|ed2k:|bt:|ftp:|\.torrent)/.test(vipUrl)) {
            if(fetch("hiker://page/diaoyong?rule=迅雷")){
                log("优先偿试调用迅雷小程序解析"); 
                return "hiker://page/diaoyong?rule=迅雷&page=fypage#" + vipUrl
            }else if (/magnet|torrent/.test(vipUrl)) {
                log("磁力/BT视频地址，由海阔解析"); 
                return vipUrl;
            }else{
                log("暂不支持的播放链接"); 
                return "toast://暂不支持的播放链接"
            }
        }else if(contain.test(vipUrl)&&!exclude.test(vipUrl)&&!needparse.test(vipUrl)){
            log("直链视频地址，直接播放"); 
            if(vipUrl.includes('app.grelighting.cn')){vipUrl = vipUrl.replace('app.','ht.')}
            return vipUrl + '#isVideo=true#';
        }else if(/\.mp3|\.m4a/.test(vipUrl)){
            log("直链音乐地址，直接播放"); 
            return vipUrl + '#isMusic=true##checkMetadata=false#';
        }else if(vipUrl.includes('sa.sogou')) {
            log("优看视频，直接明码解析"); 
            return unescape(request(vipUrl).match(/"url":"([^"]*)"/)[1].replace(/\\u/g, "%u"));
        }else if(/www\.aliyundrive\.com|www\.alipan\.com/.test(vipUrl)) {
            return $("hiker://empty#noRecordHistory##noHistory#").rule((input) => {
                require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyAliDisk.js');
                aliShareUrl(input);
            },vipUrl);
        }else if(/pan\.quark\.cn|drive\.uc\.cn/.test(vipUrl)) {
            return "hiker://page/quarkList?rule=Quark.简&realurl=" + encodeURIComponent(vipUrl) + "&sharePwd=";
        }else if(vipUrl.includes('pan.baidu.com')) {
            putVar('urlBaidu', vipUrl);
            return "hiker://page/list?rule=百度网盘&realurl=" + vipUrl;
        }else if(vipUrl.includes('.123684.com')) {
            return "toast://暂不支持123盘";
        }else if(/qq\.com|iqiyi\.com|youku\.com|mgtv\.com|bilibili\.com|sohu\.com|ixigua\.com|pptv\.com|miguvideo\.com|le\.com|1905\.com|fun\.tv|cctv\.com/.test(vipUrl)){
            if(vipUrl.indexOf('html?')>-1){
                vipUrl = vipUrl.split('html?')[0]+'html';
            }
            isVip = 1;
        }else if(!needparse.test(vipUrl) && /^http/.test(vipUrl)){
            log("网页嗅探播放");
            let obj = {
                vipUrl: vipUrl,
                isWeb: 1,
                video: playSet.video,
                music: dataObj.music || (dataObj.sname&&dataObj.sname.includes("[听]")?1:0),
                js: extrajs,
                extra: {
                    id: dataObj.id,
                    playUrl: vipUrl,
                    sniffer: dataObj.sniffer,
                    cachem3u8: playSet.cachem3u8
                }
            }
            return this.解析方法(obj);
        }
        
        let from;
        if(dataObj.flag && !isVip){
            from = dataObj.flag;
            if(from=="道长在线"){
                return "toast://解析失败";
            }
        }else{
            try{
                if(vipUrl.indexOf('-yanaifei.html') != -1){
                    from = 'yanaifei';
                }else if(vipUrl.indexOf('suoyo.cc') != -1){
                    from = 'duoduozy';
                }else if(vipUrl.indexOf('.') != -1){
                    var host = vipUrl.replace('m.tv.','m.').match(/\.(.*?)\//)[1];
                    from = host.split('.')[0];
                    parseRecord['flag'] = parseRecord['flag']||[];
                    if(parseRecord['flag'].indexOf(from)==-1){parseRecord['flag'].push(from)}//记录到片源标识组
                }else if(vipUrl.indexOf('-') != -1){
                    from = vipUrl.split('-')[0];
                }else{
                    from = 'other';
                }
            }catch(e){
                from = 'other';
            }
        }
        if(from == "iqiyi"){
            from = "qiyi";
        }
        log("片源标识："+from+"，需要解析"); 

        let parsemode = playSet.parsemode || 1;//解析模式
        let mulnum = playSet.mulnum || 1;//多线程数
        let jxfile = "hiker://files/rules/Src/Juying2/jiexi.json";//解析存放文件
        let parselist = [];//待进线程执行的解析列表
        let jxList= [];//读取解析列表

        if(dataObj.parse){
            //指定解析用于测试
            dataObj.parse["stype"] = "test";
            parselist.push(dataObj.parse);
        }else{
            if(parsemode==1){
                //读取app自带的解析，将未屏蔽的入备选
                let appParses = dataObj.parse_api || [];
                appParses = uniq(appParses);//去重
                if(appParses.length>0){
                    for (let i in appParses) {
                        if(excludeparse.indexOf(appParses[i])==-1){
                            parselist.push({stype:'app',type:1,name:'app'+i,url:appParses[i],sort:0});
                        }
                    }
                    log("接口自带的解析数："+appParses.length); 
                }
            }
            
            //读取解析，将可用加入备选
            if(fetch(jxfile)){
                try{
                    eval("jxList=" + fetch(jxfile)+ ";");
                }catch(e){}

                jxList.forEach(it=>{
                    if(!it.stop){
                        let ext = it.ext||{};
                        let flag = ext.flag || [];
                        if(flag.indexOf("iqiyi")>-1 && flag.indexOf("qiyi")==-1){
                            flag.push("qiyi");
                        }
                        if((flag.length==0 && isVip) || flag.indexOf(from)>-1){
                            parselist.push({stype:'myjx',type:it.type,name:it.name,url:it.url,sort:it.sort||0,header:ext.header,ext:ext});
                        }
                    }
                })

                log("可用解析数：" + parselist.length); 
            }
        }

        //修正排序
        parselist.sort((a, b) => {
            let aa = a.sort||0;
            let bb = b.sort||0;
            return aa - bb;
        })
        let lastparse = parseRecord.lastparse?(parseRecord.lastparse[from] || ""):"";//对应的片源上次解析
        if(lastparse){
            //优先上次成功的
            for(let i=0; i<parselist.length; i++) {
                if(parselist[i].name==lastparse) {
                    let Uparseobj = parselist[i];
                    parselist.splice(i,1);
                    parselist.unshift(Uparseobj);
                    break;
                }
            }
        }
        //解析播放地址需要的一些变量
        var playurl = "";//视频地址
        var urls = [];//多线路地址
        var names = [];//多线路名称
        var headers = [];//多线路头信息
        var audioUrls = [];//多线路音频分离地址
        var danmu = "";//多线路弹幕
        var dellist = [];//需从本地解析中删除列表
        var myJXchange = 0;//私有解析是否有变化需要保存
        var x5jxlist = [];
        var x5namelist = [];

        //模式3手工解析使用代理播放
        if(parsemode==3){
            let u = startProxyServer($.toString((parselist,vipUrl,解析方法,getheader,log) => {
                let parsename = MY_PARAMS.name.join("");
                log("我在代理解析>" + parsename);
                let playUrl = "";
                let ulist = {};
                try{
                    ulist = parselist.filter(item => {
                        return item.name==parsename;
                    })[0];
                    let obj = {
                        ulist: ulist,
                        vipUrl: vipUrl,
                        parsemode: 3
                    }
                    let getUrl = 解析方法(obj);
                    playUrl = getUrl.url;
                }catch(e){
                    log(parsename+">解析错误>" + e.message + " 错误行#" + e.lineNumber);
                }
                if(playUrl){
                    let urltype;
                    let urljson;
                    try{
                        eval('urljson = '+ playUrl);
                        urltype = $.type(urljson);
                    }catch(e){
                        urltype = "string";
                    }
                    if(urltype=="object"){
                        ulist.header = urljson.headers && urljson.headers.length>0?urljson.headers[0]:ulist.header;
                        playUrl = urljson.urls[0];
                    }
                    log(parsename+">播放地址>"+playUrl)
                    if(playUrl.includes(".m3u8")){
                        let f = cacheM3u8(playUrl, {header: ulist.header || getheader(playUrl), timeout: 2000});
                        return f?readFile(f.split("##")[0]):playUrl; //'#isVideo=true#';
                    }else{
                        return JSON.stringify({
                            statusCode: 302,
                            headers: {
                                "Location": playUrl
                            }
                        });
                    }
                }else{
                    return '';
                }
                /*
                return JSON.stringify({
                    statusCode: 302,
                    headers: {
                        "Location": url
                    }
                });
                */
            },parselist,vipUrl,this.解析方法,this.mulheader,log));
            parselist.forEach((item) => {
                urls.push(u + "?name=" + item.name + "#.m3u8#pre#");
                names.push(item.name);
                headers.push(item.header || this.mulheader(vipUrl));
            })
            return {
                urls: urls,
                names: names,
                headers: headers
            };
        }else if(parsemode==2){//强制嗅探走video，没法指定header
            let dm;
            if(isVip && playSet.dmRoute==1){
                dm = this.弹幕(vipUrl);
            }
            let list = parselist.filter(v => v.type==0);
            let weburls = list.map(item => "video://" + item.url +vipUrl);
            let webnames = list.map(item => item.name);
            return JSON.stringify({
                urls: weburls,
                names: webnames,
                danmu: dm
            }); 
        }
        //模式1，聚影智能
        for (var i=0;i<parselist.length;i++) {
            if(playurl!=""){break;}
            let UrlList = [];
            let Namelist = [];
            var beurls = [];//用于存储多线程返回url
            var beparses = [];//用于存储多线程解析地址
            var beerrors = [];//用于存储多线程是否有错误
            var sccess = 0;//计算成功的结果数
            let p = i + mulnum + 2;
            if(p>parselist.length){p=parselist.length}
            for(let s=i;s<p;s++){
                UrlList.push(parselist[s]);
                Namelist.push(parselist[s].name);
                i=s;
            }
            log("本轮排队解析："+Namelist);

            let UrlParses = UrlList.map((list)=>{
                if (/^\/\//.test(list.url)) { list.url = 'https:' + list.url }
                return {
                    func: this.解析方法,
                    param: {
                        ulist: list,
                        vipUrl: vipUrl,
                        video: playSet.video,
                        testVideo: playSet.isTest?this.testVideo:undefined,
                        parsemode: 1
                    },
                    id: list.parse
                }
            });

            be(UrlParses, {
                func: function(obj, id, error, taskResult) {
                    let beurl = taskResult.url;
                    if(beurl && beurl.startsWith('http') && (needparse.test(beurl)||!contain.test(beurl)||exclude.test(beurl)||excludeurl.indexOf(beurl)>-1)){//&&beurl.indexOf('?')==-1
                        beurl = "";
                    }

                    obj.results.push(beurl);
                    obj.parses.push(taskResult.ulist);
                    obj.errors.push(error);
                    if (beurl) {
                        sccess = sccess + 1;
                        if(sccess>=mulnum){
                            log("线程中止，已捕获视频");
                            return "break";
                        }
                    }else{
                        //if(taskResult.ulist.x5==0){log(taskResult.ulist.name + '>解析失败');}
                    }
                },
                param: {
                    results: beurls,
                    parses: beparses,
                    errors: beerrors
                }
            });

            for(let k in beparses){
                var parseurl = beparses[k].url;
                if(beerrors[k]==null&&beurls[k]){//&&contain.test(beurls[k])&&!exclude.test(beurls[k])&&excludeurl.indexOf(beurls[k])==-1
                    if(playurl==""){playurl = beurls[k];}
                    //记录最快的，做为下次优先
                    if(beparses[k].name==lastparse){
                        log(beparses[k].name+'>优先上次解析成功>'+beurls[k]);
                    }else{
                        log(beparses[k].name+'>解析成功>'+beurls[k]+'，记录为片源'+from+'的优先');
                        lastparse = beparses[k].name;
                    }

                    //私有解析成功的，提升一下排序
                    for(let j=0;j<jxList.length;j++){
                        if(parseurl==jxList[j].url){
                            //解析成功的,排序+1
                            let jxsort = jxList[j].sort||0;
                            if(jxsort>0){
                                jxList[j].sort = jxsort - 1;
                                myJXchange = 1;
                            }
                            break;
                        }
                    }
                    
                    //组一个多线路播放地址备用，log($.type(beurls[k]));
                    let urljson;
                    let urltype;
                    try{
                        eval('urljson = '+ beurls[k]);
                        urltype = $.type(urljson);
                    }catch(e){
                        urltype = "string";
                    }
                    if(urltype == "object"){
                        try {
                            let murls = urljson.urls;
                            let mnames = urljson.names || [];
                            let mheaders = urljson.headers || [];
                            let maudioUrls = urljson.audioUrls || [];
                            for(let j=0;j<murls.length;j++){
                                if(!/yue|480|360/.test(mnames[j])){//屏蔽全全-优酷的不必要线路
                                    let MulUrl = this.formatMulUrl(murls[j], urls.length);
                                    urls.push(MulUrl.url);
                                    if(mnames.length>0){
                                        names.push(mnames[j]);
                                    }else{
                                        names.push(beparses[k].name || '线路'+urls.length);
                                    }
                                    if(mheaders.length>0){
                                        headers.push(mheaders[j]);
                                    }else{
                                        headers.push(MulUrl.header);
                                    }
                                    if(maudioUrls.length>0){
                                        audioUrls.push(maudioUrls[j]);
                                    }
                                }
                            }
                            if(urljson.danmu){danmu = urljson.danmu;}
                        } catch (e) {
                            log('判断多线路地址对象有错：'+e.message);
                        }
                    }else{
                        let MulUrl = this.formatMulUrl(beurls[k], urls.length);
                        urls.push(MulUrl.url);
                        names.push(beparses[k].name || '线路'+urls.length);
                        headers.push(MulUrl.header);
                    }
                    //if(ismul==0){break;}
                }else{
                    dellist.push(beparses[k]);
                }
            }//排队解析结果循环
        }//解析全列表循环

        let failparse = [];
        //失败的解析，处理
        for(let p=0;p<dellist.length;p++){
            if(dellist[p].stype=="myjx"){
                for(let j=0;j<jxList.length;j++){
                    if(dellist[p].url==jxList[j].url){
                        if(dellist[p].x5==1){
                            jxList[j]['type'] = 0;
                        }
                        jxList[j]['sort'] = jxList[j]['sort']||0;
                        jxList[j].sort = jxList[j].sort + 1;
                        /*
                        //解析失败的,且排序大于5次从私有中排除片源
                        failparse.push(jxList[j].name);//加入提示失败列表，仅提示
                        if(jxList[j].sort>5 && jxList[j].stopfrom.indexOf(from)==-1){
                            jxList[j].stopfrom[jxList[j].stopfrom.length] = from;
                            log(jxList[j].name+'>解析失败大于5次，排除片源'+from);
                        }
                        */
                        myJXchange = 1;
                        break;
                    }
                }
            }
            if(dellist[p].stype=="app"){
                //app自带的解析在解析失败时，直接加入黑名单
                parseRecord['excludeparse'] = parseRecord['excludeparse']||[];
                if(parseRecord['excludeparse'].indexOf(dellist[p].url)==-1){
                    parseRecord['excludeparse'].push(dellist[p].url);
                }
            }
        }
        
        if(!dataObj.parse){
            //私有解析有排除片源
            if(myJXchange == 1){writeFile(jxfile, JSON.stringify(jxList));}
            //私有解析失败的统一提示
            if(failparse.length>0&&printlog==1){log(failparse+'<以上私有解析失败，降序+1')}
            //记录上次优先解析和自带解析有加入黑名单的保存                
            parseRecord['lastparse'] = parseRecord['lastparse']||{};
            parseRecord['lastparse'][from] = lastparse;
            writeFile(recordfile, JSON.stringify(parseRecord));
        } 

        //播放
        if(playurl){
            let dm;
            if(isVip && playSet.dmRoute==1){
                dm = this.弹幕(vipUrl);
            }
            if(urls.length>1){
                log('进入多线路播放');
                return JSON.stringify({
                    urls: urls,
                    names: names,
                    headers: headers,
                    danmu: danmu || dm,
                    audioUrls: audioUrls
                }); 
            }else{
                log('进入单线路播放');
                if(dm){
                    let MulUrl = this.formatMulUrl(playurl, 0);
                    urls = [];
                    headers= [];
                    urls.push(MulUrl.url);
                    headers.push(MulUrl.header);
                    return JSON.stringify({
                        urls: urls,
                        headers: headers,
                        danmu: dm 
                    }); 
                }else{
                    return this.formatUrl(playurl);
                }
            }
        }else{
            if(x5namelist.length>0){
                log('进入嗅探解析列表：' + x5namelist)
            }
            
            if(x5jxlist.length>0){
                log('开启播放器超级嗅探模式');
                let weburls = x5jxlist.map(item => "video://" + item +vipUrl);
                return JSON.stringify({
                    urls: weburls,
                    names: x5namelist,
                    danmu: dm
                }); 
            }else if(dataObj.parse && dataObj.parse["stype"]=="test" && !dataObj.parse["url"].includes('key=')){
                return "video://"+dataObj.parse["url"]+vipUrl;
            }else{
                return 'toast://解析失败';
            }
        }
    },
    //处理多线路播放地址
    formatMulUrl: function (url,i) {
        try {
            let header = this.mulheader(url);
            url = url.split(';{')[0];
            if ((playSet.cachem3u8)&&url.indexOf('.m3u8')>-1) {// || url.indexOf('vkey=')>-1
                log("缓存m3u8索引文件");
                let name = 'video'+parseInt(i)+'.m3u8';
                url = cacheM3u8(url, {headers: header, timeout: 3000}, name)+'#pre#';
            }
            if(url.indexOf('#isVideo=true#')==-1 && i==0){
                url = url + '#isVideo=true#';
            }
            return {url:url, header:header};
        } catch (e) {
            log("错误："+e.message);
            return url;
        }   
    },
    //测试视频地址有效性
    testVideo: function (url,name,times) {
        if(!url){return 0}
        if(!name){name = "解析"}
        if(!times){times = 60}
        try {
            if(/vkey=|banyung\.|mgtv\.com|1905\.com|qq\.com/.test(url)){
                return 1;
            }else if (/\.m3u8/.test(url)) {
                var urlcode = JSON.parse(request(url,{withStatusCode:true,timeout:2000}));
                //log(name+'url访问状态码：'+urlcode.statusCode)
                if(urlcode.statusCode==-1){
                    log(name+'>m3u8探测超时未拦载，结果未知');
                    return 1;
                }else if(urlcode.statusCode!=200){
                    //log(name+'>m3u8播放地址疑似失效或网络无法访问，不信去验证一下>'+url);
                    return 0;
                }else{
                    try{
                        var tstime = urlcode.body.match(/#EXT-X-TARGETDURATION:(.*?)\n/)[1];
                        var urltss = urlcode.body.replace(/#.*?\n/g,'').replace('#EXT-X-ENDLIST','').split('\n');
                    }catch(e){
                        log(name+'>错误：探测异常未拦截>'+e.message);
                        return 1;
                    }
                    if(parseInt(tstime)*parseInt(urltss.length) < times){
                        log(name+'>m3u8视频长度小于设置的'+times+'s，疑似跳舞小姐姐或防盗小视频，不信去验证一下>'+url);
                        return 0;
                    }else{
                        var urlts = urltss[0];
                        if(/^http/.test(urlts)&&!urlts.match(/youku|iqiyi|ixigua|migu|sohu|pptv|le|cctv|1905|mgtv|qq\.com|M3U8\.TV/)){
                            var tscode = JSON.parse(request(urlts,{headers:{'Referer':url},onlyHeaders:true,redirect:false,timeout:2000}));
                            //log(name+'ts访问状态码：'+tscode.statusCode)
                            if(tscode.statusCode==-1){
                                log(name+'>ts段探测超时未拦载，结果未知');
                                return 1;
                            }else if(tscode.statusCode!=200 && tscode.statusCode!=403){
                                log(name+'>ts段地址疑似失效或网络无法访问，不信去验证一下>'+url);
                                return 0;
                            }
                        }    
                    }
                }
            }else if (/\.mp4/.test(url)) {
                var urlheader = JSON.parse(request(url,{onlyHeaders:true,timeout:2000}));
                if(urlheader.statusCode==-1){
                    log(name+'>mp4探测超时未拦载，结果未知');
                    return 1;
                }else if(urlheader.statusCode!=200){
                    log(name+'>mp4播放地址疑似失效或网络无法访问，不信去验证一下>'+url);
                    return 0;
                }else{
                    var filelength = urlheader.headers['content-length'];
                    if(parseInt(filelength[0])/1024/1024 < 30){
                        log(name+'>mp4播放地址疑似跳舞小姐姐或防盗小视频，不信去验证一下>'+url);
                        return 0;
                    }
                }
            }
            return 1;
        } catch(e) {
            log(name+'>错误：探测异常未拦截，可能是失败的>'+e.message);
            return 1;
        }
    },
    弹幕: function(vipUrl){
        //dm盒子弹幕
        log("开始获取弹幕");
        let dm = "";
        try{
            dm = $.require('hiker://page/dmFun?rule=dm盒子').dmRoute(vipUrl);
        }catch(e){}
        if(dm){
            log("获取弹幕成功");
        }else{
            log("获取弹幕失败");
        }
        return dm;
    },
    解析方法: function(obj) {
        function geturl(gethtml) {
            let rurl = "";
            try {
                if(gethtml.indexOf('urls = "') != -1){
                    rurl = gethtml.match(/urls = "(.*?)"/)[1];
                }else if(gethtml.indexOf('"url":"') != -1){
                    rurl = gethtml.match(/"url":"(.*?)"/)[1];
                }else if(gethtml.indexOf('id="video" src="') != -1){
                    rurl = gethtml.match(/id="video" src="(.*?)"/)[1];
                }else if(gethtml.indexOf('url: "') != -1){
                    rurl = gethtml.match(/url: "(.*?)"/)[1];
                }else{
                    //log('将日志提交给作者，帮助完善解析逻辑>>>'+gethtml);
                }
            } catch (e) {
                log('明码获取错误：'+e.message);
            }
            //let rurl = JSON.parse(html).url || JSON.parse(html).data;
            return rurl;
        }
        
        function exeWebRule(webObj, music, js) {
            let head = webObj.head || {};
            let webUrl = webObj.webUrl;
            if(webUrl.includes('=http')){
                
            }
            return executeWebRule(webUrl, $.toString((music,webUrl) => {
                try{
                    if (typeof (request) == 'undefined' || !request) {
                        eval(fba.getInternalJs());
                    };
                    var urls = _getUrls();
                    //fba.log(fy_bridge_app.getUrls());
                    var exclude = /\/404\.m3u8|\/xiajia\.mp4|\/余额不足\.m3u8|\.avif|\.css|\.js|\.gif|\.png|\.jpg|\.jpeg|html,http|m3u88.com\/admin|\.php\?v=h|\?url=h|\?vid=h|%253Furl%253Dh|#amp=1|\.t-ui\.cn|ac=dm/;//设置排除地址
                    var contain = /\.mp4|\.m3u8|\.flv|\.avi|\.mpeg|\.wmv|\.mov|\.rmvb|\.dat|qqBFdownload|mime=video%2F|video_mp4|\.ts\?|TG@UosVod|video\/tos\/|m3u8\?pt=m3u8|\.mpd/;//设置符合条件的正确地址
                    for (var i in urls) {
                        if(!fba.getVar("getParse") && !webUrl.includes("=http") && /url=h|v=h|youku|mgtv|ixigua|qq\.com|iqiyi|migu|bilibili|sohu|pptv|\.le\.|\.1905|cctv/.test(urls[i])&&!/\/bid\?|\.gif\?|ads\?|img\.php|index\/\?|cityjson/.test(urls[i])){
                            try{
                                fba.log("获取解析>"+urls[i].match(/http.*?=/)[0]);
                                fba.putVar("getParse","1");
                            }catch(e){}
                        }
                        if(music){
                            if(/\.mp3|\.m4a/.test(urls[i])){
                                return fy_bridge_app.getHeaderUrl(urls[i]) + '#isMusic=true##checkMetadata=false#';
                            }
                        }else if (contain.test(urls[i])&&!exclude.test(urls[i])) {
                            fba.clearVar('getParse');
                            //fba.log("exeWebRule解析到>"+urls[i]);
                            return fy_bridge_app.getHeaderUrl(urls[i]) + '#isVideo=true#';
                        }
                    }
                }catch(e){
                    fba.log("exeWebRule失败>"+e.message);
                }
            },music,webUrl), {
                blockRules: ['.m4a','.mp3','.gif','.jpg','.jpeg','.png','.ico','hm.baidu.com','/ads/*.js','/klad/*.php','layer.css'],
                jsLoadingInject: true,
                js: js,
                ua: head['user-agent'] || MOBILE_UA,
                referer: head['referer'] || undefined,
                checkTime: 100,
                timeout: 12000
            })
        }

        if(obj.isWeb){
            //网页播放页，非官源解析
            require((config.聚影||getPublicItem('聚影','')).replace(/[^/]*$/,'') + 'SrcJyMethod.js');
            if(obj.music){
                return exeWebRule({webUrl:obj.vipUrl}, 1, obj.js) || "toast://嗅探解析失败";
            }else if(obj.video){
                let extra = obj.extra || {};
                if(obj.js && extra.id){
                    extra.js = obj.js;
                    updateItem(extra.id, { extra: getPlayExtra(extra) });
                }
                return 'video://'+obj.vipUrl;
            }else{
                return exeWebRule({webUrl:obj.vipUrl}, 0, obj.js||extraJS(obj.vipUrl)) || "toast://WebRule获取失败，可试试video";
            }
        }else if(/^function/.test(obj.ulist.url.trim())){
            //js解析
            obj.ulist['x5'] = 0;
            let rurl;
            try{
                eval('var JSparse = '+obj.ulist.url)
                rurl = JSparse(obj.vipUrl);
                //log(rurl);
            }catch(e){
                //log("解析有错误"+e.message);
            }
            if(rurl){
                if(/^toast/.test(rurl)){
                    log(obj.ulist.name+'>提示：'+rurl.replace('toast://',''));
                    rurl = "";
                }else if(obj.testVideo && /^http/.test(rurl) && obj.testVideo(rurl,obj.ulist.name)==0){
                    rurl = "";
                }
            }
            return {url: rurl || "", ulist: obj.ulist}; 
        }else{
            //url解析
            let taskheader = {withStatusCode:true,timeout:8000};
            let ext = obj.ulist.ext || {};
            let head = obj.ulist.header || {};
            if(JSON.stringify(head) != "{}"){
                taskheader['header'] = head;
            }
            let getjson;
            try{
                getjson = JSON.parse(request(obj.ulist.url+obj.vipUrl,taskheader));
            }catch(e){
                getjson = {};
                log(obj.ulist.name+'>解析地址访问失败');
            }
            //log(getjson);
            if (getjson.body&&getjson.statusCode==200){
                var gethtml = getjson.body;
                var rurl = "";
                var isjson = 0;
                try {
                    if(ext.decrypt){
                        require((config.聚影||getPublicItem('聚影','')).replace(/[^/]*$/,'') + 'SrcJyMethod.js');
                        gethtml = appDecrypt(gethtml, ext.decrypt);
                    }
                    let json =JSON.parse(gethtml);
                    //log(json);
                    isjson = 1;
                    rurl = json.url||json.urll||json.data.url||json.data;
                } catch (e) {
                    //log("非json>"+e.message);
                    if(/\.m3u8|\.mp4/.test(getjson.url)&&getjson.url.indexOf('=http')==-1){
                        rurl = getjson.url;
                    }else if(/\.m3u8|\.mp4/.test(gethtml) && geturl(gethtml)){
                        rurl = geturl(gethtml);
                    }else if((MY_NAME=="海阔视界"&&getAppVersion()>=4094)||(MY_NAME=="嗅觉浏览器"&&getAppVersion()>=1359)){
                        require((config.聚影||getPublicItem('聚影','')).replace(/[^/]*$/,'') + 'SrcJyMethod.js');
                        let purl = obj.ulist.url+obj.vipUrl;
                        if(/jx\.playerjy\.com/.test(purl)){
                            head['referer'] = purl;
                            let burl = pd(fetch(purl),"iframe&&src");
                            purl = pd(fetch(burl),"iframe&&src");
                            log("获取到iframe地址>" + purl);
                        }
                        rurl = exeWebRule({webUrl:purl,head:head}, 0, extraJS(purl)) || "";
                    }
                }
                var x5 = 0;
                if(!rurl){
                    if(!/404 /.test(gethtml)&&obj.ulist.url.indexOf('key=')==-1&&isjson==0){
                        x5 = 1;
                    }
                }else{
                    if(obj.testVideo && /^http/.test(rurl) && obj.testVideo(rurl,obj.ulist.name)==0){
                        rurl = "";
                    }
                }
                obj.ulist['x5'] = x5;
                return {url: rurl, ulist: obj.ulist}; 
            }else{
                obj.ulist['x5'] = 0;
                return {url: "", ulist: obj.ulist, error: 1};//网页无法访问状态码不等于200 
            }
        }
    },
    formatUrl: function (url, i) {
        try {
            if (url.trim() == "") {
                return "toast://解析失败，建议切换线路或更换解析方式";
            } else if(/^{/.test(url)){
                return url;
            }else {
                if (url[0] == '/') { url = 'https:' + url }
                if (i == undefined) {
                    if (playSet.cachem3u8 && url.indexOf('.m3u8')>-1) {
                        url = cacheM3u8(url, {timeout: 2000});
                    }
                    if(url.indexOf('User-Agent')==-1){
                        if (/wkfile/.test(url)) {
                            url = url + ';{User-Agent@Mozilla/5.0&&Referer@https://fantuan.tv/}';
                        } else if (/bilibili|bilivideo/.test(url)) {
                            url = url + ";{User-Agent@bili2021&&Referer@https://www.bilibili.com/}";
                        } else if (/mgtv/.test(url)) {
                            url = url + ";{User-Agent@Mozilla/5.0}";
                        }/* else {
                            url = url + ";{User-Agent@Mozilla/5.0}";
                        }*/
                    }
                } else {
                    if ((playSet.cachem3u8)&&url.indexOf('.m3u8')>-1) {// || url.indexOf('vkey=')>-1
                        url = cacheM3u8(url, {timeout: 2000}, 'video' + parseInt(i) + '.m3u8') + '#pre#';
                    }
                }
                if(url.indexOf('#isVideo=true#')==-1){
                    url = url + '#isVideo=true#';
                }
                return url;
            }
        } catch (e) {
            return url;
        }
    },
    mulheader: function (url) {
        let header = {};
        if(url.includes(';{')){
            header = headerStrToObj('{'+url.split(';{')[1].replace('#isVideo=true#',''))
        }else if (/mgtv/.test(url)) {
            header = { 'User-Agent': 'Mozilla/5.0', 'Referer': 'www.mgtv.com' };
        } else if (/bilibili|bilivideo/.test(url)) {
            header = { 'User-Agent': 'bili2021', 'Referer': 'www.bilibili.com' };
        } else if (/wkfile/.test(url)) {
            header = { 'User-Agent': 'Mozilla/5.0', 'Referer': 'fantuan.tv' };
        }
        return header;
    }
}


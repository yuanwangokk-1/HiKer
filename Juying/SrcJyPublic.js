// 本代码仅用于个人学习，请勿用于其他作用，下载后请24小时内删除，代码虽然是公开学习的，但请尊重作者，应留下说明
let libspath = "hiker://files/data/聚影/"; //依赖文件路径
let rulepath = "hiker://files/rules/Src/Juying2/"; //规则文件路径
let cachepath = "hiker://files/_cache/Juying2/"; //缓存文件路径
let jkfilespath = rulepath + "jiekou/"; //接口数据文件路径
let jkfile = rulepath + "jiekou.json";
let jxfile = rulepath + "jiexi.json";
let ypfile = rulepath + "yundisk.json";
let tvfile = rulepath + "live.txt";
let cfgfile = rulepath + "config.json";
let sortfile = rulepath + "jksort.json";
let codepath = (config.聚影||config.依赖||getPublicItem('聚影','https://raw.gitcode.com/src48597962/juying/raw/master/SrcJuying.js')).replace(/[^/]*$/,'');

let Juconfig= {};
let Jucfg=fetch(cfgfile);
if(Jucfg != ""){
    eval("Juconfig=" + Jucfg+ ";");
}

let timeout = 15000;
let homeSource = Juconfig['homeSource'] || {};
let sourceType = homeSource.type;
let sourceName = homeSource.name;
let sourceGroup = homeSource.group || homeSource.type;
let sourceUrl = homeSource.url;


function getFile(lx) {
    let file = lx=='jk'?jkfile:lx=='jx'?jxfile:lx=='yp'?ypfile:'';
    return file;
}
//获取所有接口或解析
function getDatas(lx, isyx) {
    let datalist = [];
    if(getItem('sourceMode','1')=='1'){
        let sourcefile = getFile(lx);
        let sourcedata = fetch(sourcefile);
        if(sourcedata != ""){
            try{
                eval("datalist=" + sourcedata+ ";");
            }catch(e){
                datalist = [];
            }
        }
    }else if(getItem('sourceMode','1')=='2'){
        if(Juconfig['dySource']){
            let boxSource = getBoxSource(Juconfig['dySource'], 2, {jk:lx=="jk"?1:0,jx:lx=="jx"?1:0});
            if(boxSource.message){
                toast(boxSource.message);
            }else{
                datalist = lx=="jk"?boxSource.jklist:boxSource.jxlist;
                if(!datalist){
                    toast("订阅源异常，获取失败，可更换订阅或切换模式");
                    datalist = [];
                }
            }
        }
    }
    if (lx=="jx") {
        datalist.sort((a, b) => {
            let aa = a.sort||0;
            let bb = b.sort||0;
            return aa - bb;
        })
    }else if (getItem("sourceListSort") == "接口名称") {
        datalist = sortByPinyin(datalist);
    }else if (getItem("sourceListSort") == "使用频率") {
        let sort = {};
        if(fetch(sortfile)){
            eval("sort = " + fetch(sortfile));
        }
        datalist.forEach(it=>{
            try{
                let jksort = sort[it.url] || {};
                it.sort = jksort.use || 0;
            }catch(e){
                it.sort = 0;
            }
        })
        datalist.sort((a, b) => {
            return b.sort - a.sort
        })
    }else{
        datalist.reverse();
    }
    
    // 禁用的放到最后
    let withoutStop = datalist.filter(item => !item.stop);
    if(isyx){
        return withoutStop;
    }
    let withStop = datalist.filter(item => item.stop);
    // 合并数组
    let result = withoutStop.concat(withStop);
    return result;
}
//临时处理将相关文件转换位置，以后可以删除
if(fileExist(libspath+"libs_jk")){
    log("接口数据目录存在旧目录，执行转移");
    let datalist = [];
    let sourcedata = fetch(jkfile);
    if(sourcedata){
        eval("datalist=" + sourcedata + ";");
    }
    datalist.forEach(it=>{
        if(it.url.startsWith(libspath)){
            let newfile = jkfilespath + it.url.substr(it.url.lastIndexOf('/')+1);
            writeFile(newfile, fetch(it.url));
            it.url = newfile;
        }
    })
    writeFile(jkfile, JSON.stringify(datalist));
    let FileUtil = new com.example.hikerview.utils.FileUtil;
    FileUtil.deleteDirs(getPath(libspath+"libs_jk/").replace("file://", ""));
}

// 较验box配置文件
function checkBoxUrl(input) {
    let html;
    try{
        if(input.startsWith('/')){input = "file://" + input}
        if(input.includes('#nodejsID=')){
            let nodejsID = input.split('#nodejsID=')[1];
            let isRunning = $.require('hiker://page/thirdstart?rule=nodejs').isRunning(nodejsID);
            if(!isRunning){
                $.require('hiker://page/thirdstart?rule=nodejs').start(nodejsID);
                toast('正在启动notejs服务中');
                let c = 0;
                while (c<20) {
                    java.lang.Thread.sleep(1000);
                    c++;
                    if($.require('hiker://page/thirdstart?rule=nodejs').isRunning(nodejsID)){
                        java.lang.Thread.sleep(5000);
                        toast('启动完成，如加载失败，返回重进');
                        c = 30;
                    }
                }
            }
            input = input.split('#nodejsID=')[0];
        }
        if(input.startsWith('http')){
            let tmpFile = cachepath + md5(input) + ".json";
            if(!fileExist(tmpFile)){
                showLoading('检测在线文件有效性');
                html = getContnet(input);
                //log(html);
                if(html){
                    writeFile(tmpFile, html);
                }
            }else{
                html = fetch(tmpFile);
            }
        }else if(input.startsWith('file')){
            html = fetch(input);
        }else{
            html = "";
        }
        if(html.includes('LuUPraez**')){
            html = base64Decode(html.split('LuUPraez**')[1]);
        }
        eval('let data = ' + html)
        if(data.urls){
            hideLoading();
            return {urls: data.urls};
        }
    } catch (e) {
        hideLoading();
        log("box配置文件检测失败>" + e.message + " 错误行#" + e.lineNumber); 
        return {
            message: "失败：链接文件无效或内容有错"
        };
    }
    hideLoading();
    return {html: html}
}

// 从box配置文件获取
function getBoxSource(input, mode, imports){
    //input配置文件地址，mode模式1为导入，2为订阅，3为较验
    let html,data;
    let checkUrl = checkBoxUrl(input);
    if(checkUrl.message){
        return checkUrl;
    }else if(checkUrl.urls){
        return {
            message: "失败：此为多仓配置文件"
        };
    }else if(checkUrl.html){
        html = checkUrl.html;
        eval('data = ' + html);
    }else{
        return {
            message: "异常：为啥会没有获取到html"
        };
    }
    
    if(mode==3){//订阅较验完成
        Juconfig['dySource'] = input;
        writeFile(cfgfile, JSON.stringify(Juconfig));
        let dyJkTmpFile = cachepath + md5(input) + ".json";
        writeFile(dyJkTmpFile, html);
        back();
        return {
            message: "已订阅，站源获取模式为订阅模式下生效"
        };
    }

    let result = {};
    if(mode==1){
        showLoading('正在多线程获取数据中');
    }
    let jiekous = data.sites||[];
    if(imports.jk && jiekous.length>0){
        let urls= [];
        //多线程处理
        let task = function(obj) {
            let arr;
            if(/^csp_AppYs/.test(obj.api)){
                arr = { "name": obj.name, "url": obj.ext, "type": getapitype(obj.ext)};
            }else if((obj.type==1||obj.type==0)&&obj.api.indexOf('cms.nokia.press')==-1){
                arr = { "name": obj.name, "url": obj.api, "type": "cms"};
                if(obj.categories){
                    arr["categories"] = obj.categories;
                }
            }else if(obj.type==4 && (obj.api.includes('/api/')||obj.api.includes('/drpys/'))){
                let extfile = obj.ext;
                if($.type(extfile)=='string'){
                    if(extfile.startsWith('./')){
                        let urlpath = input.substr(0, input.lastIndexOf('/')+1);
                        extfile = extfile.replace("../", urlpath).replace(/\.\//g, urlpath);
                    }
                }
                arr = { "name": obj.name, "url": obj.api, "type": "hipy_t4", "ext": extfile};
                if(arr.name.includes('[搜]')){
                    arr['onlysearch'] = 1;
                }
            }else{
                let extfile = obj.ext;
                if($.type(extfile)=='string'){
                    if(/^clan:/.test(extfile)){
                        extfile = extfile.replace("clan://TVBox/", input.match(/file.*\//)[0]);
                    }else if(extfile.startsWith('./')){
                        let urlpath = input.substr(0, input.lastIndexOf('/')+1);
                        extfile = extfile.replace("../", urlpath).replace(/\.\//g, urlpath);
                    }
                }

                if(/^csp_XBiubiu/.test(obj.api)){
                    arr = { "name": obj.name, "type": "biubiu", "ext": extfile};
                }else if(/^csp_XPath/.test(obj.api)){
                    arr = { "name": obj.name, "type": "XPath", "ext": extfile};
                }else if(obj.api=="csp_XBPQ"){
                    arr = { "name": obj.name, "type": "XBPQ", "ext": extfile};
                }else if(/^csp_XYQHiker/.test(obj.api)){
                    arr = { "name": obj.name, "type": "XYQ", "ext": extfile};
                }else if(/drpy2/.test(obj.api) && obj.type==3 && !obj.ext.includes('drpy.js')){
                    arr = { "name": obj.name.includes('|')?obj.name.split('|')[1].trim():obj.name, "type": "hipy_t3", "ext": extfile};
                    if(arr.name.includes('[搜]')){
                        arr['onlysearch'] = 1;
                    }
                }

                if(arr){
                    let urlfile;
                    let filepath = cachepath + arr.type;
                    if($.type(extfile)=='object'){
                        urlfile = filepath + '_' + arr.name + '.json';
                        writeFile(urlfile, JSON.stringify(extfile));
                    }else if(/^file/.test(extfile)){
                        if(mode==1){
                            urlfile = filepath + '_' + (extfile.includes('?')?obj.key:"")+extfile.split('?')[0].substr(extfile.split('?')[0].lastIndexOf('/')+1);
                            writeFile(urlfile, fetch(extfile.split("?")[0]));
                        }else{
                            urlfile = extfile.split('?')[0];
                        }
                    }else if(/^http/.test(extfile)){
                        urlfile = filepath + '_' + (extfile.includes('?')?obj.key:"")+extfile.split('?')[0].substr(extfile.split('?')[0].lastIndexOf('/')+1);
                        if(mode==1){
                            try{
                                let content = getContnet(extfile);
                                if (!content) {
                                    urlfile = '';
                                }else{
                                    if(arr.type=="XYQ" && !/分类片单标题/.test(content)){
                                        arr['onlysearch'] = 1;
                                    }
                                    if(arr.type=="XBPQ"){
                                        if(!/数组/.test(content)){
                                            urlfile = '';
                                        }else if(!/搜索url/.test(content)){
                                            obj.searchable = 0;
                                        }
                                    }
                                    if(urlfile){
                                        writeFile(urlfile, content);
                                    }
                                }
                            }catch(e){
                                log(obj.name + 'ext文件缓存失败>' + e.message);
                            }
                        }
                    }
                    if(urlfile){
                        arr['url'] = urlfile;
                    }
                }
            }
            if(arr && arr.url){
                arr['searchable'] = obj.searchable;
                return {data: arr};
            }
            return {};
        }
        
        let jiekoutask = jiekous.map((list)=>{
            return {
                func: task,
                param: list,
                id: list.key
            }
        });

        be(jiekoutask, {
            func: function(obj, id, error, taskResult) {  
                if(taskResult.data){
                    urls.push(taskResult.data);
                }
            },
            param: {
            }
        });
        result.jklist = urls;
    }
    let jiexis = data.parses||[];
    if(imports.jx && jiexis.length>0){
        let urls = jiexis.filter(it=>{
            return /^http/.test(it.url);
        })
        result.jxlist = urls;
    }
    hideLoading(); 
    return result;     
}
// 获取接口tags
function getJkTags(datas){
    datas = datas || getDatas('jk', 1);
    let tags = [];
    datas.forEach(it=>{
        let str = it.name;
        let regex = /\[(.*?)\]/;
        let match = str.match(regex);
        if (match && match[1].trim()) {
            let tag = '[' + match[1].trim() + ']';
            if(tags.indexOf(tag)==-1){
                tags.push(tag);
            }
        }
    })
    return tags;
}
//乱序方法
function shuffleArray(array) {
    array.sort(() => Math.random() - 0.5);
    return array;
}
//获取在线文件内容
function getContnet(url) {
    if(url.startsWith('file')){
        return fetch(url);
    }else if(!url.startsWith('http')){
        return '';
    }
    if(url.startsWith('https://raw.githubusercontent.com')){
        let proxys = $.require('ghproxy').getproxy();
        shuffleArray(proxys);
        proxys.push('');
        for(let i=0;i<proxys.length;i++){
            let content = fetch(proxys[i]+url, {timeout:6000});
            if (content && !content.startsWith('<!DOCTYPE html>') && !content.startsWith('<html>') && !/502 Bad Gateway/.test(content)) {
                return content;
            }
        }
        return '';
    }else{
        let headers = { 'User-Agent': MOBILE_UA };
        if(!url.endsWith('.json') && !url.endsWith('.js') && !url.endsWith('.txt') && !url.endsWith('.m3u') && !url.endsWith('.m3u8')){
            headers['User-Agent'] = 'okhttp/4.12.0';
        }
        return fetch(url, {headers: headers, timeout:20000});
    }
}
//获取分组接口列表
function getGroupLists(datas, k) {
    k = k=="全部"?"":k;
    datas = datas.filter(it=>{
        let group = it.group||it.type;
        return !k || (k==group);
    })

    return datas;
}
//获取搜索接口列表
function getSearchLists(group) {
    //group为true则取指定分组接口，为false时先取优选，没有则取前50
    let datalist = getDatas('jk', 1).filter(it=>{
        return it.searchable!=0;
    });

    let sort = {};
    if(fetch(sortfile)){
        eval("sort = " + fetch(sortfile));
    }
    datalist.forEach(it=>{
        try{
            let jksort = sort[it.url] || {};
            it.sort = jksort.fail || 0;
        }catch(e){
            it.sort = 0;
        }
    })
    datalist.sort((a, b) => {
        return a.sort - b.sort
    })

    if(group){
        return datalist.filter(it=>{
            return group==(it.group||it.type);
        });
    }else{
        let filter = getItem('主页搜索接口范围', '');
        if(filter){
            datalist = datalist.filter(it=>{
                return filter.includes('[') ? it.name.includes(filter) : filter==(it.group||it.type);
            })
        }else{
            let lockgroups = Juconfig["lockgroups"] || [];
            datalist = datalist.filter(it=>{
                return lockgroups.indexOf(it.group||it.type)==-1 && !it.name.includes('[密]');
            })
        }
        return datalist;
    }
}
//获取接口分组名arry
function getJiekouGroups(datas) {
    let groupNams = [];
    datas.forEach(it => {
        let group = it.group||it.type;
        if (groupNams.indexOf(group)==-1){
            groupNams.push(group);
        }
    })
    return groupNams;
}
//删除统一入口
function deleteData(lx, data){
    let sourcefile = getFile(lx);
    let sourcedata = fetch(sourcefile);
    eval("let datalist=" + sourcedata + ";");
    let dellist= [];
    if(!data){
        dellist = Object.assign(dellist, datalist);
    }else if($.type(data)=='object'){
        dellist.push(data);
    }else if($.type(data)=='array'){
        dellist = data;
    }

    dellist.forEach(it => {
        if(lx=='jk' && it.url.includes(jkfilespath)){
            deleteFile(it.url);
        }
        let index = datalist.indexOf(datalist.filter(d => it.url==d.url )[0]);
        datalist.splice(index, 1);
    })

    writeFile(sourcefile, JSON.stringify(datalist));
    if(lx=='jk'){
        clearMyVar('Src_Jy_searchMark');
    }
    clearMyVar('duoselect');
}
// 接口/解析处理公共方法
function dataHandle(lx, data, input) {
    let sourcefile = getFile(lx);
    let sourcedata = fetch(sourcefile);
    eval("let datalist=" + sourcedata + ";");

    let waitlist= [];
    if($.type(data)=='object'){
        waitlist.push(data);
    }else if($.type(data)=='array'){
        waitlist = data;
    }
    
    waitlist.forEach(it => {
        let index = datalist.findIndex(item => item.url === it.url);
        if(lx=="jx" && input=="重置排序"){
            datalist[index].sort = 0;
        }else if(input == "禁用"){
            datalist[index].stop = 1;
        }else if(input == "启用"){
            delete datalist[index].stop;
        }else if(lx=="jk" && input == "置顶"){
            const [target] = datalist.splice(index, 1);
            datalist.push(target);
        }
    })
    writeFile(sourcefile, JSON.stringify(datalist));
    if(lx='jk'){
        clearMyVar('Src_Jy_searchMark');
    }
    clearMyVar('duoselect');
    return input + '：已处理' + waitlist.length + '个';
}

// 设置接口顺序
function setJkSort(data, so) {
    let waitlist= [];
    if($.type(data)=='string'){
        waitlist.push(data);
    }else if($.type(data)=='array'){
        waitlist = data;
    }
    let sort = {};
    if(fetch(sortfile)){
        eval("sort = " + fetch(sortfile));
    }
    waitlist.forEach(it=>{
        let key;
        if($.type(it)=="object"){
            key = it.url;
        }else if($.type(it)=="string"){
            key = it;
        }
        let jksort = sort[key] || {};
        if($.type(jksort) != "object"){
            jksort = {};
        }
        if(so.use==0){
            jksort.use = 0;
        }else if(so.fail==0){
            jksort.fail = 0;
        }else if(so.use){
            jksort.use = jksort.use || 0;
            jksort.use++;
        }else if(so.fail){
            jksort.fail = jksort.fail || 0;
            jksort.fail++;
        }
        sort[key] = jksort;
    })
    writeFile(sortfile, JSON.stringify(sort));
}
// 执行一些主页加载后的事项，间隔24小时
function excludeLoadingItems() {
    // 清理接口排序
    let datalist = getDatas("jk");
    datalist.reverse();
    let sort = {};
    if(fetch(sortfile)){
        eval("sort = " + fetch(sortfile));
    }
    Object.keys(sort).forEach(it=>{
        if(!datalist.some(item => item.url==it)){
            delete sort[it];
        }
        if($.type(sort[it]) != "object"){
            delete sort[it];
        }
    })
    writeFile(sortfile, JSON.stringify(sort));
    // 失败10以上的接口自动禁用
    datalist.forEach(it=>{
        if(!it.stop){
            try{
                let jksort = sort[it.url] || {};
                let fail = jksort.fail || 0;
                if(fail>=10){
                    it.stop = 1;
                }
            }catch(e){}
        }
    })
    writeFile(jkfile, JSON.stringify(datalist));
    
    // 清理接口残留过期文件
    /*
    let names = readDir(jkfilespath);
    let datalist = getDatas("jk");
    names.forEach(it=>{
        if(!datalist.some(item => item.url==jkfilespath+it)){
            deleteFile(jkfilespath+it);
        }
    })
    */
}
// 读取目录路径下文件输出数组
function readDir(path) {
    let names = [];
    if(path){
        if(path.startsWith('hiker://')){
            path = getPath(path);
        }
        let file = new java.io.File(path.replace("file://", ""));

        if (!(file.exists() && file.isDirectory())) return names;
        for (let it of file.listFiles()) {
            names.push(String(it.getName()));
        }
    }
    return names;
}

// 获取接口对应的显示标题
function getDataTitle(data) {
    if($.type(data.type)=="string"){
        return data.name + '  ““””<small><font color=grey>('+data.type+')' + (data.group&&data.group!=data.type?' [' + data.group + ']':'') + '</font></small>';
    }else{
        return (data.sort||0) + '-'+data.name + '-' + data.url;
    }
}
//接口管理多选方法
function duoselect(datas){
    let datalist = [];
    if($.type(datas)=="array"){
        datalist = datalist.concat(datas);
    }else if($.type(datas)=="object"){
        datalist.push(datas);
    }
    let duoselect = storage0.getMyVar('duoselect') || [];
    datalist.forEach(data=>{
        if(!duoselect.some(item => data.url==item.url)){
            duoselect.push(data);
            updateItem(data.url, {title: colorTitle(getDataTitle(data),'#3CB371')});
        }else{
            for(var i = 0; i < duoselect.length; i++) {
                if(data.url == duoselect[i].url) {
                    duoselect.splice(i, 1);
                    break;
                }
            }
            updateItem(data.url, {title:data.stop?colorTitle(getDataTitle(data),'#f20c00'):getDataTitle(data)});
        }
    })
    storage0.putMyVar('duoselect',duoselect);
}
// 点播主页选择源接口
function selectSource() {
    const hikerPop = $.require(config.聚影.replace(/[^/]*$/,'') + 'plugins/hikerPop.js');
    let sourceAllList = getDatas("jk", 1).filter(x=> !x.onlysearch);
    let lockgroups = Juconfig["lockgroups"] || [];
    if(getMyVar('Src_Jy_已验证指纹')!='1'){
        sourceAllList = sourceAllList.filter(it=>{
            return lockgroups.indexOf(it.group||it.type)==-1;
        })
    }
    let sourceListGroup = Juconfig["sourceListGroup"] || sourceGroup || "全部";
    let sourceList = getGroupLists(sourceAllList, sourceListGroup);
    let tmpList = sourceList;

    hikerPop.setUseStartActivity(false);

    function getnames(list) {
        let index = 0;
        let names = list.map((v,i) => {
            let vname = v.name;
            if(v.url == sourceUrl && v.name==sourceName){
                index = i;
                vname = `‘‘’’<strong><font color="`+getItem('主题颜色','#6dc9ff')+`">`+v.name+`</front></strong>`;
            }
            return vname;
        });
        return {names:names,index:index};
    }
    let index_names = getnames(sourceList);
    let index = index_names.index;
    let names = index_names.names;
    let spen = 3;
    let inputBox;
    let pop = hikerPop.selectBottomRes({
        options: names,
        columns: spen,
        title: "当前:" + (sourceName||"") + "  合计:" + sourceAllList.length,
        noAutoDismiss: true,
        toPosition: index,
        extraInputBox: (inputBox = new hikerPop.ResExtraInputBox({
            hint: "源关键字筛选，右边切换分组",
            title: sourceListGroup,
            onChange(s, manage) {
                putMyVar("Src_Jy_sourceListFilter", s);
                tmpList = sourceList.filter(x => x.name.toLowerCase().includes(s.toLowerCase()));
                let flist = getnames(tmpList).names;
                manage.list.length = 0;
                flist.forEach(x => {
                    manage.list.push(x);
                });
                manage.change();
            },
            defaultValue: getMyVar("Src_Jy_sourceListFilter", ""),
            click(s, manage) {
                let groupnames = getJiekouGroups(sourceAllList);
                let tags = getJkTags(sourceAllList);
                let selects = ['全部'].concat(groupnames).concat(tags);
                //inputBox.setHint("提示");
                hikerPop.selectCenter({
                    options: selects, 
                    columns: 3, 
                    title: "切换源分组/TAG快速筛选", 
                    //position: groupnames.indexOf(sourceName),
                    click(s) {
                        if(s.startsWith('[')){
                            inputBox.setDefaultValue(s);
                        }else{
                            inputBox.setTitle(s);
                            inputBox.setDefaultValue("");
                            Juconfig["sourceListGroup"] = s;
                            writeFile(cfgfile, JSON.stringify(Juconfig));
                            
                            sourceList = getGroupLists(sourceAllList, s);
                            tmpList = sourceList;
                            names = getnames(tmpList).names;
                            manage.list.length = 0;
                            names.forEach(x => {
                                manage.list.push(x);
                            });
                            manage.change();
                        }
                    }
                });
            },
            titleVisible: true
        })),
        longClick(s, i, manage) {

        },
        click(s, i, manage) {
            pop.dismiss();

            let input = s.replace(/[’‘]|<[^>]*>/g, "");
            if(tmpList[i].name==input){
                Juconfig["homeSource"] = tmpList[i];
                writeFile(cfgfile, JSON.stringify(Juconfig));
                
                clearMyVar('dianbo$分类');
                clearMyVar('dianbo$fold');
                clearMyVar('dianbo$classCache');
                clearMyVar('dianbo$flCache');
                clearMyVar('点播动态加载loading');
                clearMyVar('点播一级jkdata');
                
                let key = tmpList[i].url;
                setJkSort(key, {use: 1});
                refreshPage(true);
                
                return 'toast://' + '主页源已设置为：' + input;
            }else{
                return 'toast://源列表索引异常'
            }
        },
        menuClick(manage) {
            let menuarr = ["改变列表样式", "列表倒序排列", "选择排序方式"];
            if(lockgroups.length>0){
                menuarr.push("显示加锁分组");
            }
            hikerPop.selectCenter({
                options: menuarr,
                columns: 2,
                title: "请选择",
                click(s, i) {
                    if (i === 0) {
                        spen = spen == 3 ? 2 : 3;
                        manage.changeColumns(spen);
                        manage.scrollToPosition(index, false);
                    } else if (i === 1) {
                        manage.list.reverse();
                        manage.change();
                        manage.scrollToPosition(index, true);
                    } else if (i === 2) {
                        let sorttype = ["更新时间","接口名称","使用频率"].map(v=>v==getItem('sourceListSort','更新时间')?v+"√":v);
                        showSelectOptions({
                            "title": "选择排序方式", 
                            "options" : sorttype, 
                            "col": 1, 
                            "js": `setItem('sourceListSort', input.replace("√",""));'toast://排序方式在下次生效：' + input.replace("√","")`
                        })
                    } else if (i === 3) {
                        if (hikerPop.canBiometric() !== 0) {
                            return "toast://调用生物学验证出错";
                        }
                        let pop = hikerPop.checkByBiometric(() => {
                            putMyVar('Src_Jy_已验证指纹','1');
                            toast("验证成功，重新点切换站源吧");
                        });
                    }
                }
            });
        }
    });
    return 'hiker://empty';

}
// 按拼音排序
function sortByPinyin(arr) {
    var arrNew = arr.sort((a, b) => a.name.localeCompare(b.name));
    for (var m in arrNew) {
        var mm = /^[\u4e00-\u9fa5]/.test(arrNew[m].name) ? m : '-1';
        if (mm > -1) {
            break;
        }
    }
    for (var n = arrNew.length - 1; n >= 0; n--) {
        var nn = /^[\u4e00-\u9fa5]/.test(arrNew[n].name) ? n : '-1';
        if (nn > -1) {
            break;
        }
    }
    if (mm > -1) {
        var arrTmp = arrNew.splice(m, parseInt(n - m) + 1);
        arrNew = arrNew.concat(arrTmp);
    }
    return arrNew
}
// app类接口类型自动
function getapitype(apiurl) {
    if(apiurl){
        if(apiurl.includes('.vod')){
            return "v1";
        }else if(apiurl.includes('/app/')){
            return "app";
        }else if(apiurl.includes('app.php')){
            return "v2";
        }else if(/iptv|Chengcheng/.test(apiurl)){
            return "iptv";
        }else if(apiurl.includes('provide/vod/')){
            return "cms";
        }else{
            return "";
        }
    }else{
        return "";
    }
}
// 文字上色
function colorTitle(title, Color) {
    return '““””<font color="' + Color + '">' + title + '</font>';
}
// 选中状态标识
function getide(is) {
    if(is==1){
        return '‘‘’’<strong><font color="#f13b66a">◉ </front></strong>';
    }else{
        return '‘‘’’<strong><font color="#F54343">◉ </front></strong>';
    }
}
// 取前三历史记录
function getHistory(i){
    let h = [];
    let ruleTitle = MY_RULE._title || MY_RULE.title;
    i = i ? i*3 : 0;
    let items = JSON.parse(fetch('hiker://history')).filter(v=> v.type!="网页浏览" && JSON.parse(v.params).title==ruleTitle);
    if(i+3 > items.length){
        i = 0;
        clearMyVar('Src_Jy_homeHistory');
    }
    items.slice(i, i+3).forEach(item=>{
        try{
            let extra = JSON.parse(JSON.parse(item.params).params) || {};
            extra["cls"] = "historylist";
            h.push({
                title: item.title,
                url: item.ruleBaseUrl + '@rule=' + JSON.parse(item.params).find_rule,
                pic_url: item.picUrl,
                desc: item.lastClick?"足迹："+item.lastClick.split('@@')[0].replace('““””<small>','').replace('</small>',''):"足迹：无",
                col_type: "movie_3",
                extra: extra
            });
        }catch(e){
            log('加载观看记录异常>'+e.message + " 错误行#" + e.lineNumber);
        }
    })
    return h;
}
// 获取图标地址
function getIcon(icon, nochange) {
    if(!icon.includes('.svg')){
        return codepath + 'img/' + icon;
    }
    let color = getItem('主题颜色','');
    return codepath + 'img/' + icon + ((!color||nochange)?'':'?s='+color+'@js=' + $.toString((color) => {
        let javaImport = new JavaImporter();
        javaImport.importPackage(Packages.com.example.hikerview.utils);
        with(javaImport) {
            let bytes = FileUtil.toBytes(input);
            let str = new java.lang.String(bytes, "UTF-8") + "";
            str = str.replace(/#feb833|#6dc9ff|#2ec99d|#587bff|#ff7772|#a88efa|#FD9173/gi, color);
            bytes = new java.lang.String(str).getBytes();
            return FileUtil.toInputStream(bytes);
        }
    },color))
}
// 重定义打印日志
if (getItem('规则日志打印','0') != "1") {
    log = function () {
        return;
    };
}
// 下载必要的依赖文件
function downloadFiles() {
    let 代码仓 = getItem("依赖","").replace(/[^/]*$/,'');
    if(代码仓){
        try{
            requireDownload(代码仓 + "img/聚影.png", 'hiker://files/cache/src/聚影.png');
        }catch(e){}
    }
}
// 分源资源码
function shareResource() {
    addListener("onClose", $.toString(() => {
        clearMyVar('Juconfig');
    }));
    let d = [];
    d.push({
        title: '🌐 聚影分享',
        col_type: "rich_text"
    });
    let resources = Juconfig['shareResource'] || [];
    storage0.putMyVar('Juconfig', Juconfig);
    
    d.push({
        title: '通过文件分享资源',
        col_type: 'text_center_1',
        url: $().lazyRule(() => {
            require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyPublic.js');
            const hikerPop = $.require(config.聚影.replace(/[^/]*$/,'') + 'plugins/hikerPop.js');
            let fruit = ["接口", "解析", "云盘", "直播", "ghproxy"];
            hikerPop.multiChoice({
                title: "选择要上传分享同步的项", 
                options: fruit, 
                checkedIndexs: [0], 
                onChoice(i, isChecked) {
                    //log(i + ":" + isChecked);
                }, 
                rightTitle: "确认上传", 
                rightClick(options, checked) {
                    if(options.filter((v, i) => checked[i]).length==0){
                        return "toast://没有选择上传项";
                    }
                    hikerPop.runOnNewThread(() => {
                        let text = {};
                        options.forEach((option,i)=>{
                            if(checked[i]){
                                if(option=="ghproxy"){
                                    let ghproxy = Juconfig['ghproxy'] || [];
                                    ghproxy = ghproxy.filter(v=>!v.stop);
                                    if(ghproxy.length>0){
                                        text["ghproxy"] = ghproxy;
                                    }
                                }else{
                                    let filepath;
                                    if(option=="接口"){
                                        filepath = globalMap0.getVar('Src_Jy_gmParams').jkfile;
                                    }else if(option=="解析"){
                                        filepath = globalMap0.getVar('Src_Jy_gmParams').jxfile;
                                    }else if(option=="云盘"){
                                        filepath = globalMap0.getVar('Src_Jy_gmParams').ypfile;
                                    }else if(option=="直播"){
                                        filepath = globalMap0.getVar('Src_Jy_gmParams').rulepath + "liveconfig.json";
                                    }
                                    let datafile = fetch(filepath);
                                    let datalist = [];
                                    if(datafile){
                                        if(option=="直播"){
                                            eval("let tvconfig=" + datafile+ ";");
                                            text[option] = tvconfig;
                                        }else{
                                            try{
                                                eval("datalist=" + datafile+ ";");
                                            }catch(e){}
                                            if(datalist.length>600){
                                                toast(option+"超过600，建议先精简");
                                            }else if(datalist.length==0){
                                                toast(option+"数量为0");
                                            }
                                            if(option=="接口"){
                                                for(let i=0;i<datalist.length;i++){
                                                    let data = datalist[i];
                                                    if(data.url.startsWith(globalMap0.getVar('Src_Jy_gmParams').jkfilespath) && (($.type(data.ext)=="string" && data.ext.startsWith("file")) || !data.ext)){
                                                        try{
                                                            data.extstr = fetch(data.url) || (data.ext?fetch(data.ext.split("?")[0]):"");
                                                            if(!data.extstr){
                                                                datalist.splice(i,1);
                                                                i = i - 1;
                                                            }
                                                        }catch(e){
                                                            log(data.name + '>分享时处理extstr时异常');
                                                        }
                                                    }else if(!data.url.startsWith(globalMap0.getVar('Src_Jy_gmParams').jkfilespath) && data.url.startsWith("hiker")){
                                                        datalist.splice(i,1);
                                                        i = i - 1;
                                                    }
                                                }
                                            }
                                            if(datalist.length>0){
                                                text[option] = datalist;
                                            }  
                                        }
                                    }
                                }
                            }
                        })
                        if(Object.keys(text).length==0){
                            return "toast://无内容分享";
                        }
                        let gzip = $.require(codepath + "plugins/gzip.js");
                        let textcontent = gzip.zip(JSON.stringify(text));
                        let code = '聚影资源码￥' + aesEncode('Juying2', textcontent) + '￥文件分享';
                        let sharefile = 'hiker://files/_cache/聚影资源码_'+$.dateFormat(new Date(),"HHmmss")+'.hiker';
                        writeFile(sharefile, code+`@import=js:$.require("hiker://page/import?rule=聚影");`);
                        if(fileExist(sharefile)){
                            return 'share://'+sharefile;
                        }else{
                            return 'toast://'+input+'分享生成失败';
                        }
                    })
                }, 
                centerTitle: "取消"
            });
            return "hiker://empty";
        })
    })

    d.push({
        title: '申请云分享资源码，当前共有'+resources.length+'个',
        desc: '感谢TyrantGenesis大佬提供的云6剪贴板',
        url: resources.length>=3?"toast://分享资源码不能超过3个":$().lazyRule(() => {
                try{
                    let pastecreate = JSON.parse(request('https://pasteme.tyrantg.com/api/create', {
                        "content-type": "application/json;charset=UTF-8",
                        "body": "content=juying&auto_password=1",
                        "method": "POST"
                    }));
                    if(pastecreate.result_code=="SUCCESS"){
                        let data = pastecreate.data;
                        return $("", "申请成功，输入名称保存").input((path,token)=>{
                            input = input.trim();
                            if(input){
                                let Juconfig = storage0.getMyVar('Juconfig');
                                let resources = Juconfig['shareResource'] || [];
                                resources.push({
                                    name: input,
                                    path: path,
                                    token: token
                                })
                                Juconfig['shareResource'] = resources;
                                let cfgfile = globalMap0.getVar('Src_Jy_gmParams').cfgfile;
                                writeFile(cfgfile, JSON.stringify(Juconfig));
                                refreshPage(false);
                                return 'toast://申请成功';
                            }else{
                                return "toast://不能为空";
                            }
                        }, data.path+'@'+data.password, data.auth_code)
                    }else{
                        return 'toast://申请失败：'+pastecreate.message;
                    }
                } catch (e) {
                    log('申请失败：'+e.message); 
                    return 'toast://申请失败，请重新再试';
                }
            }),
        col_type: "text_center_1"
    });
    resources.forEach(it=>{
        d.push({
            title: it.name + "-" + it.path.split('@')[0],
            desc: "上传同步时间：" + (it.time||"") + "\n上次同步项目：" + (it.options||""),
            url: $(["复制","删除","改名","上传"], 2, "选择操作功能项").select((it)=>{
                let Juconfig = storage0.getMyVar('Juconfig');
                let cfgfile = globalMap0.getVar('Src_Jy_gmParams').cfgfile;
                let codeid = aesEncode('Juying2', it.path);
                if(input=="复制"){
                    copy('聚影资源码￥'+codeid+'￥'+it.name);
                    return "hiker://empty";
                }else if(input=="删除"){
                    return $("确定要删除云端分享："+it.name+"\n删除后无法找回").confirm((Juconfig,it,cfgfile)=>{
                        try{
                            it.path = it.path + (it.path.includes('@')?'':'@juying');
                            showLoading("执行中，请稍后");
                            let pastecreate = JSON.parse(request('https://pasteme.tyrantg.com/api/update', {
                                "content-type": "application/json;charset=UTF-8",
                                "body": "content=juying&path="+it.path+"&auth_code="+it.token,
                                "method": "POST"
                            }));
                            if(pastecreate.result_code=="SUCCESS"){
                                let resources = Juconfig['shareResource'] || [];
                                const index = resources.findIndex(item => item.path.split('@')[0] === it.path.split('@')[0]);
                                if (index !== -1) {
                                    resources.splice(index, 1);
                                }
                                Juconfig['shareResource'] = resources;
                                writeFile(cfgfile, JSON.stringify(Juconfig));
                            }else{
                                return 'toast://'+pastecreate.message;
                            }
                            hideLoading();
                            refreshPage(false);
                            return 'toast://删除成功';
                        } catch (e) {
                            log('删除失败：'+e.message); 
                            return 'toast://删除失败，请重新再试';
                        }
                    }, Juconfig, it, cfgfile)
                }else if(input=="改名"){
                    return $(it.name, "输入新名称").input((Juconfig,path,cfgfile)=>{
                        input = input.trim();
                        if(input){
                            let resources = Juconfig['shareResource'] || [];
                            const index = resources.findIndex(item => item.path === path);
                            if (index !== -1) {
                                resources[index].name = input;
                            }
                            Juconfig['shareResource'] = resources;
                            writeFile(cfgfile, JSON.stringify(Juconfig));
                            refreshPage(false);
                        }
                        return "hiker://empty";
                    }, Juconfig, it.path, cfgfile)
                }else if(input=="上传"){
                    const hikerPop = $.require(config.聚影.replace(/[^/]*$/,'') + 'plugins/hikerPop.js');
                    let fruit = ["接口", "解析", "云盘", "直播", "ghproxy"];
                    hikerPop.multiChoice({
                        title: "选择要上传分享同步的项", 
                        options: fruit, 
                        checkedIndexs: [0], 
                        onChoice(i, isChecked) {
                            //log(i + ":" + isChecked);
                        }, 
                        rightTitle: "确认上传", 
                        rightClick(options, checked) {
                            if(options.filter((v, i) => checked[i]).length==0){
                                return "toast://没有选择上传项";
                            }
                            hikerPop.runOnNewThread(() => {
                                let text = {};
                                options.forEach((option,i)=>{
                                    if(checked[i]){
                                        if(option=="ghproxy"){
                                            let ghproxy = Juconfig['ghproxy'] || [];
                                            ghproxy = ghproxy.filter(v=>!v.stop);
                                            if(ghproxy.length>0){
                                                text["ghproxy"] = ghproxy;
                                            }
                                        }else{
                                            let filepath;
                                            if(option=="接口"){
                                                filepath = globalMap0.getVar('Src_Jy_gmParams').jkfile;
                                            }else if(option=="解析"){
                                                filepath = globalMap0.getVar('Src_Jy_gmParams').jxfile;
                                            }else if(option=="云盘"){
                                                filepath = globalMap0.getVar('Src_Jy_gmParams').ypfile;
                                            }else if(option=="直播"){
                                                filepath = globalMap0.getVar('Src_Jy_gmParams').rulepath + "liveconfig.json";
                                            }
                                            let datafile = fetch(filepath);
                                            let datalist = [];
                                            if(datafile){
                                                if(option=="直播"){
                                                    eval("let tvconfig=" + datafile+ ";");
                                                    text[option] = tvconfig;
                                                }else{
                                                    try{
                                                        eval("datalist=" + datafile+ ";");
                                                    }catch(e){}
                                                    if(datalist.length>600){
                                                        toast(option+"超过600，建议先精简");
                                                    }else if(datalist.length==0){
                                                        toast(option+"数量为0");
                                                    }
                                                    if(option=="接口"){
                                                        for(let i=0;i<datalist.length;i++){
                                                            let data = datalist[i];
                                                            if(data.url.startsWith(globalMap0.getVar('Src_Jy_gmParams').jkfilespath) && (($.type(data.ext)=="string" && data.ext.startsWith("file")) || !data.ext)){
                                                                data.extstr = fetch(data.url) || fetch(data.ext.split("?")[0]);
                                                                if(!data.extstr){
                                                                    datalist.splice(i,1);
                                                                    i = i - 1;
                                                                }
                                                            }else if(!data.url.startsWith(globalMap0.getVar('Src_Jy_gmParams').jkfilespath) && data.url.startsWith("hiker")){
                                                                datalist.splice(i,1);
                                                                i = i - 1;
                                                            }
                                                        }
                                                    }
                                                    if(datalist.length>0){
                                                        text[option] = datalist;
                                                    }  
                                                }
                                            }
                                        }
                                    }
                                })
                                if(Object.keys(text).length==0){
                                    return "toast://无内容分享";
                                }
                                let gzip = $.require(codepath + "plugins/gzip.js");
                                let textcontent = gzip.zip(JSON.stringify(text));
                                try{
                                    let pasteupdate = JSON.parse(request("https://pasteme.tyrantg.com/api/update",{
                                        body: "content="+textcontent+"&path="+it.path+"&auth_code="+it.token,
                                        method: "POST"
                                    }));

                                    if(pasteupdate.result_code=="SUCCESS"){
                                        let resources = Juconfig['shareResource'] || [];
                                        const index = resources.findIndex(item => item.path === it.path);
                                        if (index !== -1) {
                                            resources[index].time = $.dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss");
                                            resources[index].options = options.filter((v, i) => checked[i]).join(",");
                                        }
                                        Juconfig['shareResource'] = resources;
                                        writeFile(cfgfile, JSON.stringify(Juconfig));
                                        refreshPage(false);
                                        return "toast://分享同步云端数据成功";
                                    }else{
                                        return 'toast://分享同步云端失败，'+pasteupdate.message;
                                    }
                                } catch (e) {
                                    log('分享上传云端失败：'+e.message + " 错误行#" + e.lineNumber); 
                                    return 'toast://分享上传云端失败，网络或内容出错';
                                }
                            })
                        }, 
                        centerTitle: "取消"
                    });
                    return "hiker://empty";
                }
            }, it),
            col_type: "text_1"
        });
    })

    setResult(d);
}
// 资源订阅管理
function subResource() {
    addListener("onClose", $.toString(() => {
        clearMyVar('Juconfig');
    }));
    let d = [];
    d.push({
        title: '⚡ 订阅管理',
        col_type: "rich_text"
    });
    let resources = Juconfig['subResource'] || [];
    storage0.putMyVar('Juconfig', Juconfig);
    
    d.push({
        title: '订阅聚影资源码，当前共有'+resources.length+'个',
        desc: '感谢TyrantGenesis大佬提供的云6剪贴板',
        url: $("", "输入聚影资源码").input(()=>{
            input = input.trim();
            if(!input || !input.includes('聚影资源码￥')){
                return "toast://输入不正确";
            }
            try{
                let path = aesDecode('Juying2', input.split('￥')[1]);
                let pasteget = JSON.parse(request('https://pasteme.tyrantg.com/api/getContent/'+path));
                if(pasteget.result_code=="SUCCESS"){
                    let data = pasteget.data;
                    if(data=="juying"){
                        return "toast://资源码为空";
                    }
                    let newname = "";
                    try{
                         newname = input.split('￥')[2];
                    }catch(e){}
                    return $(newname, "获取成功，输入名称保存").input((path)=>{
                        input = input.trim();
                        if(input){
                            let Juconfig = storage0.getMyVar('Juconfig');
                            let resources = Juconfig['subResource'] || [];
                            resources.push({
                                name: input,
                                path: path
                            })
                            Juconfig['subResource'] = resources;
                            let cfgfile = globalMap0.getVar('Src_Jy_gmParams').cfgfile;
                            writeFile(cfgfile, JSON.stringify(Juconfig));
                            refreshPage(false);
                            return 'toast://保存成功';
                        }else{
                            return "toast://不能为空";
                        }
                    }, path)
                }else{
                    return 'toast://获取失败：'+pasteget.message;
                }
            } catch (e) {
                log('获取失败：'+e.message); 
                return 'toast://获取失败，请重新再试';
            }
        }),
        col_type: "text_center_1"
    });

    resources.forEach(it=>{
        d.push({
            title: it.name + "-" + it.path.split('@')[0],
            desc: "自动：" + (it.auto?"是":"否") + "       同步时间：" + (it.time||"") + "\n模式：" + (it.mode==2?"全量":"增量") + "   导入项目："+(it.options||""),
            url: $(["复制","删除","改名","下载","自动",it.mode=="2"?"增量":"全量"], 2, "选择操作功能项").select((it)=>{
                let Juconfig = storage0.getMyVar('Juconfig');
                let cfgfile = globalMap0.getVar('Src_Jy_gmParams').cfgfile;
                let codeid = aesEncode('Juying2', it.path);
                if(input=="复制"){
                    copy('聚影资源码￥'+codeid+'￥'+it.name);
                    return "hiker://empty";
                }else if(input=="自动"){
                    let resources = Juconfig['subResource'] || [];
                    resources.forEach(its=>{
                        if(its.path!=it.path || its.auto){
                            delete its.auto;
                        }else{
                            its.auto = 1;
                        }
                    })
                    writeFile(cfgfile, JSON.stringify(Juconfig));
                    refreshPage(false);
                    return 'toast://设置成功';
                }else if(input=="增量"||input=="全量"){
                    let resources = Juconfig['subResource'] || [];
                    resources.forEach(its=>{
                        if(its.path==it.path){
                            if(input=="全量"){
                                its.mode = 2;
                            }else{
                                delete its.mode;
                            }
                        }
                    })
                    writeFile(cfgfile, JSON.stringify(Juconfig));
                    refreshPage(false);
                    return 'toast://设置成功'+(input=="全量"?"：会先删除本地所有再导入":"");
                }else if(input=="删除"){
                    return $("确定要删除资源码："+it.name+"\n删除后无法找回").confirm((Juconfig,it,cfgfile)=>{
                        try{
                            let resources = Juconfig['subResource'] || [];
                            const index = resources.findIndex(item => item.path === it.path);
                            if (index !== -1) {
                                resources.splice(index, 1);
                            }
                            Juconfig['subResource'] = resources;
                            writeFile(cfgfile, JSON.stringify(Juconfig));
                            refreshPage(false);
                            return 'toast://删除成功';
                        } catch (e) {
                            log('删除失败：'+e.message); 
                            return 'toast://删除失败，请重新再试';
                        }
                    }, Juconfig, it, cfgfile)
                }else if(input=="改名"){
                    return $(it.name, "输入新名称").input((Juconfig,path,cfgfile)=>{
                        input = input.trim();
                        if(input){
                            let resources = Juconfig['subResource'] || [];
                            const index = resources.findIndex(item => item.path === path);
                            if (index !== -1) {
                                resources[index].name = input;
                            }
                            Juconfig['subResource'] = resources;
                            writeFile(cfgfile, JSON.stringify(Juconfig));
                            refreshPage(false);
                        }
                        return "hiker://empty";
                    }, Juconfig, it.path, cfgfile)
                }else if(input=="下载"){
                    require(config.聚影.replace(/[^/]*$/,'') + 'SrcJyPublic.js');
                    return updateResource(it,1);
                }
            }, it),
            col_type: "text_1"
        });
    })
    setResult(d);
}

// 更新同步订阅资源
function updateResource(it,refresh) {
    if(!it){
        let resources = Juconfig['subResource'] || [];
        for (let i = 0; i < resources.length; i++) {
            if (resources[i].auto) {
                it = resources[i];
                break;
            }
        }
        let playSet = Juconfig['playSet'] || {};
        if(playSet['clearM3u8Ad']){
            let m3u8Ad = fc(config.聚影.replace(/[^/]*$/,'') + "plugins/m3u8_ad_rule.json", 72);
            if(m3u8Ad){
                writeFile("hiker://files/rules/m3u8_ad_rule.json", m3u8Ad);
            }
        }
    }
    if(!it){
        log("自动同步取消，没有可执行的订阅源");
        return "hiker://empty";
    }
    try{
        let pasteget = JSON.parse(request('https://pasteme.tyrantg.com/api/getContent/'+it.path,{
            "content-type": "application/json;charset=UTF-8"
        }));
        if(pasteget.result_code=="SUCCESS"){
            require(config.聚影.replace(/[^/]*$/,'') + 'SrcJySet.js');
            let gzip = $.require(codepath + "plugins/gzip.js");
            let textcontent = gzip.unzip(pasteget.data);
            let pastedata = JSON.parse(textcontent);
            let jknum = 0, jxnum = 0, ypnum = 0, tvnum = 0, sm = '';
            let options = [];
            let jkdatalist = pastedata.接口||[];
            if(jkdatalist.length>0){
                jknum = jiekousave(jkdatalist, it.mode==2?2:1);
                options.push('接口');
            }
            let jxdatalist = pastedata.解析||[];
            if(jxdatalist.length>0){
                jxnum = jiexisave(jxdatalist, it.mode==2?2:1);
                options.push('解析');
            }
            if(pastedata.直播){
                let livefilepath = globalMap0.getVar('Src_Jy_gmParams').rulepath + "liveconfig.json";
                let liveconfig = pastedata.直播;
                if(it.mode!=2){
                    let livefile = fetch(livefilepath);
                    if(livefile){
                        try{
                            let olddata = JSON.parse(livefile).data;
                            let newdata = liveconfig.data;
                            newdata.forEach(tv=>{
                                if(!olddata.some(item => tv.url==item.url)){
                                    olddata.push(tv);
                                    tvnum++;
                                }
                            })
                            liveconfig.data = olddata;
                            options.push('直播');
                            writeFile(livefilepath, JSON.stringify(liveconfig));
                        }catch(e){
                            //log("增量导入直播失败>"+e.message);
                        }
                    }
                }else if(liveconfig.data){
                    options.push('直播');
                    writeFile(livefilepath, JSON.stringify(liveconfig));
                    sm = "，直播订阅已同步"
                }
            }
            let ypdatalist = pastedata.云盘||[];
            if(ypdatalist.length>0){
                ypnum = yundisksave(ypdatalist, 1);
                options.push('云盘');
            }
            let ghproxy = pastedata.ghproxy||[];
            if(ghproxy.length>0){
                if(it.mode!=2){
                    oldproxy = Juconfig['ghproxy'] || [];
                    ghproxy.forEach(gh=>{
                        if(!oldproxy.some(item => gh.url==item.url)){
                            oldproxy.push(gh);
                        }
                    })
                    Juconfig['ghproxy'] = oldproxy;
                }else{
                    Juconfig['ghproxy'] = ghproxy;
                }
                options.push('ghproxy');
            }

            let resources = Juconfig['subResource'] || [];
            const index = resources.findIndex(item => item.path === it.path);
            if (index !== -1) {
                resources[index].time = $.dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss");
                resources[index].options = options.join(",");
            }
            Juconfig['subResource'] = resources;
            writeFile(cfgfile, JSON.stringify(Juconfig));
            log("更新同步订阅资源完成；接口："+jknum+"，解析："+jxnum+"，云盘："+ypnum+(sm||("，直播："+tvnum)));
            if(refresh){
                refreshPage(false);
            }
            return "toast://更新同步订阅资源完成";
        }else{
            return "toast://订阅资源网络错误或资源码已失效";
        }
    }catch(e){
        log('更新同步订阅资源失败：'+e.message); 
        return 'toast://更新同步订阅资源失败';
    }
}
// 扫描本地文件夹，是否有新增接口文件
function scanFolder(input,start) {
    if(!start){
        showLoading("正在扫描本地文件夹");
    }
    if(input.startsWith('/')){
        input = "file://" + input;
    }
    let oldfiles = getDatas("jk").filter(v=>(v.type=="hipy_t3"||v.type=="py") && v.url.startsWith(jkfilespath)).map(v=>v.url);
    let newfiles = readDir(input).filter(v=>(v.endsWith('.js')||v.endsWith('.py')) && !v.includes('[合]') && oldfiles.filter(o=>o.includes(v)).length==0).map(v=>input+v);
    if(!start){
        hideLoading();
    }
    
    if(newfiles.length==0){
        log("扫描本地文件夹,未发现新增的js/py文件");
        return start?"hiker://empty":"toast://没有新增的js/py文件"
    }else if(start){
        return newfiles;
    }else{
        return $('hiker://empty#noRecordHistory##noHistory#').rule((newfiles) => {
            require(config.聚影.replace(/[^/]*$/,'') + 'SrcJySet.js');
            importConfirm(newfiles);
        },newfiles)
    }
}

// 全局对象变量gmParams
let gmParams = {
    libspath: libspath,
    rulepath: rulepath,
    codepath: codepath,
    cachepath: cachepath,
    jkfilespath: jkfilespath,
    jkfile: jkfile,
    jxfile: jxfile,
    ypfile: ypfile,
    cfgfile: cfgfile,
    getIcon: getIcon,
    getContnet: getContnet
}
if(!globalMap0.getVar('Src_Jy_gmParams')){
    log("写入全局对象变量gmParams");
    globalMap0.putVar('Src_Jy_gmParams', gmParams);
    
    if(!config.聚影 && getPublicItem('聚影','')){
        initConfig({
            聚影: getPublicItem('聚影','')
        });
    }
    log("当前依赖库>" + config.聚影);
}
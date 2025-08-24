// 重定义打印日志
let xlog = log;
if (getItem('规则日志打印','1') == "0") {
    xlog = function () {
        return;
    };
}
if (getItem('接口日志打印') != "1") {
    log = function () {
        return;
    };
}
// 聚阅全局自定义存储变量方法
function juItemF(id, s){
    let juItemO = {
        'file': s?'hiker://files/rules/Src/Juyue/juItem.json':'hiker://files/data/聚阅/juItem.json',
        'items': function () {
            let items = {};
            let itemsstr = fetch(this.file);
            if (itemsstr != "") {
                eval("items=" + itemsstr + ";");
            }
            return items;
        },
        'set': function (key, str, id2) {
            if(!key || str==undefined) return;
            id = id2 || id || (storage0.getMyVar('二级源接口信息') || storage0.getMyVar('一级源接口信息')).id;
            let items = this.items();
            let item = items[id] || {};
            item[key] = str;
            items[id] = item;
            writeFile(this.file, JSON.stringify(items));
        },
        'get': function (key, str, id2) {
            if(!key) return;
            id = id2 || id || (storage0.getMyVar('二级源接口信息') || storage0.getMyVar('一级源接口信息')).id;
            let items = this.items();
            let item = items[id] || {};
            return item[key] || str || '';
        },
        'clear': function (key, id2) {
            if(!key) return;
            id = id2 || id || (storage0.getMyVar('二级源接口信息') || storage0.getMyVar('一级源接口信息')).id;
            let items = this.items();
            let item = items[id] || {};
            if(item[key]){
                delete item[key];
                items[id] = item;
                writeFile(this.file, JSON.stringify(items));
            }
        }
    }
    return juItemO;
}
let juItem = juItemF();
let juItem2 = juItemF('Juyue', 1);

// 全局公共执行代码前需要加载的
let evalPublicStr = `
    let juItem = juItemF(jkdata.id);
    if (parse['预处理1'] && !getMyVar(jkdata.id+'执行预处理1')) {
        parse['预处理1'].call(parse);
        putMyVar(jkdata.id+'执行预处理1', '1');
    }else if (parse['预处理']) {
        parse['预处理'].call(parse);
    }
`
// 静态分类调用生成方法
function createClass(d, obj) {
    if($.type(d)=="array" && $.type(obj)=="object" && obj.url){
        let class_name = (obj.class_name || "").split('&').filter(item => item != '');
        let class_url = (obj.class_url || "").split('&');
        let area_name = (obj.area_name || "").split('&').filter(item => item != '');
        let area_url = (obj.area_url || "").split('&');
        let year_name = (obj.year_name || "").split('&').filter(item => item != '');
        let year_url = (obj.year_url || "").split('&');
        let sort_name = (obj.sort_name || "").split('&').filter(item => item != '');
        let sort_url = (obj.sort_url || "").split('&');
        let isAll = (obj.url || "").includes('fyAll') ? 1 : 0;
        fyAll = getMyVar("fyAll_id", class_url.length > 0 ? class_url[0] : "");
        fyclass = isAll ? fyAll : getMyVar("fyclass_id", class_url.length > 0 ? class_url[0] : "");
        fyarea = isAll ? fyAll : getMyVar("fyarea_id", area_url.length > 0 ? area_url[0] : "");
        fyyear = isAll ? fyAll : getMyVar("fyyear_id", year_url.length > 0 ? year_url[0] : "");
        fysort = isAll ? fyAll : getMyVar("fysort_id", sort_url.length > 0 ? sort_url[0] : "");
        if (MY_PAGE == 1) {
            let Color = obj.textColor || '#2E9465';
            let backColor = obj.backgroundColor || "#20" + Color.replace('#','');
            if(class_name.length>0){
                class_url.forEach((it, i) => {
                    try {
                        d.push({
                            title: fyclass == it ? `““””<b><span style="color: ` + Color + `">` + class_name[i] + `</span></b>` : class_name[i],
                            url: $("#noLoading#").lazyRule((id_name, nowid, newid) => {
                                if (nowid != newid) {
                                    putMyVar(id_name, newid);
                                    refreshPage(false);
                                }
                                return 'hiker://empty'
                            }, isAll ? "fyAll_id" : "fyclass_id", fyclass, it),
                            col_type: 'scroll_button',
                            extra: {
                                backgroundColor: fyclass==it?backColor:""
                            }
                        })
                    } catch (e) { }
                })
                d.push({
                    col_type: "blank_block"
                })
            }
            if(area_name.length>0){
                area_url.forEach((it, i) => {
                    try {
                        d.push({
                            title: fyarea == it ? `““””<b><span style="color: ` + Color + `">` + area_name[i] + `</span></b>` : area_name[i],
                            url: $("#noLoading#").lazyRule((id_name, nowid, newid) => {
                                if (nowid != newid) {
                                    putMyVar(id_name, newid);
                                    refreshPage(false);
                                }
                                return 'hiker://empty'
                            }, isAll ? "fyAll_id" : "fyarea_id", fyarea, it),
                            col_type: 'scroll_button',
                            extra: {
                                backgroundColor: fyarea==it?backColor:""
                            }
                        })
                    } catch (e) { }
                })
                d.push({
                    col_type: "blank_block"
                })
            }
            if(year_name.length>0){
                year_url.forEach((it, i) => {
                    if (i == 0) {
                        d.push({
                            col_type: "blank_block"
                        })
                    }
                    try {
                        d.push({
                            title: fyyear == it ? `““””<b><span style="color: ` + Color + `">` + year_name[i] + `</span></b>` : year_name[i],
                            url: $("#noLoading#").lazyRule((id_name, nowid, newid) => {
                                if (nowid != newid) {
                                    putMyVar(id_name, newid);
                                    refreshPage(false);
                                }
                                return 'hiker://empty'
                            }, isAll ? "fyAll_id" : "fyyear_id", fyyear, it),
                            col_type: 'scroll_button',
                            extra: {
                                backgroundColor: fyyear==it?backColor:""
                            }
                        })
                    } catch (e) { }
                })
                d.push({
                    col_type: "blank_block"
                })
            }
            if(sort_name.length>0){
                sort_url.forEach((it, i) => {
                    try {
                        d.push({
                            title: fysort == it ? `““””<b><span style="color: ` + Color + `">` + sort_name[i] + `</span></b>` : sort_name[i],
                            url: $("#noLoading#").lazyRule((id_name, nowid, newid) => {
                                if (nowid != newid) {
                                    putMyVar(id_name, newid);
                                    refreshPage(false);
                                }
                                return 'hiker://empty'
                            }, isAll ? "fyAll_id" : "fysort_id", fysort, it),
                            col_type: 'scroll_button',
                            extra: {
                                backgroundColor: fysort==it?backColor:""
                            }
                        })
                    } catch (e) { }
                })
                d.push({
                    col_type: "blank_block"
                })
            }
        }
        MY_URL = obj.url.replace(/fyAll/g, fyAll).replace(/fyclass/g, fyclass).replace(/fyarea/g, fyarea).replace(/fyyear/g, fyyear).replace(/fysort/g, fysort);

        function generatePageUrl(url, page) {
            // 1. 处理首页特殊规则（[firstPage=xxx]）
            const firstPageMatch = url.match(/\[firstPage=(.*?)\]/);
            if (page === 1 && firstPageMatch) {
                return firstPageMatch[1]; // 直接返回首页URL
            }

            // 2. 移除首页标记，处理其他页码
            let resultUrl = url.replace(/\[firstPage=.*?\]/, '');

            // 3. 提取fypage的运算参数并计算
            if (resultUrl.includes("fypage@")) {
                // 分割字符串获取运算部分
                let strings = resultUrl.split("fypage@");
                let pages = strings[1].split("@");

                // 遍历执行运算
                for (let i = 0; i < pages.length - 1; i++) {
                    let current = pages[i];
                    let num = parseInt(current.slice(1)); // 获取操作数
                    if (current.startsWith("-")) {
                        page = page - num;
                    } else if (current.startsWith("+")) {
                        page = page + num;
                    } else if (current.startsWith("*")) {
                        page = page * num;
                    } else if (current.startsWith("/")) {
                        page = page / num;
                    }
                }

                // 拼接最终URL（前缀 + 计算后的值 + 后缀）
                resultUrl = strings[0] + page.toString() + pages[pages.length - 1];
            } else {
                // 直接替换fypage为page值
                resultUrl = resultUrl.replace(/fypage/g, page.toString());
            }

            return resultUrl;
        }

        MY_URL = generatePageUrl(MY_URL, MY_PAGE);
    }
}
// 获到一级数据(数据类型，接口数据，页面头元素)
function getYiData(datatype, jkdata, dd) {
    let istest = datatype=='testSource'?1:0;
    datatype = istest?'主页':datatype;

    addListener('onRefresh', $.toString((datatype) => {
        clearMyVar(datatype+'动态加载loading');
    },datatype));
    addListener('onClose', $.toString((datatype) => {
        try{
            clearMyVar(datatype+'动态加载loading');
        }catch(e){}
    },datatype));

    let yijkdata = storage0.getMyVar('一级源接口信息');
    jkdata = jkdata || MY_PARAMS.data || yijkdata;
    let parse = getObjCode(jkdata, 'yi');
    parse["频道"] = parse["频道"] || {};

    if(!yijkdata || (yijkdata && parse['二级标识'] && !yijkdata['二级标识'])){
        if(parse['二级标识']){
            jkdata['erjisign'] = parse['二级标识'];
        }
        storage0.putMyVar('一级源接口信息', jkdata);
    }
    
    let page = MY_PAGE || 1;
    let sourcemenu = [];
    let d = dd || [];

    try {
        let 页码 = parse["页码"] || {};
        if(!页码[datatype] && page>1){
            setResult([]);
        }
        let ide = parse["频道"].页面标识 || "";
        
        if(datatype==="主页"){
            if(!getMyVar(jkdata.id)){
                toast(jkdata.name + (parse["作者"] ? "，作者：" + parse["作者"] : ""));
                putMyVar(jkdata.id, "1");
            }
            let 转换 = parse["转换"] || {};
            let z1 = 转换["排行"] || "排行";
            let z2 = 转换["分类"] || "分类";
            let z3 = 转换["更新"] || "更新";
            let channel = [];

            (parse["频道"].包含项 || [z1,z2,z3]).forEach(it=>{
                let itname,iticon,itcol,itide;
                if($.type(it)=="object"){
                    itname = it.名称;
                    iticon = it.图标;
                    itcol = it.样式;
                    itide = it.标识;
                }else{
                    itname = it;
                }
                if(itname && itname!="主页" && parse[itname]){
                    channel.push({name: itname, icon: iticon, col: itcol, ide: itide});
                }
            })
            let col_type = channel.length>5?"scroll_button":channel.length==5?"text_5":channel.length==4?"text_4":channel.length==3?"text_3":"text_2";
            col_type = parse["频道"].样式 || col_type;
            let imgs = parse["频道"].对应图标;
            
            channel.forEach((it, i)=>{
                sourcemenu.push({
                    title: it.name,
                    url: rulePage(it.name, 页码[it.name], it.ide||ide),
                    pic_url: it.icon || (imgs?imgs[i]:""),
                    col_type: it.col || col_type,
                    extra: {
                        cls: "sourcemenu",
                        data: jkdata
                    }
                })
            })
            
            if(sourcemenu.length>1){
                storage0.putMyVar("sourcemenu", sourcemenu);
            }
        }else if(page==1){
            if(ide.includes('#immersiveTheme#') || ide.includes('#gameTheme#')){//频道页面，有传页面标识的统一处理
                /*
                d.push({
                    col_type: 'pic_1_full',
                    img: parse["频道"].沉浸图片 || "http://123.56.105.145/weisyr/img/TopImg0.png",
                    url: 'hiker://empty',
                });
                */
                if(getItem('不显示沉浸图')=='1'){
                    for(let i=0;i<2;i++){
                        d.push({
                            title: "",
                            url: "hiker://empty",
                            col_type: "text_1",
                            extra: {
                                lineVisible: false
                            }
                        })
                    }
                }else{
                    //顺佬H5沉浸顶图样式
                    require('http://123.56.105.145/weisyr/Top_H5.js');
                    d.push(Top_H5(parse["频道"].沉浸图片||"", parse["频道"].高度||"130"));
                }
            }
        }

        if (page == 1 && typeof (setPreResult) != "undefined" && getMyVar(datatype+'动态加载loading') != '1') {// && !(parse[datatype]||"").toString().includes('dtfl?rule=')
            let num = 1;
            if(datatype!='主页'){
                num = 4;
            }
            for(let i=0;i<num;i++){
                d.push({
                    title: "",
                    url: "hiker://empty",
                    col_type: "text_1",
                    extra: {
                        lineVisible: false,
                        cls: "loading_gif"
                    }
                })
            }
            d.push({
                pic_url: config.聚阅.replace(/[^/]*$/,'') + "img/Loading.gif",
                col_type: "pic_1_center",
                url: "hiker://empty",
                extra: {
                    cls: "loading_gif"
                }
            })
            setPreResult(d);
            d = [];
            putMyVar(datatype+'动态加载loading', '1');
        }

        if(parse['host']){
            MY_URL = parse['host'];
        }
        if(parse[datatype]){
            let 执行str = (parse[datatype]||"").toString();
            let obj = parse['静态分类'] || {};
            if (obj.url && obj.type == datatype && !obj.noauto) {//海阔定义分类方法获取分类数据
                createClass(d, obj);
            }

            执行str = 执行str.replace('getResCode()', 'request(MY_URL)');

            //局部劫持全局方法
            //const setResult2 = setResult;
            try {
                let sourcename = jkdata.name;
                let getData = [];
                eval(evalPublicStr);
                let resultd;
                let setResult = function(d) { resultd = d; };
                /*
                setResult = function(ddd) {
                    setResult2(d.concat(ddd));
                }
                */
                eval("let 数据 = " + 执行str);
                getData = 数据.call(parse) || [];
                if(resultd&&getData.length==0){
                    getData = resultd;
                }

                if (getData.length == 0 && page == 1) {
                    d.push({
                        title: "未获取到数据",
                        url: "hiker://empty",
                        col_type: "text_center_1",
                    })
                } else if (getData.length > 0) {
                    jkdata['erjisign'] = parse['二级标识'];
                    getData.forEach(item => {
                        item = toerji(item, jkdata);
                    })
                    if(istest){
                        return {
                            error: 0,
                            vodlists: getData
                        };//测试，返回成功
                    }
                }
                d = d.concat(getData);
            } catch (e) {
                d.push({
                    title: jkdata.name + '>' + datatype + '>加载异常',
                    desc: e.message + ' 错误行#' + e.lineNumber,
                    url: 'hiker://empty',
                    col_type: 'text_center_1'
                });
                xlog(jkdata.name + '>加载' + datatype + '异常' + e.message + ' 错误行#' + e.lineNumber);
            }
            //setResult = setResult2;
        }else{
            d.push({
                title: jkdata.name + '>' + datatype + '>代码不存在',
                url: 'hiker://empty',
                col_type: 'text_center_1'
            });
        }
        deleteItemByCls("loading_gif");
    } catch (e) {
        toast(datatype + "执行获取代码报错，请查看日志");
        xlog("报错信息>" + e.message + " 错误行#" + e.lineNumber);
    }
    if(istest){
        return {error: 1};//测试，返回失败
    }
    setResult(d);
    if(datatype=="主页"){
        if(!parse['搜索'] || (parse['主页']||'').toString().includes('getVar("keyword", "")')){
            deleteItem('homesousuoid');
        }
        if(sourcemenu.length==0){
            updateItem("sourcemenu", {
                title: "历史",
                url: "hiker://history?rule="+MY_RULE.title
            })
        }else if(sourcemenu.length==1){
            updateItem("sourcemenu", {
                title: sourcemenu[0].title,
                url: sourcemenu[0].url
            })
        }else if(parse["频道"].显示为){
            updateItem("sourcemenu", {
                title: parse["频道"].显示为
            })
        }
    }else{
        if (typeof (setPageParams) != "undefined") {
            if (!MY_PARAMS.data) {
                MY_PARAMS.data = jkdata;
                setPageParams(MY_PARAMS);
            }
        }
    }
}
//ocr数字验证码识别
function ocr(codeurl,headers) {
    headers= headers || {};
    let img = convertBase64Image(codeurl,headers).replace('data:image/jpeg;base64,','');
    let code = request('https://api-cf.nn.ci/ocr/b64/text', { body: img, method: 'POST', headers: {"Content-Type":"text/html"}});
    code = code.replace(/o/g, '0').replace(/u/g, '0').replace(/I/g, '1').replace(/l/g, '1').replace(/g/g, '9');
    if(code.includes("+")&&code.includes("=")){
        code = eval(code.split("=")[0]);
    }
    xlog('识别验证码：'+code);
    return code;
}
//获取搜索数据
function getSsData(name, jkdata, page) {
    page = page || 1;
    let error = "";
    let getData = [];
    if (typeof MY_PAGE == "undefined") {
        var MY_PAGE = page;
    }
    try {
        let parse = getObjCode(jkdata, 'ss');
        if(parse['搜索']){
            eval(evalPublicStr);
            let resultd;
            let setResult = function(d) { resultd = d; };
            eval("let 数据 = " + parse['搜索'].toString());
            getData = 数据.call(parse, name, page) || [];
            if(resultd&&getData.length==0){
                getData = resultd;
            }
        }
    } catch (e) {
        error = e.message;
        xlog(jkdata.name + '>执行搜索获取数据报错，信息>' + e.message + " 错误行#" + e.lineNumber);
    }
    return {
        vodlists: getData,
        error: error
    };
}

//打开指定类型的新页面
function rulePage(datatype, ispage, ide) {
    /*
    return $("hiker://empty" + (ispage ? "##fypage" : "") + "#noRecordHistory##noHistory#" + ide).rule((datatype) => {
        getYiData(datatype);
    }, datatype)
    */
    return `hiker://page/rulePage#noRecordHistory##noHistory#` + (ide||"") + `?type=` + datatype + (ispage ? "&page=fypage" : "");
}
// 移除数组元素
function removeByValue(arr, val) {
    for(var i = 0; i < arr.length; i++) {
        if(arr[i] == val) {
        arr.splice(i, 1);
        break;
        }
    }
}
// 获取接口对象规则内容
function getObjCode(jkdata, key) {
    try{
        let jkstr = fetch(jkdata.url)||fetch(jkdata.url.replace('rules/Src','_cache'))||"let parse = {}";
        //jkstr = jkstr.replace(/getMyVar\(/g, 'getMyVar('+jkdata.id+'+').replace(/putMyVar\(/g, 'putMyVar('+jkdata.id+'+');
        eval(jkstr);
        parse['id'] = jkdata.id;
        parse['sourcename'] = jkdata.name;
        parse['页码'] = parse['页码'] || {};
        if(key){
            try{
                let pdarr = parse['频道'] || [];
                let delarr = [];
                switch (key) {
                    case 'yi':
                        delarr = ['二级','最新'];
                        break;
                    case 'er':
                        delarr = ['主页','分类','排序','更新','搜索','解析'];
                        delarr = delarr.concat(pdarr);
                        break;
                    case 'ss':
                        delarr = ['主页','分类','排序','更新','二级','最新'];
                        delarr = delarr.concat(pdarr);
                        break;
                    case 'jx':
                        delarr = ['主页','分类','排序','更新','二级','搜索','最新'];
                        delarr = delarr.concat(pdarr);
                        break;
                    case 'zx':
                        delarr = ['主页','分类','排序','更新','搜索','解析'];
                        delarr = delarr.concat(pdarr);
                        break;
                    default:
                    // 当没有匹配的case时执行
                }
                delarr.forEach(it=>{
                    delete parse[it];
                })
            }catch(e){}
        }
        return parse;
    }catch(e){
        toast(jkdata.name + ">代码文件加载异常");
        xlog(jkdata.name + ">代码文件加载异常>" + e.message + " 错误行#" + e.lineNumber);
        return {};
    }
}
// 修正按钮元素
function toerji(item, jkdata) {
    try{
        if(item.url && item.url!='hiker://empty'){
            jkdata = jkdata || storage0.getMyVar('一级源接口信息');
            if(!jkdata.url){
                jkdata = storage0.getMyVar('一级源接口信息');
            }
            let extra = item.extra || {};
            let extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp','.webp', '.svg', '.tiff', '.ico', '.m3u8', '.mp4'];
            let excludeurl = ['.m3u8?', '.mp4?']
            if(!extra.noDetail && !/select:|@|toast:|hiker:|video:|pics:/.test(item.url) && item.col_type!="x5_webview_single" && !extensions.some(ext => item.url.toString().toLowerCase().endsWith(ext)) && !excludeurl.some(ext => item.url.toString().includes(ext))){
                extra.name = extra.name || extra.pageTitle || (item.title?item.title.replace(/‘|’|“|”|<[^>]+>/g,""):"");
                extra.img = extra.img || item.pic_url || item.img;
                extra.pageTitle = extra.pageTitle || extra.name;
                extra.url = item.url.toString().replace(/#immersiveTheme#|#autoCache#|#noRecordHistory#|#noHistory#|#noLoading#|#/g,"");
                extra.data = jkdata;
                item.url = $("hiker://empty?type="+jkdata.type+"&page=fypage#autoCache#" + (jkdata.erjisign||"#immersiveTheme#")).rule(() => {
                    require(config.聚阅);
                    erji();
                })
                item.extra = extra;
            }
            
            if(/video:|pics:|\.m3u8|\.mp4|@rule=|@lazyRule=/.test(item.url) && !/text_icon|rich_text|avatar|_button|icon_/.test(item.col_type)){
                let caseExtra = Object.assign({}, extra);
                delete caseExtra.longClick;
                caseExtra.data = caseExtra.data || {
                    name: jkdata.name,
                    type: jkdata.type
                }
                let caseData = {
                    type: item.url.includes('@rule=')?'二级列表':'一级列表',
                    title: extra.pageTitle || item.title,
                    picUrl: extra.img || item.img || item.pic_url,
                    params: {
                        url: item.url,
                        find_rule: '',
                        params: caseExtra
                    }
                }

                let longClick = extra.longClick || [];
                longClick = longClick.filter(v=>v.title!="加入收藏书架🗄")
                longClick.push({
                    title: "加入收藏书架🗄",
                    js: $.toString((caseData) => {
                        return addBookCase(caseData);
                    }, caseData)
                })
                extra.longClick = longClick;
                item.extra = extra;
            }
        }
    }catch(e){
        xlog("toerji失败>" + e.message + " 错误行#" + e.lineNumber)
    }
    return item;
}
//简繁互转,x可不传，默认转成简体，传2则是转成繁体
function jianfan(str,x) {
    function charPYStr(){
        return '锕皑蔼碍爱嗳嫒瑷暧霭谙铵鹌肮袄奥媪骜鳌坝罢钯摆败呗颁办绊钣帮绑镑谤剥饱宝报鲍鸨龅辈贝钡狈备惫鹎贲锛绷笔毕毙币闭荜哔滗铋筚跸边编贬变辩辫苄缏笾标骠飑飙镖镳鳔鳖别瘪濒滨宾摈傧缤槟殡膑镔髌鬓饼禀拨钵铂驳饽钹鹁补钸财参蚕残惭惨灿骖黪苍舱仓沧厕侧册测恻层诧锸侪钗搀掺蝉馋谗缠铲产阐颤冁谄谶蒇忏婵骣觇禅镡场尝长偿肠厂畅伥苌怅阊鲳钞车彻砗尘陈衬伧谌榇碜龀撑称惩诚骋枨柽铖铛痴迟驰耻齿炽饬鸱冲冲虫宠铳畴踌筹绸俦帱雠橱厨锄雏础储触处刍绌蹰传钏疮闯创怆锤缍纯鹑绰辍龊辞词赐鹚聪葱囱从丛苁骢枞凑辏蹿窜撺错锉鹾达哒鞑带贷骀绐担单郸掸胆惮诞弹殚赕瘅箪当挡党荡档谠砀裆捣岛祷导盗焘灯邓镫敌涤递缔籴诋谛绨觌镝颠点垫电巅钿癫钓调铫鲷谍叠鲽钉顶锭订铤丢铥东动栋冻岽鸫窦犊独读赌镀渎椟牍笃黩锻断缎簖兑队对怼镦吨顿钝炖趸夺堕铎鹅额讹恶饿谔垩阏轭锇锷鹗颚颛鳄诶儿尔饵贰迩铒鸸鲕发罚阀珐矾钒烦贩饭访纺钫鲂飞诽废费绯镄鲱纷坟奋愤粪偾丰枫锋风疯冯缝讽凤沣肤辐抚辅赋复负讣妇缚凫驸绂绋赙麸鲋鳆钆该钙盖赅杆赶秆赣尴擀绀冈刚钢纲岗戆镐睾诰缟锆搁鸽阁铬个纥镉颍给亘赓绠鲠龚宫巩贡钩沟苟构购够诟缑觏蛊顾诂毂钴锢鸪鹄鹘剐挂鸹掴关观馆惯贯诖掼鹳鳏广犷规归龟闺轨诡贵刽匦刿妫桧鲑鳜辊滚衮绲鲧锅国过埚呙帼椁蝈铪骇韩汉阚绗颉号灏颢阂鹤贺诃阖蛎横轰鸿红黉讧荭闳鲎壶护沪户浒鹕哗华画划话骅桦铧怀坏欢环还缓换唤痪焕涣奂缳锾鲩黄谎鳇挥辉毁贿秽会烩汇讳诲绘诙荟哕浍缋珲晖荤浑诨馄阍获货祸钬镬击机积饥迹讥鸡绩缉极辑级挤几蓟剂济计记际继纪讦诘荠叽哜骥玑觊齑矶羁虿跻霁鲚鲫夹荚颊贾钾价驾郏浃铗镓蛲歼监坚笺间艰缄茧检碱硷拣捡简俭减荐槛鉴践贱见键舰剑饯渐溅涧谏缣戋戬睑鹣笕鲣鞯将浆蒋桨奖讲酱绛缰胶浇骄娇搅铰矫侥脚饺缴绞轿较挢峤鹪鲛阶节洁结诫届疖颌鲒紧锦仅谨进晋烬尽劲荆茎卺荩馑缙赆觐鲸惊经颈静镜径痉竞净刭泾迳弪胫靓纠厩旧阄鸠鹫驹举据锯惧剧讵屦榉飓钜锔窭龃鹃绢锩镌隽觉决绝谲珏钧军骏皲开凯剀垲忾恺铠锴龛闶钪铐颗壳课骒缂轲钶锞颔垦恳龈铿抠库裤喾块侩郐哙脍宽狯髋矿旷况诓诳邝圹纩贶亏岿窥馈溃匮蒉愦聩篑阃锟鲲扩阔蛴蜡腊莱来赖崃徕涞濑赉睐铼癞籁蓝栏拦篮阑兰澜谰揽览懒缆烂滥岚榄斓镧褴琅阆锒捞劳涝唠崂铑铹痨乐鳓镭垒类泪诔缧篱狸离鲤礼丽厉励砾历沥隶俪郦坜苈莅蓠呖逦骊缡枥栎轹砺锂鹂疠粝跞雳鲡鳢俩联莲连镰怜涟帘敛脸链恋炼练蔹奁潋琏殓裢裣鲢粮凉两辆谅魉疗辽镣缭钌鹩猎临邻鳞凛赁蔺廪檩辚躏龄铃灵岭领绫棂蛏鲮馏刘浏骝绺镏鹨龙聋咙笼垄拢陇茏泷珑栊胧砻楼娄搂篓偻蒌喽嵝镂瘘耧蝼髅芦卢颅庐炉掳卤虏鲁赂禄录陆垆撸噜闾泸渌栌橹轳辂辘氇胪鸬鹭舻鲈峦挛孪滦乱脔娈栾鸾銮抡轮伦仑沦纶论囵萝罗逻锣箩骡骆络荦猡泺椤脶镙驴吕铝侣屡缕虑滤绿榈褛锊呒妈玛码蚂马骂吗唛嬷杩买麦卖迈脉劢瞒馒蛮满谩缦镘颡鳗猫锚铆贸麽没镁门闷们扪焖懑钔锰梦眯谜弥觅幂芈谧猕祢绵缅渑腼黾庙缈缪灭悯闽闵缗鸣铭谬谟蓦馍殁镆谋亩钼呐钠纳难挠脑恼闹铙讷馁内拟腻铌鲵撵辇鲶酿鸟茑袅聂啮镊镍陧蘖嗫颟蹑柠狞宁拧泞苎咛聍钮纽脓浓农侬哝驽钕诺傩疟欧鸥殴呕沤讴怄瓯盘蹒庞抛疱赔辔喷鹏纰罴铍骗谝骈飘缥频贫嫔苹凭评泼颇钋扑铺朴谱镤镨栖脐齐骑岂启气弃讫蕲骐绮桤碛颀颃鳍牵钎铅迁签谦钱钳潜浅谴堑佥荨悭骞缱椠钤枪呛墙蔷强抢嫱樯戗炝锖锵镪羟跄锹桥乔侨翘窍诮谯荞缲硗跷窃惬锲箧钦亲寝锓轻氢倾顷请庆揿鲭琼穷茕蛱巯赇虮鳅趋区躯驱龋诎岖阒觑鸲颧权劝诠绻辁铨却鹊确阕阙悫让饶扰绕荛娆桡热韧认纫饪轫荣绒嵘蝾缛铷颦软锐蚬闰润洒萨飒鳃赛伞毵糁丧骚扫缫涩啬铯穑杀刹纱铩鲨筛晒酾删闪陕赡缮讪姗骟钐鳝墒伤赏垧殇觞烧绍赊摄慑设厍滠畲绅审婶肾渗诜谂渖声绳胜师狮湿诗时蚀实识驶势适释饰视试谥埘莳弑轼贳铈鲥寿兽绶枢输书赎属术树竖数摅纾帅闩双谁税顺说硕烁铄丝饲厮驷缌锶鸶耸怂颂讼诵擞薮馊飕锼苏诉肃谡稣虽随绥岁谇孙损笋荪狲缩琐锁唢睃獭挞闼铊鳎台态钛鲐摊贪瘫滩坛谭谈叹昙钽锬顸汤烫傥饧铴镗涛绦讨韬铽腾誊锑题体屉缇鹈阗条粜龆鲦贴铁厅听烃铜统恸头钭秃图钍团抟颓蜕饨脱鸵驮驼椭箨鼍袜娲腽弯湾顽万纨绾网辋韦违围为潍维苇伟伪纬谓卫诿帏闱沩涠玮韪炜鲔温闻纹稳问阌瓮挝蜗涡窝卧莴龌呜钨乌诬无芜吴坞雾务误邬庑怃妩骛鹉鹜锡牺袭习铣戏细饩阋玺觋虾辖峡侠狭厦吓硖鲜纤贤衔闲显险现献县馅羡宪线苋莶藓岘猃娴鹇痫蚝籼跹厢镶乡详响项芗饷骧缃飨萧嚣销晓啸哓潇骁绡枭箫协挟携胁谐写泻谢亵撷绁缬锌衅兴陉荥凶汹锈绣馐鸺虚嘘须许叙绪续诩顼轩悬选癣绚谖铉镟学谑泶鳕勋询寻驯训讯逊埙浔鲟压鸦鸭哑亚讶垭娅桠氩阉烟盐严岩颜阎艳厌砚彦谚验厣赝俨兖谳恹闫酽魇餍鼹鸯杨扬疡阳痒养样炀瑶摇尧遥窑谣药轺鹞鳐爷页业叶靥谒邺晔烨医铱颐遗仪蚁艺亿忆义诣议谊译异绎诒呓峄饴怿驿缢轶贻钇镒镱瘗舣荫阴银饮隐铟瘾樱婴鹰应缨莹萤营荧蝇赢颖茔莺萦蓥撄嘤滢潆璎鹦瘿颏罂哟拥佣痈踊咏镛优忧邮铀犹诱莸铕鱿舆鱼渔娱与屿语狱誉预驭伛俣谀谕蓣嵛饫阈妪纡觎欤钰鹆鹬龉鸳渊辕园员圆缘远橼鸢鼋约跃钥粤悦阅钺郧匀陨运蕴酝晕韵郓芸恽愠纭韫殒氲杂灾载攒暂赞瓒趱錾赃脏驵凿枣责择则泽赜啧帻箦贼谮赠综缯轧铡闸栅诈斋债毡盏斩辗崭栈战绽谵张涨帐账胀赵诏钊蛰辙锗这谪辄鹧贞针侦诊镇阵浈缜桢轸赈祯鸩挣睁狰争帧症郑证诤峥钲铮筝织职执纸挚掷帜质滞骘栉栀轵轾贽鸷蛳絷踬踯觯钟终种肿众锺诌轴皱昼骤纣绉猪诸诛烛瞩嘱贮铸驻伫槠铢专砖转赚啭馔颞桩庄装妆壮状锥赘坠缀骓缒谆准着浊诼镯兹资渍谘缁辎赀眦锱龇鲻踪总纵偬邹诹驺鲰诅组镞钻缵躜鳟翱并卜沉丑淀迭斗范干皋硅柜后伙秸杰诀夸里凌么霉捻凄扦圣尸抬涂洼喂污锨咸蝎彝涌游吁御愿岳云灶扎札筑于志注凋讠谫郄勐凼坂垅垴埯埝苘荬荮莜莼菰藁揸吒吣咔咝咴噘噼嚯幞岙嵴彷徼犸狍馀馇馓馕愣憷懔丬溆滟溷漤潴澹甯纟绔绱珉枧桊桉槔橥轱轷赍肷胨飚煳煅熘愍淼砜磙眍钚钷铘铞锃锍锎锏锘锝锪锫锿镅镎镢镥镩镲稆鹋鹛鹱疬疴痖癯裥襁耢颥螨麴鲅鲆鲇鲞鲴鲺鲼鳊鳋鳘鳙鞒鞴齄';
    }
    function ftPYStr(){
        return '錒皚藹礙愛噯嬡璦曖靄諳銨鵪骯襖奧媼驁鰲壩罷鈀擺敗唄頒辦絆鈑幫綁鎊謗剝飽寶報鮑鴇齙輩貝鋇狽備憊鵯賁錛繃筆畢斃幣閉蓽嗶潷鉍篳蹕邊編貶變辯辮芐緶籩標驃颮飆鏢鑣鰾鱉別癟瀕濱賓擯儐繽檳殯臏鑌髕鬢餅稟撥缽鉑駁餑鈸鵓補鈽財參蠶殘慚慘燦驂黲蒼艙倉滄廁側冊測惻層詫鍤儕釵攙摻蟬饞讒纏鏟產闡顫囅諂讖蕆懺嬋驏覘禪鐔場嘗長償腸廠暢倀萇悵閶鯧鈔車徹硨塵陳襯傖諶櫬磣齔撐稱懲誠騁棖檉鋮鐺癡遲馳恥齒熾飭鴟沖衝蟲寵銃疇躊籌綢儔幬讎櫥廚鋤雛礎儲觸處芻絀躕傳釧瘡闖創愴錘綞純鶉綽輟齪辭詞賜鶿聰蔥囪從叢蓯驄樅湊輳躥竄攛錯銼鹺達噠韃帶貸駘紿擔單鄲撣膽憚誕彈殫賧癉簞當擋黨蕩檔讜碭襠搗島禱導盜燾燈鄧鐙敵滌遞締糴詆諦綈覿鏑顛點墊電巔鈿癲釣調銚鯛諜疊鰈釘頂錠訂鋌丟銩東動棟凍崠鶇竇犢獨讀賭鍍瀆櫝牘篤黷鍛斷緞籪兌隊對懟鐓噸頓鈍燉躉奪墮鐸鵝額訛惡餓諤堊閼軛鋨鍔鶚顎顓鱷誒兒爾餌貳邇鉺鴯鮞發罰閥琺礬釩煩販飯訪紡鈁魴飛誹廢費緋鐨鯡紛墳奮憤糞僨豐楓鋒風瘋馮縫諷鳳灃膚輻撫輔賦復負訃婦縛鳧駙紱紼賻麩鮒鰒釓該鈣蓋賅桿趕稈贛尷搟紺岡剛鋼綱崗戇鎬睪誥縞鋯擱鴿閣鉻個紇鎘潁給亙賡綆鯁龔宮鞏貢鉤溝茍構購夠詬緱覯蠱顧詁轂鈷錮鴣鵠鶻剮掛鴰摑關觀館慣貫詿摜鸛鰥廣獷規歸龜閨軌詭貴劊匭劌媯檜鮭鱖輥滾袞緄鯀鍋國過堝咼幗槨蟈鉿駭韓漢闞絎頡號灝顥閡鶴賀訶闔蠣橫轟鴻紅黌訌葒閎鱟壺護滬戶滸鶘嘩華畫劃話驊樺鏵懷壞歡環還緩換喚瘓煥渙奐繯鍰鯇黃謊鰉揮輝毀賄穢會燴匯諱誨繪詼薈噦澮繢琿暉葷渾諢餛閽獲貨禍鈥鑊擊機積饑跡譏雞績緝極輯級擠幾薊劑濟計記際繼紀訐詰薺嘰嚌驥璣覬齏磯羈蠆躋霽鱭鯽夾莢頰賈鉀價駕郟浹鋏鎵蟯殲監堅箋間艱緘繭檢堿鹼揀撿簡儉減薦檻鑒踐賤見鍵艦劍餞漸濺澗諫縑戔戩瞼鶼筧鰹韉將漿蔣槳獎講醬絳韁膠澆驕嬌攪鉸矯僥腳餃繳絞轎較撟嶠鷦鮫階節潔結誡屆癤頜鮚緊錦僅謹進晉燼盡勁荊莖巹藎饉縉贐覲鯨驚經頸靜鏡徑痙競凈剄涇逕弳脛靚糾廄舊鬮鳩鷲駒舉據鋸懼劇詎屨櫸颶鉅鋦窶齟鵑絹錈鐫雋覺決絕譎玨鈞軍駿皸開凱剴塏愾愷鎧鍇龕閌鈧銬顆殼課騍緙軻鈳錁頷墾懇齦鏗摳庫褲嚳塊儈鄶噲膾寬獪髖礦曠況誆誑鄺壙纊貺虧巋窺饋潰匱蕢憒聵簣閫錕鯤擴闊蠐蠟臘萊來賴崍徠淶瀨賚睞錸癩籟藍欄攔籃闌蘭瀾讕攬覽懶纜爛濫嵐欖斕鑭襤瑯閬鋃撈勞澇嘮嶗銠鐒癆樂鰳鐳壘類淚誄縲籬貍離鯉禮麗厲勵礫歷瀝隸儷酈壢藶蒞蘺嚦邐驪縭櫪櫟轢礪鋰鸝癘糲躒靂鱺鱧倆聯蓮連鐮憐漣簾斂臉鏈戀煉練蘞奩瀲璉殮褳襝鰱糧涼兩輛諒魎療遼鐐繚釕鷯獵臨鄰鱗凜賃藺廩檁轔躪齡鈴靈嶺領綾欞蟶鯪餾劉瀏騮綹鎦鷚龍聾嚨籠壟攏隴蘢瀧瓏櫳朧礱樓婁摟簍僂蔞嘍嶁鏤瘺耬螻髏蘆盧顱廬爐擄鹵虜魯賂祿錄陸壚擼嚕閭瀘淥櫨櫓轤輅轆氌臚鸕鷺艫鱸巒攣孿灤亂臠孌欒鸞鑾掄輪倫侖淪綸論圇蘿羅邏鑼籮騾駱絡犖玀濼欏腡鏍驢呂鋁侶屢縷慮濾綠櫚褸鋝嘸媽瑪碼螞馬罵嗎嘜嬤榪買麥賣邁脈勱瞞饅蠻滿謾縵鏝顙鰻貓錨鉚貿麼沒鎂門悶們捫燜懣鍆錳夢瞇謎彌覓冪羋謐獼禰綿緬澠靦黽廟緲繆滅憫閩閔緡鳴銘謬謨驀饃歿鏌謀畝鉬吶鈉納難撓腦惱鬧鐃訥餒內擬膩鈮鯢攆輦鯰釀鳥蔦裊聶嚙鑷鎳隉蘗囁顢躡檸獰寧擰濘苧嚀聹鈕紐膿濃農儂噥駑釹諾儺瘧歐鷗毆嘔漚謳慪甌盤蹣龐拋皰賠轡噴鵬紕羆鈹騙諞駢飄縹頻貧嬪蘋憑評潑頗釙撲鋪樸譜鏷鐠棲臍齊騎豈啟氣棄訖蘄騏綺榿磧頎頏鰭牽釬鉛遷簽謙錢鉗潛淺譴塹僉蕁慳騫繾槧鈐槍嗆墻薔強搶嬙檣戧熗錆鏘鏹羥蹌鍬橋喬僑翹竅誚譙蕎繰磽蹺竊愜鍥篋欽親寢鋟輕氫傾頃請慶撳鯖瓊窮煢蛺巰賕蟣鰍趨區軀驅齲詘嶇闃覷鴝顴權勸詮綣輇銓卻鵲確闋闕愨讓饒擾繞蕘嬈橈熱韌認紉飪軔榮絨嶸蠑縟銣顰軟銳蜆閏潤灑薩颯鰓賽傘毿糝喪騷掃繅澀嗇銫穡殺剎紗鎩鯊篩曬釃刪閃陜贍繕訕姍騸釤鱔墑傷賞坰殤觴燒紹賒攝懾設厙灄畬紳審嬸腎滲詵諗瀋聲繩勝師獅濕詩時蝕實識駛勢適釋飾視試謚塒蒔弒軾貰鈰鰣壽獸綬樞輸書贖屬術樹豎數攄紓帥閂雙誰稅順說碩爍鑠絲飼廝駟緦鍶鷥聳慫頌訟誦擻藪餿颼鎪蘇訴肅謖穌雖隨綏歲誶孫損筍蓀猻縮瑣鎖嗩脧獺撻闥鉈鰨臺態鈦鮐攤貪癱灘壇譚談嘆曇鉭錟頇湯燙儻餳鐋鏜濤絳討韜鋱騰謄銻題體屜緹鵜闐條糶齠鰷貼鐵廳聽烴銅統慟頭鈄禿圖釷團摶頹蛻飩脫鴕馱駝橢籜鼉襪媧膃彎灣頑萬紈綰網輞韋違圍為濰維葦偉偽緯謂衛諉幃闈溈潿瑋韙煒鮪溫聞紋穩問閿甕撾蝸渦窩臥萵齷嗚鎢烏誣無蕪吳塢霧務誤鄔廡憮嫵騖鵡鶩錫犧襲習銑戲細餼鬩璽覡蝦轄峽俠狹廈嚇硤鮮纖賢銜閑顯險現獻縣餡羨憲線莧薟蘚峴獫嫻鷴癇蠔秈躚廂鑲鄉詳響項薌餉驤緗饗蕭囂銷曉嘯嘵瀟驍綃梟簫協挾攜脅諧寫瀉謝褻擷紲纈鋅釁興陘滎兇洶銹繡饈鵂虛噓須許敘緒續詡頊軒懸選癬絢諼鉉鏇學謔澩鱈勛詢尋馴訓訊遜塤潯鱘壓鴉鴨啞亞訝埡婭椏氬閹煙鹽嚴巖顏閻艷厭硯彥諺驗厴贗儼兗讞懨閆釅魘饜鼴鴦楊揚瘍陽癢養樣煬瑤搖堯遙窯謠藥軺鷂鰩爺頁業葉靨謁鄴曄燁醫銥頤遺儀蟻藝億憶義詣議誼譯異繹詒囈嶧飴懌驛縊軼貽釔鎰鐿瘞艤蔭陰銀飲隱銦癮櫻嬰鷹應纓瑩螢營熒蠅贏穎塋鶯縈鎣攖嚶瀅瀠瓔鸚癭頦罌喲擁傭癰踴詠鏞優憂郵鈾猶誘蕕銪魷輿魚漁娛與嶼語獄譽預馭傴俁諛諭蕷崳飫閾嫗紆覦歟鈺鵒鷸齬鴛淵轅園員圓緣遠櫞鳶黿約躍鑰粵悅閱鉞鄖勻隕運蘊醞暈韻鄆蕓惲慍紜韞殞氳雜災載攢暫贊瓚趲鏨贓臟駔鑿棗責擇則澤賾嘖幘簀賊譖贈綜繒軋鍘閘柵詐齋債氈盞斬輾嶄棧戰綻譫張漲帳賬脹趙詔釗蟄轍鍺這謫輒鷓貞針偵診鎮陣湞縝楨軫賑禎鴆掙睜猙爭幀癥鄭證諍崢鉦錚箏織職執紙摯擲幟質滯騭櫛梔軹輊贄鷙螄縶躓躑觶鐘終種腫眾鍾謅軸皺晝驟紂縐豬諸誅燭矚囑貯鑄駐佇櫧銖專磚轉賺囀饌顳樁莊裝妝壯狀錐贅墜綴騅縋諄準著濁諑鐲茲資漬諮緇輜貲眥錙齜鯔蹤總縱傯鄒諏騶鯫詛組鏃鉆纘躦鱒翺並蔔沈醜澱叠鬥範幹臯矽櫃後夥稭傑訣誇裏淩麽黴撚淒扡聖屍擡塗窪餵汙鍁鹹蠍彜湧遊籲禦願嶽雲竈紮劄築於誌註雕訁譾郤猛氹阪壟堖垵墊檾蕒葤蓧蒓菇槁摣咤唚哢噝噅撅劈謔襆嶴脊仿僥獁麅餘餷饊饢楞怵懍爿漵灩混濫瀦淡寧糸絝緔瑉梘棬案橰櫫軲軤賫膁腖飈糊煆溜湣渺碸滾瞘鈈鉕鋣銱鋥鋶鐦鐧鍩鍀鍃錇鎄鎇鎿鐝鑥鑹鑔穭鶓鶥鸌癧屙瘂臒襇繈耮顬蟎麯鮁鮃鮎鯗鯝鯴鱝鯿鰠鰵鱅鞽韝齇';
    }
    function PYStr(cc,o){
        var str='';
        for(var i=0;i<cc.length;i++){
            if(o==2){
                if(charPYStr().indexOf(cc.charAt(i))!=-1)
                    str+=ftPYStr().charAt(charPYStr().indexOf(cc.charAt(i)));
                else
                    str+=cc.charAt(i);
            }else{
                if(ftPYStr().indexOf(cc.charAt(i))!=-1)
                    str+=charPYStr().charAt(ftPYStr().indexOf(cc.charAt(i)));
                else
                    str+=cc.charAt(i);
            }
        }
        return str;
    }
    return PYStr(str,x);
}
// 获取网页中eval执行结果
function getEvalResult(evalStr) {
    var code = '';
    var evals = evalStr.replace(/^eval/, '').replace('return p', 'return p + code');
    var func = new Function('code', 'return ' + evals); 
    var result = func(code);
    return result; 
}
// 搜索历史记录操作方法
function searchRecord(lx, input) {
    let filepath = 'hiker://files/rules/Src/Juyue/searchRecord.json';
    eval("let recordlist = " + (fetch(filepath)||'[]'));
    if(storage0.getItem('searchrecord')){
        recordlist = storage0.getItem('searchrecord');
        clearItem('searchrecord');
        writeFile(filepath, JSON.stringify(recordlist));
    }
    if(lx=='get'){
        return recordlist.slice(0, parseInt(getItem("显示搜索历史数量", "18")));
    }else if(lx=='put'){
        recordlist = recordlist.slice(0, 100).filter(v=>v!=input);
        recordlist.unshift(input);
        writeFile(filepath, JSON.stringify(recordlist));
    }else if(lx=='del'){
        recordlist = input==''?[]:recordlist.filter(v=>v!=input);
        writeFile(filepath, JSON.stringify(recordlist));
    }
    return;
}
// 加入聚阅收藏书架方法
function addBookCase(obj, update) {
    if(!obj){
        let history = JSON.parse(fetch("hiker://history?rule="+MY_RULE.title));
        history = history.filter(v=>v.type=='二级列表');
        if(history.length>0 && history[0].title==getPageTitle()){
            let data = history[0];
            let params = JSON.parse(data.params);
            obj = {
                type: data.type,
                title: data.title,
                picUrl: data.picUrl,
                params: {
                    url: params.url.split(';')[0],
                    find_rule: params.find_rule,
                    params: JSON.parse(params.params)
                }
            }
        }
    }
    if(!obj.params.url){
        return 'toast://数据错误';
    }
    try{
        let casefile = 'hiker://files/rules/Src/Juyue/case.json';
        eval('let caselist = ' + (fetch(casefile)||'[]'));
        if(update){
            if(!caselist.some(v=>v.params.url.split('@')[0]==obj.params.url.split('@')[0]&&v.title==obj.title)){
                return;
            }
        }

        let index = caselist.findIndex(v => v.params.url.split('@')[0]==obj.params.url.split('@')[0]&&v.title==obj.title);
        if(index>-1){
            caselist.splice(index, 1);
        }
        caselist.unshift(obj);
        writeFile(casefile, JSON.stringify(caselist));
        return 'toast://已加入';
    }catch(e){
        return 'toast://失败>'+e.message;
    }
}
//来自阿尔法大佬的主页幻灯片
function banner(start, arr, data, cfg){
    if(!data || data.length==0){return;}
    let id = 'juyue';
    let rnum = Math.floor(Math.random() * data.length);
    let item = data[rnum];
    putMyVar('rnum', rnum);
    cfg = cfg  || {};
    let time = cfg.time || 4000;
    let col_type = cfg.col_type || 'card_pic_1';
    let desc = cfg.desc || '0';
    let extra = item.extra || {};

    arr.push({
        col_type: col_type,
        img: item.img,
        desc: desc,
        title: item.title,
        url: item.url,
        extra: {
            id: 'bar',
            cls: extra.cls
        }
    })
    if (start == false || getMyVar('benstart', 'true') == 'false') {
        unRegisterTask(id)
        return
    }

    let obj = {
        data: data,
        method: config.聚阅.match(/http(s)?:\/\/.*\//)[0] + 'SrcJuMethod.js',
        info: storage0.getMyVar('一级源接口信息'),
        xlog: xlog
    };
    registerTask(id, time, $.toString((obj) => {
        var data = obj.data;
        var rum = getMyVar('rnum');
        var i = Number(getMyVar('banneri', '0'));
        if (rum != '') {
            i = Number(rum) + 1
            clearMyVar('rnum')
        } else {
            i = i + 1;
        }
        if (i > data.length - 1) {
            i = 0
        }
        var item = data[i];
        try {
            require(obj.method);
            updateItem('bar', toerji(item, obj.info));
        } catch (e) {
            obj.xlog("幻灯片更新异常>" + e.message);
            unRegisterTask('juyue');
        }
        putMyVar('banneri', i);
    }, obj))
}
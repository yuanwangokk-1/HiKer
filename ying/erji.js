let d = [];
let murl = MY_URL.replace(/.*empty##/, "");
MY_URL = isBase64(murl) == true ? base64Decode(murl) : decodeURIComponent(murl);

if (getMyVar("URL", "0") != MY_URL) {
    if (getMyVar("namejs", "null") == "null") {
        putMyVar("URL", MY_URL);
    }
    ;
    require(http + "dwer.js");

    let tabs;
    try {
        let arts = typeof (线路) == "string" ? pdfa(html, 线路) : 线路;
        let 换线 = typeof (线名) != "undefined" ? 线名 : typeof (线路名) != "undefined" ? 线路名 : "";
        tabs = [];
        for (let i in arts) {
            tabs.push(typeof (换线) == "string" ? pdfh(arts[i], 换线).replace(/ |.*』|：.*|\s|^\s*|\s*$/g, "").replace(/[ ]|[&nbsp;]/g, "") : 换线(arts[i]))
        }
        ;
    } catch (e) {
        tabs = "";
        log(e.toString());
    }
    ;

    let 选名 = typeof (名称) != "undefined" ? 名称 : typeof (选集名) != "undefined" ? 选集名 : "";
    let 选图 = typeof (图片) != "undefined" ? 图片 : typeof (选集图) != "undefined" ? 选集图 : "";
    let 选详 = typeof (详情) != "undefined" ? 详情 : typeof (选集详) != "undefined" ? 选集详 : "";
    let 选链 = typeof (链接) != "undefined" ? 链接 : typeof (选集链) != "undefined" ? 选集链 : "";

    function litss() {
        let conts;
        let lits;
        try {
            conts = typeof (列表) == "string" ? pdfa(html, 列表) : typeof (列表) == "function" ? 列表(html) : 列表;
            lits = [];
            let 子表 = typeof (子列) != "undefined" ? 子列 : typeof (子列表) != "undefined" ? 子列表 : "";
            for (let i in conts) {
                lits.push(typeof (子表) == "string" ? pdfa(conts[i], 子表) : 子表(conts[i]));
            }
            ;
            var lists = [];
            for (let s in conts) {
                let td = [];
                let lis = lits[s];

                for (let j in lis) {
                    td.push((选名 != "" ? (typeof (选名) == "string" ? pdfh(lis[j], 选名) : 选名(lis[j])) : "") + "$" + (选图 != "" ? (typeof (选图) == "string" ? pd(lis[j], 选图) : 选图(lis[j])) : "") + "$" + (选详 != "" ? (typeof (选详) == "string" ? pdfh(lis[j], 选详) : 选详(lis[j])) : "") + "$" + (typeof (选链) == "string" ? pd(lis[j], 选链) : 选链(lis[j])));
                }
                ; //log(td)
                lists.push(td.join("#-#").replace(/\&/g, "＆＆"));
            }
            ;
        } catch (e) {
            log(e.toString());
        }
        ;
        return lists;
    };

    if (typeof (分页) == "object") {

        try {
            let 缓存个数 = 30;
            var code = html;
            var caches;

            function getCache() {
                let c;
                try {
                    c = JSON.parse(readFile("hiker://files/cache/FY/ChCache.js"));
                } catch (e) {
                    c = [];
                }
                ;
                caches = c;
                let url = MY_URL;
                //log(url)
                addListener("onRefresh", $.toString((url) => {
                    let c;
                    try {
                        c = JSON.parse(readFile("hiker://files/cache/FY/ChCache.js"));
                    } catch (e) {
                        c = [];
                    }
                    ;
                    var che = {
                        url: url,
                        page: 0,
                        chapters: []
                    };
                    for (let i = 0; i < c.length; i++) {
                        if (c[i].url == che.url) {
                            c[i] = che;
                            //log("clear:" + url)
                            saveFile("hiker://files/cache/FY/ChCache.js", JSON.stringify(c));
                            break
                        }
                    }
                }, url))
                for (let it of caches) {
                    if (it.url == url) {
                        return it;
                    }
                }
                return {
                    url: url,
                    page: 0,
                    chapters: []
                }
            }

            function saveCache(che) {
                let c = caches
                if (c.length > 缓存个数) {
                    c.shift()
                }
                let exist = false
                for (let i = 0; i < c.length; i++) {
                    if (c[i].url == che.url) {
                        c[i] = che;
                        exist = true;
                        break
                    }
                }
                if (!exist) {
                    c.push(che)
                }
                saveFile("hiker://files/cache/FY/ChCache.js", JSON.stringify(c))
            }

            let mp = pdfa(code, 分页.分列);
            let page = mp.length;
            if (mp.length < 2) {
                var lists = litss();
            } else {
                let cache = getCache();
                log("实际页数：" + page)
                log("缓存页数：" + cache.page)
                /*
                if (page == cache.page) {
                    //已完结，目录全部缓存了
                    setResult(cache.chapters)
                    return
                }
                */
                //解析本地没有的缓存
                let urls = []
                let htmls = []
                //log(mp.length)
                for (let i = cache.page; i < mp.length; i++) {
                    if (i == 0) {
                        htmls.push(code)
                        continue
                    }
                    ;
                    let it = mp[i];
                    urls.push({
                        url: pd(it, 分页.分链),
                        options: {
                            headers: 分页.headers || {}
                        }
                    })
                }
                //log(urls)
                let d = [].concat(cache.chapters);
                htmls = htmls.concat(batchFetch(urls))
                //log(htmls)
                for (let it of htmls) {
                    if (it == "") {
                        break
                    }

                    let conts = typeof (列表) == "string" ? pdfa(it, 列表) : 列表;
                    let lits = [];
                    let 子表 = typeof (子列) != "undefined" ? 子列 : typeof (子列表) != "undefined" ? 子列表 : "";
                    for (let i in conts) {
                        lits.push(typeof (子表) == "string" ? pdfa(conts[i], 子表) : 子表(conts[i]));
                    }
                    ;
                    var tmet = [];
                    for (let s in conts) {
                        let td = [];
                        let lis = lits[s];
                        for (let j in lis) {
                            td.push((选名 != "" ? (typeof (选名) == "string" ? pdfh(lis[j], 选名) : 选名(lis[j])) : "") + "$" + (选图 != "" ? (typeof (选图) == "string" ? pd(lis[j], 选图) : 选图(lis[j])) : "") + "$" + (选详 != "" ? (typeof (选详) == "string" ? pdfh(lis[j], 选详) : 选详(lis[j])) : "") + "$" + (typeof (选链) == "string" ? pd(lis[j], 选链) : 选链(lis[j])));
                        }
                        ; //log(td)
                        tmet.push(td)
                    }
                    ;

                    if (lits.length == 分页.章节数) {
                        //章节齐全的才放本地缓存
                        cache.page = cache.page + 1
                        cache.chapters = cache.chapters.concat(tmet.join("#-#"))
                    }
                    ;
                    d = d.concat(tmet.join("#-#"));
                    var lists = [d.join("#-#")]
                    //putMyVar("list", d.join("#-#"));
                }
                ;
                saveCache(cache);
            }
            ;
        } catch (e) {
            log(e.toString());
            var lists = "";
        }
        ;

    } else {
        var lists = litss();
    }
    ;

    let 名 = MY_PARAMS.title;
    let 类;
    try {
        类 = ("类型：" + (typeof (类型) == "string" ? (/&&/.test(类型) ? pdfh(html, 类型) : 类型) : typeof (类型) == "function" ? 类型(html) : "未知").replace(/◎|\/$|.*：|.*:|更多|关键词：|\[|\]/g, "").replace(/\//g, " ")).substring(0, 18);
    } catch (e) {
        类 = "类型：未知";
    }
    ;
    let 导;
    try {
        let d = (typeof (导演) == "string" ? (/&&/.test(导演) ? pdfh(html, 导演) : 导演) : typeof (导演) == "function" ? 导演(html) : "未知").replace(/\/$|◎/g, "").replace(/\//g, " ");
        导 = /导演|原著|作者|作曲|作词/.test(d) ? d.replace(/\s*:\s*|\s*：\s*/g, "：") : "导演：" + d.replace(/\s*:\s*|\s*：\s*/g, "");
    } catch (e) {
        导 = "导演：未知";
    }
    ;

    let 主;
    try {
        let z = (typeof (主演) == "string" ? (/&&/.test(主演) ? pdfh(html, 主演) : 主演) : typeof (主演) == "function" ? 主演(html) : "未知").replace(/\/$|◎/g, "").replace(/\//g, " ");
        主 = /主演|播音|主播|演播|演唱|歌手|字数/.test(z) ? z.replace(/\s*:\s*|\s*：\s*/g, "：") : "主演：" + z.replace(/\s*:\s*|\s*：\s*/g, "");
    } catch (e) {
        主 = "主演：未知";
    }
    ;

    let 更;
    try {
        更 = "状态：" + (typeof (状态) == "string" ? (/&&/.test(状态) ? pdfh(html, 状态) : 状态) : typeof (状态) == "function" ? 状态(html) : MY_PARAMS.desc).replace(/状态|更新|更至|最新|更新至|\s*：\s*|\s*:\s*/g, "");
    } catch (e) {
        更 = "状态：未知";
    }
    ;

    let 图1;
    try {
        var 图0 = typeof (详图) == "string" ? (/&&/.test(详图) ? pd(html, 详图) : 详图) : typeof (详图) == "function" ? 详图(html) : MY_PARAMS.img;
        if (Array.isArray(图0)) {
            图1 = 图0[0];
        } else {
            图1 = 图0;
        }
        ;
    } catch (e) {
        图1 = typeof (详图) == "function" ? 详图(html)[0] : "hiker://files/cache/FY/image/随风.jpg";
    }
    ;

    let 图2 = "hiker://files/cache/FY/image/随风.jpg";
    let 图 = /http|https|pic|jpg|png/.test(图1) ? 图1 : 图2;
    let 介;
    try {
        介 = (typeof (简介) == "string" ? (/&&/.test(简介) ? pdfh(html, 简介) : 简介) : typeof (简介) == "function" ? 简介(html) : "欢迎使用风影！").replace(/　|展开|收起|详情|[收起部分]|概要 |©豆瓣|简介|剧情简介|:|：/g, "");
    } catch (e) {
        介 = "欢迎使用风影！"
    }
    let titles = "名称：" + 名 + "\n" + 类 + "\n" + 更;

    let descs = '<br><b>名称：</b>' + 名 + "<br><br>" + 类.replace(/(类型：)/, "<b>$1</b>") + "<br><br>" + 导.replace(/(导演：|作者：|原著：|作词：|作曲：)/g, "<b>$1</b>") + "<br><br>" + 主.replace(/(主演：|播音：|主播：|演播：|演唱：|歌手：|字数：)/g, "<b>$1</b>") + "<br><br>" + 更.replace(/(状态：)/, "<b>$1</b>") + "<br><br><b>详情介绍：</b><br>" + 介 + "<br><br>";
    let 样 = typeof (样式) == "function" ? 样式.toString() : typeof (样式) == "string" && 样式 != "" ? 样式 : "";
    let 翻 = typeof (翻页) !== "undefined" ? 翻页 : "";
    var erji = {
        "名": 名,
        "导": 导,
        "主": 主,
        "图0": 图0,
        "图": 图,
        "介": 介,
        "titles": titles,
        "descs": descs,
        "tabs": tabs,
        "lists": lists,
        "tuii": tuii,
        "样式": 样.toString(),
        "正文": zw,
        "免嗅": mx,
        "点播": db,
        "排除": ex,
        "包含": bh,
        "广告": gg,
        "翻": 翻,
        "der": der
    };
    saveFile("hiker://files/cache/FY/erji/" + base64Encode(MY_URL) + ".js", JSON.stringify(erji), 0);
} else {
    try {
        eval("var erji = " + readFile("hiker://files/cache/FY/erji/" + base64Encode(MY_URL) + ".js", 0));
    } catch (e) {
        clearMyVar("URL");
    }
    ;
}
;
let 名 = erji.名;
let 导 = erji.导;
let 主 = erji.主;
let 图0 = erji.图0;
let 图 = erji.图;
let 介 = erji.介;
let titles = erji.titles;
let descs = erji.descs;
let tabs = erji.tabs;
let lists = erji.lists;
let tuii = erji.tuii;
let 样s = erji.样式;
let 正文 = erji.正文;
let 免嗅 = erji.免嗅;
let 点播 = erji.点播;
let 排除 = erji.排除;
let 包含 = erji.包含;
let 广告 = erji.广告;
let 翻 = erji.翻;
let der = erji.der;

let ertu = "hiker://files/cache/FY/image/";
if (MY_PAGE == 1) {
    let tits;
    try {
        tits = titles.fontcolor("#274c5e");
    } catch (e) {
        tits = titles;
    }
    ;
    let jie;
    try {
        jie = 介.fontcolor("#778899");
    } catch (e) {
        jie = ("欢迎使用风影").fontcolor("#778899");
    }
    ;
    d.push({
        title: "‘‘’’<b><small>" + tits + "</small></b>",
        desc: "‘‘’’<b><small>" + "详情：".fontcolor("#708090") + jie + "</small></b>",
        url: 图.replace("@Referer=", "") + "#noHistory##noRecordHistory#",
        img: 图,
        col_type: "movie_1_vertical_pic_blur",
        extra: {
            gradient: true
        }
    }, {
        title: "线路",
        url: $("#noLoading#").lazyRule(() => {
            if (getItem("xl", "gua") == "ka") {
                clearItem("xl");
            } else {
                setItem("xl", "ka");
            }
            refreshPage(false);
            return "#noHistory#hiker://empty"
        }),
        img: ertu + "线路.png",
        col_type: "icon_small_3"
    }, {
        title: "详情",
        url: $("hiker://empty#noRecordHistory##noHistory#").rule((text, 图0, 图) => {
            let d = [];
            if (Array.isArray(图0)) {
                for (let i in 图0) {
                    d.push({
                        img: 图0[i],
                        url: 图0[i].replace("@Referer=", ""),
                        col_type: "pic_1_full"
                    })
                }
            } else {
                d.push({
                    img: 图,
                    url: 图.replace("@Referer=", ""),
                    col_type: "pic_1_full"
                })
            }
            d.push({
                title: text,
                col_type: "rich_text"
            })
            setResult(d);
        }, descs, 图0, 图),
        img: ertu + "详情.png",
        col_type: "icon_small_3",
        extra: {
            inheritTitle: false
        }
    }, {
        title: "搜索",
        url: $("#noLoading#").lazyRule((input, bak) => {
            clearMyVar("fys");
            if (bak == "1") {
                back(false);
                clearMyVar("bak");
                return "hiker://empty";
            } else {
                putMyVar("Mysou", input);
                return $("hiker://empty#noRecordHistory##noHistory#fypage").rule(() => {
                    require(config.依赖);
                    yso()
                });
            }
            ;
        }, 名, getMyVar("bak", "0")),
        img: ertu + "搜索.png",
        col_type: "icon_small_3",
        extra: {
            erji: "1",
            inheritTitle: false,
            searchTerms: 名,
            longClick: [{
                title: "云盘君.简",
                js: $.toString(() => {
                    return "hiker://page/sou#noRecordHistory##noHistory#?rule=云盘君.简";
                })
            }]
        }
    }, {
        col_type: "line"
    }, {
        col_type: "big_blank_block"
    });

    function setTabs(tabs, vari) {
        if (getItem("xl", "gua") == "ka") {
            if (tabs == "") {
                toast("没有其它线路了哟！");
                clearItem("xl");
            } else {
                d.push({
                    col_type: "big_blank_block"
                });
                if (getItem("推送", "off") == "on") {
                    let push = {
                        "name": MY_RULE.title + " • " + 名 || MY_RULE.title,
                        "pic": 图.replace(/@.*/, ""),
                        "content": 介,
                        "director": 导.replace("导演：", ""),
                        "actor": 主.replace("主演：", ""),
                        "manual": "1",
                        "format": ".m3u8#.mp4",
                        "filters": "?url=http#.htm",
                        "headerd": {
                            "User-Agent": MOBILE_UA
                        }
                    };
                    let ip = /海阔/.test(MY_NAME) ? "http://" + getIP() + ":9978" : "http://";
                    let tvip = getItem("ip", ip);
                    let tabss = tabs ? tabs : "源";
                    //let lists = lists.replace(/[\'\"\\\/\b\f\n\r\t]/g, "");
                    d.push({
                        title: "‘‘’’<small><b>" + "Box推送".fontcolor("#33cccc") + "</b></small>",
                        col_type: "scroll_button",
                        url: $("#noLoading#").lazyRule((push, tabs, lists, tvip) => {
                            if (!/997/.test(tvip) || tvip == "") {
                                return "toast://前往设置项，TVBOX设置ip地址";
                            }
                            let froms = [];
                            for (let i in tabs) {
                                froms.push(tabs[i]);
                            }
                            let listi = lists.replace(/#-#/g, "#")
                            if (froms.length > 0) {
                                push["from"] = froms.join("$$$");
                                push["url"] = listi.join("$$$"); //log(push);
                                var state = request(tvip + "/action", {
                                    headers: {
                                        "Content-Type": "application/x-www-form-urlencoded",
                                        "Referer": tvip
                                    },
                                    timeout: 3000,
                                    body: "do=push&url=" + JSON.stringify(push),
                                    method: "POST"
                                });
                                if (state == "ok") {
                                    return "toast://推送成功，如显示“没找到数据”可能是该链接需要密码或当前的jar不支持。";
                                } else {
                                    return "toast://推送失败，可能是ip地址设置错误或未连接到TVBOX。";
                                }
                                ;
                            }
                            ;
                            return "toast://此线路无法推送";
                        }, push, tabss, lists, tvip)
                    })
                } else {
                    d.push({
                        title: "‘‘’’<small><b>" + "线路".fontcolor("#33cccc") + "</b></small>",
                        url: "hiker://empty",
                        col_type: "scroll_button"
                    })
                }
                ;
                try {
                    eval("var wenj = " + readFile("hiker://files/cache/FY/xl.js"), 0);
                    if (wenj != "") {
                        if (wenj.route[MY_URL] != undefined) {
                            putMyVar(MY_URL, wenj.route[MY_URL]);
                        }
                        ;
                    }
                    ;
                } catch (e) {
                }
                ;
                let 缓存 = 50; //线路缓存数量

                for (let i in tabs) {
                    if (tabs[i] != "") {
                        d.push({
                            title: "‘‘’’<small>" + (getMyVar(vari, "0") == i ? "<b>" + (tabs[i] + "↓").fontcolor("#33cccc") + "</b>" : tabs[i]) + "</small>",
                            url: $("hiker://empty#noHistory##noLoading#").lazyRule((vari, i, 缓存) => {
                                if (parseInt(getMyVar(vari, "0")) != i) {
                                    try {
                                        eval("var wenj = " + readFile("hiker://files/cache/FY/xl.js"), 0);
                                    } catch (e) {
                                        var wenj = "";
                                    }
                                    if (wenj == "") {
                                        wenj = {
                                            route: {}
                                        };
                                    } else if (wenj.route == undefined) {
                                        wenj.route = {};
                                    }
                                    wenj.route[vari] = i;
                                    var key = 0;
                                    var one = "";
                                    for (var k in wenj.route) {
                                        key++;
                                        if (key == 1) {
                                            one = k
                                        }
                                    }
                                    if (key > 缓存) {
                                        delete wenj.route[one];
                                    }
                                    saveFile("hiker://files/cache/FY/xl.js", JSON.stringify(wenj), 0);
                                    putMyVar(vari, i);
                                    refreshPage(false);
                                    return 'hiker://empty'
                                } else {
                                    return "#noHistory#hiker://empty";
                                }
                            }, vari, i, 缓存),
                            col_type: "scroll_button"
                        })
                    }
                }
                ;
                d.push({
                    col_type: "line"
                })
            }
            ;
        }
        ;
    };
    setTabs(tabs, MY_URL);
}
;

function setLists(lists, index) {
    let listt;
    try {
        listt = lists[index].split("#-#");
    } catch (e) {
        listt = "";
    }
    ;

    let zftu = "https://hikerfans.com/tubiao/messy/";

    let zflb = getItem("zf", "f") == "z";
    let zfan = (zflb ? "正序".fontcolor("#19B89D") : "倒序".fontcolor("#ff7f50")) + "<small>" + ("\t\t共 " + listt.length + " 条\t\t\t").fontcolor("#19B89D") + "</small>";
    if (MY_PAGE == 1) {
        d.push({
            title: zfan + (zflb ? "▴".fontcolor("#33cccc") : "▾".fontcolor("#ff7f50")),
            desc: "<small>" + (zflb ? "正序".fontcolor("#33cccc") : "倒序".fontcolor("#ff7f50")) + "</small>\t",
            url: $("#noLoading#").lazyRule(() => {
                if (getItem("zf", "f") == "z") {
                    clearItem("zf");
                } else {
                    setItem("zf", "z");
                }
                refreshPage(false);
                return "#noHistory#hiker://empty"
            }),
            img: ertu + (zflb ? "正序.svg" : "倒序.svg"),
            col_type: "text_icon"
        });
    }
    ;
    let lisd;
    try {
        let lists1 = listt[0].split("$")[0];
        let lists2 = listt[listt.length - 1].split("$")[0];
        if (parseInt(lists1.match(/(\d+)/)[0]) > parseInt(lists2.match(/(\d+)/)[0])) {
            lisd = listt.reverse();
        } else {
            lisd = listt;
        }
    } catch (e) {
        lisd = listt;
    }
    ;
    let list;
    try {
        if (getItem("zf", "f") == "z") {
            list = lisd;
        } else {
            list = lisd.reverse();
        }
        ;
    } catch (e) {
        list = "";
    }
    ;


    try {
        if (list == "") {
            if (翻 !== "on") {
                d.push({
                    title: "没有列表了",
                    url: "hiker://empty#noHistory#",
                    col_type: "text_center_1",
                    extra: {
                        lineVisible: false
                    }
                });
            } else {
                d.push({
                    title: "‘‘’’<small>－－到\t底\t了－－</small>",
                    url: "hiker://empty",
                    col_type: "text_center_1",
                    extra: {
                        lineVisible: false
                    }
                });
            }
            ;
        } else {
            let xtan = getItem("嗅探", "off") == "on";
            let 排 = 排除 != undefined ? 排除.toString() : "";
            let 排除ex = 排 != "" ? 排.replace(/\\/g, "").replace(/^\//, "").replace(/\/$/, "") : "";
            let 样S = /function/.test(样s) ? eval(样s) : 样s;
            let m3u8 = getItem("缓存") == "on" ? true : false;
            let btget = getItem("zgb", "影视");
            let get = btget == "影视" ? "ys" : btget == "小说" ? "xs" : btget == "其它" ? "qt" : btget == "漫画" ? "mh" : btget == "听书" ? "ts" : "";

            for (let j = 0; j < list.length; j++) {
                let jpg = list[j].split("$")[1];
                let jm = jpg != "" ? list[j].split("$")[0] : list[j].split("$")[0].replace(/.*第|集[\u4e00-\u9fa5]*|话.*|期.*|线路|厂长|\(.*\)/g, "");
                let des = list[j].split("$")[2];
                let url = list[j].split("$")[3];

                let col;
                if (list.length < 17) {
                    col = "text_2";
                } else {
                    col = jm.length > 5 ? "text_2" : list.length < 97 ? "text_4" : "text_5";
                }
                ;

                let extra = {
                    id: url,
                    js: $.toString((点播) => {
                        if (点播 != "undefined" && 点播 != "") {
                            eval(点播.replace(/\'/g, ""));
                        }
                        ;
                    }, 点播),
                    videoExcludeRules: [".html", 排除ex],
                    blockRules: [".gif", ".jpeg", ".jpg", ".ico", ".png", "hm.baidu.com", "/ads/*.js", "cnzz.com"],
                    jsLoadingInject: true,
                    /*ua: PC_UA,*/
                    cacheM3u8: m3u8,
                    lineVisible: false
                };

                d.push({
                    title: jpg != "" ? jm : "‘‘’’<small>" + jm + "</small>",
                    img: isBase64(jpg) == true && jpg !== "" ? base64Decode(jpg) : decodeURIComponent(jpg),
                    desc: des,
                    url: /@lazyRule=|@rule=/.test(url) ? url : url == "hiker://empty" ? url : /function/.test(免嗅) ? $(zflb ? "" : "#noPre#").lazyRule((nad, MY_HOME, jm, myurl, get, url) => {
                        if (getMyVar("fys", "") == "0") {
                            require(config.依赖.replace(/[^/]*$/, "public.js"));
                            zuji(get, myurl, jm);
                        }
                        ;
                        require(config.依赖.replace(/[^/]*$/, "lazy.js"));
                        return mx(nad, input, MY_HOME, "", url);
                    }, der, MY_HOME, jm.replace(/.*>(.*?)<\/.*/, "$1"), MY_URL.replace(/(.*?)#immersiveTheme.*/, "$1"), get, url == "" ? MY_URL : url) : /function/.test(正文) ? $(zflb ? (url == "" ? MY_URL : url) + "#readTheme##autoPage#" : (url == "" ? MY_URL : url) + "#readTheme#").rule((nad, MY_HOME) => {
                        require(config.依赖.replace(/[^/]*$/, "lazy.js"));
                        return zw(nad, MY_URL, MY_HOME, "");
                    }, der, MY_HOME) : /\.mp4|\.m3u8|\.m4a|\.mp3|magnet\:|\.torrent|ed2k\:/.test(url) ? url : /ali(pan|yun|yundrive)/.test(url) ? "hiker://page/aliyun?rule=云盘君.简&page=fypage&realurl=" + encodeURIComponent(url) : /(quark|\.uc)\.cn/.test(url) ? "hiker://page/quarkList?rule=Quark.简&realurl=" + encodeURIComponent(url) + "&sharePwd=" : $(zflb ? "" : "#noPre#").lazyRule((nad, MY_HOME, xt, jm, myurl, get, url) => {
                        if (getMyVar("fys", "") == "0") {
                            require(config.依赖.replace(/[^/]*$/, "public.js"));
                            zuji(get, myurl, jm);
                        }
                        ;
                        require(config.依赖.replace(/[^/]*$/, "lazy.js"));
                        return xt ? video(url) : lazy(nad, url);
                    }, der, MY_HOME, xtan, jm.replace(/.*>(.*?)<\/.*/, "$1"), MY_URL.replace(/(.*?)#immersiveTheme.*/, "$1"), get, url == "" ? MY_URL : url),
                    col_type: typeof (样S) == "function" ? 样S(jm, jpg, des, url, col) : 样S != "" && typeof (样S) == "string" ? 样S : col,
                    extra: extra
                });
            }
        }
    } catch (e) {
        log(e.toString());
    }
    ;
};
setLists(lists, getMyVar(MY_URL, "0"));

if (翻 !== "on") {
    d.push({
        col_type: "big_blank_block"
    }, {
        col_type: "line"
    })
}
;

function tuiList(tuii) {
    let no = getMyVar("yn", "no") == "no";
    let bia = "<font color=#33cccc>相关推荐";

    d.push({
        title: bia + (no ? " ▴</font>" : " ▾</font>"),
        img: ertu + "推荐.png",
        url: $("#noLoading#").lazyRule(() => {
            if (getMyVar("yn", "no") == "yes") {
                putMyVar("yn", "no");
            } else {
                putMyVar("yn", "yes");
            }
            ;
            refreshPage(false);
            return "#noHistory#hiker://empty";
        }),
        col_type: "avatar"
    });

    if (no) {
        d.push({
            title: "‘‘’’<small>" + "数据资源收集于网络，海阔不提供任何资源！".fontcolor("#20b2aa") + "</small>",
            desc: "‘‘’’<small>" + "本规则仅限学习与交流，请导入后24小时内删除，请勿传播！".fontcolor("#ff7f50") + "</small>",
            url: "hiker://empty",
            col_type: "text_center_1",
            extra: {
                lineVisible: false
            }
        });
        d.push({
            title: "<br>",
            col_type: "rich_text",
        });
    } else {
        if (tuii == "") {
            d.push({
                desc: "没有其它内容了",
                url: "hiker://empty",
                col_type: "text_center_1",
                extra: {
                    lineVisible: false
                }
            });
        } else {
            var tui = tuii
        }
        ;
        for (let t in tui) {
            let title = tui[t].split("$")[0];
            let desc = tui[t].split("$")[1];
            let im = tui[t].split("$")[2];
            let img = isBase64(im) == true && im !== "undefined" ? base64Decode(im) : decodeURIComponent(im);
            let urll = tui[t].split("$")[3];
            let col_ = tui[t].split("$")[4]
            let url;
            let xun = MY_PARAMS.xun;
            if (xun == "1") {
                url = /@lazyRule=|@rule=/.test(urll) ? urll : urll == "hiker://empty" ? urll : $("#noLoading#").lazyRule(() => {
                    back(false);
                    return "hiker://empty"
                });
            } else {
                url = /@lazyRule=|@rule=/.test(urll) ? urll : urll == "hiker://empty" ? urll : $("hiker://empty##" + urll.replace("vodplay", "voddetail").replace(/project-(\d+)/, "v_$1_1_1") + "#immersiveTheme##autoCache##noHistory" + game).rule(() => {
                    require(config.依赖);
                    erji()
                });
            }
            let extra = {
                pageTitle: (title !== undefined ? title.replace(/\n.*/, "") : title) + "「" + der + "」",
                xun: "1",
                title: title !== undefined ? title.replace(/\n.*/, "") : title,
                desc: desc !== undefined ? desc.replace(/\n.*/, "") : desc,
                img: img,
            };

            d.push({
                title: title,
                desc: desc,
                img: img,
                url: url,
                col_type: col_,
                extra: extra,
            });
        }
        ;
        d.push({
            title: "‘‘’’<small>－－到\t底\t了－－</small>",
            url: "hiker://empty",
            col_type: "text_center_1",
            extra: {
                lineVisible: false
            }
        });
    }
    ;
};
if (翻 !== "on") {
    tuiList(tuii);
}
;
setResult(d);

setLastChapterRule("js:" + $.toString((http) => {
    MY_URL = MY_URL.split("##")[1];
    require(http + "dwer.js");

    let 选名 = typeof (名称) != "undefined" ? 名称 : typeof (选集名) != "undefined" ? 选集名 : "";

    let title;
    try {
        let conts = typeof (列表) == "string" ? pdfa(html, 列表) : typeof (列表) == "function" ? 列表(html) : 列表;
        let 子表 = typeof (子列) != "undefined" ? 子列 : typeof (子列表) != "undefined" ? 子列表 : "";
        let lies = [];
        for (let i in conts) {
            lies.push(typeof (子表) == "string" ? pdfa(conts[i], 子表) : 子表(conts[i]));
        }
        ;
        let lists = lies[0].length;
        let sz = 0;
        for (let s in conts) {
            if (lies[s].length > lists) {
                lists = lies[s].length;
                sz = s;
            }
            ;
        }
        ;
        let list = lies[sz];
        let title1 = (选名 != "" ? (typeof (选名) == "string" ? pdfh(list[0], 选名) : 选名(list[0])) : "").replace(/.*>(.*?)<\/.*/, "$1");
        let title2 = (选名 != "" ? (typeof (选名) == "string" ? pdfh(list[list.length - 1], 选名) : 选名(list[list.length - 1])) : "").replace(/.*>(.*?)<\/.*/, "$1");
        try {
            if (parseInt(title1.match(/(\d+)/)[0]) > parseInt(title2.match(/(\d+)/)[0])) {
                title = title1;
            } else {
                title = title2;
            }
            ;
        } catch (e) {
            title = title2;
        }
    } catch (e) {
        title = "未更新";
    }
    setResult("更新：" + title);
}, http));
//二级页面
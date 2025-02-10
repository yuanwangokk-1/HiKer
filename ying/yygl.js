addListener("onClose", $.toString(() => {
    clearMyVar("input");
    clearMyVar("gs");
    clearMyVar("glx");
}));
let d = [];
let gl = ["新增", "分享", "删除", "启停", "订阅"];
let pic = ["hiker://images/icon_edit6", "hiker://images/icon_cloud6", "hiker://images/icon_del6", "hiker://images/icon_menu6", "hiker://images/icon_time6"];

let add = $("hiker://empty#noRecordHistory##noHistory##noRefresh#").rule(() => {
    require(config.依赖);
    Add();
});

function 类型(Json) {
    let glx0 = getMyVar("glx", "全部");
    let glx2 = "\\[私\\]|\\[优\\]|\\[免\\]|\\[盘\\]|\\[听\\]|\\[阅\\]|\\[漫\\]|\\[画\\]|\\[短\\]|\\[音\\]|\\[影\\]|盘|短剧|影|剧|视|漫|番|次元|音|歌|曲|DJ|MV|有声|听书|说|阅|读|书|漫画|盤|短劇|劇|視|有聲|聽書|說|閱|讀|書|漫畫";


    let glx1 = glx0 == "听书" ? "\\[听\\]|有声|听书|有聲|聽書" : glx0 == "小说" ? "\\[阅\\]|说|阅|读|书|說|閱|讀|書" : glx0 == "漫画" ? "\\[画\\]|漫画|漫畫" : glx0 == "网盘" ? "\\[盘\\]|盘|盤" : glx0 == "私有" ? "\\[私\\]|\\[优\\]|\\[免\\]" : glx0 == "短剧" ? "\\[短\\]|短剧|短劇" : glx0 == "影视" ? "\\[影\\]|影|剧|视|劇|視" : glx0 == "动漫" ? "\\[漫\\]|漫|番|次元" : glx0 == "音乐" ? "\\[音\\]|音|歌|曲|DJ|MV" : "";

    let jso = [];
    let reg1 = new RegExp(glx1);
    let reg2 = new RegExp(glx2);
    if (glx0 == "失效") {
        jso = Json.filter(item => item.ttl >= 3);
    } else if (glx0 == "网盘") {
        jso = Json.filter(item => reg1.test(item.name.replace(/&&.*/g, "")) && !(item.ttl >= 5) && !/\[私\]|\[优\]|\[免\]/.test(item.name.replace(/&&.*/g, "")));
    } else if (glx0 == "私有") {
        jso = Json.filter(item => reg1.test(item.name.replace(/&&.*/g, "")) && !(item.ttl >= 5));
    } else if (glx0 == "短剧") {
        jso = Json.filter(item => reg1.test(item.name.replace(/&&.*/g, "")) && !(item.ttl >= 5) && !/\[私\]|\[优\]|\[免\]/.test(item.name.replace(/&&.*/g, "")));
    } else if (glx0 == "影视") {
        jso = Json.filter(item => reg1.test(item.name.replace(/&&.*/g, "")) && !(item.ttl >= 5) && !/\[私\]|\[优\]|\[免\]|\[盘\]|盘|短剧|短劇盤/.test(item.name.replace(/&&.*/g, "")));
    } else if (glx0 == "动漫") {
        jso = Json.filter(item => reg1.test(item.name.replace(/&&.*/g, "")) && !(item.ttl >= 5) && !/\[私\]|\[优\]|\[免\]|\[画\]|\[盘\]|盘|漫画|漫畫|盤/.test(item.name.replace(/&&.*/g, "")));
    } else if (glx0 == "音乐") {
        jso = Json.filter(item => reg1.test(item.name.replace(/&&.*/g, "")) && !(item.ttl >= 5) && !/\[私\]|\[优\]|\[免\]|\[盘\]/.test(item.name.replace(/&&.*/g, "")));
    } else if (glx0 == "小说") {
        jso = Json.filter(item => reg1.test(item.name.replace(/&&.*/g, "")) && !(item.ttl >= 5) && !/\[私\]|\[优\]|\[免\]|有声|听书|有聲|聽書/.test(item.name.replace(/&&.*/g, "")));
    } else if (glx0 == "漫画") {
        jso = Json.filter(item => reg1.test(item.name.replace(/&&.*/g, "")) && !(item.ttl >= 5) && !/\[私\]|\[优\]|\[免\]/.test(item.name.replace(/&&.*/g, "")));
    } else if (glx0 == "听书") {
        jso = Json.filter(item => reg1.test(item.name.replace(/&&.*/g, "")) && !(item.ttl >= 5) && !/\[私\]|\[优\]|\[免\]/.test(item.name.replace(/&&.*/g, "")));
    } else if (glx0 == "其它") {
        jso = Json.filter(item => !reg2.test(item.name.replace(/&&.*/g, "")) && !(item.ttl >= 5));
    } else {
        jso = Json.filter(item => reg1.test(item.name.replace(/&&.*/g, "")) && !(item.ttl >= 5) && !/\[私\]|\[优\]|\[免\]/.test(item.name.replace(/&&.*/g, "")));
    }
    ;
    let list = jso.filter(item => new RegExp(getMyVar("gs", "").replace("总", "")).test(item.gs) && new RegExp(getMyVar("input", ""), "i").test(item.name));
    return list;
};
let bdy = getItem("dy", "本地") == "本地";
let fen = $("#noLoading#").lazyRule((类型, bdy) => {
    const hikerPop = $.require(config.依赖.replace(/[^/]*$/, "hikerPop.js"));
    let file = bdy ? "hiker://files/rules/FYJK/ys.json" : "hiker://files/cache/FY/dy/" + getItem("dy") + ".json";
    let Json = JSON.parse(readFile(file));
    let list = 类型(Json);
    let fruit = list.map(item => item.name.replace(/&&.*/g, ""));
    let checkedName = [];
    hikerPop.multiChoice({
        title: "筛选分享",
        options: fruit,
        //checkedIndexs: [0, 1, 2, 3, 4, 5, 6],
        /*onChoice(i, isChecked) {
            log(i + ":" + isChecked);
        },*/
        rightTitle: "确认",
        rightClick(options, checked) {
            let we = options.filter((v, i) => checked[i]).map(option => option); // 先执行过滤操作，然后对过滤后的数组每个元素进行替换

            if (we.length == 0) return "toast://最少选择一条！";
            return $(["文件Hiker", "文件TXT"].concat(getPastes()), 2, "分享方式").select((we, list) => {
                let count = 0;
                let wek = [];
                for (let li of list) {
                    if (we.includes(li.name.replace(/&&.*/g, ""))) {
                        wek.push(li);
                        count++;
                    }
                    ;
                }
                ;
                //log(wek);
                //log(count);
                let no = count;
                let resb64 = base64Encode(JSON.stringify(wek));
                let getPass = (name, rule, type) => "海阔视界「风影源 - 共 " + name + " 条」，复制整条口令自动导入$" + rule + "$" + type + "@import=js:$.require('import?rule='+" + JSON.stringify(MY_RULE.title) + ")(input)";

                if (getPastes().includes(input)) {
                    let share = sharePaste(resb64, input);
                    return "copy://" + getPass(no, base64Encode(share), "b");
                } else {
                    let path = "hiker://files/_cache/风影源 - 共 " + no + " 条." + (input === "文件Hiker" ? "hiker" : "txt");
                    writeFile(path, getPass(no, resb64, "c"));
                    return "share://" + path;
                }
                ;
            }, we, list)
        },
        leftTitle: "全部分享",
        leftClick() {
            return $(["文件Hiker", "文件TXT"].concat(getPastes()), 2, "分享方式").select((list) => {
                let no = list.length;
                let resb64 = base64Encode(JSON.stringify(list));
                let getPass = (name, rule, type) => "海阔视界「风影源 - 共 " + name + " 条」，复制整条口令自动导入$" + rule + "$" + type + "@import=js:$.require('import?rule='+" + JSON.stringify(MY_RULE.title) + ")(input)";

                if (getPastes().includes(input)) {
                    let share = sharePaste(resb64, input);
                    return "copy://" + getPass(no, base64Encode(share), "b");
                } else {
                    let path = "hiker://files/_cache/风影源 - 共 " + no + " 条." + (input === "文件Hiker" ? "hiker" : "txt");
                    writeFile(path, getPass(no, resb64, "c"));
                    return "share://" + path;
                }
            }, list)
        },
        centerTitle: "取消",
    });
    return "hiker://empty";
}, 类型, bdy);

let ex = $("#noLoading#").lazyRule((类型, bdy) => {
    const hikerPop = $.require(config.依赖.replace(/[^/]*$/, "hikerPop.js"));
    let file = bdy ? "hiker://files/rules/FYJK/ys.json" : "hiker://files/cache/FY/dy/" + getItem("dy") + ".json";
    let Json = JSON.parse(readFile(file));
    let list = 类型(Json);
    let fruit = list.map(item => item.name.replace(/&&.*/g, ""));
    let checkedName = [];
    hikerPop.multiChoice({
        title: "筛选删除",
        options: fruit,
        rightTitle: "确认",
        rightClick(options, checked) {
            let we = options.filter((v, i) => checked[i]).map(option => option);
            let on = we.length;
            if (on == 0) return "toast://最少选择一条！";
            return $("删除后无法恢复，确认删除 " + on + " 条源 ？").confirm((on, we, list, file, Json) => {
                // 创建一个新的数组，其中不包含we中名字对应的项
                list = Json.filter(item => !we.includes(item.name.replace(/&&.*/g, "")));
                //log(list);
                saveFile(file, JSON.stringify(list));
                refreshPage(false);
                return "toast://删除成功 " + on + " 条！";
            }, on, we, list, file, Json);
        },
        leftTitle: "全部删除",
        leftClick() {
            return $("删除后无法恢复，确认删除 " + list.length + " 条源 ？").confirm((file, list, Json) => {
                const exList = Json.filter(item => !list.some(i => i.name === item.name));
                saveFile(file, JSON.stringify(exList));
                refreshPage(false);
                return "toast://删除成功！" + list.length + "条！";
            }, file, list, Json)
        },
        centerTitle: "取消",
    });
    return "hiker://empty";
}, 类型, bdy);

function Sx(s, z, title, 类型, bdy) {
    const hikerPop = $.require(config.依赖.replace(/[^/]*$/, "hikerPop.js"));
    let file = bdy ? "hiker://files/rules/FYJK/ys.json" : "hiker://files/cache/FY/dy/" + getItem("dy") + ".json";
    let Json = JSON.parse(readFile(file));
    let list = 类型(Json);
    let fruit = list.filter(item => item.off === s).map(item => item.name.replace(/&&.*/g, ""));

    let checkedName = [];
    hikerPop.multiChoice({
        title: "筛选" + title,
        options: fruit,
        rightTitle: "确认",
        rightClick(options, checked) {
            let we = options.filter((v, i) => checked[i]).map(option => option);
            let on = we.length;
            if (we.length == 0) return "toast://最少选择一条！"; //log(we);
            const onList = Json.map(item => {
                if (we.includes(item.name.replace(/&&.*/g, ""))) {
                    const newItem = Object.assign({}, item, {
                        off: z
                    });
                    return newItem;
                }
                return item;
            }); //log(onList);
            saveFile(file, JSON.stringify(onList));
            refreshPage(false);
            return "toast://已" + title + " " + on + " 条";
        },
        leftTitle: "全部" + title,
        leftClick() {
            const onList = Json.map(item => {
                if (list.some(i => i.name == item.name)) {
                    if (item.off === s) {
                        return Object.assign({}, item, {
                            off: z
                        });
                    }
                }
                return item;
            });
            saveFile(file, JSON.stringify(onList));
            refreshPage(false);
            return "toast://已" + title + " " + fruit.length + " 条";
        },
        centerTitle: "取消",
    });
};

let onf = $("#noLoading#").lazyRule((Sx, 类型, bdy) => {
    const hikerPop = $.require(config.依赖.replace(/[^/]*$/, "hikerPop.js"));
    hikerPop.selectAttachList("yygl-4", {
        options: ["启用", "停用"],
        click(t) {
            hikerPop.runOnNewThread(() => {
                if (t == "启用") {
                    Sx("0", "1", "启用", 类型);
                } else {
                    Sx("1", "0", "停用", 类型);
                }
                ;
            });
        }
    });
    return "hiker://empty";
}, Sx, 类型, bdy);

let dy = $("#noLoading#").lazyRule((http, CT) => {
    const hikerPop = $.require(config.依赖.replace(/[^/]*$/, "hikerPop.js"));
    let teurl;
    try {
        teurl = JSON.parse(readFile("hiker://files/rules/FYJK/dy.json"));
    } catch (e) {
        teurl = [];
    }
    ;
    let name = teurl.map(item => item.title);

    // 为选中的项添加标记
    let Selection = ["添加", "删除", "分享", "本地"].concat(name).map(item => {
        if (getItem("dy", "本地") == item) {
            return `${item} ✓`; // 在选中的项后面添加一个勾选标记
        }
        return item;
    });

    hikerPop.selectAttachList("yygl-5", {
        options: Selection,
        click(tt) {
            let t = tt.replace(" ✓", "");
            hikerPop.runOnNewThread(() => {
                if (t == "添加") {
                    hikerPop.inputTwoRow({
                        titleHint: "订阅名称",
                        titleDefault: "随风",
                        urlHint: "订阅链接",
                        urlDefault: "https://raw.gitcode.com/Suifen/feng/raw/master/suifeng.json",
                        noAutoSoft: false, //不自动打开输入法
                        title: "风影订阅",
                        //hideCancel: true,
                        confirm(title, url) {
                            hikerPop.runOnNewThread(() => {

                                if (title == "") {
                                    return "toast://名称不能为空！";
                                } else if (url == "") {
                                    return "toast://链接不能为空！";
                                } else if (/\//.test(title)) {
                                    return "toast://名称中不能包含符号/";
                                } else if (teurl.some(item => item.title === title)) {
                                    return "toast://名称重复！";
                                } else if (teurl.some(item => item.url === url)) {
                                    return "toast://已订阅，勿重复添加！";
                                } else if (/^http(s)?:\/\/.*\//.test(url)) {
                                    let html = fetch(url, {
                                        timeout: 5000
                                    });
                                    if (/^(\{\s*"(?:name|host|sourl|sy|fl|er|so|time|ttl|fbhost|sxtit|gs|off)"\s*:\s*").*("\s*\}|\d+\s*\})$/.test(html)) {
                                        let turl = {
                                            "title": title,
                                            "url": url,
                                            "time": CT
                                        };
                                        teurl.unshift(turl);
                                        let leth = teurl.length;
                                        if (leth > 10) {
                                            teurl.splice(-1, 1);
                                            deleteFile("hiker://files/cache/FY/dy/" + teurl[leth - 1].title + ".json");
                                        }
                                        ;
                                        saveFile("hiker://files/rules/FYJK/dy.json", JSON.stringify(teurl));
                                        saveFile("hiker://files/cache/FY/dy/" + title + ".json", "[" + html + "]");
                                        return "toast://添加成功！";
                                    } else {
                                        log(html);
                                        return "toast://添加失败，非风影源！";
                                    }
                                    ;
                                } else {
                                    return "toast://链接有误！";
                                }
                                ;
                            })
                        },
                        cancel() {
                            return "toast://取消";
                        }
                    });
                } else if (t == "分享") {
                    let checkedName = [];
                    hikerPop.multiChoice({
                        title: "订阅",
                        options: name,
                        rightTitle: "确认",
                        rightClick(options, checked) {
                            let we = options.filter((v, i) => checked[i]).map(option => option);
                            if (we.length == 0) return "toast://最少选择一条！";
                            return $(["完整编码", "文件Hiker", "文件TXT"].concat(getPastes()), 2, "分享方式").select((we, list) => {
                                let count = 0;
                                let wek = [];
                                for (let li of list) {
                                    if (we.includes(li.title)) {
                                        wek.push(li);
                                        count++;
                                    }
                                    ;
                                }
                                ;
                                //log(wek);
                                //log(count);
                                let no = count;
                                let resb64 = base64Encode(JSON.stringify(wek));
                                let getPass = (name, rule, type) => "海阔视界「风影订阅 - 共 " + name + " 条」，复制整条口令自动导入$" + rule + "$" + type + "@import=js:$.require('import?rule='+" + JSON.stringify(MY_RULE.title) + ")(input)";
                                if (input == "完整编码") {
                                    return "copy://" + getPass(no, resb64, "a");
                                } else if (getPastes().includes(input)) {
                                    let share = sharePaste(resb64, input);
                                    return "copy://" + getPass(no, base64Encode(share), "b");
                                } else {
                                    let path = "hiker://files/_cache/风影订阅 - 共 " + no + " 条." + (input === "文件Hiker" ? "hiker" : "txt");
                                    writeFile(path, getPass(no, resb64, "c"));
                                    return "share://" + path;
                                }
                                ;
                            }, we, teurl)
                        },
                        leftTitle: "全部分享",
                        leftClick() {
                            return $(["文件Hiker", "文件TXT"].concat(getPastes()), 2, "分享方式").select((list) => {
                                let no = list.length;
                                let resb64 = base64Encode(JSON.stringify(list));
                                let getPass = (name, rule, type) => "海阔视界「风影订阅 - 共 " + name + " 条」，复制整条口令自动导入$" + rule + "$" + type + "@import=js:$.require('import?rule='+" + JSON.stringify(MY_RULE.title) + ")(input)";

                                if (getPastes().includes(input)) {
                                    let share = sharePaste(resb64, input);
                                    return "copy://" + getPass(no, base64Encode(share), "b");
                                } else {
                                    let path = "hiker://files/_cache/风影订阅 - 共 " + no + " 条." + (input === "文件Hiker" ? "hiker" : "txt");
                                    writeFile(path, getPass(no, resb64, "c"));
                                    return "share://" + path;
                                }
                            }, teurl)
                        },
                        centerTitle: "取消",
                    });
                } else if (t == "删除") {
                    return $("确认删除全部订阅源 ？").confirm((http, name) => {
                        deleteFile("hiker://files/rules/FYJK/dy.json");
                        let file = require(base64Decode(http) + "sc.js");
                        let dele = "/storage/emulated/0/Android/data/com.example.hikerview/files/Documents/cache/FY/dy/";

                        file.deleteFiles(dele);
                        if (getItem("dy", "本地") == name) {
                            clearItem("dy");
                            clearItem("m1");
                            clearItem("s0");
                        }
                        ;
                        refreshPage(false);
                        return "toast://已删除！";
                    }, http, t);

                } else if (t == "本地") {
                    setItem("dy", t);
                    clearItem("m1");
                    clearItem("s0");
                    refreshPage(false);
                    return "toast://已切换 " + t;
                } else {
                    const u = teurl.find(item => item.title === t);
                    hikerPop.confirm({
                        content: u.url,
                        title: "订阅源：" + t,
                        okTitle: "启用",
                        cancelTitle: "删除",
                        hideCancel: false, //隐藏取消按钮
                        confirm() {
                            setItem("dy", t);
                            clearItem("m1");
                            clearItem("s0");
                            refreshPage(false);
                            return "toast://已切换 " + t;
                        },
                        cancel() {
                            return $("确认删除  " + t + " ？").confirm((name, teurl) => {
                                deleteFile("hiker://files/cache/FY/dy/" + name + ".json");
                                const result = teurl.filter(item => {
                                    return !(item.title == name);
                                });
                                saveFile("hiker://files/rules/FYJK/dy.json", JSON.stringify(result));
                                if (getItem("dy", "本地") == name) {
                                    clearItem("dy");
                                    clearItem("m1");
                                    clearItem("s0");
                                }
                                ;
                                refreshPage(false);
                                return "toast://已删除 " + name;
                            }, t, teurl);
                        }
                    });
                }
                ;
            });
        }
    });
    return "hiker://empty";
}, base64Encode(http), CT);

let url = [add, fen, ex, onf, dy];
for (let i in gl) {
    d.push({
        title: gl[i],
        pic: pic[i],
        col_type: "icon_5",
        url: i != 4 && !bdy ? "toast://订阅源不允许操作" : url[i],
        extra: {
            inheritTitle: false,
            id: i == 3 ? "yygl-4" : i == 4 ? "yygl-5" : "",
            longClick: i == 1 ? [{
                title: "复制",
                js: $.toString((类型, bdy) => {
                    let file = bdy ? "hiker://files/rules/FYJK/ys.json" : "hiker://files/cache/FY/dy/" + getItem("dy") + ".json";
                    let Json = JSON.parse(readFile(file));
                    let list = 类型(Json).map(JSON.stringify).join(',');
                    refreshPage(false);
                    return "copy://" + list;
                }, 类型, bdy)
            }, {
                title: "文件",
                js: $.toString((类型, bdy) => {
                    let file = bdy ? "hiker://files/rules/FYJK/ys.json" : "hiker://files/cache/FY/dy/" + getItem("dy") + ".json";
                    let Json = JSON.parse(readFile(file));
                    let list = 类型(Json).map(JSON.stringify).join(',');
                    saveFile("hiker://files/_cache/Fy/dy/风影订阅 " + 类型(Json).length + " 条.json", list);
                    return "hiker://explore?path=hiker://files/_cache/Fy/dy/";

                }, 类型, bdy)
            }] : ""
        }
    });
}
;

d.push({
    title: "查找",
    desc: "输 入 关 键 字 ！",
    url: $.toString(() => {
        putMyVar("input", input);
        refreshPage(false);
    }),
    col_type: "input",
    extra: {
        defaultValue: getMyVar("input", "")
    }
});

const Jst = Json.reduce((acc, item) => {
    if (item.gs === 'JS') {
        acc.Js++;
    } else if (item.gs === 'HOST') {
        acc.St++;
    }
    return acc;
}, {
    Js: 0,
    St: 0
});
let Js = Jst.Js;
let St = Jst.St;
let lent = ["总-" + Json.length, "JS-" + Js, "HOST-" + St];
for (let i in lent) {
    let li = lent[i];
    d.push({
        title: new RegExp(getMyVar("gs", "总")).test(li) ? "‘‘’’<b>" + li.fontcolor("#00cc99") + "</b>" : li,
        url: $("#noLoading#").lazyRule((i) => {
            let li = i == 0 ? "总" : i == 1 ? "JS" : "HOST";
            putMyVar("gs", li);
            refreshPage(false);
            return "hiker://empty";
        }, i),
        col_type: "text_3"
    });
}
;
d.push({
    col_type: "big_blank_block"
});

let titl = ["全部", "影视", "短剧", "动漫", "网盘", "音乐", "漫画", "小说", "听书", "其它", "失效"];
if (getItem("隐藏", "off") == "on") {
    titl.push("私有");
}
;

for (let i in titl) {
    d.push({
        title: getMyVar("glx", "全部") == titl[i] ? "‘‘’’<b>" + titl[i].fontcolor("#00cc99") + "</b>" : titl[i],
        col_type: "scroll_button",
        url: $("#noLoading#").lazyRule((tit) => {
            putMyVar("glx", tit);
            refreshPage(false);
            return "hiker://empty";
        }, titl[i]),
    })
}
;
d.push({
    col_type: "blank_block"
}, {
    col_type: "line"
});

let Jso = 类型(Json);
if (Jso.length != 0) {
    let syd = new Set();
    let sod = new Set();
    for (let l in Jso) {
        let li = Jso[l];
        let name = li.name.replace(/&&.*/g, "");
        if ((li.fl !== "" || li.sy !== "") && li.gs !== "HOST" || (li.gs === "HOST" && li.host !== "")) {
            syd.add(name);
        }
        if ((li.so !== "" && li.gs !== "HOST") || (li.gs === "HOST" && li.sourl !== "")) {
            sod.add(name);
        }
        let y = syd.has(name) ? "首" : "";
        let s = sod.has(name) ? "搜" : "";
        let sxtit = typeof (li.sxtit) == "string" ? li.sxtit : "";
        d.push({
            title: name + ("「 " + y + " " + s + " " + li.gs + " 」") + (getMyVar("glx") == "失效" ? ("<small>" + sxtit + "</small>") : ""),
            pic: li.off != "1" ? "hiker://images/icon_star_fill_red" : "hiker://images/icon_star_fill_green",
            desc: "<small>By - " + (!/&&/.test(li.name) ? "未知" : li.name.replace(/.*&&/g, "")) + "</small>",
            col_type: "avatar",
            extra: {
                inheritTitle: false
            },
            url: $(bdy ? ["编辑", "删除", "分享", "移动", "改名", li.off != "1" ? "启用" : "停用", "复制", "文件"] : ["编辑", "复制", "文件"], 2, li.name.replace(/&&.*/g, "")).select((name, 类型, bdy) => {
                let list;
                let file = bdy ? "hiker://files/rules/FYJK/ys.json" : "hiker://files/cache/FY/dy/" + getItem("dy") + ".json";
                try {
                    list = JSON.parse(readFile(file) || []);
                } catch (e) {
                    list = [];
                    console.error('解析文件内容出错:', e);
                }
                ;
                if (input == "编辑") {
                    const result = list.filter(item => {
                        return item.name == name;
                    });
                    //log(result[0].name);
                    putMyVar("namejs", result[0].name);
                    putMyVar('hostjs', result[0].host);
                    putMyVar('sourljs', result[0].sourl);
                    putMyVar('syjs', result[0].sy);
                    putMyVar('fljs', result[0].fl);
                    putMyVar('erjs', result[0].er);
                    putMyVar("sojs", result[0].so);
                    putMyVar("gs", result[0].gs);
                    putMyVar("gyjs", result[0].gy != undefined ? result[0].gy : "");
                    putMyVar("pdfg", "1");
                    return $("hiker://empty#noRecordHistory##noHistory##noRefresh#").rule(() => {
                        require(config.依赖);
                        Add()
                    });
                } else if (input == "删除") {
                    return $("确认删除  " + name.replace(/&&.*/g, "") + " ？").confirm((name, list, file) => {
                        const result = list.filter(item => {
                            return !(item.name == name);
                        });
                        saveFile(file, JSON.stringify(result));
                        refreshPage(false);
                        return "toast://已删除 " + name.replace(/&&.*/g, "");
                    }, name, list, file);
                } else if (input == "分享") {
                    return $(["完整编码", "文件Hiker", "文件TXT"].concat(getPastes()), 2, "分享方式").select((names, list) => {
                        list = list.filter(item => {
                            return item.name == names;
                        });
                        let no = list.length;
                        let resb64 = base64Encode(JSON.stringify(list));
                        let getPass = (name, rule, type) => "海阔视界「风影源 - " + names.replace(/&&.*/g, "") + "」，复制整条口令自动导入$" + rule + "$" + type + "@import=js:$.require('import?rule='+" + JSON.stringify(MY_RULE.title) + ")(input)";

                        if (input == "完整编码") {
                            return "copy://" + getPass(no, resb64, "a");
                        } else if (getPastes().includes(input)) {
                            let share = sharePaste(resb64, input);
                            return "copy://" + getPass(no, base64Encode(share), "b");
                        } else {
                            let path = "hiker://files/_cache/风影源 - " + names.replace(/&&.*/g, "") + "." + (input === "文件Hiker" ? "hiker" : "txt");
                            writeFile(path, getPass(no, resb64, "c"));
                            return "share://" + path;
                        }
                    }, name, list)
                } else if (input == "移动") {
                    return $("#noLoading#").lazyRule((name, Json, file, 类型) => {
                        let list = 类型(Json);
                        let coun = list.length;
                        let array = Array.from({
                            length: coun
                        }, (_, index) => index + 1);
                        //console.log(array);

                        let target = list.find(item => item.name == name);
                        //log(target);

                        // 使用findIndex方法找到b在a中的位置
                        let index = list.findIndex(item => item.name === target.name);

                        const hikerPop = $.require(config.依赖.replace(/[^/]*$/, "hikerPop.js"));
                        hikerPop.selectCenterMark({
                            options: array,
                            title: name.replace(/&&.*/g, "") + " 移至第几位",
                            position: index,
                            icons: new Array(coun).fill(hikerPop.icon.main_menu_home),
                            //noAutoDismiss: true,
                            click(a) {
                                let targetIndex = -1;
                                let count = 0;
                                for (let i = 0; i < list.length; i++) {
                                    if (count == parseInt(a) - 1) {
                                        targetIndex = i;
                                        break;
                                    }
                                    count++;
                                }
                                ;
                                // 确保目标索引在合理范围内
                                if (targetIndex >= 0 && targetIndex <= list.length) {
                                    // 将元素从原位置删除
                                    list.splice(list.indexOf(target), 1);
                                    // 将元素添加到目标位置
                                    list.splice(targetIndex, 0, target);
                                } else {
                                    console.error("找不到目标索引，无法移动元素");
                                }
                                ;

                                let resultList = [];
                                // 先将 list 中的所有元素添加到 resultList

                                list.forEach(item => {
                                    resultList.push(item);
                                });
                                // 再检查 Json 数组中的元素是否已经在 resultList 中 
                                Json.forEach(jsonItem => {
                                    const existsInList = list.some(listItem => listItem.name === jsonItem.name);

                                    if (!existsInList) {
                                        // 如果 Json 中的元素不在 list 中，则添加到 resultList 的末尾
                                        resultList.push(jsonItem);
                                    }
                                });

                                // 保存文件
                                saveFile(file, JSON.stringify(resultList));
                                refreshPage(false);
                                return "toast://移动至第 " + a + " 位";
                            }
                        });
                        return "hiker://empty";
                    }, name, list, file, 类型)
                } else if (input == "启用") {
                    const updatedList = list.map(item => {
                        if (item.name === name) {
                            const newItem = Object.assign({}, item, {
                                off: "1"
                            });
                            return newItem;
                        }
                        return item;
                    });
                    saveFile(file, JSON.stringify(updatedList));
                    refreshPage(false);
                    return "toast://已启用 " + name.replace(/&&.*/g, "");
                } else if (input == "停用") {
                    const datedList = list.map(item => {
                        if (item.name === name) {
                            const newItem = Object.assign({}, item, {
                                off: "0"
                            });
                            return newItem;
                        }
                        return item;
                    });
                    saveFile(file, JSON.stringify(datedList));
                    refreshPage(false);
                    return "toast://已停用 " + name.replace(/&&.*/g, "");
                } else if (input == "改名" && bdy) {
                    return $("#noLoading#").lazyRule((name, list, file) => {
                        const hikerPop = $.require(config.依赖.replace(/[^/]*$/, "hikerPop.js"));
                        hikerPop.inputAutoRow({
                            hint: "修改",
                            title: name.replace(/&&.*/, ""),
                            defaultValue: name,
                            //hideCancel: true,
                            noAutoSoft: false, //不自动打开输入法
                            confirm(text) {
                                const nameList = list.map(item => {
                                    if (item.name === name) {
                                        const newItem = Object.assign({}, item, {
                                            name: text
                                        });
                                        return newItem;
                                    }
                                    return item;
                                });
                                saveFile(file, JSON.stringify(nameList));
                                refreshPage(false);
                                return "toast://修改为 " + text;
                            },
                            cancel() {
                                return "toast://取消";
                            }
                        });
                        return "hiker://empty";
                    }, name, list, file);
                } else if (input == "复制") {
                    let txt = 类型(list).filter(item => {
                        return item.name == name;
                    }).map(JSON.stringify).join(',');
                    refreshPage(false);
                    return "copy://" + txt;
                } else if (input == "文件") {
                    let txt = 类型(list).filter(item => {
                        return item.name == name;
                    }).map(JSON.stringify).join(',');
                    saveFile("hiker://files/_cache/Fy/dy/" + name + ".json", txt);
                    return "hiker://explore?path=hiker://files/_cache/Fy/dy/";
                }
                ;
            }, li.name, 类型, bdy)
        });
    }
    ;
} else {
    d.push({
        title: "<br>",
        col_type: "rich_text"
    }, {
        desc: "没有此类源！",
        url: "hiker://empty",
        col_type: "text_center_1",
        extra: {
            lineVisible: false
        }
    })
}
setResult(d);
addListener("onClose", $.toString(() => {
    clearMyVar("Mysou");
    clearMyVar("bak");
    clearMyVar("影搜");
    clearMyVar("so_List");
}));
let s = [];
let d = [];
putMyVar("影搜", "1");
let sokey = getMyVar("Mysou");
let page = MY_PAGE;

let rn = getMyVar("namejs", "null") != "null" ? [getMyVar("namejs").replace(/&&.*/, "")] : off1.filter(item => (item.so != "" && item.gs != "HOST") || item.gs == "HOST").map(item => item.name.replace(/&&.*/, ""));
let selected = getMyVar("namejs", "null") != "null" ? getMyVar("namejs").replace(/&&.*/, "") : getItem("s0", rn[0]);

function sul(page, sokey, off1, Json, selected, file) {
    let names = getMyVar("namejs", "null") != "null" ? getMyVar("namejs").replace(/&&.*/, "") : off1.find(item => item.name.replace(/&&.*/, "") === selected);
    try {
        if (names) {
            function rep(text, page, sokey, SURL, Time) {
                return text.replace("GBK**", encodeStr(sokey, 'GBK')).replace("fypage", page).replace("**", sokey).replace("SURL", SURL).replace("Time", Time);
            }
            try {
                let syurl;
                if (names.fbhost == "" || getMyVar("namejs", "null") != "null") {
                    let s = getMyVar("namejs", "null") != "null" ? getMyVar("hostjs") : names.host;
                    let syur = new Function(s);
                    toast("获取域名中，请稍后！");
                    syurl = syur();
                    if (getMyVar("namejs", "null") == "null") {
                        let dList = Json.map(item => {
                            if (item.name.replace(/&&.*/, "") === selected) {
                                const newItem = Object.assign({}, item, {
                                    fbhost: syurl
                                });
                                return newItem;
                            }
                            return item;
                        });
                        saveFile(file, JSON.stringify(dList));
                    }

                } else {
                    syurl = names.fbhost;
                }

                var SURL = getHome(syurl);
                ssurl = getMyVar("sourljs", "null") != "null" ? rep(getMyVar("sourljs"), page, sokey, SURL, new Date().getTime()) : rep(names.sourl, page, sokey, SURL, new Date().getTime());
            } catch (e) {
                let s = getMyVar("namejs", "null") != "null" ? getMyVar("hostjs") : names.host;
                var SURL = getHome(s);
                ssurl = getMyVar("sourljs", "null") != "null" ? rep(getMyVar("sourljs"), page, sokey, SURL, new Date().getTime()) : rep(names.sourl, page, sokey, SURL, new Date().getTime());
            }

        } else {
            ssurl = "http://fenying";
        }

    } catch (e) {
        clearItem("s0");
        refreshPage(false);
    }

    return ssurl;
}
ssurl = sul(page, sokey, off1, Json, selected, file);

let jusou = getItem("s1", "0") == "1";
let sotu = "hiker://files/cache/FY/image/";
if (page == 1) {
    /*let bia = lie.map((tit) => {
        return tit == getItem("h1", "三列") ? '““<b>' + tit + '</b>””' : tit;
    });*/

    s.push({
            title: getSearchMode() == "0" ? "默认" : "精准",
            url: $("#noLoading#").lazyRule(() => {
                setSearchMode(getSearchMode() ? 0 : 1);
                refreshPage(false);
                return "hiker://empty";
            }),
            img: getSearchMode() == "0" ? sotu + "默认.png" : sotu + "精准.png",
            col_type: "icon_3_fill"
        }, {
            title: jusou ? "聚搜" : "选源",
            url: $("#noLoading#").lazyRule(() => {
                if (getItem("s1", "0") == "1") {
                    clearItem("s1");
                } else {
                    setItem("s1", "1");
                }

                refreshPage(false);
                return "hiker://empty";
            }),
            img: sotu + (jusou ? "聚搜.png" : "单搜.png"),
            col_type: "icon_3_fill"
        }, {
            title: getItem("h1", "三列"),
            url: $("#noLoading#").lazyRule(() => {
                const hikerPop = $.require(config.依赖.replace(/[^/]*$/, "hikerPop.js"));
                hikerPop.selectAttachList("id_sosx", {
                    options: ["竖列", "双列", "三列"],
                    click(input) {
                        hikerPop.runOnNewThread(() => {

                            let list = findItemsByCls("cls_soys") || [];
                            if (list.length == 0) {
                                return "hiker://empty";
                            }


                            if (!/movie\_1\_vertical\_pic|movie\_2|movie\_3/.test(list[0].type)) return "toast://此排列不支持切换";

                            setItem("h1", input.replace(/\“|\”|\<b\>|\<\/b\>/g, ""));
                            let h1 = getItem("h1", "三列");
                            updateItem("id_sosx", {
                                title: h1
                            })

                            function stripHtmlTags(str) {
                                str = str.replace(/<[^>]*>/g, "");
                                str = str.replace(/‘|’/g, "");
                                return str;
                            }
                            let col = h1 == "竖列" ? "movie_1_vertical_pic" : h1 == "双列" ? "movie_2" : "movie_3";
                            for (let li of list) {
                                let id = li.extra.id;
                                updateItem(id, {
                                    title: col == "movie_1_vertical_pic" ? "‘‘’’<b>" + li.title.replace(new RegExp(getMyVar("Mysou")), getMyVar("Mysou").fontcolor("#FA7298")) + "</b>" : stripHtmlTags(li.title),
                                    col_type: col
                                })
                            }

                        });
                    }
                });
                return "hiker://empty";
            }),
            img: sotu + "搜索排列.png",
            col_type: "icon_3_fill",
            extra: {
                id: "id_sosx"
            }
        }
        /*, {
                col_type: "line"
            }*/
    );
    let 私;
    if (getItem("隐藏", "off") == "on") {
        私 = "私有";
    }

    let titl = ["全部", "影视", "短剧", "动漫", "网盘", "音乐", "漫画", "小说", "听书", "其它"];
    if (私) {
        titl.push(私);
    }

    let bia = titl.map((tit) => {
        return tit == getItem("lx1", "全部") ? '““<b>' + tit + '</b>””' : tit;
    });
    s.push({
        title: "<small>类型 <b>" + getItem("lx1", "全部").fontcolor("#FA7298") + "</b></small>",
        url: $(bia, 2, "选择类型").select(() => {
            setItem("lx1", input.replace(/\“|\”|\<b\>|\<\/b\>/g, ""));
            clearItem("s0");
            clearItem("m1");
            refreshPage(false);
            return "toast://已选择 " + input.replace(/.*>(.*?)<.*/, "$1");
        }),
        img: sotu + "切换类型.png",
        col_type: "icon_small_3"
    });

    if (!jusou) {
        let xy = rn.map((tit) => {
            return tit === selected ? '““<b>' + tit + '</b>””' : tit;
        });
        s.push({
            col_type: "icon_small_3",
            url: "hiker://empty"
        }, {
            title: "<small>已选<b>" + selected.fontcolor("#FA7298") + "</b></small>",
            url: $(xy, 3, "搜索源").select(() => {
                setItem("s0", input.replace(/\“|\”|\<b\>|\<\/b\>/g, ""));
                refreshPage(false);
                return "toast://已选择 " + input.replace(/.*>(.*?)<.*/, "$1");
            }),
            col_type: "icon_small_3",
            extra: {
                longClick: getItem("dy", "本地") == "本地" ? [{
                    title: "删除 " + selected,
                    js: $.toString((name) => {
                        return $("删除后不可恢复，确认删除  " + name + " ？").confirm((name) => {
                            let list;
                            let file = "hiker://files/rules/FYJK/ys.json";
                            try {
                                list = JSON.parse(readFile(file));
                            } catch (e) {
                                list = [];
                                console.error('解析文件内容出错:', e);
                            }

                            const result = list.filter(item => {
                                return !(item.name.replace(/&&.*/g, "") == name);
                            });
                            saveFile(file, JSON.stringify(result));
                            clearItem("s0");
                            refreshPage(false);
                            return "toast://已删除 " + name;
                        }, name);
                    }, selected)
                }] : ""
            }
        });
    }


    s.push({
        title: "搜索",
        desc: "可 以 少 字 ，不 可 错 字 ！",
        url: $.toString(() => {
            putMyVar("Mysou", input);
            if (getMyVar("Mysou")) {
                return input + $("#noLoading#").lazyRule(() => {
                    require(config.依赖);
                    return sourl()
                });
            } else {
                return "hiker://empty";
            }

        }),
        col_type: "input",
        extra: {
            defaultValue: sokey,
            /*id: "solx",
            onChange: $.toString((sokey) => {
                if (input.length == 0) {
                    deleteItemByCls("newz");
                }
                if (input.length > 0 && input != sokey) {
                    deleteItemByCls("newz");
                    let html = request("https://movie.douban.com/j/subject_suggest?q=" + input, {
                        timeout: 3000
                    });
                    let list = JSON.parse(html) || [];
                    let newz = list.map(li => {
                        try {
                            let pic = li.img;
                            return {
                                title: li.title,
                                img: pic != "" ? pic + "@Referer=" : http + "tu/fy.png@Referer=",
                                desc: "年份：" + li.year,
                                url: li.title + $("#noLoading#").lazyRule(() => {
                                    require(config.依赖);
                                    return sourl()
                                }),
                                col_type: "movie_2",
                                extra: {
                                    cls: "newz"
                                }
                            }
                        } catch (e) {}
                    });
                    if (newz.length > 0) {
                        addItemAfter("solx", newz);
                    }
                }
            }, sokey)*/
        }
    });

    if (getMyVar("Mysou")) {
        let erji = MY_PARAMS.erji;
        s.push({
            title: "<small>搜索\t\t<b>" + getMyVar("Mysou").fontcolor("#FA7298") + "</b>\t\t结果</small>",
            desc: "<small><b>返回\t➧\t\t".fontcolor("#FA7298") + "</b></small>",
            url: $("#noLoading#").lazyRule((erji) => {
                if (erji == "1") {
                    back(false);
                } else {
                    clearMyVar("Mysou");
                    refreshPage(false);
                }
                return "hiker://empty"
            }, erji),
            img: sotu + "搜标.png",
            col_type: "avatar"
        }, {
            col_type: "big_blank_block"
        });
        if (!jusou) {
            s.push({
                col_type: "line"
            }, {
                col_type: "big_blank_block"
            })
        }

    }

    s.push({
        img: sotu + "Loading.gif",
        url: "hiker://empty",
        col_type: "pic_1_center",
        extra: {
            cls: "cls_load"
        }
    })
}

setPreResult(s);

if (getMyVar("Mysou")) {
    try {
        if (!jusou) {
            require(http + "sdw.js");

            search(http, game, selected, ssurl, d, MY_PAGE, sokey, off1, Json);
            setResult(d);
        } else {
            //聚搜
            let 线程数 = 8;
            let Data = [];
            for (let i = (MY_PAGE - 1) * 线程数; i < rn.length && i < MY_PAGE * 线程数; i++) {
                Data.push(rn[i]);
            }
            if (Data.length <= 0) {
                setResult(d);
            } else {
                let pageid = "__app0" + MY_PAGE;
                d.push({
                    title: "正在加载中第" + MY_PAGE + "页，进度：1/" + Data.length,
                    url: "hiker://empty",
                    col_type: "text_center_1",
                    desc: "",
                    pic_url: "",
                    extra: {
                        id: pageid
                    }
                });
                setResult(d);

                let tasks = [];
                for (let k in Data) {
                    let it = Data[k];
                    tasks.push({
                        func: function (param) {
                            let d = [];
                            require(http + "sdw.js");
                            search(http, game, param.n, param.u, d, 1, sokey, off1, Json);
                            return {
                                d: d,
                                n: param.n
                            };
                        },
                        param: {
                            u: sul(1, sokey, off1, Json, it, file),
                            n: it
                        }
                    });
                }

                batchExecute(tasks, {
                    func: function (param, id, error, result) {
                        //log("listener: " + (result || []).length);
                        param.i = param.i + 1;
                        if (result) {
                            let d = [];
                            d.push({
                                col_type: "line"
                            }, {
                                title: "‘‘’’<b>" + result.n + "</b>" + " (" + (result.d.length <= 0 ? "无结果" : result.d.length) + ")",
                                url: "hiker://empty",
                                col_type: "text_1",
                                extra: {
                                    id: "sc" + result.n,
                                    lineVisible: false,
                                    longClick: getItem("dy", "本地") == "本地" ? [{
                                        title: "删除 " + result.n,
                                        js: $.toString((name) => {
                                            return $("删除后不可恢复，确认删除  " + name + " ？").confirm((name) => {
                                                let file = "hiker://files/rules/FYJK/ys.json";
                                                let list = JSON.parse(readFile(file));
                                                const result = list.filter(item => {
                                                    return !(item.name.replace(/&&.*/g, "") == name);
                                                });
                                                saveFile(file, JSON.stringify(result));
                                                clearItem("s0");
                                                deleteItem("sc" + name);
                                                deleteItemByCls("cls_" + name);
                                                return "toast://已删除 " + name;
                                            }, name);
                                        }, result.n)
                                    }] : ""
                                }
                            });
                            for (let it of result.d) {
                                param.j = param.j + 1;
                                d.push(it);
                            }
                            addItemBefore(pageid, d);
                        }

                        if (param.i >= param.all) {
                            deleteItem(pageid)
                        } else {
                            updateItem({
                                title: "正在加载第" + MY_PAGE + "页，进度：" + (param.i + 1) + "/" + param.all,
                                url: "hiker://empty",
                                col_type: "text_center_1",
                                desc: "",
                                pic_url: "",
                                extra: {
                                    id: pageid
                                }
                            })
                        }
                    },
                    param: {
                        all: Data.length,
                        i: 0,
                        j: -1
                    }
                });
            }

        }

    } catch (e) {
        log(e.toString());
        setResult(d);
    }

} else {
    if (page == 1) {
        let flie = ["电影", "剧集", "动漫", "综艺"];
        let flei = getItem("rskey", "电影").replace("剧集", "电视剧");
        d.push({
            title: '<span style="color:#ff6600"><b>\t热搜榜\t\t\t</b></span>',
            desc: '<b><span style="color:#19B89D">' + flei + "</span></b>\t\t",
            url: $(flie, 2, "切换类型").select(() => {
                setItem("rskey", input);
                refreshPage(false);
                return "hiker://empty";
            }),
            pic_url: sotu + "热搜.jpg",
            col_type: "avatar"
        }, {
            col_type: "big_blank_block"
        }, {
            col_type: "line"
        }, {
            col_type: "big_blank_block"
        });

        //let rso = "https://waptv.sogou.com/hotsugg";
        let LT;
        try {
            eval("var res = " + readFile("hiker://files/cache/FY/reso.js"), 0);
            LT = res.lt;
        } catch (e) {
            LT = "0";
        }


        if (!fileExist("hiker://files/cache/FY/reso.js") || CT > (LT + 2 * 24 * 60 * 60 * 1000) || getItem("jcbh", "0") != flei) {
            setItem("jcbh", flei);
            let url = "https://news.myquark.cn/v2/toplist/movie?&channel=" + flei + "&rank_type=%E6%9C%80%E7%83%AD";
            //let 小说 = "https://news.myquark.cn/v2/toplist/novel?&channel=男频&rank_type=%E6%9C%80%E7%83%AD";
            let json = (JSON.parse(fetch(url)).data || []).replace(/title>/g, "f_title>").replace(/src>/g, "f_src>").replace(/area>/g, "f_area>");
            let lists = pdfa(json, "body&&item")
            //log(list)
            let trend = ["-", "↑", "↓"];
            let list = [];
            for (let i in lists) {
                let li = lists[i];
                let title = pdfh(li, "f_title&&Text");
                let area = pdfh(li, "f_area&&Text");
                let category = pdfh(li, "category&&Text");
                let year = pdfh(li, "year&&Text");
                let hot = pdfh(li, "hot_score&&Text");
                let episode = pdfh(li, "episode_count&&Text");
                let score = pdfh(li, "score_avg&&Text").replace(/^0$/g, "暂无");
                let hot_trend = pdfh(li, "hot_trend&&Text");
                let pai = parseInt(i) + 1 + "\t";
                let tren = trend.at(hot_trend);
                let hot_tr = (hot / 10000).toFixed(1);
                let hot_tren = "热搜指数：" + hot_tr + "万";

                let hot_tre = hot_tr > 65 ? hot_tren.fontcolor("#00cc99") : hot_tr < 33 ? hot_tren : hot_tren.fontcolor("#1e90ff");

                let one = pai == 1 ? pai.fontcolor("#ff1100") : pai == 2 ? pai.fontcolor("#ff8800") : pai == 3 ? pai.fontcolor("#FFA500") : pai == 4 ? pai.fontcolor("#ffcc66") : pai == 5 ? pai.fontcolor("#f0e68c") : pai.fontcolor("#999999");

                let tit = "‘‘’’<b>" + one + title + "</b><br>\t\t<small>" + (year + " | " + area + " | " + category).fontcolor("#FA7298") + "</small>";

                let des = "‘‘’’\t\t" + (episode + "<br>\t\t评分：" + score).fontcolor("#274c5e") + "<br>\t\t" + hot_tre;

                list.push(
                    tit + "$" + des + "$$" + pdfh(li, "f_src&&Text") + "$$$" + title)
            }

            var reso = {
                "lt": CT,
                "list": list
            };
            saveFile("hiker://files/cache/FY/reso.js", JSON.stringify(reso), 0);
        }

        let list = typeof (reso) != "undefined" ? reso.list : res.list;
        for (let r of list) {
            d.push({
                title: r.split("$")[0],
                desc: r.split("$")[1].split("$$")[0],
                img: r.split("$$")[1].split("$$$")[0],
                url: r.split("$$$")[1] + $('#noLoading#').lazyRule(() => {
                    require(config.依赖);
                    return sourl()
                }),
                col_type: "movie_1_vertical_pic"
            })
        }

        deleteItemByCls("cls_load");
        setResult(d);
    }

}

//by随风
//聚搜模板
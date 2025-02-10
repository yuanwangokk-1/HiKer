let d = [];
let s = [];
addListener("onClose", $.toString(() => {
    clearMyVar("zgli");
    clearMyVar("fys");
}));
putMyVar("fys", "0");
let bt = ["影视", "小说", "漫画", "听书", "其它"];
let pic1 = "hiker://files/cache/FY/image/";
let btget = getItem("zgb", "影视");
for (let i in bt) {
    s.push({
        title: btget == bt[i] ? "‘‘’’<b>" + bt[i].fontcolor("#FA7298") + "</b>" : bt[i],
        img: pic1 + (/其它/.test(bt[i]) ? "追" + bt[i] : bt[i]) + ".png",
        url: $("#noLoading#").lazyRule((li) => {
            setItem("zgb", li);
            refreshPage(false);
            return "hiker://empty";
        }, bt[i]),
        col_type: "icon_5"
    });
}
;

require(config.依赖.replace(/[^/]*$/, "public.js"));

s.push({
    title: ymdhm().split("#")[0].replace(/-/g, "."),
    img: `${pic1}追更.png`,
    url: $(["竖列", "双列", "三列", "单行"], 2, "样式").select(() => {
        if (input == "竖列") {
            setItem("zglie", "movie_1_vertical_pic");
        } else if (input == "双列") {
            setItem("zglie", "movie_2");
        } else if (input == "三列") {
            setItem("zglie", "movie_3_marquee");
        } else if (input == "单行") {
            setItem("zglie", "avatar");
        }
        ;
        refreshPage(false);
        return "hiker://empty";
    }),
    col_type: "icon_small_3"
}, {
    url: "hiker://empty",
    col_type: "icon_small_3"
}, {
    title: ymdhm().split("#")[1],
    url: $(["分享全部", "分享影视", "分享小说", "分享漫画", "分享听书", "分享其它", "删除全部", "删除影视", "删除小说", "删除漫画", "删除听书", "删除其它"], 2).select(() => {
        require(config.依赖.replace(/[^/]*$/, "public.js"));

        function ex(get) {
            return $("确认" + input + "追更 ？").confirm((get, file) => {
                let list = JSON.parse(readFile(file));
                delete list[get];
                saveFile(file, JSON.stringify(list));
                refreshPage(false);
                return "toast://已删除";
            }, get, file)
        };
        let list = pat();
        if (input == "分享全部") {
            return Fxq("qb");
        } else if (input == "分享影视") {
            return Fxq("ys");
        } else if (input == "分享小说") {
            return Fxq("xs");
        } else if (input == "分享漫画") {
            return Fxq("mh");
        } else if (input == "分享听书") {
            return Fxq("ts");
        } else if (input == "分享其它") {
            return Fxq("qt");
        } else if (input == "删除全部") {
            return $("确认" + input + "追更 ？").confirm((file) => {
                deleteFile(file);
                refreshPage(false);
                return "toast://已删除";
            }, file)
        } else if (input == "删除影视") {
            return ex("ys");
        } else if (input == "删除小说") {
            return ex("xs");
        } else if (input == "删除漫画") {
            return ex("mh");
        } else if (input == "删除听书") {
            return ex("ts");
        } else if (input == "删除其它") {
            return ex("qt");
        }
        ;
    }),
    col_type: "icon_small_3"
});

let zgzl = ["历史", "收藏", "周更", "日更", "完更"];
let fyzg = getItem("fyzg", "周更");
for (let z in zgzl) {
    let li = zgzl[z];
    s.push({
        title: "‘‘’’<small>" + (fyzg == li ? "<b>" + li.fontcolor("#FA7298") + "</b>" : li) + "</small>",
        url: $("#noLoading#").lazyRule((li) => {
            if (li === "收藏") {
                return "hiker://collection?rule=" + MY_RULE.title;
            } else if (li === "历史") {
                return "hiker://history?rule=" + MY_RULE.title;
            } else {
                setItem("fyzg", li);
                refreshPage(false);
                return "hiker://empty";
            }
            ;
        }, li),
        col_type: "text_5"
    });
}
;

//周历表
let Day = WeekDay(week);
if (fyzg == "周更") {
    s.push({
        col_type: "big_blank_block"
    });
    for (let j in week) {
        let li = week[j];
        s.push({
            title: Day == getMyVar("zgli", Day) && Day == li ? "‘‘’’<b>" + ("周" + li + "</b>").fontcolor("#FA7298") : getMyVar("zgli") == li ? "‘‘’’<b>周" + li + "</b>" : li,
            url: $("#noLoading#").lazyRule((li) => {
                putMyVar("zgli", li);
                refreshPage(false);
                return "hiker://empty";
            }, li),
            col_type: "scroll_button",
        });
    }
    ;
}
;

s.push({
    col_type: "rich_text",
    extra: {
        cls: "cls_load"
    }
}, {
    img: pic1 + "Loading.gif",
    url: "hiker://empty",
    col_type: "pic_1_center",
    extra: {
        cls: "cls_load"
    }
});
setPreResult(s);

let get = btget == "影视" ? "ys" : btget == "小说" ? "xs" : btget == "其它" ? "qt" : btget == "漫画" ? "mh" : btget == "听书" ? "ts" : "";

let lizso = pat()[get] || [];

if (!RegExp(getMyVar("zgli", Day)).test(JSON.stringify(lizso)) && fyzg == "周更" || lizso.length == "0" && (fyzg == "日更" || fyzg == "完更")) {
    d.push({
        title: "<br>",
        col_type: "rich_text"
    }, {
        desc: "还没有添加追更",
        url: "hiker://empty",
        col_type: "text_center_1",
        extra: {
            lineVisible: false
        }
    });
}
;

let col = getItem("zglie", "movie_1_vertical_pic");
for (let l in lizso) {
    let li = lizso[l];
    if (fyzg == "周更" && li.week == getMyVar("zgli", Day) || fyzg == "完更" && li.week == "1" || fyzg == "日更" && li.week == "0") {
        let wei = /影视|其它/.test(btget) ? "集" : /漫画/.test(btget) ? "话" : "章";
        let item = li.gs.length == 2 ? `${li.gs}:00` : `${li.gs.slice(0, 2)}:${li.gs.slice(-2)}`;
        let gxbj = fyzg == "周更" ? `周${li.week}${item}更新${li.gj}${wei}` : fyzg == "日更" ? `每日${item}更新${li.gj}${wei}` : "已完结无更新";

        let zjs = li.desz != "" ? ` / 共${li.desz}${wei}` : "";
        let TJ = fyzg == "周更" ? (ymdhm().split("#")[1] >= item && Day == li.week && li.desc != zjs) : (ymdhm().split("#")[1] >= item && "0" == li.week && li.desc != zjs);
        let des = TJ ? '<font color = "#FA7298">' + li.desc + "</font>" : '<font color = "#6A5ACD">' + (fyzg == "周更" ? (Day == li.week && li.desc != zjs ? li.desc - li.gj : li.desc) : li.desc != zjs ? li.desc - li.gj : li.desc) + "</font>";
        let xzu;
        if (btget == "小说") {
            xzu = History(li.url, get);
        }
        ;
        let zu = /^\d+$/.test(li.zuji) ? `第${parseInt(xzu) > parseInt(li.zuji) ? xzu : li.zuji}${wei}` : li.zuji;
        let z = zu != "undefined" ? zu.replace(/[^0-9]/g, "") : "";

        let des1 = parseInt(z) > parseInt(des.match(/>(.*?)</)[1]) ? des.replace(/>(.*?)</, ">" + z + "<") : des;

        let tai = fyzg == "完更" ? `${(li.desc == "" ? "无更新" : li.desc).fontcolor("#6A5ACD")}` : `${"第".fontcolor("#6A5ACD")}${des1}${wei.fontcolor("#6A5ACD")}`;

        let title;
        let desc;
        if (col == "movie_1_vertical_pic") {
            title = `‘‘’’<b>${li.title}</b>\n<small>${fyzg.fontcolor("#274c5e")}${"：".fontcolor("#274c5e")}${gxbj.fontcolor("#19B89D")}</small>`;
            desc = `‘‘’’${"状态：".fontcolor("#274c5e")}${tai}${zjs.fontcolor("#6A5ACD")}\n${"足迹：".fontcolor("#274c5e")}${zu.fontcolor("#6A5ACD")}\n${"来源：".fontcolor("#274c5e")}${li.pageTitle.fontcolor("#6e99ff")}`;
        } else {
            title = `${li.title}`;
            desc = `${fyzg == "完更" ? (li.desc == "" ? "无更新" : li.desc) : `第${des1.replace(/.*>(.*?)<\/.*/, "$1")}${wei}${zjs}`} · ${zu} · ${li.pageTitle}`;
        }
        ;

        d.push({
            title: title,
            desc: desc,
            img: li.img,
            url: base64Decode(li.url),
            col_type: col,
            extra: {
                title: li.title,
                desc: fyzg == "完更" ? `${li.desc}` : `第${des1.replace(/.*>(.*?)<\/.*/, "$1")}${wei}${zjs}`,
                img: li.img,
                inheritTitle: false,
                pageTitle: `${li.title}「${li.pageTitle}」`,
                id: "id_fyfmxz" + l,
                longClick: [{
                    title: "搜索",
                    js: $.toString((btget, tit) => {
                        setItem("lx1", btget);
                        clearMyVar("fys");
                        return tit + $("#noLoading#").lazyRule(() => {
                            require(config.依赖);
                            return sourl()
                        });
                    }, btget, li.title)
                }, {
                    title: "修改",
                    js: $.toString((btget, tit, des, img, url, Title, zuji, gen, wek, gj, gs, desz) => {
                        require(config.依赖.replace(/[^/]*$/, "public.js"));
                        return jrzg(btget, tit, des, img, url, Title, zuji, gen, wek, gj, gs, desz);
                    }, btget, li.title, li.desc, li.img, li.url, li.pageTitle, li.zuji, fyzg, li.week, li.gj, li.gs, li.desz)
                }, {
                    title: "删除",
                    js: $.toString((get, tit, url) => {
                        require(config.依赖.replace(/[^/]*$/, "public.js"));
                        return ex(get, tit, url);
                    }, get, li.title, li.url)
                }, {
                    title: "移动",
                    js: $.toString((get, url, wek) => {
                        require(config.依赖.replace(/[^/]*$/, "public.js"));
                        return Yd(get, url, wek);
                    }, get, li.url, li.week)
                }, {
                    title: "封面",
                    js: $.toString((get, i, tit, url, img) => {
                        if (img != "") {
                            return $("已存在封面，是否更换？").confirm((get, i, tit, url) => {
                                require(config.依赖.replace(/[^/]*$/, "public.js"));
                                return Fm(get, i, tit, url);
                            }, get, i, tit, url)
                        } else {
                            require(config.依赖.replace(/[^/]*$/, "public.js"));
                            return Fm(get, i, tit, url);
                        }
                        ;
                    }, get, l, li.title, li.url, li.img)
                }, {
                    title: "分享",
                    js: $.toString((get, tit, url) => {
                        require(config.依赖.replace(/[^/]*$/, "public.js"));
                        return Fx(get, tit, url);
                    }, get, li.title, li.url)
                }, {
                    title: "调整",
                    js: $.toString((btget, tit, des, img, url, Title, zuji, gen, wek, gj, gs, desz) => {
                        require(config.依赖.replace(/[^/]*$/, "public.js"));
                        return Tz(btget, tit, des, img, url, Title, zuji, gen, wek, gj, gs, desz);
                    }, btget, li.title, li.desc, li.img, li.url, li.pageTitle, li.zuji, fyzg, li.week, li.gj, li.gs, li.desz)
                }]
            }
        })
    }
    ;
}
;
deleteItemByCls("cls_load");
setResult(d);
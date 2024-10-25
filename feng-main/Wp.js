let d = [];
addListener("onClose", $.toString(() => {
    clearMyVar("li");
    clearMyVar("s");
    clearMyVar("周list");
    clearMyVar("zjhtml");
    clearMyVar("leixin");
}));

let zlei = ["追更周历", "最近更新"];
for (let x in zlei) {
    let li = zlei[x];
    d.push({
        title: getMyVar("leixin", "0") == x ? "‘‘’’<b>" + (li + "</b>").fontcolor("#FA7298") : li,
        col_type: "text_2",
        url: $("#noLoading#").lazyRule((x) => {
            putMyVar("leixin", x);
            refreshPage(false);
            return "hiker://empty";
        }, x)
    })
};
d.push({
    col_type: "big_blank_block"
}, {
    col_type: "line_blank"
});
let zurl = "http://www.yatu.tv:2082/zhouli.asp";
let gurl = "http://www.yatu.tv:2082/zuijin.asp";

function Week(url, d) {
    let week = ["日", "一", "二", "三", "四", "五", "六"];

    function getWeekDay() {
        const date = new Date();
        const weekDays = week;
        return weekDays[date.getDay()];
    };

    let chineseNums = week;
    let string = getWeekDay();
    let num = 0;
    for (let i = 0; i < string.length; i++) {
        num += chineseNums.indexOf(string[i]) * Math.pow(10, i);
    };

    function week1(d, lists, num) {
        let ll = getMyVar("s", JSON.stringify(parseInt(num) + (num == 0 ? +6 : -1)));
        let list = pdfa(lists[ll], "body&&tr:gt(1)");
        d.push({
            col_type: "blank_block",
            extra: {
                id: "id_周新"
            }
        });
        for (let j in list) {
            let li = JSON.stringify(list[j]).replace(/td/g, "td_td");
            let title = pdfh(li, "td_td,3&&a&&Text").replace(/\s/g, "");
            let 热 = pdfh(li, "td_td,4&&Text").replace(/℃/g, "");
            let redu = "‘‘’’" + (热 > 65 ? ("\t\t\t热度: " + 热 + "%").fontcolor("#ff1100") : 热 < 34 ? "\t\t\t热度: " + 热 + "%" : ("\t\t\t热度: " + 热 + "%").fontcolor("#00cc99"));
            d.push({
                title: title + "‘‘’’<small>" + ("\t\t\t更新: " + pdfh(li, "td_td,3--a--font&&Text").replace(/\s/g, "")).fontcolor("#483D8B") + "</small>",
                desc: ("日期: " + pdfh(li, "font&&Text")).fontcolor("#274c5e") + redu,
                url: title + $("#noLoading#").lazyRule(() => {
                    require(config.依赖);
                    return sourl()
                }),
                col_type: "text_1",
                extra: {
                    cls: "cls_周",
                    pageTitle: "影搜",
                    searchTerms: title,
                    longClick: [{
                        title: "云盘君.简",
                        js: $.toString(() => {
                            return "hiker://page/sou#noRecordHistory##noHistory#?rule=云盘君.简";
                        })
                    }]
                }
            });
        };
    };

    let zhli = ["动漫", "剧集"];
    let flei = getItem("zlkey", "动漫");
    d.push({
        title: "类型",
        desc: '<b><span style="color:#19B89D">' + flei + "</span></b>\t\t",
        col_type: "avatar",
        img: "https://hikerfans.com/tubiao/more/159.png",
        url: $(zhli, 1, "切换类型").select(() => {
            setItem("zlkey", input);
            refreshPage(false);
            return "hiker://empty";
        }),
    });

    for (let i in week) {
        let li = week[i];
        d.push({
            title: (getMyVar("li", "") == "" || getWeekDay() == getMyVar("li")) && getWeekDay() == li ? "‘‘’’<b>" + ("周" + li + "</b>").fontcolor("#FA7298") : getMyVar("li") == li ? "‘‘’’<b>周" + li + "</b>" : li,
            url: $("#noLoading#").lazyRule((li, i, Day, num, week, week1) => {
                putMyVar("li", li);
                putMyVar("s", parseInt(i) + (i == 0 ? +6 : -1));

                for (let j in week) {
                    let lik = week[j];
                    updateItem("id_周历" + j, {
                        title: Day == getMyVar("li") && Day == lik ? "‘‘’’<b>" + ("周" + lik).fontcolor("#FA7298") + "</b>" : getMyVar("li") == lik ? "‘‘’’<b>周" + lik + "</b>" : lik,
                    });
                };

                let lists = storage0.getMyVar("周list");
                let ld = [];
                week1(ld, lists, num);
                deleteItemByCls("cls_周");
                addItemAfter("id_周新", ld);
                return "hiker://empty";
            }, li, i, getWeekDay(), num, week, week1),
            col_type: "scroll_button",
            extra: {
                id: "id_周历" + i
            }
        });
    };

    let zurl = getItem("zlkey", "动漫") == "动漫" ? url : url + "?type=tv";
    let html = fetchPC(zurl, {
        headers: {
            'content-type': 'application/json; charset=GBK'
        }
    });

    let lists = pdfa(html, "body&&.zltab:gt(0)");
    storage0.putMyVar("周list", lists);
    week1(d, lists, num);

};

//最近更新
function zuijin(url, d) {
    function zjgx(d, html) {
        let ls = parseInt(getMyVar("zlie", "0")) + 1;
        let list = pdfa(html, "body&&#sin" + ls + "&&tr:gt(0)");
        d.push({
            col_type: "blank_block",
            extra: {
                id: "id_z近"
            }
        })
        for (let k in list) {
            let liss = JSON.stringify(list[k]).replace(/td/g, "td_td");
            let lis = pdfa(liss, "body&&td_td");
            for (let i in lis) {
                let li = lis[i]
                let title = pdfh(li, "a&&Text");
                let up = pdfh(li, "span,1&&Text");
                let riq = pdfh(li, "span,2&&Text");
                let riqs = /\:/.test(riq) ? "‘‘’’" + ("\t\t\t日期: " + riq).fontcolor("#00cc99") : "\t\t\t日期: " + riq;
                let hot = /hiker/.test(pd(li, "img&&src")) ? "‘‘’’" + ("<b><small><small>HOT</small></small></b>").fontcolor("#ff1100") : "";
                d.push({
                    title: pdfh(li, "span,0&&Text") + "\t\t" + title + "\t\t" + hot,
                    desc: "‘‘’’" + ("更新: " + up).fontcolor("#483D8B") + riqs,
                    url: title + $("#noLoading#").lazyRule(() => {
                        require(config.依赖);
                        return sourl()
                    }),
                    col_type: "text_1",
                    extra: {
                        cls: "cls_z近",
                        pageTitle: "影搜",
                        searchTerms: title,
                        longClick: [{
                            title: "云盘君.简",
                            js: $.toString(() => {
                                return "hiker://page/sou#noRecordHistory##noHistory#?rule=云盘君.简";
                            })
                        }]
                    }
                })
            };
        };
    };
    d.push({
        col_type: "big_blank_block"
    });
    let lie = ["动漫", "电影", "剧集"];
    let api = "https://hikerfans.com/tubiao/more/";
    let tu = ["341", "175", "145"];
    for (let u in lie) {
        let li = lie[u];
        d.push({
            title: getMyVar("zlie", "0") == u ? "‘‘’’<b>" + (li + "</b>").fontcolor("#FA7298") : li,
            img: api + tu[u] + ".png",
            col_type: "icon_3_fill",
            url: $("#noLoading#").lazyRule((u, lie, zjgx) => {
                putMyVar("zlie", u);
                for (let i in lie) {
                    let li = lie[i];
                    updateItem("id_zj更" + i, {
                        title: getMyVar("zlie", "0") == i ? "‘‘’’<b>" + (li + "</b>").fontcolor("#FA7298") : li,
                    });
                };

                let html = storage0.getMyVar("zjhtml") || [];
                let ld = [];
                zjgx(ld, html);
                deleteItemByCls("cls_z近");
                addItemAfter("id_z近", ld);

                //refreshPage(false);
                return "hiker://empty";
            }, u, lie, zjgx),
            extra: {
                id: "id_zj更" + u
            }
        })
    };
    let html = fetchPC(url, {
        headers: {
            'content-type': 'application/json; charset=GBK'
        }
    });
    storage0.putMyVar("zjhtml", html);
    zjgx(d, html);
};

if (getMyVar("leixin", "0") == 0) {
    Week(zurl, d);
} else {
    zuijin(gurl, d);
};
setResult(d);
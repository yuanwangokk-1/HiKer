js:
    let d = [];
addListener("onClose", $.toString(() => {
    clearVar("fenyinrule");
    clearVar("fy手动fy");
}));

try {
    let rules = JSON.parse(base64Decode(getVar("fenyinrule")));
    if (rules.length > 1 && getParam("rule") == "风影") {
        putVar("fy手动fy", "1");
        require(getItem("git", "https://raw.gitcode.com/Suifen/feng/raw/master/ycl.js"));
        gx();
    }
    ;let list;
    let file = "hiker://files/rules/FYJK/ys.json";
    try {
        list = JSON.parse(readFile(file));
    } catch (e) {
        list = [];
        saveFile(file, JSON.stringify(list));
        console.error('解析文件内容出错:', e);
    }
    ;

    function Name(name) {
        return name.replace(/&&.*/g, "");
    };

    function times(time) {
        return new Date(time.replace(/\s+/g, "T"));
    };

    function adds(list, rules, Name) {
        let add = [];
        for (let rule of rules) {
            if (!list.some(item => Name(item.name) === Name(rule.name))) {
                add.push(rule);
            }
        }
        ;
        return add;
    };

    function ups(list, rules, Name, times) {
        let up = [];
        for (let rule of rules) {
            let match = list.find(item => Name(item.name) === Name(rule.name));
            if (match && times(rule.time) > times(match.time)) {
                up.push(rule);
            }
        }
        ;
        return up;
    };

    function lis(list, rules, Name, times) {
        let lis = [];
        for (let item of list) {
            if (!rules.some(rule => Name(rule.name) === Name(item.name) && times(rule.time) > times(item.time))) {
                lis.push(item);
            }
        }
        ;
        return lis;
    };

    function los(list, rules, Name) {
        let liss = [];
        for (let item of list) {
            if (!rules.some(rule => Name(rule.name) === Name(item.name))) {
                liss.push(item);
            }
        }
        ;
        return liss;
    };

    function lio(rules, list, Name, times) {
        let lio = [];
        for (let item of rules) {
            if (!list.some(lis => Name(lis.name) === Name(item.name) && times(lis.time) < times(item.time)) && list.some(lis => Name(lis.name) == Name(item.name))) {
                lio.push(item);
            }
        }
        ;
        return lio;
    };

    let addlist = adds(list, rules, Name);
    let uplist = ups(list, rules, Name, times)
    let lists = lis(list, rules, Name, times);
    let lios = lio(rules, list, Name, times);
    let loss = los(list, rules, Name);

    d.push({
        col_type: "big_blank_block"
    }, {
        title: "‘‘’’" + ("<b><big>风 影 源 导 入</big></b>").fontcolor("#6EB897"),
        url: "hiker://empty",
        col_type: "text_center_1"
    }, {
        col_type: "big_blank_block"
    });

    let tit = ["覆盖全部", "覆盖更新", "导入新增"];
    let pic_ = ["hiker://images/home_icon_bookmark_group", "hiker://images/home_icon_fold", "hiker://images/home_icon_add"]
    for (let i in tit) {
        let li = tit[i];
        d.push({
            title: "<b>" + li + "</b>", img: pic_[i], url: $("#noLoading#").lazyRule((li, add, up, lis, lio, los) => {
                function Snackbar() {
                    const hikerPop = $.require(getItem("git", "https://raw.gitcode.com/Suifen/feng/raw/master/ycl.js").replace("ycl.js", "hikerPop.js"));
                    hikerPop.chefSnackbarMake({
                        content: "确认跳转风影？", duration: 5000, //显示时长
                        confirm() {
                            return "hiker://home@风影";
                        }
                    });
                };let file = "hiker://files/rules/FYJK/ys.json";
                let list = JSON.parse(readFile(file)) || [];
                let ad = add.length;
                let Up = up.length;
                let Lo = lio.length;
                if (li == "导入新增") {
                    if (ad == 0) {
                        return "toast://没有新增源！"
                    } else {
                        let addList = [];
                        addList = add.concat(list);
                        saveFile(file, JSON.stringify(addList));
                        back(true);
                        Snackbar();
                        toast("风影源 - 新增 " + ad + " 条，跳过" + (Up + Lo) + "条");
                        return "hiker://empty";
                    }
                    ;
                } else if (li == "覆盖更新") {
                    if (ad == 0 && Up == 0) {
                        return "toast://没有新增、更新的源！"
                    } else {
                        let resultList = [];
                        resultList = add.concat(up).concat(lis);
                        saveFile(file, JSON.stringify(resultList));
                        back(true);
                        Snackbar();
                        toast("风影源 - 新增 " + ad + " 条，更新 " + Up + " 条，跳过" + Lo + "条");
                        Snackbar();
                        return "hiker://empty";
                    }
                    ;
                } else if (li == "覆盖全部") {
                    let lioList = [];
                    lioList = add.concat(up).concat(lio).concat(los);
                    saveFile(file, JSON.stringify(lioList));
                    back(true);
                    Snackbar();
                    toast("风影源 - 新增 " + ad + " 条，更新 " + Up + " 条，覆盖" + Lo + "条");
                    return "hiker://empty";
                }
                ;
            }, li, addlist, uplist, lists, lios, loss), col_type: "icon_small_3"
        });
    }
    ;

    function leng(adtxt, uptxt, lotxt, adlen, uplen, lolen) {
        d.push({
            title: "‘‘’’<small>" + (adtxt + ": " + adlen + " 条").fontcolor("#FA7298") + " / " + (uptxt + ": " + uplen + " 条").fontcolor("#6EB897") + " / " + (lotxt + ": " + lolen + " 条").fontcolor("#999999") + "</small>",
            url: "hiker://empty",
            col_type: "text_center_1"
        })
    };

    function List(list, deco) {
        let syd = new Set();
        let sod = new Set();
        for (let j in list) {
            let li = list[j];
            let name = li.name.replace(/&&.*/g, "");
            if ((li.fl !== "" || li.sy !== "") && li.gs !== "HOST" || (li.gs === "HOST" && li.host !== "")) {
                syd.add(name);
            }
            if ((li.so !== "" && li.gs !== "HOST") || (li.gs === "HOST" && li.sourl !== "")) {
                sod.add(name);
            }
            let y = syd.has(name) ? "首" : "";
            let s = sod.has(name) ? "搜" : "";
            let ttl = (typeof (li.ttl) === 'string' && li.ttl == "ttl") ? "<small>" + "失效".fontcolor("#ff1100") + "</small>" : "";
            d.push({
                title: name + ("「 " + y + " " + s + " " + li.gs + " 」") + "   " + deco + "   " + ttl,
                desc: "<small>" + (!/&&/.test(li.name) ? "By - 未知" : li.name.replace(/.*&&/g, "By - ")) + "</small>",
                img: "",
                url: $("确认导入  " + name + " ？").confirm((li) => {
                    let file = "hiker://files/rules/FYJK/ys.json";
                    let list = JSON.parse(readFile(file));
                    list = list.filter(item => !(item.name.replace(/&&.*/, "") === li.name.replace(/&&.*/, "")));
                    list.unshift(li);
                    saveFile(file, JSON.stringify(list));
                    return "toast://导入成功！";
                }, li),
                col_type: "avatar"
            })
        }
        ;
    };

    leng("新增", "更新", "较旧", addlist.length, uplist.length, lios.length);
    let new_ = "<small><small>" + ("NEW").fontcolor("#ff6600") + "</small></small>";
    let up_ = "<small><small>" + ("UP").fontcolor("#00cc99") + "</small></small>";
    let nu_ = "<small><small>" + ("NU").fontcolor("#999999") + "</small></small>";
    List(addlist, new_);
    List(uplist, up_);
    List(lios, nu_);
} catch (e) {
    log(e.toString());
    toast("导入失败");
}
setResult(d);
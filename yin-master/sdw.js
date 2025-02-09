function search(http, game, name, ssurl, d, page, sokey, off1, Json) {
    ssurl = ssurl.replace("fypage", page);
    let MY_HOME = getHome(ssurl);
    let MY_URL = ssurl;
    putMyVar("ssurl", MY_URL);
    let jin = getSearchMode() == "1";
    let col = getItem("h1", "三列") == "竖列" ? "movie_1_vertical_pic" : getItem("h1", "三列") == "双列" ? "movie_2" : "movie_3";

    let nam = getMyVar("namejs", "null") != "null" ? getMyVar("namejs").replace(/&&.*/, "") : off1.find(item => item.name.replace(/&&.*/, "") === name);

    function ttlo(name, Json, file, sxtit) {
        if (getMyVar("namejs", "null") == "null" && getItem("失效", "on") == "on") {
            const ttlList = Json.map(item => {
                if (item.name.replace(/&&.*/, "") === name) {
                    // 尝试将 ttl 转换成数字，如果转换失败（比如是 "ttl" 或 ""），则设为 0
                    let ttlValue = item.ttl || 0;
                    if (typeof ttlValue !== 'number') {
                        ttlValue = /^\d+$/.test(ttlValue) ? parseInt(ttlValue, 10) : 0;
                    }
                    if ((ttlValue + 1) >= 5) {
                        clearItem("s0");
                        toast(name + " 失效超过5次，已归至失效类");
                    }
                    ;
                    const newItem = Object.assign({}, item, {
                        ttl: ttlValue + 1,
                        sxtit: sxtit
                    });
                    return newItem;
                }
                return item;
            });
            saveFile(file, JSON.stringify(ttlList));
        }
    };

    function fby(nam, name, Json, file, text, sxtit) {
        if (nam.fbhost != "" && nam.fbhost != undefined || getMyVar("namejs", "null") != "null") {
            let s = getMyVar("namejs", "null") != "null" ? getMyVar("hostjs") : nam.host;
            let syur;
            try {
                syur = new Function(s);
                toast(name + " - 无法访问，正在重新获取域名！");
            } catch (e) {
                toast(name + " - 没有发布页");
            }
            ;
            if (getMyVar("namejs", "null") == "null") {
                const datedList = Json.map(item => {
                    if (item.name.replace(/&&.*/, "") === name) {
                        const newItem = Object.assign({}, item, {
                            fbhost: syur()
                        });
                        return newItem;
                    }
                    return item;
                });
                saveFile(file, JSON.stringify(datedList));
            } else {
                try {
                    syur();
                } catch (e) {
                    toast("链接有误或查看网站是否正常访问！");
                    return "hiker://empty";
                }
                ;
            }
            ;
            if (getItem("s1", "0") == "1") {
                return "toast://" + name + " - 已获取到域名，请刷新！";
            } else {
                refreshPage(false);
                return "toast://" + name + " - 已获取到域名，正在加载！";
            }
            ;
        } else {
            ttlo(name, Json, file, sxtit);
            if (getItem("s1", "0") !== "1") {
                d.push({
                    col_type: "rich_text",
                }, {
                    desc: "““" + text + "””",
                    url: "hiker://empty",
                    col_type: "text_center_1",
                    extra: {
                        lineVisible: false,
                        cls: "cls_" + name
                    }
                });
            }
            ;
        }
        ;
    };

    function htmlyz(MY_URL, MY_HOME, http, game, name, ssurl, d, page, sokey, nam, off1, Json) {
        let headers = {
            "User-Agent": MOBILE_UA,
            "Referer": MY_URL,
        };
        /* if (/在访问之前检查浏览器/.test(h)) {
             ht = fetchCodeByWebView(ssurl, {
                 checkJs: $.toString((name) => {
                     if (document.querySelector('.stui-vodlist li')) {
                         let cok = fba.getCookie(window.location.href);
                         fba.writeFile('hiker://files/cache/FY/cookie/' + name + '.txt', cok);
                         return document.querySelector('.stui-vodlist li');
                     };
                 }, name)
             }); //log(ht)

     } else*/
        if (/ajax\/suggest/.test(ssurl)) {
            ht = JSON.parse(fetch(ssurl, {
                timeout: 5000
            }));
        } else {
            var htm = JSON.parse(fetch(ssurl, {
                withStatusCode: true,
                timeout: 5000
            })); //log(htm)
            ht = htm.body; //log(ht)
        }
        ;

        if (/检测中/.test(ht)) {
            ht = fetch(MY_HOME + "?btwaf" + ht.match(/btwaf(.*?)\"/)[1], {
                headers: headers
            });
        }
        ;

        if (/人机验证/.test(ht)) {
            let Cokie = fetchCookie(ssurl, {
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST'
            });
            ht = post(ssurl, {
                body: Cokie.match(/\"(.*?)\;/)[1],
                headers: headers
            })
        }
        ;

        if (/验证码|系统安全验证|验证后|提交验证/.test(ht) && !/弹出验证码/.test(ht)) {
            if (page == 1) {
                require(http + "yzm.js");
                if (/Auete/.test(name)) {
                    verify(MY_URL, MY_HOME, http, game, name, ssurl, d, page, sokey, off1);
                } else {
                    //自动HOME后面有ht
                    return verify(MY_URL, MY_HOME, http, game, name, ssurl, d, page, sokey, off1);
                }
                ;
            }
            ;
        } else if (/ajax\/suggest/.test(ssurl)) {
            html = ht;
        } else if (ht == "" || !/电影|剧集|连续剧|电视剧|综艺|动漫|短剧|纪录|记录|番剧|搜索|视频|視頻|搜尋|電影|劇集|續集|電視劇|綜藝|動畫|短劇|紀錄|番劇/.test(ht)) {
            if (page == 1) {
                if (htm.statusCode != 200) {
                    let text = "无法访问，请换源";
                    let sxtit = "无法访问";
                    fby(nam, name, Json, file, text, sxtit);
                } else {
                    log(ht);
                    let sxtit = "规则失效";
                    ttlo(name, Json, file, sxtit);
                    if (getItem("s1", "0") !== "1") {
                        d.push({
                            col_type: "rich_text",
                        }, {
                            desc: "““获取数据错误，或验证未通过””",
                            url: "hiker://empty",
                            col_type: "text_center_1",
                            extra: {
                                lineVisible: false,
                                cls: "cls_" + name
                            }
                        });
                    }
                    ;
                }
            }
            ;
            deleteItemByCls("cls_load");
            return
        } else {
            html = ht;
        }
        ;
        //log(html)
        return html;
    };

    function dwlist(html, name) {
        let 列表;
        if (/searchList/.test(html)) {
            列表 = '#searchList&&li'
        } else if (/module-card-item|module-search-item/.test(html)) {
            列表 = '.module-items&&.module-search-item||.module-card-item'
        } else if (/product-items/.test(html)) {
            列表 = 'body&&.item'
        } else if (/search-list|threadlist|list-width|hl-list-item|pic-content|public-list-box/.test(html)) {
            列表 = 'body&&.hl-list-item||.search-list||.threadlist||.list-width||.pic-content||.public-list-box'
        } else if (/stui-vodlist|stui-vodlist__media|myui-vodlist__media|searchlilst/.test(html)) {
            列表 = '.stui-vodlist||.stui-vodlist__media||.myui-vodlist__media||.searchlilst&&li'
        } else if (/img-list|videoul|hl-one-list|bt_img/.test(html)) {
            列表 = '.img-list||.videoul||.hl-one-list||.bt_img&&li'
        }
        ;
        return 列表;
    };

    function lists(html, ssurl, 列表) {
        let list;
        try {
            list = /ajax\/suggest/.test(ssurl) ? html.list : pdfa(html, 列表);
            //log(list)
        } catch (e) {
            list = "";
        }
        ;
        return list;
    };

    function dws(name, list) {
        let 更新;
        if (/module-item-note|public-list-prb|m-pic-l/.test(list)) {
            更新 = '.module-item-note||.m-pic-l||.public-list-prb&&span||*&&Text'
        } else if (/video-serial|text-center|remarks/.test(list)) {
            更新 = '.video-serial||.text-center||.remarks&&Text'
        } else if (/fed-list-remarks|list-remarks/.test(list)) {
            更新 = '.fed-list-remarks||.list-remarks&&Text'
        } else {
            更新 = '.videoul-tips||.text-grey||.pic-text||.jidi||.nostag||.public-list-prb||span,-1&&Text'
        }

        let 图片;
        if (/lazyload/.test(list)) {
            图片 = '.lazyload&&data-original||data-src'
        } else if (/eclazy|fed-lazy|videoul-img/.test(list)) {
            图片 = '.videoul-img||.fed-lazy||.eclazy&&data-original||data-src||lay-src'
        } else {
            图片 = 'img||a&&data-original||data-src||lay-src||src'
        }

        let 片名;
        let 链接;
        if (/zmovo-team-title/.test(list)) {
            片名 = '.zmovo-team-title&&a&&Text'
            链接 = '.zmovo-team-title&&a&&href'
        } else if (/module-card-item-title/.test(list)) {
            片名 = '.module-card-item-title&&Text'
            链接 = 'a&&href'
        } else if (/thumb-txt|text-danger/.test(list)) {
            片名 = '.thumb-txt||.text-danger&&Text'
            链接 = 'a&&href'
        } else if (/video-serial/.test(list)) {
            片名 = '.video-serial&&title'
            链接 = '.video-serial&&href'
        } else {
            片名 = 'a&&title'
            链接 = 'a&&href'
        }
        return 更新 + "$" + 图片 + "$" + 片名 + "$" + 链接;
    };
    let html;
    let list;
    let 列表
    let 更新;
    let 图片;
    let 片名;
    let 链接;
    let 免嗅;
    let 公用;
    let mx;
    let db;
    let ex;
    let bh;
    let gg;
    let zw;
    let Js = getMyVar("namejs", "null") != "null" ? getMyVar("gs", gsValue) == "JS" : nam.gs == "JS";

    let HOst = getMyVar("namejs", "null") != "null" ? getMyVar("gs", gsValue) == "HOST" : nam.gs == "HOST";

    if (Js) {
        let so;
        let g;
        if (getMyVar("namejs", "null") != "null") {
            so = getMyVar("sojs");
            g = getMyVar("gyjs");
        } else {
            so = nam.so;
            g = nam.gy;
        }
        ;

        if (typeof g != 'undefined') {
            try {
                公用 = eval("(" + g + ")");
            } catch (e) {
                公用 = null;
                log(e.toString());
            }
            ;
        }
        ;
        let headers = {
            "User-Agent": MOBILE_UA,
            "Referer": MY_URL,
        };
        let s = so.replace(/\s*html\s*\=\s*fetch\(ssurl\)/, " html = JSON.parse(fetch(ssurl, { withStatusCode: true, timeout: 5000,  headers: headers }))");
        var status = /withStatusCode/.test(s);
        let ss = status ? s : so;
        eval(ss);
        if (typeof 免嗅 == "string" ? 免嗅 == "on" : false) {
            try {
                mx = 公用 && typeof 公用.免嗅 == "function" ? 公用.免嗅.toString() : "";
            } catch (e) {
                log(e.toString());
            }
            ;
            try {
                db = 公用 && typeof 公用.点播 == "string" ? 公用.点播 : "";
            } catch (e) {
                log(e.toString());
            }
            ;
            try {
                ex = 公用 && typeof 公用.排除 == "object" ? 公用.排除 : "";
            } catch (e) {
                log(e.toString());
            }
            ;
            try {
                bh = 公用 && typeof 公用.包含 == "object" ? 公用.包含 : "";
            } catch (e) {
                log(e.toString());
            }
            ;
            try {
                gg = 公用 && typeof 公用.广告 == "object" ? 公用.广告 : "";
            } catch (e) {
                log(e.toString());
            }
            ;
        } else if (typeof 正文 == "string" ? 正文 == "on" : false) {
            try {
                zw = 公用 && typeof 公用.正文 == "function" ? 公用.正文.toString() : "";
            } catch (e) {
                log(e.toString());
            }
            ;
        }
        ;

        htm = status ? html.body : html;
        let ison;
        try {
            var ht = JSON.parse(htm);
            ison = "on";
        } catch (e) {
            ison = "off";
        }
        ;

        if (公用 && (typeof 公用.数字 == "function" ? 公用.数字(htm) : false) && typeof 数字 == "undefined") {
            if (page == 1) {
                require(http + "yzm.js");
                verify(MY_URL, MY_HOME, http, game, name, ssurl, d, page, sokey, off1);
            }
            ;
        } else if (公用 && typeof 公用.验证 == "function" && (typeof 验证 == "function" ? 验证(htm) : false)) {
            try {
                公用.验证(htm, ssurl);
            } catch (e) {
                log(e.toString());
            }
            ;
            deleteItemByCls("cls_load");
        } else if (htm == "" || !/电影|剧集|连续剧|电视剧|综艺|动漫|短剧|纪录|记录|音乐|歌|DJ|MV|番剧|漫画|说|相声|书|小品|搜索|视频|視頻|搜尋|電影|劇集|續集|電視劇|綜藝|動畫|短劇|紀錄|音樂|歌|番劇|漫畫|說|相聲|書|小藝/.test(htm) && ison != "on" || ison == "on" && (typeof (ht) == "string" ? ht.code != 200 : "")) {
            if (page == 1) {
                if ((status ? html.statusCode : htm) != 200) {
                    let text;
                    let sxtit;
                    if (status) {
                        text = "无法访问，请换源";
                        sxtit = "无法访问";
                    } else {
                        text = "无法访问，数据错误或验证失败";
                        sxtit = "无法访问或规则失效";
                    }
                    ;
                    html = [];
                    deleteItemByCls("cls_load");
                    return fby(nam, name, Json, file, text, sxtit);
                } else {
                    log(htm);
                    let sxtit = "规则失效";
                    ttlo(name, Json, file, sxtit);
                    if (getItem("s1", "0") !== "1") {
                        d.push({
                            col_type: "rich_text",
                        }, {
                            desc: "““获取数据错误，或验证未通过””",
                            url: "hiker://empty",
                            col_type: "text_center_1",
                            extra: {
                                lineVisible: false,
                                cls: "cls_" + name
                            }
                        });
                        clearItem("fystag");
                    }
                    ;
                }
            }
            ;
            deleteItemByCls("cls_load");
            return
        } else {
            html = htm;
        }
        ;
        list = typeof (列表) != "undefined" ? 列表(html) : 搜索列表(html);
    } else if (HOst) {
        html = htmlyz(MY_URL, MY_HOME, http, game, name, ssurl, d, page, sokey, nam, off1, Json);
        列表 = dwlist(html, name);
        list = lists(html, ssurl, 列表);
        let dw1 = dws(name, list);
        更新 = dw1.split("$")[0];
        图片 = dw1.split("$")[1];
        片名 = dw1.split("$")[2];
        链接 = dw1.split("$")[3];
    }
    ;

    try {
        //单搜列表
        if (page != 1 && list == "" && html != "") {
            d.push({
                title: "‘‘’’<small>－－到\t底\t了－－</small>",
                url: "hiker://empty",
                col_type: "text_center_1"
            })
            return
        } else if (html != "" && (list == "" || list == []) && !/验证|验证码|系统安全验证|验证后|提交验证/.test(Js ? htm : ht) && (Js && status ? html.statusCode == 200 : html) && getItem("s1", "0") !== "1") {
            d.push({
                col_type: "rich_text",
            }, {
                desc: "‘‘没有找到相关内容’’",
                url: "hiker://empty",
                col_type: "text_center_1",
                extra: {
                    lineVisible: false
                }
            });
            deleteItemByCls("cls_load");
            return
        } else {
            let skey = new RegExp(sokey);
            try {
                let urls = /暂无/.test(name) ? MY_HOME + "/detail/" : MY_HOME + "/voddetail/";
                try {
                    let 排 = typeof (ex) != "undefined" ? ex.toString() : "";
                    var 排除ex = 排.replace(/\\/g, "").replace(/^\//, "").replace(/\/$/, "");
                } catch (e) {
                }
                ;
                let m3u8 = getItem("缓存") == "on" ? true : false;
                let extr;
                if (/function/.test(mx) && (typeof 免嗅 == "string" ? 免嗅 == "on" : false)) {
                    extr = {
                        js: $.toString((点播) => {
                            if (点播 != "undefined" && 点播 != "") {
                                eval(点播.replace(/\'/g, ""));
                            }
                            ;
                        }, db),
                        videoExcludeRules: [".html", 排除ex],
                        blockRules: [".gif", ".jpeg", ".jpg", ".ico", ".png", "hm.baidu.com", "/ads/*.js", "cnzz.com"],
                        jsLoadingInject: true,
                        /*ua: PC_UA,*/
                        cacheM3u8: m3u8
                    };
                }
                ;
                let lxn = getItem("lx1", "全部");
                let lxna = /影视|动漫|短剧|网盘/.test(lxn) ? "影视" : /听书|音乐/.test(lxn) ? "听书" : /全部|其它/.test(lxn) ? "其它" : lxn;
                List = list.map((li, index) => {
                    let title;
                    let img;
                    let desc;
                    let surl;
                    let erurl;

                    if (/ajax\/suggest/.test(MY_URL) && !Js) {
                        title = li.name;
                        let im = (/.*url=|.*tu=/.test(li.pic) ? li.pic.replace(/.*url=|.*tu=/, "") : li.pic) + "@Referer=";
                        img = isBase64(im) == true && im !== "undefined" ? base64Decode(im) : decodeURIComponent(im);
                        desc = "";
                        surl = urls + li.id + ".html";
                        erurl = $("#noLoading#").lazyRule((url) => {
                            putMyVar("bak", "1");
                            return $(url).rule(() => {
                                require(config.依赖);
                                erji()
                            })
                        }, "hiker://empty##" + surl + "#immersiveTheme##autoCache##noHistory" + game);

                    } else {
                        let pic = Js ? "" : pdfh(li, 图片, ssurl);
                        title = Js ? li.title : pdfh(li, 片名);
                        let im = Js ? li.img : (/.*url\=http|.*tu=/.test(pic) ? pic.replace(/.*url=|.*tu=/g, "") : (!/http|pic|jpg|png|jpeg/.test(pic)) ? "hiker://images/home_bg" : pd(li, 图片, ssurl)) + "@Referer=";
                        img = isBase64(im) == true && im !== "undefined" ? base64Decode(im) : decodeURIComponent(im);
                        desc = Js ? li.desc : pdfh(li, 更新);
                        surl = Js ? li.url : pd(li, 链接, ssurl);
                        erurl = $('#noLoading#').lazyRule((url) => {
                            putMyVar('bak', '1');
                            return $(url).rule(() => {
                                require(config.依赖);
                                erji()
                            })
                        }, "hiker://empty##" + surl + '#immersiveTheme##autoCache##noHistory' + game);
                    }
                    ;

                    let url = /@lazyRule=|@rule=/.test(surl) ? surl : surl == "hiker://empty" ? surl : (/function/.test(mx) && 免嗅 == "on") ? $().lazyRule((nad, game, MY_HOME, url) => {
                        require(config.依赖.replace(/[^/]*$/, "lazy.js"));
                        return mx(nad, input, MY_HOME, game, url);
                    }, name, game, MY_HOME, surl) : (/function/.test(zw) && 正文 == "on") ? $(surl + "#readTheme#").rule((nad, game, MY_HOME) => {
                        require(config.依赖.replace(/[^/]*$/, "lazy.js"));
                        return zw(nad, MY_URL, MY_HOME, game);
                    }, name, game, MY_HOME) : erurl;

                    let tit = title !== undefined ? title.replace(/\n.*/, "") : title;
                    let des = desc !== undefined ? desc.replace(/\n.*/, "") : desc;
                    let extra = Object.assign({}, extr, {
                        cls: "cls_soys cls_" + name,
                        id: "id_" + index + name,
                        title: tit,
                        desc: des,
                        img: img,
                        inheritTitle: false,
                        pageTitle: (title !== undefined ? title.replace(/\n.*/, "") : title) + "「" + name + "」",
                        longClick: [{
                            title: "加入周更",
                            js: $.toString((name, title, desc, img, url, Title) => {
                                setItem("zgb", name);
                                setItem("fyzg", "周更");
                                require(config.依赖.replace(/[^/]*$/, "public.js"));
                                return jrzg(name, title, desc, img, url, Title, "无记录", "周更");

                            }, lxna, tit, des, img, base64Encode(url), name)
                        }, {
                            title: "加入日更",
                            js: $.toString((name, title, desc, img, url, Title) => {
                                setItem("zgb", name);
                                setItem("fyzg", "日更");
                                require(config.依赖.replace(/[^/]*$/, "public.js"));
                                return jrzg(name, title, desc, img, url, Title, "无记录", "日更");

                            }, lxna, tit, des, img, base64Encode(url), name)
                        }, {
                            title: "加入完更",
                            js: $.toString((name, title, desc, img, url, Title) => {
                                setItem("zgb", name);
                                setItem("fyzg", "完更");
                                require(config.依赖.replace(/[^/]*$/, "public.js"));
                                return jrzg(name, title, desc, img, url, Title, "无记录", "完更");

                            }, lxna, tit, des, img, base64Encode(url), name)
                        }]
                    });
                    return {
                        title: typeof (li.col_type) != "undefined" && !/^pic\_3|^pic\_1|^pic\_2|movie\_3|movie\_2|avatar/.test(li.col_type) ? "‘‘’’<b>" + title.replace(new RegExp(sokey), sokey.fontcolor("#FA7298")) + "</b>" : /avatar/.test(li.col_type) ? "<b>" + title.replace(new RegExp(sokey), sokey.fontcolor("#FA7298")) + "</b>" : col == "movie_1_vertical_pic" ? "‘‘’’<b>" + title.replace(new RegExp(sokey), sokey.fontcolor("#FA7298")) + "</b>" : title,
                        desc: desc,
                        img: img,
                        url: url,
                        col_type: Js ? (typeof (li.col_type) != "undefined" ? li.col_type : col) : col,
                        extra: extra
                    }
                });
                for (let ls of List) {
                    let title = ls.title;
                    if (jin) {
                        if (searchContains(title, sokey, false)) {
                            addItemAfter("id_lb" + name, ls);
                            deleteItem("sc" + name);
                            d.push({
                                title: title,
                                desc: ls.desc,
                                img: ls.img,
                                url: ls.url,
                                col_type: ls.col_type,
                                extra: ls.extra
                            });
                        }
                        ;
                    } else {
                        addItemAfter("id_lb" + name, ls);
                        deleteItem("sc" + name);
                        d.push({
                            title: title,
                            desc: ls.desc,
                            img: ls.img,
                            url: ls.url,
                            col_type: ls.col_type,
                            extra: ls.extra
                        });
                    }
                    ;
                }
                ;
            } catch (e) {
                ttlo(name, Json, file, "规则失效");
                log(e.toString());
                if (getItem("s1", "0") !== "1") {
                    d.push({
                        col_type: "rich_text",
                    }, {
                        desc: "““匹配错误，请联系作者修复””",
                        url: "hiker://empty",
                        col_type: "text_center_1",
                        extra: {
                            lineVisible: false,
                            cls: "cls_" + name
                        }
                    })
                    clearItem("fystag");
                }
                ;
            }
            ;
            deleteItemByCls("cls_load");
        }
        ;
    } catch (e) {
        log(e.toString());
    }
    ;
};

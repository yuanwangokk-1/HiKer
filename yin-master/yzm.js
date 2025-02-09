function verify(MY_URL, MY_HOME, http, game, name, ssurl, d, page, sokey, off1) {
    let curl = MY_HOME + (MY_URL.indexOf("search-pg-1-wd-") > -1 ? "/inc/common/code.php?a=search" : /Auete/.test(name) ? "/include/vdimgck.php?get=" : "/index.php/verify/index.html?");

    let cok = JSON.parse(fetchCookie(curl + Math.random(), {
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent': MOBILE_UA
        },
        method: 'GET',
        withHeaders: true
    })).join(';');

    //log(cok);
    let yzt = curl + Math.random() + "@User-Agent = " + MOBILE_UA + "@Cookie=" + cok;

    d.push({
        title: "<br>",
        col_type: "rich_text",
        extra: {
            cls: "cls_k1" + name
        }
    }, {
        img: yzt,
        url: $('#noLoading#').lazyRule((curl, cok, name) => {
            let yzt = curl + Math.random() + "@User-Agent = " + MOBILE_UA + "@Cookie=" + cok;
            updateItem("id_pic" + name, {
                img: yzt
            });
            return "hiker://empty";
        }, curl, cok, name),
        col_type: "pic_1_center",
        extra: {
            id: "id_pic" + name
        }
    }, {
        title: "<br>",
        col_type: "rich_text",
        extra: {
            cls: "cls_k2" + name
        }
    });
    deleteItemByCls("cls_load");

    let type = getMyVar("影搜") == "1" ? "search" : "show";
    let yzurl = MY_HOME + (MY_URL.indexOf("search-pg-1-wd-") > -1 ? "/inc/ajax.php?ac=code_check&type=search&code=" : /Auete/.test(name) ? getMyVar("auete") + "?scheckAC=check&page=&searchtype=&order=&tid=&area=&year=&letter=&yuyan=&state=&money=&ver=&jq=" : "/index.php/ajax/verify_check?type=" + type + "&verify=");

    d.push({
        title: '提交验证',
        desc: '输入验证码',
        url: $.toString((http, yz, cok, ssurl, name, game, page, sokey, off1) => {
            let url = yz + input;
            //log(url)
            return $('#noLoading#').lazyRule((http, url, yz, input, cok, ssurl, name, game, page, sokey, off1) => {
                let curl = /Auete/.test(name) ? yz : url;
                var surl = fetch(curl, {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'User-Agent': MOBILE_UA,
                        'Cookie': cok
                    },
                    body: /Auete/.test(name) ? "validate=" + input + "&searchword=" + sokey : "",
                    method: 'POST'
                });
                let Code = /Auete/.test(name) ? !/验证码不正确/.test(surl) : JSON.parse(surl).code == 1;
                //log(jsurl)
                if (Code) {
                    toast("验证成功！");

                    function TIM(name) {
                        let time = /Auete/.test(name) ? 10 : 3;
                        while (time != 0) {
                            java.lang.Thread.sleep(1000);
                            time -= 1;
                            updateItem({
                                title: "访问间隔，““" + time + "””\t\t秒后继续",
                                url: "toast://访问间隔需等待" + time + "秒",
                                desc: "",
                                col_type: "text_center_1",
                                extra: {
                                    id: 'id_lb' + name,
                                    cls: 'cls_tim' + name,
                                    lineVisible: false,
                                }
                            })
                        }
                        ;
                    };
                    TIM(name);
                    if (getItem("s1", "0") == "1" && getMyVar("影搜") == "1") {
                        let d = [];
                        MY_URL = ssurl;
                        require(http + "sdw.js");
                        search(http, game, name, ssurl, d, page, sokey, off1);

                        deleteItem("id_pic" + name);
                        deleteItemByCls("cls_k1" + name);
                        deleteItemByCls("cls_k2" + name);
                        deleteItemByCls("cls_tim" + name);
                        setResult(d);
                        return "toast://加载完成！";
                    } else {
                        refreshPage(false);
                        return "toast://加载完成！"
                    }
                } else {
                    return "toast://验证失败，请重试！"
                }
            }, http, url, yz, input, cok, ssurl, name, game, page, sokey, off1)
        }, http, yzurl, cok, ssurl, name, game, page, sokey, off1),
        col_type: "input",
        extra: {
            id: "id_lb" + name,
        }
    });
};

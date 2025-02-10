function lazy(nad, input) {
    let Json;
    let file = getItem("dy", "本地") == "本地" ? "hiker://files/rules/FYJK/ys.json" : "hiker://files/cache/FY/dy/" + getItem("dy") + ".json";
    try {
        Json = JSON.parse(readFile(file));
    } catch (e) {
        Json = [];
        console.error('解析文件内容出错:', e);
    }
    ;
    let gy = Json.find(item => item.name.replace(/&&.*/, "") === nad);
    let 公用
    try {
        公用 = eval("(" + gy.gy + ")");
    } catch (e) {
        公用 = null;
        log(e.toString());
    }
    ;
    let 点击 = 公用 && typeof 公用.点播 == "string" ? 公用.点播 : "";
    let 排除 = 公用 && typeof 公用.排除 == "object" ? 公用.排除.toString() : "";
    let 包含 = 公用 && typeof 公用.包含 == "object" ? 公用.包含.toString() : "";
    let 广告 = 公用 && typeof 公用.广告 == "object" ? 公用.广告 : "";
    let adm3u8 = [{
        "hosts": [
            "bfzy",
            "bfbfvip",
            "bbffvip",
            "ddbbffcdn",
            "rrcdnbf"
        ],
        "name": "暴风",
        "regex": [
            "#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF:3,[\\s\\S]*?#EXT-X-DISCONTINUITY"
        ]
    }, {
        "hosts": [
            "vip.lz",
            "hd.lz",
            ".cdnlz"
        ],
        "name": "量子",
        "regex": [
            "18.5333",
            "23.466666"
        ]
    }, {
        "hosts": [
            "vip.ffzy",
            "hd.ffzy",
            "super.ffzy"
        ],
        "name": "非凡",
        "regex": [
            "#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF:7\\.400000,[\\s\\S]*?#EXT-X-DISCONTINUITY",
            "#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF:5\\.760000,[\\s\\S]*?#EXT-X-DISCONTINUITY",
            "#EXTINF.*?\\s+.*?1170(20|32).*?\\.ts",
            "#EXTINF.*?\\s+.*?116977.*?\\.ts",
            "20.52",
            "25.1"
        ]
    }, {
        "hosts": [
            "suonizy"
        ],
        "name": "索尼",
        "regex": [
            "15.1666",
            "15.2666",
            "#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF:1\\.000000,[\\s\\S]*?#EXT-X-DISCONTINUITY",
            "#EXTINF.*?\\s+.*?p1ayer.*?\\.ts",
            "#EXTINF.*?\\s+.*?\\/video\\/original.*?\\.ts"
        ]
    }, {
        "hosts": [
            "kuaikan"
        ],
        "name": "快看",
        "regex": [
            "#EXT-X-KEY:METHOD=NONE\\r*\\n*#EXTINF:5,[\\s\\S]*?#EXT-X-DISCONTINUITY",
            "#EXT-X-KEY:METHOD=NONE\\r*\\n*#EXTINF:2\\.4,[\\s\\S]*?#EXT-X-DISCONTINUITY"
        ]
    }, {
        "hosts": [
            "cqxfjz",
            "svipsvip"
        ],
        "name": "555DM",
        "regex": [
            "10.56"
        ]
    }, {
        "name": "星星",
        "hosts": [
            "aws.ulivetv.net"
        ],
        "regex": [
            "#EXT-X-DISCONTINUITY\\r*\\n*#EXTINF:8,[\\s\\S]*?#EXT-X-DISCONTINUITY"
        ]
    }, {
        "hosts": [
            "haiwaikan"
        ],
        "name": "海外看",
        "regex": [
            "8.16",
            "8.1748",
            "10.0099",
            "10.3333",
            "10.85",
            "12.33",
            "16.0599"
        ]
    }, {
        "hosts": [
            ".hmrvideo"
        ],
        "name": "黑木耳",
        "regex": [
            "3.366"
        ]
    }];

    if (广告 !== "") {
        adm3u8.push(广告);
    }
    ;

    function hsdc(url) {
        let input = url;
        let file = "hiker://files/rules/DuanNian/MyParse.json";
        let oldfile = "hiker://files/cache/MyParseSet.json";
        if (fileExist(file)) {
            eval('json=' + fetch(file));
            let jsUrl = json.settings.cj;
            eval(fetch(jsUrl));
            return aytmParse(input);
        } else if (fileExist(oldfile)) {
            let jsUrl = JSON.parse(fetch(oldfile)).cj;
            eval(fetch(jsUrl));
            return aytmParse(input);
        } else {
            hideLoading();
            return 'toast://没找到断插配置文件';
        }
    };

    try {
        var purl = JSON.parse(fetch(input).match(/var player_.*?=(.*?)</)[1]);
        var p_url = purl.url;
    } catch (e) {
        var purl = [];
    }
    let url;
    if (purl == []) {
        url = [];
    } else if (purl.encrypt == "1") {
        url = unescape(p_url);
    } else if (purl.encrypt == "2") {
        url = unescape(base64Decode(p_url));
    } else {
        url = p_url;
    }
    ;

    let host = getHome(input);
    if (/sstv/.test(input)) {
        input = "https://www.aliyundrive.com.2kj.org/?url=" + url;
    } else if (/xy1080/.test(input)) {
        eval(request(host + '/static/js/playerconfig.js'));
        let jx = MacPlayerConfig.player_list[purl.from].parse;
        if (jx == '') {
            jx = MacPlayerConfig.parse
        }
        input = jx + url;
    }
    ;
    if (/quark\.cn|\.uc\.cn/.test(url)) {
        return "hiker://page/quarkList?rule=Quark.简&realurl=" + encodeURIComponent(url) + "&sharePwd=";
    } else if (/ali(pan|yun|yundrive)/.test(url)) {
        return "hiker://page/aliyun?rule=云盘君.简&page=fypage&realurl=" + encodeURIComponent(url);
    } else if (/\.mp4|\.m3u8|\.flv|\.m4a|\.mp3/.test(url)) {
        let Ad;
        if (/bfzy|bfbfvip|bbffvip|ddbbffcdn|rrcdnbf|vip\.lz|hd\.lz|\.cdnlz|\.ffzy|suonizy|kuaikan|cqxfjz|svipsvip|haiwaikan|\.hmrvideo/.test(url)) {
            Ad = clearM3u8Ad(url, {
                timeout: 3000
            }, adm3u8);
            toast("偿试去除视频广告");
        } else {
            Ad = url + ";{Referer@" + host + "}";
        }
        ;
        return Ad;
    } else if (getItem("断插") == "on" && /1905|fun.tv|le.com|pptv|mgtv|ixigua|sohu|miguvideo|bilibili|youku|qq.com|iqiyi/.test(url)) {
        showLoading("断插解析中，请稍候··");
        return hsdc(url);
    } else {
        let AI = getItem("AI", "off") == "on暂停使用";
        let AID = getItem("AID", "on") == "on暂停使用";
        showLoading("规则解析中，请稍候··");

        let 排除ex = 排除.replace(/^\//, "").replace(/\/$/, "");

        let 包含bh = 包含.replace(/^\//, "").replace(/\/$/, "");

        return "webRule://" + input + "@" + $.toString((dcy, input, AI, AID, hsdc, 点击, 排除, 包含, adm3u8) => {
            //fba.log(dcy);
            var durl = dcy;
            if (window.c == null) {
                if (typeof (request) == 'undefined' || !request) {
                    eval(fba.getInternalJs());
                }
                ;
                window.c = 0;
            }
            ;
            window.c++;
            if (window.c * 250 >= 10 * 1000) {
                fba.log("嗅探超时，超过10秒未获取到");
                return fba.parseLazyRule($$$("#noLoading#").lazyRule((durl, hsdc) => {
                    if (/1905|fun.tv|le.com|pptv|mgtv|ixigua|sohu|miguvideo|bilibili|youku|qq.com|iqiyi/.test(durl)) {
                        showLoading("解析超时，已启用断插");
                        return hsdc(durl);
                    } else {
                        hideLoading();
                        return "toast://解析超时，建议切换线路";
                    }
                    ;
                }, durl, hsdc));
            }
            ;

            if (点击 != ("undefined" && "")) {
                eval(点击.replace(/\'/g, ""));
            }
            ;
            //document.querySelectorAll('button')[1].click();
            //document.querySelector("#playleft iframe").contentWindow.document.querySelector("#start").click()

            var urls = window._getUrls();
            let exclude = /ac\=dm|http\:\/\/http|playm3u8|404\.m3u8|\.ruifenglb|\/余额不足\.m3u8|\/xiajia\.mp4|\.css$|\.png$|\.ts$|\.js$|\.ico$|\.js\?|globalDialog|\=nanke|m3u8\.cloud|m3u8\.pw|player.*\/\?url\=/;

            if (排除 != ("undefined" && "")) {
                exclude = new RegExp(exclude.source + '|' + 排除);
            }
            ;

            let contain = /sf16-sg|pd1\.123pan\.cn|cn-beijing-data\.ali(pan|yundrive)|hls\/play.*\.m3u8|s1\.czspp|netease\.com|dycdn-tos\.pstatp|\.mp4\?http|\.mp4\?|\.mp4&|fext\=mp4|\.m3u8\?http|\.mp4|\.MP4|\.m3u8|\.flv|\.avi|\.3gp|\.mpeg|\.wmv|\.mov|\.MOV|\.rmvb|\.dat|\.mkv|qqBFdownload|mime\=video%2F|\=video_mp4|\/video\/tos\/|pt\=m3u8|type\=m3u8|bdyun|\.m3u8\?\w*|\/ipfs\/|\.m4a|\.mp3|\.flac|\.wav|\.wma|\.ogg|\.aac|\.ape/;

            if (包含 != ("undefined" && "")) {
                contain = new RegExp(contain.source + '|' + 包含);
            }
            ;

            for (var i in urls) {
                //fba.log("全部: " + urls[i]);
                if (!exclude.test(urls[i]) && contain.test(urls[i])) {
                    var jurl = /ali|playurl|subaibaiwp|oorl/.test(urls[i]) ? urls[i] : urls[i].replace(/.*\.html\,/g, "").replace(/.*v\=http|.*url\=http/, "http");
                    fba.log(jurl);
                    if (fba.getHeaderUrl)
                        return fba.parseLazyRule($$$("#noLoading#").lazyRule((jurl, durl, AI, AID, hsdc, adm3u8) => {
                            var burl = base64Decode(jurl);
                            //log(burl);
                            var play = burl.replace(/\,.*;{/, ";{");
                            let Ad;
                            let aiurl;
                            if (/bfzy|bfbfvip|bbffvip|ddbbffcdn|rrcdnbf|vip\.lz|hd\.lz|\.cdnlz|\.ffzy|suonizy|kuaikan|cqxfjz|svipsvip|haiwaikan|\.hmrvideo/.test(play)) {
                                Ad = clearM3u8Ad(play.split(";{")[0], {
                                    timeout: 3000
                                }, adm3u8);
                                toast("偿试去除视频广告");
                            } else if (/sign\=|key|st\=|path\=|datas|encrypt\=|token|auth\_token/.test(play) && !/zxzy/.test(play)) {
                                Ad = cacheM3u8(play.split(";{")[0], {
                                    timeout: 3000
                                });
                            } else {
                                Ad = play.split(";{")[0];
                                aiurl = play.split(";{")[0] + "#ignoreImg=true##isVideo=true#;{" + play.split(";{")[1];
                            }
                            ;
                            var bfurl = /\.m4a|\.mp3|\.flac|\.wav|\.wma|\.ogg|\.aac|\.ape/.test(Ad) ? Ad + "#ignoreImg=true##isMusic=true#;{" + play.split(";{")[1] : Ad + "#ignoreImg=true##isVideo=true#;{" + play.split(";{")[1];

                            if (/\.html\}/.test(play)) {
                                var url = durl;
                            } else if (/\.m3u8/.test(aiurl) && !/shcpin/.test(aiurl) && AI && AID) {
                                var code = JSON.parse(fetch(aiurl, {
                                    withStatusCode: true,
                                    timeout: 2000
                                }));
                                if (code.statusCode != 200) {
                                    log("解析失效或无法访问，开始调用断插");
                                    var url = durl;
                                } else {
                                    return bfurl;
                                }
                                ;
                            } else if (/\.mp4/.test(aiurl) && AI && AID) {
                                var header = JSON.parse(fetch(aiurl, {
                                    onlyHeaders: true,
                                    timeout: 2000
                                }));
                                if (header.statusCode != 200) {
                                    log("解析失效或无法访问，开始调用断插");
                                    var url = durl;
                                } else {
                                    return Ad;
                                }
                                ;
                            } else {
                                return bfurl;
                            }
                            ;

                            if (/1905|fun.tv|le.com|pptv|mgtv|ixigua|sohu|miguvideo|bilibili|youku|qq.com|iqiyi/.test(url)) {
                                showLoading("解析失效，已启用断插");
                                return hsdc(url);
                            } else {
                                hideLoading();
                                return "toast://播放失败，建议切换线路";
                            }
                            ;
                        }, fy_bridge_app.base64Encode(fy_bridge_app.getHeaderUrl(jurl)), durl, AI, AID, hsdc, adm3u8));
                }
            }
        }, url, input, AI, AID, hsdc, 点击, 排除ex, 包含bh, adm3u8)
    }
};

function zw(nad, input, MY_HOME, game) {
    let Json;
    let file = getItem("dy", "本地") == "本地" ? "hiker://files/rules/FYJK/ys.json" : "hiker://files/cache/FY/dy/" + getItem("dy") + ".json";
    try {
        Json = JSON.parse(readFile(file));
    } catch (e) {
        Json = [];
        console.error('解析文件内容出错:', e);
    }
    ;
    let gy = getMyVar("namejs", "null") == "null" ? Json.find(item => item.name.replace(/&&.*/, "") === nad).gy : getMyVar("gyjs", "");
    let 公用 = eval("(" + gy + ")");

    if (getMyVar("namejs", "null") == "null") {
        try {
            let zw = 公用.正文(input);
            if (zw == "二级") {
                return $("hiker://empty##" + input + "#immersiveTheme##noHistory##autoCache" + game).rule(() => {
                    require(config.依赖);
                    erji()
                });
            } else {
                return zw;
            }
            ;
        } catch (e) {
            toast("解析正文失败，可能规则失效！");
            log(e.toString());
        }
        ;
    } else {
        let czw = 公用.正文(input);
        if (czw == "二级") {
            return $("hiker://empty##" + input + "#immersiveTheme##noHistory##autoCache" + game).rule(() => {
                require(config.依赖);
                erji()
            });
        } else {
            return czw;
        }
        ;
    }
    ;
};

function mx(nad, input, MY_HOME, game, input) {
    let Json;
    let file = getItem("dy", "本地") == "本地" ? "hiker://files/rules/FYJK/ys.json" : "hiker://files/cache/FY/dy/" + getItem("dy") + ".json";
    try {
        Json = JSON.parse(readFile(file));
    } catch (e) {
        Json = [];
        console.error('解析文件内容出错:', e);
    }
    ;
    let gy = getMyVar("namejs", "null") == "null" ? Json.find(item => item.name.replace(/&&.*/, "") === nad).gy : getMyVar("gyjs", "");
    let 公用 = eval("(" + gy + ")");
    let xt = getItem("嗅探", "off") == "on";
    if (!/漫画/.test(getItem("lx1", "全部")) && getMyVar("namejs", "null") == "null") {
        try {
            let mx = 公用.免嗅(input);
            if (mx == "嗅探") {
                return xt ? video() : lazy(nad);
            } else if (mx == "阿里") {
                return "hiker://page/aliyun?rule=云盘君.简&page=fypage&realurl=" + encodeURIComponent(input);
            } else if (mx == "夸克" || mx == "UC" || mx == "uc") {
                return "hiker://page/quarkList?rule=Quark.简&realurl=" + encodeURIComponent(input) + "&sharePwd=";
            } else if (mx == "二级") {
                return $("hiker://empty##" + input + "#immersiveTheme##noHistory##autoCache" + game).rule(() => {
                    require(config.依赖);
                    erji()
                });
            } else {
                return mx;
            }
            ;
        } catch (e) {
            toast("免嗅解析失败，自动转为嗅探！");
            log(e.toString());
            return xt ? video() : lazy(nad);
        }
        ;
    } else {
        let cmx = 公用.免嗅(input);
        if (cmx == "嗅探") {
            return xt ? video() : lazy(nad);
        } else if (cmx == "阿里") {
            return "hiker://page/aliyun?rule=云盘君.简&page=fypage&realurl=" + encodeURIComponent(input);
        } else if (cmx == "夸克" || cmx == "UC" || cmx == "uc") {
            return "hiker://page/quarkList?rule=Quark.简&realurl=" + encodeURIComponent(input) + "&sharePwd=";
        } else if (cmx == "二级") {
            return $("hiker://empty##" + input + "#immersiveTheme##noHistory##autoCache" + game).rule(() => {
                require(config.依赖);
                erji()
            });
        } else {
            return cmx;
        }
        ;
    }
    ;
};

function video(input) {
    try {
        var purl = JSON.parse(fetch(input).match(/var player_.*?=(.*?)</)[1]);
        var p_url = purl.url
    } catch (e) {
        var purl = [];
    }
    ;
    if (purl == []) {
        return "video://" + input;
    } else if (purl.encrypt == "1") {
        var url = unescape(p_url);
    } else if (purl.encrypt == "2") {
        var url = unescape(base64Decode(p_url));
    } else {
        var url = p_url
    }
    ;

    let host = getHome(input);
    if (/xy1080/.test(input)) {
        eval(request(host + '/static/js/playerconfig.js'));
        let jx = MacPlayerConfig.player_list[purl.from].parse;
        if (jx == '') {
            jx = MacPlayerConfig.parse
        }
        input = jx + url;
    }
    ;
    if (/quark\.cn|\.uc\.cn/.test(url)) {
        return url;
    } else if (/\.mp4|\.m3u8|\.flv/.test(url)) {
        return url;
    } else if (getItem("助手") == "on" && /1905|fun.tv|le.com|pptv|mgtv|ixigua|sohu|miguvideo|bilibili|youku|qq.com|iqiyi/.test(url)) {
        try {
            return $.require("hiker://page/mulParse?rule=配置助手").mulParse(url);
        } catch (e) {
            return "video://" + input;
        }
    } else {
        return "video://" + input;
    }
}
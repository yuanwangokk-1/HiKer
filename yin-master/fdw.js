function tb_url(dwfl, MY_URL) {
    电影_url = MY_URL;

    if (/id\/(\d+)|id-(\d+)/.test(电影_url)) {
        剧集_url = 电影_url.replace(/id\/28/, 'id/27').replace(/id\/20/, 'id/21').replace(/id\/1/, 'id\/2').replace(/id-20/, 'id-21').replace(/id-1/, 'id-2');
    } else if (/vodshow-(\d+)|vodshow\/(\d+)/.test(电影_url)) {
        剧集_url = 电影_url.replace(/\/20/, '/26').replace(/\/16/, '/2').replace(/\/1/, '/2').replace(/-1/, '-2');
    } else if (/lists\/(\d+)|list\/(\d+)|\/show\/(\d+)|tid\=(\d+)/.test(电影_url)) {
        剧集_url = 电影_url.replace(/lists\/1/, 'lists/2').replace(/list\/1/, 'list/2').replace(/show\/1/, 'show/2').replace(/tid\=1/, 'tid=2');
    } else if (/\/dianying|\/Movie\//.test(电影_url)) {
        剧集_url = /花花影院/.test(dwfl) ? 电影_url.replace(/\/dianying/, '/fenlei2') : 电影_url.replace(/\/oftensshow\/dianying/, '/oftensshow/dianshiju').replace(/\/dianying/, '/lianxuju').replace(/show\/Movie/, 'show/Tv').replace(/Movie/, 'Tv');
    } else {
        剧集_url = 电影_url.replace(/id-movie/, "id-tvplay").replace(/dyy/, 'dianshiju').replace(/guochandy/, 'guochanju').replace(/vodtype\/20/, 'vodtype/26');
    }
    ;

    if (/id\/(\d+)|id-(\d+)/.test(电影_url)) {
        动漫_url = 电影_url.replace(/id\/28/, 'id/20').replace(/id\/20/, 'id/23').replace(/id\/1/, 'id\/4').replace(/id-20/, 'id-23').replace(/id-1/, 'id-4');
    } else if (/vodshow-(\d+)|vodshow\/(\d+)/.test(电影_url)) {
        动漫_url = /COKEMV/.test(dwfl) ? 电影_url.replace(/\/1/, '/3') : /多聚影院/.test(dwfl) ? 电影_url.replace(/\/1/, '/5') : 电影_url.replace(/\/20/, '/25').replace(/\/16/, '/4').replace(/\/1/, '/4').replace(/-1/, '-4');
    } else if (/lists\/(\d+)|list\/(\d+)|\/show\/(\d+)|tid\=(\d+)/.test(电影_url)) {
        动漫_url = 电影_url.replace(/lists\/1/, 'lists/4').replace(/list\/1/, 'list/4').replace(/show\/1/, 'show/4').replace(/tid\=1/, 'tid=4');
    } else if (/\/dianying|\/Movie\//.test(电影_url)) {
        动漫_url = 电影_url.replace(/\/dianying/, '/dongman').replace(/show\/Movie/, 'show/Cartoon').replace(/Movie/, 'Dm');
    } else {
        动漫_url = 电影_url.replace(/id-movie/, "id-dongman").replace(/dyy/, 'dohua').replace(/guochandy/, 'dongmanju').replace(/vodtype\/20/, 'vodtype/25');
    }
    ;

    if (/id\/(\d+)|id-(\d+)/.test(电影_url)) {
        综艺_url = 电影_url.replace(/id\/28/, 'id/31').replace(/id\/20/, 'id/22').replace(/id\/1/, 'id\/3').replace(/id-20/, 'id-21').replace(/id-1/, 'id-3');
    } else if (/vodshow-(\d+)|vodshow\/(\d+)/.test(电影_url)) {
        综艺_url = /COKEMV/.test(dwfl) ? 电影_url.replace(/\/1/, '/29') : /多聚影院/.test(dwfl) ? 电影_url.replace(/\/1/, '/4') : 电影_url.replace(/\/20/, '/21').replace(/\/16/, '/3').replace(/\/1/, '/3').replace(/-1/, '-3');
    } else if (/lists\/(\d+)|list\/(\d+)|\/show\/(\d+)|tid\=(\d+)/.test(电影_url)) {
        综艺_url = 电影_url.replace(/lists\/1/, 'lists/3').replace(/list\/1/, 'list/3').replace(/show\/1/, 'show/3').replace(/tid\=1/, 'tid=3');
    } else if (/\/dianying|\/Movie\//.test(电影_url)) {
        综艺_url = 电影_url.replace(/\/dianying/, '/zongyi').replace(/show\/Movie/, 'show/Variety').replace(/Movie/, 'Zy');
    } else {
        综艺_url = 电影_url.replace(/id-movie/, "id-zongyi").replace(/dyy/, 'mj').replace(/guochandy/, 'zongyi').replace(/vodtype\/20/, 'vodtype/28');
    }
    ;
    return 电影_url + "$" + 剧集_url + "$" + 动漫_url + "$" + 综艺_url;
};

function _turl(dwfl, MY_URL) {
    let tr_url = getMyVar("Myurl.url", MY_URL);
    let page = MY_PAGE;
    if (/03影院/.test(dwfl)) {
        true_url = tr_url.replace(/search\.php\?(page\=1&)?/, 'search.php?page=' + page + '&');
    } else if (/Auete/.test(dwfl)) {
        if (page == 1) {
            true_url = tr_url;
        } else {
            true_url = tr_url.replace('.html', page + '.html');
        }
    } else if (/厂长资源|素白白/.test(dwfl)) {
        true_url = tr_url + '/page/' + page;
    } else if (/\/?([\w\d]+|)-.*?-.*?-.*?-.*?-.*?-.*?-.*?-\d*---\d*(\.html|\/$)/.test(MY_URL)) {
        true_url = tr_url.replace(/---\.html/, page + '---.html').replace(/---(\d+)\.html/, page + '---$1.html').replace(/---\//, page + '---/').replace(/---(\d+)\//, page + '---$1/');
    } else if (/((\/(\w*)show)?((\/|-)[\w\d%])?(\/area\/[\w\d%]+)?(\/by\/[\w\d%]+)?(\/id\/\d+)?(\/letter\/[\w\d%]+)?)(\/page\/\d+)?(\/year\/\d+)?(\.html|\/$)/.test(MY_URL)) {
        true_url = /\/year\//.test(tr_url) ? tr_url.replace(/year\/(\d+).html/, 'page/' + page + '/year/$1.html').replace(/year\/(\d+)\//, 'page/' + page + '/year/$1/') : /\/$/.test(tr_url) ? tr_url + 'page/' + page + '/' : tr_url.replace(/\.html/, '/page/' + page + '.html');
    } else if (/vod-show-id|vodtype\//.test(MY_URL)) {
        true_url = tr_url.replace(/vodtype\/(\d+)\.html/, 'vodtype/$1/page/' + page + '.html').replace(/\-id\-(\d+)/, "-id-$1-page-" + page);
    }
    ;
    return true_url;
};

function htmlf(MY_URL, MY_HOME, http, game, dwfl, true_url, d, page, off1) {
    let headers = {
        "User-Agent": MOBILE_UA,
        "Referer": MY_URL,
    };
    if (/往往影视|LIBVIO/.test(dwfl)) {
        let h = request(true_url, {
            headers: {
                'Cookie': fetch('hiker://files/cache/FY/cookie/' + dwfl + '.txt', {})
            }
        }); //log(h);
        if (/在访问之前检查浏览器/.test(h)) {
            ht = fetchCodeByWebView(true_url, {
                checkJs: $.toString((dwfl) => {
                    if (document.querySelector('.stui-vodlist li')) {
                        let cok = fba.getCookie(window.location.href);
                        fba.writeFile('hiker://files/cache/FY/cookie/' + dwfl + '.txt', cok);
                        return document.querySelector('.stui-vodlist li');
                    }
                    ;
                }, dwfl)
            }); //log(ht)
        } else {
            ht = h;
        }
        ;
    } else {
        ht = request(true_url, {
            timeout: 5000,
            headers: headers
        });
    }
    let html;
    if (ht.indexOf("检测中") != -1) {
        html = request(MY_HOME + "?btwaf" + ht.match(/btwaf(.*?)\"/)[1], {
            headers: headers
        });
    }
    ;

    if (/验证码|安全验证/.test(ht) && !/弹出验证码|验证通过/.test(ht)) {

        if (page == 1) {
            require(http + "yzm.js");
            return verify(MY_URL, MY_HOME, http, game, dwfl, true_url, d, page, "", off1);
        }
        ;
    } else if (ht == "" || !/电影|剧集|连续剧|电视剧|综艺|动漫|短剧|纪录|记录|番剧|视频|視頻|電影|劇集|續集|電視劇|綜藝|動畫|短劇|紀錄|番劇/.test(ht)) {
        if (page == 1) {
            toast("未获取到数据，请切换首页");
        }
        ;
        log(ht);
    } else {
        html = ht;
    }
    ;
    return html
};

function lei(dwfl, html) {
    if (/Auete/.test(dwfl)) {
        大类 = '.nav_tag_list&&td'
        拼接小类 = ''
        分类子 = 'body&&a:not(:matches(重置|首页|留言|最新|排行|专题|app|APP|会员|今日|更新|热榜|求片|反馈|发布|周表|地址|回家|午夜|明星|搜|榜|搜|榜))'
    } else if (/nav-swiper|hl-filter-list/.test(html)) {
        大类 = 'body&&.hl-nav||.nav-swiper'
        拼接小类 = 'body&&.hl-filter-list||.site-tabs'
        分类子 = 'body&&a:not(:matches(重置|首页|留言|最新|排行|专题|app|APP|会员|今日|更新|热榜|求片|反馈|发布|周表|地址|回家|午夜|明星|搜|榜))'
    } else if (/zmovo-teams/.test(html)) {
        大类 = 'body&&.zmovo-teams'
        拼接小类 = ''
        分类子 = 'body&&a:not(.text-muted):not(:matches(重置|首页|留言|最新|排行|专题|app|APP|会员|今日|更新|热榜|求片|反馈|发布|周表|地址|回家|午夜|明星|搜|榜))'
    } else if (/暂无/.test(dwfl)) {
        大类 = 'body&&.nav-tabs'
        拼接小类 = ''
        分类子 = 'body&&a:not(:matches(重置|首页|留言|最新|排行|专题|app|APP|会员|今日|更新|热榜|求片|反馈|发布|周表|地址|回家|午夜|明星|搜|榜))'
    } else if (/厂长资源|素白白/.test(dwfl)) {
        大类 = 'body&&.beautiful-taxonomy-filters-tax'
        拼接小类 = ''
        分类子 = 'body&&a:not(:matches(重置|首页|留言|最新|排行|专题|app|APP|会员|今日|更新|热榜|求片|反馈|发布|周表|地址|回家|午夜|明星|搜|榜))'
    } else if (/stui-screen__list/.test(html)) {
        大类 = 'body&&.stui-header__menu'
        拼接小类 = 'body&&.stui-screen__list'
        分类子 = 'body&&a:not(.text-muted:gt(1)):not(:matches(重置|首页|留言|最新|排行|专题|app|APP|会员|今日|更新|热榜|求片|反馈|发布|周表|地址|回家|午夜|明星|搜|榜|星空))'
    } else if (/myui-screen__list/.test(html)) {
        大类 = 'body&&.myui-nav__tabbar'
        拼接小类 = 'body&&.myui-screen__list'
        分类子 = 'body&&a:not(.text-muted):not(:matches(重置|首页|留言|最新|排行|专题|app|APP|会员|今日|更新|热榜|求片|反馈|发布|周表|地址|回家|午夜|明星|搜|榜))'
    } else if (/screenbox/.test(html)) {
        大类 = 'body&&.stui-header__menu'
        拼接小类 = '#screenbox&&ul'
        分类子 = 'body&&a:not(:matches(重置|首页|留言|最新|排行|专题|app|APP|会员|今日|更新|热榜|求片|反馈|发布|周表|地址|回家|午夜|明星|搜|榜))'
    } else if (/暂无/.test(dwfl)) {
        大类 = 'body&&.swiper-wrapper,1:'
        拼接小类 = 'body&&.site-tabs'
        分类子 = 'body&&a:not(:matches(重置|首页|留言|最新|排行|专题|app|APP|会员|今日|更新|热榜|求片|反馈|发布|周表|地址|回家|午夜|明星|搜|榜))'
    } else if (/select-menu/.test(html)) {
        大类 = '.select-menu&&span||li'
        拼接小类 = ''
        分类子 = 'body&&option||a:not(:matches(重置|首页|留言|最新|排行|专题|app|APP|会员|今日|更新|热榜|求片|反馈|发布|周表|地址|回家|午夜|明星|搜|榜))'
    } else if (/scroll-box/.test(html)) {
        大类 = 'body&&.swiper-wrapper'
        拼接小类 = 'body&&.scroll-box'
        分类子 = 'body&&a:not(:matches(重置|首页|留言|最新|排行|专题|app|APP|会员|今日|更新|热榜|求片|反馈|发布|周表|地址|回家|午夜|明星|搜|榜))'
    } else if (/classification-type/.test(html)) {
        大类 = '.classification-type&&li'
        拼接小类 = ''
        分类子 = 'body&&a:not(:matches(重置|首页|留言|最新|排行|专题|app|APP|会员|今日|更新|热榜|求片|反馈|发布|周表|地址|回家|午夜|明星|搜|榜))'
    }
    ;

    大类名 = 'a||option&&Text';
    大类链 = 'a||option&&value||cat-url||href';
    小类名 = 'a||option&&Text';
    小类链 = 'a||option&&value||cat-url||href';
    return 大类 + "$" + 拼接小类 + "$" + 分类子 + "$" + 大类名 + "$" + 大类链 + "$" + 小类名 + "$" + 小类链
};

function lieli(html) {
    if (/hl-vod-list/.test(html)) {
        列表 = '.hl-vod-list&&li'
    } else if (/zmovo-teams|public-list-box|pic-content/.test(html)) {
        列表 = 'body&&.item||.public-list-box||.pic-content'
    } else if (/module|module-items/.test(html) && !/stui-vodlist/.test(html)) {
        列表 = 'body&&.module-items||.module&&.module-item'
    } else {
        列表 = '.img-list||.fed-list-info||.bt_img||.stui-vodlist||.myui-vodlist||.list-a||.threadlist||.videoul&&li'
    }
    ;
    return 列表
};

function des(html) {
    if (/zmovo-teams|public-list-box|m-pic-l/.test(html)) {
        更新 = '.ft2||.m-pic-l||.c3&&span||*&&Text'
    } else if (/text-right|fed-list-remarks|hdtag|hl-pic-text|list-remarks|module-item-text|module-item-note|pic-text|jidi|hdinfo|videoul-tips/.test(html)) {
        更新 = '.fed-list-remarks||.hdtag||.hl-pic-text||.list-remarks||.module-item-text||.module-item-note||.pic-text||.jidi||.hdinfo||.videoul-tips||.text-right&&Text'
    }
    ;
    return 更新
};

function tu(dwfl, html) {
    if (/03影院/.test(dwfl)) {
        图片 = 'img&&src'
    } else if (/hl-lazy/.test(html)) {
        图片 = '.hl-lazy&&data-original'
    } else {
        图片 = '.videoul-img||.fed-lazy||.lazy||.lazyload&&data-original||data-src||lay-src||src'
    }
    return 图片;
};

function tir(dwfl, html) {
    if (/Nike/.test(dwfl)) {
        片名 = '.lazy&&alt'
        链接 = 'a&&href'
    } else if (/Auete/.test(dwfl)) {
        片名 = 'h2&&Text'
        链接 = 'h2&&a&&href'
    } else if (/厂长资源|素白白/.test(dwfl)) {
        片名 = 'h3&&Text'
        链接 = 'a&&href'
    } else if (/zmovo-teams/.test(html)) {
        片名 = '.zmovo-team-title&&a&&Text'
        链接 = '.zmovo-team-title&&a&&href'
    } else {
        片名 = 'a&&title'
        链接 = 'a&&href'
    }
    return 片名 + "$" + 链接
};
let names = getMyVar("namejs", "null") != "null" ? getMyVar("namejs") : off1.find(item => item.name.replace(/&&.*/, "") === dwfl);
let 电影_url;
let 剧集_url;
let 动漫_url;
let 综艺_url;
let true_url;
let html;
let ht;
let 大类;
let 拼接小类;
let 分类子;
let 大类名;
let 大类链;
let 小类名;
let 小类链;
let 列表;
let 更新;
let 图片;
let 片名;
let 链接;
let Js = getMyVar("namejs", "null") != "null" ? getMyVar("gs", gsValue) == "JS" : names.gs == "JS";

let HOst = getMyVar("namejs", "null") != "null" ? getMyVar("gs", gsValue) == "HOST" : names.gs == "HOST";

if (Js) {
    let s;
    let g;
    if (getMyVar("namejs", "null") != "null") {
        s = getMyVar("fljs");
        g = getMyVar("gyjs");
    } else {
        s = names.fl;
        g = names.gy;
    }
    ;

    let 公用;
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
    let fl = s.replace(/html\s*\=\s*fetch\(MY\_URL\)/, "html = fetch(MY_URL, {timeout: 5000, headers: headers })");
    eval(fl);
    if (typeof 免嗅 == "string" ? 免嗅 == "on" : false) {
        if (公用 && typeof 公用.免嗅 == "function") {
            try {
                var mx = 公用.免嗅.toString();
            } catch (e) {
                log(e.toString());
            }
            ;
        }
        ;
        if (公用 && typeof 公用.点播 == "string") {
            var db = 公用.点播;
        }
        ;
        if (公用 && typeof 公用.排除 == "object") {
            var ex = 公用.排除;
        }
        ;
        if (公用 && typeof 公用.包含 == "object") {
            var bh = 公用.包含;
        }
        ;
        if (公用 && typeof 公用.广告 == "object") {
            try {
                var gg = 公用.广告;
            } catch (e) {
                log(e.toString());
            }
            ;
        }
        ;
    } else if (公用 && typeof 正文 == "string" ? 正文 == "on" : false) {
        try {
            var zw = typeof 公用.正文 == "function" ? 公用.正文.toString() : "";
        } catch (e) {
            log(e.toString());
        }
        ;
    }
    ;
    let ison;
    try {
        var ht = JSON.parse(html);
        ison = "on";
    } catch (e) {
        ison = "off";
    }
    ;
    if (公用 && (typeof 公用.数字 == "function" ? 公用.数字(html) : false) && typeof 数字 == "undefined") {
        if (page == 1) {
            require(http + "yzm.js");
            verify(MY_URL, MY_HOME, http, game, dwfl, true_url, d, page, "", off1);
        }
        ;
    } else if (公用 && typeof 公用.验证 == "function" && (typeof 验证 == "function" ? 验证(html) : false)) {
        try {
            公用.验证(html, MY_URL);
        } catch (e) {
            log(e.toString());
        }
        ;
        deleteItemByCls("cls_load");
    } else if (html == "" || !/电影|剧集|连续剧|电视剧|综艺|动漫|短剧|纪录|记录|音乐|歌|DJ|MV|番剧|漫画|说|相声|书|小品|视频|視頻|電影|劇集|續集|電視劇|綜藝|動畫|短劇|紀錄|音樂|歌|番劇|漫畫|說|相聲|書|小藝/.test(html) && ison != "on" || ison == "on" && (typeof (ht) == "string" ? ht.code != 200 : "")) {
        if (page == 1) {
            log(html);
            toast("验证未通过或未获取到数据");
        }
        ;
    } else {
        html = html;
    }
    ;
}
;
if (HOst) {
    let tb = tb_url(dwfl, MY_URL);
    电影_url = tb.split("$")[0];
    剧集_url = tb.split("$")[1];
    动漫_url = tb.split("$")[2];
    综艺_url = tb.split("$")[3];
    true_url = _turl(dwfl, MY_URL);
    html = htmlf(MY_URL, MY_HOME, http, game, dwfl, true_url, d, page, off1);
    let flei = lei(dwfl, html);
    大类 = flei.split("$")[0];
    拼接小类 = flei.split("$")[1];
    分类子 = flei.split("$")[2];
    大类名 = flei.split("$")[3];
    大类链 = flei.split("$")[4];
    小类名 = flei.split("$")[5];
    小类链 = flei.split("$")[6];
    if (/hl-filter-list/.test(html)) {
        var 大类链替换 = function (text) {
            return text.replace(/\/list\/(\d+)\.html/, MY_URL.replace(MY_HOME, "").replace(/\d+/, "$1"));
        };
    } else if (/scroll-box/.test(html)) {
        var 大类链替换 = function (text) {
            return text.replace(/\/type\/(\d+)\.html/, MY_URL.replace(MY_HOME, "").replace(/\d+/, "$1")).replace(/\/type\//, "/show/").replace(/\/vodtype\/(\d+)\//, MY_URL.replace(MY_HOME, "").replace(/\d+/, "$1")).replace(/\/vodtype\/(\d+)\.html/, MY_URL.replace(MY_HOME, "").replace(/\d+/, "$1"));
        };
    } else if (/stui-screen__list/.test(html)) {
        var 大类链替换 = function (text) {
            return text.replace(/\/list\/(\d+)/, "/show/$1");
        };
    } else if (/myui-screen__list/.test(html)) {
        var 大类链替换 = function (text) {
            return text.replace(/\/vodtype\/(\d+)\//, MY_URL.replace(MY_HOME, "").replace(/\d+/, "$1")).replace(/\/vodtype\/(\d+)\.html/, MY_URL.replace(MY_HOME, "").replace(/\d+/, "$1"));
        };
    }

    列表 = lieli(html);
    更新 = des(html);
    图片 = tu(dwfl, html);
    let tirl = tir(dwfl, html);
    片名 = tirl.split("$")[0];
    链接 = tirl.split("$")[1];
}
;

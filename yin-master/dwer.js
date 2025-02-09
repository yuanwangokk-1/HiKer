let der = MY_PARAMS.pageTitle.match(/\「(.*)\」/)[1];
let Jso;
let file = getItem("dy", "本地") == "本地" ? "hiker://files/rules/FYJK/ys.json" : "hiker://files/cache/FY/dy/" + getItem("dy") + ".json";
try {
    Jso = JSON.parse(readFile(file));
} catch (e) {
    Jso = [];
    log(e.toString());
}
;

let off = Jso.filter(item => item.off === "1");
let names = getMyVar("namejs", "null") != "null" ? getMyVar("namejs").replace(/&&.*/, "") : off.find(item => item.name.replace(/&&.*/, "") === der);

let myName = getMyVar('namejs');
let result = off.find(item => item.name === myName);
let gsValue;
try {
    if (result) {
        gsValue = result.gs;
    } else {
        gsValue = "JS";
    }
    ;
} catch (e) {
}
;

function html2(der, http, MY_URL, off) {
    let headers = {
        "User-Agent": MOBILE_UA,
        "Referer": MY_URL,
    };
    let ht;
    if (/LIBVIO/.test(der)) {
        let h = request(MY_URL, {
            headers: {
                'Cookie': fetch('hiker://files/cache/FY/cookie/' + der + '.txt', {})
            }
        }); //log(h);
        if (/在访问之前检查浏览器/.test(h)) {
            var ht = fetchCodeByWebView(MY_URL, {
                checkJs: $.toString((der) => {
                    if (document.querySelector('.stui-vodlist li')) {
                        let cok = fba.getCookie(window.location.href);
                        fba.writeFile('hiker://files/cache/FY/cookie/' + der + '.txt', cok);
                        return document.querySelector('.stui-vodlist li');
                    }
                    ;
                }, der)
            }); //log(ht)
        } else {
            var ht = h;
        }
        ;
    } else {
        ht = request(MY_URL, {
            timeout: 5000,
            headers: headers
        });
    }
    ;
    let html;
    if (/验证码|系统安全验证|验证后|提交验证/.test(ht) && !/弹出验证码/.test(ht)) {
        require(http + "yzm.js");
        verify(MY_URL, MY_HOME, http, game, der, MY_URL, d, "", "", off);
    } else if (ht.indexOf('检测中') != -1) {
        html = request(MY_HOME + "?btwaf" + ht.match(/btwaf(.*?)\"/)[1], {
            headers: headers
        });
    } else if (ht == "" || !/电影|剧集|连续剧|电视剧|综艺|动漫|短剧|纪录|记录|番剧|视频|視頻|電影|劇集|續集|電視劇|綜藝|動畫|短劇|紀錄|番劇|集|话|章|期|回|卷|話/.test(ht)) {
        toast("没有数据可用，请切换其它源");
        log(ht);
    } else {
        html = ht;
    }
    ;
    return html
};

function bqian(der, html) {
    let 类型;
    let 导演;
    let 主演;
    let 简介;
    if (/SSTV/.test(der)) {
        类型 = '.play-news&&Text'
        导演 = 'p,1&&Text'
        主演 = '.play-top&&p&&Text'
        简介 = '.play-bottom&&Text'
    } else if (/暂无/.test(der)) {
        类型 = '.vod-detail-info&&li,2&&Text'
        导演 = '.vod-detail-info&&li,4&&Text'
        主演 = '.vod-detail-info&&li,3&&Text'
        简介 = '.txt-hidden&&Text'
    } else if (/好戏影院/.test(der)) {
        类型 = '.slide-info,0&&Text'
        导演 = '.slide-info:matches(导演)&&Text'
        主演 = '.slide-info:matches(主演|演员)&&Text'
        简介 = '.cor3&&Text'
    } else if (/Auete/.test(der)) {
        类型 = '.message&&p:matches([分]?类[型]?)&&Text'
        导演 = '.message&&p:contains(导演)&&Text'
        主演 = '.message&&p:contains(主演)&&Text'
        简介 = 'p,-5||p,-4&&Text'
    } else if (/LIBVIO/.test(der)) {
        类型 = 'p:matches(分类|类型)&&Text'
        导演 = 'p:matches(导演)&&Text'
        主演 = 'p:matches(主演|演员)&&Text'
        简介 = '.detail-content||.desc&&Text'
    } else if (/厂长资源|素白白/.test(der)) {
        类型 = '.dytext&&li,0&&Text'
        导演 = '.dytext&&li,5&&Text'
        主演 = '.dytext&&li,6&&Text'
        简介 = '.yp_context&&Text'
    } else if (/gen-search-form/.test(html)) {
        类型 = '.gen-search-form&&li:matches(类型|分类)&&Text'
        导演 = '.gen-search-form&&li:matches(导演)&&Text'
        主演 = '.gen-search-form&&li:matches(主演|演员)&&Text'
        简介 = '.top26&&Text'
    } else if (/parameter/.test(html)) {
        类型 = '#parameter&&li,7&&Text'
        导演 = '#parameter&&li,4&&Text'
        主演 = '#parameter&&li,3&&Text'
        简介 = '.top26&&Text'
    } else if (/hl-full-box/.test(html)) {
        //打驴
        类型 = '.hl-full-box&&li,6&&Text'
        导演 = '.hl-full-box&&li,3&&Text'
        主演 = '.hl-full-box&&li,2&&Text'
        简介 = '.hl-full-box&&li,-1&&Text'
    } else if (/video-info-aux/.test(html)) {
        类型 = '.video-info-aux&&Text'
        导演 = '.video-info-items:matches(导演)&&Text'
        主演 = '.video-info-items:matches(主演|演员)&&Text'
        简介 = '.video-info-content&&Text'
    } else if (/slide-info/.test(html)) {
        类型 = '.slide-info:matches(类型|分类)&&Text'
        导演 = '.slide-info:matches(导演)&&Text'
        主演 = '.slide-info:matches(主演|演员)&&Text'
        简介 = '.cor3&&Text'
    } else if (/myui-content__detail/.test(html)) {
        类型 = '.myui-content__detail&&p:matches(分类|类型)&&Text'
        导演 = '.myui-content__detail&&p:matches(导演)&&Text'
        主演 = '.myui-content__detail&&p:matches(主演|演员)&&Text'
        简介 = '.col-pd&&span,1&&Text'
    } else if (/stui-content__detail/.test(html)) {
        类型 = '.stui-content__detail&&p:matches(分类|类型)&&Text'
        导演 = '.stui-content__detail&&p:matches(导演)&&Text'
        主演 = '.stui-content__detail&&p:matches(主演|演员)&&Text'
        简介 = '.stui-content__detail&&p:matches(简介)&&Text'
    } else if (/module-info-tag/.test(html)) {
        类型 = '.module-info-tag&&Text'
        导演 = '.module-info-item:matches(导演)&&Text'
        主演 = '.module-info-item:matches(主演|演员)&&Text'
        简介 = '.module-info-item:matches(剧情|简介)||.module-info-item,0&&Text'
    } else if (/m-content/.test(html)) {
        类型 = '.m-content&&li,2&&Text'
        导演 = '.m-content&&li:matches(导演)&&Text'
        主演 = '.m-content&&li:matches(主演|演员)&&Text'
        简介 = '.m-intro&&Text'
    }
    return 类型 + "$" + 导演 + "$" + 主演 + "$" + 简介
};

//线路
function tabs1(der, html) {
    let 线路;
    let 线路名;
    if (/LIBVIO|达达龟|托乌视频/.test(der)) {
        线路 = 'body&&h3:not(:matches(猜你|更多|榜|屏蔽严重))'
        线路名 = 'body&&Text'
    } else if (/03影院/.test(der)) {
        线路 = '#playlist&&li'
        线路名 = 'body&&Text'
    } else if (/product-filter-list/.test(html)) {
        线路 = '.product-filter-list&&li'
        线路名 = 'a&&Text'
    } else if (/AB影院/.test(der)) {
        线路 = 'body&&h3:gt(0)'
        线路名 = 'body&&Text'
    } else if (/Auete/.test(der)) {
        线路 = 'body&&#player_list:not(:matches(猜你))'
        线路名 = 'h2--small&&Text'
    } else if (/nav-tabs|play-tab/.test(html)) {
        线路 = '.nav-tabs||.play-tab&&li'
        线路名 = 'a&&Text'
    } else if (/stui-pannel__head/.test(html)) {
        线路 = 'body&&.stui-pannel__head:not(:matches(猜你|更多|榜|屏蔽严重|友情链接))'
        线路名 = 'h3&&Text'
    } else if (/hl-tabs-btn/.test(html)) {
        线路 = 'body&&.hl-tabs-btn'
        线路名 = 'a&&alt'
    } else if (/anthology-tab/.test(html)) {
        线路 = '.anthology-tab&&div&&a'
        线路名 = 'body&&Text'
    } else if (/tab-item/.test(html)) {
        线路 = 'body&&.tab-item:not(:matches(猜你|更多|榜|屏蔽严重))'
        线路名 = 'span&&Text'
    } else if (/tag|Tab/.test(html)) {
        线路 = '#tag||#Tab&&a:not(:matches(下载))'
        线路名 = 'a&&Text'
    } else if (/play-zu-ul/.test(html)) {
        线路 = '.play-zu-ul&&li'
        线路名 = 'Text'
    }
    return 线路 + "$" + 线路名
};

//列表
function lists0(html) {
    let 列表;
    if (/hl-plays-list/.test(html)) {
        列表 = 'body&&.hl-plays-list'
    } else if (/module-play-list/.test(html)) {
        列表 = 'body&&.module-play-list'
    } else if (/playlist-notfull|content_playlist/.test(html)) {
        列表 = 'body&&.playlist-notfull||.content_playlist'
    } else {
        列表 = 'body&&.play-list||.play-ji-ul||.stui-play__list||.sort-item||.stui-content__playlist||.paly_list_btn||#player_list||.play_list||.sort-list||.anthology-list-play||.anthology-list-dow||.pagination'
    }
    return 列表
};

function lists00() {
    let 子列表 = 'body&&a:not(.hl-show-list):not(.download-bnt):not(:matches(全部|排序|复制))'
    return 子列表
}

//推荐列表
function tuilist(der, html) {
    let 推荐列表;
    if (/圣城影视/.test(der)) {
        推荐列表 = '.module-items&&.module-item:lt(9)'
    } else if (/module-items/.test(html) && /module-item/.test(html)) {
        推荐列表 = '.module-items,1||.module-items&&.module-item:lt(9)'
    } else if (/list-width/.test(html) && /pic-1/.test(html)) {
        推荐列表 = 'body&&.list-width.pic-1:lt(9)'
    } else if (/zmovo-team-section|public-list-box|pic-content/.test(html)) {
        推荐列表 = 'body&&.item:lt(8)||.public-list-box:lt(9)||.pic-content:lt(9)'
    } else if (/list-width|stui-vodlist__item|hide-b-16/.test(html)) {
        推荐列表 = 'body||.hide-b-16&&.stui-vodlist__item||.list-width:lt(9)'
    } else if (/img-list|vod-item-img|vod-love|stui-vodlist|fed-part-layout|hl-vod-list|bt_img|stui-vodlist__bd|myui-vodlist__bd/.test(html)) {
        推荐列表 = '.img-list||.vod-item-img||.stui-vodlist||.vod-love||.fed-part-layout,-2||.hl-vod-list||.bt_img||.stui-vodlist__bd||.myui-vodlist__bd&&li:lt(9)'
    } else {
        推荐列表 = 'null'
    }
    ;
    return 推荐列表
};

function tuili(html, 推荐列表) {
    let tuli = pdfa(html, 推荐列表);
    return tuli
};

function dw2(tuli, der) {
    let 推荐更;
    if (/m-pic-l/.test(tuli)) {
        推荐更 = '.m-pic-l&&span&&Text'
    } else if (/text-right|fed-list-remarks|list-remarks|remarks|pic-tag-left|module-item-note|module-item-text|pic-text|state|continu|public-list-subtitle|c3/.test(tuli)) {
        推荐更 = '.fed-list-remarks||.list-remarks||.remarks||.pic-tag-left||.module-item-note||.module-item-text||.pic-text||.state||.continu||.public-list-subtitle||.text-right||.c3&&Text'
    } else {
        推荐更 = 'a&&title'
    }

    let 推荐图;
    if (/暂无/.test(der)) {
        推荐图 = 'img&&src||lay-src'
    } else if (/hl-lazy|ff-img/.test(tuli)) {
        推荐图 = '.hl-lazy||.ff-img&&data-original'
    } else if (/br/.test(tuli) && /eclazy/.test(tuli) || /在线电影/.test(der)) {
        推荐图 = '.br||.myui-vodlist__thumb&&style'
    } else if (/lazy|lazyload/.test(tuli)) {
        推荐图 = '.lazy||.lazyload&&data-original||data-src'
    } else {
        推荐图 = 'img&&src'
    }
    ;

    //推荐名
    let 推荐名;
    if (/Nike/.test(der)) {
        推荐名 = '.lazy||.ff-img&&alt'
    } else if (/zmovo-team-title/.test(tuli)) {
        推荐名 = '.zmovo-team-title&&a&&Text'
    } else {
        推荐名 = "a&&title"
    }

    let 推荐链 = /zmovo-team-title/.test(tuli) ? '.zmovo-team-title&&a&&href' : "a&&href";
    return 推荐名 + "$" + 推荐更 + "$" + 推荐图 + "$" + 推荐链
};

var html;
let 线路;
let 线路名;
let 列表;
let 子列表;
let 类型;
let 导演;
let 主演;
let 简介;
let tuli;
let 推荐列表;
let 推荐名;
let 推荐更;
let 推荐图;
let 推荐链;
let 选集名;
let 选集链;

let Js = getMyVar("namejs", "null") != "null" ? getMyVar("gs", gsValue) == "JS" : names.gs == "JS";

let HOst = getMyVar("namejs", "null") != "null" ? getMyVar("gs", gsValue) == "HOST" : names.gs == "HOST";

if (Js) {
    let s;
    let g;
    if (getMyVar("namejs", "null") != "null") {
        s = getMyVar("erjs");
        g = getMyVar("gyjs");
    } else {
        s = names.er;
        g = names.gy;
    }
    ;

    var 公用;
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

    if (公用 && typeof 公用.免嗅 == "function") {
        try {
            var mx = 公用.免嗅.toString();
        } catch (e) {
            log(e.toString());
        }
        ;
    }
    ;
    if (公用 && typeof 公用.正文 == "function") {
        try {
            var zw = 公用.正文.toString();
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

    let headers = {
        "User-Agent": MOBILE_UA,
        "Referer": MY_URL,
    };
    let er = s.replace(/html\s*\=\s*fetch\(MY_URL\)/, "html = fetch(MY_URL, {timeout: 5000, headers: headers })");

    eval(er);

    let ison;
    try {
        var ht = JSON.parse(html);
        ison = "on";
    } catch (e) {
        ison = "off";
    }
    ;
    if (公用 && (typeof 公用.数字 == "function" ? 公用.数字(html) : false) && typeof 数字 == "undefined") {
        require(http + "yzm.js");
        verify(MY_URL, MY_HOME, http, game, der, MY_URL, d, "", "", off);
    } else if (公用 && typeof 公用.验证 == "function" && (typeof 验证 == "function" ? 验证(html) : false)) {
        try {
            公用.验证(html, MY_URL);
        } catch (e) {
            log(e.toString());
        }
        ;
        deleteItemByCls("cls_load");
    } else if (html == "" || !/电影|剧集|连续剧|电视剧|综艺|动漫|短剧|纪录|记录|音乐|歌|DJ|MV|番剧|漫画|说|相声|书|小品|视频|視頻|電影|劇集|續集|電視劇|綜藝|動畫|短劇|紀錄|音樂|歌|番劇|漫畫|說|相聲|書|小藝|集|话|章|期|回|卷|話/.test(html) && ison != "on" || ison == "on" && (typeof (ht) == "string" ? ht.code != 200 : "")) {
        toast("没有数据可用，请切换其它源");
        log(html);
    } else {
        html = html;
    }
    ;
    tuli = typeof 推荐 !== "undefined" ? 推荐(html) : "";
}
;
if (HOst) {
    html = html2(der, http, MY_URL, off);
    let tab = tabs1(der, html);
    线路 = tab.split("$")[0];
    线路名 = tab.split("$")[1];
    列表 = lists0(html);
    子列表 = lists00();
    选集名 = "a&&Text";
    选集链 = "a&&href";
    let bia = bqian(der, html);
    类型 = bia.split("$")[0];
    导演 = bia.split("$")[1];
    主演 = bia.split("$")[2];
    简介 = bia.split("$")[3];
    推荐列表 = tuilist(der, html);
    tuli = tuili(html, 推荐列表);
    let dwt = dw2(tuli, der);
    推荐名 = dwt.split("$")[0];
    推荐更 = dwt.split("$")[1];
    推荐图 = dwt.split("$")[2];
    推荐链 = dwt.split("$")[3];
}
;

try {
    var tuii = [];
    let col = "movie_3_marquee";
    for (let t in tuli) {
        let li = tuli[t];
        let title = Js ? li.title : pdfh(li, 推荐名);
        let desc = Js ? li.desc : pdfh(li, 推荐更);
        let pic = Js ? "" : pdfh(li, 推荐图);
        let img = Js ? li.img : (/\=http/.test(pic) ? pic.replace(/.*url=|.*tu=|\);/g, "") : pd(li, 推荐图)).replace(/\s*/g, "") + "@Referer=";
        let url = Js ? li.url : pd(li, 推荐链);
        let col_ = Js ? (typeof (li.col_type) != "undefined" ? li.col_type : col) : col;
        tuii.push(title + "$" + desc + "$" + img + "$" + url + "$" + col_)
    }
    ;
} catch (e) {
    log(e.toString());
    var tuii = "";
}
;

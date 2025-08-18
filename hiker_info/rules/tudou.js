const tudou = {
    d: [],
    title: '土豆视频',
    author: '流苏',
    version: '202505161',
    rely: (data) => {
        return data.match(/\{([\s\S]*)\}/)[0].replace(/\{([\s\S]*)\}/, '$1')
    },
    home: () => {
        var d = tudou.d;
        if (MY_PAGE == 1) {
            d.push({   
                title: "搜索 ",
                url: $.toString(() => {
                    putMyVar('keyword', input)
                    return "hiker://empty?page=fypage&kw=" + input + '@rule=js:$.require("tudou").search()'
                }),
                   desc: "请输入搜索关键词",
                   col_type: "input",
                extra: {
                    defaultValue: getMyVar('keyword', ''),
                }
            })
        };
        var pg = MY_URL.replace('hiker://empty##', '');
        var c1 = [{
            title: '首页&总览&短视频&女优&社区',
            id: '1&2&3&4&5',
            img: 'https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/47.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/74.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/30.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/9.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/7.png'
        }];
        if (MY_PAGE == 1) {
            eval(tudou.rely(tudou.aes));
            Cate(c1, 'c1', d, 'icon_5');
            d.push({
                col_type: 'line',
            }, {
                col_type: 'big_blank_block',
            }, {
                col_type: 'big_blank_block',
            });
        }
        var 分类 = getMyVar('c1', '1');
        if (MY_RULE.author == tudou.author || MY_NAME == '嗅觉浏览器') {
            if (分类 == 1) {
                tudou.video()
            } else if (分类 == 2) {
                tudou.zonglan()
            } else if (分类 == 3) {
                tudou.mini()
            } else if (分类 == 4) {
                tudou.nvyou()
            } else if (分类 == 5) {
                tudou.news()
            }
        } else {
            d.push({
                title: '请勿修改作者名',
                url: 'hiker://empty',
                col_type: 'text_center_1'
            })
        }
        setResult(d)
    },
    aes: $.toString(() => {
        let image = $().image(() => {
            const CryptoUtil = $.require("hiker://assets/crypto-java.js");
            let textData = CryptoUtil.Data.parseInputStream(input);
            let base64Text = textData.toString();
            let encrypted0 = CryptoUtil.Data.parseBase64(base64Text, _base64.NO_WRAP);
            return encrypted0.toInputStream();
        });

        function pageAdd(page) {
            if (getMyVar("page")) {
                putMyVar("page", (parseInt(page) + 1) + '');
            }
            return;
        } //翻页
        function strong(d, c) {
            return '‘‘’’<strong><font color=#' + (c || '000000') + '>' + d + '</font></strong>';
        }

        function color(txt) {
            return '<b><font color=' + '#FF6699' + '>' + txt + '</font></b>'
        }

        function Cate(list, n, d, col) {
            if (!col) {
                col = 'scroll_button';
            }
            var index_n = list[0].id.split('&')[0] + '';
            list.forEach(data => {
                var title = data.title.split('&');
                var id = data.id.split('&');
                if (data.img != null) {
                    var img = data.img.split('&');
                } else {
                    var img = [];
                }
                title.forEach((title, index) => {
                    d.push({
                        title: (getMyVar(n, index_n) == id[index] ? strong(title, 'FF6699') : title),
                        img: img[index],
                        url: $('#noLoading#').lazyRule((n, title, id) => {
                            putMyVar(n, id);
                            refreshPage(false);
                            return 'hiker://empty';
                        }, n, title, id[index] + ''),
                        col_type: col,
                    })
                })
                d.push({
                    col_type: 'blank_block',
                });
            })
            return d;
        }

        function pageMoveto(page, pages) {
            var longClick = [{
                title: "首页",
                js: $.toString(() => {
                    putMyVar("page", "1");
                    refreshPage();
                    return "hiker://empty";
                }),
            }, {
                title: "上页",
                js: $.toString((page) => {
                    if (page > 1) {
                        putMyVar("page", (parseInt(page) - 1));
                        refreshPage();
                        return "hiker://empty";
                    }
                }, page),
            }, {
                title: "当前第" + page + "页",
                js: "",
            }, {
                title: "跳转",
                js: $.toString(() => {
                    return $("").input(() => {
                        putMyVar("page", input);
                        refreshPage();
                    });
                }),
            }];
            if (typeof(pages) != 'undefined') {
                var extra1 = {
                    title: "尾页" + pages,
                    js: $.toString((pages) => {
                        putMyVar("page", pages);
                        refreshPage();
                        return "hiker://empty";
                    }, pages),
                };
                longClick.push(extra1)
            }
            return longClick
        } //长按跳页
    }),
    video: () => {
        let d = tudou.d;
        eval(tudou.rely(tudou.aes))
        let pg = MY_URL.replace('hiker://empty##', '');
        try {
            if (MY_PAGE == 1) {
                let movie_index_url = getItem('host') + '/api/movie/index';
                let movie_cate = fetch(movie_index_url, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'api-token': getItem('token'),
                        'api-type': 'WAP',
                    },
                    body: 'page=1',
                    method: 'POST'
                })
                let movie_cate_data = JSON.parse(movie_cate).data.cates;
                let movie_cate_data_n = movie_cate_data[0].id + '';
                putMyVar('movie_cate_data_n', movie_cate_data_n);
                movie_cate_data.forEach(data => {
                    d.push({
                        title: (getMyVar('movie_cate', getMyVar('movie_cate_data_n')) == data.id ? strong(data.name, 'FF6699') : data.name),
                        url: $('#noLoading#').lazyRule((n, title, id) => {
                            putMyVar(n, id);
                            refreshPage(false);
                            return 'hiker://empty';
                        }, 'movie_cate', data.name, data.id + ''),
                        col_type: 'scroll_button',
                    })
                })

                let movie_list_url = getItem('host') + '/api/movie/list';
                let movie_list = JSON.parse(fetch(movie_list_url, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'api-token': getItem('token'),
                        'api-type': 'WAP',
                    },
                    body: 'page=' + pg + '&style=0&cates=' + getMyVar('movie_cate', getMyVar('movie_cate_data_n')),
                    method: 'POST'
                })).data.list;
                movie_list.forEach(data => {
                    d.push({
                        title: color(data.name),
                        img: 'hiker://images/icon_right5',
                        url: 'hiker://empty?page=fypage@rule=js:$.require("tudou").videoerji()',
                        col_type: 'text_icon',
                        extra: {
                            id: data.id,
                        }
                    })
                    let movie_list_list = data.list;
                    movie_list_list.forEach(data => {
                        if (getMyVar('vod_host') == '') {
                            let vod_host = data.cover_url.split('.com/')[0] + '.com/';
                            putMyVar('vod_host', vod_host)
                        }
                        d.push({
                            title: data.title,
                            desc: data.create_at + '  ' + data.duration + '  ' + data.marks,
                            img: data.cover_url + image,
                            url: getMyVar('vod_host') + data.src,
                            col_type: 'movie_2',
                        })
                    })
                })
            }
        } catch (e) {
            log(e.message)
            if (getMyVar('a') == '') {
                //let host = 'https://apip.skolx.cn';
                let html = fetch('https://ilitqxipof4.icu/h5')
                let host_ = pdfa(html, 'body&&script').map(c => pdfh(c, 'script&&src'))[0].split('.')[1];
                let host = `https://apip.${host_}.cn`
                setItem('host', host);
                let account_url = getItem('host') + '/api/in/autoAccount3';
                let account_body = 'client_id=&c_code=&p_code=&a_code=&a_ins=';
                let account_data = fetch(account_url, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'api-token': 'false',
                        'api-type': 'WAP'
                    },
                    body: account_body,
                    method: 'POST'
                });
                let account_token = JSON.parse(account_data).data.token;
                let account_client_id = JSON.parse(account_data).data.client_id;
                setItem('token', account_token);
                setItem('client_id', account_client_id);
                putMyVar('a', '1')
                refreshPage(false)
                toast('域名已更新')
            }
        }
    },
    videoerji: () => {
        let d = tudou.d;
        eval(tudou.rely(tudou.aes))
        let id = MY_PARAMS.id;
        let pg = getParam('page');
        try {
            if (MY_PAGE == 1) {
                let 视频二级 = [{
                    title: '最新&最热&时长',
                    id: 'id desc&num_read desc&duration desc',
                }]
                Cate(视频二级, '视频二级', d)
            }
            let url = getItem('host') + '/api/movie/getCateMovieList';
            let list = JSON.parse(fetch(url, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'api-token': getItem('token'),
                    'api-type': 'WAP',
                },
                body: {
                    page: pg,
                    id: id,
                    order: getMyVar('视频二级', 'id desc'),
                },
                method: 'POST'
            })).data.list;
            list.forEach(data => {
                d.push({
                    title: data.title,
                    desc: data.create_at + '  ' + data.duration + '  ' + data.marks,
                    img: data.cover_url + image,
                    url: getMyVar('vod_host') + data.src,
                    col_type: 'movie_2',
                })
            })
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    zonglan: () => {
        let d = tudou.d;
        eval(tudou.rely(tudou.aes))
        var pg = MY_URL.replace('hiker://empty##', '');
        try {
            if (MY_PAGE == 1) {
                d.push({
                    title: '传媒演员',
                    url: 'hiker://empty?page=fypage@rule=js:$.require("tudou").actor()',
                    col_type: 'text_3',
                }, {
                    title: '传媒原创',
                    url: 'hiker://empty?page=fypage@rule=js:$.require("tudou").yuanchuang()',
                    col_type: 'text_3',
                }, {
                    title: '每日最新',
                    url: 'hiker://empty?page=fypage@rule=js:$.require("tudou").home_new()',
                    col_type: 'text_3',
                })
                let home_index_url = getItem('host') + '/api/home/index';
                let home_cate = fetch(home_index_url, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'api-token': getItem('token'),
                        'api-type': 'WAP',
                    },
                    method: 'POST'
                })
                let home_cate_data = JSON.parse(home_cate).data.cates;
                home_cate_data.forEach(data => {
                    d.push({
                        title: color(data.name),
                        desc: data.create_at,
                        img: 'http://api.xka1.top/6img/madouchuanmei.jpg',
                        url: 'hiker://empty',
                        col_type: 'avatar',
                        extra: {
                            id: data.id,
                        }
                    })
                    let sub = data.sub;
                    sub.forEach(data => {
                        d.push({
                            title: data.name,
                            img: data.cover_url + image,
                            url: 'hiker://empty?page=fypage@rule=js:$.require("tudou").zonglanerji()',
                            col_type: 'card_pic_3_center',
                            extra: {
                                id: data.id,
                            }
                        })
                    })
                })
            }
        } catch (e) {
            log(e.message)
        }
    },
    zonglanerji: () => {
        let d = tudou.d;
        eval(tudou.rely(tudou.aes))
        let id = MY_PARAMS.id;
        let pg = getParam('page');
        try {
            if (MY_PAGE == 1) {
                let 总览二级 = [{
                    title: '最新视频&最多播放',
                    id: 'id desc&num_play desc',
                }]
                Cate(总览二级, '总览二级', d)
            }
            let url = getItem('host') + '/api/home/getCateList';
            let list = JSON.parse(fetch(url, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'api-token': getItem('token'),
                    'api-type': 'WAP',
                },
                body: {
                    page: pg,
                    cates: id,
                    order: getMyVar('总览二级', 'id desc'),
                },
                method: 'POST'
            })).data.list;
            list.forEach(data => {
                d.push({
                    title: data.title,
                    desc: data.create_at + '  ' + data.duration + '  ' + data.marks,
                    img: data.cover_url + image,
                    url: getMyVar('vod_host') + data.src,
                    col_type: 'movie_2',
                })
            })
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    mini: () => {
        let d = tudou.d;
        eval(tudou.rely(tudou.aes))
        try {
            let pg = +MY_URL.replace('hiker://empty##', '');
            if (MY_PAGE == 1) {
                let 短视频 = [{
                    title: '推荐&热榜',
                    id: 'getShortData&getHotData',
                }]
                Cate(短视频, '短视频', d)
            }
            let url = getItem('host') + '/api/video/' + getMyVar('短视频', 'getShortData');
            let list = JSON.parse(fetch(url, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'api-token': getItem('token'),
                    'api-type': 'WAP',
                },
                body: {
                    page: pg,
                },
                method: 'POST'
            })).data;
            if (getMyVar('短视频', 'getShortData') == 'getShortData') {
                list.list.forEach(data => {
                    d.push({
                        title: data.title,
                        desc: data.create_at + '   ' + data.duration,
                        img: data.cover_url + image,
                        url: getMyVar('vod_host') + data.src,
                        col_type: 'movie_3',
                    })
                })
            } else {
                if (MY_PAGE == 1) {
                    let 短视频分类 = [{
                        title: '最热&最新',
                        id: 'hot&day',
                    }]
                    Cate(短视频分类, '短视频分类', d)
                }
                list[getMyVar('短视频分类', 'hot')].forEach(data => {
                    d.push({
                        title: data.title,
                        desc: data.create_at + '   ' + data.duration,
                        img: data.cover_url + image,
                        url: getMyVar('vod_host') + data.src,
                        col_type: 'movie_3',
                    })
                })
            }
        } catch (e) {
            log(e.message)
        }
    },
    nvyou: () => {
        let d = tudou.d;
        eval(tudou.rely(tudou.aes))
        let pg = MY_URL.replace('hiker://empty##', '');
        try {
            let nvyou_url = getItem('host') + '/api/movie/actorxList';
            let list = JSON.parse(fetch(nvyou_url, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'api-token': getItem('token'),
                    'api-type': 'WAP',
                },
                body: {
                    page: pg,
                    cates: '1003',
                    order: 'id desc',
                },
                method: 'POST'
            })).data.list;
            list.forEach(data => {
                d.push({
                    title: data.name,
                    img: data.cover_url + image,
                    url: 'hiker://empty?page=fypage@rule=js:$.require("tudou").nvyouerji()',
                    col_type: 'card_pic_3_center',
                    extra: {
                        id: data.id
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
    },
    nvyouerji: () => {
        let d = tudou.d;
        eval(tudou.rely(tudou.aes))
        let id = MY_PARAMS.id;
        let pg = getParam('page');
        try {
            if (MY_PAGE == 1) {
                let 女优二级 = [{
                    title: '最新视频&最多播放',
                    id: 'id desc&num_play desc',
                }]
                Cate(女优二级, '女优二级', d)
            }
            let url = getItem('host') + '/api/movie/getActorsDetail';
            let list = JSON.parse(fetch(url, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'api-token': getItem('token'),
                    'api-type': 'WAP',
                },
                body: {
                    page: pg,
                    actors: id,
                    order: getMyVar('女优二级', 'id desc'),
                },
                method: 'POST'
            })).data.list;
            list.forEach(data => {
                d.push({
                    title: data.title,
                    desc: data.create_at + '  ' + data.duration + '  ' + data.marks,
                    img: data.cover_url + image,
                    url: getMyVar('vod_host') + data.src,
                    col_type: 'movie_2',
                })
            })
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    yuanchuang: () => {
        let d = tudou.d;
        eval(tudou.rely(tudou.aes))
        let pg = getParam('page');
        try {
            let url = getItem('host') + '/api/home/getOriginalList';
            let list = JSON.parse(fetch(url, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'api-token': getItem('token'),
                    'api-type': 'WAP',
                },
                body: {
                    page: pg,
                    cates: '23',
                },
                method: 'POST'
            })).data.list;
            list.forEach(data => {
                d.push({
                    title: data.title,
                    desc: data.create_at + '  ' + data.duration + '  ' + data.marks,
                    img: data.cover_url + image,
                    url: getMyVar('vod_host') + data.src,
                    col_type: 'movie_2',
                })
            })
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    actor: () => {
        let d = tudou.d;
        eval(tudou.rely(tudou.aes))
        let pg = getParam('page');
        try {
            if (MY_PAGE == 1) {
                let 演员 = [{
                    title: '推荐演员&全部演员',
                    id: '1&0',
                }]
                Cate(演员, '演员', d)
            }
            let actor_url = getItem('host') + '/api/home/getActorsList';
            let list = JSON.parse(fetch(actor_url, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'api-token': getItem('token'),
                    'api-type': 'WAP',
                },
                body: {
                    page: pg,
                    top: getMyVar('演员', '1'),
                },
                method: 'POST'
            })).data.list;
            if (getMyVar('演员', '1') == 1) {
                list.forEach(data => {
                    d.push({
                        title: data.name,
                        desc: data.parameter + '\n' + data.remark,
                        img: data.cover_url + image,
                        url: 'hiker://empty?page=fypage@rule=js:$.require("tudou").actorerji()',
                        col_type: 'movie_1_left_pic',
                        extra: {
                            id: data.id
                        }
                    })
                })
            } else {
                list.forEach(data => {
                    d.push({
                        title: data.name,
                        img: data.cover_url + image,
                        url: 'hiker://empty?page=fypage@rule=js:$.require("tudou").actorerji()',
                        col_type: 'card_pic_3_center',
                        extra: {
                            id: data.id
                        }
                    })
                })
            }
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    actorerji: () => {
        let d = tudou.d;
        eval(tudou.rely(tudou.aes))
        let id = MY_PARAMS.id;
        let pg = getParam('page');
        try {
            let url = getItem('host') + '/api/home/getActorsDetail';
            let list = JSON.parse(fetch(url, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'api-token': getItem('token'),
                    'api-type': 'WAP',
                },
                body: {
                    page: pg,
                    actors: id,
                },
                method: 'POST'
            })).data.list;
            list.forEach(data => {
                d.push({
                    title: data.title,
                    desc: data.create_at + '  ' + data.duration + '  ' + data.marks,
                    img: data.cover_url + image,
                    url: getMyVar('vod_host') + data.src,
                    col_type: 'movie_2',
                })
            })
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    home_new: () => {
        let d = tudou.d;
        eval(tudou.rely(tudou.aes))
        let pg = getParam('page');
        try {
            let url = getItem('host') + '/api/home/getupToDateList';
            let list = JSON.parse(fetch(url, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'api-token': getItem('token'),
                    'api-type': 'WAP',
                },
                body: {
                    page: pg,
                },
                method: 'POST'
            })).data.list;
            list.forEach(data => {
                d.push({
                    title: data.title,
                    desc: data.create_at + '  ' + data.duration + '  ' + data.marks,
                    img: data.cover_url + image,
                    url: getMyVar('vod_host') + data.src,
                    col_type: 'movie_2',
                })
            })
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    news: () => {
        let d = tudou.d;
        d.push({
            title: '待续\n原网站没做出来，以后可能会写',
            url: 'hiker://empty',
            col_type: 'text_center_1'
        })
    },
    search: () => {
        let d = tudou.d;
        eval(tudou.rely(tudou.aes))
        var pg = getParam('page');
        try {
            if (MY_PAGE == 1) {
                d.push({   
                    title: "搜索 ",
                    url: $.toString(() => {
                        putMyVar('keyword', input)
                        refreshPage(false)
                        return "hiker://empty"
                    }),
                       desc: "请输入搜索关键词",
                       col_type: "input",
                    extra: {
                        defaultValue: getMyVar('keyword', ''),
                        pageTitle: '搜索结果'
                    }
                })
            }
            let url = getItem('host') + '/api/movie/getSearchMovieList?page=' + pg + '&keyword=' + getMyVar('keyword');
            let list = JSON.parse(fetch(url, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'api-token': getItem('token'),
                    'api-type': 'WAP',
                },
                method: 'POST'
            })).data.list;
            list.forEach(data => {
                d.push({
                    title: data.title,
                    desc: data.create_at + '  ' + data.duration + '  ' + data.marks,
                    img: data.cover_url + image,
                    url: getMyVar('vod_host') + data.src,
                    col_type: 'movie_2',
                })
            })
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
}
$.exports = tudou

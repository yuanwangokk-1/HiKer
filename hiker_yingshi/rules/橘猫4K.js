const csdown = {
    d: [],
    author: '流苏',
    version: '20250607',
    rely: (data) => {
        return data.match(/\{([\s\S]*)\}/)[0].replace(/\{([\s\S]*)\}/, '$1')
    },
    home: () => {
        var d = csdown.d;
        if (!getItem('up' + csdown.version, '')) {
            csdown.update()
            setItem('up' + csdown.version, '1')
        }
        if (MY_PAGE == 1) {
            d.push({
                title: "搜索 ",
                url: $.toString(() => {
                    putMyVar('keyword', input)
                    return 'hiker://empty?page=fypage@rule=js:$.require("csdown").search()'
                }),
                desc: "请输入搜索关键词",
                col_type: "input",
                extra: {
                    defaultValue: getMyVar('keyword', ''),
                }
            })
        }

        var pg = getParam('page');
        let 首页 = [{
            title: '首页&分类&排行榜&排期表',
            id: '1&2&3&4&5',
            img: 'https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/47.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/175.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/78.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/48.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/109.png'
        }];

        if (MY_PAGE == 1) {
            eval(csdown.rely(csdown.aes));
            let longclick = [{
                title: '更新日志',
                js: $.toString(() => {
                    $.require("csdown").update()
                })
            }]
            Cate(首页, '首页', d, 'icon_4', longclick);
            d.push({
                col_type: 'line',
            }, {
                col_type: 'big_blank_block',
            }, {
                col_type: 'big_blank_block',
            });
        }
        var 分类 = getMyVar('首页', '1');
        if (MY_RULE.author == csdown.author || MY_NAME == '嗅觉浏览器') {
            if (分类 == 1) {
                csdown.video()
            } else if (分类 == 2) {
                csdown.cate()
            } else if (分类 == 3) {
                csdown.rank()
            } else if (分类 == 4) {
                csdown.week()
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
        //加载CryptoJS库
        eval(getCryptoJS())

        function color(txt) {
            return '<b><font color=' + '#FF6699' + '>' + txt + '</font></b>'
        }

        function strong(d, c) {
            return '‘‘’’<strong><font color=#' + (c || '000000') + '>' + d + '</font></strong>';
        }

        if (!getMyVar('host', '')) {
            let appurl = fetch('https://appcms.htsp4k.top/appurl.txt');
            putMyVar('host', appurl)
        }

        function Cate(list, n, d, col, longclick) {
            if (!col) {
                col = 'scroll_button';
            }
            if (!longclick) {
                longclick = [];
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
                        extra: {
                            longClick: longclick,
                            backgroundColor: getMyVar(n, index_n) == id[index] ? "#20FA7298" : "",
                        }
                    })
                })
                d.push({
                    col_type: 'blank_block',
                });
            })
            return d;
        }

        const de_key = '7CYQQzwchRQpHCOj';

        // 解密函数
        function Decrypt(word) {
            const key = CryptoJS.enc.Utf8.parse(de_key);
            const iv = CryptoJS.enc.Utf8.parse(de_key);
            let encryptedHexStr = CryptoJS.enc.Base64.parse(word);
            let decrypt = CryptoJS.AES.decrypt({
                ciphertext: encryptedHexStr
            }, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
            return decryptedStr;
        }

        // 加密函数
        function Encrypt(plaintext) {
            const id = CryptoJS.enc.Utf8.parse(de_key);
            const iv = CryptoJS.enc.Utf8.parse(de_key);
            var encrypted = CryptoJS.AES.encrypt(plaintext, id, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            var ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
            return ciphertext;
        }

        function post(url, body) {
            if (!body) {
                var body = '';
            }
            let html = fetch(getMyVar('host') + url, {
                headers: {},
                body: body,
                method: 'POST'
            });
            let html1 = Decrypt(JSON.parse(html).data);
            return JSON.parse(html1);
        }

        function pageAdd(page) {
            if (getMyVar("page")) {
                putMyVar("page", (parseInt(page) + 1) + '');
            }

        } //翻页

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
            if (typeof (pages) != 'undefined') {
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

        function setDesc(d, desc, num) {
            //log(desc)
            if (desc == undefined) {
                return;
            }
            desc = desc.constructor == Array ? desc.join('<br>') : desc;
            if (desc.replace(/(<br>|\s+|<\/?p>|&nbsp;)/g, '').length == 0) {
                return;
            }
            const mark = 'desc';
            num = typeof (num) == 'undefined' ? 45 : num
            desc = desc.startsWith('　　') ? desc : '　　' + desc;
            desc = desc.replace(/'/g, "&#39;");
            desc = desc.replace(/\r\n/g, "<br>");
            desc = desc.replace(/\r/g, "<br>");
            desc = desc.replace(/\n/g, "<br>");

            function substr(str, maxLength) {
                let len = 0;
                for (let i = 0; i < str.length; i++) {
                    if (str.charCodeAt(i) > 255) {
                        len += 2;
                    } else {
                        len++;
                    }
                    if (len > maxLength) {
                        return str.slice(0, i) + '...';
                    }
                }
                return str;
            }

            let sdesc = substr(desc, num);
            var colors = {
                show: "black",
                hide: "grey"
            }
            var lazy = $(`#noLoading#`).lazyRule((dc, sdc, m, cs) => {
                var show = storage0.getItem(m, '0');
                var title = findItem('desc').title;
                var re = /(<\/small><br>.*?>).+/g;
                var exp = '展开:';
                var ret = '收起:';
                if (show == '1') {
                    updateItem('desc', {
                        title: title
                            .replace(ret, exp)
                            .replace(re, '$1' + sdc + '</small>')
                            .replace(/(<\/small><br>\<font color=").*?(">)/, '$1' + cs.hide + '$2')
                    })
                    storage0.setItem(m, '0');
                } else {
                    updateItem('desc', {
                        title: title
                            .replace(exp, ret)
                            .replace(re, '$1' + dc + '</small>')
                            .replace(/(<\/small><br>\<font color=").*?(">)/, '$1' + cs.show + '$2')
                    })
                    storage0.setItem(m, '1');
                }
                return `hiker://empty`
            }, desc, sdesc, mark, colors)
            var sc = storage0.getItem(mark, '0') == '0' ? '展开:' : '收起:';
            var dc = storage0.getItem(mark, '0') == '0' ? sdesc : desc;
            var cs = storage0.getItem(mark, '0') == '0' ? colors.hide : colors.show;
            d.push({
                title: '' + '<b><font color="#098AC1">∷剧情简介	</font></b>' + "<small><a style='text-decoration: none;' href='" + lazy + "'>" + sc + '</a></small><br><font color="' + cs + '">' + `${dc}` + '</small>',
                col_type: 'rich_text',
                extra: {
                    id: 'desc',
                    lineSpacing: 6,
                    textSize: 15,
                    lineVisible: true,
                }
            })
        }

        function banner(title, start, arr, data, cfg) {
            let id = title + 'lunbo';
            var rnum = Math.floor(Math.random() * data.length);
            var item = data[rnum];
            putMyVar('rnum', rnum);
            let time = 5000;
            let col_type = 'pic_1_card';
            let color = "white";
            let desc = '';
            if (cfg != undefined) {
                time = cfg.time ? cfg.time : time;
                col_type = cfg.col_type ? cfg.col_type : col_type;
                desc = cfg.desc ? cfg.desc : desc;
            }

            arr.push({
                col_type: col_type,
                img: item.vod_pic,
                desc: desc,
                title: item.vod_name,
                url: item.url,
                extra: {
                    id: id + 'bar',
                    vod_id: item.vod_link,
                    vod_name: item.vod_name,
                }
            })

            if (start == false || getMyVar('benstart', 'true') == 'false') {
                unRegisterTask(id)
                return
            }

            //log(data)

            let obj = {
                data: data,
            };

            registerTask(id, time, $.toString((obj, id) => {
                var data = obj.data;
                var rum = getMyVar('rnum');

                var i = Number(getMyVar('banneri', '0'));
                if (rum != '') {
                    i = Number(rum) + 1
                    clearMyVar('rnum')
                } else {
                    i = i + 1;
                }
                //log(i)
                //log(data.length)

                if (i > data.length - 1) {
                    i = 0
                }
                var item = data[i];
                //log(item)
                try {
                    updateItem(id + 'bar', {
                        title: item.vod_name,
                        img: item.vod_pic,
                        url: 'hiker://empty?#immersiveTheme#@rule=js:$.require("csdown").videoerji()',
                        extra: {
                            //name: item.title.replace(/<[^>]+>/g, ''),
                            //sname: item.extra.sname,
                            //stype: item.extra.stype,
                            //surl: item.url,
                            //img:item.img,
                            //title: item.title.replace(/<[^>]+>/g, ''),
                            vod_id: item.vod_link || item.vod_id,
                            vod_name: item.vod_name,
                        }
                    })
                } catch (e) {
                    log(e.message)
                    unRegisterTask(id)
                }
                putMyVar('banneri', i);

            }, obj, id))
        }
    }),
    update: () => {
        if (getMyVar('github_url') == '') {
            for (let item of storage0.getItem('githubapi')) {
                let data = JSON.parse(fetch(item, {
                    withStatusCode: true,
                    timeout: 5000,
                }));
                if (data.statusCode == 200) {
                    putMyVar('github_url', item + '/');
                    break;
                }
            }
        }
        const hikerPop = $.require(getMyVar('github_url') + "https://raw.githubusercontent.com/csdown/hiker_yingshi/refs/heads/main/rules/hikerPop.js");
        let pop = hikerPop.updateRecordsBottom([{
            title: "声明",
            records: [
                "““声明””:本小程序完全免费,别被骗了",
                "““声明””:随时可能跑路",
            ]
        }, {
            title: "2025/06/11",
            records: [
                "““修复””:换个站",
            ]
        }]);
    },
    video: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes));
        var pg = getParam('page');
        try {
            if (MY_PAGE == 1) {
                if (!storage0.getMyVar('init_data', '')) {
                    let init_data = post('/api.php/getappapi.index/initV119')
                    storage0.putMyVar('init_data', init_data)
                }
                banner(MY_RULE.title, true, d, storage0.getMyVar('init_data').banner_list, {
                    time: 5000,
                    col_type: 'card_pic_1',
                    desc: '0'
                })
                if (!storage0.getItem('type_id_')) {
                    let type_id_ = []
                    storage0.getMyVar('init_data').type_list.slice(1).forEach(data => {
                        type_id_.push({
                            list: data.type_name,
                            id: data.type_id,
                            name: 'type',
                            filter_type_list: data.filter_type_list,
                        })
                    })
                    storage0.setItem('type_id_', type_id_)
                }
                storage0.getMyVar('init_data').type_list.slice(1).forEach(data => {
                    d.push({
                        title: color(data.type_name),
                        url: $('hiker://empty?page=fypage').rule(() => {
                            var d = [];
                            eval($.require("csdown").rely($.require("csdown").aes));
                            let id = MY_PARAMS.type_id;
                            let pg = getParam('page');
                            let body = {
                                'area': '全部',
                                'year': '全部',
                                'type_id': +id,
                                'page': +pg,
                                'sort': '最新',
                                'lang': '全部',
                                'class': '全部',
                            };
                            let data = post('api.php/getappapi.index/typeFilterVodList', body);
                            data.recommend_list.forEach(data => {
                                d.push({
                                    title: data.vod_name,
                                    desc: data.vod_remarks,
                                    img: data.vod_pic,
                                    url: 'hiker://empty?#immersiveTheme#@rule=js:$.require("csdown").videoerji()',
                                    col_type: 'movie_3',
                                    extra: {
                                        vod_id: data.vod_id,
                                        vod_name: data.vod_name,
                                    }
                                })
                            })
                            setResult(d)
                        }),
                        img: 'hiker://images/icon_right5',
                        col_type: 'text_icon',
                        extra: {
                            type_id: data.type_id,
                        }
                    })
                    data.recommend_list.forEach(data => {
                        d.push({
                            title: data.vod_name,
                            desc: data.vod_remarks,
                            img: data.vod_pic,
                            url: 'hiker://empty?#immersiveTheme#@rule=js:$.require("csdown").videoerji()',
                            col_type: 'movie_3',
                            extra: {
                                vod_id: data.vod_id,
                                vod_name: data.vod_name,
                            }
                        })
                    })
                })
            }
        } catch (e) {
            log(e.message)
        }
    },
    videoerji: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes));
        addListener('onClose', $.toString(() => {
            clearMyVar('vodDetail');
            clearMyVar('info')
        }));
        let id = MY_PARAMS.vod_id;
        setPageTitle(MY_PARAMS.vod_name);
        try {
            if (!storage0.getMyVar('vodDetail', '')) {
                let data = post('api.php/getappapi.index/vodDetail', 'vod_id=' + id);
                storage0.putMyVar('vodDetail', data);
            }
            let vod = storage0.getMyVar('vodDetail').vod;
            d.push({
                title: vod.vod_name + '\n' + ('‘‘’’演员：' + vod.vod_actor + '\n国家：' + vod.vod_area).small(),
                desc: '类型：' + vod.vod_class + '\n' + ('‘‘’’更新状态：' + vod.vod_remarks + '  ' + vod.vod_year),
                img: vod.vod_pic,
                url: $('hiker://empty').rule((pic, name, actor, class_, remarks, area, blurb, year) => {
                    var d = []
                    d.push({
                        img: pic,
                        url: pic + '#.jpg#',
                        col_type: 'pic_1_full'
                    }, {
                        title: '影片名：' + name,
                        col_type: 'rich_text'
                    }, {
                        title: '年代：' + year,
                        col_type: 'rich_text'
                    }, {
                        title: '演员：' + actor,
                        col_type: 'rich_text'
                    }, {
                        title: '类型：' + class_,
                        col_type: 'rich_text',
                    }, {
                        title: '更新状态：' + remarks,
                        col_type: 'rich_text',
                    }, {
                        title: '国家：' + area,
                        col_type: 'rich_text',
                    }, {
                        title: '简介：' + blurb,
                        col_type: 'rich_text',
                    },)
                    setResult(d)
                }, vod.vod_pic, vod.vod_name, vod.vod_actor, vod.vod_class, vod.vod_remarks, vod.vod_area, vod.vod_blurb, vod.vod_year),
                col_type: 'movie_1_vertical_pic_blur',
            })
            setDesc(d, vod.vod_blurb)
            d.push({
                title: (getVar('shsort') == '1') ? '““””<b><span style="color: #FF0000">逆序</span></b>' : '““””<b><span style="color: #1aad19">正序</span></b>',
                url: `#noLoading#@lazyRule=.js:let conf = getVar('shsort');if(conf=='1'){putVar({key:'shsort', value:'0'});}else{putVar({key:'shsort', value:'1'})};refreshPage(false);'toast://切换排序成功'`,
                col_type: 'scroll_button'
            })
            let play_list = storage0.getMyVar('vodDetail').vod_play_list;
            play_list.forEach((data, index_1) => {
                let info = data.player_info;
                d.push({
                    title: (getMyVar('info', '0') == index_1 ? strong(info.show, 'FF6699') : info.show),
                    url: $('#noLoading#').lazyRule((n, title, id) => {
                        putMyVar(n, id);
                        refreshPage(false);
                        return 'hiker://empty';
                    }, 'info', info.show, index_1 + ''),
                    col_type: 'scroll_button',
                    extra: {
                        longClick: [],
                        backgroundColor: getMyVar('info', '0') == index_1 ? "#20FA7298" : "",
                    }
                })
            })
            var urls = play_list[+getMyVar('info', '0')].urls;
            if (getVar('shsort') == '1') {
                var urls = urls.reverse();
            }
            urls.forEach(data => {
                d.push({
                    title: data.name,
                    url: $().lazyRule((url, parse_api_url, token, from) => {
                        eval($.require("csdown").rely($.require("csdown").aes));
                        if (url.includes('.m3u8')) {
                            return url;
                        }
                        let parse_api = parse_api_url.slice(0, 32);
                        let body = {
                            'parse_api': parse_api,
                            'url': Encrypt(url),
                            'token': token,
                        };
                        try {
                            let data = post('/api.php/getappapi.index/vodParse', body).json;
                            let m3u8 = JSON.parse(data).url;
                            if (m3u8 == null) {
                                return 'toast://未获取到链接'
                            }
                            return m3u8
                        } catch (e) {
                            log(e.message)
                            return 'toast://未获取到链接'
                        }
                    }, data.url, data.parse_api_url, data.token, data.from),
                    col_type: 'text_4',
                    extra: {
                        vod_url: data.url,
                    }
                })
            })
            d.push({
                col_type: 'blank_block'
            }, {
                title: '<b><span style="color: #ff847c">推荐</span></b>',
                img: 'http://123.56.105.145/tubiao/messy/9.svg',
                url: $('#noLoading#').lazyRule(() => {
                    refreshPage(false)
                    return 'hiker://empty'
                }),
                col_type: 'text_icon',
                extra: {}
            })
            let same_list = storage0.getMyVar('vodDetail').same_list;
            same_list.forEach(data => {
                d.push({
                    title: data.vod_name,
                    desc: data.vod_remarks,
                    img: data.vod_pic,
                    url: $('hiker://empty?#immersiveTheme#').rule(() => {
                        if (MY_PARAMS.vod_id != getMyVar('vod_id_1')) {
                            clearMyVar('vodDetail');
                            clearMyVar('info')
                            putMyVar('vod_id_1', MY_PARAMS.vod_id)
                        }
                        $.require("csdown").videoerji();
                    }),
                    col_type: 'movie_3',
                    extra: {
                        vod_id: data.vod_id,
                        vod_name: data.vod_name,
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    search: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes));
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
                d.push({
                    title: getMyVar('search', '0') == '0' ? strong('全部', 'FF6699') : '全部',
                    url: $('#noLoading#').lazyRule(() => {
                        putMyVar('search', '0');
                        refreshPage(false);
                        return 'hiker://empty';
                    }),
                    col_type: 'scroll_button',
                    extra: {
                        backgroundColor: getMyVar('search', '0') == '0' ? "#20FA7298" : "",
                    }
                })
                storage0.getItem('type_id_').forEach((data, index) => {
                    d.push({
                        title: getMyVar('search', '0') == data.id ? strong(data.list, 'FF6699') : data.list,
                        url: $('#noLoading#').lazyRule((id) => {
                            putMyVar('search', id);
                            refreshPage(false);
                            return 'hiker://empty';
                        }, data.id),
                        col_type: 'scroll_button',
                        extra: {
                            backgroundColor: getMyVar('search', '0') == data.id ? "#20FA7298" : "",
                        }
                    })
                })
            }
            let body = {
                'keywords': getMyVar('keyword'),
                'type_id': +getMyVar('search', '0'),
                'page': +pg,
            }
            let data = post('api.php/getappapi.index/searchList', body);
            data.search_list.forEach(data => {
                d.push({
                    title: data.vod_name + '\n' + ('‘‘’’演员：' + data.vod_actor + '\n国家：' + data.vod_area).small(),
                    desc: '类型：' + data.vod_class + '\n' + ('‘‘’’更新状态：' + data.vod_remarks),
                    img: data.vod_pic,
                    url: 'hiker://empty?#immersiveTheme#@rule=js:$.require("csdown").videoerji()',
                    col_type: 'movie_1_vertical_pic',
                    extra: {
                        vod_id: data.vod_id,
                        vod_name: data.vod_name,
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    cate: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes));
        var pg = getParam('page');
        try {
            if (MY_PAGE == 1) {
                let cete_index_type = storage0.getItem('type_id_')[0].id;
                putMyVar('cate_index_type', cete_index_type);
                storage0.getItem('type_id_').forEach((data, index_1) => {
                    d.push({
                        title: getMyVar('type_list_type', getMyVar('cate_index_type')) == data.id ? strong(data.list, 'FF6699') : data.list,
                        url: $('#noLoading#').lazyRule((id, index_1) => {
                            putMyVar('type_list_type', id);
                            putMyVar('type_list_index', index_1)
                            refreshPage(false);
                            return 'hiker://empty';
                        }, data.id, index_1 + ''),
                        col_type: 'scroll_button',
                        extra: {
                            backgroundColor: getMyVar('type_list_type', getMyVar('cate_index_type')) == data.id ? "#20FA7298" : "",
                        }
                    })
                })
                d.push({
                    col_type: 'blank_block'
                })
                storage0.getItem('type_id_')[+getMyVar('type_list_index', '0')].filter_type_list.forEach((data, index) => {
                    let name = data.name;
                    putMyVar('cate_index_' + name + getMyVar('type_list_index', '0'), data.list[0])
                    data.list.forEach(data => {
                        d.push({
                            title: getMyVar('type_list_' + name + getMyVar('type_list_index', '0'), getMyVar('cate_index_' + name + getMyVar('type_list_index', '0'))) == data ? strong(data, 'FF6699') : data,
                            url: $('#noLoading#').lazyRule((n, name, id) => {
                                putMyVar(n, id);
                                refreshPage(false);
                                return 'hiker://empty';
                            }, 'type_list_' + name + getMyVar('type_list_index', '0'), name, data),
                            col_type: 'scroll_button',
                            extra: {
                                backgroundColor: getMyVar('type_list_' + name + getMyVar('type_list_index', '0'), getMyVar('cate_index_' + name + getMyVar('type_list_index', '0'))) == data ? "#20FA7298" : "",
                            }
                        })
                    })
                    d.push({
                        col_type: 'blank_block'
                    })
                })
            }
            let body = {
                'area': getMyVar('type_list_area' + getMyVar('type_list_index', '0'), getMyVar('cate_index_area' + getMyVar('type_list_index', '0'))),
                'year': getMyVar('type_list_year' + getMyVar('type_list_index', '0'), getMyVar('cate_index_year' + getMyVar('type_list_index', '0'))),
                'type_id': +getMyVar('type_list_type', getMyVar('cate_index_type')),
                'page': +pg,
                'sort': getMyVar('type_list_sort' + getMyVar('type_list_index', '0'), getMyVar('cate_index_sort' + getMyVar('type_list_index', '0'))),
                'lang': getMyVar('type_list_lang' + getMyVar('type_list_index', '0'), getMyVar('cate_index_lang' + getMyVar('type_list_index', '0'))),
                'class': getMyVar('type_list_class' + getMyVar('type_list_index', '0'), getMyVar('cate_index_class' + getMyVar('type_list_index', '0'))),
            };
            let data = post('/api.php/getappapi.index/typeFilterVodList', body);
            data.recommend_list.forEach(data => {
                d.push({
                    title: data.vod_name,
                    desc: data.vod_remarks,
                    img: data.vod_pic,
                    url: 'hiker://empty?#immersiveTheme#@rule=js:$.require("csdown").videoerji()',
                    col_type: 'movie_3',
                    extra: {
                        vod_id: data.vod_id,
                        vod_name: data.vod_name,
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
    },
    rank: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes));
        var pg = getParam('page');
        try {
            if (MY_PAGE == 1) {
                let rank = [{
                    title: '日榜&周榜&月榜',
                    id: '1&2&3'
                }]
                Cate(rank, 'rank', d, 'text_3')
            }
            if (!storage0.getMyVar('rank_' + getMyVar('rank', '1') + pg)) {
                let body = {
                    'type_id': +getMyVar('rank', '1'),
                    'page': +pg,
                }
                let data = post('/api.php/getappapi.index/rankListV134', body);
                storage0.putMyVar('rank_' + getMyVar('rank', '1') + pg, data)
            }
            storage0.getMyVar('rank_' + getMyVar('rank', '1') + pg).rank_list.forEach(data => {
                d.push({
                    title: data.vod_name + '\n' + ('‘‘’’演员：' + data.vod_actor + '\n国家：' + data.vod_area).small(),
                    desc: '类型：' + data.vod_class + '\n' + ('‘‘’’更新状态：' + data.vod_remarks),
                    img: data.vod_pic,
                    url: 'hiker://empty?#immersiveTheme#@rule=js:$.require("csdown").videoerji()',
                    col_type: 'movie_1_vertical_pic',
                    extra: {
                        vod_id: data.vod_id,
                        vod_name: data.vod_name,
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
    },
    week: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes));
        var pg = getParam('page');
        try {
            if (MY_PAGE == 1) {
                let week = [{
                    title: '周一&周二&周三&周四&周五&周六&周日',
                    id: '1&2&3&4&5&6&7'
                }]
                Cate(week, 'week', d)
            }
            if (!storage0.getMyVar('week_' + getMyVar('week', '1') + pg)) {
                let body = {
                    'week': +getMyVar('week', '1'),
                    'page': +pg,
                }
                let data = post('/api.php/getappapi.index/vodWeekList', body);
                storage0.putMyVar('week_' + getMyVar('week', '1') + pg, data)
            }
            storage0.getMyVar('week_' + getMyVar('week', '1') + pg).week_list.forEach(data => {
                d.push({
                    title: data.vod_name,
                    desc: data.vod_remarks,
                    img: data.vod_pic,
                    url: 'hiker://empty?#immersiveTheme#@rule=js:$.require("csdown").videoerji()',
                    col_type: 'movie_3',
                    extra: {
                        vod_id: data.vod_id,
                        vod_name: data.vod_name,
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
    },
}
$.exports = csdown

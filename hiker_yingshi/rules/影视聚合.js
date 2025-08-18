const csdown = {
    d: [],
    d_: [],
    author: '流苏',
    version: '20250815',
    home: function() {
        var d = this.d;
        if (+MY_RULE.version < 20250815) {
            confirm({
                title: "本体更新",
                content: '去除内置github加速，点击导入',
                confirm() {
                    return parsePaste('云6oooole/xxxxxx/fcspmpeamyysofu1@IsBrjW')
                },
                cancel() {}
            });
        }
        if (!getItem('up' + this.version, '')) {
            this.update()
            setItem('up' + this.version, '1')
        }
        if (MY_RULE.author == this.author || MY_NAME == '嗅觉浏览器') {
            d.push({
                title: "搜索 ",
                url: $.toString(() => {
                    putMyVar('keyword', input)
                    return 'hiker://empty?page=fypage@rule=js:$.require("csdown").search_()';
                }),
                desc: "请输入搜索关键词",
                col_type: "input",
                extra: {
                    onChange: $.toString(() => {
                        putMyVar('keyword', input)
                    }),
                    defaultValue: getMyVar('keyword', ''),
                    pageTitle: "搜索",
                }
            })
            let longclick = [{
                title: '更新日志',
                js: $.toString(() => {
                    $.require("csdown").update()
                })
            }]
            this.data.forEach(data => {
                d.push({
                    title: data.title,
                    img: data.img,
                    url: $('hiker://empty?page=fypage&#noHistory#').rule(() => {
                        $.require("csdown").home_();
                    }),
                    col_type: 'icon_4_card',
                    extra: {
                        de_key: data.de_key,
                        host: data.host,
                        title: data.title,
                        init: data.init,
                        rank: data.rank,
                        longClick: longclick,
                    }
                })
            })
            /*
            //失效模块
            this.disable.forEach(data => {
                d.push({
                    title: data.title,
                    img: data.img,
                    url: $('hiker://empty?page=fypage&#noHistory#').rule(() => {
                        $.require("csdown").home_();
                    }),
                    col_type: 'icon_4_card',
                    extra: {
                        de_key: data.de_key,
                        host: data.host,
                        title: data.title,
                        init: data.init,
                        rank: data.rank,
                        longClick: longclick,
                    }
                })
            })
            */
        } else {
            d.push({
                title: '请勿修改作者名',
                url: 'hiker://empty',
                col_type: 'text_center_1'
            })
        }
        setResult(d)
    },
    home_: function() {
        var d = this.d;
        var d_ = this.d_;
        var pg = getParam('page');
        putMyVar('de_key', MY_PARAMS.de_key);
        putMyVar('title', MY_PARAMS.title);
        putMyVar('init', MY_PARAMS.init == null ? '' : MY_PARAMS.init);
        putMyVar('rank_', MY_PARAMS.rank == null ? '' : MY_PARAMS.rank);
        if (MY_PARAMS.host != getMyVar('host_1')) {
            if (/txt|json/.test(MY_PARAMS.host)) {
                putMyVar('host', fetch(MY_PARAMS.host) + '/');
            } else {
                putMyVar('host', MY_PARAMS.host);
            }
            putMyVar('host_1', MY_PARAMS.host)
        }
        addListener('onClose', $.toString(() => {
            //clearMyVar('keyword');
            clearMyVar('de_key');
            clearMyVar('init');
        }));
        if (MY_PAGE == 1) {
            d_.push({
                title: "搜索 ",
                url: $.toString((host, de_key, init) => {
                    putMyVar('keyword', input);
                    putMyVar('de_key', de_key);
                    putMyVar('init', init == null ? '' : init);
                    if (host != getMyVar('host_1')) {
                        if (/txt|json/.test(host)) {
                            putMyVar('host', fetch(host) + '/');
                        } else {
                            putMyVar('host', host);
                        }
                        putMyVar('host_1', host)
                    }
                    return 'hiker://empty?page=fypage@rule=js:$.require("csdown").search()';
                }, MY_PARAMS.host, MY_PARAMS.de_key, MY_PARAMS.init, ),
                desc: "请输入搜索关键词",
                col_type: "input",
                extra: {
                    onChange: $.toString(() => {
                        putMyVar('keyword', input)
                    }),
                    defaultValue: getMyVar('keyword', ''),
                    init: MY_PARAMS.init,
                    de_key: MY_PARAMS.de_key,
                    host: MY_PARAMS.host,
                }
            })
            let 首页 = [{
                title: '首页&分类&排行榜&排期表',
                id: '1&2&3&4&5',
                img: 'https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/47.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/175.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/78.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/48.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/109.png'
            }];
            /*
            let longclick = [{
                title: '更新日志',
                js: $.toString(()=>{
                    $.require("csdown").update()
                })
            }]
            */
            this.Cate(首页, '首页' + getMyVar('title'), d_, 'icon_4');
            d_.push({
                col_type: 'line',
            }, {
                col_type: 'big_blank_block',
            }, {
                col_type: 'big_blank_block',
            });
            setPreResult(d_)
        }
        let 分类 = getMyVar('首页' + getMyVar('title'), '1');
        if (分类 == 1) {
            this.video()
        } else if (分类 == 2) {
            this.cate()
        } else if (分类 == 3) {
            if (!getMyVar('rank_', '')) {
                this.rank();
            } else {
                this.rank2();
            }
        } else if (分类 == 4) {
            this.week()
        }
        deleteItem("loading_");
        setResult(d)
    },
    color: function(txt) {
        return '<b><font color=' + '#FF6699' + '>' + txt + '</font></b>'
    },
    strong: function(d, c) {
        return '‘‘’’<strong><font color=#' + (c || '000000') + '>' + d + '</font></strong>';
    },
    Cate: function(list, n, d, col, longclick) {
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
                    title: (getMyVar(n, index_n) == id[index] ? this.strong(title, 'FF6699') : title),
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
    },
    Decrypt: function(word) {
        eval(getCryptoJS())
        const key = CryptoJS.enc.Utf8.parse(getMyVar('de_key'));
        const iv = CryptoJS.enc.Utf8.parse(getMyVar('de_key'));
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
    },
    // 加密函数
    Encrypt: function(plaintext) {
        eval(getCryptoJS())
        const id = CryptoJS.enc.Utf8.parse(getMyVar('de_key'));
        const iv = CryptoJS.enc.Utf8.parse(getMyVar('de_key'));
        var encrypted = CryptoJS.AES.encrypt(plaintext, id, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        var ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
        return ciphertext;
    },
    post: function(url, body) {
        if (!body) {
            var body = '';
        }
        //let t = Math.floor(Date.now() / 1000).toString();
        let html = fetch(getMyVar('host') + url, {
            headers: {},
            body: body,
            method: 'POST'
        });
        let html1 = this.Decrypt(JSON.parse(html).data);
        return JSON.parse(html1);
    },
    setDesc: function(d, desc, num) {
        //log(desc)
        if (desc == undefined) {
            return;
        }
        desc = desc.constructor == Array ? desc.join('<br>') : desc;
        if (desc.replace(/(<br>|\s+|<\/?p>|&nbsp;)/g, '').length == 0) {
            return;
        }
        const mark = 'desc';
        num = typeof(num) == 'undefined' ? 45 : num
        desc = desc.startsWith('　　') ? desc : '　　' + desc;
        desc = desc.replace(/'/g, "&#39;");
        desc = desc.replace(/\r\n/g, "<br>");
        desc = desc.replace(/\r/g, "<br>");
        desc = desc.replace(/\n/g, "<br>").replace(/[<p>|</p>]/g, "");

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
    },
    banner: function(title, start, arr, data, cfg) {
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
            url: 'hiker://empty?#immersiveTheme#@rule=js:$.require("csdown").videoerji()',
            extra: {
                id: id + 'bar',
                vod_id: item.vod_link || item.vod_id,
                vod_name: item.vod_name,
                de_key: MY_PARAMS.de_key,
                host: MY_PARAMS.host,
                init: MY_PARAMS.init,
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

        registerTask(id, time, $.toString((obj, id, MY_PARAMS) => {
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
                        de_key: MY_PARAMS.de_key,
                        host: MY_PARAMS.host,
                        init: MY_PARAMS.init,

                    }
                })
            } catch (e) {
                log(e.message)
                unRegisterTask(id)
            }
            putMyVar('banneri', i);

        }, obj, id, MY_PARAMS))
    },
    update: function() {
        const hikerPop = $.require("https://raw.githubusercontent.com/csdown/hiker_yingshi/refs/heads/main/rules/hikerPop.js");
        let pop = hikerPop.updateRecordsBottom([{
            title: "声明",
            records: [
                "““声明””：本小程序完全免费,别被骗了",
                "““声明””：随时可能跑路",
                "““声明””：不要相信里面的广告，不要去加里面的群",
                "““声明””：严禁随意传播",
            ]
        }, {
            title: "2025/08/02",
            records: [
                "““停更””：最后一次更新，后面不再维护",
                "““修复””：修复部分模块",
            ]
        }, {
            title: "2025/08/01",
            records: [
                "““优化””：优化部分页面显示效果",
                "““优化””：优化代码",
            ]
        }, {
            title: "2025/07/31",
            records: [
                "““更新””：排期表默认打开时间改为今日",
            ]
        }, {
            title: "2025/07/26",
            records: [
                "‘‘修复’’：修复聚合搜索，应该没问题了",
            ]
        }, {
            title: "2025/07/20",
            records: [
                "““更新””：改写部分代码，增加一个模块",
            ]
        }, {
            title: "2025/07/19",
            records: [
                "““更新””：修复仓鼠4K，增加顾我追剧",
                "‘‘修复’’：修复搜索BUG",
            ]
        }, {
            title: "2025/07/18",
            records: [
                "““更新””：修复coffee4K，增加剧圈APP、DuoFun APP",
                "‘‘修复’’：修复一个BUG",
            ]
        }, {
            title: "2025/07/15",
            records: [
                "““更新””：增加鲸鱼影视",
                "‘‘修复’’：修复海豚视频",
                "““更新””：修复和删除部分APP，确保可用性",
            ]
        }, {
            title: "2025/07/11",
            records: [
                "““更新””：增加若雪4k",
                "““更新””：增加轮播，如有广告，请勿相信",
            ]
        }, {
            title: "2025/06/26",
            records: [
                "““更新””：增加聚合搜索(可能有BUG)",
            ]
        }, {
            title: "2025/06/23",
            records: [
                "““更新””：更换二级页面线路切换方式，改为刷新元素，而非刷新页面(其实没什么区别)",
                "““更新””：更换分类折叠方式，改为刷新元素，而非刷新页面",
                "‘‘修复’’：修复榴莲4K",
            ]
        }, {
            title: "2025/06/20",
            records: [
                "‘‘修复’’：修复蓝鹰影视",
            ]
        }, {
            title: "2025/06/18",
            records: [
                "““更新””：增加桃子影视",
            ]
        }, {
            title: "2025/06/15",
            records: [
                "““更新””：增加一些APP",
            ]
        }, {
            title: "2025/06/14",
            records: [
                "““更新””：增加一些APP",
            ]
        }, ]);
    },
    video: function() {
        var d = this.d;
        var d_ = this.d_;
        var pg = getParam('page');
        d_.push({
            col_type: 'blank_block',
            extra: {
                id: 'blank_1',
            }
        }, {
            img: "http://123.56.105.145/weisyr/img/Loading1.gif",
            url: "hiker://empty",
            col_type: "pic_1_full",
            extra: {
                id: "loading_"
            }
        });
        setPreResult(d_)
        try {
            if (MY_PAGE == 1) {
                if (!storage0.getMyVar('init_data' + getMyVar('title'), '')) {
                    let init_data;
                    if (!getMyVar('init', '')) {
                        init_data = this.post('api.php/getappapi.index/initV119');
                    } else {
                        init_data = this.post('api.php/qijiappapi.index/initV120')
                    }
                    storage0.putMyVar('init_data' + getMyVar('title'), init_data)
                }
                let banner_list = storage0.getMyVar('init_data' + getMyVar('title')).banner_list;
                if (banner_list.toString() != [] && !/广告|防走丢/.test(JSON.stringify(banner_list)) && !/旗星/.test(getMyVar('title'))) {
                    this.banner(MY_RULE.title, true, d, banner_list, {
                        time: 5000,
                        col_type: 'card_pic_1',
                        desc: '0'
                    })
                }
                let init_data_list = storage0.getMyVar('init_data' + getMyVar('title')).type_list;
                if (!storage0.getMyVar('type_id_' + getMyVar('title'))) {
                    let type_id_ = []
                    init_data_list.slice(1).forEach(data => {
                        type_id_.push({
                            list: data.type_name,
                            id: data.type_id,
                            name: 'type',
                            filter_type_list: data.filter_type_list,
                        })
                    })
                    storage0.putMyVar('type_id_' + getMyVar('title'), type_id_)
                }
                init_data_list.slice(1).forEach(data => {
                    if (data.recommend_list.toString() != []) {
                        d.push({
                            title: this.color(data.type_name),
                            url: $('hiker://empty?page=fypage').rule(() => {
                                $.require("csdown").recommend();
                            }),
                            img: 'hiker://images/icon_right5',
                            col_type: 'text_icon',
                            extra: {
                                type_id: data.type_id,
                                de_key: MY_PARAMS.de_key,
                                host: MY_PARAMS.host,
                                init: MY_PARAMS.init,
                            }
                        })
                        data.recommend_list.forEach(data => {
                            d.push({
                                title: data.vod_name,
                                desc: data.vod_remarks,
                                img: data.vod_pic,
                                url: $('hiker://empty?#immersiveTheme#').rule(() => {
                                    $.require("csdown").videoerji()
                                }),
                                col_type: 'movie_3',
                                extra: {
                                    vod_id: data.vod_id,
                                    vod_name: data.vod_name,
                                    de_key: MY_PARAMS.de_key,
                                    host: MY_PARAMS.host,
                                    init: MY_PARAMS.init,
                                }
                            })
                        })
                    }
                })
            }
        } catch (e) {
            log(e.message)
            d.push({
                title: e.message,
                url: 'hiker://empty',
                col_type: 'text_center_1',
            })
        }
    },
    recommend: function() {
        var d = [];
        var d_ = this.d_;
        let id = MY_PARAMS.type_id;
        let pg = getParam('page');
        d_.push({
            img: "http://123.56.105.145/weisyr/img/Loading1.gif",
            url: "hiker://empty",
            col_type: "pic_1_full",
            extra: {
                id: "loading_"
            }
        });
        setPreResult(d_)
        let body = {
            'area': '全部',
            'year': '全部',
            'type_id': +id,
            'page': +pg,
            'sort': '最新',
            'lang': '全部',
            'class': '全部',
        };
        let data;
        if (!getMyVar('init')) {
            data = this.post('api.php/getappapi.index/typeFilterVodList', body);
        } else {
            data = this.post('api.php/qijiappapi.index/typeFilterVodList', body);
        }
        data.recommend_list.forEach(data => {
            d.push({
                title: data.vod_name,
                desc: data.vod_remarks,
                img: data.vod_pic,
                url: $('hiker://empty?#immersiveTheme#').rule(() => {
                    $.require("csdown").videoerji()
                }),
                col_type: 'movie_3',
                extra: {
                    vod_id: data.vod_id,
                    vod_name: data.vod_name,
                    de_key: MY_PARAMS.de_key,
                    host: MY_PARAMS.host,
                    init: MY_PARAMS.init,
                }
            })
        })
        deleteItem("loading_");
        setResult(d)
    },
    videoerji: function() {
        var d = this.d;
        if (MY_PARAMS.host != getMyVar('host_1')) {
            if (/txt|json/.test(MY_PARAMS.host)) {
                putMyVar('host', fetch(MY_PARAMS.host) + '/');
            } else {
                putMyVar('host', MY_PARAMS.host);
            }
            putMyVar('host_1', MY_PARAMS.host)
        }
        putMyVar('de_key', MY_PARAMS.de_key);
        putMyVar('init', MY_PARAMS.init == null ? '' : MY_PARAMS.init);
        addListener('onClose', $.toString(() => {
            clearMyVar('vodDetail');
            clearMyVar('info')
        }));
        let id = MY_PARAMS.vod_id;
        setPageTitle(MY_PARAMS.vod_name);
        try {
            if (!storage0.getMyVar('vodDetail', '')) {
                let data;
                if (!getMyVar('init')) {
                    data = this.post('api.php/getappapi.index/vodDetail', 'vod_id=' + id);
                } else {
                    data = this.post('api.php/qijiappapi.index/vodDetail2', 'vod_id=' + id);
                }
                storage0.putMyVar('vodDetail', data);
            }
            let vodDetail = storage0.getMyVar('vodDetail');
            let vod = vodDetail.vod;
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
                    }, )
                    setResult(d)
                }, vod.vod_pic, vod.vod_name, vod.vod_actor, vod.vod_class, vod.vod_remarks, vod.vod_area, vod.vod_blurb, vod.vod_year),
                col_type: 'movie_1_vertical_pic_blur',
            })
            this.setDesc(d, vod.vod_blurb)
            d.push({
                title: (getMyVar('shsort', '0') == '1') ? '““””<b><span style="color: #FF0000">逆序</span></b>' : '““””<b><span style="color: #1aad19">正序</span></b>',
                url: $('#noLoading#').lazyRule(() => {
                    return $.require("csdown").shsort();
                }),
                col_type: 'scroll_button',
                extra: {
                    id: '排序',
                }
            })
            let play_list = vodDetail.vod_play_list;
            play_list.forEach((data, index_1) => {
                let info = data.player_info;
                d.push({
                    title: (getMyVar('info', '0') == index_1 ? this.strong(info.show, 'FF6699') : info.show),
                    url: $('#noLoading#').lazyRule((n, title, id) => {
                        return $.require("csdown").line(n, title, id);
                    }, 'info', info.show, index_1 + ''),
                    col_type: 'scroll_button',
                    extra: {
                        longClick: [],
                        backgroundColor: getMyVar('info', '0') == index_1 ? "#20FA7298" : "",
                        id: '线路_' + index_1,
                    }
                })
            })
            try {
                let urls = play_list[+getMyVar('info', '0')].urls;
                if (getMyVar('shsort', '0') == '1') {
                    urls.reverse()
                }
                urls.forEach(data => {
                    d.push({
                        title: data.name,
                        url: $().lazyRule((url, parse_api_url, token, from) => {
                            return $.require("csdown").jiexi(url, parse_api_url, token, from)
                        }, data.url, data.parse_api_url, data.token, data.from),
                        col_type: data.name.length > 5 ? 'text_2' : 'text_4',
                        extra: {
                            vod_url: data.url,
                            cls: '选集_',
                        }
                    })
                })
            } catch (e) {
                log(e.message)
            }
            d.push({
                col_type: 'blank_block',
                extra: {
                    id: 'blank',
                }
            }, {
                title: '<b><span style="color: #ff847c">推荐</span></b>',
                img: 'http://123.56.105.145/tubiao/messy/9.svg',
                url: $('#noLoading#').lazyRule(() => {
                    refreshPage(false)
                    return 'hiker://empty'
                }),
                col_type: 'text_icon',
                extra: {

                }
            })
            let same_list = vodDetail.same_list;
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
                        de_key: MY_PARAMS.de_key,
                        host: MY_PARAMS.host,
                        init: MY_PARAMS.init,
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    search: function() {
        var d = this.d;
        var d_ = this.d_;
        var pg = getParam('page');
        try {
            if (MY_PAGE == 1) {
                d_.push({
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
                d_.push({
                    title: getMyVar('search' + getMyVar('title'), '0') == '0' ? this.strong('全部', 'FF6699') : '全部',
                    url: $('#noLoading#').lazyRule(() => {
                        putMyVar('search' + getMyVar('title'), '0');
                        refreshPage(false);
                        return 'hiker://empty';
                    }),
                    col_type: 'scroll_button',
                    extra: {
                        backgroundColor: getMyVar('search' + getMyVar('title'), '0') == '0' ? "#20FA7298" : "",
                    }
                })
                storage0.getMyVar('type_id_' + getMyVar('title')).forEach((data, index) => {
                    if (!/QQ|群/.test(data.list)) {
                        d_.push({
                            title: getMyVar('search' + getMyVar('title'), '0') == data.id ? this.strong(data.list, 'FF6699') : data.list,
                            url: $('#noLoading#').lazyRule((id) => {
                                putMyVar('search' + getMyVar('title'), id);
                                refreshPage(false);
                                return 'hiker://empty';
                            }, data.id),
                            col_type: 'scroll_button',
                            extra: {
                                backgroundColor: getMyVar('search' + getMyVar('title'), '0') == data.id ? "#20FA7298" : "",
                            }
                        })
                    }
                })
                d_.push({
                    img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                    url: "hiker://empty",
                    col_type: "pic_1_full",
                    extra: {
                        id: "loading_"
                    }
                });
                setPreResult(d_)
            }
            let body = {
                'keywords': getMyVar('keyword'),
                'type_id': +getMyVar('search' + getMyVar('title'), '0'),
                'page': +pg,
            }
            let data;
            if (!getMyVar('init')) {
                data = this.post('api.php/getappapi.index/searchList', body);
            } else {
                data = this.post('api.php/qijiappapi.index/searchList', body);
            }
            data.search_list.forEach(data => {
                d.push({
                    title: data.vod_name + '\n' + ('‘‘’’演员：' + data.vod_actor + '\n国家：' + data.vod_area).small(),
                    desc: '类型：' + data.vod_class + '\n' + ('‘‘’’更新状态：' + data.vod_remarks),
                    img: data.vod_pic,
                    url: $('hiker://empty?#immersiveTheme#').rule(() => {
                        $.require("csdown").videoerji()
                    }),
                    col_type: 'movie_1_vertical_pic',
                    extra: {
                        vod_id: data.vod_id,
                        vod_name: data.vod_name,
                        de_key: MY_PARAMS.de_key,
                        host: MY_PARAMS.host,
                        init: MY_PARAMS.init,
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
        deleteItem("loading_");
        setResult(d)
    },
    search_: function() {
        var d = this.d;
        var d_ = this.d_;
        var pg = getParam('page');
        try {
            if (MY_PAGE == 1) {
                d_.push({
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
                if (!getMyVar('search_dekey_index', '')) {
                    putMyVar('search_dekey_index', $.require('csdown').data[0].de_key);
                    putMyVar('search_host_index', /txt|json/.test($.require('csdown').data[0].host) ? fetch($.require('csdown').data[0].host) + '/' : $.require('csdown').data[0].host);
                    putMyVar('search_title_index', $.require('csdown').data[0].title);
                    putMyVar('search_init_index', $.require('csdown').data[0].init != null ? $.require('csdown').data[0].init : '');
                }
                if (!getMyVar('search_first', '')) {
                    putMyVar('de_key', getMyVar('search_dekey_index'));
                    putMyVar('host', getMyVar('search_host_index'));
                    putMyVar('search_title', getMyVar('search_title_index'));
                    putMyVar('search_init', getMyVar('search_init_index'));
                    putMyVar('search_first', '1')
                }
                $.require("csdown").data.forEach(data => {
                    d_.push({
                        title: getMyVar('de_key', getMyVar('search_dekey_index')) == data.de_key ? this.strong(data.title, 'FF6699') : data.title,
                        img: data.img,
                        url: $('#noLoading#').lazyRule((title, de_key, host, init) => {
                            putMyVar('de_key', de_key);
                            if (host != getMyVar('host_1')) {
                                if (/txt|json/.test(host)) {
                                    putMyVar('host', fetch(host) + '/');
                                } else {
                                    putMyVar('host', host);
                                }
                                putMyVar('host_1', host)
                            }
                            //putMyVar('host', /txt|json/.test(host) ? fetch(host) + '/' : host);
                            putMyVar('search_title', title);
                            putMyVar('search_init', init != null ? init : '')
                            refreshPage(false);
                            return 'hiker://empty';
                        }, data.title, data.de_key, data.host, data.init),
                        col_type: 'scroll_button',
                        extra: {
                            de_key: data.de_key,
                            host: data.host,
                            title: data.title,
                            init: data.init,
                            rank: data.rank,
                            backgroundColor: getMyVar('de_key', getMyVar('search_dekey_index')) == data.de_key ? "#20FA7298" : "",
                        }
                    })
                })
                d_.push({
                    col_type: 'blank_block'
                })
                if (!storage0.getMyVar('init_data' + getMyVar('search_title', getMyVar('search_title_index')), '')) {
                    let init_data;
                    if (!getMyVar('search_init', getMyVar('search_init_index'))) {
                        init_data = this.post('api.php/getappapi.index/initV119');
                    } else {
                        init_data = this.post('api.php/qijiappapi.index/initV120')
                    }
                    storage0.putMyVar('init_data' + getMyVar('search_title', getMyVar('search_title_index')), init_data)
                }
                if (!storage0.getMyVar('type_id_' + getMyVar('search_title', getMyVar('search_title_index')))) {
                    let type_id_ = []
                    storage0.getMyVar('init_data' + getMyVar('search_title', getMyVar('search_title_index'))).type_list.slice(1).forEach(data => {
                        type_id_.push({
                            list: data.type_name,
                            id: data.type_id,
                            name: 'type',
                            filter_type_list: data.filter_type_list,
                        })
                    })
                    storage0.putMyVar('type_id_' + getMyVar('search_title', getMyVar('search_title_index')), type_id_)
                }
                d_.push({
                    title: getMyVar('search_' + getMyVar('search_title', getMyVar('search_title_index')), '0') == '0' ? this.strong('全部', 'FF6699') : '全部',
                    url: $('#noLoading#').lazyRule(() => {
                        putMyVar('search_' + getMyVar('search_title', getMyVar('search_title_index')), '0');
                        refreshPage(false);
                        return 'hiker://empty';
                    }),
                    col_type: 'scroll_button',
                    extra: {
                        backgroundColor: getMyVar('search_' + getMyVar('search_title', getMyVar('search_title_index')), '0') == '0' ? "#20FA7298" : "",
                    }
                })
                storage0.getMyVar('type_id_' + getMyVar('search_title', getMyVar('search_title_index'))).forEach((data, index) => {
                    if (!/QQ|群/.test(data.list)) {
                        d_.push({
                            title: getMyVar('search_' + getMyVar('search_title', getMyVar('search_title_index')), '0') == data.id ? this.strong(data.list, 'FF6699') : data.list,
                            url: $('#noLoading#').lazyRule((id) => {
                                putMyVar('search_' + getMyVar('search_title', getMyVar('search_title_index')), id);
                                refreshPage(false);
                                return 'hiker://empty';
                            }, data.id),
                            col_type: 'scroll_button',
                            extra: {
                                backgroundColor: getMyVar('search_' + getMyVar('search_title', getMyVar('search_title_index')), '0') == data.id ? "#20FA7298" : "",
                            }
                        })
                    }
                })
                d_.push({
                    img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                    url: "hiker://empty",
                    col_type: "pic_1_full",
                    extra: {
                        id: "loading_"
                    }
                });
                setPreResult(d_)
            }
            let body = {
                'keywords': getMyVar('keyword'),
                'type_id': +getMyVar('search_' + getMyVar('search_title', getMyVar('search_title_index')), '0'),
                'page': +pg,
            }
            let data;
            if (!getMyVar('search_init', getMyVar('search_init_index'))) {
                data = this.post('api.php/getappapi.index/searchList', body);
            } else {
                data = this.post('api.php/qijiappapi.index/searchList', body);
            }
            data.search_list.forEach(data => {
                d.push({
                    title: data.vod_name + '\n' + ('‘‘’’演员：' + data.vod_actor + '\n国家：' + data.vod_area).small(),
                    desc: '类型：' + data.vod_class + '\n' + ('‘‘’’更新状态：' + data.vod_remarks),
                    img: data.vod_pic,
                    url: $('hiker://empty?#immersiveTheme#').rule(() => {
                        $.require('csdown').videoerji()
                    }),
                    col_type: 'movie_1_vertical_pic',
                    extra: {
                        vod_id: data.vod_id,
                        vod_name: data.vod_name,
                        de_key: getMyVar('de_key'),
                        host: getMyVar('host'),
                        init: getMyVar('search_init'),
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
        deleteItem("loading_");
        setResult(d)
    },
    cate: function() {
        var d = this.d;
        var d_ = this.d_;
        var pg = getParam('page');
        try {
            if (MY_PAGE == 1) {
                d_.push({
                    title: getMyVar('flod_', '0') == '1' ? '““””<b>' + '∨'.fontcolor("#FF0000") + '</b>' : '““””<b>' + '∧'.fontcolor("#1aad19") + '</b>',
                    url: $('#noLoading#').lazyRule(() => {
                        return $.require("csdown").flod();
                    }),
                    col_type: 'scroll_button',
                    extra: {
                        id: 'flod_1'
                    }
                })
                let cete_index_type = storage0.getMyVar('type_id_' + getMyVar('title'))[0].id;
                putMyVar('cate_index_type' + getMyVar('title'), cete_index_type);
                storage0.getMyVar('type_id_' + getMyVar('title')).forEach((data, index_1) => {
                    if (!/QQ|群/.test(data.list)) {
                        d_.push({
                            title: getMyVar('type_list_type' + getMyVar('title'), getMyVar('cate_index_type' + getMyVar('title'))) == data.id ? this.strong(data.list, 'FF6699') : data.list,
                            url: $('#noLoading#').lazyRule((id, index_1) => {
                                putMyVar('type_list_type' + getMyVar('title'), id);
                                putMyVar('type_list_index' + getMyVar('title'), index_1)
                                refreshPage(false);
                                return 'hiker://empty';
                            }, data.id, index_1 + ''),
                            col_type: 'scroll_button',
                            extra: {
                                backgroundColor: getMyVar('type_list_type' + getMyVar('title'), getMyVar('cate_index_type' + getMyVar('title'))) == data.id ? "#20FA7298" : "",
                            }
                        })
                    }
                })
                d_.push({
                    col_type: 'blank_block',
                    extra: {
                        id: 'cate_1'
                    }
                })
                if (getMyVar('flod_', '0') == '1') {
                    storage0.getMyVar('type_id_' + getMyVar('title'))[+getMyVar('type_list_index' + getMyVar('title'), '0')].filter_type_list.forEach((data, index) => {
                        let name = data.name;
                        putMyVar('cate_index_' + name + getMyVar('type_list_index' + getMyVar('title'), '0') + getMyVar('title'), data.list[0])
                        data.list.forEach(data => {
                            if (getMyVar('flod_', '0') == '1') {
                                d_.push({
                                    title: getMyVar('type_list_' + name + getMyVar('type_list_index' + getMyVar('title'), '0') + getMyVar('title'), getMyVar('cate_index_' + name + getMyVar('type_list_index' + getMyVar('title'), '0') + getMyVar('title'))) == data ? this.strong(data, 'FF6699') : data,
                                    url: $('#noLoading#').lazyRule((n, name, id) => {
                                        putMyVar(n, id);
                                        refreshPage(false);
                                        return 'hiker://empty';
                                    }, 'type_list_' + name + getMyVar('type_list_index' + getMyVar('title'), '0') + getMyVar('title'), name, data),
                                    col_type: 'scroll_button',
                                    extra: {
                                        backgroundColor: getMyVar('type_list_' + name + getMyVar('type_list_index' + getMyVar('title'), '0') + getMyVar('title'), getMyVar('cate_index_' + name + getMyVar('type_list_index' + getMyVar('title'), '0') + getMyVar('title'))) == data ? "#20FA7298" : "",
                                        cls: '分类_',
                                    }
                                })
                            }
                        })
                        d_.push({
                            col_type: 'blank_block',
                            extra: {
                                cls: '分类_'
                            }
                        })
                    })
                }
                d_.push({
                    col_type: 'blank_block',
                    extra: {
                        id: 'blank_2',
                    }
                }, {
                    img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                    url: "hiker://empty",
                    col_type: "pic_1_full",
                    extra: {
                        id: "loading_"
                    }
                });
                setPreResult(d_)
            }
            let body = {
                'area': getMyVar('type_list_area' + getMyVar('type_list_index' + getMyVar('title'), '0') + getMyVar('title'), getMyVar('cate_index_area' + getMyVar('type_list_index' + getMyVar('title'), '0') + getMyVar('title'))),
                'year': getMyVar('type_list_year' + getMyVar('type_list_index' + getMyVar('title'), '0') + getMyVar('title'), getMyVar('cate_index_year' + getMyVar('type_list_index' + getMyVar('title'), '0') + getMyVar('title'))),
                'type_id': +getMyVar('type_list_type' + getMyVar('title'), getMyVar('cate_index_type' + getMyVar('title'))),
                'page': +pg,
                'sort': getMyVar('type_list_sort' + getMyVar('type_list_index' + getMyVar('title'), '0') + getMyVar('title'), getMyVar('cate_index_sort' + getMyVar('type_list_index' + getMyVar('title'), '0') + getMyVar('title'))),
                'lang': getMyVar('type_list_lang' + getMyVar('type_list_index' + getMyVar('title'), '0') + getMyVar('title'), getMyVar('cate_index_lang' + getMyVar('type_list_index' + getMyVar('title'), '0') + getMyVar('title'))),
                'class': getMyVar('type_list_class' + getMyVar('type_list_index' + getMyVar('title'), '0') + getMyVar('title'), getMyVar('cate_index_class' + getMyVar('type_list_index' + getMyVar('title'), '0') + getMyVar('title'))),
            };
            let data;
            if (!getMyVar('init')) {
                data = this.post('api.php/getappapi.index/typeFilterVodList', body);
            } else {
                data = this.post('api.php/qijiappapi.index/typeFilterVodList', body);
            }
            data.recommend_list.forEach(data => {
                d.push({
                    title: data.vod_name,
                    desc: data.vod_remarks,
                    img: data.vod_pic,
                    url: $('hiker://empty?#immersiveTheme#').rule(() => {
                        $.require("csdown").videoerji()
                    }),
                    col_type: 'movie_3',
                    extra: {
                        vod_id: data.vod_id,
                        vod_name: data.vod_name,
                        de_key: MY_PARAMS.de_key,
                        host: MY_PARAMS.host,
                        init: MY_PARAMS.init,
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
    },
    rank: function() {
        var d = this.d;
        var d_ = this.d_;
        var pg = getParam('page');
        try {
            if (MY_PAGE == 1) {
                let rank = [{
                    title: '日榜&周榜&月榜',
                    id: '1&2&3'
                }]
                this.Cate(rank, 'rank' + getMyVar('title'), d_, 'text_3')
                d_.push({
                    col_type: 'blank_block',
                    extra: {
                        id: 'blank_3',
                    }
                }, {
                    img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                    url: "hiker://empty",
                    col_type: "pic_1_full",
                    extra: {
                        id: "loading_"
                    }
                });
                setPreResult(d_)
            }
            if (!storage0.getMyVar('rank_' + getMyVar('rank' + getMyVar('title'), '1') + pg + getMyVar('title'))) {
                let body = {
                    'type_id': +getMyVar('rank' + getMyVar('title'), '1'),
                    'page': +pg,
                }
                let data;
                if (!getMyVar('init')) {
                    data = this.post('api.php/getappapi.index/rankListV134', body);
                } else {
                    data = this.post('api.php/qijiappapi.index/rankListV134', body);
                }
                storage0.putMyVar('rank_' + getMyVar('rank' + getMyVar('title'), '1') + pg + getMyVar('title'), data)
            }
            storage0.getMyVar('rank_' + getMyVar('rank' + getMyVar('title'), '1') + pg + getMyVar('title')).rank_list.forEach(data => {
                d.push({
                    title: data.vod_name + '\n' + ('‘‘’’演员：' + data.vod_actor + '\n国家：' + data.vod_area).small(),
                    desc: '类型：' + data.vod_class + '\n' + ('‘‘’’更新状态：' + data.vod_remarks),
                    img: data.vod_pic,
                    url: $('hiker://empty?#immersiveTheme#').rule(() => {
                        $.require("csdown").videoerji()
                    }),
                    col_type: 'movie_1_vertical_pic',
                    extra: {
                        vod_id: data.vod_id,
                        vod_name: data.vod_name,
                        de_key: MY_PARAMS.de_key,
                        host: MY_PARAMS.host,
                        init: MY_PARAMS.init,
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
    },
    rank2: function() {
        var d = this.d;
        var d_ = this.d_;
        var pg = getParam('page');
        try {
            if (MY_PAGE == 1) {
                d_.push({
                    title: getMyVar('rank' + getMyVar('title'), '0') == '0' ? this.strong('全部', 'FF6699') : '全部',
                    url: $('#noLoading#').lazyRule(() => {
                        putMyVar('rank' + getMyVar('title'), '0');
                        refreshPage(false);
                        return 'hiker://empty';
                    }),
                    col_type: 'scroll_button',
                    extra: {
                        backgroundColor: getMyVar('rank' + getMyVar('title'), '0') == '0' ? "#20FA7298" : "",
                    }
                })
                storage0.getMyVar('type_id_' + getMyVar('title')).forEach((data, index) => {
                    if (!/QQ|群/.test(data.list)) {
                        d_.push({
                            title: getMyVar('rank' + getMyVar('title'), '0') == data.id ? this.strong(data.list, 'FF6699') : data.list,
                            url: $('#noLoading#').lazyRule((id) => {
                                putMyVar('rank' + getMyVar('title'), id);
                                refreshPage(false);
                                return 'hiker://empty';
                            }, data.id),
                            col_type: 'scroll_button',
                            extra: {
                                backgroundColor: getMyVar('rank' + getMyVar('title'), '0') == data.id ? "#20FA7298" : "",
                            }
                        })
                    }
                })
                d_.push({
                    col_type: 'blank_block',
                    extra: {
                        id: 'blank_3',
                    }
                }, {
                    img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                    url: "hiker://empty",
                    col_type: "pic_1_full",
                    extra: {
                        id: "loading_"
                    }
                });
                setPreResult(d_)
            }
            if (!storage0.getMyVar('rank_' + getMyVar('rank' + getMyVar('title'), '0') + pg + getMyVar('title'))) {
                let body = {
                    'type_id': +getMyVar('rank' + getMyVar('title'), '0'),
                    'page': +pg,
                }
                let data;
                if (!getMyVar('init')) {
                    data = this.post('api.php/getappapi.index/rankListV134', body);
                } else {
                    data = this.post('api.php/qijiappapi.index/rankListV134', body);
                }
                storage0.putMyVar('rank_' + getMyVar('rank' + getMyVar('title'), '0') + pg + getMyVar('title'), data)
            }
            storage0.getMyVar('rank_' + getMyVar('rank' + getMyVar('title'), '0') + pg + getMyVar('title')).rank_list.forEach(data => {
                d.push({
                    title: data.vod_name + '\n' + ('‘‘’’演员：' + data.vod_actor + '\n国家：' + data.vod_area).small(),
                    desc: '类型：' + data.vod_class + '\n' + ('‘‘’’更新状态：' + data.vod_remarks),
                    img: data.vod_pic,
                    url: $('hiker://empty?#immersiveTheme#').rule(() => {
                        $.require("csdown").videoerji()
                    }),
                    col_type: 'movie_1_vertical_pic',
                    extra: {
                        vod_id: data.vod_id,
                        vod_name: data.vod_name,
                        de_key: MY_PARAMS.de_key,
                        host: MY_PARAMS.host,
                        init: MY_PARAMS.init,
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
    },
    week: function() {
        var d = this.d;
        var d_ = this.d_;
        var pg = getParam('page');
        let week_1 = new Date().getDay() + '';
        try {
            if (MY_PAGE == 1) {
                let week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
                week.forEach((data, index) => {
                    d_.push({
                        title: getMyVar('week' + getMyVar('title'), week_1) == index ? this.strong((index == week_1 ? '今日' : data), 'ff6699') : (index == week_1 ? '今日' : data),
                        col_type: 'scroll_button',
                        url: $('#noLoading#').lazyRule((data, index) => {
                            putMyVar('week' + getMyVar('title'), index + '');
                            refreshPage(false);
                            return 'hiker://empty';
                        }, data, index),
                        extra: {
                            backgroundColor: getMyVar('week' + getMyVar('title'), week_1) == index ? "#20FA7298" : "",
                        },
                    });
                });
                d_.push({
                    col_type: 'blank_block',
                    extra: {
                        id: 'blank_4',
                    }
                }, {
                    img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                    url: "hiker://empty",
                    col_type: "pic_1_full",
                    extra: {
                        id: "loading_"
                    }
                });
                setPreResult(d_)
            }
            if (!storage0.getMyVar('week_' + getMyVar('week' + getMyVar('title'), week_1) + pg + getMyVar('title'))) {
                let body = {
                    'week': +getMyVar('week' + getMyVar('title'), week_1),
                    'page': +pg,
                }
                let data;
                if (!getMyVar('init')) {
                    data = this.post('api.php/getappapi.index/vodWeekList', body);
                } else {
                    data = this.post('api.php/qijiappapi.index/vodWeekList', body);
                }
                storage0.putMyVar('week_' + getMyVar('week' + getMyVar('title'), week_1) + pg + getMyVar('title'), data)
            }
            storage0.getMyVar('week_' + getMyVar('week' + getMyVar('title'), week_1) + pg + getMyVar('title')).week_list.forEach(data => {
                d.push({
                    title: data.vod_name + '\n' + ('‘‘’’演员：' + data.vod_actor + '\n国家：' + data.vod_area).small(),
                    desc: '类型：' + data.vod_class + '\n' + ('‘‘’’更新状态：' + data.vod_remarks),
                    img: data.vod_pic,
                    url: $('hiker://empty?#immersiveTheme#').rule(() => {
                        $.require("csdown").videoerji()
                    }),
                    col_type: 'movie_1_vertical_pic',
                    extra: {
                        vod_id: data.vod_id,
                        vod_name: data.vod_name,
                        de_key: MY_PARAMS.de_key,
                        host: MY_PARAMS.host,
                        init: MY_PARAMS.init,
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
    },
    jiexi: function(url, parse_api_url, token, from) {
        if (/\.m3u8|\.mp4|\.mkv/.test(url) || from == 'GBDmp4' || from == 'GNKM' && from != 'ATQP1') {
            return url + '#isVideo=true#';
        }
        if (/\.m4a|\.mp3/.test(url)) {
            return url + '#isMusic=true#';
        }
        try {
            if (/url=/.test(parse_api_url)) {
                let qq = JSON.parse(fetch(parse_api_url)).url;
                if (qq.includes('nby') && qq.includes('mp4')) {
                    let nby = JSON.parse(fetch(qq, {
                        headers: {},
                        method: 'GET',
                        onlyHeaders: true
                    }))
                    return nby.url + '#isVideo=true#';
                }
                return qq + '#isVideo=true#';
            }
            let parse_api = parse_api_url.slice(0, 32);
            let body = {
                'parse_api': parse_api,
                'url': this.Encrypt(url),
                'token': token,
            };
            let data;
            if (!getMyVar('init')) {
                data = this.post('api.php/getappapi.index/vodParse', body).json;
            } else {
                data = this.post('api.php/qijiappapi.index/vodParse', body).json;
            }
            let m3u8 = JSON.parse(data).url;
            if (m3u8.includes('nby') && m3u8.includes('mp4')) {
                let nby = JSON.parse(fetch(m3u8, {
                    headers: {},
                    method: 'GET',
                    onlyHeaders: true
                }))
                return nby.url + '#isVideo=true#';
            }
            if (m3u8 == null) {
                return 'toast://未获取到链接'
            }
            return m3u8 + '#isVideo=true#';
        } catch (e) {
            log(e.message)
            return 'toast://未获取到链接'
        }
    },
    shsort: function() {
        putMyVar('shsort', getMyVar('shsort') == '1' ? '0' : '1')
        try {
            let urls = findItemsByCls("选集_");
            urls.reverse();
            urls.forEach(item => {
                item.col_type = item.type;
            });
            updateItem('排序', {
                title: (getMyVar('shsort', '0') == '1') ? '““””<b><span style="color: #FF0000">逆序</span></b>' : '““””<b><span style="color: #1aad19">正序</span></b>',
            })
            deleteItemByCls('选集_');
            addItemBefore('blank', urls);
            toast('切换排序成功');
        } catch (e) {
            refreshPage(false)
        }
        return 'hiker://empty';
    },
    flod: function() {
        putMyVar('flod_', getMyVar('flod_', '0') === '1' ? '0' : '1');
        updateItem('flod_1', {
            title: getMyVar('flod_', '0') == '1' ? '““””<b>' + '∨'.fontcolor("#FF0000") + '</b>' : '““””<b>' + '∧'.fontcolor("#1aad19") + '</b>',
        })
        if (getMyVar('flod_', '0') == '1') {
            let flod = [];
            storage0.getMyVar('type_id_' + getMyVar('title'))[+getMyVar('type_list_index' + getMyVar('title'), '0')].filter_type_list.forEach((data, index) => {
                let name = data.name;
                putMyVar('cate_index_' + name + getMyVar('type_list_index' + getMyVar('title'), '0') + getMyVar('title'), data.list[0])
                data.list.forEach(data => {
                    flod.push({
                        title: getMyVar('type_list_' + name + getMyVar('type_list_index' + getMyVar('title'), '0') + getMyVar('title'), getMyVar('cate_index_' + name + getMyVar('type_list_index' + getMyVar('title'), '0') + getMyVar('title'))) == data ? this.strong(data, 'FF6699') : data,
                        url: $('#noLoading#').lazyRule((n, name, id) => {
                            putMyVar(n, id);
                            refreshPage(false);
                            return 'hiker://empty';
                        }, 'type_list_' + name + getMyVar('type_list_index' + getMyVar('title'), '0') + getMyVar('title'), name, data),
                        col_type: 'scroll_button',
                        extra: {
                            backgroundColor: getMyVar('type_list_' + name + getMyVar('type_list_index' + getMyVar('title'), '0') + getMyVar('title'), getMyVar('cate_index_' + name + getMyVar('type_list_index' + getMyVar('title'), '0') + getMyVar('title'))) == data ? "#20FA7298" : "",
                            cls: '分类_',
                        }
                    })
                })
                flod.push({
                    col_type: 'blank_block',
                    extra: {
                        cls: '分类_'
                    }
                })
            })
            addItemAfter('cate_1', flod)
        } else {
            deleteItemByCls('分类_')
        }
        return "hiker://empty"
    },
    line: function(n, title, id) {
        putMyVar(n, id);
        try {
            let vod_list = storage0.getMyVar('vodDetail').vod_play_list;
            let vod_info = getMyVar('info');
            vod_list.forEach((data, index_1) => {
                let info = data.player_info;
                updateItem('线路_' + index_1, {
                    title: vod_info == index_1 ? this.strong(info.show, 'FF6699') : info.show,
                    extra: {
                        backgroundColor: vod_info == index_1 ? "#20FA7298" : "",
                    }
                })
            })
            let urls = vod_list[+vod_info].urls;
            if (getMyVar('shsort', '0') == '1') {
                urls.reverse()
            }
            let line = urls.map(data => {
                return {
                    title: data.name,
                    url: $().lazyRule((url, parse_api_url, token, from) => {
                        return $.require("csdown").jiexi(url, parse_api_url, token, from)
                    }, data.url, data.parse_api_url, data.token, data.from),
                    col_type: data.name.length > 5 ? 'text_2' : 'text_4',
                    extra: {
                        vod_url: data.url,
                        cls: '选集_',
                    }
                }
            })
            deleteItemByCls('选集_');
            addItemBefore('blank', line);
        } catch (e) {
            //log(e.message)
            refreshPage(false)
        }
        return 'hiker://empty';
    },
    data: [{
            title: '鲸鱼影视',
            img: 'https://seyouapp777.dqntwl.com/i/2025/07/15/1000067590.png',
            de_key: 'AAdgrdghjfgswerA',
            host: 'https://jingyu4k-1312635929.cos.ap-nanjing.myqcloud.com/1.json',
            init: 120,
            rank: 1,
        }, {
            title: '顾我追剧',
            img: 'https://seyouapp777.dqntwl.com/i/2025/07/19/顾我追剧_icon.png',
            de_key: 'ca94b06ca3c7d80e',
            host: 'https://guwozj-1319364746.cos.ap-guangzhou.myqcloud.com/gw.txt',
            init: 120,
            rank: 1,
        },
        {
            title: '蓝鹰影视',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/07/蓝鹰影视.png',
            de_key: 'ca94b06ca359d80e',
            host: 'https://lanyinghz.oss-cn-hangzhou.aliyuncs.com/lanyingxmy.txt',
            init: 120,
        }, {
            title: '瓜萌视频',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/04/瓜萌视频.jpg',
            de_key: 'f2A7D4B9E8C16531',
            host: 'https://www.guahd.com/1.txt',
        },
        {
            title: '仓鼠4K',
            img: 'https://seyouapp777.dqntwl.com/i/2025/07/19/仓鼠4K_icon.png',
            de_key: 'Z98KXaLtO2wC1Pte',
            host: 'https://ceshi307386.oss-cn-beijing.aliyuncs.com/csurl.txt',
            init: 120,
        }, {
            title: '若雪4K',
            img: 'https://seyouapp777.dqntwl.com/i/2025/07/10/若雪4K_icon.png',
            de_key: 'ZX10ysTYZWtIJCTU',
            host: 'https://appcms.rx4k.top/',
            init: 120,
            rank: 1,
        }, {
            title: 'DuoFun',
            img: 'https://seyouapp777.dqntwl.com/i/2025/07/18/DuoFun_icon.png',
            de_key: 'qqqqqqqqqqqqqqqq',
            host: 'https://cdn-tupic-duofun-neimenggu.56uxi.com/duofun.txt',
            rank: 1,
        }, {
            title: '萝卜视频',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/04/萝卜影视.png',
            de_key: 'apiapplbyskey168',
            host: 'https://apiapplbys.lbys.app:5678/',
        }, {
            title: '橘子视频',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/04/橘子视频.png',
            de_key: '2015692015692015',
            host: 'http://t.bffree.cn/1.txt',
        },
        {
            title: '次元派对',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/04/次元派对.png',
            de_key: 'AmtMYFCJDPoTlK7z',
            host: 'https://qjappcms.acg.party/',
        }, {
            title: '豆丁视频',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/04/豆丁视频.png',
            de_key: 'xasdasdqwertyuio',
            host: 'https://vip.123pan.cn/1848451100/zl/xfdd.txt',
        },
        {
            title: '白蛇影视',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/06/白蛇影视.png',
            de_key: 'n3l2tx5jdkp9s2c8',
            host: 'http://tengxunyunaliyun.oss-cn-shanghai.aliyuncs.com/tengxunyun.txt',
        },
        {
            title: '小红影视',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/06/小红影视.jpg',
            de_key: 'ENonBHeVBoYZhVUV',
            host: 'https://www.xiaohys.com/',
        }, {
            title: '若惜追剧',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/10/1000184749.png',
            de_key: 'ebad3f1a58b13933',
            host: 'https://rxysyyds.oss-cn-chengdu.aliyuncs.com/getapp.txt',
        }, {
            title: '灵虎影视',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/10/灵虎影视.png',
            de_key: '#getapp@TMD@2025',
            host: 'https://bind.315999.xyz/89.txt',
        }, {
            title: '丫丫动漫',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/10/丫丫动漫.png',
            de_key: 'qkxnwkfjwpcnwycl',
            host: 'http://tv.yy-fun.cc/',
        },
        {
            title: '黑猫动漫',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/10/黑猫动漫.png',
            de_key: '0fe3b5781782c621',
            host: 'http://txt.heimaotv.top/hei.txt',
        },
        {
            title: '冬日动漫',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/13/1000184820.png',
            de_key: 'qE2nD0rL1lH4uP9r',
            host: 'http://www.drdm.fun/',
        }, {
            title: '掌上追剧',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/13/1000184818.png',
            de_key: 'jcTz6Jda2aKrH8Tk',
            host: 'http://tvb.yy-fun.cc/',
            rank: 1,
        }, {
            title: '魔方影视',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/15/1000066562.png',
            de_key: '1234567887654321',
            host: 'https://www.snysw.xyz/mfys.txt',
        }, {
            title: '恋鱼影视',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/15/恋鱼影视.png',
            de_key: '2234567890123456',
            host: 'https://173220859-1333208043.cos.ap-shanghai.myqcloud.com/1.txt',
        }, {
            title: 'MiFun',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/15/mifun.png',
            de_key: 'GETMIFUNGEIMIFUN',
            host: 'http:/getapp.open.mifun.pro/mifun.txt',
        }, {
            title: '桃子影视',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/18/1000184828.png',
            de_key: 'KL6vlZkw6WL5x90U',
            host: 'https://appcms.tzys.xyz/appurl.txt',
        }, {
            title: '麻花视频',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/20/1000184850.png',
            de_key: 'q7gj4f9br3fls6nh',
            host: 'http://123.207.221.80:500/',
        }, {
            title: '火猫影视',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/20/1000184852.png',
            de_key: 'J6AIORKJ3PQOJKM3',
            host: 'https://cunchu8.obs.cn-north-4.myhuaweicloud.com/01.txt',
        }, {
            title: '次元咲',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/26/1000066973.jpg',
            de_key: '2c4h36abd96se10u',
            host: 'http://cic.aicg.fun/',
            rank: 1,
        }, {
            title: '稀饭动漫',
            img: 'https://mogua.co/download/fbe12a11259032f483791157694c4f38-icon.png',
            de_key: '1yZ2Spn9krnzVKoC',
            host: 'https://xfapp-1305390065.cos.ap-guangzhou.myqcloud.com/getapp.txt',
        },
        {
            title: '哔滴影视',
            img: 'https://seyouapp777.dqntwl.com/i/2025/07/17/哔嘀影视_icon.png',
            de_key: '5ae8ee4bb95ea0ce',
            host: 'https://ooxooxooxooxoo-1259561579.cos.ap-chengdu.myqcloud.com/ip.json',
            init: 120,
        },
        {
            title: '囧次元(伪)',
            img: 'https://seyouapp777.dqntwl.com/i/2025/07/22/囧次元_icon.png',
            de_key: '672263e98f232a05',
            host: 'https://jocy.oss-cn-hangzhou.aliyuncs.com/jcy.txt',
            rank: 1,
        },
        {
            title: '旗星影视',
            img: 'https://seyouapp777.dqntwl.com/i/2025/07/23/旗星影视_icon.png',
            de_key: '2SWSPFxugBLPPOKo',
            host: 'http://ys.qist.top/',
            //host: 'http://ys.qist.top/dtym.txt',
        },
        {
            title: '云云影视',
            img: 'https://seyouapp777.dzlndygh.com/i/2025/07/29/云云视频_icon.png',
            de_key: 'staraugust123456',
            host: 'https://staraugust123456.oss-cn-hangzhou.aliyuncs.com/1.txt',
            init: 120,
        },
        {
            title: '乐看视频',
            img: 'https://seyouapp777.dzlndygh.com/i/2025/07/28/乐看视频_icon.png',
            de_key: 'e65144389e9361b5',
            host: 'https://app.lkdyw.cn/',
        },
        {
            title: '米兔影视',
            img: 'https://seyouapp777.dzlndygh.com/i/2025/07/31/米兔影视_icon.png',
            de_key: 'jPw6nK8VTQef9GiA',
            host: 'http://b.tv.tkbot.fun/',
            //http://c.tv.tkbot.fun/ 
            //http://d.tv.tkbot.fun/
            //http://szbz27vf7.hd-bkt.clouddn.com/mitu.txt
        },
    ],
    disable: [{
            title: '晴天4K',
            img: 'https://www.sun4k.top/%E6%99%B4%E5%A4%A94Klogo.png',
            de_key: 'sBxqXVF5pAHbGzrH',
            host: 'https://qjappcms.sun4k.top/',
        }, {
            title: '小羊4K',
            img: 'https://seyouapp777.dzlndygh.com/i/2025/07/27/1000068032.png',
            de_key: '7SDWjknU34zqFbVr',
            host: 'https://appcms.xy4k.com/',
        }, {
            title: '晚风影视',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/26/1000184893.png',
            de_key: 'fjhndgbjidfhgjsd',
            host: 'https://wfys-1329733604.cos.ap-guangzhou.myqcloud.com/wf.txt',
        }, {
            title: '水滴视频',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/02/水滴视频.png',
            de_key: 'gKdQKLbwhhLp4Ytv',
            host: 'http://1.94.105.93/',
            init: 120,
        }, {
            title: '落攻阁影视',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/10/落攻阁影视.png',
            de_key: 'asgcxhjkts124573',
            host: 'http://111.180.198.40:1110/',
        }, {
            title: '榴莲4K',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/06/榴莲影视.jpg',
            de_key: '1yGA85sJ5STtE7uj',
            host: 'https://qjappcms.ll4k.xyz/',
            init: 120,
        }, {
            title: 'TrAni',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/04/TrAni.jpg',
            de_key: 'kKvLqIfXyIkYyLpL',
            host: 'https://www.mcydh.com/',
        }, {
            title: 'Mnfans',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/20/1000184843.png',
            de_key: '247D7D65913BF2FF',
            host: 'http://154.44.24.197:8889/',
        }, {
            title: '海豚视频',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/11/icon.png',
            de_key: 'R69yVluzg6yLpjp0',
            host: 'https://qjappcms.htsp4k.top/',
            init: 120,
        },
        {
            title: '橘猫4K',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/15/1000066554.png',
            de_key: 'pBVmysmGX8TsgrQN',
            host: 'https://ceshi307386.oss-cn-beijing.aliyuncs.com/jmurl.txt',
            init: 120,
        }, {
            title: '云速影视',
            img: 'https://seyouapp777.dqntwl.com/i/2025/06/19/1000184837.png',
            de_key: '4d83b87c4c5ea111',
            host: 'http://59.153.167.137:7788/1.json',
            rank: 1,
        },
    ]
}
$.exports = csdown

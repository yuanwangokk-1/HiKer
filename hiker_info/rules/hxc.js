const hxc = {
    d: [],
    author: '流苏',
    version: '20250330',
    rely: (data) => {
        return data.match(/\{([\s\S]*)\}/)[0].replace(/\{([\s\S]*)\}/, '$1')
    },
    home: () => {
        var d = hxc.d;
        if (getItem('up' + hxc.version, '') == '') {
            confirm({
                title: '更新内容',
                content: '版本号：' + hxc.version + '\n1.添加搜索\n2.添加女优\n没问题不会再更新',
                confirm: $.toString((version) => {
                    setItem('up' + version, '1')
                }, hxc.version),
                cancel: $.toString(() => {})
            })
        }
        if (MY_PAGE == 1) {
            d.push({   
                title: "搜索 ",
                url: $.toString(() => {
                    putMyVar('keyword', input)
                    return "hiker://empty?page=fypage&kw=" + input + '@rule=js:$.require("hxc").search()'
                }),
                   desc: "请输入搜索关键词",
                   col_type: "input",
                extra: {
                    defaultValue: getMyVar('keyword', ''),
                }
            })
        };
        var c1 = [{
            title: '视频&专题&合集&短视频&女优',
            id: '1&2&3&4&5',
            img: 'https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/47.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/74.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/30.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/9.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/7.png'
        }];
        if (MY_PAGE == 1) {
            eval(hxc.rely(hxc.aes))
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
        if (分类 == 1) {
            hxc.video()
        } else if (分类 == 2) {
            hxc.subject()
        } else if (分类 == 3) {
            hxc.heji()
        } else if (分类 == 4) {
            hxc.mini()
        } else if (分类 == 5) {
            hxc.actor()
        }
        setResult(d)
    },
    video: () => {
        var d = hxc.d;
        var pg = getParam('page');
        eval(hxc.rely(hxc.aes))
        try {
            if (MY_PAGE == 1) {
                let 首页视频 = [{
                    title: '今日上新&国产&主播&日韩&欧美&动漫',
                    id: '&4&11&17&23&29'
                }]
                let 首页视频分类 = [{
                    title: '发布时间&点赞数量&收藏数量&综合排序',
                    id: '1&5&6&7'
                }]
                Cate(首页视频, '首页视频', d)
                Cate(首页视频分类, '首页视频分类', d)
            }
            let getlist_url = getItem('host') + '/videos/getList';
            let getlist_body = '{"length":20,"orderType":' + getMyVar('首页视频分类', '1') + ',"page":' + pg + ',"payType":[1,2,3,4],"tagIds":[],"tags":[],"type":0,"typeIds":[' + getMyVar('首页视频', '') + '],"videoIds":[]}';
            let list = post(getlist_url, getlist_body).data.list;
            list.forEach(data => {
                d.push({
                    title: data.name,
                    desc: data.addTime + '      ' + parseInt(data.length / 60) + ':' + parseInt(data.length % 60),
                    img: data.coverImgUrl + lazy,
                    url: data.id + vod,
                    col_type: 'movie_2',
                })
            })
        } catch (e) {
            log(e.message)
            if (getMyVar('a') == '') {
                var host = 'https://a94p.deyigx.com';
                putMyVar('a', '1')
                setItem('host', host)
                refreshPage()
                toast('域名已更新')
            }
        }
    },
    aes: $.toString(() => {
        //加载CryptoJS库
        eval(getCryptoJS())
        //生成时间戳
        function getCurrentTimestamp() {
            return new Date().getTime();
        }
        //md5加密
        function md5(str) {
            return CryptoJS.MD5(str).toString();
        }
        //sha256加密
        function sha256(str) {
            return CryptoJS.SHA256(str).toString();
        }

        function color(txt) {
            return '<b><font color=' + '#FF6699' + '>' + txt + '</font></b>'
        }

        function strong(d, c) {
            return '‘‘’’<strong><font color=#' + (c || '000000') + '>' + d + '</font></strong>';
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
                        url: $(id[index]).lazyRule((n, title, id) => {
                            putMyVar(n, input);
                            refreshPage();
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
        // 解密函数
        function Decrypt(word) {
            const key = CryptoJS.enc.Utf8.parse("B77A9FF7F323B5404902102257503C2F");
            const iv = CryptoJS.enc.Utf8.parse("B77A9FF7F323B540");
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
            const key = CryptoJS.enc.Utf8.parse("B77A9FF7F323B5404902102257503C2F");
            const iv = CryptoJS.enc.Utf8.parse("B77A9FF7F323B540");
            var encrypted = CryptoJS.AES.encrypt(plaintext, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            var ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
            return ciphertext;
        }
        var lazy = $('').image(() => {
            const CryptoUtil = $.require("hiker://assets/crypto-java.js");
            let key = CryptoUtil.Data.parseUTF8("46cc793c53dc451b");
            let textData = CryptoUtil.Data.parseInputStream(input).base64Decode();
            let encrypted = CryptoUtil.AES.decrypt(textData, key, {
                mode: "AES/ECB/NoPadding"
            });
            let base64Text = encrypted.toString().split("base64,")[1];
            let encrypted0 = CryptoUtil.Data.parseBase64(base64Text, _base64.NO_WRAP);
            return encrypted0.toInputStream();
        })

        function post(url, data0) {
            var endata = Encrypt(data0);
            var ents = Encrypt(parseInt(new Date().getTime() / 1e3) + 60 * new Date().getTimezoneOffset() + '');
            var body = '{"endata":"' + endata + '","ents":"' + ents + '"}';
            var html = fetch(url, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                },
                body: body,
                method: 'POST'
            });
            return JSON.parse(html);
        }
        var vod = $('').lazyRule(() => {
            eval($.require('hxc').rely($.require('hxc').aes));
            let data0 = '{"videoId":' + input + '}';
            var url = getItem('host') + '/videos/getPreUrl';
            var url1 = post(url, data0);
            var url2 = url1.data.url;
            if (url2) {
                return url2.replace(/start.*?&sign/, 'sign')
            }
            return 'toast://未获取到链接'
        })
    }),
    search: () => {
        var d = hxc.d;
        var pg = getParam('page');
        eval(hxc.rely(hxc.aes))

        try {
            if (MY_PAGE == 1) {
                var 搜索 = [{
                    title: '视频&合集&短视频',
                    id: '1&2&3'
                }]
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
                Cate(搜索, '搜索', d);
            }
            let getlist_url = getItem('host') + '/base/globalSearch';
            let getlist_body = '{"key":"' + getMyVar('keyword') + '","length":20,"page":' + pg + ',"type":' + getMyVar('搜索', '1') + '}';
            let list = post(getlist_url, getlist_body).data.infos;
            if (getMyVar('搜索', '1') == 2) {
                list.forEach(data => {
                    d.push({
                        title: data.name,
                        img: data.coverImgUrl + lazy,
                        url: 'hiker://empty@rule=js:$.require("hejierji")',
                        col_type: 'movie_2',
                        extra: {
                            id: data.gatherId
                        }
                    })
                })
            } else {
                list.forEach(data => {
                    d.push({
                        title: data.name,
                        desc: data.addTime + '      ' + parseInt(data.length / 60) + ':' + parseInt(data.length % 60),
                        img: data.coverImgUrl + lazy,
                        url: data.id + vod,
                        col_type: 'movie_2',
                    })
                })
            }
        } catch (e) {
            log(e.mmessage)
        }
        setResult(d)
    },
    subject: () => {
        var d = hxc.d;
        eval(hxc.rely(hxc.aes))
        try {
            let subject_url = getItem('host') + '/subject/list';
            let subject_body = '{"length":16,"orderType":3,"page":1,"subjectIds":[71,68,67,66,65,62,69,64,11,2]}';
            let list = post(subject_url, subject_body).data.list;
            list.forEach(data => {
                d.push({
                    title: data.name,
                    img: data.coverImgUrl + lazy,
                    url: 'hiker://empty?page=fypage@rule=js:$.require("hxc").subjecterji()',
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
    subjecterji: () => {
        var d = hxc.d;
        eval(hxc.rely(hxc.aes))
        var id = MY_PARAMS.id;
        var pg = getParam('page');
        try {
            if (MY_PAGE == 1) {
                let 专题二级分类 = [{
                    title: '推荐&最新&最热',
                    id: '8&1&2'
                }]
                Cate(专题二级分类, '专题二级分类', d)
            }
            let getlist_url = getItem('host') + '/videos/getList';
            let getlist_body = '{"length":12,"orderType":' + getMyVar('专题二级分类', '8') + ',"page":' + pg + ',"subjectId":' + id + ',"type":0}';
            let list = post(getlist_url, getlist_body).data.list;
            list.forEach(data => {
                d.push({
                    title: data.name,
                    desc: data.addTime + '      ' + parseInt(data.length / 60) + ':' + parseInt(data.length % 60),
                    img: data.coverImgUrl + lazy,
                    url: data.id + vod,
                    col_type: 'movie_2',
                })
            })
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    heji: () => {
        var d = hxc.d;
        var pg = getParam('page');
        eval(hxc.rely(hxc.aes))
        try {
            let heji_url = getItem('host') + '/gather/getList';
            let heji_body = '{"gatherIds":[],"gatherType":1,"length":20,"orderType":3,"page":' + pg + '}';
            let list = post(heji_url, heji_body).data.list;
            list.forEach(data => {
                d.push({
                    title: data.name,
                    img: data.coverImgUrl + lazy,
                    url: 'hiker://empty@rule=js:$.require("hxc").hejierji()',
                    col_type: 'card_pic_3_center',
                    extra: {
                        id: data.gatherId
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
    },
    hejierji: () => {
        var d = hxc.d;
        eval(hxc.rely(hxc.aes))
        var id = MY_PARAMS.id;
        try {
            let getlist_url = getItem('host') + '/gather/getDetail';
            let getlist_body = '{"gatherId":' + id + '}';
            let list = post(getlist_url, getlist_body).data.info.videos;
            list.forEach(data => {
                d.push({
                    title: data.name,
                    desc: data.addTime + '      ' + parseInt(data.length / 60) + ':' + parseInt(data.length % 60),
                    img: data.coverImgUrl + lazy,
                    url: data.id + vod,
                    col_type: 'movie_2',
                })
            })
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    actor: () => {
        var d = hxc.d;
        var pg = getParam('page');
        eval(hxc.rely(hxc.aes))
        try {
            let actor_url = getItem('host') + '/user/getUpList';
            let actor_body = '{"filterIds":[],"groupIds":[1],"isManualBack":0,"length":20,"page":' + pg + ',"uids":[]}';
            let list = post(actor_url, actor_body).data.list;
            list.forEach(data => {
                d.push({
                    title: data.user_nicename,
                    desc: data.signature,
                    img: data.avatar + lazy,
                    url: 'hiker://empty?page=fypage@rule=js:$.require("hxc").actorerji()',
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
    actorerji: () => {
        var d = hxc.d;
        var pg = getParam('page');
        var id = MY_PARAMS.id;
        eval(hxc.rely(hxc.aes))
        try {
            let getlist_url = getItem('host') + '/user/getSpaceVideo';
            let getlist_body = '{"length":20,"orderType":1,"page":' + pg + ',"touid":' + id + ',"videoSort":1}';
            let list = post(getlist_url, getlist_body).data.list;
            list.forEach(data => {
                d.push({
                    title: data.name,
                    desc: data.addTime + '      ' + parseInt(data.length / 60) + ':' + parseInt(data.length % 60),
                    img: data.coverImgUrl + lazy,
                    url: data.id + vod,
                    col_type: 'movie_2',
                })
            })
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    mini: () => {
        var d = hxc.d;
        var pg = getParam('page');
        eval(hxc.rely(hxc.aes))
        try {
            function getRandomInt(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            var num = getRandomInt(10, 25);
            let getlist_url = getItem('host') + '/videos/getList';
            let getlist_body = '{"footId":2,"length":' + num + ',"page":' + pg + ',"type":7}';
            let list = post(getlist_url, getlist_body).data.list;
            list.forEach(data => {
                d.push({
                    title: data.name,
                    desc: data.addTime + '      ' + parseInt(data.length / 60) + ':' + parseInt(data.length % 60),
                    img: data.coverImgUrl + lazy,
                    url: data.id + vod,
                    col_type: 'movie_2',
                })
            })
        } catch (e) {
            log(e.message)
        }
    }
}
$.exports = hxc

const csdown = {
    d: [],
    author: '流苏',
    version: '20250406',
    rely: (data) => {
        return data.match(/\{([\s\S]*)\}/)[0].replace(/\{([\s\S]*)\}/, '$1')
    },
    home: () => {
        var d = csdown.d;
        if (MY_PAGE == 1) {
            d.push({   
                title: "搜索 ",
                url: $.toString(() => {
                    putMyVar('keyword', input)
                    return "hiker://empty?page=fypage&kw=" + input + '@rule=js:$.require("csdown").search()'
                }),
                   desc: "请输入搜索关键词",
                   col_type: "input",
                extra: {
                    defaultValue: getMyVar('keyword', ''),
                }
            })
        };
        eval(csdown.rely(csdown.aes))
        let pg = getParam('page');
        try {
            if (MY_PAGE == 1) {
                if (!storage0.getItem('classify_')) {
                    let classify = getItem('host') + '/api/video/classifyList?restricted=0';
                    let html = post(classify);
                    let item = JSON.parse(html);
                    storage0.setItem('classify_0', item);
                    storage0.setItem('classify_', item);
                    let classify1 = getItem('host') + '/api/video/classifyList?restricted=1';
                    let html_1 = post(classify1);
                    let item_1 = JSON.parse(html_1);
                    storage0.setItem('classify_1', item_1);
                }
                let longclick = [{
                    title: getItem('open', '0') == '0' ? '开启禁区' : '关闭禁区',
                    js: $.toString(() => {
                        if (getItem('open', '0') == '0') {
                            confirm({
                                title: '是否开启禁区?',
                                content: '此频道可能存在令人不适的内容,是否选择开启?',
                                confirm: $.toString(() => {
                                    setItem('open', '1')
                                    let classify = storage0.getItem('classify_0').concat(storage0.getItem('classify_1'))
                                    storage0.setItem('classify_', classify)
                                    toast('已开启禁区')
                                    refreshPage(false)
                                }),
                                cancel: $.toString(() => {})
                            })
                        } else {
                            setItem('open', '0');
                            let classify = storage0.getItem('classify_0');
                            storage0.setItem('classify_', classify);
                            putMyVar('classify', getMyVar('index_classify'))
                            toast('已关闭禁区')
                            refreshPage(false)
                        }
                    })
                }]
                let index_n = storage0.getItem('classify_')[0].classifyId + '';
                putMyVar('index_classify', index_n)
                storage0.getItem('classify_').forEach(data => {
                    d.push({
                        title: getMyVar('classify', getMyVar('index_classify')) == data.classifyId + '' ? strong(data.classifyTitle, 'FF6699') : data.classifyTitle,
                        url: $('#noLoading#').lazyRule((title, id) => {
                            putMyVar('classify', id);
                            refreshPage(false);
                            return 'hiker://empty';
                        }, data.classifyTitle, data.classifyId + ''),
                        col_type: 'scroll_button',
                        extra: {
                            id: data.classifyId,
                            longClick: longclick,
                        }
                    })
                })
                d.push({
                    col_type: 'blank_block'
                })
            }
            if (getMyVar('classify', getMyVar('index_classify')) == 1 || getMyVar('classify', getMyVar('index_classify')) == 8) {
                let url = getItem('host') + '/api/station/stations?classifyId=' + getMyVar('classify', getMyVar('index_classify')) + '&page=' + pg + '&pageSize=10';
                let html2 = post(url);
                let list = JSON.parse(html2).data;
                list.forEach(data => {
                    d.push({
                        title: color(data.stationName),
                        img: 'hiker://images/icon_right5',
                        url: 'hiker://empty?page=fypage@rule=js:$.require("csdown").videoerji()',
                        col_type: 'text_icon',
                        extra: {
                            id: data.stationId,
                        }
                    })
                    try {
                        var items = data.videoList;
                        items.forEach(data => {
                            d.push({
                                title: data.title,
                                desc: data.createdAt.split('.')[0] + '\t\t\t\t' + parseInt(data.playTime / 60) + ':' + parseInt(data.playTime % 60),
                                url: data.videoUrl == '' ? data.videoId + vod : (getItem('host') + '/api/m3u8/h5/decode?path=' + data.videoUrl),
                                img: getItem('imgDomain') + data.coverImg[0] + '_480' + image,
                                col_type: 'movie_2'

                            })
                        })
                    } catch {}
                })
            } else if (getMyVar('classify', getMyVar('index_classify')) == 2 || getMyVar('classify', getMyVar('index_classify')) == 9 || getMyVar('classify', getMyVar('index_classify')) == 6) {
                if (MY_PAGE == 1) {
                    let 动漫分类 = [{
                        title: '最新上传&最新播放&最多点赞',
                        id: '0&1&2'
                    }];
                    Cate(动漫分类, '动漫分类' + getMyVar('classify', getMyVar('index_classify')), d);
                    if (storage0.getItem('weeklist') == '') {
                        let weeklist_url = getItem('host') + '/api/yearWeekRange/list';
                        let weeklist_data = JSON.parse(post(weeklist_url)).data;
                        storage0.setItem('weeklist', weeklist_data)
                    }
                    d.push({
                        title: getItem('year' + getMyVar('classify', getMyVar('index_classify')), storage0.getItem('weeklist')[0].weekRanges[0].year + '') + '年 第' + getItem('week' + getMyVar('classify', getMyVar('index_classify')), storage0.getItem('weeklist')[0].weekRanges[0].week + '') + '周 ' + getItem('startDate' + getMyVar('classify', getMyVar('index_classify')), storage0.getItem('weeklist')[0].weekRanges[0].startTime) + '~' + getItem('endDate' + getMyVar('classify', getMyVar('index_classify')), storage0.getItem('weeklist')[0].weekRanges[0].endTime),
                        url: $('#noLoading#').lazyRule(() => {
                            let option = [];
                            storage0.getItem('weeklist').forEach(data => {
                                let week = data.weekRanges;
                                week.forEach(data => {
                                    option.push(data.year + '年 第' + data.week + '周 ' + data.startTime + '~' + data.endTime)
                                })
                            })
                            let Line = {
                                title: '选择时间',
                                options: option,
                                col: 1,
                                js: $.toString(() => {
                                    let time = input.split(' ')[2];
                                    let year = input.split('年')[0];
                                    let week = input.split('第')[1].split('周')[0];
                                    let startDate = time.split('~')[0];
                                    let endDate = time.split('~')[1];
                                    setItem('year' + getMyVar('classify', getMyVar('index_classify')), year);
                                    setItem('week' + getMyVar('classify', getMyVar('index_classify')), week);
                                    setItem('startDate' + getMyVar('classify', getMyVar('index_classify')), startDate);
                                    setItem('endDate' + getMyVar('classify', getMyVar('index_classify')), endDate);
                                    refreshPage(false)
                                })
                            }
                            return 'select://' + JSON.stringify(Line);
                        }),
                        col_type: 'text_center_1',
                        extra: {
                            lineVisible: false
                        }
                    })
                }
                let url = getItem('host') + '/api/video/getByClassify?pageSize=10&page=' + pg + '&sortType=' + getMyVar('动漫分类' + getMyVar('classify', getMyVar('index_classify')), '0') + '&classifyId=' + getMyVar('classify', getMyVar('index_classify')) + '&startDate=' + getItem('startDate' + getMyVar('classify', getMyVar('index_classify')), storage0.getItem('weeklist')[0].weekRanges[0].startTime) + '&endDate=' + getItem('endDate' + getMyVar('classify', getMyVar('index_classify')), storage0.getItem('weeklist')[0].weekRanges[0].endTime) + (getMyVar('classify', getMyVar('index_classify')) == 6 ? '&restricted=1' : '');
                let html = post(url);
                let list = JSON.parse(html).data;
                list.forEach(data => {
                    d.push({
                        title: data.title,
                        desc: data.createdAt.split('.')[0] + '\t\t\t\t' + parseInt(data.playTime / 60) + ':' + parseInt(data.playTime % 60),
                        url: data.videoUrl == '' ? data.videoId + vod : (getItem('host') + '/api/m3u8/h5/decode?path=' + data.videoUrl),
                        img: getItem('imgDomain') + data.coverImg[0] + '_480' + image,
                        col_type: 'movie_2'
                    })
                })
            } else if (getMyVar('classify', getMyVar('index_classify')) == 3 || getMyVar('classify', getMyVar('index_classify')) == 7) {
                if (MY_PAGE == 1) {
                    let 漫画分类 = [{
                        title: '最新上传&最新播放&最多点赞',
                        id: '0&1&2'
                    }];
                    Cate(漫画分类, '漫画分类', d);
                }
                let url = getItem('host') + '/api/comics/base/findList';
                let body = '{"orderType":' + getMyVar('漫画分类', '0') + ',"page":' + pg + ',"pageSize":15' + (getMyVar('classify', getMyVar('index_classify')) == 7 ? ',"restricted":1' : '') + '}';
                let html = post(url, body);
                let list = JSON.parse(html).data;
                list.forEach(data => {
                    d.push({
                        title: data.comicsTitle,
                        url: 'hiker://empty?page=fypage&#immersiveTheme#@rule=js:$.require("csdown").manerji()',
                        img: getItem('imgDomain') + data.coverImg + '_480' + image,
                        col_type: 'movie_3',
                        extra: {
                            id: data.comicsId,
                        }
                    })
                })
            }
        } catch (e) {
            log(e.message)
            if (getMyVar('a') == '') {
                var host = 'https://api.971ibo1q.work';
                setItem('host', host)
                putMyVar('a', '1')
                // 调用方法生成随机字符串
                var deviceId = generateRandomHex(32);
                setItem('deviceId', deviceId)
                let token_url = getItem('host') + '/api/user/traveler';
                let token_data = JSON.parse(fetch(token_url, {
                    headers: {
                        'Content-Type': 'application/json',
                        't': t,
                        's': s,
                        'deviceId': getItem('deviceId'),
                        'User-Agent': 'Mozilla/5.0 (Linux; Android 15; 24031PN0DC Build/AQ3A.240627.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.6723.86 Mobile Safari/537.36;SuiRui/acfan/ver=1.0.2'
                    },
                    body: {
                        "deviceId": getItem('deviceId'),
                        "acb": "Bp",
                        "code": "",
                        "chCode": "bili10"
                    },
                    method: 'POST'
                }));
                let token = token_data.data.token;
                let imgDomain = token_data.data.imgDomain;
                setItem('token', token);
                setItem('imgDomain', imgDomain);
                refreshPage()
                toast('域名已更新')
            }
        }
        setResult(d)
    },
    aes: $.toString(() => {
        //加载CryptoJS库
        eval(getCryptoJS())
        //md5加密
        function md5(str) {
            return CryptoJS.MD5(str).toString();
        }

        function color(txt) {
            return '<b><font color=' + '#FF6699' + '>' + txt + '</font></b>'
        }

        function strong(d, c) {
            return '‘‘’’<strong><font color=#' + (c || '000000') + '>' + d + '</font></strong>';
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
                        }
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
            const key = CryptoJS.enc.Utf8.parse("JhbGciOiJIUzI1Ni");
            const iv = CryptoJS.enc.Utf8.parse("JhbGciOiJIUzI1Ni");
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
        var t = Math.floor(Date.now()).toString();
        var t0 = Math.floor(Date.now() / 1000);
        var s = md5(t.toString().substring(3, 8));
        // 随机字符串方法
        function generateRandomHex(length) {
            var result = '';
            var characters = '0123456789abcdef';
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }

        var image = $('').image(() => {
            const CryptoUtil = $.require("hiker://assets/crypto-java.js");
            let decode = function(data) {
                const key = Array.from('2020-zq3-888', c => c.charCodeAt(0));
                const keyLen = key.length;
                const binaryArr = [];
                const len = data.byteLength;
                for (let i = 0; i < len; i++) {
                    let binary = i < 100 ? data[i] ^ key[i % keyLen] : data[i]
                    binaryArr.push(String.fromCharCode(binary));
                }
                return window0.btoa(binaryArr.join(""));
            }
            let textData = CryptoUtil.Data.parseInputStream(input).toUint8Array();
            return CryptoUtil.Data.parseBase64(decode(textData), _base64.NO_WRAP).toInputStream();
        })


        function post(url, body) {
            if (!body) {
                body = '';
            }
            var html = fetch(url, {
                headers: {
                    'aut': getItem('token'),
                    'Content-Type': 'application/json',
                    't': t,
                    's': s,
                    'deviceId': getItem('deviceId'),
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 15; 24031PN0DC Build/AQ3A.240627.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.6723.86 Mobile Safari/537.36;SuiRui/acfan/ver=1.0.2',
                },
                body: body,
                method: body == '' ? 'GET' : 'POST',
            });
            let html1 = JSON.parse(html).encData;
            let html2 = Decrypt(html1);
            return html2
        }

        var vod = $('').lazyRule(() => {
            eval($.require("csdown").rely($.require("csdown").aes))
            var url = getItem('host') + '/api/video/getVideoById?videoId=' + input;
            let data = JSON.parse(post(url));

            if (data.videoUrl) {
                let url1 = getItem('host') + '/api/m3u8/h5/decode?path=' + data.videoUrl;
                return url1
            } else {
                return 'toast://VIP视频，无法获取链接'
            }
        })


        var pic = $('').lazyRule(() => {
            eval($.require("csdown").rely($.require("csdown").aes))
            let url = getItem('host') + '/api/comics/base/chapterInfo?chapterId=' + input;
            let data = JSON.parse(post(url));
            try {
                let img = [];
                for (item of data.imgList) {
                    img.push('http://caoliusp.xka2a.top/z_tupiandaili/caoliusp.php?url=' + getItem('imgDomain') + item + getItem('ppp', ''))
                }
                return "pics://" + img.join("&&")
            } catch {
                return 'toast://看不了';
            }
        })
    }),
    search: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes))
        let pg = getParam('page');
        var 搜索 = [{
            title: '视频&漫画',
            id: '1&2'
        }];
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
            Cate(搜索, '搜索', d);
        }
        let url = getItem('host') + '/api/search/keyWord?pageSize=15&page=' + pg + '&searchWord=' + getMyVar('keyword') + '&searchType=' + getMyVar('搜索', '1');
        let html2 = post(url);
        if (getMyVar('搜索', '1') == 1) {
            try {
                var list = JSON.parse(html2).videoList;
                list.forEach(data => {
                    d.push({
                        title: data.price == 0 ? data.title : ('VIP  ' + data.title),
                        desc: data.createdAt.split('.')[0] + '\t\t' + parseInt(data.playTime / 60) + ':' + parseInt(data.playTime % 60),
                        url: data.videoUrl == '' ? data.videoId + vod : (getItem('host') + '/api/m3u8/h5/decode?path=' + data.videoUrl),
                        img: getItem('imgDomain') + data.coverImg + '_480' + image,
                        col_type: 'movie_2'
                    })
                })
            } catch {}
        } else if (getMyVar('搜索', '1') == 2) {
            try {
                var list = JSON.parse(html2).comicsList;
                list.forEach(data => {
                    d.push({
                        title: data.comicsTitle,
                        url: 'hiker://empty?page=fypage&#immersiveTheme#@rule=js:$.require("csdown").manerji()',
                        img: getItem('imgDomain') + data.coverImg + '_480' + image,
                        col_type: 'movie_3',
                        extra: {
                            id: data.comicsId,
                        }
                    })
                })
            } catch {}
        }
        setResult(d)
    },
    videoerji: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes))
        let id = MY_PARAMS.id
        let pg = getParam('page');
        var url = getItem('host') + '/api/station/getStationMore?stationId=' + id + '&page=' + pg + '&pageSize=12';
        try {
            let html2 = post(url);
            var data = JSON.parse(html2).data;
            data.forEach(data => {
                d.push({
                    title: data.price == 0 ? data.title : ('VIP  ' + data.title),
                    desc: data.createdAt.split('.')[0] + '\t\t' + parseInt(data.playTime / 60) + ':' + parseInt(data.playTime % 60),
                    url: data.videoUrl == '' ? data.videoId + vod : (getItem('host') + '/api/m3u8/h5/decode?path=' + data.videoUrl),
                    img: getItem('imgDomain') + data.coverImg + '_480' + image,
                    col_type: 'movie_2'
                })
            })
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    manerji: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes))
        let id = MY_PARAMS.id;
        var url = getItem('host') + '/api/comics/base/info?comicsId=' + id;
        try {
            let longclick = [{
                title: '修改画质，当前画质：' + getItem('pppn', '原画质'),
                js: $.toString(() => {
                    let option = ['原画质', '720p', '480p', '320p'];
                    let Line = {
                        title: '修改画质',
                        options: option,
                        col: 1,
                        js: $.toString(() => {
                            if (input == '原画质') {
                                var ppp = ''
                            } else if (input == '720p') {
                                var ppp = '_720'
                            } else if (input == '480p') {
                                var ppp = '_480'
                            } else if (input == '320p') {
                                var ppp = '_320'
                            }
                            setItem('pppn', input);
                            setItem('ppp', ppp);
                            toast('若无法显示图片，请切换为原画质')
                            refreshPage(false)
                        })
                    }
                    return 'select://' + JSON.stringify(Line);
                })
            }]
            let html2 = post(url);
            var domain = JSON.parse(html2).domain;
            var data = JSON.parse(html2)
            if (MY_PAGE == 1) {
                d.push({
                    title: data.comicsTitle,
                    desc: data.info,
                    url: domain + data.coverImg + '_480' + image,
                    img: domain + data.coverImg + '_480' + image,
                    col_type: 'movie_1_vertical_pic_blur',
                })
                d.push({
                    title: (getVar('shsort') == '1') ? '““””<b><span style="color: #FF0000">逆序</span></b>' : '““””<b><span style="color: #1aad19">正序</span></b>',
                    url: `@lazyRule=.js:let conf = getVar('shsort');if(conf=='1'){putVar({key:'shsort', value:'0'});}else{putVar({key:'shsort', value:'1'})};refreshPage();'toast://切换排序成功'`,
                    col_type: 'flex_button'
                })
                var chapterList = data.chapterList;
                if (getVar('shsort') == '1') {
                    var chapterList = data.chapterList.reverse();
                }
                d.push({
                    title: '共' + data.chapterNewNum + '话',
                    url: 'hiker://empty',
                    col_type: 'flex_button',
                })
                chapterList.forEach(data => {
                    d.push({
                        title: data.chapterTitle,
                        url: data.chapterId + pic,
                        col_type: 'text_2',
                        extra: {
                            longClick: longclick,
                        }
                    })
                })
            }
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
}
$.exports = csdown

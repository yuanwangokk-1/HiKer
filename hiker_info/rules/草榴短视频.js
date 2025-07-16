const csdown = {
    d: [],
    author: '流苏',
    version: '20250429',
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
                    return 'hiker://empty?page=fypage@rule=js:$.require("csdown").search()'
                }),
                   desc: "请输入搜索关键词",
                   col_type: "input",
                extra: {
                    defaultValue: getMyVar('keyword', ''),
                }
            })
        };
        var pg = getParam('page');
        var 首页 = [{
            title: '推荐&精选&频道&社区&写真',
            id: '1&2&3&4&5',
            img: 'https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/47.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/175.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/78.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/48.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/109.png'
        }];
        if (MY_PAGE == 1) {
            eval(csdown.rely(csdown.aes));
            Cate(首页, '首页', d, 'icon_5');
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
                csdown.recommend()
            } else if (分类 == 2) {
                csdown.jingxuan()
            } else if (分类 == 3) {
                csdown.video()
            } else if (分类 == 4) {
                csdown.topic()
            } else if (分类 == 5) {
                csdown.xiezhen()
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

        function generateRandom(length) {
            var result = '';
            var characters = 'abcdefghijklmnopquvwxyz';
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }

        function post(url, body) {
            if (!body) {
                body = '';
            }
            var html = fetch(url, {
                headers: {
                    'Authorization': getItem('token'),
                    'Content-Type': 'application/json',
                    't': t,
                    's': s,
                    'deviceId': getItem('deviceId'),
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 15; 24031PN0DC Build/AQ3A.240627.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.6723.86 Mobile Safari/537.36;SuiRui/d/ver=5.6.9',
                },
                body: body,
                method: body == '' ? 'GET' : 'POST',
            });
            let html1 = JSON.parse(html).encData;
            let html2 = Decrypt(html1);
            return JSON.parse(html2)
        }

        var vod = $('').lazyRule(() => {
            eval($.require("csdown").rely($.require("csdown").aes));
            var url = getItem('host') + '/api/video/can/watch';
            let data = post(url, '{"videoId":' + input + '}');
            let url1 = getItem('host') + '/api/m3u8/h5/decode?path=' + data.path;
            return url1
        })

        var pic = $('').lazyRule(() => {
            eval($.require("csdown").rely($.require("csdown").aes));
            let url = getItem('host') + '/api/comics/base/chapterInfo?chapterId=' + input;
            let data = JSON.parse(post(url));
            try {
                let domain = data.domain;
                let img = [];
                for (item of data.imgList) {
                    img.push(domain + item + image)
                }
                return "pics://" + img.join("&&")
            } catch {
                return 'toast://看不了';
            }
        })

        var xiezhenpic = $('').lazyRule(() => {
            eval($.require("csdown").rely($.require("csdown").aes));
            let url = getItem('host') + '/api/user/portray/info?portrayId=' + input;
            try {
                let data = post(url).data;
                let domain = post(url).domain;
                let img = [];
                for (item of data) {
                    img.push(domain + item.imgUrl + image)
                }
                return "pics://" + img.join("&&")
            } catch {
                return 'toast://看不了';
            }
        })
    }),
    search: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes));
        let pg = getParam('page');
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
        let url = getItem('host') + '/api/video/queryVideoByTitle?pageSize=30&title=' + getMyVar('keyword') + '&videoType=1';
        try {
            let data = post(url);
            var list = data.list;
            list.forEach(data => {
                d.push({
                    title: data.title,
                    desc: parseInt(data.playTime / 60) + ':' + parseInt(data.playTime % 60) + '\t\t\t\t' + data.createdAt.split('.')[0],
                    url: data.videoId + vod,
                    img: getItem('imgDomain') + data.coverImg[0] + '_480' + image,
                    col_type: 'movie_3'
                })
            })
        } catch {}
        setResult(d)
    },
    recommend: () => {
        var d = csdown.d;
        let pg = getParam('page');
        eval(csdown.rely(csdown.aes));
        try {
            if (MY_PAGE == 1) {
                d.push({
                    title: strong('刷新','FF6699'),
                    url: $('#noLoading#').lazyRule(() => {
                        refreshPage(false)
                        return 'hiker://empty'
                    }),
                    col_type: 'text_center_1',
                    extra: {
                        lineVisible: false
                    }
                })
            }
            let url = getItem('host') + '/api/video/recommendVideo';
            let list = post(url).list;
            list.forEach(data => {
                d.push({
                    title: data.title,
                    desc: parseInt(data.playTime / 60) + ':' + parseInt(data.playTime % 60) + '\t\t\t\t' + data.createdAt.split('.')[0],
                    url: data.videoId + vod,
                    img: getItem('imgDomain') + data.coverImg[0] + '_480' + image,
                    col_type: 'movie_3'
                })
            })
        } catch (e) {
            log(e.message)
            if (getMyVar('a') == '') {
                var host = 'https://jhfkdnov21vfd.gjtxvtzyny.work';
                putMyVar('a', '1')
                setItem('host', host)
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
                        'User-Agent': 'Mozilla/5.0 (Linux; Android 15; 24031PN0DC Build/AQ3A.240627.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.6723.86 Mobile Safari/537.36;SuiRui/d/ver=5.6.9',
                    },
                    body: {
                        "deviceId": getItem('deviceId'),
                        "dad": "49e",
                        "code": ""
                    },
                    method: 'POST',
                }));
                log(token_data)
                let inviteCode = token_data.data.inviteCode;
                let token = token_data.data.token;
                let imgDomain = token_data.data.imgDomain;
                setItem('inviteCode', inviteCode)
                setItem('token', token);
                setItem('imgDomain', imgDomain);
                refreshPage(false)
                toast('域名已更新')
            }
        }
    },
    jingxuan: () => {
        var d = csdown.d;
        let pg = getParam('page');
        eval(csdown.rely(csdown.aes));
        try {
            if (MY_PAGE == 1) {
                let 精选 = [{
                    title: '推荐&V6&网黄',
                    id: '1&2&3',
                }]
                Cate(精选, '精选', d, 'text_3')
                if (getMyVar('精选', '1') == '1') {
                    let hotSpot_url = getItem('host') + '/api/video/hotSpot/list';
                    let hotSpot_data = post(hotSpot_url).list;
                    d.push({
                        title: strong('草榴热点', 'FF6699'),
                        url: 'hiker://empty',
                        col_type: 'text_center_1',
                        extra: {
                            lineVisible: false,
                        }
                    })
                    hotSpot_data.forEach(data => {
                        d.push({
                            title: data.hotspotTitle,
                            desc: '0',
                            img: getItem('imgDomain') + data.coverImg + '_480' + image,
                            url: $('hiker://empty?page=fypage').rule(() => {
                                var d = $.require("csdown").d;
                                eval($.require("csdown").rely($.require("csdown").aes));
                                let id = MY_PARAMS.id;
                                let pg = getParam('page');
                                if (id == 1) {
                                    if (MY_PAGE == 1) {
                                        let 金币 = [{
                                            title: '最新&最热',
                                            id: '1&2'
                                        }]
                                        Cate(金币, '金币', d, 'text_2')
                                    }
                                    let url = getItem('host') + '/api/video/getGoldVideo?pageSize=30&lastId=0&sortBy=' + getMyVar('金币', '1');
                                    let gold = post(url).data;
                                    gold.forEach(data => {
                                        d.push({
                                            title: data.title,
                                            desc: parseInt(data.playTime / 60) + ':' + parseInt(data.playTime % 60) + '\t\t\t\t' + data.createdAt.split('.')[0],
                                            url: data.videoId + vod,
                                            img: getItem('imgDomain') + data.coverImg[0] + '_480' + image,
                                            col_type: 'movie_3'
                                        })
                                    })
                                } else {
                                    let url = getItem('host') + '/api/video/queryNewVideo';
                                    let new_ = post(url).data;
                                    new_.forEach(data => {
                                        d.push({
                                            title: color(data.recommendDate.split('T')[0]),
                                            img: 'hiker://images/icon_right5',
                                            url: $('hiker://empty?page=fypage').rule(() => {
                                                var d = $.require("csdown").d;
                                                eval($.require("csdown").rely($.require("csdown").aes));
                                                let id = MY_PARAMS.id;
                                                let pg = getParam('page');
                                                let url = getItem('host') + '/api/video/queryNewVideoMore?pageSize=30&page=' + pg + '&recommendDate=' + id;
                                                let more = post(url).data;
                                                more.forEach(data => {
                                                    d.push({
                                                        title: data.title,
                                                        desc: parseInt(data.playTime / 60) + ':' + parseInt(data.playTime % 60) + '\t\t\t\t' + data.createdAt.split('.')[0],
                                                        url: data.videoId + vod,
                                                        img: getItem('imgDomain') + data.coverImg[0] + '_480' + image,
                                                        col_type: 'movie_3'
                                                    })
                                                })
                                                setResult(d)
                                            }),
                                            col_type: 'text_icon',
                                            extra: {
                                                id: data.recommendDate,
                                            }
                                        })
                                        let videos = data.videos;
                                        videos.forEach(data => {
                                            d.push({
                                                title: data.title,
                                                desc: parseInt(data.playTime / 60) + ':' + parseInt(data.playTime % 60) + '\t\t\t\t' + data.createdAt.split('.')[0],
                                                url: data.videoId + vod,
                                                img: getItem('imgDomain') + data.coverImg[0] + '_480' + image,
                                                col_type: 'movie_3'
                                            })
                                        })
                                    })
                                }
                                setResult(d)
                            }),
                            col_type: 'card_pic_2',
                            extra: {
                                id: data.hotspotId,
                            }
                        })
                    })
                    d.push({
                        title: strong('精彩合集', 'FF6699'),
                        url: 'hiker://empty',
                        col_type: 'text_center_1',
                        extra: {
                            lineVisible: false,
                        }
                    })
                    let choice_url = getItem('host') + '/api/video/choice/list?choiceType=0';
                    let choice_data = post(choice_url).list;
                    choice_data.forEach(data => {
                        d.push({
                            title: data.choiceTitle,
                            img: getItem('imgDomain') + data.coverImg + '_480' + image,
                            url: 'hiker://empty?page=fypage@rule=js:$.require("csdown").choice()',
                            col_type: 'pic_2_card',
                            extra: {
                                id: data.choiceId,
                            }
                        })
                    })
                }
            }
            if (getMyVar('精选', '1') == '2') {
                let exclusiveList_url = getItem('host') + '/api/video/exclusiveList?pageSize=30&page=' + pg;
                let exclusiveList_data = post(exclusiveList_url).data;
                exclusiveList_data.forEach(data => {
                    d.push({
                        title: color(data.stationName),
                        img: 'hiker://images/icon_right5',
                        url: 'hiker://empty?page=fypage@rule=js:$.require("csdown").exclusive()',
                        col_type: 'text_icon',
                        extra: {
                            id: data.stationId,
                        }
                    })
                    let videos = data.videos;
                    videos.forEach(data => {
                        d.push({
                            title: data.title,
                            desc: parseInt(data.playTime / 60) + ':' + parseInt(data.playTime % 60) + '\t\t\t\t' + data.createdAt.split('.')[0],
                            url: data.videoId + vod,
                            img: getItem('imgDomain') + data.coverImg[0] + '_480' + image,
                            col_type: 'movie_3'
                        })
                    })
                })
            } else if (getMyVar('精选', '1') == 3) {
                let netYellow_url = getItem('host') + '/api/netYellow/allList?page=' + pg + '&pageSize=20';
                let netYellow_data = post(netYellow_url).data;
                netYellow_data.forEach(data => {
                    d.push({
                        title: data.nickName + '\n' + '““””' + (data.worksNum + '部作品 ' + data.portrayNum + '套写真 \n' + data.bu + '粉丝 ' + data.likesNum + '喜欢 ' + data.playNum + '次播放 ').small(),
                        desc: data.personSign,
                        img: getItem('imgDomain') + data.coverImg + '_480' + image,
                        url: 'hiker://empty?page=fypage@rule=js:$.require("csdown").netYellow()',
                        col_type: 'movie_1_vertical_pic',
                        extra: {
                            id: data.userId,
                            title: data.nickName,
                        }
                    })
                })
            }
        } catch (e) {
            log(e.message)
            if (getMyVar('a') == '') {
                var host = 'https://jhfkdnov21vfd.gjtxvtzyny.work';
                putMyVar('a', '1')
                setItem('host', host)
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
                        'User-Agent': 'Mozilla/5.0 (Linux; Android 15; 24031PN0DC Build/AQ3A.240627.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.6723.86 Mobile Safari/537.36;SuiRui/d/ver=5.6.9',
                    },
                    body: {
                        "deviceId": getItem('deviceId'),
                        "dad": "49e",
                        "code": ""
                    },
                    method: 'POST',
                }));
                log(token_data)
                let inviteCode = token_data.data.inviteCode;
                let token = token_data.data.token;
                let imgDomain = token_data.data.imgDomain;
                setItem('inviteCode', inviteCode)
                setItem('token', token);
                setItem('imgDomain', imgDomain);
                refreshPage(false)
                toast('域名已更新')
            }
        }
    },
    exclusive: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes));
        let id = MY_PARAMS.id;
        let pg = getParam('page');
        let url = getItem('host') + '/api/video/exclusiveStationVideo?pageSize=30&page=' + pg + '&stationId=' + id;
        try {
            let data = post(url).data;
            data.forEach(data => {
                d.push({
                    title: data.title,
                    desc: parseInt(data.playTime / 60) + ':' + parseInt(data.playTime % 60) + '\t\t\t\t' + data.createdAt.split('.')[0],
                    url: data.videoId + vod,
                    img: getItem('imgDomain') + data.coverImg[0] + '_480' + image,
                    col_type: 'movie_3'
                })
            })
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    choice: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes));
        let id = MY_PARAMS.id;
        let pg = getParam('page');
        if (MY_PAGE == 1) {
            var 推荐二级分类 = [{
                title: '最新&最热',
                id: '1&2'
            }];
            Cate(推荐二级分类, '推荐二级分类', d, 'text_2');
            let url = getItem('host') + '/api/video/queryVideoByChoice';
            let body = '{"choiceId":' + id + ',"choiceSort":' + getMyVar('推荐二级分类', '1') + ',"hotspotId":0,"hotspotSort":0,"pageSize":100,"videoIds":[]}'
            try {
                let data = post(url, body).list;
                data.forEach(data => {
                    d.push({
                        title: data.title,
                        desc: parseInt(data.playTime / 60) + ':' + parseInt(data.playTime % 60) + '\t\t\t\t' + data.createdAt.split('.')[0],
                        url: data.videoId + vod,
                        img: getItem('imgDomain') + data.coverImg[0] + '_480' + image,
                        col_type: 'movie_3'
                    })
                })
            } catch (e) {
                log(e.message)
            }
        }
        setResult(d)
    },
    netYellow: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes));
        setPageTitle(MY_PARAMS.title)
        let id = MY_PARAMS.id;
        let pg = getParam('page');
        if (MY_PAGE == 1) {
            let 网黄 = [{
                title: '作品&写真',
                id: '1&2',
            }]
            Cate(网黄, '网黄', d, 'text_2')
        }
        if (getMyVar('网黄', '1') == 1) {
            let url = getItem('host') + '/api/video/userWorks?pageSize=30&userId=' + id + '&page=' + pg;
            try {
                let data = post(url).list;
                data.forEach(data => {
                    d.push({
                        title: data.title,
                        desc: parseInt(data.playTime / 60) + ':' + parseInt(data.playTime % 60) + '\t\t\t\t' + data.createdAt.split('.')[0],
                        url: data.videoId + vod,
                        img: getItem('imgDomain') + data.coverImg[0] + '_480' + image,
                        col_type: 'movie_3'
                    })
                })
            } catch (e) {
                log(e.message)
            }
        } else if (getMyVar('网黄', '1') == 2) {
            let url = getItem('host') + '/api/user/portray/user?pageSize=21&userId=' + id + '&page=' + pg;
            try {
                let data = post(url).data;
                data.forEach(data => {
                    d.push({
                        title: data.title,
                        desc: '共' + data.imgNums + '张',
                        url: data.portrayId + xiezhenpic,
                        img: getItem('imgDomain') + data.coverImg + '_480' + image,
                        col_type: 'movie_3'
                    })
                })
            } catch (e) {
                log(e.message)
            }
        }
        setResult(d)
    },
    video: () => {
        var d = csdown.d;
        let pg = getParam('page');
        eval(csdown.rely(csdown.aes));
        try {
            if (MY_PAGE == 1) {
                if (!storage0.getItem('classify_')) {
                    let classify = getItem('host') + '/api/st/getStClassify';
                    let item = post(classify).data;
                    storage0.setItem('classify_', item);
                    storage0.setItem('classify_0', item);
                    classify = getItem('host') + '/api/av/classify/getProhibitClassifyList';
                    item = post(classify).data;
                    item.forEach(data => {
                        data.classifyId = '3' + data.classifyId.toString()
                    });
                    storage0.setItem('classify_1', item);
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
                                    log(classify)
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
                        title: getMyVar('classify', getMyVar('index_classify')) == data.classifyId + '' ? strong(data.title, 'FF6699') : data.title,
                        url: $('#noLoading#').lazyRule((title, id) => {
                            putMyVar('classify', id);
                            refreshPage(false);
                            return 'hiker://empty';
                        }, data.title, data.classifyId + ''),
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
            let Arr_0 = ['10', '11', '12', '14'];
            let Arr_1 = ['31', '32', '33', '34'];
            if (Arr_0.includes(getMyVar('classify', getMyVar('index_classify')))) {
                let url = getItem('host') + '/api/st/getStStations?classifyId=' + getMyVar('classify', getMyVar('index_classify'));
                let list = post(url).data;
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
                    var items = data.videoList;
                    items.forEach(data => {
                        d.push({
                            title: data.title,
                            desc: data.createdAt.split('.')[0] + '\t\t\t\t' + parseInt(data.playTime / 60) + ':' + parseInt(data.playTime % 60),
                            url: data.videoUrl != '' ? getItem('host') + '/api/m3u8/h5/decode?path=' + data.videoUrl : data.videoId + vod,
                            img: getItem('imgDomain') + data.coverImg[0] + '_480' + image,
                            col_type: 'movie_2'

                        })
                    })
                })
            } else if (Arr_1.includes(getMyVar('classify', getMyVar('index_classify')))) {
                let tags_url = getItem('host') + '/api/av/classify/getProhibitTagsList?classifyId=' + getMyVar('classify', getMyVar('index_classify')).replace('3', '');
                let tags = post(tags_url).data;
                tags.forEach(data => {
                    d.push({
                        title: data.tagsTitle,
                        url: $('hiker://empty?page=fypage').rule(() => {
                            var d = $.require("csdown").d;
                            eval($.require("csdown").rely($.require("csdown").aes));
                            let id = MY_PARAMS.id;
                            let title = MY_PARAMS.title;
                            let pg = getParam('page');
                            let url = getItem('host') + '/api/video/prohibitTagsVideoList?page=' + pg + '&pageSize=20&classifyId=' + id + '&tagTitle=' + title;
                            let list = post(url).list;
                            list.forEach(data => {
                                d.push({
                                    title: data.title,
                                    desc: data.createdAt.split('.')[0] + '\t\t\t\t' + parseInt(data.playTime / 60) + ':' + parseInt(data.playTime % 60),
                                    url: data.videoUrl != '' ? getItem('host') + '/api/m3u8/h5/decode?path=' + data.videoUrl : data.videoId + vod,
                                    img: getItem('imgDomain') + data.coverImg[0] + '_480' + image,
                                    col_type: 'movie_2'

                                })
                            })
                            setResult(d)
                        }),
                        col_type: 'text_4',
                        extra: {
                            title: data.tagsTitle,
                            id: getMyVar('classify', getMyVar('index_classify')).replace('3', ''),
                        }
                    })
                })
                d.push({
                    col_type: 'blank_block',
                })
                let url = getItem('host') + '/api/video/prohibitTagsVideoList?page=' + pg + '&classifyId=' + getMyVar('classify', getMyVar('index_classify')).replace('3', '');
                let list = post(url).list;
                list.forEach(data => {
                    d.push({
                        title: data.title,
                        desc: data.createdAt.split('.')[0] + '\t\t\t\t' + parseInt(data.playTime / 60) + ':' + parseInt(data.playTime % 60),
                        url: data.videoUrl != '' ? getItem('host') + '/api/m3u8/h5/decode?path=' + data.videoUrl : data.videoId + vod,
                        img: getItem('imgDomain') + data.coverImg[0] + '_480' + image,
                        col_type: 'movie_2'

                    })
                })
            } else {
                let url = getItem('host') + '/api/st/getStClassifyVideo?pageSize=20&page=' + pg + '&classifyId=' + getMyVar('classify', getMyVar('index_classify'));
                let list = post(url).data;
                list.forEach(data => {
                    d.push({
                        title: data.title,
                        desc: data.createdAt.split('.')[0] + '\t\t\t\t' + parseInt(data.playTime / 60) + ':' + parseInt(data.playTime % 60),
                        url: data.videoUrl != '' ? getItem('host') + '/api/m3u8/h5/decode?path=' + data.videoUrl : data.videoId + vod,
                        img: getItem('imgDomain') + data.coverImg[0] + '_480' + image,
                        col_type: 'movie_2'

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
        let id = MY_PARAMS.id;
        let tag = MY_PARAMS.tag;
        let pg = getParam('page');
        let url = getItem('host') + '/api/st/getStStationMore?stationId=' + id + '&lastId=0&pageSize=30';
        try {
            let data = post(url).data;
            data.forEach(data => {
                d.push({
                    title: data.title,
                    desc: data.createdAt.split('.')[0] + '\t\t\t\t' + parseInt(data.playTime / 60) + ':' + parseInt(data.playTime % 60),
                    url: data.videoUrl != '' ? getItem('host') + '/api/m3u8/h5/decode?path=' + data.videoUrl : data.videoId + vod,
                    img: getItem('imgDomain') + data.coverImg[0] + '_480' + image,
                    col_type: 'movie_2'

                })
            })
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    topic: () => {
        var d = csdown.d;
        let pg = getParam('page');
        eval(csdown.rely(csdown.aes));
        try {
            if (MY_PAGE == 1) {
                var 社区分类 = [{
                    title: '精选&广场',
                    id: '2&0'
                }];
                Cate(社区分类, '社区分类', d, 'text_2');
                if (!storage0.getItem('topic_')) {
                    let url = getItem('host') + '/api/community/topic/indexList';
                    let topic = post(url).data;
                    storage0.setItem('topic_', topic)
                }
                storage0.getItem('topic_').forEach(data => {
                    d.push({
                        title: data.topicName,
                        img: data.topicLogo == null ? getItem('imgDomain') + 'image/o5/gj/zk/eo/250fd5aace414574943cdb4cd83bba25.png_480' + image : getItem('imgDomain') + data.topicLogo + '_480' + image,
                        url: $('hiker://empty?page=fypage').rule(() => {
                            var d = $.require("csdown").d;
                            eval($.require("csdown").rely($.require("csdown").aes));
                            let id = MY_PARAMS.id;
                            let pg = getParam('page');
                            let url = getItem('host') + '/api/meet/bar/dynamic/list/v2?topicId=' + id + '&page=' + pg + '&pageSize=10';
                            let topic = post(url).data;
                            topic.forEach(data => {
                                d.push({
                                    title: data.nickName,
                                    desc: data.createdAt.split('T')[0],
                                    img: data.logo == null ? getItem('imgDomain') + 'image/o5/gj/zk/eo/250fd5aace414574943cdb4cd83bba25.png_480' + image : getItem('imgDomain') + data.logo + '_480' + image,
                                    url: 'hiker://empty?page=fypage@rule=js:$.require("csdown").uperji()',
                                    col_type: 'avatar',
                                    extra: {
                                        id: data.userId,
                                    }
                                }, {
                                    title: data.content,
                                    url: 'hiker://empty@rule=js:$.require("csdown").topicerji()',
                                    col_type: 'text_1',
                                    extra: {
                                        lineVisible: false,
                                        id: data.dynamicId,
                                    },
                                })
                                try {
                                    var img = data.dynamicImg;
                                    img.forEach(data => {
                                        d.push({
                                            url: getItem('imgDomain') + data + '_480' + image,
                                            img: getItem('imgDomain') + data + '_480' + image,
                                            col_type: 'movie_3'
                                        })
                                    })
                                } catch {}
                                if (data.video) {
                                    d.push({
                                        title: '视频长:' + parseInt(data.video.playTime / 60) + ':' + parseInt(data.video.playTime % 60),
                                        desc: '0',
                                        img: getItem('imgDomain') + data.video.coverImg[0] + '_480' + image,
                                        url: getItem('host') + '/api/m3u8/h5/decode?path=' + data.video.videoUrl,
                                        col_type: 'card_pic_1',
                                        extra: {
                                            id: data.dynamicId,
                                        }
                                    })
                                }
                            })
                            setResult(d)
                        }),
                        col_type: 'card_pic_3_center',
                        extra: {
                            id: data.topicId,
                        }
                    })
                })
            }
            let url = getItem('host') + '/api/meet/bar/dynamic/list/v2?loadType=' + getMyVar('社区分类', '2') + '&page=' + pg + '&pageSize=15';
            let list = post(url).data;
            list.forEach(data => {
                d.push({
                    title: data.nickName,
                    desc: data.createdAt.split('T')[0],
                    img: data.logo == null ? getItem('imgDomain') + 'image/o5/gj/zk/eo/250fd5aace414574943cdb4cd83bba25.png_480' + image : getItem('imgDomain') + data.logo + '_480' + image,
                    url: 'hiker://empty?page=fypage@rule=js:$.require("csdown").uperji()',
                    col_type: 'avatar',
                    extra: {
                        id: data.userId,
                    }
                }, {
                    title: data.content,
                    url: 'hiker://empty@rule=js:$.require("csdown").topicerji()',
                    col_type: 'text_1',
                    extra: {
                        lineVisible: false,
                        id: data.dynamicId,
                    },
                })
                try {
                    var img = data.dynamicImg;
                    img.forEach(data => {
                        d.push({
                            url: getItem('imgDomain') + data + '_480' + image,
                            img: getItem('imgDomain') + data + '_480' + image,
                            col_type: 'movie_3'
                        })
                    })
                } catch {}
                if (data.video) {
                    d.push({
                        title: '视频长:' + parseInt(data.video.playTime / 60) + ':' + parseInt(data.video.playTime % 60),
                        desc: '0',
                        img: getItem('imgDomain') + data.video.coverImg[0] + '_480' + image,
                        url: getItem('host') + '/api/m3u8/h5/decode?path=' + data.video.videoUrl,
                        col_type: 'card_pic_1',
                        extra: {
                            id: data.dynamicId,
                        }
                    })
                }
            })
        } catch (e) {
            log(e.message)
        }
    },
    topicerji: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes));
        let id = MY_PARAMS.id;
        let url = getItem('host') + '/api/meet/bar/dynamic/getDynamicInfo?dynamicId=' + id;
        try {
            let data = post(url).data[0];
            d.push({
                title: data.nickName,
                desc: data.createdAt.split('T')[0],
                img: data.logo == null ? getItem('imgDomain') + 'image/o5/gj/zk/eo/250fd5aace414574943cdb4cd83bba25.png_480' + image : getItem('imgDomain') + data.logo + '_480' + image,
                url: 'hiker://empty?page=fypage@rule=js:$.require("csdown").uperji()',
                col_type: 'avatar',
                extra: {
                    id: data.userId,
                }
            }, {
                title: data.content,
                url: 'hiker://empty',
                col_type: 'rich_text',
                extra: {
                    lineVisible: false,
                    id: data.dynamicId,
                },
            })
            if (data.video) {
                d.push({
                    title: '视频长:' + parseInt(data.video.playTime / 60) + ':' + parseInt(data.video.playTime % 60),
                    desc: '0',
                    img: getItem('imgDomain') + data.video.coverImg[0] + '_480' + image,
                    url: getItem('host') + '/api/m3u8/h5/decode?path=' + data.video.videoUrl,
                    col_type: 'card_pic_1',
                    extra: {
                        id: data.dynamicId,
                    }
                })
            }
            try {
                var img = data.dynamicImg;
                img.forEach(data => {
                    d.push({
                        url: getItem('imgDomain') + data + image,
                        img: getItem('imgDomain') + data + image,
                        col_type: 'pic_1_full'
                    })
                })
            } catch {}
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    uperji: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes));
        let id = MY_PARAMS.id;
        let pg = getParam('page');
        let url = getItem('host') + '/api/community/dynamic/person/list?userId=' + id + '&type=0&page=' + pg + '&pageSize=10';
        try {
            if (MY_PAGE == 1) {
                let up = [{
                    title: '动态&作品&写真',
                    id: '1&2&3',
                }]
                Cate(up, 'up', d, 'text_3')
            }
            if (getMyVar('up', '1') == 1) {
                let url = getItem('host') + '/api/meet/bar/dynamic/person/list?userId=' + id + '&page=' + pg + '&pageSize=10';
                let list = post(url).data;
                list.forEach(data => {
                    d.push({
                        title: data.nickName,
                        desc: data.createdAt.split('T')[0],
                        img: data.logo == null ? getItem('imgDomain') + 'image/o5/gj/zk/eo/250fd5aace414574943cdb4cd83bba25.png_480' + image : getItem('imgDomain') + data.logo + '_480' + image,
                        url: 'hiker://empty?page=fypage@rule=js:$.require("csdown").uperji()',
                        col_type: 'avatar',
                        extra: {
                            id: data.userId,
                        }
                    }, {
                        title: data.content,
                        url: 'hiker://empty@rule=js:$.require("csdown").topicerji()',
                        col_type: 'text_1',
                        extra: {
                            lineVisible: false,
                            id: data.dynamicId,
                        },
                    })
                    try {
                        var img = data.dynamicImg;
                        img.forEach(data => {
                            d.push({
                                url: getItem('imgDomain') + data + '_480' + image,
                                img: getItem('imgDomain') + data + '_480' + image,
                                col_type: 'movie_3'
                            })
                        })
                    } catch {}
                    if (data.video) {
                        d.push({
                            title: '视频长:' + parseInt(data.video.playTime / 60) + ':' + parseInt(data.video.playTime % 60),
                            desc: '0',
                            img: getItem('imgDomain') + data.video.coverImg[0] + '_480' + image,
                            url: getItem('host') + '/api/m3u8/h5/decode?path=' + data.video.videoUrl,
                            col_type: 'card_pic_1',
                            extra: {
                                id: data.dynamicId,
                            }
                        })
                    }
                })
            } else if (getMyVar('up', '1') == 2) {
                let url = getItem('host') + '/api/video/userWorks?pageSize=30&userId=' + id + '&page=' + pg;
                try {
                    let data = post(url).list;
                    data.forEach(data => {
                        d.push({
                            title: data.title,
                            desc: parseInt(data.playTime / 60) + ':' + parseInt(data.playTime % 60) + '\t\t\t\t' + data.createdAt.split('.')[0],
                            url: data.videoId + vod,
                            img: getItem('imgDomain') + data.coverImg[0] + '_480' + image,
                            col_type: 'movie_3'
                        })
                    })
                } catch (e) {
                    log(e.message)
                }
            } else if (getMyVar('up', '1') == 3) {
                let url = getItem('host') + '/api/user/portray/user?pageSize=21&userId=' + id + '&page=' + pg;
                try {
                    let data = post(url).data;
                    data.forEach(data => {
                        d.push({
                            title: data.title,
                            desc: '共' + data.imgNums + '张',
                            url: data.portrayId + xiezhenpic,
                            img: getItem('imgDomain') + data.coverImg + '_480' + image,
                            col_type: 'movie_3'
                        })
                    })
                } catch (e) {
                    log(e.message)
                }
            }
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    xiezhen: () => {
        var d = csdown.d;
        let pg = getParam('page');
        eval(csdown.rely(csdown.aes));
        let url = getItem('host') + '/api/featuredPortray/stationPortrayList';
        let list = post(url).data;
        list.forEach(data => {
            d.push({
                title: color(data.stationName),
                url: $('hiker://empty?page=fypage').rule(() => {
                    var d = $.require("csdown").d;
                    eval($.require("csdown").rely($.require("csdown").aes));
                    setPageTitle(MY_PARAMS.title)
                    let id = MY_PARAMS.id;
                    let pg = getParam('page');
                    let url = getItem('host') + '/api/featuredPortray/stationPortrayMore?pageSize=30&page=' + pg + '&stationId=' + id;
                    try {
                        let data = post(url).data;
                        data.forEach(data => {
                            d.push({
                                title: data.title,
                                desc: '共' + data.imgNums + '张',
                                url: data.portrayId + xiezhenpic,
                                img: getItem('imgDomain') + data.coverImg + '_480' + image,
                                col_type: 'movie_3'
                            })
                        })
                    } catch (e) {
                        log(e.message)
                    }
                    setResult(d)
                }),
                img: 'hiker://images/icon_right5',
                col_type: 'text_icon',
                extra: {
                    id: data.stationId,
                    title: data.stationName,
                }
            })
            data.stationPortrayList.forEach(data => {
                d.push({
                    title: data.title,
                    desc: '共' + data.imgNums + '张',
                    url: data.portrayId + xiezhenpic,
                    img: getItem('imgDomain') + data.coverImg + '_480' + image,
                    col_type: 'movie_3'
                })
            })
        })
    },
}
$.exports = csdown

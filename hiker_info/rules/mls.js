const mls = {
    d: [],
    version: '20250402',
    author: '流苏',
    rely: (data) => {
        return data.match(/\{([\s\S]*)\}/)[0].replace(/\{([\s\S]*)\}/, '$1')
    },
    home: () => {
        var d = mls.d;
        var pg = MY_URL.replace('hiker://empty##', '');
        eval(mls.rely(mls.aes))
        if (getItem('up' + mls.version, '') == '') {
            confirm({
                title: '更新内容',
                content: '版本号：' + mls.version + '\n1.修正部分参数获取方式\n2.修复部分bug',
                confirm: $.toString((version) => {
                    setItem('up' + version, '1')
                }, mls.version),
                cancel: $.toString(() => {})
            })
        }
        try {
            var 视频 = [{
                title: '推荐&最新&原创自制&免费&热门福利姬&诱惑小萝莉&网络热门专区&cosplay&乱伦偷情&伪娘百合同性&欧美少女&日韩',
                id: '1&32&34&43&2&4&15&3&27&24&14&20&38'
            }];

            if (MY_PAGE == 1) {
                Cate(视频, '视频', d);
            }
            if ((getMyVar('视频', '1') == 32) | (getMyVar('视频', '1') == 43)) {
                var 视频分类 = [{
                    title: '最新&热门&逛逛&排行',
                    id: '1&2&3&4'
                }];

                if (MY_PAGE == 1) {
                    Cate(视频分类, '视频分类', d);
                }
                var url = getItem('host') + '/api/video/classify/getClassifyVideos?pageSize=30&page=' + pg + '&classifyId=' + getMyVar('视频', '1') + '&sortNum=' + getMyVar('视频分类', '1');
                let html2 = post(url);
                var list = JSON.parse(html2).data;
                var domain = JSON.parse(html2).domain;
                list.forEach(data => {
                    d.push({
                        title: data.price == 0 ? data.title : ('VIP  ' + data.title),
                        desc: data.createdAt.split('.')[0] + '\t\t\t\t' + parseInt(data.playTime / 60) + ':' + parseInt(data.playTime % 60),
                        url: data.price == 0 ? (data.videoId + vod1) : (data.videoId + vod),
                        img: 'http://caoliusp.xka2a.top/z_tupiandaili/caoliusp.php?url=' + domain + data.coverImg[0],
                        col_type: 'movie_2'
                    })
                })
            } else {
                var url = getItem('host') + '/api/video/getStations?classifyId=' + getMyVar('视频', '1');
                let html2 = post(url);
                var list = JSON.parse(html2).data;
                var domain = JSON.parse(html2).domain;
                list.forEach(data => {
                    d.push({
                        title: color(data.stationName),
                        img: 'hiker://images/icon_right5',
                        url: 'hiker://empty?page=fypage@rule=js:$.require("mls").videoerji()',
                        col_type: 'text_icon',
                        extra: {
                            id: data.stationId,
                        }
                    })
                    try {
                        var items = data.videoList;
                        items.forEach(data => {
                            // if(data.price==0){
                            d.push({
                                title: data.price == 0 ? data.title : ('VIP  ' + data.title),
                                desc: data.createdAt.split('.')[0] + '\t\t\t\t' + parseInt(data.playTime / 60) + ':' + parseInt(data.playTime % 60),
                                url: data.price == 0 ? (data.videoId + vod1) : (data.videoId + vod),
                                img: 'http://caoliusp.xka2a.top/z_tupiandaili/caoliusp.php?url=' + domain + data.coverImg[0],
                                col_type: 'movie_2'

                            })
                            //  }
                        })
                    } catch {}
                    if (data.stationName == '排行榜') {
                        try {
                            var hotRank = data.hotRank;
                            var watchRank = data.watchRank;
                            var collectionRank = data.collectionRank;
                            d.push({
                                title: color('热门榜单'),
                                col_type: 'rich_text',
                            })
                            hotRank.forEach(data => {
                                d.push({
                                    title: data.price == 0 ? data.title : ('VIP  ' + data.title),
                                    desc: parseInt(data.playTime / 60) + ':' + parseInt(data.playTime % 60),
                                    url: data.price == 0 ? (data.videoId + vod1) : (data.videoId + vod),
                                    img: 'http://caoliusp.xka2a.top/z_tupiandaili/caoliusp.php?url=' + domain + data.coverImg[0],
                                    col_type: 'movie_2'
                                })
                            })
                            d.push({
                                title: color('热播榜单'),
                                col_type: 'rich_text',
                            })
                            watchRank.forEach(data => {
                                d.push({
                                    title: data.price == 0 ? data.title : ('VIP  ' + data.title),
                                    desc: parseInt(data.playTime / 60) + ':' + parseInt(data.playTime % 60),
                                    url: data.price == 0 ? (data.videoId + vod1) : (data.videoId + vod),
                                    img: 'http://caoliusp.xka2a.top/z_tupiandaili/caoliusp.php?url=' + domain + data.coverImg[0],
                                    col_type: 'movie_2'
                                })
                            })
                            d.push({
                                title: color('收藏榜单'),
                                col_type: 'rich_text',
                            })
                            collectionRank.forEach(data => {
                                d.push({
                                    title: data.price == 0 ? data.title : ('VIP  ' + data.title),
                                    desc: parseInt(data.playTime / 60) + ':' + parseInt(data.playTime % 60),
                                    url: data.price == 0 ? (data.videoId + vod1) : (data.videoId + vod),
                                    img: 'http://caoliusp.xka2a.top/z_tupiandaili/caoliusp.php?url=' + domain + data.coverImg[0],
                                    col_type: 'movie_2'
                                })
                            })
                        } catch (e) {
                            log(e.message)
                        }
                    }
                    try {
                        var mainVideo = data.listMainVideoResp.mainVideo;
                        var list1 = data.listMainVideoResp.list;
                        mainVideo.forEach(data => {
                            d.push({
                                title: (data.price == 0 ? data.title : ('VIP  ' + data.title)) + '   ' + data.createdAt.split('.')[0] + '\t\t\t\t' + parseInt(data.playTime / 60) + ':' + parseInt(data.playTime % 60),
                                desc: '0',
                                url: data.price == 0 ? (data.videoId + vod1) : (data.videoId + vod),
                                img: 'http://caoliusp.xka2a.top/z_tupiandaili/caoliusp.php?url=' + domain + data.coverImg[0],
                                col_type: 'card_pic_1'
                            })
                        })
                        list1.forEach(data => {
                            d.push({
                                title: data.price == 0 ? data.title : ('VIP  ' + data.title),
                                desc: data.createdAt.split('.')[0] + '\t\t\t\t' + parseInt(data.playTime / 60) + ':' + parseInt(data.playTime % 60),
                                url: data.price == 0 ? (data.videoId + vod1) : (data.videoId + vod),
                                img: 'http://caoliusp.xka2a.top/z_tupiandaili/caoliusp.php?url=' + domain + data.coverImg[0],
                                col_type: 'movie_2'
                            })
                        })
                    } catch {}
                })
            }
        } catch (e) {
            log(e.message)
            if (getMyVar('a') == '') {
                let host = 'https://jhfkdnov21vfd.cosnjnmaea.shop';
                putMyVar('a', '1')
                setItem('host', host)
                let token_url = getItem('host') + '/api/user/traveler';
                let token_data = JSON.parse(fetch(token_url, {
                    headers: {
                        'Content-Type': 'application/json',
                        't': t,
                        's': s,
                        'deviceId': deviceId,
                        'User-Agent': 'Mozilla/5.0 (Linux; Android 14; 22081212C Build/UKQ1.230917.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/118.0.0.0 Mobile Safari/537.36;SuiRui/mh/ver=1.7.8'
                    },
                    body: {
                        "deviceId": deviceId,
                        "dew": "K",
                        "code": ""
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

        function Cate(list, n, d, col) {
            if (!col) {
                col = 'scroll_button';
            }
            var index_n = list[0].id.split('&')[0];
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
                        }, n, title, id[index]),
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

        // 调用方法生成随机字符串
        var deviceId = generateRandomHex(32);

        function post(url) {
            var html = fetch(url, {
                headers: {
                    'Authorization': getItem('token'),
                    'Content-Type': 'application/json',
                    't': t,
                    's': s,
                    'deviceId': deviceId,
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 14; 22081212C Build/UKQ1.230917.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/118.0.0.0 Mobile Safari/537.36;SuiRui/mh/ver=1.7.8'
                },
                method: 'GET'
            });
            let html1 = JSON.parse(html).encData;
            let html2 = Decrypt(html1);
            return html2
        }

        var vod = $('').lazyRule(() => {
            eval($.require('mls').rely($.require('mls').aes))
            let url = getItem('host') + '/api/video/getVideoById?videoId=' + input;
            let data = JSON.parse(post(url));
            if (getMyVar('authkey') == '') {
                let authkey = fetch('https://vpn4.lovebabyforever.workers.dev', {
                    timeout: 2500,
                })
                putMyVar('authkey', authkey)
            }
            if (getMyVar('authkey')) {
                let url1 = getItem('host') + '/api/m3u8/decode/authPath?auth_key=' + getMyVar('authkey').replace(/\"/g, '') + '&path=' + data.videoUrl;
                //let url1 = getItem('host') + '/api/m3u8/decode/authPath?auth_key=' + data.authKey + '&path=' + data.videoUrl;
                return url1
            } else {
                return 'toast://请连接代理后重试'
            }
        })
        var vod1 = $('').lazyRule(() => {
            eval($.require('mls').rely($.require('mls').aes))
            let url = getItem('host') + '/api/video/getVideoById?videoId=' + input;
            let data = JSON.parse(post(url));
            let url1 = getItem('host') + '/api/m3u8/decode/authPath?auth_key=' + data.authKey + '&path=' + data.videoUrl;
            return url1
        })

        var pic = $('').lazyRule(() => {
            eval($.require('mls').rely($.require('mls').aes))
            let url = getItem('host') + '/api/comics/base/chapterInfo?chapterId=' + input;
            let data = JSON.parse(post(url));
            try {
                let domain = data.domain;
                let img = data.imgList;
                let len = img.length - 1;
                let picArr = [];
                for (i = 0; i <= len; i++) {
                    picArr[i] = 'http://caoliusp.xka2a.top/z_tupiandaili/caoliusp.php?url=' + domain + img[i];
                }
                return "pics://" + picArr.join("&&")
            } catch {
                return 'toast://看不了';
            }
        })
    }),
    videoerji: () => {
        var d = mls.d;
        eval(mls.rely(mls.aes))
        let id = MY_PARAMS.id;
        let pg = getParam('page');
        var 视频二级 = [{
            title: '最近更新&最多观看&最多收藏',
            id: '1&2&3'
        }];

        if (MY_PAGE == 1) {
            Cate(视频二级, '视频二级', d);
        }
        var url = getItem('host') + '/api/video/getStationMore?pageSize=20&page=' + pg + '&sortType=' + getMyVar('视频二级', '1') + '&stationId=' + id;
        let html2 = post(url);
        try {
            var domain = JSON.parse(html2).domain;
            var data = JSON.parse(html2).data;
            data.forEach(data => {
                d.push({
                    title: data.price == 0 ? data.title : ('VIP  ' + data.title),
                    desc: data.createdAt.split('.')[0] + '\t\t\t\t' + parseInt(data.playTime / 60) + ':' + parseInt(data.playTime % 60),
                    url: data.price == 0 ? (data.videoId + vod1) : (data.videoId + vod),
                    img: 'http://caoliusp.xka2a.top/z_tupiandaili/caoliusp.php?url=' + domain + data.coverImg[0],
                    col_type: 'movie_2'
                })
            })
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    }
}
$.exports = mls

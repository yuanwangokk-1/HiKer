const csdown = {
    d: [],
    author: '流苏&Timik',
    version: '20250513',
    rely: (data) => {
        return data.match(/\{([\s\S]*)\}/)[0].replace(/\{([\s\S]*)\}/, '$1')
    },
    home: () => {
        //地址:https://douyin116.xyz/
        //主uid=6299321
        //备用uid=6299614
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
        let 首页 = [{
            title: '视频&抖音',
            id: '1&2&3&4&5',
            img: 'https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/47.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/175.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/78.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/48.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/109.png'
        }];
        if (MY_PAGE == 1) {
            eval(csdown.rely(csdown.aes));
            Cate(首页, '首页', d, 'icon_2_round');
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
                csdown.mini()
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
        var t = Math.floor(Date.now());
        //生成随机uuid
        function generateUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0;
                var v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
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

        function timestampToTime(tm, ts) {
            undefined
            let date = new Date(tm * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            let Y = date.getFullYear() + '-';
            let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            let D = date.getDate();
            let h = ' | ' + date.getHours() + ':';
            let m = date.getMinutes();
            if (m < 10) m = '0' + m;
            m = m + ':'
            let s = date.getSeconds();
            if (s < 10) s = '0' + s;
            if (ts == 0) return Y + M + D;
            if (ts == 1) return Y + M + D + h + m + s;
        }

        var image = $('').image(() => {
            const CryptoUtil = $.require("hiker://assets/crypto-java.js");
            let decode = function(data) {
                let key = 88;
                const binaryArr = [];
                let bytes = data;
                let len = bytes.byteLength;
                for (let i = 0; i < len; i++) {
                    let binary = data[i] ^ key;
                    binaryArr.push(String.fromCharCode(binary));
                }
                return window0.btoa(binaryArr.join(""));
            }
            let textData = CryptoUtil.Data.parseInputStream(input).toUint8Array();
            let base64Text = decode(textData);
            let encrypted0 = CryptoUtil.Data.parseBase64(base64Text, _base64.NO_WRAP);
            return encrypted0.toInputStream();
        })


        // 加密函数
        function Encrypt(plaintext) {
            const key = CryptoJS.enc.Utf8.parse("qrRCjxruBaInnSFv");
            const iv = CryptoJS.enc.Utf8.parse("S58LowsUeDkyX4KT");
            var encrypted = CryptoJS.AES.encrypt(plaintext, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            var ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
            return ciphertext;
        }

        // 解密函数
        function Decrypt(word) {
            const key = CryptoJS.enc.Utf8.parse("qrRCjxruBaInnSFv");
            const iv = CryptoJS.enc.Utf8.parse("S58LowsUeDkyX4KT");
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

        function post(url, body) {
            body = Encrypt(body);
            let html = fetch(url, {
                headers: {
                    'api-token': getItem('token'),
                },
                body: {
                    data: body
                },
                method: 'POST',
            });
            let html1 = JSON.parse(html).data;
            let html2 = Decrypt(html1);
            return JSON.parse(html2)
        }
    }),
    video: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes));
        var pg = getParam('page');
        try {
            if (!getMyVar('info', '')) {
                let url = getItem('host') + '/api/v1/member/info?t=' + t;
                let body = '{"timestamp":' + t + ',"version":"0.1.0","os":"h5","uid":' + getItem('uid') + ',"token":"' + getItem('token') + '"}';
                let data = post(url, body);
                let uid = data.uid + '';
                let token = data.token;
                setItem('uid', uid);
                setItem('token', token);
                putMyVar('info', '1');
            }
            if (MY_PAGE == 1) {
                //加载分类
                if (!storage0.getItem('cate_')) {
                    let url = getItem('host') + '/api/v2/video/navigation/bar';
                    let body = '{"timestamp":' + t + ',"version":"0.1.0","os":"h5"}';
                    let data = post(url, body);
                    storage0.setItem('cate_', data);
                }
                let index_n = storage0.getItem('cate_')[0].id + '';
                putMyVar('index_cate', index_n)
                storage0.getItem('cate_').forEach(data => {
                    d.push({
                        title: getMyVar('cate', getMyVar('index_cate')) == data.id + '' ? strong(data.name, 'FF6699') : data.name,
                        url: $('#noLoading#').lazyRule((title, id) => {
                            putMyVar('cate', id);
                            refreshPage(false);
                            return 'hiker://empty';
                        }, data.name, data.id + ''),
                        col_type: 'scroll_button',
                        extra: {
                            id: data.id,
                            longClick: [],
                        }
                    })
                })
                d.push({
                    col_type: 'blank_block'
                })
                let 视频分类 = [{
                    title: '最近更新&本周最热&最多观看&最多评论',
                    id: '2&1&3&4'
                }];
                Cate(视频分类, '视频分类', d);
                let video_cate_url = getItem('host') + '/api/v2/video/navigation/all';
                let video_cate_body = '{"timestamp":' + t + ',"version":"0.1.0","os":"h5","nid":' + getMyVar('cate', getMyVar('index_cate')) + '}';
                let video_cate_data = post(video_cate_url, video_cate_body);
                let video_cate_list = video_cate_data.video_category;
                video_cate_list.forEach(data => {
                    d.push({
                        title: data.name,
                        url: 'hiker://empty?page=fypage@rule=js:$.require("csdown").videoerji()',
                        col_type: 'text_4',
                        extra: {
                            id: data.nid,
                        }
                    })
                })
                d.push({
                    col_type: 'blank_block'
                })
            }
            let url = getItem('host') + '/api/v2/video/navigation/video';
            let body = '{"timestamp":' + t + ',"version":"0.1.0","os":"h5","page":' + pg + ',"page_size":20,"nid":' + getMyVar('cate', getMyVar('index_cate')) + ',"type":' + getMyVar('视频分类', '2') + '}';
            let list = post(url, body).list;
            list.forEach(data => {
                d.push({
                    title: data.title,
                    desc: timestampToTime(data.created_at, 1) + '\t\t\t' + parseInt(data.video_length / 60) + ':' + parseInt(data.video_length % 60),
                    img: data.horizontal_cover + image,
                    url: getItem('host') + '/api/v2/video/player.m3u8?vid=' + data.id + '&uid=6299321',
                    col_type: 'movie_2',
                    extra: {
                        id: data.id,
                    }
                })
            })
        } catch (e) {
            log(e.message)
            if (getMyVar('a') == '') {
                let host = 'https://mzyapi.diao.it';
                putMyVar('a', '1')
                setItem('host', host)
                // 调用方法生成随机字符串
                let uuid = generateUUID();
                let token_url = getItem('host') + '/api/v1/member/guest/login';
                let token_body = '{"timestamp":' + t + ',"version":"0.1.0","os":"h5","devid":"' + uuid + '","invite":"","user_invite":""}'
                let token_data = JSON.parse(fetch(token_url, {
                    headers: {},
                    body: {
                        data: token_body
                    },
                    method: 'POST',
                }));
                let data = JSON.parse(Decrypt(token_data.data));
                let token = data.token;
                let uid = data.uid + '';
                setItem('token', token);
                setItem('uid', uid);
                refreshPage(false)
                toast('域名已更新')
            }
        }
    },
    videoerji: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes));
        let id = MY_PARAMS.id;
        let pg = getParam('page');
        try {
            if (MY_PAGE == 1) {
                let 视频二级分类 = [{
                    title: '最新&最热',
                    id: '1&2'
                }];
                Cate(视频二级分类, '视频二级分类', d, 'text_2');
            }
            let url = getItem('host') + '/api/v2/video/module/video/list';
            let body = '{"timestamp":' + t + ',"version":"0.1.0","os":"h5","page":' + pg + ',"page_size":20,"mid":' + id + ',"type":' + getMyVar('视频二级分类', '1') + ',"uid":' + getItem('uid') + ',"token":"' + getItem('token') + '"}';
            let list = post(url, body).list;
            list.forEach(data => {
                d.push({
                    title: data.title,
                    desc: timestampToTime(data.created_at, 1) + '\t\t\t' + parseInt(data.video_length / 60) + ':' + parseInt(data.video_length % 60),
                    img: data.horizontal_cover + image,
                    url: getItem('host') + '/api/v2/video/player.m3u8?vid=' + data.id + '&uid=6299321',
                    col_type: 'movie_2',
                    extra: {
                        id: data.id,
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    mini: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes));
        let pg = getParam('page');
        try {
            if (MY_PAGE == 1) {
                toast('抖音图片无法显示')
            }
            let url = getItem('host') + '/api/v2/video/short/videos';
            let body = '{"timestamp":' + t + ',"version":"0.1.0","os":"h5","uid":' + getItem('uid') + ',"token":"' + getItem('token') + '"}';
            let list = post(url, body).list;
            list.forEach(data => {
                d.push({
                    title: data.title,
                    desc: timestampToTime(data.created_at, 0) + '\t\t\t' + parseInt(data.video_length / 60) + ':' + parseInt(data.video_length % 60),
                    img: data.horizontal_cover + image,
                    url: getItem('host') + '/api/v2/video/player.m3u8?vid=' + data.id + '&uid=6299321',
                    col_type: 'pic_2_card',
                    extra: {
                        id: data.id,
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
    },
    search: () => {
        var d = csdown.d;
        eval(csdown.rely(csdown.aes));
        var pg = getParam('page');
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
        try {
            let url = getItem('host') + '/api/v2/video/search';
            let body = '{"timestamp":' + t + ',"version":"0.1.0","os":"h5","page":' + pg + ',"page_size":20,"keyword":"' + getMyVar('keyword') + '","type":1,"uid":' + getItem('uid') + ',"token":"' + getItem('token') + '"}';
            let list = post(url, body).list;
            list.forEach(data => {
                d.push({
                    title: data.title,
                    desc: timestampToTime(data.created_at, 1) + '\t\t\t' + parseInt(data.video_length / 60) + ':' + parseInt(data.video_length % 60),
                    img: data.horizontal_cover + image,
                    url: getItem('host') + '/api/v2/video/player.m3u8?vid=' + data.id + '&uid=6299321',
                    col_type: 'movie_2',
                    extra: {
                        id: data.id,
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
}
$.exports = csdown

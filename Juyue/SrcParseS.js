//本代码仅用于个人学习，请勿用于其他作用，下载后请24小时内删除，代码虽然是公开学习的，但请尊重作者，应留下说明
function exeWebRule(webObj, music, js) {
    let head = webObj.head || {};
    let webUrl = webObj.webUrl;

    return executeWebRule(webUrl, $.toString((music,webUrl) => {
        try{
            if (typeof (request) == 'undefined' || !request) {
                eval(fba.getInternalJs());
            };
            var urls = _getUrls();
            //fba.log(fy_bridge_app.getUrls());
            var exclude = /\/404\.m3u8|\/xiajia\.mp4|\/余额不足\.m3u8|\.avif|\.css|\.js|\.gif|\.png|\.jpg|\.jpeg|html,http|m3u88.com\/admin|\.php\?v=h|\?url=h|\?vid=h|%253Furl%253Dh|#amp=1|\.t-ui\.cn|ac=dm/;//设置排除地址
            var contain = /\.mp4|\.m3u8|qqBFdownload|mime=video%2F|video_mp4|\.ts\?|TG@UosVod|video\/tos\/|m3u8\?pt=m3u8/;//设置符合条件的正确地址
            for (var i in urls) {
                if(!fba.getVar("getParse") && !webUrl.includes("=http") && /url=h|v=h|youku|mgtv|ixigua|qq\.com|iqiyi|migu|bilibili|sohu|pptv|\.le\.|\.1905|cctv/.test(urls[i])&&!/\/bid\?|\.gif\?|ads\?|img\.php|index\/\?|cityjson/.test(urls[i])){
                    try{
                        fba.log("获取解析>"+urls[i].match(/http.*?=/)[0]);
                        fba.putVar("getParse","1");
                    }catch(e){}
                }
                if(music){
                    if(/\.mp3|\.m4a/.test(urls[i])){
                        return fy_bridge_app.getHeaderUrl(urls[i]) + '#isMusic=true##checkMetadata=false#';
                    }
                }else if (contain.test(urls[i])&&!exclude.test(urls[i])) {
                    fba.clearVar('getParse');
                    fba.log("exeWebRule解析到>"+urls[i]);
                    return fy_bridge_app.getHeaderUrl(urls[i]) + '#isVideo=true#';
                }
            }
        }catch(e){
            fba.log("exeWebRule失败>"+e.message);
        }
    },music,webUrl), {
        blockRules: ['.m4a','.mp3','.gif','.jpg','.jpeg','.png','.ico','hm.baidu.com','/ads/*.js','/klad/*.php','layer.css'],
        jsLoadingInject: true,
        js: js,
        ua: head['user-agent'] || MOBILE_UA,
        referer: head['referer'] || undefined,
        checkTime: 100,
        //timeout: 15000
    })
}
var SrcParseS = {
    聚阅: function (vipUrl, dataObj) {
        if(/\.mp4|\.m3u8/.test(vipUrl)){
            log("直链视频地址，直接播放"); 
            return vipUrl + '#isVideo=true#';
        }else if(/\.mp3|\.m4a/.test(vipUrl)){
            log("直链音乐地址，直接播放"); 
            return vipUrl + '#isMusic=true##checkMetadata=false#';
        }else if(/www\.aliyundrive\.com|www\.alipan\.com/.test(vipUrl)) {
            return $("hiker://empty#noRecordHistory##noHistory#").rule((input) => {
                initConfig({
                    聚影: 'https://raw.gitcode.com/src48597962/juying/raw/master/'
                })
                require(config.聚影 + 'SrcJyAliDisk.js');
                aliShareUrl(input);
            },vipUrl);
        }else if(/pan\.quark\.cn|drive\.uc\.cn/.test(vipUrl)) {
            return "hiker://page/quarkList?rule=Quark.简&realurl=" + encodeURIComponent(vipUrl) + "&sharePwd=";
        }else if(vipUrl.includes('pan.baidu.com')) {
            putVar('urlBaidu', vipUrl);
            return "hiker://page/list?rule=百度网盘&realurl=" + vipUrl;
        }else{
            let webObj = {
                webUrl: vipUrl
            }
            dataObj = dataObj || {};
            return exeWebRule(webObj, dataObj.type=="音频"?1:0) || (dataObj.type=="视频"?"video://"+vipUrl:"toast://解析失败");
        }
    }
}

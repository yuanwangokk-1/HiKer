//子页面读接口规则数据
function readData(jkdata){
    if($.type(jkdata)=="string"){
        jkdata = {id: jkdata}
    }
    let fileid = jkdata.id;
    let file = `hiker://files/rules/Src/Juyue/jiekou/${fileid}.txt`;
    let filestr = fetch(file);
    if(filestr){
        //filestr = filestr.replace(/getMyVar\(/g, 'getMyVar('+jkdata.id+'+').replace(/putMyVar\(/g, 'putMyVar('+jkdata.id+'+');
        eval(filestr);
        try{
            let arr = ['主页','分类','排序','更新','搜索','二级'];
            let pindao = parse['频道'] || [];
            arr.concat(pindao).forEach(it=>{
                delete parse[it];
            })
        }catch(e){}
        parse['id'] = jkdata.id;
        parse['sourcename'] = jkdata.name;
        return parse;
    }else{
        return {};
    }
}

let parse = function(jkdata) {
    jkdata = jkdata || storage0.getMyVar('二级源接口信息') || storage0.getMyVar('一级源接口信息') || {};
    return readData(jkdata);
}

function 图片解密(key, iv, kiType, mode, isBase64Dec) {
    try {
        if (input == null) throw new Error("");
        const CryptoUtil = $.require("hiker://assets/crypto-java.js");
        let getData = (str, type) => {
            switch (type) {
                case "Hex":
                    return CryptoUtil.Data.parseHex(str);
                case "Base64":
                    return CryptoUtil.Data.parseBase64(str);
                default:
                    return CryptoUtil.Data.parseUTF8(str);
            }
        }
        let keyData = getData(key, kiType);
        let ivData = getData(iv, kiType);
        let textData = CryptoUtil.Data.parseInputStream(input);
        if(isBase64Dec){
            textData = textData.base64Decode();
        }
        let encrypted = CryptoUtil.AES.decrypt(textData, keyData, {
            mode: mode, //"AES/CBC/PKCS7Padding",
            iv: ivData
        });
        return encrypted.toInputStream();
    } catch (e) {
        return;
    }
}
//压缩和灰度代码
let Bitmap = android.graphics.Bitmap;
let BitmapFactory = android.graphics.BitmapFactory;
// 获取Bitmap解码选项（支持动态缩小比例）
function getOptions(inSampleSize) {
    let options = new BitmapFactory.Options();
    options.inSampleSize = inSampleSize || 1; // 默认不缩小
    options.inPreferredConfig = Bitmap.Config.ARGB_8888; // 使用高质量颜色模式
    return options;
}
// 将Bitmap转为InputStream（自动关闭流）
function bitmapToInputStream(bitmap, quality) {
    quality = quality || 85; // 默认质量85%
    let ByteArrayOutputStream = java.io.ByteArrayOutputStream;
    let ByteArrayInputStream = java.io.ByteArrayInputStream;
    let baos = new ByteArrayOutputStream();
    try {
        bitmap.compress(Bitmap.CompressFormat.JPEG, quality, baos);
        return new ByteArrayInputStream(baos.toByteArray());
    } finally {
        baos.close(); // 确保流关闭
    }
}
// 解码输入流为Bitmap（支持动态缩小）
function decodeBitmap(input, inSampleSize) {
    return BitmapFactory.decodeStream(input, null, getOptions(inSampleSize));
}
// 转为灰度图
function toGrayscale(bmpOriginal, inSampleSize) {
    let Canvas = android.graphics.Canvas;
    let ColorMatrix = android.graphics.ColorMatrix;
    let ColorMatrixColorFilter = android.graphics.ColorMatrixColorFilter;
    let Paint = android.graphics.Paint;
    let bitmap = decodeBitmap(bmpOriginal, inSampleSize);
    try {
        let width = bitmap.getWidth();
        let height = bitmap.getHeight();
        let bmpGrayscale = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
        let canvas = new Canvas(bmpGrayscale);
        let paint = new Paint();
        let cm = new ColorMatrix();
        cm.setSaturation(0);
        paint.setColorFilter(new ColorMatrixColorFilter(cm));
        canvas.drawBitmap(bitmap, 0, 0, paint);
        return bitmapToInputStream(bmpGrayscale);
    } finally {
        bitmap.recycle();
    }
}
// 压缩图片
function compress(bmpOriginal, inSampleSize, quality) {
    const bitmap = decodeBitmap(bmpOriginal, inSampleSize);
    try {
        return bitmapToInputStream(bitmap, quality);
    } finally {
        bitmap.recycle();
    }
}
let exports = {
    "parse": parse,
    "imgDec": (key, iv, kiType, mode, isBase64Dec) => 图片解密(input, key, iv, kiType, mode, isBase64Dec),
    "compress": (inSampleSize, quality) => compress(input, inSampleSize, quality),
    "toGrayscale": (inSampleSize) => toGrayscale(input, inSampleSize)
}
try{
    let exportskeys = Object.keys(exports);
    let getexp = parse() || {};
    let arr = getexp.exports || [];
    arr.forEach(it => {
        if($.type(it)=="object"){
            if(!exportskeys.includes(it.key)){
                exports[it.key] = getexp[it.key];
            }
        }else if($.type(it)=="string"){
            if(!exportskeys.includes(it)){
                exports[it] = getexp[it];
            }
        }
    })
}catch(e){}

$.exports = exports
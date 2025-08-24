let FileUtil = com.example.hikerview.utils.FileUtil;
let javaString = java.lang.String;
let Base64 = java.util.Base64;
const GZIPOutputStream = java.util.zip.GZIPOutputStream;
const GZIPInputStream = java.util.zip.GZIPInputStream;
const DeflaterOutputStream = java.util.zip.DeflaterOutputStream;
const InflaterInputStream = java.util.zip.InflaterInputStream;
const DeflaterInputStream = java.util.zip.DeflaterInputStream;
const ByteArrayOutputStream = java.io.ByteArrayOutputStream;
const ByteArrayInputStream = java.io.ByteArrayInputStream;
const Deflater = java.util.zip.Deflater;

function zip(text, mode) {
    mode = mode ? mode : "gzip";
    let baseStr = new javaString(text);
    // 使用 ByteArrayOutputStream 来捕获压缩后的数据
    var baos = new ByteArrayOutputStream();
    if (mode == "deflate") {
        var deflater = new java.util.zip.Deflater();
        deflater.setLevel(java.util.zip.Deflater.BEST_COMPRESSION);
        var dos = new java.util.zip.DeflaterOutputStream(baos, deflater);
        dos.write(baseStr.getBytes("UTF-8"));
        dos.finish(); // 完成压缩
        dos.close();
    } else {
        var gzos = new java.util.zip.GZIPOutputStream(baos);
        gzos.write(baseStr.getBytes("UTF-8"));
        gzos.close(); // 关闭压缩流
    }
    // 将压缩后的数据转换为 Base64 编码的字符串
    var compressedData = baos.toByteArray();
    var base64String = java.util.Base64.getEncoder().encodeToString(compressedData);

    // 关闭 ByteArrayOutputStream
    baos.close();
    return String(base64String);
}

function unzip(text, mode) {
    mode = mode ? mode : "gzip";
    var compressedData = Base64.getDecoder().decode(text);
    var bais = new ByteArrayInputStream(compressedData);
    var baos = new ByteArrayOutputStream();
    var buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
    if (mode == "gzip") {
        var gis = new GZIPInputStream(bais);
        let len;
        while ((len = gis.read(buffer)) != -1) {
            baos.write(buffer, 0, len);
        }
        gis.close();
    } else if (mode == "deflate") {
        var iis = new InflaterInputStream(bais);
        let len;
        while ((len = iis.read(buffer)) != -1) {
            baos.write(buffer, 0, len);
        }
        iis.close();
    }
    bais.close();
    baos.close();
    var decompressedString = new javaString(baos.toByteArray(), "UTF-8");
    // 打印解压缩后的字符串
    return String(decompressedString);
}
$.exports = {
    zip,
    unzip
};
let http;
try {
  http = config.依赖.replace("ycl.js", "");
} catch (e) {
  http = getItem(
    "git",
    "https://raw.gitcode.com/Suifen/feng/raw/main/ycl.js"
  ).replace("ycl.js", "");
}
let CT = Date.now();
let Json;
let file = "hiker://files/rules/FYJK/ys.json";
if (!fileExist(file)) {
  saveFile(file, JSON.stringify([]));
} else {
  try {
    Json = JSON.parse(readFile(file));
  } catch (e) {
    console.error("解析文件内容出错:", e);
  }
}

let lx0 = getItem("lx1", "全部");
let lx2 =
  "\\[私\\]|\\[优\\]|\\[免\\]|\\[盘\\]|\\[听\\]|\\[阅\\]|\\[漫\\]|\\[画\\]|\\[短\\]|\\[音\\]|\\[影\\]|盘|短剧|影|剧|视|漫|番|次元|音|歌|曲|DJ|MV|听|声|有声|听书|说|阅|读|书|漫画";

let lx1 =
  lx0 == "听书"
    ? "\\[听\\]|有声|听书"
    : lx0 == "小说"
    ? "\\[阅\\]|说|阅|读|书"
    : lx0 == "漫画"
    ? "\\[画\\]|漫画"
    : lx0 == "网盘"
    ? "\\[盘\\]|盘"
    : lx0 == "私有"
    ? "\\[私\\]|\\[优\\]|\\[免\\]"
    : lx0 == "短剧"
    ? "\\[短\\]|短剧"
    : lx0 == "影视"
    ? "\\[影\\]|影|剧|视"
    : lx0 == "动漫"
    ? "\\[漫\\]|漫|番|次元"
    : lx0 == "音乐"
    ? "\\[音\\]|音|歌|曲|DJ|MV|听|声"
    : "";

let reg1 = new RegExp(lx1);
let reg2 = new RegExp(lx2);

function ttls(ttl) {
  return typeof ttl === "string" && ttl === "";
}

let off1 =
  lx0 == "音乐"
    ? Json.filter(
        (item) =>
          item.off === "1" &&
          reg1.test(item.name.replace(/&&.*/g, "")) &&
          !(item.ttl && item.ttl >= 3) &&
          !/\[私\]|\[优\]|\[免\]/.test(item.name.replace(/&&.*/g, ""))
      )
    : lx0 == "动漫"
    ? Json.filter(
        (item) =>
          item.off === "1" &&
          reg1.test(item.name.replace(/&&.*/g, "")) &&
          !(item.ttl && item.ttl >= 3) &&
          !/\[私\]|\[优\]|\[免\]|\[盘\]|盘|漫画|\[画\]/.test(
            item.name.replace(/&&.*/g, "")
          )
      )
    : lx0 == "影视"
    ? Json.filter(
        (item) =>
          item.off === "1" &&
          reg1.test(item.name.replace(/&&.*/g, "")) &&
          !(item.ttl && item.ttl >= 3) &&
          !/\[私\]|\[优\]|\[免\]|\[盘\]|盘|短剧/.test(
            item.name.replace(/&&.*/g, "")
          )
      )
    : lx0 == "漫画"
    ? Json.filter(
        (item) =>
          item.off === "1" &&
          reg1.test(item.name.replace(/&&.*/g, "")) &&
          !(item.ttl && item.ttl >= 3) &&
          !/\[私\]|\[优\]|\[免\]/.test(item.name.replace(/&&.*/g, ""))
      )
    : lx0 == "小说"
    ? Json.filter(
        (item) =>
          item.off === "1" &&
          reg1.test(item.name.replace(/&&.*/g, "")) &&
          !(item.ttl && item.ttl >= 3) &&
          !/\[私\]|\[优\]|\[免\]/.test(item.name.replace(/&&.*/g, ""))
      )
    : lx0 == "听书"
    ? Json.filter(
        (item) =>
          item.off === "1" &&
          reg1.test(item.name.replace(/&&.*/g, "")) &&
          !(item.ttl && item.ttl >= 3) &&
          !/\[私\]|\[优\]|\[免\]/.test(item.name.replace(/&&.*/g, ""))
      )
    : lx0 == "网盘"
    ? Json.filter(
        (item) =>
          item.off === "1" &&
          reg1.test(item.name.replace(/&&.*/g, "")) &&
          !(item.ttl && item.ttl >= 3) &&
          !/\[私\]|\[优\]|\[免\]/.test(item.name.replace(/&&.*/g, ""))
      )
    : lx0 == "私有"
    ? Json.filter(
        (item) =>
          item.off === "1" &&
          reg1.test(item.name.replace(/&&.*/g, "")) &&
          !(item.ttl && item.ttl >= 3)
      )
    : lx0 == "短剧"
    ? Json.filter(
        (item) =>
          item.off === "1" &&
          reg1.test(item.name.replace(/&&.*/g, "")) &&
          !(item.ttl && item.ttl >= 3) &&
          !/\[私\]|\[优\]|\[免\]/.test(item.name.replace(/&&.*/g, ""))
      )
    : lx0 === "其它"
    ? Json.filter(
        (item) =>
          item.off === "1" &&
          !reg2.test(item.name.replace(/&&.*/g, "")) &&
          !(item.ttl && item.ttl >= 3)
      )
    : Json.filter(
        (item) =>
          item.off === "1" &&
          reg1.test(item.name.replace(/&&.*/g, "")) &&
          !(item.ttl && item.ttl >= 3) &&
          !/\[私\]|\[优\]|\[免\]/.test(item.name.replace(/&&.*/g, ""))
      );

let myName = getMyVar("namejs");
let result = Json.find((item) => item.name === myName);
let gsValue;
let timea;
if (result) {
  gsValue = result.gs;
  timea = result.time;
  //console.log(gsValue);
} else {
  gsValue = "JS";
  //console.log("没有找到匹配的项");
}

function sourl() {
  try {
    eval("var sojl = " + readFile("hiker://files/cache/FY/sojl.js"), 0);
  } catch (e) {
    var sojl = [];
  }
  sojl.unshift(input); //新增在最前面

  //利用 includes() 去重
  /* let newArr = [];
     wenj.forEach((item) => {
         if (!newArr.includes(item)) {
             newArr.push(item);
         }
     })*/
  //利用 filter() 去重
  let sojl = sojl.filter((item, index) => sojl.indexOf(item) === index);

  if (sojl.length > 25) {
    sojl.splice(-1, 1);
  }
  saveFile("hiker://files/cache/FY/sojl.js", JSON.stringify(sojl), 0);
  putMyVar("Mysou", input);
  if (getMyVar("影搜") != "1") {
    return $("hiker://empty#noRecordHistory##noHistory#fypage").rule(() => {
      require(config.依赖);
      yso();
    });
  } else {
    refreshPage();
    return "hiker://empty";
  }
}

//分隔
let piin = getItem("全屏", "off") == "on";
let game = piin ? "##gameTheme#" : "#";

//更新
function gx() {
  let SC = parseInt(getItem("清除", "0").replace("SC", ""));
  let SY = parseInt(getItem("sy清", "0").replace("SY", ""));
  let ersc = CT > SC + 15 * 24 * 60 * 60 * 1000;
  let sysc = CT > SY + 30 * 24 * 60 * 60 * 1000;
  let get1 = getMyVar("清除", "0") == "1";
  if (ersc || sysc || get1) {
    let ur1;
    let ur2;
    let toas;
    if (ersc) {
      setItem("清除", CT + "SC");
      clearMyVar("MY_URL");
      ur2 = "erji";
      toas = "自动清除二级缓存";
    } else if (sysc) {
      setItem("sy清", CT + "SY");
      clearMyVar("换");
      ur1 = "sy";
      toas = "自动清除首页缓存";
    } else if (get1) {
      clearMyVar("MY_URL");
      ur2 = "erji";
      clearMyVar("换");
      ur1 = "sy";
    }
    let file = require(http + "sc.js");
    let dele =
      "/storage/emulated/0/Android/data/com.example.hikerview/files/Documents/cache/FY/";

    if (file.deleteFiles(dele + ur1) && file.deleteFiles(dele + ur2)) {
      if (get1) {
        toast("已清除首页、二级缓存");
        clearMyVar("清除");
      } else {
        toast(toas);
      }
    } else {
      if (get1) {
        toast("无需清除");
        clearMyVar("清除");
      } else {
        toast("没有缓存可清除");
      }
    }
  }

  let LT = parseInt(getItem("上次", "0").replace("CT", ""));
  let 更新up =
    CT > LT + 2 * 24 * 60 * 60 * 1000 && getItem("自动", "on") == "on";
  let mytitle = MY_RULE.title != "风影 Beta";
  let 手 = getMyVar("手动", "0") == "1";
  let 强 = getMyVar("强制", "0") == "1";
  let 手d = getVar("fy手动fy", "0") == "1";
  let ver = "241010";
  let zver = getItem("ver", "1");
  if (ver > zver && mytitle) {
    let vers = $.toString((ver) => {
      setItem("ver", ver);
      deleteCache();
      return "海阔视界规则分享，当前分享的是：小程序，随风￥home_rule_v2￥base64://@风影@eyJsYXN0X2NoYXB0ZXJfcnVsZSI6IiIsInRpdGxlIjoi6aOO5b2xIiwiYXV0aG9yIjoi6ZqP6aOOIiwidXJsIjoiaGlrZXI6Ly9lbXB0eSMjZnlwYWdlIiwidmVyc2lvbiI6MjQxMDEwLCJjb2xfdHlwZSI6Im1vdmllXzMiLCJjbGFzc19uYW1lIjoiIiwidHlwZSI6ImFsbCIsImNsYXNzX3VybCI6IiIsImFyZWFfbmFtZSI6IiIsImFyZWFfdXJsIjoiIiwic29ydF9uYW1lIjoiIiwieWVhcl9uYW1lIjoiIiwic29ydF91cmwiOiIiLCJ5ZWFyX3VybCI6IiIsImZpbmRfcnVsZSI6ImpzOlxuIHJlcXVpcmUoY29uZmlnLuS+nei1lik7XG4gc3koKSIsInNlYXJjaF91cmwiOiJoaWtlcjovL2VtcHR5IyMqKiIsImdyb3VwIjoi4pGgQeW9sSIsInNlYXJjaEZpbmQiOiJqczpcbiByZXF1aXJlKGNvbmZpZy7kvp3otZYpO1xuIHNvdSgpIiwiZGV0YWlsX2NvbF90eXBlIjoibW92aWVfMSIsImRldGFpbF9maW5kX3J1bGUiOiIiLCJzZGV0YWlsX2NvbF90eXBlIjoibW92aWVfMSIsInNkZXRhaWxfZmluZF9ydWxlIjoiKiIsInVhIjoibW9iaWxlIiwicHJlUnVsZSI6ImV2YWxQcml2YXRlSlMoXCJPampPakZ2NWJWdHQxU25LVHZPdXhOR3lvYWFHY0pRZzQwUUluamhMWTJzSzhwL2s0TXNJKzN5dkRGTWtaY3d0RXNmRUFDMUc3eVpBd0x5Rnoxa25BUXZ4YklFd1JZWlY0a2U2MW16VlViV25HYitLUEZKSlpSa0ZQZ1RacU5tK3ZjZlVLNnJKYXlnSEt1eHFIb0RoSll0Z3c0ZXBSSXhXNmM2RXpHM014Zlk9XCIpIiwicGFnZXMiOiJbe1wiY29sX3R5cGVcIjpcIm1vdmllXzNcIixcIm5hbWVcIjpcIuWvvOWFpeWPo+S7pFwiLFwicGF0aFwiOlwiaW1wb3J0XCIsXCJydWxlXCI6XCJldmFsUHJpdmF0ZUpTKFxcXCJkNG1uK0dwTEdLT3BEN1A1dUJwS2JXUUp2ODVIcjk4amgwUnpsa01IbTg3bjN1WXlMOTRjeXh0R1VRQnNXd3czVEZ2ZlR2SCtNSzNLSHFjNmg2dzZ5SEZjY1IrOGlYRUNCd3d6ck5FSlRWWlNaelhZMVRGeEtVdmlGcXZDb1M0ZXpkanR3SkRhQkZZSDV5RE4yb25WLzJlZGsxSVYyQU1jUlNOSExoMGR6dFo0YngydU0vaGIxNlJtZ1VJUWJMUzM5NTBLeW1wVEJxRm9xUkhGQWlTMkZmZEhMNEo4YzJyMS9EbCttOGxPdDc4cW8rSW90bGJ2Zjh0eHY0alpObzhsZFV0QnZCRzY0S2diaXF6bm5zRnJBTGQ0eVFrdW1UdXFLWGlFR0pocjB6YUFuSktnb0NSV3c4cFppVFFoalU2UU1IT1RBTVFTZm9HT3RmVU0xdjRMbmplczJkbXhGcllSeTVWaFp1TThCckJHeUR1TzVmdWpyYW1nSGpUNzZ0c2NzTEs0QU1MeWp3WWNBdFE0ZWJuMGpqbVFTbjQ1SzU5amFOWERQbHdGTjFpQXBET3RKRU0rUk0vczhvd0Mvdm9YdmZLdWtrclNTSVZGejg3c1VEM2MxWFZiZ0xtMDltRHl5eGFqZkY3N2ovM1ZqcnBxVUwvZW1TMlkzNWJhUVNQQ1xcXCIpXCJ9LHtcImNvbF90eXBlXCI6XCJtb3ZpZV8zXCIsXCJuYW1lXCI6XCLlr7zlhaXnoa7orqRcIixcInBhdGhcIjpcImNmbVwiLFwicnVsZVwiOlwianM6XFxuZXZhbFByaXZhdGVKUyhcXFwiLzRFeVpZdm5XWnZpMkppUkxuZkFueG9jWlFZdEx0eUZMWTNxNXpFV2NFNitmYm13Y0hNOXpHNThXeFFxM084MmZiTGFPS3FhMzZZQTBtWXhKNmRxRGdBajlaUld2TjF0aTNJWElUVWVOaDNPTXJjTmxQY0tDRkwrM21HUGJ5bC9xY01iemxHSkl5SGdiblhtN0R5cHdnPT1cXFwiKVxcblxcbi8vcmVxdWlyZShnZXRJdGVtKFxcXCJnaXRcXFwiLCBcXFwiaHR0cHM6Ly9yYXcuZ2l0Y29kZS5jb20vU3VpZmVuL2ZlbmcvcmF3L21haW4veWNsLmpzXFxcIikucmVwbGFjZShcXFwieWNsLmpzXFxcIiwgXFxcImNmbS5qc1xcXCIpKTtcIn1dIiwiaWNvbiI6Imh0dHBzOi8vY29kZWJlcmcub3JnL3N1aWZlbmcveWluL3Jhdy9icmFuY2gvbWFzdGVyL3R1L2Z5dGIuanBnIiwicHJveHkiOiIifQ==";
    }, ver);
    confirm({
      title: "发现新版本：" + ver,
      content: "新版本需重新导入，否则会出现未知错误，是否立即导入？",
      confirm: vers,
      cancel: vers,
    });
  } else if (更新up || 手 || 强 || 手d) {
    function up() {
      if (强 && bbh != "报错") {
        let file = require(http + "sc.js");
        let dele =
          "/storage/emulated/0/Android/data/com.example.hikerview/files/Documents/cache/FY";
        file.deleteFiles(dele);
        deleteCache();
        clearMyVar("强制");
        refreshPage();
        toast("强制更新完成");
      } else {
        let nowb;
        try {
          eval(
            "let current = " + readFile("hiker://files/cache/FY/Changelog.js"),
            0
          );
          nowb = current[0].版本;
        } catch (e) {
          nowb = "1.0";
        }
        let desc = "当前版本: " + nowb + " 是否更新？\n\n";
        let lsh = getMyVar("临时", "1.0");
        putMyVar("更新", newb);
        let ych = getMyVar("更新");
        if ((ych > nowb && ych > lsh) || (ych > nowb && (手 || 手d))) {
          clearMyVar("手动");
          clearVar("fy手动fy");
          log(
            "当前版本: " +
              nowb +
              " < 新版本: " +
              newb +
              "\n更新日期: " +
              日期 +
              "\n" +
              内容
          );
          confirm({
            title: "发现新版本: " + newb,
            content: desc + 内容,
            confirm: $.toString(
              (neb, ych, 内容, 日期, http) => {
                let file = require(http + "sc.js");
                let dele =
                  "/storage/emulated/0/Android/data/com.example.hikerview/files/Documents/cache/FY/sy";
                file.deleteFiles(dele);
                deleteCache();
                let Changelog = neb;
                saveFile(
                  "hiker://files/cache/FY/Changelog.js",
                  JSON.stringify(Changelog),
                  0
                );

                refreshPage();
                toast("更新完成");
              },
              lisb,
              ych,
              内容,
              日期,
              http
            ),
            cancel: $.toString((ych) => {
              putMyVar("临时", ych);
              toast("取消更新");
            }, ych),
          });
        } else {
          clearMyVar("手动");
          clearVar("fy手动fy");
          toast("已是最新版");
        }
      }
    }
    if (更新up) {
      setItem("上次", CT + "CT");
    }
    let bbh;
    let lisb;
    let newb;
    let 日期;
    let 内容;
    try {
      bbh = fetch(http + "bbh.js", {
        timeout: 3000,
      });
      lisb = /http/.test(http) ? eval(bbh) : eval(JSON.parse(bbh).rule);
      newb = lisb[0].版本;
      日期 = lisb[0].日期;
      内容 = lisb[0].内容;
    } catch (e) {
      bbh = "报错";
      log(e.toString());
    }
    if (bbh == "报错") {
      let gitcode = "https://raw.gitcode.com/Suifen/feng/raw/main/";
      let codeberg = "https://codeberg.org/suifeng/yin/raw/branch/master/";
      let gitee = "https://gitee.com/following-the-wind/ying/raw/master/";
      let git = /gitcode/.test(http)
        ? codeberg
        : /codeberg/.test(http)
        ? gitee
        : gitcode;
      try {
        bbh = fetch(git + "bbh.js", {
          timeout: 3000,
        });
        lisb = eval(bbh);
        newb = lisb[0].版本;
        日期 = lisb[0].日期;
        内容 = lisb[0].内容;
      } catch (e) {
        bbh = "报错";
        log(e.toString());
      }

      if (bbh == "报错") {
        clearMyVar("强制");
        clearMyVar("手动");
        toast("获取远程数据时，出现未知错误");
        confirm({
          title: "远程仓库失联",
          content:
            "请勿强制更新或清理\t" + MY_RULE.title + "\t缓存\n否则必定报错",
          confirm: null,
          cancel: null,
        });
      } else {
        setItem("git", git + "ycl.js");
        up();
        back(true);
      }
    }
    up();
  }
}

//首页
function sy() {
  putMyVar("vers", MY_RULE.version);
  gx();
  let z = [];
  let d = [];
  let fr =
    getMyVar("namejs", "null") != "null"
      ? [getMyVar("namejs").replace(/&&.*/, "")]
      : off1
          .filter(
            (item) =>
              ((item.fl != "" || item.sy != "") && item.gs != "HOST") ||
              item.gs == "HOST"
          )
          .map((item) => item.name.replace(/&&.*/, ""));
  let rn = ["类型", "首页"].concat(fr);
  if (
    getItem("首页", "on") == "on" &&
    getItem("Mysye", "首页") == "首页" &&
    getMyVar("Myfl") == "" &&
    getMyVar("Mysou") == ""
  ) {
    let arr = fr;
    let suii = [];
    let num = 1;
    while (suii.length < num) {
      var temp = (Math.random() * arr.length) >> 0;
      suii.push(arr.splice(temp, 1));
      storage0.putMyVar("sui", suii);
      var ssui = getMyVar("sui").replace(/\[|\]|\"|\./g, "");
      setItem("m1", ssui);
      clearMyVar("待");
      deleteItemByCls("so_id");
      clearMyVar("dxz");
      clearMyVar("Myurl.url");
      clearMyVar("Myurl.title");
      clearMyVar("Myfl");
      clearMyVar("sd_zh");
      clearMyVar("flxz1");
    }
  } else {
    deleteItemByCls("so_id");
    clearMyVar("dxz");
  }

  let sui =
    getItem("首页", "on") == "on"
      ? getItem("m1", "首页")
      : getItem("m1", "首页");

  let syurl;
  let cesy;
  try {
    var yu =
      getMyVar("namejs", "null") != "null"
        ? getMyVar("namejs").replace(/&&.*/, "")
        : off1.find((item) => item.name.replace(/&&.*/, "") === sui);
    if (yu != undefined) {
      try {
        if (getMyVar("namejs", "null") != "null" || yu.fbhost == "") {
          let s =
            getMyVar("namejs", "null") != "null" ? getMyVar("hostjs") : yu.host;
          let syur = new Function(s);
          toast("获取域名中，请稍后！");
          syurl = syur();
          if (getMyVar("namejs", "null") == "null") {
            let dList = Json.map((item) => {
              if (item.name.replace(/&&.*/, "") === sui) {
                const newItem = Object.assign({}, item, {
                  fbhost: syurl,
                });
                return newItem;
              }
              return item;
            });
            saveFile(file, JSON.stringify(dList));
          }
        } else {
          syurl = yu.fbhost;
        }
      } catch (e) {
        syurl =
          getMyVar("namejs", "null") != "null" ? getMyVar("hostjs") : yu.host;
      }
      cesy = getMyVar("namejs", "null") != "null" ? getMyVar("syjs") : yu.sy;
    } else {
      syurl = "http://fenying";
      cesy = "";
      clearItem("m1");
      clearItem("Mysye");
    }
  } catch (e) {
    clearItem("m1");
    refreshPage(false);
  }

  if (cesy == "*") {
    MYURL = syurl;
  } else {
    MY_URL = getHome(syurl);
  }
  log(sui + " - " + getHome(syurl));

  let bia = rn.map((tit) => {
    return tit == sui
      ? "““<b>" + tit + "</b>””"
      : tit == "类型"
      ? "‘‘’’<b>" +
        ("类型: " + getItem("lx1", "全部")).fontcolor("#FA7298") +
        "</b>"
      : tit;
  });

  let 首页 = $(bia, 3, lx0).select(() => {
    if (/类型/.test(input)) {
      let 私;
      if (getItem("隐藏", "off") == "on") {
        私 = "私有";
      }
      let titl = [
        "全部",
        "影视",
        "短剧",
        "动漫",
        "网盘",
        "音乐",
        "漫画",
        "小说",
        "听书",
        "其它",
      ];
      if (私) {
        titl.push(私);
      }
      let bia = titl.map((tit) => {
        return tit == getItem("lx1", "全部") ? "““<b>" + tit + "</b>””" : tit;
      });
      return $(bia, 2, "选择类型").select(() => {
        setItem("lx1", input.replace(/\“|\”|\<b\>|\<\/b\>/g, ""));
        clearItem("m1");
        clearItem("s0");
        refreshPage(false);
        return "toast://已选择 " + input;
      });
    } else {
      setItem("m1", input.replace(/\“|\”|\<b\>|\<\/b\>/g, ""));
      setItem("Mysye", input.replace(/\“|\”|\<b\>|\<\/b\>/g, ""));
      clearMyVar("待");
      deleteItemByCls("so_id");
      //deleteItemByCls('cls_fylunbo');
      clearMyVar("dxz");
      clearMyVar("Myurl.url");
      clearMyVar("Myurl.title");
      clearMyVar("Myfl");
      clearMyVar("sd_zh");
      clearMyVar("flxz1");
      if (getItem("Mysye") == "首页") {
        clearMyVar("Mysou");
        clearMyVar("Myfl");
      }
      refreshPage(true);
      return "hiker://empty";
    }
  });
  let 分类 =
    MY_URL == "http://fenying"
      ? "toast://请选择首页"
      : cesy == "*"
      ? "toast://当前无首页，已显示分类"
      : $(syurl + "#noLoading#").lazyRule((url) => {
          clearMyVar("Mysou");
          clearMyVar("Myurl.title");
          //putMyVar("Myfl", "电影");
          //putMyVar("Myurl.url", input);
          return $(
            "hiker://empty#" + url + "#noRecordHistory##noHistory##fypage"
          ).rule(() => {
            require(config.依赖);
            fenlei();
          });
        }, syurl);
  let 追更 = $("hiker://empty#noRecordHistory##noHistory#noRefresh#").rule(
    () => {
      require(config.依赖);
      Wp();
    }
  );
  let 影搜 = $("hiker://empty#noRecordHistory##noHistory#fypage").rule(() => {
    require(config.依赖);
    yso();
  });
  let 设置 = $("hiker://empty#noRecordHistory##noHistory##noRefresh#").rule(
    () => {
      require(config.依赖);
      she();
    }
  );

  let urlu = [首页, 分类, 追更, 影搜, 设置];
  let titll = [sui, "分类", "追更", "搜索", "设置"];

  let 图 = "https://hikerfans.com/tubiao/more/";
  let pici = ["47", "213", "288", "101", "44"];

  for (let i in pici) {
    z.push({
      title: "‘‘’’<b>" + titll[i] + "</b>",
      url: urlu[i],
      img: 图 + pici[i] + ".png",
      col_type: "icon_5",
      extra: {
        inheritTile: false,
        longClick:
          i == 0
            ? [
                {
                  title: "删除 " + getItem("m1", "首页"),
                  js: $.toString((name) => {
                    return name == "首页"
                      ? "toast://当前未选择源"
                      : $("删除后不可恢复，确认删除  " + name + " ？").confirm(
                          (name) => {
                            let file = "hiker://files/rules/FYJK/ys.json";
                            let list = JSON.parse(readFile(file));
                            const result = list.filter((item) => {
                              return !(item.name.replace(/&&.*/g, "") == name);
                            });
                            saveFile(file, JSON.stringify(result));
                            clearItem("m1");
                            refreshPage(false);
                            return "toast://已删除 " + name;
                          },
                          name
                        );
                  }, getItem("m1", "首页")),
                },
              ]
            : "",
      },
    });
  }

  z.push({
    title: "搜索",
    desc: "可 以 少 字 ，不 可 错 字 ！",
    url: $.toString(
      (sui, myurl) => {
        putMyVar("Mysou", input);
        if (
          (getMyVar("Mysou") && myurl != "http://fenying") ||
          getItem("s1", "0") == "1"
        ) {
          if (getItem("s1", "0") != "1" && myurl != "http://fenying") {
            setItem("s0", sui);
          }
          return (
            input +
            $("#noLoading#").lazyRule(() => {
              require(config.依赖);
              return sourl();
            })
          );
        } else {
          return myurl == "http://fenyin"
            ? "toast://请选择首页"
            : "toast://请输入关键字";
        }
      },
      sui,
      MY_URL
    ),
    col_type: "input",
    extra: {
      pageTitle: "影搜",
    },
  });

  if (getItem("记录", "off") == "on") {
    let name = ["观影记录", "我的收藏"];
    let curl = ["hiker://history?rule=", "hiker://collection?rule="];
    let slpic = ["83", "201"];
    for (let s in curl) {
      z.push({
        title: name[s],
        img: 图 + slpic[s] + ".png",
        url: curl[s] + MY_RULE.title,
        col_type: "icon_small_3",
      });
    }

    z.push({
      title: "搜索记录",
      img: 图 + "185.png",
      url: $("#noLoading#").lazyRule((sui) => {
        if (getMyVar("dxz", "off") == "on") {
          deleteItemByCls("so_id");
          putMyVar("dxz", "off");
        } else {
          try {
            eval("var sojl = " + readFile("hiker://files/cache/FY/sojl.js"), 0);
          } catch (e) {
            var sojl = "";
          }
          if (sojl != "") {
            titls = sojl.map((li) => {
              return {
                title: "‘‘’’<small>" + li + "</small>",
                url:
                  li +
                  $("#noLoading#").lazyRule(() => {
                    require(config.依赖);
                    return sourl();
                  }),
                col_type: "flex_button",
                extra: {
                  pageTitle: "影搜",
                  cls: "so_id",
                },
              };
            });
          } else {
            titls = [
              {
                title: "‘‘’’<small>没有搜索记录</small>",
                url: "hiker://empty",
                col_type: "text_center_1",
                extra: {
                  cls: "so_id",
                  lineVisible: false,
                },
              },
            ];
          }
          addItemAfter("sojl_id", titls);
          putMyVar("dxz", "on");
        }
        return "hiker://empty";
      }, sui),
      col_type: "icon_small_3",
      extra: {
        id: "sojl_id",
        longClick: [
          {
            title: "清除记录",
            js: $.toString(() => {
              deleteFile("hiker://files/cache/FY/sojl.js");
              deleteItemByCls("so_id");
              clearMyVar("dxz");
              return "hiker://empty";
            }),
          },
        ],
      },
    });
  }

  z.push({
    col_type: "big_blank_block",
  });

  if (MY_URL == "http://fenying") {
    z.push(
      {
        col_type: "big_blank_block",
      },
      {
        title: '‘‘’’<font color="#b0e0e6">点击选择首页</font>',
        desc: "0",
        url: 首页,
        img: http + "tu/fytb.jpg@Referer=",
        col_type: "card_pic_1",
      }
    );
  }
  if (MY_URL != "http://fenying") {
    z.push({
      img: "https://hikerfans.com/weisyr/img/Loading1.gif",
      url: "hiker://empty",
      col_type: "pic_1_center",
      extra: {
        cls: "cls_load",
      },
    });
  }
  setPreResult(z);

  if (syurl != "http://fenying") {
    if (cesy != "*") {
      if (MY_PAGE == 1) {
        require(config.依赖);
        xsy(MY_URL, http, d, sui);
      }
    } else {
      putMyVar("flurl", syurl);
      require(config.依赖);
      fenlei();
      deleteItemByCls("cls_load");
    }
  }
}

//轮播Html
let getHtml = (image) => `
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>轮播图</title>
    <style>
        .carousel-container {
    width: calc(100% - 10px);
    margin: 0 auto;
    position: relative;
    overflow: hidden; /* 确保溢出部分被隐藏 */
    border-radius: 10px;
}

.carousel {
    display: flex;
    transition: transform 0.5s ease-in-out;
}

.carousel img {
    width: 100%;
    height: 45vw; /* 设置高度为屏幕宽度的45% */
    object-fit: cover;
    border-radius: 10px; /* 确保图片和容器边角一致 */
    display: block; /* 确保没有额外的间隙 */
}

.carousel-item {
    flex: 0 0 100%; /* 确保轮播项宽度为容器宽度 */
    box-sizing: border-box; /* 确保内边距和边框计算在内 */
}

.carousel-buttons {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.carousel-button {
    background-color: rgba(0, 0, 0, 0.05);
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    border-radius: 50px;
}

.carousel-indicators {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
}

.carousel-indicator {
    width: 10px;
    height: 4px;
    background-color: #808080; /* 灰色 */
    margin: 0 2px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.carousel-indicator.active {
    background-color: #00FF00; /* 绿色 */
}

.carousel-title {
    position: absolute;
    top: 10px;
    left: 10px;
    color: white;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
    padding: 5px 10px;
    border-radius: 50px;
    font-weight: bold;
}

.carousel-caption h5 {
    font-family: 'Arial', sans-serif;
    font-size: 24px;
    font-weight: bold;
    color: #ffffff;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
    padding: 5px 10px;
    border-radius: 10px;
}

.carousel-caption p {
    font-family: 'Georgia', serif;
    font-size: 18px;
    font-weight: bold;
    color: #cccccc;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
    padding: 5px 10px;
    border-radius: 10px;
}
    </style>
</head>
<body>
    <div class="carousel-container">
        <div class="carousel" id="carousel" data-images='${JSON.stringify(
          image
        )}'>
            <!-- 这里将通过JavaScript动态插入图片 -->
        </div>
        <div class="carousel-buttons">
            <button class="carousel-button" id="prevBtn">〈</button>
            <button class="carousel-button" id="nextBtn">〉</button>
        </div>
        <div class="carousel-indicators" id="carouselIndicators">
            <!-- 这里将通过JavaScript动态插入指示器 -->
        </div>
        <div class="carousel-title" id="carouselTitle">标题</div>
    </div>

</body>
</html>
`;

function dpush(d, image, http, sui) {
  let Html = getHtml(image);
  let path = getPath("hiker://files/_cache/fy.html");
  writeFile(path, '<!DOCTYPE html><html lang="zh"><body></body></html>');
  let px = fetch("hiker://files/cache/FY/Windh.txt") || "188";
  d.push({
    col_type: "x5_webview_single",
    url: path + "#a=" + sui,
    desc: "list&&" + px,
    extra: {
      js: $.toString((Html) => {
        // 监听窗口大小变化
        window.addEventListener("resize", function () {
          // 获取当前窗口的宽度
          var screenWidth = window.innerWidth;
          // 计算窗口宽度的49%
          var percentageWidth = Math.round(screenWidth * 0.49);
          let path = "hiker://files/cache/FY/Windh.txt";
          fba.writeFile(path, percentageWidth);
        });
        document.documentElement.innerHTML = Html;

        let currentIndex = 0;
        let carouselInterval;

        const carousel = document.getElementById("carousel");
        const carouselIndicators =
          document.getElementById("carouselIndicators");
        const carouselTitle = document.getElementById("carouselTitle");
        let images = JSON.parse(carousel.dataset.images); // 获取初始图片数据

        function updateCarousel() {
          carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
          carouselTitle.textContent = images[currentIndex].title;
          document
            .querySelectorAll(".carousel-indicator")
            .forEach((indicator, index) => {
              indicator.classList.toggle("active", index === currentIndex);
            });
        }

        function createCarousel() {
          carousel.innerHTML = "";
          carouselIndicators.innerHTML = "";

          images.forEach((image, index) => {
            const imgElement = document.createElement("a");
            imgElement.href = `${image.link}#${image.src}#${image.title}#${image.sode}`;
            imgElement.classList.add("carousel-item");
            imgElement.innerHTML = `<img src="${image.src}" alt="${image.title}">`;
            carousel.appendChild(imgElement);

            const indicator = document.createElement("div");
            indicator.classList.add("carousel-indicator");
            indicator.addEventListener("click", () => {
              currentIndex = index;
              updateCarousel();
              resetCarouselInterval();
            });
            carouselIndicators.appendChild(indicator);
          });

          if (currentIndex >= images.length) {
            currentIndex = 0;
          }
          updateCarousel();
          startCarouselInterval();
        }

        function startCarouselInterval() {
          carouselInterval = setInterval(() => {
            currentIndex =
              currentIndex < images.length - 1 ? currentIndex + 1 : 0;
            updateCarousel();
          }, 3000); // 设置自动轮播时间为3秒
        }

        function resetCarouselInterval() {
          clearInterval(carouselInterval);
          startCarouselInterval();
        }

        document.getElementById("prevBtn").addEventListener("click", () => {
          currentIndex =
            currentIndex > 0 ? currentIndex - 1 : images.length - 1;
          updateCarousel();
          resetCarouselInterval();
        });

        document.getElementById("nextBtn").addEventListener("click", () => {
          currentIndex =
            currentIndex < images.length - 1 ? currentIndex + 1 : 0;
          updateCarousel();
          resetCarouselInterval();
        });

        // 初始化轮播图
        createCarousel();
      }, Html),
      urlInterceptor: $.toString(
        (http, game, sui, myurle) => {
          return $.toString(
            (http, game, sui, myurle, input) => {
              let findRule =
                "js:" +
                $$$.toString((http) => {
                  require(http + "ycl.js");
                  erji();
                }, http);

              let pat = input.split("#");
              let title = decodeURIComponent(pat[2]);
              let url = `hiker://empty##${pat[0]}#immersiveTheme##noHistory##autoCache${game}`;
              let img = `${pat[1]}@Referer=`;
              let desc = decodeURIComponent(pat[3]);

              fba.open(
                JSON.stringify({
                  rule: myurle,
                  title: `${title}「${sui}」`,
                  url: url,
                  findRule: findRule,
                  extra: {
                    img: img,
                    title: title,
                    desc: desc,
                  },
                })
              );
            },
            http,
            game,
            sui,
            myurle,
            input
          );
        },
        http,
        game,
        sui,
        MY_RULE.title
      ),
      //cls: "cls_fylunbo",
      ua: MOBILE_UA,
      //imgLongClick: false
    },
  });
}

//首页列表
function xsy(syurl, http, d, sui) {
  MY_URL = getHome(syurl);
  try {
    if (getMyVar("namejs", "null") == "null") {
      eval(
        "var sy = " +
          readFile("hiker://files/cache/FY/sy/" + base64Encode(sui) + ".js", 0)
      );
    } else {
      报错;
    }
  } catch (e) {
    if (MY_URL != "http://fenying") {
      putMyVar("待", "1");
      require(http + "dw.js");
    }
  }
  let 标 = sy.标;
  let 列 = sy.列;
  let 样 = sy.样;
  let 免m = sy.免;
  let 点 = sy.点;
  let 排e = sy.排;
  let 含h = sy.含;
  let yang = eval(样);
  let 排ex = typeof 排 != "undefined" ? 排 : 排e;
  let 排除ex;
  try {
    排除ex =
      排ex != ("undefined" && "")
        ? 排ex
            .replace(/\\/g, "")
            .replace(/;.*/, "")
            .replace(/^\//, "")
            .replace(/\/$/, "")
        : "";
  } catch (e) {
    排除ex = "";
  }
  let 免mx = typeof 免 != "undefined" ? 免 : 免m;
  let 点dj = typeof 点击 != "undefined" ? 点击 : 点;
  let 含bh = typeof 含 != "undefined" ? 含 : 含h;
  let pic = ["10", "175", "145", "159", "341", "104"];
  let xt = getItem("嗅探", "off") == "on";
  let m3u8 = getItem("缓存") == "on" ? true : false;
  let extr;
  if (免mx != ("undefined" && "")) {
    extr = {
      js: $.toString((点击) => {
        if (点击 != ("undefined" && "")) {
          eval(点击.replace(/\'/g, ""));
        }
      }, 点dj),
      videoExcludeRules: [".html", 排除ex],
      videoRules: [".mp3"],
      blockRules: [
        ".m4a",
        ".mp3",
        ".gif",
        ".jpeg",
        ".jpg",
        ".ico",
        ".png",
        "hm.baidu.com",
        "/ads/*.js",
        "cnzz.com",
      ],
      jsLoadingInject: true,
      /*ua: PC_UA,*/
      cacheM3u8: m3u8,
    };
  }

  let lb列 =
    列[0].length != 0
      ? 列[0]
      : 列[1].length != 0
      ? 列[1]
      : 列[2].length != 0
      ? 列[2]
      : 列[3].length != 0
      ? 列[3]
      : 列[4].length != 0
      ? 列[4]
      : 列[5].length != 0
      ? 列[5]
      : 列[6];
  if (lb列 && 标[0] != "禁用" && getItem("轮播", "on") == "on") {
    let image = [];
    // 假设传入的图片数据
    image = lb列.map((item) => {
      // 使用正则表达式分割字符串
      const [title, sode, src, link] = item.split("$");
      return {
        title: title.trim(), // 去除可能的空白字符
        src: src.trim(), // 去除可能的空白字符
        sode: sode.trim(), // 去除可能的空白字符
        link: link.trim(), // 去除可能的空白字符
      };
    });
    dpush(d, image, http, sui);
  } else {
    d.push(
      {
        col_type: "line_blank",
      },
      {
        col_type: "big_blank_block",
      }
    );
  }

  for (let i in 列) {
    if (标[i] != "轮播" && 标[i] != null && 标[i] != "禁用") {
      if (i != 1) {
        d.push(
          {
            col_type: "line_blank",
          },
          {
            col_type: "big_blank_block",
          }
        );
      }
      d.push({
        title: "<b>" + 标[i].replace(/[^\u4e00-\u9fff]/g, "") + "</b>",
        img:
          "https://hikerfans.com/tubiao/more/" + pic[parseInt(i) - 1] + ".png",
        url: "hiker://empty",
        col_type: "avatar",
      });
      try {
        let list = 列[i];
        for (let j of list) {
          let title = j.split("$")[0];
          let desc = j.split("$")[1];
          let img = j.split("$")[2] + "@Referer=";
          let urll = j.split("$")[3];
          let url =
            免mx != ("undefined" && "")
              ? $(urll).lazyRule(
                  (免嗅, 点击, 排除, 包含, xt, http, MY_HOME) => {
                    require(base64Decode(http) + "lazy.js");
                    let 免 = eval(免嗅);
                    if (getMyVar("namejs", "null") == "null") {
                      try {
                        if (/嗅探/.test(免嗅)) {
                          return xt ? video() : lazy(点击, 排除, 包含);
                        } else {
                          return 免(input);
                        }
                      } catch (e) {
                        log(e.toString());
                        return xt ? video() : lazy(点击, 排除, 包含);
                      }
                    } else {
                      if (/嗅探/.test(免嗅)) {
                        return xt ? video() : lazy(点击, 排除, 包含);
                      } else {
                        return 免(input);
                      }
                    }
                  },
                  免mx,
                  点dj,
                  排ex,
                  含bh,
                  xt,
                  base64Encode(http),
                  MY_URL
                )
              : $(
                  "hiker://empty##" +
                    urll +
                    "#immersiveTheme##noHistory##autoCache" +
                    game
                ).rule(() => {
                  require(config.依赖);
                  erji();
                });

          let extra = Object.assign({}, extr, {
            title: title,
            desc: desc,
            img: img,
            inheritTitle: false,
            pageTitle: title + "「" + sui + "」",
          });
          let col =
            typeof 样式 != "undefined"
              ? 样式(标[i])
              : 样 != ""
              ? yang(标[i])
              : /热播|新更|精选|热映|热门|推荐|最近|奈飞|新片|即将/.test(标[i])
              ? "movie_2"
              : "movie_3_marquee";
          d.push({
            title: title,
            desc: desc,
            img: img,
            url: url,
            col_type: col,
            extra: extra,
          });
        }
      } catch (e) {
        log(e.toString());
      }
    }
  }
  d.push({
    title: "‘‘’’<small>－－到\t底\t了－－</small>",
    url: "hiker://empty",
    col_type: "text_center_1",
  });
  deleteItemByCls("cls_load");
  setResult(d);
  if (getMyVar("待") != "1" && getMyVar("换") != sui) {
    putMyVar("换", sui);
    require(http + "dw.js");
  }
}

//分类
function fenlei() {
  require(http + "fenlei.js");
}

//影搜
function yso() {
  require(http + "yso.js");
}

//二级
function erji() {
  require(http + "erji.js");
}

//设置
function she() {
  let d = [];
  d.push({
    col_type: "line_blank",
  });
  let bturl = "https://hikerfans.com/tubiao/q/";
  d.push({
    title: "<b><small>功能</small></b>",
    url: "hiker://empty",
    col_type: "avatar",
    img: bturl + "94.png",
  });

  let ur = "https://hikerfans.com/tubiao/messy/";
  let zd = "https://hikerfans.com/tubiao/system/10.png";
  let coll = "text_icon";

  let 屏 =
    "二级页面顶部以全屏显示，右上角为菜单按钮，设置后，需返回下拉刷新生效。";
  let 记 =
    "开启后，首页会显示历史记录、我的收藏、搜索记录，长按搜索记录清除记录。";
  let 首 = "开启后，随机选择一个站点作为首页。";
  let 轮 = "开启后，首页显示滚动轮播图片。";
  let 失 = "开启会自动检测规则是否失效。";

  let 名称 = ["顶部全屏", "记录收藏", "随机首页", "首页轮播", "检测失效"];
  let 储存 = ["全屏", "记录", "首页", "轮播", "失效"];
  let des = [屏, 记, 首, 轮, 失];

  for (let i in 储存) {
    let 取 = getItem(储存[i], /首页|轮播|失效/.test(储存[i]) ? "on" : "off");
    d.push({
      title: "<b>" + 名称[i] + "</b>",
      url: $("#noLoading#").lazyRule(
        (储存, 取) => {
          if (取 == "on") {
            setItem(储存, "off");
          } else {
            setItem(储存, "on");
          }
          refreshPage(false);
          return "hiker://empty";
        },
        储存[i],
        取
      ),
      img: ur + (/on/.test(取) ? "55.svg" : "63.svg"),
      col_type: coll,
      extra: {
        inheritTitle: false,
        longClick: [
          {
            title: des[i],
            js: $.toString((des) => {
              return "toast://" + des;
            }, des[i]),
          },
        ],
      },
    });
  }

  d.push(
    {
      col_type: "line_blank",
    },
    {
      title: "<b><small>播放</small></b>",
      url: "hiker://empty",
      col_type: "avatar",
      img: bturl + "93.png",
    }
  );

  let 推 = "电视端TVBOX推送，频道查看使用教程。";
  let 嗅 = "开启后，使用播放器自带功能索检视频。";
  let 缓 = "部分视频开启缓存无法播放，自行判断是否开启。";
  let 助 = "调用配置助手。";
  let 断 = "开启后，所有大厂线路都会调用断插、魔断的解析。";
  let 名 =
    getItem("嗅探", "off") == "on"
      ? ["BOX 推送", "VID 嗅探", "M3U8 缓存", "CY 助手"]
      : ["BOX 推送", "VID 嗅探", "DN 断插"];

  let 储 =
    getItem("嗅探", "off") == "on"
      ? ["推送", "嗅探", "缓存", "助手"]
      : ["推送", "嗅探", "断插"];
  let desc = getItem("嗅探", "off") == "on" ? [推, 嗅, 缓, 助] : [推, 嗅, 断];
  for (let j in 名) {
    let 播 = getItem(储[j], "off");
    d.push({
      title: "<b>" + 名[j] + "</b>",
      url: $("#noLoading#").lazyRule(
        (储, 播) => {
          if (播 == "on") {
            clearItem(储);
          } else {
            setItem(储, "on");
          }
          refreshPage(false);
          return "hiker://empty";
        },
        储[j],
        播
      ),
      img: ur + (播 == "on" ? "55.svg" : "63.svg"),
      col_type: coll,
      extra: {
        longClick: [
          {
            title: desc[j],
            js: $.toString((des) => {
              return "toast://" + des;
            }, desc[j]),
          },
        ],
      },
    });
  }

  let ai =
    "开启后，(嗅探时长会增加2-3秒)大厂线路无法播放时，会自动调用断插、魔断的解析。";
  if (getItem("断插", "off") == "off" && getItem("嗅探", "off") == "off") {
    clearItem("AID");
    let Ai = getItem("AI", "off");
    d.push({
      title: "<b>A I 断插</b>",
      url: $("#noLoading#").lazyRule((Ai) => {
        if (Ai == "off") {
          setItem("AI", "on");
        } else {
          clearItem("AI");
        }
        refreshPage(false);
        return "hiker://empty";
      }, Ai),
      img: ur + (Ai == "on" ? "55.svg" : "63.svg"),
      col_type: coll,
      extra: {
        longClick: [
          {
            title: ai,
            js: $.toString((des) => {
              return "toast://" + des;
            }, ai),
          },
        ],
      },
    });
  } else {
    setItem("AID", "off");
  }
  d.push(
    {
      col_type: "line_blank",
    },
    {
      title: "<b><small>配置</small></b>",
      url: "hiker://empty",
      col_type: "avatar",
      img: bturl + "106.png",
    },
    {
      title: "<b>影源管理</b>",
      pic: zd,
      url: $("hiker://empty#noRecordHistory##noHistory##noRefresh#").rule(
        () => {
          require(config.依赖);
          Yygl();
        }
      ),
      col_type: coll,
      extra: {
        newWindow: true,
        windowId: MY_RULE.title + "影源管理",
        inheritTitle: false,
        longClick: [
          {
            title: "视频源 编辑，分享，删除 等管理。",
            js: $.toString(() => {
              return "toast://视频源 编辑，分享，删除 等管理。";
            }),
          },
        ],
      },
    }
  );

  let zs = "配置助手设置，频道查看设置教程。";
  if (getItem("嗅探", "off") == "on") {
    d.push({
      title: "<b>助手配置</b>",
      img: zd,
      url: $("hiker://empty#noRecordHistory##noHistory#").rule(() => {
        try {
          eval(
            JSON.parse(
              request("hiker://page/home?rule=配置助手&type=设置#noHistory#")
            ).rule
          );
        } catch (e) {
          back(false);
          toast("未找到配置助手");
        }
      }),
      col_type: coll,
      extra: {
        inheritTitle: false,
        longClick: [
          {
            title: zs,
            js: $.toString((des) => {
              return "toast://" + des;
            }, zs),
          },
        ],
      },
    });
  } else {
    let title = ["断插接口", "断插配置"];
    let url = ["编辑", "设置"];
    for (let i in url) {
      d.push({
        title: "<b>" + title[i] + "</b>",
        img: zd,
        url:
          "hiker://page/Route?rule=MyFieldᴰⁿ&type=" +
          url[i] +
          "#noHistory##noRecordHistory#",
        col_type: coll,
        extra: {
          inheritTitle: false,
        },
      });
    }
  }

  let ips = "TVBOX推送IP设置，频道查看设置教程";
  let ip = /海阔/.test(MY_NAME) ? "http://" + getIP() + ":9978" : "http://";
  if (getItem("推送", "off") == "on") {
    d.push({
      title: "<b>TV BOX</b>\t\t<small>" + getItem("ip", ip) + "</small>",
      url: $(getItem("ip", ip), "TVBOX推送IP").input(() => {
        setItem("ip", input);
        refreshPage(false);
      }),
      img: http + "tu/ip.png",
      col_type: coll,
      extra: {
        longClick: [
          {
            title: ips,
            js: $.toString((des) => {
              return "toast://" + des;
            }, ips),
          },
        ],
      },
    });
  } else {
    clearItem("ip");
  }
  d.push(
    {
      col_type: "line_blank",
    },
    {
      title: "<b><small>更新</small></b>",
      url: "hiker://empty",
      col_type: "avatar",
      img: bturl + "97.png",
    },
    {
      title: "<b>自动更新</b>",
      url: $("#noLoading#").lazyRule(() => {
        if (getItem("自动", "on") == "on") {
          setItem("自动", "off");
        } else {
          clearItem("自动");
        }
        refreshPage(false);
        return "hiker://empty";
      }),
      img: ur + (getItem("自动", "on") == "on" ? "55.svg" : "63.svg"),
      col_type: coll,
    }
  );

  let 检 = "手动检测更新，无需频繁点击，频繁点击会禁用检测更新。";
  let item =
    CT >
    parseInt(getMyVar("时间", "0").replace("CT", "")) + 0.2 * 60 * 60 * 1000;
  d.push(
    {
      title: "<b>检测更新</b>",
      url: $("#noLoading#").lazyRule(
        (CT, item) => {
          let toa;
          if (item) {
            putMyVar("时间", CT);
            putMyVar("手动", "1");
            require(config.依赖);
            gx();
            toa = "hiker://empty";
          } else {
            toa = "toast://检测更新过于频繁，已禁止检测";
          }
          refreshPage(false);
          return toa;
        },
        CT + "CT",
        item
      ),
      img: ur + "119.svg",
      col_type: coll,
      extra: {
        longClick: [
          {
            title: 检,
            js: $.toString((des) => {
              return "toast://" + des;
            }, 检),
          },
        ],
      },
    },
    {
      col_type: "line_blank",
    },
    {
      title: "<b><small>其它</small></b>",
      img: bturl + "92.png",
      url: "hiker://empty",
      col_type: "avatar",
    }
  );

  let 当前;
  let 日期;
  let 内容;
  try {
    eval(
      "let Changelog = " + readFile("hiker://files/cache/FY/Changelog.js"),
      0
    );
    当前 = Changelog[0].版本;
    日期 = Changelog[0].日期;
    内容 = Changelog[0].内容;
  } catch (e) {
    当前 = "1.0";
    日期 = "2022-08-06";
    内容 = "1. 风影初始版本。";
  }

  function about(http, CT, 当前) {
    let d = [];
    d.push(
      {
        url: "hiker://empty",
        col_type: "card_pic_3",
        extra: {
          longClick: [
            {
              title:
                getItem("隐藏", "off") == "on"
                  ? "私有：当前已开启"
                  : "私有：当前已关闭",
              js: $.toString(() => {
                let 隐 = getItem("隐藏", "off");
                if (隐 == "on") {
                  clearItem("隐藏");
                } else {
                  setItem("隐藏", "on");
                }
                refreshPage(false);
                return 隐 == "off" ? "toast://已开启" : "toast://已关闭";
              }),
            },
          ],
        },
      },
      {
        title: "‘‘’’<b>版本: " + 当前 + "</b>",
        url: "hiker://empty",
        img: base64Decode(http) + "tu/fytb.jpg",
        col_type: "card_pic_3_center",
      },
      {
        col_type: "line_blank",
      }
    );

    let items =
      CT >
      parseInt(getItem("强时", "0").replace("CT", "")) + 6 * 60 * 60 * 1000;
    d.push(
      {
        title: "<b>强制更新</b>",
        url: $("#noLoading#").lazyRule(
          (items, CT) => {
            if (items) {
              confirm({
                title: "重要提示",
                content:
                  "强制更新专为小程序无法更新或更新异常时使用(更新完成需返回首页刷新页面)\n确认将会清除全部数据",
                confirm: $.toString((CT) => {
                  setItem("强时", CT);
                  putMyVar("强制", "1");
                  require(config.依赖);
                  gx();
                  refreshPage(false);
                }, CT),
                cancel: $.toString(() => {
                  toast("强制更新取消");
                }),
              });
              toa = "hiker://empty";
            } else {
              toa = "toast://强制更新为备用，已禁用";
            }
            return toa;
          },
          items,
          CT + "CT"
        ),
        img: "https://hikerfans.com/tubiao/messy/156.svg",
        col_type: "text_icon",
      },
      {
        col_type: "line_blank",
      },
      {
        title: "‘‘’’<b>免责声明</b>",
        url: "hiker://empty",
        col_type: "text_1",
        extra: {
          lineVisible: false,
        },
      },
      {
        title:
          "1、小程序数据内容均来源于互联网，经软件对原网页源码重新排版后显示，此小程序与海阔不参与任何制作、上传、储存等内容，其显示的所有内容与视频，其版权均归原网站作者所有。<br>2、此小程序代码内容仅供爱好者学习与交流使用，禁止用于其他用途，请于导入后24小时内删除，请勿传播！<br>3、因使用此小程序产生的版权问题，软件开发者与此小程序作者概不负责。<br>4、请勿相信网页或者视频中的任何广告，切记！！！",
        col_type: "rich_text",
        extra: {
          textSize: "13",
        },
      }
    );
    setResult(d);
  }

  let tile = ["其它规则", "反馈问题", "关于风影", "清除数据"];
  let 规则 = $("hiker://empty#noRecordHistory##noHistory##noRefresh#").rule(
    (http) => {
      let d = [];
      http = base64Decode(http);
      let tit = ["追更周历"];
      let img = [
        "https://img.shouji.com.cn/simg/20181012/2018101202191101.png",
      ];
      let url = ["云6oooole/xxxxxx/zlrx38rtr84j8ole"];
      let pic = ["tu/pic/zgzl1.jpg##tu/pic/zgzl2.jpg"];
      for (let i in tit) {
        d.push({
          title: "<b>" + tit[i] + "<b/>",
          desc: "<b>导入<b/>\t",
          img: img[i],
          url: parsePaste(url[i]),
          col_type: "avatar",
        });

        for (let li of pic[i].split("##")) {
          d.push({
            img: http + li,
            url: http + li,
            col_type: "pic_2_card",
          });
        }
        d.push({
          col_type: "line",
        });
      }
      setResult(d);
    },
    base64Encode(http)
  );

  let 反馈 = $("hiker://empty#noRecordHistory##noHistory##noRefresh#").rule(
    (http) => {
      let d = [];
      http = base64Decode(http);
      d.push(
        {
          col_type: "rich_text",
        },
        {
          url: "hiker://empty",
          col_type: "card_pic_3",
        },
        {
          img: http + "tu/fyq.jpg",
          url: http + "tu/fyq.jpg",
          col_type: "card_pic_3",
        },
        {
          col_type: "rich_text",
        },
        {
          title:
            "扫一扫上方二维码加入反馈群或点击 <a href = 'https://h5.qun.qq.com/s/md75B8VrlC'> 群① </a>加入！",
          col_type: "rich_text",
        }
      );
      setResult(d);
    },
    base64Encode(http)
  );

  let 关于 = $("hiker://empty#noRecordHistory##noHistory##noRefresh#").rule(
    (about, CT, http, 当前) => {
      about(http, CT, 当前);
    },
    about,
    CT,
    base64Encode(http),
    当前
  );

  let itemi =
    CT > parseInt(getItem("时", "0").replace("CT", "")) + 24 * 60 * 60 * 1000;

  let 清除 = $("#noLoading#").lazyRule(
    (item, CT) => {
      if (item) {
        return $("确认清除二级页面缓存数据？").confirm((CT) => {
          putMyVar("清除", "1");
          setItem("时", CT);
          require(config.依赖);
          gx();
          refreshPage(false);
          return "hiker://empty";
        }, CT);
      } else {
        refreshPage(false);
        return "toast://清除完成";
      }
    },
    itemi,
    CT + "CT"
  );
  let urlg = [规则, 反馈, 关于, 清除];
  let png = ["tu/zhuan.png", "tu/qing.png"];
  let 清 =
    "清除二级页面缓存数据，首页缓存不会清除(不要频繁清除，清除后进入二级会变慢)，每隔15天自动清除一次，首页缓存每隔60天清除一次。";

  for (let i in tile) {
    let extra =
      i == 3
        ? {
            longClick: [
              {
                title: 清,
                js: $.toString((des) => {
                  return "toast://" + des;
                }, 清),
              },
            ],
          }
        : {
            inheritTitle: false,
          };
    d.push({
      title: "<b>" + tile[i] + "</b>",
      url: urlg[i],
      col_type: coll,
      img: i == 3 ? http + "tu/qing.png" : zd,
      extra: extra,
    });
  }

  d.push(
    {
      col_type: "line_blank",
    },
    {
      title: "<b>版本: " + 当前 + "</b>",
      desc: "➮\t\t",
      img: http + "tu/fytb.jpg",
      url: $("#noLoading#").lazyRule(() => {
        const hikerPop = $.require(
          "http://hiker.nokia.press/hikerule/rulelist.json?id=6966"
        );
        let rlog = JSON.parse(readFile("hiker://files/cache/FY/Changelog.js"));

        function transformData(data) {
          return data.map((item) => {
            let records = [];
            let nr = item.内容.split("\n");
            for (let i in nr) {
              let li = nr[i];
              if (
                li.includes("修复") ||
                li.includes("修改") ||
                li.includes("bug") ||
                li.includes("BUG")
              ) {
                records.push(`${li.replace(/\d+\.\s+/g, "‘‘修复：’’")}`);
              } else if (
                li.includes("新增") ||
                li.includes("增加") ||
                li.includes("添加") ||
                li.includes("加入")
              ) {
                records.push(`${li.replace(/\d+\.\s+/g, "““新增：””")}`);
              } else {
                records.push(`${li.replace(/\d+\.\s+/g, "优化：")}`);
              }
            }
            return {
              title: ` V ${item.版本}    ${item.日期}`,
              records: records,
            };
          });
        }
        const formData = transformData(rlog);
        let pop = hikerPop.updateRecordsBottom(formData);
        return "hiker://empty";
      }),
      col_type: "avatar",
    }
  );

  d.push(
    {
      title:
        "<b>更新日期：" +
        日期 +
        "<small>\t\t\tBy\t随风</small></b>" +
        内容.replace("1. ", "<br>1. ").replace(/\n/g, "<br>") +
        "<br>注：风影从未添加过任何广告，近期有某些添加广告，改名的小程序，那不是风影本影！！！".fontcolor(
          "#ff1100"
        ),
      col_type: "rich_text",
      extra: {
        textSize: "12",
      },
    },
    {
      col_type: "line",
    },
    {
      title: "<br>",
      col_type: "rich_text",
    }
  );
  setResult(d);
}

//追更
function Wp() {
  require(http + "Wp.js");
}

//影源
function Yygl() {
  require(http + "yygl.js");
}

//新增源
function Add() {
  require(http + "add.js");
}

//导入确认

//搜索
function sou() {
  let d = [];
  let input = MY_URL.split("##")[1];
  d.push({
    title: "搜索\t" + input,
    url: $("hiker://empty#noRecordHistory##noHistory#fypage").rule((input) => {
      putMyVar("Mysou", input);
      require(config.依赖);
      yso();
    }, input),
    col_type: "text_1",
    extra: {
      erji: "1",
    },
  });
  setResult(d);
}
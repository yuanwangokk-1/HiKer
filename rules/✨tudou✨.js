const csdown = {
  d: [],
  title: "土豆Vlog",
  author: "Aries",
  version: "20250922",
  movie_new: function () {
    var d = this.d;
    let pg = MY_PAGE;
    try {
      const date = new Date();
      const year = date.getFullYear();
      putMyVar("movie_year_index", year);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      putMyVar("movie_month_index", month);
      const day = String(date.getDate()).padStart(2, "0");
      putMyVar("movie_day_index", day);
      d.push(
        {
          title: "",
          col_type: "rich_text",
        },
        {
          title: "““每日精选””",
          url: "hiker://empty",
          col_type: "text_center_1",
          extra: {
            lineVisible: false,
          },
        },
        {
          title: getMyVar("movie_year", getMyVar("movie_year_index")),
          url: $("#noLoading#").lazyRule(() => {
            function getYearsFrom2025ToCurrent() {
              const currentYear = new Date().getFullYear();
              const startYear = 2025;
              // 如果当前年份小于2025年，则返回空数组
              if (currentYear < startYear) {
                return [];
              }
              // 生成年份数组
              const years = [];
              for (let year = startYear; year <= currentYear; year++) {
                years.push(year + "");
              }
              return years;
            }
            let year = getYearsFrom2025ToCurrent();
            let Line = {
              title: "切换年份",
              options: year,
              selectedIndex: year.indexOf(
                getMyVar("movie_year", getMyVar("movie_year_index"))
              ),
              col: 1,
              js: $.toString(() => {
                putMyVar("movie_year", input);
                refreshPage(false);
              }),
            };
            return "select://" + JSON.stringify(Line);
          }),
          col_type: "text_3",
        },
        {
          title: getMyVar("movie_month", getMyVar("movie_month_index")),
          url: $("#noLoading#").lazyRule(() => {
            let month = Array.from(
              {
                length: 12,
              },
              (_, i) => (i + 1).toString().padStart(2, "0")
            );
            let Line = {
              title: "切换月份",
              options: month,
              selectedIndex: month.indexOf(
                getMyVar("movie_month", getMyVar("movie_month_index"))
              ),
              col: 2,
              js: $.toString(() => {
                putMyVar("movie_month", input);
                refreshPage(false);
              }),
            };
            return "select://" + JSON.stringify(Line);
          }),
          col_type: "text_3",
        },
        {
          title: getMyVar("movie_day", getMyVar("movie_day_index")),
          url: $("#noLoading#").lazyRule(() => {
            function getDaysInMonth(year, month) {
              const lastDay = new Date(year, month, 0);
              const daysInMonth = lastDay.getDate();

              return Array.from(
                {
                  length: daysInMonth,
                },
                (_, i) => String(i + 1).padStart(2, "0")
              );
            }
            let day = getDaysInMonth(
              getMyVar("movie_year", getMyVar("movie_year_index")),
              getMyVar("movie_month", getMyVar("movie_month_index"))
            );
            let Line = {
              title: "切换日期",
              options: day,
              selectedIndex: day.indexOf(
                getMyVar("movie_day", getMyVar("movie_day_index"))
              ),
              col: 3,
              js: $.toString(() => {
                putMyVar("movie_day", input);
                refreshPage(false);
              }),
            };
            return "select://" + JSON.stringify(Line);
          }),
          col_type: "text_3",
        }
      );
      let tuijian = this.post(
        "movie/tuijian/1/10/time",
        JSON.stringify({
          creattime:
            getMyVar("movie_year", getMyVar("movie_year_index")) +
            "-" +
            getMyVar("movie_month", getMyVar("movie_month_index")) +
            "-" +
            getMyVar("movie_day", getMyVar("movie_day_index")),
        })
      ).list;
      tuijian.forEach((item) => {
        let movie = item.movie;
        d.push({
          title: movie.title,
          desc:
            movie.creatTime.slice(0, 10) + "              " + movie.duration,
          img: this.images(movie.imgurl),
          url: movie.movieurl,
          col_type: "movie_2",
          extra: {
            cls: "movie_cmlist",
            movie_id: movie.id,
            movie_name: movie.title,
            movie_user: item.movieUser.id,
            longClick: [
              {
                title: "演员：" + item.movieUser.name,
                js: $.toString(() => {
                  return $(
                    "hiker://empty?page=fypage&#immersiveTheme#&#noHistory#"
                  ).rule(() => {
                    $.require("csdown").movie_user();
                  });
                }),
              },
            ],
          },
        });
      });
    } catch (e) {
      d.push({
        title: "未获取到数据",
        col_type: "text_center_1",
        extra: {
          lineVisible: false,
        },
      });
    }
    setResult(d);
  },
  home: function () {
    var d = this.d;
    if (MY_PAGE == 1) {
      d.push({
        title: "搜索 ",
        url: $.toString(() => {
          putMyVar("keyword", input);
          return $("hiker://empty?page=fypage&#gameTheme#").rule(() => {
            $.require("csdown").search();
          });
        }),
        desc: "请输入搜索关键词",
        col_type: "input",
        extra: {
          defaultValue: getMyVar("keyword", ""),
          onChange: $.toString(() => {
            putMyVar("keyword", input);
          }),
        },
      });
    }
    let pg = getParam("page");
    let 首页 = [
      {
        title: "漫画&小说&视频&色图&精品小说",
        id: "1&2&3&4&5",
        img: "https://raw.githubusercontent.com/ls125781003/tubiao/main/more/47.png&https://raw.githubusercontent.com/ls125781003/tubiao/main/more/175.png&https://raw.githubusercontent.com/ls125781003/tubiao/main/more/78.png&https://raw.githubusercontent.com/ls125781003/tubiao/main/more/48.png&https://raw.githubusercontent.com/ls125781003/tubiao/main/more/109.png",
      },
    ];
    if (MY_PAGE == 1) {
      this.Cate(首页, "首页", d, "icon_5");
      d.push(
        {
          col_type: "big_blank_block",
        },
        {
          col_type: "big_blank_block",
        }
      );
    }
    let 分类 = getMyVar("首页", "1");
    if (MY_RULE.author == this.author || MY_NAME == "嗅觉浏览器") {
      if (分类 == 1) {
        this.comic();
      } else if (分类 == 2) {
        this.book();
      } else if (分类 == 3) {
        this.movie();
      } else if (分类 == 4) {
        this.pic();
      } else if (分类 == 5) {
        this.novel();
      }
    } else {
      d.push({
        title: "请勿修改作者名称",
        url: "hiker://empty",
        col_type: "text_center_1",
      });
    }
    setResult(d);
  },
  color: function (txt) {
    return "<b><font color=" + "#FF6699" + ">" + txt + "</font></b>";
  },
  strong: function (d, c) {
    return (
      "‘‘’’<strong><font color=#" +
      (c || "000000") +
      ">" +
      d +
      "</font></strong>"
    );
  },
  addressTag: function (url, text) {
    return "<a href='" + url + "'>" + text + "</a>";
  },
  // 随机字符串方法
  generateRandomHex: function (length) {
    var result = "";
    var characters = "0123456789abcdef";
    for (var i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  },
  Cate: function (list, n, d, col, longclick) {
    col = col || "scroll_button";
    longclick = longclick || [];
    let index_n = list[0].id.split("&")[0] + "";
    list.forEach((data) => {
      let title = data.title.split("&");
      let id = data.id.split("&");
      let img;
      if (data.img != null) {
        img = data.img.split("&");
      } else {
        img = [];
      }
      let n_ = getMyVar(n, index_n);
      title.forEach((title, index) => {
        d.push({
          title: n_ == id[index] ? this.strong(title, "FF6699") : title,
          img: img[index],
          url: $("#noLoading#").lazyRule(
            (n, title, id) => {
              putMyVar(n, id);
              refreshPage(false);
              return "hiker://empty";
            },
            n,
            title,
            id[index] + ""
          ),
          col_type: col,
          extra: {
            longClick: longclick,
            backgroundColor: n_ == id[index] ? "#20FA7298" : "",
          },
        });
      });
      d.push({
        col_type: "blank_block",
      });
    });
    return d;
  },
  image: function (pic) {
    const CryptoUtil = $.require("hiker://assets/crypto-java.js");
    if (pic.includes(".bnc")) {
      let key = CryptoUtil.Data.parseUTF8("525202f9149e061d");
      let textData = CryptoUtil.Data.parseInputStream(input);
      let encrypted = CryptoUtil.AES.decrypt(textData, key, {
        mode: "AES/ECB/Pkcs7Padding",
      });
      return encrypted.toInputStream();
    } else if (pic.includes(".html")) {
      let textData = CryptoUtil.Data.parseInputStream(input);
      let base64Text = textData.toString();
      let encrypted0 = CryptoUtil.Data.parseBase64(base64Text, _base64.NO_WRAP);
      return encrypted0.toInputStream();
    } else {
      let javaImport = new JavaImporter();
      javaImport.importPackage(Packages.com.example.hikerview.utils);
      with (javaImport) {
        // 1. InputStream → byte[]
        let bytes = FileUtil.toBytes(input);
        // 2. 解密逻辑（只异或前 100 字节）
        function decryptData(data) {
          let key = "2019ysapp7527".split("").map((c) => c.charCodeAt(0));
          let keyLen = key.length;
          let limit = Math.min(100, data.length);
          for (let i = 0; i < limit; i++) {
            data[i] = data[i] ^ key[i % keyLen];
          }
          return data;
        }
        bytes = decryptData(bytes);
        // 3. byte[] → InputStream
        return FileUtil.toInputStream(bytes);
      }
    }
  },
  images: function (pic) {
    return $(pic).image((pic) => {
      return $.require("csdown?rule=" + MY_TITLE).image(pic);
    }, pic);
  },
  setDesc: function (d, desc, num) {
    //log(desc)
    if (desc == undefined) {
      return;
    }
    desc = desc.constructor == Array ? desc.join("<br>") : desc;
    if (desc.replace(/(<br>|\s+|<\/?p>|&nbsp;)/g, "").length == 0) {
      return;
    }
    const mark = "desc";
    num = typeof num == "undefined" ? 45 : num;
    desc = desc.startsWith("　　") ? desc : "　　" + desc;
    desc = desc.replace(/'/g, "&#39;");
    desc = desc.replace(/\r\n/g, "<br>");
    desc = desc.replace(/\r/g, "<br>");
    desc = desc
      .replace(/\n/g, "<br>")
      .replace(/[<p>|</p>]/g, "")
      .replace(/br/g, "<br>");

    function substr(str, maxLength) {
      let len = 0;
      for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
          len += 2;
        } else {
          len++;
        }
        if (len > maxLength) {
          return str.slice(0, i) + "...";
        }
      }
      return str;
    }
    let sdesc = substr(desc, num);
    var colors = {
      show: "black",
      hide: "grey",
    };
    var lazy = $(`#noLoading#`).lazyRule(
      (dc, sdc, m, cs) => {
        var show = storage0.getItem(m, "0");
        var title = findItem("desc").title;
        var re = /(<\/small><br>.*?>).+/g;
        var exp = "展开:";
        var ret = "收起:";
        if (show == "1") {
          updateItem("desc", {
            title: title
              .replace(ret, exp)
              .replace(re, "$1" + sdc + "</small>")
              .replace(
                /(<\/small><br>\<font color=").*?(">)/,
                "$1" + cs.hide + "$2"
              ),
          });
          storage0.setItem(m, "0");
        } else {
          updateItem("desc", {
            title: title
              .replace(exp, ret)
              .replace(re, "$1" + dc + "</small>")
              .replace(
                /(<\/small><br>\<font color=").*?(">)/,
                "$1" + cs.show + "$2"
              ),
          });
          storage0.setItem(m, "1");
        }
        return `hiker://empty`;
      },
      desc,
      sdesc,
      mark,
      colors
    );
    var sc = storage0.getItem(mark, "0") == "0" ? "展开:" : "收起:";
    var dc = storage0.getItem(mark, "0") == "0" ? sdesc : desc;
    var cs = storage0.getItem(mark, "0") == "0" ? colors.hide : colors.show;
    d.push({
      title:
        "" +
        '<b><font color="#098AC1">∷剧情简介	</font></b>' +
        "<small><a style='text-decoration: none;' href='" +
        lazy +
        "'>" +
        sc +
        '</a></small><br><font color="' +
        cs +
        '">' +
        `${dc}` +
        "</small>",
      col_type: "rich_text",
      extra: {
        id: "desc",
        lineSpacing: 6,
        textSize: 15,
        lineVisible: true,
      },
    });
  },
  banner: function (title, start, arr, data, cfg) {
    let id = title + "lunbo";
    var rnum = Math.floor(Math.random() * data.length);
    var item = data[rnum];
    putMyVar("rnum", rnum);
    let time = 5000;
    let col_type = "pic_1_card";
    let color = "white";
    let desc = "";
    if (cfg != undefined) {
      time = cfg.time ? cfg.time : time;
      col_type = cfg.col_type ? cfg.col_type : col_type;
      desc = cfg.desc ? cfg.desc : desc;
    }

    arr.push({
      col_type: col_type,
      img: item.img,
      desc: desc,
      title: item.name,
      url: item.url,
      extra: {
        id: id + "bar",
        movie_id: item.id,
        movie_name: item.name,
        movie_user: item.movie_user,
        longClick: [
          {
            title: item.movie_user_name,
            js: $.toString(() => {
              return $(
                "hiker://empty?page=fypage&#immersiveTheme#&#noHistory#"
              ).rule(() => {
                $.require("csdown").movie_user();
              });
            }),
          },
        ],
      },
    });

    if (start == false || getMyVar("benstart", "true") == "false") {
      unRegisterTask(id);
      return;
    }

    //log(data)

    let obj = {
      data: data,
    };

    registerTask(
      id,
      time,
      $.toString(
        (obj, id) => {
          var data = obj.data;
          var rum = getMyVar("rnum");

          var i = Number(getMyVar("banneri", "0"));
          if (rum != "") {
            i = Number(rum) + 1;
            clearMyVar("rnum");
          } else {
            i = i + 1;
          }
          //log(i)
          //log(data.length)

          if (i > data.length - 1) {
            i = 0;
          }
          var item = data[i];
          //log(item)
          try {
            updateItem(id + "bar", {
              title: item.name,
              img: item.img,
              url: item.url,
              extra: {
                //name: item.title.replace(/<[^>]+>/g, ''),
                //sname: item.extra.sname,
                //stype: item.extra.stype,
                //surl: item.url,
                //img:item.img,
                //title: item.title.replace(/<[^>]+>/g, ''),
                movie_id: item.id,
                movie_name: item.name,
                movie_user: item.movie_user,
                longClick: [
                  {
                    title: item.movie_user_name,
                    js: $.toString(() => {
                      return $(
                        "hiker://empty?page=fypage&#immersiveTheme#&#noHistory#"
                      ).rule(() => {
                        $.require("csdown").movie_user();
                      });
                    }),
                  },
                ],
              },
            });
          } catch (e) {
            log(e.message);
            unRegisterTask(id);
          }
          putMyVar("banneri", i);
        },
        obj,
        id
      )
    );
  },
  post: function (url, body) {
    body = body || "";
    let data = JSON.parse(
      fetch(getItem("host") + url, {
        headers: {
          token: getItem("token"),
        },
        body: body,
        method: body == "" ? "GET" : "POST",
      })
    ).data;
    return data;
  },
  shsort: function () {
    let shsort = getMyVar("shsort");
    putMyVar("shsort", shsort == "1" ? "0" : "1");
    shsort = getMyVar("shsort");
    try {
      let urls = findItemsByCls("选集_") || [];
      deleteItemByCls("选集_");
      urls.reverse();
      urls.forEach((item) => {
        item.col_type = item.type;
      });
      updateItem("排序", {
        title:
          shsort == "1"
            ? '““””<b><span style="color: #FF0000">逆序</span></b>'
            : '““””<b><span style="color: #1aad19">正序</span></b>',
      });
      addItemAfter("排序", urls);
      toast("切换排序成功");
    } catch (e) {
      refreshPage(false);
    }
    return "hiker://empty";
  },
  comic: function () {
    var d = this.d;
    try {
      if (MY_PAGE == 1) {
        if (!storage0.getMyVar("comic_fenlei")) {
          let fenlei = this.post("manhua/fenglei");
          storage0.putMyVar("comic_fenlei", fenlei);
        }
        let fenlei = storage0.getMyVar("comic_fenlei");
        putMyVar("comic_index", fenlei[0].id + "");
        let comic_ = getMyVar("comic", getMyVar("comic_index"));
        fenlei.forEach((data) => {
          d.push({
            title:
              comic_ == data.id ? this.strong(data.name, "ff6699") : data.name,
            url: $("#noLoading#").lazyRule(
              (n, name, id) => {
                putMyVar(n, id);
                refreshPage(false);
                return "hiker://empty";
              },
              "comic",
              data.name,
              data.id
            ),
            col_type: "scroll_button",
            extra: {
              backgroundColor: comic_ == data.id ? "#20FA7298" : "",
            },
          });
        });
        if (comic_ == getMyVar("comic_index")) {
          d.push({
            title: this.color("每天更新"),
            desc: "查看更多",
            img: "https://igtcqqindd4.icu/h5/static/img-manhua/mhnew.png",
            url: $("hiker://empty?page=fypage&#gameTheme#&noHistory#").rule(
              () => {
                $.require("csdown").comic_new();
              }
            ),
            col_type: "avatar",
            extra: {},
          });
          let everyday = this.post("manhua/everyday/1/10/time").records;
          everyday.forEach((data) => {
            d.push({
              title: data.title,
              desc: "共" + data.zhangjieNum + "话",
              img: this.images(data.imgurl),
              url: $("hiker://empty?#immersiveTheme#").rule(() => {
                $.require("csdown").comic_detail();
              }),
              col_type: "movie_3",
              extra: {
                comic_id: data.id,
                comic_name: data.title,
              },
            });
          });
        }
        let list = this.post("manhua/fengleidata/" + comic_);
        list.forEach((data) => {
          let zhuti = data.zhuti;
          d.push({
            title: zhuti.name,
            desc: "查看更多",
            img: "https://igtcqqindd4.icu/h5/static/img-manhua/mhhot.png",
            url: $("hiker://empty?page=fypage&#gameTheme#&noHistory#").rule(
              () => {
                $.require("csdown").comic_more();
              }
            ),
            col_type: "avatar",
            extra: {
              zhuti_id: zhuti.id,
              zhuti_name: zhuti.name,
            },
          });
          let comic_list = data.list;
          comic_list.forEach((item) => {
            d.push({
              title: item.title,
              desc: "共" + item.zhangjieNum + "话",
              img: this.images(item.imgurl),
              url: $("hiker://empty?#immersiveTheme#").rule(() => {
                $.require("csdown").comic_detail();
              }),
              col_type: "movie_3",
              extra: {
                comic_id: item.id,
                comic_name: item.title,
              },
            });
          });
        });
      }
    } catch (e) {
      log(e.message);
      if (!getMyVar("a", "")) {
        //https://igtcqqindd4.icu/h5/#/?cid=td
        let host_ = "https://igtcqqindd4.icu/jbapi/user/autoUser/null/td/null";
        let token = JSON.parse(fetch(host_)).data.token;
        setItem("token", token);
        let host = "https://igtcqqindd4.icu/jbapi/";
        setItem("host", host);
        toast("已更新域名");
        refreshPage(false);
        putMyVar("a", "1");
      }
    }
  },
  comic_more: function () {
    var d = this.d;
    let pg = MY_PAGE;
    let id = MY_PARAMS.zhuti_id;
    let name = MY_PARAMS.zhuti_name;
    try {
      if (MY_PAGE == 1) {
        d.push(
          {
            title: "",
            col_type: "rich_text",
          },
          {
            title: "““" + name + "””",
            url: "hiker://empty",
            col_type: "text_center_1",
            extra: {
              lineVisible: false,
            },
          }
        );
      }
      let more = this.post(
        "manhua/moredata/" + id + "/" + pg + "/15/time"
      ).records;
      more.forEach((data) => {
        d.push({
          title: data.title,
          desc: "共" + data.zhangjieNum + "话",
          img: this.images(data.imgurl),
          url: $("hiker://empty?#immersiveTheme#").rule(() => {
            $.require("csdown").comic_detail();
          }),
          col_type: "movie_3",
          extra: {
            comic_id: data.id,
            comic_name: data.title,
          },
        });
      });
    } catch (e) {
      log(e.message);
    }
    setResult(d);
  },
  comic_detail: function () {
    var d = this.d;
    let id = MY_PARAMS.comic_id;
    let name = MY_PARAMS.comic_name;
    setPageTitle(name);
    try {
      let data = this.post("manhua/data/" + id);
      let manhua = data.manhua;
      d.push({
        title: manhua.title,
        desc:
          "共" +
          manhua.zhangjieNum +
          "话 " +
          manhua.creatTime +
          "\n" +
          JSON.parse(manhua.marks).join(" "),
        img: this.images(manhua.imgurl),
        url: this.images(manhua.imgurl + "#.jpg#"),
        col_type: "movie_1_vertical_pic_blur",
      });
      this.setDesc(d, manhua.miaoshu);
      d.push({
        title:
          getMyVar("shsort", "0") == "1"
            ? '““””<b><span style="color: #FF0000">逆序</span></b>'
            : '““””<b><span style="color: #1aad19">正序</span></b>',
        url: $("#noLoading#").lazyRule(() => {
          return $.require("csdown").shsort();
        }),
        col_type: "text_center_1",
        extra: {
          id: "排序",
          lineVisible: false,
          longClick: [
            {
              title: "当前样式：" + getItem("pic_col_type", "text_2"),
              js: $.toString(() => {
                //let options = ['text_1', 'text_2', 'text_3', 'text_4', 'text_center_1', 'avatar', 'text_icon', 'icon_1_left_pic'];
                //log(getColTypes())
                let options = getColTypes();
                let Line = {
                  title: "切换样式",
                  options: options,
                  selectedIndex: options.indexOf(
                    getItem("pic_col_type", "text_2")
                  ),
                  col: 2,
                  js: $.toString((options) => {
                    setItem("pic_col_type", input);
                    refreshPage(false);
                    toast("样式切换为：" + input);
                  }, options),
                };
                return "select://" + JSON.stringify(Line);
              }),
            },
          ],
        },
      });
      let zhangjie = data.zhangjie;
      if (getMyVar("shsort", "0") == "1") {
        zhangjie.reverse();
      }
      zhangjie.forEach((data) => {
        d.push({
          title: data.name,
          img: this.images(manhua.imgurl),
          url: this.comics(data.id),
          col_type: getItem("pic_col_type", "text_2"),
          extra: {
            cls: "选集_",
            lineVisible: false,
          },
        });
      });
      d.push(
        {
          col_type: "blank_block",
          extra: {
            id: "blank",
          },
        },
        {
          title: '<b><span style="color: #ff847c">推荐</span></b>',
          img: "http://123.56.105.145/tubiao/messy/9.svg",
          url: $("#noLoading#").lazyRule(() => {
            refreshPage(false);
            return "hiker://empty";
          }),
          col_type: "text_icon",
          extra: {},
        }
      );
      let randmh = data.randmh;
      randmh.forEach((data) => {
        d.push({
          title: data.title,
          desc: "共" + data.zhangjieNum + "话",
          img: this.images(data.imgurl),
          url: $("hiker://empty?#immersiveTheme#").rule(() => {
            $.require("csdown").comic_detail();
          }),
          col_type: "movie_3",
          extra: {
            comic_id: data.id,
            comic_name: data.title,
          },
        });
      });
    } catch (e) {
      log(e.message);
    }
    setResult(d);
  },
  comics: function (id) {
    return $().lazyRule((id) => {
      let data = $.require("csdown").post("manhua/data/zj/" + id);
      let pics = data.imgurl
        .split(",")
        .map((data) => this.$.require("csdown").images(data))
        .join("&&");
      return "pics://" + pics;
    }, id);
  },
  comic_new: function () {
    var d = this.d;
    let pg = MY_PAGE;
    try {
      if (MY_PAGE == 1) {
        d.push(
          {
            title: "",
            col_type: "rich_text",
          },
          {
            title: "““最近更新””",
            url: "hiker://empty",
            col_type: "text_center_1",
            extra: {
              lineVisible: false,
            },
          }
        );
      }
      let more = this.post("manhua/everyday/" + pg + "/15/time").records;
      more.forEach((data) => {
        d.push({
          title: data.title,
          desc: "共" + data.zhangjieNum + "话",
          img: this.images(data.imgurl),
          url: $("hiker://empty?#immersiveTheme#").rule(() => {
            $.require("csdown").comic_detail();
          }),
          col_type: "movie_3",
          extra: {
            comic_id: data.id,
            comic_name: data.title,
          },
        });
      });
    } catch (e) {
      log(e.message);
    }
    setResult(d);
  },
  book: function () {
    var d = this.d;
    try {
      if (MY_PAGE == 1) {
        if (!storage0.getMyVar("book_fenlei")) {
          let fenlei = this.post("book/fenglei/1");
          storage0.putMyVar("book_fenlei", fenlei);
        }
        let fenlei = storage0.getMyVar("book_fenlei");
        putMyVar("book_index", fenlei[0].id + "");
        let book_ = getMyVar("book", getMyVar("book_index"));
        fenlei.forEach((data) => {
          d.push({
            title:
              book_ == data.id ? this.strong(data.name, "ff6699") : data.name,
            url: $("#noLoading#").lazyRule(
              (n, name, id) => {
                putMyVar(n, id);
                refreshPage(false);
                return "hiker://empty";
              },
              "book",
              data.name,
              data.id
            ),
            col_type: "scroll_button",
            extra: {
              backgroundColor: book_ == data.id ? "#20FA7298" : "",
            },
          });
        });
        if (book_ == getMyVar("book_index")) {
          d.push({
            title: this.color("每天更新"),
            desc: "查看更多",
            img: "https://igtcqqindd4.icu/h5/static/img-manhua/mhnew.png",
            url: $("hiker://empty?page=fypage&#gameTheme#&noHistory#").rule(
              () => {
                $.require("csdown").book_new();
              }
            ),
            col_type: "avatar",
            extra: {},
          });
          let everyday = this.post("book/everyday/1/10/time").records;
          everyday.forEach((data) => {
            d.push({
              title: data.title,
              desc: "共" + data.zhangjieNum + "章",
              img: this.images(data.imgurl),
              url: $("hiker://empty?#immersiveTheme#").rule(() => {
                $.require("csdown").book_detail();
              }),
              col_type: "movie_3",
              extra: {
                book_id: data.id,
                book_name: data.title,
              },
            });
          });
        }
        let list = this.post("book/fengleidata/" + book_);
        list.forEach((data) => {
          let zhuti = data.zhuti;
          d.push({
            title: zhuti.name,
            desc: "查看更多",
            img: "https://igtcqqindd4.icu/h5/static/img-manhua/mhhot.png",
            url: $("hiker://empty?page=fypage&#gameTheme#&noHistory#").rule(
              () => {
                $.require("csdown").book_more();
              }
            ),
            col_type: "avatar",
            extra: {
              zhuti_id: zhuti.id,
              zhuti_name: zhuti.name,
            },
          });
          let book_list = data.list;
          book_list.forEach((item) => {
            d.push({
              title: item.title,
              desc: "共" + item.zhangjieNum + "章",
              img: this.images(item.imgurl),
              url: $("hiker://empty?#immersiveTheme#").rule(() => {
                $.require("csdown").book_detail();
              }),
              col_type: "movie_3",
              extra: {
                book_id: item.id,
                book_name: item.title,
              },
            });
          });
        });
      }
    } catch (e) {
      log(e.message);
    }
  },
  book_more: function () {
    var d = this.d;
    let pg = MY_PAGE;
    let id = MY_PARAMS.zhuti_id;
    let name = MY_PARAMS.zhuti_name;
    if (MY_PAGE == 1) {
      d.push(
        {
          title: "",
          col_type: "rich_text",
        },
        {
          title: "““" + name + "””",
          url: "hiker://empty",
          col_type: "text_center_1",
          extra: {
            lineVisible: false,
          },
        }
      );
    }
    let more = this.post("book/moredata/" + id + "/" + pg + "/15/time").records;
    more.forEach((data) => {
      d.push({
        title: data.title,
        desc: "共" + data.zhangjieNum + "章",
        img: this.images(data.imgurl),
        url: $("hiker://empty?#immersiveTheme#").rule(() => {
          $.require("csdown").book_detail();
        }),
        col_type: "movie_3",
        extra: {
          book_id: data.id,
          book_name: data.title,
        },
      });
    });
    setResult(d);
  },
  book_detail: function () {
    var d = this.d;
    let id = MY_PARAMS.book_id;
    let name = MY_PARAMS.book_name;
    try {
      setPageTitle(name);
      let data = this.post("book/data/" + id);
      let book = data.book;
      d.push({
        title: book.title,
        desc:
          "共" +
          book.zhangjieNum +
          "章 " +
          book.creatTime +
          "\n" +
          JSON.parse(book.marks).join(" "),
        img: this.images(book.imgurl),
        url: this.images(book.imgurl + "#.jpg#"),
        col_type: "movie_1_vertical_pic_blur",
      });
      this.setDesc(d, book.miaoshu);
      d.push({
        title:
          getMyVar("shsort", "0") == "1"
            ? '““””<b><span style="color: #FF0000">逆序</span></b>'
            : '““””<b><span style="color: #1aad19">正序</span></b>',
        url: $("#noLoading#").lazyRule(() => {
          return $.require("csdown").shsort();
        }),
        col_type: "text_center_1",
        extra: {
          id: "排序",
          lineVisible: false,
          longClick: [
            {
              title: "当前样式：" + getItem("pic_col_type", "text_2"),
              js: $.toString(() => {
                //let options = ['text_1', 'text_2', 'text_3', 'text_4', 'text_center_1', 'avatar', 'text_icon', 'icon_1_left_pic'];
                //log(getColTypes())
                let options = getColTypes();
                let Line = {
                  title: "切换样式",
                  options: options,
                  selectedIndex: options.indexOf(
                    getItem("pic_col_type", "text_2")
                  ),
                  col: 2,
                  js: $.toString((options) => {
                    setItem("pic_col_type", input);
                    refreshPage(false);
                    toast("样式切换为：" + input);
                  }, options),
                };
                return "select://" + JSON.stringify(Line);
              }),
            },
          ],
        },
      });
      let zhangjie = data.zhangjie;
      if (getMyVar("shsort", "0") == "1") {
        zhangjie.reverse();
      }
      zhangjie.forEach((data) => {
        d.push({
          title: data.name,
          img: this.images(book.imgurl),
          url: $(
            "hiker://empty?id=" + data.id + "&#readTheme#&#autoPage#"
          ).rule(() => {
            $.require("csdown").books();
          }),
          col_type: getItem("pic_col_type", "text_2"),
          extra: {
            cls: "选集_",
            lineVisible: false,
            book_id: data.id,
          },
        });
      });
      d.push(
        {
          col_type: "blank_block",
          extra: {
            id: "blank",
          },
        },
        {
          title: '<b><span style="color: #ff847c">推荐</span></b>',
          img: "http://123.56.105.145/tubiao/messy/9.svg",
          url: $("#noLoading#").lazyRule(() => {
            refreshPage(false);
            return "hiker://empty";
          }),
          col_type: "text_icon",
          extra: {},
        }
      );
      let rand = data.rand;
      rand.forEach((data) => {
        d.push({
          title: data.title,
          desc: "共" + data.zhangjieNum + "章",
          img: this.images(data.imgurl),
          url: $("hiker://empty?#immersiveTheme#").rule(() => {
            $.require("csdown").book_detail();
          }),
          col_type: "movie_3",
          extra: {
            book_id: data.id,
            book_name: data.title,
          },
        });
      });
    } catch (e) {
      log(e.message);
    }
    setResult(d);
  },
  book_new: function () {
    var d = this.d;
    let pg = MY_PAGE;
    try {
      if (MY_PAGE == 1) {
        d.push(
          {
            title: "",
            col_type: "rich_text",
          },
          {
            title: "““最近更新””",
            url: "hiker://empty",
            col_type: "text_center_1",
            extra: {
              lineVisible: false,
            },
          }
        );
      }
      let more = this.post("book/everyday/" + pg + "/15/time").records;
      more.forEach((data) => {
        d.push({
          title: data.title,
          desc: "共" + data.zhangjieNum + "章",
          img: this.images(data.imgurl),
          url: $("hiker://empty?#immersiveTheme#").rule(() => {
            $.require("csdown").book_detail();
          }),
          col_type: "movie_3",
          extra: {
            book_id: data.id,
            book_name: data.title,
          },
        });
      });
    } catch (e) {
      log(e.message);
    }
    setResult(d);
  },
  books: function () {
    var d = this.d;
    let id = MY_PARAMS.book_id;
    try {
      let data = this.post("book/data/zj/" + id);
      let txt;
      if (/\.bnc/.test(data.txturl)) {
        eval(getCryptoJS());
        let word = fetch(data.txturl, {
          toHex: true,
        });
        const key = CryptoJS.enc.Utf8.parse("525202f9149e061d");
        let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
        let decrypt = CryptoJS.AES.decrypt(
          {
            ciphertext: encryptedHexStr,
          },
          key,
          {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
          }
        );
        txt = decrypt.toString(CryptoJS.enc.Utf8);
      } else {
        txt = data.txturl;
      }
      d.push(
        {
          title: data.name,
          url: "hiker://empty",
          col_type: "text_center_1",
          extra: {
            lineVisible: false,
          },
        },
        {
          title: txt.replace(/\n/g, "<br>"),
          col_type: "rich_text",
        }
      );
    } catch (e) {
      log(e.message);
    }
    setResult(d);
  },
  movie: function () {
    var d = this.d;
    let pg = MY_PAGE;
    try {
      if (MY_PAGE == 1) {
        if (!storage0.getMyVar("movie_fenlei")) {
          let fenlei = this.post("movie/fenglei");
          storage0.putMyVar("movie_fenlei", fenlei);
        }
        let fenlei = storage0.getMyVar("movie_fenlei");
        putMyVar("movie_index", fenlei[0].id + "");
        let movie_ = getMyVar("movie", getMyVar("movie_index"));
        fenlei.forEach((data) => {
          d.push({
            title:
              movie_ == data.id ? this.strong(data.name, "ff6699") : data.name,
            url: $("#noLoading#").lazyRule(
              (n, name, id) => {
                putMyVar(n, id);
                refreshPage(false);
                return "hiker://empty";
              },
              "movie",
              data.name,
              data.id
            ),
            col_type: "scroll_button",
            extra: {
              backgroundColor: movie_ == data.id ? "#20FA7298" : "",
            },
          });
        });
        if (movie_ == getMyVar("movie_index") || movie_ == "13") {
          let list = this.post("movie/fengleidata/" + movie_);
          if (movie_ == getMyVar("movie_index")) {
            d.push({
              title: this.color("土豆每日精选"),
              desc: "查看更多",
              img: "https://igtcqqindd4.icu/h5/static/img-manhua/mhnew.png",
              url: $("hiker://empty?page=fypage&#gameTheme#&noHistory#").rule(
                () => {
                  $.require("csdown").movie_new();
                }
              ),
              col_type: "avatar",
              extra: {},
            });
            const today = new Date().toISOString().split("T")[0];
            let tuijian = this.post(
              "movie/tuijian/1/10/time",
              JSON.stringify({
                creattime: today + "",
              })
            ).list;
            tuijian = tuijian.map((item) => {
              data = item.movie;
              return {
                id: data.id,
                name: data.title,
                img: this.images(data.imgurl),
                url: data.movieurl + "#isVideo=true#",
                movie_user: item.movieUser.id,
                movie_user_name: "演员：" + item.movieUser.name,
              };
            });
            if (tuijian && tuijian.length != 0) {
              this.banner(MY_RULE.title, true, d, tuijian, {
                time: 5000,
                col_type: "card_pic_1",
                desc: "0",
              });
            }
            if (!storage0.getMyVar("movie_userList")) {
              let userList = list.userList.map((data, index) => {
                return {
                  title: data.name,
                  desc: data.jianjie,
                  img: this.images(data.imgurl),
                  url: $(
                    "hiker://empty?page=fypage&#immersiveTheme#&#noHistory#"
                  ).rule(() => {
                    $.require("csdown").movie_user();
                  }),
                  col_type: "icon_round_4",
                  extra: {
                    movie_user: data.id,
                    cls: index < 4 ? "user_list" : "user_list_1",
                  },
                };
              });
              storage0.putMyVar("movie_userList", userList);
            }
            d.push({
              title: "精选频道",
              desc:
                getMyVar("movie_flod", "0") == "0" ? "点击展开" : "点击折叠",
              img: "https://igtcqqindd4.icu/h5/static/img-manhua/mhhot.png",
              url: $("#noLoading#").lazyRule(() => {
                putMyVar(
                  "movie_flod",
                  getMyVar("movie_flod", "0") == "0" ? "1" : "0"
                );
                updateItem("movie_blank1", {
                  desc:
                    getMyVar("movie_flod", "0") == "0"
                      ? "点击展开"
                      : "点击折叠",
                });
                let userList = storage0.getMyVar("movie_userList");
                if (getMyVar("movie_flod", "0") == "0") {
                  deleteItemByCls("user_list_1");
                } else {
                  addItemBefore("movie_blank_2", userList.slice(4));
                }
                return "hiker://empty";
              }),
              col_type: "avatar",
              extra: {
                id: "movie_blank1",
              },
            });
            if (getMyVar("movie_flod", "0") == "0") {
              storage0
                .getMyVar("movie_userList")
                .slice(0, 4)
                .forEach((data) => {
                  d.push(data);
                });
            } else {
              storage0.getMyVar("movie_userList").forEach((data) => {
                d.push(data);
              });
            }
            d.push({
              col_type: "blank_block",
              extra: {
                id: "movie_blank_2",
              },
            });
          }
          list.movieList.forEach((data) => {
            let zhuti = data.zhuti;
            d.push({
              title: zhuti.name,
              desc: "查看更多",
              img: "https://igtcqqindd4.icu/h5/static/img-manhua/mhhot.png",
              url: $("hiker://empty?page=fypage&#gameTheme#&noHistory#").rule(
                () => {
                  $.require("csdown").movie_more();
                }
              ),
              col_type: "avatar",
              extra: {
                zhuti_id: zhuti.id,
                zhuti_name: zhuti.name,
              },
            });
            let movie_list = data.list;
            movie_list.forEach((item) => {
              let movie_ = item.movie;
              d.push({
                title: movie_.title,
                desc:
                  movie_.creatTime.slice(0, 10) +
                  "              " +
                  movie_.duration,
                img: this.images(movie_.imgurl),
                url: movie_.movieurl,
                col_type: "movie_2",
                extra: {
                  movie_id: movie_.id,
                  movie_name: movie_.title,
                  movie_user: item.movieUser.id,
                  longClick: [
                    {
                      title: "演员：" + item.movieUser.name,
                      js: $.toString(() => {
                        return $(
                          "hiker://empty?page=fypage&#immersiveTheme#&#noHistory#"
                        ).rule(() => {
                          $.require("csdown").movie_user();
                        });
                      }),
                    },
                  ],
                },
              });
            });
          });
        } else {
          d.push({
            col_type: "blank_block",
          });
          let 分类 = [
            {
              title: "最新&推荐&随机",
              id: "zx&tj&rand",
            },
          ];
          this.Cate(分类, "movie_cate", d);
        }
      }
      let movie_ = getMyVar("movie", getMyVar("movie_index"));
      if (movie_ == "20") {
        let movie_list = this.post(
          "movie/fengleidataShow/" +
            movie_ +
            "/" +
            pg +
            "/15/" +
            getMyVar("movie_cate", "zx")
        ).movieList;
        movie_list.forEach((item) => {
          let movie = item.movie;
          d.push({
            title: movie.title,
            desc:
              movie.creatTime.slice(0, 10) + "              " + movie.duration,
            img: this.images(movie.imgurl),
            url: movie.movieurl,
            col_type: "movie_2",
            extra: {
              movie_id: movie.id,
              movie_name: movie.title,
              movie_user: item.movieUser.id,
              longClick: [
                {
                  title: "演员：" + item.movieUser.name,
                  js: $.toString(() => {
                    return $(
                      "hiker://empty?page=fypage&#immersiveTheme#&#noHistory#"
                    ).rule(() => {
                      $.require("csdown").movie_user();
                    });
                  }),
                },
              ],
            },
          });
        });
      } else if (
        movie_ == "11" ||
        movie_ == "21" ||
        movie_ == "24" ||
        movie_ == "18" ||
        movie_ == "22" ||
        movie_ == "23" ||
        movie_ == "19"
      ) {
        if (MY_PAGE == 1) {
          d.push({
            title: "精选分类",
            desc:
              getMyVar("cmmovie_flod", "0") == "0" ? "点击展开" : "点击折叠",
            img: "https://igtcqqindd4.icu/h5/static/img-manhua/mhhot.png",
            url: $("#noLoading#").lazyRule(() => {
              let d = [];
              putMyVar(
                "cmmovie_flod",
                getMyVar("cmmovie_flod", "0") == "0" ? "1" : "0"
              );
              let movie_ = getMyVar("movie", getMyVar("movie_index"));
              let cmlist = storage0.getMyVar("movie_cmlist_" + movie_);
              updateItem("cm_1", {
                desc:
                  getMyVar("cmmovie_flod", "0") == "0"
                    ? "点击展开"
                    : "点击折叠",
              });
              if (getMyVar("cmmovie_flod", "0") == "0") {
                deleteItemByCls("cm_3");
              } else {
                let cmlist_ = getMyVar(
                  "cmlist_" + movie_,
                  getMyVar("cmlist_index_" + movie_)
                );
                cmlist.slice(5).forEach((data, index) => {
                  d.push({
                    title:
                      cmlist_ == data.id
                        ? $.require("csdown").strong(data.name, "ff6699")
                        : data.name,
                    img: $.require("csdown").images(data.imgurl),
                    url: $("#noLoading#").lazyRule(
                      (n, name, id) => {
                        putMyVar(n, id);
                        return $.require("csdown").movie_refresh();
                      },
                      "cmlist_" + movie_,
                      data.name,
                      data.id
                    ),
                    col_type: "icon_5",
                    extra: {
                      id: "cmlist_" + (index + 5),
                      cls: "cm_3",
                    },
                  });
                });
                addItemBefore("cmlist_blank", d);
              }
              return "hiker://empty";
            }),
            col_type: "avatar",
            extra: {
              id: "cm_1",
            },
          });
          if (!storage0.getMyVar("movie_cmlist_" + movie_)) {
            let movie_list = this.post(
              "movie/fengleidataShow/" +
                movie_ +
                "/" +
                pg +
                "/15/" +
                getMyVar("movie_cate", "zx")
            ).cmList;
            storage0.putMyVar("movie_cmlist_" + movie_, movie_list);
          }
          let cmlist;
          if (getMyVar("cmmovie_flod", "0") == "0") {
            cmlist = storage0.getMyVar("movie_cmlist_" + movie_).slice(0, 5);
          } else {
            cmlist = storage0.getMyVar("movie_cmlist_" + movie_);
          }
          putMyVar("cmlist_index_" + movie_, cmlist[0].id);
          let cmlist_ = getMyVar(
            "cmlist_" + movie_,
            getMyVar("cmlist_index_" + movie_)
          );
          cmlist.forEach((data, index) => {
            d.push({
              title:
                cmlist_ == data.id
                  ? this.strong(data.name, "ff6699")
                  : data.name,
              img: this.images(data.imgurl),
              url: $("#noLoading#").lazyRule(
                (n, name, id) => {
                  putMyVar(n, id);
                  return $.require("csdown").movie_refresh();
                },
                "cmlist_" + movie_,
                data.name,
                data.id
              ),
              col_type: "icon_5",
              extra: {
                id: "cmlist_" + index,
                cls: index < 5 ? "cm_2" : "cm_3",
              },
            });
          });
          d.push({
            col_type: "blank_block",
            extra: {
              id: "cmlist_blank",
            },
          });
        }
        let cmlist_ = getMyVar(
          "cmlist_" + movie_,
          getMyVar("cmlist_index_" + movie_)
        );
        let cmdata = this.post(
          "movie/cmdata/" +
            cmlist_ +
            "/" +
            pg +
            "/15/" +
            getMyVar("movie_cate", "zx")
        ).list;
        cmdata.forEach((item) => {
          let movie = item.movie;
          d.push({
            title: movie.title,
            desc:
              movie.creatTime.slice(0, 10) + "              " + movie.duration,
            img: this.images(movie.imgurl),
            url: movie.movieurl,
            col_type: "movie_2",
            extra: {
              cls: "movie_cmlist",
              movie_id: movie.id,
              movie_name: movie.title,
              movie_user: item.movieUser.id,
              longClick: [
                {
                  title: "演员：" + item.movieUser.name,
                  js: $.toString(() => {
                    return $(
                      "hiker://empty?page=fypage&#immersiveTheme#&#noHistory#"
                    ).rule(() => {
                      $.require("csdown").movie_user();
                    });
                  }),
                },
              ],
            },
          });
        });
      } else if (movie_ != getMyVar("movie_index") && movie_ != "13") {
        let movie_list = this.post(
          "movie/fengleidataShow/" +
            movie_ +
            "/" +
            pg +
            "/15/" +
            getMyVar("movie_cate", "zx")
        );
        if (!storage0.getMyVar("movie_userList_" + movie_)) {
          let userList = movie_list.userList.map((data, index) => {
            return {
              title: data.name,
              desc: data.jianjie,
              img: this.images(data.imgurl),
              url: $(
                "hiker://empty?page=fypage&#immersiveTheme#&#noHistory#"
              ).rule(() => {
                $.require("csdown").movie_user();
              }),
              col_type: "icon_round_4",
              extra: {
                movie_user: data.id,
                cls: index < 4 ? "user_list" : "user_list_1",
              },
            };
          });
          storage0.putMyVar("movie_userList_" + movie_, userList);
        }
        d.push({
          title: "精选频道",
          desc: getMyVar("movie_flod", "0") == "0" ? "点击展开" : "点击折叠",
          img: "https://igtcqqindd4.icu/h5/static/img-manhua/mhhot.png",
          url: $("#noLoading#").lazyRule(() => {
            let movie_ = getMyVar("movie", getMyVar("movie_index"));
            putMyVar(
              "movie_flod",
              getMyVar("movie_flod", "0") == "0" ? "1" : "0"
            );
            updateItem("movie_blank1", {
              desc:
                getMyVar("movie_flod", "0") == "0" ? "点击展开" : "点击折叠",
            });
            let userList = storage0.getMyVar("movie_userList_" + movie_);
            if (getMyVar("movie_flod", "0") == "0") {
              deleteItemByCls("user_list_1");
            } else {
              addItemBefore("movie_blank_2", userList.slice(4));
            }
            return "hiker://empty";
          }),
          col_type: "avatar",
          extra: {
            id: "movie_blank1",
          },
        });
        if (getMyVar("movie_flod", "0") == "0") {
          storage0
            .getMyVar("movie_userList_" + movie_)
            .slice(0, 4)
            .forEach((data) => {
              d.push(data);
            });
        } else {
          storage0.getMyVar("movie_userList_" + movie_).forEach((data) => {
            d.push(data);
          });
        }
        d.push({
          col_type: "blank_block",
          extra: {
            id: "movie_blank_2",
          },
        });
        movie_list.movieList.forEach((item) => {
          let movie = item.movie;
          d.push({
            title: movie.title,
            desc:
              movie.creatTime.slice(0, 10) + "              " + movie.duration,
            img: this.images(movie.imgurl),
            url: movie.movieurl,
            col_type: "movie_2",
            extra: {
              movie_id: movie.id,
              movie_name: movie.title,
              movie_user: item.movieUser.id,
              longClick: [
                {
                  title: "演员：" + item.movieUser.name,
                  js: $.toString(() => {
                    return $(
                      "hiker://empty?page=fypage&#immersiveTheme#&#noHistory#"
                    ).rule(() => {
                      $.require("csdown").movie_user();
                    });
                  }),
                },
              ],
            },
          });
        });
      }
    } catch (e) {
      log(e.message);
    }
  },
  movie_more: function () {
    var d = this.d;
    let pg = MY_PAGE;
    let id = MY_PARAMS.zhuti_id;
    let name = MY_PARAMS.zhuti_name;
    try {
      if (MY_PAGE == 1) {
        setPageTitle(name);
        d.push(
          {
            title: "",
            col_type: "rich_text",
          },
          {
            title: "““" + name + "””",
            url: "hiker://empty",
            col_type: "text_center_1",
            extra: {
              lineVisible: false,
            },
          }
        );
        let 分类 = [
          {
            title: "最新&推荐&随机",
            id: "time&tj&rand",
          },
        ];
        this.Cate(分类, "user_cate", d);
      }
      let list = this.post(
        "movie/moredata/" +
          id +
          "/" +
          pg +
          "/15/" +
          getMyVar("user_cate", "time")
      ).list;
      list.forEach((item) => {
        let movie_ = item.movie;
        d.push({
          title: movie_.title,
          desc:
            movie_.creatTime.slice(0, 10) + "              " + movie_.duration,
          img: this.images(movie_.imgurl),
          url: movie_.movieurl,
          col_type: "movie_2",
          extra: {
            movie_id: movie_.id,
            movie_name: movie_.title,
            movie_user: item.movieUser.id,
            longClick: [
              {
                title: "演员：" + item.movieUser.name,
                js: $.toString(() => {
                  return $(
                    "hiker://empty?page=fypage&#immersiveTheme#&#noHistory#"
                  ).rule(() => {
                    $.require("csdown").movie_user();
                  });
                }),
              },
            ],
          },
        });
      });
    } catch (e) {
      log(e.message);
    }
    setResult(d);
  },
  movie_user: function () {
    var d = this.d;
    let pg = MY_PAGE;
    let id = MY_PARAMS.movie_user;
    try {
      if (MY_PAGE == 1) {
        let user = this.post("movieUser/get/" + id).data;
        setPageTitle(user.name);
        d.push({
          title: user.name,
          desc:
            "作品：" +
            user.zpnum +
            " 粉丝：" +
            user.fsnumV +
            " 观看：" +
            user.looknum,
          img: this.images(user.imgurl),
          url: this.images(user.imgurl + "#.jpg#"),
          col_type: "movie_1_vertical_pic_blur",
        });
        d.push({
          col_type: "big_blank_block",
        });
        let 分类 = [
          {
            title: "最新&推荐&随机",
            id: "time&tj&rand",
          },
        ];
        this.Cate(分类, "user_cate", d);
      }
      let list = this.post(
        "movieUser/moredata/" +
          id +
          "/" +
          pg +
          "/15/" +
          getMyVar("user_cate", "time")
      ).list;
      list.forEach((item) => {
        let movie_ = item.movie;
        d.push({
          title: movie_.title,
          desc:
            movie_.creatTime.slice(0, 10) + "              " + movie_.duration,
          img: this.images(movie_.imgurl),
          url: movie_.movieurl,
          col_type: "movie_2",
          extra: {
            movie_id: movie_.id,
            movie_name: movie_.title,
            movie_user: item.movieUser.id,
            longClick: [
              {
                title: "演员：" + item.movieUser.name,
                js: $.toString(() => {
                  return $(
                    "hiker://empty?page=fypage&#immersiveTheme#&#noHistory#"
                  ).rule(() => {
                    $.require("csdown").movie_user();
                  });
                }),
              },
            ],
          },
        });
      });
    } catch (e) {
      log(e.message);
    }
    setResult(d);
  },
  movie_refresh: function () {
    let d = [];
    let movie_ = getMyVar("movie", getMyVar("movie_index"));
    let cmlist_ = getMyVar(
      "cmlist_" + movie_,
      getMyVar("cmlist_index_" + movie_)
    );
    let cmdata = this.post(
      "movie/cmdata/" + cmlist_ + "/1/15/" + getMyVar("movie_cate", "zx")
    ).list;
    cmdata.forEach((item) => {
      let movie = item.movie;
      d.push({
        title: movie.title,
        desc: movie.creatTime.slice(0, 10) + "              " + movie.duration,
        img: this.images(movie.imgurl),
        url: movie.movieurl,
        col_type: "movie_2",
        extra: {
          cls: "movie_cmlist",
          movie_id: movie.id,
          movie_name: movie.title,
          movie_user: item.movieUser.id,
          longClick: [
            {
              title: "演员：" + item.movieUser.name,
              js: $.toString(() => {
                return $(
                  "hiker://empty?page=fypage&#immersiveTheme#&#noHistory#"
                ).rule(() => {
                  $.require("csdown").movie_user();
                });
              }),
            },
          ],
        },
      });
    });
    let cmlist = storage0.getMyVar("movie_cmlist_" + movie_);
    cmlist.forEach((data, index) => {
      updateItem("cmlist_" + index, {
        title:
          cmlist_ == data.id ? this.strong(data.name, "ff6699") : data.name,
      });
    });
    deleteItemByCls("movie_cmlist");
    addItemAfter("cmlist_blank", d);
    return "hiker://empty";
  },
  pic: function () {
    var d = this.d;
    let pg = MY_PAGE;
    try {
      if (MY_PAGE == 1) {
        if (!storage0.getMyVar("pic_cate")) {
          let data = this.post("book/fenglei/0");
          storage0.putMyVar("pic_cate", data);
        }
        let fenlei = storage0.getMyVar("pic_cate");
        putMyVar("pic_index", fenlei[0].id + "");
        let pic_ = getMyVar("pic", getMyVar("pic_index"));
        fenlei.forEach((data) => {
          d.push({
            title:
              pic_ == data.id ? this.strong(data.name, "ff6699") : data.name,
            url: $("#noLoading#").lazyRule(
              (n, name, id) => {
                putMyVar(n, id);
                refreshPage(false);
                return "hiker://empty";
              },
              "pic",
              data.name,
              data.id
            ),
            col_type: "scroll_button",
            extra: {
              backgroundColor: pic_ == data.id ? "#20FA7298" : "",
            },
          });
        });
        d.push({
          col_type: "blank_block",
        });
        let 分类 = [
          {
            title: "最新&推荐&随机",
            id: "time&tj&rand",
          },
        ];
        this.Cate(分类, "pic_", d);
      }
      let pic_ = getMyVar("pic", getMyVar("pic_index"));
      let list = this.post(
        "book/st/mhmoredata/" +
          pic_ +
          "/" +
          pg +
          "/15/" +
          getMyVar("pic_", "time")
      );
      list.records.forEach((data) => {
        let pic_arr = list.zhangjies[data.id + ""][0].imgurl
          .split(",")
          .map((data) => this.images(data));
        d.push({
          title: data.title,
          desc: "共" + pic_arr.length + "张图",
          img: this.images(
            data.imgurl.includes(".html") ? data.imgurl + "#.jpg#" : data.imgurl
          ),
          url: "pics://" + pic_arr.join("&&"),
          col_type: "movie_3",
        });
      });
    } catch (e) {
      log(e.message);
    }
  },
  novel: function () {
    var d = this.d;
    let pg = MY_PAGE;
    try {
      if (MY_PAGE == 1) {
        if (!storage0.getMyVar("novel_cate")) {
          let data = this.post("book/fenglei/2");
          storage0.putMyVar("novel_cate", data);
        }
        let fenlei = storage0.getMyVar("novel_cate");
        putMyVar("novel_index", fenlei[0].id + "");
        let novel_ = getMyVar("novel", getMyVar("novel_index"));
        fenlei.forEach((data) => {
          d.push({
            title:
              novel_ == data.id ? this.strong(data.name, "ff6699") : data.name,
            url: $("#noLoading#").lazyRule(
              (n, name, id) => {
                putMyVar(n, id);
                refreshPage(false);
                return "hiker://empty";
              },
              "novel",
              data.name,
              data.id
            ),
            col_type: "scroll_button",
            extra: {
              backgroundColor: novel_ == data.id ? "#20FA7298" : "",
            },
          });
        });
        d.push({
          col_type: "blank_block",
        });
        let 分类 = [
          {
            title: "最新&推荐&随机",
            id: "time&tj&rand",
          },
        ];
        this.Cate(分类, "novel_", d);
      }
      let novel_ = getMyVar("novel", getMyVar("novel_index"));
      let list = this.post(
        "book/md/xsmoredata/" +
          novel_ +
          "/" +
          pg +
          "/15/" +
          getMyVar("novel_", "time")
      );
      list.records.forEach((data) => {
        d.push({
          title: data.title,
          desc: "共" + data.zhangjieNum + "章",
          img: this.images(data.imgurl),
          url: $("hiker://empty?#immersiveTheme#").rule(() => {
            $.require("csdown").book_detail();
          }),
          col_type: "movie_3",
          extra: {
            book_id: data.id,
            book_name: data.title,
          },
        });
      });
    } catch (e) {
      log(e.message);
    }
  },
  search: function () {
    var d = this.d;
    let pg = MY_PAGE;
    try {
      if (MY_PAGE == 1) {
        d.push({
          title: "",
          col_type: "rich_text",
        });
        d.push({
          title: "搜索 ",
          url: $.toString(() => {
            putMyVar("keyword", input);
            refreshPage(false);
            return "hiker://empty";
          }),
          desc: "请输入搜索关键词",
          col_type: "input",
          extra: {
            defaultValue: getMyVar("keyword", ""),
            pageTitle: "搜索结果",
          },
        });
        let search = [
          {
            title: "视频&漫画&小说",
            id: "movie&manhua&book",
          },
        ];
        this.Cate(search, "search", d, "text_3");
        let cate = [
          {
            title: "最新&推荐&随机",
            id: "time&tj&rand",
          },
        ];
        this.Cate(cate, "search_cate", d, "text_3");
      }
      let 分类 = getMyVar("search", "movie");
      let list = this.post(
        分类 + "/search/" + pg + "/15/" + getMyVar("search_cate", "time"),
        JSON.stringify({
          name: getMyVar("keyword"),
        })
      ).records;
      if (分类 == "movie") {
        list.forEach((item) => {
          let movie = item.movie;
          d.push({
            title: movie.title,
            desc:
              movie.creatTime.slice(0, 10) + "              " + movie.duration,
            img: this.images(movie.imgurl),
            url: movie.movieurl,
            col_type: "movie_2",
            extra: {
              movie_id: movie.id,
              movie_name: movie.title,
              movie_user: item.movieUser.id,
              longClick: [
                {
                  title: "演员：" + item.movieUser.name,
                  js: $.toString(() => {
                    return $(
                      "hiker://empty?page=fypage&#immersiveTheme#&#noHistory#"
                    ).rule(() => {
                      $.require("csdown").movie_user();
                    });
                  }),
                },
              ],
            },
          });
        });
      } else if (分类 == "manhua") {
        list.forEach((data) => {
          d.push({
            title: data.title,
            desc: "共" + data.zhangjieNum + "话",
            img: this.images(data.imgurl),
            url: $("hiker://empty?#immersiveTheme#").rule(() => {
              $.require("csdown").comic_detail();
            }),
            col_type: "movie_3",
            extra: {
              comic_id: data.id,
              comic_name: data.title,
            },
          });
        });
      } else if (分类 == "book") {
        list.forEach((data) => {
          d.push({
            title: data.title,
            desc: "共" + data.zhangjieNum + "章",
            img: this.images(data.imgurl),
            url: $("hiker://empty?#immersiveTheme#").rule(() => {
              $.require("csdown").book_detail();
            }),
            col_type: "movie_3",
            extra: {
              book_id: data.id,
              book_name: data.title,
            },
          });
        });
      }
    } catch (e) {
      log(e.message);
    }
    setResult(d);
  },
};
$.exports = csdown;

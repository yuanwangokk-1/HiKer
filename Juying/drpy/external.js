 //正则matchAll
function matchesAll(str, pattern, flatten) {
  if (!pattern.global) {
    pattern = new RegExp(pattern.source, "g" + (pattern.ignoreCase ? "i" : "") + (pattern.multiline ? "m" : ""));
  }
  var matches = [];
  var match;
  while ((match = pattern.exec(str)) !== null) {
    matches.push(match);
  }
  return flatten ? matches.flat() : matches;
}

//文本扩展
function stringUtils() {
  Object.defineProperties(String.prototype, {
    replaceX: {
      value: function (regex, replacement) {
        let matches = matchesAll(this, regex,true);
        if (matches && matches.length > 1) {
          const hasCaptureGroup = /\$\d/.test(replacement);
          if (hasCaptureGroup) {
            return this.replace(regex, (m) => m.replace(regex, replacement));
          } else {
            return this.replace(regex, (m, p1) => m.replace(p1, replacement));
          }
        }
        return this.replace(regex, replacement);
      },
      configurable: true,
      enumerable: false,
      writable: true
    },
    parseX: {
      get: function () {
        try {
          //console.log(typeof this);
          return JSON.parse(this);
        } catch (e) {
          console.log(e);
          return this.startsWith("[") ? [] : {};
        }
      },
      configurable: true,
      enumerable: false,
    }
  });
}

//正则裁切
function cut(text, start, end, method, All) {
  let result = "";
  let c = (t, s, e) => {
    let result = "";
    let rs = [];
    let results = [];
    try {
      let lr = new RegExp(String.raw`${s}`.toString());
      let rr = new RegExp(String.raw`${e}`.toString());
      const segments = t.split(lr);
      if (segments.length < 2) return '';
      let cutSegments = segments.slice(1).map(segment => {
        let splitSegment = segment.split(rr);
        //log(splitSegment)
        return splitSegment.length < 2 ? undefined : splitSegment[0] + e;
      }).filter(f => f);
      //log(cutSegments.at(-1))
      if (All) {
        return `[${cutSegments.join(',')}]`;
      } else {
        return cutSegments[0];
      }
    } catch (e) {
      console.error("Error cutting text:", e);
    }
    return result;
  }
  result = c(text, start, end);
  stringUtils();
  if (method && typeof method === "function") {
    result = method(result);
  }
  //console.log(result);
  return result
}
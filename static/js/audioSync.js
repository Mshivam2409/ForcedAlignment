function convertVttToJson(vttString) {
  return new Promise((resolve, reject) => {
    var current = {};
    var sections = [];
    var start = false;
    var vttArray = vttString.split("\n");
    vttArray.forEach((line, index) => {
      if (line.replace(/<\/?[^>]+(>|$)/g, "") === " ") {
      } else if (line.replace(/<\/?[^>]+(>|$)/g, "") == "") {
      } else if (line.indexOf("-->") !== -1) {
        start = true;

        if (current.start) {
          sections.push(clone(current));
        }

        current = {
          start: timeString2ms(
            line.split("-->")[0].trimRight().split(" ").pop()
          ),
          end: timeString2ms(
            line.split("-->")[1].trimLeft().split(" ").shift()
          ),
          part: "",
        };
      } else if (line.replace(/<\/?[^>]+(>|$)/g, "") === "") {
      } else if (line.replace(/<\/?[^>]+(>|$)/g, "") === " ") {
      } else {
        if (start) {
          if (sections.length !== 0) {
            if (
              sections[sections.length - 1].part.replace(
                /<\/?[^>]+(>|$)/g,
                ""
              ) === line.replace(/<\/?[^>]+(>|$)/g, "")
            ) {
            } else {
              if (current.part.length === 0) {
                current.part = line;
              } else {
                current.part = `${current.part} ${line}`;
              }
              // If it's the last line of the subtitles
              if (index === vttArray.length - 1) {
                sections.push(clone(current));
              }
            }
          } else {
            current.part = line;
            sections.push(clone(current));
            current.part = "";
          }
        }
      }
    });

    current = [];

    var regex = /(<([0-9:.>]+)>)/gi;
    sections.forEach((section) => {
      strs = section.part.split();
      var results = strs.map(function (s) {
        return s.replace(regex, function (n) {
          return n.split("").reduce(function (s, i) {
            return `==${n.replace("<", "").replace(">", "")}`;
          }, 0);
        });
      });
      cleanText = results[0].replace(/<\/?[^>]+(>|$)/g, "");
      cleanArray = cleanText.split(" ");
      resultsArray = [];
      cleanArray.forEach(function (item) {
        if (item.indexOf("==") > -1) {
          var pair = item.split("==");
          var key = pair[0];
          var value = pair[1];
          if (key == "" || key == "##") {
            return;
          }
          resultsArray.push({
            word: cleanWord(item.split("==")[0]),
            time: timeString2ms(item.split("==")[1]),
          });
        } else {
          resultsArray.push({
            word: cleanWord(item),
            time: undefined,
          });
        }
      });
      section.words = resultsArray;
      section.part = section.part.replace(/<\/?[^>]+(>|$)/g, "");
    });
    resolve(sections);
  });
}

// helpers
//   http://codereview.stackexchange.com/questions/45335/milliseconds-to-time-string-time-string-to-milliseconds
function timeString2ms(a, b) {
  // time(HH:MM:SS.mss) // optimized
  return (
    (a = a.split(".")), // optimized
    (b = a[1] * 1 || 0), // optimized
    (a = a[0].split(":")),
    b +
      (a[2]
        ? a[0] * 3600 + a[1] * 60 + a[2] * 1
        : a[1]
        ? a[0] * 60 + a[1] * 1
        : a[0] * 1) *
        1e3
  ); // optimized
}

// removes everything but characters and apostrophe and dash
function cleanWord(word) {
  return word.replace(/[^0-9a-z'-]/gi, "").toLowerCase();
}

function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}

var audioSync = function (options) {
  var audioPlayer = document.getElementById(options.audioPlayer);
  var subtitles = document.getElementById(options.subtitlesContainer);
  var syncData = [];
  var rawSubTitle = "";

  var init = (function () {
    return fetch(new Request(options.subtitlesFile))
      .then((response) => response.text())
      .then(createSubtitle);
  })();

  function createSubtitle(text) {
    var rawSubTitle = text;
    convertVttToJson(text).then((result) => {
      var x = 0;
      for (var i = 0; i < result.length; i++) {
        //cover for bug in vtt to json here
        if (result[i].part && result[i].part.trim() != "") {
          syncData[x] = result[i];
          x++;
        }
      }
    });
  }

  audioPlayer.addEventListener("timeupdate", function (e) {
    sub = "";
    syncData.forEach(function (element, index, array) {
      var el;
      if (
        audioPlayer.currentTime * 1000 >= element.start &&
        audioPlayer.currentTime * 1000 <= element.end
      ) {
        while (subtitles.hasChildNodes())
          subtitles.removeChild(subtitles.firstChild);
        prev = document.createElement("span");
        prev.innerText = sub;
        el = document.createElement("span");
        el.setAttribute("id", "c_" + index);
        el.innerText = syncData[index].part + "\n";
        el.style.background = "#ADD8E6";
        subtitles.appendChild(prev);
        subtitles.appendChild(el);
      } else if (audioPlayer.currentTime * 1000 >= element.start) {
        sub = sub + syncData[index].part + " ";
      }
    });
  });
};
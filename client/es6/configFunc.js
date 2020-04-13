export function isEmail(email) {
  var re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function isUsername(v) {
  v = v.trim();
  let regExp = /[^a-z ]/gi;
  return !regExp.test(v);
}

export function isDate(date) {
  return !isNaN(date.getTime());
}

export function isPhone(v) {
  var regExp = /[^0-9 ]/gi;
  return !regExp.test(v);
}

export function isURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" +
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
      "((\\d{1,3}\\.){3}\\d{1,3}))" +
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
      "(\\?[;&a-z\\d%_.~+=-]*)?" +
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  return !!pattern.test(str);
}

export const headerConfig = (token) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  if (token) config.headers["x-auth-token"] = token;
  return config;
};

export function redirect(location, time) {
  if (time) window.location.replace(location);
  else {
    window.setTimeout(() => {
      window.location.replace(location);
    }, time);
  }
}

export function getOS() {
  let userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macos = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
    windowos = ["Win32", "Win64", "Windows", "WinCE"],
    ios = ["iPhone", "iPad", "iPod"],
    os = "Unknown";
  if (macos.indexOf(platform) !== -1) os = "Mac OS";
  else if (ios.indexOf(platform) !== -1) os = "iOS";
  else if (windowos.indexOf(platform) !== -1) os = "Window";
  else if (/Android/.test(userAgent)) os = "Android";
  else if (!os && /Linux/.test(platform)) os = "Linux";
  return os;
}

export const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token") || false;

export const setToken = ({ token, temp }) =>
  !temp
    ? localStorage.setItem("token", token)
    : sessionStorage.setItem("token", token);

export const rmvToken = () =>
  localStorage.removeItem("token") || sessionStorage.removeItem("token");

export function hexToRgba(hex, a = 1) {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    return (
      "rgba(" +
      [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
      "," +
      a +
      ")"
    );
  }
  throw new Error("Bad Hex");
}

export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export function copyCmd(text, success, fail, $) {
  $(document.body).append(
    `<input id="copyText" value=${text} style="left:-1000px;width:0;height:0;position:fixed"/>`
  );
  $("#copyText").focus();
  $("#copyText").select();
  let status = document.execCommand("copy");
  $("input#copyText").remove();
  if (status && success) success();
  else if (!status && fail) fail();
}
export function copy(text, success, fail, $) {
  if (!navigator.clipboard) copyCmd(text, success, fail, $);
  else {
    navigator.clipboard.writeText(text).then(
      () => {
        if (success) success();
      },
      () => copyCmd(text, success, fail, $)
    );
  }
}
// export function paste(e,success,fail) {
//   e=$_(e);
//   if (!navigator.clipboard) pasteCmd(e);
//   else {
//       navigator.clipboard.readText().then(txt=>{
//       text(e,txt);
//       e.value=txt;
//       success();
//     },()=>pasteCmd(e,success,fail));
//   }
// }
// export function pasteCmd(e,success,fail) {
//
//   e.focus();
//   var status=document.execCommand("paste");
//   if(status && success)success();
//   else if (!status && fail)fail();
// }

export function vibrate(pattern) {
  navigator.vibrate =
    navigator.vibrate ||
    navigator.webkitVibrate ||
    navigator.mozVibrate ||
    navigator.msVibrate;
  return window.navigator.vibrate(pattern) ? true : false;
}

export function notification(noti_obj) {
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      let notification = new Notification(noti_obj.title, noti_obj);
      notification.onclick = noti_obj.click;
      notification.onclose = noti_obj.close;
      notification.onerror = noti_obj.error;
      notification.onshow = noti_obj.show;
    } else {
      Notification.requestPermission(() => {
        return Notification.permission === "granted"
          ? notification(noti_obj)
          : false;
      });
    }
  } else return false;
}

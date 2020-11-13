// 日期格式化
/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * eg:
 * dateFormat(new Date(),"yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * dateFormat(new Date(),"yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * dateFormat(new Date(),"yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * dateFormat(new Date(),"yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * dateFormat(new Date(),"yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 *
 */
// dateFormat 用例
// 获取最近 10 天的日期
// let list = []
// for (let i = 0; i < 10; i++) {
//   list.unshift(
//     dateFormat(
//       new Date(
//         new Date().setDate(new Date().getDate() - i)
//       ).toLocaleDateString(),
//       'MM-dd'
//     )
//   )
// }
// this.date = list[0]
// this.dateTimes = list
const dateFormat = (date, format) => {
  let iDate = null
  if (typeof date === 'number') {
    iDate = new Date(date)
  } else if (typeof date === 'string') {
    date = date.replace(/-/g, '/')
    if (date.indexOf('T') > -1) {
      let dotIndex = date.indexOf('.')
      date = date.substr(0, dotIndex)
      date = date.replace('T', ' ')
      date = new Date(date).getTime()
    }

    if (!isNaN(Number(date))) {
      date = Number(date)
    }

    iDate = new Date(date)
  } else if (date instanceof Date) {
    iDate = date
  } else {
    return false
  }

  // 时区
  // let timestamp = iDate.getTime()/1000 - 8 * 60 * 60;
  // iDate = new Date(timestamp*1000);

  let o = {
    'M+': iDate.getMonth() + 1, // 月份
    'd+': iDate.getDate(), // 日
    'h+': iDate.getHours() % 24 === 0 ? 24 : iDate.getHours() % 24, // 小时
    'H+': iDate.getHours(), // 小时
    'm+': iDate.getMinutes(), // 分
    's+': iDate.getSeconds(), // 秒
    'q+': Math.floor((iDate.getMonth() + 3) / 3), // 季度
    'S': iDate.getMilliseconds() // 毫秒
  }

  if (!format) {
    format = 'yyyy-MM-dd hh:mm:ss'
  }
  let week = {
    '0': '\u65e5',
    '1': '\u4e00',
    '2': '\u4e8c',
    '3': '\u4e09',
    '4': '\u56db',
    '5': '\u4e94',
    '6': '\u516d'
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (iDate.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(format)) {
    format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[iDate.getDay() + ''])
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }

  return format
}

// let a= minToHour(1880)
// console.info(a)
const minToHour = (str) => {
  if (str !== "0" && str !== "" && str !== null) {
    return ((Math.floor(str / 60)).toString().length < 2 ? "0" + (Math.floor(str / 60)).toString() :
      (Math.floor(str / 60)).toString()) + ":" + ((str % 60).toString().length < 2 ? "0" + (str % 60).toString() : (str % 60).toString());
  }
  else
  {
    return "";
  }
}

// let b= hourToMin('22:11')
// console.info(b)
const hourToMin = (str) => {
  var arrminutes = str.split(":");
  if (arrminutes.length == 2) {
    var minutes = parseInt(arrminutes[0]) * 60 + parseInt(arrminutes[1]);
    return minutes;
  }
  else {
    return 0;
  }
}




export {dateFormat, minToHour, hourToMin}

export function formatDate(date, fmt) {
 if (/(y+)/.test(fmt)) {
  // date.getFullYear() + '' 把数字变成字符串
  fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)) // 根据y的个数来截取年份
 }
 let o = {
  'M+': date.getMonth() + 1,
  'd+': date.getDate(),
  'h+': date.getHours(),
  'm+': date.getMinutes(),
  's+': date.getSeconds()
 }
 for (let k in o) {
  if (new RegExp(`(${k})`).test(fmt)) {
   let str = o[k] + '' // 把数字变成字符串
   // 如果m/d/h/s 只匹配到一个，则替换为str(当前获得的值)
   fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
  }
 }
 return fmt
}

function padLeftZero(str) {
 return ('00' + str).substr(str.length)
}

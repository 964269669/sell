// 解析url参数
export function urlParse() {
  let url = window.location.search
  let obj = {}
  let reg = /[?&][^?&=]+=[^?&=]+/g
  let arr = url.match(reg)
  // console.log(arr) ["?id=3"] ["&a=b"]
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=')
      // console.log(tempArr) ["id", "3"]
      let key = decodeURIComponent(tempArr[0])
      let val = decodeURIComponent(tempArr[1])
      obj[key] = val
    })
  }
  return obj
}

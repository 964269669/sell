// 设置缓存
export function saveToLocal(id, key, value) {
  let seller = window.localStorage._seller_
  if (!seller) {
    seller = {}
    seller[id] = {}
  } else {
    // 从localStorage中获取的是字符串 要转为对象
    seller = JSON.parse(seller)
    // 如果没有该id
    if (!seller[id]) {
        seller[id] = {}
    }
  }
  seller[id][key] = value
  // localStorage不能直接存储对象类型的数据
  window.localStorage._seller_ = JSON.stringify(seller)
}

// 读取缓存
export function loadFromLocal(id, key, def) {
  let seller = window.localStorage._seller_
  if (!seller) {
    return def
  }
  seller = JSON.parse(seller)[id]
  if (!seller) {
    return def
  }
  let ret = seller[key]
  return ret || def
}

// 判断是否为对象类型
const isObject = (val) => val && typeof val === 'object'
// 对数组类型的值，去重合并
const mergeArrayWithDedupe = (a, b) => Array.from(new Set([...a, ...b]))

/**
 * @description 递归地将新对象的内容合并到现有对象中
 * @param {Object} target 已存在的对象
 * @param {Object} obj 新对象
 */
module.exports=function deepMerge(target, obj) {
  for (const key of Object.keys(obj)) {
    const oldVal = target[key]
    const newVal = obj[key]

    if (Array.isArray(oldVal) && Array.isArray(newVal)) {
      // 如果是数组类型的值，去重合并
      target[key] = mergeArrayWithDedupe(oldVal, newVal)
    } else if (isObject(oldVal) && isObject(newVal)) {
      // 如果是对象类型的值，递归
      target[key] = deepMerge(oldVal, newVal)
    } else {
      // 其他类型的值，用新值覆盖旧值
      target[key] = newVal
    }
  }
  // 返回重新赋值后的目标对象
  return target
}

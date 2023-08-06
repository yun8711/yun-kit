const path = require('path')
const fs = require('fs')
const deepMerge = require('./deepMerge')
const sortDependencies = require('./sortDependencies')

/**
 * @description 复制目录文件
 * @param src 源目录路径
 * @param dest 目标目录路径
 */
module.exports = function copyTemplate(src, dest) {
  // 获取源路径的目录信息fs.Stats
  const stats = fs.lstatSync(src)
  // 获取文件名，包含扩展名
  const filename = path.basename(src)
  // 如果是文件夹类型
  if (stats.isDirectory()) {
    // 跳过node_module目录
    if (path.basename(src) === 'node_modules') return
    // 如果它是一个目录，递归地呈现它的子目录和文件
    fs.mkdirSync(dest, {recursive: true})
    // fs.readdirSync表示读取目录的文件/子目录列表，返回一个string[]
    // 这里以递归方式处理
    for (const file of fs.readdirSync(src)) {
      copyTemplate(path.resolve(src, file), path.resolve(dest, file))
    }
    if (path.basename(src) === '_husky') fs.renameSync(dest,dest.replace('_husky','.husky'))
    return
  }

  // 如果是文件类型
  // 如果目标目录package.json文件已存在，需要重写name属性，合并属性
  if (filename === 'package.json' && fs.existsSync(dest)) {
    // 读取目标目录已存在的信息
    const existing = JSON.parse(fs.readFileSync(dest, 'utf8'))
    // 读取模板中package.json配置信息
    const newPackage = JSON.parse(fs.readFileSync(src, 'utf8'))
    const pkg = sortDependencies(deepMerge(existing, newPackage))
    // 写入目标目录
    fs.writeFileSync(dest, JSON.stringify(pkg, null, 2) + '\n') // 向目标文件写入新配置项
    return
  }
  // 如果名称以_开头，重命名为以.开头
  if (filename.startsWith('_')) {
    // rename `_file` to `.file`
    dest = path.resolve(path.dirname(dest), filename.replace(/^_/, '.'))
  }
  // 默认操作：把文件复制到目标文件
  fs.copyFileSync(src, dest)
}

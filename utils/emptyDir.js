// 清空目录
import * as fs from 'fs'

module.exports = function emptyDir(dir) {
  // 如果目录不存在，不做操作
  if (!fs.existsSync(dir)) {
    return
  }
  fs.rmdirSync(dir, { recursive: true })
  // 如果目录存在，执行一个递归方法
  // postOrderDirectoryTraverse(
  //     dir,
  //     (dir) => fs.rmdirSync(dir),  // 删除目录
  //     (file) => fs.unlinkSync(file)  // 删除文件
  // )
}

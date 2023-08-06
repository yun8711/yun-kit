const shell = require('shelljs')

/**
 * @description 在当前目录下安装依赖
 * @param dir 项目根目录
 * @param dependencyStr 可行，指定安装的依赖字符串
 */
module.exports = function (dir, dependencyStr) {
  console.log(`\n开始安装依赖...`)
  shell.cd(dir)
  console.log(`\n推荐使用 pnpm 包管理器`)
  shell.exec('npm install pnpm -g')
  if (!dependencyStr) {
    shell.exec('pnpm install')
  } else {
    shell.exec(`pnpm install ${dependencyStr}`)
  }
}

const shell = require('shelljs')

/**
 * @description 本地仓库关联远程仓库
 * @param url 远程仓库地址
 * @param branch 远程仓库分支
 */
function pushGit(url, branch,projectRoot) {
  if (!url){
    console.log('\n缺少仓库地址')
    process.exit(1)
  }
  console.log(`\n关联远程仓库...`)
  shell.cd(projectRoot)
  // shell.exec(`git init`)
  shell.exec(`git add .`)
  shell.exec(`git commit -m "初始化项目"`)
  // shell.exec(`git remote add ${branch} ${url}`)
  shell.exec(`git push -u origin ${branch}`)
  shell.cd('..')
}


function initGit(url,projectRoot){
  console.log(`\n推送到远程仓库...`)
  shell.cd(projectRoot)
  shell.exec(`git init`)
  shell.exec(`git remote add origin ${url}`)
  shell.exec(`git pull`)
  shell.cd('..')
}

module.exports = {
  initGit,
  pushGit
}

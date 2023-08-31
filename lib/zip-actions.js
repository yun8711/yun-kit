const path = require('node:path');
const fs = require('fs-extra');
const ora = require('ora');
const shell = require('shelljs');
const print = require('../utils/print');
const { validatePath } = require('../utils/validate');

function zipDist(options) {
  const startTime = new Date().getTime();
  const cwd = process.cwd();
  if (options.build) {
    print.info('开始执行构建项目');
    shell.exec('npm run build');
  }
  print.info('开始压缩dist目录');
  // 获取dist目录
  const sourcePath = path.resolve(cwd, './dist');
  // 校验源dist目录是否存在
  validatePath(sourcePath);
  // 获取项目名称
  let name = require(path.resolve(cwd, 'package.json')).name;
  const zipName = `${name}_${getCurTimeStr()}.zip`;
  // 如果压缩包已存在，则删除
  if (fs.pathExistsSync(path.resolve(cwd, zipName))) {
    fs.removeSync(path.resolve(cwd, zipName));
  }
  shell.cd(sourcePath);
  shell.exec(`zip -r -q ../${zipName} *`);
  print.info(`压缩完成，用时：${new Date().getTime() - startTime}ms`);
}

function zipProject(options) {
  print.info('开始压缩项目');
  const startTime = new Date().getTime();
  const cwd = process.cwd();
  const name = options.name || require(path.resolve(cwd, 'package.json')).name + '-source';
  const zipName = `${name}_${getCurTimeStr()}.zip`;
  // 如果压缩包已存在，则删除
  if (fs.pathExistsSync(path.resolve(cwd, zipName))) {
    fs.removeSync(path.resolve(cwd, zipName));
  }
  const excludeStr = `-x "*.zip" "node_modules/*" "dist/*" ".git/*" ".vscode/*" ".idea/*"`;
  const child = shell.exec(`zip -r -q ${zipName} . ${excludeStr}`, { silent: false, async: true });
  const spinner = ora('正在压缩').start();
  child.stdout.on('data', function (data) {
    spinner.text = data;
  });
  child.on('exit', function (code, signal) {
    spinner.stop();
    print.info(`压缩完成，用时：${new Date().getTime() - startTime}ms`);
  });
}

// 返回当前时间值字符串，格式为：08091530
function getCurTimeStr() {
  const date = new Date();
  const month = date.getMonth() + 1 + '';
  const day = date.getDate() + '';
  const hour = date.getHours() + '';
  const minute = date.getMinutes() + '';
  return (
    (month.length === 1 ? '0' + month : month) +
    (day.length === 1 ? '0' + day : day) +
    (hour.length === 1 ? '0' + hour : hour) +
    (minute.length === 1 ? '0' + minute : minute)
  );
}

module.exports = { zipDist, zipProject };

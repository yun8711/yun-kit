const fs = require('node:fs');
const path = require('node:path');
const chalk = require('chalk');
const { gitClone } = require('../utils/gitClone');
// 读取模板库配置文件，路径registries.json，如果不存在则创建
let registries = getRegistries();

// 读取本地模板库文件，路径templates，如果不存在由创建，如果存在则与registries.json合并
const templatesPath = path.resolve(__dirname, '../templates');
if (!fs.existsSync(templatesPath)) {
  fs.mkdirSync(templatesPath);
}
registries.forEach((item) => {
  const templatePath = path.resolve(templatesPath, item.name);
  if (fs.existsSync(templatePath)) {
    const packageJson = require(path.resolve(templatePath, 'package.json'));
    item.version = packageJson.version;
  } else {
    item.version = '未下载';
  }
});

// 查看模板库列表
function listTemp() {
  if (registries.length === 0) {
    console.log(chalk.red('⚠️ 模板库列表为空'));
    return;
  }
  console.log('模板库列表：');
  const nameLength = registries.reduce((pre, cur) => Math.max(pre, cur.name.length), 0);
  const versionLength = registries.reduce((pre, cur) => Math.max(pre, cur.version.length), 0);

  registries.forEach((item) => {
    const str = `${chalk.green(item.active.padEnd(3))}${item.name.padEnd(nameLength)}  ${item.version.padEnd(
      versionLength,
    )}  ${item.registry}`;
    console.log(str);
  });
}

// 添加模板库
function addTemp(name, registry) {
  // 校验name，最长30 字符
  if (name.length > 30) {
    console.log(chalk.red('⚠️ 模板库名称最长30 字符'));
    return;
  }

  for (let i = 0; i < registries.length; i++) {
    const item = registries[i];
    if (item.name === name) {
      console.log(chalk.red(`⚠️ 模板库名称已存在：${name} `));
      return;
    }
    if (item.registry === registry) {
      console.log(chalk.red(`⚠️ 模板库地址已存在：${registry} `));
      return;
    }
  }
  registries.push({ name, registry, active: '*' });
  // 写入文件
  fs.writeFileSync(path.resolve(__dirname, './registries.json'), JSON.stringify(registries, null, 2));
  console.log(chalk.green(`模板库添加成功：${name} ${registry} `));
}

// 移除模板库
function rmTemp(name) {
  for (let i = 0; i < registries.length; i++) {
    const item = registries[i];
    if (item.name === name) {
      registries.splice(i, 1);
      // 重新写入配置文件
      fs.writeFileSync(path.resolve(__dirname, './registries.json'), JSON.stringify(registries, null, 2));
      // 如果本地存在模板库，则删除
      const templatePath = path.resolve(templatesPath, name);
      if (fs.existsSync(templatePath)) {
        fs.rmSync(templatePath, { recursive: true });
      }
      console.log(chalk.green(`模板库移除成功：${name} `));
      return;
    }
  }
  console.log(chalk.red(`⚠️ 模板库不存在：${name} `));
}

// 设置默认模板库
function useTemp(name) {
  for (let i = 0; i < registries.length; i++) {
    const item = registries[i];
    if (item.name === name) {
      item.active = '*';
    } else {
      item.active = '';
    }
  }
  // 写入文件
  fs.writeFileSync(path.resolve(__dirname, './registries.json'), JSON.stringify(registries, null, 2));
  console.log(chalk.green(`当前默认模板库：${name} `));
}

// 下载模板库，有name 则下载指定模板库，没有则下载所有模板库
function cloneTemp(name) {
  if (name) {
    // 下载指定模板库
    const gitUrl = registries.find((item) => item.name === name).registry;
    gitClone(gitUrl, name);
  }
}

// 读取模板库配置文件
function getRegistries() {
  let registries;
  const registryPath = path.resolve(__dirname, 'registries.json');
  if (fs.existsSync(registryPath) && fs.statSync(registryPath).isFile()) {
    registries = require('./registries.json');
  } else {
    fs.appendFileSync(registryPath, JSON.stringify([], null, 2));
    registries = [];
  }
  return registries;
}

module.exports = {
  listTemp,
  addTemp,
  rmTemp,
  useTemp,
  cloneTemp,
  getRegistries,
};

const fs = require('node:fs');
const path = require('node:path');
const chalk = require('chalk');
const columnify = require('columnify');
const { gitClone } = require('../utils/gitClone');
const registries = require('./registries.json');
// console.log('registries', registries);

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
  console.log('模板库列表：');
  const columns = columnify(registries, {
    showHeaders: false,
    minWidth: 3,
    columns: ['active', 'name', 'version', 'registry'],
  });
  console.log(columns);
}

// 添加模板库
function addTemp(name, registry) {
  for (let i = 0; i < registries.length; i++) {
    const item = registries[i];
    if (item.name === name) {
      console.log(chalk.red(`模板库名称已存在：${name} `));
      return;
    }
    if (item.registry === registry) {
      console.log(chalk.red(`模板库地址已存在：${registry} `));
      return;
    }
  }
  registries.push({ name, registry });
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
  console.log(chalk.red(`模板库不存在：${name} `));
}

// 设置默认模板库
function setDefaultTemp(name) {
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
  console.log(chalk.green(`当前模板库：${name} `));
}

// 下载模板库，有name 则下载指定模板库，没有则下载所有模板库
function cloneTemp(name) {
  if (name) {
    // 下载指定模板库
    const gitUrl = registries.find((item) => item.name === name).registry;
    console.log('gitUrl', gitUrl);
    gitClone(gitUrl, name);
  } else {
    // 下载所有模板库
  }
}

module.exports = {
  listTemp,
  addTemp,
  rmTemp,
  setDefaultTemp,
  cloneTemp,
};

const fs = require('fs-extra');
const path = require('node:path');
const shell = require('shelljs');
const chalk = require('chalk');
const print = require('../utils/print');
const { isGitUrl, isFolder } = require('../utils/validate');
const { gitClone } = require('../utils/gitClone');
// 读取模板库配置文件，路径registries.json，如果不存在则创建
let registries = getRegistries();
// 读取本地模板库文件，路径templates，如果不存在由创建，如果存在则与registries.json合并
const templatesPath = path.resolve(__dirname, '../templates');
fs.ensureDirSync(templatesPath);
// 获取本地模板库列表
registries.forEach((item) => {
  const templatePath = path.resolve(templatesPath, item.name);
  if (fs.pathExistsSync(templatePath)) {
    const packageJson = require(path.resolve(templatePath, 'package.json'));
    item.version = packageJson.version;
  } else {
    item.version = '未下载';
  }
});

// 查看模板库列表
function listTemp() {
  if (registries.length === 0) {
    print.warn('模板库列表为空');
    shell.exit(0);
  }
  print.info('模板库列表：');
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
function addTemp(name, registry, options) {
  console.log(name, registry, options);
  if (options.link) {
    if (!isFolder(registry)) {
      print.warn('本地模板库不存在');
      shell.exit(0);
    }
  } else {
    if (!isGitUrl(registry)) {
      print.warn('git仓库地址不合法');
      shell.exit(0);
    }
  }
  // 校验name，最长30 字符
  if (name.length > 30) {
    print.warn('模板库名称最长30 字符');
    shell.exit(0);
  }

  for (let i = 0; i < registries.length; i++) {
    const item = registries[i];
    if (item.name === name) {
      print.warn(`模板库名称已存在：${name} `);
      shell.exit(0);
    }
    if (item.registry === registry) {
      print.warn(`模板库地址已存在：${registry} `);
      shell.exit(0);
    }
  }

  registries.push({ name, registry, active: registries.length === 0 ? '*' : '', link: options.link });

  if (options.link) {
    fs.ensureSymlinkSync(registry, path.resolve(templatesPath, name), 'dir');
  }
  // 写入文件
  fs.outputFileSync(path.resolve(__dirname, './registries.json'), JSON.stringify(registries, null, 2));
  print.info(`模板库添加成功：${name} ${registry}`);
}

// 移除模板库
function rmTemp(name) {
  for (let i = 0; i < registries.length; i++) {
    const item = registries[i];
    if (item.name === name) {
      // 移除的是否为默认模板库
      const isDefault = item.active === '*';
      registries.splice(i, 1);
      // 如果移除的是默认模板库，则设置第一个为默认模板库
      if (isDefault && registries.length > 0) {
        registries[0].active = '*';
      }
      // 重新写入配置文件
      fs.outputFileSync(path.resolve(__dirname, './registries.json'), JSON.stringify(registries, null, 2));
      // 如果本地存在模板库，则删除
      const templatePath = path.resolve(templatesPath, name);
      fs.removeSync(templatePath);
      let str = `模板库移除成功：${name} `;
      if (isDefault && registries.length > 0) {
        str += `，当前默认模板库：${registries[0].name} `;
      }
      print.info(str);
      return;
    }
  }
  print.warn(`模板库不存在：${name} `);
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
  fs.outputFileSync(path.resolve(__dirname, './registries.json'), JSON.stringify(registries, null, 2));
  print.info(`当前默认模板库：${name}`);
}

// 下载模板库，有name 则下载指定模板库，没有则下载所有模板库
function cloneTemp(name) {
  if (name) {
    // 下载指定模板库
    const item = registries.find((item) => item.name === name);
    if (!item.link) {
      gitClone(item.registry, name);
    } else {
      print.warn('本地模板库无需下载');
    }
  } else {
    print.warn(`指定模板库不存在：${name} `);
    shell.exit(0);
  }
}

// 读取模板库配置文件
function getRegistries() {
  let registries = [];
  const registryPath = path.resolve(__dirname, 'registries.json');
  if (fs.pathExistsSync(registryPath)) {
    registries = require('./registries.json');
  } else {
    fs.outputFileSync(registryPath, JSON.stringify([], null, 2));
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

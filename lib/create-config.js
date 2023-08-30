const fs = require('fs-extra');
const fg = require('fast-glob');
const path = require('node:path');
const prompts = require('prompts');
const shell = require('shelljs');
const print = require('../utils/print');
const { getRegistries } = require('./temp-actions');

async function createConfig(name = '') {
  const pwd = process.cwd();
  const registries = getRegistries();
  if (!registries || registries.length === 0) {
    print.warn(`无可用模板库，运行 yk temp-add 添加模板库`);
    shell.exit(0);
  }

  // 获取默认模板库名称
  let tempName =
    name ||
    registries.find((item) => item.name === name)?.name ||
    registries.find((item) => item.active === '*')?.name ||
    registries[0]?.name;

  // 检查本地模板是否存在，不存在则提示下载
  const templatePath = path.resolve(__dirname, '../templates', tempName);
  if (!fs.pathExistsSync(templatePath)) {
    print.warn(`模板库 ${tempName} 未下载，运行 yk temp-clone ${tempName} 命令下载`);
    shell.exit(0);
  } else {
    print.info(`当前使用模板库：${tempName}`);
  }

  // 2.从指定模板目录中获取所有config-*目录，组合成完整选项
  const entries = fg.sync([`config-*`], {
    onlyDirectories: true,
    cwd: templatePath,
    deep: 1,
  });

  // 3.交互式选择配置
  let curMetadata = null;
  const answer = await prompts([
    // 选择一级类型
    {
      type: 'select',
      name: 'type',
      message: '请选择配置类型：',
      choices: entries.map((item) => {
        return {
          title: item.replace('config-', ''),
          value: item,
        };
      }),
    },
    // 选择二级配置
    {
      type: 'select',
      name: 'index',
      message: '请选择配置文件：',
      choices: (prev, values) => {
        const metadataPath = path.resolve(templatePath, values.type, 'metadata.js');
        if (!fs.pathExistsSync(metadataPath)) {
          print.warn(`配置文件不存在：${metadataPath}`);
          shell.exit(0);
        }
        const metadata = require(metadataPath);
        curMetadata = metadata;
        return metadata.map((item, index) => {
          return {
            ...item,
            value: index,
          };
        });
      },
    },
  ]);
  // 当前选择的配置元信息
  const { filesMap = {}, tips = [] } = curMetadata[answer.index];

  // 复制配置文件
  for (const sourcePath in filesMap) {
    fs.copySync(path.resolve(templatePath, answer.type, sourcePath), path.resolve(pwd, filesMap[sourcePath]));
  }

  // 打印提示信息
  if (tips.length > 0) {
    print.chalk(`🪧 提示： 👇`, 'yellowBright');
    tips.forEach((tip) => {
      print.tip(tip);
    });
  }

  // 打印个人网站信息
  print.info(`查询更多配置信息，请登录：https://yun8711.github.io/I-hate-configuration/`);
}

module.exports = createConfig;

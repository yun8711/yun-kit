const fs = require('node:fs');
const path = require('node:path');
const chalk = require('chalk');
const prompts = require('prompts');
const pkgInstall = require('../utils/pkgInstall');
const shell = require('shelljs');
const spawnSync = require('../utils/spawnSync');
const { getRegistries } = require('./temp-actions');
const registries = getRegistries();

async function createConfig(name) {
  // 获取默认模板库名称
  let tempName = registries.find((item) => item.name === name)?.name;
  if (!tempName) {
    console.log(chalk.red(`⚠️ 指定模板库 ${name} 不存在，使用默认模板库`));
    tempName = registries.find((item) => item.active === '*')?.name;
  }
  // 检查本地模板是否存在，不存在则提示下载
  const templatePath = path.resolve(__dirname, '../templates', tempName);
  if (!fs.existsSync(templatePath)) {
    console.log(chalk.red(`⚠️ 模板库未下载，请运行 yk temp-clone ${tempName} 命令下载`));
    shell.exit(0);
  } else {
    console.log(chalk.green(`⭕  当前使用模板库：${tempName}`));
  }

  // 2.从本地模板目录中获取所有config-*目录，组合成完整选项
  // 获取可用配置目录：以config-开头的目录
  const r = shell.ls(templatePath).filter((item) => item.startsWith('config-'));
  // 可选的配置类型
  let configArr = [
    // {
    //   title: "eslint",
    //   value: "config-eslint",
    //   metadata:[
    //     {
    //       title: "vue2",
    //       value: "vue2.js",
    //     }
    //   ]
    // }
  ];
  r.forEach((item) => {
    // 配置对象，后续用来生成一级选项
    const configItem = {
      title: item.replace('config-', ''),
      value: item,
      metadata: [],
    };
    // 某个类型的配置目录元信息
    const configMetadataPath = path.resolve(templatePath, item, 'metadata.js');
    if (fs.existsSync(configMetadataPath)) {
      // 读取配置元信息，当作二级选项
      configItem.metadata = require(configMetadataPath);
      configArr.push(configItem);
    }
  });
  // 3.交互式选择配置
  const answer = await prompts([
    // 选择一级类型
    {
      type: 'select',
      name: 'type',
      message: '请选择配置类型：',
      choices: configArr,
    },
    // 选择二级配置
    {
      type: 'select',
      name: 'name',
      message: '请选择配置文件：',
      choices: (prev, values) => {
        const configType = values.type;
        const configItem = configArr.find((item) => item.value === configType);
        return configItem.metadata;
      },
    },
    // 是否自动安装依赖
    {
      name: 'autoInstall',
      type: 'toggle',
      message: '是否自动安装依赖：',
      active: '是',
      inactive: '否',
      initial: true,
    },
    {
      name: 'engine',
      type: (prev, values) => {
        if (values.autoInstall) {
          return 'select';
        }
        return null;
      },
      message: '选择包管理器：',
      choices: [
        { title: 'pnpm', value: 'pnpm' },
        { title: 'npm/cnpm', value: 'npm' },
        { title: 'yarn', value: 'yarn' },
      ],
    },
    {
      name: 'extraArgs',
      type: 'text',
      message: '附加参数：',
    },
  ]);
  // 获取配置类型
  const configType = configArr.find((item) => item.value === answer.type);
  // 获取配置信息
  const curConfig = configType.metadata.find((item) => item.value === answer.name);
  // 4.用户选择后，将对应的模板文件拷贝到当前目录下
  const pwd = process.cwd();
  // 复制配置文件
  // 复制默认配置文件到项目
  Object.entries(curConfig.filesMap).forEach(([key, value]) => {
    shell.cp('-R', path.resolve(templatePath, answer.type, key), path.resolve(pwd, value));
  });

  // console.log('curConfig',curConfig);
  const { dependencies, hooks } = curConfig;
  if (!answer.autoInstall) {
    console.log(chalk.yellowBright(`👉 请手动安装依赖`));
  } else {
    // 自动安装流程：
    // 1.把执行过程分解成多个命令，使用 spawnSync 命令依次执行，
    // 2.在yun-kit中执行安装依赖的命令
    // 3. 其他命令以hooks 的形式在templates 中定义，在yun-kit中执行
    // 执行过程
    // hook: beforeInstall
    // 安装依赖，安装全局、生产、开发依赖
    // hook: afterInstall
    const commands = [];
    hooks?.beforeInstall && hooks.beforeInstall(shell, pwd);
    // 整理安装依赖的命令
    Object.entries(dependencies).forEach(([key, value]) => {
      if (key) {
        const cmd = pkgInstall(answer, key, value);
        cmd && commands.push(cmd);
      }
    });
    // 安装依赖
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      await spawnSync(...command);
    }
    // 安装后hook
    hooks?.afterInstall && hooks.afterInstall(shell, pwd);
  }
}

module.exports = createConfig;

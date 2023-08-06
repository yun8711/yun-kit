#!/usr/bin/env node
const { program } = require("commander");
// const chalk = require('chalk')
// const shell = require('shelljs')
const packageInfo = require("../package.json");
const process = require("node:process");

// require('../utils/checkNodeVersion')()

// 查询版本号：kd-cli -v | -V | --version
program.version(packageInfo.version, "-V,-v,--version", "当前版本号");

// 下载模板库
program
  .command("download")
  .description("下载模板库 | Downloading the template library")
  .action(() => {
    require("../utils/downloadTemplates.js");
  });

// 创建配置文件
program
  .command("config")
  .description("创建配置文件 | create configuration files")
  .action(require("../lib/create-config"));

// // 初始化项目：kd-cli create
// program
//   .command('create')
//   .description('微前端项目初始化')
//   .action(() => {
//     // 清屏，并显示当前kd-cli版本
//     // shell.exec('clear')
//     // console.log(chalk.blue('kd-cli v' + packageInfo.version))
//     require('../lib/create')()
//   })

// // 检查依赖是否正确：kd-cli check-pkg -a | --all
// program
//   .command('check')
//   .description('检查项目中依赖安装')
//   .option('-a --all', '查看完整检查结果')
//   .option('--auto-fix', '自动修复异常依赖项')
//   .action((options) => {
//     require('../lib/check-pkg')(options)
//   })

// // 检查依赖是否正确：kd-cli check-pkg -a | --all
// program
//   .command('api <url>')
//   .description('自动生成接口文件')
//   .option('-t --test', '测试生成结果')
//   .action((options) => {
//     require('../lib/create-api')(options)
//   })

// program
//   .command('ui')
//   .description('打开可视化界面')
//   .option('-H, --host <host>', '可视化服务主机号 (默认: localhost)')
//   .option('-p, --port <port>', '可视化服务端口号 (by default search for available port)')
//   .option('-D, --dev', 'Run in dev mode')
//   .option('--quiet', '不输出起始消息') // Don't output starting messages
//   .option('--headless', '不要在启动和输出端口打开浏览器') //Don't open browser on start and output port
//   .action((options) => {
//     // checkNodeVersion('>=8.6', 'vue ui')
//     require('../lib/ui')(options)
//   })

// program
//   .command('diff')
//   .description('比较两个文件夹的差异')
//   .option('-s, --source <source>', '源文件夹')
//   .option('-t, --target <target>', '目标文件夹')
//   .action((options) => {
//     require('../lib/diff')(options)
//   })

program.parse(process.argv);
// http://192.168.12.205:8016/rhea/v2/api-docs?group=rhea-v1

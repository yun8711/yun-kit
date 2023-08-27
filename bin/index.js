#!/usr/bin/env node
const { program } = require('commander');
const packageInfo = require('../package.json');
const process = require('node:process');

// 查询版本号：kd-cli -v | -V | --version
program.version(packageInfo.version, '-V,-v,--version', '当前版本号');

// 一、模板库操作
// 添加模板库
program
  .command('temp-add <name> <registry>')
  .description('添加模板库 | Add template library')
  .action(require('../lib/temp-actions.js').addTemp);
// 删除模板库
program
  .command('temp-rm <name>')
  .description('移除模板库 | Remove template library')
  .action(require('../lib/temp-actions.js').rmTemp);
// 列出所有模板库
program
  .command('temp-ls')
  .description('列出所有可用的模板库 | List all available template libraries')
  .action(require('../lib/temp-actions.js').listTemp);
// 设置默认模板库
program
  .command('temp-use <name>')
  .description('设置默认模板库 | Set the default template library')
  .action(require('../lib/temp-actions.js').useTemp);
// 下载/更新模板库
program
  .command('temp-clone <name>')
  .description('下载模板库 | Download template library')
  .action(require('../lib/temp-actions.js').cloneTemp);

// 创建配置文件
program
  .command('config [template-name]')
  .description('创建配置文件 | create configuration files')
  .action(require('../lib/create-config'));

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

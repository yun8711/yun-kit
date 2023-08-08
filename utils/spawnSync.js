const { spawn } = require('node:child_process');
const chalk = require('chalk');
const ora = require('ora');

/**
 * @description spawn 方法封装为Promise，便于调用
 * @param command
 * @param args
 * @return {Promise<unknown>}
 */
function spawnSync(command, args) {
  const commandStr = [command, ...args].join(' ');
  console.log(chalk.green(`安装依赖：${commandStr}`));
  const spinner = ora().start();
  return new Promise((resolve, reject) => {
    const child = spawn(command, args);

    child.stdout.on('data', (data) => {
      spinner.text = chalk.green(data);
    });

    child.stderr.on('data', (data) => {
      spinner.fail(chalk.red(data));
    });

    child.on('close', (code) => {
      console.log(`子进程退出码：${code}`);
      if (code === 0) {
        spinner.succeed(chalk.green(`执行成功`));
        resolve();
      } else {
        spinner.fail(chalk.red(`执行失败: 退出码 ${code}`));
        reject(new Error(`执行失败: 退出码 ${code}`));
      }
    });
  });
}

module.exports = spawnSync;

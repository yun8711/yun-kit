const shell = require('shelljs');
const chalk = require('chalk');
const ora = require('ora');
const { spawn } = require('node:child_process');
const path = require('node:path');
const { existsSync } = require('node:fs');

function gitClone(url, dir) {
  if (!shell.which('git')) {
    console.log(chalk.yellow('⚠️ 未安装git, 请先安装git'));
    shell.exit(1);
  }

  const tempPath = path.resolve(__dirname, '../templates', dir);
  if (existsSync(tempPath)) {
    shell.rm('-rf', tempPath);
  }

  const spinner = ora(chalk.green(`开始下载模板库：${url}`)).start();
  const child = spawn('git', ['clone', url, tempPath]);

  child.stdout.on('data', (data) => {
    spinner.text = chalk.green(data);
  });

  child.stderr.on('data', (data) => {
    spinner.text = chalk.red(data);
  });

  child.on('close', (code) => {
    if (code === 0) {
      spinner.succeed(chalk.green(`下载成功`));
    } else {
      spinner.fail(chalk.red(`下载失败: 退出码 ${code}`));
    }
  });
}

module.exports = {
  gitClone,
};

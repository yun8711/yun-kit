const chalk = require("chalk");
const ora = require("ora");
const download = require("download-git-repo");

// TODO 优化：下载前先对比本地模板库版本，如果一致，则不下载
// TODO 优化：download-git-repo只兼容github、gitlab，需要兼容其他，如gitee，需要自己实现
// TODO 优化：网络问题下载失败时，重试，最多重试3次
// TODO 优化：下载过程中，显示进度条
function downloadTemplates() {
  console.log(chalk.green("📥 开始下载模板库，请稍候...\n"));
  const spinner = ora(chalk.green("🕦 下载中...\n"));
  spinner.start();
  download("yun8711/templates", "templates", { clone: false }, function (err) {
    if (err) {
      spinner.fail(chalk.red("下载失败 🎃 \n"));
      console.log(err);
    } else {
      spinner.succeed(chalk.green("下载成功! 🎉 \n"));
    }
  });
}

downloadTemplates();

// module.exports = downloadTemplates;

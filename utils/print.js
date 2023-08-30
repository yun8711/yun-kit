const chalk = require('chalk');

module.exports = {
  chalk(msg, color = 'greenBright') {
    console.log(chalk[color](msg));
  },
  info(msg) {
    console.log(chalk.greenBright(`🔰 ${msg}`));
  },
  warn(msg) {
    console.log(chalk.redBright(`⚠️ ${msg}`));
  },
  tip(msg) {
    console.log(chalk.yellowBright(`🌼 ${msg}`));
  },
};

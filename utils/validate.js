const fs = require('fs-extra');
const print = require('./print');
// 校验是否为合法的git仓库地址,支持ssh和https
const isGitUrl = (url) => {
  const reg =
    /^(git|http|https|ssh):\/\/[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)+(:[0-9]+)?(\/[a-zA-Z0-9\-_]+)+\.git$/;
  return reg.test(url);
};

// 校验是否为存在的文件夹
const isFolder = (name) => {
  return fs.pathExistsSync(name);
};

const validatePath = (name) => {
  if (!isFolder(name)) {
    print.warn(`文件夹 ${name} 不存在`);
    process.exit(1);
  }
};

module.exports = {
  isGitUrl,
  isFolder,
  validatePath,
};

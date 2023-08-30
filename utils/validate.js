const fs = require('fs-extra');
// 校验是否为合法的git仓库地址,支持ssh和https
const isGitUrl = (url) => {
  const reg = /^(git|http|https|ssh):\/\/[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)+(:[0-9]+)?(\/[a-zA-Z0-9\-_]+)+\.git$/;
  return reg.test(url);
};

// 校验是否为存在的文件夹
const isFolder = (name) => {
  return fs.pathExistsSync(name);
};

module.exports = {
  isGitUrl,
  isFolder,
};

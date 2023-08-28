const fs = require('node:fs');
const { exit } = require('shelljs');

// 读取文件内容
async function readFile(file) {
  return new Promise((resolve) => {
    if (!fs.existsSync(file)) {
      resolve({});
    } else {
      try {
        // const content = ini.parse(fs.readFileSync(file, 'utf-8'));
        const content = fs.readFileSync(file, 'utf-8');
        resolve(content);
      } catch (error) {
        exit(error);
      }
    }
  });
}

// 写入文件内容
async function writeFile(path, content) {
  return new Promise((resolve) => {
    try {
      fs.writeFileSync(path, content);
      resolve();
    } catch (error) {
      exit(error);
    }
  });
}

const fs = require("fs-extra");
const path = require("node:path");
const chalk = require("chalk");
const { glob, globSync } = require("glob");
const prompts = require("prompts");
const { execSync } = require("node:child_process");
const installFuncs = require("../utils/engineCmd");

async function createConfig() {
  // 1.检查本地模板是否存在，不存在则提示并下载
  const templatePath = path.resolve(__dirname, "../templates");
  const isExist = await fs.pathExists(templatePath);
  if (!isExist) {
    console.log(
      chalk.yellowBright(
        "⭕ 本地模板不存在，请运行 yun-cli download 命令下载模板库",
      ),
    );
  }

  // 2.从本地模板目录中获取所有config-*目录，组合成完整选项
  // 获取可用配置目录：以config-开头的目录
  const r = await glob("../templates/config-**");
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
    // 目录名称
    const dirName = path.basename(item);
    // 配置对象，后续用来生成一级选项
    const configItem = {
      title: dirName.replace("config-", ""),
      value: dirName,
      metadata: [],
    };
    // 某个类型的配置目录元信息
    const configMetadataPath = path.resolve(templatePath, item, "metadata.js");
    if (fs.pathExistsSync(configMetadataPath)) {
      // 读取配置元信息，当作二级选项
      configItem.metadata = require(configMetadataPath);
      configArr.push(configItem);
    }
  });
  // 3.交互式选择配置
  const answer = await prompts([
    // 选择一级类型
    {
      type: "select",
      name: "type",
      message: "请选择配置类型：",
      choices: configArr,
    },
    // 选择二级配置
    {
      type: "select",
      name: "name",
      message: "请选择配置文件：",
      choices: (prev, values) => {
        const configType = values.type;
        const configItem = configArr.find((item) => item.value === configType);
        return configItem.metadata;
      },
    },
    // 是否自动安装依赖
    {
      name: "autoInstall",
      type: "toggle",
      message: "是否自动安装依赖：",
      active: "是",
      inactive: "否",
    },
    {
      name: "engine",
      type: (prev, values) => {
        if (values.autoInstall) {
          return "select";
        }
        return null;
      },
      message: "选择包管理器：",
      choices: [
        { title: "pnpm", value: "pnpm" },
        { title: "npm/cnpm", value: "npm" },
        { title: "yarn", value: "yarn" },
      ],
    },
  ]);
  // console.log(answer);
  // 获取配置类型
  const configType = configArr.find((item) => item.value === answer.type);
  // 获取配置信息
  const curConfig = configType.metadata.find(
    (item) => item.value === answer.name,
  );
  // 4.用户选择后，将对应的模板文件拷贝到当前目录下，同时安装依赖
  const pwd = process.cwd();
  // 复制配置文件
  // 复制默认配置文件到项目
  Object.entries(curConfig.filesMap).forEach(([key, value]) => {
    fs.copySync(
      path.resolve(templatePath, answer.type, key),
      path.resolve(pwd, value),
    );
  });

  const dependencies = `${curConfig.dependencies}`;
  if (!answer.autoInstall) {
    console.log(
      chalk.yellowBright(`请手动安装依赖，例如：pnpm i -D ${dependencies}`),
    );
  } else {
    // 自动安装依赖，要区分依赖类型：全局、开发、生产
    const commands = [];
    Object.entries(curConfig.dependencies).forEach(([key, value]) => {
      if (key) {
        commands.push(installFuncs[answer.engine + "Install"](value, key));
      }
    });
    execSync("cd " + pwd);
    execSync(commands.join(" && "));
  }
}

module.exports = createConfig;

<h1> yun-kit 前端开发辅助工具</h1>



yun-kit 是一个命令行工具，集成了前端开发过程中的常见的工具方法和操作，助力前端开发更加自动化。



## 前言

原本它只是一个脚手架工具，就是为了公司内部快速创建项目使用，但是在实际应用中暴露出几个问题：

（1）使用率低

在实际开发中，开发新项目的场景并不是很多，更多的情况是对旧项目的维护，以及对古老项目的升级改造或者技术栈迁移。这个过程中，传统脚手架由于功能单一，很难发挥作用，很多情况下还需要人工手动操作，效率低下，且容易遗漏、出错。

（2）非业务功能对项目的侵入

比如，我们在某些情况下，需要给客户提供源码，或者要给客户提供打包后的代码，这时要对源码文件进行压缩，通常是需要手动操作的，同时效率也比较低，把它以 shell 脚本的形式写在项目里，又对项目本身造成了侵入。所以我希望能有其他的方式来自动化完成这个过程

（3）功能单一

传统的脚手架，只提供了单一的项目模板，以便快速生成项目，类型过于单一，不能满足实际业务中多样化、差异化的模板需求，不可能为了每个模板去创建一个脚手架，资源上造成了浪费。



## 介绍

基于上述的问题，在对一些常见的命令行工具（vue-cli、nest-cli、nrm 等）使用和阅读后，从中获得了一些灵感，借鉴了一些好的做法，对 yun-kit 进行了改造升级，扩展了它的功能、适用范围和应用场景。

**yun-kit 具有以下优点：**

- 改进脚手架功能：不仅可以以项目为粒度添加各种业务模板，还增加了许多业务中比较实用的功能
- 集成工程化配置能力：可以配合模板库进行工程配置的自动化创建，按项目需求增加部分配置，在旧项目迁移、改造中非常实用
- 扩展非项目功能：将一些原本在项目中的功能，统一到脚手架中，比如源码脱敏、源码压缩、swagger api 文档转换
- 模板库管理能力：cli 工具不再与模板库强关联，可以添加多个模板库，使用更加自由灵活，并且可以形成很好的技术沉淀

从实际使用的情况看，cli 工具与模板为分离的模式，是非常好的做法：

- cli 工具只提供核心功能方法，并定义使用该方法所需要的数据格式，而具体的模板代码由另一个仓库来完成，让 cli 更加专注于自身的稳定性与扩展性；
- 提供了一种低成本的代码复用的形式，在团队中可以把公共的页面、业务代码以模板库的形式整合，分享给其他开发者
- 独立的模板仓库，避免了涉及团队内部的一些代码的泄漏，因为你可以添加一个内部仓库地址或者本地目录作为模板库

<br/>

yun-kit 比较遗憾的地方，就是没有实现局部工程配置的自动化，一开始尝试在 yun-kit 中实现自动安装依赖，添加 scripts 脚本命令等操作，但实现过程中发现有些难点：

- 对不同类型包管理器的兼容不易，虽然有像 installpkg 这样的库，但是也不能满足需求
- 对命令参数的校验比较复杂，不能避免安装过程中的错误
- 使用环境的不确定性，例如在 monorepo 项目中，在根项目和子项目安装时参数不同
- 部分配置有交叉有关系，比如各种 Lint 一般会与 lint-staged 配合，lint-staged 又会与 git hook配合，增大了实现难度

因此在 yun-kit 中放弃了这部分功能的实现，以提示的形式来展示必要的信息，由开发者自行决定如何安装，而且自动安装依赖这项工作也不是 yun-kit 的重点。



## 用法

### 模板库管理

yun-kit 支持添加多个模板库，类似 nrm，使用时更自由更开放

- 添加模板库：
  - 添加 git 仓库为模板库：`yk temp-add <name> <registry>`， name 是为这个模板库自定义的名称，registry 应该是一个合法的 git 地址，内部使用 git clone 下载仓库
  - 添加本地目录为模板库：`yk temp-add <name> <path>`，path 应该是一个本地文件系统的绝对路径，内部会创建一个软链接，使用、调试更方便
- 删除模板库：`yk temp-rm <name>`
- 设置默认模板库：`yk temp-use <name>`
- 下载模板库：`yk temp-clone <name>`
- 查看模板库列表：`yk temp-ls`



## 模板库

模板库就是一个存放各种配置模板、项目模板的文件夹，但是为了配合 yun-kit，让它能够识别并解析，需要遵循一定的结构和规则：

```
├── config-eslint
│   └── metadata.js
├── config-prettier
│   └── metadata.js
├── config-xxx
│   └── metadata.js
├── project-vue2
└── 
```



### 配置模板 config-xxx

形如 `config-<name>` 这样，以`config-`开头的目录都是配置模板目录，name 表示该配置的分类，比如：eslint、stylelint、prettier

在每个配置的目录下，必须包含一个 `metadata.js`的配置元信息文件，基中定义了配置的不同方案以及该方案所需的主要信息，其他文件则是配置相关的文件模板，命名上没有限制。

以 config-eslint 为例，它的目录结构如下：

```
├── config-stylelint
│   ├── _stylelintignore
│   ├── vue-less.js
│   ├── vue-scss.js
│   └── metadata.js
```

 metadata.js 内容如下：

```js
module.exports=[
  {
    // 配置方案的名称
    title: "适用 vue + sass",  
    // 配置方案的文件映射关系
    filesMap: {
      "vue-scss.cjs": ".stylelintrc.cjs",
      "_stylelintignore": ".stylelintignore",
    },
    // 配置方案的依赖、脚本等提示信息
    tips:[
      '开发依赖：sass postcss-html postcss-scss stylelint stylelint-config-recess-order stylelint-config-recommended-vue stylelint-config-standard stylelint-config-standard-scss stylelint-prettier',
      '添加脚本："lint:style":"stylelint \"**/*.{css,scss,sass,vue}\" --allow-empty-input --fix"',
      'tip：可配合 lint-staged 使用'
    ],
  },
  {
    title: "适用 vue + less",
    filesMap: {
      "vue-less.cjs": ".stylelintrc.cjs",
      "_stylelintignore": ".stylelintignore",
    },
    tips:[
      '开发依赖：less postcss postcss-html postcss-less stylelint stylelint-config-recommended-vue stylelint-config-standard-vue stylelint-less stylelint-prettier',
      '添加脚本："lint:style":"stylelint \"**/*.{css,scss,sass,vue}\" --allow-empty-input --fix"',
      'tip：可配合 lint-staged 使用'
    ],
  }
]
```

在 yun-kit 中，会读取该配置元信息文件，并在使用时以命令行交互的形式展示，让使用者进行选择；当选择了某种配置的某个方案后，yun-kit 会按照 filesMap 中声明的文件映射关系将模板文件复制到项目中（如果已存在则会覆盖）；最后会把 tips 中的提示信息展示在控制台，由使用决定后续的操作。



### project-xxx 项目模板

待完善

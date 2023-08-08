// const fs = require('node:fs');
// const path = require('node:path');

// 可以从workspace 中获取子项目，作为scopes 的选项
// const pkgs1 = fs.readdirSync(path.resolve(__dirname, 'packages'));
// const pkgs2 = fs.readdirSync(path.resolve(__dirname, 'configs'));

module.exports = {
  extends: ['@commitlint/config-conventional'],
  // 以下的配置项供czg 使用
  prompt: {
    // 定义一些常用的git commit message
    // alias: {
    //   b: "docs: fix typos",
    //   ur: "docs: update README",
    //   ":": "docs(blog): update posts",
    // },
    messages: {
      type: '选择你要提交的类型 :',
      scope: '选择一个提交范围（可选）:',
      customScope: '请输入自定义的提交范围 :',
      subject: '填写简短精炼的变更描述 :\n',
      body: '填写更加详细的变更描述（可选）。使用 "|" 换行 :\n',
      breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 :\n',
      footerPrefixesSelect: '选择关联issue前缀（可选）:',
      customFooterPrefix: '输入自定义issue前缀 :',
      footer: '列举关联issue (可选) 例如: #31, #I3244 :\n',
      confirmCommit: '是否提交或修改commit ?',
    },
    // 在默认 types 的基础上，添加额外的 types；可以改变原有默认配置，或改变顺序
    types: [
      { value: 'feat', name: 'feat:     新功能 | A new feature', emoji: ':sparkles:' },
      { value: 'fix', name: 'fix:      问题修复 | A bug fix', emoji: ':bug:' },
      { value: 'docs', name: 'docs:     文档更新 | Documentation only changes', emoji: ':memo:' },
      {
        value: 'style',
        name: 'style:    代码格式 | Changes that do not affect the meaning of the code',
        emoji: ':lipstick:',
      },
      {
        value: 'refactor',
        name: 'refactor: 代码重构 | A code change that neither fixes a bug nor adds a feature',
        emoji: ':recycle:',
      },
      { value: 'perf', name: 'perf:     性能优化 | A code change that improves performance', emoji: ':zap:' },
      {
        value: 'test',
        name: 'test:     测试相关 | Adding missing tests or correcting existing tests',
        emoji: ':white_check_mark:',
      },
      {
        value: 'build',
        name: 'build:    构建相关 | Changes that affect the build system or external dependencies',
        emoji: ':package:',
      },
      {
        value: 'ci',
        name: 'ci:       持续集成 | Changes to our CI configuration files and scripts',
        emoji: ':ferris_wheel:',
      },
      { value: 'revert', name: 'revert:   回退代码 | Revert to a commit', emoji: ':rewind:' },
      {
        value: 'chore',
        name: 'chore:    其他修改 | Other changes that do not modify src or test files',
        emoji: ':hammer:',
      },
    ],
    // 默认 types 类别列表的模糊搜索针对列表 value 字段。设置为 false 后针对列表
    typesSearchValue: true,
    // 是否开启 commit message 带有 Emoji 字符
    useEmoji: true,
    // 设置 Emoji 字符 的 位于头部位置 "left" | "center" | "right"
    emojiAlign: 'center',
    useAI: false,
    aiNumber: 1,
    themeColorCode: '',
    // 预设 commit 涉及范围，一种是根据代码层面区分，比如monorepo，一种是业务区分
    // scopes: [{ name: 'basic', value: 'basic' }, ...pkgs1, ...pkgs2],
    scopes: [{ name: '基础配置', value: 'basic' },{ name: '主方法', value: 'main-api' },{ name: '工具方法', value: 'utils' }],
    // 默认 scopes 范围列表的模糊搜索针对列表 name 字段。设置为 true 后针对列表 value 字段
    scopesSearchValue: false,
    allowCustomScopes: true,
    allowEmptyScopes: true,
    customScopesAlign: 'bottom',
    customScopesAlias: 'custom',
    emptyScopesAlias: 'empty',
    upperCaseSubject: false,
    markBreakingChangeMode: false,
    allowBreakingChanges: ['feat', 'fix'],
    breaklineNumber: 100,
    breaklineChar: '|',
    skipQuestions: [],
    issuePrefixes: [{ value: 'closed', name: 'closed:   ISSUES has been processed' }],
    customIssuePrefixAlign: 'top',
    emptyIssuePrefixAlias: 'skip',
    customIssuePrefixAlias: 'custom',
    allowCustomIssuePrefix: true,
    allowEmptyIssuePrefix: true,
    confirmColorize: true,
    maxHeaderLength: Infinity,
    maxSubjectLength: Infinity,
    minSubjectLength: 0,
    scopeOverrides: undefined,
    defaultBody: '',
    defaultIssues: '',
    defaultScope: '',
    defaultSubject: '',
    // 英文版
    // messages: {
    //   type: "Select the type of change that you're committing:",
    //   scope: "Denote the SCOPE of this change (optional):",
    //   customScope: "Denote the SCOPE of this change:",
    //   subject: "Write a SHORT, IMPERATIVE tense description of the change:\n",
    //   body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
    //   breaking: 'List any BREAKING CHANGES (optional). Use "|" to break new line:\n',
    //   footerPrefixesSelect: "Select the ISSUES type of changeList by this change (optional):",
    //   customFooterPrefix: "Input ISSUES prefix:",
    //   footer: "List any ISSUES by this change. E.g.: #31, #34:\n",
    //   generatingByAI: "Generating your AI commit subject...",
    //   generatedSelectByAI: "Select suitable subject by AI generated:",
    //   confirmCommit: "Are you sure you want to proceed with the commit above?",
    // },
  },
};

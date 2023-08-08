module.exports = {
  // npm 相关配置
  npm: {
    // 是否发布到npm，默认true
    publish: false,
    //忽略 package.json 中的version 字段，使用git tag，默认 false
    ignoreVersion: false,
  },
  // git相关配置
  git: {
    // 是否git 步骤
    push: false,
    // 设置自定义标签
    tagName: 'v${version}',
    // 是否使用使用分支的标签来确定最新标签，默认 false，即只考虑主分支
    getLatestTagFromAllRefs: true,
    // 指定release-it 运行时当前分支，可以用数组指定多个
    requireBranch: 'master', // 只有在master 才可以运行release-it
    // 是否在运行release-it之前，保持工作区干净，也就是所有文件已提交
    requireCleanWorkingDir: false,
    // 是否需要上游分支，如果没有上游分支，git push 不知道如何推送。一般在git 未推送到远程前设置为false
    requireUpstream: false,
    // 是否允许空提交，也就是在发新版本前，到上个版本之间，必须有commit，默认为false，即允许空提交
    requireCommits: true, // 不允许空提交发版
    // 完成升级后，提交的消息
    commitMessage: 'chore(release): 升级版本 ${version}',
  },
  hooks: {
    // 'before:init': 'git fetch --tags', // 在发布之前获取最新的 git tag
    // 'after:bump': 'git commit -am "chore: 升级版本 ${version}" && git tag v${version}', // 在升级版本后创建新的 git tag
  },
  plugins: {
    '@release-it/conventional-changelog': {
      infile: 'CHANGELOG.md',
      header: '# 📋 更新历史 \n\n',
      preset: {
        name: 'conventionalcommits',
        types: [
          { type: 'feat', section: '✨ Features | 新功能' },
          { type: 'fix', section: '🐛 Bug Fixes | Bug 修复' },
          { type: 'perf', section: '⚡ Performance Improvements | 性能优化' },
          { type: 'revert', section: '⏪ Reverts | 回退', hidden: true },
          { type: 'chore', section: '📦 Chores | 其他更新' },
          { type: 'docs', section: '📝 Documentation | 文档' },
          { type: 'style', section: '💄 Styles | 风格' },
          { type: 'refactor', section: '♻ Code Refactoring | 代码重构' },
          { type: 'test', section: '✅ Tests | 测试', hidden: true },
          { type: 'build', section: '👷‍ Build System | 构建', hidden: true },
          { type: 'ci', section: '🔧 Continuous Integration | CI 配置', hidden: true },
        ],
        //     "commitUrlFormat":"https://github.com/lpreterite/datagent/commit/{{hash}}"
      },
    },
  },
};

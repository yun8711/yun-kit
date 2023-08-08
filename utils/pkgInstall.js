const scopeMap = {
  pnpm: {
    dev: '-D',
    prod: '-P',
    global: '-g',
  },
  npm: {
    dev: '-D',
    prod: '-S',
    global: '-g',
  },
  yarn: {
    dev: '-D',
    prod: '',
    global: 'global',
  },
};

const installCmd = {
  pnpm: 'add',
  npm: 'install',
  yarn: 'add',
};

/**
 * @description: pnpm add方法
 * @param options {object} 安装配置
 * @param options.engine {pnpm|npm|yarn} 包管理器
 * @param options.extraArgs {string} 附加参数
 * @param scope {string} 安装范围 dev|prod|global
 * @param deps {string[]} 依赖列表
 */
function pkgInstall(options = {}, scope = 'dev', deps = []) {
  const { engine, extraArgs } = options;
  if (!scope || !deps || deps.length === 0) return;
  let extraArgsArr = extraArgs.split(' ') ?? '';
  return [engine, [installCmd[engine], scopeMap[engine][scope], ...deps, ...extraArgsArr]];
}

module.exports = pkgInstall;
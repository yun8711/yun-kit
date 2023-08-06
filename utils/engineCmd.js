/**
 * @description: pnpm add方法
 * @param dependencies
 * @param target {dev|prod|global}
 */
function pnpmInstall(dependencies = [], target) {
  if (!dependencies || dependencies.length === 0) return;
  const tagMap = {
    dev: "-D",
    prod: "-P",
    global: "-g",
  };
  return `pnpm add ${tagMap[target]} ${dependencies.join(" ")}`;
}

/**
 * @description: npm install方法
 * @param dependencies
 * @param target {dev|prod|global}
 */
function npmInstall(dependencies = [], target) {
  if (!dependencies || dependencies.length === 0) return;
  const tagMap = {
    dev: "-D",
    prod: "-S",
    global: "-g",
  };
  return `npm install ${tagMap[target]} ${dependencies.join(" ")}`;
}

/**
 * @description: yarn add方法
 * @param dependencies
 * @param target {dev|prod|global}
 */
function yarnInstall(dependencies = [], target) {
  if (!dependencies || dependencies.length === 0) return;
  const tagMap = {
    dev: "-D",
    prod: "",
    global: "global",
  };
  const arg = tagMap[target] !== "prod" ? ` ${tagMap[target]}` : "";
  return `yarn add${arg} ${dependencies.join(" ")}`;
}

module.exports = {
  pnpmInstall,
  npmInstall,
  yarnInstall,
};

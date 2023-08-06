const packageInfo = require('../package.json')
const semver = require('semver')
const chalk = require('chalk')

/**
 * @description 检查本机Node版本是否符合kd-cli的要求
 */
function checkNodeVersion() {
	const requiredNodeVersion = packageInfo.engines.node
	if (!semver.satisfies(process.version, requiredNodeVersion, {})) {
		console.log(
			chalk.red(
				'当前Node版本为' +
          process.version +
          '，kd-cli需要Node版本' +
          requiredNodeVersion +
          '，请升级Node后重试。'
			)
		)
		process.exit(1)
	}
}

module.exports = checkNodeVersion

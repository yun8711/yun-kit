const path = require('path')

module.exports = function printFileTree(filePaths) {
  console.log(filePaths);
  const fileTree = {}

	// 构建文件树结构
	for (const filePath of filePaths) {
		const pathSegments = filePath.split(path.sep)
		let currentDir = fileTree

		for (const segment of pathSegments) {
			if (!currentDir[segment]) {
				currentDir[segment] = {}
			}
			currentDir = currentDir[segment]
		}
	}

	// 递归打印文件树
	function printTree(dir, indent = '-') {
		for (const [name, subDir] of Object.entries(dir)) {
      // if(name==='.DS_Store') continue;
			// console.log(indent + name)
			printTree(subDir, indent + '  ')
		}
	}

	// 打印文件树目录结构
	printTree(fileTree)
}

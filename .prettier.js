module.exports = {
  // 一行最多 120 字符
  printWidth: 120,
  // 使用 2 个空格缩进
  tabWidth: 2,
  // 使用制表符而不是空格缩进行 (true：制表符，false：空格)
  useTabs: false,
  // 行尾分号 (true：有，false：没有)
  semi: true,
  // 使用单引号 (true：单引号，false：双引号)
  singleQuote: true,
  // 对象字面量的 key 是否用引号，可选值 "<as-needed|consistent|preserve>"
  // quoteProps: 'as-needed',
  // 在JSX中使用单引号而不是双引号 (true：单引号，false：双引号)
  // jsxSingleQuote: false,
  // 多行时末尾逗号，可选值"<none|es5|all>"
  // trailingComma: 'all',
  // 在对象，数组括号与文字之间加空格，(true：有，false：没有)
  // bracketSpacing: true,
  // 将 > 多行元素放在最后一行的末尾，而不是单独放在下一行 (true：放末尾，false：单独一行)
  // bracketSameLine: false,
  // (x) => {} 箭头函数参数只有一个时是否要有小括号 (avoid：省略括号，always：不省略括号)
  // arrowParens: 'avoid',
  // 仅格式化在文件顶部包含特殊注释（称为编译指示）的文件
  // requirePragma: false,
  // 在文件顶部插入一个特殊标记，指定该文件已使用 Prettier 格式化
  // insertPragma: false,
  // 用于控制文本是否应该被换行以及如何进行换行
  // proseWrap: 'preserve', // preserve保持原样；always超宽自动换行；never不换行
  // 在html中空格是否是敏感的
  // htmlWhitespaceSensitivity: 'css', // css-遵守CSS显示属性的默认值;strict - 空格被认为是敏感的;"ignore" - 空格被认为是不敏感的
  // 控制在 Vue 单文件组件中 <script> 和 <style> 标签内的代码缩进方式
  // vueIndentScriptAndStyle: false,
  // 换行符使用 lf 可选值 "<auto|lf|crlf|cr>"
  // endOfLine: 'auto',
  // [2.1+] 格式化内嵌代码
  // embeddedLanguageFormatting: 'auto',
  // [2.6+] 在 HTML、Vue 和 JSX 中强制每行使用单一属性
  // singleAttributePerLine: false,
  // 这两个选项可用于格式化以给定字符偏移量（分别包括和不包括）开始和结束的代码 (rangeStart：开始，rangeEnd：结束)
  // rangeStart: 0,
  // rangeEnd: Infinity,
  // [2.4]弃用 jsx 标签的反尖括号需要换行
  // jsxBracketSameLine: false,
  // [弃用] 指定要使用的解析器，可以自定义解析器
  // parser: require("./my-parser")
  // parser: "<string>"
  // prettier 插件
  // plugins: ["prettier-plugin-packagejson"],
  // 针对不同文件的配置
  // overrides: [
  //   {
  //     files: ".prettierrc",
  //     options: {
  //       parser: "json",
  //     },
  //   },
  // ],
};

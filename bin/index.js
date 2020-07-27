#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk')
const process = require('child_process');
const package = require("../package.json");

let { operationModeList } = require('./xstx.js')

program.version(`当前 ${package.name} 版本 ${package.version}`, '-v, --version')

program.on('--help', () => {
  console.log(chalk.yellow(`
  更多帮助请阅读文档: https://github.com/xstxhjh
  `))
})

program
  .option('-d, --debug', 'output extra debugging')

program.parse(process.argv)

if (program.debug) {
  console.log(program.opts())
  console.log(chalk.gray('这是debug!'))
}

operationModeList()

// 想法：快速命令输入存json


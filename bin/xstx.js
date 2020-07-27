const inquirer = require('inquirer')
const chalk = require('chalk')
const process = require('child_process')
const iconv = require('iconv-lite')
const fs = require('fs')
const path = require('path')

let allBinFile = path.join(__dirname, '../json/all.json')

function runBin(bin, options) {
  let encoding = 'cp936'
  let binaryEncoding = 'binary'

  process.exec(bin, { ...options, encoding: binaryEncoding }, function (err, stdout, stderr) {
    let stdoutMsg = iconv.decode(Buffer.from(stdout, binaryEncoding), encoding)
    let stderrMsg = iconv.decode(Buffer.from(stderr, binaryEncoding), encoding)
    console.log(stdoutMsg, stderrMsg)
  })
}

function operationModeList() {
  // 操作模式列表
  return chooseList([
    { name: '新增快捷命令', value: 'add' },
    { name: '删除快捷命令', value: 'del' },
    { name: '编辑快捷命令', value: '2' },
    { name: '执行快捷命令', value: 'run' }
  ], '请选择快捷命令库操作方式:')
    .then(answers => {
      switch (answers.value) {
        case 'run':
          runBin('dir')
          break;
        case 'add':
          console.log(chalk.gray('-----新增-----'))
          listInput([
            { name: '命令名称:', value: "title" },
            { name: '命令内容:', value: "value" },
            { name: '命令参数:', value: "key" }
          ]).then(bin => {
            let binData = getBinData()
            addBin(binData, bin)
          })
          break;
        case 'del':
          console.log(chalk.gray('-----删除-----'))
          let binData = getBinData()
          let showBinData = binData.map(item => {
            item.name = `${item.title} | ${item.key} | ${item.value}`
            item.value = item
            return item
          })
          chooseList(binData, '请选择需要删除的指令:').then(res => {
            if (res.value == 'cancel') {
              operationModeList()
              return
            }
            delBin(binData, res.value)
          })
      }
    })
}

function listInput(msgs) {
  // 多参数输入
  let arr = msgs.map(item => {
    return {
      type: 'input',
      name: item.value,
      message: item.name
    }
  })
  return inquirer.prompt(arr)
}

function chooseList(list, msg, hasCancel = true) {
  // 弹出选择项
  if (hasCancel) {
    list.push({
      name: '取消',
      value: 'cancel'
    })
  }
  return inquirer.prompt([{
    type: 'list',
    choices: list,
    message: msg,
    name: 'value'
  }])
}

function getBinData() {
  // 获取已存所有指令数据
  let binData = []
  let fileContent = fs.readFileSync(allBinFile, 'utf-8')
  if (fileContent) {
    binData = JSON.parse(fileContent)
  }
  return binData
}

function addBin(binData = [], bin) {
  // 新增指令
  let hasKey = false
  binData.map(item => {
    if (item.key == bin.key) hasKey = true
  })
  if (hasKey) {
    console.log(chalk.red(`${bin.key} 命令参数已存在，请更换。`))
    return
  }
  binData.push(bin)
  let writeFs = fs.writeFileSync(allBinFile, JSON.stringify(binData))
  console.log(chalk.green(`新增成功!`))
}

function delBin(binData = [], bin) {
  // 删除指令
  let newBinData = binData.filter(item => {
    return item.key !== bin.key && item.title !== bin.title
  })
  let writeFs = fs.writeFileSync(allBinFile, JSON.stringify(newBinData))
  console.log(chalk.green(`删除成功!`))
}

module.exports = {
  operationModeList
}
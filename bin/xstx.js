const inquirer = require('inquirer')
const chalk = require('chalk')
const process = require('child_process')
const iconv = require('iconv-lite')
const fs = require('fs')
const path = require('path')

let allBinFile = path.join(__dirname, '../json/all.json')

function runBin(bin, options = {}) {
  let opt = {
    stdio: 'inherit',
    ...options
  }
  let encoding = 'cp936'
  let binaryEncoding = 'binary'

  process.execSync(bin, { ...opt, encoding: binaryEncoding }, function (err, stdout, stderr) {
    let stdoutMsg = iconv.decode(Buffer.from(stdout, binaryEncoding), encoding)
    let stderrMsg = iconv.decode(Buffer.from(stderr, binaryEncoding), encoding)
    console.log(stdoutMsg, stderrMsg)
    if (err) console.log(err)
  })
}

function operationModeList() {
  // 操作模式列表
  console.log('')
  console.log('')
  return chooseList([
    { name: '新增快捷命令', value: 'add' },
    { name: '删除快捷命令', value: 'del' },
    { name: '执行快捷命令', value: 'run' },
    { name: '编辑快捷命令', value: 'edit' },
    // { name: '编辑命令配置项', value: 'opt' }
  ], '请选择快捷命令库操作方式:')
    .then(answers => {
      let binData = getBinData()
      if (binData === false) return
  
      switch (answers.value) {
        case 'add':
          console.log(chalk.gray('-----新增-----'))
          listInput([
            { name: '命令标题:', value: "title" },
            { name: '执行命令:', value: "value" },
            { name: '命令缩写:', value: "key" }
          ]).then(bin => {
            addBin(binData, bin)
          })
          break;

        case 'del':
          console.log(chalk.gray('-----删除-----'))
          binData = tableBinData(binData)
          chooseList(binData, '请选择需要删除的指令:').then(res => {
            if (res.value == 'cancel') {
              operationModeList()
              return
            }
            delBin(binData, res.value)
          })
          break;

        case 'edit':
          editContent(JSON.stringify(binData)).then(res => {
            editBin(res.content)
          })
          break;

        case 'run':
          binData = tableBinData(binData)
          chooseList(binData, '请选择需要执行的指令:').then(res => {
            if (res.value == 'cancel') {
              operationModeList()
              return
            }
            runBin(res.value)
          })
          break;
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
  try {
    binData = JSON.parse(fileContent)
  } catch (error) {
    console.log(chalk.red('-----json文件格式异常,请重新编辑！-----'))
    if (fileContent.length <= 0) fileContent = '[]'
    editContent(fileContent).then(res => {
      editBin(res.content)
    })
    return false
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
  fs.writeFileSync(allBinFile, JSON.stringify(binData))
  console.log(chalk.green(`新增成功!`))
}

function delBin(binData = [], bin) {
  // 删除指令
  let newBinData = binData.filter(item => {
    return item.key !== bin.key && item.title !== bin.title
  })
  fs.writeFileSync(allBinFile, JSON.stringify(newBinData))
  console.log(chalk.green(`删除成功!`))
}

function editBin(BinData = []) {
  fs.writeFileSync(allBinFile, BinData)
  console.log(chalk.green(`编辑成功!`))
}

function editContent(data) {
  return inquirer.prompt([{
    type: 'editor',
    default: data,
    message: '编辑命令',
    name: 'content'
  }])
}

function tableBinData (binData) {
  let tableData = binData.map(item =>{
    return {
      '命令标题': item.title,
      '命令缩写': item.key,
      '执行命令': item.value,

    }
  })
  console.table(tableData)
  return binData.map((item, index) => {
    item.name = `${index} | 标题: ${item.title} | 缩写: ${item.key} | 命令: ${item.value}`
    return item
  })
}

module.exports = {
  operationModeList,
  getBinData,
  runBin
}
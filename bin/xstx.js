const inquirer = require('inquirer')
const process = require('child_process')
const iconv = require('iconv-lite')
const fs = require('fs')
const path = require('path')

let allBinFile = path.join(__dirname, '../json/all.json')

function runBin(bin) {
  let encoding = 'cp936'
  let binaryEncoding = 'binary'

  process.exec(bin, { encoding: binaryEncoding }, function (err, stdout, stderr) {
    let stdoutMsg = iconv.decode(Buffer.from(stdout, binaryEncoding), encoding)
    let stderrMsg = iconv.decode(Buffer.from(stderr, binaryEncoding), encoding)
    console.log(stdoutMsg, stderrMsg)
  })
}

function operationModeList() {
  return inquirer
    .prompt([{
      type: 'list',
      message: '请选择快捷命令库操作方式:',
      name: 'type',
      choices: [
        { name: '新增快捷命令', value: 'add' },
        { name: '删除快捷命令', value: '1' },
        { name: '编辑快捷命令', value: '2' },
        { name: '执行快捷命令', value: 'run' }
      ]
    }])
    .then(answers => {
      switch (answers.type) {
        case 'run':
          runBin('ipconfig')
          break;
        case 'add':
          listInput([{ name: '新增命令名称:', value: "title" }, { name: '新增命令内容:', value: "key" }]).then(bin => {
            let fileContent = fs.readFileSync(allBinFile, 'utf-8')
            if (!fileContent) return
            let binData = JSON.parse(fileContent) || []
            binData.push(bin)
            let writeFs = fs.writeFileSync(allBinFile, JSON.stringify(binData))
          })
          break;
      }
    })
}

function listInput(msgs) {
  let arr = msgs.map(item => {
    return {
      type: 'input',
      name: item.value,
      message: item.name
    }
  })
  return inquirer.prompt(arr)
}

module.exports = {
  operationModeList
}
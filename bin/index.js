#!/usr/bin/env node

const { program } = require('commander');
const process = require('child_process');
const package = require("../package.json");

let { operationModeList, getBinData, runBin } = require('./xstx.js');

program
  .helpOption('-help, --help', `当前 ${package.name} 版本 ${package.version}`);

let binData = getBinData()
binData.map(bin => {
  program
    .option(`-${bin.key}, --${bin.key}`, `执行命令: ${bin.title}`)
})

program.parse(process.argv)

let hasBin = false
binData.map(bin => {
  if(program[bin.key]) {
    runBin(bin.value)
    hasBin = true
  }
})

if(hasBin) return

operationModeList()
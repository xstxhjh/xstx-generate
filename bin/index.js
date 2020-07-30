#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk')
const process = require('child_process');
const package = require("../package.json");

let { operationModeList, getBinData, runBin } = require('./xstx.js');

program.addHelpCommand(false)

let binData = getBinData()
binData.map(bin => {
  program
    .option(`-${bin.key}, --${bin.key}`, `run ${bin.title}`)
})

program.parse(process.argv)

let hasBin = false
binData.map(bin => {
  if(program[bin.key]) {
    runBin(bin.value)
  }
  hasBin = true
})

if(hasBin) return

operationModeList()

// 想法：快速命令输入存json


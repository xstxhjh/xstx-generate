# xstx/instructions

## 项目介绍

一款命令管理工具，可自由组合自定义的命令，帮助你释放双手!

## 使用方法

npm i commander-vite -g

- 执行 xstx 展示所有操作列表

- 执行 xstx -help 会展示所有命令的说明

- 利用缩写形式执行你自定义的命令，如：xstx -p -ip

- 通过配置 opts，给命令执行添加配置，如：xstx -pt 

配置cwd参数，可更改执行命令目录

```json
{ "title": "目录", "bin": "pwd", "key": "pt", "opts": { "cwd": "C:\\" } }
```

详情可参见文档：http://nodejs.cn/api/child_process.html#child_process_child_process_execsync_command_options

- 自定义命令再次组合 xstx -pip

```json
{ "title": "执行pwd、IP配置", "value": "xstx -p -ip", "key": "pip" }
```

<!--
  发布
  npm login
  npm publish
-->



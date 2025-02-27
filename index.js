#!/usr/bin/env node

const chalk = require('chalk')
const { program } = require('commander')
const inquirer = require('inquirer')
const shell = require('shelljs')
const path = require('path')

// 定义模板目录路径
const BASE_TEMPLATE_DIR = path.join(__dirname, 'template/base')
const APOLLO_TEMPLATE_DIR = path.join(__dirname, 'template/apollo')

program
  .version('1.0.0')
  .description('create a project with nextjs(pages router), mui, tailwindcss')
  .arguments('<project-directory>')
  .action(async projectDir => {
    console.log(chalk.green(`Creating a new project in ${projectDir}`))

    // 检查目录是否存在
    if (shell.test('-d', projectDir)) {
      console.log(chalk.red(`Error: Directory ${projectDir} already exists.`))
      process.exit(1)
    }

    // 询问是否需要 Apollo + GraphQL
    const { includeApollo } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'includeApollo',
        message: 'Would you like to include Apollo Client and GraphQL?',
        default: false
      }
    ])

    // 创建项目目录
    shell.mkdir(projectDir)
    shell.cd(projectDir)

    // 复制基础模板文件
    if (!shell.test('-d', BASE_TEMPLATE_DIR)) {
      console.log(chalk.red('Error: Base template directory not found.'))
      process.exit(1)
    }

    // 复制基础模板的所有文件（包括隐藏文件）
    shell.cp('-R', `${BASE_TEMPLATE_DIR}/*`, '.')
    shell.cp('-R', `${BASE_TEMPLATE_DIR}/.*`, '.')

    // 如果选择了 Apollo，复制并合并 Apollo 相关文件
    if (includeApollo) {
      if (!shell.test('-d', APOLLO_TEMPLATE_DIR)) {
        console.log(chalk.red('Error: Apollo template directory not found.'))
        process.exit(1)
      }

      // 复制 Apollo 模板文件，这会覆盖基础模板中的同名文件
      shell.cp('-R', `${APOLLO_TEMPLATE_DIR}/*`, '.')

      // 合并 package.json
      const basePackage = require(`${BASE_TEMPLATE_DIR}/package.json`)
      const apolloPackage = require(`${APOLLO_TEMPLATE_DIR}/package.json`)

      const newPackage = {
        ...basePackage,
        dependencies: {
          ...basePackage.dependencies,
          ...apolloPackage.dependencies
        },
        devDependencies: {
          ...basePackage.devDependencies,
          ...apolloPackage.devDependencies
        }
      }

      // 写入合并后的 package.json
      shell.ShellString(JSON.stringify(newPackage, null, 2)).to('package.json')
    }

    // 安装依赖
    console.log(chalk.blue('Installing dependencies...'))
    shell.exec('yarn install')

    console.log(chalk.green('Project created successfully!'))
    console.log(chalk.blue('\nNext steps:'))
    console.log(`  cd ${projectDir}`)
    console.log('  yarn dev')

    if (includeApollo) {
      console.log(chalk.blue('\nApollo Client has been set up!'))
      console.log('Check the /lib/apollo-client.js file to configure your GraphQL endpoint.')
    }
  })

program.parse(process.argv)

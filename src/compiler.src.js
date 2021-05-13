const bytenode = require('bytenode')
const fs = require('fs')
const v8 = require('v8')

v8.setFlagsFromString('--no-lazy')

if (!fs.existsSync('./src/main.jsc')) {
  bytenode.compileFile({
    filename: './src/main.src.js',
    output: './src/main.jsc',
    compileAsModule: true
  })
}


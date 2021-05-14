const bytenode = require('bytenode')
const fs = require('fs')
const v8 = require('v8')

v8.setFlagsFromString('--no-lazy')

if (!fs.existsSync("./src/final/main.jsc")) {
  bytenode.compileFile({
    filename: './src//base/main.src.js',
    output: './src/final/main.jsc',
    compileAsModule: true
  })
}

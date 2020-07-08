// rewire the build to disable code-splitting
// thanks to https://mtm.dev/disable-code-splitting-create-react-app/
const rewire = require('rewire')

const defaults = rewire('react-scripts/scripts/build.js')
let config = defaults.__get__('config')

config.optimization.splitChunks = {
  cacheGroups: {
    default: false
  }
}

config.optimization.runtimeChunk = false

// create predictable output files without hashes in the name
config.output.filename = 'static/js/[name].js'
config.plugins[5].options.filename = 'static/css/[name].css'
config.plugins[5].options.moduleFilename = () => 'static/css/main.css'

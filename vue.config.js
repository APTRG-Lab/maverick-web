module.exports = {
  // Project deployment base

  // where to output built files
  outputDir: 'dist',

  // whether to use eslint-loader for lint on save.
  // valid values: true | false | 'error'
  // when set to 'error', lint errors will cause compilation to fail.
  lintOnSave: process.env.NODE_ENV !== 'production',

  publicPath: process.env.NODE_ENV === 'production'
    ? '/web/maverick/'
    : '/',

  runtimeCompiler: true,

  // babel-loader skips `node_modules` deps by default.
  // explicitly transpile a dependency with this option.
  transpileDependencies: [
    /* string or regex */
  ],

  // generate sourceMap for production build?
  productionSourceMap: false,

  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: config => {
    const rule = config.module
      .rule('gql')
      .test(/\.(gql|graphql)$/)
      .include
      .end()
      /*
      .use('cache-loader')
      .loader('cache-loader')
      .end()
      */

    rule
      .use('gql-loader')
      .loader('graphql-tag/loader')
      .end()
  },

  configureWebpack: {
    module: {
      rules: [
      ]
    },
    optimization: {
    },
    plugins: [
    ]
  },

  // CSS related options
  css: {
    // extract CSS in components into a single CSS file (only in production)
    // can also be an object of options to pass to extract-text-webpack-plugin
    extract: true,

    // enable CSS source maps?
    sourceMap: true,

    // pass custom options to pre-processor loaders. e.g. to pass options to
    // sass-loader, use { sass: { ... } }
    loaderOptions: {
      css: {},
      postcss: {},
      stylus: {}
    }

    // Enable CSS modules for all css / pre-processor files.
    // This option does not affect *.vue files.
    // modules: false
  },

  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,

  // options for the PWA plugin.
  // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},

  // configure webpack-dev-server behavior
  devServer: {
    open: false,
    compress: true,
    host: '0.0.0.0',
    public: 'http://newdev.maverick.one:6794',
    disableHostCheck: true,
    port: 6794,
    https: false,
    hotOnly: true,
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: null,
    before: app => {},
    clientLogLevel: 'warning',
    inline: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization'
    }
  },

  // options for 3rd party plugins
  pluginOptions: {}
}

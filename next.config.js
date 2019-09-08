const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require('next/constants')

const getBuildConfig = (...args) => {
  const path = require('path')
  const withPugins = require('next-compose-plugins')
  const withSCSS = require('@zeit/next-css')
  const postcssPresetEnv = require('postcss-preset-env')
  const postcssPresetEnvOptions = {
    // importFrom: {
    //   customProperties: {
    //     '--primary': '#f0c0c0',
    //   },
    importFrom: './src/theme/in.css',
    preserve: true,
    browsers: ['last 2 versions', 'ie >= 11'],
    stage: 1,
  }

  const cssOptions = {
    postcssLoaderOptions: {
      plugins: [postcssPresetEnv(postcssPresetEnvOptions)],
    },
    sassLoaderOptions: {
      includePaths: [path.join(process.cwd(), 'src', 'common', 'css')],
    },
  }

  const nextConfig = {
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        include: /src\/components\/icon\/icons/,
        use: [
          'svg-sprite-loader',
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                { removeAttrs: { attrs: '(fill)' } },
                { removeTitle: true },
                { cleanupIDs: true },
                { removeStyleElement: true },
              ],
            },
          },
        ],
      })
      return config
    },
  }
  return withPugins([[withSCSS, cssOptions]], nextConfig)(...args)
}

module.exports = (phase, ...rest) => {
  const shouldAddBuildConfig =
    phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD
  return shouldAddBuildConfig ? getBuildConfig(phase, ...rest) : {}
}

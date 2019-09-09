require('@babel/register')({ extensions: ['.ts'] });
// transpilation to commonjs module for `postcss`
module.exports = require.resolve('./variables');

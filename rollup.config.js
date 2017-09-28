import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import info from './package.json';

export default {
  input: 'build/es5/index.js',
  output: {
    file: 'build/umd.js',
    format: 'umd',
    name: 'Ow',
  },
  amd: {
    id: 'Ow',
  },
  plugins: [
    resolve(),
    commonjs({
      include: ['node_modules/**'],
    }),
  ],
  banner: `/* ow-core v${info.version} */`,
};

import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import info from './package.json';

export default {
  input: 'src/index.js',
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
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers'],
    }),
  ],
  banner: `/* ow-core v${info.version} */`,
};

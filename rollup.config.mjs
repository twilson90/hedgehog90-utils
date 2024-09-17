import resolve from '@rollup/plugin-node-resolve'
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import babel from '@rollup/plugin-babel';
import pkg from './package.json' with { type: "json" };

export default [
  {
    input: pkg.source,
    output: [
        {
          file: pkg.module,
          format: 'esm',
          sourcemap: true,
        },
        {
          file: pkg.main,
          format: 'cjs',
          sourcemap: true,
        }
    ],
    plugins: [
      babel({
        presets: ["@babel/preset-env"],
        /* plugins: [
          ["polyfill-corejs3", { "method": "usage-global" }],
          "@babel/transform-runtime"
        ], */
        exclude: /node_modules/,
        skipPreflightCheck: true,
        babelHelpers: 'runtime'
      }),
      resolve(),
      commonjs(),
    ],
  }
];
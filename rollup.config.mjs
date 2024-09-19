import resolve from '@rollup/plugin-node-resolve'
import commonjs from "@rollup/plugin-commonjs";
import sass from 'rollup-plugin-sass';
import postcss from "rollup-plugin-postcss";
import babel from '@rollup/plugin-babel';
import replace from 'rollup-plugin-replace'
// import pkg from './package.json' with { type: "json" };

export default [
  {
    input: "./src/utils.js",
    output: [
      {
        file: "./dist/utils.mjs",
        format: 'esm',
        sourcemap: true,
      },
      {
        file: "./dist/utils.cjs",
        format: 'cjs',
        sourcemap: true,
      }
    ]
  },
  {
    input: "./src/dom.js",
    output: [
      {
        file: "./dist/dom.mjs",
        format: 'esm',
        sourcemap: true,
      }
    ]
  }
].map(entry=>{
  return {
    ...entry,
    plugins: [
      postcss({extract:true, minimize: true, sourceMap:true}),
      sass({output: true}),
      replace({
          "include": /\.(mjs|js|ts)$/,
          'process.env.NODE_ENV': JSON.stringify('production') 
      }),
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
});
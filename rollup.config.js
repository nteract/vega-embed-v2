import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import pkg from "./package.json";

export default [
  {
    input: "index.js",
    external: [
      "datalib",
      "datalib/src/util",
      "datalib/src/import/load",
      "d3",
      "d3-cloud",
      "json-stable-stringify"
    ],
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" }
    ],
    plugins: [
      resolve({
        only: [/^vega.*$/]
      }),
      json(),
      commonjs({
        sourceMap: false,
        ignore: ["canvas"]
      })
    ]
  }
];

import * as tools from "../build_tools/index.js";

export function watch() {
  tools.watch("src/**/*.*", build);
}

export async function build() {
  await tools.compile("src/index.js", {
    name: "utils",
    js: {
      outputs: [
        { format: "es" },
        { format: "commonjs" },
        { format: "umd" }
      ]
    }
  });
}

eval(process.argv[2])(...process.argv.slice(3));
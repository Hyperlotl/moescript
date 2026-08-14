#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { runUWUscript } = require("./compiler.js");

const file = process.argv[2];

if (!file) {
    console.error("Usage: owo <file.OwO> or oworun <file.OwO>!");
    process.exit(1);
}
if (path.extname(file).toLowerCase() !== ".owo") {
    console.error(`'${file}' isn't a .OwO file!`);
    process.exit(1);
}

let source;
try {
    source = fs.readFileSync(file, "utf8");
} catch (err) {
    console.error(`Couldn't read '${file}': ${err.message}`);
    process.exit(1);
}
runUWUscript(source);
#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { runUWUscript } = require("./compiler.js");

const file = process.argv[2];

if (!file) {
    console.error("Usage: moe <file.moe> or runmoe <file.moe>!");
    process.exit(1);
}
if (path.extname(file).toLowerCase() !== ".moe") {
    console.error(`'${file}' isn't a .moe file!`);
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
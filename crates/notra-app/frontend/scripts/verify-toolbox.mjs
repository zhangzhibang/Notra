import assert from "node:assert/strict";
import process from "node:process";
import ts from "typescript";
import fs from "node:fs";

const source = fs.readFileSync(new URL("../src/toolbox.ts", import.meta.url), "utf8");
const javascript = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const toolbox = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`);

const failures = [];

function check(name, fn) {
  try {
    fn();
  } catch (error) {
    failures.push(`${name}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

check("json pretty", () => {
  const result = toolbox.runToolboxItem("json-pretty", "{\"b\":1,\"a\":2}");
  assert.equal(result.ok, true);
  assert.equal(result.text, "{\n  \"b\": 1,\n  \"a\": 2\n}");
});

check("json sort keys", () => {
  const result = toolbox.runToolboxItem("json-sort-keys", "{\"b\":1,\"a\":{\"d\":2,\"c\":3}}");
  assert.equal(result.ok, true);
  assert.equal(result.text, "{\n  \"a\": {\n    \"c\": 3,\n    \"d\": 2\n  },\n  \"b\": 1\n}");
});

check("json flatten", () => {
  const result = toolbox.runToolboxItem("json-flatten", "{\"a\":{\"b\":1},\"c\":[2,3]}");
  assert.equal(result.ok, true);
  assert.equal(result.text, "a.b=1\nc.0=2\nc.1=3");
});

check("json get path", () => {
  const result = toolbox.runToolboxItem("json-get-path", "{\"data\":{\"items\":[{\"id\":\"x\"}]}}", { path: "data.items.0.id" });
  assert.equal(result.ok, true);
  assert.equal(result.text, "x");
});

check("clean paste recipe", () => {
  const result = toolbox.runToolboxItem("recipe-clean-paste", "﻿a  \n\n\nb\r\n");
  assert.equal(result.ok, true);
  assert.equal(result.text, "a\n\nb\n");
});

check("dedupe lines", () => {
  const result = toolbox.runToolboxItem("dedupe-lines", "a\nb\na\nc");
  assert.equal(result.ok, true);
  assert.equal(result.text, "a\nb\nc");
});

check("csv extract column", () => {
  const result = toolbox.runToolboxItem("csv-extract-column", "a,b,c\n1,2,3", { columnIndex: 2, delimiter: "," });
  assert.equal(result.ok, true);
  assert.equal(result.text, "b\n2");
});

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("工具箱自测通过");
}

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

check("json pretty internal", () => {
  assert.equal(toolbox.isToolboxCatalogItem("json-pretty"), false);
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

check("json array to csv", () => {
  const result = toolbox.runToolboxItem("json-array-to-csv", '[{"id":1,"name":"a"},{"id":2,"name":"b"}]');
  assert.equal(result.ok, true);
  assert.equal(result.text, '"id","name"\n"1","a"\n"2","b"');
});

check("json array to csv stable headers", () => {
  const result = toolbox.runToolboxItem(
    "json-array-to-csv",
    '[{"name":"a","id":1},{"id":2,"name":"b","extra":3}]',
  );
  assert.equal(result.ok, true);
  // first object key order preserved, extra keys sorted after
  assert.equal(result.text, '"name","id","extra"\n"a","1",\n"b","2","3"');
});

check("matches whitelist", () => {
  const upper = toolbox.getToolboxItem("upper");
  const recipe = toolbox.getToolboxItem("recipe-json-fix");
  const diff = toolbox.getToolboxItem("json-diff");
  assert.equal(toolbox.toolboxSupportsMatches(upper), true);
  assert.equal(toolbox.toolboxSupportsMatches(recipe), false);
  assert.equal(toolbox.toolboxSupportsMatches(diff), false);
  assert.ok(toolbox.toolboxMatchesBlockReason(recipe));
  assert.equal(toolbox.isToolboxCatalogItem("upper"), false);
  assert.equal(toolbox.isToolboxCatalogItem("json-sort-keys"), true);
  assert.equal(toolbox.isToolboxCatalogItem("eol-lf"), false);
  assert.equal(toolbox.isToolboxCatalogItem("jwt-pretty"), false);
});

check("destructive flags", () => {
  assert.equal(toolbox.getToolboxItem("dedupe-lines")?.destructive, true);
  assert.equal(toolbox.getToolboxItem("sort-asc")?.destructive, true);
  assert.equal(toolbox.getToolboxItem("delete-empty-lines")?.destructive, true);
});

check("json csv to array", () => {
  const result = toolbox.runToolboxItem("json-csv-to-array", "id,name\n1,a\n2,b", { delimiter: "," });
  assert.equal(result.ok, true);
  assert.equal(result.text, '[\n  {\n    "id": "1",\n    "name": "a"\n  },\n  {\n    "id": "2",\n    "name": "b"\n  }\n]');
});

check("json diff", () => {
  const result = toolbox.runToolboxItem("json-diff", '{\"a\":1}\n---\n{\"a\":2,\"b\":3}');
  assert.equal(result.ok, true);
  assert.equal(result.replace, false);
  assert.match(result.text, /\$\.a/);
  assert.match(result.text, /\$\.b/);
});


check("jwt decode", () => {
  // header {"alg":"none"} payload {"sub":"1","exp":1700000000}
  const token = "eyJhbGciOiJub25lIn0.eyJzdWIiOiIxIiwiZXhwIjoxNzAwMDAwMDAwfQ.sig";
  const result = toolbox.runToolboxItem("jwt-decode", token);
  assert.equal(result.ok, true);
  assert.match(result.text, /"sub": "1"/);
  assert.match(result.text, /exp_iso/);
});

check("timestamp convert seconds", () => {
  const result = toolbox.runToolboxItem("timestamp-convert", "1700000000");
  assert.equal(result.ok, true);
  assert.match(result.text, /2023-11-14/);
});

check("yaml to json", () => {
  const result = toolbox.runToolboxItem("yaml-to-json", "a: 1\nb:\n  c: true\n");
  assert.equal(result.ok, true);
  assert.equal(JSON.parse(result.text).a, 1);
  assert.equal(JSON.parse(result.text).b.c, true);
});

check("json to yaml", () => {
  const result = toolbox.runToolboxItem("json-to-yaml", '{"a":1,"b":{"c":true}}');
  assert.equal(result.ok, true);
  assert.match(result.text, /a: 1/);
  assert.match(result.text, /c: true/);
});

check("query to json", () => {
  const result = toolbox.runToolboxItem("query-to-json", "a=1&b=hello");
  assert.equal(result.ok, true);
  assert.deepEqual(JSON.parse(result.text), { a: "1", b: "hello" });
});

check("json repair", () => {
  const result = toolbox.runToolboxItem("json-repair", "{a:1, b:'x',}");
  assert.equal(result.ok, true);
  assert.equal(JSON.parse(result.text).a, 1);
  assert.equal(JSON.parse(result.text).b, "x");
});

check("json to ts", () => {
  const result = toolbox.runToolboxItem("json-to-ts", '{"id":1,"name":"a"}');
  assert.equal(result.ok, true);
  assert.match(result.text, /export interface Root/);
  assert.match(result.text, /id: number/);
});

check("hash md5", () => {
  const result = toolbox.runToolboxItem("hash-md5", "hello");
  assert.equal(result.ok, true);
  assert.equal(result.text, "5d41402abc4b2a76b9719d911017c592");
});

check("hash sha256", () => {
  const result = toolbox.runToolboxItem("hash-sha256", "hello");
  assert.equal(result.ok, true);
  assert.equal(result.text, "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824");
});

check("regex test", () => {
  const result = toolbox.runToolboxItem("regex-test", "a1 b2", { pattern: "(\\w)(\\d)", flags: "g" });
  assert.equal(result.ok, true);
  assert.equal(result.replace, false);
  assert.match(result.text, /#1/);
  assert.match(result.text, /group 1/);
});

check("text diff internal", () => {
  const result = toolbox.runToolboxItem("text-diff", "a\nb\n---\na\nc\n");
  assert.equal(result.ok, true);
  assert.equal(result.replace, false);
  assert.match(result.text, /^- b/m);
  assert.match(result.text, /^\+ c/m);
});

check("cron parse", () => {
  const result = toolbox.runToolboxItem("cron-parse", "0 9 * * 1-5");
  assert.equal(result.ok, true);
  assert.match(result.text, /分: 0/);
});

check("uuid generate", () => {
  const result = toolbox.runToolboxItem("uuid-generate", "", { count: 2 });
  assert.equal(result.ok, true);
  assert.equal(result.text.trim().split("\n").length, 2);
});

check("detect hints jwt", () => {
  const token = "eyJhbGciOiJub25lIn0.eyJzdWIiOiIxIn0.x";
  const hints = toolbox.detectToolboxHints(token);
  assert.ok(hints.some((h) => h.toolId === "jwt-decode"));
});

check("toml to json", () => {
  const result = toolbox.runToolboxItem("toml-to-json", 'title = "x"\n[owner]\nname = "a"\n');
  assert.equal(result.ok, true);
  const obj = JSON.parse(result.text);
  assert.equal(obj.title, "x");
  assert.equal(obj.owner.name, "a");
});

check("fullwidth to half", () => {
  const result = toolbox.runToolboxItem("fullwidth-to-half", "ＡＢＣ１２３");
  assert.equal(result.ok, true);
  assert.equal(result.text, "ABC123");
});

check("cjk spacing", () => {
  const result = toolbox.runToolboxItem("cjk-spacing", "中文abc测试123");
  assert.equal(result.ok, true);
  assert.equal(result.text, "中文 abc 测试 123");
});

check("strip html", () => {
  const result = toolbox.runToolboxItem("strip-html", "<p>hi <b>x</b></p>");
  assert.equal(result.ok, true);
  assert.match(result.text, /hi\s+x/);
});

check("number base", () => {
  const result = toolbox.runToolboxItem("number-base", "255", { path: "10-16" });
  assert.equal(result.ok, true);
  assert.equal(result.text, "FF");
});

check("json rescue recipe", () => {
  const result = toolbox.runToolboxItem("recipe-json-fix", "{a:1,}");
  assert.equal(result.ok, true);
  assert.match(result.text, /"a": 1/);
});

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("工具箱自测通过");
}

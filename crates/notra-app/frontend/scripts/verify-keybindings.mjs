import fs from "node:fs";
import process from "node:process";
import ts from "typescript";

const source = fs.readFileSync(new URL("../src/keybindings.ts", import.meta.url), "utf8");
const mainSource = fs.readFileSync(new URL("../src/main.ts", import.meta.url), "utf8");
const htmlSource = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const javascript = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const keybindings = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`);

const profiles = [
  ["Notra", keybindings.NOTRA_KEYMAP],
  ["VS Code", keybindings.VSCODE_KEYMAP],
  ["Notepad++", keybindings.NOTEPAD_PLUS_PLUS_KEYMAP],
];
const implementedCommands = new Set(
  [...mainSource.matchAll(/(?:command|editorCommand|markdownCommand)\("([^"]+)"/g)].map((match) => match[1]),
);
const failures = [];
let testedStrokes = 0;

if (!mainSource.includes('document.addEventListener("keydown", handleAppKeybinding, true)')) {
  failures.push("应用快捷键没有注册到 document 捕获阶段");
}
if (/document\.addEventListener\("keydown",\s*handleEditorKeybinding/.test(mainSource)) {
  failures.push("旧的 handleEditorKeybinding 不应直接挂到 document");
}
const editorKeybindingHandler = mainSource.slice(
  mainSource.indexOf("function handleAppKeybinding"),
  mainSource.indexOf("function matchingCommands"),
);
const nativeClipboardGuardIndexes = [...editorKeybindingHandler.matchAll(/usesNativeClipboardShortcut\(stroke, (?:exact|standalone)\[0\]\)/g)]
  .map((match) => match.index);
const shortcutPreventDefaultIndex = editorKeybindingHandler.indexOf("event.preventDefault()");
if (
  !mainSource.includes('["Ctrl+C", "edit.copy"]')
  || !mainSource.includes('["Ctrl+X", "edit.cut"]')
  || !mainSource.includes('["Ctrl+V", "edit.paste"]')
  || !mainSource.includes("NATIVE_CLIPBOARD_SHORTCUTS.get(stroke) === command?.id")
  || nativeClipboardGuardIndexes.length !== 2
  || shortcutPreventDefaultIndex < 0
  || nativeClipboardGuardIndexes[0] > shortcutPreventDefaultIndex
) {
  failures.push("编辑器原生剪贴板快捷键没有覆盖普通按键和组合键回退");
}
if (!mainSource.includes("maybeShowShortcutTip")) {
  failures.push("缺少首次快捷键提示 maybeShowShortcutTip");
}
if (!htmlSource.includes('id="shortcutTip"') || !htmlSource.includes('data-value="notra"')) {
  failures.push("缺少 Notra 键位方案或快捷键提示 UI");
}
if (!mainSource.includes('keymapProfile: "notra"')) {
  failures.push("默认键位方案不是 Notra");
}
if (!/if \(scope === "workspace" \|\| showPanel\)/.test(mainSource)) {
  failures.push("当前文件全部查找没有打开右侧结果面板");
}
if (!mainSource.includes("markdownMatchesToDto(activeMarkdownEditor.searchMatches())")) {
  failures.push("Markdown 当前文件结果没有使用 Muya 搜索坐标");
}
if (!mainSource.includes('document.body.classList.toggle("current-find-open", open)')) {
  failures.push("当前查找栏没有同步页面级打开状态");
}
if (!mainSource.includes("currentSearchPatternError(query)")) {
  failures.push("当前查找没有校验正则表达式");
}
if (/\slist="(?:findHistoryList|replaceHistoryDataList)"/.test(htmlSource)) {
  failures.push("文件查找历史仍在使用原生 datalist");
}
if (!htmlSource.includes('id="findHistoryMenu"') || !htmlSource.includes('id="replaceHistoryMenu"')) {
  failures.push("文件查找和替换缺少自绘历史菜单");
}
if (!htmlSource.includes('id="toggleKeybindingGroupsButton"')) {
  failures.push("快捷键设置缺少分组展开收起控制");
}
if (!mainSource.includes('className = `keybinding-group ${collapsed ? "collapsed" : ""}`')) {
  failures.push("快捷键设置没有按命令分类渲染分组");
}
if (
  !mainSource.includes("dirty: currentText !== textToSave")
  || !mainSource.includes("savedText: textToSave")
) {
  failures.push("保存完成后没有使用实际提交的文本快照清理未保存状态");
}

for (const [profileName, profile] of profiles) {
  const commandsByBinding = new Map();
  for (const [commandId, bindings] of Object.entries(profile)) {
    if (!implementedCommands.has(commandId)) failures.push(`${profileName}: ${commandId} 没有命令实现`);
    if (new Set(bindings).size !== bindings.length) failures.push(`${profileName}: ${commandId} 包含重复键位`);
    for (const binding of bindings) {
      commandsByBinding.set(binding, [...(commandsByBinding.get(binding) ?? []), commandId]);
      if (keybindings.normalizeBinding(binding) !== binding) {
        failures.push(`${profileName}: ${commandId} 键位未规范化：${binding}`);
      }
      for (const stroke of binding.split(" ")) {
        const parts = stroke.split("+");
        const key = stroke.endsWith("++") ? "+" : parts.pop();
        const modifiers = new Set(parts);
        const event = {
          key,
          ctrlKey: modifiers.has("Ctrl"),
          shiftKey: modifiers.has("Shift") || key === "+",
          altKey: modifiers.has("Alt"),
          metaKey: modifiers.has("Meta"),
          isComposing: false,
        };
        const actual = keybindings.keyboardEventStroke(event, "Win32");
        if (actual !== stroke) failures.push(`${profileName}: ${commandId} 的 ${stroke} 被解析为 ${actual}`);
        testedStrokes += 1;
      }
    }
  }
  const allowedContextualConflicts = profileName === "VS Code"
    ? new Set([
      "Ctrl+Shift+O:editor.quickOutline,markdown.outline",
      "Ctrl+B:markdown.bold,view.toggleExplorer",
      "Ctrl+0:markdown.paragraph,view.zoomReset",
    ])
    : profileName === "Notepad++"
    ? new Set([
      "Ctrl+B:editor.goToBracket,markdown.bold",
      "Ctrl+0:markdown.paragraph,view.zoomReset",
    ])
    : new Set([
      "Ctrl+B:markdown.bold,view.toggleExplorer",
    ]);
  for (const [binding, commandIds] of commandsByBinding) {
    if (commandIds.length < 2) continue;
    const signature = `${binding}:${[...commandIds].sort().join(",")}`;
    if (!allowedContextualConflicts.has(signature)) {
      failures.push(`${profileName}: ${binding} 存在未声明冲突：${commandIds.join("、")}`);
    }
  }
}

for (const [profileName, profile] of profiles) {
  const requiredBindings = [
    ["file.save", "Ctrl+S"],
    ["edit.undo", "Ctrl+Z"],
    ["edit.cut", "Ctrl+X"],
    ["edit.copy", "Ctrl+C"],
    ["edit.paste", "Ctrl+V"],
    ["edit.pastePlain", "Ctrl+Shift+V"],
    ["edit.selectAll", "Ctrl+A"],
    ["search.find", "Ctrl+F"],
    ...Array.from({ length: 6 }, (_, index) => [`markdown.heading${index + 1}`, `Ctrl+${index + 1}`]),
  ];
  for (const [commandId, binding] of requiredBindings) {
    if (!profile[commandId]?.includes(binding)) failures.push(`${profileName}: ${commandId} 缺少 ${binding}`);
  }
}

const appleFind = keybindings.keyboardEventStroke({
  key: "f",
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
  metaKey: true,
  isComposing: false,
}, "MacIntel");
if (appleFind !== "Ctrl+F") failures.push(`macOS ⌘F 应映射为 Ctrl+F，实际为 ${appleFind}`);

const appleLabel = keybindings.bindingLabel("Ctrl+Shift+F", "MacIntel");
if (!appleLabel.includes("⌘") || !appleLabel.includes("⇧")) {
  failures.push(`macOS 快捷键标签异常：${appleLabel}`);
}

const monacoRoot = new URL("../node_modules/monaco-editor/esm/vs/editor/", import.meta.url);
const monacoSources = readJavaScriptTree(monacoRoot);
const monacoActionIds = new Set([
  ...[...mainSource.matchAll(/editorCommand\("[^"]+",\s*"[^"]+",\s*"([^"]+)"/g)].map((match) => match[1]),
  ...[...mainSource.matchAll(/runEditorAction\("([^"]+)"/g)].map((match) => match[1]),
]);
for (const actionId of monacoActionIds) {
  if (!monacoSources.includes(`'${actionId}'`) && !monacoSources.includes(`"${actionId}"`)) {
    failures.push(`Monaco action 不存在：${actionId}`);
  }
}

if (keybindings.resolveKeymapProfile("adaptive", "workspace") !== "notra") {
  failures.push("跟随模式在工作区中未解析为 Notra");
}
if (keybindings.resolveKeymapProfile("adaptive", "single") !== "notra") {
  failures.push("跟随模式在单文件模式中未解析为 Notra");
}
if (!keybindings.isKeymapProfile("notra")) {
  failures.push("isKeymapProfile 未识别 notra");
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`快捷键验证通过：${profiles.length} 套键位，${testedStrokes} 个按键 stroke，${monacoActionIds.size} 个 Monaco action。`);
}

function readJavaScriptTree(url) {
  const files = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const path = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, directory);
      if (entry.isDirectory()) visit(path);
      else if (entry.name.endsWith(".js")) files.push(fs.readFileSync(path, "utf8"));
    }
  };
  visit(url);
  return files.join("\n");
}

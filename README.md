<p align="center">
  <img src="crates/notra-app/icons/128x128.png" width="96" height="96" alt="Notra icon" />
</p>

<h1 align="center">Notra</h1>

<p align="center">轻量、快速、面向文本工程与 Markdown 的桌面编辑器。</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-3b82f6.svg" alt="MIT License" /></a>
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-2563eb.svg" alt="Windows, macOS and Linux" />
  <img src="https://img.shields.io/badge/Tauri-2-24c8db.svg" alt="Tauri 2" />
  <img src="https://img.shields.io/badge/Monaco-0.53-007acc.svg" alt="Monaco Editor" />
</p>

Notra 将 Notepad++ 的轻量文件编辑体验、VS Code 的工作区导航，以及 MarkText 风格的 Markdown 即时编辑整合在一个本地优先的桌面应用中。编辑器基于 Monaco，桌面外壳和文件能力由 Tauri 与 Rust 提供。

定位上更偏向 **文本工程**：打开文件 → 查找/替换 → 批量改行 → Diff 对比 → 格式化/工具箱变换 → 保存，而不是知识库或插件市场。

![Notra Markdown workspace](docs/screenshots/notra-markdown.png)

## 主要功能

### 编辑与工作区

- 单文件与工作区模式，可直接打开文件或目录，也支持拖放文件。
- Monaco 编辑内核：多语言语法高亮、折叠、括号匹配、多光标等。
- 多标签、临时文档、最近文件；窗口位置、工作区、搜索历史和编辑设置可恢复。
- UTF-8、UTF-8 BOM、UTF-16 与 ANSI/GBK 等编码识别与转换；可切换 LF / CRLF / CR。
- 自绘标题栏、亮/深色主题、可调界面与编辑器字体。

### 查找、替换与批量改行

- 当前文件、已打开文档与工作区搜索；普通 / 扩展 / 正则模式，支持替换预览。
- 查找历史与常用片段。
- 批量改行：每行加前/后缀、去行尾空白、排序、删空行、复制行、选中同词等。
- 无选区执行排序/删空行等破坏性操作时会二次确认，避免误改全文。

### Diff 对比

- 与磁盘版本对比、任选两个文件对比、与已打开标签对比。
- 并排 / 行内布局，忽略空白，折叠未变更区域。
- 上一处 / 下一处变更跳转，hunk 还原与复制。

### 文本工具箱

- 右侧抽屉：配方（多步组合）、JSON、清理、行变换、结构、编解码、CSV、统计。
- **已去掉重复**：单步 JSON 配方、对比类（改走工具栏 Diff）、多余 EOL/近似配方。
- 顶部快捷：压缩、JSON 校验/键排序、去行尾空白；**格式化文档**按语言美化 JSON/SQL/XML/HTML。
- 作用范围：有选区改选区，无选区改全文；也可对**查找命中**批量。
- 非法输入只提示不写回；已保存文件在格式化/应用后默认自动保存。

### 格式化

- **格式化文档** `{}`：按语言自动处理 **JSON / SQL / XML / HTML**（有选区改选区）。
- **压缩文档**：JSON / XML / HTML。
- **语法校验**（盾牌）：按当前语言校验 JSON / SQL / XML / HTML；纯文本会先尝试识别内容类型。
- 空白文档粘贴 JSON/SQL/XML/HTML 时自动切换语言。
- 编辑区右键：格式化 / 压缩 / 语法校验 / 清理粘贴 / 去重 等，不必先开工具箱。

### Markdown

- 即时编辑（WYSIWYG）、源码、分屏预览；默认源码模式更利于文本工程。
- 大纲、表格、任务列表、数学公式、网络图片。
- Mermaid、PlantUML、Vega-Lite 图表（PlantUML 预览依赖在线服务）。

### 快捷键与系统

- 快捷键配置：`Notra`（默认，更少和弦）、`VS Code`、`Notepad++`、`adaptive`；可分组查看、自定义、导入/导出。
- macOS 下主修饰键显示为 ⌘，并正确映射匹配。
- 命令面板、系统右键/默认应用集成（平台相关）、应用更新检查。

## 当前状态

Notra 仍在持续开发中。GitHub Releases 提供 Windows x64、macOS ARM64 与 Linux x64 安装包；Windows 10/11 是当前主要测试平台，macOS 与 Linux 由 GitHub Actions 自动构建。

Windows 安装包可从 [GitHub Releases](https://github.com/syscryer/Notra/releases) 获取。

本分支在上游能力之上强化了 Diff、批量改行、文本工具箱（含 JSON 与查找命中）和键位体验，仍属演进中能力。

## 本地开发

需要以下环境：

- Rust stable
- Node.js 20.19 或更高版本
- npm 8 或更高版本
- Windows 另需 WebView2 Runtime

安装前端依赖：

```bash
cd crates/notra-app/frontend
npm install
```

启动桌面开发模式：

```bash
# 推荐使用项目内 Tauri CLI（npm 预构建）
cd crates/notra-app
./frontend/node_modules/.bin/tauri dev

# 或（若已安装 cargo tauri）
cargo tauri dev
```

macOS / Linux 请先确保 Rust 工具链可用（`source "$HOME/.cargo/env"`）。

构建安装包：

```bash
cd crates/notra-app
./frontend/node_modules/.bin/tauri build
# 或 cargo tauri build
```

产物位于仓库 `target/release/bundle`（或平台对应目录）。

## 验证

```bash
cargo test --workspace

cd crates/notra-app/frontend
npm run test:keybindings
npm run test:toolbox
npm run test:markdown
npm run build
```

## 项目结构

```text
crates/notra-app/           Tauri 桌面应用与前端界面
crates/notra-core/          文档、编码、搜索和文件系统核心
crates/notra-app/frontend/  Monaco、工具箱与 Markdown 编辑体验
docs/                       产品、架构和界面资料
scripts/                    上游同步及开发脚本
```

关键前端模块：

- `src/main.ts` — 应用壳、查找/Diff/工具箱 UI 接线
- `src/toolbox.ts` — 纯函数文本变换（可单测）
- `src/keybindings.ts` — 键位配置与平台映射
- `src/markdownEditor.ts` — Muya / 图表预览

## 开源与致谢

Notra 使用 [MIT License](LICENSE) 开源。

Markdown 即时编辑能力基于 [MarkText](https://github.com/marktext/marktext) 的 Muya 编辑器演进，固定的上游版本和许可证保留在 `crates/notra-app/frontend/vendor/marktext-muya`。代码编辑能力由 [Monaco Editor](https://microsoft.github.io/monaco-editor/) 提供。各第三方依赖继续遵循其各自许可证。

export type ToolboxCategoryId =
  | "recipes"
  | "json"
  | "cleanup"
  | "transform"
  | "structure"
  | "encoding"
  | "csv"
  | "stats"
  | "compare";

export type ToolboxScope = "selection" | "file" | "matches";

export type ToolboxToolId =
  | "trim-trailing"
  | "delete-empty-lines"
  | "collapse-blank-lines"
  | "dedupe-lines"
  | "strip-bom"
  | "eol-lf"
  | "eol-crlf"
  | "eol-cr"
  | "upper"
  | "lower"
  | "title-case"
  | "prefix-lines"
  | "suffix-lines"
  | "number-lines"
  | "sort-asc"
  | "sort-desc"
  | "join-lines"
  | "split-delim-to-lines"
  | "json-pretty"
  | "json-minify"
  | "json-sort-keys"
  | "json-validate"
  | "json-flatten"
  | "json-get-path"
  | "json-array-to-csv"
  | "json-csv-to-array"
  | "json-diff"
  | "json-escape"
  | "json-unescape"
  | "sql-format"
  | "xml-pretty"
  | "xml-minify"
  | "html-pretty"
  | "html-minify"
  | "url-encode"
  | "url-decode"
  | "base64-encode"
  | "base64-decode"
  | "unicode-escape"
  | "unicode-unescape"
  | "slash-forward"
  | "slash-back"
  | "html-encode"
  | "html-decode"
  | "csv-extract-column"
  | "csv-quote"
  | "csv-unquote"
  | "csv-comma-to-tab"
  | "csv-tab-to-comma"
  | "stats-summary"
  | "stats-dupes"
  | "stats-hash"
  | "compare-disk"
  | "compare-files"
  | "compare-tabs";

export type ToolboxRecipeId =
  | "recipe-clean-paste"
  | "recipe-sql-pack"
  | "recipe-json-pretty"
  | "recipe-json-minify"
  | "recipe-json-sort"
  | "recipe-json-array-csv"
  | "recipe-config-publish"
  | "recipe-log-shrink"
  | "recipe-encode-rescue";

export type ToolboxItemId = ToolboxToolId | ToolboxRecipeId;

export interface ToolboxContext {
  language?: string;
  lineEnding?: "LF" | "CRLF" | "CR";
  tabSize?: number;
  insertSpaces?: boolean;
  prefix?: string;
  suffix?: string;
  delimiter?: string;
  columnIndex?: number; // 1-based
  path?: string;
}

export type ToolboxResult =
  | { ok: true; text: string; message?: string; replace?: boolean }
  | { ok: false; error: string };

export interface ToolboxItem {
  id: ToolboxItemId;
  category: ToolboxCategoryId;
  title: string;
  description: string;
  featured?: boolean;
  destructive?: boolean;
  needsInput?: "prefix" | "suffix" | "delimiter" | "column" | "path";
  asyncKind?: "sql-format";
  action?: "compare-disk" | "compare-files" | "compare-tabs";
  recipeSteps?: ToolboxToolId[];
}

export const TOOLBOX_CATEGORY_LABELS: Record<ToolboxCategoryId, string> = {
  recipes: "常用配方",
  json: "JSON 工具箱",
  cleanup: "清理",
  transform: "变换",
  structure: "结构化",
  encoding: "编码转义",
  csv: "CSV / 行文本",
  stats: "统计校验",
  compare: "对比",
};

export const TOOLBOX_ITEMS: ToolboxItem[] = [
  // recipes
  {
    id: "recipe-clean-paste",
    category: "recipes",
    title: "清理粘贴文本",
    description: "去 BOM → 统一 LF → 去行尾空白 → 压缩空行",
    featured: true,
    recipeSteps: ["strip-bom", "eol-lf", "trim-trailing", "collapse-blank-lines"],
  },
  {
    id: "recipe-sql-pack",
    category: "recipes",
    title: "SQL 整理",
    description: "SQL 格式化 → 去行尾空白 → 压缩空行",
    featured: true,
    recipeSteps: ["sql-format", "trim-trailing", "collapse-blank-lines"],
  },
  {
    id: "recipe-json-pretty",
    category: "recipes",
    title: "JSON 美化",
    description: "解析并缩进格式化 JSON",
    featured: true,
    recipeSteps: ["json-pretty"],
  },
  {
    id: "recipe-json-minify",
    category: "recipes",
    title: "JSON 压缩",
    description: "解析并压缩为单行 JSON",
    featured: true,
    recipeSteps: ["json-minify"],
  },
  {
    id: "recipe-json-sort",
    category: "recipes",
    title: "JSON 排序键名",
    description: "递归排序 object key 后美化输出",
    featured: true,
    recipeSteps: ["json-sort-keys"],
  },
  {
    id: "recipe-json-array-csv",
    category: "recipes",
    title: "JSON 数组 → CSV",
    description: "对象数组导出为 CSV 文本",
    featured: true,
    recipeSteps: ["json-array-to-csv"],
  },
  {
    id: "recipe-config-publish",
    category: "recipes",
    title: "配置发布前",
    description: "统一 LF → 去 BOM → 去行尾空白",
    recipeSteps: ["eol-lf", "strip-bom", "trim-trailing"],
  },
  {
    id: "recipe-log-shrink",
    category: "recipes",
    title: "日志缩水",
    description: "去行尾空白 → 去重行 → 压缩空行",
    destructive: true,
    recipeSteps: ["trim-trailing", "dedupe-lines", "collapse-blank-lines"],
  },
  {
    id: "recipe-encode-rescue",
    category: "recipes",
    title: "编码救火",
    description: "去 BOM → 统一 LF → 去行尾空白",
    recipeSteps: ["strip-bom", "eol-lf", "trim-trailing"],
  },

  // json featured toolbox
  { id: "json-pretty", category: "json", title: "JSON 美化", description: "pretty print", featured: true },
  { id: "json-minify", category: "json", title: "JSON 压缩", description: "minify", featured: true },
  { id: "json-sort-keys", category: "json", title: "JSON 键名排序", description: "递归排序 key 后美化", featured: true },
  { id: "json-validate", category: "json", title: "JSON 校验", description: "只检查是否合法，不改文本", featured: true },
  { id: "json-flatten", category: "json", title: "JSON 扁平化", description: "嵌套对象 → a.b=c 行文本", featured: true },
  { id: "json-get-path", category: "json", title: "按路径取值", description: "如 data.items.0.name", featured: true, needsInput: "path" },
  { id: "json-array-to-csv", category: "json", title: "数组 → CSV", description: "对象数组导出 CSV", featured: true },
  { id: "json-csv-to-array", category: "json", title: "CSV → 数组", description: "CSV 转 JSON 对象数组", featured: true },
  { id: "json-diff", category: "json", title: "JSON 结构对比", description: "两段 JSON 用 --- 分隔", featured: true },
  { id: "json-escape", category: "json", title: "转成 JSON 字符串", description: "文本 → \"...\" 转义", featured: true },
  { id: "json-unescape", category: "json", title: "解析 JSON 字符串", description: "\"...\" → 文本", featured: true },

  // cleanup
  { id: "trim-trailing", category: "cleanup", title: "删除行尾空白", description: "去掉每行末尾空格/Tab" },
  { id: "delete-empty-lines", category: "cleanup", title: "删除空行", description: "去掉仅空白的行", destructive: true },
  { id: "collapse-blank-lines", category: "cleanup", title: "压缩连续空行", description: "多个空行压成一个" },
  { id: "dedupe-lines", category: "cleanup", title: "删除重复行", description: "保留首次出现", destructive: true },
  { id: "strip-bom", category: "cleanup", title: "去除 BOM", description: "去掉开头 UTF-8 BOM" },
  { id: "eol-lf", category: "cleanup", title: "统一为 LF", description: "换行符 → \\n" },
  { id: "eol-crlf", category: "cleanup", title: "统一为 CRLF", description: "换行符 → \\r\\n" },
  { id: "eol-cr", category: "cleanup", title: "统一为 CR", description: "换行符 → \\r" },

  // transform
  { id: "upper", category: "transform", title: "转大写", description: "全部大写" },
  { id: "lower", category: "transform", title: "转小写", description: "全部小写" },
  { id: "title-case", category: "transform", title: "词首大写", description: "Title Case" },
  { id: "prefix-lines", category: "transform", title: "每行加前缀", description: "需要输入前缀", needsInput: "prefix" },
  { id: "suffix-lines", category: "transform", title: "每行加后缀", description: "需要输入后缀", needsInput: "suffix" },
  { id: "number-lines", category: "transform", title: "每行加序号", description: "1. 2. 3. …" },
  { id: "sort-asc", category: "transform", title: "按行升序", description: "字典序排序", destructive: true },
  { id: "sort-desc", category: "transform", title: "按行降序", description: "字典序倒序", destructive: true },
  { id: "join-lines", category: "transform", title: "多行合并一行", description: "换行变分隔符", needsInput: "delimiter", destructive: true },
  { id: "split-delim-to-lines", category: "transform", title: "分隔符拆成多行", description: "按分隔符断行", needsInput: "delimiter" },

  // structure（XML/HTML 为启发式缩进，复杂文档可能不完美）
  { id: "sql-format", category: "structure", title: "SQL 格式化", description: "美化 SQL", asyncKind: "sql-format" },
  { id: "xml-pretty", category: "structure", title: "XML 美化", description: "启发式缩进（非完整解析器）" },
  { id: "xml-minify", category: "structure", title: "XML 压缩", description: "去掉标签间多余空白" },
  { id: "html-pretty", category: "structure", title: "HTML 美化", description: "启发式缩进（非完整解析器）" },
  { id: "html-minify", category: "structure", title: "HTML 压缩", description: "去掉标签间多余空白" },

  // encoding
  { id: "url-encode", category: "encoding", title: "URL 编码", description: "encodeURIComponent" },
  { id: "url-decode", category: "encoding", title: "URL 解码", description: "decodeURIComponent" },
  { id: "base64-encode", category: "encoding", title: "Base64 编码", description: "文本 → Base64" },
  { id: "base64-decode", category: "encoding", title: "Base64 解码", description: "Base64 → 文本" },
  { id: "unicode-escape", category: "encoding", title: "Unicode 转义", description: "非 ASCII → \\uXXXX" },
  { id: "unicode-unescape", category: "encoding", title: "Unicode 还原", description: "\\uXXXX → 字符" },
  { id: "slash-forward", category: "encoding", title: "斜杠转 /", description: "\\ → /" },
  { id: "slash-back", category: "encoding", title: "斜杠转 \\", description: "/ → \\" },
  { id: "html-encode", category: "encoding", title: "HTML 实体编码", description: "< → &lt;" },
  { id: "html-decode", category: "encoding", title: "HTML 实体解码", description: "&lt; → <" },

  // csv
  { id: "csv-extract-column", category: "csv", title: "提取第 N 列", description: "按分隔符取列", needsInput: "column" },
  { id: "csv-quote", category: "csv", title: "字段加引号", description: "每列加双引号" },
  { id: "csv-unquote", category: "csv", title: "去掉字段引号", description: "去掉包裹引号" },
  { id: "csv-comma-to-tab", category: "csv", title: "逗号改 Tab", description: ", → \\t" },
  { id: "csv-tab-to-comma", category: "csv", title: "Tab 改逗号", description: "\\t → ," },

  // stats
  { id: "stats-summary", category: "stats", title: "文本统计", description: "行/字/字符统计", },
  { id: "stats-dupes", category: "stats", title: "重复行 Top", description: "统计重复最多的行" },
  { id: "stats-hash", category: "stats", title: "内容指纹", description: "简易 hash，便于核对" },

  // compare actions
  { id: "compare-disk", category: "compare", title: "与磁盘对比", description: "打开 Diff", action: "compare-disk" },
  { id: "compare-files", category: "compare", title: "对比两个文件", description: "打开 Diff", action: "compare-files" },
  { id: "compare-tabs", category: "compare", title: "与打开标签对比", description: "打开 Diff", action: "compare-tabs" },
];

/** 查找命中模式下允许的逐段变换（配方/结构体/统计/对比等一律禁用） */
export const TOOLBOX_MATCHES_ALLOWED_IDS = new Set<string>([
  "upper",
  "lower",
  "title-case",
  "prefix-lines",
  "suffix-lines",
  "trim-trailing",
  "strip-bom",
  "json-escape",
  "json-unescape",
  "json-pretty",
  "json-minify",
  "url-encode",
  "url-decode",
  "base64-encode",
  "base64-decode",
  "unicode-escape",
  "unicode-unescape",
  "slash-forward",
  "slash-back",
  "html-encode",
  "html-decode",
]);

export function getToolboxItem(id: string): ToolboxItem | undefined {
  return TOOLBOX_ITEMS.find((item) => item.id === id);
}

export function listToolboxItems(category: ToolboxCategoryId): ToolboxItem[] {
  return TOOLBOX_ITEMS.filter((item) => item.category === category);
}

export function toolboxSupportsMatches(item: ToolboxItem | undefined): boolean {
  if (!item) return false;
  if (item.action || item.recipeSteps?.length || item.asyncKind) return false;
  if (item.category === "stats" || item.category === "compare") return false;
  return TOOLBOX_MATCHES_ALLOWED_IDS.has(item.id);
}

export function toolboxMatchesBlockReason(item: ToolboxItem | undefined): string | null {
  if (!item) return "未选择工具";
  if (toolboxSupportsMatches(item)) return null;
  if (item.action) return "对比类请从 Diff 入口打开，不能按查找命中执行";
  if (item.recipeSteps?.length) return "配方仅支持选区/全文，请切换作用范围";
  if (item.asyncKind || item.category === "structure") return "结构化工具请对选区或全文使用";
  if (item.category === "stats") return "统计类仅预览，且不支持按命中逐段执行";
  if (item.category === "compare") return "请使用 Diff 入口";
  return "该工具不适合按查找命中逐段执行，请改用选区或全文";
}

export function runToolboxItem(id: ToolboxItemId, input: string, ctx: ToolboxContext = {}): ToolboxResult {
  const item = getToolboxItem(id);
  if (!item) return { ok: false, error: `未知工具：${id}` };
  if (item.action) return { ok: false, error: "对比类工具请在界面中直接打开" };
  if (item.asyncKind) return { ok: false, error: "该工具需要异步执行" };

  if (item.recipeSteps?.length) {
    let text = input;
    for (const step of item.recipeSteps) {
      const result = runToolboxTool(step, text, ctx);
      if (!result.ok) return result;
      if (result.replace === false) return result;
      text = result.text;
    }
    return { ok: true, text, message: `配方完成：${item.title}` };
  }

  return runToolboxTool(id as ToolboxToolId, input, ctx);
}

export function runToolboxTool(id: ToolboxToolId, input: string, ctx: ToolboxContext = {}): ToolboxResult {
  try {
    switch (id) {
      case "trim-trailing":
        return ok(mapLines(input, (line) => line.replace(/[ \t]+$/g, "")));
      case "delete-empty-lines":
        return ok(splitLines(input).filter((line) => line.trim().length > 0).join("\n"));
      case "collapse-blank-lines":
        return ok(input.replace(/\n{3,}/g, "\n\n"));
      case "dedupe-lines": {
        const seen = new Set<string>();
        const out: string[] = [];
        for (const line of splitLines(input)) {
          if (seen.has(line)) continue;
          seen.add(line);
          out.push(line);
        }
        return ok(out.join("\n"), `去重后 ${out.length} 行`);
      }
      case "strip-bom":
        return ok(input.replace(/^﻿/, ""));
      case "eol-lf":
        return ok(toLf(input));
      case "eol-crlf":
        return ok(toLf(input).replace(/\n/g, "\r\n"));
      case "eol-cr":
        return ok(toLf(input).replace(/\n/g, "\r"));
      case "upper":
        return ok(input.toUpperCase());
      case "lower":
        return ok(input.toLowerCase());
      case "title-case":
        return ok(input.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()));
      case "prefix-lines": {
        const prefix = ctx.prefix ?? "";
        return ok(mapLines(input, (line) => `${prefix}${line}`));
      }
      case "suffix-lines": {
        const suffix = ctx.suffix ?? "";
        return ok(mapLines(input, (line) => `${line}${suffix}`));
      }
      case "number-lines": {
        const lines = splitLines(input);
        const width = String(lines.length).length;
        return ok(lines.map((line, index) => `${String(index + 1).padStart(width, "0")}. ${line}`).join("\n"));
      }
      case "sort-asc":
        return ok([...splitLines(input)].sort((a, b) => a.localeCompare(b, "en")).join("\n"));
      case "sort-desc":
        return ok([...splitLines(input)].sort((a, b) => b.localeCompare(a, "en")).join("\n"));
      case "join-lines": {
        const delimiter = ctx.delimiter ?? ",";
        return ok(splitLines(input).join(delimiter));
      }
      case "split-delim-to-lines": {
        const delimiter = ctx.delimiter ?? ",";
        if (!delimiter) return { ok: false, error: "请输入分隔符" };
        return ok(input.split(delimiter).join("\n"));
      }
      case "json-pretty":
        return ok(JSON.stringify(JSON.parse(input), null, indentUnit(ctx)), "JSON 已美化");
      case "json-minify":
        return ok(JSON.stringify(JSON.parse(input)), "JSON 已压缩");
      case "json-sort-keys":
        return ok(JSON.stringify(sortJsonKeys(JSON.parse(input)), null, indentUnit(ctx)), "JSON 键名已排序");
      case "json-validate": {
        const parsed = JSON.parse(input);
        const type = Array.isArray(parsed) ? "array" : parsed === null ? "null" : typeof parsed;
        return {
          ok: true,
          text: input,
          replace: false,
          message: `JSON 合法 · 根类型 ${type}`,
        };
      }
      case "json-flatten": {
        const flat = flattenJson(JSON.parse(input));
        const lines = Object.keys(flat).sort((a, b) => a.localeCompare(b)).map((key) => `${key}=${flat[key]}`);
        return ok(lines.join("\n"), `已扁平化 ${lines.length} 个键`);
      }
      case "json-get-path": {
        const path = (ctx.path ?? "").trim();
        if (!path) return { ok: false, error: "请输入 JSON 路径，例如 data.items.0.id" };
        const value = getJsonPath(JSON.parse(input), path);
        if (value === undefined) return { ok: false, error: `路径不存在：${path}` };
        if (typeof value === "string") return ok(value, `已取值：${path}`);
        return ok(JSON.stringify(value, null, indentUnit(ctx)), `已取值：${path}`);
      }
      case "json-array-to-csv":
        return ok(jsonArrayToCsv(input, ctx.delimiter ?? ","), "已转换为 CSV");
      case "json-csv-to-array":
        return ok(
          JSON.stringify(csvToJsonArray(input, ctx.delimiter ?? detectDelimiter(input)), null, indentUnit(ctx)),
          "已转换为 JSON 数组",
        );
      case "json-diff": {
        const parts = splitJsonDiffParts(input);
        if (!parts) {
          return {
            ok: false,
            error: "请用单独一行 --- 分隔两段 JSON（左侧/右侧）",
          };
        }
        const left = JSON.parse(parts.left);
        const right = JSON.parse(parts.right);
        const lines = diffJsonValues(left, right);
        return {
          ok: true,
          text: lines.length ? lines.join("\n") : "两边 JSON 结构与值完全一致",
          replace: false,
          message: lines.length ? `发现 ${lines.length} 处差异（仅预览）` : "无差异",
        };
      }
      case "json-escape":
        return ok(JSON.stringify(input), "已转为 JSON 字符串");
      case "json-unescape": {
        const parsed = JSON.parse(input);
        if (typeof parsed !== "string") return { ok: false, error: "输入不是 JSON 字符串字面量" };
        return ok(parsed, "已解析 JSON 字符串");
      }
      case "xml-pretty":
        return ok(
          beautifyMarkup(input, indentUnit(ctx), false),
          "XML 已启发式缩进（复杂文档请人工复核）",
        );
      case "xml-minify":
        return ok(minifyMarkup(input));
      case "html-pretty":
        return ok(
          beautifyMarkup(input, indentUnit(ctx), true),
          "HTML 已启发式缩进（含 script/复杂属性时请人工复核）",
        );
      case "html-minify":
        return ok(minifyMarkup(input));
      case "url-encode":
        return ok(encodeURIComponent(input));
      case "url-decode":
        return ok(decodeURIComponent(input));
      case "base64-encode":
        return ok(utf8ToBase64(input));
      case "base64-decode":
        return ok(base64ToUtf8(input.trim()));
      case "unicode-escape":
        return ok(unicodeEscape(input));
      case "unicode-unescape":
        return ok(unicodeUnescape(input));
      case "slash-forward":
        return ok(input.replace(/\\/g, "/"));
      case "slash-back":
        return ok(input.replace(/\//g, "\\"));
      case "html-encode":
        return ok(htmlEncode(input));
      case "html-decode":
        return ok(htmlDecode(input));
      case "csv-extract-column": {
        const index = Math.max(1, Number(ctx.columnIndex ?? 1)) - 1;
        const delimiter = ctx.delimiter ?? detectDelimiter(input);
        const rows = splitLines(input).map((line) => splitCsvLine(line, delimiter));
        return ok(rows.map((cols) => cols[index] ?? "").join("\n"), `已提取第 ${index + 1} 列`);
      }
      case "csv-quote": {
        const delimiter = ctx.delimiter ?? detectDelimiter(input);
        return ok(splitLines(input).map((line) => splitCsvLine(line, delimiter).map(csvQuote).join(delimiter)).join("\n"));
      }
      case "csv-unquote": {
        const delimiter = ctx.delimiter ?? detectDelimiter(input);
        return ok(splitLines(input).map((line) => splitCsvLine(line, delimiter).map(csvUnquote).join(delimiter)).join("\n"));
      }
      case "csv-comma-to-tab":
        return ok(splitLines(input).map((line) => splitCsvLine(line, ",").join("\t")).join("\n"));
      case "csv-tab-to-comma":
        return ok(splitLines(input).map((line) => splitCsvLine(line, "\t").join(",")).join("\n"));
      case "stats-summary": {
        const lf = toLf(input);
        const lines = splitLines(lf);
        const nonEmpty = lines.filter((line) => line.trim().length > 0).length;
        const chars = [...lf].length;
        const bytes = new TextEncoder().encode(input).length;
        const words = lf.trim() ? lf.trim().split(/\s+/).length : 0;
        return {
          ok: true,
          text: input,
          replace: false,
          message: `行 ${lines.length}（非空 ${nonEmpty}）· 词 ${words} · 字符 ${chars} · 字节 ${bytes}`,
        };
      }
      case "stats-dupes": {
        const counts = new Map<string, number>();
        for (const line of splitLines(input)) {
          if (!line) continue;
          counts.set(line, (counts.get(line) ?? 0) + 1);
        }
        const top = [...counts.entries()]
          .filter(([, count]) => count > 1)
          .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
          .slice(0, 20)
          .map(([line, count]) => `${count}×\t${line}`)
          .join("\n");
        return {
          ok: true,
          text: top || "(没有重复行)",
          replace: false,
          message: top ? "已生成重复行统计（预览，不写回）" : "没有重复行",
        };
      }
      case "stats-hash": {
        const hash = simpleHash(input);
        return {
          ok: true,
          text: input,
          replace: false,
          message: `指纹 ${hash} · 长度 ${input.length}`,
        };
      }
      default:
        return { ok: false, error: `未实现工具：${id}` };
    }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

function ok(text: string, message?: string): ToolboxResult {
  return { ok: true, text, message };
}

function indentUnit(ctx: ToolboxContext): string {
  if (ctx.insertSpaces === false) return "\t";
  const size = Math.max(1, ctx.tabSize ?? 2);
  return " ".repeat(size);
}

function toLf(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function splitLines(text: string): string[] {
  return toLf(text).split("\n");
}

function mapLines(text: string, mapper: (line: string, index: number) => string): string {
  return splitLines(text).map(mapper).join("\n");
}

function sortJsonKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortJsonKeys);
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(record).sort((a, b) => a.localeCompare(b))) {
      sorted[key] = sortJsonKeys(record[key]);
    }
    return sorted;
  }
  return value;
}

function flattenJson(value: unknown, prefix = "", out: Record<string, string> = {}): Record<string, string> {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const next = prefix ? `${prefix}.${index}` : String(index);
      flattenJson(item, next, out);
    });
    return out;
  }
  if (value && typeof value === "object") {
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      const next = prefix ? `${prefix}.${key}` : key;
      flattenJson(nested, next, out);
    }
    return out;
  }
  out[prefix || "(root)"] = value === null || value === undefined ? String(value) : String(value);
  return out;
}

function getJsonPath(value: unknown, path: string): unknown {
  const parts = path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .map((part) => part.trim())
    .filter(Boolean);
  let current: unknown = value;
  for (const part of parts) {
    if (current == null) return undefined;
    if (Array.isArray(current)) {
      const index = Number(part);
      if (!Number.isInteger(index)) return undefined;
      current = current[index];
      continue;
    }
    if (typeof current === "object") {
      current = (current as Record<string, unknown>)[part];
      continue;
    }
    return undefined;
  }
  return current;
}

function splitJsonDiffParts(input: string): { left: string; right: string } | null {
  const match = toLf(input).match(/^([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;
  return { left: match[1].trim(), right: match[2].trim() };
}

function jsonArrayToCsv(input: string, delimiter: string): string {
  const data = JSON.parse(input);
  if (!Array.isArray(data)) throw new Error("根节点必须是 JSON 数组");
  if (data.length === 0) return "";
  if (data.every((item) => item === null || typeof item !== "object" || Array.isArray(item))) {
    return data.map((item) => csvQuote(item === null || item === undefined ? "" : String(item))).join("\n");
  }
  // 表头：首个对象 key 顺序优先，其余 key 按字典序追加（稳定可复现）
  const header: string[] = [];
  const seen = new Set<string>();
  const firstObject = data.find((item) => item && typeof item === "object" && !Array.isArray(item)) as
    | Record<string, unknown>
    | undefined;
  if (firstObject) {
    for (const key of Object.keys(firstObject)) {
      seen.add(key);
      header.push(key);
    }
  }
  const extras = new Set<string>();
  for (const row of data) {
    if (!row || typeof row !== "object" || Array.isArray(row)) continue;
    for (const key of Object.keys(row as Record<string, unknown>)) {
      if (!seen.has(key)) extras.add(key);
    }
  }
  for (const key of [...extras].sort((a, b) => a.localeCompare(b))) {
    header.push(key);
  }
  if (header.length === 0) throw new Error("数组元素不是对象，无法推导 CSV 表头");
  const lines = [header.map(csvQuote).join(delimiter)];
  for (const row of data) {
    const record = row && typeof row === "object" && !Array.isArray(row)
      ? row as Record<string, unknown>
      : {};
    lines.push(header.map((key) => {
      const value = record[key];
      if (value === null || value === undefined) return "";
      if (typeof value === "object") return csvQuote(JSON.stringify(value));
      return csvQuote(String(value));
    }).join(delimiter));
  }
  return lines.join("\n");
}

function csvToJsonArray(input: string, delimiter: string): Record<string, string>[] {
  const lines = splitLines(input).filter((line) => line.length > 0);
  if (lines.length === 0) return [];
  const headers = splitCsvLine(lines[0], delimiter).map((header) => csvUnquote(header).trim() || "field");
  return lines.slice(1).map((line) => {
    const cols = splitCsvLine(line, delimiter);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = csvUnquote(cols[index] ?? "");
    });
    return row;
  });
}

function diffJsonValues(left: unknown, right: unknown, path = "$"): string[] {
  if (Object.is(left, right)) return [];
  const leftType = jsonType(left);
  const rightType = jsonType(right);
  if (leftType !== rightType) {
    return [`~ ${path}: ${leftType} -> ${rightType} (${previewJson(left)} => ${previewJson(right)})`];
  }
  if (leftType !== "object" && leftType !== "array") {
    return [`~ ${path}: ${previewJson(left)} => ${previewJson(right)}`];
  }
  if (Array.isArray(left) && Array.isArray(right)) {
    const lines: string[] = [];
    const max = Math.max(left.length, right.length);
    for (let i = 0; i < max; i += 1) {
      const child = `${path}[${i}]`;
      if (i >= left.length) lines.push(`+ ${child}: ${previewJson(right[i])}`);
      else if (i >= right.length) lines.push(`- ${child}: ${previewJson(left[i])}`);
      else lines.push(...diffJsonValues(left[i], right[i], child));
    }
    return lines;
  }
  const leftObj = left as Record<string, unknown>;
  const rightObj = right as Record<string, unknown>;
  const keys = new Set([...Object.keys(leftObj), ...Object.keys(rightObj)]);
  const lines: string[] = [];
  for (const key of [...keys].sort((a, b) => a.localeCompare(b))) {
    const child = `${path}.${key}`;
    if (!(key in leftObj)) lines.push(`+ ${child}: ${previewJson(rightObj[key])}`);
    else if (!(key in rightObj)) lines.push(`- ${child}: ${previewJson(leftObj[key])}`);
    else lines.push(...diffJsonValues(leftObj[key], rightObj[key], child));
  }
  return lines;
}

function jsonType(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function previewJson(value: unknown): string {
  const text = JSON.stringify(value);
  if (text == null) return "undefined";
  return text.length > 80 ? `${text.slice(0, 77)}...` : text;
}

function utf8ToBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function base64ToUtf8(text: string): string {
  const binary = atob(text);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function unicodeEscape(text: string): string {
  return [...text].map((char) => {
    const code = char.codePointAt(0) ?? 0;
    if (code < 128) return char;
    if (code <= 0xffff) return `\\u${code.toString(16).padStart(4, "0")}`;
    const offset = code - 0x10000;
    const high = 0xd800 + (offset >> 10);
    const low = 0xdc00 + (offset & 0x3ff);
    return `\\u${high.toString(16)}\\u${low.toString(16)}`;
  }).join("");
}

function unicodeUnescape(text: string): string {
  return text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex: string) => String.fromCharCode(Number.parseInt(hex, 16)));
}

function htmlEncode(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function htmlDecode(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function detectDelimiter(text: string): string {
  const sample = splitLines(text).slice(0, 5).join("\n");
  if (sample.includes("\t")) return "\t";
  if (sample.includes("|")) return "|";
  if (sample.includes(";")) return ";";
  return ",";
}

function splitCsvLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === "\"") {
      if (inQuotes && line[i + 1] === "\"") {
        current += "\"";
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === delimiter && !inQuotes) {
      result.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  result.push(current);
  return result;
}

function csvQuote(value: string): string {
  return `"${value.replace(/"/g, "\"\"")}"`;
}

function csvUnquote(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith("\"") && trimmed.endsWith("\"") && trimmed.length >= 2) {
    return trimmed.slice(1, -1).replace(/\"\"/g, "\"");
  }
  return value;
}

function simpleHash(text: string): string {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function beautifyMarkup(source: string, indentUnit: string, isHtml: boolean) {
  const normalized = source.replace(/\r\n?/g, "\n").trim();
  if (!normalized) return "";
  const tokens = normalized
    .replace(/>\s+</g, "><")
    .replace(/(>)(<)(\/*)/g, "$1\n$2$3")
    .split("\n");
  let depth = 0;
  const voidLike = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i;
  const lines: string[] = [];
  for (const raw of tokens) {
    const line = raw.trim();
    if (!line) continue;
    const isClosing = /^<\//.test(line);
    const isSelfClosing = /\/>$/.test(line)
      || (isHtml && /^<([a-z0-9-]+)[\s>]/i.test(line) && voidLike.test(RegExp.$1));
    const isDoctype = /^<!/.test(line) || /^<\?/.test(line);
    if (isClosing) depth = Math.max(0, depth - 1);
    lines.push(`${indentUnit.repeat(depth)}${line}`);
    if (!isClosing && !isSelfClosing && !isDoctype && /^<[a-zA-Z!?]/.test(line) && !/^<!--/.test(line)) {
      depth += 1;
    }
  }
  return lines.join("\n");
}

function minifyMarkup(source: string) {
  return source
    .replace(/\r\n?/g, "\n")
    .replace(/\n+/g, " ")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .trim();
}

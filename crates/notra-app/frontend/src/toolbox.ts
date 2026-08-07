export type ToolboxCategoryId =
  | "recipes"
  | "json"
  | "convert"
  | "dev"
  | "cleanup"
  | "transform"
  | "structure"
  | "encoding"
  | "csv"
  | "stats";

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
  | "compare-tabs"
  | "yaml-to-json"
  | "json-to-yaml"
  | "toml-to-json"
  | "json-to-toml"
  | "query-to-json"
  | "json-to-query"
  | "json-repair"
  | "json-to-ts"
  | "json-tree"
  | "jwt-decode"
  | "timestamp-convert"
  | "hash-md5"
  | "hash-sha1"
  | "hash-sha256"
  | "regex-test"
  | "text-diff"
  | "uuid-generate"
  | "password-generate"
  | "lorem-generate"
  | "cron-parse"
  | "fullwidth-to-half"
  | "halfwidth-to-full"
  | "cjk-spacing"
  | "strip-html"
  | "extract-urls"
  | "extract-emails"
  | "extract-numbers"
  | "strip-line-numbers"
  | "number-base"
  | "url-parse"
  | "escape-regex"
  | "unescape-regex"
  | "uuid-format"
  | "jwt-pretty";

export type ToolboxRecipeId =
  | "recipe-clean-paste"
  | "recipe-sql-pack"
  | "recipe-config-publish"
  | "recipe-log-shrink"
  | "recipe-json-fix"
  | "recipe-web-paste"
  | "recipe-extract-urls";

export type ToolboxItemId = ToolboxToolId | ToolboxRecipeId;

export type ToolboxInputKind =
  | "prefix"
  | "suffix"
  | "delimiter"
  | "column"
  | "path"
  | "pattern"
  | "flags"
  | "count";

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
  pattern?: string;
  flags?: string;
  count?: number;
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
  /** 单字段兼容；多字段用 needsFields */
  needsInput?: ToolboxInputKind;
  needsFields?: ToolboxInputKind[];
  asyncKind?: "sql-format";
  action?: "compare-disk" | "compare-files" | "compare-tabs";
  recipeSteps?: ToolboxToolId[];
  /** 生成类：可不依赖输入文本 */
  generator?: boolean;
}

export const TOOLBOX_CATEGORY_LABELS: Record<ToolboxCategoryId, string> = {
  recipes: "配方",
  json: "JSON",
  convert: "转换",
  dev: "开发",
  cleanup: "清理",
  transform: "行变换",
  structure: "结构",
  encoding: "编解码",
  csv: "CSV",
  stats: "统计",
};

export const TOOLBOX_ITEMS: ToolboxItem[] = [
  // —— 多步配方（只保留真组合，不与单项重复）——
  {
    id: "recipe-clean-paste",
    category: "recipes",
    title: "清理粘贴文本",
    description: "去 BOM → LF → 去行尾空白 → 压缩空行",
    featured: true,
    recipeSteps: ["strip-bom", "eol-lf", "trim-trailing", "collapse-blank-lines"],
  },
  {
    id: "recipe-sql-pack",
    category: "recipes",
    title: "SQL 收拾",
    description: "SQL 格式化 → 去行尾空白 → 压缩空行",
    featured: true,
    recipeSteps: ["sql-format", "trim-trailing", "collapse-blank-lines"],
  },
  {
    id: "recipe-config-publish",
    category: "recipes",
    title: "发布前收拾",
    description: "去 BOM → LF → 去行尾空白（配置/脚本）",
    featured: true,
    recipeSteps: ["strip-bom", "eol-lf", "trim-trailing"],
  },
  {
    id: "recipe-log-shrink",
    category: "recipes",
    title: "日志缩水",
    description: "去行尾空白 → 去重行 → 压缩空行",
    featured: true,
    destructive: true,
    recipeSteps: ["trim-trailing", "dedupe-lines", "collapse-blank-lines"],
  },
  {
    id: "recipe-json-fix",
    category: "recipes",
    title: "JSON 急救",
    description: "修复 + 键排序 + 美化（单步修复请用顶部 JSON修复）",
    featured: true,
    recipeSteps: ["json-repair", "json-sort-keys", "json-pretty"],
  },
  {
    id: "recipe-web-paste",
    category: "recipes",
    title: "网页粘贴清理",
    description: "去 HTML → 去行尾空白 → 压缩空行",
    featured: true,
    recipeSteps: ["strip-html", "trim-trailing", "collapse-blank-lines"],
  },
  {
    id: "recipe-extract-urls",
    category: "recipes",
    title: "提取链接并去重",
    description: "提取 URL → 去重行",
    featured: true,
    recipeSteps: ["extract-urls", "dedupe-lines"],
  },

  // —— JSON（美化/压缩也可用顶部「格式化/压缩」，此处支持选区）——
  { id: "json-sort-keys", category: "json", title: "键名排序", description: "递归排序 key 后美化", featured: true },
  { id: "json-flatten", category: "json", title: "扁平化", description: "嵌套 → a.b=c 行文本" },
  { id: "json-get-path", category: "json", title: "按路径取值", description: "如 data.items.0.name", needsInput: "path" },
  { id: "json-array-to-csv", category: "json", title: "数组 → CSV", description: "对象数组导出 CSV" },
  { id: "json-csv-to-array", category: "json", title: "CSV → 数组", description: "CSV 转 JSON 对象数组" },
  { id: "json-diff", category: "json", title: "JSON 结构对比", description: "两段 JSON 用 --- 分隔；文本对比请用顶部「对比文本」" },
  { id: "json-escape", category: "json", title: "转成 JSON 字符串", description: "文本 → \"...\"" },
  { id: "json-unescape", category: "json", title: "解析 JSON 字符串", description: "\"...\" → 文本" },
  { id: "json-to-ts", category: "json", title: "JSON → TypeScript", description: "推断 interface 类型", featured: true },
  { id: "json-tree", category: "json", title: "JSON 树视图", description: "缩进树预览（不写回，可复制）", featured: true },

  // —— 转换 ——
  { id: "yaml-to-json", category: "convert", title: "YAML → JSON", description: "常用 YAML 子集转 JSON", featured: true },
  { id: "json-to-yaml", category: "convert", title: "JSON → YAML", description: "JSON 转可读 YAML", featured: true },
  { id: "toml-to-json", category: "convert", title: "TOML → JSON", description: "常用 TOML 子集转 JSON" },
  { id: "json-to-toml", category: "convert", title: "JSON → TOML", description: "扁平/嵌套对象转 TOML" },
  { id: "query-to-json", category: "convert", title: "Query → JSON", description: "a=1&b=2 → JSON 对象", featured: true },
  { id: "json-to-query", category: "convert", title: "JSON → Query", description: "扁平对象 → query string" },

  // —— 开发 ——
  { id: "jwt-decode", category: "dev", title: "JWT 解码", description: "解析 header / payload，时间戳转可读（不验签）", featured: true },
  { id: "timestamp-convert", category: "dev", title: "时间戳转换", description: "秒/毫秒 ↔ ISO 日期", featured: true },
  { id: "hash-md5", category: "dev", title: "MD5", description: "计算 MD5 十六进制" },
  { id: "hash-sha1", category: "dev", title: "SHA-1", description: "计算 SHA-1 十六进制" },
  { id: "hash-sha256", category: "dev", title: "SHA-256", description: "计算 SHA-256 十六进制", featured: true },
  { id: "regex-test", category: "dev", title: "正则测试", description: "高亮匹配与捕获组（预览）", featured: true, needsFields: ["pattern", "flags"] },
  { id: "cron-parse", category: "dev", title: "Cron 解析", description: "五段/六段表达式可读说明", featured: true },
  { id: "uuid-generate", category: "dev", title: "生成 UUID", description: "UUID v4，可指定数量", generator: true, needsFields: ["count"] },
  { id: "password-generate", category: "dev", title: "生成密码", description: "强密码；数量/长度见参数", generator: true, needsFields: ["count", "column"] },
  { id: "lorem-generate", category: "dev", title: "生成 Lorem", description: "占位英文段落/句子", generator: true, needsFields: ["count"] },
  { id: "number-base", category: "dev", title: "进制转换", description: "2/8/10/16；路径填 from-to 如 10-16", featured: true, needsFields: ["path"] },
  { id: "url-parse", category: "dev", title: "URL 解析", description: "拆 host/path/query 为 JSON", featured: true },
  { id: "escape-regex", category: "dev", title: "正则转义", description: "转义正则特殊字符" },
  { id: "unescape-regex", category: "dev", title: "正则去转义", description: "去掉多余反斜杠转义（尽力）" },
  { id: "uuid-format", category: "dev", title: "UUID 格式化", description: "有无连字符互转 / 统一小写", featured: true },

  // —— 清理 ——
  { id: "collapse-blank-lines", category: "cleanup", title: "压缩连续空行", description: "多个空行压成一个" },
  { id: "dedupe-lines", category: "cleanup", title: "删除重复行", description: "保留首次出现", destructive: true, featured: true },
  { id: "strip-bom", category: "cleanup", title: "去除 BOM", description: "去掉开头 UTF-8 BOM" },
  { id: "fullwidth-to-half", category: "cleanup", title: "全角 → 半角", description: "字母数字标点转半角", featured: true },
  { id: "halfwidth-to-full", category: "cleanup", title: "半角 → 全角", description: "字母数字标点转全角" },
  { id: "cjk-spacing", category: "cleanup", title: "中英文加空格", description: "中文与英文/数字间补空格", featured: true },
  { id: "strip-html", category: "cleanup", title: "去除 HTML 标签", description: "保留文本；完整清理见配方「网页粘贴清理」" },
  { id: "extract-urls", category: "cleanup", title: "提取 URL", description: "每行一个链接；去重见配方「提取链接并去重」" },
  { id: "extract-emails", category: "cleanup", title: "提取邮箱", description: "每行一个邮箱" },
  { id: "extract-numbers", category: "cleanup", title: "提取数字", description: "每行一个数字串" },
  { id: "strip-line-numbers", category: "cleanup", title: "去除行号前缀", description: "去掉 1. / 12: / 3) 等行号" },

  // —— 行变换（大小写工具栏也有，这里支持查找命中批量）——
  { id: "number-lines", category: "transform", title: "每行加序号", description: "1. 2. 3. …" },
  { id: "join-lines", category: "transform", title: "多行合并", description: "换行变分隔符", needsInput: "delimiter", destructive: true },
  { id: "split-delim-to-lines", category: "transform", title: "分隔成多行", description: "按分隔符断行", needsInput: "delimiter" },
  { id: "title-case", category: "transform", title: "词首大写", description: "Title Case" },

  // —— 编解码 ——
  { id: "url-encode", category: "encoding", title: "URL 编码", description: "encodeURIComponent", featured: true },
  { id: "url-decode", category: "encoding", title: "URL 解码", description: "decodeURIComponent", featured: true },
  { id: "base64-encode", category: "encoding", title: "Base64 编码", description: "文本 → Base64" },
  { id: "base64-decode", category: "encoding", title: "Base64 解码", description: "Base64 → 文本" },
  { id: "unicode-escape", category: "encoding", title: "Unicode 转义", description: "非 ASCII → \\uXXXX" },
  { id: "unicode-unescape", category: "encoding", title: "Unicode 还原", description: "\\uXXXX → 字符" },
  { id: "html-encode", category: "encoding", title: "HTML 实体编码", description: "< → &lt;" },
  { id: "html-decode", category: "encoding", title: "HTML 实体解码", description: "&lt; → <" },
  { id: "slash-forward", category: "encoding", title: "反斜杠 → 正斜杠", description: "Windows 路径改 /" },
  { id: "slash-back", category: "encoding", title: "正斜杠 → 反斜杠", description: "改成 \\ 分隔" },

  // —— CSV ——
  { id: "csv-extract-column", category: "csv", title: "提取第 N 列", description: "按分隔符取列", needsInput: "column", featured: true },
  { id: "csv-quote", category: "csv", title: "字段加引号", description: "每列加双引号" },
  { id: "csv-unquote", category: "csv", title: "去掉字段引号", description: "去掉包裹引号" },
  { id: "csv-comma-to-tab", category: "csv", title: "逗号 → Tab", description: ", → \\t" },
  { id: "csv-tab-to-comma", category: "csv", title: "Tab → 逗号", description: "\\t → ," },

  // —— 统计（只预览不写回）——
  { id: "stats-summary", category: "stats", title: "文本统计", description: "行 / 词 / 字符 / 字节", featured: true },
  { id: "stats-dupes", category: "stats", title: "重复行 Top", description: "出现最多的行" },
  { id: "stats-hash", category: "stats", title: "内容指纹", description: "简易 hash 便于核对" },
];

/** 与工具栏/右键/批量改行重复：不进工具箱目录，供配方与第一层调用 */
export const TOOLBOX_INTERNAL_ITEMS: ToolboxItem[] = [
  { id: "delete-empty-lines", category: "cleanup", title: "删除空行", description: "去掉仅空白的行", destructive: true },
  { id: "html-minify", category: "structure", title: "HTML 压缩", description: "去掉标签间多余空白" },
  { id: "html-pretty", category: "structure", title: "HTML 美化", description: "启发式缩进" },
  { id: "json-minify", category: "json", title: "JSON 压缩", description: "压成单行" },
  { id: "json-pretty", category: "json", title: "JSON 美化", description: "选区或全文 pretty print" },
  { id: "json-repair", category: "json", title: "语法修复", description: "JSON/JS 对象：尾逗号、单引号、未加引号键、注释等大部分语法问题" },
  { id: "json-validate", category: "json", title: "JSON 语法校验", description: "只检查合法性；通用入口见顶部「语法校验」" },
  { id: "lower", category: "transform", title: "转小写", description: "也可在工具栏使用" },
  { id: "prefix-lines", category: "transform", title: "每行加前缀", description: "需输入前缀", needsInput: "prefix" },
  { id: "sort-asc", category: "transform", title: "按行升序", description: "字典序", destructive: true },
  { id: "sort-desc", category: "transform", title: "按行降序", description: "字典序倒序", destructive: true },
  { id: "sql-format", category: "structure", title: "SQL 格式化", description: "选区或全文", asyncKind: "sql-format" },
  { id: "suffix-lines", category: "transform", title: "每行加后缀", description: "需输入后缀", needsInput: "suffix" },
  { id: "text-diff", category: "dev", title: "文本 Diff", description: "两段文本用单独一行 --- 分隔" },
  { id: "trim-trailing", category: "cleanup", title: "删除行尾空白", description: "去掉每行末尾空格/Tab" },
  { id: "upper", category: "transform", title: "转大写", description: "也可在工具栏使用" },
  { id: "xml-minify", category: "structure", title: "XML 压缩", description: "去掉标签间多余空白" },
  { id: "xml-pretty", category: "structure", title: "XML 美化", description: "启发式缩进" },
  { id: "eol-lf", category: "cleanup", title: "换行统一 LF", description: "内部：配方 / 状态栏行尾" },
  { id: "eol-crlf", category: "cleanup", title: "换行统一 CRLF", description: "内部：配方 / 状态栏行尾" },
  { id: "jwt-pretty", category: "dev", title: "JWT 可读声明", description: "内部别名：同 jwt-decode" },
];

const TOOLBOX_ITEM_INDEX: ToolboxItem[] = [...TOOLBOX_ITEMS, ...TOOLBOX_INTERNAL_ITEMS];

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
  "yaml-to-json",
  "json-to-yaml",
  "toml-to-json",
  "json-to-toml",
  "query-to-json",
  "json-to-query",
  "json-repair",
  "jwt-decode",
  "timestamp-convert",
  "hash-md5",
  "hash-sha1",
  "hash-sha256",
  "fullwidth-to-half",
  "halfwidth-to-full",
  "cjk-spacing",
  "strip-html",
  "escape-regex",
  "unescape-regex",
  "uuid-format",
]);

export function getToolboxItem(id: string): ToolboxItem | undefined {
  return TOOLBOX_ITEM_INDEX.find((item) => item.id === id);
}

/** 工具箱 UI 目录（不含与工具栏/右键重复的内部项） */
export function listToolboxItems(category?: ToolboxCategoryId): ToolboxItem[] {
  if (!category) return [...TOOLBOX_ITEMS];
  return TOOLBOX_ITEMS.filter((item) => item.category === category);
}

export function isToolboxCatalogItem(id: string): boolean {
  return TOOLBOX_ITEMS.some((item) => item.id === id);
}

export function toolboxSupportsMatches(item: ToolboxItem | undefined): boolean {
  if (!item) return false;
  if (item.action || item.recipeSteps?.length || item.asyncKind) return false;
  if (item.category === "stats") return false;
  return TOOLBOX_MATCHES_ALLOWED_IDS.has(item.id);
}

export function toolboxMatchesBlockReason(item: ToolboxItem | undefined): string | null {
  if (!item) return "未选择工具";
  if (toolboxSupportsMatches(item)) return null;
  if (item.action) return "对比类请从 Diff 入口打开，不能按查找命中执行";
  if (item.recipeSteps?.length) return "配方仅支持选区/全文，请切换作用范围";
  if (item.asyncKind || item.category === "structure") return "结构化工具请对选区或全文使用";
  if (item.category === "stats") return "统计类仅预览，且不支持按命中逐段执行";
  if (item.generator) return "生成类工具请对选区/全文使用（不依赖命中）";
  if (item.id === "regex-test" || item.id === "text-diff" || item.id === "cron-parse" || item.id === "json-tree" || item.id === "json-to-ts") {
    return "该工具请对选区或全文使用";
  }
  return "该工具不适合按查找命中逐段执行，请改用选区或全文";
}

export function toolboxItemFields(item: ToolboxItem | undefined): ToolboxInputKind[] {
  if (!item) return [];
  if (item.needsFields?.length) return item.needsFields;
  if (item.needsInput) return [item.needsInput];
  return [];
}

/** 粘贴/内容智能推荐：返回建议打开的工具 id */
export type ToolboxHint = {
  toolId: ToolboxItemId;
  label: string;
  confidence: "high" | "medium";
};

export function detectToolboxHints(text: string): ToolboxHint[] {
  const sample = (text ?? "").trim();
  if (!sample) return [];
  const hints: ToolboxHint[] = [];
  const jwt = sample.match(/eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*/);
  if (jwt) hints.push({ toolId: "jwt-decode", label: "JWT 解码", confidence: "high" });

  if (/^\d{10}$/.test(sample) || /^\d{13}$/.test(sample)) {
    hints.push({ toolId: "timestamp-convert", label: "时间戳转换", confidence: "high" });
  } else if (/\b\d{10}\b/.test(sample) || /\b\d{13}\b/.test(sample)) {
    hints.push({ toolId: "timestamp-convert", label: "时间戳转换", confidence: "medium" });
  }

  if (/^[A-Za-z0-9._%+-]+=[^\n]*&[A-Za-z0-9._%+-]+=/.test(sample) || sample.startsWith("?")) {
    hints.push({ toolId: "query-to-json", label: "Query → JSON", confidence: "high" });
  }

  // dirty json
  if ((sample.startsWith("{") || sample.startsWith("[")) && !isStrictJson(sample)) {
    if (/"/.test(sample) || /'/.test(sample) || /:\s*'/.test(sample) || /,\s*[}\]]/.test(sample)) {
      hints.push({ toolId: "json-repair", label: "JSON 修复", confidence: "medium" });
    }
  } else if (isStrictJson(sample)) {
    // 美化走顶部「格式化」；脏 JSON 才推修复
  }

  if (looksLikeYaml(sample)) {
    hints.push({ toolId: "yaml-to-json", label: "YAML → JSON", confidence: "medium" });
  }
  if (looksLikeToml(sample)) {
    hints.push({ toolId: "toml-to-json", label: "TOML → JSON", confidence: "medium" });
  }
  if (looksLikeCron(sample)) {
    hints.push({ toolId: "cron-parse", label: "Cron 解析", confidence: "high" });
  }

  if (/^[A-Za-z0-9+/\n\r]+=*$/.test(sample) && sample.replace(/\s/g, "").length >= 16 && !/\s/.test(sample.replace(/\n/g, ""))) {
    hints.push({ toolId: "base64-decode", label: "Base64 解码", confidence: "medium" });
  }
  if (/^https?:\/\//i.test(sample) || /^[a-z][a-z0-9+.-]*:\/\//i.test((sample.split(/\s+/)[0] || ""))) {
    hints.push({ toolId: "url-parse", label: "URL 解析", confidence: "high" });
  }
  if (/<[a-zA-Z][^>]*>/.test(sample) && /<\/[a-zA-Z]/.test(sample)) {
    hints.push({ toolId: "recipe-web-paste", label: "网页粘贴清理", confidence: "medium" });
  }
  if (/[\u3000\uff01-\uff5e]/.test(sample)) {
    hints.push({ toolId: "fullwidth-to-half", label: "全角→半角", confidence: "medium" });
  }

  // unique by toolId, prefer high
  const byId = new Map<string, ToolboxHint>();
  for (const h of hints) {
    const prev = byId.get(h.toolId);
    if (!prev || (prev.confidence === "medium" && h.confidence === "high")) byId.set(h.toolId, h);
  }
  return [...byId.values()].slice(0, 4);
}

function isStrictJson(text: string): boolean {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
}

function looksLikeYaml(sample: string): boolean {
  if (isStrictJson(sample)) return false;
  if (!sample.includes("\n") && !sample.includes(":")) return false;
  if (/^---\s*$/m.test(sample)) return true;
  const lines = sample.split(/\n/).slice(0, 30);
  let score = 0;
  for (const line of lines) {
    if (/^\s*#/.test(line) || !line.trim()) continue;
    if (/^\s*[\w.-]+\s*:\s*/.test(line)) score += 1;
    if (/^\s*-\s+/.test(line)) score += 1;
  }
  return score >= 2;
}

function looksLikeToml(sample: string): boolean {
  if (isStrictJson(sample)) return false;
  if (/^\s*\[[\w.-]+\]\s*$/m.test(sample)) return true;
  const lines = sample.split(/\n/).slice(0, 30);
  let score = 0;
  for (const line of lines) {
    if (/^\s*#/.test(line) || !line.trim()) continue;
    if (/^[A-Za-z0-9_.-]+\s*=\s*/.test(line)) score += 1;
  }
  return score >= 2;
}

function looksLikeCron(sample: string): boolean {
  const line = sample.split(/\n/)[0].trim();
  if (line.startsWith("@")) return /@(yearly|annually|monthly|weekly|daily|hourly|reboot)/i.test(line);
  const parts = line.split(/\s+/);
  return parts.length === 5 || parts.length === 6;
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
      case "json-pretty": {
        const parsed = parseJsonInput(input);
        if (!parsed.ok) return parsed;
        return ok(JSON.stringify(parsed.value, null, indentUnit(ctx)), "JSON 已美化");
      }
      case "json-minify": {
        const parsed = parseJsonInput(input);
        if (!parsed.ok) return parsed;
        return ok(JSON.stringify(parsed.value), "JSON 已压缩");
      }
      case "json-sort-keys": {
        const parsed = parseJsonInput(input);
        if (!parsed.ok) return parsed;
        return ok(JSON.stringify(sortJsonKeys(parsed.value), null, indentUnit(ctx)), "JSON 键名已排序");
      }
      case "json-validate": {
        const parsed = parseJsonInput(input);
        if (!parsed.ok) return parsed;
        const value = parsed.value;
        const type = Array.isArray(value) ? "array" : value === null ? "null" : typeof value;
        return {
          ok: true,
          text: input,
          replace: false,
          message: `JSON 合法 · 根类型 ${type}`,
        };
      }
      case "json-flatten": {
        const parsed = parseJsonInput(input);
        if (!parsed.ok) return parsed;
        const flat = flattenJson(parsed.value);
        const lines = Object.keys(flat).sort((a, b) => a.localeCompare(b)).map((key) => `${key}=${flat[key]}`);
        return ok(lines.join("\n"), `已扁平化 ${lines.length} 个键`);
      }
      case "json-get-path": {
        const path = (ctx.path ?? "").trim();
        if (!path) return { ok: false, error: "请输入 JSON 路径，例如 data.items.0.id" };
        const parsed = parseJsonInput(input);
        if (!parsed.ok) return parsed;
        const value = getJsonPath(parsed.value, path);
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
        const left = parseJsonInput(parts.left, "左侧");
        if (!left.ok) return left;
        const right = parseJsonInput(parts.right, "右侧");
        if (!right.ok) return right;
        const lines = diffJsonValues(left.value, right.value);
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
        const parsed = parseJsonInput(input);
        if (!parsed.ok) return parsed;
        if (typeof parsed.value !== "string") return { ok: false, error: "输入不是 JSON 字符串字面量（例如 \"hello\\nworld\"）" };
        return ok(parsed.value, "已解析 JSON 字符串");
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
          message: `简易指纹 ${hash} · 长度 ${input.length}（标准哈希见「开发」MD5/SHA）`,
        };
      }
      case "yaml-to-json": {
        const value = parseYamlDocument(input);
        return ok(JSON.stringify(value, null, indentUnit(ctx)), "YAML 已转为 JSON");
      }
      case "json-to-yaml": {
        const parsed = parseJsonInput(input);
        if (!parsed.ok) return parsed;
        return ok(toYaml(parsed.value), "JSON 已转为 YAML");
      }
      case "toml-to-json": {
        const value = parseTomlDocument(input);
        return ok(JSON.stringify(value, null, indentUnit(ctx)), "TOML 已转为 JSON");
      }
      case "json-to-toml": {
        const parsed = parseJsonInput(input);
        if (!parsed.ok) return parsed;
        return ok(toToml(parsed.value), "JSON 已转为 TOML");
      }
      case "query-to-json": {
        const value = queryStringToObject(input);
        return ok(JSON.stringify(value, null, indentUnit(ctx)), "Query 已转为 JSON");
      }
      case "json-to-query": {
        const parsed = parseJsonInput(input);
        if (!parsed.ok) return parsed;
        return ok(objectToQueryString(parsed.value), "JSON 已转为 Query");
      }
      case "json-repair": {
        const repaired = repairJsonText(input);
        // validate
        try {
          const value = JSON.parse(repaired);
          return ok(JSON.stringify(value, null, indentUnit(ctx)), "JSON 已修复并美化");
        } catch (error) {
          return {
            ok: false,
            error: `修复后仍无法解析：${error instanceof Error ? error.message : String(error)}`,
          };
        }
      }
      case "json-to-ts": {
        const parsed = parseJsonInput(input);
        if (!parsed.ok) return parsed;
        return ok(jsonToTypeScript(parsed.value, "Root"), "已生成 TypeScript 类型");
      }
      case "json-tree": {
        const parsed = parseJsonInput(input);
        if (!parsed.ok) return parsed;
        return {
          ok: true,
          text: renderJsonTree(parsed.value),
          replace: false,
          message: "JSON 树视图（预览，不写回）",
        };
      }
      case "jwt-decode": {
        return ok(decodeJwt(input), "JWT 已解码（未验证签名）");
      }
      case "timestamp-convert": {
        return ok(convertTimestamps(input), "时间戳已转换");
      }
      case "hash-md5":
        return ok(md5Hex(input), "MD5");
      case "hash-sha1":
        return ok(sha1Hex(input), "SHA-1");
      case "hash-sha256":
        return ok(sha256Hex(input), "SHA-256");
      case "regex-test": {
        const pattern = (ctx.pattern ?? "").trim();
        if (!pattern) return { ok: false, error: "请输入正则表达式" };
        const flags = sanitizeRegexFlags(ctx.flags ?? "g");
        let re: RegExp;
        try {
          re = new RegExp(pattern, flags);
        } catch (error) {
          return { ok: false, error: `正则无效：${error instanceof Error ? error.message : String(error)}` };
        }
        return {
          ok: true,
          text: runRegexTest(input, re),
          replace: false,
          message: "正则测试结果（预览，不写回）",
        };
      }
      case "text-diff": {
        const parts = splitJsonDiffParts(input);
        if (!parts) {
          return { ok: false, error: "请用单独一行 --- 分隔两段文本（左/右）" };
        }
        const lines = lineDiff(parts.left, parts.right);
        return {
          ok: true,
          text: lines.join("\n"),
          replace: false,
          message: lines.some((l) => l.startsWith("+") || l.startsWith("-") || l.startsWith("~"))
            ? "文本 Diff（预览，不写回）"
            : "两边文本一致",
        };
      }
      case "cron-parse": {
        return {
          ok: true,
          text: parseCronExpression(input.trim().split(/\n/)[0] ?? ""),
          replace: false,
          message: "Cron 解析（预览）",
        };
      }
      case "uuid-generate": {
        const count = clampInt(ctx.count ?? 1, 1, 200);
        const lines = Array.from({ length: count }, () => createUuidV4());
        return ok(lines.join("\n"), `已生成 ${count} 个 UUID`);
      }
      case "password-generate": {
        const count = clampInt(ctx.count ?? 1, 1, 100);
        const length = clampInt(ctx.columnIndex ?? 16, 8, 128);
        const lines = Array.from({ length: count }, () => createPassword(length));
        return ok(lines.join("\n"), `已生成 ${count} 个密码（长度 ${length}）`);
      }
      case "lorem-generate": {
        const count = clampInt(ctx.count ?? 1, 1, 30);
        return ok(createLorem(count), `已生成 ${count} 段 Lorem`);
      }
      case "fullwidth-to-half":
        return ok(toHalfWidth(input), "已转半角");
      case "halfwidth-to-full":
        return ok(toFullWidth(input), "已转全角");
      case "cjk-spacing":
        return ok(addCjkSpacing(input), "已补中英文空格");
      case "strip-html":
        return ok(stripHtmlTags(input), "已去除 HTML 标签");
      case "extract-urls": {
        const urls = extractByRegex(input, /\bhttps?:\/\/[^\s<>"']+/gi);
        return ok(urls.join("\n"), urls.length ? `提取 ${urls.length} 个 URL` : "未找到 URL");
      }
      case "extract-emails": {
        const emails = extractByRegex(input, /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi);
        return ok(emails.join("\n"), emails.length ? `提取 ${emails.length} 个邮箱` : "未找到邮箱");
      }
      case "extract-numbers": {
        const nums = extractByRegex(input, /[-+]?\d+(?:\.\d+)?/g);
        return ok(nums.join("\n"), nums.length ? `提取 ${nums.length} 个数字` : "未找到数字");
      }
      case "strip-line-numbers":
        return ok(mapLines(input, (line) => line.replace(/^\s*(?:\d+[\.:\)\、]|\(\d+\)|\[\d+\])\s+/, "")), "已去除行号前缀");
      case "number-base": {
        const spec = (ctx.path ?? "10-16").trim().toLowerCase();
        const matched = spec.match(/^(\d{1,2})\s*[-:>to]+\s*(\d{1,2})$/) || spec.match(/^(\d{1,2})\s+(\d{1,2})$/);
        const fromBase = matched ? Number(matched[1]) : 10;
        const toBase = matched ? Number(matched[2]) : 16;
        if (![2, 8, 10, 16].includes(fromBase) || ![2, 8, 10, 16].includes(toBase)) {
          return { ok: false, error: "进制仅支持 2/8/10/16，路径示例：10-16" };
        }
        const lines = splitLines(input).map((line) => {
          const raw = line.trim();
          if (!raw) return "";
          const normalized = fromBase === 16 ? raw.replace(/^0x/i, "") : fromBase === 2 ? raw.replace(/^0b/i, "") : raw;
          const n = Number.parseInt(normalized, fromBase);
          if (!Number.isFinite(n)) return `/* invalid: ${line} */`;
          const out = n.toString(toBase);
          return toBase === 16 ? out.toUpperCase() : out;
        });
        return ok(lines.join("\n"), `进制 ${fromBase} → ${toBase}`);
      }
      case "url-parse": {
        const lines = splitLines(input).map((line) => line.trim()).filter(Boolean);
        const rows = lines.map((line) => {
          try {
            const u = new URL(line.includes("://") ? line : `https://${line}`);
            const query: Record<string, string> = {};
            u.searchParams.forEach((v, k) => {
              query[k] = v;
            });
            return {
              href: u.href,
              protocol: u.protocol.replace(":", ""),
              host: u.host,
              hostname: u.hostname,
              port: u.port || null,
              pathname: u.pathname,
              search: u.search || null,
              hash: u.hash || null,
              query,
            };
          } catch {
            return { input: line, error: "invalid url" };
          }
        });
        return ok(JSON.stringify(rows.length === 1 ? rows[0] : rows, null, indentUnit(ctx)), "URL 已解析");
      }
      case "escape-regex":
        return ok(input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "已转义正则特殊字符");
      case "unescape-regex":
        return ok(input.replace(/\\([.*+?^${}()|[\]\\])/g, "$1"), "已尝试去除正则转义");
      case "uuid-format": {
        const prefersHyphen = !input.includes("-");
        const lines = splitLines(input).map((line) => {
          const hex = line.replace(/[^A-Fa-f0-9]/g, "").toLowerCase();
          if (hex.length !== 32) return line;
          if (prefersHyphen) {
            return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
          }
          return hex;
        });
        return ok(lines.join("\n"), prefersHyphen ? "已加连字符" : "已去连字符并小写");
      }
      case "jwt-pretty":
        return runToolboxItem("jwt-decode", input, ctx);
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

/** 安全解析 JSON：失败只返回 error，绝不抛出让调用方写回空文本 */
function parseJsonInput(
  input: string,
  label = "内容",
): { ok: true; value: unknown } | { ok: false; error: string } {
  const text = input ?? "";
  if (!text.trim()) {
    return { ok: false, error: `${label}为空，不是有效 JSON（已取消，未修改原文）` };
  }
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return {
      ok: false,
      error: `${label}不是有效 JSON，已取消（未修改原文）。${detail}`,
    };
  }
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


function clampInt(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.trunc(value)));
}

function createUuidV4(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(bytes);
  else for (let i = 0; i < 16; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/** 密码学安全的 [0,1) 随机数；无 crypto 时降级到 Math.random 作为最后 fallback */
function secureRandom(): number {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0]! / 0x100000000;
  }
  return Math.random();
}

function createPassword(length: number): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const digits = "23456789";
  const symbols = "!@#$%^&*-_=+";
  const all = upper + lower + digits + symbols;
  const pick = (set: string) => set[Math.floor(secureRandom() * set.length)]!;
  const chars = [pick(upper), pick(lower), pick(digits), pick(symbols)];
  while (chars.length < length) chars.push(pick(all));
  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = Math.floor(secureRandom() * (i + 1));
    [chars[i], chars[j]] = [chars[j]!, chars[i]!];
  }
  return chars.join("");
}

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
  "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "ut",
  "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi",
  "ut", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "dolor",
];

function createLorem(paragraphs: number): string {
  const out: string[] = [];
  for (let p = 0; p < paragraphs; p += 1) {
    const sentences = 3 + (p % 3);
    const parts: string[] = [];
    for (let s = 0; s < sentences; s += 1) {
      const n = 8 + ((p + s) % 10);
      const words: string[] = [];
      for (let i = 0; i < n; i += 1) {
        words.push(LOREM_WORDS[(p * 17 + s * 7 + i * 3) % LOREM_WORDS.length]!);
      }
      words[0] = words[0]!.charAt(0).toUpperCase() + words[0]!.slice(1);
      parts.push(`${words.join(" ")}.`);
    }
    out.push(parts.join(" "));
  }
  return out.join("\n\n");
}

function sanitizeRegexFlags(flags: string): string {
  const allowed = new Set(["g", "i", "m", "s", "u", "y", "d"]);
  const out: string[] = [];
  for (const ch of flags) {
    if (allowed.has(ch) && !out.includes(ch)) out.push(ch);
  }
  if (!out.includes("g")) out.push("g");
  return out.join("");
}

function runRegexTest(input: string, re: RegExp): string {
  const lines: string[] = [];
  lines.push(`Pattern: /${re.source}/${re.flags}`);
  lines.push(`Input length: ${input.length}`);
  lines.push("");
  let match: RegExpExecArray | null;
  let index = 0;
  const max = 200;
  // Avoid infinite loop on empty matches
  const safe = new RegExp(re.source, re.flags.includes("g") ? re.flags : `${re.flags}g`);
  while ((match = safe.exec(input)) && index < max) {
    index += 1;
    lines.push(`#${index} @${match.index}-${match.index + match[0].length}`);
    lines.push(`  match: ${JSON.stringify(match[0])}`);
    if (match.length > 1) {
      for (let g = 1; g < match.length; g += 1) {
        lines.push(`  group ${g}: ${JSON.stringify(match[g] ?? null)}`);
      }
    }
    if (match.groups) {
      for (const [name, value] of Object.entries(match.groups)) {
        lines.push(`  group <${name}>: ${JSON.stringify(value ?? null)}`);
      }
    }
    if (match[0].length === 0) {
      safe.lastIndex += 1;
    }
  }
  if (index === 0) lines.push("(无匹配)");
  else if (index >= max) lines.push(`… 仅显示前 ${max} 个匹配`);
  lines.push("");
  lines.push("---- 标注预览 ----");
  lines.push(annotateRegexMatches(input, new RegExp(re.source, re.flags.includes("g") ? re.flags : `${re.flags}g`), max));
  return lines.join("\n");
}

function annotateRegexMatches(input: string, re: RegExp, max: number): string {
  const marks: { start: number; end: number; n: number }[] = [];
  let match: RegExpExecArray | null;
  let n = 0;
  while ((match = re.exec(input)) && n < max) {
    n += 1;
    marks.push({ start: match.index, end: match.index + match[0].length, n });
    if (match[0].length === 0) re.lastIndex += 1;
  }
  if (!marks.length) return input;
  let out = "";
  let cursor = 0;
  for (const mark of marks) {
    out += input.slice(cursor, mark.start);
    out += `⟦${mark.n}:${input.slice(mark.start, mark.end)}⟧`;
    cursor = mark.end;
  }
  out += input.slice(cursor);
  return out;
}

function decodeJwt(input: string): string {
  const token = input.trim().replace(/^Bearer\s+/i, "");
  const parts = token.split(".");
  if (parts.length < 2) throw new Error("不是有效 JWT（需要 header.payload.signature）");
  const header = decodeJwtPart(parts[0]!, "header");
  const payload = decodeJwtPart(parts[1]!, "payload");
  const result: Record<string, unknown> = {
    header,
    payload,
    signature: parts[2] ?? null,
    claims: summarizeJwtClaims(payload),
  };
  return JSON.stringify(result, null, 2);
}

function decodeJwtPart(part: string, label: string): unknown {
  try {
    const json = base64UrlToUtf8(part);
    return JSON.parse(json);
  } catch (error) {
    throw new Error(`JWT ${label} 解码失败：${error instanceof Error ? error.message : String(error)}`);
  }
}

function base64UrlToUtf8(part: string): string {
  const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
  const pad = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return base64ToUtf8(normalized + pad);
}

function summarizeJwtClaims(payload: unknown): Record<string, unknown> {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return {};
  const p = payload as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const key of ["iss", "sub", "aud", "jti", "scope", "azp"]) {
    if (key in p) out[key] = p[key];
  }
  for (const key of ["exp", "iat", "nbf"]) {
    const value = p[key];
    if (typeof value === "number") {
      out[key] = value;
      out[`${key}_iso`] = new Date(value * 1000).toISOString();
    }
  }
  return out;
}

function convertTimestamps(input: string): string {
  const text = input.trim();
  const lines = splitLines(text).filter((line) => line.trim().length > 0);
  const targets = lines.length > 1 ? lines : [text];
  const out: string[] = [];
  for (const raw of targets) {
    const item = raw.trim();
    if (!item) continue;
    // pure digits
    if (/^-?\d+$/.test(item)) {
      const n = Number(item);
      const ms = Math.abs(n) >= 1e12 ? n : n * 1000;
      const date = new Date(ms);
      if (Number.isNaN(date.getTime())) throw new Error(`无法解析时间戳：${item}`);
      out.push(
        [
          `input: ${item}`,
          `unit: ${Math.abs(n) >= 1e12 ? "milliseconds" : "seconds"}`,
          `iso: ${date.toISOString()}`,
          `local: ${date.toString()}`,
          `unix_s: ${Math.floor(date.getTime() / 1000)}`,
          `unix_ms: ${date.getTime()}`,
        ].join("\n"),
      );
      continue;
    }
    const date = new Date(item);
    if (Number.isNaN(date.getTime())) throw new Error(`无法解析日期：${item}`);
    out.push(
      [
        `input: ${item}`,
        `iso: ${date.toISOString()}`,
        `local: ${date.toString()}`,
        `unix_s: ${Math.floor(date.getTime() / 1000)}`,
        `unix_ms: ${date.getTime()}`,
      ].join("\n"),
    );
  }
  return out.join("\n\n");
}

function queryStringToObject(input: string): Record<string, string | string[]> {
  let raw = input.trim();
  const q = raw.indexOf("?");
  if (q >= 0 && (q === 0 || /^https?:/i.test(raw) || raw.includes("://"))) {
    try {
      if (raw.startsWith("?")) raw = raw.slice(1);
      else raw = new URL(raw).searchParams.toString() || raw.slice(q + 1);
    } catch {
      raw = raw.slice(q + 1);
    }
  }
  if (raw.startsWith("?")) raw = raw.slice(1);
  const params = new URLSearchParams(raw);
  const out: Record<string, string | string[]> = {};
  for (const key of new Set(params.keys())) {
    const all = params.getAll(key);
    out[key] = all.length <= 1 ? (all[0] ?? "") : all;
  }
  return out;
}

function objectToQueryString(value: unknown): string {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("根节点需要是 JSON 对象");
  }
  const params = new URLSearchParams();
  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    if (nested === null || nested === undefined) continue;
    if (Array.isArray(nested)) {
      for (const item of nested) params.append(key, String(item));
    } else if (typeof nested === "object") {
      params.set(key, JSON.stringify(nested));
    } else {
      params.set(key, String(nested));
    }
  }
  return params.toString();
}

function repairJsonText(input: string): string {
  let text = toLf(input).trim();
  // strip JS-style comments
  text = text.replace(/^\s*\/\/.*$/gm, "");
  text = text.replace(/\/\*[\s\S]*?\*\//g, "");
  // trailing commas
  text = text.replace(/,\s*([}\]])/g, "$1");
  // single quotes -> double quotes for keys/strings (heuristic)
  text = text.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_, body: string) => {
    const escaped = body.replace(/\\"/g, '"').replace(/"/g, '\\"');
    return `"${escaped}"`;
  });
  // unquoted keys: {foo: 1} or , bar:
  text = text.replace(/([{,]\s*)([A-Za-z_][\w.-]*)(\s*:)/g, '$1"$2"$3');
  return text;
}

function jsonToTypeScript(value: unknown, name: string): string {
  const lines: string[] = [];
  const walk = (v: unknown, typeName: string, depth: number): string => {
    if (v === null) return "null";
    if (Array.isArray(v)) {
      if (v.length === 0) return "unknown[]";
      const parts = v.slice(0, 20).map((item, i) => walk(item, `${typeName}Item${i}`, depth + 1));
      const unique = [...new Set(parts)];
      if (unique.length === 1) return `${unique[0]}[]`;
      return `(${unique.join(" | ")})[]`;
    }
    switch (typeof v) {
      case "string":
        return "string";
      case "number":
        return Number.isInteger(v) ? "number" : "number";
      case "boolean":
        return "boolean";
      case "object": {
        const entries = Object.entries(v as Record<string, unknown>);
        if (entries.length === 0) return "Record<string, never>";
        const indent = "  ".repeat(depth);
        const inner = "  ".repeat(depth + 1);
        const fields = entries.map(([key, nested]) => {
          const safeKey = /^[A-Za-z_][A-Za-z0-9_]*$/.test(key) ? key : JSON.stringify(key);
          return `${inner}${safeKey}: ${walk(nested, key, depth + 1)};`;
        });
        return `{\n${fields.join("\n")}\n${indent}}`;
      }
      default:
        return "unknown";
    }
  };
  const body = walk(value, name, 0);
  if (body.startsWith("{")) {
    lines.push(`export interface ${name} ${body}`);
  } else {
    lines.push(`export type ${name} = ${body};`);
  }
  return lines.join("\n");
}

function renderJsonTree(value: unknown, path = "$", depth = 0): string {
  const pad = "  ".repeat(depth);
  if (value === null) return `${pad}${path}: null`;
  if (Array.isArray(value)) {
    if (value.length === 0) return `${pad}${path}: []`;
    const lines = [`${pad}${path}: [array ${value.length}]`];
    value.slice(0, 200).forEach((item, index) => {
      lines.push(renderJsonTree(item, `${path}[${index}]`, depth + 1));
    });
    if (value.length > 200) lines.push(`${pad}  … ${value.length - 200} more`);
    return lines.join("\n");
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return `${pad}${path}: {}`;
    const lines = [`${pad}${path}: {object ${entries.length}}`];
    for (const [key, nested] of entries.slice(0, 300)) {
      lines.push(renderJsonTree(nested, `${path}.${key}`, depth + 1));
    }
    if (entries.length > 300) lines.push(`${pad}  … ${entries.length - 300} more`);
    return lines.join("\n");
  }
  return `${pad}${path}: ${JSON.stringify(value)}`;
}

function lineDiff(leftText: string, rightText: string): string[] {
  const a = splitLines(leftText);
  const b = splitLines(rightText);
  // LCS DP
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      dp[i]![j] = a[i] === b[j] ? (dp[i + 1]![j + 1]! + 1) : Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!);
    }
  }
  const out: string[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      out.push(`  ${a[i]}`);
      i += 1;
      j += 1;
    } else if (dp[i + 1]![j]! >= dp[i]![j + 1]!) {
      out.push(`- ${a[i]}`);
      i += 1;
    } else {
      out.push(`+ ${b[j]}`);
      j += 1;
    }
  }
  while (i < n) {
    out.push(`- ${a[i]}`);
    i += 1;
  }
  while (j < m) {
    out.push(`+ ${b[j]}`);
    j += 1;
  }
  if (!out.some((line) => line.startsWith("+") || line.startsWith("-"))) {
    return ["(无差异)"];
  }
  return out;
}

function parseCronExpression(expr: string): string {
  const raw = expr.trim();
  if (!raw) throw new Error("请输入 Cron 表达式");
  const aliases: Record<string, string> = {
    "@yearly": "0 0 1 1 *",
    "@annually": "0 0 1 1 *",
    "@monthly": "0 0 1 * *",
    "@weekly": "0 0 * * 0",
    "@daily": "0 0 * * *",
    "@hourly": "0 * * * *",
    "@reboot": "@reboot",
  };
  const lower = raw.toLowerCase();
  if (aliases[lower]) {
    if (lower === "@reboot") return "开机时执行（@reboot，非时间字段）";
    return parseCronExpression(aliases[lower]!);
  }
  const parts = raw.split(/\s+/);
  if (parts.length !== 5 && parts.length !== 6) {
    throw new Error("需要 5 段（分 时 日 月 周）或 6 段（秒 分 时 日 月 周）Cron");
  }
  const hasSeconds = parts.length === 6;
  const labels = hasSeconds
    ? ["秒", "分", "时", "日", "月", "周"]
    : ["分", "时", "日", "月", "周"];
  const lines = [`表达式: ${raw}`, `字段数: ${parts.length}${hasSeconds ? "（含秒）" : ""}`, ""];
  parts.forEach((part, index) => {
    lines.push(`${labels[index]}: ${part} → ${describeCronField(part, labels[index]!)}`);
  });
  lines.push("");
  lines.push(`摘要: ${summarizeCron(parts, hasSeconds)}`);
  return lines.join("\n");
}

function describeCronField(field: string, label: string): string {
  if (field === "*") return `每${label}`;
  if (field === "?") return "不指定";
  if (field.startsWith("*/")) return `每隔 ${field.slice(2)} ${label}`;
  if (field.includes("-") && field.includes("/")) {
    const [range, step] = field.split("/");
    return `${range} 范围内每 ${step} ${label}`;
  }
  if (field.includes("-")) return `${field.replace("-", " 到 ")}`;
  if (field.includes(",")) return `取值 ${field}`;
  return `固定 ${field}`;
}

function summarizeCron(parts: string[], hasSeconds: boolean): string {
  const [sec, min, hour, dom, mon, dow] = hasSeconds
    ? parts
    : ["0", parts[0], parts[1], parts[2], parts[3], parts[4]];
  const time = hasSeconds
    ? `${hour}:${min}:${sec}`.replace(/\*/g, "xx")
    : `${hour}:${min}`.replace(/\*/g, "xx");
  return `在 ${mon === "*" ? "每月" : `月=${mon}`} 的 ${dom === "*" ? "每日" : `日=${dom}`}，周=${dow}，时间约 ${time}`;
}

// ---- YAML (common subset) ----
function parseYamlDocument(input: string): unknown {
  const text = toLf(input).replace(/\t/g, "  ");
  if (!text.trim()) return null;
  // multi-doc: take first
  const doc = text.replace(/^---\s*\n/, "").replace(/\n---\s*$/, "");
  const lines = doc.split("\n");
  const filtered: string[] = [];
  for (const line of lines) {
    if (/^\s*#/.test(line)) continue;
    filtered.push(line.replace(/\s+#.*$/, (m, offset, whole) => {
      // keep if inside quotes roughly
      const before = whole.slice(0, offset);
      const q = (before.match(/"/g) || []).length;
      const sq = (before.match(/'/g) || []).length;
      if (q % 2 === 1 || sq % 2 === 1) return m;
      return "";
    }));
  }
  const body = filtered.join("\n").replace(/\n+$/, "");
  if (!body.trim()) return null;
  if (body.trimStart().startsWith("{") || body.trimStart().startsWith("[")) {
    try {
      return JSON.parse(body);
    } catch {
      // fallthrough
    }
  }
  return parseYamlBlock(body.split("\n"), 0).value;
}

function parseYamlBlock(lines: string[], start: number): { value: unknown; next: number } {
  // determine if sequence or map at this indent
  let i = start;
  while (i < lines.length && !lines[i]!.trim()) i += 1;
  if (i >= lines.length) return { value: null, next: i };
  const indent = leadingSpaces(lines[i]!);
  if (lines[i]!.trimStart().startsWith("- ")) {
    const list: unknown[] = [];
    while (i < lines.length) {
      if (!lines[i]!.trim()) {
        i += 1;
        continue;
      }
      const ind = leadingSpaces(lines[i]!);
      if (ind < indent) break;
      if (ind > indent) throw new Error(`YAML 缩进错误（第 ${i + 1} 行）`);
      if (!lines[i]!.trimStart().startsWith("- ")) break;
      const rest = lines[i]!.slice(indent + 2);
      if (!rest.trim()) {
        // nested block
        const child = parseYamlBlock(lines, i + 1);
        list.push(child.value);
        i = child.next;
        continue;
      }
      if (rest.includes(":") && !isQuoted(rest) && !/^[[{]/.test(rest.trim())) {
        // inline map start on same line as -
        const fake = `${" ".repeat(indent + 2)}${rest}`;
        // parse map from synthetic — easier: inject
        const mapLines = lines.slice();
        mapLines[i] = fake;
        const child = parseYamlMap(mapLines, i, indent + 2);
        list.push(child.value);
        i = child.next;
        continue;
      }
      list.push(parseYamlScalar(rest.trim()));
      i += 1;
      // nested deeper under this list item
      if (i < lines.length && leadingSpaces(lines[i]!) > indent && lines[i]!.trim()) {
        // if next is nested structure without being next list sibling
        if (!lines[i]!.trimStart().startsWith("- ") || leadingSpaces(lines[i]!) > indent + 2) {
          // complex: skip for subset
        }
      }
    }
    return { value: list, next: i };
  }
  return parseYamlMap(lines, i, indent);
}

function parseYamlMap(lines: string[], start: number, indent: number): { value: Record<string, unknown>; next: number } {
  const obj: Record<string, unknown> = {};
  let i = start;
  while (i < lines.length) {
    if (!lines[i]!.trim()) {
      i += 1;
      continue;
    }
    const ind = leadingSpaces(lines[i]!);
    if (ind < indent) break;
    if (ind > indent) throw new Error(`YAML 缩进错误（第 ${i + 1} 行）`);
    const trimmed = lines[i]!.trim();
    if (trimmed.startsWith("- ")) break;
    const colon = splitYamlKeyValue(trimmed);
    if (!colon) throw new Error(`YAML 无法解析（第 ${i + 1} 行）：${trimmed}`);
    const key = colon.key;
    const valuePart = colon.value;
    i += 1;
    if (!valuePart) {
      // nested
      if (i < lines.length && lines[i]!.trim() && leadingSpaces(lines[i]!) > indent) {
        const child = parseYamlBlock(lines, i);
        obj[key] = child.value;
        i = child.next;
      } else {
        obj[key] = null;
      }
    } else if ((valuePart === "|" || valuePart === ">") && i < lines.length) {
      const block: string[] = [];
      while (i < lines.length) {
        if (!lines[i]!.trim()) {
          block.push("");
          i += 1;
          continue;
        }
        if (leadingSpaces(lines[i]!) <= indent) break;
        block.push(lines[i]!.slice(indent + 2));
        i += 1;
      }
      obj[key] = valuePart === "|" ? block.join("\n") : block.map((l) => l.trim()).join(" ");
    } else {
      obj[key] = parseYamlScalar(valuePart);
    }
  }
  return { value: obj, next: i };
}

function splitYamlKeyValue(line: string): { key: string; value: string } | null {
  // key: value
  const m = line.match(/^([^:]+):(.*)$/);
  if (!m) return null;
  const key = m[1]!.trim().replace(/^['"]|['"]$/g, "");
  const value = m[2]!.trim();
  return { key, value };
}

function leadingSpaces(line: string): number {
  const m = line.match(/^ */);
  return m ? m[0].length : 0;
}

function isQuoted(text: string): boolean {
  const t = text.trim();
  return (t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"));
}

function parseYamlScalar(text: string): unknown {
  const t = text.trim();
  if (!t || t === "~" || t === "null" || t === "Null" || t === "NULL") return null;
  if (t === "true" || t === "True" || t === "TRUE") return true;
  if (t === "false" || t === "False" || t === "FALSE") return false;
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1);
  }
  if (/^-?\d+$/.test(t)) return Number(t);
  if (/^-?\d+\.\d+$/.test(t)) return Number(t);
  if ((t.startsWith("[") && t.endsWith("]")) || (t.startsWith("{") && t.endsWith("}"))) {
    try {
      return JSON.parse(t.replace(/'/g, '"'));
    } catch {
      // fallthrough
    }
  }
  return t;
}

function toYaml(value: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);
  if (value === null || value === undefined) return "null";
  if (typeof value === "string") {
    if (value.includes("\n")) {
      return `|\n${value.split("\n").map((line) => `${pad}  ${line}`).join("\n")}`;
    }
    if (/[:#\-?&*!|>'"%@`{}[\],]/.test(value) || value === "" || /^(true|false|null)$/i.test(value)) {
      return JSON.stringify(value);
    }
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    return value
      .map((item) => {
        if (item && typeof item === "object") {
          const nested = toYaml(item, indent + 1);
          const nestedLines = nested.split("\n");
          return `${pad}- ${nestedLines[0]}\n${nestedLines.slice(1).map((l) => (l.startsWith("  ") ? l : `${pad}  ${l}`)).join("\n")}`.replace(/\n$/, "");
        }
        return `${pad}- ${toYaml(item, indent + 1)}`;
      })
      .join("\n");
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return "{}";
    return entries
      .map(([key, nested]) => {
        if (nested && typeof nested === "object") {
          const body = toYaml(nested, indent + 1);
          if (body === "{}" || body === "[]") return `${pad}${key}: ${body}`;
          return `${pad}${key}:\n${body}`;
        }
        return `${pad}${key}: ${toYaml(nested, indent + 1)}`;
      })
      .join("\n");
  }
  return JSON.stringify(value);
}

// ---- TOML subset ----
function parseTomlDocument(input: string): Record<string, unknown> {
  const root: Record<string, unknown> = {};
  let current: Record<string, unknown> = root;
  for (const rawLine of toLf(input).split("\n")) {
    const line = rawLine.replace(/(^|\s)#.*$/, (m, p1, offset, whole) => {
      const before = whole.slice(0, offset);
      if ((before.match(/"/g) || []).length % 2 === 1) return m;
      return p1 || "";
    }).trim();
    if (!line) continue;
    const table = line.match(/^\[([^\]]+)\]$/);
    if (table) {
      current = ensureTomlTable(root, table[1]!.trim());
      continue;
    }
    const arrayTable = line.match(/^\[\[([^\]]+)\]\]$/);
    if (arrayTable) {
      current = pushTomlArrayTable(root, arrayTable[1]!.trim());
      continue;
    }
    const eq = line.indexOf("=");
    if (eq < 0) throw new Error(`TOML 无法解析：${line}`);
    const key = line.slice(0, eq).trim();
    const valueRaw = line.slice(eq + 1).trim();
    setTomlKey(current, key, parseTomlValue(valueRaw));
  }
  return root;
}

function ensureTomlTable(root: Record<string, unknown>, path: string): Record<string, unknown> {
  const parts = path.split(".").map((p) => p.trim()).filter(Boolean);
  let cur: Record<string, unknown> = root;
  for (const part of parts) {
    const next = cur[part];
    if (!next || typeof next !== "object" || Array.isArray(next)) {
      cur[part] = {};
    }
    cur = cur[part] as Record<string, unknown>;
  }
  return cur;
}

function pushTomlArrayTable(root: Record<string, unknown>, path: string): Record<string, unknown> {
  const parts = path.split(".").map((p) => p.trim()).filter(Boolean);
  let cur: Record<string, unknown> = root;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const part = parts[i]!;
    if (!cur[part] || typeof cur[part] !== "object") cur[part] = {};
    cur = cur[part] as Record<string, unknown>;
  }
  const last = parts[parts.length - 1]!;
  if (!Array.isArray(cur[last])) cur[last] = [];
  const arr = cur[last] as unknown[];
  const table: Record<string, unknown> = {};
  arr.push(table);
  return table;
}

function setTomlKey(target: Record<string, unknown>, key: string, value: unknown) {
  if (key.includes(".")) {
    const parts = key.split(".");
    let cur = target;
    for (let i = 0; i < parts.length - 1; i += 1) {
      const part = parts[i]!.trim();
      if (!cur[part] || typeof cur[part] !== "object") cur[part] = {};
      cur = cur[part] as Record<string, unknown>;
    }
    cur[parts[parts.length - 1]!.trim()] = value;
    return;
  }
  target[key] = value;
}

function parseTomlValue(raw: string): unknown {
  const t = raw.trim();
  if (t === "true") return true;
  if (t === "false") return false;
  if (/^".*"$/.test(t)) return JSON.parse(t);
  if (/^'.*'$/.test(t)) return t.slice(1, -1);
  if (/^\[.*\]$/.test(t)) {
    // simple array
    const inner = t.slice(1, -1).trim();
    if (!inner) return [];
    return splitTomlArray(inner).map(parseTomlValue);
  }
  if (/^-?\d+$/.test(t)) return Number(t);
  if (/^-?\d+\.\d+$/.test(t)) return Number(t);
  return t;
}

function splitTomlArray(inner: string): string[] {
  const parts: string[] = [];
  let cur = "";
  let inStr: '"' | "'" | null = null;
  for (let i = 0; i < inner.length; i += 1) {
    const ch = inner[i]!;
    if (inStr) {
      cur += ch;
      if (ch === inStr && inner[i - 1] !== "\\") inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inStr = ch;
      cur += ch;
      continue;
    }
    if (ch === ",") {
      parts.push(cur.trim());
      cur = "";
      continue;
    }
    cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

function toToml(value: unknown): string {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("JSON → TOML 需要根对象");
  }
  const lines: string[] = [];
  const writeTable = (obj: Record<string, unknown>, path: string) => {
    const scalars: [string, unknown][] = [];
    const tables: [string, Record<string, unknown>][] = [];
    const arraysOfTables: [string, Record<string, unknown>[]][] = [];
    for (const [key, nested] of Object.entries(obj)) {
      if (Array.isArray(nested) && nested.every((item) => item && typeof item === "object" && !Array.isArray(item))) {
        arraysOfTables.push([key, nested as Record<string, unknown>[]]);
      } else if (nested && typeof nested === "object" && !Array.isArray(nested)) {
        tables.push([key, nested as Record<string, unknown>]);
      } else {
        scalars.push([key, nested]);
      }
    }
    if (path) {
      lines.push("");
      lines.push(`[${path}]`);
    }
    for (const [key, nested] of scalars) {
      lines.push(`${key} = ${formatTomlScalar(nested)}`);
    }
    for (const [key, nested] of tables) {
      writeTable(nested, path ? `${path}.${key}` : key);
    }
    for (const [key, arr] of arraysOfTables) {
      for (const item of arr) {
        lines.push("");
        lines.push(`[[${path ? `${path}.${key}` : key}]]`);
        for (const [k, v] of Object.entries(item)) {
          if (v && typeof v === "object") {
            // flatten one level only
            lines.push(`${k} = ${formatTomlScalar(v)}`);
          } else {
            lines.push(`${k} = ${formatTomlScalar(v)}`);
          }
        }
      }
    }
  };
  writeTable(value as Record<string, unknown>, "");
  return lines.join("\n").trim() + "\n";
}

function formatTomlScalar(value: unknown): string {
  if (value === null || value === undefined) return '""';
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return `[${value.map(formatTomlScalar).join(", ")}]`;
  return JSON.stringify(JSON.stringify(value));
}

// ---- Hash (pure JS) ----

function toHalfWidth(text: string) {
  return text.replace(/[\u3000\uFF01-\uFF5E]/g, (ch) => {
    if (ch === "\u3000") return " ";
    return String.fromCharCode(ch.charCodeAt(0) - 0xfee0);
  });
}

function toFullWidth(text: string) {
  return text.replace(/[\u0020\u0021-\u007E]/g, (ch) => {
    if (ch === " ") return "\u3000";
    return String.fromCharCode(ch.charCodeAt(0) + 0xfee0);
  });
}

function addCjkSpacing(text: string) {
  return text
    .replace(/([\u3400-\u9FFF\uF900-\uFAFF])([A-Za-z0-9])/g, "$1 $2")
    .replace(/([A-Za-z0-9])([\u3400-\u9FFF\uF900-\uFAFF])/g, "$1 $2");
}

function stripHtmlTags(text: string) {
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function extractByRegex(text: string, re: RegExp) {
  const out: string[] = [];
  const seen = new Set<string>();
  const flags = re.flags.includes("g") ? re.flags : `${re.flags}g`;
  const matcher = new RegExp(re.source, flags);
  let match: RegExpExecArray | null;
  while ((match = matcher.exec(text))) {
    const value = match[0];
    if (seen.has(value)) continue;
    seen.add(value);
    out.push(value);
  }
  return out;
}

function md5Hex(text: string): string {
  return bytesToHex(md5(utf8Bytes(text)));
}

function sha1Hex(text: string): string {
  return bytesToHex(sha1(utf8Bytes(text)));
}

function sha256Hex(text: string): string {
  return bytesToHex(sha256(utf8Bytes(text)));
}

function utf8Bytes(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

function bytesToHex(bytes: Uint8Array | number[]): string {
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function md5(bytes: Uint8Array): number[] {
  const rotateLeft = (x: number, n: number) => (x << n) | (x >>> (32 - n));
  const add = (a: number, b: number) => (a + b) >>> 0;

  const s = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];
  const K = new Array<number>(64);
  for (let i = 0; i < 64; i += 1) {
    K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) >>> 0;
  }

  const bitLen = bytes.length * 8;
  // correct: message + 1 bit + zeros to 56 mod 64, then 8 byte length
  let total = bytes.length + 1;
  while (total % 64 !== 56) total += 1;
  total += 8;
  const buf = new Uint8Array(total);
  buf.set(bytes);
  buf[bytes.length] = 0x80;
  const view = new DataView(buf.buffer);
  view.setUint32(total - 8, bitLen >>> 0, true);
  view.setUint32(total - 4, Math.floor(bitLen / 0x100000000), true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  for (let offset = 0; offset < total; offset += 64) {
    const M = new Array<number>(16);
    for (let j = 0; j < 16; j += 1) M[j] = view.getUint32(offset + j * 4, true);
    let A = a0, B = b0, C = c0, D = d0;
    for (let i = 0; i < 64; i += 1) {
      let F: number;
      let g: number;
      if (i < 16) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }
      F = add(add(F, A), add(K[i]!, M[g]!));
      A = D;
      D = C;
      C = B;
      B = add(B, rotateLeft(F >>> 0, s[i]!));
    }
    a0 = add(a0, A);
    b0 = add(b0, B);
    c0 = add(c0, C);
    d0 = add(d0, D);
  }

  const out = new Uint8Array(16);
  const outView = new DataView(out.buffer);
  outView.setUint32(0, a0, true);
  outView.setUint32(4, b0, true);
  outView.setUint32(8, c0, true);
  outView.setUint32(12, d0, true);
  return [...out];
}

function sha1(bytes: Uint8Array): number[] {
  const words: number[] = [];
  for (let i = 0; i < bytes.length; i += 1) {
    words[i >> 2] = (words[i >> 2] || 0) | (bytes[i]! << (24 - (i % 4) * 8));
  }
  const bitLen = bytes.length * 8;
  words[bytes.length >> 2] |= 0x80 << (24 - (bytes.length % 4) * 8);
  words[(((bytes.length + 8) >> 6) + 1) * 16 - 1] = bitLen;

  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;
  const w = new Array<number>(80);

  for (let i = 0; i < words.length; i += 16) {
    for (let t = 0; t < 16; t += 1) w[t] = words[i + t] | 0;
    for (let t = 16; t < 80; t += 1) {
      const n = w[t - 3]! ^ w[t - 8]! ^ w[t - 14]! ^ w[t - 16]!;
      w[t] = (n << 1) | (n >>> 31);
    }
    let a = h0, b = h1, c = h2, d = h3, e = h4;
    for (let t = 0; t < 80; t += 1) {
      let f: number, k: number;
      if (t < 20) {
        f = (b & c) | (~b & d);
        k = 0x5a827999;
      } else if (t < 40) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (t < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }
      const temp = (((a << 5) | (a >>> 27)) + f + e + k + (w[t] | 0)) | 0;
      e = d;
      d = c;
      c = (b << 30) | (b >>> 2);
      b = a;
      a = temp;
    }
    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0;
  }

  const out = new Uint8Array(20);
  const view = new DataView(out.buffer);
  view.setUint32(0, h0);
  view.setUint32(4, h1);
  view.setUint32(8, h2);
  view.setUint32(12, h3);
  view.setUint32(16, h4);
  return [...out];
}

function sha256(bytes: Uint8Array): number[] {
  const K = [
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2,
  ];
  let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
  let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;

  const bitLen = bytes.length * 8;
  const withPad = bytes.length + 1;
  let total = withPad + 8;
  while (total % 64 !== 0) total += 1;
  const buf = new Uint8Array(total);
  buf.set(bytes);
  buf[bytes.length] = 0x80;
  const view = new DataView(buf.buffer);
  // high bits then low (big-endian 64-bit length)
  view.setUint32(total - 8, Math.floor(bitLen / 0x100000000));
  view.setUint32(total - 4, bitLen >>> 0);

  const w = new Array<number>(64);
  for (let i = 0; i < total; i += 64) {
    for (let t = 0; t < 16; t += 1) w[t] = view.getUint32(i + t * 4);
    for (let t = 16; t < 64; t += 1) {
      const s0 = rotr(w[t - 15]!, 7) ^ rotr(w[t - 15]!, 18) ^ (w[t - 15]! >>> 3);
      const s1 = rotr(w[t - 2]!, 17) ^ rotr(w[t - 2]!, 19) ^ (w[t - 2]! >>> 10);
      w[t] = (w[t - 16]! + s0 + w[t - 7]! + s1) | 0;
    }
    let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
    for (let t = 0; t < 64; t += 1) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[t]! + w[t]!) | 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;
      h = g; g = f; f = e; e = (d + temp1) | 0; d = c; c = b; b = a; a = (temp1 + temp2) | 0;
    }
    h0 = (h0 + a) | 0; h1 = (h1 + b) | 0; h2 = (h2 + c) | 0; h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0; h5 = (h5 + f) | 0; h6 = (h6 + g) | 0; h7 = (h7 + h) | 0;
  }
  const out = new Uint8Array(32);
  const outView = new DataView(out.buffer);
  outView.setUint32(0, h0); outView.setUint32(4, h1); outView.setUint32(8, h2); outView.setUint32(12, h3);
  outView.setUint32(16, h4); outView.setUint32(20, h5); outView.setUint32(24, h6); outView.setUint32(28, h7);
  return [...out];
}

function rotr(n: number, x: number): number {
  return (n >>> x) | (n << (32 - x));
}


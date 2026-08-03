// Builds index.html from content/*.md + template/page.html.
// Run:  node build.mjs          once
//       node build.mjs --watch  rebuild whenever a content file changes
import { readFileSync, writeFileSync, readdirSync, watch, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const CONTENT = join(root, "content");

/* ---------- tiny frontmatter + markdown ---------- */
function frontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { meta: {}, body: src.trim() };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: src.slice(m[0].length).trim() };
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const inline = (s) =>
  esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");

// Blocks: paragraph, "> note", and | tables | (rendered as the key/description grid).
// A block may open with [touch] or [desktop] to show only on that kind of device.
function blocks(body) {
  const out = [];
  for (const chunk of body.split(/\r?\n\s*\r?\n/)) {
    let lines = chunk.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (!lines.length) continue;

    let only = "";
    const mk = lines[0].match(/^(>\s*)?\[(touch|desktop)\]\s*/i);
    if (mk) {
      only = ` only-${mk[2].toLowerCase()}`;
      lines[0] = (mk[1] || "") + lines[0].slice(mk[0].length);
    }

    if (lines[0].startsWith("|")) {
      const rows = lines
        .filter((l) => l.startsWith("|") && !/^\|[\s:|-]+\|$/.test(l))
        .slice(1)
        .map((l) => l.replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
      out.push(
        `<div class="keys${only}">` +
          rows.map(([k, v]) => `<kbd>${inline(k)}</kbd><p>${inline(v)}</p>`).join("") +
          `</div>`,
      );
    } else if (lines[0].startsWith(">")) {
      out.push(`<p class="note${only}">${inline(lines.map((l) => l.replace(/^>\s?/, "")).join(" "))}</p>`);
    } else {
      out.push(`<p class="say${only}">${inline(lines.join(" "))}</p>`);
    }
  }
  return out.join("\n      ");
}

/* ---------- portfolio table -> nested tree ---------- */
function portfolio(src) {
  const rows = src
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.startsWith("|") && !/^\|[\s:|-]+\|$/.test(l))
    .map((l) => l.replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
  rows.shift(); // header

  const num = (v) => (v === "" ? null : Number(v.replace(/\s/g, "").replace(",", ".")));
  const tree = [];
  const stack = [{ depth: -1, node: { children: tree } }];

  for (const [rawName, weight, sym, price, value, shared] of rows) {
    const depth = (rawName.match(/^[-—>]+/) || [""])[0].length;
    const name = rawName.replace(/^[-—>]+\s*/, "");
    const node = { name };
    if (num(weight) !== null) node.weight = num(weight);
    if (/^y/i.test(shared || "")) node.shared = true;
    if (sym) { node.sym = sym; node.price = num(price); node.value = num(value); }

    while (stack[stack.length - 1].depth >= depth) stack.pop();
    const parent = stack[stack.length - 1].node;
    if (!parent.children) parent.children = [];
    parent.children.push(node);
    stack.push({ depth, node });
  }
  // a node that gained children is a group, so drop any stray leaf fields
  (function clean(ns) {
    for (const n of ns) if (n.children) { delete n.sym; delete n.price; delete n.value; clean(n.children); }
  })(tree);
  return tree;
}

/* ---------- screens ---------- */
const PROMPT = `
        <div class="prompt"><kbd>{{prompt_kbd}}</kbd><span>{{prompt}}</span></div>`;

const WIDGET = {
  tree: `
      <div class="widget">${PROMPT}
        <div class="wbody">
        <div class="crumb" id="crumb"></div>
        <div class="grid" id="tgrid"></div>
        <div class="foot"><span id="tsum"></span><span class="tnum" id="tval"></span></div>
        </div>
        <p class="note" id="tnote"></p>
      </div>`,
  plan: `
      <div class="widget on">${PROMPT}
        <div class="wbody">
        <div class="amt" id="amtbox">
          <label for="amount">{{label_invest}}</label>
          <span class="val" id="amtval">
            <input id="amount" type="text" inputmode="numeric" value="{{amount}}" aria-label="{{label_invest}}">
            <span class="cur">{{currency}}</span>
          </span>
        </div>
        <div class="lim">
          <b id="limlabel"></b>
          <div class="track" id="limtrack" tabindex="0" role="slider"
               aria-label="{{label_orders}}" aria-valuemin="1" aria-valuemax="{{max_orders}}"><i></i><u></u></div>
        </div>
        <div id="orders"></div>
        <div class="tot"><span id="totleft"></span><span class="tnum" id="totright"></span></div>
        </div>
      </div>`,
};

const ARROW = `<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 1v9.2l3.1-3.1 1.1 1.1L8 12.6 3.8 8.2l1.1-1.1L8 10.2V1zM2 13h12v1.5H2V13z"/></svg>`;

function build() {
  const site = frontmatter(readFileSync(join(CONTENT, "site.md"), "utf8")).meta;
  const tree = portfolio(readFileSync(join(CONTENT, "portfolio.md"), "utf8"));

  // The icon is inlined as a data URI, which keeps index.html the only file to publish.
  let iconURI = "";
  if (site.icon) {
    const file = join(root, site.icon);
    if (existsSync(file)) {
      const type = site.icon.endsWith(".svg") ? "image/svg+xml" : "image/png";
      iconURI = `data:${type};base64,${readFileSync(file).toString("base64")}`;
    } else {
      console.warn(`icon not found: ${site.icon}`);
    }
  }

  const files = readdirSync(CONTENT)
    .filter((f) => /^\d+-.*\.md$/.test(f))
    .sort();

  const screens = [];
  const html = files.map((f) => {
    const { meta, body } = frontmatter(readFileSync(join(CONTENT, f), "utf8"));
    const id = meta.id || f.replace(/^\d+-|\.md$/g, "");

    const parseHints = (v) =>
      (v || "")
        .split("|")
        .map((h) => h.trim())
        .filter(Boolean)
        .map((h) => {
          const [key, ...rest] = h.split("=");
          return { key: key.trim(), label: rest.join("=").trim() };
        });

    screens.push({
      id,
      hints: parseHints(meta.hints),
      hints_active: parseHints(meta.hints_active),
      hints_touch: parseHints(meta.hints_touch),
      prompt: meta.prompt || "",
      prompt_active: meta.prompt_active || "",
      prompt_touch: meta.prompt_touch || "",
      prompt_kbd: meta.prompt_kbd || "",
      prompt_kbd_touch: meta.prompt_kbd_touch || "",
      live: /^y/i.test(meta.live || ""),
      widget: !!meta.widget,
      ...Object.fromEntries(
        Object.entries(meta).filter(([k]) => k.startsWith("label_") || k.startsWith("note_")),
      ),
    });

    let inner = "";
    if (meta.logo) {
      const badge = iconURI
        ? `<img class="icon" src="${iconURI}" alt="${esc(meta.logo)} app icon" width="66" height="66">`
        : `<div class="glyph">${esc(meta.logo[0])}</div>`;
      inner += `<div class="mark">${badge}` +
               `<div class="wm"><b>${esc(meta.logo)}</b>` +
               `<span>${esc(meta.tagline || "")}</span></div></div>\n      `;
    }
    if (meta.eyebrow) inner += `<p class="no">${inline(meta.eyebrow)}</p>\n      `;
    if (meta.heading) {
      inner += meta.logo
        ? `<h1>${inline(meta.heading)}</h1>\n      `
        : `<h2>${inline(meta.heading)}</h2>\n      `;
    }
    inner += blocks(body);

    if (meta.widget) {
      inner += WIDGET[meta.widget]
        .replace(/\{\{label_invest\}\}/g, esc(meta.label_invest || ""))
        .replace(/\{\{amount\}\}/g, esc(site.default_amount || "1000"))
        .replace(/\{\{currency\}\}/g, esc(site.currency || "€"))
        .replace(/\{\{label_orders\}\}/g, esc(meta.label_orders || "orders"))
        .replace(/\{\{max_orders\}\}/g, esc(site.max_orders || "6"))
        .replace(/\{\{prompt\}\}/g, esc(meta.prompt || ""))
        .replace(/\{\{prompt_kbd\}\}/g, esc(meta.prompt_kbd || "Return"));
    }
    if (meta.button) {
      const off = !meta.button_href || meta.button_href === "#";
      inner += `\n      <a class="btn" id="dl" href="${esc(meta.button_href || "#")}"` +
               `${off ? ` aria-disabled="true"` : ""}>${ARROW} ${esc(meta.button)}</a>`;
      if (meta.button_note) inner += `\n      <p class="req">${inline(meta.button_note)}</p>`;
    }

    return `  <section class="screen" data-screen="${id}">\n    <div class="in">\n      ${inner}\n    </div>\n  </section>`;
  }).join("\n\n");

  const data = {
    currency: site.currency || "€",
    currency_code: (site.currency_code || "EUR").toUpperCase(),
    follow_visitor: !/^n/i.test(site.follow_visitor || "yes"),
    locale: site.locale || "de-DE",
    max_orders: Number(site.max_orders || 6),
    default_orders: Number(site.default_orders || 4),
    default_amount: Number(site.default_amount || 1000),
    portfolio: tree,
    screens,
  };

  const page = readFileSync(join(root, "template", "page.html"), "utf8")
    .replace("{{FAVICON}}", iconURI
      ? `<link rel="icon" href="${iconURI}">\n<link rel="apple-touch-icon" href="${iconURI}">`
      : "")
    .replace("{{TITLE}}", esc(site.title || "Cola"))
    .replace("{{DESCRIPTION}}", esc(site.description || ""))
    .replace("{{SCREENS}}", html)
    .replace("{{DATA}}", JSON.stringify(data));

  writeFileSync(join(root, "index.html"), page);
  const leaves = (function count(ns){ return ns.reduce((s,n)=> s + (n.children ? count(n.children) : 1), 0); })(tree);
  const kb = (n) => (n / 1024).toFixed(0) + " kB";
  console.log(`built index.html — ${files.length} screens, ${leaves} holdings` +
    (iconURI ? `, icon inlined (${kb(iconURI.length)})` : ", no icon") +
    ` — ${kb(page.length)} total`);
}

build();
if (process.argv.includes("--watch")) {
  console.log("watching content/ …");
  let timer;
  watch(CONTENT, () => { clearTimeout(timer); timer = setTimeout(() => { try { build(); } catch (e) { console.error(e.message); } }, 80); });
}

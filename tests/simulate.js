// Simulated end-to-end test: runs the app's real script against a fake in-memory GitHub API.
// Usage (from repo root): node tests/simulate.js      Requires Node 18+. No dependencies.
// Not covered: screenshot upload/canvas, real GitHub, real browser rendering, CSS/layout.
const fs = require("fs"), vm = require("vm"), path = require("path");
const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const code = html.match(/<script>([\s\S]*)<\/script>/)[1];

const store = {}, files = {}; let shaN = 1;
const mk = () => ({ innerHTML: "", style: {}, dataset: {}, value: "", classList: { toggle() {} }, remove() {}, appendChild() {}, isConnected: true, click() {}, textContent: "", disabled: false });
const els = {};
const doc = { hidden: false, body: { appendChild() {} }, addEventListener() {}, createElement: () => mk(),
  querySelector: s => (s === "#sheet" || s === "#drop") ? null : (els[s] || (els[s] = mk())) };
const resp = (status, body, raw) => ({ ok: status >= 200 && status < 300, status, json: async () => body, text: async () => raw ?? JSON.stringify(body), arrayBuffer: async () => new ArrayBuffer(1) });

async function fetch(url, o = {}) {
  const m = o.method || "GET", p = new URL(url).pathname;
  if (o.headers.Authorization !== "Bearer tok") return resp(401, {});
  if (/^\/repos\/own\/data$/.test(p)) return resp(200, { private: true, permissions: { push: true } });
  const r = p.match(/^\/repos\/own\/data\/contents\/(.*)$/);
  if (r) {
    const f = r[1];
    if (m === "GET") {
      if (f === "pages") { const l = Object.keys(files).filter(k => k.startsWith("pages/")).map(k => ({ type: "file", name: k.slice(6), sha: files[k].sha })); return l.length ? resp(200, l) : resp(404, {}); }
      if (!files[f]) return resp(404, {});
      return o.headers.Accept.includes("raw") ? resp(200, {}, files[f].text) : resp(200, { sha: files[f].sha });
    }
    if (m === "PUT") { const b = JSON.parse(o.body), ex = files[f];
      if (ex && b.sha !== ex.sha) return resp(b.sha ? 409 : 422, {});
      const sha = "s" + (shaN++); files[f] = { sha, text: Buffer.from(b.content, "base64").toString("utf8") }; return resp(200, { content: { sha } }); }
    if (m === "DELETE") { const b = JSON.parse(o.body); if (!files[f] || files[f].sha !== b.sha) return resp(409, {}); delete files[f]; return resp(200, {}); }
  }
  return resp(404, {});
}
const ctx = { document: doc, window: { addEventListener() {} },
  localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = v; }, removeItem: k => { delete store[k]; } },
  fetch, console, TextEncoder, btoa, URL, Blob, FileReader: class {}, Image: class {}, setTimeout, clearTimeout };
vm.createContext(ctx);
vm.runInContext(code + "\n;globalThis.__t={get entries(){return entries},get cfg(){return cfg},get cache(){return cache},connect,refresh,saveE,edit,del,get loaded(){return loaded},get stat(){return stat}}", ctx);
const T = ctx.__t; let failed = 0;
const A = (c, m) => { if (!c) { failed++; console.log("FAIL", m); } else console.log("ok  ", m); };
const fill = v => { for (const k in v) els["#f_" + k] = { value: v[k] }; };

(async () => {
  A(doc.querySelector("#app").innerHTML.includes("Connect your private"), "first run shows connect form");
  els["#fo"] = { value: "own" }; els["#fr"] = { value: "data" }; els["#ft"] = { value: "tok" }; els["#fc"] = mk();
  await T.connect(); await new Promise(r => setTimeout(r, 50));
  A(T.cfg && T.cfg.o === "own", "connect stores config");
  A(T.loaded && T.entries.length === 0 && T.stat.startsWith("Synced"), "empty repo (404 on pages/) syncs as empty");
  const v = { title: "Averaged down", date: "2026-11-09", instrument: "NQ", cost: "-3R", did: "Added lots ünïcode ✓", knew: "Limit 20", trigger: "Need", fix: "Stop" };
  T.edit(); fill(v); els["#sv"] = mk(); await T.saveE();
  A(Object.keys(files).some(k => k.startsWith("pages/")), "new page written to repo");
  A(T.entries.length === 1 && T.entries[0].did.includes("ünïcode ✓"), "unicode survives round trip");
  const id = T.entries[0].id;
  T.edit(id); fill({ ...v, title: "Edited" }); await T.saveE();
  A(T.entries.length === 1 && T.entries[0].title === "Edited", "edit overwrites using the stored sha");
  files["pages/" + id + ".json"].sha = "changed-elsewhere";
  T.edit(id); fill({ ...v, title: "Conflict" }); await T.saveE();
  A(T.entries[0].title === "Conflict", "sha conflict (another device) recovers via refetch");
  for (const k of Object.keys(T.cache)) delete T.cache[k];
  await T.refresh();
  A(T.entries.length === 1 && T.entries[0].title === "Conflict", "fresh device pulls pages from repo");
  const b = mk(); await T.del(id, b); await T.del(id, b);
  A(Object.keys(files).length === 0 && T.entries.length === 0, "delete (two taps) removes file and entry");
  console.log(failed ? failed + " FAILED" : "ALL PASSED"); process.exitCode = failed ? 1 : 0;
})();

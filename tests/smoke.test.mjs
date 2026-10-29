import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { Script } from "node:vm";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");

const sources = [
 ["multimetro", "multimetro_ficha_v2"],
 ["montagem", "adc_lab02_v3"],
 ["inicializacao", "adc_lab03_v2"],
 ["aula4-slides", null],
 ["aula4-relatorio", "arquitetura4_relatorio_v1"]
];

test("portal tem entrada, tema, app e referências acessíveis", () => {
 const page = read("index.html");
 assert.match(page, /lang="pt-BR"/);
 assert.match(page, /name="viewport"/);
 assert.match(page, /id="lesson-nav"/);
 assert.match(page, /id="lesson-frame"/);
 assert.match(page, /id="backup-export"/);
 assert.match(page, /id="backup-import"/);
 assert.match(page, /assets\/site\.css/);
 assert.match(page, /assets\/app\.js/);
 assert.ok(read("assets/site.css").includes("@media(min-width:640px)"));
 assert.ok(read("assets/lesson-theme.css").includes("data-module"));
});

test("todas as aulas foram migradas e recebem o tema/ponte de integração", () => {
 for (const [id, storage] of sources) {
  const path = "aulas/" + id + "/index.html";
  assert.ok(existsSync(new URL("../" + path, import.meta.url)), path);
  const html = read(path);
  assert.match(html, /<!doctype html>/i);
  assert.match(html, /name="viewport"/);
  assert.ok(html.includes('data-module="' + id + '"'), id);
  assert.ok(html.includes('../../assets/lesson-theme.css'), id);
  assert.ok(html.includes("adc:resize"), id);
  if (storage) assert.ok(html.includes(storage), "chave ausente: " + id);
  const matches = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  assert.ok(matches.length>0);
  for (const [, attrs, body] of matches) {
   if (!/\bsrc\s*=/.test(attrs)) assert.doesNotThrow(() => new Script(body), "script inválido: " + id);
  }
 }
});

test("catálogo de rotas e lista de chaves cobrem as cinco entradas", () => {
 const app = read("assets/app.js");
 assert.doesNotThrow(() => new Script(app));
 for (const [id, storage] of sources) {
  assert.ok(app.includes('id:"' + id + '"'), "rota: " + id);
  assert.ok(app.includes('./aulas/' + id + '/index.html'), "destino: " + id);
  if (storage) assert.ok(app.includes('storage:"' + storage + '"'), "chave de backup: " + id);
 }
 assert.ok(app.includes("uenf-adc-backup-v1"));
 assert.ok(app.includes("location.hash"));
 assert.ok(app.includes("event.origin!==location.origin"));
});

test("slides usam imagens HTTPS explícitas e fallback para ícones", () => {
 const slides = read("aulas/aula4-slides/index.html");
 for(const image of ["img_hd_interno.webp","img_nand.jpg","frame.png"]){
  assert.ok(slides.includes("https://raw.githubusercontent.com/Zadoque/aula4/main/"+image));
 }
 assert.ok(slides.includes("if (window.lucide) lucide.createIcons()"));
});

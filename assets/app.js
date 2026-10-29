"use strict";
/* Navegação, status e backup do portal. As fichas mantêm seu próprio JS e suas chaves originais. */
const LESSONS = Object.freeze([
 {id:"multimetro",title:"Laboratório 1 — Multímetro",short:"Lab 1 · Multímetro",category:"Atividade prática",icon:"⚡",tag:"Medições",description:"Meça tensões de uma fonte ATX, registre resultados, compare tolerâncias e gere o relatório em LaTeX.",src:"./aulas/multimetro/index.html",storage:"multimetro_ficha_v2"},
 {id:"montagem",title:"Laboratório 2 — Montagem segura",short:"Lab 2 · Montagem",category:"Atividade prática",icon:"🛠️",tag:"Hardware",description:"Monte os componentes de um computador com checkpoints, registros fotográficos e relatório final.",src:"./aulas/montagem/index.html",storage:"adc_lab02_v3"},
 {id:"inicializacao",title:"Laboratório 3 — Inicialização",short:"Lab 3 · Boot",category:"Atividade prática",icon:"💻",tag:"Inicialização",description:"Documente componentes e procedimentos, investigue a sequência de boot e gere a ficha em LaTeX.",src:"./aulas/inicializacao/index.html",storage:"adc_lab03_v2"},
 {id:"aula4-slides",title:"Aula 4 — Armazenamento e SO",short:"Aula 4 · Conteúdo",category:"Apresentação teórica",icon:"📚",tag:"Slides",description:"Explore HD, SSD, BIOS/UEFI, particionamento, bootloaders e critérios de escolha de sistema operacional.",src:"./aulas/aula4-slides/index.html",storage:null},
 {id:"aula4-relatorio",title:"Aula 4 — Relatório prático",short:"Aula 4 · Relatório",category:"Atividade prática",icon:"📝",tag:"HDD · BIOS · SO",description:"Registre testes com HDD, informações de BIOS, CPU e temperaturas e escolha do sistema operacional.",src:"./aulas/aula4-relatorio/index.html",storage:"arquitetura4_relatorio_v1"}
]);
const STORAGE_KEYS = Object.freeze(LESSONS.map(l=>l.storage).filter(Boolean));
const byId=id=>document.getElementById(id);
const frame=byId("lesson-frame");
let currentId=null;
let messageTimer=0;
let toastTimer=0;
const getSaved=key=>{
 if(!key)return null;
 try{return localStorage.getItem(key)!==null}catch{return false}
};
function notify(text){
 const el=byId("toast");el.textContent=text;el.classList.add("visible");
 clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("visible"),4600);
}
function createElement(tag,className,text){
 const el=document.createElement(tag);if(className)el.className=className;
 if(text!==undefined)el.textContent=text;
 return el;
}
function stateText(lesson){
 if(!lesson.storage)return "Apresentação";
 return getSaved(lesson.storage)?"Dados salvos":"Não iniciado";
}
function renderNav(){
 const nav=byId("lesson-nav");nav.replaceChildren();
 const home=createElement("a","nav-link","Início");home.href="#/";home.dataset.route="home";
 home.prepend(createElement("span","nav-icon","⌂"));nav.append(home);
 for(const lesson of LESSONS){
  const link=createElement("a","nav-link",lesson.short);link.href="#/"+lesson.id;link.dataset.route=lesson.id;
  link.prepend(createElement("span","nav-icon",lesson.icon));nav.append(link);
 }
}
function renderCards(){
 const host=byId("lesson-cards");host.replaceChildren();
 for(const lesson of LESSONS){
  const a=createElement("a","lesson-card");a.href="#/"+lesson.id;
  const top=createElement("div","lesson-card-top");
  top.append(createElement("span","lesson-card-icon",lesson.icon),createElement("span","tag",lesson.tag));
  const h=createElement("h3","",lesson.title),p=createElement("p","",lesson.description);
  const bottom=createElement("div","lesson-card-bottom");
  const state=createElement("span","saved-state",stateText(lesson));
  if(getSaved(lesson.storage))state.classList.add("saved");
  state.dataset.stateFor=lesson.id;
  bottom.append(state,createElement("span","card-action","Abrir aula →"));
  a.append(top,h,p,bottom);host.append(a);
 }
}
function updateStates(){
 for(const lesson of LESSONS){
  const state=document.querySelector('[data-state-for="'+lesson.id+'"]');
  if(state){state.textContent=stateText(lesson);state.classList.toggle("saved",Boolean(getSaved(lesson.storage)))}
 }
 const lesson=LESSONS.find(l=>l.id===currentId);
 if(lesson){
  const status=byId("lesson-state");
  status.textContent=lesson.storage?(getSaved(lesson.storage)?"Respostas salvas neste navegador":"Ainda sem respostas salvas"):"Apresentação sem formulário";
  status.classList.toggle("saved",Boolean(getSaved(lesson.storage)));
 }
}
function route(){
 const hash=decodeURIComponent(location.hash.replace(/^#\/?/,"")).split("?")[0];
 const lesson=LESSONS.find(l=>l.id===hash);
 const id=lesson?lesson.id:null;
 if(id!==currentId){
  currentId=id;
  if(lesson){
   byId("lesson-category").textContent=lesson.category;
   byId("lesson-title").textContent=lesson.title;
   byId("lesson-description").textContent=lesson.description;
   byId("lesson-open").href=lesson.src;
   frame.title=lesson.title;
   frame.style.height=lesson.id==="inicializacao"?"min(78vh, 760px)":"680px";
   frame.src=lesson.src;
  }else{
   frame.removeAttribute("src");
  }
 }
 byId("home-view").hidden=Boolean(lesson);
 byId("lesson-view").hidden=!lesson;
 for(const link of document.querySelectorAll("[data-route]")){
  const selected=link.dataset.route===(id||"home");
  link.classList.toggle("active",selected);
  if(selected)link.setAttribute("aria-current","page");else link.removeAttribute("aria-current");
 }
 document.title=lesson?lesson.title+" | Arquitetura de Computadores — UENF":"Arquitetura de Computadores | UENF";
 updateStates();
 window.scrollTo({top:0,behavior:"instant"});
}
function exportBackup(){
 try{
  const data={};
  for(const key of STORAGE_KEYS)data[key]=localStorage.getItem(key);
  const payload={schema:"uenf-adc-backup-v1",exportedAt:new Date().toISOString(),source:"arquitetura-de-computadores",data};
  const content=JSON.stringify(payload,null,2);
  const blob=new Blob([content],{type:"application/json;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;a.download="arquitetura-de-computadores-backup-"+new Date().toISOString().slice(0,10)+".json";
  document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),2000);
  notify("Backup JSON gerado. Guarde o arquivo com segurança.");
 }catch(err){notify("Não foi possível exportar: verifique se o armazenamento do navegador está habilitado.");console.error(err)}
}
async function importBackup(file){
 if(!file)return;
 if(file.size>20*1024*1024){notify("Arquivo grande demais (limite de 20 MB).");return}
 try{
  const payload=JSON.parse(await file.text());
  if(payload?.schema!=="uenf-adc-backup-v1"||!payload.data||typeof payload.data!=="object"||Array.isArray(payload.data))throw Error("Formato de backup inválido");
  for(const key of STORAGE_KEYS)if(!(key in payload.data)||!(payload.data[key]===null||typeof payload.data[key]==="string"))throw Error("Chave ausente ou valor inválido: "+key);
  if(!window.confirm("Importar o backup vai SUBSTITUIR os dados salvos das quatro fichas neste navegador. Deseja continuar?"))return;
  const old={};for(const key of STORAGE_KEYS)old[key]=localStorage.getItem(key);
  try{
   for(const key of STORAGE_KEYS){
    if(payload.data[key]===null)localStorage.removeItem(key);
    else localStorage.setItem(key,payload.data[key]);
   }
  }catch(err){
   for(const key of STORAGE_KEYS){try{if(old[key]===null)localStorage.removeItem(key);else localStorage.setItem(key,old[key])}catch{}}
   throw Error("Armazenamento cheio ou indisponível; dados anteriores restaurados quando possível");
  }
  updateStates();
  if(currentId)frame.src=frame.src;
  notify("Backup importado. As aulas serão carregadas com os dados restaurados.");
 }catch(err){notify("Falha ao importar: "+err.message);console.error(err)}
}
window.addEventListener("hashchange",route);
window.addEventListener("message",event=>{
 if(event.origin!==location.origin||event.source!==frame.contentWindow||!event.data||typeof event.data!=="object")return;
 if(event.data.type==="adc:resize"&&currentId&&currentId!=="inicializacao"){
  const h=Number(event.data.height);
  if(Number.isFinite(h)&&h>0&&h<100000){
   const target=Math.max(440,Math.ceil(h)+3);
   const existing=parseInt(frame.style.height,10)||680;
   if(Math.abs(existing-target)>8)frame.style.height=target+"px";
  }
 }else if(event.data.type==="adc:progress"){
  clearTimeout(messageTimer);messageTimer=setTimeout(updateStates,160);
 }
});
byId("backup-export").addEventListener("click",exportBackup);
byId("backup-import").addEventListener("click",()=>byId("backup-file").click());
byId("backup-file").addEventListener("change",async event=>{await importBackup(event.target.files?.[0]);event.target.value=""});
frame.addEventListener("load",()=>setTimeout(updateStates,100));
window.addEventListener("storage",updateStates);
renderNav();renderCards();route();

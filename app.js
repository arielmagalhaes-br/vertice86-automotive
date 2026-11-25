/* =====================================================================
   CÓDIGO
   ===================================================================== */
(function(){
"use strict";
const $ = s => document.querySelector(s);
const clamp = (x,a=0,b=1) => Math.min(b, Math.max(a,x));
const zapUrl = "#contato-demo";

const body=document.body, trilha=$("#trilha"), palco=$("#palco"), video=$("#video"),
      abertura=$("#abertura"), dica=$("#dica"), carga=$("#carga"), svg=$("#linhas"),
      ulServ=$("#servicos"), fecho=$("#fecho"), marca=$("#marca");

/* ----- preenche textos ----- */
const zapIcone = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.95L2 22l5.2-1.5A9.9 9.9 0 1 0 12.04 2Zm5.8 14.05c-.25.7-1.45 1.33-2 1.4-.52.07-1.17.1-1.88-.12a17 17 0 0 1-1.7-.63c-3-1.3-4.94-4.33-5.1-4.53-.14-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37h.57c.18 0 .43-.07.67.52.25.6.85 2.07.92 2.22.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.32.38-.45.51-.15.15-.3.3-.13.6.17.3.78 1.28 1.67 2.07 1.15 1.02 2.12 1.34 2.42 1.5.3.15.47.12.65-.07.17-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.27.1 1.72.82 2.02.97.3.15.5.22.57.35.07.12.07.72-.17 1.4Z"/></svg>';
document.querySelectorAll("[data-zap]").forEach(a=>{ a.href = zapUrl; });
document.querySelectorAll(".fecho .botao").forEach(a=>{ a.innerHTML = zapIcone + "<span>Pedir orçamento no WhatsApp</span>"; });
$("#d-zap").innerHTML = zapIcone + "<span>WhatsApp</span>";
$("#f-enviar").innerHTML = zapIcone + "<span>Enviar pelo WhatsApp</span>";
const dialogo = $("#contato-demo");
function mostrarContato(titulo, mensagem, compartilhar = false){
  $("#demo-titulo").textContent = titulo;
  $("#demo-mensagem").textContent = mensagem;
  $("#demo-whatsapp").hidden = !compartilhar;
  if (!dialogo.open) dialogo.showModal();
}
document.querySelectorAll("[data-zap]").forEach(a=>a.addEventListener("click",e=>{
  e.preventDefault(); mostrarContato("WhatsApp demonstrativo", OFICINA.mensagemZap, true);
}));
for (const id of ["#d-ligar", "#b-ligar"]){
  const a=$(id); a.href="#contato-demo";
  a.addEventListener("click",e=>{e.preventDefault(); mostrarContato("Ligação demonstrativa", "Telefone fictício: " + OFICINA.telefoneExibicao + ". Nenhuma chamada será realizada.");});
}
$("#demo-fechar").addEventListener("click",()=>dialogo.close());
$("#demo-copiar").addEventListener("click",async()=>{
  try { await navigator.clipboard.writeText($("#demo-mensagem").textContent); $("#demo-retorno").textContent="Texto copiado."; }
  catch { $("#demo-retorno").textContent="Selecione o texto para copiá-lo manualmente."; }
});
dialogo.addEventListener("close",()=>{$("#demo-retorno").textContent=""; $("#demo-mensagem").textContent="";});
$("#d-instagram").textContent = OFICINA.instagram;
$("#d-instagram").href = OFICINA.instagramUrl;
$("#b-zap").innerHTML = zapIcone + "<span>Pedir orçamento</span>";
$("#d-telefone").textContent = OFICINA.telefoneExibicao;
$("#d-endereco").textContent = OFICINA.endereco;
$("#d-nota").textContent = OFICINA.notaGoogle;
$("#d-avaliacoes").textContent = "em " + OFICINA.avaliacoesGoogle + " avaliações simuladas (exemplo visual)";
$("#d-rota").href = OFICINA.rotaUrl;
$("#horario-curto").textContent = HORARIO_TEXTO;
$("#d-horario").textContent = HORARIO_TEXTO;
const selServ = $("#f-servico");
const fragmento = document.createDocumentFragment();
selServ.add(new Option("Escolha o serviço", ""));
for (const t of LISTA){
  const li=document.createElement("li"), botao=document.createElement("button");
  botao.type="button"; botao.className="chip"; botao.dataset.servico=t; botao.textContent=t;
  li.append(botao); fragmento.append(li); selServ.add(new Option(t,t));
}
$("#lista-servicos").append(fragmento);
selServ.add(new Option("Outro, ou não sei qual é o problema"));
$("#marcas-texto").textContent = MARCAS.join(", ") + " e outras marcas nacionais e importadas.";
$("#rod-nome").textContent = OFICINA.nome + " · " + OFICINA.endereco;
body.classList.add("com-previa");

/* ----- parte de baixo: mapa, horário, copiar, formulário ----- */
(function(){
  /* mapa só carrega quando chega perto (economiza dados no celular) */
  /* mapa: só carrega quando a pessoa toca (o Google não recebe nada antes disso) */
  $("#d-mapa-end").textContent = OFICINA.endereco || "";
  $("#d-waze").href = OFICINA.wazeUrl;
  $("#d-mapa-ver").addEventListener("click",()=>{
    const f=document.createElement("iframe");
    f.title="Mapa demonstrativo do Marco Zero, Recife"; f.referrerPolicy="no-referrer"; f.src=OFICINA.mapaSrc;
    $("#d-mapa-caixa").replaceChildren(f);
  });

  /* aberto agora / fechado agora, no horário de Recife */
  const DIAS=["domingo","segunda","terça","quarta","quinta","sexta","sábado"], MAPA_DIA={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};
  const st=$("#status"), stTxt=$("#status-texto");
  function atualizarStatus(){
    let d,min;
    try{
      const parts=new Intl.DateTimeFormat("en-US",{timeZone:"America/Recife",weekday:"short",hour:"numeric",minute:"numeric",hourCycle:"h23"}).formatToParts(new Date());
      const g=t=>parts.find(p=>p.type===t).value;
      d=MAPA_DIA[g("weekday")]; min=(+g("hour"))*60+(+g("minute"));
    }catch(e){ const n=new Date(); d=n.getDay(); min=n.getHours()*60+n.getMinutes(); }
    const hoje=HORARIO[d];
    let aberto=false, texto="";
    const h2=n=>n+"h";
    if (hoje && min>=hoje[0]*60 && min<hoje[1]*60){ aberto=true; texto="Aberto agora · fecha às "+h2(hoje[1]); }
    else if (hoje && min<hoje[0]*60){ texto="Fechado agora · abre hoje às "+h2(hoje[0]); }
    else {
      for(let i=1;i<=7;i++){ const dd=(d+i)%7, hh=HORARIO[dd];
        if(hh){ texto="Fechado agora · abre "+(i===1?"amanhã":DIAS[dd])+" às "+h2(hh[0]); break; } }
    }
    st.classList.toggle("status--aberto",aberto); stTxt.textContent=texto + " (horário simulado)";
  }
  atualizarStatus(); setInterval(atualizarStatus,60000);

  /* copiar endereço */
  const bt=$("#d-copiar"), rot=bt.textContent; let tm;
  bt.addEventListener("click",async()=>{
    let ok=false;
    try{ await navigator.clipboard.writeText(OFICINA.endereco); ok=true; }catch(e){
      const t=document.createElement("textarea"); t.value=OFICINA.endereco; t.style.position="fixed"; t.style.opacity="0"; document.body.appendChild(t);
      t.select(); try{ ok=document.execCommand("copy"); }catch(_){} t.remove();
    }
    bt.textContent = ok ? "Endereço copiado" : "Não deu para copiar";
    clearTimeout(tm); tm=setTimeout(()=>{ bt.textContent=rot; },2200);
  });

  /* tocar em um serviço preenche o formulário */
  const form=$("#form"), carro=$("#f-carro"), erro=$("#f-erro");
  const reduz=matchMedia("(prefers-reduced-motion: reduce)").matches;
  function pedirServico(valor){
    if ([...selServ.options].some(o=>o.value===valor)) selServ.value=valor;
    selServ.removeAttribute("aria-invalid");
    $("#orcamento").scrollIntoView({behavior:reduz?"auto":"smooth",block:"center"});
    setTimeout(()=>{ (carro.value?selServ:carro).focus({preventScroll:true}); }, reduz?0:450);
  }
  $("#lista-servicos").addEventListener("click",e=>{
    const b=e.target.closest("[data-servico]"); if(b) pedirServico(b.dataset.servico);
  });
  ulServ.addEventListener("click",e=>{
    const b=e.target.closest("button[data-opcao]"); if(b) pedirServico(b.dataset.opcao);
  });

  /* envio pelo WhatsApp */
  form.addEventListener("submit",e=>{
    e.preventDefault();
    const f=new FormData(form), nome=(f.get("nome")||"").trim(), car=(f.get("carro")||"").trim(),
          serv=(f.get("servico")||"").trim(), relato=(f.get("relato")||"").trim();
    carro.removeAttribute("aria-invalid"); selServ.removeAttribute("aria-invalid");
    const faltam=[];
    if(!car){ faltam.push("o carro"); carro.setAttribute("aria-invalid","true"); }
    if(!serv){ faltam.push("o serviço"); selServ.setAttribute("aria-invalid","true"); }
    if(faltam.length){
      erro.hidden=false; erro.textContent="Falta informar "+faltam.join(" e ")+".";
      (car?selServ:carro).focus(); return;
    }
    erro.hidden=true;
    const linhas=[OFICINA.mensagemZap];
    if(nome) linhas.push("Nome: "+nome);
    linhas.push("Carro: "+car,"Serviço: "+serv);
    if(relato) linhas.push("O que o carro está sentindo: "+relato);
    mostrarContato("Prévia do orçamento", linhas.join("\n"), true);
  });
  [carro,selServ].forEach(el=>el.addEventListener("input",()=>{ el.removeAttribute("aria-invalid"); erro.hidden=true; }));
})();

/* ----- serviços ao lado do carro ----- */
const NS = "http://www.w3.org/2000/svg";
const itens = SERVICOS.map((s,i)=>{
  const li=document.createElement("li");
  li.className="servico servico--"+s.lado;
  const bt=document.createElement("button"); bt.type="button"; bt.textContent=s.nome; bt.dataset.opcao=s.opcao||""; bt.tabIndex=-1;
  li.appendChild(bt); ulServ.appendChild(li);
  const path=document.createElementNS(NS,"path"); const dot=document.createElementNS(NS,"circle"); dot.setAttribute("r","3.2");
  svg.appendChild(path); svg.appendChild(dot);
  return {s,i,li,bt,path,dot,len:0,ini:SERV_INICIO+i*SERV_PASSO};
});

/* ----- modo (tela larga x celular) ----- */
let movel=false, vw=innerWidth, vh=innerHeight;
function calcModo(){
  vw=innerWidth; vh=innerHeight;
  movel = vw < 820 || vh > vw*0.95;
  body.classList.toggle("movel", movel);
}

/* ----- posiciona textos e linhas sobre a imagem ----- */
function layout(){
  const eraMovel=movel;
  calcModo();
  if(eraMovel!==movel){idxCartao=-2; cartao.inert=true; cartao.classList.remove("on");}
  if (movel){ itens.forEach(it=>{ it.li.style.left=it.li.style.top=it.li.style.maxWidth=""; }); if (idxCartao>=0 && idxCartao<NSERV) linhaDoCartao(idxCartao); return; }
  const W = Math.max(vw, vh*16/9), H = W*9/16, ox=(vw-W)/2, oy=(vh-H)/2;
  itens.forEach(it=>{
    const {s,li,path,dot}=it;
    let lx = ox + W*s.lx;
    const ly = oy + H*s.ly;
    /* mantém o texto dentro da tela */
    if (s.lado==="e") lx = Math.max(lx, 150); else lx = Math.min(lx, vw-150);
    li.style.left = lx+"px"; li.style.top = ly+"px";
    li.style.maxWidth = (s.lado==="e" ? Math.min(lx-16, 260) : Math.min(vw-lx-16, 260))+"px";
    const gap = s.lado==="e" ? 14 : -14;
    const x0 = lx + gap, y0 = ly, x1 = ox + W*s.ax, y1 = oy + H*s.ay;
    const mx = x0 + (x1-x0)*.45;
    path.setAttribute("d","M"+x0+" "+y0+" L"+mx+" "+y0+" L"+x1+" "+y1);
    dot.setAttribute("cx",x1); dot.setAttribute("cy",y1);
    it.len = path.getTotalLength();
    path.style.strokeDasharray = it.len;
  });
}

/* ----- progresso -> quadro ----- */
function quadroEm(p){
  const T = movel ? TEMPO_V : TEMPO;
  for (let i=1;i<T.length;i++){
    if (p<=T[i][0]){
      const [p0,q0]=T[i-1],[p1,q1]=T[i];
      return q0 + (q1-q0)*((p-p0)/(p1-p0||1));
    }
  }
  return T[T.length-1][1];
}

/* ----- celular: um serviço por vez, com o ponto marcado no carro ----- */
const cartao=$("#cartao"), cN=$("#c-n"), cT=$("#c-t"), cD=$("#c-d"), cB=$("#c-b"), cPontos=$("#c-pontos");
const NSERV = SERVICOS.length;
const pontos = [];
for (let i=0;i<=NSERV;i++){
  const b=document.createElement("button"); b.type="button"; b.setAttribute("aria-label", i<NSERV ? "Serviço "+(i+1) : "Contato");
  b.addEventListener("click",()=>{
    const total=trilha.offsetHeight-vh, topo=trilha.getBoundingClientRect().top+scrollY;
    const alvoP = i<NSERV ? SERV_INICIO_V+(i+.5)*SERV_PASSO_V : 0.97;
    scrollTo({top:topo+alvoP*total, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
  });
  cPontos.appendChild(b); pontos.push(b);
}
let idxCartao=-2;
function pontoNoCarro(s){
  const k=Math.max(vw/720, vh/1280), ox=(vw-720*k)*.5, oy=(vh-1280*k)*.38;
  return [ox+s.mx*k, oy+s.my*k];
}
function linhaDoCartao(i){
  itens.forEach((it,j)=>{
    const ativo = j===i;
    it.path.classList.toggle("ativa",ativo); it.dot.classList.toggle("ativa",ativo);
    if (!ativo){ it.dot.style.opacity=""; return; }
    const [x,y]=pontoNoCarro(it.s);
    const x0=Math.min(Math.max(x,28),vw-28), y0=cartao.offsetTop;
    it.path.setAttribute("d","M"+x0+" "+y0+" L"+x+" "+y);
    it.dot.setAttribute("cx",x); it.dot.setAttribute("cy",y);
    it.len=it.path.getTotalLength(); it.path.style.strokeDasharray=it.len;
  });
}
function textoCartao(i){
  if (i<NSERV){
    const s=SERVICOS[i];
    cN.textContent = "Serviço "+String(i+1).padStart(2,"0")+" / "+String(NSERV).padStart(2,"0");
    cT.textContent = s.nome; cD.textContent = s.desc||"";
    cB.textContent = "Orçar este serviço"; cB.dataset.i=i;
  } else {
    cN.textContent = OFICINA.nome.toUpperCase();
    cT.textContent = "Vamos cuidar do seu carro?";
    cD.textContent = "★ "+OFICINA.notaGoogle+" ("+OFICINA.avaliacoesGoogle+" avaliações simuladas). "+($("#status-texto").textContent||"");
    cB.textContent = "Ver como chegar"; cB.dataset.i="fim";
  }
  pontos.forEach((b,j)=>{b.classList.toggle("ativo",j===i); if(j===i) b.setAttribute("aria-current","step"); else b.removeAttribute("aria-current");});
}
cB.addEventListener("click",()=>{
  if (cB.dataset.i==="fim") $("#info").scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
  else itens[+cB.dataset.i].bt.click();
});
function pintarCartao(p){
  const bruto = Math.floor((p-SERV_INICIO_V)/SERV_PASSO_V);
  const i = p<SERV_INICIO_V ? -1 : Math.min(bruto,NSERV);
  if (i!==idxCartao){
    idxCartao=i;
    cartao.classList.toggle("on", i>=0);
    cartao.inert = i<0;
    if (i>=0){
      textoCartao(i);
      cartao.classList.remove("anim"); void cartao.offsetWidth; cartao.classList.add("anim");
    }
    linhaDoCartao(i<NSERV ? i : -1);
    if (i<0) itens.forEach(it=>{ it.path.classList.remove("ativa"); it.dot.classList.remove("ativa"); });
  }
  if (i>=0 && i<NSERV){
    const t=((p-SERV_INICIO_V)/SERV_PASSO_V)-i, r=clamp(t/0.3), e=1-Math.pow(1-r,3), it=itens[i];
    it.path.style.strokeDashoffset = it.len*(1-e);
    it.dot.style.opacity = clamp((r-.5)/.5);
  }
}

/* ----- desenha o estado de cada elemento para o progresso p ----- */
let pendente=null, ultimoT=-1;
function pintar(p){
  /* vídeo */
  if (video.readyState>=1 && isFinite(video.duration)){
    const t = Math.min((quadroEm(p)+0.5)/FPS, video.duration-0.001);
    if (Math.abs(t-ultimoT) > 0.5/FPS){
      if (video.seeking) pendente=t; else { ultimoT=t; try{ video.currentTime=t; }catch(e){} }
    }
  }
  /* abertura */
  const o = 1 - clamp((p-0.03)/0.08);
  abertura.style.opacity = o;
  abertura.style.transform = "translateY("+(-(1-o)*2.5)+"vh) scale("+(1-(1-o)*0.06)+")";
  abertura.style.visibility = o<=0 ? "hidden" : "visible";
  marca.style.opacity = clamp((p-0.10)/0.06);
  marca.inert = p<=0.10;
  /* serviços */
  if (movel && !body.classList.contains("simples")){ pintarCartao(p); } else
  itens.forEach(it=>{
    const ini = movel ? SERV_INICIO_V + it.i*SERV_PASSO_V : it.ini;
    const r = clamp((p-ini)/SERV_DUR);
    const e = 1-Math.pow(1-r,3);
    it.li.style.opacity = r;
    if (movel){ it.li.style.transform = "translateY("+(10*(1-e))+"px)"; }
    else { const dx = (it.s.lado==="e" ? -1 : 1) * 14*(1-e);
           it.li.style.transform = (it.s.lado==="e" ? "translate(-100%,-50%)" : "translate(0,-50%)") + " translateX("+dx+"px)"; }
    const toque = r>0.6;
    it.li.style.pointerEvents = toque ? "auto" : "none";
    it.bt.tabIndex = toque ? 0 : -1;
    it.path.style.strokeDashoffset = it.len*(1-e);
    it.dot.style.opacity = clamp((r-0.6)/0.4);
  });
  body.classList.toggle("fim", p>=0.9);
  /* título e botão */
  const f = clamp((p-FECHO_INICIO)/FECHO_DUR);
  fecho.style.opacity = f;
  fecho.style.transform = "translateY("+(14*(1-f))+"px)";
  fecho.dataset.vivo = f>0.6 ? "1" : "0";
  fecho.inert = f<=0.6;
  $(".pular").inert = movel && p>=0.9;
}

/* ----- rolagem com suavização ----- */
let alvo=0, atual=0, rodando=false;
function lerAlvo(){
  const r=trilha.getBoundingClientRect(), total=trilha.offsetHeight - vh;
  alvo = total>0 ? clamp(-r.top/total) : 1;
}
function passo(){
  if(body.classList.contains("simples")){rodando=false;return;}
  atual += (alvo-atual)*0.22;
  if (Math.abs(alvo-atual)<0.0003) atual=alvo;
  pintar(atual);
  if (atual!==alvo) requestAnimationFrame(passo); else rodando=false;
}
function acordar(){ if(body.classList.contains("simples")) return; lerAlvo(); if(!rodando){ rodando=true; requestAnimationFrame(passo); } }
video.addEventListener("seeked",()=>{
  if (pendente!==null){ const t=pendente; pendente=null; ultimoT=t; try{ video.currentTime=t; }catch(e){} }
});

const semMovimento = matchMedia("(prefers-reduced-motion: reduce)").matches;
const estatico = $("#estatico");

/* ----- imagens e vídeo certos para o aparelho ----- */
function aplicarMidia(){
  video.poster = movel ? POSTER_V : POSTER_H;
  if (body.classList.contains("simples")) estatico.src = movel ? ULTIMO_V : ULTIMO_H;
}
function escolherVideo(){
  const c = navigator.connection||{};
  const lento = c.saveData || /(^|-)2g|3g/.test(c.effectiveType||"");
  if (movel) return VIDEO_V;
  return (innerWidth<900 || lento) ? VIDEO_LEVE : VIDEO_HD;
}

/* ----- versão simples: sem vídeo, mostra o carro final com tudo pronto para usar ----- */
let geracao=0, ctlAtual=null, relogio=null, modoCarregado=null, objectUrl=null;
function limparVideo(){
  video.onloadeddata=null; video.onerror=null;
  video.pause(); video.removeAttribute("src"); video.load();
  if(objectUrl){URL.revokeObjectURL(objectUrl); objectUrl=null;}
  pendente=null; ultimoT=-1;
}
function modoSimples(){
  geracao++;
  if (ctlAtual){ try{ ctlAtual.abort(); }catch(e){} }
  clearInterval(relogio);
  limparVideo();
  if (body.classList.contains("simples")) return;
  body.classList.add("simples");
  estatico.src = movel ? ULTIMO_V : ULTIMO_H; estatico.hidden=false;
  abertura.classList.add("pronto"); marca.style.opacity=1;
  alvo=atual=1; pintar(1);
}

/* ----- carregamento do vídeo (baixa inteiro para rolar sem travar) ----- */
function pronto(){
  if (body.classList.contains("simples")) return;
  abertura.classList.add("pronto");
  dica.textContent = "Role para baixo";
  carga.style.width="100%";
  /* destrava a busca de quadros em navegadores de celular */
  const pl = video.play(); if (pl && pl.then) pl.then(()=>video.pause()).catch(()=>{});
  acordar();
}
async function carregar(){
  const minha = ++geracao; modoCarregado = movel;
  if(ctlAtual) ctlAtual.abort();
  clearInterval(relogio); limparVideo();
  const url = escolherVideo(), c = navigator.connection||{};
  abertura.classList.remove("pronto"); dica.textContent="Carregando o vídeo"; carga.style.width="0%";
  /* economia de dados ligada, 2G ou aparelho com pouca memória: nem tenta baixar o vídeo */
  if (c.saveData || /(^|-)2g/.test(c.effectiveType||"") || (navigator.deviceMemory && navigator.deviceMemory<=2)) return modoSimples();

  const ctl = new AbortController(); ctlAtual = ctl;
  const t0 = performance.now(); let lido=0, total=0;
  clearInterval(relogio);
  relogio = setInterval(()=>{
    if (minha!==geracao){ clearInterval(relogio); return; }
    const dt = (performance.now()-t0)/1000;
    if (dt>=14){ modoSimples(); return; }                       /* passou de 14 s: desiste */
    if (dt>=4){                                                  /* aos 4 s, estima quanto falta */
      const taxa = lido/dt, falta = taxa>0 ? ((total||7e6)-lido)/taxa : Infinity;
      if (falta>8) modoSimples();
    }
  },300);

  try{
    const resp = await fetch(url,{signal:ctl.signal});
    if (!resp.ok || !resp.body) throw new Error("sem corpo");
    total = +resp.headers.get("Content-Length")||0;
    const rd = resp.body.getReader(), partes=[];
    for(;;){
      const {done,value}=await rd.read(); if(done) break;
      partes.push(value); lido+=value.length;
      if (minha===geracao && total) carga.style.width = (lido/total*100).toFixed(0)+"%";
    }
    if (minha!==geracao) return;
    clearInterval(relogio);
    objectUrl = URL.createObjectURL(new Blob(partes,{type:"video/mp4"}));
    video.src = objectUrl;
  }catch(e){
    if (minha!==geracao) return;                /* cancelado de propósito */
    clearInterval(relogio);
    if(location.protocol!=="file:") return modoSimples();
    video.src = url; // fallback para abertura local
  }
  video.onerror = ()=>{ if(minha===geracao) modoSimples(); };
  const aoPronto=()=>{ if(minha===geracao){ clearInterval(relogio); pronto(); } };
  if (video.readyState>=2) aoPronto(); else {
    video.onloadeddata = aoPronto;
    relogio=setTimeout(()=>{if(minha===geracao) modoSimples();},8000);
  }
}

/* ----- inicialização ----- */
function iniciar(){
  layout(); aplicarMidia();
  if (semMovimento){ modoSimples(); return; }   /* quem pediu menos movimento recebe a versão simples */
  pintar(0); acordar(); carregar();
  addEventListener("scroll",acordar,{passive:true});
}
let tmr;
addEventListener("resize",()=>{ clearTimeout(tmr); tmr=setTimeout(()=>{
  layout(); aplicarMidia();
  if (!body.classList.contains("simples") && modoCarregado!==null && movel!==modoCarregado) carregar();   /* girou o celular: troca o vídeo */
  acordar(); pintar(atual);
},150); });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(()=>{ layout(); pintar(atual); });
iniciar();
})();
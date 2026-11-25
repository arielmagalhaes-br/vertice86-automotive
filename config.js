/* =====================================================================
   CONFIGURAÇÃO  (edite aqui)
   ===================================================================== */
const OFICINA = Object.freeze({
  nome: "Vértice 86 — Oficina Automotiva",
  telefoneExibicao: "(00) 00000-0000 (exemplo)",
  endereco: "Avenida Exemplo, 86 — Recife, PE (endereço fictício)",
  instagram: "@vertice86.demo (exemplo)",
  instagramUrl: "https://www.instagram.com/",
  notaGoogle: "4,9",
  avaliacoesGoogle: 34,
  mensagemZap: "Olá! Vim pelo site da Vértice 86 e quero simular um orçamento.",
  mapaSrc: "https://maps.google.com/maps?q=Marco%20Zero%2C%20Recife&z=15&output=embed",
  rotaUrl: "https://www.google.com/maps/search/?api=1&query=Marco+Zero+Recife",
  wazeUrl: "https://www.waze.com/ul?q=Marco%20Zero%2C%20Recife"
});
// Horário fictício, no fuso de Recife. Dia 0 = domingo.
const HORARIO = Object.freeze({1:[8,17],2:[8,17],3:[8,17],4:[8,17],5:[8,17],6:[8,12]});
const HORARIO_TEXTO = "Segunda a sexta, 8h às 17h; sábado, 8h às 12h; domingo fechado.";

/* Vídeos: HD = computador, LEVE = computador com internet lenta, V = celular (vertical) */
const VIDEO_HD   = "vertice86-1080.mp4";
const VIDEO_LEVE = "vertice86-720.mp4";
const VIDEO_V    = "vertice86-v-720.mp4";      // vídeo vertical (celular)
const POSTER_H = "poster.jpg",  POSTER_V = "poster-v.jpg";   // primeiro quadro
const ULTIMO_H = "ultimo-h.jpg", ULTIMO_V = "ultimo-v.jpg";  // último quadro (usado na versão simples)

/* Serviços ao lado do carro.
   lado: "e" (esquerda) ou "d" (direita)
   ly:   altura do texto na imagem (0 = topo, 1 = base)
   ax,ay: ponto do carro para onde a linha aponta (em fração da imagem final do vídeo) */
const SERVICOS = [
  { nome: "Reparo de motor",               lado: "e", lx: .27, ly: .29, ax: .400, ay: .455, opcao: "Reparo de motor e de cabeçote", mx: 440, my: 580,
    desc: "Perdendo força, falhando ou esquentando demais? Avaliamos e reparamos motor e cabeçote." },
  { nome: "Diagnóstico",                   lado: "e", lx: .19, ly: .54, ax: .310, ay: .535, opcao: "Diagnóstico", mx: 300, my: 492,
    desc: "Luz acesa no painel ou barulho estranho? Começamos achando a causa do problema." },
  { nome: "Trocador de calor e radiador",  lado: "e", lx: .19, ly: .73, ax: .430, ay: .640, opcao: "Substituição e reparo do trocador de calor", mx: 285, my: 668,
    desc: "Carro esquentando? Substituição e reparo do trocador de calor e do radiador." },
  { nome: "Revisão e inspeção para venda", lado: "d", lx: .73, ly: .29, ax: .585, ay: .340, opcao: "Revisão preventiva e completa", mx: 360, my: 450,
    desc: "Vai comprar ou vender? Revisão e inspeção para saber o estado real do carro." },
  { nome: "Suspensão e direção",           lado: "d", lx: .81, ly: .54, ax: .745, ay: .660, opcao: "Suspensão e caixa de direção", mx: 105, my: 772,
    desc: "Carro puxando, batendo ou com o volante estranho? Cuidamos de suspensão e direção." },
  { nome: "Vazamento de óleo",             lado: "d", lx: .81, ly: .73, ax: .600, ay: .700, opcao: "Vazamento de óleo e troca de retentor", mx: 360, my: 832,
    desc: "Mancha de óleo no chão? Consertamos o vazamento e trocamos o retentor." }
];
/* opcao: serviço da LISTA que o botão seleciona no formulário (celular).
   lx: posição horizontal do texto (fração da imagem). Texto da esquerda termina em lx; o da direita começa em lx. */

/* Lista completa para o texto da página (aparece no Google e para quem usa leitor de tela) */
const LISTA = [
  "Reparo de motor e de cabeçote",
  "Substituição e reparo do trocador de calor",
  "Reparo de radiador e sensor de temperatura",
  "Vazamento de óleo e troca de retentor",
  "Suspensão e caixa de direção",
  "Limpeza de DPF",
  "Troca da bomba de combustível",
  "Troca de calço do motor e correias",
  "Diagnóstico",
  "Revisão preventiva e completa",
  "Inspeção para venda"
];
const MARCAS = ["BMW","Mercedes-Benz","Audi","Volvo","Land Rover","Jeep","Porsche","Volkswagen","Toyota","Honda","Hyundai"];

/* Linha do tempo da rolagem: [progresso da página 0..1, quadro do vídeo] */
const FPS = 24, QUADROS = 188;
const TEMPO = [[0,0],[0.06,0],[0.62,170],[0.70,187],[1,187]];
const SERV_INICIO = 0.72, SERV_PASSO = 0.028, SERV_DUR = 0.05;   // quando os serviços aparecem
const TEMPO_V = [[0,0],[0.03,0],[0.43,150],[0.47,187],[1,187]];   // celular: os faróis baixam por volta do quadro 150
const SERV_INICIO_V = 0.48, SERV_PASSO_V = 0.07;                                       // celular: serviços aparecem logo depois
const FECHO_INICIO = 0.90, FECHO_DUR = 0.07;                      // quando título e botão aparecem


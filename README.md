# Vértice 86 — Landing page automotiva

Demonstração fictícia de portfólio. Não representa uma oficina real. Os contatos, endereço, horário e avaliações (4,9/34) são dados de exemplo. Google Maps e Waze apontam para o Marco Zero, Recife, apenas para demonstrar a integração. Instagram e WhatsApp abrem páginas gerais, sem destinatário. O formulário valida e mostra a mensagem localmente; não envia dados.

## Executar

Abra `index.html` ou use um servidor HTTP local (recomendado): `python -m http.server 8000`, depois acesse `http://localhost:8000`. Nenhuma dependência de execução ou backend.

## Estrutura

- `index.html`: HTML semântico e metadados WebPage.
- `styles.css`: identidade visual e responsividade.
- `config.js`: marca, contatos fictícios, serviços, horários, mídia e timeline.
- `app.js`: interações, animação, mapa sob demanda e fallback.
- `logo.webp` / `logo-small.webp`: logo aprovada com carro clássico, imagem raster com transparência em WebP sem perdas; versões dimensionadas para abertura e cabeçalho.
- `favicon.png`: recorte da frente do carro da logo aprovada, para a aba do navegador.
- `vertice86-*.mp4`: vídeos originais preservados byte a byte, renomeados.
- `_headers`: regras de segurança para hospedagem compatível (ex.: Cloudflare Pages); não se aplicam automaticamente ao GitHub Pages.

## Desempenho

Vídeos distintos por dispositivo, download com limite de tempo e cancelamento, alternativa estática para conexões lentas, economia de dados e movimento reduzido; imagens e fontes locais. Os vídeos continuam sendo a principal transferência. A publicação e a medição de Lighthouse em ambiente hospedado ainda são pendentes.

## Publicação e direitos

Antes de publicar em um repositório aberto, confirme direitos de uso e redistribuição dos vídeos gerados por IA (Google Flow/Veo, conforme documentação original), imagens e fontes. Não há licença geral atribuída ao projeto. A marca Vértice 86 é um nome demonstrativo, sem pesquisa de disponibilidade comercial. As avaliações não são depoimentos reais. O projeto ainda não foi publicado.

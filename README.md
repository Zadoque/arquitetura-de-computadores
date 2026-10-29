# Arquitetura de Computadores — UENF

Portal estático e responsivo da disciplina **Arquitetura de Computadores (INF01112)**, reunindo em um único endereço a apresentação teórica e os formulários de laboratório desenvolvidos em repositórios independentes.

**Instituição:** Universidade Estadual do Norte Fluminense Darcy Ribeiro (UENF), Centro de Ciências e Tecnologia (CCT)  
**Disciplina:** Arquitetura de Computadores · **Professor:** Dr. Luis Ramirez

> O projeto funciona sem servidor, banco de dados, framework ou etapa de build. Os formulários são salvos pelo próprio navegador usando `localStorage`.

## Conteúdo reunido

| Menu no portal | Origem | Conteúdo |
| --- | --- | --- |
| Laboratório 1 — Multímetro | [Zadoque/multimetro](https://github.com/Zadoque/multimetro) | Ficha de medições de fonte ATX, tolerâncias, observações, conclusão e relatório LaTeX |
| Laboratório 2 — Montagem | [Zadoque/arquitetura_2](https://github.com/Zadoque/arquitetura_2) | Montagem segura de hardware, checkpoints, evidências fotográficas e relatório LaTeX |
| Laboratório 3 — Inicialização | [Zadoque/arquitetura3](https://github.com/Zadoque/arquitetura3) | Componentes, sequência de boot, registro fotográfico, observações e relatório LaTeX |
| Aula 4 — Apresentação | [Zadoque/aula4](https://github.com/Zadoque/aula4) | Slides sobre HD/SSD, sistemas operacionais, BIOS/UEFI, partições e bootloaders |
| Aula 4 — Relatório | [Zadoque/arquitetura4](https://github.com/Zadoque/arquitetura4) | Registro dos testes de HDD, BIOS, processador, temperaturas e escolha do SO, com LaTeX |

A aula 4 possui **dois materiais complementares**, por isso conta com duas entradas no menu: apresentação teórica e formulário prático. Os repositórios de origem permanecem independentes e **não são apagados nem arquivados** por esta integração.

## Funcionalidades

- **Um único ponto de entrada (`index.html`)** com tela inicial, menu por aula e barra de navegação acessível.
- **Mobile first:** menu e cartões adaptados ao celular; navegação lateral em telas maiores; campos com áreas de toque adequadas.
- **Estilo compartilhado** e identidade visual comum, mantendo particularidades de diagramas, slides e controles de cada exercício.
- **Preservação das funcionalidades originais:** formulários em etapas, captura/compactação de fotos onde disponível, validações, geração/cópia de LaTeX e controles de slides.
- **Salvamento automático no `localStorage`** do navegador, sem login e sem enviar respostas para servidores.
- **Painel de continuidade**, que indica quando existem dados salvos de um laboratório.
- **Exportação e importação de backup JSON** de todas as fichas, útil para trocar de navegador/dispositivo ou limpar dados com segurança.
- **Links diretos para cada exercício** continuam disponíveis se o estudante preferir abrir fora da navegação do portal.

## Estrutura de pastas

```text
arquitetura-de-computadores/
├── index.html                 # Porta de entrada do site
├── assets/
│   ├── site.css               # Design system / layout do portal
│   ├── app.js                 # Rotas, menu, estado e backups
│   └── lesson-theme.css       # Ajustes comuns nas aulas legadas
├── aulas/
│   ├── multimetro/index.html
│   ├── montagem/index.html
│   ├── inicializacao/index.html
│   ├── aula4-slides/index.html
│   └── aula4-relatorio/index.html
├── .nojekyll
└── README.md
```

Os cinco exercícios foram mantidos em HTML autônomo, isolados no mesmo domínio por `iframe`. Essa decisão é deliberada: cada projeto original define variáveis e funções globais com nomes repetidos (`state`, `saveState`, `render` etc.), além de regras de CSS amplas. Injetá-los no mesmo DOM causaria colisões e poderia corromper formulários. O portal apresenta **uma interface e um endereço de entrada**, enquanto cada módulo mantém suas próprias funções, etapas e armazenamento. Não se trata de uma SPA React; é uma aplicação estática em HTML, CSS e JavaScript puro.

## Como executar localmente

Recomendado: abra um servidor HTTP estático na raiz do projeto; não abra `index.html` usando `file://`, pois a política de origem e o `localStorage` de iframes podem variar conforme o navegador.

```bash
git clone https://github.com/Zadoque/arquitetura-de-computadores.git
cd arquitetura-de-computadores
python3 -m http.server 8000
```

Acesse **http://localhost:8000** no navegador. Alternativamente, use Live Server do VS Code ou qualquer servidor de arquivos estáticos. Não é necessário `npm install`, `npm run build` ou backend.

## Publicar no GitHub Pages

1. Abra **Settings → Pages** neste repositório.
2. Em **Build and deployment**, escolha **Deploy from a branch**.
3. Selecione **main** e **/(root)** e salve.
4. O site será publicado no endereço de projeto do GitHub Pages, tipicamente `https://zadoque.github.io/arquitetura-de-computadores/`.

O endereço acima é o padrão esperado, **não uma confirmação de que o Pages foi ativado**. A publicação deve ser configurada nas opções do repositório.

## Como funciona o armazenamento local

Cada formulário preserva a chave que já utilizava em seu repositório original:

| Exercício | Chave do localStorage |
| --- | --- |
| Multímetro | `multimetro_ficha_v2` |
| Montagem | `adc_lab02_v3` |
| Inicialização | `adc_lab03_v2` |
| Aula 4 — Relatório | `arquitetura4_relatorio_v1` |
| Aula 4 — Slides | não grava respostas |

Os dados são isolados por **origem** (`protocolo + domínio + porta`), não pelo caminho da aula. Dentro do portal todos os módulos compartilham a mesma origem, mas usam **chaves diferentes**, evitando sobrescrever uns aos outros. Se os antigos projetos eram acessados pelo **mesmo domínio GitHub Pages**, os valores existentes nessas chaves poderão ser reconhecidos automaticamente. Se estavam em outros domínios ou navegadores, a migração não será automática.

### Backup e restauração

1. Na tela inicial, clique em **Exportar backup (.json)**. O arquivo inclui os quatro valores de armazenamento, quando presentes, com data e versão do formato.
2. Armazene o arquivo em um local seguro: ele pode incluir nomes, respostas e imagens codificadas.
3. Para restaurar, clique em **Importar backup**, selecione o JSON exportado pelo portal e confirme a substituição dos dados locais.
4. Reabra a aula para carregar os dados restaurados. Uma falha de quota durante importação impede a aplicação de um backup incompleto.

**Limitações importantes:** `localStorage` não sincroniza entre dispositivos e pode ser apagado com os dados do site ou no modo anônimo. Os navegadores normalmente impõem quotas por origem; fotografias codificadas ocupam bastante espaço. Os formulários originais possuem avisos variados ao atingir o limite. Faça backup com frequência, especialmente quando incluir imagens. A exportação em JSON **não** substitui o relatório final ou o arquivo LaTeX: esses devem ser gerados pelo exercício.

### Privacidade

O site não implementa API, login, analytics, cookies de rastreamento ou upload de respostas. O navegador guarda os formulários no próprio dispositivo. A apresentação teórica pode carregar **recursos públicos de terceiros** (biblioteca de ícones Lucide) e três imagens originais referenciadas no repositório público `aula4`; esses recursos requerem conexão de rede e suas requisições seguem as políticas dos respectivos provedores.

## Layout e acessibilidade

A página principal usa HTML semântico, links e botões reais, `aria-current` no item ativo, foco visível, menu expansível e conteúdo fluido. A coluna lateral só aparece em larguras maiores; nos celulares, o menu vira uma faixa de navegação horizontal rolável. Os controles e campos das aulas recebem melhorias compartilhadas por `assets/lesson-theme.css`. Os slides da aula 4 contam com ajustes adicionais para telas estreitas e rolagem interna, sem alterar o conteúdo das lâminas.

Por compatibilidade, algumas particularidades dos exercícios continuam existentes (como a estrutura dos geradores LaTeX e das instruções originais). Essa abordagem prioriza não perder trabalho dos estudantes em uma migração.

## Arquitetura e manutenção

- **`assets/app.js`:** catálogo fixo das cinco entradas; rota no `location.hash` (por exemplo, `#/multimetro`), desenho do painel e backups JSON.
- **`assets/site.css`:** tokens de cores, layout, navegação, cards, estados vazios, responsividade e foco.
- **`assets/lesson-theme.css`:** estilo adicional inserido **depois** do CSS original de cada módulo, para harmonizar fontes, cores, campos e pequenos breakpoints.
- **`aulas/*/index.html`:** cópias adaptadas das aplicações originais. Se um exercício mudar no repositório antigo, as alterações **não** serão replicadas automaticamente; é preciso portar o diff preservando a chave de armazenamento e testar o formulário.

### Adicionar uma nova aula

1. Crie `aulas/nova-aula/index.html` e mantenha recursos relativos dentro de sua pasta.
2. Insira o link para `../../assets/lesson-theme.css` após os estilos da página.
3. Acrescente o objeto da aula no array `LESSONS` em `assets/app.js`; o menu e o painel inicial serão atualizados.
4. Se a aula tiver `localStorage`, escolha uma chave única e acrescente-a à lista `STORAGE_KEYS` para habilitar backup e detecção de dados salvos.
5. Verifique a experiência em celular, navegação por teclado, ida e volta entre aulas, recarga de página, persistência, fotos e LaTeX.

## Checklist de teste manual recomendado

- Abrir o portal em 360 px, 390 px, tablet e desktop, sem rolagem horizontal.
- Abrir cada uma das cinco entradas do menu e testar avançar/voltar etapas.
- Preencher uma resposta em cada um dos quatro formulários, recarregar o site e confirmar persistência.
- Tirar uma foto nos laboratórios 2 e 3, recarregar, gerar LaTeX e conferir o conteúdo.
- Exportar um backup, alterar respostas, importar e confirmar restauração.
- Testar os slides da aula 4 sem conexão e em dispositivo com tela pequena.
- Confirmar que nenhum dado pessoal aparece no código do repositório: os dados reais devem ficar exclusivamente no navegador do estudante.

## Créditos e fontes

Integração feita a partir dos cinco repositórios listados na seção **Conteúdo reunido**. Permanecem os créditos acadêmicos presentes nos exercícios originais (incluindo, conforme a aula, Zadoque Carneiro e Emanuel Peixoto Gomes). Os materiais são educacionais; a existência de um repositório público, por si só, não concede licença de redistribuição a terceiros. Consulte as condições de uso de cada origem antes de reutilizar fora deste projeto.

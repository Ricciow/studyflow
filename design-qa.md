# Revisão visual — StudyFlow

Data: 21/10/2026. Escopo: primeira versão frontend em React, seguindo a referência e priorizando usabilidade, conforme solicitado.

## Evidências e normalização

- Fonte visual: `../.codex-remote-attachments/01a1602f-a53e-7602-b7eb-3637d828bf43/8b9bdf3f-175f-4faa-8468-c7a993e906e4/1-1000037686.jpg` (1200 × 1280 px).
- Implementação: navegador integrado, `http://localhost:5173/`, viewport 1400 × 1200 CSS px. Capturas completas em `docs/screenshots/*-full.png` (1400 × 1200 px).
- iPhone: área de tela medida em 393 × 852 CSS px, escala 1, sem rolagem do contêiner externo. Capturas de conteúdo em `docs/screenshots/dashboard.png`, `tasks.png`, `task-details.png`, `calendar.png` e `welcome-after.png`, todas 393 × 852 px. Densidade efetiva da captura: 1 pixel por CSS px.
- Pixel: área medida em 427 × 952 CSS px; evidência em `docs/screenshots/pixel-tasks-full.png`. A prévia inicial também foi inspecionada no viewport padrão 1280 × 720.
- A fonte é uma prancha de telas menores com proporção diferente da prévia calibrada. Recortes da fonte foram ampliados para 393 px de largura, preservando a proporção, e apoiados em uma tela de 393 × 852, sem esticar o conteúdo. A região adicional inferior não foi julgada como diferença do produto. Chrome, relógio e recortes de câmera pertencem ao template.
- Estado: tema claro, português, dados demonstrativos. Datas foram atualizadas à semana corrente; contagens e progresso refletem os dados após testes. O texto e os indicadores foram comparados considerando essa diferença de estado.

Comparações com fonte e implementação na mesma imagem:

- `docs/screenshots/dashboard-comparison.png`
- `docs/screenshots/welcome-after-comparison.png`
- `docs/screenshots/tasks-comparison.png`
- `docs/screenshots/calendar-comparison.png`
- `docs/screenshots/task-details-comparison.png`
- Região focal: `docs/screenshots/dashboard-card-comparison.png`, contendo o cartão de aulas lado a lado para examinar hierarquia, separadores, margens, ícones e texto. As comparações de tarefas e detalhes também permitem examinar os controles e o checklist de forma legível.

## Histórico de correções

1. **[P1] A tela se deslocava após uso do teclado.**
   Evidência anterior: `docs/screenshots/welcome-full.png`. O contêiner externo acumulava 69 px de rolagem nativa; a marca ficava atrás da câmera e parte do teclado aparecia no rodapé. Correção: ancorar a área externa da prévia em zero e manter a rolagem no `MobileScroll`, sem modificar arquivos protegidos. Evidência posterior: `welcome-after-full.png` e `welcome-after-comparison.png`; medição posterior confirmou `scrollTop: 0`, 393 × 852.
2. **[P2] Leitura de compromissos na visão semanal.**
   A grade de sete dias exige texto curto. Correção: aumentar a tipografia dos eventos, fornecer nome acessível completo e incluir uma lista legível do dia selecionado abaixo da grade. A escala de horas agora acompanha eventos fora do intervalo inicial. Evidência posterior: `calendar-comparison.png` e teste da ocorrência de Cálculo I em 28/10.
3. **[P2] Tipografia secundária excessivamente compacta e duração decimal.**
   Correção: aumentar títulos de tarefas/aulas, textos secundários, filtros e prioridades, escurecer o token de texto secundário e exibir tempo como `12h31`, em vez de uma fração de hora. Evidência posterior: `dashboard-comparison.png`, `tasks-comparison.png`; regras de duração cobertas por teste direto.
4. **[P2] Associações de rótulos nos grupos de botões da configuração.**
   O primeiro botão recebia o texto de todo o grupo como nome acessível. Correção: grupos semânticos separados dos rótulos de campos de entrada. Tipos de instituição e dias continuam com estado `aria-pressed`.
5. **[P2] Data de detalhe de compromisso recorrente.**
   Correção: guardar a data da ocorrência selecionada separadamente da data inicial da série. Verificado no navegador: clicar em Cálculo I da semana seguinte exibe quarta-feira, 28 de outubro.
6. **[P3] Botão principal nos detalhes quebrava em duas linhas.**
   Correção: atribuir mais largura à ação principal. Evidência final recapturada em `task-details-full.png`.

## Superfícies de fidelidade

- **Fontes e tipografia:** Arial/Helvetica acompanha o desenho sans-serif da referência. Títulos de página têm 20–21 px; títulos de tarefas e aulas têm 13 px, com metadados de 11 px. Hierarquia e quebra de linhas foram inspecionadas. A fonte original não pode ser identificada com precisão a partir da prancha comprimida; a equivalência é visual, não uma identificação tipográfica exata.
- **Espaçamento e layout:** mantidos cartões arredondados, cartão vermelho de aulas com interior branco, estatísticas em duas colunas e cinco destinos no rodapé. Áreas de toque, margens de 22 px, busca e agrupamento das ações são adaptações de usabilidade. O conteúdo adicional pode rolar sem remover a navegação persistente. O app ainda é uma prévia mobile, e não um painel desktop separado.
- **Cores e tokens:** vermelho principal `#ce1732`, superfícies claras, texto escuro e cores por matéria. Prioridade também usa palavras, sem depender somente de cor. As diferenças nas cores dos pontos das aulas reforçam a associação com as matérias da agenda.
- **Imagem e ícones:** ilustração raster própria mantém estudante de moletom vermelho, notebook, livros e universidade clara. Recorte e proporção foram comparados nas boas-vindas. Ícones vêm da biblioteca Radix, sem imagens ou ícones desenhados artesanalmente. O símbolo universitário e a fotografia do exemplo foram substituídos por ícones de identidade genérica do produto; é uma adaptação explícita deste projeto.
- **Texto e conteúdo:** mantidos nomes de matérias, estrutura das descrições e checklist da referência. Exemplos agora acompanham a data atual. Mensagens de sucesso, vazio, validação e demonstração esclarecem o estado. Login fictício, sincronização e integrações não são apresentados como funções prontas.

## Interações verificadas no navegador

- Navegação principal e retornos internos; menu de criação.
- Criação e edição de tarefa, preservação do checklist, conclusão e reabertura.
- Filtros de atrasadas e provas, busca sem resultados e estados selecionados.
- Criação de compromisso, rejeição de término anterior ao início, recorrência na semana seguinte e data correta no detalhe da ocorrência.
- Criação de matéria e vínculo de tarefa com a nova matéria.
- Registro de tempo de estudo, atualização da meta e dos relatórios.
- Preferências de lembretes; acesso a boas-vindas, cadastro demonstrativo e configuração inicial.
- Persistência dos dados demonstrativos após recarregar a página.
- Prévia em iPhone e Pixel; fechamento do teclado e ancoragem do conteúdo após alternar telas.
- Console consultado ao fim da verificação: nenhum erro ou aviso registrado.

Verificações diretas: `npm run build`, `npm run check:runtime`, `node --test tests/model.test.mjs` (5 testes aprovados) e formatação dos arquivos de aplicação. O build avisa sobre o tamanho do bundle da prévia (~513 kB antes de gzip); isso é uma otimização futura, não uma falha de compilação.

## Limites e diferenças aceitas

A instrução do usuário permite priorizar usabilidade sobre reprodução literal. Busca, ações maiores, informações textuais de prioridade, legenda/lista da semana e barras por matéria são adaptações intencionais. Os gráficos usam dados reais da demonstração, em vez de percentuais fixos da imagem. A autenticação é demonstrativa; backend, exclusão com recuperação, anexos, sincronização e notificações de sistema não fazem parte desta entrega. O README registra esses limites.

Não há achados P0/P1/P2 visuais pendentes dentro do escopo de primeira versão frontend. Isso não representa certificação de acessibilidade nem validação em celulares físicos. Polimento futuro: testar ampliação de texto e leitores de tela, validar o teclado em dispositivos reais e criar um layout desktop próprio.

## Checklist final

- [x] Fonte e implementação comparadas na mesma imagem.
- [x] Tipografia, layout, cores, imagens e texto avaliados.
- [x] Correções relevantes recapturadas e inspecionadas.
- [x] Fluxos principais exercitados no navegador.
- [x] Build, integridade do runtime e testes de regras aprovados.
- [x] Limites e execução documentados em `README.md`.

## Atualização responsiva — 22/10/2026

Solicitação: manter o modelo de celular no computador e exibir o aplicativo em tela inteira no celular. Essa solicitação autoriza a alteração do runtime, registrada em `AGENTS.md`.

### Evidências

- `docs/screenshots/responsive/desktop-1400.png`: viewport de 1400 × 1200, com tela simulada de 393 × 852, moldura, barra de status e seletor de aparelhos preservados.
- `docs/screenshots/responsive/mobile-390.png`: viewport e aplicativo em 390 × 844, sem moldura, câmera, barra de status ou teclado simulados. Tela começa em x=0, y=0, com escala 1.
- `docs/screenshots/responsive/landscape-844.png`: viewport e aplicativo em 844 × 390, mantendo navegação e rolagem na orientação horizontal.
- `docs/screenshots/responsive/small-menu-320.png`: menu de criação em 320 × 568. A primeira comparação mostrou pouca altura e margens duplas; ajuste para altura mínima de 360 px limitada à área disponível e redução das margens internas. As duas opções ficaram visíveis na nova captura.
- Capturas em densidade efetiva de 1 pixel por CSS px; a comparação usa os mesmos componentes e o mesmo estado local de demonstração. Diferenças de data/meta em relação às capturas de 21/10 são dados locais preservados.

### Verificações

- Sem largura horizontal excedente em 320 e 390 px; navegação termina na borda inferior do viewport.
- Prévia de iPhone e Pixel medida em 393 × 852 e 427 × 952 no desktop.
- Após selecionar Pixel no desktop e reduzir a tela, a área de aplicativo passou a 390 × 844, sem reservar espaço para uma barra Android simulada.
- Focar campo no desktop ainda mostra o teclado simulado; a mesma tela no modo celular tem zero imagens de teclado e mantém o conteúdo digitado ao alternar o tamanho.
- Campos no modo celular usam fonte de 16 px para evitar ampliação automática no iOS. Rolagem usa `pan-y pinch-zoom`, com gestos nativos em vez da simulação por ponteiro do desktop.
- Formulários e menu de registro também foram inspecionados em uma área reduzida de 390 × 440, sem cortar a ação de salvar. O runtime acompanha `visualViewport` quando o espaço disponível muda.
- Tipografia, cartões, cores por matéria, ícones e textos permanecem com a mesma identidade. Nenhum novo ativo gráfico foi necessário. A ausência de chrome no celular é intencional e solicitada.
- Console da verificação isolada: sem erros ou avisos.
- Build, integridade do runtime, cinco testes de regras e quatro testes de hospedagem aprovados. Hashes atualizados após verificar as alterações autorizadas; o novo contexto de apresentação também passa a fazer parte da integridade.

Limite: os testes usaram tamanhos de navegador; a interação com o teclado físico do sistema e recortes de aparelhos reais ainda merece validação em um celular. As áreas seguras usam `env(safe-area-inset-*)`, e o teclado nativo é entregue ao navegador.

Sem achados P0/P1/P2 pendentes nesta atualização.

final result: passed

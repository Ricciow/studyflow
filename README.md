# StudyFlow

Primeira versão em **React + TypeScript + Vite** de um organizador para estudantes, baseada nas 15 telas fornecidas. Interface em português, vermelho como cor principal, matérias identificadas por cores e cinco áreas de navegação.

## Executar

Requer Node.js 24 ou superior. Dentro da pasta `studyflow`:

```sh
npm ci
npm run dev
```

Abra a URL informada pelo Vite, normalmente http://localhost:5173. O servidor de desenvolvimento aceita `--host` e `--port`.

```sh
npm run build                 # TypeScript + build de produção
npm run check:runtime         # Integridade da prévia de dispositivos
node --test tests/model.test.mjs  # Verificações diretas das regras de datas
```

## O que está funcionando

- **Início:** aulas do dia, tarefas pendentes, meta semanal e atalhos.
- **Agenda:** dia/semana, navegação entre datas, criação e edição de compromissos, recorrência semanal e detalhes. Os eventos da semana também aparecem em uma lista legível para o dia selecionado.
- **Tarefas:** criação e edição, busca por título/matéria, filtros, ordenação por prazo/prioridade, checklist, conclusão e reabertura.
- **Estudos:** criação e edição de matérias, sugestão de distribuição semanal, agendamento de estudos, registro de tempo, provas/trabalhos e relatórios calculados a partir dos registros.
- **Perfil:** edição do nome, e-mail, curso e meta, configuração de rotina e preferências de lembretes internos.
- **Acesso:** boas-vindas como entrada, login com e-mail/senha, mostrar/ocultar senha, cadastro com confirmação de senha e configuração inicial. Recuperação com confirmação simulada e saída pelo Perfil.

O aplicativo abre nas boas-vindas. Use **Começar** para cadastrar um perfil fictício, **Já tenho uma conta** para testar o login ou **Explorar demonstração** para acessar diretamente o painel. No mock, qualquer e-mail válido e senha de pelo menos 6 caracteres permitem entrar; o cadastro confere se as duas senhas coincidem. A senha existe apenas durante o preenchimento e não é salva nem enviada. A recuperação não envia e-mails. A entrada na demo é lembrada neste navegador até usar **Perfil → Sair da demonstração**, que preserva os dados de estudo. Um cadastro ainda em configuração retoma essa etapa após recarregar.

No computador, a prévia mostra uma simulação de celular com seleção de iPhone/Pixel e teclado. No celular, ocupa toda a tela disponível, usa rolagem e teclado nativos e remove moldura, câmera e barras simuladas. A mudança é automática abaixo de 768 px de largura, ou em telas horizontais de até 1023 × 600 px. As áreas seguras e a altura visível do navegador são respeitadas; ainda não há um painel próprio para desktop.

## Dados e limites desta versão

Os dados iniciais são fictícios e usam a data da primeira visita. As alterações são salvas no `localStorage`, com prefixo `studyflow:v1:`. Elas sobrevivem a recarregamentos no mesmo navegador e origem, mas não são sincronizadas entre dispositivos. Limpar os dados do site remove esses registros.

O cadastro/acesso é apenas demonstração: não valida identidade. O campo de senha serve somente ao mock e deve receber um valor fictício. Não existe backend de contas, login Google, recuperação real de senha, upload de anexos ou notificações fora do aplicativo. Todos os perfis simulados compartilham os dados deste navegador; não há isolamento por usuário. As preferências de rotina são armazenadas; não geram automaticamente a grade de aulas. Exclusão de registros, tratamento de conflitos de agenda e sincronização ficam para a próxima etapa.

As telas da referência foram conectadas sem acrescentar botões de integrações inativas. A marca universitária e a foto do exemplo foram substituídas por ícones da biblioteca Radix. A ilustração de boas-vindas foi gerada para este projeto.

## Organização do código

```text
src/
  Prototype.tsx    Navegação e telas da aplicação
  components.tsx   Botões, campos, filtros e elementos comuns
  forms.tsx        Formulários de tarefa, compromisso, matéria e perfil
  onboarding.tsx   Boas-vindas, acesso demonstrativo e configuração
  model.ts         Tipos, exemplos, datas e persistência local
  prototype.css    Estilos e cores do StudyFlow
  mobile/          Infraestrutura da prévia de dispositivos
```

O shell da prévia vem do template Product Design. Para evoluir o aplicativo, concentre alterações nos arquivos específicos acima. `src/App.tsx`, `src/styles.css` e `src/mobile/` pertencem à infraestrutura protegida da prévia. A saída de produção fica em `dist/client`; o template também prepara um Worker para hospedagem no Sites.

Demo: [StudyFlow no Sites](https://studyflow-estudantes-demo.peachyrobin66.chatgpt.site/). Código: [Ricciow/studyflow](https://github.com/Ricciow/studyflow), repositório privado.

O próximo passo de produto é definir autenticação e backend para substituir a persistência local, seguido por exclusão com recuperação, anexos e notificações reais.

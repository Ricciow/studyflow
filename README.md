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
- **Boas-vindas:** ilustração própria e fluxo demonstrativo de cadastro/acesso e configuração. Acesse em Perfil → Conhecer o StudyFlow.

O aplicativo abre no painel para permitir explorar os fluxos imediatamente. A prévia preserva uma simulação de celular com seleção de iPhone/Pixel e teclado. Ela se ajusta ao espaço disponível do navegador; ainda não há um painel próprio para desktop.

## Dados e limites desta versão

Os dados iniciais são fictícios e usam a data da primeira visita. As alterações são salvas no `localStorage`, com prefixo `studyflow:v1:`. Elas sobrevivem a recarregamentos no mesmo navegador e origem, mas não são sincronizadas entre dispositivos. Limpar os dados do site remove esses registros.

O cadastro/acesso é apenas demonstração: não valida identidade e não solicita nem guarda senhas. Não existe backend, login Google, recuperação de senha, upload de anexos ou notificações fora do aplicativo. As preferências de rotina são armazenadas; não geram automaticamente a grade de aulas. Exclusão de registros, tratamento de conflitos de agenda e sincronização ficam para a próxima etapa.

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

O shell da prévia vem do template Product Design. Para evoluir o aplicativo, concentre alterações nos arquivos específicos acima. `src/App.tsx`, `src/styles.css` e `src/mobile/` pertencem à infraestrutura protegida da prévia. A saída de produção fica em `dist/client`; o template também prepara um Worker para hospedagem futura. Nada foi publicado.

O próximo passo de produto é definir autenticação e backend para substituir a persistência local, seguido por exclusão com recuperação, anexos e notificações reais.

# Documentação do Frontend — Sistema de Gestão Acadêmica e Clínica de Fonoaudiologia UNIVALE

**Versão da Documentação:** 1.2  
**Data da Análise:** Setembro de 2026  
**Contexto do Projeto:** Protótipo funcional e validação da interface da Clínica Especializada de Fonoaudiologia da UNIVALE  
**Arquivo Principal Analisado:** `src/app/App.tsx`  

---

## 1. Escopo e Estado Atual do Projeto

Este documento descreve estritamente o **estado atual do Frontend** desenvolvido para a Clínica Especializada de Fonoaudiologia da UNIVALE. 

### 1.1. Natureza do Projeto no Momento Atual
* **Etapa:** Prototipação funcional e validação de interfaces de usuário (UI/UX).
* **Dados:** O Frontend utiliza estruturas de dados demonstrativas (**mockadas em memória**) para simular a interação do usuário com os fluxos operacionais e as regras de negócio.
* **Persistência:** As alterações (inclusões, edições, exclusões e transições de status) ocorrem em memória durante a sessão de uso. Ao recarregar a página no navegador (F5), os dados retornam ao estado inicial pré-definido.
* **Autonomia:** A aplicação opera de forma autônoma no navegador, sem dependência ativa de uma API REST ou servidor de banco de dados conectado no momento.

### 1.2. Classificação de Funcionalidades
Para assegurar total transparência entre o que existe e o que está planejado:
* **Implementado no Frontend:** Interfaces, tabelas, modais, formulários, filtros, buscas, validações locais de formulário, alternância de visualizações e transições de status que podem ser observadas e testadas diretamente na tela.
* **Possíveis Evoluções / Requisitos Futuros:** Evoluções clínicas estruturadas, relatórios consolidados e fluxos que dependem de definição institucional posterior.
* **Dependente de Backend / Integração:** Persistência definitiva em banco de dados relacional (MySQL), autenticação com tokens JWT/sessões seguras, upload real de arquivos/laudos em PDF e envio real de e-mails/notificações.

---

## 2. Objetivo do Sistema no Frontend

O Frontend tem como objetivo prover uma interface integrada e intuitiva para apoiar a **gestão acadêmica** e a **gestão clínica** da Clínica Especializada de Fonoaudiologia da UNIVALE.

A interface contempla recursos organizados para as seguintes entidades do domínio:
* **Alunos:** Cadastro de discentes, controle de RA e visualização de turma/grupo.
* **Professores:** Cadastro de docentes supervisores e visualização de atendimentos orientados.
* **Grupos:** Turmas acadêmicas práticas de estágio curricular supervisionado.
* **Matrículas:** Associação formal entre Aluno, Grupo e Período Letivo.
* **Períodos Letivos:** Semestres acadêmicos com datas de início/término e status.
* **Pacientes:** Cadastro de pacientes da comunidade, código de prontuário, identificação física de pasta e dados de contato.
* **Responsáveis:** Cadastro de contatos/responsáveis legais e seus vínculos com pacientes.
* **Clínicas:** Áreas de especialidade fonoaudiológica (Audiologia, Linguagem, Motricidade Orofacial, Voz).
* **Exames:** Catálogo de exames fonoaudiológicos e vinculação com clínicas e laudos.
* **Atendimentos:** Agenda de sessões clínicas em formato de Lista e Calendário mensal.
* **Usuários:** Controle de contas de acesso e perfis de permissão.
* **Dashboard:** Painel analítico adaptativo conforme o perfil do usuário logado.
* **Notificações:** Central de avisos com atalhos para os módulos correspondentes.

> [!NOTE]
> Todos os dados visualizados, cadastrados ou editados no protótipo atual são mantidos em estruturas em memória no cliente e não estão sendo gravados em banco de dados definitivo.

---

## 3. Arquitetura e Tecnologias Utilizadas

O Frontend é desenvolvido em **React** com **TypeScript** e utiliza uma estrutura de componentes e páginas para representar as funcionalidades do sistema. Parte das informações atualmente é mantida em estruturas de dados mockadas em memória para fins de demonstração e validação das interfaces.

### 3.1. Stack Tecnológica
* **React 18.3.1:** Biblioteca base para a construção da interface declarativa em componentes.
* **TypeScript:** Tipagem estática para entidades, propriedades de componentes e estados da aplicação.
* **Vite 6:** Ambiente de desenvolvimento e empacotamento rápido.
* **Tailwind CSS v4:** Framework de estilização com classes utilitárias e variáveis de tema.
* **Lucide React (v0.487.0):** Conjunto abrangente de ícones vetoriais.
* **Recharts (v2.15.2):** Biblioteca de gráficos para renderização dos indicadores no Dashboard.
* **Radix UI:** Coleção de primitivos de interface acessíveis instalados no projeto.

### 3.2. Gerenciamento de Estado e Navegação
* A navegação entre as telas é controlada por estado reativo no componente raiz (`App.tsx`), por meio do hook `useState<Page>("dashboard")`.
* A função `navigate(page, id)` permite a transição direta entre listagens e visões de detalhe (Master-Detail).
* O controle de acesso renderiza os itens da barra lateral e restringe as páginas conforme o perfil de usuário ativo.

---

## 4. Dados Mockados e Modelo em Memória

O Frontend utiliza dados demonstrativos em memória para representar entidades como usuários, alunos, professores, pacientes, responsáveis, grupos, matrículas, períodos letivos, atendimentos, clínicas e exames.

### 4.1. Estrutura de Mock (`DB`)
O objeto `DB` em memória contém coleções pré-populadas que simulam a integridade relacional entre as entidades:
* `DB.usuarios`: Contas de acesso com credenciais de demonstração.
* `DB.professores`: Registro de docentes, com campo opcional de associação ao usuário (`id_usuario`).
* `DB.alunos`: Registro de estudantes com RA e vínculo de usuário.
* `DB.pacientes`: Ficha do paciente com código de prontuário (`PRONT-xxx`), identificação do arquivo físico e CPF opcional.
* `DB.responsaveis` e `DB.responsaveis_pacientes`: Dados de contato (WhatsApp/telefone obrigatório) e grau de parentesco com pacientes.
* `DB.grupos`: Identificação dos grupos de estágio acadêmico.
* `DB.periodos`: Períodos semestrais com intervalo de datas.
* `DB.matriculas`: Associação Aluno + Grupo + Período Letivo.
* `DB.atendimentos`: Consultas com datas, horários e status.
* `DB.professores_atendimentos`, `DB.matricula_atendimentos`, `DB.atendimentos_clinicas`: Associações do atendimento com professor, aluno e clínica.
* `DB.clinicas`, `DB.exames` e `DB.clinicas_exames`: Especialidades, exames e observações/documentos indicativos.

### 4.2. Persistência
A persistência definitiva das informações depende da futura integração com o backend/API REST e o banco de dados institucional.

---

## 5. Telas e Funcionalidades do Protótipo

A aplicação organiza suas telas em quatro grandes áreas no menu lateral, além da tela de autenticação e das telas de detalhamento:

```
├── Autenticação (Login)
├── Principal
│   ├── Dashboard (Gestão / Professor / Aluno)
│   └── Agenda de Atendimentos (Lista / Calendário / Detalhe)
├── Gestão Acadêmica
│   ├── Alunos (Listagem / Detalhe)
│   ├── Professores (Listagem / Detalhe)
│   ├── Grupos
│   ├── Matrículas
│   └── Períodos Letivos
├── Gestão Clínica
│   ├── Pacientes (Listagem / Detalhe)
│   ├── Responsáveis
│   ├── Clínicas
│   └── Exames
└── Administração
    ├── Usuários
    └── Configurações / Perfil
```

A seguir, descreve-se cada uma das telas presentes no código atual.

---

## 6. Tela de Login (`login`)

* **Objetivo:** Ponto de entrada do sistema para autenticação e escolha do perfil de navegação.
* **Campos do Formulário:**
  * `E-mail`: Campo de texto com ícone e validação de preenchimento.
  * `Senha`: Campo de senha com máscara de caracteres.
* **Botões e Ações:**
  * Botão **"Entrar"**: Valida as credenciais digitadas contra os usuários do mock em memória e direciona ao Dashboard correspondente.
  * Link **"Esqueci minha senha"**: Elemento interativo de interface.
  * Botões de **"Acesso rápido (demo)"**: Atalhos que preenchem automaticamente e-mail e senha para os perfis **Admin**, **Secretaria**, **Coordenador**, **Professor** e **Aluno**.
* **Observações:** O login opera localmente no protótipo para fins de teste de usabilidade e alternância de perfis, sem conexão com serviço externo de autenticação.

---

## 7. Dashboard (`dashboard`)

* **Objetivo:** Painel de visão geral com métricas, gráficos e atalhos rápidos. Apresenta três variações conforme o perfil logado.

### 7.1. Visão de Gestão (Admin, Secretaria e Coordenador)
* **Indicadores Numéricos (Cards):**
  * `Alunos Ativos`: Contagem total de alunos com situação ativa.
  * `Professores`: Contagem de professores ativos.
  * `Pacientes`: Total de pacientes cadastrados.
  * `Matrículas Ativas`: Total de matrículas ativas no período.
  * `Agendados`: Atendimentos com situação `AGENDADO`.
  * `Realizados`: Atendimentos com situação `REALIZADO`.
  * `Pendências`: Atendimentos com situação `FALTOU` ou `REMARCADO`.
* **Gráficos Interativos (Recharts):**
  * *Atendimentos por Mês:* Gráfico de barras comparando realizados, agendados e cancelados por mês.
  * *Situação dos Atendimentos:* Gráfico em donut com legenda colorida por situação (Realizados, Agendados, Cancelados, Faltou, Remarcados).
* **Listas de Acompanhamento:**
  * *Próximos Atendimentos:* Lista com nome do paciente, professor orientador, data/hora e badge de status.
  * *Alunos Recentes:* Lista com nome do aluno, RA, grupo vinculado e status, com clique para abrir o detalhe do aluno.
* **Botões de Ação Rápida:**
  * `Novo Aluno`: Redireciona para a tela de Alunos.
  * `Novo Paciente`: Redireciona para a tela de Pacientes.
  * `Novo Atendimento`: Redireciona para a tela de Atendimentos.

### 7.2. Visão do Professor
* **Indicadores:** Atendimentos Hoje, Próximos Atendimentos, Total de Pacientes e Realizados.
* **Listagem:** Tabela "Meus Atendimentos" com os atendimentos vinculados ao docente.

### 7.3. Visão do Aluno
* **Painel de Dados:** Nome, RA, e-mail institucional e situação cadastral.
* **Painel da Matrícula:** Grupo atual, período letivo, data de início e situação da matrícula.
* **Listagem:** "Meus Atendimentos" com as sessões atribuídas à sua matrícula.

---

## 8. Módulo de Professores (`professores` e `professor-detalhe`)

* **Objetivo:** Gestão dos docentes supervisores de estágio clínico.

### 8.1. Listagem de Professores
* **Informações Exibidas na Tabela:**
  * `Nome`: Nome completo do professor e e-mail do usuário vinculado (quando houver).
  * `E-mail`: E-mail de contato do professor.
  * `Telefone`: Telefone/celular ou traço informativo.
  * `Cadastro`: Data de cadastro formatada.
  * `Situação`: Badge de status (`ATIVO` ou `INATIVO`).
  * `Ações`: Botões de Visualizar (abre detalhe), Editar e Excluir.
* **Filtros e Buscas:**
  * Campo de busca textual por nome ou e-mail.
  * Seletor de situação (`Todas as situações`, `Ativo`, `Inativo`).
  * Contador de registros exibidos vs. total.
* **Ação de Criação:** Botão **"Novo Professor"** abre modal de cadastro.

### 8.2. Modal de Cadastro / Edição de Professor
* **Campos:**
  * Vínculo de Usuário (opcional, lista usuários com perfil PROFESSOR).
  * Nome Completo (obrigatório).
  * E-mail (obrigatório, validação de formato e duplicidade).
  * Telefone (opcional).
  * Situação (`ATIVO` ou `INATIVO`).

### 8.3. Tela de Detalhe do Professor (`professor-detalhe`)
* Breadcrumb navegável e botão voltar.
* Informações pessoais e de contato.
* Botão para **Editar** e botão **"Alternar Situação"** (ativa/inativa o docente).
* Tabela de histórico com todos os atendimentos orientados pelo professor.

---

## 9. Módulo de Alunos (`alunos` e `aluno-detalhe`)

* **Objetivo:** Gestão dos estudantes do curso de Fonoaudiologia matriculados em atividades práticas.

### 9.1. Listagem de Alunos
* **Informações Exibidas na Tabela:**
  * `Nome`: Nome do estudante e e-mail do usuário vinculado (se houver).
  * `RA`: Registro Acadêmico em fonte monoespaçada.
  * `E-mail`: E-mail institucional do aluno.
  * `Telefone`: Telefone de contato.
  * `Grupo Atual`: Nome do grupo de estágio e período letivo em pílula colorida (ou "—").
  * `Situação`: Badge de status (`ATIVO` ou `INATIVO`).
  * `Ações`: Visualizar (abre detalhe), Editar e Excluir.
* **Filtros e Buscas:**
  * Busca por nome, RA ou grupo.
  * Filtro por situação (`Ativo`, `Inativo`).
* **Ação de Criação:** Botão **"Novo Aluno"** abre modal de cadastro.

### 9.2. Modal de Cadastro / Edição de Aluno
* **Campos:**
  * Nome completo (obrigatório).
  * RA (preenchido com sugestão automática do próximo sequencial ou editável).
  * E-mail (obrigatório, com validação de formato e unicidade).
  * Telefone.
  * Vínculo com Usuário do sistema (opcional).
  * Situação (`ATIVO` ou `INATIVO`).
  * Grupo Acadêmico inicial (opcional).
  * Período Letivo da matrícula.

### 9.3. Tela de Detalhe do Aluno (`aluno-detalhe`)
* Informações cadastrais completas do aluno.
* Painel de **Matrículas**: Lista dos grupos e períodos letivos em que o aluno já esteve matriculado.
* Painel de **Atendimentos**: Tabela com histórico de atendimentos clínicos realizados pelo aluno, indicando paciente, professor orientador, clínica e situação.

---

## 10. Módulo de Grupos Acadêmicos (`grupos`)

* **Objetivo:** Organização e visualização das turmas de estágio prático supervisionado.
* **Visualização em Cards:** Cada grupo é apresentado em um card contendo:
  * Nome do grupo (ex: *Grupo A*, *Grupo B*).
  * Badge de situação (`ATIVO` ou `INATIVO`).
  * Períodos letivos associados.
  * Contagem de alunos matriculados ativos.
  * Minilista com os nomes e RAs dos alunos vinculados ao grupo.
  * Botões de **Editar** e **Excluir**.
* **Filtros e Buscas:** Busca textual por nome do grupo e filtro de situação.
* **Modal de Novo Grupo:** Campo para nome do grupo (com sugestão da próxima letra disponível), situação e período letivo principal.

---

## 11. Módulo de Matrículas (`matriculas`)

* **Objetivo:** Registro formal da vinculação do aluno a um grupo e a um período letivo.
* **Informações Exibidas na Tabela:**
  * `Aluno`: Nome e e-mail do estudante com avatar de inicial.
  * `RA`: Registro Acadêmico.
  * `Grupo`: Nome do grupo (ex: *Grupo A*).
  * `Período`: Período letivo correspondente (ex: *2025/1*).
  * `Início`: Data de início da vigência.
  * `Término`: Data de término da vigência.
  * `Situação`: Badge de status (`ATIVA`, `ENCERRADA`, `CANCELADA`, `TRANCADA`).
  * `Ações`: Editar e Excluir.
* **Filtros:** Busca por aluno, RA ou grupo; seletor de grupo específico; seletor de situação.
* **Modal de Matrícula:** Seleção de Aluno, Grupo, Período Letivo, datas de início/fim e situação. Valida para impedir matrícula duplicada do mesmo aluno no mesmo grupo/período.

---

## 12. Módulo de Períodos Letivos (`periodos`)

* **Objetivo:** Cadastro e controle dos semestres acadêmicos da instituição.
* **Informações Exibidas na Tabela:**
  * `Período`: Identificação do semestre (ex: *2024/1*, *2024/2*, *2025/1*).
  * `Data Inicial`: Data de início do semestre letivo.
  * `Data Final`: Data de encerramento do semestre.
  * `Matrículas Ativas`: Contador com total de matrículas ativas vinculadas.
  * `Situação`: Badge de status (`ATIVO`, `ENCERRADO`, `CANCELADO`).
  * `Ações`: Editar e Excluir.
* **Filtros e Buscas:** Busca por nome do período e filtro de situação.
* **Modal de Cadastro / Edição:** Campo do período (com sugestão automática do próximo semestre), datas inicial e final (com validação para garantir que data final seja maior ou igual à inicial) e situação.

---

## 13. Módulo de Pacientes (`pacientes` e `paciente-detalhe`)

* **Objetivo:** Gestão cadastral dos pacientes atendidos na clínica-escola.

### 13.1. Regras de Negócio de Dados do Paciente
* **CPF do Paciente (OPCIONAL):** O CPF do paciente é um campo **opcional** (em total conformidade com a modelagem do backend). Isso permite o atendimento de crianças e pacientes que não disponham do documento no momento do acolhimento. Quando informado, o CPF é validado para evitar duplicidades e serve como dado complementar de identificação.
* **Comunicação e Contato (OBRIGATÓRIO):** Não são coletados e-mails dos pacientes como canal de contato. Para assegurar a comunicação da clínica com o paciente (ou seu responsável legal) sobre agendamentos, faltas e avisos, o **Telefone / WhatsApp** é o dado de contato indispensável e obrigatório no cadastro.

### 13.2. Listagem de Pacientes
* **Informações Exibidas na Tabela:**
  * `Prontuário`: Código do prontuário em fonte monoespaçada e destaque (ex: *PRONT-001*).
  * `Nome`: Nome completo do paciente e idade calculada automaticamente a partir da data de nascimento.
  * `Nascimento`: Data de nascimento formatada.
  * `CPF`: Documento CPF do paciente (quando cadastrado) ou traço indicativo.
  * `Local Físico`: Descrição da pasta no arquivo físico da clínica (ex: *Arquivo A — Gaveta 3*).
  * `Situação`: Badge de status (`ATIVO`, `INATIVO`, `ALTA`, `ARQUIVADO`).
  * `Ações`: Botões de Visualizar Prontuário (abre detalhe), Editar e Excluir.
* **Filtros e Buscas:** Busca por nome, código de prontuário ou CPF; filtro por situação (`ATIVO`, `INATIVO`, `ALTA`, `ARQUIVADO`).

### 13.3. Modal de Cadastro / Edição de Paciente
* **Campos:**
  * Código do Prontuário (com gerador sequencial automático, ex: *PRONT-006*).
  * Nome completo (obrigatório).
  * Data de nascimento (obrigatório).
  * CPF (opcional; quando informado, valida duplicidade).
  * Localização física do prontuário (gaveta/pasta de arquivo).
  * Situação do paciente.
  * Vínculo opcional com Responsável já existente e Grau de Parentesco.

### 13.4. Tela de Detalhe do Paciente (`paciente-detalhe`)
* Informações completas do paciente com idade calculada.
* Painel de **Responsáveis**: Lista de familiares/responsáveis vinculados com grau de parentesco, telefone/WhatsApp de contato e observações.
* Botão de alternância rápida de status (Ativar / Inativar).
* Painel de **Histórico de Atendimentos**: Tabela com todas as consultas do paciente, horários agendados e realizados, professor supervisor, aluno responsável, clínica e status.

---

## 14. Módulo de Responsáveis (`responsaveis`)

* **Objetivo:** Cadastro de pais, cônjuges, tutores e contatos de emergência de pacientes.
* **Regra de Contato:** O número de **Telefone / WhatsApp é obrigatório**, garantindo que a clínica disponha de um canal direto e funcional de comunicação com a família do paciente.
* **Informações Exibidas na Tabela:**
  * `Nome`: Nome completo do responsável e minilista com nomes dos pacientes vinculados e parentesco.
  * `CPF`: Documento CPF do responsável.
  * `WhatsApp`: Número de telefone / WhatsApp de contato.
  * `Pacientes Vinculados`: Badge com contagem de dependentes associados.
  * `Situação`: Badge de status (`ATIVO` ou `INATIVO`).
  * `Ações`: Editar e Excluir.
* **Filtros e Buscas:** Busca por nome, CPF ou WhatsApp; filtro de situação.
* **Modal de Cadastro / Edição:** Nome completo (obrigatório), CPF (obrigatório com validação de duplicidade), WhatsApp/telefone (obrigatório), situação, seleção de paciente para vínculo e grau de parentesco.

---

## 15. Módulo de Agenda de Atendimentos (`atendimentos` e `atendimento-detalhe`)

* **Objetivo:** Central de agendamento e registro operacional das sessões clínicas fonoaudiológicas.

### 15.1. Visualização em Lista
* **Informações Exibidas na Tabela:**
  * `Data/Hora`: Data e horário agendados formatados.
  * `Paciente`: Nome do paciente e código do prontuário.
  * `Professor`: Nome do docente supervisor vinculado.
  * `Aluno`: Nome do estudante responsável pelo atendimento.
  * `Clínica`: Área especializada (Audiologia, Linguagem, Motricidade Orofacial, Voz).
  * `Situação`: Badge de status (`AGENDADO`, `REALIZADO`, `CANCELADO`, `FALTOU`, `REMARCADO`).
  * `Ações`: Ver detalhes, Editar e Excluir.

### 15.2. Visualização em Calendário
* Navegação mensal (mês anterior / próximo mês).
* Grid com os dias do mês e dias da semana (Dom a Sáb).
* Cada dia exibe a contagem de atendimentos e cards coloridos individuais com horário, nome do paciente e situação.
* Clique no dia permite agendamento rápido com a data pré-selecionada.

### 15.3. Modal de Novo Atendimento / Edição
* **Campos do Formulário:**
  * Paciente (seleção a partir da lista de pacientes cadastrados).
  * Data do atendimento.
  * Horário da sessão.
  * Professor supervisor responsável.
  * Aluno / Matrícula responsável pela condução.
  * Clínica especializada.
  * Situação (`AGENDADO`, `REALIZADO`, `CANCELADO`, `FALTOU`, `REMARCADO`).
  * Campo aberto de **Observações**.
* **Painel de Resumo (Live Preview):** Exibe em tempo real o resumo com paciente, professor, aluno e clínica selecionados antes de confirmar.

### 15.4. Tela de Detalhes do Atendimento (`atendimento-detalhe`)
* Informações completas da sessão (data agendada, data realizada, situação).
* Botões de transição rápida de status: **"Marcar Realizado"** (preenche data de realização), **"Remarcar"** e **"Cancelar"**.
* Cards dedicados para o Paciente, Professor, Aluno/Matrícula e Clínica, com links diretos para suas respectivas fichas.
* Seção de observações do atendimento.

> [!NOTE]
> Esta tela representa o registro operacional de agendamento e execução da sessão de estágio, não constituindo um prontuário eletrônico clínico completo com evolução multiprofissional.

---

## 16. Módulo de Clínicas Especializadas (`clinicas`)

* **Objetivo:** Gestão das áreas especializadas de atendimento da instituição.
* **Visualização em Cards:**
  * Nome da clínica (ex: *Linguagem*, *Motricidade Orofacial*, *Audiologia*, *Voz*).
  * Total de atendimentos realizados naquela especialidade.
  * Badge de situação (`ATIVO` ou `INATIVO`).
  * Pílulas com os exames fonoaudiológicos vinculados à clínica.
  * Botões de **Editar** e **Excluir**.
* **Filtros e Buscas:** Busca por nome da clínica e filtro de situação.
* **Modal de Cadastro / Edição:** Campo para nome da clínica (com validação de duplicidade) e seletor de situação.

---

## 17. Módulo de Exames Fonoaudiológicos (`exames`)

* **Objetivo:** Gestão do catálogo de exames fonoaudiológicos e associação com as clínicas especializadas.
* **Estrutura em Duas Seções na Interface:**
  1. **Exames Cadastrados (Card da Esquerda):**
     * Tabela com Nome do Exame (ex: *Audiometria Tonal*, *Avaliação Miofuncional Orofacial*, *Análise Acústica da Voz*, *Avaliação de Linguagem*), Situação e Ações de edição/exclusão.
     * Busca textual e filtro de situação.
     * Botão "Novo Exame".
  2. **Relações Clínica / Exame (Card da Direita):**
     * Tabela que exibe qual clínica realiza qual exame, contendo parecer/observação técnica e indicação de documento anexado.
     * Botão "Relacionar Clínica/Exame".
     * Ação de anexação/remoção simulada de documento (`doc_nome_xxxx.pdf`).

> [!IMPORTANT]
> **Sobre anexação de laudos/documentos:** A interface simula a indicação do nome do arquivo (`path_documento`) para validação visual. Não existe upload real de arquivos binários nem armazenamento em servidor no protótipo atual.

---

## 18. Módulo de Usuários e Administração (`usuarios`)

* **Objetivo:** Controle das contas de acesso ao sistema e seus níveis de permissão.
* **Informações Exibidas na Tabela:**
  * `Nome`: Nome completo do usuário.
  * `E-mail`: E-mail de login.
  * `Perfil`: Badge colorida identificando o perfil (`ADMIN`, `SECRETARIA`, `COORDENADOR`, `PROFESSOR`, `ALUNO`).
  * `Situação`: Badge de status (`ATIVO`, `INATIVO`, `BLOQUEADO`).
  * `Cadastro`: Data de criação da conta.
  * `Ações`: Editar e Excluir.
* **Filtros e Buscas:** Busca por nome ou e-mail; filtro por perfil; filtro por situação.
* **Modal de Usuário:** Nome, e-mail (com validação de formato e unicidade), senha (mínimo de 6 caracteres na criação), perfil de acesso e situação.

---

## 19. Central de Notificações

* **Objetivo:** Barra superior com contador interativo de notificações do protótipo.
* **Recursos da Central:**
  * **Ícone de Sino no Header:** Exibe badge vermelha com a contagem de notificações não lidas.
  * **Filtros:** Abas para alternar entre "Todas" e "Não lidas".
  * **Ações Globais:** Botão "Marcar lidas" e botão "Limpar tudo".
  * **Categorização Visual:** Ícones e cores para diferentes tipos de notificações (*atendimento*, *exame*, *matrícula*, *professor*, *sistema*).
  * **Navegação Contextual:** Clicar em uma notificação marca o item como lido e redireciona automaticamente o usuário para a tela e o registro correspondente.
* **Observações:** As notificações são geradas a partir de dados demonstrativos do Frontend para testar a experiência de uso.

---

## 20. Configurações e Perfil do Usuário (`perfil`)

* **Objetivo:** Painel de autoatendimento para o usuário logado gerenciar sua conta e preferências.
* **Funcionalidades Presentes:**
  * **Dados do Perfil:** Exibe nome, e-mail, perfil e situação. Botão "Editar Perfil" abre modal para alterar nome e e-mail.
  * **Segurança da Conta:** Botão "Alterar Senha" abre modal com campos de senha atual, nova senha, confirmação de senha e indicador visual de força da senha (fraca, média, forte).
  * **Preferências de Uso:** Opções em switches/toggles para notificações por e-mail, lembretes de atendimento, confirmação de exclusão e densidade de tabela.

---

## 21. Matriz de Perfis e Permissões no Frontend

O sistema conta com **5 perfis de acesso** distintos, garantindo que a interface se adapte às responsabilidades de cada usuário. Professores e alunos possuem acessos específicos dedicados às suas atividades práticas:

| Módulo / Tela | ADMIN | SECRETARIA | COORDENADOR | PROFESSOR | ALUNO |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Dashboard** | Visão Gestão | Visão Gestão | Visão Gestão | Visão Professor | Visão Aluno |
| **Agenda de Atendimentos** | Sim | Sim | Sim | Sim (Orientados) | Sim (Próprios) |
| **Alunos** | Sim | Sim | Sim | Não | Não |
| **Professores** | Sim | Não | Sim | Não | Não |
| **Grupos** | Sim | Sim | Sim | Não | Não |
| **Matrículas** | Sim | Sim | Sim | Não | Sim (Consulta Própria) |
| **Períodos Letivos** | Sim | Sim | Não | Não | Não |
| **Pacientes** | Sim | Sim | Sim | Sim | Não |
| **Responsáveis** | Sim | Sim | Não | Não | Não |
| **Clínicas** | Sim | Sim | Sim | Não | Não |
| **Exames** | Sim | Sim | Sim | Não | Não |
| **Usuários** | Sim | Não | Não | Não | Não |
| **Perfil / Configurações** | Sim | Sim | Sim | Sim | Sim |

* **ADMIN:** Acesso irrestrito a todos os módulos e controle total de usuários.
* **SECRETARIA:** Foco em cadastros acadêmicos, matrículas, períodos letivos, pacientes, responsáveis e agendamentos.
* **COORDENADOR:** Gestão acadêmica e clínica (docentes, discentes, turmas, clínicas e exames), sem acesso à administração de usuários do sistema.
* **PROFESSOR:** Acesso ao Dashboard docente, lista de atendimentos sob sua supervisão, consulta de pacientes e configurações de perfil.
* **ALUNO:** Acesso ao Dashboard discente com dados da matrícula e grupo atual, acompanhamento de suas sessões clínicas agendadas e perfil.

---

## 22. Funcionalidades Implementadas no Protótipo Frontend

As interfaces, navegação, formulários, filtros, ações e interações descritas abaixo estão implementadas no protótipo Frontend com dados mockados em memória:

* [x] **Autenticação Simulada:** Tela de login com validação local e atalhos rápidos para alternância entre 5 perfis demo.
* [x] **Painéis Adaptativos:** Dashboard com indicadores e gráficos Recharts para gestão, além de versões direcionadas para professor e aluno.
* [x] **Controle Visual de Acesso:** Menu lateral que filtra as opções disponíveis conforme o perfil ativo.
* [x] **Operações de Cadastro (CRUD) em Memória:**
  * Criação, edição e exclusão de Usuários, Professores, Alunos, Pacientes, Responsáveis, Grupos, Períodos Letivos, Matrículas, Clínicas e Exames.
* [x] **Validações de Formulário Locais:**
  * Verificação de campos obrigatórios (incluindo Telefone/WhatsApp de contato).
  * Campo de CPF do paciente tratado como opcional (com validação de duplicidade quando informado).
  * Validação de formato de e-mail e checagem de unicidade.
  * Validação de duplicidade de CPF (responsáveis), RA, Prontuário, Período e Nome de Clínica/Grupo.
  * Validação de intervalo de datas em períodos letivos.
* [x] **Visualização Dupla de Agenda:** Alternância entre tabela com filtros e calendário mensal navegável.
* [x] **Transição de Estados de Atendimento:** Ações diretas no detalhe do atendimento para marcar como realizado, remarcar ou cancelar.
* [x] **Central de Notificações:** Dropdown com contadores, filtros de leitura e redirecionamento por clique.
* [x] **Gestão de Conta:** Modais para edição de dados pessoais e alteração de senha com cálculo de força.
* [x] **Feedback ao Usuário:** Toasts flutuantes temporários confirmando operações de sucesso ou reportando erros.

---

## 23. Limitações Atuais do Protótipo

Com base na análise do código atual, registram-se as seguintes limitações técnicas:

1. **Dados em Memória:** As alterações efetuadas pelo usuário não persistem após atualização da página (F5) ou encerramento da sessão do navegador.
2. **Ausência de Backend / API REST Conectada:** Não há comunicação HTTP com servidores remotos ou autenticação baseada em tokens JWT.
3. **Ausência de Upload Real de Arquivos:** Os campos de laudos/documentos em exames operam com nomes de arquivos simulados em texto.
4. **Navegação Interna por Estado:** O roteamento é controlado via state no componente raiz, sem alteração da URL no histórico do navegador.
5. **Paginação Formal de Dados:** As listagens renderizam a totalidade dos registros em scroll contínuo.
6. **Máscaras de Entrada:** Campos como CPF e telefone utilizam inputs padrão com validação no envio, sem formatação automática enquanto o usuário digita.

---

## 24. Possíveis Evoluções e Funcionalidades Futuras

Os itens a seguir representam possíveis evoluções funcionais e melhorias técnicas que podem ser implementadas em etapas futuras do projeto, dependendo de integração com backend ou definições institucionais:

* **Integração com Backend e Banco de Dados:** Conexão com API RESTful e banco de dados relacional para persistência permanente dos dados.
* **Prontuário Fonoaudiológico Detalhado:** Possível inclusão de formulários estruturados para anotações de evolução de sessão (anamnese, metas terapêuticas e pareceres).
* **Fluxo de Validação Docente:** Possibilidade de criação de uma etapa formal de aprovação pedagógica pelo professor orientador antes do encerramento da sessão.
* **Upload e Visualização de Laudos:** Implementação de envio e visualização real de arquivos em PDF de exames audiológicos e fonoaudiológicos.
* **Módulo de Acolhimento e Triagem:** Possível estruturação de fila de espera ou acolhimento prévio antes da admissão do paciente.
* **Termos de Consentimento Didático (TCLE):** Registro eletrônico de aceite para fins pedagógicos e atendimento em clínica-escola.

---

## 25. Instruções para Execução do Protótipo

### Executando o Projeto Localmente:
```bash
# 1. Instalação das dependências
npm install

# 2. Execução do servidor de desenvolvimento
npm run dev
```

### Contas de Demonstração Pré-configuradas:
| Perfil | E-mail | Senha |
| :--- | :--- | :--- |
| **Administrador** | `admin.sistema@univale.br` | `admin123` |
| **Secretaria** | `maria.secretaria@univale.br` | `sec123` |
| **Coordenador** | `joao.ferreira@univale.br` | `coord123` |
| **Professor** | `carlos.lima@univale.br` | `prof123` |
| **Aluno** | `ana.souza@univale.br` | `aluno123` |

---
*Documento elaborado para registro e validação do protótipo Frontend da Clínica Especializada de Fonoaudiologia UNIVALE.*

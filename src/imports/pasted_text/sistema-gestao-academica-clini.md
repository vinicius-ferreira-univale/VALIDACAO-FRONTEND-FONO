Crie um sistema web completo de gestão acadêmica e clínica, baseado na estrutura de banco de dados descrita abaixo.

O objetivo é criar um frontend moderno, profissional, intuitivo e responsivo para uma instituição de ensino que realiza atendimentos clínicos vinculados aos alunos, professores, pacientes, grupos, períodos letivos, clínicas e exames.

IMPORTANTE:

* Crie apenas o frontend/protótipo funcional da interface.
* Utilize dados fictícios/mockados para preencher as telas.
* Não invente entidades que não estejam relacionadas ao modelo apresentado.
* As telas devem refletir os relacionamentos existentes no banco de dados.
* Utilize português do Brasil em toda a interface.
* Use nomenclaturas simples e profissionais.
* O sistema deve parecer um software real utilizado por uma secretaria/coordenação acadêmica e clínica.
* Priorize usabilidade, organização das informações e facilidade de navegação.
* O layout deve ser desktop-first, mas responsivo para tablet e celular.
* Utilize componentes reutilizáveis, como tabelas, cards, formulários, modais, filtros, badges de situação, menus e caixas de confirmação.

==================================================

1. IDENTIDADE VISUAL
   ==================================================

Crie uma interface com aparência moderna, institucional e profissional.

Estilo:

* Interface limpa e organizada.
* Sidebar lateral fixa.
* Barra superior com busca, notificações e usuário logado.
* Cards com bordas suaves.
* Tabelas bem organizadas.
* Formulários divididos em seções.
* Badges coloridos para indicar situações.
* Botões primários, secundários e de ações.
* Ícones simples e consistentes.
* Boa hierarquia visual.
* Espaçamento confortável.
* Tipografia moderna e legível.

Utilize uma paleta visual relacionada à área de educação e saúde, transmitindo confiança, organização e tecnologia.

Evite aparência excessivamente hospitalar ou excessivamente acadêmica. O sistema deve equilibrar os dois contextos.

==================================================
2. PERFIS DE USUÁRIO
====================

O sistema possui os seguintes perfis:

* ADMIN
* SECRETARIA
* PROFESSOR
* ALUNO
* COORDENADOR

Crie uma interface preparada para controle de acesso por perfil.

O menu e as funcionalidades apresentadas devem mudar de acordo com o perfil do usuário.

Exemplo:

ADMIN:

* Acesso completo ao sistema.
* Usuários.
* Professores.
* Alunos.
* Pacientes.
* Responsáveis.
* Grupos.
* Clínicas.
* Exames.
* Períodos letivos.
* Matrículas.
* Atendimentos.
* Relatórios/configurações.

SECRETARIA:

* Alunos.
* Pacientes.
* Responsáveis.
* Matrículas.
* Grupos.
* Períodos letivos.
* Atendimentos.
* Clínicas.
* Exames.

COORDENADOR:

* Dashboard.
* Professores.
* Alunos.
* Grupos.
* Matrículas.
* Atendimentos.
* Pacientes.
* Clínicas.
* Exames.
* Relatórios.

PROFESSOR:

* Dashboard.
* Meus atendimentos.
* Pacientes relacionados aos atendimentos.
* Informações dos atendimentos.
* Observações.

ALUNO:

* Dashboard.
* Minha matrícula.
* Meu grupo.
* Meus atendimentos.
* Informações dos atendimentos.
* Perfil.

==================================================
3. AUTENTICAÇÃO
===============

Crie uma tela de login.

Campos:

* E-mail
* Senha

Elementos:

* Logo/nome do sistema
* Botão "Entrar"
* Link "Esqueci minha senha"
* Mensagem de erro para credenciais inválidas

Após o login, direcionar o usuário para o dashboard correspondente ao seu perfil.

==================================================
4. DASHBOARD
============

Crie um dashboard diferente de acordo com o perfil.

Para ADMIN/SECRETARIA/COORDENADOR:

Exibir cards com:

* Total de alunos ativos
* Total de professores ativos
* Total de pacientes
* Atendimentos agendados
* Atendimentos realizados
* Atendimentos pendentes
* Matrículas ativas

Adicionar:

* Gráfico de atendimentos por período
* Gráfico de situação dos atendimentos
* Lista de próximos atendimentos
* Lista de alunos/pacientes recentes
* Atalhos rápidos para cadastrar aluno, paciente e atendimento

Para PROFESSOR:

Exibir:

* Atendimentos de hoje
* Próximos atendimentos
* Total de pacientes atendidos
* Atendimentos realizados
* Atendimentos cancelados

Para ALUNO:

Exibir:

* Dados do aluno
* RA
* Grupo atual
* Período letivo
* Situação da matrícula
* Próximos atendimentos
* Histórico de atendimentos

==================================================
5. USUÁRIOS
===========

Criar uma tela de gerenciamento de usuários.

Tabela com:

* Nome
* E-mail
* Perfil
* Situação
* Data de criação
* Ações

Filtros:

* Nome
* E-mail
* Perfil
* Situação

Ações:

* Visualizar
* Editar
* Alterar situação
* Excluir, quando permitido

Formulário de usuário:

* Nome
* E-mail
* Senha
* Perfil
* Situação

Perfis disponíveis:
ADMIN, SECRETARIA, PROFESSOR, ALUNO, COORDENADOR

Situações:
ATIVO, INATIVO, BLOQUEADO

==================================================
6. PROFESSORES
==============

Criar tela de gerenciamento de professores.

Tabela:

* Nome completo
* E-mail
* Telefone
* Data de cadastro
* Situação
* Ações

Formulário:

* Usuário vinculado
* Nome completo
* E-mail
* Telefone
* Situação

O professor possui relacionamento com um usuário do sistema.

Na página de detalhes do professor mostrar:

* Informações pessoais
* Informações de acesso
* Atendimentos vinculados
* Quantidade de atendimentos realizados
* Próximos atendimentos

==================================================
7. ALUNOS
=========

Criar tela de gerenciamento de alunos.

Tabela:

* Nome
* RA
* E-mail
* Telefone
* Situação
* Ações

Filtros:

* Nome
* RA
* E-mail
* Situação

Formulário:

* Nome
* E-mail
* Telefone
* RA
* Usuário vinculado
* Situação

Na tela de detalhes do aluno mostrar:

DADOS DO ALUNO

* Nome
* RA
* E-mail
* Telefone
* Situação

MATRÍCULA

* Grupo
* Período letivo
* Data inicial
* Data final
* Situação

ATENDIMENTOS

* Data
* Horário
* Professor
* Paciente relacionado
* Clínica
* Situação

==================================================
8. PACIENTES
============

Criar uma área específica para gerenciamento de pacientes.

Tabela:

* Código do prontuário
* Nome completo
* Data de nascimento
* CPF
* Local físico do prontuário
* Situação
* Ações

Filtros:

* Nome
* Código do prontuário
* CPF
* Situação

Situações:
ATIVO
INATIVO
ALTA
ARQUIVADO

Formulário:

* Código do prontuário
* Local físico do prontuário
* Nome completo
* Data de nascimento
* CPF
* Situação

Na tela de detalhes do paciente apresentar:

DADOS DO PACIENTE

* Nome
* Data de nascimento
* CPF
* Código do prontuário
* Local físico do prontuário
* Situação

RESPONSÁVEIS
Mostrar responsáveis relacionados ao paciente.

Campos:

* Nome
* CPF
* WhatsApp
* Grau de parentesco
* Observações

HISTÓRICO DE ATENDIMENTOS
Mostrar:

* Data
* Horário
* Professor
* Aluno
* Clínica
* Situação

==================================================
9. RESPONSÁVEIS
===============

Criar tela de gerenciamento de responsáveis.

Tabela:

* Nome completo
* CPF
* WhatsApp
* Situação
* Ações

Formulário:

* Nome completo
* CPF
* WhatsApp
* Situação

Na tela de detalhes permitir visualizar os pacientes relacionados.

Criar interface para vincular um responsável a um paciente.

Campos do relacionamento:

* Responsável
* Paciente
* Grau de parentesco
* Observações

==================================================
10. GRUPOS
==========

Criar gerenciamento de grupos.

Tabela:

* Grupo
* Situação
* Quantidade de alunos
* Ações

Formulário:

* Nome do grupo
* Situação

Na página do grupo mostrar:

* Nome do grupo
* Situação
* Período letivo relacionado através das matrículas
* Lista de alunos matriculados
* Quantidade de alunos

==================================================
11. PERÍODO LETIVO
==================

Criar gerenciamento de períodos letivos.

Tabela:

* Período
* Data inicial
* Data final
* Situação
* Ações

Formulário:

* Período
* Data inicial
* Data final
* Situação

Situações:
ATIVO
ENCERRADO
CANCELADO

Mostrar validação visual para impedir que a data final seja anterior à data inicial.

==================================================
12. MATRÍCULAS
==============

Criar tela de matrículas.

A matrícula relaciona:

ALUNO + GRUPO + PERÍODO LETIVO

Tabela:

* Aluno
* RA
* Grupo
* Período letivo
* Data de início
* Data final
* Situação
* Ações

Situações:
ATIVA
ENCERRADA
CANCELADA
TRANCADA

Formulário:

* Aluno
* Grupo
* Período letivo
* Data de matrícula inicial
* Data de matrícula final
* Situação

Na tela de detalhes mostrar também os atendimentos relacionados à matrícula.

==================================================
13. ATENDIMENTOS
================

Esta deve ser uma das principais áreas do sistema.

Criar uma tela de agenda/calendário de atendimentos.

Disponibilizar visualizações:

* Dia
* Semana
* Mês
* Lista

Cada atendimento deve apresentar:

* Paciente
* Data
* Horário
* Professor
* Aluno/matrícula relacionada
* Clínica
* Situação

Situações:
AGENDADO
REALIZADO
CANCELADO
FALTOU
REMARCADO

Criar botão "Novo atendimento".

Formulário:

PACIENTE

* Selecionar paciente

DATA E HORÁRIO

* Data
* Horário agendado

PROFESSOR

* Selecionar professor

MATRÍCULA

* Selecionar matrícula

CLÍNICA

* Selecionar clínica

OBSERVAÇÕES

* Observações do professor
* Observações da clínica
* Observações da matrícula

Situação:

* Agendado
* Realizado
* Cancelado
* Faltou
* Remarcado

==================================================
14. DETALHES DO ATENDIMENTO
===========================

Criar uma página específica para visualizar um atendimento.

Organizar em cards/seções:

INFORMAÇÕES DO ATENDIMENTO

* Data
* Horário agendado
* Horário realizado
* Situação

PACIENTE

* Nome
* Código do prontuário
* Data de nascimento
* Situação

PROFESSOR

* Nome
* E-mail
* Telefone

ALUNO / MATRÍCULA

* Nome do aluno
* RA
* Grupo
* Período letivo

CLÍNICAS

* Nome da clínica
* Observações

EXAMES

* Exames relacionados
* Resultado/observação
* Documento relacionado

Criar ações:

* Editar atendimento
* Marcar como realizado
* Cancelar
* Remarcar

==================================================
15. CLÍNICAS
============

Criar tela de gerenciamento de clínicas.

Tabela:

* Clínica
* Situação
* Quantidade de atendimentos
* Ações

Formulário:

* Nome da clínica
* Situação

Na página da clínica mostrar:

* Dados da clínica
* Atendimentos relacionados
* Exames disponíveis/relacionados

==================================================
16. EXAMES
==========

Criar tela de gerenciamento de exames.

Tabela:

* Exame
* Situação
* Ações

Formulário:

* Nome do exame
* Situação

Criar área para relacionamento entre clínica e exame.

Para cada relação clínica/exame permitir:

* Selecionar clínica
* Selecionar exame
* Resultado/observação
* Documento

O campo "path_documento" deve ser representado visualmente como upload de arquivo.

Exibir:

* Nome do arquivo
* Tipo
* Data
* Botão visualizar
* Botão substituir
* Botão remover

==================================================
17. NAVEGAÇÃO
=============

Criar sidebar com agrupamento de menus.

MENU PRINCIPAL

* Dashboard
* Agenda de atendimentos

GESTÃO ACADÊMICA

* Alunos
* Professores
* Grupos
* Matrículas
* Períodos letivos

GESTÃO CLÍNICA

* Pacientes
* Responsáveis
* Clínicas
* Exames

ADMINISTRAÇÃO

* Usuários
* Configurações

A sidebar deve mostrar somente as opções permitidas para o perfil do usuário.

==================================================
18. COMPONENTES
===============

Criar componentes reutilizáveis para:

* Sidebar
* Header
* Breadcrumb
* Cards
* Tabelas
* Paginação
* Busca
* Filtros
* Selects
* Inputs
* Date picker
* Time picker
* Modal
* Drawer
* Tabs
* Badges de situação
* Alertas
* Toasts
* Confirmação de exclusão
* Upload de arquivo
* Calendário
* Avatar
* Dropdown de usuário
* Estados vazios
* Loading
* Mensagens de erro

==================================================
19. SITUAÇÕES E BADGES
======================

Utilizar badges visuais para representar as situações.

Usuários:
ATIVO
INATIVO
BLOQUEADO

Pacientes:
ATIVO
INATIVO
ALTA
ARQUIVADO

Matrículas:
ATIVA
ENCERRADA
CANCELADA
TRANCADA

Atendimentos:
AGENDADO
REALIZADO
CANCELADO
FALTOU
REMARCADO

Períodos:
ATIVO
ENCERRADO
CANCELADO

==================================================
20. DADOS MOCKADOS
==================

Utilize dados fictícios realistas para demonstrar o sistema.

Exemplos:

Alunos:

* Ana Carolina Souza — RA 2026001
* Lucas Henrique Santos — RA 2026002
* Mariana Oliveira — RA 2026003

Professores:

* Prof. Carlos Eduardo Lima
* Profa. Fernanda Martins
* Prof. Rafael Almeida

Pacientes:

* João Pedro Oliveira
* Maria Clara Santos
* Antônio Carlos Souza

Clínicas:

* Clínica Escola
* Clínica de Fisioterapia
* Clínica de Psicologia

Grupos:

* Grupo A
* Grupo B
* Grupo C

Os dados devem demonstrar corretamente os relacionamentos entre as entidades.

==================================================
21. REGRAS DE UX
================

Sempre que o usuário executar uma ação importante:

* Exibir feedback de sucesso.
* Exibir feedback de erro quando necessário.
* Pedir confirmação antes de ações destrutivas.
* Utilizar estados vazios informativos.
* Permitir busca e filtros nas tabelas.
* Manter os filtros selecionados quando possível.
* Mostrar breadcrumbs nas páginas internas.
* Utilizar modais ou páginas de detalhes para evitar interfaces excessivamente carregadas.

Exemplo:

Ao excluir um paciente:

"Excluir paciente?"
"Esta ação não poderá ser desfeita."

Botões:
"Cancelar"
"Excluir paciente"

==================================================
22. RESPONSIVIDADE
==================

Desktop:

* Sidebar fixa.
* Conteúdo principal amplo.
* Tabelas completas.

Tablet:

* Sidebar recolhível.
* Tabelas adaptadas.

Mobile:

* Menu lateral transformado em menu retrátil.
* Cards empilhados.
* Formulários em uma coluna.
* Tabelas transformadas em cards quando necessário.
* Agenda adaptada para visualização vertical.

==================================================
23. PÁGINAS PRINCIPAIS
======================

Crie no mínimo estas páginas:

1. Login
2. Dashboard
3. Usuários
4. Professores
5. Alunos
6. Detalhes do aluno
7. Pacientes
8. Detalhes do paciente
9. Responsáveis
10. Grupos
11. Períodos letivos
12. Matrículas
13. Atendimentos
14. Agenda
15. Detalhes do atendimento
16. Clínicas
17. Exames
18. Perfil do usuário

Para cada módulo criar:

* Tela de listagem
* Tela de cadastro
* Tela de edição
* Tela de detalhes quando fizer sentido

==================================================
24. RELACIONAMENTOS IMPORTANTES
===============================

Respeite estes relacionamentos:

USUÁRIO
→ pode estar associado a um PROFESSOR ou ALUNO.

ALUNO
→ possui MATRÍCULAS.

MATRÍCULA
→ pertence a um ALUNO.
→ pertence a um GRUPO.
→ pertence a um PERÍODO LETIVO.
→ pode estar relacionada a vários ATENDIMENTOS.

PACIENTE
→ pode possuir vários RESPONSÁVEIS.
→ pode possuir vários ATENDIMENTOS.

RESPONSÁVEL
→ pode estar relacionado a vários PACIENTES.

ATENDIMENTO
→ pertence a um PACIENTE.
→ pode possuir PROFESSORES.
→ pode estar relacionado a uma MATRÍCULA.
→ pode possuir CLÍNICAS.

CLÍNICA
→ pode estar relacionada a vários ATENDIMENTOS.
→ pode possuir EXAMES.

EXAME
→ pode estar relacionado a uma CLÍNICA.

==================================================
25. EXPERIÊNCIA FINAL
=====================

O resultado deve parecer um sistema real e pronto para apresentação acadêmica ou demonstração de projeto.

Não criar uma interface genérica de CRUD.

Criar uma experiência integrada em que seja possível navegar de:

Aluno → Matrícula → Grupo/Período → Atendimento → Professor → Paciente → Clínica → Exame.

As informações relacionadas devem aparecer de maneira contextual nas páginas de detalhes.

Priorizar:

1. Clareza
2. Organização
3. Facilidade de navegação
4. Consistência visual
5. Responsividade
6. Demonstração dos relacionamentos do banco de dados

Crie primeiro a estrutura geral do sistema, incluindo layout, navegação, componentes e páginas principais. Depois implemente as telas e seus estados utilizando dados mockados.

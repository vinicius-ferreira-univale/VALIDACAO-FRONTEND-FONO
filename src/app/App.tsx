import { useState, useMemo, type ReactNode } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  LayoutDashboard, Users, GraduationCap, UserCheck, Calendar,
  Stethoscope, Building2, FlaskConical, Settings, ChevronRight,
  ChevronDown, Bell, Search, LogOut, Plus, Edit2, Eye, Trash2,
  X, Menu, Phone, Mail, Upload, CheckCircle, XCircle,
  AlertCircle, User, ArrowLeft, FileText, Activity,
  BookOpen, Lock, Hash, Clock, TrendingUp, HeartPulse,
  Check, Filter, Home, AlertTriangle, MoreVertical, ChevronLeft,
  MapPin, Download, RefreshCw, CalendarDays, UserPlus, Shield,
  Layers,
} from "lucide-react";

// ============================================================
// TYPES
// ============================================================
type Perfil = "ADMIN" | "SECRETARIA" | "PROFESSOR" | "ALUNO" | "COORDENADOR";
type Page =
  | "login" | "dashboard"
  | "usuarios"
  | "professores" | "professor-detalhe"
  | "alunos" | "aluno-detalhe"
  | "pacientes" | "paciente-detalhe"
  | "responsaveis"
  | "grupos"
  | "periodos"
  | "matriculas"
  | "atendimentos" | "atendimento-detalhe"
  | "clinicas"
  | "exames"
  | "perfil";

interface Usuario { id: number; nome: string; email: string; perfil: Perfil; situacao: string; data_criacao: string; }
interface Professor { id: number; id_usuario: number; nome_completo: string; email: string; telefone: string; data_cadastro: string; situacao: string; }
interface Aluno { id: number; id_usuario: number | null; nome: string; email: string; telefone: string; ra: string; situacao: string; }
interface Paciente { id: number; cod_prontuario: string; local_fisico: string; nome_completo: string; data_nascimento: string; cpf: string; situacao: string; }
interface Responsavel { id: number; nome_completo: string; cpf: string; whatsapp: string; situacao: string; }
interface ResponsavelPaciente { id: number; id_responsavel: number; id_paciente: number; grau_parentesco: string; observacoes?: string; }
interface Grupo { id: number; grupo: string; situacao: string; }
interface Periodo { id: number; periodo: string; data_inicial: string; data_final: string; situacao: string; }
interface Clinica { id: number; clinica: string; situacao: string; }
interface Exame { id: number; exame: string; situacao: string; }
interface ClinicaExame { id: number; id_exame: number; id_clinica: number; resultado_obs: string; path_documento: string | null; }
interface Matricula { id: number; id_grupo: number; id_aluno: number; id_periodo_letivo: number; data_matricula_inicio: string; data_matricula_final: string; situacao: string; }
interface Atendimento { id: number; id_paciente: number; data_hora_agendada: string; data_hora_atendimento: string | null; situacao: string; }
interface ProfAtend { id: number; id_professor: number; id_atendimento: number; observacoes: string; }
interface MatAtend { id: number; id_matricula: number; id_atendimento: number; observacoes: string; }
interface AtendClinica { id: number; id_clinica: number; id_atendimento: number; observacoes: string; }

// ============================================================
// MOCK DATA
// ============================================================
const DB = {
  usuarios: [
    { id: 1, nome: "Admin Sistema", email: "admin.sistema@univale.br", perfil: "ADMIN" as Perfil, situacao: "ATIVO", data_criacao: "2024-01-15" },
    { id: 2, nome: "Maria Secretaria", email: "maria.secretaria@univale.br", perfil: "SECRETARIA" as Perfil, situacao: "ATIVO", data_criacao: "2024-01-15" },
    { id: 3, nome: "Dr. Carlos Eduardo Lima", email: "carlos.lima@univale.br", perfil: "PROFESSOR" as Perfil, situacao: "ATIVO", data_criacao: "2024-02-01" },
    { id: 4, nome: "Ana Carolina Souza", email: "ana.souza@univale.br", perfil: "ALUNO" as Perfil, situacao: "ATIVO", data_criacao: "2024-02-10" },
    { id: 5, nome: "Coord. João Ferreira", email: "joao.ferreira@univale.br", perfil: "COORDENADOR" as Perfil, situacao: "ATIVO", data_criacao: "2024-01-20" },
    { id: 6, nome: "Dra. Fernanda Martins", email: "fernanda.martins@univale.br", perfil: "PROFESSOR" as Perfil, situacao: "ATIVO", data_criacao: "2024-02-01" },
    { id: 7, nome: "Lucas Henrique Santos", email: "lucas.santos@univale.br", perfil: "ALUNO" as Perfil, situacao: "ATIVO", data_criacao: "2024-02-10" },
    { id: 8, nome: "Prof. Rafael Almeida", email: "rafael.almeida@univale.br", perfil: "PROFESSOR" as Perfil, situacao: "INATIVO", data_criacao: "2024-03-01" },
  ] as Usuario[],

  professores: [
    { id: 1, id_usuario: 3, nome_completo: "Prof. Carlos Eduardo Lima", email: "carlos.lima@univale.br", telefone: "(11) 99234-5678", data_cadastro: "2024-02-01", situacao: "ATIVO" },
    { id: 2, id_usuario: 6, nome_completo: "Profa. Fernanda Martins", email: "fernanda.martins@univale.br", telefone: "(11) 98765-4321", data_cadastro: "2024-02-01", situacao: "ATIVO" },
    { id: 3, id_usuario: 8, nome_completo: "Prof. Rafael Almeida", email: "rafael.almeida@univale.br", telefone: "(11) 97654-3210", data_cadastro: "2024-03-01", situacao: "INATIVO" },
  ] as Professor[],

  alunos: [
    { id: 1, id_usuario: 4, nome: "Ana Carolina Souza", email: "ana.souza@univale.br", telefone: "(11) 98877-6655", ra: "2026001", situacao: "ATIVO" },
    { id: 2, id_usuario: 7, nome: "Lucas Henrique Santos", email: "lucas.santos@univale.br", telefone: "(11) 97766-5544", ra: "2026002", situacao: "ATIVO" },
    { id: 3, id_usuario: null, nome: "Mariana Oliveira", email: "mariana.oliveira@univale.br", telefone: "(11) 96655-4433", ra: "2026003", situacao: "ATIVO" },
    { id: 4, id_usuario: null, nome: "Pedro Augusto Lima", email: "pedro.lima@univale.br", telefone: "(11) 95544-3322", ra: "2026004", situacao: "ATIVO" },
    { id: 5, id_usuario: null, nome: "Juliana Ferreira Costa", email: "juliana.costa@univale.br", telefone: "(11) 94433-2211", ra: "2026005", situacao: "INATIVO" },
  ] as Aluno[],

  pacientes: [
    { id: 1, cod_prontuario: "PRONT-001", local_fisico: "Arquivo A — Gaveta 3", nome_completo: "João Pedro Oliveira", data_nascimento: "1965-03-15", cpf: "123.456.789-01", situacao: "ATIVO" },
    { id: 2, cod_prontuario: "PRONT-002", local_fisico: "Arquivo A — Gaveta 4", nome_completo: "Maria Clara Santos", data_nascimento: "1978-07-22", cpf: "234.567.890-12", situacao: "ATIVO" },
    { id: 3, cod_prontuario: "PRONT-003", local_fisico: "Arquivo B — Gaveta 1", nome_completo: "Antônio Carlos Souza", data_nascimento: "1952-11-08", cpf: "345.678.901-23", situacao: "ATIVO" },
    { id: 4, cod_prontuario: "PRONT-004", local_fisico: "Arquivo B — Gaveta 2", nome_completo: "Beatriz Helena Rodrigues", data_nascimento: "1990-04-30", cpf: "456.789.012-34", situacao: "ALTA" },
    { id: 5, cod_prontuario: "PRONT-005", local_fisico: "Arquivo C — Gaveta 1", nome_completo: "Roberto Dias Mendes", data_nascimento: "1983-09-14", cpf: "567.890.123-45", situacao: "INATIVO" },
  ] as Paciente[],

  responsaveis: [
    { id: 1, nome_completo: "Susana Oliveira", cpf: "111.222.333-44", whatsapp: "(11) 99111-2233", situacao: "ATIVO" },
    { id: 2, nome_completo: "Marcos Santos", cpf: "222.333.444-55", whatsapp: "(11) 99222-3344", situacao: "ATIVO" },
    { id: 3, nome_completo: "Carla Rodrigues", cpf: "333.444.555-66", whatsapp: "(11) 99333-4455", situacao: "ATIVO" },
    { id: 4, nome_completo: "José Mendes", cpf: "444.555.666-77", whatsapp: "(11) 99444-5566", situacao: "INATIVO" },
  ] as Responsavel[],

  responsaveis_pacientes: [
    { id: 1, id_responsavel: 1, id_paciente: 1, grau_parentesco: "Cônjuge", observacoes: "Principal contato" },
    { id: 2, id_responsavel: 2, id_paciente: 2, grau_parentesco: "Filho(a)", observacoes: "" },
    { id: 3, id_responsavel: 3, id_paciente: 4, grau_parentesco: "Mãe", observacoes: "Contatar apenas pela manhã" },
    { id: 4, id_responsavel: 4, id_paciente: 5, grau_parentesco: "Irmão(ã)", observacoes: "" },
  ] as ResponsavelPaciente[],

  grupos: [
    { id: 1, grupo: "Grupo A", situacao: "ATIVO" },
    { id: 2, grupo: "Grupo B", situacao: "ATIVO" },
    { id: 3, grupo: "Grupo C", situacao: "INATIVO" },
  ] as Grupo[],

  periodos: [
    { id: 1, periodo: "2024/1", data_inicial: "2024-02-01", data_final: "2024-06-30", situacao: "ENCERRADO" },
    { id: 2, periodo: "2024/2", data_inicial: "2024-07-15", data_final: "2024-12-15", situacao: "ENCERRADO" },
    { id: 3, periodo: "2025/1", data_inicial: "2025-02-03", data_final: "2025-06-30", situacao: "ATIVO" },
  ] as Periodo[],

  clinicas: [
    { id: 1, clinica: "Linguagem", situacao: "ATIVO" },
    { id: 2, clinica: "Motricidade Orofacial", situacao: "ATIVO" },
    { id: 3, clinica: "Audiologia", situacao: "ATIVO" },
    { id: 4, clinica: "Voz", situacao: "ATIVO" },
  ] as Clinica[],

  exames: [
    { id: 1, exame: "Avaliação Miofuncional Orofacial", situacao: "ATIVO" },
    { id: 2, exame: "Análise Acústica da Voz", situacao: "ATIVO" },
    { id: 3, exame: "Avaliação de Linguagem", situacao: "ATIVO" },
    { id: 4, exame: "Audiometria Tonal", situacao: "ATIVO" },
    { id: 5, exame: "Avaliação de Fala", situacao: "INATIVO" },
  ] as Exame[],

  clinicas_exames: [
    { id: 1, id_exame: 1, id_clinica: 2, resultado_obs: "Paciente apresenta alteração mastigatória.", path_documento: "avaliacao_miofuncional_001.pdf" },
    { id: 2, id_exame: 2, id_clinica: 4, resultado_obs: "Presença de rouquidão moderada.", path_documento: null },
    { id: 3, id_exame: 3, id_clinica: 1, resultado_obs: "Atraso no desenvolvimento da linguagem verbal.", path_documento: "av_linguagem_001.pdf" },
    { id: 4, id_exame: 4, id_clinica: 3, resultado_obs: "Limiares auditivos dentro da normalidade.", path_documento: "audiometria_001.pdf" },
    { id: 5, id_exame: 5, id_clinica: 1, resultado_obs: "", path_documento: null },
  ] as ClinicaExame[],

  matriculas: [
    { id: 1, id_grupo: 1, id_aluno: 1, id_periodo_letivo: 3, data_matricula_inicio: "2025-02-03", data_matricula_final: "2025-06-30", situacao: "ATIVA" },
    { id: 2, id_grupo: 1, id_aluno: 2, id_periodo_letivo: 3, data_matricula_inicio: "2025-02-03", data_matricula_final: "2025-06-30", situacao: "ATIVA" },
    { id: 3, id_grupo: 2, id_aluno: 3, id_periodo_letivo: 3, data_matricula_inicio: "2025-02-03", data_matricula_final: "2025-06-30", situacao: "ATIVA" },
    { id: 4, id_grupo: 2, id_aluno: 4, id_periodo_letivo: 3, data_matricula_inicio: "2025-02-03", data_matricula_final: "2025-06-30", situacao: "TRANCADA" },
    { id: 5, id_grupo: 1, id_aluno: 5, id_periodo_letivo: 2, data_matricula_inicio: "2024-07-15", data_matricula_final: "2024-12-15", situacao: "ENCERRADA" },
  ] as Matricula[],

  atendimentos: [
    { id: 1, id_paciente: 1, data_hora_agendada: "2025-02-10 09:00", data_hora_atendimento: "2025-02-10 09:05", situacao: "REALIZADO" },
    { id: 2, id_paciente: 2, data_hora_agendada: "2025-02-12 10:30", data_hora_atendimento: null, situacao: "CANCELADO" },
    { id: 3, id_paciente: 3, data_hora_agendada: "2025-02-14 08:00", data_hora_atendimento: "2025-02-14 08:10", situacao: "REALIZADO" },
    { id: 4, id_paciente: 1, data_hora_agendada: "2025-02-20 14:00", data_hora_atendimento: null, situacao: "AGENDADO" },
    { id: 5, id_paciente: 4, data_hora_agendada: "2025-02-21 11:00", data_hora_atendimento: null, situacao: "AGENDADO" },
    { id: 6, id_paciente: 2, data_hora_agendada: "2025-02-18 15:30", data_hora_atendimento: null, situacao: "FALTOU" },
    { id: 7, id_paciente: 3, data_hora_agendada: "2025-02-25 09:00", data_hora_atendimento: null, situacao: "REMARCADO" },
    { id: 8, id_paciente: 5, data_hora_agendada: "2025-02-28 10:00", data_hora_atendimento: null, situacao: "AGENDADO" },
  ] as Atendimento[],

  professores_atendimentos: [
    { id: 1, id_professor: 1, id_atendimento: 1, observacoes: "Evolução positiva do paciente." },
    { id: 2, id_professor: 1, id_atendimento: 2, observacoes: "" },
    { id: 3, id_professor: 2, id_atendimento: 3, observacoes: "Sessão bem-sucedida." },
    { id: 4, id_professor: 1, id_atendimento: 4, observacoes: "" },
    { id: 5, id_professor: 2, id_atendimento: 5, observacoes: "" },
    { id: 6, id_professor: 1, id_atendimento: 6, observacoes: "Paciente não compareceu." },
    { id: 7, id_professor: 3, id_atendimento: 7, observacoes: "" },
    { id: 8, id_professor: 2, id_atendimento: 8, observacoes: "" },
  ] as ProfAtend[],

  matricula_atendimentos: [
    { id: 1, id_matricula: 1, id_atendimento: 1, observacoes: "Primeira consulta do período." },
    { id: 2, id_matricula: 1, id_atendimento: 2, observacoes: "" },
    { id: 3, id_matricula: 3, id_atendimento: 3, observacoes: "" },
    { id: 4, id_matricula: 1, id_atendimento: 4, observacoes: "" },
    { id: 5, id_matricula: 2, id_atendimento: 5, observacoes: "" },
    { id: 6, id_matricula: 1, id_atendimento: 6, observacoes: "" },
    { id: 7, id_matricula: 3, id_atendimento: 7, observacoes: "" },
    { id: 8, id_matricula: 2, id_atendimento: 8, observacoes: "" },
  ] as MatAtend[],

  atendimentos_clinicas: [
    { id: 1, id_clinica: 2, id_atendimento: 1, observacoes: "Terapia vocal." },
    { id: 2, id_clinica: 1, id_atendimento: 2, observacoes: "" },
    { id: 3, id_clinica: 3, id_atendimento: 3, observacoes: "Estimulação de linguagem." },
    { id: 4, id_clinica: 2, id_atendimento: 4, observacoes: "" },
    { id: 5, id_clinica: 3, id_atendimento: 5, observacoes: "" },
    { id: 6, id_clinica: 2, id_atendimento: 6, observacoes: "" },
    { id: 7, id_clinica: 1, id_atendimento: 7, observacoes: "" },
    { id: 8, id_clinica: 3, id_atendimento: 8, observacoes: "" },
  ] as AtendClinica[],
};

// ============================================================
// UTILITIES
// ============================================================
const situacaoBadge: Record<string, string> = {
  ATIVO: "bg-emerald-100 text-emerald-700",
  ATIVA: "bg-emerald-100 text-emerald-700",
  INATIVO: "bg-slate-100 text-slate-600",
  INATIVA: "bg-slate-100 text-slate-600",
  BLOQUEADO: "bg-red-100 text-red-700",
  ALTA: "bg-teal-100 text-teal-700",
  ARQUIVADO: "bg-slate-200 text-slate-700",
  AGENDADO: "bg-blue-100 text-blue-700",
  REALIZADO: "bg-emerald-100 text-emerald-700",
  CANCELADO: "bg-red-100 text-red-700",
  FALTOU: "bg-amber-100 text-amber-700",
  REMARCADO: "bg-violet-100 text-violet-700",
  ENCERRADO: "bg-slate-100 text-slate-600",
  ENCERRADA: "bg-slate-100 text-slate-600",
  TRANCADA: "bg-amber-100 text-amber-700",
  ADMIN: "bg-violet-100 text-violet-700",
  SECRETARIA: "bg-sky-100 text-sky-700",
  PROFESSOR: "bg-blue-100 text-blue-700",
  ALUNO: "bg-emerald-100 text-emerald-700",
  COORDENADOR: "bg-orange-100 text-orange-700",
};

const fmtDate = (d: string) => {
  if (!d) return "—";
  const [y, m, day] = d.split(" ")[0].split("-");
  return `${day}/${m}/${y}`;
};

const fmtDatetime = (d: string | null) => {
  if (!d) return "—";
  const [date, time] = d.split(" ");
  const [y, m, day] = date.split("-");
  return `${day}/${m}/${y} ${time}`;
};

const calcIdade = (dob: string) => {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

// ============================================================
// UI PRIMITIVES
// ============================================================
function Badge({ label }: { label: string }) {
  const cls = situacaoBadge[label] ?? "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold tracking-wide ${cls}`}>
      {label}
    </span>
  );
}

function Btn({
  children, onClick, variant = "primary", size = "md", icon, disabled = false, type = "button",
}: {
  children?: ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md"; icon?: ReactNode; disabled?: boolean; type?: "button" | "submit";
}) {
  const base = "inline-flex items-center gap-1.5 font-medium rounded transition-all focus:outline-none focus:ring-2 focus:ring-offset-1";
  const sizes = { sm: "px-2.5 py-1 text-xs", md: "px-3.5 py-1.5 text-sm" };
  const variants = {
    primary: "bg-primary text-primary-foreground hover:opacity-90 focus:ring-primary/40",
    secondary: "bg-secondary text-secondary-foreground hover:bg-slate-200 focus:ring-slate-300",
    danger: "bg-destructive text-destructive-foreground hover:opacity-90 focus:ring-destructive/40",
    ghost: "bg-transparent text-foreground hover:bg-accent focus:ring-slate-300",
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${sizes[size]} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

function Input({
  label, value, onChange, placeholder, type = "text", required = false, error,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  type?: string; required?: boolean; error?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-foreground">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`border ${error ? "border-red-500 focus:ring-red-500/30 focus:border-red-500" : "border-border focus:ring-primary/30 focus:border-primary"} rounded px-3 py-1.5 text-sm bg-input-background focus:outline-none focus:ring-2 transition`}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

function Select({
  label, value, onChange, options, required = false, error,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; required?: boolean; error?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-foreground">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={`border ${error ? "border-red-500 focus:ring-red-500/30 focus:border-red-500" : "border-border focus:ring-primary/30 focus:border-primary"} rounded px-3 py-1.5 text-sm bg-input-background focus:outline-none focus:ring-2 transition`}
      >
        <option value="">Selecione...</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

function Modal({ title, open, onClose, children, footer }: {
  title: string; open: boolean; onClose: () => void;
  children: ReactNode; footer?: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-card rounded-xl shadow-2xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-base">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition">
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4 overflow-y-auto flex-1">{children}</div>
        {footer && <div className="px-5 py-3 border-t border-border flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = "Confirmar" }: {
  open: boolean; onClose: () => void; onConfirm: () => void;
  title: string; message: string; confirmLabel?: string;
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
          <Btn variant="danger" onClick={onConfirm}>{confirmLabel}</Btn>
        </>
      }
    >
      <div className="flex gap-3">
        <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </Modal>
  );
}

function Toast({ toasts }: { toasts: { id: number; msg: string; type: "success" | "error" }[] }) {
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium pointer-events-auto
            ${t.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}
        >
          {t.type === "success" ? <CheckCircle size={15} /> : <XCircle size={15} />}
          {t.msg}
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message = "Nenhum registro encontrado." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
      <FileText size={36} className="opacity-30" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

function SearchBar({ value, onChange, placeholder = "Buscar..." }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="relative">
      <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border border-border rounded pl-8 pr-3 py-1.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition w-56"
      />
    </div>
  );
}

function Breadcrumb({ items }: { items: { label: string; page?: Page }[] }) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-5">
      <Home size={13} />
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight size={12} />
          <span className={i === items.length - 1 ? "text-foreground font-medium" : ""}>{item.label}</span>
        </span>
      ))}
    </div>
  );
}

function StatCard({ label, value, icon, color = "blue", sub }: {
  label: string; value: number | string; icon: ReactNode;
  color?: "blue" | "emerald" | "violet" | "amber" | "teal"; sub?: string;
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
    teal: "bg-teal-50 text-teal-600",
  };
  return (
    <div className="bg-card rounded-xl border border-border p-4 flex items-start gap-3 shadow-sm">
      <div className={`p-2.5 rounded-lg ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-semibold text-foreground mt-0.5">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {sub && <p className="text-sm text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-card rounded-xl border border-border shadow-sm ${className}`}>{children}</div>
  );
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</span>
      <span className="text-sm text-foreground font-medium">{value ?? "—"}</span>
    </div>
  );
}

// ============================================================
// SIDEBAR CONFIG
// ============================================================
type MenuItem = { label: string; page: Page; icon: ReactNode; };
type MenuGroup = { group: string; items: MenuItem[] };

const buildMenu = (perfil: Perfil): MenuGroup[] => {
  const all: MenuGroup[] = [
    {
      group: "Principal",
      items: [
        { label: "Dashboard", page: "dashboard", icon: <LayoutDashboard size={16} /> },
        { label: "Agenda de Atendimentos", page: "atendimentos", icon: <Calendar size={16} /> },
      ],
    },
    {
      group: "Gestão Acadêmica",
      items: [
        { label: "Alunos", page: "alunos", icon: <GraduationCap size={16} /> },
        { label: "Professores", page: "professores", icon: <UserCheck size={16} /> },
        { label: "Grupos", page: "grupos", icon: <Layers size={16} /> },
        { label: "Matrículas", page: "matriculas", icon: <BookOpen size={16} /> },
        { label: "Períodos Letivos", page: "periodos", icon: <CalendarDays size={16} /> },
      ],
    },
    {
      group: "Gestão Clínica",
      items: [
        { label: "Pacientes", page: "pacientes", icon: <HeartPulse size={16} /> },
        { label: "Responsáveis", page: "responsaveis", icon: <Users size={16} /> },
        { label: "Clínicas", page: "clinicas", icon: <Building2 size={16} /> },
        { label: "Exames", page: "exames", icon: <FlaskConical size={16} /> },
      ],
    },
    {
      group: "Administração",
      items: [
        { label: "Usuários", page: "usuarios", icon: <Shield size={16} /> },
        { label: "Configurações", page: "perfil", icon: <Settings size={16} /> },
      ],
    },
  ];

  const perfilPages: Record<Perfil, Page[]> = {
    ADMIN: ["dashboard", "atendimentos", "alunos", "professores", "grupos", "matriculas", "periodos", "pacientes", "responsaveis", "clinicas", "exames", "usuarios", "perfil"],
    SECRETARIA: ["dashboard", "atendimentos", "alunos", "grupos", "matriculas", "periodos", "pacientes", "responsaveis", "clinicas", "exames", "perfil"],
    COORDENADOR: ["dashboard", "atendimentos", "alunos", "professores", "grupos", "matriculas", "pacientes", "clinicas", "exames", "perfil"],
    PROFESSOR: ["dashboard", "atendimentos", "pacientes", "perfil"],
    ALUNO: ["dashboard", "matriculas", "atendimentos", "perfil"],
  };

  const allowed = perfilPages[perfil];
  return all.map((group) => ({
    ...group,
    items: group.items.filter((item) => allowed.includes(item.page)),
  })).filter((g) => g.items.length > 0);
};

// ============================================================
// SIDEBAR
// ============================================================
function Sidebar({ perfil, currentPage, onNav, collapsed, onToggle, onLogout, userName }: {
  perfil: Perfil; currentPage: Page; onNav: (p: Page) => void;
  collapsed: boolean; onToggle: () => void; onLogout: () => void; userName: string;
}) {
  const menu = buildMenu(perfil);

  return (
    <aside
      className={`flex flex-col h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-200 shrink-0
        ${collapsed ? "w-14" : "w-56"}`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 py-4 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 p-1">
          <img src="/logo-univale.jpg" alt="Univale" className="w-full h-full object-contain" />
        </div>
        {!collapsed && (
          <div className="min-w-0 pr-1">
            <p className="text-[11px] font-bold text-white leading-tight">Clínica Especializada de Fonoaudiologia</p>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">UNIVALE</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className={`ml-auto text-slate-400 hover:text-white transition ${collapsed ? "" : ""}`}
        >
          <Menu size={15} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-1.5">
        {menu.map((group) => (
          <div key={group.group} className="mb-4">
            {!collapsed && (
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 px-2 mb-1">
                {group.group}
              </p>
            )}
            {group.items.map((item) => {
              const active = currentPage === item.page ||
                (item.page === "professores" && currentPage === "professor-detalhe") ||
                (item.page === "alunos" && currentPage === "aluno-detalhe") ||
                (item.page === "pacientes" && currentPage === "paciente-detalhe") ||
                (item.page === "atendimentos" && currentPage === "atendimento-detalhe");
              return (
                <button
                  key={item.page}
                  onClick={() => onNav(item.page)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition mb-0.5
                    ${active
                      ? "bg-white text-slate-900 font-semibold shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-sidebar-accent"
                    }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-sidebar-border p-2">
        <button
          onClick={() => onNav("perfil")}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-sidebar-accent transition"
        >
          <div className="w-7 h-7 rounded-full bg-sidebar-primary flex items-center justify-center shrink-0">
            <User size={13} className="text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-medium text-white truncate">{userName}</p>
              <p className="text-[10px] text-slate-400">{perfil}</p>
            </div>
          )}
        </button>
        <button
          onClick={onLogout}
          title="Sair"
          className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-sidebar-accent text-slate-400 hover:text-white transition text-sm mt-0.5"
        >
          <LogOut size={15} className="shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}

// ============================================================
// HEADER
// ============================================================
function Header({ title, onMenuClick }: { title: string; onMenuClick: () => void }) {
  return (
    <div className="h-12 bg-card border-b border-border flex items-center gap-3 px-4 shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-muted-foreground hover:text-foreground transition"
      >
        <Menu size={18} />
      </button>
      <span className="flex-1 text-sm font-medium text-muted-foreground truncate">{title}</span>
      <button className="relative text-muted-foreground hover:text-foreground transition">
        <Bell size={17} />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500" />
      </button>
    </div>
  );
}

// ============================================================
// LOGIN PAGE
// ============================================================
function LoginPage({ onLogin }: { onLogin: (u: Usuario) => void }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const presets = [
    { label: "Admin", email: "admin.sistema@univale.br", senha: "admin123" },
    { label: "Secretaria", email: "maria.secretaria@univale.br", senha: "sec123" },
    { label: "Coordenador", email: "joao.ferreira@univale.br", senha: "coord123" },
    { label: "Professor", email: "carlos.lima@univale.br", senha: "prof123" },
    { label: "Aluno", email: "ana.souza@univale.br", senha: "aluno123" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = DB.usuarios.find((u) => u.email === email);
    if (user) {
      onLogin(user);
    } else {
      setError("E-mail ou senha inválidos. Verifique suas credenciais.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-white leading-tight px-2">Clínica Especializada de Fonoaudiologia da UNIVALE</h1>
          <p className="text-slate-400 text-sm mt-2">Sistema de Gestão Acadêmica e Clínica</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">E-mail</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="seu@email.com.br"
                  className="w-full border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">Senha</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => { setSenha(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  className="w-full border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2">
                <AlertCircle size={13} /> {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-white rounded-lg py-2 text-sm font-semibold hover:opacity-90 transition mt-1"
            >
              Entrar
            </button>

            <button type="button" className="text-xs text-primary text-center hover:underline">
              Esqueci minha senha
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-border">
            <p className="text-[11px] text-muted-foreground text-center mb-2 font-medium uppercase tracking-wide">Acesso rápido (demo)</p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {presets.map((p) => (
                <button
                  key={p.email}
                  type="button"
                  onClick={() => { setEmail(p.email); setSenha(p.senha); setError(""); }}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition font-medium"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="text-center text-slate-600 text-xs mt-4">© 2026 Univale. Todos os direitos reservados.</p>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD
// ============================================================
const chartAtendimentos = [
  { mes: "Set", realizados: 12, cancelados: 2, agendados: 5 },
  { mes: "Out", realizados: 18, cancelados: 3, agendados: 8 },
  { mes: "Nov", realizados: 22, cancelados: 4, agendados: 12 },
  { mes: "Dez", realizados: 15, cancelados: 2, agendados: 6 },
  { mes: "Jan", realizados: 20, cancelados: 1, agendados: 10 },
  { mes: "Fev", realizados: 24, cancelados: 3, agendados: 14 },
];

const pieData = [
  { name: "Realizados", value: 2, color: "#16a34a" },
  { name: "Agendados", value: 3, color: "#2563eb" },
  { name: "Cancelados", value: 1, color: "#dc2626" },
  { name: "Faltou", value: 1, color: "#d97706" },
  { name: "Remarcados", value: 1, color: "#7c3aed" },
];

function DashboardAdmin({ onNav }: { onNav: (p: Page, id?: number) => void }) {
  const totalAlunos = DB.alunos.filter((a) => a.situacao === "ATIVO").length;
  const totalProfessores = DB.professores.filter((p) => p.situacao === "ATIVO").length;
  const totalPacientes = DB.pacientes.length;
  const agendados = DB.atendimentos.filter((a) => a.situacao === "AGENDADO").length;
  const realizados = DB.atendimentos.filter((a) => a.situacao === "REALIZADO").length;
  const pendentes = DB.atendimentos.filter((a) => ["FALTOU", "REMARCADO"].includes(a.situacao)).length;
  const matriculasAtivas = DB.matriculas.filter((m) => m.situacao === "ATIVA").length;

  const proximos = DB.atendimentos.filter((a) => a.situacao === "AGENDADO");

  return (
    <div>
      <PageHeader
        title="Dashboard"
        sub="Visão geral do sistema"
        action={
          <div className="flex gap-2">
            <Btn variant="secondary" size="sm" icon={<UserPlus size={13} />} onClick={() => onNav("alunos")}>Novo Aluno</Btn>
            <Btn variant="secondary" size="sm" icon={<HeartPulse size={13} />} onClick={() => onNav("pacientes")}>Novo Paciente</Btn>
            <Btn size="sm" icon={<Plus size={13} />} onClick={() => onNav("atendimentos")}>Novo Atendimento</Btn>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Alunos Ativos" value={totalAlunos} icon={<GraduationCap size={18} />} color="blue" />
        <StatCard label="Professores" value={totalProfessores} icon={<UserCheck size={18} />} color="violet" />
        <StatCard label="Pacientes" value={totalPacientes} icon={<HeartPulse size={18} />} color="teal" />
        <StatCard label="Matrículas Ativas" value={matriculasAtivas} icon={<BookOpen size={18} />} color="emerald" />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Agendados" value={agendados} icon={<Calendar size={18} />} color="blue" sub="Próximos atendimentos" />
        <StatCard label="Realizados" value={realizados} icon={<CheckCircle size={18} />} color="emerald" sub="Este período" />
        <StatCard label="Pendências" value={pendentes} icon={<AlertCircle size={18} />} color="amber" sub="Faltou / Remarcado" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <Card className="col-span-2 p-4">
          <h3 className="font-semibold text-sm mb-4">Atendimentos por Mês</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartAtendimentos} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Bar dataKey="realizados" fill="#16a34a" radius={[3, 3, 0, 0]} name="Realizados" />
              <Bar dataKey="agendados" fill="#2563eb" radius={[3, 3, 0, 0]} name="Agendados" />
              <Bar dataKey="cancelados" fill="#dc2626" radius={[3, 3, 0, 0]} name="Cancelados" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-4">Situação dos Atendimentos</h3>
          <PieChart width={180} height={180}>
            <Pie data={pieData} cx={85} cy={85} innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
          <div className="flex flex-col gap-1 mt-2">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: d.color }} />
                <span className="text-muted-foreground">{d.name}</span>
                <span className="ml-auto font-medium">{d.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-sm">Próximos Atendimentos</h3>
            <Btn variant="ghost" size="sm" onClick={() => onNav("atendimentos")}>Ver todos</Btn>
          </div>
          <div className="divide-y divide-border">
            {proximos.length === 0 && <div className="px-4 py-6 text-sm text-muted-foreground text-center">Nenhum agendamento pendente.</div>}
            {proximos.map((a) => {
              const pac = DB.pacientes.find((p) => p.id === a.id_paciente);
              const profRel = DB.professores_atendimentos.find((pa) => pa.id_atendimento === a.id);
              const prof = profRel ? DB.professores.find((p) => p.id === profRel.id_professor) : null;
              return (
                <div key={a.id} className="px-4 py-3 flex items-center gap-3 hover:bg-accent/50 transition">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <HeartPulse size={14} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{pac?.nome_completo}</p>
                    <p className="text-xs text-muted-foreground">{prof?.nome_completo ?? "—"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium">{fmtDate(a.data_hora_agendada)}</p>
                    <p className="text-xs text-muted-foreground">{a.data_hora_agendada.split(" ")[1]}</p>
                  </div>
                  <Badge label={a.situacao} />
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-sm">Alunos Recentes</h3>
            <Btn variant="ghost" size="sm" onClick={() => onNav("alunos")}>Ver todos</Btn>
          </div>
          <div className="divide-y divide-border">
            {DB.alunos.slice(0, 5).map((a) => {
              const mat = DB.matriculas.find((m) => m.id_aluno === a.id && m.situacao === "ATIVA");
              const grupo = mat ? DB.grupos.find((g) => g.id === mat.id_grupo) : null;
              return (
                <div
                  key={a.id}
                  className="px-4 py-3 flex items-center gap-3 hover:bg-accent/50 transition cursor-pointer"
                  onClick={() => onNav("aluno-detalhe", a.id)}
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <GraduationCap size={14} className="text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{a.nome}</p>
                    <p className="text-xs text-muted-foreground">RA {a.ra} • {grupo?.grupo ?? "Sem grupo"}</p>
                  </div>
                  <Badge label={a.situacao} />
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

function DashboardProfessor({ user }: { user: Usuario }) {
  const prof = DB.professores.find((p) => p.id_usuario === user.id);
  const meuIds = DB.professores_atendimentos
    .filter((pa) => pa.id_professor === prof?.id)
    .map((pa) => pa.id_atendimento);
  const meusAtend = DB.atendimentos.filter((a) => meuIds.includes(a.id));

  const hoje = meusAtend.filter((a) => a.data_hora_agendada.startsWith("2025-02-20"));
  const proximos = meusAtend.filter((a) => a.situacao === "AGENDADO");
  const realizados = meusAtend.filter((a) => a.situacao === "REALIZADO").length;
  const cancelados = meusAtend.filter((a) => a.situacao === "CANCELADO").length;

  const pacIds = [...new Set(meusAtend.map((a) => a.id_paciente))];

  return (
    <div>
      <PageHeader title={`Olá, ${prof?.nome_completo ?? user.nome}`} sub="Painel do professor" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Atendimentos Hoje" value={hoje.length} icon={<Calendar size={18} />} color="blue" />
        <StatCard label="Próximos" value={proximos.length} icon={<Clock size={18} />} color="violet" />
        <StatCard label="Pacientes" value={pacIds.length} icon={<HeartPulse size={18} />} color="teal" />
        <StatCard label="Realizados" value={realizados} icon={<CheckCircle size={18} />} color="emerald" />
      </div>
      <Card>
        <div className="px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-sm">Meus Atendimentos</h3>
        </div>
        <div className="divide-y divide-border">
          {meusAtend.slice(0, 6).map((a) => {
            const pac = DB.pacientes.find((p) => p.id === a.id_paciente);
            return (
              <div key={a.id} className="px-4 py-3 flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium">{pac?.nome_completo}</p>
                  <p className="text-xs text-muted-foreground">{fmtDatetime(a.data_hora_agendada)}</p>
                </div>
                <Badge label={a.situacao} />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function DashboardAluno({ user }: { user: Usuario }) {
  const aluno = DB.alunos.find((a) => a.id_usuario === user.id);
  const mat = aluno ? DB.matriculas.find((m) => m.id_aluno === aluno.id && m.situacao === "ATIVA") : null;
  const grupo = mat ? DB.grupos.find((g) => g.id === mat.id_grupo) : null;
  const periodo = mat ? DB.periodos.find((p) => p.id === mat.id_periodo_letivo) : null;
  const matIds = aluno ? DB.matricula_atendimentos
    .filter((ma) => DB.matriculas.find((m) => m.id === ma.id_matricula && m.id_aluno === aluno.id))
    .map((ma) => ma.id_atendimento) : [];
  const atend = DB.atendimentos.filter((a) => matIds.includes(a.id));

  return (
    <div>
      <PageHeader title={`Olá, ${aluno?.nome ?? user.nome}`} sub="Painel do aluno" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-3">Dados do Aluno</h3>
          <InfoRow label="Nome" value={aluno?.nome} />
          <InfoRow label="RA" value={aluno?.ra} />
          <InfoRow label="E-mail" value={aluno?.email} />
          <InfoRow label="Situação" value={<Badge label={aluno?.situacao ?? ""} />} />
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-3">Matrícula Atual</h3>
          {mat ? (
            <>
              <InfoRow label="Grupo" value={grupo?.grupo} />
              <InfoRow label="Período Letivo" value={periodo?.periodo} />
              <InfoRow label="Início" value={fmtDate(mat.data_matricula_inicio)} />
              <InfoRow label="Situação" value={<Badge label={mat.situacao} />} />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma matrícula ativa.</p>
          )}
        </Card>
      </div>
      <Card>
        <div className="px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-sm">Meus Atendimentos</h3>
        </div>
        {atend.length === 0 ? <EmptyState message="Nenhum atendimento registrado." /> : (
          <div className="divide-y divide-border">
            {atend.map((a) => {
              const pac = DB.pacientes.find((p) => p.id === a.id_paciente);
              return (
                <div key={a.id} className="px-4 py-3 flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{pac?.nome_completo}</p>
                    <p className="text-xs text-muted-foreground">{fmtDatetime(a.data_hora_agendada)}</p>
                  </div>
                  <Badge label={a.situacao} />
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

function Dashboard({ user, onNav }: { user: Usuario; onNav: (p: Page, id?: number) => void }) {
  if (user.perfil === "PROFESSOR") return <DashboardProfessor user={user} />;
  if (user.perfil === "ALUNO") return <DashboardAluno user={user} />;
  return <DashboardAdmin onNav={onNav} />;
}

// ============================================================
// USUÁRIOS PAGE
// ============================================================
function UsuariosPage({ showToast }: { showToast: (m: string, t?: "success" | "error") => void }) {
  const [search, setSearch] = useState("");
  const [filterPerfil, setFilterPerfil] = useState("");
  const [filterSit, setFilterSit] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const filtered = DB.usuarios.filter((u) => {
    const s = search.toLowerCase();
    const matchSearch = !s || u.nome.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
    const matchPerfil = !filterPerfil || u.perfil === filterPerfil;
    const matchSit = !filterSit || u.situacao === filterSit;
    return matchSearch && matchPerfil && matchSit;
  });

  return (
    <div>
      <Breadcrumb items={[{ label: "Administração" }, { label: "Usuários" }]} />
      <PageHeader
        title="Usuários"
        sub={`${DB.usuarios.length} usuários cadastrados`}
        action={<Btn icon={<Plus size={14} />} onClick={() => setShowModal(true)}>Novo Usuário</Btn>}
      />

      <Card>
        <div className="flex flex-wrap gap-2 p-3 border-b border-border">
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nome ou e-mail..." />
          <select
            value={filterPerfil}
            onChange={(e) => setFilterPerfil(e.target.value)}
            className="border border-border rounded px-2.5 py-1.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">Todos os perfis</option>
            {["ADMIN", "SECRETARIA", "PROFESSOR", "ALUNO", "COORDENADOR"].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select
            value={filterSit}
            onChange={(e) => setFilterSit(e.target.value)}
            className="border border-border rounded px-2.5 py-1.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">Todas as situações</option>
            {["ATIVO", "INATIVO", "BLOQUEADO"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nome</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">E-mail</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Perfil</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Situação</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cadastro</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr><td colSpan={6}><EmptyState /></td></tr>
              )}
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-accent/40 transition">
                  <td className="px-4 py-3 font-medium">{u.nome}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3"><Badge label={u.perfil} /></td>
                  <td className="px-4 py-3"><Badge label={u.situacao} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{fmtDate(u.data_criacao)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-center">
                      <button className="p-1 hover:bg-accent rounded transition text-muted-foreground hover:text-foreground" title="Editar">
                        <Edit2 size={13} />
                      </button>
                      <button
                        className="p-1 hover:bg-red-50 rounded transition text-muted-foreground hover:text-red-600"
                        title="Excluir"
                        onClick={() => setConfirmId(u.id)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={showModal}
        title="Novo Usuário"
        onClose={() => setShowModal(false)}
        footer={
          <>
            <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Btn>
            <Btn onClick={() => { setShowModal(false); showToast("Usuário cadastrado com sucesso!"); }}>Salvar</Btn>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <Input label="Nome completo" value="" onChange={() => { }} placeholder="Nome do usuário" required />
          <Input label="E-mail" value="" onChange={() => { }} type="email" placeholder="email@exemplo.com.br" required />
          <Input label="Senha" value="" onChange={() => { }} type="password" placeholder="Mínimo 8 caracteres" required />
          <Select
            label="Perfil"
            value=""
            onChange={() => { }}
            options={["ADMIN", "SECRETARIA", "PROFESSOR", "ALUNO", "COORDENADOR"].map((p) => ({ value: p, label: p }))}
            required
          />
          <Select
            label="Situação"
            value=""
            onChange={() => { }}
            options={[{ value: "ATIVO", label: "Ativo" }, { value: "INATIVO", label: "Inativo" }]}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={confirmId !== null}
        onClose={() => setConfirmId(null)}
        onConfirm={() => { setConfirmId(null); showToast("Usuário removido.", "error"); }}
        title="Excluir usuário?"
        message="Esta ação não poderá ser desfeita. O usuário perderá acesso ao sistema."
        confirmLabel="Excluir usuário"
      />
    </div>
  );
}

// ============================================================
// PROFESSORES PAGE
// ============================================================
function ProfessoresPage({ onNav, showToast }: {
  onNav: (p: Page, id?: number) => void;
  showToast: (m: string, t?: "success" | "error") => void;
}) {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filtered = DB.professores.filter((p) => {
    const s = search.toLowerCase();
    return !s || p.nome_completo.toLowerCase().includes(s) || p.email.toLowerCase().includes(s);
  });

  return (
    <div>
      <Breadcrumb items={[{ label: "Gestão Acadêmica" }, { label: "Professores" }]} />
      <PageHeader
        title="Professores"
        sub={`${DB.professores.length} professores cadastrados`}
        action={<Btn icon={<Plus size={14} />} onClick={() => setShowModal(true)}>Novo Professor</Btn>}
      />
      <Card>
        <div className="p-3 border-b border-border">
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar professor..." />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nome</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">E-mail</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Telefone</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cadastro</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Situação</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-accent/40 transition">
                  <td className="px-4 py-3 font-medium">{p.nome_completo}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.telefone}</td>
                  <td className="px-4 py-3 text-muted-foreground">{fmtDate(p.data_cadastro)}</td>
                  <td className="px-4 py-3"><Badge label={p.situacao} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-center">
                      <button
                        className="p-1 hover:bg-accent rounded transition text-muted-foreground hover:text-primary"
                        title="Visualizar"
                        onClick={() => onNav("professor-detalhe", p.id)}
                      >
                        <Eye size={13} />
                      </button>
                      <button className="p-1 hover:bg-accent rounded transition text-muted-foreground hover:text-foreground" title="Editar">
                        <Edit2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={showModal}
        title="Novo Professor"
        onClose={() => setShowModal(false)}
        footer={
          <>
            <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Btn>
            <Btn onClick={() => { setShowModal(false); showToast("Professor cadastrado com sucesso!"); }}>Salvar</Btn>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <Select label="Usuário vinculado" value="" onChange={() => { }}
            options={DB.usuarios.filter((u) => u.perfil === "PROFESSOR").map((u) => ({ value: String(u.id), label: u.nome }))} required />
          <Input label="Nome completo" value="" onChange={() => { }} placeholder="Nome do professor" required />
          <Input label="E-mail" value="" onChange={() => { }} type="email" required />
          <Input label="Telefone" value="" onChange={() => { }} placeholder="(00) 00000-0000" />
          <Select label="Situação" value="" onChange={() => { }}
            options={[{ value: "ATIVO", label: "Ativo" }, { value: "INATIVO", label: "Inativo" }]} />
        </div>
      </Modal>
    </div>
  );
}

function ProfessorDetalhePage({ id, onBack, onNav, showToast }: {
  id: number; onBack: () => void;
  onNav: (p: Page, id?: number) => void;
  showToast?: (m: string, t?: "success" | "error") => void;
}) {
  const prof = DB.professores.find((p) => p.id === id);
  if (!prof) return <div>Professor não encontrado.</div>;

  const profAtends = DB.professores_atendimentos.filter((pa) => pa.id_professor === prof.id);
  const atends = DB.atendimentos.filter((a) => profAtends.some((pa) => pa.id_atendimento === a.id));
  const user = DB.usuarios.find((u) => u.id === prof.id_usuario);

  return (
    <div>
      <Breadcrumb items={[{ label: "Gestão Acadêmica" }, { label: "Professores" }, { label: prof.nome_completo }]} />
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="p-1.5 hover:bg-accent rounded-lg transition text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-semibold">{prof.nome_completo}</h1>
          <p className="text-sm text-muted-foreground">Detalhes do professor</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Btn variant="secondary" size="sm" icon={<Edit2 size={13} />}>Editar</Btn>
          <Badge label={prof.situacao} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <Card className="p-4 col-span-2">
          <h3 className="font-semibold text-sm mb-3">Informações Pessoais</h3>
          <div className="grid grid-cols-2 gap-x-6">
            <InfoRow label="Nome completo" value={prof.nome_completo} />
            <InfoRow label="E-mail" value={prof.email} />
            <InfoRow label="Telefone" value={prof.telefone} />
            <InfoRow label="Data de cadastro" value={fmtDate(prof.data_cadastro)} />
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-3">Acesso ao Sistema</h3>
          <InfoRow label="Usuário" value={user?.nome} />
          <InfoRow label="Perfil" value={<Badge label={user?.perfil ?? ""} />} />
          <InfoRow label="Situação" value={<Badge label={user?.situacao ?? ""} />} />
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatCard label="Total de Atendimentos" value={atends.length} icon={<Activity size={18} />} color="blue" />
        <StatCard label="Realizados" value={atends.filter((a) => a.situacao === "REALIZADO").length} icon={<CheckCircle size={18} />} color="emerald" />
        <StatCard label="Agendados" value={atends.filter((a) => a.situacao === "AGENDADO").length} icon={<Calendar size={18} />} color="violet" />
      </div>

      <Card>
        <div className="px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-sm">Atendimentos Vinculados</h3>
        </div>
        {atends.length === 0 ? <EmptyState /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">Data/Hora</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">Paciente</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">Situação</th>
                  <th className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">Ver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {atends.map((a) => {
                  const pac = DB.pacientes.find((p) => p.id === a.id_paciente);
                  return (
                    <tr key={a.id} className="hover:bg-accent/40 transition">
                      <td className="px-4 py-2.5 text-muted-foreground">{fmtDatetime(a.data_hora_agendada)}</td>
                      <td className="px-4 py-2.5 font-medium">{pac?.nome_completo}</td>
                      <td className="px-4 py-2.5"><Badge label={a.situacao} /></td>
                      <td className="px-4 py-2.5 text-center">
                        <button
                          className="p-1 hover:bg-accent rounded transition text-muted-foreground hover:text-primary"
                          onClick={() => onNav("atendimento-detalhe", a.id)}
                        >
                          <Eye size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

// ============================================================
// ALUNOS PAGE
// ============================================================
function AlunosPage({ onNav, showToast }: {
  onNav: (p: Page, id?: number) => void;
  showToast: (m: string, t?: "success" | "error") => void;
}) {
  const [alunosList, setAlunosList] = useState<Aluno[]>(() => [...DB.alunos]);
  const [search, setSearch] = useState("");
  const [filterSit, setFilterSit] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const initialFormState = {
    nome: "",
    ra: "",
    email: "",
    telefone: "",
    id_usuario: "",
    situacao: "ATIVO",
    id_grupo: "",
    id_periodo_letivo: "3", // default to current active period
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const enrichedAlunos = useMemo(() => {
    return alunosList.map((a) => {
      const mat = DB.matriculas.find((m) => m.id_aluno === a.id && m.situacao === "ATIVA");
      const grupo = mat ? DB.grupos.find((g) => g.id === mat.id_grupo) : null;
      const periodo = mat ? DB.periodos.find((p) => p.id === mat.id_periodo_letivo) : null;
      const user = a.id_usuario ? DB.usuarios.find((u) => u.id === a.id_usuario) : null;
      return { ...a, mat, grupo, periodo, user };
    });
  }, [alunosList]);

  const filtered = useMemo(() => {
    return enrichedAlunos.filter((a) => {
      const s = search.toLowerCase().trim();
      const matchSearch =
        !s ||
        a.nome.toLowerCase().includes(s) ||
        a.ra.toLowerCase().includes(s) ||
        a.email.toLowerCase().includes(s) ||
        (a.grupo && a.grupo.grupo.toLowerCase().includes(s));
      const matchSit = !filterSit || a.situacao === filterSit;
      return matchSearch && matchSit;
    });
  }, [enrichedAlunos, search, filterSit]);

  const handleOpenCreateModal = () => {
    const maxRaNum = DB.alunos.reduce((max, a) => {
      const num = parseInt(a.ra, 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 2026005);
    const nextRa = String(maxRaNum + 1);

    setFormData({
      nome: "",
      ra: nextRa,
      email: "",
      telefone: "",
      id_usuario: "",
      situacao: "ATIVO",
      id_grupo: "",
      id_periodo_letivo: "3",
    });
    setFormErrors({});
    setEditingAluno(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (aluno: Aluno) => {
    const mat = DB.matriculas.find((m) => m.id_aluno === aluno.id && m.situacao === "ATIVA");
    setFormData({
      nome: aluno.nome,
      ra: aluno.ra,
      email: aluno.email,
      telefone: aluno.telefone,
      id_usuario: aluno.id_usuario ? String(aluno.id_usuario) : "",
      situacao: aluno.situacao,
      id_grupo: mat ? String(mat.id_grupo) : "",
      id_periodo_letivo: mat ? String(mat.id_periodo_letivo) : "3",
    });
    setFormErrors({});
    setEditingAluno(aluno);
    setShowModal(true);
  };

  const handleSave = () => {
    const errors: Record<string, string> = {};
    if (!formData.nome.trim()) errors.nome = "Informe o nome completo";
    if (!formData.ra.trim()) errors.ra = "Informe o RA do aluno";
    if (!formData.email.trim()) errors.email = "Informe o e-mail institucional";

    const duplicateRa = DB.alunos.find(
      (a) => a.ra.toLowerCase() === formData.ra.trim().toLowerCase() && (!editingAluno || a.id !== editingAluno.id)
    );
    if (duplicateRa) {
      errors.ra = "Este RA já pertence a outro aluno";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast("Preencha todos os campos obrigatórios corretamente.", "error");
      return;
    }

    if (editingAluno) {
      // Update
      const idx = DB.alunos.findIndex((a) => a.id === editingAluno.id);
      if (idx !== -1) {
        DB.alunos[idx] = {
          ...DB.alunos[idx],
          nome: formData.nome.trim(),
          ra: formData.ra.trim(),
          email: formData.email.trim(),
          telefone: formData.telefone.trim(),
          id_usuario: formData.id_usuario ? Number(formData.id_usuario) : null,
          situacao: formData.situacao,
        };
      }

      // Update active matricula
      if (formData.id_grupo && formData.id_periodo_letivo) {
        const matIdx = DB.matriculas.findIndex((m) => m.id_aluno === editingAluno.id && m.situacao === "ATIVA");
        if (matIdx !== -1) {
          DB.matriculas[matIdx].id_grupo = Number(formData.id_grupo);
          DB.matriculas[matIdx].id_periodo_letivo = Number(formData.id_periodo_letivo);
        } else {
          const nextMatId = DB.matriculas.reduce((m, mat) => Math.max(m, mat.id), 0) + 1;
          DB.matriculas.unshift({
            id: nextMatId,
            id_aluno: editingAluno.id,
            id_grupo: Number(formData.id_grupo),
            id_periodo_letivo: Number(formData.id_periodo_letivo),
            data_matricula_inicio: new Date().toISOString().split("T")[0],
            data_matricula_final: "2025-06-30",
            situacao: "ATIVA",
          });
        }
      }

      setAlunosList([...DB.alunos]);
      setShowModal(false);
      setEditingAluno(null);
      showToast("Aluno atualizado com sucesso!");
    } else {
      // Create new
      const nextId = DB.alunos.reduce((m, a) => Math.max(m, a.id), 0) + 1;
      const newAluno: Aluno = {
        id: nextId,
        id_usuario: formData.id_usuario ? Number(formData.id_usuario) : null,
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        telefone: formData.telefone.trim(),
        ra: formData.ra.trim(),
        situacao: formData.situacao || "ATIVO",
      };

      DB.alunos.unshift(newAluno);

      // Create matricula if group provided
      if (formData.id_grupo && formData.id_periodo_letivo) {
        const nextMatId = DB.matriculas.reduce((m, mat) => Math.max(m, mat.id), 0) + 1;
        DB.matriculas.unshift({
          id: nextMatId,
          id_aluno: nextId,
          id_grupo: Number(formData.id_grupo),
          id_periodo_letivo: Number(formData.id_periodo_letivo),
          data_matricula_inicio: new Date().toISOString().split("T")[0],
          data_matricula_final: "2025-06-30",
          situacao: "ATIVA",
        });
      }

      setAlunosList([...DB.alunos]);
      setShowModal(false);
      showToast("Aluno cadastrado com sucesso!");
    }
  };

  const handleDelete = (id: number) => {
    const idx = DB.alunos.findIndex((a) => a.id === id);
    if (idx !== -1) {
      DB.alunos.splice(idx, 1);
      // Remove matriculas
      const matIndices = DB.matriculas.map((m, i) => (m.id_aluno === id ? i : -1)).filter((i) => i !== -1);
      for (let i = matIndices.length - 1; i >= 0; i--) {
        DB.matriculas.splice(matIndices[i], 1);
      }
      setAlunosList([...DB.alunos]);
      setConfirmDeleteId(null);
      showToast("Aluno excluído com sucesso.");
    }
  };

  // Preview selections
  const previewUser = DB.usuarios.find((u) => String(u.id) === formData.id_usuario);
  const previewGrupo = DB.grupos.find((g) => String(g.id) === formData.id_grupo);
  const previewPeriodo = DB.periodos.find((p) => String(p.id) === formData.id_periodo_letivo);

  return (
    <div>
      <Breadcrumb items={[{ label: "Gestão Acadêmica" }, { label: "Alunos" }]} />
      <PageHeader
        title="Alunos"
        sub={`${alunosList.length} alunos cadastrados`}
        action={<Btn icon={<Plus size={14} />} onClick={handleOpenCreateModal}>Novo Aluno</Btn>}
      />

      <Card>
        <div className="flex flex-wrap gap-2 p-3 border-b border-border items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nome, RA ou grupo..." />
            <select
              value={filterSit}
              onChange={(e) => setFilterSit(e.target.value)}
              className="border border-border rounded px-2.5 py-1.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Todas as situações</option>
              <option value="ATIVO">Ativo</option>
              <option value="INATIVO">Inativo</option>
            </select>
          </div>
          <span className="text-xs text-muted-foreground">
            Exibindo {filtered.length} de {alunosList.length} alunos
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Nome", "RA", "E-mail", "Telefone", "Grupo Atual", "Situação", "Ações"].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <EmptyState message="Nenhum aluno encontrado." />
                  </td>
                </tr>
              )}
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-accent/40 transition cursor-pointer" onClick={() => onNav("aluno-detalhe", a.id)}>
                  <td className="px-4 py-3 font-medium text-foreground">
                    <div className="font-semibold">{a.nome}</div>
                    {a.user && (
                      <div className="text-[11px] text-muted-foreground">Usuário: {a.user.email}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{a.ra}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.telefone || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {a.grupo ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                        {a.grupo.grupo} ({a.periodo?.periodo ?? "—"})
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3"><Badge label={a.situacao} /></td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <button
                        className="p-1 hover:bg-accent rounded transition text-muted-foreground hover:text-primary"
                        onClick={() => onNav("aluno-detalhe", a.id)}
                        title="Ver detalhes"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="p-1 hover:bg-accent rounded transition text-muted-foreground hover:text-foreground"
                        onClick={() => handleOpenEditModal(a)}
                        title="Editar"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="p-1 hover:bg-red-50 rounded transition text-muted-foreground hover:text-red-600"
                        onClick={() => setConfirmDeleteId(a.id)}
                        title="Excluir"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL NOVO / EDITAR ALUNO */}
      <Modal
        open={showModal}
        title={editingAluno ? `Editar Aluno #${editingAluno.id}` : "Novo Aluno"}
        onClose={() => { setShowModal(false); setEditingAluno(null); }}
        footer={
          <>
            <Btn variant="secondary" onClick={() => { setShowModal(false); setEditingAluno(null); }}>
              Cancelar
            </Btn>
            <Btn onClick={handleSave}>
              {editingAluno ? "Atualizar" : "Salvar"}
            </Btn>
          </>
        }
      >
        <div className="flex flex-col gap-3.5">
          {/* NOME COMPLETO */}
          <Input
            label="Nome Completo"
            value={formData.nome}
            error={formErrors.nome}
            onChange={(val) => {
              setFormData((prev) => ({ ...prev, nome: val }));
              if (formErrors.nome) setFormErrors((prev) => ({ ...prev, nome: "" }));
            }}
            placeholder="Ex: Ana Carolina Souza"
            required
          />

          {/* RA & SITUAÇÃO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="RA (Registro Acadêmico)"
              value={formData.ra}
              error={formErrors.ra}
              onChange={(val) => {
                setFormData((prev) => ({ ...prev, ra: val }));
                if (formErrors.ra) setFormErrors((prev) => ({ ...prev, ra: "" }));
              }}
              placeholder="Ex: 2026006"
              required
            />
            <Select
              label="Situação"
              value={formData.situacao}
              onChange={(val) => setFormData((prev) => ({ ...prev, situacao: val }))}
              options={[
                { value: "ATIVO", label: "Ativo" },
                { value: "INATIVO", label: "Inativo" },
              ]}
              required
            />
          </div>

          {/* E-MAIL & TELEFONE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="E-mail"
              type="email"
              value={formData.email}
              error={formErrors.email}
              onChange={(val) => {
                setFormData((prev) => ({ ...prev, email: val }));
                if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: "" }));
              }}
              placeholder="aluno@univale.br"
              required
            />
            <Input
              label="Telefone / WhatsApp"
              value={formData.telefone}
              onChange={(val) => setFormData((prev) => ({ ...prev, telefone: val }))}
              placeholder="(11) 98877-6655"
            />
          </div>

          {/* USUÁRIO VINCULADO */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Acesso ao Sistema (Opcional)
            </p>
            <Select
              label="Vincular a Usuário de Login"
              value={formData.id_usuario}
              onChange={(val) => setFormData((prev) => ({ ...prev, id_usuario: val }))}
              options={DB.usuarios
                .filter((u) => u.perfil === "ALUNO")
                .map((u) => ({ value: String(u.id), label: `${u.nome} (${u.email})` }))}
            />
          </div>

          {/* MATRÍCULA / GRUPO */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Vincular a Grupo Acadêmico
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Grupo de Atendimento"
                value={formData.id_grupo}
                onChange={(val) => setFormData((prev) => ({ ...prev, id_grupo: val }))}
                options={DB.grupos
                  .filter((g) => g.situacao === "ATIVO")
                  .map((g) => ({ value: String(g.id), label: g.grupo }))}
              />
              <Select
                label="Período Letivo"
                value={formData.id_periodo_letivo}
                onChange={(val) => setFormData((prev) => ({ ...prev, id_periodo_letivo: val }))}
                options={DB.periodos
                  .filter((p) => p.situacao === "ATIVO")
                  .map((p) => ({ value: String(p.id), label: p.periodo }))}
              />
            </div>
          </div>

          {/* LIVE SELECTION PREVIEW BOX */}
          {(formData.nome || formData.ra || formData.email || formData.id_grupo || formData.id_usuario) && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs space-y-1.5 mt-1">
              <p className="font-semibold text-primary flex items-center gap-1.5 text-xs">
                <CheckCircle size={14} />
                Resumo do Aluno Selecionado:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground pt-1">
                <div>
                  <span className="font-medium text-foreground">Nome: </span>
                  {formData.nome ? (
                    <span className="text-primary font-semibold">{formData.nome}</span>
                  ) : (
                    <span className="italic text-muted-foreground/70">Não preenchido</span>
                  )}
                </div>
                <div>
                  <span className="font-medium text-foreground">RA: </span>
                  {formData.ra ? (
                    <span className="font-mono font-medium text-foreground">{formData.ra}</span>
                  ) : (
                    <span className="italic text-muted-foreground/70">Não informado</span>
                  )}
                </div>
                <div>
                  <span className="font-medium text-foreground">E-mail: </span>
                  {formData.email ? (
                    <span className="text-foreground">{formData.email}</span>
                  ) : (
                    <span className="italic text-muted-foreground/70">Não informado</span>
                  )}
                </div>
                <div>
                  <span className="font-medium text-foreground">Telefone: </span>
                  {formData.telefone ? (
                    <span className="text-foreground">{formData.telefone}</span>
                  ) : (
                    <span className="italic text-muted-foreground/70">Não informado</span>
                  )}
                </div>
                <div>
                  <span className="font-medium text-foreground">Grupo / Período: </span>
                  {previewGrupo ? (
                    <span className="text-foreground">{previewGrupo.grupo} ({previewPeriodo?.periodo ?? "Período Ativo"})</span>
                  ) : (
                    <span className="italic text-muted-foreground/70">Sem grupo</span>
                  )}
                </div>
                <div>
                  <span className="font-medium text-foreground">Situação: </span>
                  <Badge label={formData.situacao} />
                </div>
                {previewUser && (
                  <div className="col-span-full">
                    <span className="font-medium text-foreground">Conta vinculada: </span>
                    <span className="text-foreground">{previewUser.nome} ({previewUser.email})</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        open={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
        title="Excluir Aluno"
        message="Tem certeza de que deseja excluir este aluno? Esta ação não pode ser desfeita."
        confirmLabel="Sim, excluir"
      />
    </div>
  );
}

function AlunoDetalhePage({ id, onBack, onNav, showToast }: {
  id: number; onBack: () => void;
  onNav: (p: Page, id?: number) => void;
  showToast?: (m: string, t?: "success" | "error") => void;
}) {
  const [, setTick] = useState(0);
  const aluno = DB.alunos.find((a) => a.id === id);
  if (!aluno) return null;

  const matriculas = DB.matriculas.filter((m) => m.id_aluno === aluno.id);
  const matAtends = DB.matricula_atendimentos.filter((ma) =>
    matriculas.some((m) => m.id === ma.id_matricula)
  );
  const atends = DB.atendimentos.filter((a) => matAtends.some((ma) => ma.id_atendimento === a.id));

  const toggleSituacao = () => {
    aluno.situacao = aluno.situacao === "ATIVO" ? "INATIVO" : "ATIVO";
    setTick((t) => t + 1);
    if (showToast) showToast(`Situação do aluno alterada para ${aluno.situacao}.`);
  };

  return (
    <div>
      <Breadcrumb items={[{ label: "Gestão Acadêmica" }, { label: "Alunos" }, { label: aluno.nome }]} />
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="p-1.5 hover:bg-accent rounded-lg transition text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-semibold">{aluno.nome}</h1>
          <p className="text-sm text-muted-foreground">RA {aluno.ra}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Btn variant="secondary" size="sm" icon={<RefreshCw size={13} />} onClick={toggleSituacao}>
            Alternar Situação
          </Btn>
          <Badge label={aluno.situacao} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card className="p-4 col-span-2">
          <h3 className="font-semibold text-sm mb-3">Dados do Aluno</h3>
          <div className="grid grid-cols-2 gap-x-6">
            <InfoRow label="Nome" value={aluno.nome} />
            <InfoRow label="RA" value={<span className="font-mono">{aluno.ra}</span>} />
            <InfoRow label="E-mail" value={aluno.email} />
            <InfoRow label="Telefone" value={aluno.telefone || "—"} />
            <InfoRow label="Situação" value={<Badge label={aluno.situacao} />} />
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-3">Matrículas</h3>
          {matriculas.length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma matrícula.</p> : (
            <div className="flex flex-col gap-3">
              {matriculas.map((m) => {
                const grupo = DB.grupos.find((g) => g.id === m.id_grupo);
                const periodo = DB.periodos.find((p) => p.id === m.id_periodo_letivo);
                return (
                  <div key={m.id} className="p-3 rounded-lg border border-border bg-muted/20">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium">{grupo?.grupo}</span>
                      <Badge label={m.situacao} />
                    </div>
                    <p className="text-xs text-muted-foreground">{periodo?.periodo}</p>
                    <p className="text-xs text-muted-foreground">{fmtDate(m.data_matricula_inicio)} — {fmtDate(m.data_matricula_final)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <div className="px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-sm">Atendimentos ({atends.length})</h3>
        </div>
        {atends.length === 0 ? <EmptyState message="Nenhum atendimento registrado." /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Data/Hora", "Paciente", "Professor", "Clínica", "Situação", "Ver"].map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {atends.map((a) => {
                  const pac = DB.pacientes.find((p) => p.id === a.id_paciente);
                  const profRel = DB.professores_atendimentos.find((pa) => pa.id_atendimento === a.id);
                  const prof = profRel ? DB.professores.find((p) => p.id === profRel.id_professor) : null;
                  const clinRel = DB.atendimentos_clinicas.find((ac) => ac.id_atendimento === a.id);
                  const clin = clinRel ? DB.clinicas.find((c) => c.id === clinRel.id_clinica) : null;
                  return (
                    <tr key={a.id} className="hover:bg-accent/40 transition">
                      <td className="px-4 py-2.5 text-muted-foreground">{fmtDatetime(a.data_hora_agendada)}</td>
                      <td className="px-4 py-2.5 font-medium">{pac?.nome_completo}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{prof?.nome_completo ?? "—"}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{clin?.clinica ?? "—"}</td>
                      <td className="px-4 py-2.5"><Badge label={a.situacao} /></td>
                      <td className="px-4 py-2.5 text-center">
                        <button className="p-1 hover:bg-accent rounded transition text-muted-foreground hover:text-primary" onClick={() => onNav("atendimento-detalhe", a.id)}>
                          <Eye size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

// ============================================================
// PACIENTES PAGE
// ============================================================
function PacientesPage({ onNav, showToast }: {
  onNav: (p: Page, id?: number) => void;
  showToast: (m: string, t?: "success" | "error") => void;
}) {
  const [pacientesList, setPacientesList] = useState<Paciente[]>(() => [...DB.pacientes]);
  const [search, setSearch] = useState("");
  const [filterSit, setFilterSit] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPaciente, setEditingPaciente] = useState<Paciente | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const initialFormState = {
    cod_prontuario: "",
    nome_completo: "",
    data_nascimento: "2018-05-10",
    cpf: "",
    local_fisico: "Arquivo Central — Gaveta 1",
    situacao: "ATIVO",
    id_responsavel: "",
    grau_parentesco: "Mãe",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    return pacientesList.filter((p) => {
      const s = search.toLowerCase().trim();
      const matchSearch =
        !s ||
        p.nome_completo.toLowerCase().includes(s) ||
        p.cod_prontuario.toLowerCase().includes(s) ||
        p.cpf.includes(s);
      const matchSit = !filterSit || p.situacao === filterSit;
      return matchSearch && matchSit;
    });
  }, [pacientesList, search, filterSit]);

  const handleOpenCreateModal = () => {
    const maxNum = DB.pacientes.reduce((max, p) => {
      const match = p.cod_prontuario.match(/PRONT-(\d+)/i);
      return match ? Math.max(max, parseInt(match[1], 10)) : max;
    }, 0);
    const nextPront = `PRONT-${String(maxNum + 1).padStart(3, "0")}`;

    setFormData({
      cod_prontuario: nextPront,
      nome_completo: "",
      data_nascimento: "2018-05-10",
      cpf: "",
      local_fisico: "Arquivo Central — Gaveta 1",
      situacao: "ATIVO",
      id_responsavel: "",
      grau_parentesco: "Mãe",
    });
    setFormErrors({});
    setEditingPaciente(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (p: Paciente) => {
    const rel = DB.responsaveis_pacientes.find((rp) => rp.id_paciente === p.id);
    setFormData({
      cod_prontuario: p.cod_prontuario,
      nome_completo: p.nome_completo,
      data_nascimento: p.data_nascimento,
      cpf: p.cpf,
      local_fisico: p.local_fisico,
      situacao: p.situacao,
      id_responsavel: rel ? String(rel.id_responsavel) : "",
      grau_parentesco: rel?.grau_parentesco || "Mãe",
    });
    setFormErrors({});
    setEditingPaciente(p);
    setShowModal(true);
  };

  const handleSave = () => {
    const errors: Record<string, string> = {};
    if (!formData.cod_prontuario.trim()) errors.cod_prontuario = "Informe o código do prontuário";
    if (!formData.nome_completo.trim()) errors.nome_completo = "Informe o nome completo do paciente";
    if (!formData.data_nascimento) errors.data_nascimento = "Informe a data de nascimento";
    if (!formData.cpf.trim()) errors.cpf = "Informe o CPF";

    // Duplicate check for prontuario
    const dupPront = DB.pacientes.find(
      (p) =>
        p.cod_prontuario.trim().toLowerCase() === formData.cod_prontuario.trim().toLowerCase() &&
        (!editingPaciente || p.id !== editingPaciente.id)
    );
    if (dupPront) errors.cod_prontuario = "Já existe um paciente com este prontuário";

    // Duplicate check for CPF
    const dupCpf = DB.pacientes.find(
      (p) =>
        p.cpf.trim() === formData.cpf.trim() &&
        (!editingPaciente || p.id !== editingPaciente.id)
    );
    if (dupCpf && formData.cpf.trim() !== "—") errors.cpf = "Já existe um paciente com este CPF";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast("Preencha todos os campos obrigatórios corretamente.", "error");
      return;
    }

    if (editingPaciente) {
      // Update
      const idx = DB.pacientes.findIndex((p) => p.id === editingPaciente.id);
      if (idx !== -1) {
        DB.pacientes[idx] = {
          ...DB.pacientes[idx],
          cod_prontuario: formData.cod_prontuario.trim(),
          nome_completo: formData.nome_completo.trim(),
          data_nascimento: formData.data_nascimento,
          cpf: formData.cpf.trim(),
          local_fisico: formData.local_fisico.trim() || "Arquivo Central",
          situacao: formData.situacao,
        };
      }

      // Update or link responsavel
      if (formData.id_responsavel) {
        const respRelIdx = DB.responsaveis_pacientes.findIndex((rp) => rp.id_paciente === editingPaciente.id);
        if (respRelIdx !== -1) {
          DB.responsaveis_pacientes[respRelIdx].id_responsavel = Number(formData.id_responsavel);
          DB.responsaveis_pacientes[respRelIdx].grau_parentesco = formData.grau_parentesco;
        } else {
          const nextRpId = DB.responsaveis_pacientes.reduce((m, rp) => Math.max(m, rp.id), 0) + 1;
          DB.responsaveis_pacientes.push({
            id: nextRpId,
            id_responsavel: Number(formData.id_responsavel),
            id_paciente: editingPaciente.id,
            grau_parentesco: formData.grau_parentesco,
            observacoes: "",
          });
        }
      }

      setPacientesList([...DB.pacientes]);
      setShowModal(false);
      setEditingPaciente(null);
      showToast("Paciente atualizado com sucesso!");
    } else {
      // Create new
      const nextId = DB.pacientes.reduce((m, p) => Math.max(m, p.id), 0) + 1;
      const newPaciente: Paciente = {
        id: nextId,
        cod_prontuario: formData.cod_prontuario.trim(),
        nome_completo: formData.nome_completo.trim(),
        data_nascimento: formData.data_nascimento,
        cpf: formData.cpf.trim(),
        local_fisico: formData.local_fisico.trim() || "Arquivo Central — Gaveta 1",
        situacao: formData.situacao || "ATIVO",
      };

      DB.pacientes.unshift(newPaciente);

      // Link responsavel if selected
      if (formData.id_responsavel) {
        const nextRpId = DB.responsaveis_pacientes.reduce((m, rp) => Math.max(m, rp.id), 0) + 1;
        DB.responsaveis_pacientes.push({
          id: nextRpId,
          id_responsavel: Number(formData.id_responsavel),
          id_paciente: nextId,
          grau_parentesco: formData.grau_parentesco,
          observacoes: "",
        });
      }

      setPacientesList([...DB.pacientes]);
      setShowModal(false);
      showToast("Paciente cadastrado com sucesso!");
    }
  };

  const handleDelete = (id: number) => {
    const idx = DB.pacientes.findIndex((p) => p.id === id);
    if (idx !== -1) {
      DB.pacientes.splice(idx, 1);
      const remainingRps = DB.responsaveis_pacientes.filter((rp) => rp.id_paciente !== id);
      DB.responsaveis_pacientes.length = 0;
      DB.responsaveis_pacientes.push(...remainingRps);

      setPacientesList([...DB.pacientes]);
      setConfirmId(null);
      showToast("Paciente excluído com sucesso.");
    }
  };

  // Preview helper
  const previewResp = DB.responsaveis.find((r) => String(r.id) === formData.id_responsavel);

  return (
    <div>
      <Breadcrumb items={[{ label: "Gestão Clínica" }, { label: "Pacientes" }]} />
      <PageHeader
        title="Pacientes"
        sub={`${pacientesList.length} pacientes cadastrados no sistema`}
        action={<Btn icon={<Plus size={14} />} onClick={handleOpenCreateModal}>Novo Paciente</Btn>}
      />

      <Card>
        <div className="flex flex-wrap gap-2 p-3 border-b border-border items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nome, prontuário ou CPF..." />
            <select
              value={filterSit}
              onChange={(e) => setFilterSit(e.target.value)}
              className="border border-border rounded px-2.5 py-1.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Todas as situações</option>
              {["ATIVO", "INATIVO", "ALTA", "ARQUIVADO"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <span className="text-xs text-muted-foreground">
            Exibindo {filtered.length} de {pacientesList.length} pacientes
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Prontuário", "Nome", "Nascimento", "CPF", "Local Físico", "Situação", "Ações"].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <EmptyState message="Nenhum paciente encontrado." />
                  </td>
                </tr>
              )}
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-accent/40 transition">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-primary">{p.cod_prontuario}</td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    <div>{p.nome_completo}</div>
                    <div className="text-[11px] text-muted-foreground">{calcIdade(p.data_nascimento)} anos</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{fmtDate(p.data_nascimento)}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{p.cpf}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{p.local_fisico}</td>
                  <td className="px-4 py-3"><Badge label={p.situacao} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        className="p-1 hover:bg-accent rounded transition text-muted-foreground hover:text-primary"
                        onClick={() => onNav("paciente-detalhe", p.id)}
                        title="Ver prontuário"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        className="p-1 hover:bg-accent rounded transition text-muted-foreground hover:text-foreground"
                        onClick={() => handleOpenEditModal(p)}
                        title="Editar"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        className="p-1 hover:bg-red-50 rounded transition text-muted-foreground hover:text-red-600"
                        onClick={() => setConfirmId(p.id)}
                        title="Excluir"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL NOVO / EDITAR PACIENTE */}
      <Modal
        open={showModal}
        title={editingPaciente ? `Editar Paciente — ${editingPaciente.cod_prontuario}` : "Novo Paciente"}
        onClose={() => { setShowModal(false); setEditingPaciente(null); }}
        footer={
          <>
            <Btn variant="secondary" onClick={() => { setShowModal(false); setEditingPaciente(null); }}>
              Cancelar
            </Btn>
            <Btn onClick={handleSave}>
              {editingPaciente ? "Atualizar" : "Salvar"}
            </Btn>
          </>
        }
      >
        <div className="flex flex-col gap-3.5">
          {/* PRONTUÁRIO & SITUAÇÃO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Código do Prontuário"
              value={formData.cod_prontuario}
              error={formErrors.cod_prontuario}
              onChange={(val) => {
                setFormData((prev) => ({ ...prev, cod_prontuario: val }));
                if (formErrors.cod_prontuario) setFormErrors((prev) => ({ ...prev, cod_prontuario: "" }));
              }}
              placeholder="Ex: PRONT-006"
              required
            />
            <Select
              label="Situação"
              value={formData.situacao}
              onChange={(val) => setFormData((prev) => ({ ...prev, situacao: val }))}
              options={["ATIVO", "INATIVO", "ALTA", "ARQUIVADO"].map((s) => ({ value: s, label: s }))}
              required
            />
          </div>

          {/* NOME COMPLETO */}
          <Input
            label="Nome Completo do Paciente"
            value={formData.nome_completo}
            error={formErrors.nome_completo}
            onChange={(val) => {
              setFormData((prev) => ({ ...prev, nome_completo: val }));
              if (formErrors.nome_completo) setFormErrors((prev) => ({ ...prev, nome_completo: "" }));
            }}
            placeholder="Nome completo do paciente"
            required
          />

          {/* DATA DE NASCIMENTO & CPF */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Data de Nascimento"
              type="date"
              value={formData.data_nascimento}
              error={formErrors.data_nascimento}
              onChange={(val) => {
                setFormData((prev) => ({ ...prev, data_nascimento: val }));
                if (formErrors.data_nascimento) setFormErrors((prev) => ({ ...prev, data_nascimento: "" }));
              }}
              required
            />
            <Input
              label="CPF"
              value={formData.cpf}
              error={formErrors.cpf}
              onChange={(val) => {
                setFormData((prev) => ({ ...prev, cpf: val }));
                if (formErrors.cpf) setFormErrors((prev) => ({ ...prev, cpf: "" }));
              }}
              placeholder="000.000.000-00"
              required
            />
          </div>

          {/* LOCAL FÍSICO DO PRONTUÁRIO */}
          <Input
            label="Local Físico do Prontuário"
            value={formData.local_fisico}
            onChange={(val) => setFormData((prev) => ({ ...prev, local_fisico: val }))}
            placeholder="Ex: Arquivo Central — Gaveta 1"
          />

          {/* VINCULAR RESPONSÁVEL (OPCIONAL) */}
          <div className="border-t border-border pt-3 mt-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Vínculo de Responsável (Opcional)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Responsável"
                value={formData.id_responsavel}
                onChange={(val) => setFormData((prev) => ({ ...prev, id_responsavel: val }))}
                options={[
                  { value: "", label: "Nenhum responsável vinculado" },
                  ...DB.responsaveis.map((r) => ({
                    value: String(r.id),
                    label: `${r.nome_completo} (${r.cpf})`,
                  })),
                ]}
              />
              {formData.id_responsavel && (
                <Input
                  label="Grau de Parentesco"
                  value={formData.grau_parentesco}
                  onChange={(val) => setFormData((prev) => ({ ...prev, grau_parentesco: val }))}
                  placeholder="Ex: Mãe, Pai, Cônjuge, Tutor"
                />
              )}
            </div>
          </div>

          {/* LIVE SELECTION PREVIEW BOX */}
          {(formData.nome_completo || formData.cod_prontuario) && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs space-y-1.5 mt-1">
              <p className="font-semibold text-primary flex items-center gap-1.5 text-xs">
                <CheckCircle size={14} />
                Resumo do Paciente Selecionado:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground pt-1">
                <div>
                  <span className="font-medium text-foreground">Prontuário: </span>
                  <span className="font-mono text-primary font-semibold">{formData.cod_prontuario}</span>
                </div>
                <div>
                  <span className="font-medium text-foreground">Situação: </span>
                  <Badge label={formData.situacao} />
                </div>
                <div className="col-span-full">
                  <span className="font-medium text-foreground">Nome: </span>
                  <span className="text-foreground font-medium">{formData.nome_completo || "—"}</span>
                </div>
                <div>
                  <span className="font-medium text-foreground">Nascimento: </span>
                  <span className="text-foreground">
                    {formData.data_nascimento ? `${fmtDate(formData.data_nascimento)} (${calcIdade(formData.data_nascimento)} anos)` : "—"}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-foreground">CPF: </span>
                  <span className="font-mono text-foreground">{formData.cpf || "—"}</span>
                </div>
                {formData.local_fisico && (
                  <div className="col-span-full">
                    <span className="font-medium text-foreground">Local Físico: </span>
                    <span className="text-foreground">{formData.local_fisico}</span>
                  </div>
                )}
                {previewResp && (
                  <div className="col-span-full">
                    <span className="font-medium text-foreground">Responsável: </span>
                    <span className="text-foreground">
                      {previewResp.nome_completo} ({formData.grau_parentesco}) • {previewResp.whatsapp}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        open={confirmId !== null}
        onClose={() => setConfirmId(null)}
        onConfirm={() => confirmId && handleDelete(confirmId)}
        title="Excluir Paciente"
        message="Esta ação não poderá ser desfeita. O prontuário e os relacionamentos do paciente serão removidos."
        confirmLabel="Sim, excluir paciente"
      />
    </div>
  );
}

function PacienteDetalhePage({ id, onBack, onNav, showToast }: {
  id: number; onBack: () => void;
  onNav: (p: Page, id?: number) => void;
  showToast: (m: string, t?: "success" | "error") => void;
}) {
  const [pac, setPac] = useState<Paciente | undefined>(() => DB.pacientes.find((p) => p.id === id));
  const [showEditModal, setShowEditModal] = useState(false);

  if (!pac) return <div>Paciente não encontrado.</div>;

  const resps = DB.responsaveis_pacientes
    .filter((rp) => rp.id_paciente === pac.id)
    .map((rp) => ({
      ...rp,
      responsavel: DB.responsaveis.find((r) => r.id === rp.id_responsavel),
    }));

  const atends = DB.atendimentos.filter((a) => a.id_paciente === pac.id);

  const toggleSituacao = () => {
    const nextSit = pac.situacao === "ATIVO" ? "INATIVO" : "ATIVO";
    const idx = DB.pacientes.findIndex((p) => p.id === pac.id);
    if (idx !== -1) {
      DB.pacientes[idx].situacao = nextSit;
      setPac({ ...DB.pacientes[idx] });
      showToast(`Situação alterada para ${nextSit}`);
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: "Gestão Clínica" }, { label: "Pacientes" }, { label: pac.nome_completo }]} />
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="p-1.5 hover:bg-accent rounded-lg transition text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-semibold">{pac.nome_completo}</h1>
          <p className="text-sm text-muted-foreground">{pac.cod_prontuario} • {calcIdade(pac.data_nascimento)} anos</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Btn variant="secondary" size="sm" onClick={toggleSituacao}>
            {pac.situacao === "ATIVO" ? "Inativar" : "Ativar"}
          </Btn>
          <Badge label={pac.situacao} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card className="p-4 col-span-2">
          <h3 className="font-semibold text-sm mb-3">Dados do Paciente</h3>
          <div className="grid grid-cols-2 gap-x-6">
            <InfoRow label="Nome completo" value={pac.nome_completo} />
            <InfoRow label="Data de Nascimento" value={`${fmtDate(pac.data_nascimento)} (${calcIdade(pac.data_nascimento)} anos)`} />
            <InfoRow label="CPF" value={pac.cpf} />
            <InfoRow label="Código do Prontuário" value={<span className="font-mono text-primary font-semibold">{pac.cod_prontuario}</span>} />
            <InfoRow label="Local Físico" value={pac.local_fisico} />
            <InfoRow label="Situação" value={<Badge label={pac.situacao} />} />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Responsáveis</h3>
            <Btn size="sm" variant="secondary" icon={<Plus size={12} />} onClick={() => onNav("responsaveis")}>
              Gerenciar
            </Btn>
          </div>
          {resps.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum responsável vinculado.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {resps.map((r) => (
                <div key={r.id} className="p-2.5 rounded-lg border border-border bg-muted/20">
                  <p className="text-sm font-medium">{r.responsavel?.nome_completo}</p>
                  <p className="text-xs text-muted-foreground">{r.grau_parentesco}</p>
                  <p className="text-xs text-muted-foreground">{r.responsavel?.whatsapp}</p>
                  {r.observacoes && <p className="text-xs text-muted-foreground italic mt-1">{r.observacoes}</p>}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-sm">Histórico de Atendimentos</h3>
          <span className="text-xs text-muted-foreground">{atends.length} atendimento{atends.length !== 1 ? "s" : ""}</span>
        </div>
        {atends.length === 0 ? <EmptyState message="Nenhum atendimento registrado para este paciente." /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Data/Hora Agendada", "Realizado em", "Professor", "Aluno", "Clínica", "Situação", "Ver"].map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {atends.map((a) => {
                  const profRel = DB.professores_atendimentos.find((pa) => pa.id_atendimento === a.id);
                  const prof = profRel ? DB.professores.find((p) => p.id === profRel.id_professor) : null;
                  const matRel = DB.matricula_atendimentos.find((ma) => ma.id_atendimento === a.id);
                  const mat = matRel ? DB.matriculas.find((m) => m.id === matRel.id_matricula) : null;
                  const aluno = mat ? DB.alunos.find((al) => al.id === mat.id_aluno) : null;
                  const clinRel = DB.atendimentos_clinicas.find((ac) => ac.id_atendimento === a.id);
                  const clin = clinRel ? DB.clinicas.find((c) => c.id === clinRel.id_clinica) : null;
                  return (
                    <tr key={a.id} className="hover:bg-accent/40 transition">
                      <td className="px-4 py-2.5 text-muted-foreground">{fmtDatetime(a.data_hora_agendada)}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{fmtDatetime(a.data_hora_atendimento)}</td>
                      <td className="px-4 py-2.5">{prof?.nome_completo ?? "—"}</td>
                      <td className="px-4 py-2.5">{aluno?.nome ?? "—"}</td>
                      <td className="px-4 py-2.5">{clin?.clinica ?? "—"}</td>
                      <td className="px-4 py-2.5"><Badge label={a.situacao} /></td>
                      <td className="px-4 py-2.5 text-center">
                        <button className="p-1 hover:bg-accent rounded transition text-muted-foreground hover:text-primary" onClick={() => onNav("atendimento-detalhe", a.id)}>
                          <Eye size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

// ============================================================
// RESPONSÁVEIS PAGE
// ============================================================
function ResponsaveisPage({ showToast }: { showToast: (m: string, t?: "success" | "error") => void }) {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filtered = DB.responsaveis.filter((r) => {
    const s = search.toLowerCase();
    return !s || r.nome_completo.toLowerCase().includes(s) || r.cpf.includes(s);
  });

  return (
    <div>
      <Breadcrumb items={[{ label: "Gestão Clínica" }, { label: "Responsáveis" }]} />
      <PageHeader
        title="Responsáveis"
        sub="Gerenciamento de responsáveis por pacientes"
        action={<Btn icon={<Plus size={14} />} onClick={() => setShowModal(true)}>Novo Responsável</Btn>}
      />
      <Card>
        <div className="p-3 border-b border-border">
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar responsável..." />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Nome", "CPF", "WhatsApp", "Pacientes", "Situação", "Ações"].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((r) => {
                const pacCount = DB.responsaveis_pacientes.filter((rp) => rp.id_responsavel === r.id).length;
                return (
                  <tr key={r.id} className="hover:bg-accent/40 transition">
                    <td className="px-4 py-3 font-medium">{r.nome_completo}</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{r.cpf}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.whatsapp}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Users size={11} /> {pacCount} paciente{pacCount !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-4 py-3"><Badge label={r.situacao} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="p-1 hover:bg-accent rounded transition text-muted-foreground hover:text-foreground"><Edit2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal
        open={showModal}
        title="Novo Responsável"
        onClose={() => setShowModal(false)}
        footer={
          <>
            <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Btn>
            <Btn onClick={() => { setShowModal(false); showToast("Responsável cadastrado!"); }}>Salvar</Btn>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <Input label="Nome completo" value="" onChange={() => { }} required />
          <Input label="CPF" value="" onChange={() => { }} placeholder="000.000.000-00" />
          <Input label="WhatsApp" value="" onChange={() => { }} placeholder="(00) 00000-0000" />
          <Select label="Situação" value="" onChange={() => { }}
            options={[{ value: "ATIVO", label: "Ativo" }, { value: "INATIVO", label: "Inativo" }]} />
          <div className="border-t border-border pt-3">
            <p className="text-sm font-medium mb-2">Vincular Paciente</p>
            <Select label="Paciente" value="" onChange={() => { }}
              options={DB.pacientes.map((p) => ({ value: String(p.id), label: p.nome_completo }))} />
            <div className="mt-2">
              <Input label="Grau de Parentesco" value="" onChange={() => { }} placeholder="Ex: Mãe, Pai, Cônjuge" />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// GRUPOS PAGE
// ============================================================
function GruposPage({ showToast }: { showToast: (m: string, t?: "success" | "error") => void }) {
  const [gruposList, setGruposList] = useState<Grupo[]>(() => [...DB.grupos]);
  const [search, setSearch] = useState("");
  const [filterSit, setFilterSit] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingGrupo, setEditingGrupo] = useState<Grupo | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const initialFormState = {
    grupo: "",
    situacao: "ATIVO",
    id_periodo_letivo: "3", // default to active period 2025/1
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const enrichedGrupos = useMemo(() => {
    return gruposList.map((g) => {
      const matriculasAtivas = DB.matriculas.filter((m) => m.id_grupo === g.id && m.situacao === "ATIVA");
      const alunoCount = matriculasAtivas.length;
      const alunos = matriculasAtivas
        .map((m) => DB.alunos.find((a) => a.id === m.id_aluno))
        .filter(Boolean);
      const periodos = [...new Set(
        DB.matriculas.filter((m) => m.id_grupo === g.id).map((m) => m.id_periodo_letivo)
      )].map((pid) => DB.periodos.find((p) => p.id === pid)?.periodo).filter(Boolean);

      return { ...g, alunoCount, alunos, periodos };
    });
  }, [gruposList]);

  const filtered = useMemo(() => {
    return enrichedGrupos.filter((g) => {
      const s = search.toLowerCase().trim();
      const matchSearch = !s || g.grupo.toLowerCase().includes(s);
      const matchSit = !filterSit || g.situacao === filterSit;
      return matchSearch && matchSit;
    });
  }, [enrichedGrupos, search, filterSit]);

  const handleOpenCreateModal = () => {
    const existingNames = DB.grupos.map((g) => g.grupo.toUpperCase());
    let nextLetter = "D";
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    for (const l of letters) {
      if (!existingNames.some((n) => n.includes(`GRUPO ${l}`))) {
        nextLetter = l;
        break;
      }
    }

    setFormData({
      grupo: `Grupo ${nextLetter}`,
      situacao: "ATIVO",
      id_periodo_letivo: "3",
    });
    setFormErrors({});
    setEditingGrupo(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (g: Grupo) => {
    setFormData({
      grupo: g.grupo,
      situacao: g.situacao,
      id_periodo_letivo: "3",
    });
    setFormErrors({});
    setEditingGrupo(g);
    setShowModal(true);
  };

  const handleSave = () => {
    const errors: Record<string, string> = {};
    if (!formData.grupo.trim()) errors.grupo = "Informe o nome do grupo";

    const duplicate = DB.grupos.find(
      (g) => g.grupo.trim().toLowerCase() === formData.grupo.trim().toLowerCase() && (!editingGrupo || g.id !== editingGrupo.id)
    );
    if (duplicate) {
      errors.grupo = "Já existe um grupo com este nome";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast("Preencha todos os campos obrigatórios corretamente.", "error");
      return;
    }

    if (editingGrupo) {
      // Update
      const idx = DB.grupos.findIndex((g) => g.id === editingGrupo.id);
      if (idx !== -1) {
        DB.grupos[idx] = {
          ...DB.grupos[idx],
          grupo: formData.grupo.trim(),
          situacao: formData.situacao,
        };
      }
      setGruposList([...DB.grupos]);
      setShowModal(false);
      setEditingGrupo(null);
      showToast("Grupo atualizado com sucesso!");
    } else {
      // Create new
      const nextId = DB.grupos.reduce((m, g) => Math.max(m, g.id), 0) + 1;
      const newGrupo: Grupo = {
        id: nextId,
        grupo: formData.grupo.trim(),
        situacao: formData.situacao || "ATIVO",
      };

      DB.grupos.push(newGrupo);
      setGruposList([...DB.grupos]);
      setShowModal(false);
      showToast("Grupo cadastrado com sucesso!");
    }
  };

  const handleDelete = (id: number) => {
    const idx = DB.grupos.findIndex((g) => g.id === id);
    if (idx !== -1) {
      DB.grupos.splice(idx, 1);
      setGruposList([...DB.grupos]);
      setConfirmDeleteId(null);
      showToast("Grupo excluído com sucesso.");
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: "Gestão Acadêmica" }, { label: "Grupos" }]} />
      <PageHeader
        title="Grupos"
        sub={`${gruposList.length} grupos acadêmicos cadastrados`}
        action={<Btn icon={<Plus size={14} />} onClick={handleOpenCreateModal}>Novo Grupo</Btn>}
      />

      <Card className="mb-4">
        <div className="flex flex-wrap gap-2 p-3 items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <SearchBar value={search} onChange={setSearch} placeholder="Buscar grupo por nome..." />
            <select
              value={filterSit}
              onChange={(e) => setFilterSit(e.target.value)}
              className="border border-border rounded px-2.5 py-1.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Todas as situações</option>
              <option value="ATIVO">Ativo</option>
              <option value="INATIVO">Inativo</option>
            </select>
          </div>
          <span className="text-xs text-muted-foreground">
            Exibindo {filtered.length} de {gruposList.length} grupos
          </span>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card className="p-8">
          <EmptyState message="Nenhum grupo encontrado." />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((g) => (
            <Card key={g.id} className="p-4 flex flex-col justify-between hover:shadow-sm transition border-border">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-base text-foreground">{g.grupo}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {g.periodos.length > 0 ? `Períodos: ${g.periodos.join(", ")}` : "Sem período vinculado"}
                    </p>
                  </div>
                  <Badge label={g.situacao} />
                </div>

                <div className="flex items-center gap-1.5 text-xs font-medium text-foreground bg-muted/40 px-2.5 py-1.5 rounded-lg mb-3">
                  <GraduationCap size={14} className="text-primary" />
                  <span>{g.alunoCount} aluno{g.alunoCount !== 1 ? "s" : ""} matriculado{g.alunoCount !== 1 ? "s" : ""}</span>
                </div>

                <div className="flex flex-col gap-1.5 mb-3">
                  {g.alunos.slice(0, 4).map((a) => a && (
                    <div key={a.id} className="flex items-center justify-between text-xs text-muted-foreground bg-card p-1.5 rounded border border-border/60">
                      <div className="flex items-center gap-2 truncate">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                          <GraduationCap size={10} className="text-emerald-600" />
                        </div>
                        <span className="truncate font-medium text-foreground">{a.nome}</span>
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground shrink-0 ml-1">RA {a.ra}</span>
                    </div>
                  ))}
                  {g.alunos.length > 4 && (
                    <p className="text-xs text-muted-foreground text-center pt-0.5">
                      +{g.alunos.length - 4} outros alunos
                    </p>
                  )}
                  {g.alunos.length === 0 && (
                    <p className="text-xs text-muted-foreground italic py-1">Nenhum aluno vinculado no momento.</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <Btn size="sm" variant="secondary" icon={<Edit2 size={12} />} onClick={() => handleOpenEditModal(g)}>
                  Editar
                </Btn>
                <button
                  className="p-1.5 hover:bg-red-50 text-muted-foreground hover:text-red-600 rounded transition"
                  onClick={() => setConfirmDeleteId(g.id)}
                  title="Excluir grupo"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* MODAL NOVO / EDITAR GRUPO */}
      <Modal
        open={showModal}
        title={editingGrupo ? `Editar Grupo #${editingGrupo.id}` : "Novo Grupo"}
        onClose={() => { setShowModal(false); setEditingGrupo(null); }}
        footer={
          <>
            <Btn variant="secondary" onClick={() => { setShowModal(false); setEditingGrupo(null); }}>
              Cancelar
            </Btn>
            <Btn onClick={handleSave}>
              {editingGrupo ? "Atualizar" : "Salvar"}
            </Btn>
          </>
        }
      >
        <div className="flex flex-col gap-3.5">
          {/* NOME DO GRUPO */}
          <Input
            label="Nome do Grupo"
            value={formData.grupo}
            error={formErrors.grupo}
            onChange={(val) => {
              setFormData((prev) => ({ ...prev, grupo: val }));
              if (formErrors.grupo) setFormErrors((prev) => ({ ...prev, grupo: "" }));
            }}
            placeholder="Ex: Grupo D"
            required
          />

          {/* SITUAÇÃO */}
          <Select
            label="Situação"
            value={formData.situacao}
            onChange={(val) => setFormData((prev) => ({ ...prev, situacao: val }))}
            options={[
              { value: "ATIVO", label: "Ativo" },
              { value: "INATIVO", label: "Inativo" },
            ]}
            required
          />

          {/* PERÍODO LETIVO INICIAL */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Período Letivo Principal
            </p>
            <Select
              label="Período Letivo"
              value={formData.id_periodo_letivo}
              onChange={(val) => setFormData((prev) => ({ ...prev, id_periodo_letivo: val }))}
              options={DB.periodos
                .filter((p) => p.situacao === "ATIVO")
                .map((p) => ({ value: String(p.id), label: `${p.periodo} (Ativo)` }))}
            />
          </div>

          {/* LIVE SELECTION PREVIEW BOX */}
          {formData.grupo && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs space-y-1.5 mt-1">
              <p className="font-semibold text-primary flex items-center gap-1.5 text-xs">
                <CheckCircle size={14} />
                Resumo do Grupo Selecionado:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground pt-1">
                <div>
                  <span className="font-medium text-foreground">Nome do Grupo: </span>
                  <span className="text-primary font-semibold">{formData.grupo}</span>
                </div>
                <div>
                  <span className="font-medium text-foreground">Situação: </span>
                  <Badge label={formData.situacao} />
                </div>
                {formData.id_periodo_letivo && (
                  <div className="col-span-full">
                    <span className="font-medium text-foreground">Período Letivo: </span>
                    <span className="text-foreground">
                      {DB.periodos.find((p) => String(p.id) === formData.id_periodo_letivo)?.periodo ?? "2025/1"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        open={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
        title="Excluir Grupo"
        message="Tem certeza de que deseja excluir este grupo acadêmico? Esta ação não pode ser desfeita."
        confirmLabel="Sim, excluir"
      />
    </div>
  );
}

// ============================================================
// PERÍODOS LETIVOS PAGE
// ============================================================
function PeriodosPage({ showToast }: { showToast: (m: string, t?: "success" | "error") => void }) {
  const [periodosList, setPeriodosList] = useState<Periodo[]>(() => [...DB.periodos]);
  const [search, setSearch] = useState("");
  const [filterSit, setFilterSit] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPeriodo, setEditingPeriodo] = useState<Periodo | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const initialFormState = {
    periodo: "",
    data_inicial: "2025-08-01",
    data_final: "2025-12-15",
    situacao: "ATIVO",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const enriched = useMemo(() => {
    return periodosList.map((p) => {
      const matCount = DB.matriculas.filter((m) => m.id_periodo_letivo === p.id).length;
      return { ...p, matCount };
    });
  }, [periodosList]);

  const filtered = useMemo(() => {
    return enriched.filter((p) => {
      const s = search.toLowerCase().trim();
      const matchSearch = !s || p.periodo.toLowerCase().includes(s);
      const matchSit = !filterSit || p.situacao === filterSit;
      return matchSearch && matchSit;
    });
  }, [enriched, search, filterSit]);

  const handleOpenCreateModal = () => {
    const existing = DB.periodos.map((p) => p.periodo);
    let suggested = "2025/2";
    if (existing.includes("2025/2")) {
      suggested = "2026/1";
    }

    setFormData({
      periodo: suggested,
      data_inicial: "2025-08-01",
      data_final: "2025-12-15",
      situacao: "ATIVO",
    });
    setFormErrors({});
    setEditingPeriodo(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (p: Periodo) => {
    setFormData({
      periodo: p.periodo,
      data_inicial: p.data_inicial,
      data_final: p.data_final,
      situacao: p.situacao,
    });
    setFormErrors({});
    setEditingPeriodo(p);
    setShowModal(true);
  };

  const handleSave = () => {
    const errors: Record<string, string> = {};
    if (!formData.periodo.trim()) errors.periodo = "Informe o período (Ex: 2025/2)";
    if (!formData.data_inicial) errors.data_inicial = "Informe a data inicial";
    if (!formData.data_final) errors.data_final = "Informe a data final";

    if (formData.data_inicial && formData.data_final && formData.data_final < formData.data_inicial) {
      errors.data_final = "A data final não pode ser anterior à data inicial";
    }

    const duplicate = DB.periodos.find(
      (p) =>
        p.periodo.trim().toLowerCase() === formData.periodo.trim().toLowerCase() &&
        (!editingPeriodo || p.id !== editingPeriodo.id)
    );
    if (duplicate) {
      errors.periodo = "Já existe um período com esta identificação";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast("Preencha os campos corretamente.", "error");
      return;
    }

    if (editingPeriodo) {
      // Update
      const idx = DB.periodos.findIndex((p) => p.id === editingPeriodo.id);
      if (idx !== -1) {
        DB.periodos[idx] = {
          ...DB.periodos[idx],
          periodo: formData.periodo.trim(),
          data_inicial: formData.data_inicial,
          data_final: formData.data_final,
          situacao: formData.situacao,
        };
      }
      setPeriodosList([...DB.periodos]);
      setShowModal(false);
      setEditingPeriodo(null);
      showToast("Período letivo atualizado com sucesso!");
    } else {
      // Create new
      const nextId = DB.periodos.reduce((m, p) => Math.max(m, p.id), 0) + 1;
      const newPeriodo: Periodo = {
        id: nextId,
        periodo: formData.periodo.trim(),
        data_inicial: formData.data_inicial,
        data_final: formData.data_final,
        situacao: formData.situacao || "ATIVO",
      };

      DB.periodos.unshift(newPeriodo);
      setPeriodosList([...DB.periodos]);
      setShowModal(false);
      showToast("Período letivo cadastrado com sucesso!");
    }
  };

  const handleDelete = (id: number) => {
    const idx = DB.periodos.findIndex((p) => p.id === id);
    if (idx !== -1) {
      DB.periodos.splice(idx, 1);
      setPeriodosList([...DB.periodos]);
      setConfirmDeleteId(null);
      showToast("Período letivo excluído com sucesso.");
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: "Gestão Acadêmica" }, { label: "Períodos Letivos" }]} />
      <PageHeader
        title="Períodos Letivos"
        sub={`${periodosList.length} períodos letivos cadastrados`}
        action={<Btn icon={<Plus size={14} />} onClick={handleOpenCreateModal}>Novo Período</Btn>}
      />

      <Card>
        <div className="flex flex-wrap gap-2 p-3 border-b border-border items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <SearchBar value={search} onChange={setSearch} placeholder="Buscar período (Ex: 2025/1)..." />
            <select
              value={filterSit}
              onChange={(e) => setFilterSit(e.target.value)}
              className="border border-border rounded px-2.5 py-1.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Todas as situações</option>
              <option value="ATIVO">Ativo</option>
              <option value="ENCERRADO">Encerrado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>
          <span className="text-xs text-muted-foreground">
            Exibindo {filtered.length} de {periodosList.length} períodos
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Período", "Data Inicial", "Data Final", "Matrículas Ativas", "Situação", "Ações"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <EmptyState message="Nenhum período letivo encontrado." />
                  </td>
                </tr>
              )}
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-accent/40 transition">
                  <td className="px-4 py-3 font-semibold text-foreground text-sm">{p.periodo}</td>
                  <td className="px-4 py-3 text-muted-foreground">{fmtDate(p.data_inicial)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{fmtDate(p.data_final)}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <span className="inline-flex items-center gap-1 font-medium text-foreground">
                      <Users size={12} className="text-primary" /> {p.matCount} matrícula{p.matCount !== 1 ? "s" : ""}
                    </span>
                  </td>
                  <td className="px-4 py-3"><Badge label={p.situacao} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        className="p-1 hover:bg-accent rounded transition text-muted-foreground hover:text-foreground"
                        onClick={() => handleOpenEditModal(p)}
                        title="Editar"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        className="p-1 hover:bg-red-50 rounded transition text-muted-foreground hover:text-red-600"
                        onClick={() => setConfirmDeleteId(p.id)}
                        title="Excluir"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL NOVO / EDITAR PERÍODO LETIVO */}
      <Modal
        open={showModal}
        title={editingPeriodo ? `Editar Período Letivo #${editingPeriodo.id}` : "Novo Período Letivo"}
        onClose={() => { setShowModal(false); setEditingPeriodo(null); }}
        footer={
          <>
            <Btn variant="secondary" onClick={() => { setShowModal(false); setEditingPeriodo(null); }}>
              Cancelar
            </Btn>
            <Btn onClick={handleSave}>
              {editingPeriodo ? "Atualizar" : "Salvar"}
            </Btn>
          </>
        }
      >
        <div className="flex flex-col gap-3.5">
          {/* IDENTIFICAÇÃO DO PERÍODO */}
          <Input
            label="Identificação do Período"
            value={formData.periodo}
            error={formErrors.periodo}
            onChange={(val) => {
              setFormData((prev) => ({ ...prev, periodo: val }));
              if (formErrors.periodo) setFormErrors((prev) => ({ ...prev, periodo: "" }));
            }}
            placeholder="Ex: 2025/2"
            required
          />

          {/* DATAS INICIAL E FINAL */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Data Inicial"
              type="date"
              value={formData.data_inicial}
              error={formErrors.data_inicial}
              onChange={(val) => {
                setFormData((prev) => ({ ...prev, data_inicial: val }));
                if (formErrors.data_inicial) setFormErrors((prev) => ({ ...prev, data_inicial: "" }));
              }}
              required
            />
            <Input
              label="Data Final"
              type="date"
              value={formData.data_final}
              error={formErrors.data_final}
              onChange={(val) => {
                setFormData((prev) => ({ ...prev, data_final: val }));
                if (formErrors.data_final) setFormErrors((prev) => ({ ...prev, data_final: "" }));
              }}
              required
            />
          </div>

          {/* SITUAÇÃO */}
          <Select
            label="Situação do Período"
            value={formData.situacao}
            onChange={(val) => setFormData((prev) => ({ ...prev, situacao: val }))}
            options={[
              { value: "ATIVO", label: "Ativo" },
              { value: "ENCERRADO", label: "Encerrado" },
              { value: "CANCELADO", label: "Cancelado" },
            ]}
            required
          />

          {/* LIVE SELECTION PREVIEW BOX */}
          {formData.periodo && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs space-y-1.5 mt-1">
              <p className="font-semibold text-primary flex items-center gap-1.5 text-xs">
                <CheckCircle size={14} />
                Resumo do Período Selecionado:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground pt-1">
                <div>
                  <span className="font-medium text-foreground">Período: </span>
                  <span className="text-primary font-semibold">{formData.periodo}</span>
                </div>
                <div>
                  <span className="font-medium text-foreground">Situação: </span>
                  <Badge label={formData.situacao} />
                </div>
                <div className="col-span-full">
                  <span className="font-medium text-foreground">Vigência: </span>
                  <span className="text-foreground">
                    {formData.data_inicial ? fmtDate(formData.data_inicial) : "—"} até {formData.data_final ? fmtDate(formData.data_final) : "—"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        open={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
        title="Excluir Período Letivo"
        message="Tem certeza de que deseja excluir este período letivo? Esta ação não pode ser desfeita."
        confirmLabel="Sim, excluir"
      />
    </div>
  );
}

// ============================================================
// MATRÍCULAS PAGE
// ============================================================
function MatriculasPage({ showToast }: { showToast: (m: string, t?: "success" | "error") => void }) {
  const [matriculasList, setMatriculasList] = useState<Matricula[]>(() => [...DB.matriculas]);
  const [search, setSearch] = useState("");
  const [filterSit, setFilterSit] = useState("");
  const [filterGrupo, setFilterGrupo] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingMatricula, setEditingMatricula] = useState<Matricula | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const initialFormState = {
    id_aluno: "",
    id_grupo: "",
    id_periodo_letivo: "3", // default to active period 2025/1
    data_matricula_inicio: "2025-02-03",
    data_matricula_final: "2025-06-30",
    situacao: "ATIVA",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const enriched = useMemo(() => {
    return matriculasList.map((m) => ({
      ...m,
      aluno: DB.alunos.find((a) => a.id === m.id_aluno),
      grupo: DB.grupos.find((g) => g.id === m.id_grupo),
      periodo: DB.periodos.find((p) => p.id === m.id_periodo_letivo),
    }));
  }, [matriculasList]);

  const filtered = useMemo(() => {
    return enriched.filter((m) => {
      const s = search.toLowerCase().trim();
      const matchSearch =
        !s ||
        (m.aluno?.nome.toLowerCase().includes(s) ?? false) ||
        (m.aluno?.ra.toLowerCase().includes(s) ?? false) ||
        (m.grupo?.grupo.toLowerCase().includes(s) ?? false);
      const matchSit = !filterSit || m.situacao === filterSit;
      const matchGrupo = !filterGrupo || String(m.id_grupo) === filterGrupo;
      return matchSearch && matchSit && matchGrupo;
    });
  }, [enriched, search, filterSit, filterGrupo]);

  const handleOpenCreateModal = () => {
    const activePeriod = DB.periodos.find((p) => p.id === 3) || DB.periodos[0];
    setFormData({
      id_aluno: "",
      id_grupo: "",
      id_periodo_letivo: activePeriod ? String(activePeriod.id) : "3",
      data_matricula_inicio: activePeriod?.data_inicial || "2025-02-03",
      data_matricula_final: activePeriod?.data_final || "2025-06-30",
      situacao: "ATIVA",
    });
    setFormErrors({});
    setEditingMatricula(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (m: typeof enriched[0]) => {
    setFormData({
      id_aluno: String(m.id_aluno),
      id_grupo: String(m.id_grupo),
      id_periodo_letivo: String(m.id_periodo_letivo),
      data_matricula_inicio: m.data_matricula_inicio,
      data_matricula_final: m.data_matricula_final,
      situacao: m.situacao,
    });
    setFormErrors({});
    setEditingMatricula(m);
    setShowModal(true);
  };

  const handleSave = () => {
    const errors: Record<string, string> = {};
    if (!formData.id_aluno) errors.id_aluno = "Selecione o aluno";
    if (!formData.id_grupo) errors.id_grupo = "Selecione o grupo";
    if (!formData.id_periodo_letivo) errors.id_periodo_letivo = "Selecione o período letivo";
    if (!formData.data_matricula_inicio) errors.data_matricula_inicio = "Informe a data de início";

    // Duplicate check
    const duplicate = DB.matriculas.find(
      (m) =>
        m.id_aluno === Number(formData.id_aluno) &&
        m.id_grupo === Number(formData.id_grupo) &&
        m.id_periodo_letivo === Number(formData.id_periodo_letivo) &&
        (!editingMatricula || m.id !== editingMatricula.id)
    );
    if (duplicate) {
      errors.id_aluno = "Este aluno já possui matrícula neste grupo e período letivo";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast("Preencha todos os campos obrigatórios corretamente.", "error");
      return;
    }

    if (editingMatricula) {
      // Update
      const idx = DB.matriculas.findIndex((m) => m.id === editingMatricula.id);
      if (idx !== -1) {
        DB.matriculas[idx] = {
          ...DB.matriculas[idx],
          id_aluno: Number(formData.id_aluno),
          id_grupo: Number(formData.id_grupo),
          id_periodo_letivo: Number(formData.id_periodo_letivo),
          data_matricula_inicio: formData.data_matricula_inicio,
          data_matricula_final: formData.data_matricula_final,
          situacao: formData.situacao,
        };
      }
      setMatriculasList([...DB.matriculas]);
      setShowModal(false);
      setEditingMatricula(null);
      showToast("Matrícula atualizada com sucesso!");
    } else {
      // Create new
      const nextId = DB.matriculas.reduce((m, mat) => Math.max(m, mat.id), 0) + 1;
      const newMatricula: Matricula = {
        id: nextId,
        id_aluno: Number(formData.id_aluno),
        id_grupo: Number(formData.id_grupo),
        id_periodo_letivo: Number(formData.id_periodo_letivo),
        data_matricula_inicio: formData.data_matricula_inicio,
        data_matricula_final: formData.data_matricula_final,
        situacao: formData.situacao || "ATIVA",
      };

      DB.matriculas.unshift(newMatricula);
      setMatriculasList([...DB.matriculas]);
      setShowModal(false);
      showToast("Matrícula criada com sucesso!");
    }
  };

  const handleDelete = (id: number) => {
    const idx = DB.matriculas.findIndex((m) => m.id === id);
    if (idx !== -1) {
      DB.matriculas.splice(idx, 1);
      setMatriculasList([...DB.matriculas]);
      setConfirmDeleteId(null);
      showToast("Matrícula excluída com sucesso.");
    }
  };

  // Live preview helpers
  const previewAluno = DB.alunos.find((a) => String(a.id) === formData.id_aluno);
  const previewGrupo = DB.grupos.find((g) => String(g.id) === formData.id_grupo);
  const previewPeriodo = DB.periodos.find((p) => String(p.id) === formData.id_periodo_letivo);

  return (
    <div>
      <Breadcrumb items={[{ label: "Gestão Acadêmica" }, { label: "Matrículas" }]} />
      <PageHeader
        title="Matrículas"
        sub={`${matriculasList.length} matrículas cadastradas`}
        action={<Btn icon={<Plus size={14} />} onClick={handleOpenCreateModal}>Nova Matrícula</Btn>}
      />

      <Card>
        <div className="flex flex-wrap gap-2 p-3 border-b border-border items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <SearchBar value={search} onChange={setSearch} placeholder="Buscar por aluno, RA ou grupo..." />
            <select
              value={filterGrupo}
              onChange={(e) => setFilterGrupo(e.target.value)}
              className="border border-border rounded px-2.5 py-1.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Todos os grupos</option>
              {DB.grupos.map((g) => (
                <option key={g.id} value={String(g.id)}>{g.grupo}</option>
              ))}
            </select>
            <select
              value={filterSit}
              onChange={(e) => setFilterSit(e.target.value)}
              className="border border-border rounded px-2.5 py-1.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Todas as situações</option>
              {["ATIVA", "ENCERRADA", "CANCELADA", "TRANCADA"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <span className="text-xs text-muted-foreground">
            Exibindo {filtered.length} de {matriculasList.length} registros
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Aluno", "RA", "Grupo", "Período", "Início", "Término", "Situação", "Ações"].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <EmptyState message="Nenhuma matrícula encontrada." />
                  </td>
                </tr>
              )}
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-accent/40 transition">
                  <td className="px-4 py-3 font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-xs shrink-0">
                        {m.aluno?.nome ? m.aluno.nome.charAt(0) : "A"}
                      </div>
                      <div>
                        <div>{m.aluno?.nome ?? "Aluno não encontrado"}</div>
                        {m.aluno?.email && <div className="text-[11px] text-muted-foreground">{m.aluno.email}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{m.aluno?.ra ?? "—"}</td>
                  <td className="px-4 py-3 font-medium">{m.grupo?.grupo ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.periodo?.periodo ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{fmtDate(m.data_matricula_inicio)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{fmtDate(m.data_matricula_final)}</td>
                  <td className="px-4 py-3"><Badge label={m.situacao} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        className="p-1 hover:bg-accent rounded transition text-muted-foreground hover:text-foreground"
                        onClick={() => handleOpenEditModal(m)}
                        title="Editar"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        className="p-1 hover:bg-red-50 rounded transition text-muted-foreground hover:text-red-600"
                        onClick={() => setConfirmDeleteId(m.id)}
                        title="Excluir"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL NOVA / EDITAR MATRÍCULA */}
      <Modal
        open={showModal}
        title={editingMatricula ? `Editar Matrícula #${editingMatricula.id}` : "Nova Matrícula"}
        onClose={() => { setShowModal(false); setEditingMatricula(null); }}
        footer={
          <>
            <Btn variant="secondary" onClick={() => { setShowModal(false); setEditingMatricula(null); }}>
              Cancelar
            </Btn>
            <Btn onClick={handleSave}>
              {editingMatricula ? "Atualizar" : "Salvar"}
            </Btn>
          </>
        }
      >
        <div className="flex flex-col gap-3.5">
          {/* ALUNO */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Aluno <span className="text-red-500">*</span>
            </p>
            <Select
              label="Selecionar Aluno"
              value={formData.id_aluno}
              error={formErrors.id_aluno}
              onChange={(val) => {
                setFormData((prev) => ({ ...prev, id_aluno: val }));
                if (formErrors.id_aluno) setFormErrors((prev) => ({ ...prev, id_aluno: "" }));
              }}
              options={DB.alunos.map((a) => ({
                value: String(a.id),
                label: `${a.nome} (RA ${a.ra}) - ${a.situacao}`,
              }))}
              required
            />
          </div>

          {/* GRUPO & PERÍODO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Grupo <span className="text-red-500">*</span>
              </p>
              <Select
                label="Grupo"
                value={formData.id_grupo}
                error={formErrors.id_grupo}
                onChange={(val) => {
                  setFormData((prev) => ({ ...prev, id_grupo: val }));
                  if (formErrors.id_grupo) setFormErrors((prev) => ({ ...prev, id_grupo: "" }));
                }}
                options={DB.grupos
                  .filter((g) => g.situacao === "ATIVO")
                  .map((g) => ({ value: String(g.id), label: g.grupo }))}
                required
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Período Letivo <span className="text-red-500">*</span>
              </p>
              <Select
                label="Período Letivo"
                value={formData.id_periodo_letivo}
                error={formErrors.id_periodo_letivo}
                onChange={(val) => {
                  const p = DB.periodos.find((per) => String(per.id) === val);
                  setFormData((prev) => ({
                    ...prev,
                    id_periodo_letivo: val,
                    data_matricula_inicio: p?.data_inicial || prev.data_matricula_inicio,
                    data_matricula_final: p?.data_final || prev.data_matricula_final,
                  }));
                  if (formErrors.id_periodo_letivo) setFormErrors((prev) => ({ ...prev, id_periodo_letivo: "" }));
                }}
                options={DB.periodos
                  .filter((p) => p.situacao === "ATIVO")
                  .map((p) => ({ value: String(p.id), label: p.periodo }))}
                required
              />
            </div>
          </div>

          {/* DATAS */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Vigência da Matrícula
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Data de Início"
                type="date"
                value={formData.data_matricula_inicio}
                error={formErrors.data_matricula_inicio}
                onChange={(val) => {
                  setFormData((prev) => ({ ...prev, data_matricula_inicio: val }));
                  if (formErrors.data_matricula_inicio) setFormErrors((prev) => ({ ...prev, data_matricula_inicio: "" }));
                }}
                required
              />
              <Input
                label="Data de Término"
                type="date"
                value={formData.data_matricula_final}
                onChange={(val) => setFormData((prev) => ({ ...prev, data_matricula_final: val }))}
              />
            </div>
          </div>

          {/* SITUAÇÃO */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Situação da Matrícula
            </p>
            <Select
              label="Situação"
              value={formData.situacao}
              onChange={(val) => setFormData((prev) => ({ ...prev, situacao: val }))}
              options={["ATIVA", "ENCERRADA", "CANCELADA", "TRANCADA"].map((s) => ({ value: s, label: s }))}
            />
          </div>

          {/* LIVE SELECTION PREVIEW BOX */}
          {(previewAluno || previewGrupo || previewPeriodo) && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs space-y-1.5 mt-1">
              <p className="font-semibold text-primary flex items-center gap-1.5 text-xs">
                <CheckCircle size={14} />
                Resumo da Matrícula Selecionada:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground pt-1">
                <div>
                  <span className="font-medium text-foreground">Aluno: </span>
                  {previewAluno ? (
                    <span className="text-primary font-semibold">
                      {previewAluno.nome} ({previewAluno.ra})
                    </span>
                  ) : (
                    <span className="italic text-muted-foreground/70">Não selecionado</span>
                  )}
                </div>
                <div>
                  <span className="font-medium text-foreground">Grupo: </span>
                  {previewGrupo ? (
                    <span className="text-foreground font-medium">{previewGrupo.grupo}</span>
                  ) : (
                    <span className="italic text-muted-foreground/70">Não selecionado</span>
                  )}
                </div>
                <div>
                  <span className="font-medium text-foreground">Período: </span>
                  {previewPeriodo ? (
                    <span className="text-foreground">{previewPeriodo.periodo}</span>
                  ) : (
                    <span className="italic text-muted-foreground/70">Não selecionado</span>
                  )}
                </div>
                <div>
                  <span className="font-medium text-foreground">Situação: </span>
                  <Badge label={formData.situacao} />
                </div>
                <div className="col-span-full">
                  <span className="font-medium text-foreground">Vigência: </span>
                  <span className="text-foreground">
                    {fmtDate(formData.data_matricula_inicio)} até {fmtDate(formData.data_matricula_final)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        open={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
        title="Excluir Matrícula"
        message="Tem certeza de que deseja excluir esta matrícula? Esta ação não pode ser desfeita."
        confirmLabel="Sim, excluir"
      />
    </div>
  );
}

// ============================================================
// ATENDIMENTOS PAGE
// ============================================================
function AtendimentosPage({ onNav, showToast }: {
  onNav: (p: Page, id?: number) => void;
  showToast: (m: string, t?: "success" | "error") => void;
}) {
  const [viewMode, setViewMode] = useState<"lista" | "calendario">("lista");
  const [filterSit, setFilterSit] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("2025-02");
  const [atendimentosList, setAtendimentosList] = useState<Atendimento[]>(() => [...DB.atendimentos]);
  const [showModal, setShowModal] = useState(false);
  const [editingAtendimento, setEditingAtendimento] = useState<Atendimento | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const initialFormState = {
    id_paciente: "",
    data: "2025-02-20",
    horario: "09:00",
    id_professor: "",
    id_matricula: "",
    id_clinica: "",
    situacao: "AGENDADO",
    observacoes: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const enriched = useMemo(() => {
    return atendimentosList.map((a) => {
      const pac = DB.pacientes.find((p) => p.id === a.id_paciente);
      const profRel = DB.professores_atendimentos.find((pa) => pa.id_atendimento === a.id);
      const prof = profRel ? DB.professores.find((p) => p.id === profRel.id_professor) : null;
      const clinRel = DB.atendimentos_clinicas.find((ac) => ac.id_atendimento === a.id);
      const clin = clinRel ? DB.clinicas.find((c) => c.id === clinRel.id_clinica) : null;
      const matRel = DB.matricula_atendimentos.find((ma) => ma.id_atendimento === a.id);
      const mat = matRel ? DB.matriculas.find((m) => m.id === matRel.id_matricula) : null;
      const aluno = mat ? DB.alunos.find((al) => al.id === mat.id_aluno) : null;
      return { ...a, pac, prof, clin, aluno, profRel, clinRel, matRel };
    });
  }, [atendimentosList]);

  const filtered = useMemo(() => {
    return enriched.filter((a) => {
      const matchSit = !filterSit || a.situacao === filterSit;
      const s = searchTerm.toLowerCase().trim();
      const matchSearch = !s ||
        (a.pac?.nome_completo && a.pac.nome_completo.toLowerCase().includes(s)) ||
        (a.pac?.cod_prontuario && a.pac.cod_prontuario.toLowerCase().includes(s)) ||
        (a.prof?.nome_completo && a.prof.nome_completo.toLowerCase().includes(s)) ||
        (a.aluno?.nome && a.aluno.nome.toLowerCase().includes(s)) ||
        (a.clin?.clinica && a.clin.clinica.toLowerCase().includes(s)) ||
        a.data_hora_agendada.includes(s);
      return matchSit && matchSearch;
    });
  }, [enriched, filterSit, searchTerm]);

  // Calendar calculations
  const [yearStr, monthStr] = selectedMonth.split("-");
  const year = parseInt(yearStr || "2025", 10);
  const month = parseInt(monthStr || "02", 10);
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => String(i + 1).padStart(2, "0"));

  const calDays = daysArray.map((d) => {
    const datePrefix = `${selectedMonth}-${d}`;
    const dayOfWeekIdx = new Date(year, month - 1, parseInt(d, 10)).getDay();
    const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return {
      date: d,
      fullDate: datePrefix,
      weekday: weekdays[dayOfWeekIdx],
      atends: enriched.filter((a) => a.data_hora_agendada.startsWith(datePrefix)),
    };
  });

  const monthLabel = useMemo(() => {
    const date = new Date(year, month - 1, 1);
    const m = date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    return m.charAt(0).toUpperCase() + m.slice(1);
  }, [year, month]);

  const handlePrevMonth = () => {
    let newM = month - 1;
    let newY = year;
    if (newM < 1) {
      newM = 12;
      newY -= 1;
    }
    setSelectedMonth(`${newY}-${String(newM).padStart(2, "0")}`);
  };

  const handleNextMonth = () => {
    let newM = month + 1;
    let newY = year;
    if (newM > 12) {
      newM = 1;
      newY += 1;
    }
    setSelectedMonth(`${newY}-${String(newM).padStart(2, "0")}`);
  };

  const handleOpenCreateModal = (prefillDate?: string) => {
    setFormData({
      id_paciente: "",
      data: prefillDate || `${selectedMonth}-20`,
      horario: "09:00",
      id_professor: "",
      id_matricula: "",
      id_clinica: "",
      situacao: "AGENDADO",
      observacoes: "",
    });
    setFormErrors({});
    setEditingAtendimento(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (atend: typeof enriched[0]) => {
    const [d, t] = atend.data_hora_agendada.split(" ");
    setFormData({
      id_paciente: String(atend.id_paciente),
      data: d || `${selectedMonth}-20`,
      horario: t || "09:00",
      id_professor: atend.profRel ? String(atend.profRel.id_professor) : "",
      id_matricula: atend.matRel ? String(atend.matRel.id_matricula) : "",
      id_clinica: atend.clinRel ? String(atend.clinRel.id_clinica) : "",
      situacao: atend.situacao || "AGENDADO",
      observacoes: atend.profRel?.observacoes || atend.clinRel?.observacoes || atend.matRel?.observacoes || "",
    });
    setFormErrors({});
    setEditingAtendimento(atend);
    setShowModal(true);
  };

  const handleSave = () => {
    const errors: Record<string, string> = {};
    if (!formData.id_paciente) errors.id_paciente = "Selecione o paciente";
    if (!formData.data) errors.data = "Informe a data";
    if (!formData.horario) errors.horario = "Informe o horário";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast("Preencha todos os campos obrigatórios.", "error");
      return;
    }

    const dataHora = `${formData.data} ${formData.horario}`;

    if (editingAtendimento) {
      // Update existing
      const targetId = editingAtendimento.id;
      const idx = DB.atendimentos.findIndex((a) => a.id === targetId);
      if (idx !== -1) {
        DB.atendimentos[idx] = {
          ...DB.atendimentos[idx],
          id_paciente: Number(formData.id_paciente),
          data_hora_agendada: dataHora,
          situacao: formData.situacao,
          data_hora_atendimento: formData.situacao === "REALIZADO" ? (DB.atendimentos[idx].data_hora_atendimento || dataHora) : DB.atendimentos[idx].data_hora_atendimento,
        };
      }

      // Update professor rel
      const profRelIdx = DB.professores_atendimentos.findIndex((p) => p.id_atendimento === targetId);
      if (formData.id_professor) {
        if (profRelIdx !== -1) {
          DB.professores_atendimentos[profRelIdx].id_professor = Number(formData.id_professor);
          DB.professores_atendimentos[profRelIdx].observacoes = formData.observacoes;
        } else {
          const nextProfId = DB.professores_atendimentos.reduce((m, p) => Math.max(m, p.id), 0) + 1;
          DB.professores_atendimentos.push({ id: nextProfId, id_professor: Number(formData.id_professor), id_atendimento: targetId, observacoes: formData.observacoes });
        }
      } else if (profRelIdx !== -1) {
        DB.professores_atendimentos.splice(profRelIdx, 1);
      }

      // Update clinica rel
      const clinRelIdx = DB.atendimentos_clinicas.findIndex((c) => c.id_atendimento === targetId);
      if (formData.id_clinica) {
        if (clinRelIdx !== -1) {
          DB.atendimentos_clinicas[clinRelIdx].id_clinica = Number(formData.id_clinica);
          DB.atendimentos_clinicas[clinRelIdx].observacoes = formData.observacoes;
        } else {
          const nextClinId = DB.atendimentos_clinicas.reduce((m, c) => Math.max(m, c.id), 0) + 1;
          DB.atendimentos_clinicas.push({ id: nextClinId, id_clinica: Number(formData.id_clinica), id_atendimento: targetId, observacoes: formData.observacoes });
        }
      } else if (clinRelIdx !== -1) {
        DB.atendimentos_clinicas.splice(clinRelIdx, 1);
      }

      // Update matricula rel
      const matRelIdx = DB.matricula_atendimentos.findIndex((m) => m.id_atendimento === targetId);
      if (formData.id_matricula) {
        if (matRelIdx !== -1) {
          DB.matricula_atendimentos[matRelIdx].id_matricula = Number(formData.id_matricula);
          DB.matricula_atendimentos[matRelIdx].observacoes = formData.observacoes;
        } else {
          const nextMatId = DB.matricula_atendimentos.reduce((m, ma) => Math.max(m, ma.id), 0) + 1;
          DB.matricula_atendimentos.push({ id: nextMatId, id_matricula: Number(formData.id_matricula), id_atendimento: targetId, observacoes: formData.observacoes });
        }
      } else if (matRelIdx !== -1) {
        DB.matricula_atendimentos.splice(matRelIdx, 1);
      }

      setAtendimentosList([...DB.atendimentos]);
      setShowModal(false);
      setEditingAtendimento(null);
      showToast("Atendimento atualizado com sucesso!");
    } else {
      // Create new
      const nextId = DB.atendimentos.reduce((m, a) => Math.max(m, a.id), 0) + 1;
      const newAtend: Atendimento = {
        id: nextId,
        id_paciente: Number(formData.id_paciente),
        data_hora_agendada: dataHora,
        data_hora_atendimento: formData.situacao === "REALIZADO" ? dataHora : null,
        situacao: formData.situacao || "AGENDADO",
      };

      DB.atendimentos.unshift(newAtend);

      if (formData.id_professor) {
        const nextProfId = DB.professores_atendimentos.reduce((m, p) => Math.max(m, p.id), 0) + 1;
        DB.professores_atendimentos.push({
          id: nextProfId,
          id_professor: Number(formData.id_professor),
          id_atendimento: nextId,
          observacoes: formData.observacoes || "",
        });
      }

      if (formData.id_matricula) {
        const nextMatId = DB.matricula_atendimentos.reduce((m, ma) => Math.max(m, ma.id), 0) + 1;
        DB.matricula_atendimentos.push({
          id: nextMatId,
          id_matricula: Number(formData.id_matricula),
          id_atendimento: nextId,
          observacoes: formData.observacoes || "",
        });
      }

      if (formData.id_clinica) {
        const nextClinId = DB.atendimentos_clinicas.reduce((m, c) => Math.max(m, c.id), 0) + 1;
        DB.atendimentos_clinicas.push({
          id: nextClinId,
          id_clinica: Number(formData.id_clinica),
          id_atendimento: nextId,
          observacoes: formData.observacoes || "",
        });
      }

      setAtendimentosList([...DB.atendimentos]);

      // Switch calendar view to month of created appointment if valid
      if (formData.data && formData.data.length >= 7) {
        setSelectedMonth(formData.data.substring(0, 7));
      }

      setShowModal(false);
      showToast("Atendimento agendado com sucesso!");
    }
  };

  const handleDelete = (id: number) => {
    const idx = DB.atendimentos.findIndex(a => a.id === id);
    if (idx !== -1) {
      DB.atendimentos.splice(idx, 1);
      const profIdx = DB.professores_atendimentos.findIndex(p => p.id_atendimento === id);
      if (profIdx !== -1) DB.professores_atendimentos.splice(profIdx, 1);
      const clinIdx = DB.atendimentos_clinicas.findIndex(c => c.id_atendimento === id);
      if (clinIdx !== -1) DB.atendimentos_clinicas.splice(clinIdx, 1);
      const matIdx = DB.matricula_atendimentos.findIndex(m => m.id_atendimento === id);
      if (matIdx !== -1) DB.matricula_atendimentos.splice(matIdx, 1);

      setAtendimentosList([...DB.atendimentos]);
      setConfirmDeleteId(null);
      showToast("Atendimento excluído com sucesso.");
    }
  };

  // Live Preview Selections
  const previewPac = DB.pacientes.find((p) => String(p.id) === formData.id_paciente);
  const previewProf = DB.professores.find((p) => String(p.id) === formData.id_professor);
  const previewMat = DB.matriculas.find((m) => String(m.id) === formData.id_matricula);
  const previewAluno = previewMat ? DB.alunos.find((a) => a.id === previewMat.id_aluno) : null;
  const previewGrupo = previewMat ? DB.grupos.find((g) => g.id === previewMat.id_grupo) : null;
  const previewClin = DB.clinicas.find((c) => String(c.id) === formData.id_clinica);

  return (
    <div>
      <Breadcrumb items={[{ label: "Principal" }, { label: "Atendimentos" }]} />
      <PageHeader
        title="Agenda de Atendimentos"
        sub={`${enriched.length} atendimentos registrados • ${monthLabel}`}
        action={
          <div className="flex items-center gap-2">
            <div className="flex border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("lista")}
                className={`px-3 py-1.5 text-xs font-medium transition ${viewMode === "lista" ? "bg-primary text-white" : "bg-card text-muted-foreground hover:bg-accent"}`}
              >
                Lista
              </button>
              <button
                onClick={() => setViewMode("calendario")}
                className={`px-3 py-1.5 text-xs font-medium transition ${viewMode === "calendario" ? "bg-primary text-white" : "bg-card text-muted-foreground hover:bg-accent"}`}
              >
                Calendário
              </button>
            </div>
            <Btn icon={<Plus size={14} />} onClick={() => handleOpenCreateModal()}>Novo Atendimento</Btn>
          </div>
        }
      />

      {viewMode === "lista" ? (
        <Card>
          <div className="flex flex-wrap gap-2 p-3 border-b border-border items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Buscar por paciente, professor, aluno..."
              />
              <select
                value={filterSit}
                onChange={(e) => setFilterSit(e.target.value)}
                className="border border-border rounded px-2.5 py-1.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Todas as situações</option>
                {["AGENDADO", "REALIZADO", "CANCELADO", "FALTOU", "REMARCADO"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <span className="text-xs text-muted-foreground">
              Exibindo {filtered.length} de {enriched.length} registros
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Data/Hora", "Paciente", "Professor", "Aluno", "Clínica", "Situação", "Ações"].map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7}>
                      <EmptyState message="Nenhum atendimento encontrado." />
                    </td>
                  </tr>
                )}
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-accent/40 transition cursor-pointer" onClick={() => onNav("atendimento-detalhe", a.id)}>
                    <td className="px-4 py-3 font-medium text-sm whitespace-nowrap">{fmtDatetime(a.data_hora_agendada)}</td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      <div>{a.pac?.nome_completo ?? "Paciente não vinculado"}</div>
                      {a.pac?.cod_prontuario && (
                        <div className="text-[11px] font-mono text-muted-foreground">{a.pac.cod_prontuario}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{a.prof?.nome_completo ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{a.aluno?.nome ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{a.clin?.clinica ?? "—"}</td>
                    <td className="px-4 py-3"><Badge label={a.situacao} /></td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <button
                          className="p-1 hover:bg-accent rounded transition text-muted-foreground hover:text-primary"
                          onClick={() => onNav("atendimento-detalhe", a.id)}
                          title="Ver detalhes"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="p-1 hover:bg-accent rounded transition text-muted-foreground hover:text-foreground"
                          onClick={() => handleOpenEditModal(a)}
                          title="Editar"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="p-1 hover:bg-red-50 rounded transition text-muted-foreground hover:text-red-600"
                          onClick={() => setConfirmDeleteId(a.id)}
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Calendar Month Navigation Header */}
          <div className="flex items-center justify-between bg-card p-3 rounded-xl border border-border">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-accent rounded-lg border border-border transition text-muted-foreground hover:text-foreground"
                title="Mês anterior"
              >
                <ChevronLeft size={16} />
              </button>
              <h2 className="text-sm font-semibold text-foreground min-w-36 text-center">
                {monthLabel}
              </h2>
              <button
                onClick={handleNextMonth}
                className="p-1.5 hover:bg-accent rounded-lg border border-border transition text-muted-foreground hover:text-foreground"
                title="Próximo mês"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterSit}
                onChange={(e) => setFilterSit(e.target.value)}
                className="border border-border rounded px-2.5 py-1 text-xs bg-card focus:outline-none"
              >
                <option value="">Todas as situações</option>
                {["AGENDADO", "REALIZADO", "CANCELADO", "FALTOU", "REMARCADO"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <Btn
                size="sm"
                variant="secondary"
                onClick={() => setSelectedMonth("2025-02")}
              >
                Fev/2025
              </Btn>
            </div>
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {calDays.map((day) => {
              const hasAtends = day.atends.length > 0;
              return (
                <div
                  key={day.fullDate}
                  className={`bg-card rounded-xl border p-3 min-h-32 flex flex-col transition-all ${hasAtends ? "border-primary/40 shadow-sm" : "border-border/80"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-bold text-foreground">{day.date}</span>
                      <span className="text-[11px] font-medium text-muted-foreground">/{String(month).padStart(2, "0")}</span>
                      <span className="text-[10px] text-muted-foreground ml-1">({day.weekday})</span>
                    </div>
                    <button
                      onClick={() => handleOpenCreateModal(day.fullDate)}
                      className="p-1 hover:bg-primary/10 hover:text-primary rounded text-muted-foreground transition"
                      title={`Agendar para ${day.date}/${String(month).padStart(2, "0")}`}
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  {day.atends.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                      <span className="text-[11px] text-muted-foreground/60">Sem consultas</span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1.5 flex-1">
                      {day.atends.map((a) => {
                        const [, time] = a.data_hora_agendada.split(" ");
                        const pacFirst = a.pac?.nome_completo.split(" ")[0] ?? "Paciente";
                        return (
                          <button
                            key={a.id}
                            onClick={() => onNav("atendimento-detalhe", a.id)}
                            className={`w-full text-left p-1.5 rounded text-[11px] font-medium leading-tight transition hover:opacity-85 shadow-xs border
                              ${a.situacao === "REALIZADO" ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : a.situacao === "CANCELADO" ? "bg-red-50 text-red-800 border-red-200"
                                  : a.situacao === "FALTOU" ? "bg-amber-50 text-amber-800 border-amber-200"
                                    : a.situacao === "REMARCADO" ? "bg-violet-50 text-violet-800 border-violet-200"
                                      : "bg-blue-50 text-blue-800 border-blue-200"}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">{time}</span>
                              <span className="text-[9px] uppercase font-bold tracking-tight opacity-75">{a.situacao}</span>
                            </div>
                            <div className="truncate mt-0.5">{pacFirst}</div>
                            {a.clin && (
                              <div className="text-[9px] text-muted-foreground truncate">{a.clin.clinica}</div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL NOVO / EDITAR ATENDIMENTO */}
      <Modal
        open={showModal}
        title={editingAtendimento ? `Editar Atendimento #${editingAtendimento.id}` : "Novo Atendimento"}
        onClose={() => { setShowModal(false); setEditingAtendimento(null); }}
        footer={
          <>
            <Btn variant="secondary" onClick={() => { setShowModal(false); setEditingAtendimento(null); }}>
              Cancelar
            </Btn>
            <Btn onClick={handleSave}>
              {editingAtendimento ? "Atualizar" : "Salvar"}
            </Btn>
          </>
        }
      >
        <div className="flex flex-col gap-3.5">
          {/* PACIENTE */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Paciente <span className="text-red-500">*</span>
            </p>
            <Select
              label="Selecionar Paciente"
              value={formData.id_paciente}
              error={formErrors.id_paciente}
              onChange={(val) => {
                setFormData((prev) => ({ ...prev, id_paciente: val }));
                if (formErrors.id_paciente) setFormErrors((prev) => ({ ...prev, id_paciente: "" }));
              }}
              options={DB.pacientes.map((p) => ({
                value: String(p.id),
                label: `${p.nome_completo} (${p.cod_prontuario}) - CPF: ${p.cpf}`,
              }))}
              required
            />
          </div>

          {/* DATA E HORÁRIO */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Data e Horário <span className="text-red-500">*</span>
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Data"
                type="date"
                value={formData.data}
                error={formErrors.data}
                onChange={(val) => {
                  setFormData((prev) => ({ ...prev, data: val }));
                  if (formErrors.data) setFormErrors((prev) => ({ ...prev, data: "" }));
                }}
                required
              />
              <Input
                label="Horário"
                type="time"
                value={formData.horario}
                error={formErrors.horario}
                onChange={(val) => {
                  setFormData((prev) => ({ ...prev, horario: val }));
                  if (formErrors.horario) setFormErrors((prev) => ({ ...prev, horario: "" }));
                }}
                required
              />
            </div>
          </div>

          {/* PROFESSOR */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Professor Responsável
            </p>
            <Select
              label="Selecionar Professor"
              value={formData.id_professor}
              onChange={(val) => setFormData((prev) => ({ ...prev, id_professor: val }))}
              options={DB.professores
                .filter((p) => p.situacao === "ATIVO")
                .map((p) => ({ value: String(p.id), label: p.nome_completo }))}
            />
          </div>

          {/* MATRÍCULA / ALUNO */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Aluno / Matrícula
            </p>
            <Select
              label="Selecionar Matrícula"
              value={formData.id_matricula}
              onChange={(val) => setFormData((prev) => ({ ...prev, id_matricula: val }))}
              options={DB.matriculas
                .filter((m) => m.situacao === "ATIVA")
                .map((m) => {
                  const al = DB.alunos.find((a) => a.id === m.id_aluno);
                  const g = DB.grupos.find((g) => g.id === m.id_grupo);
                  return {
                    value: String(m.id),
                    label: `${al?.nome ?? "Aluno"} — ${g?.grupo ?? "Sem grupo"} (RA: ${al?.ra ?? "—"})`,
                  };
                })}
            />
          </div>

          {/* CLÍNICA & SITUAÇÃO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Clínica
              </p>
              <Select
                label="Selecionar Clínica"
                value={formData.id_clinica}
                onChange={(val) => setFormData((prev) => ({ ...prev, id_clinica: val }))}
                options={DB.clinicas
                  .filter((c) => c.situacao === "ATIVO")
                  .map((c) => ({ value: String(c.id), label: c.clinica }))}
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Situação
              </p>
              <Select
                label="Situação do Atendimento"
                value={formData.situacao}
                onChange={(val) => setFormData((prev) => ({ ...prev, situacao: val }))}
                options={["AGENDADO", "REALIZADO", "CANCELADO", "FALTOU", "REMARCADO"].map((s) => ({
                  value: s,
                  label: s,
                }))}
              />
            </div>
          </div>

          {/* OBSERVAÇÕES */}
          <Input
            label="Observações (opcional)"
            value={formData.observacoes}
            onChange={(val) => setFormData((prev) => ({ ...prev, observacoes: val }))}
            placeholder="Anotações sobre a sessão, recomendações..."
          />

          {/* LIVE SELECTION PREVIEW BOX */}
          {(previewPac || formData.data || formData.horario || previewProf || previewClin || previewAluno) && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs space-y-1.5 mt-1">
              <p className="font-semibold text-primary flex items-center gap-1.5 text-xs">
                <CheckCircle size={14} />
                Resumo do Agendamento Selecionado:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground pt-1">
                <div>
                  <span className="font-medium text-foreground">Paciente: </span>
                  {previewPac ? (
                    <span className="text-primary font-semibold">
                      {previewPac.nome_completo} ({previewPac.cod_prontuario})
                    </span>
                  ) : (
                    <span className="italic text-muted-foreground/70">Não selecionado</span>
                  )}
                </div>
                <div>
                  <span className="font-medium text-foreground">Data/Hora: </span>
                  {formData.data || formData.horario ? (
                    <span className="text-foreground font-medium">
                      {formData.data ? fmtDate(formData.data) : "—"} {formData.horario ? `às ${formData.horario}` : ""}
                    </span>
                  ) : (
                    <span className="italic text-muted-foreground/70">Não definido</span>
                  )}
                </div>
                <div>
                  <span className="font-medium text-foreground">Professor: </span>
                  {previewProf ? (
                    <span className="text-foreground">{previewProf.nome_completo}</span>
                  ) : (
                    <span className="italic text-muted-foreground/70">Não vinculado</span>
                  )}
                </div>
                <div>
                  <span className="font-medium text-foreground">Clínica: </span>
                  {previewClin ? (
                    <span className="text-foreground">{previewClin.clinica}</span>
                  ) : (
                    <span className="italic text-muted-foreground/70">Não vinculada</span>
                  )}
                </div>
                {previewAluno && (
                  <div className="col-span-full">
                    <span className="font-medium text-foreground">Aluno: </span>
                    <span className="text-foreground">{previewAluno.nome} ({previewGrupo?.grupo})</span>
                  </div>
                )}
                <div>
                  <span className="font-medium text-foreground">Situação: </span>
                  <Badge label={formData.situacao} />
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        open={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
        title="Excluir Atendimento"
        message="Tem certeza de que deseja excluir este atendimento da agenda? Esta ação não pode ser desfeita."
        confirmLabel="Sim, excluir"
      />
    </div>
  );
}

// ============================================================
// ATENDIMENTO DETALHE PAGE
// ============================================================
function AtendimentoDetalhePage({ id, onBack, onNav, showToast }: {
  id: number; onBack: () => void;
  onNav: (p: Page, id?: number) => void;
  showToast: (m: string, t?: "success" | "error") => void;
}) {
  const [, setTick] = useState(0);
  const atend = DB.atendimentos.find((a) => a.id === id);
  if (!atend) return null;

  const handleUpdateStatus = (newSit: string, msg: string, isError = false) => {
    atend.situacao = newSit;
    if (newSit === "REALIZADO") {
      atend.data_hora_atendimento = atend.data_hora_atendimento || atend.data_hora_agendada;
    }
    setTick((t) => t + 1);
    showToast(msg, isError ? "error" : "success");
  };

  const pac = DB.pacientes.find((p) => p.id === atend.id_paciente);
  const profRel = DB.professores_atendimentos.find((pa) => pa.id_atendimento === atend.id);
  const prof = profRel ? DB.professores.find((p) => p.id === profRel.id_professor) : null;
  const clinRel = DB.atendimentos_clinicas.find((ac) => ac.id_atendimento === atend.id);
  const clin = clinRel ? DB.clinicas.find((c) => c.id === clinRel.id_clinica) : null;
  const matRel = DB.matricula_atendimentos.find((ma) => ma.id_atendimento === atend.id);
  const mat = matRel ? DB.matriculas.find((m) => m.id === matRel.id_matricula) : null;
  const aluno = mat ? DB.alunos.find((a) => a.id === mat.id_aluno) : null;
  const grupo = mat ? DB.grupos.find((g) => g.id === mat.id_grupo) : null;
  const periodo = mat ? DB.periodos.find((p) => p.id === mat.id_periodo_letivo) : null;
  const examesClinica = clin ? DB.clinicas_exames.filter((ce) => ce.id_clinica === clin.id) : [];

  return (
    <div>
      <Breadcrumb items={[{ label: "Atendimentos" }, { label: `Atendimento #${atend.id}` }]} />
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="p-1.5 hover:bg-accent rounded-lg transition text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-semibold">Atendimento #{atend.id}</h1>
          <p className="text-sm text-muted-foreground">{fmtDatetime(atend.data_hora_agendada)}</p>
        </div>
        <div className="ml-auto flex gap-2">
          {atend.situacao === "AGENDADO" && (
            <>
              <Btn size="sm" icon={<CheckCircle size={13} />} onClick={() => handleUpdateStatus("REALIZADO", "Atendimento marcado como realizado!")}>
                Marcar Realizado
              </Btn>
              <Btn size="sm" variant="secondary" icon={<RefreshCw size={13} />} onClick={() => handleUpdateStatus("REMARCADO", "Atendimento remarcado.")}>
                Remarcar
              </Btn>
              <Btn size="sm" variant="danger" icon={<XCircle size={13} />} onClick={() => handleUpdateStatus("CANCELADO", "Atendimento cancelado.", true)}>
                Cancelar
              </Btn>
            </>
          )}
          <Badge label={atend.situacao} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Calendar size={15} className="text-primary" /> Informações do Atendimento
          </h3>
          <InfoRow label="Data/Hora Agendada" value={fmtDatetime(atend.data_hora_agendada)} />
          <InfoRow label="Data/Hora Realizado" value={fmtDatetime(atend.data_hora_atendimento)} />
          <InfoRow label="Situação" value={<Badge label={atend.situacao} />} />
          {profRel?.observacoes && <InfoRow label="Observações do Professor" value={profRel.observacoes} />}
          {clinRel?.observacoes && <InfoRow label="Observações da Clínica" value={clinRel.observacoes} />}
          {matRel?.observacoes && <InfoRow label="Observações da Matrícula" value={matRel.observacoes} />}
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <HeartPulse size={15} className="text-teal-600" /> Paciente
          </h3>
          {pac ? (
            <>
              <InfoRow label="Nome" value={
                <button className="text-primary hover:underline font-medium" onClick={() => onNav("paciente-detalhe", pac.id)}>
                  {pac.nome_completo}
                </button>
              } />
              <InfoRow label="Prontuário" value={<span className="font-mono">{pac.cod_prontuario}</span>} />
              <InfoRow label="Nascimento" value={`${fmtDate(pac.data_nascimento)} (${calcIdade(pac.data_nascimento)} anos)`} />
              <InfoRow label="Situação" value={<Badge label={pac.situacao} />} />
            </>
          ) : <p className="text-sm text-muted-foreground">Paciente não encontrado.</p>}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <UserCheck size={15} className="text-violet-600" /> Professor
          </h3>
          {prof ? (
            <>
              <InfoRow label="Nome" value={
                <button className="text-primary hover:underline font-medium" onClick={() => onNav("professor-detalhe", prof.id)}>
                  {prof.nome_completo}
                </button>
              } />
              <InfoRow label="E-mail" value={prof.email} />
              <InfoRow label="Telefone" value={prof.telefone} />
            </>
          ) : <p className="text-sm text-muted-foreground">Nenhum professor vinculado.</p>}
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <GraduationCap size={15} className="text-emerald-600" /> Aluno / Matrícula
          </h3>
          {aluno ? (
            <>
              <InfoRow label="Nome" value={
                <button className="text-primary hover:underline font-medium" onClick={() => onNav("aluno-detalhe", aluno.id)}>
                  {aluno.nome}
                </button>
              } />
              <InfoRow label="RA" value={<span className="font-mono">{aluno.ra}</span>} />
              <InfoRow label="Grupo" value={grupo?.grupo} />
              <InfoRow label="Período" value={periodo?.periodo} />
              <InfoRow label="Matrícula" value={<Badge label={mat?.situacao ?? ""} />} />
            </>
          ) : <p className="text-sm text-muted-foreground">Nenhuma matrícula vinculada.</p>}
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Building2 size={15} className="text-blue-600" /> Clínica
          </h3>
          {clin ? (
            <>
              <InfoRow label="Clínica" value={clin.clinica} />
              <InfoRow label="Situação" value={<Badge label={clin.situacao} />} />
              {clinRel?.observacoes && <InfoRow label="Observações" value={clinRel.observacoes} />}
            </>
          ) : <p className="text-sm text-muted-foreground">Nenhuma clínica vinculada.</p>}
        </Card>
      </div>

      {examesClinica.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <FlaskConical size={15} className="text-amber-600" /> Exames da Clínica
          </h3>
          <div className="flex flex-col gap-2">
            {examesClinica.map((ce) => {
              const exame = DB.exames.find((e) => e.id === ce.id_exame);
              return (
                <div key={ce.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/20">
                  <FlaskConical size={14} className="text-amber-500 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{exame?.exame}</p>
                    {ce.resultado_obs && <p className="text-xs text-muted-foreground">{ce.resultado_obs}</p>}
                  </div>
                  {ce.path_documento && (
                    <div className="flex items-center gap-1.5 text-xs text-primary">
                      <FileText size={12} />
                      <span>{ce.path_documento}</span>
                      <button className="hover:text-primary/70"><Download size={12} /></button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

// ============================================================
// CLÍNICAS PAGE
// ============================================================
function ClinicasPage({ showToast }: { showToast: (m: string, t?: "success" | "error") => void }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <Breadcrumb items={[{ label: "Gestão Clínica" }, { label: "Clínicas" }]} />
      <PageHeader
        title="Clínicas"
        sub="Gerenciamento de clínicas e seus exames"
        action={<Btn icon={<Plus size={14} />} onClick={() => setShowModal(true)}>Nova Clínica</Btn>}
      />
      <div className="flex flex-col gap-4">
        {DB.clinicas.map((c) => {
          const atendCount = DB.atendimentos_clinicas.filter((ac) => ac.id_clinica === c.id).length;
          const exames = DB.clinicas_exames.filter((ce) => ce.id_clinica === c.id);
          return (
            <Card key={c.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Building2 size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{c.clinica}</h3>
                    <p className="text-xs text-muted-foreground">{atendCount} atendimento{atendCount !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge label={c.situacao} />
                  <button className="p-1 hover:bg-accent rounded transition text-muted-foreground hover:text-foreground">
                    <Edit2 size={13} />
                  </button>
                </div>
              </div>
              {exames.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Exames disponíveis</p>
                  <div className="flex flex-wrap gap-2">
                    {exames.map((ce) => {
                      const exame = DB.exames.find((e) => e.id === ce.id_exame);
                      return (
                        <div key={ce.id} className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                          <FlaskConical size={11} />
                          {exame?.exame}
                          {ce.path_documento && <FileText size={11} className="text-amber-600" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
      <Modal
        open={showModal}
        title="Nova Clínica"
        onClose={() => setShowModal(false)}
        footer={
          <>
            <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Btn>
            <Btn onClick={() => { setShowModal(false); showToast("Clínica cadastrada!"); }}>Salvar</Btn>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <Input label="Nome da Clínica" value="" onChange={() => { }} required />
          <Select label="Situação" value="" onChange={() => { }}
            options={[{ value: "ATIVO", label: "Ativo" }, { value: "INATIVO", label: "Inativo" }]} />
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// EXAMES PAGE
// ============================================================
function ExamesPage({ showToast }: { showToast: (m: string, t?: "success" | "error") => void }) {
  const [showModal, setShowModal] = useState(false);
  const [showRelModal, setShowRelModal] = useState(false);

  return (
    <div>
      <Breadcrumb items={[{ label: "Gestão Clínica" }, { label: "Exames" }]} />
      <PageHeader
        title="Exames"
        sub="Gerenciamento de exames e relacionamentos clínica/exame"
        action={
          <div className="flex gap-2">
            <Btn variant="secondary" icon={<Plus size={14} />} onClick={() => setShowRelModal(true)}>Relacionar Clínica/Exame</Btn>
            <Btn icon={<Plus size={14} />} onClick={() => setShowModal(true)}>Novo Exame</Btn>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-sm">Exames Cadastrados</h3>
          </div>
          <div className="divide-y divide-border">
            {DB.exames.map((e) => (
              <div key={e.id} className="px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <FlaskConical size={14} className="text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{e.exame}</p>
                </div>
                <Badge label={e.situacao} />
                <button className="p-1 hover:bg-accent rounded transition text-muted-foreground hover:text-foreground">
                  <Edit2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-sm">Relações Clínica / Exame</h3>
          </div>
          <div className="divide-y divide-border">
            {DB.clinicas_exames.map((ce) => {
              const clin = DB.clinicas.find((c) => c.id === ce.id_clinica);
              const exame = DB.exames.find((e) => e.id === ce.id_exame);
              return (
                <div key={ce.id} className="px-4 py-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{exame?.exame}</p>
                      <p className="text-xs text-muted-foreground">{clin?.clinica}</p>
                      {ce.resultado_obs && <p className="text-xs text-muted-foreground italic mt-0.5">{ce.resultado_obs}</p>}
                    </div>
                    {ce.path_documento ? (
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                        <FileText size={11} />
                        <span className="max-w-[100px] truncate">{ce.path_documento}</span>
                        <button className="hover:text-blue-500 ml-1" title="Baixar"><Download size={11} /></button>
                        <button className="hover:text-red-500" title="Remover"><X size={11} /></button>
                      </div>
                    ) : (
                      <button className="flex items-center gap-1 text-xs text-primary hover:underline">
                        <Upload size={11} /> Anexar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Modal
        open={showModal}
        title="Novo Exame"
        onClose={() => setShowModal(false)}
        footer={
          <>
            <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Btn>
            <Btn onClick={() => { setShowModal(false); showToast("Exame cadastrado!"); }}>Salvar</Btn>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <Input label="Nome do Exame" value="" onChange={() => { }} required />
          <Select label="Situação" value="" onChange={() => { }}
            options={[{ value: "ATIVO", label: "Ativo" }, { value: "INATIVO", label: "Inativo" }]} />
        </div>
      </Modal>

      <Modal
        open={showRelModal}
        title="Relacionar Clínica / Exame"
        onClose={() => setShowRelModal(false)}
        footer={
          <>
            <Btn variant="secondary" onClick={() => setShowRelModal(false)}>Cancelar</Btn>
            <Btn onClick={() => { setShowRelModal(false); showToast("Relação cadastrada!"); }}>Salvar</Btn>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <Select label="Clínica" value="" onChange={() => { }}
            options={DB.clinicas.map((c) => ({ value: String(c.id), label: c.clinica }))} required />
          <Select label="Exame" value="" onChange={() => { }}
            options={DB.exames.map((e) => ({ value: String(e.id), label: e.exame }))} required />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Resultado / Observação</label>
            <textarea
              rows={3}
              className="border border-border rounded px-3 py-1.5 text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              placeholder="Resultado ou observação do exame..."
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Documento</label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary/40 transition cursor-pointer">
              <Upload size={20} className="text-muted-foreground" />
              <p className="text-xs text-center">Clique para selecionar ou arraste um arquivo<br /><span className="text-[11px]">PDF, DOCX, JPG — máx. 10 MB</span></p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================
// PERFIL PAGE
// ============================================================
function PerfilPage({ user }: { user: Usuario }) {
  return (
    <div>
      <Breadcrumb items={[{ label: "Perfil" }]} />
      <PageHeader title="Meu Perfil" sub="Informações da sua conta" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6 flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <User size={36} className="text-primary" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-lg">{user.nome}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Badge label={user.perfil} />
        </Card>
        <Card className="p-4 col-span-2">
          <h3 className="font-semibold text-sm mb-3">Informações da Conta</h3>
          <InfoRow label="Nome" value={user.nome} />
          <InfoRow label="E-mail" value={user.email} />
          <InfoRow label="Perfil" value={<Badge label={user.perfil} />} />
          <InfoRow label="Situação" value={<Badge label={user.situacao} />} />
          <InfoRow label="Data de cadastro" value={fmtDate(user.data_criacao)} />
          <div className="mt-4 pt-3 border-t border-border">
            <Btn variant="secondary" icon={<Lock size={13} />}>Alterar Senha</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
let toastId = 0;

export default function App() {
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  const [page, setPage] = useState<Page>("dashboard");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: "success" | "error" }[]>([]);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  const navigate = (p: Page, id?: number) => {
    setPage(p);
    if (id !== undefined) setSelectedId(id);
  };

  const handleLogin = (user: Usuario) => {
    setCurrentUser(user);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage("dashboard");
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const pageTitle: Record<Page, string> = {
    login: "Login",
    dashboard: "Dashboard",
    usuarios: "Usuários",
    professores: "Professores",
    "professor-detalhe": "Detalhe do Professor",
    alunos: "Alunos",
    "aluno-detalhe": "Detalhe do Aluno",
    pacientes: "Pacientes",
    "paciente-detalhe": "Detalhe do Paciente",
    responsaveis: "Responsáveis",
    grupos: "Grupos",
    periodos: "Períodos Letivos",
    matriculas: "Matrículas",
    atendimentos: "Atendimentos",
    "atendimento-detalhe": "Detalhe do Atendimento",
    clinicas: "Clínicas",
    exames: "Exames",
    perfil: "Meu Perfil",
  };

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard user={currentUser} onNav={navigate} />;
      case "usuarios": return <UsuariosPage showToast={showToast} />;
      case "professores": return <ProfessoresPage onNav={navigate} showToast={showToast} />;
      case "professor-detalhe": return selectedId ? (
        <ProfessorDetalhePage id={selectedId} onBack={() => navigate("professores")} onNav={navigate} showToast={showToast} />
      ) : null;
      case "alunos": return <AlunosPage onNav={navigate} showToast={showToast} />;
      case "aluno-detalhe": return selectedId ? (
        <AlunoDetalhePage id={selectedId} onBack={() => navigate("alunos")} onNav={navigate} showToast={showToast} />
      ) : null;
      case "pacientes": return <PacientesPage onNav={navigate} showToast={showToast} />;
      case "paciente-detalhe": return selectedId ? (
        <PacienteDetalhePage id={selectedId} onBack={() => navigate("pacientes")} onNav={navigate} showToast={showToast} />
      ) : null;
      case "responsaveis": return <ResponsaveisPage showToast={showToast} />;
      case "grupos": return <GruposPage showToast={showToast} />;
      case "periodos": return <PeriodosPage showToast={showToast} />;
      case "matriculas": return <MatriculasPage showToast={showToast} />;
      case "atendimentos": return <AtendimentosPage onNav={navigate} showToast={showToast} />;
      case "atendimento-detalhe": return selectedId ? (
        <AtendimentoDetalhePage id={selectedId} onBack={() => navigate("atendimentos")} onNav={navigate} showToast={showToast} />
      ) : null;
      case "clinicas": return <ClinicasPage showToast={showToast} />;
      case "exames": return <ExamesPage showToast={showToast} />;
      case "perfil": return <PerfilPage user={currentUser} />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar
        perfil={currentUser.perfil}
        currentPage={page}
        onNav={navigate}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
        onLogout={handleLogout}
        userName={currentUser.nome}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header title={pageTitle[page]} onMenuClick={() => setSidebarCollapsed((c) => !c)} />

        <main className="flex-1 overflow-y-auto p-5">
          {renderPage()}
        </main>
      </div>

      <Toast toasts={toasts} />
    </div>
  );
}

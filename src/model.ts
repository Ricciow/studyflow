import { useEffect, useState } from "react";

export type Subject = {
  id: string;
  name: string;
  teacher: string;
  room: string;
  color: string;
  hours: number;
};
export type Task = {
  id: string;
  title: string;
  subjectId: string;
  due: string;
  priority: "Alta" | "Média" | "Baixa";
  done: boolean;
  description: string;
  checklist: { text: string; done: boolean }[];
  kind: "Tarefa" | "Prova" | "Trabalho" | "Apresentação";
};
export type Event = {
  id: string;
  title: string;
  subjectId: string;
  date: string;
  start: string;
  end: string;
  location: string;
  recurrence: string;
  notes: string;
  type: "Aula" | "Estudo" | "Pessoal";
};
export type Profile = {
  name: string;
  email: string;
  course: string;
  institution: string;
  days: string[];
  goal: number;
};
export const today = dateKey(new Date());
export function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function parseDate(date: string) {
  return new Date(`${date}T12:00:00`);
}
export function addDays(date: string, days: number) {
  const d = parseDate(date);
  d.setDate(d.getDate() + days);
  return dateKey(d);
}
export function shortDate(date: string) {
  return parseDate(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}
export function longDate(date: string) {
  return parseDate(date).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
export function weekDates(date: string) {
  const d = parseDate(date);
  return Array.from({ length: 7 }, (_, i) =>
    addDays(date, i - ((d.getDay() + 6) % 7)),
  );
}
export function occursOn(event: Event, date: string) {
  return (
    event.date === date ||
    (event.recurrence === "Semanal" &&
      date >= event.date &&
      parseDate(event.date).getDay() === parseDate(date).getDay())
  );
}
export function isOverdue(task: Task) {
  return !task.done && task.due < today;
}
export function uid() {
  return crypto.randomUUID();
}
export function studyTime(minutes: number) {
  const rounded = Math.max(0, Math.round(minutes));
  const remainder = rounded % 60;
  return `${Math.floor(rounded / 60)}h${remainder ? String(remainder).padStart(2, "0") : ""}`;
}

export const initialSubjects: Subject[] = [
  {
    id: "calculo",
    name: "Cálculo I",
    teacher: "Marcelo Silva",
    room: "Sala 203",
    color: "red",
    hours: 4,
  },
  {
    id: "poo",
    name: "Programação Orientada a Objetos",
    teacher: "Ana Costa",
    room: "Sala 305",
    color: "orange",
    hours: 4,
  },
  {
    id: "fisica",
    name: "Física Geral",
    teacher: "Carlos Mendes",
    room: "Sala 102",
    color: "blue",
    hours: 4,
  },
  {
    id: "ingles",
    name: "Inglês",
    teacher: "Juliana Santos",
    room: "Sala 401",
    color: "green",
    hours: 3,
  },
  {
    id: "algebra",
    name: "Álgebra Linear",
    teacher: "Roberto Alves",
    room: "Sala 205",
    color: "purple",
    hours: 3,
  },
  {
    id: "quimica",
    name: "Química Geral",
    teacher: "Fernando Lima",
    room: "Sala 310",
    color: "teal",
    hours: 3,
  },
];
export const initialTasks: Task[] = [
  {
    id: "t1",
    title: "Relatório de Física",
    subjectId: "fisica",
    due: addDays(today, 1),
    priority: "Alta",
    done: false,
    description:
      "Elaborar o relatório sobre o experimento de queda livre, incluindo gráficos e análise dos resultados.",
    checklist: [
      { text: "Ler o material da aula", done: true },
      { text: "Fazer os cálculos", done: true },
      { text: "Escrever o relatório", done: false },
      { text: "Revisar e formatar", done: false },
    ],
    kind: "Trabalho",
  },
  {
    id: "t2",
    title: "Lista de exercícios",
    subjectId: "calculo",
    due: addDays(today, 2),
    priority: "Média",
    done: false,
    description: "Resolver os exercícios 1 a 12 do capítulo de limites.",
    checklist: [],
    kind: "Tarefa",
  },
  {
    id: "t3",
    title: "Trabalho em grupo",
    subjectId: "poo",
    due: addDays(today, 4),
    priority: "Média",
    done: false,
    description:
      "Finalizar o diagrama de classes e revisar a implementação com o grupo.",
    checklist: [],
    kind: "Trabalho",
  },
  {
    id: "t4",
    title: "Leitura de artigo",
    subjectId: "ingles",
    due: addDays(today, 6),
    priority: "Baixa",
    done: false,
    description: "Ler o artigo e anotar os principais argumentos.",
    checklist: [],
    kind: "Tarefa",
  },
  {
    id: "t5",
    title: "Apresentação de Química",
    subjectId: "quimica",
    due: addDays(today, 9),
    priority: "Alta",
    done: false,
    description: "Preparar os slides sobre ligações químicas.",
    checklist: [],
    kind: "Apresentação",
  },
  {
    id: "t6",
    title: "Prova de Física Geral",
    subjectId: "fisica",
    due: addDays(today, 12),
    priority: "Alta",
    done: false,
    description: "Conteúdo: cinemática e leis de Newton. Horário: 14h.",
    checklist: [],
    kind: "Prova",
  },
  {
    id: "t7",
    title: "Revisão de vetores",
    subjectId: "algebra",
    due: today,
    priority: "Baixa",
    done: true,
    description: "Revisar as anotações da aula.",
    checklist: [],
    kind: "Tarefa",
  },
];
export const initialEvents: Event[] = [
  {
    id: "e1",
    title: "Cálculo I",
    subjectId: "calculo",
    date: today,
    start: "08:00",
    end: "09:50",
    location: "Sala 203",
    recurrence: "Semanal",
    notes: "Ler o capítulo 4 antes da aula.",
    type: "Aula",
  },
  {
    id: "e2",
    title: "Programação Orientada a Objetos",
    subjectId: "poo",
    date: today,
    start: "10:00",
    end: "11:50",
    location: "Sala 305",
    recurrence: "Semanal",
    notes: "",
    type: "Aula",
  },
  {
    id: "e3",
    title: "Física Geral",
    subjectId: "fisica",
    date: today,
    start: "14:00",
    end: "15:50",
    location: "Sala 102",
    recurrence: "Semanal",
    notes: "",
    type: "Aula",
  },
  {
    id: "e4",
    title: "Estudo · Cálculo I",
    subjectId: "calculo",
    date: today,
    start: "16:00",
    end: "18:00",
    location: "Biblioteca",
    recurrence: "Não repetir",
    notes: "Revisar exercícios.",
    type: "Estudo",
  },
  {
    id: "e5",
    title: "Academia",
    subjectId: "",
    date: today,
    start: "18:10",
    end: "19:00",
    location: "Academia",
    recurrence: "Não repetir",
    notes: "",
    type: "Pessoal",
  },
  {
    id: "e6",
    title: "Inglês",
    subjectId: "ingles",
    date: addDays(today, 1),
    start: "14:00",
    end: "15:30",
    location: "Sala 401",
    recurrence: "Semanal",
    notes: "",
    type: "Aula",
  },
  {
    id: "e7",
    title: "Trabalho em grupo",
    subjectId: "poo",
    date: addDays(today, 2),
    start: "16:00",
    end: "18:00",
    location: "Biblioteca",
    recurrence: "Não repetir",
    notes: "",
    type: "Estudo",
  },
];
export const initialProfile: Profile = {
  name: "Lucas Ferreira",
  email: "lucas@estudante.com",
  course: "Ciência da Computação",
  institution: "Faculdade",
  days: ["Seg", "Ter", "Qua", "Qui", "Sex"],
  goal: 20,
};

export function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(`studyflow:v1:${key}`);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  });
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(`studyflow:v1:${key}`, JSON.stringify(value));
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }, [key, value]);
  return [value, setValue, failed] as const;
}

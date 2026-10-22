import { useEffect, useState, type ReactNode } from "react";
import {
  HomeIcon,
  CalendarIcon,
  CheckboxIcon,
  BackpackIcon,
  PersonIcon,
  BellIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  Pencil1Icon,
  GearIcon,
  CheckIcon,
  TargetIcon,
  BarChartIcon,
  ReaderIcon,
  ExitIcon,
  InfoCircledIcon,
  CheckCircledIcon,
  Cross2Icon,
  RocketIcon,
} from "@radix-ui/react-icons";
import {
  BottomSheet,
  MobileScroll,
  useKeyboard,
  useKeyboardInsets,
  useScreenPortal,
} from "./mobile";
import {
  Badge,
  Empty,
  Field,
  Icon,
  IconButton,
  Input,
  PageTitle,
  Progress,
  SectionTitle,
  Segments,
} from "./components";
import {
  EventForm,
  TaskForm,
  SubjectForm,
  ProfileForm,
  SubjectSelect,
} from "./forms";
import {
  addDays,
  initialEvents,
  initialProfile,
  initialSubjects,
  initialTasks,
  isOverdue,
  longDate,
  occursOn,
  parseDate,
  shortDate,
  studyTime,
  today,
  uid,
  useStored,
  weekDates,
  type Event,
  type Subject,
  type Task,
} from "./model";
import { Welcome, Auth, Setup } from "./onboarding";

type Page =
  | "home"
  | "agenda"
  | "tasks"
  | "studies"
  | "profile"
  | "subjects"
  | "planning"
  | "exams"
  | "reports"
  | "notifications"
  | "task-detail"
  | "event-detail"
  | "event-form"
  | "task-form"
  | "subject-form"
  | "profile-form"
  | "welcome"
  | "register"
  | "login"
  | "setup";
type StudyLog = {
  id: string;
  subjectId: string;
  minutes: number;
  date: string;
};
const navigation = [
  { id: "home", label: "Início", icon: HomeIcon },
  { id: "agenda", label: "Agenda", icon: CalendarIcon },
  { id: "tasks", label: "Tarefas", icon: CheckboxIcon },
  { id: "studies", label: "Estudos", icon: BackpackIcon },
  { id: "profile", label: "Perfil", icon: PersonIcon },
] as const;
const titles: Partial<Record<Page, string>> = {
  agenda: "Minha agenda",
  tasks: "Minhas tarefas",
  studies: "Meus estudos",
  profile: "Meu perfil",
  subjects: "Minhas matérias",
  planning: "Planejamento de estudos",
  exams: "Provas e trabalhos",
  reports: "Minha evolução",
  notifications: "Notificações",
  "task-detail": "Detalhes da tarefa",
  "event-detail": "Detalhes do compromisso",
  "event-form": "Novo compromisso",
  "task-form": "Nova tarefa",
  "subject-form": "Nova matéria",
  "profile-form": "Editar perfil",
  setup: "Do seu jeito",
};

export default function Prototype() {
  const [page, setPage] = useState<Page>("home");
  const [subjects, setSubjects, subjectFail] = useStored(
    "subjects",
    initialSubjects,
  );
  const [tasks, setTasks, taskFail] = useStored("tasks", initialTasks);
  const [events, setEvents, eventFail] = useStored("events", initialEvents);
  const [profile, setProfile, profileFail] = useStored(
    "profile",
    initialProfile,
  );
  const [logs, setLogs, logFail] = useStored<StudyLog[]>("study-logs", [
    { id: "l1", subjectId: "calculo", minutes: 240, date: today },
    { id: "l2", subjectId: "poo", minutes: 180, date: today },
    { id: "l3", subjectId: "fisica", minutes: 180, date: today },
    { id: "l4", subjectId: "ingles", minutes: 120, date: today },
  ]);
  const [settings, setSettings] = useStored("settings", {
    lessons: true,
    tasks: true,
    read: false,
  });
  const [toast, setToast] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("t1");
  const [selectedEventId, setSelectedEventId] = useState("e1");
  const [selectedEventDate, setSelectedEventDate] = useState(today);
  const [editingTask, setEditingTask] = useState<Task>();
  const [editingEvent, setEditingEvent] = useState<Event>();
  const [editingSubject, setEditingSubject] = useState<Subject>();
  const [taskFilter, setTaskFilter] = useState("Pendentes");
  const [examFilter, setExamFilter] = useState("Todos");
  const [sort, setSort] = useState("due");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("Dia");
  const [date, setDate] = useState(today);
  const [addOpen, setAddOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const keyboard = useKeyboard();
  const { screenRef } = useScreenPortal();
  const { isKeyboardVisible } = useKeyboardInsets();
  useEffect(() => {
    // Native focus can scroll a hidden ancestor while the simulated keyboard is
    // moving. Only MobileScroll should scroll; keep the preview screen anchored.
    const screen = screenRef.current;
    const anchorScreen = () => {
      if (screen && (screen.scrollTop || screen.scrollLeft))
        screen.scrollTo(0, 0);
    };
    anchorScreen();
    screen?.addEventListener("scroll", anchorScreen);
    return () => screen?.removeEventListener("scroll", anchorScreen);
  }, [screenRef]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(id);
  }, [toast]);
  const go = (next: Page) => {
    keyboard.hide();
    setPage(next);
    setAddOpen(false);
    setLogOpen(false);
  };
  const notify = (message: string) => setToast(message);
  const subject = (id: string) => subjects.find((s) => s.id === id);
  const pending = tasks.filter((t) => !t.done);
  const week = weekDates(date);
  const visibleWeekEvents = events.filter((e) =>
    week.some((d) => occursOn(e, d)),
  );
  const weekStartHour = Math.min(
    7,
    ...visibleWeekEvents.map((e) => Number(e.start.slice(0, 2))),
  );
  const weekEndHour = Math.max(
    21,
    ...visibleWeekEvents.map((e) =>
      Math.ceil(Number(e.end.slice(0, 2)) + Number(e.end.slice(3)) / 60),
    ),
  );
  const weekHeight = (weekEndHour - weekStartHour) * 32;
  const currentWeek = weekDates(today);
  const weekLogs = logs.filter((l) => currentWeek.includes(l.date));
  const minutes = weekLogs.reduce((sum, l) => sum + l.minutes, 0);
  const progress = Math.min(
    100,
    Math.round((minutes / (profile.goal * 60)) * 100),
  );
  const completed = tasks.filter((t) => t.done).length;
  const selectedTask = tasks.find((t) => t.id === selectedTaskId);
  const selectedEvent = events.find((e) => e.id === selectedEventId);
  const dayEvents = events
    .filter((e) => occursOn(e, date))
    .sort((a, b) => a.start.localeCompare(b.start));
  const todayClasses = events
    .filter((e) => occursOn(e, today) && e.type === "Aula")
    .sort((a, b) => a.start.localeCompare(b.start));
  const nextExam = pending
    .filter((t) => t.kind === "Prova" && t.due >= today)
    .sort((a, b) => a.due.localeCompare(b.due))[0];
  const active = ["subjects", "planning", "exams", "reports"].includes(page)
    ? "studies"
    : ["event-form", "event-detail"].includes(page)
      ? "agenda"
      : ["task-detail", "task-form"].includes(page)
        ? "tasks"
        : page;
  const onboarding = ["welcome", "register", "login", "setup"].includes(page);
  const root = navigation.some((n) => n.id === page);
  const back = () =>
    go(
      page === "task-form" && editingTask
        ? "task-detail"
        : page === "event-form" && editingEvent
          ? "event-detail"
          : ["task-detail", "task-form"].includes(page)
            ? "tasks"
            : ["event-detail", "event-form"].includes(page)
              ? "agenda"
              : page === "subject-form"
                ? "subjects"
                : page === "profile-form"
                  ? "profile"
                  : page === "notifications"
                    ? "home"
                    : "studies",
    );
  const openTask = (task: Task) => {
    setSelectedTaskId(task.id);
    go("task-detail");
  };
  const openEvent = (event: Event, occurrenceDate = event.date) => {
    setSelectedEventId(event.id);
    setSelectedEventDate(occurrenceDate);
    go("event-detail");
  };
  const newEvent = () => {
    setEditingEvent(undefined);
    go("event-form");
  };
  const newTask = () => {
    setEditingTask(undefined);
    go("task-form");
  };
  const toggleTask = (task: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t)),
    );
    notify(
      task.done ? "Tarefa reaberta." : "Mais uma conquista! Tarefa concluída.",
    );
  };
  const saveEvent = (event: Event) => {
    setEvents((prev) => [...prev.filter((e) => e.id !== event.id), event]);
    setDate(event.date);
    go("agenda");
    notify("Compromisso salvo na sua agenda.");
  };
  const saveTask = (task: Task) => {
    setTasks((prev) => [...prev.filter((t) => t.id !== task.id), task]);
    setSelectedTaskId(task.id);
    go("task-detail");
    notify("Tarefa salva. Tudo organizado!");
  };
  const filteredTasks = tasks
    .filter(
      (t) =>
        (taskFilter === "Concluídas"
          ? t.done
          : taskFilter === "Atrasadas"
            ? isOverdue(t)
            : !t.done) &&
        `${t.title} ${subject(t.subjectId)?.name}`
          .toLocaleLowerCase("pt-BR")
          .includes(search.toLocaleLowerCase("pt-BR")),
    )
    .sort((a, b) =>
      sort === "priority"
        ? ["Alta", "Média", "Baixa"].indexOf(a.priority) -
            ["Alta", "Média", "Baixa"].indexOf(b.priority) ||
          a.due.localeCompare(b.due)
        : a.due.localeCompare(b.due),
    );
  const taskRow = (task: Task) => (
    <div className={`task-row ${task.done ? "done" : ""}`} key={task.id}>
      <button
        className="task-check"
        aria-label={
          task.done ? `Reabrir ${task.title}` : `Concluir ${task.title}`
        }
        aria-pressed={task.done}
        onClick={() => toggleTask(task)}
      >
        {task.done && <Icon icon={CheckIcon} size={15} />}
      </button>
      <button className="task-content" onClick={() => openTask(task)}>
        <strong>{task.title}</strong>
        <span>
          {subject(task.subjectId)?.name} ·{" "}
          <span className={isOverdue(task) ? "overdue" : ""}>
            {shortDate(task.due)}
            {isOverdue(task) && " · Atrasada"}
          </span>
        </span>
      </button>
      <Badge priority={task.priority} />
    </div>
  );
  const eventRow = (event: Event) => (
    <button
      className={`event-row color-${event.type === "Estudo" ? "purple" : (subject(event.subjectId)?.color ?? "gray")}`}
      key={event.id}
      onClick={() => openEvent(event, page === "home" ? today : date)}
    >
      <span className="event-dot" />
      <span className="event-info">
        <strong>{event.title}</strong>
        <span>
          {event.start}–{event.end}
          <span className="separator">·</span>
          {event.location || event.type}
        </span>
      </span>
      <Icon icon={ChevronRightIcon} size={16} />
    </button>
  );
  const quickLink = (
    icon: any,
    label: string,
    description: string,
    target: Page,
    color = "red",
  ) => (
    <button className="menu-card" onClick={() => go(target)}>
      <span className={`tile color-${color}`}>
        <Icon icon={icon} size={23} />
      </span>
      <span>
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
      <Icon icon={ChevronRightIcon} size={18} />
    </button>
  );

  let content: ReactNode;
  switch (page) {
    case "home":
      content = (
        <>
          <div className="today-heading">
            <span className="eyebrow">SEU DIA, COM MAIS LEVEZA</span>
            <p className="date-label">{longDate(today)}</p>
          </div>
          <section className="classes-card">
            <div className="section-title">
              <h2>Próximas aulas</h2>
              <button
                className="text-button"
                onClick={() => {
                  setDate(today);
                  go("agenda");
                }}
              >
                Ver agenda
                <Icon icon={ChevronRightIcon} size={14} />
              </button>
            </div>
            <div className="classes-list">
              {todayClasses.length ? (
                todayClasses.slice(0, 3).map(eventRow)
              ) : (
                <p className="no-classes">
                  Hoje não tem aula. Aproveite para cuidar de você.
                </p>
              )}
            </div>
          </section>
          <div className="stats-grid">
            <button className="stat-card" onClick={() => go("tasks")}>
              <span className="stat-label">
                <span className="mini-icon red">
                  <Icon icon={CheckboxIcon} size={18} />
                </span>
                Tarefas pendentes
              </span>
              <strong>
                {pending.length}
                <small>para colocar em dia</small>
              </strong>
              <span className="text-link">
                Ver tarefas
                <Icon icon={ChevronRightIcon} size={13} />
              </span>
            </button>
            <button className="stat-card" onClick={() => go("reports")}>
              <span className="stat-label">
                <span className="mini-icon blue">
                  <Icon icon={BarChartIcon} size={18} />
                </span>
                Meta da semana
              </span>
              <strong>
                {progress}%
                <small>
                  {studyTime(minutes)} de {profile.goal}h
                </small>
              </strong>
              <Progress value={progress} label="Meta semanal de estudo" />
            </button>
          </div>
          <div className="quick-actions">
            <button
              onClick={() => {
                keyboard.hide();
                setAddOpen(true);
              }}
            >
              <span className="round-icon">
                <Icon icon={PlusIcon} size={22} />
              </span>
              <span>
                Adicionar
                <br />
                compromisso
              </span>
            </button>
            <button
              onClick={() => {
                setView("Semana");
                go("agenda");
              }}
            >
              <span className="round-icon pale">
                <Icon icon={CalendarIcon} size={22} />
              </span>
              <span>
                Calendário
                <br />
                semanal
              </span>
            </button>
          </div>
          <SectionTitle action="Ver todas" onClick={() => go("tasks")}>
            Para ficar de olho
          </SectionTitle>
          <div className="card compact">
            {pending
              .slice()
              .sort((a, b) => a.due.localeCompare(b.due))
              .slice(0, 2)
              .map(taskRow)}
          </div>
          <div className="encouragement">
            <Icon icon={RocketIcon} size={19} />
            <p>
              Um passo de cada vez.
              <br />
              <strong>Seu futuro agradece o esforço de hoje.</strong>
            </p>
          </div>
        </>
      );
      break;
    case "agenda":
      content = (
        <>
          <Segments
            values={["Dia", "Semana"]}
            selected={view}
            onChange={setView}
          />
          <div className="date-navigation">
            <IconButton
              icon={ChevronLeftIcon}
              label={view === "Dia" ? "Dia anterior" : "Semana anterior"}
              onClick={() => setDate(addDays(date, view === "Dia" ? -1 : -7))}
            />
            <button className="date-title" onClick={() => setDate(today)}>
              {view === "Dia"
                ? longDate(date)
                : `${shortDate(week[0])} – ${shortDate(week[6])}`}
              <small>{date === today ? "Hoje" : "Voltar para hoje"}</small>
            </button>
            <IconButton
              icon={ChevronRightIcon}
              label={view === "Dia" ? "Próximo dia" : "Próxima semana"}
              onClick={() => setDate(addDays(date, view === "Dia" ? 1 : 7))}
            />
          </div>
          <div className="week-strip">
            {week.map((d) => (
              <button
                key={d}
                className={d === date ? "selected" : ""}
                aria-pressed={d === date}
                onClick={() => setDate(d)}
              >
                <span>
                  {parseDate(d)
                    .toLocaleDateString("pt-BR", { weekday: "short" })
                    .replace(".", "")}
                </span>
                <strong>{parseDate(d).getDate()}</strong>
                <span
                  className={`day-marker ${events.some((e) => occursOn(e, d)) ? "has-event" : ""}`}
                />
              </button>
            ))}
          </div>
          {view === "Dia" ? (
            <>
              <SectionTitle>{dayEvents.length} compromissos</SectionTitle>
              <div className="timeline">
                {dayEvents.map((e) => (
                  <div className="timeline-row" key={e.id}>
                    <span className="timeline-time">
                      {e.start}
                      <small>{e.end}</small>
                    </span>
                    {eventRow(e)}
                  </div>
                ))}
              </div>
              {!dayEvents.length && (
                <Empty
                  title="Seu dia está livre"
                  action="Adicionar compromisso"
                  onClick={newEvent}
                >
                  Reserve um horário para o que importa.
                </Empty>
              )}
            </>
          ) : (
            <>
              <p className="calendar-hint">
                Toque em um dia para ver seus compromissos abaixo.
              </p>
              <div className="weekly-agenda" style={{ height: weekHeight }}>
                <div className="week-hours">
                  {Array.from(
                    { length: weekEndHour - weekStartHour + 1 },
                    (_, i) => (
                      <span key={i} style={{ top: i * 32 }}>
                        {String(weekStartHour + i).padStart(2, "0")}:00
                      </span>
                    ),
                  )}
                </div>
                <div className="week-columns">
                  {week.map((d) => (
                    <div
                      className="week-column"
                      key={d}
                      aria-label={longDate(d)}
                    >
                      {events
                        .filter((e) => occursOn(e, d))
                        .map((e) => {
                          const start =
                            Number(e.start.slice(0, 2)) +
                            Number(e.start.slice(3)) / 60;
                          const end =
                            Number(e.end.slice(0, 2)) +
                            Number(e.end.slice(3)) / 60;
                          return (
                            <button
                              key={e.id}
                              className={`week-event color-${e.type === "Estudo" ? "purple" : (subject(e.subjectId)?.color ?? "gray")}`}
                              style={{
                                top: `${(start - weekStartHour) * 32}px`,
                                height: `${Math.max(20, (end - start) * 32)}px`,
                              }}
                              title={`${e.title}, ${e.start}–${e.end}`}
                              aria-label={`${e.title}, ${e.start}–${e.end}, ${longDate(d)}`}
                              onClick={() => openEvent(e, d)}
                            >
                              <strong>
                                {e.title === "Programação Orientada a Objetos"
                                  ? "Prog. O.O."
                                  : e.title}
                              </strong>
                              <small>{e.start}</small>
                            </button>
                          );
                        })}
                    </div>
                  ))}
                </div>
              </div>
              <SectionTitle>Compromissos de {shortDate(date)}</SectionTitle>
              <div className="card weekly-details">
                {dayEvents.length ? (
                  dayEvents.map(eventRow)
                ) : (
                  <p className="no-classes">Nenhum compromisso neste dia.</p>
                )}
              </div>
            </>
          )}
          <button className="button primary full" onClick={newEvent}>
            <Icon icon={PlusIcon} size={18} />
            Novo compromisso
          </button>
        </>
      );
      break;
    case "tasks":
      content = (
        <>
          <p className="page-intro">
            Menos coisa na cabeça. Mais foco no que importa.
          </p>
          <Segments
            values={["Pendentes", "Concluídas", "Atrasadas"]}
            selected={taskFilter}
            onChange={setTaskFilter}
          />
          <Input
            className="search-input"
            aria-label="Buscar tarefa ou matéria"
            placeholder="Buscar tarefa ou matéria"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="sort-row">
            <span>
              {filteredTasks.length}{" "}
              {filteredTasks.length === 1 ? "tarefa" : "tarefas"}
            </span>
            <label>
              Ordenar por
              <select
                aria-label="Ordenar tarefas"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="due">Prazo mais próximo</option>
                <option value="priority">Prioridade</option>
              </select>
            </label>
          </div>
          <div className="card task-list">{filteredTasks.map(taskRow)}</div>
          {!filteredTasks.length && (
            <Empty
              title={
                search
                  ? "Nenhuma tarefa encontrada"
                  : taskFilter === "Atrasadas"
                    ? "Tudo em dia por aqui!"
                    : taskFilter === "Concluídas"
                      ? "Suas conquistas vêm aí"
                      : "Tudo feito!"
              }
              action={search ? undefined : "Criar tarefa"}
              onClick={newTask}
            >
              {search
                ? "Tente outro nome de tarefa ou matéria."
                : "Organize seu próximo passo e siga no seu ritmo."}
            </Empty>
          )}
        </>
      );
      break;
    case "task-detail":
      content = selectedTask ? (
        <>
          <div className="detail-heading">
            <span
              className={`subject-dot color-${subject(selectedTask.subjectId)?.color}`}
            />
            <div>
              <h2>{selectedTask.title}</h2>
              <p>{subject(selectedTask.subjectId)?.name}</p>
            </div>
            <Badge priority={selectedTask.priority} />
          </div>
          <div className="detail-meta">
            <Icon icon={CalendarIcon} size={18} />
            <span>
              Prazo:{" "}
              <strong>
                {shortDate(selectedTask.due)}/
                {parseDate(selectedTask.due).getFullYear()}
              </strong>
            </span>
            {selectedTask.done && <span className="badge low">Concluída</span>}
          </div>
          <SectionTitle>Descrição</SectionTitle>
          <p className="description">
            {selectedTask.description || "Nenhuma descrição adicionada."}
          </p>
          <SectionTitle>Checklist</SectionTitle>
          {selectedTask.checklist.length ? (
            <div className="checklist">
              {selectedTask.checklist.map((c, i) => (
                <button
                  key={i}
                  role="checkbox"
                  aria-checked={c.done}
                  onClick={() =>
                    setTasks((prev) =>
                      prev.map((t) =>
                        t.id === selectedTask.id
                          ? {
                              ...t,
                              checklist: t.checklist.map((item, j) =>
                                j === i ? { ...item, done: !item.done } : item,
                              ),
                            }
                          : t,
                      ),
                    )
                  }
                >
                  <span className={`check-box ${c.done ? "checked" : ""}`}>
                    {c.done && <Icon icon={CheckIcon} size={13} />}
                  </span>
                  <span className={c.done ? "struck" : ""}>{c.text}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="muted">Adicione etapas ao editar esta tarefa.</p>
          )}
          <div className="info-note">
            <Icon icon={InfoCircledIcon} size={17} />
            <p>Dividir uma tarefa em pequenas etapas ajuda a começar.</p>
          </div>
          <div className="form-actions">
            <button
              className="button primary"
              onClick={() => toggleTask(selectedTask)}
            >
              <Icon icon={CheckIcon} size={16} />
              {selectedTask.done ? "Reabrir tarefa" : "Marcar como concluída"}
            </button>
            <button
              className="button secondary"
              onClick={() => {
                setEditingTask(selectedTask);
                go("task-form");
              }}
            >
              Editar
            </button>
          </div>
        </>
      ) : (
        <Empty title="Tarefa não encontrada">
          Volte à lista de tarefas para continuar.
        </Empty>
      );
      break;
    case "event-detail":
      content = selectedEvent ? (
        <>
          <div className="detail-heading">
            <span
              className={`tile color-${subject(selectedEvent.subjectId)?.color ?? "gray"}`}
            >
              <Icon icon={CalendarIcon} size={25} />
            </span>
            <div>
              <h2>{selectedEvent.title}</h2>
              <p>
                {selectedEvent.type} ·{" "}
                {subject(selectedEvent.subjectId)?.name ?? "Pessoal"}
              </p>
            </div>
          </div>
          <div className="card detail-list">
            <p>
              <span>Data</span>
              <strong>{longDate(selectedEventDate)}</strong>
            </p>
            <p>
              <span>Horário</span>
              <strong>
                {selectedEvent.start}–{selectedEvent.end}
              </strong>
            </p>
            <p>
              <span>Local</span>
              <strong>{selectedEvent.location || "Não informado"}</strong>
            </p>
            <p>
              <span>Repetição</span>
              <strong>{selectedEvent.recurrence}</strong>
            </p>
          </div>
          <SectionTitle>Observações</SectionTitle>
          <p className="description">
            {selectedEvent.notes || "Nenhuma observação adicionada."}
          </p>
          <button
            className="button primary full"
            onClick={() => {
              setEditingEvent(selectedEvent);
              go("event-form");
            }}
          >
            <Icon icon={Pencil1Icon} size={16} />
            Editar compromisso
          </button>
        </>
      ) : null;
      break;
    case "studies":
      content = (
        <>
          <p className="page-intro">Encontre seu ritmo de aprender.</p>
          <div className="goal-card">
            <span className="tile red">
              <Icon icon={TargetIcon} size={25} />
            </span>
            <div>
              <span className="eyebrow">SUA META SEMANAL</span>
              <h2>
                {studyTime(minutes)} <small>de {profile.goal}h</small>
              </h2>
              <Progress value={progress} label="Progresso de estudos" />
              <p>
                {progress >= 100
                  ? "Meta alcançada. Celebre essa conquista!"
                  : `Faltam ${studyTime(profile.goal * 60 - minutes)}. Você está no caminho!`}
              </p>
            </div>
          </div>
          <button
            className="button primary full"
            onClick={() => {
              keyboard.hide();
              setLogOpen(true);
            }}
          >
            <Icon icon={PlusIcon} size={18} />
            Registrar tempo de estudo
          </button>
          <SectionTitle>Seu espaço de estudos</SectionTitle>
          <div className="menu-list">
            {quickLink(
              BackpackIcon,
              "Minhas matérias",
              `${subjects.length} matérias neste semestre`,
              "subjects",
            )}
            {quickLink(
              CalendarIcon,
              "Planejar estudos",
              "Um tempo para cada matéria",
              "planning",
              "blue",
            )}
            {quickLink(
              ReaderIcon,
              "Provas e trabalhos",
              "Prepare-se com antecedência",
              "exams",
              "orange",
            )}
            {quickLink(
              BarChartIcon,
              "Relatórios",
              "Acompanhe sua evolução",
              "reports",
              "green",
            )}
          </div>
          <div className="info-note">
            <Icon icon={InfoCircledIcon} size={19} />
            <p>
              Uma rotina possível é melhor que uma rotina perfeita. Reserve
              tempo para descansar também.
            </p>
          </div>
        </>
      );
      break;
    case "subjects":
      content = (
        <>
          <p className="page-intro">Seu semestre, organizado em um lugar.</p>
          <div className="subject-list">
            {subjects.map((s) => (
              <button
                className="subject-card"
                key={s.id}
                onClick={() => {
                  setEditingSubject(s);
                  go("subject-form");
                }}
              >
                <span className={`tile color-${s.color}`}>
                  <Icon icon={BackpackIcon} size={22} />
                </span>
                <span className="subject-info">
                  <strong>{s.name}</strong>
                  <small>
                    {s.teacher
                      ? `Prof. ${s.teacher}`
                      : "Professor(a) não informado(a)"}{" "}
                    · {s.room || "Sem sala"}
                  </small>
                  <span className="subject-hours">{s.hours}h / semana</span>
                </span>
                <Icon icon={Pencil1Icon} size={16} />
              </button>
            ))}
          </div>
        </>
      );
      break;
    case "planning":
      content = (
        <>
          <div className="card distribution">
            <SectionTitle>Sugestão para sua semana</SectionTitle>
            <div className="distribution-total">
              <strong>{profile.goal}h</strong>
              <span>de estudo, no seu ritmo</span>
            </div>
            {subjects.map((s) => {
              const total = subjects.reduce((sum, item) => sum + item.hours, 0);
              return (
                <div className={`distribution-row color-${s.color}`} key={s.id}>
                  <span className="subject-dot" />
                  <span>{s.name}</span>
                  <strong>
                    {studyTime(
                      Math.round((profile.goal * 60 * s.hours) / total),
                    )}
                  </strong>
                </div>
              );
            })}
            <p className="muted">
              Sugestão proporcional à carga horária. Ajuste os horários à sua
              rotina.
            </p>
          </div>
          <SectionTitle>Agendar sessão de estudo</SectionTitle>
          <EventForm
            subjects={subjects}
            study
            onSave={saveEvent}
            cancel={() => go("studies")}
          />
        </>
      );
      break;
    case "exams": {
      const examTasks = tasks
        .filter(
          (t) =>
            t.kind !== "Tarefa" &&
            !t.done &&
            (examFilter === "Todos" ||
              (examFilter === "Provas"
                ? t.kind === "Prova"
                : t.kind === "Trabalho")),
        )
        .sort((a, b) => a.due.localeCompare(b.due));
      content = (
        <>
          <Segments
            values={["Todos", "Provas", "Trabalhos"]}
            selected={examFilter}
            onChange={setExamFilter}
          />
          {nextExam && (
            <button className="next-exam" onClick={() => openTask(nextExam)}>
              <span>
                <span className="eyebrow">PRÓXIMA PROVA</span>
                <strong>{subject(nextExam.subjectId)?.name}</strong>
                <small>
                  {shortDate(nextExam.due)} ·{" "}
                  {parseDate(nextExam.due).getFullYear()}
                </small>
              </span>
              <span className="exam-count">
                {Math.round(
                  (parseDate(nextExam.due).getTime() -
                    parseDate(today).getTime()) /
                    86400000,
                )}
                <small>dias</small>
              </span>
            </button>
          )}
          <div className="card">
            {examTasks.map((t) => (
              <button
                className="exam-row"
                key={t.id}
                onClick={() => openTask(t)}
              >
                <span className={`tile color-${subject(t.subjectId)?.color}`}>
                  <Icon icon={ReaderIcon} size={21} />
                </span>
                <span>
                  <strong>{t.title}</strong>
                  <small>
                    {shortDate(t.due)} · {subject(t.subjectId)?.name}
                  </small>
                </span>
                <Icon icon={ChevronRightIcon} size={17} />
              </button>
            ))}
          </div>
          {!examTasks.length && (
            <Empty title="Sem entregas nesta categoria">
              As próximas provas e trabalhos aparecerão aqui.
            </Empty>
          )}
        </>
      );
      break;
    }
    case "reports": {
      const maxMinutes = Math.max(
        60,
        ...currentWeek.map((d) =>
          weekLogs
            .filter((l) => l.date === d)
            .reduce((sum, l) => sum + l.minutes, 0),
        ),
      );
      content = (
        <>
          <p className="page-intro">Cada pequeno esforço conta.</p>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Horas nesta semana</span>
              <strong>{studyTime(minutes)}</strong>
              <span className="text-link">Meta: {profile.goal}h</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Tarefas concluídas</span>
              <strong>
                {completed}
                <small>de {tasks.length} tarefas</small>
              </strong>
              <Progress
                value={tasks.length ? (completed / tasks.length) * 100 : 0}
                label="Tarefas concluídas"
              />
            </div>
          </div>
          <section className="card report-card">
            <SectionTitle>Seu estudo nesta semana</SectionTitle>
            <div
              className="bar-chart"
              role="img"
              aria-label={`${studyTime(minutes)} de estudo registrados nesta semana.`}
            >
              {currentWeek.map((d) => {
                const value = weekLogs
                  .filter((l) => l.date === d)
                  .reduce((sum, l) => sum + l.minutes, 0);
                return (
                  <div className="bar-column" key={d}>
                    <span>{value ? studyTime(value) : "—"}</span>
                    <div className="bar-track">
                      <div
                        className={d === today ? "bar current" : "bar"}
                        style={{
                          height: `${Math.max(2, (value / maxMinutes) * 100)}%`,
                        }}
                      />
                    </div>
                    <small>
                      {parseDate(d)
                        .toLocaleDateString("pt-BR", { weekday: "short" })
                        .replace(".", "")}
                    </small>
                  </div>
                );
              })}
            </div>
          </section>
          <section className="card report-card">
            <SectionTitle>Tempo por matéria</SectionTitle>
            {subjects.map((s) => {
              const value = weekLogs
                .filter((l) => l.subjectId === s.id)
                .reduce((sum, l) => sum + l.minutes, 0);
              return (
                <div className={`subject-progress color-${s.color}`} key={s.id}>
                  <div>
                    <span>{s.name}</span>
                    <strong>{studyTime(value)}</strong>
                  </div>
                  <Progress
                    value={minutes ? (value / minutes) * 100 : 0}
                    label={`Tempo de ${s.name}`}
                  />
                </div>
              );
            })}
          </section>
          <p className="footnote">
            Os gráficos usam seus registros de estudo e tarefas. A primeira
            visita inclui dados de exemplo.
          </p>
        </>
      );
      break;
    }
    case "notifications":
      content = (
        <>
          <div className="section-title">
            <p className="page-intro">Seus próximos passos, à vista.</p>
            <button
              className="text-button"
              onClick={() => {
                setSettings({ ...settings, read: true });
                notify("Notificações marcadas como lidas.");
              }}
            >
              Marcar lidas
            </button>
          </div>
          {settings.read && (
            <div className="read-message">
              <Icon icon={CheckCircledIcon} size={17} />
              Você está em dia com os avisos.
            </div>
          )}
          <div className="card notifications">
            {settings.tasks &&
              pending
                .filter((t) => t.due <= addDays(today, 2))
                .map((t) => (
                  <button
                    className="notification"
                    onClick={() => openTask(t)}
                    key={t.id}
                  >
                    <span className="tile red">
                      <Icon icon={CheckboxIcon} size={21} />
                    </span>
                    <span>
                      <strong>
                        {isOverdue(t) ? "Prazo passou" : "Entrega chegando"}
                      </strong>
                      <span>{t.title}</span>
                      <small>Prazo: {shortDate(t.due)}</small>
                    </span>
                    {!settings.read && <span className="unread-dot" />}
                  </button>
                ))}
            {settings.lessons &&
              todayClasses.slice(0, 1).map((e) => (
                <button
                  className="notification"
                  key={e.id}
                  onClick={() => openEvent(e, today)}
                >
                  <span className="tile blue">
                    <Icon icon={CalendarIcon} size={21} />
                  </span>
                  <span>
                    <strong>Aula de hoje</strong>
                    <span>{e.title}</span>
                    <small>
                      {e.start} · {e.location}
                    </small>
                  </span>
                </button>
              ))}
            {!settings.tasks && !settings.lessons && (
              <Empty title="Lembretes pausados">
                Ative uma categoria abaixo para ver seus avisos.
              </Empty>
            )}
          </div>
          <SectionTitle>Preferências de lembretes</SectionTitle>
          <div className="card settings-list">
            {(["lessons", "tasks"] as const).map((key) => (
              <div className="setting-row" key={key}>
                <span>
                  <strong>
                    {key === "lessons"
                      ? "Aulas e compromissos"
                      : "Tarefas e provas"}
                  </strong>
                  <small>Avisos dentro do aplicativo</small>
                </span>
                <button
                  role="switch"
                  aria-checked={settings[key]}
                  aria-label={
                    key === "lessons"
                      ? "Lembretes de aulas"
                      : "Lembretes de tarefas"
                  }
                  className={`toggle ${settings[key] ? "on" : ""}`}
                  onClick={() =>
                    setSettings({ ...settings, [key]: !settings[key] })
                  }
                >
                  <span />
                </button>
              </div>
            ))}
          </div>
          <p className="footnote">
            Esta versão exibe lembretes no aplicativo. Notificações do sistema
            serão integradas em uma próxima etapa.
          </p>
        </>
      );
      break;
    case "profile":
      content = (
        <>
          <div className="profile-summary">
            <span className="profile-avatar">
              <Icon icon={PersonIcon} size={34} />
            </span>
            <div>
              <h2>{profile.name}</h2>
              <p>{profile.email}</p>
              <small>{profile.course}</small>
            </div>
          </div>
          <button
            className="button primary full"
            onClick={() => go("profile-form")}
          >
            Editar perfil
          </button>
          <div className="goal-note">
            <Icon icon={TargetIcon} size={28} />
            <div>
              <strong>Minhas metas</strong>
              <p>
                Concluir o semestre com equilíbrio e construir uma rotina que
                funciona para mim.
              </p>
            </div>
          </div>
          <SectionTitle>Preferências</SectionTitle>
          <div className="card profile-settings">
            {quickLink(
              BellIcon,
              "Notificações",
              "Aulas, tarefas e provas",
              "notifications",
            )}
            {quickLink(
              GearIcon,
              "Minha rotina",
              `${profile.institution} · ${profile.days.length} dias de aula`,
              "setup",
              "gray",
            )}
            {quickLink(
              TargetIcon,
              "Meta de estudos",
              `${profile.goal} horas por semana`,
              "profile-form",
              "gray",
            )}
            {quickLink(
              InfoCircledIcon,
              "Conhecer o StudyFlow",
              "Boas-vindas e primeiros passos",
              "welcome",
              "gray",
            )}
          </div>
          <div className="demo-note">
            <Icon icon={InfoCircledIcon} size={18} />
            <p>
              <strong>Uma prévia do seu próximo semestre.</strong> Você está no
              modo demonstração. Seus dados ficam neste navegador.
            </p>
          </div>
          <button
            className="text-button sign-out"
            onClick={() => go("welcome")}
          >
            <Icon icon={ExitIcon} size={17} />
            Voltar às boas-vindas
          </button>
          <div className="app-version">
            StudyFlow · versão 0.1.0
            <br />
            Um pouco de organização. Mais espaço para você.
          </div>
        </>
      );
      break;
    case "event-form":
      content = (
        <EventForm
          key={editingEvent?.id ?? "new"}
          subjects={subjects}
          initial={editingEvent}
          onSave={saveEvent}
          cancel={back}
        />
      );
      break;
    case "task-form":
      content = (
        <TaskForm
          key={editingTask?.id ?? "new"}
          subjects={subjects}
          initial={editingTask}
          onSave={saveTask}
          cancel={back}
        />
      );
      break;
    case "subject-form":
      content = (
        <SubjectForm
          key={editingSubject?.id ?? "new"}
          initial={editingSubject}
          cancel={back}
          onSave={(s) => {
            setSubjects((prev) => [
              ...prev.filter((item) => item.id !== s.id),
              s,
            ]);
            go("subjects");
            notify("Matéria salva no seu semestre.");
          }}
        />
      );
      break;
    case "profile-form":
      content = (
        <ProfileForm
          profile={profile}
          cancel={back}
          onSave={(p) => {
            setProfile(p);
            go("profile");
            notify("Perfil atualizado.");
          }}
        />
      );
      break;
    case "welcome":
      content = (
        <Welcome
          onStart={() => go("register")}
          onLogin={() => go("login")}
          onDemo={() => go("home")}
        />
      );
      break;
    case "register":
    case "login":
      content = (
        <Auth
          login={page === "login"}
          profile={profile}
          onBack={() => go("welcome")}
          onSwitch={() => go(page === "login" ? "register" : "login")}
          onSubmit={(p) => {
            setProfile(p);
            go(page === "register" ? "setup" : "home");
          }}
        />
      );
      break;
    case "setup":
      content = (
        <Setup
          profile={profile}
          onSave={(p) => {
            setProfile(p);
            go("home");
            notify("Tudo pronto. Seu semestre começa aqui!");
          }}
        />
      );
      break;
    default:
      content = null;
  }
  let header: ReactNode = null;
  if (page === "home")
    header = (
      <header className="home-header">
        <span className="avatar">
          <Icon icon={PersonIcon} size={24} />
        </span>
        <div>
          <h1>Olá, {profile.name.split(" ")[0]}!</h1>
          <p>Que bom ter você por aqui.</p>
        </div>
        <button
          className="notification-button icon-button"
          aria-label="Abrir notificações"
          onClick={() => go("notifications")}
        >
          <Icon icon={BellIcon} size={23} />
          {!settings.read && <span />}
        </button>
      </header>
    );
  else if (!["welcome", "register", "login"].includes(page))
    header = (
      <PageTitle
        title={
          (page === "event-form" && editingEvent
            ? "Editar compromisso"
            : page === "task-form" && editingTask
              ? "Editar tarefa"
              : page === "subject-form" && editingSubject
                ? "Editar matéria"
                : titles[page]) ?? ""
        }
        back={root ? undefined : page === "setup" ? () => go("profile") : back}
        action={
          page === "tasks" || page === "exams" ? (
            <IconButton
              icon={PlusIcon}
              label="Nova tarefa"
              className="filled"
              onClick={newTask}
            />
          ) : page === "subjects" ? (
            <IconButton
              icon={PlusIcon}
              label="Nova matéria"
              className="filled"
              onClick={() => {
                setEditingSubject(undefined);
                go("subject-form");
              }}
            />
          ) : page === "profile" ? (
            <IconButton
              icon={GearIcon}
              label="Editar preferências do perfil"
              onClick={() => go("profile-form")}
            />
          ) : undefined
        }
      />
    );
  return (
    <div className={`studyflow ${onboarding ? "onboarding" : ""}`}>
      <div className="app-header">{header}</div>
      <MobileScroll
        key={page}
        className={`sf-scroll ${header ? "has-header" : ""}`}
      >
        <main className="sf-content">{content}</main>
      </MobileScroll>
      {!onboarding && !isKeyboardVisible && (
        <nav className="bottom-nav" aria-label="Navegação principal">
          {navigation.map((n) => (
            <button
              key={n.id}
              aria-current={active === n.id ? "page" : undefined}
              className={active === n.id ? "active" : ""}
              onClick={() => go(n.id)}
            >
              <span>
                <Icon icon={n.icon} size={21} />
              </span>
              {n.label}
            </button>
          ))}
        </nav>
      )}
      {(subjectFail || taskFail || eventFail || profileFail || logFail) && (
        <div className="storage-error" role="alert">
          Não foi possível salvar neste navegador.
        </div>
      )}
      {toast && (
        <div className="toast" role="status">
          <Icon icon={CheckCircledIcon} size={19} />
          {toast}
          <button aria-label="Fechar mensagem" onClick={() => setToast("")}>
            <Icon icon={Cross2Icon} size={15} />
          </button>
        </div>
      )}
      <BottomSheet
        open={addOpen}
        onOpenChange={setAddOpen}
        title="O que vamos organizar?"
        description="Escolha o próximo passo para o seu dia."
        snap={0.46}
      >
        <div className="sheet-choices">
          <button onClick={newEvent}>
            <span className="tile red">
              <Icon icon={CalendarIcon} size={25} />
            </span>
            <span>
              <strong>Aula ou compromisso</strong>
              <small>Reserve um horário na sua agenda</small>
            </span>
            <Icon icon={ChevronRightIcon} size={18} />
          </button>
          <button onClick={newTask}>
            <span className="tile blue">
              <Icon icon={CheckboxIcon} size={25} />
            </span>
            <span>
              <strong>Tarefa ou entrega</strong>
              <small>Defina um prazo e acompanhe as etapas</small>
            </span>
            <Icon icon={ChevronRightIcon} size={18} />
          </button>
        </div>
      </BottomSheet>
      <BottomSheet
        open={logOpen}
        onOpenChange={setLogOpen}
        title="Registrar estudo"
        description="Cada minuto de dedicação conta."
        snap={0.66}
      >
        <form
          className="form sheet-form"
          onSubmit={(e) => {
            e.preventDefault();
            const d = new FormData(e.currentTarget);
            setLogs((prev) => [
              ...prev,
              {
                id: uid(),
                subjectId: String(d.get("subjectId")),
                minutes: Number(d.get("minutes")),
                date: String(d.get("date")),
              },
            ]);
            keyboard.hide();
            setLogOpen(false);
            notify("Tempo registrado. Bom trabalho!");
          }}
        >
          <Field label="Matéria">
            <SubjectSelect subjects={subjects} />
          </Field>
          <div className="form-grid">
            <Field label="Data">
              <Input
                type="date"
                name="date"
                required
                max={today}
                defaultValue={today}
              />
            </Field>
            <Field label="Tempo (minutos)">
              <Input
                type="number"
                name="minutes"
                required
                min="1"
                max="720"
                defaultValue="60"
              />
            </Field>
          </div>
          <button
            className="button primary full"
            type="submit"
            onPointerDown={(e) => e.preventDefault()}
          >
            Salvar registro
          </button>
        </form>
      </BottomSheet>
    </div>
  );
}

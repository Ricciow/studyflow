import { useState, type FormEvent } from "react";
import { Field, Input, Textarea } from "./components";
import {
  today,
  uid,
  type Event,
  type Task,
  type Subject,
  type Profile,
} from "./model";

function data(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  return Object.fromEntries(new FormData(e.currentTarget)) as Record<
    string,
    string
  >;
}
function Actions({
  cancel,
  label = "Salvar",
}: {
  cancel: () => void;
  label?: string;
}) {
  return (
    <div className="form-actions">
      <button type="button" className="button secondary" onClick={cancel}>
        Cancelar
      </button>
      <button
        className="button primary"
        type="submit"
        onPointerDown={(e) => e.preventDefault()}
      >
        {label}
      </button>
    </div>
  );
}
export function SubjectSelect({
  subjects,
  defaultValue,
  optional = false,
}: {
  subjects: Subject[];
  defaultValue?: string;
  optional?: boolean;
}) {
  return (
    <select name="subjectId" defaultValue={defaultValue} required={!optional}>
      {optional && <option value="">Sem matéria</option>}
      {subjects.map((s) => (
        <option key={s.id} value={s.id}>
          {s.name}
        </option>
      ))}
    </select>
  );
}
export function EventForm({
  subjects,
  initial,
  onSave,
  cancel,
  study = false,
}: {
  subjects: Subject[];
  initial?: Event;
  onSave: (event: Event) => void;
  cancel: () => void;
  study?: boolean;
}) {
  const [error, setError] = useState("");
  return (
    <form
      className="form"
      onSubmit={(e) => {
        const d = data(e);
        if (d.end <= d.start) {
          setError("O horário de término deve ser posterior ao início.");
          return;
        }
        onSave({
          id: initial?.id ?? uid(),
          title: d.title.trim(),
          subjectId: d.subjectId,
          date: d.date,
          start: d.start,
          end: d.end,
          location: d.location.trim(),
          recurrence: d.recurrence,
          notes: d.notes.trim(),
          type: d.type as Event["type"],
        });
      }}
    >
      <Field label="Título">
        <Input
          name="title"
          required
          maxLength={100}
          placeholder={
            study ? "Ex.: Revisar limites" : "Ex.: Aula de Cálculo I"
          }
          defaultValue={initial?.title}
        />
      </Field>
      <div className="form-grid">
        <Field label="Tipo">
          <select
            name="type"
            defaultValue={initial?.type ?? (study ? "Estudo" : "Aula")}
          >
            <option>Aula</option>
            <option>Estudo</option>
            <option>Pessoal</option>
          </select>
        </Field>
        <Field label="Data">
          <Input
            name="date"
            type="date"
            required
            defaultValue={initial?.date ?? today}
          />
        </Field>
      </div>
      <Field label="Matéria">
        <SubjectSelect
          subjects={subjects}
          defaultValue={initial?.subjectId}
          optional
        />
      </Field>
      <div className="form-grid">
        <Field label="Início">
          <Input
            name="start"
            type="time"
            required
            defaultValue={initial?.start ?? "08:00"}
          />
        </Field>
        <Field label="Término">
          <Input
            name="end"
            type="time"
            required
            defaultValue={initial?.end ?? "09:50"}
          />
        </Field>
      </div>
      <Field label="Local (opcional)">
        <Input
          name="location"
          placeholder="Sala, biblioteca ou link"
          defaultValue={initial?.location}
          maxLength={100}
        />
      </Field>
      <Field label="Repetição">
        <select
          name="recurrence"
          defaultValue={initial?.recurrence ?? "Não repetir"}
        >
          <option>Não repetir</option>
          <option>Semanal</option>
        </select>
      </Field>
      <Field label="Observações (opcional)">
        <Textarea
          name="notes"
          rows={3}
          placeholder="O que você precisa lembrar?"
          defaultValue={initial?.notes}
          maxLength={1000}
        />
      </Field>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <Actions cancel={cancel} />
    </form>
  );
}
export function TaskForm({
  subjects,
  initial,
  onSave,
  cancel,
}: {
  subjects: Subject[];
  initial?: Task;
  onSave: (task: Task) => void;
  cancel: () => void;
}) {
  return (
    <form
      className="form"
      onSubmit={(e) => {
        const d = data(e);
        onSave({
          id: initial?.id ?? uid(),
          title: d.title.trim(),
          subjectId: d.subjectId,
          due: d.due,
          priority: d.priority as Task["priority"],
          kind: d.kind as Task["kind"],
          done: initial?.done ?? false,
          description: d.description.trim(),
          checklist: d.checklist
            .split("\n")
            .map((t) => t.trim())
            .filter(Boolean)
            .map((text) => ({
              text,
              done:
                initial?.checklist.find((c) => c.text === text)?.done ?? false,
            })),
        });
      }}
    >
      <Field label="Título">
        <Input
          name="title"
          required
          maxLength={100}
          defaultValue={initial?.title}
          placeholder="Ex.: Relatório de Física"
        />
      </Field>
      <Field label="Matéria">
        <SubjectSelect subjects={subjects} defaultValue={initial?.subjectId} />
      </Field>
      <div className="form-grid">
        <Field label="Prazo">
          <Input
            name="due"
            type="date"
            required
            defaultValue={initial?.due ?? today}
          />
        </Field>
        <Field label="Prioridade">
          <select name="priority" defaultValue={initial?.priority ?? "Média"}>
            <option>Alta</option>
            <option>Média</option>
            <option>Baixa</option>
          </select>
        </Field>
      </div>
      <Field label="Categoria">
        <select name="kind" defaultValue={initial?.kind ?? "Tarefa"}>
          <option>Tarefa</option>
          <option>Prova</option>
          <option>Trabalho</option>
          <option>Apresentação</option>
        </select>
      </Field>
      <Field label="Descrição (opcional)">
        <Textarea
          name="description"
          rows={3}
          defaultValue={initial?.description}
          maxLength={2000}
        />
      </Field>
      <Field label="Checklist (opcional)" hint="Uma etapa por linha.">
        <Textarea
          name="checklist"
          rows={3}
          defaultValue={initial?.checklist.map((c) => c.text).join("\n")}
          maxLength={2000}
        />
      </Field>
      <Actions cancel={cancel} />
    </form>
  );
}
export function SubjectForm({
  initial,
  onSave,
  cancel,
}: {
  initial?: Subject;
  onSave: (subject: Subject) => void;
  cancel: () => void;
}) {
  return (
    <form
      className="form"
      onSubmit={(e) => {
        const d = data(e);
        onSave({
          id: initial?.id ?? uid(),
          name: d.name.trim(),
          teacher: d.teacher.trim(),
          room: d.room.trim(),
          color: d.color,
          hours: Number(d.hours),
        });
      }}
    >
      <Field label="Nome da matéria">
        <Input
          name="name"
          required
          maxLength={100}
          defaultValue={initial?.name}
          placeholder="Ex.: Cálculo I"
        />
      </Field>
      <Field label="Professor(a)">
        <Input name="teacher" maxLength={100} defaultValue={initial?.teacher} />
      </Field>
      <Field label="Sala">
        <Input name="room" maxLength={100} defaultValue={initial?.room} />
      </Field>
      <div className="form-grid">
        <Field label="Horas por semana">
          <Input
            type="number"
            name="hours"
            min="1"
            max="40"
            required
            defaultValue={initial?.hours ?? 4}
          />
        </Field>
        <Field label="Cor">
          <select name="color" defaultValue={initial?.color ?? "red"}>
            <option value="red">Vermelho</option>
            <option value="orange">Laranja</option>
            <option value="blue">Azul</option>
            <option value="green">Verde</option>
            <option value="purple">Roxo</option>
            <option value="teal">Turquesa</option>
          </select>
        </Field>
      </div>
      <Actions cancel={cancel} />
    </form>
  );
}
export function ProfileForm({
  profile,
  onSave,
  cancel,
}: {
  profile: Profile;
  onSave: (profile: Profile) => void;
  cancel: () => void;
}) {
  return (
    <form
      className="form"
      onSubmit={(e) => {
        const d = data(e);
        onSave({
          ...profile,
          name: d.name.trim(),
          email: d.email.trim(),
          course: d.course.trim(),
          goal: Number(d.goal),
        });
      }}
    >
      <Field label="Nome completo">
        <Input
          name="name"
          required
          maxLength={100}
          defaultValue={profile.name}
        />
      </Field>
      <Field label="E-mail">
        <Input
          name="email"
          type="email"
          required
          defaultValue={profile.email}
        />
      </Field>
      <Field label="Curso">
        <Input
          name="course"
          required
          maxLength={100}
          defaultValue={profile.course}
        />
      </Field>
      <Field label="Meta semanal de estudos (horas)">
        <Input
          name="goal"
          type="number"
          min="1"
          max="80"
          required
          defaultValue={profile.goal}
        />
      </Field>
      <Actions cancel={cancel} />
    </form>
  );
}

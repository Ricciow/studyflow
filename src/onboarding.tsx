import { useState } from "react";
import {
  BackpackIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { Field, Icon, IconButton, Input, Segments } from "./components";
import type { Profile } from "./model";
function Wordmark() {
  return (
    <div className="wordmark">
      <Icon icon={BackpackIcon} size={35} />
      <span>
        Study<span>Flow</span>
      </span>
    </div>
  );
}
export function Welcome({
  onStart,
  onLogin,
  onDemo,
}: {
  onStart: () => void;
  onLogin: () => void;
  onDemo: () => void;
}) {
  return (
    <div className="welcome">
      <Wordmark />
      <span className="welcome-eyebrow">MAIS FOCO. MAIS EQUILÍBRIO.</span>
      <h1>
        Organize sua rotina,
        <br />
        conquiste seus objetivos.
      </h1>
      <p>
        Seu aliado na organização de aulas,
        <br />
        tarefas, provas e muito mais.
      </p>
      <img
        className="welcome-illustration"
        src="/assets/study-illustration.png"
        alt="Estudante de moletom vermelho usando um notebook entre livros, com uma universidade ao fundo"
      />
      <button className="button primary full" onClick={onStart}>
        Começar
        <Icon icon={ChevronRightIcon} size={17} />
      </button>
      <button className="button secondary full" onClick={onLogin}>
        Já tenho uma conta
      </button>
      <button className="text-button demo-entry" onClick={onDemo}>
        Explorar demonstração
      </button>
    </div>
  );
}
export function Auth({
  login,
  profile,
  onBack,
  onSwitch,
  onSubmit,
}: {
  login: boolean;
  profile: Profile;
  onBack: () => void;
  onSwitch: () => void;
  onSubmit: (profile: Profile) => void;
}) {
  return (
    <div className="auth-screen">
      <IconButton
        icon={ChevronLeftIcon}
        label="Voltar às boas-vindas"
        onClick={onBack}
      />
      <Wordmark />
      <h1>
        {login
          ? "Que bom ter você de volta."
          : "Seu próximo passo começa aqui."}
      </h1>
      <p className="page-intro">
        {login
          ? "Retome seus planos, no seu ritmo."
          : "Vamos organizar seu semestre juntos."}
      </p>
      <div className="info-note">
        <Icon icon={InfoCircledIcon} size={17} />
        <p>
          Cadastro demonstrativo. Use um nome e e-mail fictícios. A autenticação
          ainda não está conectada.
        </p>
      </div>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          const d = new FormData(e.currentTarget);
          onSubmit({
            ...profile,
            name: String(d.get("name") ?? profile.name).trim(),
            email: String(d.get("email")).trim(),
          });
        }}
      >
        {!login && (
          <Field label="Nome completo">
            <Input
              name="name"
              required
              pattern=".*\S.*"
              placeholder="Como podemos chamar você?"
              maxLength={100}
            />
          </Field>
        )}
        <Field label="E-mail">
          <Input
            name="email"
            type="email"
            required
            placeholder="voce@exemplo.com"
          />
        </Field>
        <button
          type="submit"
          className="button primary full"
          onPointerDown={(e) => e.preventDefault()}
        >
          {login ? "Entrar na demonstração" : "Continuar"}
        </button>
      </form>
      <p className="auth-switch">
        {login ? "Ainda não começou?" : "Já tem uma conta?"}{" "}
        <button className="text-button" onClick={onSwitch}>
          {login ? "Criar perfil" : "Entrar"}
        </button>
      </p>
    </div>
  );
}
export function Setup({
  profile,
  onSave,
}: {
  profile: Profile;
  onSave: (profile: Profile) => void;
}) {
  const [days, setDays] = useState(profile.days);
  const [institution, setInstitution] = useState(profile.institution);
  return (
    <>
      <span className="eyebrow">UMA ROTINA QUE COMBINA COM VOCÊ</span>
      <h2 className="setup-title">
        Vamos personalizar
        <br />
        sua experiência?
      </h2>
      <p className="page-intro">
        Conte um pouco sobre você para organizarmos os próximos passos.
      </p>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          const d = new FormData(e.currentTarget);
          onSave({
            ...profile,
            course: String(d.get("course")).trim(),
            institution,
            days,
          });
        }}
      >
        <Field label="Tipo de instituição" group>
          <Segments
            values={["Faculdade", "Colégio", "Técnico"]}
            selected={institution}
            onChange={setInstitution}
          />
        </Field>
        <Field label="Curso">
          <Input
            name="course"
            required
            defaultValue={profile.course}
            maxLength={100}
          />
        </Field>
        <Field label="Dias de aula" group>
          <div className="day-picker">
            {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => (
              <button
                type="button"
                key={d}
                aria-pressed={days.includes(d)}
                className={days.includes(d) ? "selected" : ""}
                onClick={() =>
                  setDays((prev) =>
                    prev.includes(d)
                      ? prev.filter((day) => day !== d)
                      : [...prev, d],
                  )
                }
              >
                {d}
              </button>
            ))}
          </div>
        </Field>
        <div className="info-note">
          <Icon icon={ClockIcon} size={21} />
          <p>
            Você pode agendar suas aulas e reservar horários de estudo na
            Agenda.
          </p>
        </div>
        <button
          className="button primary full"
          type="submit"
          onPointerDown={(e) => e.preventDefault()}
        >
          Concluir configuração
          <Icon icon={CheckIcon} size={18} />
        </button>
      </form>
    </>
  );
}

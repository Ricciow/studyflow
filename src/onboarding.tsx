import { useState } from "react";
import {
  BackpackIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  InfoCircledIcon,
  EyeOpenIcon,
  EyeClosedIcon,
  EnvelopeClosedIcon,
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
  mode,
  profile,
  onBack,
  onSwitch,
  onRecover,
  onSubmit,
}: {
  mode: "login" | "register" | "recover";
  profile: Profile;
  onBack: () => void;
  onSwitch: () => void;
  onRecover: () => void;
  onSubmit: (profile: Profile) => void;
}) {
  const login = mode === "login";
  const recover = mode === "recover";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  if (sent)
    return (
      <div className="auth-screen auth-success">
        <Wordmark />
        <span className="auth-success-icon">
          <Icon icon={EnvelopeClosedIcon} size={32} />
        </span>
        <h1>Confira seu e-mail</h1>
        <p className="page-intro">
          O próximo passo seria receber um link em <strong>{email}</strong> para
          criar uma nova senha.
        </p>
        <div className="info-note">
          <Icon icon={InfoCircledIcon} size={17} />
          <p>
            Esta é uma simulação. Nenhum e-mail foi enviado e nenhuma senha foi
            alterada.
          </p>
        </div>
        <button className="button primary full" onClick={onSwitch}>
          Voltar para o login
        </button>
        <button
          className="text-button auth-resend"
          onClick={() => setSent(false)}
        >
          Usar outro e-mail
        </button>
      </div>
    );

  return (
    <div className="auth-screen">
      <IconButton
        icon={ChevronLeftIcon}
        label={recover ? "Voltar para o login" : "Voltar às boas-vindas"}
        onClick={onBack}
      />
      <Wordmark />
      <h1>
        {recover
          ? "Esqueceu sua senha?"
          : login
            ? "Que bom ter você de volta."
            : "Crie sua conta"}
      </h1>
      <p className="page-intro">
        {recover
          ? "Acontece! Vamos ajudar você a retomar seus planos."
          : login
            ? "Retome seus planos, no seu ritmo."
            : "Vamos organizar seu semestre juntos."}
      </p>
      <div className="info-note">
        <Icon icon={InfoCircledIcon} size={17} />
        <p>
          {recover
            ? "Experimente a recuperação de acesso com um e-mail fictício."
            : "Modo demonstração. Use dados fictícios: qualquer e-mail válido e senha com 6 caracteres permitem continuar. A senha não é salva nem enviada."}
        </p>
      </div>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          const d = new FormData(e.currentTarget);
          if (recover) {
            setSent(true);
            return;
          }
          if (!login && password !== confirmation) {
            setError("As senhas não coincidem. Confira e tente novamente.");
            return;
          }
          setError("");
          onSubmit({
            ...profile,
            name: String(d.get("name") ?? profile.name).trim(),
            email: email.trim(),
          });
        }}
      >
        {!login && !recover && (
          <Field label="Nome completo">
            <Input
              name="name"
              required
              pattern=".*\S.*"
              placeholder="Como podemos chamar você?"
              maxLength={100}
              autoComplete="off"
            />
          </Field>
        )}
        <Field label="E-mail">
          <Input
            name="email"
            type="email"
            required
            placeholder="voce@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
          />
        </Field>
        {!recover && (
          <>
            <div className="field">
              <label htmlFor="mock-password">Senha</label>
              <div className="password-control">
                <Input
                  id="mock-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  maxLength={100}
                  autoComplete="off"
                  placeholder="Pelo menos 6 caracteres"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={showPassword}
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Icon
                    icon={showPassword ? EyeClosedIcon : EyeOpenIcon}
                    size={20}
                  />
                </button>
              </div>
            </div>
            {!login && (
              <Field label="Confirmar senha">
                <Input
                  name="confirmation"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  maxLength={100}
                  autoComplete="off"
                  placeholder="Repita sua senha fictícia"
                  value={confirmation}
                  aria-invalid={!!error}
                  aria-describedby={error ? "auth-error" : undefined}
                  onChange={(e) => {
                    setConfirmation(e.target.value);
                    setError("");
                  }}
                />
              </Field>
            )}
            {login && (
              <button
                type="button"
                className="text-button forgot-password"
                onClick={onRecover}
              >
                Esqueci minha senha
              </button>
            )}
          </>
        )}
        {error && (
          <p className="auth-error" id="auth-error" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="button primary full"
          onPointerDown={(e) => e.preventDefault()}
        >
          {recover ? "Simular recuperação" : login ? "Entrar" : "Criar conta"}
        </button>
      </form>
      <p className="auth-switch">
        {recover
          ? "Lembrou sua senha?"
          : login
            ? "Ainda não tem uma conta?"
            : "Já tem uma conta?"}{" "}
        <button className="text-button" onClick={onSwitch}>
          {login ? "Criar conta" : "Entrar"}
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

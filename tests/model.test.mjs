import test from "node:test";
import assert from "node:assert/strict";
import {
  addDays,
  weekDates,
  occursOn,
  isOverdue,
  dateKey,
  parseDate,
  studyTime,
  today,
  initialEvents,
} from "../src/model.ts";

test("datas atravessam meses, anos e ano bissexto sem mudar o dia local", () => {
  assert.equal(addDays("2026-12-31", 1), "2027-01-01");
  assert.equal(addDays("2028-02-28", 1), "2028-02-29");
  assert.equal(addDays("2026-03-01", -1), "2026-02-28");
  assert.equal(dateKey(parseDate(today)), today);
});
test("semana começa na segunda mesmo quando a data é um domingo", () => {
  assert.deepEqual(weekDates("2026-10-25"), [
    "2026-10-19",
    "2026-10-20",
    "2026-10-21",
    "2026-10-22",
    "2026-10-23",
    "2026-10-24",
    "2026-10-25",
  ]);
});
test("recorrência semanal não inventa eventos anteriores ao início", () => {
  const event = initialEvents[0];
  assert.equal(occursOn(event, event.date), true);
  assert.equal(occursOn(event, addDays(event.date, 7)), true);
  assert.equal(occursOn(event, addDays(event.date, -7)), false);
  assert.equal(occursOn(event, addDays(event.date, 1)), false);
  assert.equal(
    occursOn({ ...event, recurrence: "Não repetir" }, addDays(event.date, 7)),
    false,
  );
});
test("tarefa que vence hoje ou está concluída não conta como atrasada", () => {
  assert.equal(isOverdue({ done: false, due: addDays(today, -1) }), true);
  assert.equal(isOverdue({ done: true, due: addDays(today, -1) }), false);
  assert.equal(isOverdue({ done: false, due: today }), false);
});
test("tempo de estudo usa horas e minutos em vez de frações decimais", () => {
  assert.equal(studyTime(750), "12h30");
  assert.equal(studyTime(60), "1h");
  assert.equal(studyTime(1), "0h01");
  assert.equal(studyTime(0), "0h");
  assert.equal(studyTime(-5), "0h");
});

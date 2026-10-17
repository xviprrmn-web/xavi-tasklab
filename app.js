const KEY = 'xavi-tasklab-tasks-v1';
const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');
const counter = document.querySelector('#counter');
let tasks;
try {
  const saved = JSON.parse(localStorage.getItem(KEY) || '[]');
  tasks = Array.isArray(saved) ? saved : [];
} catch { tasks = []; }
function save() { localStorage.setItem(KEY, JSON.stringify(tasks)); }
function render() {
  list.replaceChildren();
  const pending = tasks.filter(t => !t.done).length;
  counter.textContent = `${pending} ${pending === 1 ? 'tasca pendent' : 'tasques pendents'}`;
  for (const task of tasks) {
    const li = document.createElement('li');
    if (task.done) li.classList.add('done');
    const check = document.createElement('input');
    check.type = 'checkbox'; check.checked = task.done;
    check.setAttribute('aria-label', `Completar ${task.text}`);
    check.addEventListener('change', () => { task.done = check.checked; save(); render(); });
    const span = document.createElement('span'); span.textContent = task.text;
    const remove = document.createElement('button'); remove.textContent = 'Eliminar';
    remove.setAttribute('aria-label', `Eliminar ${task.text}`);
    remove.addEventListener('click', () => { tasks = tasks.filter(t => t.id !== task.id); save(); render(); });
    li.append(check, span, remove); list.append(li);
  }
}
form.addEventListener('submit', event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tasks.push({id: crypto.randomUUID(), text, done:false});
  input.value = ''; save(); render(); input.focus();
});
render();

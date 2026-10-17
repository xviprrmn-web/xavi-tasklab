// Conservar aquesta clau permet llegir les tasques creades amb la V1.
const KEY = 'xavi-tasklab-tasks-v1';
const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const priorityInput = document.querySelector('#task-priority');
const list = document.querySelector('#task-list');
const counter = document.querySelector('#counter');
const emptyMessage = document.querySelector('#empty-message');
const filterButtons = document.querySelectorAll('[data-filter]');
const priorities = {high: 'Alta', medium: 'Mitjana', low: 'Baixa'};
let activeFilter = 'all';
let tasks;
try {
  const saved = JSON.parse(localStorage.getItem(KEY) || '[]');
  tasks = Array.isArray(saved) ? saved : [];
} catch { tasks = []; }

function save() { localStorage.setItem(KEY, JSON.stringify(tasks)); }
function priorityOf(task) {
  return Object.hasOwn(priorities, task.priority) ? task.priority : 'medium';
}
function render() {
  list.replaceChildren();
  const pending = tasks.filter(t => !t.done).length;
  counter.textContent = `${pending} ${pending === 1 ? 'tasca pendent' : 'tasques pendents'}`;
  const visible = tasks.filter(task =>
    activeFilter === 'all' ||
    (activeFilter === 'pending' && !task.done) ||
    (activeFilter === 'done' && task.done)
  );
  emptyMessage.hidden = visible.length !== 0;
  for (const task of visible) {
    const li = document.createElement('li');
    if (task.done) li.classList.add('done');
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = Boolean(task.done);
    check.setAttribute('aria-label', `Completar ${task.text}`);
    check.addEventListener('change', () => { task.done = check.checked; save(); render(); });
    const span = document.createElement('span');
    span.textContent = task.text;
    const priority = priorityOf(task);
    const badge = document.createElement('small');
    badge.className = `priority priority-${priority}`;
    badge.textContent = priorities[priority];
    badge.setAttribute('aria-label', `Prioritat ${priorities[priority].toLowerCase()}`);
    const remove = document.createElement('button');
    remove.textContent = 'Eliminar';
    remove.setAttribute('aria-label', `Eliminar ${task.text}`);
    remove.addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id);
      save(); render();
    });
    li.append(check, span, badge, remove);
    list.append(li);
  }
}
form.addEventListener('submit', event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tasks.push({id: crypto.randomUUID(), text, done: false, priority: priorityInput.value});
  input.value = '';
  priorityInput.value = 'medium';
  save(); render(); input.focus();
});
filterButtons.forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  filterButtons.forEach(item => {
    const selected = item === button;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  render();
}));
render();

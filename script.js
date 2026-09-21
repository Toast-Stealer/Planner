const modalBackdrop = document.querySelector('#modalBackdrop');
const nameInput = document.querySelector('#notepadName');
const toast = document.querySelector('#toast');
const grid = document.querySelector('#notepadGrid');
const workspaceBackdrop = document.querySelector('#workspaceBackdrop');
const workspaceTitle = document.querySelector('#workspaceTitle');
const workspaceEditor = document.querySelector('#workspaceEditor');
const chatDrawer = document.querySelector('#chatDrawer');

function openModal() { modalBackdrop.hidden = false; setTimeout(() => nameInput.focus(), 50); }
function closeModal() { modalBackdrop.hidden = true; }
function showToast(message) { toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2600); }

document.querySelector('#newNotepadButton').addEventListener('click', openModal);
document.querySelector('#newCardButton').addEventListener('click', openModal);
document.querySelector('#closeModal').addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', (event) => { if (event.target === modalBackdrop) closeModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });

function openWorkspace(card) {
  workspaceTitle.textContent = card.dataset.name || card.querySelector('h3').textContent;
  workspaceBackdrop.hidden = false;
  workspaceEditor.focus();
}
function closeWorkspace() { workspaceBackdrop.hidden = true; chatDrawer.classList.remove('open'); }
document.querySelector('#closeWorkspace').addEventListener('click', closeWorkspace);
workspaceBackdrop.addEventListener('click', (event) => { if (event.target === workspaceBackdrop) closeWorkspace(); });
workspaceEditor.addEventListener('input', () => { document.querySelector('#savedLabel').textContent = 'Saving...'; clearTimeout(window.saveTimer); window.saveTimer = setTimeout(() => document.querySelector('#savedLabel').textContent = 'Saved just now', 600); });
document.querySelector('#chatButton').addEventListener('click', () => chatDrawer.classList.toggle('open'));
document.querySelector('#closeChat').addEventListener('click', () => chatDrawer.classList.remove('open'));
document.querySelector('#workspaceInvite').addEventListener('click', () => showToast('Invite link copied — send it to your planning people ✦'));
document.querySelector('#chatForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.querySelector('#chatInput');
  const text = input.value.trim();
  if (!text) return;
  const message = document.createElement('div');
  message.className = 'message own';
  message.innerHTML = `<div><small>You · just now</small><p>${text.replace(/[<>]/g, '')}</p></div><span class="message-avatar">AK</span>`;
  document.querySelector('.messages').appendChild(message);
  input.value = '';
  document.querySelector('.messages').scrollTop = document.querySelector('.messages').scrollHeight;
});

document.querySelector('#createButton').addEventListener('click', () => {
  const name = nameInput.value.trim() || 'Untitled idea';
  const style = document.querySelector('#notepadStyle').value;
  const card = document.createElement('article');
  card.className = 'notepad-card card-yellow';
  card.style.background = '#f8d983';
  card.dataset.type = 'personal';
  card.innerHTML = `<div class="card-top"><span class="card-icon">✦</span><button class="more-button" aria-label="More options">•••</button></div><h3>${name.replace(/[<>]/g, '')}</h3><p>${style.toLowerCase()} · just getting started</p><div class="card-footer"><span class="updated">Edited just now</span><div class="avatars"><i>AK</i></div></div>`;
  grid.insertBefore(card, document.querySelector('#newCardButton'));
  closeModal(); nameInput.value = ''; showToast(`“${name}” is ready for your ideas ✦`);
});

document.querySelector('#tourButton').addEventListener('click', () => showToast('Pick a notepad, choose a flow, invite your people ✦'));
document.querySelector('#inviteButton').addEventListener('click', () => showToast('Invite link copied — send it to your planning people ✦'));
document.querySelector('#helpButton').addEventListener('click', () => showToast('Notepads keep every kind of thinking welcome.'));
document.querySelector('#filterButton').addEventListener('click', (event) => {
  const showingShared = event.currentTarget.dataset.shared === 'true';
  event.currentTarget.dataset.shared = String(!showingShared);
  event.currentTarget.innerHTML = showingShared ? 'All notepads <span>⌄</span>' : 'Shared with me <span>⌄</span>';
  document.querySelectorAll('.notepad-card').forEach(card => { card.style.display = !showingShared && card.dataset.type !== 'shared' ? 'none' : ''; });
});

document.querySelectorAll('.style-card').forEach(card => card.addEventListener('click', () => {
  document.querySelectorAll('.style-card').forEach(item => item.classList.remove('active-style'));
  card.classList.add('active-style');
  showToast(`${card.dataset.style} mode selected — nice choice.`);
}));

document.querySelectorAll('.notepad-card').forEach(card => card.addEventListener('click', (event) => {
  if (event.target.closest('.more-button')) { showToast('More notepad options coming soon'); return; }
  openWorkspace(card);
}));

grid.addEventListener('click', (event) => {
  const card = event.target.closest('.notepad-card');
  if (card && !event.target.closest('.more-button') && !card.dataset.bound) openWorkspace(card);
});

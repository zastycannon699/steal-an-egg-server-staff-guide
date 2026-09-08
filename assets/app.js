const warningLevels = [
  ['Warn 1', 'Formal Warning'],
  ['Warn 2', '2-Hour Mute'],
  ['Warn 3', '4-Hour Mute'],
  ['Warn 4', '6-Hour Mute'],
  ['Warn 5', 'Ban (Can Appeal)'],
  ['Warn 6', 'Permanent Ban'],
];

const moderationGuide = [
  { title: 'Spam / Flooding', actions: [['First Offense', 'Verbal Warning'], ['Repeated', '2-Hour Mute'], ['Attempted Mass Ping (Very Unlikely)', '1-Hour Mute']] },
  { title: 'Toxicity / Insults', actions: [['Minor', 'Verbal Warning'], ['Repeated', '2-Hour Mute'], ['Targeted Harassment', '2–4-Hour Mute'], ['Continued Harassment', '6-Hour Mute + Warning']] },
  { title: 'Hate Speech', actions: [['Mild', 'Warn – 2-Hour Mute'], ['Clear Hate Speech', '6-Hour Mute + Warning'], ['Severe / Repeated', 'Permanent Ban']] },
  { title: 'NSFW / Gore', actions: [['Mild', '2-Hour Mute'], ['Explicit Content / Gore', '6-Hour Mute + Warning'], ['Repeated', 'Permanent Ban'], ['Anything Involving Minors', 'Permanent Ban']] },
  { title: 'Advertising / Self-Promotion', intro: 'Includes MrBeast scams and similar fraudulent promotions.', actions: [['First Offense', 'Softban'], ['Repeated', 'Soft Ban'], ['Scam Advertising', 'Permanent Ban']] },
  { title: 'Impersonation', actions: [['Member', '3-Hour mute + Warning'], ['Staff', '6-Hour mute + Warning + Demotion'], ['Used to Scam or Cause Harm', 'Permanent Ban']] },
  { title: 'Raiding / Disruptive Behavior', actions: [['Minor Disruption', '4–6-Hour Mute + Warning'], ['Raiding / Mass Disruption', 'Permanent Ban']] },
  { title: 'Doxxing', actions: [['Accidental / Minor', '6-Hour Mute + Warning'], ['Intentional', 'Permanent Ban']] },
  { title: 'Scams / Phishing', actions: [['Suspicious Links', '6-Hour Mute + Warning'], ['Attempted Scam', 'Ban (Can Appeal)'], ['Confirmed Scam / Phishing', 'Permanent Ban']] },
  { title: 'Ban Evasion', actions: [['Attempting to Bypass a Mute', '4-Hour Mute'], ['Ban Evasion', 'Permanent Ban']] },
];

const staffRoles = [
  ['Owner', ['Full control over the server', 'Make final decisions regarding staff and server operations', 'Oversee all departments and major changes', 'Handle high-level issues and situations', 'Set the overall direction of the server']],
  ['Co-Owner', ['Assist the Owner with managing the server', 'Oversee staff teams and departments', 'Make major server and management decisions', 'Handle high-level staff situations', 'Help maintain the overall structure and operation of the server']],
  ['Manager', ['Manage staff teams and assist with server operations', 'Oversee Staff Supervisors and moderation staff', 'Handle staff conflicts and internal concerns', 'Organise staff operations, activities and responsibilities', 'Work closely with senior management']],
  ['Staff Supervisor', ['Supervise the moderation team', 'Monitor staff activity and performance', 'Handle staff concerns and internal issues', 'Make sure moderation staff follow procedures and expectations', 'Assist with staff promotions, demotions and performance reviews']],
  ['Head Moderator', ['Lead the moderation team', 'Handle major moderation incidents', 'Train and guide moderators', 'Monitor moderator activity and performance', 'Recommend staff promotions or demotions when necessary']],
  ['Senior Moderator', ['Handle serious rule violations and moderation cases', 'Oversee Moderators and Junior Moderators', 'Assist with moderator training', 'Support the Head Moderator with moderation duties', 'Help ensure moderation procedures are followed correctly']],
  ['Moderator', ['Perform all Junior Moderator responsibilities', 'Handle member reports and moderation cases', 'Issue warnings, timeouts and bans when necessary', 'Handle more serious rule violations', 'Escalate major situations to senior staff when required']],
  ['Junior Moderator', ['Handle minor rule violations', 'Issue warnings when necessary', 'Remove inappropriate or rule-breaking messages', 'Assist members with basic moderation-related issues', 'Report serious situations to higher-ranking staff']],
  ['Ticket Staff', ['Manage and respond to support tickets', 'Help members resolve their issues', 'Collect relevant information when needed', 'Direct tickets to the appropriate staff member or department', 'Escalate situations that require higher staff involvement']],
];

const staffNotes = [
  'Punishments may be adjusted depending on the situation. Always consider severity, context, intent, and previous punishments before taking action.',
  'If an offense is serious enough, staff may skip warning levels instead of issuing multiple warnings.',
  "If you're unsure which punishment to give, ask a Senior Mod or Head Mod before taking action.",
  'Always have evidence for punishments when possible. Do not punish someone based solely on assumptions.',
  'Staff Accountability: Staff members are expected to follow the same rules as everyone else and are held to a higher standard due to their position. If a staff member is found violating server rules, abusing their permissions, or acting inappropriately, they may receive a punishment, demotion, or removal from the staff team depending on the severity of the situation. Repeated or serious violations may result in further disciplinary action. All staff members are expected to set a good example and use their position responsibly.',
  
];

const guideList = document.querySelector('#guideList');
const rolesGrid = document.querySelector('#rolesGrid');
const notesList = document.querySelector('#notesList');
const searchInput = document.querySelector('#guideSearch');
const searchStatus = document.querySelector('#searchStatus');

document.querySelector('#warningLevels').innerHTML = warningLevels.map(([level, action]) => `
  <div class="warning-level"><strong>${level}</strong><span>${action}</span></div>
`).join('');

function guideCard(category, index, isOpen = false) {
  const intro = category.intro ? `<div class="action-row"><span>Note</span><strong>${category.intro}</strong></div>` : '';
  const actions = category.actions.map(([label, action]) => `
    <div class="action-row"><span>${label}</span><strong>${action}</strong></div>
  `).join('');
  return `
    <article class="guide-item ${isOpen ? 'open' : ''}">
      <button class="guide-trigger" type="button" aria-expanded="${isOpen}" aria-controls="guide-details-${index}" data-guide-toggle="${index}">
        <span class="guide-number">${String(index + 1).padStart(2, '0')}</span>
        <strong>${category.title}</strong>
        <span class="arrow" aria-hidden="true">+</span>
      </button>
      <div class="guide-details" id="guide-details-${index}" ${isOpen ? '' : 'hidden'}>${intro}${actions}</div>
    </article>`;
}

function renderGuide(query = '') {
  const normalized = query.trim().toLowerCase();
  const visible = moderationGuide.filter(({ title, intro, actions }) =>
    [title, intro || '', ...actions.flat()].join(' ').toLowerCase().includes(normalized)
  );
  guideList.innerHTML = visible.length
    ? visible.map((category) => guideCard(category, moderationGuide.indexOf(category), Boolean(normalized))).join('')
    : '<div class="no-results">No moderation category matches that search.</div>';
  searchStatus.textContent = normalized ? `${visible.length} matching ${visible.length === 1 ? 'category' : 'categories'}` : 'Showing all categories';
}

rolesGrid.innerHTML = staffRoles.map(([title, responsibilities], index) => `
  <article class="role-card ${index === 0 ? 'open' : ''}">
    <button class="role-trigger" type="button" aria-expanded="${index === 0}" aria-controls="role-details-${index}" data-role-toggle="${index}">
      <div><span class="role-index">ROLE ${String(index + 1).padStart(2, '0')}</span><h3>${title}</h3></div>
      <span class="role-plus" aria-hidden="true">+</span>
    </button>
    <div class="role-details" id="role-details-${index}" ${index === 0 ? '' : 'hidden'}>
      <ul>${responsibilities.map((item) => `<li>${item}</li>`).join('')}</ul>
    </div>
  </article>
`).join('');

notesList.innerHTML = staffNotes.map((note, index) => `
  <article class="note"><span class="note-number">${String(index + 1).padStart(2, '0')}</span><p>${note}</p></article>
`).join('');

renderGuide();

guideList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-guide-toggle]');
  if (!button) return;
  const card = button.closest('.guide-item');
  const details = card.querySelector('.guide-details');
  const isOpen = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!isOpen));
  details.hidden = isOpen;
  card.classList.toggle('open', !isOpen);
});

rolesGrid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-role-toggle]');
  if (!button) return;
  const card = button.closest('.role-card');
  const details = card.querySelector('.role-details');
  const isOpen = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!isOpen));
  details.hidden = isOpen;
  card.classList.toggle('open', !isOpen);
});

searchInput.addEventListener('input', () => renderGuide(searchInput.value));

function openView(view) {
  document.querySelectorAll('[data-view-panel]').forEach((panel) => {
    const matches = panel.dataset.viewPanel === view;
    panel.hidden = !matches;
    panel.classList.toggle('active', matches);
  });
  document.querySelectorAll('[data-view]').forEach((button) => {
    const matches = button.dataset.view === view;
    button.classList.toggle('active', matches);
    button.toggleAttribute('aria-current', matches);
  });
  window.location.hash = view;
}

document.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => openView(button.dataset.view)));
document.querySelectorAll('[data-open-view]').forEach((link) => link.addEventListener('click', () => openView(link.dataset.openView)));

const availableViews = ['guide', 'roles', 'notes'];
const requestedView = window.location.hash.slice(1);
if (availableViews.includes(requestedView)) openView(requestedView);

const paletteButton = document.querySelector('#paletteButton');
const paletteName = document.querySelector('#paletteName');
const palettes = [
  ['ember', 'Ember'],
  ['abyss', 'Abyss'],
  ['gold', 'Gold'],
  ['violet', 'Violet'],
  ['forest', 'Forest'],
  ['rose', 'Rose'],
  ['ice', 'Ice'],
  ['lime', 'Lime'],
  ['coral', 'Coral'],
  ['neon', 'Neon'],
  ['ocean', 'Ocean'],
  ['ruby', 'Ruby'],
];
let paletteIndex = Number(localStorage.getItem('fleet-palette-index')) || 0;

function setPalette(index) {
  paletteIndex = index % palettes.length;
  const [value, label] = palettes[paletteIndex];
  document.documentElement.dataset.palette = value;
  paletteName.textContent = label;
  localStorage.setItem('fleet-palette-index', String(paletteIndex));
}

setPalette(paletteIndex);
paletteButton.addEventListener('click', () => setPalette(paletteIndex + 1));

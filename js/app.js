const app = document.getElementById('app');

const store = JSON.parse(localStorage.getItem('bzh2') || '{"seen":[],"wrong":[],"scores":{}}');
const save = () => localStorage.setItem('bzh2', JSON.stringify(store));

let content = { topics: [], papers: [] };
let current = [];

const qBank = [
  ['simplification','easy','8 + 4 × 3',20,'First multiply: 4 × 3 = 12. Then add: 8 + 12 = 20.'],
  ['simplification','medium','24 ÷ 6 + 7 × 2',18,'Division and multiplication first: 24 ÷ 6 = 4; 7 × 2 = 14; then 4 + 14 = 18.'],
  ['simplification','hard','(18 + 6) ÷ 3 × 4',32,'Bracket first: 18 + 6 = 24. Then 24 ÷ 3 = 8. Finally 8 × 4 = 32.'],
  ['inequality','easy','If A > B and B > C, which is true?','A > C','Follow the chain: A is greater than B and B is greater than C, so A > C.'],
  ['inequality','medium','If P ≤ Q and Q < R, which is definitely true?','P < R','P can be equal to Q or less than Q; Q is less than R. In both cases P < R.'],
  ['parts','easy','Identify the verb: "She studies daily."','studies','A verb tells us the action or state. Here, "studies" is the action.'],
  ['parts','medium','Identify the pronoun: "They went to the bank."','They','A pronoun replaces a noun. "They" refers to people without naming them.']
];

function layout(html) { app.innerHTML = '<div class="wrap">' + html + '</div>'; }

function go(page) {
  if (page === 'home') home();
  else if (page === 'learn') learn();
  else if (page === 'practice') practice();
  else if (page === 'test') test();
  else if (page === 'papers') papers();
  else if (page === 'progress') progress();
}

function home() {
  const topics = content.topics || [];
  if (!topics.length) return showError('No study topics were found in content.json.');
  const t = topics[new Date().getDate() % topics.length];
  layout(`<div class="grid">
    <div class="card"><span class="pill">TODAY'S PRIORITY</span><h2>${t.subject}: ${t.name}</h2><p>${t.concept}</p><button class="primary" onclick="go('learn')">Start Learning →</button></div>
    <div class="card"><div class="muted">Questions attempted</div><div class="big">${store.seen.length}</div><div class="muted">Wrong answers are saved for revision.</div></div>
    <div class="card"><span class="pill">DAILY FLOW</span><p>Learn → Example → Practice → Test → Review mistakes</p></div>
  </div>`);
}

function learn() {
  layout(`<h2>📚 Learn from Zero</h2><div class="grid">${(content.topics || []).map(t =>
    `<div class="card"><span class="pill">${t.subject}</span><h3>${t.name}</h3><p>${t.concept}</p><div class="solution">${t.visual}</div><button class="primary" onclick="startTopic('${t.id}')">Practice this topic</button></div>`
  ).join('')}</div>`);
}

function startTopic(id) { current = qBank.filter(q => q[0] === id); renderQuestion(0); }

function practice() {
  layout(`<h2>✏️ Daily Practice</h2><p class="muted">Choose a difficulty and review every solution.</p><div class="grid">${
    ['easy','medium','hard'].map(level => `<div class="card"><h2>${level==='easy'?'🟢':level==='medium'?'🟡':'🔴'} ${level.toUpperCase()}</h2><button class="primary" onclick="startLevel('${level}')">Start</button></div>`).join('')
  }<div class="card"><h2>🔁 Revision</h2><p>Retry questions answered incorrectly.</p><button class="primary" onclick="revision()">Revise mistakes</button></div></div>`);
}

function startLevel(level) { current = qBank.filter(q => q[1] === level); renderQuestion(0); }
function revision() { current = qBank.filter(q => store.wrong.includes(q[2])); renderQuestion(0); }

function makeOptions(answer) {
  const options = [answer];
  const fillers = typeof answer === 'number' ? [answer+2, answer-2, answer+5] : ['A > C','P < R','studies','They','None of these'];
  fillers.forEach(x => { if (!options.includes(x) && options.length < 4) options.push(x); });
  return options.sort(() => Math.random() - 0.5);
}

function renderQuestion(i) {
  if (!current.length) return layout(`<div class="card"><h2>🎉 No questions available yet</h2><button class="primary" onclick="go('practice')">Back</button></div>`);
  if (i >= current.length) return layout(`<div class="card"><h2>🎉 Practice completed!</h2><button class="primary" onclick="go('practice')">Back to Practice</button></div>`);
  const q = current[i], options = makeOptions(q[3]);
  layout(`<div class="card"><span class="pill">QUESTION ${i+1}/${current.length}</span><h2>${q[2]}</h2><div id="opts">${options.map((o,index)=>`<button class="option" data-index="${index}">${o}</button>`).join('')}</div><div id="result"></div></div>`);
  document.querySelectorAll('.option').forEach((button,index) => button.addEventListener('click', () => check(i, options[index])));
}

function check(i, choice) {
  const q=current[i], ok=String(choice)===String(q[3]);
  store.seen.push(q[2]);
  if (!ok && !store.wrong.includes(q[2])) store.wrong.push(q[2]);
  if (ok) store.wrong=store.wrong.filter(x=>x!==q[2]);
  save();
  document.querySelectorAll('.option').forEach(button => {
    button.disabled=true;
    if (String(button.textContent)===String(q[3])) button.classList.add('correct');
    if (String(button.textContent)===String(choice) && !ok) button.classList.add('wrong');
  });
  document.getElementById('result').innerHTML=`<div class="solution"><b>${ok?'✅ Correct!':'❌ Let us understand it'}</b><br><br>${q[4]}<br><br><button class="primary" onclick="renderQuestion(${i+1})">Next →</button></div>`;
}

function test() { current=qBank.slice().sort(()=>Math.random()-.5).slice(0,Math.min(10,qBank.length)); renderQuestion(0); }

function papers() {
  layout(`<h2>📄 Previous Year Papers</h2><p class="muted">Open the source to view available papers, answers and solutions.</p><div class="grid">${(content.papers || []).map(p =>
    `<div class="card paper"><span class="pill">${p.year}</span><h3>${p.title}</h3><p class="tag">Source: ${p.source}</p><a href="${p.url}" target="_blank" rel="noopener"><button class="primary">View papers / solutions →</button></a></div>`
  ).join('')}</div>`);
}

function progress() {
  const total=store.seen.length, wrong=store.wrong.length, accuracy=total?Math.round((total-wrong)/total*100):0;
  layout(`<h2>📊 Your Progress</h2><div class="grid"><div class="card"><div class="big">${total}</div>Attempted</div><div class="card"><div class="big">${wrong}</div>Need revision</div><div class="card"><div class="big">${accuracy}%</div>Current accuracy estimate</div></div>`);
}

function showError(message) { layout(`<div class="card"><h2>⚠️ App data could not be loaded</h2><p>${message}</p></div>`); }

window.go=go; window.startTopic=startTopic; window.startLevel=startLevel; window.revision=revision; window.renderQuestion=renderQuestion;

layout('<div class="card"><h2>Loading your study plan…</h2></div>');
fetch('./data/content.json', {cache:'no-store'})
  .then(r => { if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); })
  .then(data => { content=data; go('home'); })
  .catch(err => { console.error(err); showError('content.json exists but could not be processed: '+err.message); });

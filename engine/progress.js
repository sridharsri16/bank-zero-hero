export function load(){return JSON.parse(localStorage.getItem('bank-zero-hero-progress')||'{"mastered":[],"revision":[],"attempts":{}}')}
export function save(p){localStorage.setItem('bank-zero-hero-progress',JSON.stringify(p))}
export function mark(p,id,correct){p.attempts[id]=(p.attempts[id]||0)+1;if(correct){if(!p.mastered.includes(id))p.mastered.push(id);p.revision=p.revision.filter(x=>x!==id)}else if(!p.revision.includes(id))p.revision.push(id);save(p);return p}
export function unseen(questions,p){return questions.filter(q=>!p.mastered.includes(q.id))}

const dialog=document.querySelector('.lightbox');
for(const button of document.querySelectorAll('.image-preview')) button.addEventListener('click',()=>{const source=button.querySelector('img');dialog.querySelector('img').src=source.dataset.fullSrc||source.src;dialog.querySelector('img').alt=source.alt;dialog.querySelector('p').textContent=source.alt;dialog.showModal()});
document.querySelector('.close-lightbox').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
let toastTimer;const toast=document.querySelector('.toast');document.querySelector('.copy-email')?.addEventListener('click',async e=>{const email=e.currentTarget.dataset.email;try{await navigator.clipboard.writeText(email);toast.textContent='Email copied. Let’s talk research!'}catch{toast.textContent=email}clearTimeout(toastTimer);toast.classList.add('show');toastTimer=setTimeout(()=>toast.classList.remove('show'),2600)});
const sections=[...document.querySelectorAll('main section')], links=[...document.querySelectorAll('nav a')];let queued=false;
function update(){const current=sections.filter(s=>s.getBoundingClientRect().top<160).at(-1)||sections[0];links.forEach(a=>{const active=a.hash==='#'+current.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.reading-progress').style.width=(max?scrollY/max*100:0)+'%';queued=false}
addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update)}},{passive:true});addEventListener('resize',update);update();
document.addEventListener('click',e=>{if(!e.target.closest('button,a')||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const wave=document.createElement('i');wave.className='tap-wave';wave.style.left=(e.clientX-4)+'px';wave.style.top=(e.clientY-4)+'px';document.body.append(wave);wave.addEventListener('animationend',()=>wave.remove())});
// Non-blocking star counts, with a public badge service fallback.
(()=>{
 const ttl=15*60*1000,inflight=new Set(),memory=new Map();
 const read=key=>{try{return JSON.parse(localStorage.getItem(key))}catch{return memory.get(key)}};
 const write=(key,data)=>{memory.set(key,data);try{localStorage.setItem(key,JSON.stringify(data))}catch{}};
 const valid=d=>d&&typeof d.label==='string'&&/^[0-9][0-9,.]*[kKmM]?$/.test(d.label)&&Number.isFinite(d.at);
 function paint(link,data,cached){const badge=link.querySelector('.star-badge'),count=link.querySelector('.star-count');badge.dataset.state=cached?'cached':'live';count.textContent=data.label;count.setAttribute('aria-label',`${data.label} GitHub stars`);badge.title=`${data.label} GitHub stars · ${data.source} · ${cached?'Cached, fetched':'Fetched'} ${new Date(data.at).toLocaleString()}`}
 async function json(url){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),4500);try{const response=await fetch(url,{signal:controller.signal,credentials:'omit'});if(!response.ok)throw Error('Request failed');return await response.json()}finally{clearTimeout(timer)}}
 async function fetchStars(repo){try{const d=await json(`https://api.github.com/repos/${repo}`);if(!Number.isInteger(d.stargazers_count)||d.stargazers_count<0)throw Error('Invalid count');return {label:new Intl.NumberFormat('en-US').format(d.stargazers_count),at:Date.now(),source:'GitHub'}}catch{const d=await json(`https://img.shields.io/github/stars/${repo}.json`);const result={label:d.value||d.message,at:Date.now(),source:'Shields.io (provider cached)'};if(!valid(result))throw Error('Invalid badge data');return result}}
 async function refresh(link){const repo=link.dataset.repo,key=`homepage:github-stars:v2:${repo}`,stored=read(key),cached=valid(stored)?stored:null;if(cached)paint(link,cached,true);if(cached&&Date.now()-cached.at<ttl)return;if(inflight.has(repo))return;inflight.add(repo);
 try{const entry=await fetchStars(repo);write(key,entry);paint(link,entry,false)}catch{if(cached)paint(link,cached,true);else{const badge=link.querySelector('.star-badge');badge.dataset.state='unavailable';badge.title='Star count unavailable; open repository to view.';const count=link.querySelector('.star-count');count.textContent='—';count.setAttribute('aria-label','Star count unavailable')}}finally{inflight.delete(repo)}}
 const refreshAll=()=>{if(document.visibilityState==='visible')document.querySelectorAll('.code-stars').forEach(refresh)};refreshAll();setInterval(refreshAll,ttl);document.addEventListener('visibilitychange',refreshAll);
})();

// Animate only after deliberate pointer movement, keyboard navigation, or touch.
(() => {
 const b=document.querySelector('.lulu-sticker'), im=document.querySelector('.lulu-sprite');
 if(!b||!im)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let timer=0, frame=0, active=false, keyboard=false, lastPointer=null;
 function paint(){im.style.left=-(frame%7)*100+'%';im.style.top=-Math.floor(frame/7)*100+'%'}
 function tick(){if(!active)return;frame=(frame+1)%35;paint();timer=setTimeout(tick,100)}
 function stop(){active=false;clearTimeout(timer);frame=0;paint();b.dataset.playing='false'}
 function reset(){stop();keyboard=false;lastPointer=null}
 function start(){if(active||reduced.matches||document.hidden)return;active=true;b.dataset.playing='true';timer=setTimeout(tick,100)}
 document.addEventListener('pointermove',e=>{
  if(e.pointerType==='touch')return;
  const moved=lastPointer!==null&&(e.clientX!==lastPointer.x||e.clientY!==lastPointer.y);
  lastPointer={x:e.clientX,y:e.clientY};
  if(moved&&b.contains(e.target))start();
 },{passive:true});
 document.addEventListener('keydown',e=>{keyboard=e.key==='Tab'});
 document.addEventListener('pointerdown',()=>{keyboard=false},true);
 b.addEventListener('pointerleave',stop);
 b.addEventListener('focus',()=>{if(keyboard)start()});
 b.addEventListener('blur',stop);
 b.addEventListener('click',()=>{if(matchMedia('(hover: none)').matches){if(active)stop();else start()}});
 document.addEventListener('visibilitychange',reset);
 window.addEventListener('blur',reset);
 window.addEventListener('pageshow',reset);
 window.addEventListener('pagehide',reset);
 reduced.addEventListener('change',reset);
 reset();
})();

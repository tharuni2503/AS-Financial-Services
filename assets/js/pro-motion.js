(()=>{const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
const bar=document.createElement('div');bar.id='scrollbar';document.body.appendChild(bar);
addEventListener('scroll',()=>{const h=document.documentElement;bar.style.width=(scrollY/Math.max(1,h.scrollHeight-innerHeight)*100)+'%'},{passive:true});
document.querySelectorAll('.reveal').forEach(el=>{const i=[...el.parentElement.children].filter(c=>c.classList.contains('reveal')).indexOf(el);
 if(i>0){el.style.transitionDelay=Math.min(i,8)*70+'ms';el.addEventListener('transitionend',()=>el.style.transitionDelay='',{once:true})}});
if(!rm){document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||a.target||a.hasAttribute('download'))return;
 const u=new URL(a.href,location.href);if(u.protocol!==location.protocol||u.origin!==location.origin||u.pathname===location.pathname)return;
 e.preventDefault();document.body.classList.add('leaving');setTimeout(()=>location.href=a.href,260)});
 addEventListener('pageshow',e=>{if(e.persisted)document.body.classList.remove('leaving')})}
if(!rm&&matchMedia('(hover:hover)').matches){
 document.querySelectorAll('[class*="card"],[class*="benefit"],[class*="tile"]').forEach(el=>{
  const r=el.getBoundingClientRect();if(el.matches('.form-card,.hx-card,form')||el.closest('header,nav,footer')||r.width>470||r.height>440||r.width<120)return;
  el.classList.add('tilt');
  el.addEventListener('pointermove',e=>{const b=el.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;
   el.style.transform=`perspective(900px) rotateX(${-y*7}deg) rotateY(${x*9}deg) translateY(-3px)`});
  el.addEventListener('pointerleave',()=>el.style.transform='')})}
})();

document.addEventListener('click',e=>{const g=e.target.closest('.gal-item');if(!g)return;
 const o=document.createElement('div');o.className='lb';o.setAttribute('role','dialog');o.setAttribute('aria-label','Poster preview');
 o.innerHTML='<img alt="'+g.querySelector('img').alt+'" src="'+g.dataset.full+'"><button type="button" aria-label="Close">&times;</button>';
 const x=()=>{o.remove();document.removeEventListener('keydown',k)},k=ev=>ev.key==='Escape'&&x();
 o.onclick=ev=>{if(ev.target!==o.querySelector('img'))x()};document.addEventListener('keydown',k);document.body.appendChild(o);o.querySelector('button').focus()});

(()=>{
const R=n=>n<0?'−'+R(-n):'₹'+Math.round(n).toLocaleString('en-IN');
const S=n=>n<0?'−'+S(-n):n>=1e7?'₹'+(n/1e7).toFixed(2)+' Cr':n>=1e5?'₹'+(n/1e5).toFixed(2)+' L':R(n);
const emi=(p,r,y)=>{r/=1200;const n=y*12;return r?p*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):p/n};
const bal=(p,r,y,m)=>{const i=r/1200,e=emi(p,r,y);return p*Math.pow(1+i,m)-e*(Math.pow(1+i,m)-1)/i};
const ym=m=>Math.floor(m/12)+' yr '+Math.round(m%12)+' mo';
const f=(k,l,min,max,step,v,suf)=>({k,l,min,max,step,v,suf});
const C={
emi:{t:'EMI Calculator',d:'Monthly instalment, total interest and total payable.',f:[f('p','Loan amount',1e5,5e7,1e5,4e6),f('r','Interest rate (% p.a.)',5,20,.05,8.5),f('y','Tenure (years)',1,30,1,20)],
 o:v=>{const e=emi(v.p,v.r,v.y),t=e*v.y*12;return{l:'Monthly EMI',b:R(e),rows:[['Principal',S(v.p)],['Total interest',S(t-v.p)],['Total payable',S(t)]],split:v.p/t}}},
elig:{t:'Loan Eligibility',d:'Indicative loan amount based on your income and existing EMIs.',f:[f('i','Monthly net income',1e4,5e5,5e3,75e3),f('x','Existing EMIs / month',0,2e5,1e3,0),f('r','Interest rate (% p.a.)',5,20,.05,8.5),f('y','Tenure (years)',1,30,1,20),f('o','Share of income for EMIs (%)',30,70,5,50)],
 o:v=>{const e=Math.max(0,v.i*v.o/100-v.x),r=v.r/1200,n=v.y*12,p=e*(1-Math.pow(1+r,-n))/r;return{l:'Indicative eligible loan',b:S(p),rows:[['Max EMI you can service',R(e)],['Existing EMIs',R(v.x)]],note:'Lenders apply their own policy, credit score and property checks.'}}},
pre:{t:'Prepayment Calculator',d:'See what a one-time part-payment saves you.',f:[f('p','Loan amount',1e5,5e7,1e5,4e6),f('r','Interest rate (% p.a.)',5,20,.05,8.5),f('y','Tenure (years)',1,30,1,20),f('a','Part-payment amount',5e4,1e7,5e4,5e5),f('k','Paid after year',1,29,1,3)],
 o:v=>{if(v.k>=v.y)return{l:'Part-payment year must be inside the tenure',warn:1};const e=emi(v.p,v.r,v.y),i=v.r/1200,b=Math.max(0,bal(v.p,v.r,v.y,v.k*12)-v.a);
  const n2=b?-Math.log(1-b*i/e)/Math.log(1+i):0,paid=e*v.k*12+v.a+e*n2,orig=e*v.y*12;return{l:'Interest & payment saved',b:S(Math.max(0,orig-paid)),rows:[['EMI (unchanged)',R(e)],['Tenure reduced by',ym(v.y*12-v.k*12-n2)],['New loan end',ym(v.k*12+n2)]],note:'Assumes the EMI stays the same and the tenure shortens.'}}},
ten:{t:'Tenure Calculator',d:'How long to repay if you pay a fixed EMI.',f:[f('p','Loan amount',1e5,5e7,1e5,4e6),f('r','Interest rate (% p.a.)',5,20,.05,8.5),f('e','EMI you can pay',5e3,5e5,500,45e3)],
 o:v=>{const i=v.r/1200;if(v.e<=v.p*i)return{l:'EMI is too low to ever clear this loan',warn:1};const n=-Math.log(1-v.p*i/v.e)/Math.log(1+i);return{l:'Time to repay',b:ym(n),rows:[['Total interest',S(v.e*n-v.p)],['Total payable',S(v.e*n)]]}}},
bt:{t:'Balance Transfer',d:'Check if moving your loan to a lower rate is worth it.',f:[f('p','Outstanding loan',1e5,5e7,1e5,3e6),f('a','Current rate (% p.a.)',5,20,.05,9.5),f('b','New rate (% p.a.)',5,20,.05,8.5),f('y','Remaining tenure (years)',1,30,1,15),f('c','Processing fee (% + GST)',0,2,.05,.5)],
 o:v=>{const e1=emi(v.p,v.a,v.y),e2=emi(v.p,v.b,v.y),fee=v.p*v.c/100*1.18,net=(e1-e2)*v.y*12-fee;return{l:net>0?'Estimated net saving':'No saving at these rates',b:S(Math.max(0,net)),rows:[['Current EMI',R(e1)],['New EMI',R(e2)],['Monthly saving',R(e1-e2)],['One-time fee (incl. GST)',R(fee)]],note:'Excludes legal and other charges that may apply.'}}},
tax:{t:'Tax Saving Calculator',d:'Illustrative deduction on a home loan under the old tax regime.',f:[f('i','Interest paid this year',0,8e5,5e3,25e4),f('p','Principal repaid this year',0,5e5,5e3,12e4),f('s','Your tax slab (%)',5,30,5,30,'sel')],
 o:v=>{const di=Math.min(v.i,2e5),dp=Math.min(v.p,15e4),k=1.04*v.s/100;return{l:'Estimated tax saved',b:R((di+dp)*k),rows:[['Sec 24(b) interest (cap ₹2 L)',R(di)],['Sec 80C principal (cap ₹1.5 L)',R(dp)],['Total deduction',R(di+dp)]],note:'Self-occupied property, old regime, 4% cess. 80C limit is shared with other investments. Please confirm with your CA.'}}},
bvr:{t:'Buy vs Rent',d:'Compare the net cost of buying and renting over 10 years.',f:[f('p','Property price',1e6,1e8,1e5,6e6),f('d','Down payment (%)',10,60,5,20),f('r','Loan rate (% p.a.)',5,20,.05,8.5),f('m','Monthly rent for similar home',3e3,2e5,1e3,2e4),f('g','Property appreciation (% p.a.)',0,12,.5,5)],
 o:v=>{const dp=v.p*v.d/100,L=v.p-dp,e=emi(L,v.r,20),buy=dp+e*120-(v.p*Math.pow(1+v.g/100,10)-bal(L,v.r,20,120));let rent=0;for(let y=0;y<10;y++)rent+=v.m*12*Math.pow(1.05,y);rent-=dp*(Math.pow(1.08,10)-1);
  return{l:buy<rent?'Buying looks cheaper':'Renting looks cheaper',warn:1,rows:[['Net cost of buying (10 yrs)',S(buy)],['Net cost of renting (10 yrs)',S(rent)],['EMI on 20-yr loan',R(e)]],note:'Simplified: 5% yearly rent rise, 8% return on the down payment, 20-year loan; ignores maintenance and taxes.'}}},
con:{t:'Construction Cost',d:'Rough budget for building your home.',f:[f('a','Built-up area (sq ft)',300,10000,50,1500),f('c','Cost per sq ft (edit to local quotes)',1000,6000,50,2200),f('x','Contingency (%)',0,20,1,5)],
 o:v=>{const b=v.a*v.c,t=b*(1+v.x/100);return{l:'Estimated total cost',b:S(t),rows:[['Base construction',S(b)],['Contingency',S(t-b)],['EMI if 80% financed (8.5%, 20 yrs)',R(emi(t*.8,8.5,20))]],note:'Land, approvals and interiors are not included. Rate per sq ft is your input.'}}}
};
const tabs=document.getElementById('calc-tabs'),box=document.getElementById('calc-form'),out=document.getElementById('calc-out');let cur='emi',val={};
Object.entries(C).forEach(([k,c])=>{const b=document.createElement('button');b.className='calc-tab';b.role='tab';b.textContent=c.t;b.onclick=()=>show(k);b.dataset.k=k;tabs.appendChild(b)});
function show(k){cur=k;const c=C[k];history.replaceState(null,'','#'+k);tabs.querySelectorAll('button').forEach(b=>b.setAttribute('aria-selected',b.dataset.k===k));
 val={};box.innerHTML=`<h2>${c.t}</h2><p>${c.d}</p>`;
 c.f.forEach(d=>{val[d.k]=d.v;const w=document.createElement('div');w.className='cf';
  if(d.suf){w.innerHTML=`<div class="cf-top"><label for="f-${d.k}">${d.l}</label><select id="f-${d.k}">${[5,10,15,20,30].map(s=>`<option ${s===d.v?'selected':''}>${s}</option>`).join('')}</select></div>`;
   w.querySelector('select').onchange=e=>{val[d.k]=+e.target.value;calc()}}
  else{w.innerHTML=`<div class="cf-top"><label for="f-${d.k}">${d.l}</label><input id="f-${d.k}" type="number" min="${d.min}" max="${d.max}" step="${d.step}" value="${d.v}"></div><input type="range" aria-label="${d.l}" min="${d.min}" max="${d.max}" step="${d.step}" value="${d.v}">`;
   const n=w.querySelector('[type=number]'),r=w.querySelector('[type=range]');
   r.oninput=()=>{n.value=r.value;val[d.k]=+r.value;calc()};n.oninput=()=>{const x=Math.min(d.max,Math.max(d.min,+n.value||d.min));r.value=x;val[d.k]=x;calc()}}
  box.appendChild(w)});calc()}
function calc(){const c=C[cur],o=c.o(val);let h=`<small>${o.l&&!o.b?'Result':o.l}</small>`;
 h=o.b?`<small>${o.l}</small><div class="big">${o.b}</div>`:`<small>Result</small><div class="big warn">${o.l}</div>`;
 if(o.warn&&o.b===undefined&&o.rows)h=`<small>Verdict</small><div class="big warn">${o.l}</div>`;
 if(o.split!==undefined)h+=`<div class="split" title="Principal vs interest"><i style="width:${(o.split*100).toFixed(1)}%"></i></div>`;
 if(o.rows)h+='<dl>'+o.rows.map(r=>`<div><dt>${r[0]}</dt><dd>${r[1]}</dd></div>`).join('')+'</dl>';
 const msg=encodeURIComponent(`Hi AS Financial, I used the ${c.t}: `+(o.b?o.l+' '+o.b+'. ':o.l+'. ')+Object.entries(val).map(([k,v])=>k+'='+v).join(', ')+'. Please help me with options.');
 h+=(o.note?`<p class="note">${o.note}</p>`:'')+`<div class="acts"><a class="g" href="https://wa.me/919182703079?text=${msg}" target="_blank" rel="noopener">Discuss on WhatsApp</a><a class="o" href="contact.html">Talk to an advisor</a></div><p class="note">Indicative figures only. Actual terms depend on lender policy.</p>`;
 out.innerHTML=h}
show(C[location.hash.slice(1)]?location.hash.slice(1):'emi');addEventListener('hashchange',()=>C[location.hash.slice(1)]&&show(location.hash.slice(1)));
})();

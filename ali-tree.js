const toast = document.getElementById('toast');
function notify(message){toast.textContent=message;toast.classList.add('show');window.setTimeout(()=>toast.classList.remove('show'),2600)}
let aliTree=[];
let selectedA=null,selectedB=null;
const list=document.getElementById('ali-tree-list'),summary=document.getElementById('tree-summary'),crumbs=document.getElementById('tree-crumbs'),back=document.getElementById('tree-back');

const repo='https://github.com/AligasSRM/ALI-NEW/blob/main/';
let registryMeta=null;
const numericId=(item)=>Number(String(item.id).slice(1));
async function loadCanonicalTree(){
 try{
  const response=await fetch('./core/registry.json',{cache:'no-store'});
  if(!response.ok) throw new Error('HTTP '+response.status);
  const registry=await response.json();
  if(!Array.isArray(registry.nodes)) throw new Error('registry.nodes is missing');
  registryMeta=registry;
  const phases=registry.nodes.filter(n=>n.level==='A').sort((a,b)=>numericId(a)-numericId(b));
  document.getElementById('metric-phase-count').textContent=String(phases.length);
  document.getElementById('metric-file-count').textContent=String(registry.nodes.filter(n=>n.level==='C'&&typeof n.path==='string'&&n.path.length>0).length);
  aliTree=phases.map(a=>({
   id:a.id,name:a.name,desc:a.notes||a.status,status:a.status,
   sections:registry.nodes.filter(n=>n.level==='B'&&n.parentId===a.id).sort((x,y)=>numericId(x)-numericId(y)).map(b=>({
    id:b.id,name:b.name,desc:b.notes||b.status,status:b.status,
    files:registry.nodes.filter(n=>n.level==='C'&&n.parentId===a.id+'/'+b.id).sort((x,y)=>numericId(x)-numericId(y)).map(c=>[c.id,c.path,c.name,c.status,c.url])
   }))
  }));
  renderTree();
 }catch(error){
  list.replaceChildren();
  const failure=document.createElement('div');
  failure.className='empty-tree';
  failure.textContent='تعذر تحميل سجل CORE المركزي. لم يتم استخدام فهرس احتياطي قديم. السبب: '+error.message;
  list.append(failure);
  summary.textContent='فشل تحميل السجل المركزي؛ راجع core/registry.json.';
  console.error('CORE registry load failed:',error);
 }
}
function renderTree(){
 list.replaceChildren();
 back.disabled=selectedA===null;
 document.getElementById('tree-home').hidden=selectedA===null;
 if(selectedA===null){
  crumbs.innerHTML='<span>ALI-NEW</span><span>›</span><strong>كل المراحل A0–A12</strong>';
  const phaseCount=aliTree.length,sectionCount=aliTree.reduce((n,a)=>n+a.sections.length,0),fileCount=registryMeta.nodes.filter(n=>n.level==='C'&&n.path).length,unmappedCount=registryMeta.unmappedResources.length;
  summary.textContent=phaseCount+' مرحلة A · '+sectionCount+' أقسام B · '+fileCount+' موارد C مرتبطة · '+unmappedCount+' غير مصنفة · حالة السجل: '+registryMeta.registryStatus+'.';
  aliTree.forEach(a=>{const card=document.createElement('article');card.className='tree-card';const btn=document.createElement('button');btn.type='button';btn.className='tree-select';const level=document.createElement('span');level.className='level';level.textContent=a.id;const details=document.createElement('span');const name=document.createElement('span');name.className='tree-name';name.textContent=a.name;const desc=document.createElement('span');desc.className='tree-desc';desc.textContent=a.desc;details.append(name,desc);const countLabel=document.createElement('span');countLabel.className='tree-count';countLabel.textContent=a.sections.length+' أقسام B';const chevron=document.createElement('span');chevron.textContent='›';btn.append(level,details,countLabel,chevron);btn.addEventListener('click',()=>{selectedA=a.id;selectedB=null;renderTree()});card.append(btn);list.append(card)});
 }else{
  const a=aliTree.find(x=>x.id===selectedA);
  if(selectedB===null){
   crumbs.replaceChildren();const rootCrumb=document.createElement('span');rootCrumb.textContent='ALI-NEW';const separator=document.createElement('span');separator.textContent='›';const currentCrumb=document.createElement('strong');currentCrumb.textContent=a.id+' · '+a.name;crumbs.append(rootCrumb,separator,currentCrumb);
   summary.textContent=a.id+' يحتوي '+a.sections.length+' أقسام B ضمن الفهرس. الأقسام ذات الملفات تعرض العدد الفعلي، والأقسام الأخرى تبقى مخططة.';
   a.sections.forEach(b=>{const card=document.createElement('article');card.className='tree-card';const btn=document.createElement('button');btn.type='button';btn.className='tree-select';const count=b.files.length?b.files.length+' ملفات C':'لا توجد ملفات مخصصة';const level=document.createElement('span');level.className='level';level.textContent=b.id;const details=document.createElement('span');const name=document.createElement('span');name.className='tree-name';name.textContent=b.name;const desc=document.createElement('span');desc.className='tree-desc';desc.textContent=b.desc;details.append(name,desc);const countLabel=document.createElement('span');countLabel.className='tree-count';countLabel.textContent=count;const chevron=document.createElement('span');chevron.textContent='›';btn.append(level,details,countLabel,chevron);btn.addEventListener('click',()=>{selectedB=b.id;renderTree()});card.append(btn);list.append(card)});
  }else{
   const b=a.sections.find(x=>x.id===selectedB);
   crumbs.replaceChildren();const rootCrumb=document.createElement('span');rootCrumb.textContent='ALI-NEW';const separatorOne=document.createElement('span');separatorOne.textContent='›';const backToA=document.createElement('button');backToA.type='button';backToA.className='secondary';backToA.id='crumb-a';backToA.textContent=a.id;const separatorTwo=document.createElement('span');separatorTwo.textContent='›';const currentCrumb=document.createElement('strong');currentCrumb.textContent=b.id+' · '+b.name;crumbs.append(rootCrumb,separatorOne,backToA,separatorTwo,currentCrumb);
   document.getElementById('crumb-a').addEventListener('click',()=>{selectedB=null;renderTree()});
   summary.textContent=a.id+' / '+b.id+' · '+(b.files.length?b.files.length+' ملفات موجودة ومساراتها الحقيقية':'لا يوجد ملف مخصص لهذا القسم حالياً؛ هذا قسم تنظيمي مخطط فقط.');
   if(!b.files.length){const empty=document.createElement('div');empty.className='empty-tree';empty.textContent='مخطط — لا يوجد ملف مخصص بعد. لم ننشئ ملفاً أو مجلداً، ولم نخترع مساراً.';list.append(empty)}
   b.files.forEach(file=>{const card=document.createElement('article');card.className='tree-card file-card';const title=document.createElement('strong');title.textContent=file[0]+' · '+file[2];const path=document.createElement('div');path.className='file-path';path.textContent=file[1];const link=document.createElement('a');link.className='tree-link';link.href=file[4]||repo+file[1];link.target='_blank';link.rel='noopener noreferrer';link.textContent='فتح الملف الفعلي على GitHub ↗';const note=document.createElement('p');note.textContent='الحالة: '+(file[3]||'YELLOW')+' · المسار مأخوذ من سجل CORE المركزي.';card.append(title,path,link,note);list.append(card)});
  }
 }
}
back.addEventListener('click',()=>{if(selectedB!==null)selectedB=null;else selectedA=null;renderTree()});
document.getElementById('tree-home').addEventListener('click',()=>{selectedA=null;selectedB=null;renderTree()});
document.querySelectorAll('.nav button').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.nav button').forEach(b=>b.classList.remove('active'));button.classList.add('active');document.getElementById(button.dataset.target)?.scrollIntoView({behavior:'smooth',block:'start'})}));
document.getElementById('show-tree').addEventListener('click',()=>document.getElementById('build-tree').scrollIntoView({behavior:'smooth'}));
document.getElementById('open-doc').addEventListener('click',()=>window.open('https://github.com/AligasSRM/ALI-NEW/blob/main/PROJECT-BUILD-TREE.md','_blank','noopener'));
loadCanonicalTree();

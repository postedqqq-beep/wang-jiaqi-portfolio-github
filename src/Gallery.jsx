import React, {useEffect, useRef, useState} from 'react';
import rawGroups from './gallery.json';
import {publicAsset} from './assets';
const groups=rawGroups.map(group=>({...group,images:group.images.map(image=>Object.fromEntries(Object.entries(image).map(([key,value])=>[key,typeof value==='string'&&value.startsWith('/media/')?publicAsset(value):value])))}));
import MagicBento from './MagicBento';
import {useDrawingMotion} from './Motion';

const descriptions = [
  ['AUTOCAD / MASTER PLAN', '从全局，组织一座工厂。', '厂区平面图', '以总平面布置呈现厂区功能分区、道路组织与建筑布局。'],
  ['AUTOCAD / PLANS & ELEVATIONS', '在平面与立面之间，理清空间。', '车间平立面图', '通过 6 张车间图纸，展示异构化分离车间的设备布置及平立面关系。'],
  ['PLANT 3D / EQUIPMENT & PIPING', '让设备与管道，在空间里连接。', '异构化车间设备与管道建模', '从整体轴测到不同视角，展示设备、管架与管道之间的空间关系。'],
];
export default function Gallery() {
  const [filter,setFilter]=useState('全部');
  useDrawingMotion(filter);
  const [current,setCurrent]=useState(null);
  const [zoom,setZoom]=useState(false);
  const closeRef=useRef(null);
  const trigger=useRef(null);
  const open=current!==null;
  function move(delta){setCurrent(c=>({...c,index:(c.index+delta+groups[c.group].images.length)%groups[c.group].images.length}));setZoom(false)}
  useEffect(()=>{
    if(!open)return;
    const old=document.body.style.overflow;
    document.body.style.overflow='hidden';
    closeRef.current?.focus();
    function keyboard(e){
      if(e.key==='Escape')setCurrent(null);
      if(e.key==='ArrowRight')move(1);
      if(e.key==='ArrowLeft')move(-1);
      if(e.key==='Tab'){
        const nodes=[...document.querySelectorAll('.image-viewer button, .image-viewer a')].filter(n=>!n.disabled);
        const first=nodes[0],last=nodes.at(-1);
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
      }
    }
    window.addEventListener('keydown',keyboard);
    return()=>{document.body.style.overflow=old;window.removeEventListener('keydown',keyboard);trigger.current?.focus()};
  },[open]);
  const item=open?groups[current.group].images[current.index]:null;
  return <>
    <div className="project-toolbar"><div className="filters">{['全部','2D','3D'].map(f=><button key={f} onClick={()=>setFilter(f)} className={filter===f?'active':''} aria-pressed={filter===f}>{f==='全部'?'全部作品':f+' 设计'}</button>)}</div><span>17 张作品图 / 点击图片查看高清原图</span></div>
    <div className="work-groups">{groups.map((group,g)=>{
      if(filter!=='全部' && (g===2?'3D':'2D')!==filter)return null;
      const [tag,title,subtitle,desc]=descriptions[g];
      return <article className={'work-group group-'+group.key} key={group.key}>
        <div className="work-heading"><div><small>0{g+1} / {tag}</small><h3>{title}</h3><p>{subtitle}</p></div><div className="work-description"><span>{String(group.images.length).padStart(2,'0')} 张作品</span><p>{desc}</p></div></div>
        <MagicBento className="drawing-bento" columns={g===0?1:2} rowHeight={200} gap={28} radius={12} theme="light" glowColor="#b98647" enableBorderGlow enableSpotlight spotlightRadius={340} clickEffect intro={false} textAutoHide={false} style={{gridAutoRows:'minmax(0, auto)'}} items={group.images.map((im,index)=>({
          id:im.src,title:'查看原图：'+im.title,
          onClick:e=>{e.currentTarget.focus();trigger.current=e.currentTarget;setZoom(false);setCurrent({group:g,index})},
          content:<><div className="drawing-surface"><img src={im.preview} srcSet={`${im.small} 640w, ${im.medium} 1200w, ${im.preview} 1600w`} sizes={g===0?'(min-width: 1700px) 1500px, 90vw':'(min-width: 1700px) 740px, (min-width: 701px) 45vw, 90vw'} alt={im.title} loading="lazy" decoding="async" width={im.width} height={im.height}/><span className="image-magnify">放大查看 ↗</span></div><div className="drawing-caption"><span>{im.title}</span><small>{im.width} × {im.height} <span aria-hidden="true">↗</span></small></div></>
        }))}/>
      </article>
    })}</div>
    {open&&<div className="image-viewer" role="dialog" aria-modal="true" aria-label={item.title} onClick={()=>setCurrent(null)}>
      <div className="viewer-toolbar" onClick={e=>e.stopPropagation()}><div><strong>{item.title}</strong><span>{current.index+1} / {groups[current.group].images.length} · {item.width} × {item.height}</span></div><div className="viewer-actions"><button onClick={()=>setZoom(v=>!v)}>{zoom?'适应屏幕':'原始尺寸'}</button><a href={item.src} target="_blank" rel="noreferrer">新窗口查看原图 ↗</a><button ref={closeRef} onClick={()=>setCurrent(null)}>关闭 ×</button></div></div>
      <div className={'viewer-stage '+(zoom?'is-zoomed':'')} onClick={e=>e.stopPropagation()}><img key={zoom?item.src:item.detail} src={zoom?item.src:item.detail} decoding="async" alt={item.title} onClick={()=>setZoom(v=>!v)}/></div>
      <div className="viewer-bottom" onClick={e=>e.stopPropagation()}><button disabled={groups[current.group].images.length===1} onClick={()=>move(-1)}>← 上一张</button><span>点击图片切换尺寸 · ← → 切图 · Esc 关闭</span><button disabled={groups[current.group].images.length===1} onClick={()=>move(1)}>下一张 →</button></div>
    </div>}
  </>;
}

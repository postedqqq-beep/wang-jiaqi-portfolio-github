// Lightweight gallery-specific adaptation of the supplied React Bits effects.
import React,{useEffect,useRef} from 'react';
import './MagicBento.css';
export default function MagicBento({items=[],columns=2,gap=28,radius=12,glowColor='#b98647',enableBorderGlow=true,enableSpotlight=true,spotlightRadius=340,className='',style={}}){
  const root=useRef(null);
  useEffect(()=>{
    const el=root.current;
    const query=matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    if(!query.matches)return;
    let frame=0,point=null;
    const cards=[...el.querySelectorAll('.magic-bento__card')];
    const reset=()=>{cards.forEach(card=>{card.style.setProperty('--mb-hot',0);card.style.setProperty('--mb-near',0)});point=null;cancelAnimationFrame(frame);frame=0};
    const paint=()=>{
      frame=0;if(!point||document.hidden)return;
      for(const card of cards){
        const rect=card.getBoundingClientRect();
        if(rect.bottom<0||rect.top>innerHeight)continue;
        const x=point.x-rect.left,y=point.y-rect.top;
        const near=x>-170&&y>-170&&x<rect.width+170&&y<rect.height+170;
        card.style.setProperty('--mb-x',x+'px');card.style.setProperty('--mb-y',y+'px');
        card.style.setProperty('--mb-near',near?1:0);
        card.style.setProperty('--mb-hot',x>=0&&y>=0&&x<=rect.width&&y<=rect.height?1:0);
      }
    };
    const move=e=>{if(e.pointerType==='touch')return;point={x:e.clientX,y:e.clientY};if(!frame)frame=requestAnimationFrame(paint)};
    el.addEventListener('pointermove',move,{passive:true});el.addEventListener('pointerleave',reset);
    document.addEventListener('visibilitychange',reset);
    return()=>{reset();el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',reset);document.removeEventListener('visibilitychange',reset)};
  },[items.length]);
  return <div ref={root} className={'magic-bento '+className} style={{'--mb-glow-rgb':[1,3,5].map(i=>parseInt(glowColor.slice(i,i+2),16)).join(','),'--mb-spot-size':spotlightRadius+'px','--mb-radius':radius+'px',gridTemplateColumns:`repeat(${columns},minmax(0,1fr))`,gap,...style}}>
    {items.map(item=><div key={item.id} className="magic-bento__cell"><button className="magic-bento__card" aria-label={item.title} onClick={e=>{
      const card=e.currentTarget;
      if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
        const rect=card.getBoundingClientRect();card.style.setProperty('--wave-x',(e.detail?e.clientX-rect.left:rect.width/2)+'px');card.style.setProperty('--wave-y',(e.detail?e.clientY-rect.top:rect.height/2)+'px');
        const wave=card.querySelector('.magic-bento__wave');wave?.animate([{transform:'translate(-50%,-50%) scale(0)',opacity:.5},{transform:'translate(-50%,-50%) scale(1)',opacity:0}],{duration:900,easing:'cubic-bezier(.2,.7,.3,1)'});
      }
      item.onClick?.(e);
    }}>
      <div className="magic-bento__content">{item.content}</div>
      {enableSpotlight&&<span className="magic-bento__light" aria-hidden="true"/>}
      <span className="magic-bento__rim" aria-hidden="true"/>
      {enableBorderGlow&&<span className="magic-bento__border" aria-hidden="true"/>}
      <span className="magic-bento__wave" aria-hidden="true"/>
    </button></div>)}
  </div>;
}

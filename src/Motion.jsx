import React, {useLayoutEffect,useRef} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import './motion.css';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ignoreMobileResize:true});
let refreshFrame=0;
const scheduleRefresh=()=>{
  if(refreshFrame)return;
  refreshFrame=requestAnimationFrame(()=>{refreshFrame=0;ScrollTrigger.refresh()});
};

// Drawings animate independently so filtering can rebuild their triggers safely.
export function useDrawingMotion(filter){
  useLayoutEffect(()=>{
    const media=gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)',()=>{
      const cells=gsap.utils.toArray('.drawing-bento .magic-bento__cell');
      gsap.set(cells,{y:90,clipPath:'inset(16% 0% 0% 0%)',autoAlpha:0});
      const batches=ScrollTrigger.batch(cells,{
        start:'top 94%',once:true,batchMax:2,interval:.15,
        onEnter:batch=>gsap.to(batch,{y:0,clipPath:'inset(0% 0% 0% 0%)',autoAlpha:1,duration:1.5,stagger:.22,ease:'power3.out',clearProps:'transform,clipPath,visibility,opacity'}),
      });
      // A focused or directly clicked drawing must always remain accessible.
      const focus=e=>{const cell=e.target.closest('.magic-bento__cell');if(cell)gsap.to(cell,{y:0,autoAlpha:1,clipPath:'inset(0%)',duration:.2,overwrite:true,clearProps:'transform,clipPath,visibility,opacity'})};
      document.addEventListener('focusin',focus);
      scheduleRefresh();
      return()=>{batches.forEach(t=>t.kill());document.removeEventListener('focusin',focus)};
    });
    return()=>media.revert();
  },[filter]);
}

export default function Motion(){
  const opening=useRef(null);const timeline=useRef(null);
  useLayoutEffect(()=>{
    const media=gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)',()=>{
      const context=gsap.context(()=>{
        const startAtHome=!location.hash||location.hash==='#home';
        if(startAtHome){
          window.scrollTo({top:0,behavior:'instant'});
          const finish=()=>document.documentElement.classList.remove('is-opening');
          document.documentElement.classList.add('is-opening');
          const tl=gsap.timeline({defaults:{ease:'power4.inOut'},onComplete:finish});
          timeline.current=tl;
          gsap.set(opening.current,{display:'flex',autoAlpha:1});
          tl.fromTo('.opening-word span',{yPercent:115,scaleX:.72},{yPercent:0,scaleX:1,duration:1.2,stagger:.09,ease:'power4.out'},0)
            .fromTo('.opening-meta',{y:20,autoAlpha:0},{y:0,autoAlpha:1,duration:.8},.4)
            .fromTo('.opening-rule i',{scaleX:0},{scaleX:1,duration:1.7},.2)
            .to('.opening-word span',{yPercent:-115,scaleX:1.08,duration:.85,stagger:.06},1.5)
            .to('.opening-meta,.opening-rule,.opening-skip',{autoAlpha:0,duration:.5},1.7)
            .to(opening.current,{yPercent:-100,duration:1.4,ease:'power4.inOut',onComplete:()=>{gsap.set(opening.current,{display:'none'});finish()}},2)
            .fromTo('.hero-background',{scale:1.2},{scale:1,duration:2.4,ease:'power3.out'},2.1)
            .fromTo('.hero-title-line>span',{yPercent:125,scaleY:1.4,rotation:3,transformOrigin:'0% 100%'},{yPercent:0,scaleY:1,rotation:0,duration:1.8,stagger:.2,ease:'power4.out',clearProps:'transform,willChange'},2.65)
            .fromTo('.hero .eyebrow',{y:35,autoAlpha:0},{y:0,autoAlpha:1,duration:1.1},2.65)
            .fromTo('.hero-copy>p,.hero-copy>.button,.hero-tags',{y:50,autoAlpha:0},{y:0,autoAlpha:1,duration:1.3,stagger:.16,ease:'power3.out'},3.05)
            .fromTo('.site-header>.logo,.site-header nav a,.site-header>.contact-pill',{y:-30,autoAlpha:0},{y:0,autoAlpha:1,duration:1,stagger:.09,ease:'power3.out'},2.8)
            .fromTo('.hero-bottom',{y:22,autoAlpha:0},{y:0,autoAlpha:1,duration:1},3.6);
        }

        gsap.utils.toArray('main>.section').forEach(section=>{
          const word=section.querySelector('.motion-heading span');
          const label=section.querySelector('.section-label');
          const heading=section.querySelector('h2');
          const tl=gsap.timeline({scrollTrigger:{trigger:section,start:'top 82%',once:true},defaults:{ease:'power4.out'}});
          tl.fromTo(word,{xPercent:-24,yPercent:115,scaleX:.7,transformOrigin:'0% 100%'},{xPercent:0,yPercent:0,scaleX:1,duration:1.8},0)
            .fromTo(label,{y:35,autoAlpha:0},{y:0,autoAlpha:1,duration:1.1},.28)
            .fromTo(heading,{y:75,clipPath:'inset(100% 0% 0% 0%)'},{y:0,clipPath:'inset(0%)',duration:1.5},.5);
          if(section.id==='about'){
            tl.fromTo('.life-photo',{clipPath:'inset(100% 0% 0% 0%)',y:90,rotation:-5},{clipPath:'inset(0%)',y:0,rotation:-1,duration:1.65},.65)
              .fromTo('.profile-photo',{y:100,rotation:12,autoAlpha:0},{y:0,rotation:4,autoAlpha:1,duration:1.5},1.05)
              .fromTo('.about-copy>p,.timeline>div,.about-copy>.text-link,.stats>div,.photo-note',{y:40,autoAlpha:0},{y:0,autoAlpha:1,duration:1.1,stagger:.12},.85);
          }else if(section.id==='skills'){
            tl.fromTo('.skill-card',{y:110,rotation:3,clipPath:'inset(15% 0% 0% 0%)',autoAlpha:0},{y:0,rotation:0,clipPath:'inset(0%)',autoAlpha:1,duration:1.5,stagger:.2,clearProps:'transform,clipPath'},.9)
              .fromTo('.tool-line>*',{y:25,autoAlpha:0},{y:0,autoAlpha:1,duration:1,stagger:.1},1.6);
          }else if(section.id==='contact'){
            tl.fromTo('.availability,.contact-main>p,.contact-actions,.phone',{y:65,autoAlpha:0},{y:0,autoAlpha:1,duration:1.4,stagger:.18},.85)
              .fromTo('.contact h2>a',{rotation:-60,scale:.6},{rotation:0,scale:1,duration:1.8},.8);
          }else{
            tl.fromTo('.project-toolbar,.projects .section-heading>p',{y:45,autoAlpha:0},{y:0,autoAlpha:1,duration:1.25,stagger:.15},.8);
          }
        });
        gsap.utils.toArray('.work-heading').forEach(heading=>{
          gsap.fromTo(heading.children,{y:65,clipPath:'inset(100% 0% 0% 0%)'},{y:0,clipPath:'inset(0%)',duration:1.4,stagger:.18,ease:'power4.out',scrollTrigger:{trigger:heading,start:'top 90%',once:true}});
        });
        // Small scrubbed movement only on photographic imagery, never on CAD sheets.
        if(matchMedia('(min-width: 1000px) and (pointer: fine)').matches&&!navigator.connection?.saveData){
          gsap.fromTo('.life-photo-crop img',{yPercent:-3},{yPercent:3,ease:'none',scrollTrigger:{trigger:'.photo-composition',start:'top bottom',end:'bottom top',scrub:1.5}});
        }
        scheduleRefresh();
      });
      return()=>{context.revert();document.documentElement.classList.remove('is-opening');timeline.current=null};
    });
    const anchorFrame=requestAnimationFrame(()=>{
      scheduleRefresh();
      const target=location.hash&&document.getElementById(location.hash.slice(1));
      if(target&&location.hash!=='#home')window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY-110,behavior:'instant'});
      ScrollTrigger.update();
    });
    const refresh=()=>scheduleRefresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load',refresh);
    return()=>{cancelAnimationFrame(anchorFrame);window.removeEventListener('load',refresh);media.revert()};
  },[]);
  return <div ref={opening} className="opening" aria-label="作品集开场动画"><div className="opening-top"><span>WANG JIAQI</span><span>ENGINEERING / PORTFOLIO 2026</span></div><div className="opening-center"><div className="opening-word" aria-label="WJQ">{'WJQ'.split('').map(letter=><span key={letter}>{letter}</span>)}</div><div className="opening-meta">以工程为底色，让想法成形。</div></div><div className="opening-rule"><i/></div><button className="opening-skip" onClick={()=>timeline.current?.progress(1)}>跳过开场 ↗</button></div>;
}

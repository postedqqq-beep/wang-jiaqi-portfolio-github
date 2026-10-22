import React,{useRef,useState,useEffect} from 'react';
import {publicAsset} from './assets';

export default function VideoBackdrop(){
  const ref=useRef(null);const [needsPlay,setNeedsPlay]=useState(false);
  useEffect(()=>{
    const video=ref.current;let disposed=false,visible=false,loaded=false,userRequested=false,idle;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const limited=reduced||navigator.connection?.saveData;
    const load=()=>{
      if(loaded||disposed)return;loaded=true;
      video.src=publicAsset(matchMedia('(max-width: 700px)').matches?'/media/factory-mobile.mp4':'/media/factory-desktop.mp4');
      video.load();
    };
    const sync=async()=>{
      if(disposed)return;
      if(!visible||document.hidden||(!userRequested&&limited)){video.pause();return}
      if(!loaded)return;
      if(!video.paused)return;
      video.muted=true;
      try{await video.play();if(disposed||!visible||document.hidden)video.pause();if(!disposed)setNeedsPlay(false)}catch{if(!disposed&&visible&&!document.hidden)setNeedsPlay(true)}
    };
    const request=()=>{userRequested=true;load();sync()};
    const observer=new IntersectionObserver(entries=>{
      visible=entries[0].isIntersecting;
      if(visible&&!limited&&!loaded){
        if('requestIdleCallback' in window)idle=requestIdleCallback(()=>{if(visible&&!document.hidden){load();sync()}},{timeout:1200});
        else idle=setTimeout(()=>{if(visible&&!document.hidden){load();sync()}},300);
      }
      sync();
    },{threshold:.05});
    observer.observe(document.getElementById('home'));
    video.addEventListener('canplay',sync);video.addEventListener('requestbackgroundplay',request);
    document.addEventListener('visibilitychange',sync);window.addEventListener('pageshow',sync);
    if(limited)setNeedsPlay(true);
    return()=>{
      disposed=true;observer.disconnect();
      if('cancelIdleCallback' in window)cancelIdleCallback(idle);else clearTimeout(idle);
      video.removeEventListener('canplay',sync);video.removeEventListener('requestbackgroundplay',request);
      document.removeEventListener('visibilitychange',sync);window.removeEventListener('pageshow',sync);
      video.pause();video.removeAttribute('src');video.load();
    };
  },[]);
  return <><video ref={ref} muted loop playsInline preload="none" poster={publicAsset('/media/factory-poster.webp')} className="hero-video" aria-hidden="true"/>{needsPlay&&<button className="background-play" onClick={()=>ref.current?.dispatchEvent(new Event('requestbackgroundplay'))}>播放背景视频 ▷</button>}</>;
}

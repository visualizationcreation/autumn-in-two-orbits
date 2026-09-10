'use strict';
const filmAudio=document.querySelector('#film-audio'),filmLanguage=document.querySelector('#film-language');
let filmLang='en',filmPoint=null;
function setFilm(lang,keepPoint=false){
 const old=window.AUTUMN_FILMS[filmLang];
 const oldScene=old.scenes.find(s=>s.start<=filmAudio.currentTime&&filmAudio.currentTime<s.end);
 filmAudio.pause();filmLang=lang;filmPoint=null;
 const f=window.AUTUMN_FILMS[lang];filmAudio.src=f.audio;
 const target=keepPoint&&oldScene?f.scenes.find(s=>s.pointId===oldScene.pointId):null;
 if(target)filmAudio.currentTime=target.start;
 document.querySelector('#film-transcript').href=f.transcript;
 document.querySelector('#film-transcript').textContent=lang==='es'?'Transcripción de esta película':'Matching film transcript';
 document.querySelector('#film-start').textContent=lang==='es'?'Escuchar desde el inicio':'Start listening';
 document.querySelector('#film-watch').textContent=lang==='es'?'Ver la película ↗':'Watch the film ↗';
 const caption=document.querySelector('#film-caption');caption.lang=lang;
 caption.textContent=lang==='es'?'Voz de Dora, generada localmente. La espiral sigue la grabación.':'Locally generated Bella voice. The spiral follows the recording.';
}
filmLanguage.onchange=()=>setFilm(filmLanguage.value,true);
document.querySelector('#film-start').onclick=async()=>{filmAudio.currentTime=0;filmPoint=null;show('keats');try{await filmAudio.play();}catch{document.querySelector('#film-caption').textContent='Use the audio controls to start playback.';}};
filmAudio.addEventListener('play',()=>{music.pause();cancelAnimationFrame(fadeFrame);});
filmAudio.addEventListener('timeupdate',()=>{
 const f=window.AUTUMN_FILMS[filmLang],t=filmAudio.currentTime;
 const scene=f.scenes.find(s=>s.start<=t&&t<s.end);
 if(scene&&scene.pointId!==filmPoint){filmPoint=scene.pointId;show(filmPoint);}
 const cue=f.cues.find(c=>c.start<=t&&t<c.end);
 document.querySelector('#film-caption').textContent=cue?cue.text:(filmLang==='es'?'Una pausa entre las hojas.':'A pause among the leaves.');
});
filmAudio.addEventListener('ended',()=>{document.querySelector('#film-caption').textContent=filmLang==='es'?'El recorrido ha terminado. Quédate entre los poemas el tiempo que quieras.':'The journey has come to rest. Stay with the poems as long as you like.';});
filmAudio.addEventListener('error',()=>{document.querySelector('#film-caption').textContent=filmLang==='es'?'No se pudo cargar el audio. Vuelve a intentarlo.':'The recording could not load. Please try again.';});
document.querySelector('#film-watch').onclick=()=>{
 const f=window.AUTUMN_FILMS[filmLang];filmAudio.pause();music.pause();cancelAnimationFrame(fadeFrame);
 if(!f.youtubeId)return;
 modal(`<p class="kicker">ORB FEEL & EXPERIENCE · ${filmLang==='es'?'ESPAÑOL':'ENGLISH'}</p><h2>${esc(f.title)}</h2><iframe class="film-video" src="https://www.youtube-nocookie.com/embed/${f.youtubeId}" title="${esc(f.title)}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe><p><a href="https://youtu.be/${f.youtubeId}" target="_blank" rel="noopener">${filmLang==='es'?'Abrir en YouTube':'Open on YouTube'} ↗</a> · <a href="film-credits.md">${filmLang==='es'?'Créditos':'Full credits'}</a></p>`);
};
document.querySelector('#modal').addEventListener('close',()=>{const frame=document.querySelector('.film-video');if(frame)frame.remove();});
filmLanguage.value=new URLSearchParams(location.search).get('lang')==='es'?'es':'en';
setFilm(filmLanguage.value);

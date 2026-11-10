(() => {
 const seen=new Set();
 const typeOf=u=>{const p=new URL(u).pathname.toLowerCase();if(p.endsWith('.m3u8'))return 'HLS';if(p.endsWith('.mpd'))return 'DASH';if(p.endsWith('.mp4'))return 'MP4';if(p.endsWith('.webm'))return 'WEBM';return null};
 const add=(url)=>{try{const kind=typeOf(url);if(!kind||seen.has(url))return;seen.add(url);chrome.runtime.sendMessage({type:'AXIUM_MEDIA_FOUND',media:{url,kind,page:location.href,title:document.title}})}catch{}};
 const scan=()=>document.querySelectorAll('video,audio,source').forEach(el=>{const src=el.currentSrc||el.src;if(src)add(src)});
 scan();new MutationObserver(scan).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
 const original=window.fetch;window.fetch=function(...args){const value=args[0] instanceof Request?args[0].url:String(args[0]);if(/\\.(m3u8|mpd|mp4|webm)(\\?|$)/i.test(value))add(value);return original.apply(this,args)};
 const open=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(method,url,...rest){if(typeof url==='string'&&/\\.(m3u8|mpd|mp4|webm)(\\?|$)/i.test(url))add(url);return open.call(this,method,url,...rest)};
})();

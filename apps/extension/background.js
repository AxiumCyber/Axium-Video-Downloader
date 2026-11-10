const mediaPattern = /\.(m3u8|mpd|mp4|webm)(?:$|[?#])/i;
chrome.webRequest.onBeforeRequest.addListener((details) => {
  if (!mediaPattern.test(details.url)) return;
  chrome.storage.local.get({media:[]}, data => {
    const media=data.media||[];
    if(media.some(x=>x.url===details.url)) return;
    let kind=(details.url.match(/\.(m3u8|mpd|mp4|webm)(?:$|[?#])/i)||[])[1]?.toUpperCase();
    if(kind==='M3U8') kind='HLS';
    if(kind==='MPD') kind='DASH';
    media.unshift({url:details.url,kind,page:details.initiator||details.documentUrl||'',title:'Detected media request',foundAt:Date.now()});
    chrome.storage.local.set({media:media.slice(0,100)});
  });
},{urls:["http://*/*","https://*/*"]});
chrome.runtime.onMessage.addListener((message,sender)=>{
  if(message?.type!=='AXIUM_MEDIA_FOUND')return;
  chrome.storage.local.get({media:[]},data=>{
    const media=data.media||[];
    if(!media.some(x=>x.url===message.media.url)){
      media.unshift({...message.media,tabId:sender.tab?.id,foundAt:Date.now()});
      chrome.storage.local.set({media:media.slice(0,100)});
    }
  });
});

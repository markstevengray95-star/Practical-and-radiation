(() => {
  'use strict';
  for(const src of ['lesson-native-accordion.js?v=native-sync-1','textbook-chapters-v2.js?v=full-textbook-2']){
    const script=document.createElement('script');
    script.src=src;
    script.async=false;
    document.head.appendChild(script);
  }
})();

import{d as e,o as t,c as n,a as s,w as o,u as l,F as a,b as c,p as i,e as u,R as d,f as r,g as f,h as p,i as m,j as g,k as h,l as _,m as b,n as y,T as w,q as S,r as v,s as I,t as C,v as B,x,y as j,z as R,A as k}from"./syncfusion-B1FAl2WQ.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const n of e)if("childList"===n.type)for(const e of n.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?t.credentials="include":"anonymous"===e.crossOrigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();const A=(e,t)=>{const n=e.__vccOpts||e;for(const[s,o]of t)n[s]=o;return n},M=A(e({__name:"App",setup(e){const B=c("TabInstance");i("ribbon",[I,C]);const x={visible:!0,menuItems:[{text:"New",iconCss:"e-icons e-file-new",id:"new"}]},j={iconCss:"e-icons e-line",content:"Line"},R={iconCss:"e-icons e-perimeter",content:"Polyline"},k={iconCss:"e-icons e-circle",content:"Circle"},A={iconCss:"e-icons e-radius",content:"Arc"},M={iconCss:"e-icons e-frame-5",content:"Rectangle"},N={iconCss:"e-icons e-triangle",content:"Ellipse"},O={iconCss:"e-icons e-table",content:"Region"};t((()=>{const e=B.value.ej2Instances;e.animation.previous.effect="None",e.animation.next.effect="None"}));const P=e=>{if(e.isInteracted){e.selectedIndex===B.value.ej2Instances.items.length-1&&z()}},W=e=>{const t=e.removedIndex,n=B.value.ej2Instances,s=n.items.length;t===s-2&&n.select(s-3)};let L=1;const z=()=>{const e=B.value.ej2Instances,t=customElements.get("hello-world");if(t){const n=new t({});n.style.position="absolute",n.style.width="100%",n.style.height="100%";const s="drawing"+L.toString();L+=1;const o={header:{text:s},content:n},l=document.querySelectorAll("#tab .e-toolbar-item").length-1;e.addTab([o],l),e.select(l)}},D={iconCss:"e-icons e-add-notes",content:"New Drawing",clicked:z},E={text:"平面图"},H={text:"立面图"},T={text:"详图"},q={iconCss:"e-plus"};return(e,t)=>(u(),n(a,null,[s(l(y),{class:"header",fileMenu:x},{default:o((()=>[s(l(d),null,{default:o((()=>[s(l(r),{header:"Home"},{default:o((()=>[s(l(f),null,{default:o((()=>[s(l(p),{header:"Draw"},{default:o((()=>[s(l(m),null,{default:o((()=>[s(l(g),null,{default:o((()=>[s(l(h),null,{default:o((()=>[s(l(_),{type:"Button",buttonSettings:j,allowedSizes:l(b).Large},null,8,["allowedSizes"])])),_:1})])),_:1}),s(l(g),null,{default:o((()=>[s(l(h),null,{default:o((()=>[s(l(_),{type:"Button",buttonSettings:R})])),_:1})])),_:1}),s(l(g),null,{default:o((()=>[s(l(h),null,{default:o((()=>[s(l(_),{type:"Button",buttonSettings:k})])),_:1})])),_:1}),s(l(g),null,{default:o((()=>[s(l(h),null,{default:o((()=>[s(l(_),{type:"Button",buttonSettings:A})])),_:1})])),_:1}),s(l(g),null,{default:o((()=>[s(l(h),null,{default:o((()=>[s(l(_),{type:"Button",buttonSettings:M}),s(l(_),{type:"Button",buttonSettings:N}),s(l(_),{type:"Button",buttonSettings:O})])),_:1})])),_:1})])),_:1})])),_:1}),s(l(p),{header:"Modify"},{default:o((()=>[s(l(m),null,{default:o((()=>[s(l(g),null,{default:o((()=>[s(l(h),null,{default:o((()=>[s(l(_),{type:"Button",buttonSettings:D,allowedSizes:l(b).Large},null,8,["allowedSizes"])])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})])),_:1}),s(l(v),{class:"content",id:"tab",ref_key:"TabInstance",ref:B,heightAdjustMode:"Fill",overflowMode:"Popup",headerPlacement:"Bottom",cssClass:"e-fill",selected:P,removing:W,showCloseButton:!0},{default:o((()=>[s(l(w),null,{default:o((()=>[s(l(S),{header:E,content:"肥西核电站平面图"}),s(l(S),{header:H,content:"肥西核电站立面图"}),s(l(S),{header:T,content:"肥西核电站详图"}),s(l(S),{header:q,cssClass:"withoutIcon"})])),_:1})])),_:1},512)],64))}}),[["__scopeId","data-v-65486545"]]),N=A(e({__name:"HelloWorld.ce",setup:e=>(e,t)=>(u(),n(a,null,[t[0]||(t[0]=B("p",null," 这个网页被嵌入到shadow dom中。 ",-1)),t[1]||(t[1]=B("p",null,[x(" 了解shadow dom应用案例： "),B("a",{href:"https://jelly.jd.com/article/615020c42685d0019947426c",target:"_blank"},"视觉走查插件开发之深入Shadow DOM"),x(". ")],-1)),t[2]||(t[2]=B("p",null,[x(" shadow dom官方技术文档： "),B("a",{href:"https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM",target:"_blank"},"Using shadow DOM"),x(". ")],-1))],64))}),[["styles",["p[data-v-ef2aa977]{color:#000}"]],["__scopeId","data-v-ef2aa977"]]);N.inheritAttrs=!1;const O=k(N,{shadowRoot:!0});customElements.define("hello-world",O),j("Ngo9BigBOggjHTQxAR8/V1NCaF1cWWhIfkx/WmFZfVpgdVRMY15bQHdPIiBoS35RckVqWH5ec3RRQ2RYWEB1"),R(M).mount("#app");

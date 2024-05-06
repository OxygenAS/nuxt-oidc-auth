import{n as y,o as a,c as p,q as N,s as v,w as r,u as h,v as Y,x as se,y as u,z as $,a as l,A as le,B as ae,C as M,D as q,F as E,E as Q,t as O,r as w,g as W,m as ie,b as _,d,G as P,H as ce,p as re,e as de,_ as z,I as ue,J as K,K as pe,L as fe,M as _e,N as me}from"./DQUGz8n8.js";import{_ as Z}from"./DgzobuQz.js";const X=y({__name:"NIcon",props:{icon:{}},setup(s){return(e,t)=>(a(),p("div",{class:N(["n-icon",e.icon])},null,2))}}),ve=y({__name:"NButton",props:{to:{},icon:{},border:{type:Boolean,default:!0},disabled:{type:Boolean},type:{default:"button"}},setup(s){return(e,t)=>{const i=X;return a(),v(se(e.to?u(Z):"button"),Y({to:e.to},{...e.$attrs,...!e.to&&{type:e.type},...e.disabled?{disabled:!0}:{tabindex:0}},{class:[[{"n-button-base active:n-button-active focus-visible:n-focus-base hover:n-button-hover":e.border},{"n-icon-button":!e.$slots.default}],"n-button n-transition n-disabled:n-disabled"]}),{default:r(()=>[h(e.$slots,"icon",{},()=>[e.icon?(a(),v(i,{key:0,icon:e.icon,class:N({"n-button-icon":e.$slots.default})},null,8,["icon","class"])):$("",!0)]),h(e.$slots,"default")]),_:3},16,["to","class"])}}}),he={class:"n-tip n-tip-base"},j=y({__name:"NTip",props:{icon:{}},setup(s){return(e,t)=>{const i=X;return a(),p("div",he,[h(e.$slots,"icon",{},()=>[e.icon?(a(),v(i,{key:0,icon:e.icon,class:"n-tip-icon"},null,8,["icon"])):$("",!0)]),l("div",null,[h(e.$slots,"default")])])}}});let B;const R=[];function ee(s){if(R.push(s),!(typeof window>"u"))return window.__NUXT_DEVTOOLS__&&R.forEach(e=>e(window.__NUXT_DEVTOOLS__)),Object.defineProperty(window,"__NUXT_DEVTOOLS__",{set(e){e&&R.forEach(t=>t(e))},get(){return B.value},configurable:!0}),()=>{R.splice(R.indexOf(s),1)}}function ge(){B||(B=le(),ee(e));function s(){ae(B)}function e(t){B.value=t,t.host&&t.host.hooks.hook("host:update:reactivity",s)}return B}const be=ge(),ye=["innerHTML"],Se={class:"shiki"},ke=["textContent"],$e=l("br",null,null,-1),F=y({__name:"NCodeBlock",props:{code:{},lang:{},lines:{type:Boolean,default:!0},transformRendered:{}},emits:["loaded"],setup(s,{emit:e}){const t=s,i=e,o=M(()=>{var c;const n=t.lang==="text"?{code:t.code,supported:!1}:((c=be.value)==null?void 0:c.devtools.renderCodeHighlight(t.code,t.lang))||{code:t.code,supported:!1};return n.supported&&t.transformRendered&&(n.code=t.transformRendered(n.code)),n.supported&&q(()=>i("loaded")),n});return(n,c)=>n.lang&&o.value.supported?(a(),p("pre",{key:0,class:N(["n-code-block",n.lines?"n-code-block-lines":""]),innerHTML:o.value.code},null,10,ye)):(a(),p("pre",{key:1,class:N(["n-code-block",n.lines?"n-code-block-lines":""])},[l("pre",Se,[l("code",null,[(a(!0),p(E,null,Q(n.code.split(`
`),(f,b)=>(a(),p(E,{key:b},[l("span",{class:"line",textContent:O(f)},null,8,ke),$e],64))),128))])])],2))}}),Ne={flex:"~ gap-3","items-center":""},Ce=y({__name:"NIconTitle",props:{icon:{},text:{}},setup(s){return(e,t)=>(a(),p("div",Ne,[e.icon?(a(),p("div",{key:0,class:N(e.icon)},null,2)):$("",!0),h(e.$slots,"default",{},()=>[l("div",null,O(e.text),1)])]))}});typeof WorkerGlobalScope<"u"&&globalThis instanceof WorkerGlobalScope;const we=s=>typeof s<"u";function Te(s){return JSON.parse(JSON.stringify(s))}function G(s,e,t,i={}){var o,n,c;const{clone:f=!1,passive:b=!1,eventName:S,deep:T=!1,defaultValue:C,shouldEmit:m}=i,g=ie(),I=t||(g==null?void 0:g.emit)||((o=g==null?void 0:g.$emit)==null?void 0:o.bind(g))||((c=(n=g==null?void 0:g.proxy)==null?void 0:n.$emit)==null?void 0:c.bind(g==null?void 0:g.proxy));let x=S;e||(e="modelValue"),x=x||`update:${e.toString()}`;const U=k=>f?typeof f=="function"?f(k):Te(k):k,L=()=>we(s[e])?U(s[e]):C,A=k=>{m?m(k)&&I(x,k):I(x,k)};if(b){const k=L(),D=w(k);let V=!1;return W(()=>s[e],J=>{V||(V=!0,D.value=U(J),q(()=>V=!1))}),W(D,J=>{!V&&(J!==s[e]||T)&&A(J)},{deep:T}),D}else return M({get(){return L()},set(k){A(k)}})}const oe=s=>(re("data-v-0add3c1d"),s=s(),de(),s),Oe=["open"],Ve={"text-base":""},Ie={key:0,"text-sm":"",op50:""},xe=oe(()=>l("div",{class:"flex-auto"},null,-1)),Be=oe(()=>l("div",{class:"x-divider"},null,-1)),De=y({__name:"NSectionBlock",props:{icon:{},text:{},description:{},containerClass:{default:""},headerClass:{},collapse:{type:Boolean,default:!0},open:{type:Boolean,default:!0},padding:{type:[Boolean,String],default:!0}},setup(s){const t=G(s,"open",void 0,{passive:!0});function i(o){t.value=o.target.open}return(o,n)=>{const c=X,f=Ce;return a(),p(E,null,[l("details",{open:u(t),onToggle:i},[l("summary",{class:N(["cursor-pointer select-none hover:bg-active p4",o.collapse?"":"pointer-events-none"])},[_(f,{icon:o.icon,text:o.text,"text-xl":"",transition:"",class:N([u(t)?"op100":"op60",o.headerClass])},{default:r(()=>[l("div",null,[l("div",Ve,[h(o.$slots,"text",{},()=>[d(O(o.text),1)],!0)]),o.description||o.$slots.description?(a(),p("div",Ie,[h(o.$slots,"description",{},()=>[d(O(o.description),1)],!0)])):$("",!0)]),xe,h(o.$slots,"actions",{},void 0,!0),o.collapse?(a(),v(c,{key:0,icon:"carbon-chevron-down",class:"chevron","cursor-pointer":"","place-self-start":"","text-base":"",op75:"",transition:"","duration-500":""})):$("",!0)]),_:3},8,["icon","text","class"])],2),n._lazyshow1||u(t)?(n._lazyshow1=!0,a(),p(E,null,[P(l("div",{class:N(["flex flex-col flex-gap2 pb6 pt2",typeof o.padding=="string"?o.padding:o.padding?"px4":""])},[h(o.$slots,"details",{},void 0,!0),l("div",{class:N([o.containerClass,"mt1"])},[h(o.$slots,"default",{},void 0,!0)],2),h(o.$slots,"footer",{},void 0,!0)],2),[[ce,u(t)]])],64)):$("v-show-if",!0)],40,Oe),Be],64)}}}),H=z(De,[["__scopeId","data-v-0add3c1d"]]),Re=y({__name:"AuthState",props:{oidcState:{}},setup(s){return(e,t)=>{const i=F,o=j,n=H;return a(),v(n,{icon:"carbon-prompt-session",text:"Auth state",description:"Current nuxt-oidc-auth session",padding:!1,open:!1},{default:r(()=>[Object.keys(e.oidcState).length>0?(a(),v(i,{key:0,class:"overflow-x-scroll",lang:"JSON",code:JSON.stringify(e.oidcState,null,"	")},null,8,["code"])):(a(),v(o,{key:1,n:"yellow6 dark:yellow5",icon:"carbon:warning"},{default:r(()=>[d(" Not authenticated ")]),_:1}))]),_:1})}}}),Ee=["disabled"],Me={key:0,value:"",disabled:"",hidden:""},Ue=y({__name:"NSelect",props:{modelValue:{default:void 0},placeholder:{default:""},icon:{default:""},disabled:{type:Boolean,default:!1}},setup(s,{emit:e}){const o=G(s,"modelValue",e,{passive:!0});return(n,c)=>{const f=X;return a(),p("div",{class:N(["n-select flex flex items-center border rounded px-2 py-1 focus-within:n-focus-base focus-within:border-context n-bg-base",n.disabled?"border-gray:10":"n-border-base"])},[h(n.$slots,"icon",{},()=>[n.icon?(a(),v(f,{key:0,icon:n.icon,class:"mr-0.4em text-1.1em op50"},null,8,["icon"])):$("",!0)]),P(l("select",{"onUpdate:modelValue":c[0]||(c[0]=b=>K(o)?o.value=b:null),disabled:n.disabled,class:N(["w-full flex-auto n-bg-base !outline-none",n.disabled?"appearance-none":""])},[n.placeholder?(a(),p("option",Me,O(n.placeholder),1)):$("",!0),h(n.$slots,"default")],10,Ee),[[ue,u(o)]])],2)}}}),Le=["checked","disabled"],Ae=["disabled","name","value"],Je=l("span",{class:"n-radio-box n-checked:n-radio-box-checked peer-active:n-active-base peer-focus-visible:n-focus-base n-transition"},[l("div",{class:"n-radio-inner n-checked:n-radio-inner-checked n-transition"})],-1),Ke=y({__name:"NRadio",props:{modelValue:{default:""},disabled:{type:Boolean,default:!1},name:{},value:{}},setup(s,{emit:e}){const o=G(s,"modelValue",e,{passive:!0});return(n,c)=>(a(),p("label",{class:"n-radio inline-flex hover:n-radio-hover select-none items-center n-disabled:n-disabled",checked:u(o)===n.value||null,disabled:n.disabled||null},[P(l("input",{"onUpdate:modelValue":c[0]||(c[0]=f=>K(o)?o.value=f:null),type:"radio",class:"peer absolute op0",disabled:n.disabled,name:n.name,value:n.value,onKeypress:c[1]||(c[1]=fe(f=>o.value=n.value,["enter"]))},null,40,Ae),[[pe,u(o)]]),Je,l("span",null,[h(n.$slots,"default")])],8,Le))}}),Xe={class:"flex w-full justify-start gap-3"},je=["value"],Fe={class:"flex items-center gap-3"},He=y({__name:"ProviderConfigs",props:_e({oidcConfig:{},oidcRuntimeConfig:{}},{modelValue:{type:String,default:""},modelModifiers:{}}),emits:["update:modelValue"],setup(s){const e=s,t=me(s,"modelValue"),i=w("runtime"),o=M(()=>i.value==="runtime"?JSON.stringify(e.oidcRuntimeConfig.providers[t.value],null,"	"):JSON.stringify(e.oidcConfig.providers[t.value],null,"	"));return(n,c)=>{const f=Ue,b=Ke,S=F,T=H;return a(),v(T,{icon:"carbon-document-multiple-01",text:"Provider configs",description:"Currently configured authentication providers",padding:!1,open:!1},{default:r(()=>[l("div",Xe,[_(f,{modelValue:t.value,"onUpdate:modelValue":c[0]||(c[0]=C=>t.value=C),n:"lime6 dark:lime5",placeholder:"Select a provider"},{default:r(()=>[(a(!0),p(E,null,Q(n.oidcConfig.providers,(C,m)=>(a(),p("option",{key:m,value:m},O(m.charAt(0).toUpperCase()+m.slice(1)),9,je))),128))]),_:1},8,["modelValue"]),l("form",Fe,[_(b,{modelValue:u(i),"onUpdate:modelValue":c[1]||(c[1]=C=>K(i)?i.value=C:null),n:"green6 dark:green5",name:"runtime",value:"runtime"},{default:r(()=>[d(" Runtime config ")]),_:1},8,["modelValue"]),_(b,{modelValue:u(i),"onUpdate:modelValue":c[2]||(c[2]=C=>K(i)?i.value=C:null),n:"green6 dark:green5",name:"server",value:"server"},{default:r(()=>[d(" Server config ")]),_:1},8,["modelValue"])])]),t.value?(a(),v(S,{key:0,class:"overflow-x-auto",lang:"JSON",code:u(o)},null,8,["code"])):$("",!0)]),_:1})}}}),Pe={},ze={class:"n-badge"};function Ge(s,e){return a(),p("span",ze,[h(s.$slots,"default")])}const ne=z(Pe,[["render",Ge]]),We={key:0,"i-carbon:arrow-up-right":"","translate-y--1":"","text-xs":"",op50:""},te=y({__name:"NLink",props:{to:{},href:{},target:{},underline:{type:Boolean}},setup(s){const e=s,t=M(()=>e.href||e.to);return(i,o)=>{const n=Z;return a(),v(n,Y(t.value?{href:t.value,target:i.target,rel:i.target==="_blank"?"noopener noreferrer":null}:{},{class:{"n-link n-transition hover:n-link-hover n-link-base":t.value||i.underline}}),{default:r(()=>[h(i.$slots,"default"),t.value&&i.target==="_blank"?(a(),p("div",We)):$("",!0)]),_:3},16,["class"])}}}),Ye={class:"space-y-4"},qe={class:"font-mono op-50"},Qe={class:"font-mono op-50"},Ze={class:"font-mono op-50"},eo=y({__name:"Secrets",props:{oidcSecrets:{}},setup(s){return(e,t)=>{const i=ne,o=F,n=j,c=te,f=H;return a(),v(f,{icon:"carbon-password",text:"Secrets",description:"Current encryption secrets",padding:!1,open:!1},{default:r(()=>[l("div",Ye,[l("p",null,[_(i,{title:"tokenKey",n:"green",class:"mr-2"},{default:r(()=>[d(" NUXT_OIDC_TOKEN_KEY ")]),_:1}),l("code",qe,O(e.oidcSecrets.tokenKey||"Not set via. environment, please check your console output for the current value"),1)]),l("p",null,[_(i,{title:"sessionSecret",n:"green",class:"mr-2"},{default:r(()=>[d(" NUXT_OIDC_SESSION_SECRET ")]),_:1}),l("code",Qe,O(e.oidcSecrets.sessionSecret||"Not set via. environment, please check your console output for the current value"),1)]),l("p",null,[_(i,{title:"authSessionSecret",n:"green",class:"mr-2"},{default:r(()=>[d(" NUXT_OIDC_AUTH_SESSION_SECRET ")]),_:1}),l("code",Ze,O(e.oidcSecrets.authSessionSecret||"Not set via. environment, please check your console output for the current value"),1)]),!e.oidcSecrets.tokenKey||!e.oidcSecrets.sessionSecret||!e.oidcSecrets.authSessionSecret?(a(),v(n,{key:0,n:"yellow6 dark:yellow5",icon:"carbon:warning"},{default:r(()=>[d(" If you don't define your secrets, Nuxt OIDC Auth will auto provide them in development, they will change on each server restart. Check your console for the following output: "),_(o,{class:"mt-4",code:`[nuxt-oidc-auth]: NUXT_OIDC_TOKEN_KEY=
[nuxt-oidc-auth]: NUXT_OIDC_SESSION_SECRET=
[nuxt-oidc-auth]: NUXT_OIDC_AUTH_SESSION_SECRET=`,lines:!1})]),_:1})):$("",!0),l("p",null,[d(" For more information check the "),_(c,{n:"green",href:"https://nuxt.com/modules/nuxt-oidc-auth#_3-set-secrets",target:"_blank"},{default:r(()=>[d(" docs for setting secrets ")]),_:1})])])]),_:1})}}}),oo={class:"space-y-4"},no=y({__name:"DevMode",props:{oidcRuntimeConfig:{}},setup(s){return(e,t)=>{const i=j,o=ne,n=F,c=te,f=H;return a(),v(f,{icon:"carbon-code",text:"DevMode",description:"Dev Mode Insights",padding:!1,open:!1},{default:r(()=>{var b,S,T;return[l("div",oo,[(S=(b=e.oidcRuntimeConfig)==null?void 0:b.devMode)!=null&&S.enabled?(a(),v(i,{key:0,n:"lime6 dark:lime5",icon:"carbon:checkmark-outline"},{default:r(()=>[d(" DevMode enabled! ")]),_:1})):(a(),v(i,{key:1,n:"yellow6 dark:yellow5",icon:"carbon:warning",class:"mb-4"},{default:r(()=>[d(" Dev Mode is not enabled. To enabled it, set "),_(o,{title:"devMode"},{default:r(()=>[d(" devMode ")]),_:1}),_(o,{title:"enabled"},{default:r(()=>[d(" enabled ")]),_:1}),d(" to true. ")]),_:1})),_(o,{title:"sessionSecret",class:"text-base"},{default:r(()=>[d(" Current config: ")]),_:1}),(T=e.oidcRuntimeConfig)!=null&&T.devMode&&Object.keys(e.oidcRuntimeConfig.devMode).length>0?(a(),v(n,{key:2,class:"overflow-x-scroll",lang:"JSON",code:JSON.stringify(e.oidcRuntimeConfig.devMode,null,"	")},null,8,["code"])):$("",!0),l("p",null,[d(" For more information check the "),_(c,{n:"green",href:"https://nuxt.com/modules/nuxt-oidc-auth#dev-mode",target:"_blank"},{default:r(()=>[d(" docs for dev mode ")]),_:1})])])]}),_:1})}}}),to={},so={class:"n-loading n-panel-grids-center"},lo={class:"flex flex-col animate-pulse items-center text-lg"},ao=l("div",{class:"i-carbon-circle-dash animate-spin text-4xl op50"},null,-1);function io(s,e){return a(),p("div",so,[l("div",lo,[ao,h(s.$slots,"default",{},()=>[d(" Loading... ")])])])}const co=z(to,[["render",io]]),ro={class:"relative w-full flex flex-col h-screen"},uo={class:"flex px-10 justify-start w-full flex-gap-2 top-0 fixed n-navbar-glass"},po=l("div",{class:"mt-4"},[l("h1",{class:"text-3xl font-bold"}," Nuxt OIDC Auth "),l("p",{class:"opacity-50 mb-4"}," Nuxt DevTools Integration ")],-1),fo=l("span",{class:"i-carbon-login"},null,-1),_o=l("span",{class:"i-carbon-logout"},null,-1),mo=l("span",{class:"i-carbon-reset"},null,-1),vo={key:2,class:"mt-16"},bo=y({__name:"index",setup(s){const e=w(null),t=w(localStorage.getItem("__nuxt_dev_token__")),i=w(),o=w(),n=w(""),c=w({}),f=M(()=>{var m;return(m=e.value.host)==null?void 0:m.app}),b=w({}),S=w(!1);ee(async m=>{e.value=m,S.value=await e.value.devtools.rpc.verifyAuthToken(t.value),i.value=S.value?(await e.value.devtools.rpc.getServerRuntimeConfig()).oidc:{},o.value=S.value?(await e.value.devtools.rpc.getServerConfig()).oidc:{},c.value=e.value.host.nuxt.payload.state["$snuxt-oidc-auth-session"]||{},b.value=S.value?await e.value.devtools.extendClientRpc("nuxt-oidc-auth-rpc").getNuxtOidcAuthSecrets():{}});async function T(m){f.value.navigate(`/auth${m?"/"+m:""}/login`,!0)}async function C(m){f.value.navigate(`/auth${m?"/"+m:""}/logout`,!0)}return(m,g)=>{const I=ve,x=j,U=Re,L=He,A=eo,k=no,D=co;return a(),p("div",ro,[l("div",uo,[po,_(I,{n:"green",class:"ml-auto self-start mt-4",onClick:g[0]||(g[0]=V=>T(u(n)))},{default:r(()=>[fo,d(" Login ")]),_:1}),_(I,{class:"self-start mt-4",n:"green",onClick:g[1]||(g[1]=V=>C(u(n)))},{default:r(()=>[_o,d(" Logout ")]),_:1}),_(I,{class:"self-start mt-4",n:"green",onClick:g[2]||(g[2]=V=>u(e).host.devtools.reload())},{default:r(()=>[mo,d(" Refresh ")]),_:1})]),u(S)?$("",!0):(a(),v(x,{key:0,class:"relative mt-24",n:"orange5",icon:"i-carbon-locked","justify-center":""},{default:r(()=>[d(" Current DevTools session is not authorized, some features may be disabled. ")]),_:1})),u(o)?(a(),p("div",{key:1,class:N(["flex flex-col gap-2 p-10 pt-6",{"mt-16":u(S)}])},[_(U,{"oidc-state":u(c)},null,8,["oidc-state"]),_(L,{"oidc-runtime-config":u(i),"oidc-config":u(o)},null,8,["oidc-runtime-config","oidc-config"]),_(A,{"oidc-secrets":u(b)},null,8,["oidc-secrets"]),_(k,{"oidc-runtime-config":u(i)},null,8,["oidc-runtime-config"])],2)):(a(),p("div",vo,[_(D)]))])}}});export{bo as default};

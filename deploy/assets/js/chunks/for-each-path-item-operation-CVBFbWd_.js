/*!
*    _____ _________    __    ___    ____
*   / ___// ____/   |  / /   /   |  / __ \
*   \__ \/ /   / /| | / /   / /| | / /_/ /
*  ___/ / /___/ ___ |/ /___/ ___ |/ _, _/
* /____/\____/_/  |_/_____/_/  |_/_/ |_|
*
* @scalar/api-reference 1.76.4
*
* Website: https://scalar.com
* GitHub:  https://github.com/scalar/scalar
* License: https://github.com/scalar/scalar/blob/main/LICENSE
**/
import{_n as e,vn as t}from"./slugify-DyhRZBof.js";import{n}from"./is-object-CC8q19k-.js";var r=[`delete`,`get`,`head`,`options`,`patch`,`post`,`put`,`query`,`trace`],i=Object.freeze(new Set(r)),a=e=>e&&typeof e==`string`?i.has(e.toLowerCase()):!1,o=/* @__PURE__ */ new Set([`__proto__`,`prototype`,`constructor`]),s=(e,t)=>{if(o.has(e)){let n=t?`Prototype pollution key detected: "${e}" in ${t}`:`Prototype pollution key detected: "${e}"`;throw Error(n)}},c=e=>o.has(e);function l(e){return e.replace(/~/g,`~0`).replace(/\//g,`~1`)}var u=10,d=e=>e===e.toLowerCase()&&a(e),f=e=>n(e)&&Object.hasOwn(e,`$ref-value`),p=n=>{if(!n||typeof n!=`object`)return;let r=e(n,t);for(let n=1;f(r);n++){if(n>=u){let{"$ref-value":e,...t}=r;return console.warn(`Stopped resolving "${r.$ref}" after ${u} hops.\n\nThis reference most likely points at itself, directly or through another reference.`),t}r=e(r,t)}return r},m=(e,t)=>{let n=p(e);if(!n)return;if(d(t))return n[t];let r=n.additionalOperations;return r&&Object.hasOwn(r,t)?r[t]:void 0},h=(e,t,n)=>{if(!e||typeof e!=`object`)return;let r=`$ref`in e&&`$ref-value`in e?e[`$ref-value`]??e:e;d(t)?r[t]=n:(s(t),r.additionalOperations??={},r.additionalOperations[t]=n)},g=e=>{let t=[],r=e;for(;n(r)&&!t.includes(r)&&t.length<u&&(t.push(r),`$ref`in r&&`$ref-value`in r);)r=r[`$ref-value`];return t},_=(e,t)=>{if(e&&typeof e==`object`)for(let r of g(e))d(t)?delete r[t]:n(r.additionalOperations)&&(delete r.additionalOperations[t],Object.keys(r.additionalOperations).length===0&&delete r.additionalOperations)},v=(e,t)=>{let n=p(e);if(n){for(let[e,r]of Object.entries(n))d(e)&&r!==void 0&&t(e,r);for(let[e,r]of Object.entries(n.additionalOperations??{}))r!==void 0&&!d(e)&&t(e,r)}},y=e=>{let t=p(e);return!t||Object.keys(t).length===0},b=e=>d(e)?e:`additionalOperations/${l(e)}`;export{p as a,l as c,a as d,r as f,b as i,c as l,v as n,y as o,m as r,h as s,_ as t,s as u};
//# sourceMappingURL=for-each-path-item-operation-CVBFbWd_.js.map
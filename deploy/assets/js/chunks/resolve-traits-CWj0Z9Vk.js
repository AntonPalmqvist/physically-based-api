/*!
*    _____ _________    __    ___    ____
*   / ___// ____/   |  / /   /   |  / __ \
*   \__ \/ /   / /| | / /   / /| | / /_/ /
*  ___/ / /___/ ___ |/ /___/ ___ |/ _, _/
* /____/\____/_/  |_/_____/_/  |_/_/ |_|
*
* @scalar/api-reference 1.77.0
*
* Website: https://scalar.com
* GitHub:  https://github.com/scalar/scalar
* License: https://github.com/scalar/scalar/blob/main/LICENSE
**/
import{i as e}from"./slugify-R6-F2PAY.js";import{t}from"./is-object-CwJyL5yg.js";var n=e=>{let n=/* @__PURE__ */ new Set,r=e;for(;t(r)&&typeof r.$ref==`string`;){if(n.has(r))return;n.add(r),r=r[`$ref-value`]}return r},r=t=>t.split(`/`).slice(1).map(e),i=/* @__PURE__ */ new Set([`properties`,`patternProperties`,`$defs`,`definitions`,`dependentSchemas`]),a=/* @__PURE__ */ new Set([`example`,`examples`,`default`,`enum`,`const`,`value`,`dataValue`]),o=(e,t)=>e===`data`?`data`:e===`map`?`object`:t===`channel`?`reference`:a.has(t)||t.startsWith(`x-`)?`data`:i.has(t)?`map`:`object`,s=(e,r,i=`object`,a=/* @__PURE__ */ new WeakMap)=>{if(i===`reference`)return r;let c=i===`object`&&t(r)&&typeof r.$ref==`string`?n(r):r;if(!t(c))return c;if(a.has(c))return a.get(c);let l=i===`object`&&t(e)&&typeof e.$ref==`string`?n(e):e,u=t(l)?{...l}:{};a.set(c,u);for(let[e,t]of Object.entries(c))if(t===null)delete u[e];else if(t!==void 0){let n=o(i,e);Object.defineProperty(u,e,{value:s(Object.hasOwn(u,e)?u[e]:void 0,t,n,a),enumerable:!0,configurable:!0,writable:!0})}return a.delete(c),u},c=(e,t)=>{if(t.length===0)return e;let r=t.reduce((e,t)=>{let r=n(t);return r?s(e,r):e},{}),i=s(r,Object.fromEntries(Object.entries(e).filter(([e])=>Object.hasOwn(r,e))));return{...Object.fromEntries(Object.entries(e).filter(([e])=>!Object.hasOwn(r,e))),...i}};export{r as n,n as r,c as t};
//# sourceMappingURL=resolve-traits-CWj0Z9Vk.js.map
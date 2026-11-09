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
import{t as e}from"./is-object-CC8q19k-.js";var t=t=>{let n=/* @__PURE__ */ new Set,r=t;for(;e(r)&&typeof r.$ref==`string`;){if(n.has(r))return;n.add(r),r=r[`$ref-value`]}return r},n=/* @__PURE__ */ new Set([`properties`,`patternProperties`,`$defs`,`definitions`,`dependentSchemas`]),r=/* @__PURE__ */ new Set([`example`,`examples`,`default`,`enum`,`const`,`value`,`dataValue`]),i=(e,t)=>e===`data`?`data`:e===`map`?`object`:t===`channel`?`reference`:r.has(t)||t.startsWith(`x-`)?`data`:n.has(t)?`map`:`object`,a=(n,r,o=`object`,s=/* @__PURE__ */ new WeakMap)=>{if(o===`reference`)return r;let c=o===`object`&&e(r)&&typeof r.$ref==`string`?t(r):r;if(!e(c))return c;if(s.has(c))return s.get(c);let l=o===`object`&&e(n)&&typeof n.$ref==`string`?t(n):n,u=e(l)?{...l}:{};s.set(c,u);for(let[e,t]of Object.entries(c))if(t===null)delete u[e];else if(t!==void 0){let n=i(o,e);Object.defineProperty(u,e,{value:a(Object.hasOwn(u,e)?u[e]:void 0,t,n,s),enumerable:!0,configurable:!0,writable:!0})}return s.delete(c),u},o=(e,n)=>{if(n.length===0)return e;let r=n.reduce((e,n)=>{let r=t(n);return r?a(e,r):e},{}),i=a(r,Object.fromEntries(Object.entries(e).filter(([e])=>Object.hasOwn(r,e))));return{...Object.fromEntries(Object.entries(e).filter(([e])=>!Object.hasOwn(r,e))),...i}};export{t as n,o as t};
//# sourceMappingURL=resolve-traits-Cc13wj-Y.js.map
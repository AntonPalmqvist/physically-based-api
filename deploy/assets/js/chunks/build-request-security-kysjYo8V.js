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
import{xn as e}from"./slugify-R6-F2PAY.js";import{A as t}from"./useLoadingState-Cnzlkr6b.js";import{Yt as n,jt as r}from"./workspace-events-B8Kt3yaC.js";var i=({server:e,path:i,urlParams:a})=>{let o=r(e);return t(n(e?.url??``,o),i,a)},a=(t,n=``)=>{let r=[];return t.forEach(t=>{if(t.type===`apiKey`){let e=t[`x-scalar-secret-token`]||n;if(t.in===`header`)return r.push({in:t.in,name:t.name,value:e});if(t.in===`query`)return r.push({in:`query`,name:t.name,value:e});if(t.in===`cookie`)return r.push({in:`cookie`,name:t.name,value:e})}if(t.type===`http`){if(t.scheme===`basic`){let e=t[`x-scalar-secret-username`]||``,n=t[`x-scalar-secret-password`]||``;return e===``&&n===``?null:r.push({in:`header`,name:`Authorization`,value:`${e}:${n}`,format:`basic`})}let e=t[`x-scalar-secret-token`];return r.push({in:`header`,name:`Authorization`,value:e||n,format:`bearer`})}if(t.type===`oauth2`||t.type===`openIdConnect`){let i=Object.values(t?.flows??{}).filter(e).find(e=>e[`x-scalar-secret-token`])?.[`x-scalar-secret-token`]??``;return r.push({in:`header`,name:`Authorization`,value:i||n,format:`bearer`})}return null}),r};export{i as n,a as t};
//# sourceMappingURL=build-request-security-kysjYo8V.js.map
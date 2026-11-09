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
import{t as e}from"./slugify-DyhRZBof.js";var t=(t={})=>{let n=/* @__PURE__ */ new Map;return{slug(r){let i=e(r,t),a=n.get(i);if(a===void 0)return n.set(i,0),i;let o=a+1;return n.set(i,o),`${i}-${o}`},reset(){n.clear()}}};export{t};
//# sourceMappingURL=slugger-DcEUfGDS.js.map
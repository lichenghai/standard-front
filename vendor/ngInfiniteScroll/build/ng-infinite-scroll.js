var mod;mod=angular.module("infinite-scroll",[]),mod.value("THROTTLE_MILLISECONDS",null),mod.directive("infiniteScroll",["$rootScope","$window","$interval","THROTTLE_MILLISECONDS",function(n,e,t,i){return{scope:{infiniteScroll:"&",infiniteScrollContainer:"=",infiniteScrollDistance:"=",infiniteScrollDisabled:"=",infiniteScrollUseDocumentBottom:"="},link:function(l,o,r){var c,u,a,f,m,d,s,S,g,p,w,D,$,h,v,T,E;return E=angular.element(e),$=null,h=null,u=null,a=null,p=!0,T=!1,g=function(n){return n=n[0]||n,isNaN(n.offsetHeight)?n.document.documentElement.clientHeight:n.offsetHeight},w=function(n){if(n[0].getBoundingClientRect&&!n.css("none"))return n[0].getBoundingClientRect().top+D(n)},D=function(n){return n=n[0]||n,isNaN(window.pageYOffset)?n.document.documentElement.scrollTop:n.ownerDocument.defaultView.pageYOffset},S=function(){var e,t,i,r,c;return a===E?(e=g(a)+D(a[0].document.documentElement),i=w(o)+g(o)):(e=g(a),t=0,void 0!==w(a)&&(t=w(a)),i=w(o)-t+g(o)),T&&(i=g((o[0].ownerDocument||o[0].document).documentElement)),r=i-e,c=r<=g(a)*$+1,c?(u=!0,h?l.$$phase||n.$$phase?l.infiniteScroll():l.$apply(l.infiniteScroll):void 0):u=!1},v=function(n,e){var i,l,o;return o=null,l=0,i=function(){var e;return l=(new Date).getTime(),t.cancel(o),o=null,n.call(),e=null},function(){var r,c;return r=(new Date).getTime(),c=e-(r-l),c<=0?(clearTimeout(o),t.cancel(o),o=null,l=r,n.call()):o?void 0:o=t(i,c,1)}},null!=i&&(S=v(S,i)),l.$on("$destroy",function(){return a.unbind("scroll",S)}),d=function(n){return $=parseFloat(n)||0},l.$watch("infiniteScrollDistance",d),d(l.infiniteScrollDistance),m=function(n){if(h=!n,h&&u)return u=!1,S()},l.$watch("infiniteScrollDisabled",m),m(l.infiniteScrollDisabled),s=function(n){return T=n},l.$watch("infiniteScrollUseDocumentBottom",s),s(l.infiniteScrollUseDocumentBottom),c=function(n){if(null!=a&&a.unbind("scroll",S),a=n,null!=n)return a.bind("scroll",S)},c(E),f=function(n){if(null!=n&&0!==n.length){if(n instanceof HTMLElement?n=angular.element(n):"function"==typeof n.append?n=angular.element(n[n.length-1]):"string"==typeof n&&(n=angular.element(document.querySelector(n))),null!=n)return c(n);throw new Exception("invalid infinite-scroll-container attribute.")}},l.$watch("infiniteScrollContainer",f),f(l.infiniteScrollContainer||[]),null!=r.infiniteScrollParent&&c(angular.element(o.parent())),null!=r.infiniteScrollImmediateCheck&&(p=l.$eval(r.infiniteScrollImmediateCheck)),t(function(){if(p)return S()},0,1)}}}]);
"use strict";!function(t){var e,a,r=t();t.fn.sortable=function(i){var s=String(i);return i=t.extend({connectWith:!1,placeholder:null,dragImage:null},i),this.each(function(){var n,d=t(this).children(i.items),o=i.handle?d.find(i.handle):d;if("reload"===s&&t(this).children(i.items).off("dragstart.h5s dragend.h5s selectstart.h5s dragover.h5s dragenter.h5s drop.h5s"),/^enable|disable|destroy$/.test(s)){var h=t(this).children(t(this).data("items")).attr("draggable","enable"===s);return void("destroy"===s&&(t(this).off("sortupdate"),t(this).removeData("opts"),h.add(this).removeData("connectWith items").off("dragstart.h5s dragend.h5s dragover.h5s dragenter.h5s drop.h5s").off("sortupdate"),o.off("selectstart.h5s")))}var l=t(this).data("opts");"undefined"==typeof l?t(this).data("opts",i):i=l;var g,c,f=null===i.placeholder?t("<"+(/^ul|ol$/i.test(this.tagName)?"li":"div")+' class="sortable-placeholder"/>'):t(i.placeholder).addClass("sortable-placeholder");t(this).data("items",i.items),r=r.add(f),i.connectWith&&t(i.connectWith).add(this).data("connectWith",i.connectWith),d.attr("role","option"),d.attr("aria-grabbed","false"),o.attr("draggable","true").not("a[href], img").on("selectstart.h5s",function(){return this.dragDrop&&this.dragDrop(),!1}).end(),d.on("dragstart.h5s",function(r){var s=r.originalEvent.dataTransfer;s.effectAllowed="move",s.setData("text",""),i.dragImage&&s.setDragImage&&s.setDragImage(i.dragImage,0,0),n=(e=t(this)).addClass("sortable-dragging").attr("aria-grabbed","true").index(),a=e.outerHeight(),g=t(this).parent(),e.parent().triggerHandler("sortstart",{item:e,startparent:g})}).on("dragend.h5s",function(){e&&(e.removeClass("sortable-dragging").attr("aria-grabbed","false").show(),r.detach(),c=t(this).parent(),n===e.index()&&g.get(0)===c.get(0)||e.parent().triggerHandler("sortupdate",{item:e,oldindex:n,startparent:g,endparent:c}),e=null,a=null)}).add([this,f]).on("dragover.h5s dragenter.h5s drop.h5s",function(s){if(!d.is(e)&&i.connectWith!==t(e).parent().data("connectWith"))return!0;if("drop"===s.type)return s.stopPropagation(),r.filter(":visible").after(e),e.trigger("dragend.h5s"),!1;if(s.preventDefault(),s.originalEvent.dataTransfer.dropEffect="move",d.is(this)){var n=t(this).outerHeight();if(i.forcePlaceholderSize&&f.height(a),n>a){var o=n-a,h=t(this).offset().top;if(f.index()<t(this).index()&&s.originalEvent.pageY<h+o)return!1;if(f.index()>t(this).index()&&s.originalEvent.pageY>h+n-o)return!1}e.hide(),t(this)[f.index()<t(this).index()?"after":"before"](f),r.not(f).detach()}else r.is(this)||t(this).children(i.items).length||(r.detach(),t(this).append(f));return!1})})}}(jQuery);
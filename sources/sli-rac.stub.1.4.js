window.sliAutocomplete.extend({stubInit:function(){if(window.sli&&window.sli.global){if(window.sli.global.base){this.opts.base=window.sli.global.base}}if(!this.opts.target){this.opts.target=["sli_search_1"]}this.select.init(this.opts);this.input.init(this.opts,this.select)},select:{parent:undefined,visible:false,urls:[],opts:{defaults:{width:430},"offset-x":0,"offset-y":0,onsubmit:function(){},maxSearchLen:100},selector:"",selected:null,focus:false,currentSelected:-1,value:undefined,valueStop:"",stopQuery:false,dropdown:undefined,init:function(opts){var obj=this;
var dropdown=document.createElement("ul");dropdown.id="sli_autocomplete";dropdown.className=!!opts.mobile?"rich mobile":"rich";document.body.appendChild(dropdown);obj.dropdown=jQuery(dropdown);obj.dropdown.css("z-index",30000);obj.dropdown.css("display","none");if(opts["offset-x"]){obj.opts["offset-x"]=opts["offset-x"]}if(opts["offset-y"]){obj.opts["offset-y"]=opts["offset-y"]}if(opts.width){obj.opts.width=opts.width}if(opts.onsubmit){obj.opts.onsubmit=opts.onsubmit}if(opts.maxSearchLen){obj.opts.maxSearchLen=opts.maxSearchLen
}obj.parent=jQuery("#"+opts.target[0]);obj.dropdown.click(function(){setTimeout(obj.selectCurrent.slibind(obj),50)})},position:function(){var parent=this.parent;var dropdown=this.dropdown;var parentHeight=parent.outerHeight();var offset=parent.offset();var left=offset.left+this.opts["offset-x"];var top=offset.top+parentHeight+this.opts["offset-y"];dropdown.css("left",left+"px");dropdown.css("top",top+"px");var width=this.opts.defaults.width;var resizeFunction=function(){dropdown.css("width",width+"px")};if(this.opts.width){if(this.opts.width>width){width=this.opts.width
}else{if(this.opts.width=="mobile"){resizeFunction=function(){dropdown.css("width",parent.outerWidth(false)-2+"px")};jQuery(window).bind("orientationchange",function(e){setTimeout(function(){resizeFunction()},350)})}else{if(this.opts.width=="parent"){var parentWidth=parent.outerWidth();if(parentWidth>width){width=parentWidth}}}}}resizeFunction()},moveSelect:function(step){var obj=this;var items=obj.dropdown.find(obj.selector);var length=items.length;if(obj.currentSelected>=0){jQuery(items[obj.currentSelected]).removeClass("sli_ac_active")
}obj.currentSelected+=step;if(obj.currentSelected<0){obj.currentSelected=-1}if(obj.currentSelected>=length){obj.currentSelected=length-1}if(obj.currentSelected>=0&&obj.currentSelected<length){jQuery(items[obj.currentSelected]).addClass("sli_ac_active")}},next:function(){this.moveSelect(1)},prev:function(){this.moveSelect(-1)},pageDown:function(){this.moveSelect(10)},pageUp:function(){this.moveSelect(-10)},show:function(){this.dropdown.show();this.visible=true;this.parent.addClass("dropdown")},hide:function(){this.dropdown.hide();
this.visible=false;this.parent.removeClass("dropdown")},selectCurrent:function(){if(this.currentSelected<0){return false}var param={url:this.urls[this.currentSelected]+"&asug="+this.parent.val(),query:this.parent.val()};if(this.opts.onsubmit(param)!==false){document.location=param.url+(param.url.match(/[#?]/)?"&":"?")+"apelog=yes";this.hide()}return true},mouseOver:function(obj){var select=this;var items=select.dropdown.find(select.selector);var length=items.length;var moIndex;items.each(function(index,element){if(element==obj){moIndex=index
}});if(moIndex==select.currentSelected){return}if(select.currentSelected>=0){jQuery(items[select.currentSelected]).removeClass("sli_ac_active")}select.currentSelected=moIndex;if(select.currentSelected<0){select.currentSelected=-1}if(select.currentSelected>=length){select.currentSelected=0}if(select.currentSelected>=0&&select.currentSelected<length){jQuery(items[select.currentSelected]).addClass("sli_ac_active")}},addData:function(url,html,content){var obj=this;if(!obj.focus){return}obj.urls=url;obj.selector=content;
var values=obj.value.split(/\s+/);html=this.highlightTerm(html,values);obj.dropdown.html(html);obj.dropdown.find(obj.selector).mouseover(function(){obj.mouseOver(this)});obj.currentSelected=-1;obj.show();if(obj.urls.length<1){obj.hide();obj.valueStop=obj.value;obj.stopQuery=true}else{obj.valueStop="";obj.stopQuery=false}},highlightTerm:function(html,values){var regs=[];var len=values.length,term;var chars="*\\?+{}^$():=!.";var escape_re_expr="";for(var i=0;i<chars.length;i++){escape_re_expr+="\\"+chars.substr(i,1)
}var escape_re=new RegExp("(["+escape_re_expr+"])","gi");for(var v=0;v<len;v++){term=values[v].replace(escape_re,"\\$1");var reg=new RegExp("(>|\\s)("+term+")(?=[^>]*<(?!/h2))","gi");regs.push(reg)}for(r in regs){html=html.replace(regs[r],"$1<b>$2</b>")}return html},doRequest:function(val){var noResultVal=this.valueStop;if(val.length>this.opts.maxSearchLen){return false}if(val==this.value){if(this.urls.length>0){this.show()}return false}if(this.stopQuery){if(val.length>noResultVal.length&&val.substr(0,noResultVal.length)==noResultVal){return false
}}return true}},input:{lastKeyPressCode:undefined,lastValue:"",hasFocus:undefined,timeout:null,ajax:null,select:undefined,opts:{delay:200,base:"",target:[],params:"/search?ts=rac&w="},KEY:{UP:38,DOWN:40,DEL:46,TAB:9,RETURN:13,ESC:27,PAGEUP:33,PAGEDOWN:34,BACKSPACE:8},init:function(opts,select){var obj=this;obj.select=select;if(opts.delay){obj.opts.delay=opts.delay}if(opts.params){obj.opts.params=opts.params}if(opts.mobile){obj.opts.mobile=opts.mobile;obj.opts.params=obj.opts.params.replace(/([?&]ts=[^&]*)/,"$1mobile")
}if(opts.base){obj.opts.base=opts.base.replace(/\/+$/,"")+obj.opts.params}if(opts.target){obj.opts.target=opts.target}var input=jQuery("#"+opts.target[0]);input.keydown(obj.keyDown.slibind(obj)).keyup(obj.keyUp.slibind(obj)).blur(function(){setTimeout(obj.onBlur.slibind(obj),obj.opts.delay+50)}).focus(function(){if(!!obj.opts.mobile){if(!!obj.select.urls.length&&!!obj.select.parent.val().length){obj.select.show()}!!obj.select.dropdown&&obj.select.dropdown.find("li").removeClass("sli_ac_active");var offset=jQuery(this).offset();
var offsetCallback=function(i){return function(){window.scrollTo(i.left,i.top-5)}};window.setTimeout(offsetCallback(offset),10)}obj.select.focus=true;obj.select.position()});obj.select.position()},onChange:function(){var input=jQuery("#"+this.opts.target[0]);var value=input[0].value;value=value.replace(/^\s\s*/,"").replace(/\s\s*$/,"");if(!this.select.doRequest(value)){return}if(this.ajax!=null){this.ajax.abort()}this.select.value=value;if(value.length==0){this.select.hide()}else{value=encodeURIComponent(value);
this.ajax=jQuery.ajax({url:this.opts.base+value,dataType:"script",cache:true})}},onBlur:function(){this.select.focus=false;this.select.hide()},keyDown:function(event){this.hasFocus=1;this.lastKeyPressCode=event.keyCode;switch(event.keyCode){case this.KEY.UP:event.preventDefault();if(this.select.visible){this.select.prev()}else{this.onChange()}break;case this.KEY.DOWN:event.preventDefault();if(this.select.visible){this.select.next()}else{this.onChange()}break;case this.KEY.PAGEUP:event.preventDefault();if(this.select.visible){this.select.pageUp()
}else{this.onChange()}break;case this.KEY.PAGEDOWN:event.preventDefault();if(this.select.visible){this.select.pageDown()}else{this.onChange()}break;case this.KEY.TAB:case this.KEY.RETURN:if(this.select.selectCurrent()){event.preventDefault();blockSubmit=true;return false}if(this.ajax!=null){this.ajax.abort()}if(this.timeout!=null){clearTimeout(this.timeout)}this.lastValue=jQuery("#"+this.opts.target[0]).val();this.select.hide();break;case this.KEY.ESC:this.select.hide();break;default:clearTimeout(this.timeout);
break}this.lastValue=jQuery("#"+this.opts.target[0]).val()},keyUp:function(event){var current="";switch(event.keyCode){case this.KEY.ESC:case this.KEY.TAB:case this.KEY.RETURN:this.select.hide();break;default:current=jQuery("#"+this.opts.target[0]).val();clearTimeout(this.timeout);if(current!=this.lastValue){this.timeout=setTimeout(this.onChange.slibind(this),this.opts.delay)}break}}},safeLog:function(message){try{console.log(message)}catch(e){}}});window.sliAutocomplete.stubInit();
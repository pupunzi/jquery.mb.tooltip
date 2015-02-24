/*
 * ******************************************************************************
 *  jquery.mb.components
 *  file: mbTooltip.js
 *
 *  Copyright (c) 2001-2014. Matteo Bicocchi (Pupunzi);
 *  Open lab srl, Firenze - Italy
 *  email: matteo@open-lab.com
 *  site: 	http://pupunzi.com
 *  blog:	http://pupunzi.open-lab.com
 * 	http://open-lab.com
 *
 *  Licences: MIT, GPL
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 *
 *  last modified: 07/01/14 22.50
 *  *****************************************************************************
 */

/*
 * mbTooltip jquery plug in
 * developed by Matteo Bicocchi on JQuery
 * © 2002-2009 Open Lab srl, Matteo Bicocchi
 * www.open-lab.com - info@open-lab.com
 * version 1.9
 * tested on: Explorer, FireFox and Chrome for PC
 *            FireFox and Safari for Mac Os X
 *            FireFox for Linux
 * MIT (MIT-LICENSE.txt) licenses.
 */

/*Browser detection patch*/
var nAgt=navigator.userAgent; if(!jQuery.browser){jQuery.browser={};jQuery.browser.mozilla=!1;jQuery.browser.webkit=!1;jQuery.browser.opera=!1;jQuery.browser.safari=!1;jQuery.browser.chrome=!1;jQuery.browser.msie=!1;jQuery.browser.ua=nAgt;jQuery.browser.name=navigator.appName;jQuery.browser.fullVersion=""+parseFloat(navigator.appVersion);jQuery.browser.majorVersion=parseInt(navigator.appVersion,10);var nameOffset,verOffset,ix;if(-1!=(verOffset=nAgt.indexOf("Opera")))jQuery.browser.opera=!0,jQuery.browser.name="Opera",jQuery.browser.fullVersion= nAgt.substring(verOffset+6),-1!=(verOffset=nAgt.indexOf("Version"))&&(jQuery.browser.fullVersion=nAgt.substring(verOffset+8));else if(-1!=(verOffset=nAgt.indexOf("OPR")))jQuery.browser.opera=!0,jQuery.browser.name="Opera",jQuery.browser.fullVersion=nAgt.substring(verOffset+4);else if(-1!=(verOffset=nAgt.indexOf("MSIE")))jQuery.browser.msie=!0,jQuery.browser.name="Microsoft Internet Explorer",jQuery.browser.fullVersion=nAgt.substring(verOffset+5);else if(-1!=nAgt.indexOf("Trident")){jQuery.browser.msie= !0;jQuery.browser.name="Microsoft Internet Explorer";var start=nAgt.indexOf("rv:")+3,end=start+4;jQuery.browser.fullVersion=nAgt.substring(start,end)}else-1!=(verOffset=nAgt.indexOf("Chrome"))?(jQuery.browser.webkit=!0,jQuery.browser.chrome=!0,jQuery.browser.name="Chrome",jQuery.browser.fullVersion=nAgt.substring(verOffset+7)):-1!=(verOffset=nAgt.indexOf("Safari"))?(jQuery.browser.webkit=!0,jQuery.browser.safari=!0,jQuery.browser.name="Safari",jQuery.browser.fullVersion=nAgt.substring(verOffset+7), -1!=(verOffset=nAgt.indexOf("Version"))&&(jQuery.browser.fullVersion=nAgt.substring(verOffset+8))):-1!=(verOffset=nAgt.indexOf("AppleWebkit"))?(jQuery.browser.webkit=!0,jQuery.browser.name="Safari",jQuery.browser.fullVersion=nAgt.substring(verOffset+7),-1!=(verOffset=nAgt.indexOf("Version"))&&(jQuery.browser.fullVersion=nAgt.substring(verOffset+8))):-1!=(verOffset=nAgt.indexOf("Firefox"))?(jQuery.browser.mozilla=!0,jQuery.browser.name="Firefox",jQuery.browser.fullVersion=nAgt.substring(verOffset+ 8)):(nameOffset=nAgt.lastIndexOf(" ")+1)<(verOffset=nAgt.lastIndexOf("/"))&&(jQuery.browser.name=nAgt.substring(nameOffset,verOffset),jQuery.browser.fullVersion=nAgt.substring(verOffset+1),jQuery.browser.name.toLowerCase()==jQuery.browser.name.toUpperCase()&&(jQuery.browser.name=navigator.appName));-1!=(ix=jQuery.browser.fullVersion.indexOf(";"))&&(jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0,ix));-1!=(ix=jQuery.browser.fullVersion.indexOf(" "))&&(jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0, ix));jQuery.browser.majorVersion=parseInt(""+jQuery.browser.fullVersion,10);isNaN(jQuery.browser.majorVersion)&&(jQuery.browser.fullVersion=""+parseFloat(navigator.appVersion),jQuery.browser.majorVersion=parseInt(navigator.appVersion,10));jQuery.browser.version=jQuery.browser.majorVersion}jQuery.browser.android=/Android/i.test(nAgt);jQuery.browser.blackberry=/BlackBerry|BB|PlayBook/i.test(nAgt);jQuery.browser.ios=/iPhone|iPad|iPod|webOS/i.test(nAgt);jQuery.browser.operaMobile=/Opera Mini/i.test(nAgt); jQuery.browser.windowsMobile=/IEMobile|Windows Phone/i.test(nAgt);jQuery.browser.kindle=/Kindle|Silk/i.test(nAgt);jQuery.browser.mobile=jQuery.browser.android||jQuery.browser.blackberry||jQuery.browser.ios||jQuery.browser.windowsMobile||jQuery.browser.operaMobile||jQuery.browser.kindle;


(function($){
	jQuery.fn.mbTooltip = function (options){
		return this.each (function () {
			this.options = {
				live:true,
				opacity : .9,
				wait:2000,
				timePerWord:10,
				cssClass:"default",
				hasArrow:true,
				imgPath:"images/",
				anchor:"mouse", //"parent",
				mb_fade:200
			};
			$.extend (this.options, options);
			var wait=this.options.wait;
			var fade=this.options.mb_fade;
			var myOptions=this.options;
			var hover=$.browser.msie?"mouseenter":"mouseover";

			$(document).on(hover,"*[title]",function(e){
				if($(this).attr("title").length){
					$(this).attr("tooltip", $(this).attr("title"));
					$(this).attr("title", "");
					$(this).attr("tooltipEnable","true");
				}
				var theEl=$(this);
				var ttCont= theEl.attr("tooltip");
				if (myOptions.anchor==="mouse")
					$(document).mb_getXY();
				$(this).one("mouseout",function(){
					$(this).stopTime();
					$(this).deleteTooltip(fade);
				}).one("click",function(){
					$(this).stopTime();
					$(this).deleteTooltip(fade);
				});

				$(this).oneTime(wait, function() {
					if ($(this).attr("tooltipEnable")=="true")
						$(this).buildTooltip(ttCont,myOptions,e);
				});
			});
		});
	};

	var mbX = 0;
	var mbY = 0;

	$.fn.extend({
		mb_getXY:function(){
			$(document).bind("mousemove", function(e) {
				mbX = e.pageX;
				mbY = e.pageY;
			});
			return {x:mbX,y:mbY};
		},
		buildTooltip: function(cont,options){
			this.options={};
			$.extend (this.options, options);
			var parent=$(this);
			$("body").append("<div id='tooltip'></div>");
			var imgUrl=this.options.imgPath+"up.png";
			$("#tooltip").html(cont);
			$("#tooltip").addClass(this.options.cssClass);
			if (this.options.hasArrow){
				$("#tooltip").prepend("<img id='ttimg' src='"+imgUrl+"'>");
				$("#ttimg").css({
					position:"absolute",
					opacity:.5
				});

				$("#ttimg").addClass("top");
			}
			$("#tooltip").css({
				position:"absolute",
				top:  this.options.anchor=="mouse"?$(document).mb_getXY().y +7:parent.offset().top+(parent.outerHeight()),
				left:this.options.anchor=="mouse"?$(document).mb_getXY().x+7:parent.offset().left,
				opacity:0
			});
			$("#tooltip").findBestPos(parent,this.options.imgPath,this.options.anchor);
			if (this.options.anchor=="mouse") $(document).unbind("mousemove");
			$("#tooltip").mb_BringToFront();
			$("#tooltip").fadeTo(this.options.mb_fade,this.options.opacity,function(){});
			var timetoshow=3000+ (cont.length*this.options.timePerWord);
			var fade=this.options.mb_fade;

			$(this).oneTime(timetoshow,function(){$(this).deleteTooltip(fade);});
		},
		deleteTooltip: function(fade){
			var sel="#tooltip";
			$(sel).fadeOut(fade,function(){$(sel).remove();});
		},
		findBestPos:function(parent,imgPath,anchor){
			var theEl=$(this);
			var ww= $(window).width()+$(window).scrollLeft();
			var wh= $(window).height()+$(window).scrollTop();
			var w=theEl.outerWidth();
			theEl.css({width:w});
			var t=((theEl.offset().top+theEl.outerHeight(true))>wh)? theEl.offset().top-(anchor!="mouse"? parent.outerHeight():0)-theEl.outerHeight()-20 : theEl.offset().top;
			t=t<0?0:t;
			var l=((theEl.offset().left+w)>ww-5) ? theEl.offset().left-(w-(anchor!="mouse"?parent.outerWidth():0)) : theEl.offset().left;
			l=l<0?0:l;
			if (theEl.offset().top+theEl.outerHeight(true)>wh){
				$("#ttimg").attr("src",imgPath+"bottom.png");
				$("#ttimg").removeClass("top").addClass("bottom");
			}
			theEl.css({width:w, top:t, left:l});
		},
		disableTooltip:function(){
			$(this).find("[tooltip]").attr("tooltipEnable","false");
		},
		enableTooltip:function(){
			$(this).find("[tooltip]").attr("tooltipEnable","true");
		}
	});

	jQuery.fn.mb_BringToFront= function(){
		var zi=10;
		$('*').each(function() {
			if($(this).css("position")=="absolute"){
				var cur = parseInt($(this).css('zIndex'));
				zi = cur > zi ? parseInt($(this).css('zIndex')) : zi;
			}
		});
		$(this).css('zIndex',zi+=100);
	};

	$(function(){
		//due to a problem of getter/setter for select
		$("select[title]").each(function(){
			var selectSpan=$("<span></span>");
			selectSpan.attr("title",$(this).attr("title"));
			$(this).wrapAll(selectSpan);
			$(this).removeAttr("title");
		});
	});

})(jQuery);


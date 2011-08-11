/*
 Copyright (c) 2010, Yahoo! Inc. All rights reserved.
 Code licensed under the BSD License:
 http://developer.yahoo.com/yui/license.html
 version: 3.3.0
 build: 3167
 */
YUI.add('resize-base',function(Y){var Lang=Y.Lang,isArray=Lang.isArray,isBoolean=Lang.isBoolean,isNumber=Lang.isNumber,isString=Lang.isString,YArray=Y.Array,trim=Lang.trim,indexOf=YArray.indexOf,COMMA=',',DOT='.',EMPTY_STR='',HANDLE_SUB='{handle}',SPACE=' ',ACTIVE='active',ACTIVE_HANDLE='activeHandle',ACTIVE_HANDLE_NODE='activeHandleNode',ALL='all',AUTO_HIDE='autoHide',BORDER='border',BOTTOM='bottom',CLASS_NAME='className',COLOR='color',DEF_MIN_HEIGHT='defMinHeight',DEF_MIN_WIDTH='defMinWidth',HANDLE='handle',HANDLES='handles',HIDDEN='hidden',INNER='inner',LEFT='left',MARGIN='margin',NODE='node',NODE_NAME='nodeName',NONE='none',OFFSET_HEIGHT='offsetHeight',OFFSET_WIDTH='offsetWidth',PADDING='padding',PARENT_NODE='parentNode',POSITION='position',RELATIVE='relative',RESIZE='resize',RESIZING='resizing',RIGHT='right',STATIC='static',STYLE='style',TOP='top',WIDTH='width',WRAP='wrap',WRAPPER='wrapper',WRAP_TYPES='wrapTypes',EV_MOUSE_UP='resize:mouseUp',EV_RESIZE='resize:resize',EV_RESIZE_ALIGN='resize:align',EV_RESIZE_END='resize:end',EV_RESIZE_START='resize:start',T='t',TR='tr',R='r',BR='br',B='b',BL='bl',L='l',TL='tl',concat=function(){return Array.prototype.slice.call(arguments).join(SPACE);},toRoundNumber=function(num){return Math.round(parseFloat(num))||0;},getCompStyle=function(node,val){return node.getComputedStyle(val);},handleAttrName=function(handle){return HANDLE+handle.toUpperCase();},isNode=function(v){return(v instanceof Y.Node);},toInitialCap=Y.cached(function(str){return str.substring(0,1).toUpperCase()+str.substring(1);}),capitalize=Y.cached(function(){var out=[],args=YArray(arguments,0,true);YArray.each(args,function(part,i){if(i>0){part=toInitialCap(part);}
out.push(part);});return out.join(EMPTY_STR);}),getCN=Y.ClassNameManager.getClassName,CSS_RESIZE=getCN(RESIZE),CSS_RESIZE_HANDLE=getCN(RESIZE,HANDLE),CSS_RESIZE_HANDLE_ACTIVE=getCN(RESIZE,HANDLE,ACTIVE),CSS_RESIZE_HANDLE_INNER=getCN(RESIZE,HANDLE,INNER),CSS_RESIZE_HANDLE_INNER_PLACEHOLDER=getCN(RESIZE,HANDLE,INNER,HANDLE_SUB),CSS_RESIZE_HANDLE_PLACEHOLDER=getCN(RESIZE,HANDLE,HANDLE_SUB),CSS_RESIZE_HIDDEN_HANDLES=getCN(RESIZE,HIDDEN,HANDLES),CSS_RESIZE_WRAPPER=getCN(RESIZE,WRAPPER);function Resize(){Resize.superclass.constructor.apply(this,arguments);}
Y.mix(Resize,{NAME:RESIZE,ATTRS:{activeHandle:{value:null,validator:function(v){return Y.Lang.isString(v)||Y.Lang.isNull(v);}},activeHandleNode:{value:null,validator:isNode},autoHide:{value:false,validator:isBoolean},defMinHeight:{value:15,validator:isNumber},defMinWidth:{value:15,validator:isNumber},handles:{setter:'_setHandles',value:ALL},node:{setter:Y.one},resizing:{value:false,validator:isBoolean},wrap:{setter:'_setWrap',value:false,validator:isBoolean},wrapTypes:{readOnly:true,value:/^canvas|textarea|input|select|button|img|iframe|table|embed$/i},wrapper:{readOnly:true,valueFn:'_valueWrapper',writeOnce:true}},RULES:{b:function(instance,dx,dy){var info=instance.info,originalInfo=instance.originalInfo;info.offsetHeight=originalInfo.offsetHeight+dy;},l:function(instance,dx,dy){var info=instance.info,originalInfo=instance.originalInfo;info.left=originalInfo.left+dx;info.offsetWidth=originalInfo.offsetWidth-dx;},r:function(instance,dx,dy){var info=instance.info,originalInfo=instance.originalInfo;info.offsetWidth=originalInfo.offsetWidth+dx;},t:function(instance,dx,dy){var info=instance.info,originalInfo=instance.originalInfo;info.top=originalInfo.top+dy;info.offsetHeight=originalInfo.offsetHeight-dy;},tr:function(instance,dx,dy){this.t.apply(this,arguments);this.r.apply(this,arguments);},bl:function(instance,dx,dy){this.b.apply(this,arguments);this.l.apply(this,arguments);},br:function(instance,dx,dy){this.b.apply(this,arguments);this.r.apply(this,arguments);},tl:function(instance,dx,dy){this.t.apply(this,arguments);this.l.apply(this,arguments);}},capitalize:capitalize});Y.Resize=Y.extend(Resize,Y.Base,{ALL_HANDLES:[T,TR,R,BR,B,BL,L,TL],REGEX_CHANGE_HEIGHT:/^(t|tr|b|bl|br|tl)$/i,REGEX_CHANGE_LEFT:/^(tl|l|bl)$/i,REGEX_CHANGE_TOP:/^(tl|t|tr)$/i,REGEX_CHANGE_WIDTH:/^(bl|br|l|r|tl|tr)$/i,WRAP_TEMPLATE:'<div class="'+CSS_RESIZE_WRAPPER+'"></div>',HANDLE_TEMPLATE:'<div class="'+concat(CSS_RESIZE_HANDLE,CSS_RESIZE_HANDLE_PLACEHOLDER)+'">'+'<div class="'+concat(CSS_RESIZE_HANDLE_INNER,CSS_RESIZE_HANDLE_INNER_PLACEHOLDER)+'">&nbsp;</div>'+'</div>',totalHSurrounding:0,totalVSurrounding:0,nodeSurrounding:null,wrapperSurrounding:null,changeHeightHandles:false,changeLeftHandles:false,changeTopHandles:false,changeWidthHandles:false,delegate:null,info:null,lastInfo:null,originalInfo:null,initializer:function(){this.renderer();},renderUI:function(){var instance=this;instance._renderHandles();},bindUI:function(){var instance=this;instance._createEvents();instance._bindDD();instance._bindHandle();},syncUI:function(){var instance=this;this.get(NODE).addClass(CSS_RESIZE);instance._setHideHandlesUI(instance.get(AUTO_HIDE));},destructor:function(){var instance=this,node=instance.get(NODE),wrapper=instance.get(WRAPPER),pNode=wrapper.get(PARENT_NODE);Y.Event.purgeElement(wrapper,true);instance.eachHandle(function(handleEl){instance.delegate.dd.destroy();handleEl.remove(true);});if(instance.get(WRAP)){instance._copyStyles(wrapper,node);if(pNode){pNode.insertBefore(node,wrapper);}
wrapper.remove(true);}
node.removeClass(CSS_RESIZE);node.removeClass(CSS_RESIZE_HIDDEN_HANDLES);},renderer:function(){this.renderUI();this.bindUI();this.syncUI();},eachHandle:function(fn){var instance=this;Y.each(instance.get(HANDLES),function(handle,i){var handleEl=instance.get(handleAttrName(handle));fn.apply(instance,[handleEl,handle,i]);});},_bindDD:function(){var instance=this;instance.delegate=new Y.DD.Delegate({bubbleTargets:instance,container:instance.get(WRAPPER),dragConfig:{clickPixelThresh:0,clickTimeThresh:0,useShim:true,move:false},nodes:DOT+CSS_RESIZE_HANDLE,target:false});instance.on('drag:drag',instance._handleResizeEvent);instance.on('drag:dropmiss',instance._handleMouseUpEvent);instance.on('drag:end',instance._handleResizeEndEvent);instance.on('drag:start',instance._handleResizeStartEvent);},_bindHandle:function(){var instance=this,wrapper=instance.get(WRAPPER);wrapper.on('mouseenter',Y.bind(instance._onWrapperMouseEnter,instance));wrapper.on('mouseleave',Y.bind(instance._onWrapperMouseLeave,instance));wrapper.delegate('mouseenter',Y.bind(instance._onHandleMouseEnter,instance),DOT+CSS_RESIZE_HANDLE);wrapper.delegate('mouseleave',Y.bind(instance._onHandleMouseLeave,instance),DOT+CSS_RESIZE_HANDLE);},_createEvents:function(){var instance=this,publish=function(name,fn){instance.publish(name,{defaultFn:fn,queuable:false,emitFacade:true,bubbles:true,prefix:RESIZE});};publish(EV_RESIZE_START,this._defResizeStartFn);publish(EV_RESIZE,this._defResizeFn);publish(EV_RESIZE_ALIGN,this._defResizeAlignFn);publish(EV_RESIZE_END,this._defResizeEndFn);publish(EV_MOUSE_UP,this._defMouseUpFn);},_renderHandles:function(){var instance=this,wrapper=instance.get(WRAPPER);instance.eachHandle(function(handleEl){wrapper.append(handleEl);});},_buildHandle:function(handle){var instance=this;return Y.Node.create(Y.substitute(instance.HANDLE_TEMPLATE,{handle:handle}));},_calcResize:function(){var instance=this,handle=instance.handle,info=instance.info,originalInfo=instance.originalInfo,dx=info.actXY[0]-originalInfo.actXY[0],dy=info.actXY[1]-originalInfo.actXY[1];if(handle&&Y.Resize.RULES[handle]){Y.Resize.RULES[handle](instance,dx,dy);}
else{}},_checkSize:function(offset,size){var instance=this,info=instance.info,originalInfo=instance.originalInfo,axis=(offset==OFFSET_HEIGHT)?TOP:LEFT;info[offset]=size;if(((axis==LEFT)&&instance.changeLeftHandles)||((axis==TOP)&&instance.changeTopHandles)){info[axis]=originalInfo[axis]+originalInfo[offset]-size;}},_copyStyles:function(node,wrapper){var position=node.getStyle(POSITION).toLowerCase(),surrounding=this._getBoxSurroundingInfo(node),wrapperStyle;if(position==STATIC){position=RELATIVE;}
wrapperStyle={position:position,left:getCompStyle(node,LEFT),top:getCompStyle(node,TOP)};Y.mix(wrapperStyle,surrounding.margin);Y.mix(wrapperStyle,surrounding.border);wrapper.setStyles(wrapperStyle);node.setStyles({border:0,margin:0});wrapper.sizeTo(node.get(OFFSET_WIDTH)+surrounding.totalHBorder,node.get(OFFSET_HEIGHT)+surrounding.totalVBorder);},_extractHandleName:Y.cached(function(node){var className=node.get(CLASS_NAME),match=className.match(new RegExp(getCN(RESIZE,HANDLE,'(\\w{1,2})\\b')));return match?match[1]:null;}),_getInfo:function(node,event){var actXY=[0,0],drag=event.dragEvent.target,nodeXY=node.getXY(),nodeX=nodeXY[0],nodeY=nodeXY[1],offsetHeight=node.get(OFFSET_HEIGHT),offsetWidth=node.get(OFFSET_WIDTH);if(event){actXY=(drag.actXY.length?drag.actXY:drag.lastXY);}
return{actXY:actXY,bottom:(nodeY+offsetHeight),left:nodeX,offsetHeight:offsetHeight,offsetWidth:offsetWidth,right:(nodeX+offsetWidth),top:nodeY};},_getBoxSurroundingInfo:function(node){var info={padding:{},margin:{},border:{}};if(isNode(node)){Y.each([TOP,RIGHT,BOTTOM,LEFT],function(dir){var paddingProperty=capitalize(PADDING,dir),marginProperty=capitalize(MARGIN,dir),borderWidthProperty=capitalize(BORDER,dir,WIDTH),borderColorProperty=capitalize(BORDER,dir,COLOR),borderStyleProperty=capitalize(BORDER,dir,STYLE);info.border[borderColorProperty]=getCompStyle(node,borderColorProperty);info.border[borderStyleProperty]=getCompStyle(node,borderStyleProperty);info.border[borderWidthProperty]=getCompStyle(node,borderWidthProperty);info.margin[marginProperty]=getCompStyle(node,marginProperty);info.padding[paddingProperty]=getCompStyle(node,paddingProperty);});}
info.totalHBorder=(toRoundNumber(info.border.borderLeftWidth)+toRoundNumber(info.border.borderRightWidth));info.totalHPadding=(toRoundNumber(info.padding.paddingLeft)+toRoundNumber(info.padding.paddingRight));info.totalVBorder=(toRoundNumber(info.border.borderBottomWidth)+toRoundNumber(info.border.borderTopWidth));info.totalVPadding=(toRoundNumber(info.padding.paddingBottom)+toRoundNumber(info.padding.paddingTop));return info;},_syncUI:function(){var instance=this,info=instance.info,wrapperSurrounding=instance.wrapperSurrounding,wrapper=instance.get(WRAPPER),node=instance.get(NODE);wrapper.sizeTo(info.offsetWidth,info.offsetHeight);if(instance.changeLeftHandles||instance.changeTopHandles){wrapper.setXY([info.left,info.top]);}
if(!wrapper.compareTo(node)){node.sizeTo(info.offsetWidth-wrapperSurrounding.totalHBorder,info.offsetHeight-wrapperSurrounding.totalVBorder);}
if(Y.UA.webkit){node.setStyle(RESIZE,NONE);}},_updateChangeHandleInfo:function(handle){var instance=this;instance.changeHeightHandles=instance.REGEX_CHANGE_HEIGHT.test(handle);instance.changeLeftHandles=instance.REGEX_CHANGE_LEFT.test(handle);instance.changeTopHandles=instance.REGEX_CHANGE_TOP.test(handle);instance.changeWidthHandles=instance.REGEX_CHANGE_WIDTH.test(handle);},_updateInfo:function(event){var instance=this;instance.info=instance._getInfo(instance.get(WRAPPER),event);},_updateSurroundingInfo:function(){var instance=this,node=instance.get(NODE),wrapper=instance.get(WRAPPER),nodeSurrounding=instance._getBoxSurroundingInfo(node),wrapperSurrounding=instance._getBoxSurroundingInfo(wrapper);instance.nodeSurrounding=nodeSurrounding;instance.wrapperSurrounding=wrapperSurrounding;instance.totalVSurrounding=(nodeSurrounding.totalVPadding+wrapperSurrounding.totalVBorder);instance.totalHSurrounding=(nodeSurrounding.totalHPadding+wrapperSurrounding.totalHBorder);},_setActiveHandlesUI:function(val){var instance=this,activeHandleNode=instance.get(ACTIVE_HANDLE_NODE);if(activeHandleNode){if(val){instance.eachHandle(function(handleEl){handleEl.removeClass(CSS_RESIZE_HANDLE_ACTIVE);});activeHandleNode.addClass(CSS_RESIZE_HANDLE_ACTIVE);}
else{activeHandleNode.removeClass(CSS_RESIZE_HANDLE_ACTIVE);}}},_setHandles:function(val){var instance=this,handles=[];if(isArray(val)){handles=val;}
else if(isString(val)){if(val.toLowerCase()==ALL){handles=instance.ALL_HANDLES;}
else{Y.each(val.split(COMMA),function(node,i){var handle=trim(node);if(indexOf(instance.ALL_HANDLES,handle)>-1){handles.push(handle);}});}}
return handles;},_setHideHandlesUI:function(val){var instance=this,wrapper=instance.get(WRAPPER);if(!instance.get(RESIZING)){if(val){wrapper.addClass(CSS_RESIZE_HIDDEN_HANDLES);}
else{wrapper.removeClass(CSS_RESIZE_HIDDEN_HANDLES);}}},_setWrap:function(val){var instance=this,node=instance.get(NODE),nodeName=node.get(NODE_NAME),typeRegex=instance.get(WRAP_TYPES);if(typeRegex.test(nodeName)){val=true;}
return val;},_defMouseUpFn:function(event){var instance=this;instance.set(RESIZING,false);},_defResizeFn:function(event){var instance=this;instance._resize(event);},_resize:function(event){var instance=this;instance._handleResizeAlignEvent(event.dragEvent);instance._syncUI();},_defResizeAlignFn:function(event){var instance=this;instance._resizeAlign(event);},_resizeAlign:function(event){var instance=this,info,defMinHeight,defMinWidth;instance.lastInfo=instance.info;instance._updateInfo(event);info=instance.info;instance._calcResize();if(!instance.con){defMinHeight=(instance.get(DEF_MIN_HEIGHT)+instance.totalVSurrounding);defMinWidth=(instance.get(DEF_MIN_WIDTH)+instance.totalHSurrounding);if(info.offsetHeight<=defMinHeight){instance._checkSize(OFFSET_HEIGHT,defMinHeight);}
if(info.offsetWidth<=defMinWidth){instance._checkSize(OFFSET_WIDTH,defMinWidth);}}},_defResizeEndFn:function(event){var instance=this;instance._resizeEnd(event);},_resizeEnd:function(event){var instance=this,drag=event.dragEvent.target;drag.actXY=[];instance._syncUI();instance._setActiveHandlesUI(false);instance.set(ACTIVE_HANDLE,null);instance.set(ACTIVE_HANDLE_NODE,null);instance.handle=null;},_defResizeStartFn:function(event){var instance=this;instance._resizeStart(event);},_resizeStart:function(event){var instance=this,wrapper=instance.get(WRAPPER);instance.handle=instance.get(ACTIVE_HANDLE);instance.set(RESIZING,true);instance._updateSurroundingInfo();instance.originalInfo=instance._getInfo(wrapper,event);instance._updateInfo(event);},_handleMouseUpEvent:function(event){this.fire(EV_MOUSE_UP,{dragEvent:event,info:this.info});},_handleResizeEvent:function(event){this.fire(EV_RESIZE,{dragEvent:event,info:this.info});},_handleResizeAlignEvent:function(event){this.fire(EV_RESIZE_ALIGN,{dragEvent:event,info:this.info});},_handleResizeEndEvent:function(event){this.fire(EV_RESIZE_END,{dragEvent:event,info:this.info});},_handleResizeStartEvent:function(event){if(!this.get(ACTIVE_HANDLE)){this._setHandleFromNode(event.target.get('node'));}
this.fire(EV_RESIZE_START,{dragEvent:event,info:this.info});},_onWrapperMouseEnter:function(event){var instance=this;if(instance.get(AUTO_HIDE)){instance._setHideHandlesUI(false);}},_onWrapperMouseLeave:function(event){var instance=this;if(instance.get(AUTO_HIDE)){instance._setHideHandlesUI(true);}},_setHandleFromNode:function(node){var instance=this,handle=instance._extractHandleName(node);if(!instance.get(RESIZING)){instance.set(ACTIVE_HANDLE,handle);instance.set(ACTIVE_HANDLE_NODE,node);instance._setActiveHandlesUI(true);instance._updateChangeHandleInfo(handle);}},_onHandleMouseEnter:function(event){this._setHandleFromNode(event.currentTarget);},_onHandleMouseLeave:function(event){var instance=this;if(!instance.get(RESIZING)){instance._setActiveHandlesUI(false);}},_valueWrapper:function(){var instance=this,node=instance.get(NODE),pNode=node.get(PARENT_NODE),wrapper=node;if(instance.get(WRAP)){wrapper=Y.Node.create(instance.WRAP_TEMPLATE);if(pNode){pNode.insertBefore(wrapper,node);}
wrapper.append(node);instance._copyStyles(node,wrapper);node.setStyles({position:STATIC,left:0,top:0});}
return wrapper;}});Y.each(Y.Resize.prototype.ALL_HANDLES,function(handle,i){Y.Resize.ATTRS[handleAttrName(handle)]={setter:function(){return this._buildHandle(handle);},value:null,writeOnce:true};});},'3.3.0',{requires:['base','widget','substitute','event','oop','dd-drag','dd-delegate','dd-drop'],skinnable:true});YUI.add('resize-proxy',function(Y){var ACTIVE_HANDLE_NODE='activeHandleNode',CURSOR='cursor',DRAG_CURSOR='dragCursor',HOST='host',PARENT_NODE='parentNode',PROXY='proxy',PROXY_NODE='proxyNode',RESIZE='resize',RESIZE_PROXY='resize-proxy',WRAPPER='wrapper',getCN=Y.ClassNameManager.getClassName,CSS_RESIZE_PROXY=getCN(RESIZE,PROXY);function ResizeProxy(){ResizeProxy.superclass.constructor.apply(this,arguments);}
Y.mix(ResizeProxy,{NAME:RESIZE_PROXY,NS:PROXY,ATTRS:{proxyNode:{setter:Y.one,valueFn:function(){return Y.Node.create(this.PROXY_TEMPLATE);}}}});Y.extend(ResizeProxy,Y.Plugin.Base,{PROXY_TEMPLATE:'<div class="'+CSS_RESIZE_PROXY+'"></div>',initializer:function(){var instance=this;instance.afterHostEvent('resize:start',instance._afterResizeStart);instance.beforeHostMethod('_resize',instance._beforeHostResize);instance.afterHostMethod('_resizeEnd',instance._afterHostResizeEnd);},destructor:function(){var instance=this;instance.get(PROXY_NODE).remove(true);},_afterHostResizeEnd:function(event){var instance=this,drag=event.dragEvent.target;drag.actXY=[];instance._syncProxyUI();instance.get(PROXY_NODE).hide();},_afterResizeStart:function(event){var instance=this;instance._renderProxy();},_beforeHostResize:function(event){var instance=this,host=this.get(HOST);host._handleResizeAlignEvent(event.dragEvent);instance._syncProxyUI();return new Y.Do.Prevent();},_renderProxy:function(){var instance=this,host=this.get(HOST),proxyNode=instance.get(PROXY_NODE);if(!proxyNode.inDoc()){host.get(WRAPPER).get(PARENT_NODE).append(proxyNode.hide());}},_syncProxyUI:function(){var instance=this,host=this.get(HOST),info=host.info,activeHandleNode=host.get(ACTIVE_HANDLE_NODE),proxyNode=instance.get(PROXY_NODE),cursor=activeHandleNode.getStyle(CURSOR);proxyNode.show().setStyle(CURSOR,cursor);host.delegate.dd.set(DRAG_CURSOR,cursor);proxyNode.sizeTo(info.offsetWidth,info.offsetHeight);proxyNode.setXY([info.left,info.top]);}});Y.namespace('Plugin');Y.Plugin.ResizeProxy=ResizeProxy;},'3.3.0',{requires:['resize-base','plugin'],skinnable:false});YUI.add('resize-constrain',function(Y){var Lang=Y.Lang,isBoolean=Lang.isBoolean,isNumber=Lang.isNumber,isString=Lang.isString,capitalize=Y.Resize.capitalize,isNode=function(v){return(v instanceof Y.Node);},toNumber=function(num){return parseFloat(num)||0;},BORDER_BOTTOM_WIDTH='borderBottomWidth',BORDER_LEFT_WIDTH='borderLeftWidth',BORDER_RIGHT_WIDTH='borderRightWidth',BORDER_TOP_WIDTH='borderTopWidth',BORDER='border',BOTTOM='bottom',CON='con',CONSTRAIN='constrain',HOST='host',LEFT='left',MAX_HEIGHT='maxHeight',MAX_WIDTH='maxWidth',MIN_HEIGHT='minHeight',MIN_WIDTH='minWidth',NODE='node',OFFSET_HEIGHT='offsetHeight',OFFSET_WIDTH='offsetWidth',PRESEVE_RATIO='preserveRatio',REGION='region',RESIZE_CONTRAINED='resizeConstrained',RIGHT='right',TICK_X='tickX',TICK_Y='tickY',TOP='top',WIDTH='width',VIEW='view',VIEWPORT_REGION='viewportRegion';function ResizeConstrained(){ResizeConstrained.superclass.constructor.apply(this,arguments);}
Y.mix(ResizeConstrained,{NAME:RESIZE_CONTRAINED,NS:CON,ATTRS:{constrain:{setter:function(v){if(v&&(isNode(v)||isString(v)||v.nodeType)){v=Y.one(v);}
return v;}},minHeight:{value:15,validator:isNumber},minWidth:{value:15,validator:isNumber},maxHeight:{value:Infinity,validator:isNumber},maxWidth:{value:Infinity,validator:isNumber},preserveRatio:{value:false,validator:isBoolean},tickX:{value:false},tickY:{value:false}}});Y.extend(ResizeConstrained,Y.Plugin.Base,{constrainSurrounding:null,initializer:function(){var instance=this,host=instance.get(HOST);host.delegate.dd.plug(Y.Plugin.DDConstrained,{tickX:instance.get(TICK_X),tickY:instance.get(TICK_Y)});host.after('resize:align',Y.bind(instance._handleResizeAlignEvent,instance));host.on('resize:start',Y.bind(instance._handleResizeStartEvent,instance));},_checkConstrain:function(axis,axisConstrain,offset){var instance=this,point1,point1Constrain,point2,point2Constrain,host=instance.get(HOST),info=host.info,constrainBorders=instance.constrainSurrounding.border,region=instance._getConstrainRegion();if(region){point1=info[axis]+info[offset];point1Constrain=region[axisConstrain]-toNumber(constrainBorders[capitalize(BORDER,axisConstrain,WIDTH)]);if(point1>=point1Constrain){info[offset]-=(point1-point1Constrain);}
point2=info[axis];point2Constrain=region[axis]+toNumber(constrainBorders[capitalize(BORDER,axis,WIDTH)]);if(point2<=point2Constrain){info[axis]+=(point2Constrain-point2);info[offset]-=(point2Constrain-point2);}}},_checkHeight:function(){var instance=this,host=instance.get(HOST),info=host.info,maxHeight=(instance.get(MAX_HEIGHT)+host.totalVSurrounding),minHeight=(instance.get(MIN_HEIGHT)+host.totalVSurrounding);instance._checkConstrain(TOP,BOTTOM,OFFSET_HEIGHT);if(info.offsetHeight>maxHeight){host._checkSize(OFFSET_HEIGHT,maxHeight);}
if(info.offsetHeight<minHeight){host._checkSize(OFFSET_HEIGHT,minHeight);}},_checkRatio:function(){var instance=this,host=instance.get(HOST),info=host.info,originalInfo=host.originalInfo,oWidth=originalInfo.offsetWidth,oHeight=originalInfo.offsetHeight,oTop=originalInfo.top,oLeft=originalInfo.left,oBottom=originalInfo.bottom,oRight=originalInfo.right,wRatio=function(){return(info.offsetWidth/oWidth);},hRatio=function(){return(info.offsetHeight/oHeight);},isClosestToHeight=host.changeHeightHandles,bottomDiff,constrainBorders,constrainRegion,leftDiff,rightDiff,topDiff;if(instance.get(CONSTRAIN)&&host.changeHeightHandles&&host.changeWidthHandles){constrainRegion=instance._getConstrainRegion();constrainBorders=instance.constrainSurrounding.border;bottomDiff=(constrainRegion.bottom-toNumber(constrainBorders[BORDER_BOTTOM_WIDTH]))-oBottom;leftDiff=oLeft-(constrainRegion.left+toNumber(constrainBorders[BORDER_LEFT_WIDTH]));rightDiff=(constrainRegion.right-toNumber(constrainBorders[BORDER_RIGHT_WIDTH]))-oRight;topDiff=oTop-(constrainRegion.top+toNumber(constrainBorders[BORDER_TOP_WIDTH]));if(host.changeLeftHandles&&host.changeTopHandles){isClosestToHeight=(topDiff<leftDiff);}
else if(host.changeLeftHandles){isClosestToHeight=(bottomDiff<leftDiff);}
else if(host.changeTopHandles){isClosestToHeight=(topDiff<rightDiff);}
else{isClosestToHeight=(bottomDiff<rightDiff);}}
if(isClosestToHeight){info.offsetWidth=oWidth*hRatio();instance._checkWidth();info.offsetHeight=oHeight*wRatio();}
else{info.offsetHeight=oHeight*wRatio();instance._checkHeight();info.offsetWidth=oWidth*hRatio();}
if(host.changeTopHandles){info.top=oTop+(oHeight-info.offsetHeight);}
if(host.changeLeftHandles){info.left=oLeft+(oWidth-info.offsetWidth);}
Y.each(info,function(value,key){if(isNumber(value)){info[key]=Math.round(value);}});},_checkRegion:function(){var instance=this,host=instance.get(HOST),region=instance._getConstrainRegion();return Y.DOM.inRegion(null,region,true,host.info);},_checkWidth:function(){var instance=this,host=instance.get(HOST),info=host.info,maxWidth=(instance.get(MAX_WIDTH)+host.totalHSurrounding),minWidth=(instance.get(MIN_WIDTH)+host.totalHSurrounding);instance._checkConstrain(LEFT,RIGHT,OFFSET_WIDTH);if(info.offsetWidth<minWidth){host._checkSize(OFFSET_WIDTH,minWidth);}
if(info.offsetWidth>maxWidth){host._checkSize(OFFSET_WIDTH,maxWidth);}},_getConstrainRegion:function(){var instance=this,host=instance.get(HOST),node=host.get(NODE),constrain=instance.get(CONSTRAIN),region=null;if(constrain){if(constrain==VIEW){region=node.get(VIEWPORT_REGION);}
else if(isNode(constrain)){region=constrain.get(REGION);}
else{region=constrain;}}
return region;},_handleResizeAlignEvent:function(event){var instance=this,host=instance.get(HOST);instance._checkHeight();instance._checkWidth();if(instance.get(PRESEVE_RATIO)){instance._checkRatio();}
if(instance.get(CONSTRAIN)&&!instance._checkRegion()){host.info=host.lastInfo;}},_handleResizeStartEvent:function(event){var instance=this,constrain=instance.get(CONSTRAIN),host=instance.get(HOST);instance.constrainSurrounding=host._getBoxSurroundingInfo(constrain);}});Y.namespace('Plugin');Y.Plugin.ResizeConstrained=ResizeConstrained;},'3.3.0',{requires:['resize-base','plugin'],skinnable:false});YUI.add('resize',function(Y){},'3.3.0',{use:['resize-base','resize-proxy','resize-constrain']});
/*!
 * Webim v1.1.0
 * http://www.webim20.cn/
 *
 * Copyright (c) 2010 Hidden
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Wed Oct 20 11:10:29 2010 +0800
 * Commit: a24575fb3b5cefd924ba53ac3f67e0f682267614
 */
(function(window, document, undefined){

function now() {
	return (new Date).getTime();
}

var _toString = Object.prototype.toString;
function isFunction( obj ){
	return _toString.call(obj) === "[object Function]";
}

function isArray( obj ){
	return _toString.call(obj) === "[object Array]";
}
function isObject( obj ){
	return obj && _toString.call(obj) === "[object Object]";
}

function trim( text ) {
	return (text || "").replace( /^\s+|\s+$/g, "" );
}

function checkUpdate (old, add){
	var added = false;
	if (isObject(add)) {
		old = old || {};
		for (var key in add) {
			var val = add[key];
			if (old[key] != val) {
				added = added || {};
				added[key] = val;
			}
		}
	}
	return added;
}
function makeArray( array ){
	var ret = [];
	if( array != null ){
		var i = array.length;
		// The window, strings (and functions) also have 'length'
		if( i == null || typeof array === "string" || isFunction(array) || array.setInterval )
			ret[0] = array;
		else
			while( i )
				ret[--i] = array[i];
	}
	return ret;
}

function extend() {
	// copy reference to target object
	var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction(target) )
		target = {};
	for ( ; i < length; i++ )
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null )
			// Extend the base object
			for ( var name in options ) {
				var src = target[ name ], copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy )
					continue;

				// Recurse if we're merging object values
				if ( deep && copy && typeof copy === "object" && !copy.nodeType )
					target[ name ] = extend( deep, 
							// Never move original objects, clone them
							src || ( copy.length != null ? [ ] : { } )
							, copy );

				// Don't bring in undefined values
				else if ( copy !== undefined )
					target[ name ] = copy;

			}

	// Return the modified object
	return target;
}

function each( object, callback, args ) {
	var name, i = 0,
	    length = object.length,
	    isObj = length === undefined || isFunction(object);

	if ( args ) {
		if ( isObj ) {
			for ( name in object ) {
				if ( callback.apply( object[ name ], args ) === false ) {
					break;
				}
			}
		} else {
			for ( ; i < length; ) {
				if ( callback.apply( object[ i++ ], args ) === false ) {
					break;
				}
			}
		}

		// A special, fast, case for the most common use of each
	} else {
		if ( isObj ) {
			for ( name in object ) {
				if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
					break;
				}
			}
		} else {
			for ( var value = object[0];
					i < length && callback.call( value, i, value ) !== false; value = object[++i] ) {}
		}
	}

	return object;
}


function inArray( elem, array ) {
	for ( var i = 0, length = array.length; i < length; i++ ) {
		if ( array[ i ] === elem ) {
			return i;
		}
	}

	return -1;
}


function grep( elems, callback, inv ) {
	var ret = [];

	// Go through the array, only saving the items
	// that pass the validator function
	for ( var i = 0, length = elems.length; i < length; i++ ) {
		if ( !inv !== !callback( elems[ i ], i ) ) {
			ret.push( elems[ i ] );
		}
	}

	return ret;
}

function map( elems, callback ) {
	var ret = [], value;

	// Go through the array, translating each of the items to their
	// new value (or values).
	for ( var i = 0, length = elems.length; i < length; i++ ) {
		value = callback( elems[ i ], i );

		if ( value != null ) {
			ret[ ret.length ] = value;
		}
	}

	return ret.concat.apply( [], ret );
}
var objectExtend = {
	option: function(key, value) {
		var options = key, self = this;
		self.options = self.options || {};
		if (typeof key == "string") {
			if (value === undefined) {
				return self.options[key];
			}
			options = {};
			options[key] = value;
		}
		extend(self.options, options);
		return self;
	},

	bind: function(type, fn){
		var self = this, _events = self._events = self._events || {};
		if (isFunction(fn)){
			_events[type] = _events[type] || [];
			_events[type].push(fn);
		}
		return this;
	},

	trigger: function(type, args){
		var self = this, _events = self._events = self._events || {}, fns = _events[type];
		if (!fns) return this;
		args = isArray(args) ? args : makeArray(args);
		for (var i = 0, l = fns.length; i < l; i++){
			fns[i].apply(this, args);
		}
		return this;
	},

	unbind: function(type, fn) {
		var self = this, _events = self._events = self._events || {};
		if (!_events[type]) return this;
		if (isFunction(fn)){
			var _e = _events[type];
			for (var i = _e.length; i--; i){
				if ( _e[i] === fn ) _e.splice(i, 1);
			}
		} else {
			delete _events[type];
		}
		return this;
	}
};
/*
* Depends:
* 	core.js
*
*/

// key/values into a query string
var r20 = /%20/g;

function param( a ) {
	var s = [];
	if ( typeof a == "object"){
		for (var key in a) {
			s[ s.length ] = encodeURIComponent(key) + '=' + encodeURIComponent(a[key]);
		}
		// Return the resulting serialization
		return s.join("&").replace(r20, "+");
	}
	return a;
}

var jsc = now(),
	rquery = /\?/,
	rts = /(\?|&)_=.*?(&|$)/,
	rurl = /^(\w+:)?\/\/([^\/?#]+)/,
	ajaxSettings = {
		url: location.href,
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		username: null,
		password: null,
		*/
		// Create the request object; Microsoft failed to properly
		// implement the XMLHttpRequest in IE7, so we use the ActiveXObject when it is available
		// This function can be overriden by calling ajaxSetup
		xhr: function(){
			return window.ActiveXObject ?
				new ActiveXObject("Microsoft.XMLHTTP") :
				new XMLHttpRequest();
		},
		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			script: "text/javascript, application/javascript",
			json: "application/json, text/javascript",
			text: "text/plain",
			_default: "*/*"
		}
	},
	// Last-Modified header cache for next request
	lastModified = {},
	etag = {};

function handleError( s, xhr, status, e ) {
	// If a local callback was specified, fire it
	if ( s.error ) {
		s.error.call( s.context || window, xhr, status, e );
	}
}
// Determines if an XMLHttpRequest was successful or not
function httpSuccess( xhr ) {
	try {
		// IE error sometimes returns 1223 when it should be 204 so treat it as success, see #1450
		return !xhr.status && location.protocol === "file:" ||
			// Opera returns 0 when status is 304
			( xhr.status >= 200 && xhr.status < 300 ) ||
			xhr.status === 304 || xhr.status === 1223 || xhr.status === 0;
	} catch(e){}
	return false;
}

// Determines if an XMLHttpRequest returns NotModified
function httpNotModified( xhr, url ) {
	var _lastModified = xhr.getResponseHeader("Last-Modified"),
		_etag = xhr.getResponseHeader("Etag");

	if ( _lastModified ) {
		lastModified[url] = _lastModified;
	}
	if ( _etag ) {
		etag[url] = _etag;
	}
	// Opera returns 0 when status is 304
	return xhr.status === 304 || xhr.status === 0;
}

function httpData( xhr, type, s ) {
	var ct = xhr.getResponseHeader("content-type"),
		xml = type === "xml" || !type && ct && ct.indexOf("xml") >= 0,
		data = xml ? xhr.responseXML : xhr.responseText;

	if ( xml && data.documentElement.nodeName === "parsererror" ) {
		throw "parsererror";
	}
	// Allow a pre-filtering function to sanitize the response
	// s is checked to keep backwards compatibility
	if ( s && s.dataFilter ) {
		data = s.dataFilter( data, type );
	}

	// The filter can actually parse the response
	if ( typeof data === "string" ) {
		// Get the JavaScript object, if JSON is used.
		if ( type === "json" ) {
			if ( typeof JSON === "object" && JSON.parse ) {
				data = JSON.parse( data );
			} else {
				data = (new Function("return " + data))();
			}
		}
	}

	return data;
}


function ajaxSetup( settings ) {
	extend( ajaxSettings, settings );
}
function ajax( s ) {
	// Extend the settings, but re-extend 's' so that it can be
	// checked again later (in the test suite, specifically)
	s = extend(true, s, extend(true, {}, ajaxSettings, s));
	
	var status, data,
		callbackContext = s.context || window,
		type = s.type.toUpperCase();

	// convert data if not already a string
	if ( s.data && s.processData && typeof s.data !== "string" ) {
		s.data = param(s.data);
	}
	if ( s.cache === false && type === "GET" ) {
		var ts = now();

		// try replacing _= if it is there
		var ret = s.url.replace(rts, "$1_=" + ts + "$2");

		// if nothing was replaced, add timestamp to the end
		s.url = ret + ((ret === s.url) ? (rquery.test(s.url) ? "&" : "?") + "_=" + ts : "");
	}

	// If data is available, append data to url for get requests
	if ( s.data && type === "GET" ) {
		s.url += (rquery.test(s.url) ? "&" : "?") + s.data;
	}

	var requestDone = false;

	// Create the request object
	var xhr = s.xhr();

	// Open the socket
	// Passing null username, generates a login popup on Opera (#2865)
	if ( s.username ) {
		xhr.open(type, s.url, s.async, s.username, s.password);
	} else {
		xhr.open(type, s.url, s.async);
	}

	// Need an extra try/catch for cross domain requests in Firefox 3
	try {
		// Set the correct header, if data is being sent
		if ( s.data ) {
			xhr.setRequestHeader("Content-Type", s.contentType);
		}

			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				if ( lastModified[s.url] ) {
					xhr.setRequestHeader("If-Modified-Since", lastModified[s.url]);
				}

				if ( etag[s.url] ) {
					xhr.setRequestHeader("If-None-Match", etag[s.url]);
				}
			}

		// Set header so the called script knows that it's an XMLHttpRequest
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

		// Set the Accepts header for the server, depending on the dataType
		xhr.setRequestHeader("Accept", s.dataType && s.accepts[ s.dataType ] ?
			s.accepts[ s.dataType ] + ", */*" :
			s.accepts._default );
	} catch(e){}

	// Allow custom headers/mimetypes and early abort
	if ( s.beforeSend && s.beforeSend.call(callbackContext, xhr, s) === false ) {
		// close opended socket
		xhr.abort();
		return false;
	}
	// Wait for a response to come back
	var onreadystatechange = function(isTimeout){
		// The request was aborted, clear the interval
		if ( !xhr || xhr.readyState === 0 ) {
			if ( ival ) {
				// clear poll interval
				clearInterval( ival );
				ival = null;
			}

		// The transfer is complete and the data is available, or the request timed out
		} else if ( !requestDone && xhr && (xhr.readyState === 4 || isTimeout === "timeout") ) {
			requestDone = true;

			// clear poll interval
			if (ival) {
				clearInterval(ival);
				ival = null;
			}

			status = isTimeout === "timeout" ?
				"timeout" :
				!httpSuccess( xhr ) ?
					"error" :
					s.ifModified && httpNotModified( xhr, s.url ) ?
						"notmodified" :
						"success";

			if ( status === "success" ) {
				// Watch for, and catch, XML document parse errors
				try {
					// process the data (runs the xml through httpData regardless of callback)
					data = httpData( xhr, s.dataType, s );
				} catch(e) {
					status = "parsererror";
				}
			}

			// Make sure that the request was successful or notmodified
			if ( status === "success" || status === "notmodified" ) {
				success();
			} else {
				handleError(s, xhr, status);
			}

			// Fire the complete handlers
			complete();

			if ( isTimeout ) {
				xhr.abort();
			}

			// Stop memory leaks
			if ( s.async ) {
				xhr = null;
			}
		}
	};

	if ( s.async ) {
		// don't attach the handler to the request, just poll it instead
		var ival = setInterval(onreadystatechange, 13);

		// Timeout checker
		if ( s.timeout > 0 ) {
			setTimeout(function(){
				// Check to see if the request is still happening
				if ( xhr && !requestDone ) {
					onreadystatechange( "timeout" );
				}
			}, s.timeout);
		}
	}

	// Send the data
	try {
		xhr.send( type === "POST" || type === "PUT" ? s.data : null );
	} catch(e) {
		handleError(s, xhr, null, e);
	}

	// firefox 1.5 doesn't fire statechange for sync requests
	if ( !s.async ) {
		onreadystatechange();
	}

	function success(){
		// If a local callback was specified, fire it and pass it the data
		if ( s.success ) {
			s.success.call( callbackContext, data, status );
		}
	}

	function complete(){
		// Process result
		if ( s.complete ) {
			s.complete.call( callbackContext, xhr, status);
		}
	}
	// return XMLHttpRequest to allow aborting the request etc.
	return xhr;
}

/**
* 
* No dependencies.
*
* Safari and chrome not support async opiton, it aways async.
*
* Reference:
*
* http://forum.jquery.com/topic/scriptcommunicator-for-ajax-script-jsonp-loading
* http://d-tune.javaeye.com/blog/506074
*
* Opera: 10.01
* 	run sync.
* 	can't load sync.
* 	trigger onload when load js file with content.
* 	trigger error when src is invalid.
* 	don't trigger any event when src is valid and load error.
* 	don't trigger any event when js file is blank.
*
* Chrome: 6.0
* 	run async when use createElement.
* 	run sync when use document.writeln.
* 	prefect onload and onerror event.
*
* Safari: 5.0
* 	run async.
* 	prefect onload and onerror event.
* 
* Firefox: 3.6
* 	run sync.
* 	support async by set script.async = true.
* 	prefect onload and onerror event.
*
*/
var jsonpSettings = {
	url: location.href,
	timeout: 5000,
	jsonp:"callback",
	async: false
};

var jsonpSupport = window.jsonpSupport = {
	//Firefox 3.6 and chrome 6 support script async attribute.
	async: typeof( document.createElement("script").async ) == "boolean",
	//Opera may not trigger events when script load. 
	events: false,
	// Webkit run script async when create script by createElement.
	defaultAsync: false,
	// IE can async load script in fragment.
	fragmentProxy: false
};
(function(){
	var ua = navigator.userAgent.toLowerCase();
	jsonpSupport.events = !/(opera)(?:.*version)?[ \/]([\w.]+)/.exec( ua );
	jsonpSupport.defaultAsync = !!/(webkit)[ \/]([\w.]+)/.exec( ua );
/*
var head = document.getElementsByTagName("head")[0] || document.createElement,
script = document.createElement("script"),
script2 = document.createElement("script"),
text = "window.jsonpSupport.defaultAsync = false;";
script.src = "javascript:false";
script.onload = function(e) {
jsonpSupport.defaultAsync = true;
jsonpSupport.events = true;
};                

script.onerror = function(e) {
jsonpSupport.defaultAsync = true;
jsonpSupport.events = true;
};               
script.onreadystatechange = function() {
// ie defaultAsync = true
jsonpSupport.events = true;
};
head.appendChild( script );
try{
script2.appendChild( document.createTextNode( text ) );
} catch( e ){
script2.text = text;
}
head.appendChild( script2 );
setTimeout(function(){
script.onload = script.onerror = script.onreadystatechange = null;
head.removeChild( script );
head.removeChild( script2 );
head = script = script2 = null;
}, 1000);
*/
	//Check fragment proxy
	var frag = document.createDocumentFragment(),
	script3 = document.createElement('script');
	text = "window.jsonpSupport.fragmentProxy = true";
	try{
		script3.appendChild( document.createTextNode( text ) );
	} catch( e ){
		script3.text = text;
	}
	frag.appendChild( script3 );
	frag = script3 = null;
})();

//setTimeout(function(){
//alert( JSON.stringify( jsonpSupport ) );
//alert( !jsonpSupport.fragmentProxy && !jsonpSupport.defaultAsync && !jsonpSupport.async );
//}, 300);

function jsonp(s){
	s = extend({}, jsonpSettings, s);
	var data = "",
	r20 = /%20/g,
	callbackContext = s.context || window,
	jsonp = "jsonp" + jsc++,
	jsonpError = jsonp + "error",
	script,
	errorScript,
	win = window,
	head,
	proxy,
	inIframe = s.async && !jsonpSupport.fragmentProxy && !jsonpSupport.defaultAsync && !jsonpSupport.async;
	if ( typeof s.data == "object" ) {
		var ar = [];
		for (var key in s.data) {
			ar[ ar.length ] = encodeURIComponent(key) + '=' + encodeURIComponent(s.data[key]);
		}
		// Serialize data
		data = data + ar.join("&").replace(r20, "+");
	} else {
		data = data + s.data;
	}
	data = (data ? (data + "&") : "") + (s.jsonp || "callback") + "=" + (inIframe ? "parent." : "" ) + jsonp;
	s.url += (/\?/.test( s.url ) ? "&" : "?") + data;

	// Handle Script loading
	var done = false;
	window[ jsonp ] = function( tmp ) {
		s.success && s.success.call( callbackContext, tmp, "success" );
		destroy();
	};

	//Handle script error callback, the script will run once.
	window[ jsonpError ] = function(tmp){
		if ( !done ) {
			error( "error" );
			destroy();
		}
	};

	// Handle timeout
	if ( s.timeout > 0 ) {
		setTimeout( function() {
			if ( !done ){
				error( "timeout" );
				destroy();
				// The script may be loading.
				window[ jsonp ] = jsonpEmptyFunction;
			}
		}, s.timeout );
	}
	if( s.async && !jsonpSupport.defaultAsync && jsonpSupport.fragmentProxy ) {
		proxy = document.createDocumentFragment();
		head = proxy;
		//proxy[ jsonp ] = window[ jsonp ];
		//proxy.appendChild( script );
	}
	if ( inIframe ) {
		// Opera need url path in iframe
		var location = window.location;
		if( s.url.slice(0, 1) == "/" ) {
			s.url = location.protocol + "//" + location.host + (location.port ? (":" + location.port) : "" ) + s.url;
		}
		else if( !/^https?:\/\//i.test( s.url ) ){
			var href = location.href,
		ex = /([^?#]+)\//.exec( href );
		s.url = ( ex ? ex[1] : href ) + "/" + s.url;
		}
		proxy = document.createElement( "iframe" );
		proxy.style.position = "absolute";
		proxy.style.left = "-100px";
		proxy.style.top = "-100px";
		proxy.style.height = "1px";
		proxy.style.width = "1px";
		proxy.style.visibility = "hidden";
		document.body.appendChild( proxy );
		win = proxy.contentWindow;
	}
	inIframe ? setTimeout( function() { create() }, 0 ) : create();
	return undefined;
	function create() {
		// We handle everything using the script element injection
		var doc = win.document;
		head = head || doc.getElementsByTagName("head")[0] || doc.documentElement;
		script = doc.createElement("script");
		script.src = s.url;
		if ( jsonpSupport.async ) {
			script.async = s.async;
		}
		if ( s.scriptCharset ) {
			script.charset = s.scriptCharset;
		}
		// Attach handlers for all browsers
		script.onload = script.onerror = script.onreadystatechange = function(e){
			if(!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")){
				//error
				error("error");
				destroy();
			}
		};
		// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
		head.insertBefore( script, head.firstChild );

		// Call error script When the script has not events and run sync.
		if ( !jsonpSupport.defaultAsync && !jsonpSupport.events ) {
			var sc = doc.createElement("script");
			var text = "try{" + ( inIframe ? "parent." : "" ) + jsonpError + "()}catch(e){};";
			sc.appendChild( document.createTextNode( text ) );
			head.insertBefore( sc, head.firstChild );
			//head.removeChild( sc );
			head = sc = null;
		}
	}

	function destroy(){
		done = true;
		// Garbage collect
		window[ jsonp ] = undefined;
		try{ delete window[ jsonp ]; } catch(e){}
		window[ jsonpError ] = undefined;
		try{ delete window[ jsonpError ]; } catch(e){}
		// Handle memory leak in IE
		script.onload = script.onreadystatechange = null;
		script.parentNode && script.parentNode.removeChild( script );
		proxy && proxy.parentNode && proxy.parentNode.removeChild( proxy );
		script = proxy = head = null;
	}

	function error( status ) {
		s.error && s.error.call( callbackContext, status );
	}
}

function jsonpEmptyFunction() {
}

/** HTML5 contain JSON */

if ( window.JSON ) {
	var JSON = window.JSON;
} else {
	var JSON = ( function() {
		var chars = {'\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"' : '\\"', '\\': '\\\\'};

		function rChars( chr ) {
			return chars[chr] || '\\u00' + Math.floor( chr.charCodeAt() / 16 ).toString( 16 ) + ( chr.charCodeAt() % 16 ).toString( 16 );
		}

		function encode( obj ) {
			switch ( Object.prototype.toString.call( obj ) ) {
				case '[object String]':
					return '"' + obj.replace( /[\x00-\x1f\\"]/g, rChars ) + '"';
				case '[object Array]':
					var string = [], l = obj.length;
				for( var i = 0; i < l; i++ ){
					string.push( encode( obj[i] ) );
				}
				return '[' + string.join( "," ) + ']';
				case '[object Object]':
					var string = [];
				for( var key in obj ) {
					var json = encode( obj[key] );
					if( json ) string.push( encode( key ) + ':' + json );
				}
				return '{' + string + '}';
				case '[object Number]': case '[object Boolean]': return String(obj);
				case false: return 'null';
			}
			return null;
		}
		return {
			stringify: encode,
			parse: function( str ) {
				str = str.toString();
				if( !str || !str.length ) return null;
				return ( new Function( "return " + str ) )();
				//if (secure && !(/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(string.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, ''))) return null;
			}
		}
	} )();
}

/*连接connection 
* Depends:
* 	core.js
* 	ajax.js
*
 只负责长连接. 不处理数据 不自动重连 无数据发送成功事件 只实现功能 不负责业务处理
 connection:
 attributes：

 connected //是否连接中 readonly

 methods:
 connect(options) //开始连接 成功后触发connect事件 错误触发error
 close() 关闭连接 不触发close事件
 send(msg) 发送数据 错误则触发sendError事件

 events: //
 //ready
 data //接收数据数据
 connect //连接成功
 close //连接关闭(曾经连接成功)    服务器关闭触发此事件  本地调用close()不触发此事件,连接中途出错 超时等等 需重新建立连接 调用connect(options)
 error //不能连接 缺少配置，安全限制等等
 (event,text:'')
 sendError //发送消息出错
 sendSuccess //发送消息成功

 */
/* comet */
function comet(element, options){
        var self = this;
        self._setting();
        self.options = {
                jsonp: false,
                server: null,
                ticket: null,
                domain: null,
		timeout: 40000,
                url: {
                        send: null
                }
        };
        extend(self.options, options);
}
extend(comet.prototype, objectExtend, {
        _setting: function(){
                var self = this;
                self.connected = false;//是否已连接 只读属性
                self._connecting = false; //设置连接开关避免重复连接
                self._onPolling = false; //避免重复polling
                self._pollTimer = null;
                self._pollingTimes = 0; //polling次数 第一次成功后 connected = true; 
                self._failTimes = 0;//polling失败累加2次判定服务器关闭连接
        },
        connect: function(options){
                //连接
                var self = this;
                extend(self.options, options);
                if (self._connecting) 
                return self;
                self._connecting = true;
                var options = self.options, error = false, text = [];
		/*
                each(['server', 'ticket', 'domain'], function(n, v){
                        if (!options[v]) {
                                text.push(v);
                                text.push(' required.');
                                error = true;
                        }
                });
                if (error) {
                        self._onError('error', text.join(' '));
                        return self;
                }
		*/

                if (!self._onPolling){
                        window.setTimeout(function(){
                                self._startPolling();
                        }, 300);
                }
                return self;
        },
        close: function(){
                var self = this;
                if (self._pollTimer) 
                clearTimeout(self._pollTimer);
                self._setting();
                return self;
        },
        _onConnect: function(){
                var self = this;
                self.connected = true;
                self.trigger('connect','success');
        },
        _onClose: function(m){
                var self = this;
                self._setting();
                self.trigger('close',[m]);
        },
        _onData: function(data){
                var self = this;
                self.trigger('data', data);
        },
        _onError: function(text){
                var self = this;
                self._setting();
                self.trigger('error', text);
        },
        _startPolling: function(){

                var self = this, options = self.options;
                self._onPolling = true;
                self._pollingTimes++;
                var url = options.server;
                var data = {
                //        callback: "airtest", //fortest
                        domain: options.domain,
                        ticket: options.ticket
                };
                var o = {
                        url: url,
                        data: data,
                        dataType: 'json', //fortest need show
                        timeout: options.timeout,
                        cache: false,
                        context: self,
                        success: self._onPollSuccess,
                        error: self._onPollError
                };
                if(options.jsonp){
                	extend( o, {
                	        timeout: options.timeout,
                	        dataType: 'jsonp',
				//JSONP with async request, Fix bug http://github.com/webim/webim-js/issues/issue/6
				async: true,
                	        jsonp: 'callback'
                	} );
			jsonp(o);
		}
		else
                ajax(o);
        },

        _onPollSuccess: function(d){
                var self = this;
                self._onPolling = false;
		if (self._connecting){
			if(!d || !d.status){
				return self._onError('error data');
			}else{
				//d = window["eval"](d.replace("airtest","")); //fortest
				if (self._pollingTimes == 1){
					self._onConnect();
				}
				self._onData(d);
				self._failTimes = 0;//连接成功 失败累加清零
				self._pollTimer = window.setTimeout(function(){
					self._startPolling();
				}, 200);
			}
		}
        },
        _onPollError: function( m ) {
                var self = this;
                self._onPolling = false;
                if (!self._connecting) 
                return;//已断开连接
                self._failTimes++;
                if (self._pollingTimes == 1) 
                self._onError('can not connect.');
                else{
                        if (self._failTimes > 1) {
                                //服务器关闭连接
                                self._onClose(m);
                        }
                        else {
                                self._pollTimer = window.setTimeout(function(){
                                        self._startPolling();
                                }, 200);
                        }
                }
        }
});
/*
 * Cookie plugin
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

/*
 * Create a cookie with the given name and value and other optional parameters.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 *       used when the cookie was set.
 *
 * @param String name The name of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

/*
 * Get the value of a cookie with the given name.
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String name The name of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
function cookie(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options = extend({}, options); // clone object since it's unexpected behavior if the expired property were changed
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // NOTE Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
}
//log
//log.enable();
//log.disable();
//log(log,method);
var _logable = true;
function log(str, method){
	if (!_logable) 
		return;
	var d = new Date(),  time = ['[', d.getHours(), ':', d.getMinutes(), ':', d.getSeconds(), '-', d.getMilliseconds(), ']'].join(""), msg = time + method + JSON.stringify(str);
	window.console && window.console.log(time, method, str); 
	//cosole.log("%s: %o",msg,this);
	var log = document.getElementById("webim-log");
	if ( window.runtime && window.air ) {
		window.air.trace( msg ); //air
		window.air.Introspector && window.air.Introspector.Console.log( msg );
	}
	if ( log ) { 
		var m = document.createElement("P");
		m.innerHTML = msg;
		log.appendChild(m);
	}
	//log.scrollTop(log.get(0).scrollHeight);
}
log.enable = function(){
	_logable = true;
};
log.disable = function(){
	_logable = false;
};
/*
*
* Depends:
* 	core.js
*
* options:
*
* attributes:
* 	data
* 	status
* 	setting
* 	history
* 	buddy
* 	connection
*
*
* methods:
* 	online
* 	offline
* 	autoOnline
* 	sendMsg
* 	sendStatus
* 	setStranger
*
* events:
* 	ready
* 	go
* 	stop
*
* 	message
* 	presence
* 	status
*
* 	sendMsg
*/


function webim(element, options){
	var self = this;
	self.options = extend({}, webim.defaults, options);
	this._init(element, options);
}

extend(webim.prototype, objectExtend,{
	_init: function(){
		var self = this, options = self.options;
		//Default user status info.
		var user = {presence: 'offline', show: 'unavailable'};
		if(options.jsonp)
			self.request = jsonp;
		else
			self.request = ajax;
		self.data = {user: user};
		self.status = new webim.status();
		self.setting = new webim.setting(null, {jsonp: options.jsonp});
		self.buddy = new webim.buddy(null, {active: self.status.get("b"), jsonp: options.jsonp});
		self.room = new webim.room(null, {user: user, jsonp: options.jsonp});
		self.history = new webim.history(null, {user: user, jsonp: options.jsonp});
		self.connection = new comet( null, { jsonp: window.location.protocol == "app:" ? false : true } );
		self._initEvents();
		//self.online();
	},
	user: function(info){
		extend(this.data.user, info);
	},
	_ready: function(post_data){
		var self = this;
		self._unloadFun = window.onbeforeunload;
		window.onbeforeunload = function(){
			self._refresh();
		};
		self.trigger("ready", [post_data]);
	},
	_go: function(){
		var self = this, data = self.data, history = self.history, buddy = self.buddy, room = self.room;
		history.option("userInfo", data.user);
		var ids = [];
		each(data.buddies, function(n, v){
			history.init("unicast", v.id, v.history);
		});
		buddy.handle(data.buddies);
		//rooms
		each(data.rooms, function(n, v){
			history.init("multicast", v.id, v.history);
		});
		//blocked rooms
		var b = self.setting.get("blocked_rooms"), roomData = data.rooms;
		isArray(b) && roomData && each(b,function(n,v){
			roomData[v] && (roomData[v].blocked = true);
		});
		room.handle(roomData);
		room.options.ticket = data.connection.ticket;
		self.trigger("go",[data]);
		self.connection.connect(data.connection);
		//handle new messages at last
		var n_msg = data.new_messages;
		if(n_msg && n_msg.length){
			each(n_msg, function(n, v){
				v["new"] = true;
			});
			self.trigger("message",[n_msg]);
		}
	},
	_stop: function( type, msg ){
		var self = this;
		window.onbeforeunload = self._unloadFun;
		self.data.user.presence = "offline";
		self.data.user.show = "unavailable";
		self.buddy.clear();
		self.trigger("stop", [type, msg] );
	},
	autoOnline: function(){
		return !this.status.get("o");
	},
	_initEvents: function(){
		var self = this, status = self.status, setting = self.setting, history = self.history, connection = self.connection, buddy = self.buddy;
		connection.bind("connect",function(e, data){
		}).bind("data",function( data ) {
			self.handle(data);
		}).bind("error",function(data){
			self._stop("connect", "Connect Error");
		}).bind("close",function(data){
			self._stop("connect", "Disconnect");
		});
		self.bind("message", function(data){
			var online_buddies = [], l = data.length, uid = self.data.user.id, v, id, type;
			//When revice a new message from router server, make the buddy online.
			for(var i = 0; i < l; i++){
				v = data[i];
				type = v["type"];
				id = type == "unicast" ? (v.to == uid ? v.from : v.to) : v.to;
				v["id"] = id;
				if(type == "unicast" && !v["new"]){
					var msg = {id: id, presence: "online"};
					//update nick.
					if(v.nick)msg.nick = v.nick;
					online_buddies.push(msg);
				}
			}
			if(online_buddies.length){
				buddy.presence(online_buddies);
				//the chat window will pop out, need complete info
				buddy.complete();
			}
			history.handle(data);
		});
		function mapFrom(a){ 
			var d = {id: a.from, presence: a.type}; 
			if(a.show)d.show = a.show;
			if(a.nick)d.nick = a.nick;
			if(a.status)d.status = a.status;
			return d;
		}

		self.bind("presence",function(data){
			buddy.presence(map(data, mapFrom));
			//online.length && buddyUI.notice("buddyOnline", online.pop()["nick"]);
		});
	},
	handle: function(data){
		var self = this;
		data.messages && data.messages.length && self.trigger("message",[data.messages]);
		data.presences && data.presences.length && self.trigger("presence",[data.presences]);
		data.statuses && data.statuses.length && self.trigger("status",[data.statuses]);
	},
	sendMsg: function(msg){
		var self = this;
		msg.ticket = self.data.connection.ticket;
		self.trigger("sendMsg",[msg]);
		self.request({
			type: 'post',
			url: self.options.urls.message,
			cache: false,
			data: msg
		});
	},
	sendStatus: function(msg){
		var self = this;
		msg.ticket = self.data.connection.ticket;
		self.request({
			type: 'post',
			url: self.options.urls.status,
			cache: false,
			data: msg
		});
	},
	sendPresence: function(msg){
		var self = this;
		msg.ticket = self.data.connection.ticket;
		//save show status
		self.data.user.show = msg.show;
		self.status.set("s", msg.show);
		self.request({
			type: 'post',
			url: self.options.urls.presence,
			cache: false,
			data: msg
		});
	},
	//setStranger: function(ids){
	//	this.stranger_ids = idsArray(ids);
	//},
	//stranger_ids: [],
	online:function(params){
		var self = this, status = self.status;
		var buddy_ids = [], room_ids = [], tabs = status.get("tabs"), tabIds = status.get("tabIds");
		if(tabIds && tabIds.length && tabs){
			each(tabs, function(k,v){
				if(k[0] == "b") buddy_ids.push(k.slice(2));
				if(k[0] == "r") room_ids.push(k.slice(2));
			});
		}
		params = extend({                                
			//stranger_ids: self.stranger_ids.join(","),
			buddy_ids: buddy_ids.join(","),
			room_ids: room_ids.join(","),
			show: status.get("s") || "available"
		}, params);
		self._ready(params);
		//set auto open true
		status.set("o", false);
		status.set("s", params.show);

		self.request({
			type:"post",
			dataType: "json",
			data: params,
			url: self.options.urls.online,
			success: function( data ){
				if( !data ){
					self._stop( "online", "Not Found" );
				}else if( !data.success ) {
					self._stop( "online", data.error_msg );
				}else{
					data.user = extend(self.data.user, data.user, {presence: "online"});
					self.data = data;
					self._go();
				}
			},
			error: function(data){
				self._stop( "online", "Not Found" );
			}
		});
	},
	offline:function(){
		var self = this, data = self.data;
		self.status.set("o", true);
		self.connection.close();
		self._stop("offline", "offline");
		self.request({
			type: 'post',
			url: self.options.urls.offline,
			type: 'post',
			cache: false,
			data: {
				status: 'offline',
				ticket: data.connection.ticket
			}
		});

	},
	_refresh:function(){
		var self = this, data = self.data;
		if(!data || !data.connection || !data.connection.ticket) return;
		self.request({
			type: 'post',
			url: self.options.urls.refresh,
			type: 'post',
			cache: false,
			data: {
				ticket: data.connection.ticket
			}
		});
	}

});
function idsArray(ids){
	return ids && ids.split ? ids.split(",") : (isArray(ids) ? ids : (parseInt(ids) ? [parseInt(ids)] : []));
}
function model(name, defaults, proto){
	function m(data,options){
		var self = this;
		self.data = data;
		self.options = extend({}, m.defaults,options);
		isFunction(self._init) && self._init();
	}
	m.defaults = defaults;
	extend(m.prototype, objectExtend, proto);
	webim[name] = m;
}

function route( key ) {
	return route[key];
}

//_webim = window.webim;
window.webim = webim;

extend(webim,{
	version:"1.1.0",
	defaults:{
		urls:{
			online: "webim/online",
			offline: "webim/offline",
			message: "webim/message",
			presence: "webim/presence",
			refresh: "webim/refresh",
			status: "webim/status"
		}
	},
	log:log,
	idsArray: idsArray,
	now: now,
	isFunction: isFunction,
	isArray: isArray,
	isObject: isObject,
	trim: trim,
	makeArray: makeArray,
	extend: extend,
	each: each,
	inArray: inArray,
	grep: grep,
	map: map,
	JSON: JSON,
	ajax: ajax,
	jsonp: jsonp,
	comet: comet,
	model: model,
	route: route,
	objectExtend: objectExtend
});
/*
* 配置(数据库永久存储)
* Methods:
* 	get
* 	set
*
* Events:
* 	update
* 	
*/
model("setting",{
	url: "/webim/setting",
	data: {
		blocked_rooms: [],
		play_sound:true,
		buddy_sticky:true,
		minimize_layout: true,
		msg_auto_pop:true
	}
},{
	_init:function(){
		var self = this;
		if(self.options.jsonp)
			self.request = jsonp;
		else
			self.request = ajax;
		self.data = extend({}, self.options.data, self.data);
	},
	get: function(key){
		return this.data[key];
	},
	set: function(key, value){
		var self = this, options = key;
		if(!key)return;
		if (typeof key == "string") {
			options = {};
			options[key] = value;
		}
		var _old = self.data,
		up = checkUpdate(_old, options);
		if ( up ) {
			each(up,function(key,val){
				self.trigger("update", [key, val]);
			});
			var _new = extend({}, _old, options);
			self.data = _new;
			self.request({
				type: 'post',
				url: self.options.url,
				dataType: 'json',
				cache: false,
				data: {data: JSON.stringify(_new)}
			});
		}
	}
});
/*
* 状态(cookie临时存储[刷新页面有效])
* 
* get(key);//get
* set(key,value);//set
* clear()
*/
//var d = {
//        tabs:{1:{n:5}}, // n -> notice count
//        tabIds:[1],
//        p:5, //tab prevCount
//        a:5, //tab activeTabId
//        b:0, //is buddy open
//        o:0 //has offline
//}
model("status",{
	key:"_webim"
},{
	_init:function(){
		var self = this, data = self.data;
		if (!data){
			var c = cookie(self.options.key);
			self.data = c ? JSON.parse(c) : {};
		}else{
			self._save(data);
		}
	},
	set: function(key, value){
		var options = key, self = this;
		if (typeof key == "string") {
			options = {};
			options[key] = value;
		}
		var old = self.data;
		if (checkUpdate(old, options)) {
			var _new = extend({}, old, options);
			self._save(_new);
		}
	},
	get: function(key){
		return this.data[key];
	},
	clear:function(){
		this._save({});
	},
	_save: function(data){
		this.data = data;
		cookie(this.options.key, JSON.stringify(data), {
			path: '/',
			domain: document.domain
		});
	}
});

/**
 * buddy //联系人
 * attributes：
 * 	data []所有信息 readonly 
 * methods:
 * 	get(id)
 * 	handle(data) //handle data and distribute events
 * 	presence(data) //handle buddy presence.
 * 	complete() //Complete info.
 * 	update(ids) 更新用户信息 有更新时触发events:update

 * events:
 * 	online  //  data:[]
 * 	offline  //  data:[]
 * 	update 
 */

model("buddy", {
	url:"/webim/buddy"
}, {
	_init: function(){
		var self = this;
		if(self.options.jsonp)
			self.request = jsonp;
		else
			self.request = ajax;
		self.data = self.data || [];
		self.dataHash = {};
		self.handle(self.data);
	},
	clear:function(){
		var self =this;
		self.data = [];
		self.dataHash = {};
	},
	count: function(conditions){
		var data = this.dataHash, count = 0, t;
		for(var key in data){
			if(isObject(conditions)){
				t = true;
				for(var k in conditions){
					if(conditions[k] != data[key][k]) t = false;
				}
				if(t) count++;
			}else{
				count ++;
			}
		}
		return count;
	},
	get: function(id){
		return this.dataHash[id];
	},
	complete: function(){
		var self = this, data = self.dataHash, ids = [], v;
		for(var key in data){
			v = data[key];
			if(v.incomplete && v.presence == 'online'){
				//Don't load repeat. 
				v.incomplete = false;
				ids.push(key);
			}
		}
		self.load(ids);
	},
	update: function(ids){
		this.load(ids);
	},
	presence: function(data){
		var self = this, dataHash = self.dataHash;
		data = isArray(data) ? data : [data];
		//Complete presence info.
		for(var i in data){
			var v = data[i];
			//Presence in [show,offline,online]
			v.presence = v.presence == "offline" ? "offline" : "online";
			v.incomplete = !dataHash[v.id];
		}
		self.handle(data);
	},
	load: function(ids){
		ids = idsArray(ids);
		if(ids.length){
			var self = this, options = self.options;
			self.request({
				type: "get",
				url: options.url,
				async: true,
				cache: false,
				dataType: "json",
				data:{ ids: ids.join(",")},
				context: self,
				success: self.handle
			});
		}
	},
	handle: function(addData){
		var self = this, data = self.data, dataHash = self.dataHash, status = {};
		addData = addData || [];
		var l = addData.length , v, type, add;
		//for(var i = 0; i < l; i++){
		for(var i in addData){
			v = addData[i], id = v.id;
			if(id){
				if(!dataHash[id]){
					v.presence = v.presence || "online";
					v.show = v.show ? v.show : (v.presence == "offline" ? "unavailable" : "available");
					dataHash[id] = {};
					data.push(dataHash[id]);
				}
				v.incomplete = !!v.incomplete;
				add = checkUpdate(dataHash[id], v);
				if(add){
					type = add.presence || "update";
					status[type] = status[type] || [];
					extend(dataHash[id], add);
					status[type].push(dataHash[id]);
				}
			}
		}
		for (var key in status) {
			self.trigger(key, [status[key]]);
		}
		self.options.active && self.complete();
	}
});
/*
* room
*attributes：
*data []所有信息 readonly 
*methods:
*	get(id)
*	handle()
*	join(id)
*	leave(id)
*	count()
*	initMember
*	loadMember
*	addMember
*	removeMember
*	members(id)
*	member_cont(id)
*
*events:
*	join
*	leave
*	block
*	unblock
*	addMember
*	removeMember
*
*
*/
(function(){
	model("room", {
		urls:{
			join: "/webim/join",
			leave: "/webim/leave",
			member: "/webim/members"
		}
	},{
		_init: function(){
			var self = this;
			self.data = self.data || [];
			self.dataHash = {};
			if(self.options.jsonp)
				self.request = jsonp;
			else
				self.request = ajax;
		},
		get: function(id){
			return this.dataHash[id];
		},
		block: function(id){
			var self = this, d = self.dataHash[id];
			if(d && !d.blocked){
				d.blocked = true;
				var list = [];
				each(self.dataHash,function(n,v){
					if(v.blocked) list.push(v.id);
				});
				self.trigger("block",[id, list]);
			}
		},
		unblock: function(id){
			var self = this, d = self.dataHash[id];
			if(d && d.blocked){
				d.blocked = false;
				var list = [];
				each(self.dataHash,function(n,v){
					if(v.blocked) list.push(v.id);
				});
				self.trigger("unblock",[id, list]);
			}
		},
		handle: function(d){
			var self = this, data = self.data, dataHash = self.dataHash, status = {};
			each(d,function(k,v){
				var id = v.id;
				if(id){
					v.members = v.members || [];
					v.count = v.count || 0;
					v.all_count = v.all_count || 0;
					if(!dataHash[id]){
						dataHash[id] = v;
						data.push(v);
					}
					else extend(dataHash[id], v);
					self.trigger("join",[dataHash[id]]);
				}

			});
		},
		addMember: function(room_id, info){
			var self = this;
			if(isArray(info)){
				each(info, function(k,v){
					self.addMember(room_id, v);
				});
				return;
			};
			var room = self.dataHash[room_id];
			if(room){
				var members = room.members, member;
				for (var i = members.length; i--; i){
					if (members[i].id == info.id) {
						member = members[i];
					}
				}
				if(!member){
					info.nick = info.nick;
					members.push(info);
					room.count = members.length;
					self.trigger("addMember",[room_id, info]);
				}
			}
		},
		removeMember: function(room_id, member_id){
			var room = this.dataHash[room_id];
			if(room){
				var members = room.members, member;
				for (var i = members.length; i--; i){
					if (members[i].id == member_id) {
						member = members[i];
						members.splice(i, 1);
						room.count--;
					}
				}
				member && self.trigger("removeMember",[room_id, member]);
			}
		},
		initMember: function(id){
			var room = this.dataHash[id];
			if(room && !room.initMember){
				room.initMember = true;
				this.loadMember(id);
			}
		},
		loadMember: function(id){
			var self = this, options = self.options;
			self.request({
				type: "get",
				async: true,
				cache: false,
				url: options.urls.member,
				dataType: "json",
				data: {
					ticket: options.ticket,
					id: id
				},
				success: function(data){
					self.addMember(id, data);
				}
			});
		},
		join:function(id){
			var self = this, options = self.options, user = options.user;

			self.request({
				cache: false,
				type: "post",
				async: true,
				url: options.urls.join,
				dataType: "json",
				data: {
					ticket: options.ticket,
					id: id,
					nick: user.nick
				},
				success: function(data){
					//self.trigger("join",[data]);
					self.initMember(id);
					self.handle([data]);
				}
			});
		},
		leave: function(id){
			var self = this, options = self.options, d = self.dataHash[id], user = options.user;
			if(d){
				d.initMember = false;
				self.request({
					cache: false,
					type: "post",
					url: options.urls.leave,
					data: {
						ticket: options.ticket,
						id: id,
						nick: user.nick
					}
				});
				self.trigger("leave",[d]);
			}
		},
		clear:function(){
		}
	});
})();
/*
history // 消息历史记录 Support unicast and multicast
attributes：
data 所有信息 readonly 
methods:
unicast(id) //Get
multicast(id) //Get
load(type, id)
clear(type, id)
init(type, id, data)
handle(data) //handle data and distribute events

events:
unicast //id,data
multicast //id,data
clear //type, id
*/

model("history",{
	urls:{ load:"webim/history", clear:"webim/clear_history", download: "webim/download_history" }
}, {
	_init:function(){
		var self = this;
		self.data = self.data || {};
		self.data.unicast = self.data.unicast || {};
		self.data.multicast = self.data.multicast || {};
		if(self.options.jsonp)
			self.request = jsonp;
		else
			self.request = ajax;
	},
	get: function( type, id ) {
		return this.data[type][id];
	},
	unicast: function(id){
		return this.data["unicast"][id];
	},
	multicast: function(id){
		return this.data["multicast"][id];
	},
	handle:function(addData){
		var self = this, data = self.data, cache = {"unicast": {}, "multicast": {}};
		addData = makeArray(addData);
		var l = addData.length , v, id, userId = self.options.userInfo.id;
		if(!l)return;
		for(var i = 0; i < l; i++){
			//for(var i in addData){
			v = addData[i];
			type = v.type;
			id = type == "unicast" ? (v.to == userId ? v.from : v.to) : v.to;
			if(id && type){
				cache[type][id] = cache[type][id] || [];
				cache[type][id].push(v);
			}
		}
		for (var type in cache){
			for (var id in cache[type]){
				var v = cache[type][id];
				if(data[type][id]){
					data[type][id] = data[type][id].concat(v);
					self._triggerMsg(type, id, v);
				}else{
					self.load(type, id);
				}
			}
		}
	},
	_triggerMsg: function(type, id, data){
		//this.trigger("message." + id, [data]);
		this.trigger(type, [id, data]);
	},
	clear: function(type, id){
		var self = this, options = self.options;
		self.data[type][id] = [];
		self.trigger("clear", [type, id]);
		self.request({
			url: options.urls.clear,
			type: "post",
			cache: false,
			//dataType: "json",
			data:{ type: type, id: id}
		});
	},
	download: function(type, id){
		var self = this, 
		options = self.options, 
		url = options.urls.download,
		now = (new Date()).getTime(), 
		f = document.createElement('iframe'), 
		d = new Date(),
		ar = [],
		data = {id: id, type: type, time: (new Date()).getTime(), date: d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate() };
		for (var key in data ) {
			ar[ ar.length ] = encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
		}
		url += (/\?/.test( url ) ? "&" : "?") + ar.join("&");
		f.setAttribute( "src", url );
		f.style.display = 'none'; 
		document.body.appendChild(f); 
	},
	init: function(type, id, data){
		var self = this;
		if(isArray(data)){
			self.data[type][id] = data;
			self._triggerMsg(type, id, data);
		}
	},
	load: function(type, id){
		var self = this, options = self.options;
		self.data[type][id] = [];
		self.request({
			url: options.urls.load,
			async: true,
			cache: false,
			type: "get",
			dataType: "json",
			data:{type: type, id: id},
			//context: self,
			success: function(data){
				self.init(type, id, data);
			}
		});
	}
});
})(window, document);
/*!
 * Webim UI v3.0.1
 * http://www.webim20.cn/
 *
 * Copyright (c) 2010 Hidden
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Wed Oct 13 18:37:07 2010 +0800
 * Commit: 31cf2c3b6e13125b4343efcfdee155b476710903
 */
(function(window,document,undefined){

var log = webim.log,
idsArray = webim.idsArray,
now = webim.now,
isFunction = webim.isFunction,
isArray = webim.isArray,
isObject = webim.isObject,
trim = webim.trim,
makeArray = webim.makeArray,
extend = webim.extend,
each = webim.each,
inArray = webim.inArray,
grep = webim.grep,
JSON = webim.JSON,
ajax = webim.ajax,
jsonp = webim.jsonp,
comet = webim.comet,
model = webim.model,
objectExtend = webim.objectExtend,
map = webim.map;

function returnFalse(){
	return false;
}
function HTMLEnCode(str)  
{  
	var    s    =    "";  
	if    (str.length    ==    0)    return    "";  
	s    =    str.replace(/&/g,    "&gt;");  
	s    =    s.replace(/</g,        "&lt;");  
	s    =    s.replace(/>/g,        "&gt;");  
	s    =    s.replace(/    /g,        "&nbsp;");  
	s    =    s.replace(/\'/g,      "&#39;");  
	s    =    s.replace(/\"/g,      "&quot;");  
	s    =    s.replace(/\n/g,      "<br />");  
	return    s;  
}
function isUrl(str){
	return /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"])*$/.test(str);
}

function stripHTML(str){
	return str ? str.replace(/<(?:.|\s)*?>/g, "") : "";
}

function subVisibleLength(cont,start,length){
	if(!cont) return cont;
	var l = 0,a =[],c = cont.split(''),ln=c.length;
	for(var i =0;i<ln;i++){
		if(l>=length||l<start)
			break;
		else{
			if(c[i].charCodeAt(0) > 255)l+=2;
			else l++;
			a.push(c[i]);
		}

	}
	return a.join('');
}

function $(id){
	return id ? (id.nodeType ? id : document.getElementById(id)) : null;
}

function sibling(n, elem){
	var r = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType == 1 && n != elem )
			r.push( n );
	}

	return r;
}

function children(elem){
	return sibling(elem.firstChild);
}

function hasClass(obj,name){
	return obj && (new RegExp("(^|\\s+)"+name+"(\\s+|$)").test(obj.className));

}
function addClass(obj,name){
	if(!obj)return;
	if(!hasClass(obj,name)){
		obj.className+=" "+name;
	}
}
function removeClass(obj,name){
	//支持重复className，后面的空格留给下一个重复的class匹配
	obj && (obj.className=obj.className.replace(new RegExp("(^|\\s+)("+name.split(/\s+/).join("|")+")(?=(\\s+|$))","g")," "));
}
function replaceClass(obj,_old, _new){
	obj && (obj.className=obj.className.replace(new RegExp("(^|\\s+)("+_old.split(/\s+/).join("|")+")(?=(\\s+|$))","g")," ") + " " + _new);
}
function hoverClass(obj, name, toggleClass){
	addEvent(obj,"mouseover",function(){
		addClass(this, name);
		toggleClass && (removeClass(this, toggleClass));
	});
	addEvent(obj,"mouseout",function(){
		removeClass(this, name);
		toggleClass && (addClass(this, toggleClass));
	});
}
function toggleClass(obj, name, is){
	if(typeof is === "boolean")
		is ? addClass(obj, name) : removeClass(obj,name);
	else
		hasClass(obj, name) ? removeClass(obj,name) : addClass(obj, name);
}
function show(obj){
	obj && obj.style && (obj.style.display="block")
}
function hide(obj){
	obj && obj.style && (obj.style.display="none")
}
function remove(obj){
	obj && obj.parentNode && (obj.parentNode.removeChild(obj));
}
function addEvent( obj, type, fn ) {
	if ( obj.addEventListener ) {
		obj.addEventListener( type, fn, false );
	} else{
		obj['e'+type+fn] = fn;
		obj[type+fn] = function(){return obj['e'+type+fn]( window.event );}
		obj.attachEvent( 'on'+type, obj[type+fn] );
	}
}
function removeEvent( obj, type, fn ) {
	if ( obj.addEventListener ) {
		obj.removeEventListener( type, fn, false );
	} else{
		obj.detachEvent( 'on'+type, obj[type+fn] );
		obj[type+fn] = null;
	}
}

function triggerEvent( obj, type ) {
	if ( document.createEvent ) {
		var evt = document.createEvent( 'HTMLEvents' );
		evt.initEvent( type, true, true );
		obj.dispatchEvent( evt );
	}
	if ( obj.fireEvent )
		obj.fireEvent( 'on' + type );
}

function stopPropagation(e){
	if(!e)return;
	e.stopPropagation && e.stopPropagation();
	e.cancelBubble = true;
}
function preventDefault(e){
	if(!e)return;
	e.preventDefault && e.preventDefault();
	e.returnValue = false;
}
function target(event){
	if ( !event.target ) {
		event.target = event.srcElement || document; 
		// Fixes #1925 where srcElement might not be defined either
	}
	// check if target is a textnode (safari)
	if ( event.target.nodeType === 3 ) {
		event.target = event.target.parentNode;
	}
	return event.target;
}

function enableSelection(obj) {
	obj.setAttribute("unselectable","off");
	obj.style.MozUserSelect = '';
	obj.style.WebkitUserSelect = '';
	obj.style.OUserSelect = '';
	removeEvent(obj,'selectstart', returnFalse);
}
function disableSelection(obj) {
	obj.setAttribute("unselectable","on");
	obj.style.MozUserSelect = 'none';
	obj.style.OUserSelect = 'none';
	obj.style.WebkitUserSelect = 'none';
	addEvent(obj,'selectstart', returnFalse);
}

//document ready
//

function ready(fn){
	// Attach the listeners
	bindReady();
	// If the DOM is already ready
	if ( isReady ) {
		// Execute the function immediately
		fn();
		// Otherwise, remember the function for later
	} else {
		// Add the function to the wait list
		readyList.push( fn );
	}

}

var isReady = false, readyList = [];
function triggerReady() {
	// Make sure that the DOM is not already loaded
	if ( !isReady ) {
		// Remember that the DOM is ready
		isReady = true;

		// If there are functions bound, to execute
		if ( readyList ) {
			// Execute all of them
			var fn, i = 0;
			while ( (fn = readyList[ i++ ]) ) {
				fn();
			}

			// Reset the list of functions
			readyList = null;
		}

	}
}

var readyBound = false;
function bindReady() {
	if ( readyBound ) return;
	readyBound = true;

	// Catch cases where $(document).ready() is called after the
	// browser event has already occurred.
	if ( document.readyState === "complete" ) {
		return triggerReady();
	}

	// Mozilla, Opera and webkit nightlies currently support this event
	if ( document.addEventListener ) {
		// Use the handy event callback
		document.addEventListener( "DOMContentLoaded", function() {
			document.removeEventListener( "DOMContentLoaded", arguments.callee, false );
			triggerReady();
		}, false );

		// If IE event model is used
	} else if ( document.attachEvent ) {
		// ensure firing before onload,
		// maybe late but safe also for iframes
		document.attachEvent("onreadystatechange", function() {
			if ( document.readyState === "complete" ) {
				document.detachEvent( "onreadystatechange", arguments.callee );
				triggerReady();
			}
		});

		// If IE and not an iframe
		// continually check to see if the document is ready
		// NOTE: DO NOT CHANGE TO ===, FAILS IN IE.
		if ( document.documentElement.doScroll && window == window.top ) (function() {
			if ( isReady ) {
				return;
			}

			try {
				// If IE is used, use the trick by Diego Perini
				// http://javascript.nwbox.com/IEContentLoaded/
				document.documentElement.doScroll("left");
			} catch( error ) {
				setTimeout( arguments.callee, 0 );
				return;
			}

			// and execute any waiting functions
			triggerReady();
		})();
	}
	// A fallback to window.onload, that will always work
	addEvent( window, "load", triggerReady );
}
//格式化时间输出，消除本地时间和服务器时间差，以计算机本地时间为准
//date.init(serverTime);设置时差
//date()
function date(time){
        var d = (new Date());
        d.setTime(time ? (parseFloat(time) + date.timeSkew) : (new Date()).getTime());
        this.date = d;
};
date.timeSkew = 0;
date.init = function(serverTime){//设置本地时间和服务器时间差
    date.timeSkew = (new Date()).getTime() - parseFloat(serverTime);
};
extend(date.prototype, {
    getTime: function(){
            var date = this.date;
        var hours = date.getHours();
        var ampm = '';
        /*ampm = 'am';
         if (hours >= 12) {
         ampm = 'pm';
         }
         if (hours == 0) {
         hours = 12;
         }
         else
         if (hours > 12) {
         hours -= 12;
         }
         */
        var minutes = date.getMinutes();
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        var timeStr = hours + ':' + minutes + ampm;
        return timeStr;
    },
    getDay: function(showRelative){
            var date = this.date;
        if (showRelative) {
            var today = new Date();
            today.setHours(0);
            today.setMinutes(0);
            today.setSeconds(0);
            today.setMilliseconds(0);
            var dayMilliseconds = 24 * 60 * 60 * 1000;
            var diff = today.getTime() - date.getTime();
            if (diff <= 0) {
                return i18n('dt:today');
            }
            else 
                if (diff < dayMilliseconds) {
                    return i18n('dt:yesterday');
                }
        }
        return i18n('dt:monthdate', {
                'month': i18n(['dt:january','dt:february','dt:march','dt:april','dt:may','dt:june','dt:july','dt:august','dt:september','dt:october','dt:november','dt:december'][date.getMonth()]),
                'date': date.getDate()
        });
    }
});
var sound = (function(){
        var playSound = true;
        var play = function(url){
            try {
                document.getElementById('webim-flashlib').playSound(url ? url : '/sound/sound.mp3');
            } 
            catch (e){
            }
        };
        var _urls = {
                lib: "sound.swf",
                msg:"sound/msg.mp3"
        };
        return {
                enable:function(){
                        playSound = true;
                },
                disable:function(){
                        playSound = false;
                },
                init: function(urls){
                        extend(_urls, urls);
			/*
                        swfobject.embedSWF(_urls.lib + "?_" + new Date().getTime(), "webim-flashlib-c", "100", "100", "9.0.0", null, null, {
                        allowscriptaccess:'always'
                        }, {
                            id: 'webim-flashlib'
                        });
			*/
			var lib_url = _urls.lib + "?_" + new Date().getTime();
			if (navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length) { // netscape plugin architecture
				var html = '<embed type="application/x-shockwave-flash" width="10" height="10" id="webim-flashlib" allowscriptaccess="always" src="'+lib_url+'" />';
			}else{
				var html = '<object width="10" height="10" id="webim-flashlib" type="application/x-shockwave-flash" data="'+ lib_url + '">\
				<param name="allowScriptAccess" value="always" />\
				<param name="movie" value="'+lib_url+'" />\
				<param name="scale" value="noscale" />\
				</object>';
			}
			try {
				document.getElementById('webim-flashlib-c').innerHTML = html;
			} 
			catch (e){
			}
		},
                play: function(type){
                        var url = isUrl(type) ? type : _urls[type];
                        playSound && play(url);
                }
        }
})();

/*
* set display frequency.
*/
var titleShow = (function(){
	var _showNoti = false;
	addEvent(window,"focus",function(){
		_showNoti = false;
	});
	addEvent(window,"blur",function(){
		_showNoti = true;
	});
	var title = document.title, t = 0, s = false, set = null;
	return  function(msg, time){
		if(!_showNoti) 
			return;
		if(set){
			clearInterval(set);
			t = 0;
			s = false;
		}

		var set = setInterval(function(){
			t++;
			s = !s;
			if (t == time || !_showNoti) {
				clearInterval(set);
				t = 0;
				s = false;
			}
			if (s) {
				document.title = "[" + msg + "]" + title;
			}
			else {
				document.title = title;
			}
		}, 1500);
	}
})();
/*
本地化
i18n.locale = 'zh-CN';//设置本地语言
i18n.store('zh-CN',{bbb:"test"});//添加
i18n(name,args);// 获取
*/
var i18nArgs = {};
var i18nRe = function(a, b){
	return i18nArgs[b] || "";
}
function i18n(name, args, options){
	options = extend({
		locale: i18n.locale
	}, options);
	var dict = i18n.dictionary[options.locale];
	if (!isObject(dict)) 
		dict = {};
	var str = dict[name] === undefined ? name : dict[name];

	if (args) {
		i18nArgs = args;
		for (var key in args) {
			str = str.replace(/\{\{(.*?)\}\}/g, i18nRe);
		}
	}
	return str;
};
i18n.locale = 'zh-CN';
i18n.dictionary = {};
i18n.store = function(locale, data){
	var dict = i18n.dictionary;
	if (!isObject(dict[locale])) 
		dict[locale] = {};
	extend(dict[locale], data);
};
/* webim UI */

function webimUI(element, options){
	var self = this;
	self.element = element;
	self.options = extend({}, webimUI.defaults, options);
	self._init();
}
extend(webimUI.prototype, objectExtend, {
	init: function() {
		var self = this, 
		im = self.im, 
		buddy = im.buddy, 
		history = im.history, 
		status = im.status, 
		setting = im.setting, 
		buddyUI = self.buddy, 
		layout = self.layout, 
		room = im.room;
		buddy.bind("online", function( data ){
			layout.updateChat( "buddy", data );
		}).bind("offline", function( data ){
			layout.updateChat( "buddy", data );
		}).bind("update", function( data ){
			layout.updateChat( "buddy", data );
		});
		room.bind("addMember", function(room_id, info){
			var c = layout.chat( "room", room_id );
			c && c.addMember && c.addMember( info.id, info.nick, info.id == im.data.user.id );
		}).bind("removeMember", function( room_id, info ){
			var c = layout.chat( "room", room_id );
			c && c.removeMember && c.removeMember( info.id, info.nick );
		});

		//all ready.
		//message
		im.bind( "message", function( data ){
			var show = false,
			l = data.length, d, uid = im.data.user.id, id, c, count = "+1";
			for(var i = 0; i < l; i++){
				d = data[i];
				id = d["id"], type = d["type"];
				c = layout.chat( type, id );
				c && c.status("");//clear status
				if(!c){	
					if (d.type === "unicast"){
						self.addChat( type, id, d.nick );
					}else{
						self.addChat( type, id );  
					}
					c = layout.chat( type, id );
				}
				c && setting.get("msg_auto_pop") && !layout.activeTabId && layout.focusChat(id);
				c.window.notifyUser("information", count);
				var p = c.window.pos;
				(p == -1) && layout.setNextMsgNum(count);
				(p == 1) && layout.setPrevMsgNum(count);
				if(d.from != uid) show = true;
			}
			if( show ){
				self.trigger( "newMessage" );
				sound.play('msg');
				titleShow(i18n("new message"), 5);
			}
		});

		im.bind("status", function(data){
			each(data,function(n,msg){
				var userId = im.data.user.id;
				var id = msg['from'];
				if (userId != msg.to && userId != msg.from) {
					id = msg.to; //群消息
					var nick = msg.nick;
				}else{
					var c = layout.chat("buddy", id);
					c && c.status(msg['show']);
				}
			});
		});
		//for test
		history.bind("unicast", function( id, data){
			var c = layout.chat("unicast", id), count = "+" + data.length;
			if(c){
				c.history.add(data);
			}
			//(c ? c.history.add(data) : im.addChat(id));
		});
		history.bind("multicast", function(id, data){
			var c = layout.chat("multicast", id), count = "+" + data.length;
			if(c){
				c.history.add(data);
			}
			//(c ? c.history.add(data) : im.addChat(id));
		});
		history.bind("clear", function(type, id){
			var c = layout.chat(type, id);
			c && c.history.clear();
		});
	},

	render:function() {
		this.layout.render();
	},

	addApp: function( name, options ) {
		var app = webimUI.apps[name]; 
		if ( app )
			return this[name] = app.apply( this, [options] );
	},

	addChat: function( type, id, nick ) {
		type = _tr_type( type );
		var self = this, 
		layout = self.layout, 
		buddy = self.im.buddy, 
		room = self.im.room,
		info; 
		if( layout.chat( type, id ) ) return;
		if( type == "room" ) {
			info = room.get( id ); 
		} else {
			info = buddy.get( id );
			if( !info ) buddy.update( id );
		}
		layout.addChat( type, id, self.addApp( "chat", { 
			type: type, 
			user: self.im.data.user, 
			info: info || { id:id, nick: nick || id } 
		} ) );
	},

	_init: function(){
		var self = this,
		im = self.im = new webim( null, self.options.imOptions ),
		options = self.options;
		self.addApp( "layout", options.layoutOptions );
		self._initEvents();
		isFunction( self.init ) && self.init();
	},
	_initEvents: function() {
		var self = this;
		//im events
		self.im.bind( "go", function( data ){
			date.init( data.server_time );
			//setting.set(data.setting);
		});
	}
});

var _countDisplay = function(element, count){
	if (count === undefined){
		return parseInt(element.innerHTML);
	}
	else if (count){
		count = (typeof count == "number") ? count : (parseInt(element.innerHTML) + parseInt(count));
		element.innerHTML = count.toString();
		show(element);
	}
	else {
		element.innerHTML = '0';
		hide(element);
	}
	return count;
};

function mapElements( obj ){
	var elements = obj.getElementsByTagName("*"), 
	el, id, need = {}, pre = ":", preLen = pre.length;
	for(var i = elements.length - 1; i > -1; i--){
		el = elements[i];
		id = el.id;
		if(id && id.indexOf(pre) == 0)need[id.substring(preLen, id.length)] = el;
	}
	return need;
}

function createElement(str){
	var el = document.createElement("div");
	el.innerHTML = str;
	el = el.firstChild; // release memory in IE ???
	return el;
}

var tpl = (function(){
	var dic = null, re = /\<\%\=(.*?)\%\>/ig;
	function call(a, b){
		return dic && dic[b] !=undefined ? dic[b] : i18n(b);
	}
	return function(str, hash){
		if(!str)return '';
		dic = hash;
		return str.replace(re, call);
	};
})();

var plugin = {
	add: function(module, option, set) {
		var proto = webimUI[module].prototype;
		for(var i in set){
			proto.plugins[i] = proto.plugins[i] || [];
			proto.plugins[i].push([option, set[i]]);
		}
	},
	call: function(instance, name, args) {
		var set = instance.plugins[name];
		if(!set || !instance.element.parentNode) { return; }

		for (var i = 0; i < set.length; i++) {
			if (instance.options[set[i][0]]) {
				set[i][1].apply(instance.element, args);
			}
		}
	}
};

/*
* widget
* options:
* 	template
* 	className
*
* attributes:
* 	id
* 	name
* 	className
* 	element
* 	$
*
* methods:
* 	template
*
*/
var _widgetId = 1;
function widget(name, defaults, prototype){
	function m(element, options){
		var self = this;
		self.id = _widgetId++;
		self.name = name;
		self.className = "webim-" + name;
		self.options = extend({}, m['defaults'], options);

		//template
		self.element = element || (self.template && createElement(self.template())) || ( self.options.template && createElement(tpl(self.options.template)));
		if(self.element){
			self.options.className && addClass(self.element, self.options.className);
			self.$ = mapElements(self.element);
		}
		isFunction(self._init) && self._init();
		//isFunction(self._initEvents) && setTimeout(function(){self._initEvents()}, 0);
		isFunction(self._initEvents) && self._initEvents();
	}
	m.defaults = defaults;// default options;
	// add prototype
	extend(m.prototype, objectExtend, widget.prototype, prototype);
	webimUI[name] = m;
}

extend(widget.prototype, {
	_init: function(){
	}
});

function _tr_type(type){
	return type == "b" || type == "buddy" || type == "unicast" ? "buddy" : "room";
}

function app( name, init ) {
	webimUI.apps[name] = init;
}

extend(webimUI,{
	version: "3.0.1",
	widget: widget,
	app: app,
	plugin: plugin,
	i18n: i18n,
	date: date,
	ready: ready,
	createElement: createElement,
	defaults: {},
	apps:{}
});
webim.ui = webimUI;

/* webim ui window */

widget( "window", {
	main: false,
        isMinimized: false,
        minimizable: true,
        maximizable: false,
	layoutUrl: "app:/test/air.window.html",
	iconUrl: "app:/images/logo128.png",
        closeable: true,
        count: 0, // notifyUser if count > 0
	//A box with position:absolute next to a float may disappear
	//http://www.brunildo.org/test/IE_raf3.html
	//here '<div><div id=":window"'
        template:'<div class="webim"><div id=":webim-window" class="webim-window ui-widget">\
                                            <div id=":window" class="webim-window-window webim-box">\
                                                    <div id=":header" class="webim-window-header ui-widget-header ui-corner-top">\
                                                    	<a id=":resize" title="<%=resize%>" class="webim-window-resize" href="#resize"><em class="ui-icon ui-icon-grip-diagonal-se"><%=resize%></em></a>\
                                                            <span id=":actions" class="webim-window-actions">\
                                                                    <a id=":maximize" title="<%=maximize%>" class="webim-window-maximize" href="#maximize"><em class="ui-icon ui-icon-plus"><%=maximize%></em></a>\
                                                                    <a id=":minimize" title="<%=minimize%>" class="webim-window-minimize" href="#minimize"><em class="ui-icon ui-icon-minus"><%=minimize%></em></a>\
                                                                    <a id=":close" title="<%=close%>" class="webim-window-close" href="#close"><em class="ui-icon ui-icon-close"><%=close%></em></a>\
                                                            </span>\
                                                            <h4 id=":headerTitle"><%=title%></h4>\
                                                            <div id=":subHeader" class="webim-window-subheader"></div>\
                                                    </div>\
                                                    <div id=":content" class="webim-window-content ui-widget-content webim-box webim-flex">\
                                                    </div>\
                                            </div>\
                                            </div></div>'
},
{
	html: function( obj ) {
		return this.$.content.appendChild( obj );
	},
	subHeader: function( obj ){
		//this.$.subHeader.innerHTML = "";
		return this.$.subHeader.appendChild( obj );
	},
	_init: function( element, options ) {
		var self = this, options = self.options, $ = self.$;
		element = self.element;
		options.name && addClass( element, "webim-" + options.name + "-window" );
		if ( window.runtime ) {
			if ( !options.main ) {
				var visibleBounds = air.Screen.mainScreen.visibleBounds;
				var bounds = new air.Rectangle(
					/* left */ (visibleBounds.width - 480)/2, 
					/* top */ (visibleBounds.height - 480)/2, 
					/* width */ 480,
					/* height */ 480
				);
				var op = new air.NativeWindowInitOptions();
				op.transparent = true;
				//op.type = air.NativeWindowType.LIGHTWEIGHT;
				op.systemChrome = air.NativeWindowSystemChrome.NONE;
				var loader = air.HTMLLoader.createRootWindow(  true, op, false, bounds );
				//loader.placeLoadStringContentInApplicationSandbox = true;
				//loader.paintsDefaultBackground = false;
				loader.navigateInSystemBrowser = true;
				//loader.stage.nativeWindow.alwaysInFront = true;
				//loader.stage.nativeWindow.title = "sdfwe";
				loader.load( new air.URLRequest( self.options.layoutUrl ) );
				var ready = false;
				addEvent( loader, air.Event.COMPLETE, function() {
					if ( !ready ) {
						ready = true;
						self.window = loader.window;
						self.__initEvents();
						loader.window.document.body.appendChild( element );
					}
				} );
			} else {
				self.window = window;
				self.__initEvents();
			}
		} else {
			addClass( element, "webim-browser" );
			if ( !options.main ) {
				document.body.appendChild( element );
			}
			self.__initEvents();
		}

		options.subHeader && self.subHeader( options.subHeader );
		self.title( options.title, options.icon );
		!options.minimizable && hide( $.minimize );
		!options.maximizable && hide( $.maximize );
		!options.closeable && hide( $.close );
		options.count && self.notifyUser( "information", options.count );
	},
	notifyUser: function( type, count ) {
		var self = this, $ = self.$;
		if( type == "information" ) {
			if( self.isMinimized() ) {
				//Titanium.UI.setBadge( count ? count.toString() : null );
			}
		}
	},
	_count: function(){
	},
	title: function(title, icon){
		var self = this, $ = self.$;
		$.headerTitle.innerHTML = title;
	},
	_changeState:function(state){
		var el = this.element, className = state == "restore" ? "normal" : state;
		replaceClass( el, "webim-window-normal webim-window-maximize webim-window-minimize", "webim-window-" + className );
		this.trigger( "displayStateChange", [state] );
	},
	maximize: function(){
		var self = this, win = self.window.nativeWindow;
		if( self.isMaximized() ) {
			self.restore();
		} else {
			win.maximize(); 
			self._changeState( "maximize" );
		}
	},
	restore: function() {
		var self = this, win = self.window.nativeWindow;
		win && win.restore();
		if(hasClass(self.element, "webim-window-normal"))return;
		self._changeState("restore");
	},
	minimize: function() {
		var self = this, win = self.window.nativeWindow;
		if( self.isMinimized() ) {
		} else {
			win.minimize(); 
			self._changeState( "minimize" );
		}
	},
	resize: function(){
	},
	close: function(){
		var self = this;
		if ( self.options.main ) {
			self.window.nativeWindow.visible = false;
		} else {
			self.window.nativeWindow.close();
		}
	},
	__initEvents: function() {
		var self = this, element = self.element, $ = self.$;
		var stop = function(e){
			stopPropagation(e);
			preventDefault(e);
		};

		each( children( $.actions ), function( n ,el ){
			hoverClass(el, "ui-state-hover");
		});

		each(["minimize", "maximize", "close", "resize"], function( n ,v ) {
			addEvent($[v], "click", function( e ){
				if(!this.disabled) self[v]();
				stop(e);
			});
			addEvent($[v],"mousedown",stop);
		});
		if ( window.runtime ) {
			var win = self.window.nativeWindow, doc = self.window.document,
			plat = "osx";
			self.window.htmlLoader.filters = window.runtime.Array(
				new window.runtime.flash.filters.DropShadowFilter(6, 75, 0, .4, 12, 12)
			);
			//addClass( doc.body, plat );

			addEvent( doc, "keydown", function( event ) {
				/* Close
				* osx: cmd+w metaKey+87
				* win32: alt+f4
				* Minmize
				* osx: cmd+m metaKey+77
				**/
				return;
				if ( event.metaKey && event.keyCode == 87 ) {
					self.close();
				} else if ( event.metaKey && event.keyCode == 77 ) {
					self.minimize();
				}
			} );

			addEvent( $.headerTitle, "dblclick", function() {
				if ( self._os.mac ) {
					self.minimize();
				} else {
					self.maximize();
				}
			} );

			addEvent( $.header, "mousedown", function( event ) {
				if( self.isMaximized() ) return false;
				win.startMove();
			});

			addEvent( $.resize, "mousedown", function( event ) {
				win.startResize( air.NativeWindowResize.BOTTOM_RIGHT );
			});

			if ( self.options.main ) {
				//Show window when activate the application.
				var active = function(){
					!win.visible && ( win.visible = true );
				};
				//addEvent( air.NativeApplication.nativeApplication, air.Event.ACTIVATE, active );
				addEvent( air.NativeApplication.nativeApplication, air.InvokeEvent.INVOKE, active );
				//Set application icon
				var loader = new air.Loader();
				addEvent(loader.contentLoaderInfo, air.Event.COMPLETE, function( e ){
					air.NativeApplication.nativeApplication.icon.bitmaps = new runtime.Array(e.target.content.bitmapData);
				});
				loader.load(new air.URLRequest( self.options.iconUrl ) );
			}
			//Bind events
			addEvent( win, air.NativeWindowBoundsEvent.RESIZE, function( e ) {
				self.trigger( "resize", e );
			});

			addEvent( win, air.NativeWindowBoundsEvent.MOVE, function( e ) {
				self.trigger( "move", e );
			});

			addEvent( win, air.Event.ACTIVATE, function( e ) {
				self.trigger( "activate", e );
			});
			addEvent( win, air.Event.DEACTIVATE, function( e ) {
				self.trigger( "deactivate", e );
			});
			addEvent( win, air.Event.CLOSE, function( e ) {
				self.trigger( "close", e );
			});
		}
	},
	activate: function() {
		return this.window && this.window.nativeWindow.activate();
	},
	isActive: function() {
		return this.window && this.window.nativeWindow.active;
	},
	isMaximized: function() {
		return this.window && this.window.nativeWindow.displayState == air.NativeWindowDisplayState.MAXIMIZED;
	},
	isMinimized: function() {
		return this.window && this.window.nativeWindow.displayState == air.NativeWindowDisplayState.MINIMIZED;
	},
	_os: ( function(){
		var s = window.runtime && air.Capabilities.os;
		return {
			mac: /Mac/i.test(s),
			win: /Windows/i.test(s),
			linux: /Linux/i.test(s)
		}
	} )()
});

app( "layout", function( options ) {
	options = options || {};
	var ui = this, im = ui.im;
	layoutUI = new webimUI.layout( options.layout, options.layoutOptions );
	ui.addApp( "login", extend( { container: layoutUI.element }, options.loginOptions ) );
	ui.addApp( "user", extend( { container: layoutUI.window.$.subHeader }, options.userOptions ) );
	im.bind( "go", function(){
		layoutUI.showContent();
	});
	layoutUI.window.subHeader( layoutUI.tabs.element );
	return layoutUI;
} );

widget("layout", {
	template: '<div id=":layout" class="webim-layout webim-flex webim-box">\
		<div id=":widgets" class="webim-widgets webim-flex webim-box webim-hide"></div>\
		<div id=":shortcut" class="webim-shortcut ui-widget-header webim-hide"></div>\
	</div>'
}, {
	_init: function( element, options ){
		var self = this, 
		options = self.options;
		extend( self, {
			window: new webimUI.window( null, {
				main: true,
				name: "layout",
				title: "webim",
				maximizable: true,
				icon: ""
			} ),
			widgets : {},
			chats: {},
			tabs: new webimUI.tabs( null, {
				panel: self.$.widgets
			} ),
			chatWindows : {}
		} );
		addClass( self.tabs.element, "webim-hide" );
		self.window.html( self.element );
	},
	_initEvents: function(){
		var self = this, win = self.window, $ = self.$;
		//Ie will call resize events after onload.
		return;
		var c = false;
		addEvent(win,"resize", function(){
			if(c){
				c = true;
				self.buildUI();
			}
		});
		addEvent($.next,"mousedown", function(){self._slide(-1);});
		addEvent($.next,"mouseup", function(){self._slideUp();});
		disableSelection($.next);
		addEvent($.prev,"mousedown", function(){self._slide(1);});
		addEvent($.prev,"mouseup", function(){self._slideUp();});
		disableSelection($.prev);
		addEvent($.expand, "click", function(){
			if(!self.isMinimize()) return false;
			self.expand();
			self.trigger("expand");
			return false;
		});
		addEvent($.collapse, "click", function(){
			if(self.isMinimize()) return false;
			self.collapse();
			self.trigger("collapse");
			return false;
		});
		hoverClass($.collapse, "ui-state-hover", "ui-state-default");
		hoverClass($.expand, "ui-state-hover", "ui-state-default");
	},
	render: function() {
		document.body.appendChild( this.window.element );
	},
	widget:function(name){
		return this.widgets[name];
	},
	addWidget: function( widget, options ) {
		var self = this, 
		$ = self.$,
		container = options.container,
		winOptions = extend( options, { main: false, closeable: false, subHeader: widget.header } ),
		win, el = widget.element;
		self.widgets[widget.name] = widget;
		widget.widget_title = options.title;
		if ( container == "window" ) {
			win = new webimUI.window(null, winOptions);
			win.html( el );
			widget.container = win;
		} else if ( container == "tab" ) {
			self.tabs.add( widget.element, options.title, options.icon );
			self.tabs.select( options.title );
		}
		//self.$[container ? container : "widgets"].insertBefore(win.element, before && self.widgets[before] ? self.widgets[before].window.element : null);
		//win.bind("displayStateChange", function(state){ self._widgetStateChange(this, state);});
	},
	showWidget: function( widget_name ) {
		var self = this;
		self.tabs.select( self.widgets[ widget_name ].widget_title );
	},
	focusChat: function( type, id ) {
		id = _id_with_type( type, id );
		var self = this, win = self.chatWindows[id], chat = self.chats[id];
		win && win.activate();
		//win && win.isMinimize() && win.restore();
		chat && chat.focus();
	},
	chat:function( type, id ){
		return this.chats[_id_with_type(type, id)];
	},
	updateChat: function( type, data ){
		data = makeArray(data);
		var self = this, info, l = data.length, chat;
		for(var i = 0; i < l; i++){
			info = data[i];
			chat = self.chats[_id_with_type( type, info.id )];
			chat && chat.update( info );
		}
	},
	updateAllChat: function() {
		each( this.chats, function( k,v ) {
			v.update();
		} );
	},
	addChat: function( type, id, chatUI ) {
		var self = this, chats = self.chats;
		id = _id_with_type( type, id );
		if( !chats[ id ] ) {
			var win = self.chatWindows[id] = new webimUI.window( null, {
				main: false,
				name: "chat",
				title: "webim",
				maximizable: true,
				icon: ""
			} ).bind( "close", function() {
				delete self.chatWindows[ id ];
				delete self.chats[ id ];
			} );
			chatUI.setWindow( win );
			chats[id] = chatUI;
		}
	},
	removeChat: function( type, id ) {
		//ids = idsArray(ids);
		//var self = this, id, l = ids.length, win;
		//for(var i = 0; i < l; i++){
		//win = this.chatWindows[ids[i]];
		var win = this.chatWindows[_id_with_type(type, id)];
		win && win.close();
		//}
	},
	removeAllChat: function() {
		each(this.chatWindows, function(n, win){
			win.close();
		});
	},
	showContent: function() {
		removeClass( this.$.widgets, "webim-hide" );
		removeClass( this.tabs.element, "webim-hide" );
		removeClass( this.$.shortcut, "webim-hide" );
	}
} );

function _id_with_type(type, id){
	return id ? (type == "b" || type == "buddy" || type == "unicast" ? ("b_" + id) : ("r_" + id)) : type;
}
//
/* ui.history:
 *
 options:
 attributes：

 methods:
 add(data) //
 clear

 destroy()
 events: 
 clear
 update

 */
widget("history",{
        user: {},
        info: {},
        template:'<div class="webim-history">\
                        <div id=":content" class="webim-history-content"> \
                </div></div>'
},{
	_init: function(){
		var self = this, element = self.element, options = self.options;
		plugin.call(self, "init", [null, self.ui()]);
	},
	clear:function(){
		var self = this;
		self.$.content.innerHTML = "";
		self.trigger("clear");
	},
	add: function(data){
		data = makeArray(data);
		var self = this, l = data.length, markup = [];
		if(!l)return;
		for (var i = 0; i < l; i++){
			var val = data[i];
			markup.push(self._renderMsg(val));
		}
		self.$.content.innerHTML += markup.join('');
		self.trigger("update");
	},
	_renderMsg: function(logItem){
		var self = this;
		logItem = extend({}, logItem);
		plugin.call(self, "render", [null, self.ui({msg: logItem})]);
		var  from = logItem.from, to = logItem.to, time = logItem.timestamp, msg = logItem.body, shouldTilte = true, last = self._lastLogItem, markup = [], info = self.options.info, user = self.options.user, nick;
		nick = logItem.nick;
		//var fromSelf = from == user.id;
		//var other = !fromSelf && user.id != to;

		//var nick = other ? logItem.nick : fromSelf ? user.nick : (info.nick ? '<a href="' + info.url + '">' + info.nick + '</a>' : info.id);
		if (last && last.to == to && last.from == from && time - last.timestamp < 60000){
			shouldTilte = false;
		}
		//markup.push(self._renderDateBreak(time));
		if (shouldTilte) {
			self._lastLogItem = logItem;
			var t = (new date(time));
			markup.push('<h4><span class="webim-gray">');
			markup.push(t.getDay(true));
			markup.push(" ");
			markup.push(t.getTime());
			markup.push('</span>');
			markup.push(nick);
			markup.push('</h4><hr class="webim-line ui-state-default" />');
		}

		markup.push('<p>');
		markup.push(msg);
		markup.push('</p>');
		return markup.join("");
	},
	_renderDateBreak: function(time){
		var self = this, last = self._lastLogItem, newDate = new Date(), lastDate = new Date(), markup = [];
		newDate.setTime(time);
		last && lastDate.setTime(last.timestamp);
		if(!last || newDate.getDate() != lastDate.getDate() || newDate.getMonth() != lastDate.getMonth()){
			markup.push("<h5>");
			markup.push((new date(time)).getDay(true));
			markup.push("</h5>");
		}
		return markup.join("");
	},
	ui:function(ext){
		var self = this;
		return extend({
			element: self.element,
			$: self.$
		}, ext);
	},
	plugins:{}

});
//<p class="webim-history-actions"> \
//                                                        <a href="#"><%=clear history%></a> \
//                                                        </p> \

var autoLinkUrls = (function(){
	var attrStr;
	function filterUrl(a, b, c){
		return '<a href="' + (b=='www.' ? ('http://' + a) : a) + '"' + attrStr + '>' + a + '</a>'
	}
		function serialize(key, val){
			attrStr += ' ' + key + '="' + val + '"';
		}
		return function(str, attrs){
			attrStr = "";
			attrs && isObject(attrs) && each(attrs, serialize);
			return str.replace(/(https?:\/\/|www\.)([^\s<]+)/ig, filterUrl);
		};
})();

webimUI.history.defaults.parseMsg = true;
plugin.add("history","parseMsg",{
	render:function(e, ui){
		var msg = ui.msg.body;
		msg = HTMLEnCode(msg);
		msg = autoLinkUrls(msg, {target:"_blank"});
		ui.msg.body = msg;
	}
});

webimUI.history.defaults.emot = true;
plugin.add("history","emot",{
	render:function(e, ui){
		ui.msg.body = webimUI.emot.parse(ui.msg.body);
	}
});


widget("emot", {
                template: '<div class="webim-emot ui-widget-content"><%=emots%></div>'
},{
        _init: function(options){
                var self = this, element = self.element;
		each(element.firstChild.childNodes, function(i,v){
			addEvent(v, "click", function(e){
				removeClass(element, "webim-emot-show");
				self.trigger('select', this.firstChild.getAttribute('rel'));
			});
		});
        },
	template: function(){
                var self = this, emots = self.emots = webim.ui.emot.emots;
                var markup = [];
                markup.push('<ul class="ui-helper-clearfix">');
                each(emots, function(n, v){
                    var src = v.src, title = v.t ? v.t : v.q[0];
                    markup.push('<li><img src="');
                    markup.push(src);
                    markup.push('" title="');
                    markup.push(title);
                    markup.push('" alt="');
                    markup.push(v.q[0]);
                    markup.push('" rel="');
                    markup.push(v.q[0]);
                    markup.push('" /></li>');
                });
                markup.push('</ul>');
		return tpl(self.options.template, { emots: markup.join('')});

	},
        toggle: function(){
                toggleClass(this.element, "webim-emot-show");
        }
});
extend(webimUI.emot, {
        emots: [
                {"t":"smile","src":"smile.png","q":[":)"]},
                {"t":"smile_big","src":"smile-big.png","q":[":d",":-d",":D",":-D"]},
                {"t":"sad","src":"sad.png","q":[":(",":-("]},
                {"t":"wink","src":"wink.png","q":[";)",";-)"]},
                {"t":"tongue","src":"tongue.png","q":[":p",":-p",":P",":-P"]},
                {"t":"shock","src":"shock.png","q":["=-O","=-o"]},
                {"t":"kiss","src":"kiss.png","q":[":-*"]},
                {"t":"glasses_cool","src":"glasses-cool.png","q":["8-)"]},
                {"t":"embarrassed","src":"embarrassed.png","q":[":-["]},
                {"t":"crying","src":"crying.png","q":[":'("]},
                {"t":"thinking","src":"thinking.png","q":[":-\/",":-\\"]},
                {"t":"angel","src":"angel.png","q":["O:-)","o:-)"]},
                {"t":"shut_mouth","src":"shut-mouth.png","q":[":-X",":-x"]},
                {"t":"moneymouth","src":"moneymouth.png","q":[":-$"]},
                {"t":"foot_in_mouth","src":"foot-in-mouth.png","q":[":-!"]},
                {"t":"shout","src":"shout.png","q":[">:o",">:O"]}
        ],
        init: function(options){
            var emot = webim.ui.emot, q = emot._q = {};
            options = extend({
                dir: 'webim/static/emot/default'
            }, options);
            if (options.emots) 
                emot.emots = options.emots;
            var dir = options.dir + "/";
            each(emot.emots, function(key, v){
                if (v && v.src) 
                    v.src = dir + v.src;
                v && v.q &&
                each(v.q, function(n, val){
                    q[val] = key;

                });

            });
        },
        parse: function(str){
            var q = webim.ui.emot._q, emots = webim.ui.emot.emots;
            q && each(q, function(n, v){
                var emot = emots[v], src = emot.src, title = emot.t ? emot.t : emot.q[0], markup = [];
                markup.push('<img src="');
                markup.push(src);
                markup.push('" title="');
                markup.push(title);
                markup.push('" alt="');
                markup.push(emot.q[0]);
                markup.push('" />');
                n = HTMLEnCode(n);
                n = n.replace(new RegExp('(\\' + '.$^*\\[]()|+?{}:<>'.split('').join('|\\') + ')', "g"), "\\$1");
                str = str.replace(new RegExp(n, "g"), markup.join(''));

            });
            return str;
        }
});
//
/* ui.chat:
*
options:
window
history

methods:
update(info)
status(type)
insert(text, isCursorPos)
focus
notice(text, timeOut)
destroy()

events: 
sendMsg
sendStatus

*/

app( "chat", function( options ) {
	options = options || {};
	var ui = this, 
	im = ui.im,
	buddy = im.buddy,
	room = im.room,
	history = im.history,
	info = options.info,
	id = info.id,
	type = options.type;
	if( type == "room" ) {
		info.presence = "online";
		var h = history.get( "multicast", id );
		if( !h )
			history.load( "multicast", id );
		extend( options, { history: h, block: true, emot: true, clearHistory: false, member: true, msgType: "multicast" } );
		var chatUI = new webimUI.chat( null, options );
		chatUI.bind( "sendMsg", function( msg ) {
			im.sendMsg( msg );
			history.handle( msg );
		}).bind("downloadHistory", function( info ){
			history.download( "multicast", info.id );
		}).bind("select", function( info ) {
			info.presence = "online";
			buddy.presence( info );//online
			self.addChat( "buddy", info.id, info.nick );
			layout.focusChat( "buddy", info.id );
		}).bind("block", function( d ){
			room.block( d.id );
		}).bind("unblock", function( d ) {
			room.unblock( d.id );
		}).bind( "destroy", function() {
			chatUI.options.info.blocked && room.leave(id);
		});
		setTimeout( function(){
			if( chatUI.options.info.blocked )
				room.join( id );
			else room.initMember( id );
		}, 500 );
		isArray( info.members ) && each( info.members, function( n, info ){
			chatUI.addMember( info.id, info.nick, info.id == im.data.user.id );
		} );

	} else {
		var h = history.get( "unicast", id );
		if( !h )
			history.load( "unicast", id );
		extend( options, { history: h, block: false, emot:true, clearHistory: true, member: false, msgType: "unicast" } );
		var chatUI = new webimUI.chat( null, options );

		chatUI.bind("sendMsg", function( msg ) {
			im.sendMsg( msg );
			history.handle( msg );
		}).bind("sendStatus", function( msg ) {
			im.sendStatus( msg );
		}).bind("clearHistory", function( info ){
			history.clear( "unicast", info.id );
		}).bind("downloadHistory", function( info ) {
			history.download( "unicast", info.id );
		});
	}
	return chatUI;
} );

widget("chat",{
	tpl_header: '<div><div id=":user" class="webim-user"> \
			<a id=":userPic" class="webim-user-pic ui-corner-all ui-state-active" href="#id"><img width="50" height="50" src="" defaultsrc="" onerror="var d=this.getAttribute(\'defaultsrc\');if(d && this.src!=d)this.src=d;" class="ui-corner-all"></a> \
			<span id=":userStatus" title="" class="webim-user-status">&nbsp;</span> \
		     </div></div>',
        template:'<div class="webim-chat webim-box webim-flex"> \
				<div class="webim-chat-notice-wrap"><div id=":notice" class="webim-chat-notice ui-state-highlight"></div></div> \
                                                <div id=":content" class="webim-chat-content webim-flex"> \
                                                                                                                <div id=":status" class="webim-chat-status webim-gray"></div> \
                                                </div> \
                                                <div id=":actions" class="webim-chat-actions"> \
                                                        <div id=":toolContent" class="webim-chat-tool-content"></div>\
                                                        <div id=":tools" class="webim-chat-tools ui-helper-clearfix ui-state-default"></div>\
                                                        <table class="webim-chat-t" cellSpacing="0"> \
                                                                <tr> \
                                                                        <td style="vertical-align:top;"> \
                                                                        <em class="webim-icon webim-icon-chat-edit"></em>\
                                                                        </td> \
                                                                        <td style="vertical-align:top;width:100%;"> \
                                                                        <div class="webim-chat-input-wrap">\
                                                                                <textarea id=":input" class="webim-chat-input webim-gray ui-widget-content"><%=input notice%></textarea> \
                                                                        </div> \
                                                                        </td> \
                                                                </tr> \
                                                        </table> \
                                                </div> \
                                        </div>'
},{
	_init: function(){
		var self = this, element = self.element, options = self.options, win = options.window;
		var history = self.history = new webimUI.history(null,{
			user: options.user,
			info: options.info
		});
		self.$.content.insertBefore(history.element, self.$.content.firstChild);
		self.header = createElement(tpl(options.tpl_header));
		extend(self.$, mapElements(self.header));
		//self._initEvents();
		if(win){
			self.setWindow( win );
		}
		if(options.simple){
			hide(self.header);
		}
		self.update(options.info);
		history.add(options.history);
		plugin.call(self, "init", [null, self.ui()]);
		self._adjustContent();
	},
	setWindow: function( win ) {
		var self = this;
		self.window = win;
		win.subHeader( self.header );
		win.html( self.element );
		win.title( self.options.info.nick );
		self._bindWindow();
	},
	update: function(info){
		var self = this;
		if(info){
			self.option("info", info);
			self.history.option("info", info);
			self._updateInfo(info);
		}
		var userOn = self.options.user.presence == "online";
		var buddyOn = self.options.info.presence == "online";
		if(!userOn){
			self.notice(i18n("user offline notice"));
		}else if(!buddyOn){
			self.notice(i18n("buddy offline notice",{name: self.options.info.nick}));
		}else{
			self.notice("");
		}
		plugin.call(self, "update", [null, self.ui()]);
	},
	focus: function(){
		//this.$.input.focus();
    //fix firefox
    var item = this.$.input;
    window.setTimeout(function(){item.focus()},0);
	},
	_noticeTime: null,
	_noticeTxt:"",
	notice: function(text, timeOut){
		var self = this, content = self.$.notice, time = self._noticeTime;
		if(time)clearTimeout(time);
		if(!text){
			self._noticeTxt = null;
			hide(content);
			return;
		}
		if(timeOut){
			content.innerHTML = text;
			show(content);
			setTimeout(function(){
				if(self._noticeTxt)
					content.innerHTML = self._noticeTxt;
				else hide(content, 500);
			}, timeOut);

		}else{
			self._noticeTxt = text;
			content.innerHTML = text;
			show(content);
		}
	},
	_adjustContent: function(){
		var content = this.$.content;
		if ( content.scrollHeight - content.scrollTop < 200 )
			content.scrollTop = content.scrollHeight;
	},
	_fitUI: function(e){
		var self = this, win = self.window, $ = self.$;
		self._adjustContent();

	},
	_bindWindow: function(){
		var self = this, win = self.window;
		win.bind("displayStateChange", function(type){
			if(type != "minimize"){
        //fix firefox
        window.setTimeout(function(){self.$.input.focus();},0);
				//self.$.input.focus();
				self._adjustContent();
			}
		}).bind("close", function(){
			self.destroy();
		});
		//win.bind("resize",{self: self}, self._fitUI);
	},
	_inputAutoHeight:function(){
		var el = this.$.input, scrollTop = el[0].scrollTop;
		if(scrollTop > 0){
			var h = el.height();
			if(h> 32 && h < 100) el.height(h + scrollTop);
		}
	},
	_sendMsg: function(val){
		var self = this, options = self.options, info = options.info;
		var msg = {
			type: options.msgType,
			to: info.id,
			from: options.user.id,
			nick: options.user.nick,
			//stype: '',
			offline: info.presence != "online",
			timestamp: (new Date()).getTime(),
			body: val
		};
		plugin.call(self, "send", [null, self.ui({msg: msg})]);
		self.trigger('sendMsg', msg);
		//self.sendStatus("");
	},
	_inputkeypress: function(e){
		var self =  this, $ = self.$;
		if (e.keyCode == 13){
			if(e.ctrlKey){
				self.insert("\n", true);
				return true;
			}else{
				var el = target(e), val = el.value;
				// "0" will false
				if (trim(val).length) {
					self._sendMsg(val);
					el.value = "";
					preventDefault(e);
				}
			}
		}
		else self._typing();

	},
	_onFocusInput: function(e){
		var self = this, el = target(e);

		//var val = el.setSelectionRange ? el.value.substring(el.selectionStart, el.selectionEnd) : (window.getSelection ? window.getSelection().toString() : (document.selection ? document.selection.createRange().text : ""));
		var val = window.getSelection ? window.getSelection().toString() : (document.selection ? document.selection.createRange().text : "");
		if(!val){
      //self.$.input.focus();
      //fix firefox
      window.setTimeout(function(){self.$.input.focus();},0);
    }
	},
	_initEvents: function(){
		var self = this, options = self.options, $ = self.$, placeholder = i18n("input notice"), gray = "webim-gray", input = $.input;

		self.history.bind("update", function(){
			self._adjustContent();
		}).bind("clear", function(){
			self.notice(i18n("clear history notice"), 3000);
		});
		//输入法中，进入输入法模式时keydown,keypress触发，离开输入法模式时keyup事件发生。
		//autocomplete之类事件放入keyup，回车发送事件放入keydown,keypress

		addEvent(input,'keyup',function(){
			ieCacheSelection.call(this);
		});
		addEvent(input,"click", ieCacheSelection);
		addEvent(input,"select", ieCacheSelection);
		addEvent(input,'focus',function(){
			removeClass(this, gray);
			if(this.value == placeholder)this.value = "";
		});
		addEvent(input,'blur',function(){
			if(this.value == ""){
				addClass(this, gray);
				this.value = placeholder;
			}
		});
		addEvent(input,'keypress',function(e){
			self._inputkeypress(e);
		});
		addEvent($.content, "click", function(e){self._onFocusInput(e)});

	},
	_updateInfo:function(info){
		var self = this, $ = self.$;
		$.userPic.setAttribute("href", info.url);
		$.userPic.firstChild.setAttribute("defaultsrc", info.default_pic_url ? info.default_pic_url : "");
		setTimeout(function(){
			if(info.pic_url || info.default_pic_url) {
				$.userPic.firstChild.setAttribute("src", info.pic_url || info.default_pic_url);
			}
		},100);
		$.userStatus.innerHTML = stripHTML(info.status) || "&nbsp";
		self.window && self.window.title( info.nick, info.show );
	},
	insert:function(value, isCursorPos){
		//http://hi.baidu.com/beileyhu/blog/item/efe29910f31fd505203f2e53.html
		var self = this,input = self.$.input;
		input.focus();
		if(!isCursorPos){
			input.value = value;
			return;
		}
		if(!value) value = "";
		if(input.setSelectionRange){
			var val = input.value, rangeStart = input.selectionStart, rangeEnd = input.selectionEnd, tempStr1 = val.substring(0,rangeStart), tempStr2 = val.substring(rangeEnd), len = value.length;  
			input.value = tempStr1+value+tempStr2;  
			input.setSelectionRange(rangeStart+len,rangeStart+len);
		}else if(document.selection){
			var caretPos = input.caretPos;
			if(caretPos){
				caretPos.text = value;
				caretPos.collapse();
				caretPos.select();
			}
			else{
				input.value += value;
			}
		}else{
			input.value += value;
		}
	},
	_statusText: '',
	sendStatus: function(show){
		var self = this;
		if (!show || show == self._statusText || self.options.info.presence == "offline") return;
		self._statusText = show;
		self.trigger('sendStatus', {
			to: self.options.info.id,
			show: show
		});
	},
	_checkST: false,
	_typing: function(){
		var self = this;
		self.sendStatus("typing");
		if (self._checkST) 
			clearTimeout(self._checkST);
		self._checkST = window.setTimeout(function(){
			self.sendStatus('clear');
		}, 6000);
	},
	_setST: null,
	status: function(type){
		//type ['typing']
		type = type || 'clear';
		var self = this, el = self.$.status, nick = self.options.info.nick, markup = '';
		markup = type == 'clear' ? '' : nick + i18n(type);
		el.innerHTML = markup;
		self._adjustContent();
		if (self._setST)  clearTimeout(self._setST);
		if (markup != '') 
			self._setST = window.setTimeout(function(){
				el.innerHTML = '';
			}, 10000);
	},
	destroy: function(){
		this.trigger( "destroy" );
	},
	ui:function(ext){
		var self = this;
		return extend({
			self: self,
			$: self.$,
			history: self.history
		}, ext);
	},
	plugins: {}
});

/*
webimUI.chat.defaults.fontcolor = true;
plugin.add("chat","fontcolor",{
	init:function(e, ui){
		var chat = ui.self;
		var fontcolor = new webimUI.fontcolor();
		fontcolor.bind("select",function(alt){
			chat.focus();
			chat.setStyle("color", alt);
		});
		var trigger = createElement(tpl('<a href="#chat-fontcolor" title="<%=font color%>"><em class="webim-icon webim-icon-fontcolor"></em></a>'));
		addEvent(trigger,"click",function(e){
			preventDefault(e);
			fontcolor.toggle();
		});
		ui.$.toolContent.appendChild(fontcolor.element);
		ui.$.tools.appendChild(trigger);
	},
	send:function(e, ui){
	}
});
*/

webimUI.chat.defaults.emot = true;
plugin.add("chat","emot",{
	init:function(e, ui){
		var chat = ui.self;
		var emot = new webimUI.emot();
		emot.bind("select",function(alt){
     
			chat.focus();
			chat.insert(alt, true);
		});
		var trigger = createElement(tpl('<a href="#chat-emot" title="<%=emot%>"><em class="webim-icon webim-icon-emot"></em></a>'));
		addEvent(trigger,"click",function(e){
			preventDefault(e);
			emot.toggle();
		});
		ui.$.toolContent.appendChild(emot.element);
		ui.$.tools.appendChild(trigger);
	},
	send:function(e, ui){
	}
});

webimUI.chat.defaults.clearHistory = true;
plugin.add("chat","clearHistory",{
	init:function(e, ui){
		var chat = ui.self;
		var trigger = createElement(tpl('<a href="#chat-clearHistory" title="<%=clear history%>"><em class="webim-icon webim-icon-clear"></em></a>'));
		addEvent(trigger,"click",function(e){
			preventDefault(e);
			chat.trigger("clearHistory",[chat.options.info]);
		});
		ui.$.tools.appendChild(trigger);
	}
});
webimUI.chat.defaults.block = true;
plugin.add("chat","block",{
	init:function(e, ui){
		var chat = ui.self;
		var blocked = chat.options.info.blocked,
		nick = chat.options.info.nick,
		block = createElement('<a href="#chat-block" style="display:'+(blocked ? 'none' : '')+'" title="'+ i18n('block group',{name:nick}) +'"><em class="webim-icon webim-icon-unblock"></em></a>'),
		unblock = createElement('<a href="#chat-block" style="display:'+(blocked ? '' : 'none')+'" title="'+ i18n('unblock group',{name:nick}) +'"><em class="webim-icon webim-icon-block"></em></a>');
		addEvent(block,"click",function(e){
			preventDefault(e);
			hide(block);
			show(unblock);
			chat.trigger("block",[chat.options.info]);
		});
		addEvent(unblock,"click",function(e){
			preventDefault(e);
			hide(unblock);
			show(block);
			chat.trigger("unblock",[chat.options.info]);
		});
		ui.$.tools.appendChild(block);
		ui.$.tools.appendChild(unblock);
	}
});
webimUI.chat.defaults.member = true;
extend(webimUI.chat.prototype, {
	addMember: function(id, nick, disable){
		var self = this, ul = self.$.member, li = self.memberLi;
		if(li[id])return;
		var el = createElement('<li><a class="'+ (disable ? 'ui-state-disabled' : '') +'" href="'+ id +'">'+ nick +'</a></li>');
		addEvent(el.firstChild,"click",function(e){
			preventDefault(e);
			disable || self.trigger("select", [{id: id, nick: nick}]);
		});
		li[id] = el;
		self.$.member.appendChild(el);
		self.$.memberCount.innerHTML = parseInt(self.$.memberCount.innerHTML) + 1;
	},
	removeMember: function(id){
		var self = this, el = self.memberLi[id];
		if(el){
			self.$.member.removeChild(el);
			delete self.memberLi[id];
			self.$.memberCount.innerHTML = parseInt(self.$.memberCount.innerHTML) - 1;
		}
	}
});
plugin.add("chat","member",{
	init:function(e, ui){
		var chat = ui.self, $ = ui.$;
		chat.memberLi = {};
		var member = createElement(tpl('<div class="webim-member ui-widget-content ui-corner-left"><iframe id=":bgiframe" class="webim-bgiframe" frameborder="0" tabindex="-1" src="about:blank;" ></iframe><h4><%=room member%>(<span id=":memberCount">0</span>)</h4><ul id=":ul"></ul></div>')), els = mapElements(member);
		$.member = els.ul;
		$.memberCount = els.memberCount;
		$.content.parentNode.insertBefore(member, $.content);
	}
});

webimUI.chat.defaults.downloadHistory = true;
plugin.add("chat","downloadHistory",{
	init:function(e, ui){
		var chat = ui.self;
		var trigger = createElement(tpl('<a style="float: right;" href="#chat-downloadHistory" title="<%=download history%>"><em class="webim-icon webim-icon-download"></em></a>'));
		addEvent(trigger,"click",function(e){
			preventDefault(e);
			chat.trigger("downloadHistory",[chat.options.info]);
		});
		ui.$.tools.appendChild(trigger);
	}
});

function ieCacheSelection(e){
        document.selection && (this.caretPos = document.selection.createRange());
}
//
/* ui.setting:
*
options:
data

attributes：

methods:
check_tag

destroy()
events: 
change

*/
app("setting", {
	init: function(options){
		var ui = this, im = ui.im, setting = im.setting, layout = ui.layout;
		var settingUI = ui.setting = new webimUI.setting(null, options);
		layout.addWidget(settingUI, {
			title: i18n("setting"),
			icon: "setting",
			sticky: false,
			onlyIcon: true,
			isMinimize: true
		});
		//setting events
		setting.bind("update",function(key, val){
			if(typeof val != "object"){
				settingUI.check_tag(key, val);
			}
		});
		settingUI.bind("change", function(key, val){
			setting.set(key, val);
		});
		//handle 
		//settingUI.bind("offline",function(){
		//	im.trigger("stop");
		//});
		//settingUI.bind("online",function(){
		//	im.trigger("ready");  
		//	im.online();
		//});
	},
	//ready: function(){
	//	//this.setting.online();
	//},
	//go: function(){
	//},
	stop: function(){
		//this.setting.offline();
	}
});
widget("setting",{
	template: '<div id="webim-setting" class="webim-setting">\
			<ul id=":ul"><%=tags%></ul>\
		   </div>',
	tpl_check: '<li id=":<%=name%>"><input type="checkbox" <%=checked%> id="webim-setting-<%=name%>" name="<%=name%>"/><label for="webim-setting-<%=name%>"><%=label%></label></li>'
},{
	_init: function(){
		//this._initEvents();
	},
	template: function(){
		var self = this, temp = [], data = self.options.data;
		data && each(data, function(key, val){
			if(val && typeof val != "boolean") {
				return;
			}
			temp.push(self._check_tpl(key, val));
		});
		return tpl(self.options.template,{
			tags:temp.join("")
		});
	},
	_initEvents:function(){
		var self = this, data = self.options.data, $ = self.$;
		data && each(data, function(key, val){
			$[key] && self._check_event($[key]);
		});
		//addEvent($.offline,"click",function(e){
		//	self.trigger("offline");
		//});
		//addEvent($.online,"click",function(e){
		//	self.trigger("online");
		//});
	},
	//offline:function(){
	//	var $ = this.$;
	//	hide($.offline);//.style.display="none";
	//	show($.online);//.style.display="block";   
	//},
	//online:function(){
	//	var $ = this.$;
	//	show($.offline);//.style.display="block";
	//	hide($.online);//.style.display="none";   
	//},
	_check_tpl: function(name, isChecked){
		return tpl(this.options.tpl_check,{
			label: i18n(name),
			name: name,
			checked: isChecked ? 'checked="checked"' : ''
		});
	},
	_check_event: function(el){
		var self = this;
		addEvent(el.firstChild, "click", function(e){
			self._change(this.name, this.checked);
		});
	},
	check_tag: function(name, isChecked){
		var self = this;
		if(isObject(name)){
			each(name, function(key,val){
				self.check_tag(key, val);
			});
			return;
		}
		var $ = self.$, tag = $[name];
		if(isChecked && typeof isChecked != "boolean") {
			return;
		}
		if(tag){
			tag.firstChild.checked = isChecked;
			return;
		}
		var el = $[name] = createElement(self._check_tpl(name, isChecked));
		self._check_event(el);
		$.ul.appendChild(el);
	},
	_change:function(name, value){
		this.trigger("change", [name, value]);
	},
	destroy: function(){
	}
});
/* 
* ui.user:
*
*/
app( "user", function( options ) {
	options = options || {};
	var ui = this, im = ui.im;
	var userUI = new webimUI.user();
	hide( userUI.element );
	options.container && options.container.appendChild( userUI.element );
	userUI.bind("online", function( params ) {
		im.online( params );
	}).bind("offline", function(){
		im.offline();
	}).bind("presence", function( params ) {
		im.sendPresence( params );
	} );
	userUI.update( im.data.user );
	im.bind( "go", function() {
		show( userUI.element );
		userUI.update( im.data.user );
	}).bind( "stop", function( type ) {
		userUI.show( "unavailable" );
	});
	return userUI;
} );

widget("user",{
	template: '<div>  \
		<div id=":user" class="webim-user"> \
			<a id=":userPic" class="webim-user-pic ui-corner-all ui-state-active" href="#id"><img width="50" height="50" defaultsrc="" onerror="var d=this.getAttribute(\'defaultsrc\');if(d && this.src!=d)this.src=d;" class="ui-corner-all"></a> \
				<div class="webim-user-show"><h4><a  id=":userShowTrigger" href="#show"><strong id=":userNick"></strong><span id=":userShow"><em class="webim-icon webim-icon-unavailable"><%=unavailable%></em><%=unavailable%></span><em class="ui-icon ui-icon-triangle-1-s"><%=show_status_list%></em></a></h4>\
					<p id=":userShowList" class="ui-state-active ui-corner-all" style="display: none;">\
						<a href="#available" class="webim-user-show-available"><em class="webim-icon webim-icon-available"><%=available%></em><%=available%></a>\
						<a href="#dnd" class="webim-user-show-dnd"><em class="webim-icon webim-icon-dnd"><%=dnd%></em><%=dnd%></a>\
						<a href="#away" class="webim-user-show-away"><em class="webim-icon webim-icon-away"><%=away%></em><%=away%></a>\
						<a href="#invisible" class="webim-user-show-invisible"><em class="webim-icon webim-icon-invisible"><%=invisible%></em><%=invisible%></a>\
						<a href="#unavailable" class="webim-user-show-unavailable"><em class="webim-icon webim-icon-unavailable"><%=unavailable%></em><%=unavailable%></a>\
					</p>\
				</div> \
					<span id=":userStatus" title="" class="webim-user-status"></span> \
						</div> \
							</div>'
},{
	_init: function(){
		var self = this;
	},
	_initEvents: function(){
		var self = this, $ = self.$, trigger = $.userShowTrigger, list = $.userShowList;
		//hoverClass(trigger, "ui-state-hover");
		addEvent(trigger, "click", function(e){
			list.style.display == "block" ? hide(list) : show(list);
			preventDefault(e);
		});
		each(children(list), function(n, el){
			addEvent(el, "click", function(e){
				self._set(this.href.split("#")[1]);
				hide(list);
				preventDefault(e);
			});
		});
	},
	update: function(info){
		var self = this, type = info.show || "unavailable", $ = self.$;
		self.options.info = info;
		$.userStatus.innerHTML =  stripHTML(info.status) || "&nbsp;";
		$.userNick.innerHTML = info.nick || "";
		$.userPic.setAttribute("href", info.url);
		$.userPic.firstChild.setAttribute("defaultsrc", info.default_pic_url ? info.default_pic_url : "");
		setTimeout(function(){
			if(info.pic_url || info.default_pic_url) {
				$.userPic.firstChild.setAttribute("src", info.pic_url || info.default_pic_url);
			}
		},100);
		self.show(type);
	},
	show: function( type ) {
		var self = this, t = i18n(type);
		self.$.userShow.innerHTML = "<em class=\"webim-icon webim-icon-"+type+"\">"+t+"</em>"+t;
	},
	_set: function(type){
		var self = this, info = self.options.info;
		self.show(type);
		if(!info){
			//offline
			if(type != "unavailable"){
				//self.show(type);
				self.trigger("online", [{show: type}]);
			}
		}else if(info.show != type) {
			if(type == "unavailable"){
				self.trigger( "offline", [] );
			}else if( info.show == "unavailable" ) {
				self.trigger("online", [{show: type}]);
			}else{
				self.trigger("presence", [{show: type, status: info.status}]);
			}
		}
	},
	destroy: function(){
	}
});

/* 
* ui.login:
*
*/
app("login", function( options ) {
	options = options || {};
	var ui = this, im = ui.im;
	var loginUI = new webimUI.login(null, options);
	options.container && options.container.appendChild( loginUI.element );
	loginUI.bind( "login", function( params ){
		im.online( params );
	});
	im.bind("go", function() {
		loginUI.hide();
	}).bind("stop", function( type, msg ) {
		type == "online" && loginUI.showError( msg );
	});
	return loginUI;
});

widget("login", {
	questions: null,
	notice: "",
	template: '<div>  \
		<div id=":login" class="webim-login"> \
			<div class="webim-login-logo" id=":logo"></div>\
			<div class="webim-login-notice" id=":notice"></div>\
			<div class="ui-state-error webim-login-error ui-corner-all" style="display: none;" id=":error"></div>\
			<form id=":form">\
				<p class="ui-helper-clearfix"><label for=":username"><%=username%></label><input name="username" id=":username" type="text" /></p>\
				<p class="ui-helper-clearfix"><label for=":password"><%=password%></label><input name="password" id=":password" type="password" /></p>\
				<div id=":more">\
				<p class="ui-helper-clearfix"><label for=":question"><%=question%></label><select name="question" id=":question" ></select></p>\
				<p class="ui-helper-clearfix"><label for=":answer"><%=answer%></label><input name="answer" id=":answer" type="text" /></p>\
				</div>\
				<p class="ui-helper-clearfix"><input name="submit" id=":submit" class="ui-state-default ui-corner-all webim-login-submit" value="<%=login%>" type="submit" /></p>\
			</form>\
		</div>'
},{
	_init: function() {
		var self = this, questions = self.options.questions, $ = self.$;
		if ( questions && questions.length ) {
			each( questions, function(n, v) {
				var option = document.createElement( "option" );
				option.value = v[0];
				option.innerHTML = v[1];
				$.question.appendChild( option );
			} );
		} else {
			hide( $.more );
		}
		$.notice.innerHTML = self.options.notice;
		
	},
	_initEvents: function() {
		var self = this, $ = self.$;
		hoverClass( $.submit, "ui-state-hover" );
		addEvent( $.form, "submit", function( e ) {
			preventDefault( e );
			self.trigger( "login", [{ username: $.username.value,  password: $.password.value, question: $.question.value, answer: $.answer.value }] );
		} );
	},
	hide: function() {
		hide( this.element );
	},
	show: function() {
		show( this.element );
	},
	hideError: function() {
		hide( this.$.error );
	},
	showError: function( msg ) {
		var er = this.$.error;
		er.innerHTML = i18n( msg );
		show( er );
	},
	destroy: function(){
	}
});

//
/* ui.buddy:
*
options:
attributes：

methods:
add(data, [index]) //
remove(ids)
select(id)
update(data, [index])
notice
online
offline

destroy()
events: 
select
offline
online

*/
app("buddy", function( options ){
	options = options || {};
	var ui = this, im = ui.im, buddy = im.buddy, layout = ui.layout;
	var buddyUI = new webimUI.buddy(null, extend({
		title: i18n("buddy")
	}, options ) );

	layout.addWidget( buddyUI, {
		container: "tab",
		title: i18n( "buddy" ),
		icon: "buddy"
	} );


	//select a buddy
	buddyUI.bind("select", function(info){
		ui.addChat("buddy", info.id);
		ui.layout.focusChat("buddy", info.id);
	});
	/*
	buddyUI.window.bind("displayStateChange",function(type){
		if(type != "minimize"){
			buddy.option("active", true);
			im.status.set("b", 1);
			buddy.complete();
		}else{
			im.status.set("b", 0);
			buddy.option("active", false);
		}
	});
	*/

	var mapId = function(a){ return isObject(a) ? a.id : a };
	var grepVisible = function(a){ return a.show != "invisible" && a.presence == "online"};
	var grepInvisible = function(a){ return a.show == "invisible"; };
	//some buddies online.
	buddy.bind("online", function(data){
		buddyUI.add(grep(data, grepVisible));
	});
	//some buddies offline.
	buddy.bind("offline", function(data){
		buddyUI.remove(map(data, mapId));
	});
	//some information has been modified.
	buddy.bind( "update", function(data){
		buddyUI.add(grep(data, grepVisible));
		buddyUI.update(grep(data, grepVisible));
		buddyUI.remove(map(grep(data, grepInvisible), mapId));
	} );
	buddyUI.offline();
	im.bind( "ready", function(){
		buddyUI.online();
	}).bind("go", function() {
		buddyUI.titleCount();
	}).bind( "stop", function( type, msg ) {
		buddyUI.offline();
		if ( type == "connect" ) {
		}
	});
	return buddyUI;
});

widget("buddy",{
	template: '<div id="webim-buddy" class="webim-buddy webim-flex webim-box">\
		<div id=":search" class="webim-buddy-search ui-state-default ui-corner-all"><em class="ui-icon ui-icon-search"></em><input id=":searchInput" type="text" value="" /></div>\
			<div class="webim-buddy-content webim-flex" id=":content">\
				<div id=":empty" class="webim-buddy-empty"><%=empty buddy%></div>\
					<ul id=":ul"></ul>\
						</div>\
							</div>',
	tpl_group: '<li><h4><%=title%>(<%=count%>)</h4><hr class="webim-line ui-state-default" /><ul></ul></li>',
	tpl_li: '<li title=""><a href="<%=url%>" rel="<%=id%>" class="ui-helper-clearfix"><em class="webim-icon webim-icon-<%=show%>" title="<%=human_show%>"><%=show%></em><img width="25" src="<%=pic_url%>" defaultsrc="<%=default_pic_url%>" onerror="var d=this.getAttribute(\'defaultsrc\');if(d && this.src!=d)this.src=d;" /><strong><%=nick%></strong><span><%=status%></span></a></li>'
},{
	_init: function(){
		var self = this, options = self.options;
		self.groups = {
		};
		self.li = {
		};
		self.li_group = {
		};
		self.size = 0;
		if(options.disable_group){
			addClass(self.element, "webim-buddy-hidegroup");
		}
		if(options.simple){
			addClass(self.element, "webim-buddy-simple");
		}

	},
	_initEvents: function(){
		var self = this, $ = self.$, search = $.search, input = $.searchInput, placeholder = i18n("search buddy"), activeClass = "ui-state-active";
		addEvent(search.firstChild, "click",function(){
			input.focus();
		});
		input.value = placeholder;
		addEvent(input, "focus", function(){
			addClass(search, activeClass);
			if(this.value == placeholder)this.value = "";
		});
		addEvent(input, "blur", function(){
			removeClass(search, activeClass);
			if(this.value == "")this.value = placeholder;
		});
		addEvent(input, "keyup", function(){
			var list = self.li, val = this.value;
			each(self.li, function(n, li){
				if(val && (li.text || li.innerHTML.replace(/<[^>]*>/g,"")).indexOf(val) == -1) hide(li);
				else show(li);
			});
		});
/*
var a = $.online.firstChild;
addEvent(a, "click", function(e){
preventDefault(e);
self.trigger("online");
});
hoverClass(a, "ui-state-hover");
addEvent($.offline.firstChild, "click", function(e){
preventDefault(e);
self.trigger("offline");
});
*/

	},
	titleCount: function(){
		var self = this, size = self.size, win = self.window, empty = self.$.empty, element = self.element;
		win && win.title(self.options.title + "(" + (size ? size : "0") + ")");
		if(!size){
			show(empty);
		}else{
			hide(empty);
		}
		if(size > 8){
			self.scroll(true);
		}else{
			self.scroll(false);
		}
	},
	scroll:function(is){
		toggleClass(this.element, "webim-buddy-scroll", is);
	},
	_time:null,
	_titleBuddyOnline: function(name){
		var self = this, win = self.window;
		if(!name) name = "";
		//	win && win.title(subVisibleLength(name, 0, 8) + " " + i18n("online"));
		if(self._time) clearTimeout(self._time);
		self._time = setTimeout(function(){
			self.titleCount();
		}, 5000);
	},
	_title: function(type){
		var win = this.window;
		if(win){
			win.title(this.options.title + "[" + i18n(type) + "]");
		}
	},
	notice: function(type, name){
		var self = this;
		switch(type){
			case "buddyOnline":
				self._titleBuddyOnline(name);
			break;
			default:
				self._title(type);
		}
	},
	online: function(){
		var self = this, $ = self.$, win = self.window;
		self.notice("connect");
		hide( $.empty );
	},
	offline: function(){
		var self = this, $ = self.$, win = self.window;
		self.scroll(false);
		self.removeAll();
		hide( $.empty );
		self.notice("offline");
	},
	_updateInfo:function(el, info){
		el = el.firstChild;
		el.setAttribute("href", info.url);
		el = el.firstChild;
		var show = info.show ? info.show : "available";
		el.className = "webim-icon webim-icon-" + show;
		el.setAttribute("title", i18n(show));
		el = el.nextSibling;
		el.setAttribute("defaultsrc", info.default_pic_url ? info.default_pic_url : "");
		if(info.pic_url || info.default_pic_url) {
			el.setAttribute("src", info.pic_url || info.default_pic_url);
		}
		el = el.nextSibling;
		el.innerHTML = info.nick;
		el = el.nextSibling;
		el.innerHTML = stripHTML(info.status) || "&nbsp;";
		return el;
	},
	_addOne:function(info, end){
		var self = this, li = self.li, id = info.id, ul = self.$.ul;
		if(!li[id]){
			self.size++;
			if(!info.default_pic_url)info.default_pic_url = "";
			info.status = stripHTML(info.status) || "&nbsp;";
			info.show = info.show || "available";
			info.human_show = i18n(info.show);
			info.pic_url = info.pic_url || "";
			var el = li[id] = createElement(tpl(self.options.tpl_li, info));
			//self._updateInfo(el, info);
			var a = el.firstChild;
			addEvent(a, "click",function(e){
				preventDefault(e);
				self.trigger("select", [info]);
				this.blur();
			});

			var groups = self.groups, group_name = i18n(info["group"] || "friend"), group = groups[group_name];
			if(!group){
				var g_el = createElement(tpl(self.options.tpl_group));
				hide( g_el );
				if(group_name == i18n("stranger")) end = true;
				if(end) ul.appendChild(g_el);
				else ul.insertBefore(g_el, ul.firstChild);
				group = {
					name: group_name,
					el: g_el,
					count: 0,
					title: g_el.firstChild,
					li: g_el.lastChild
				};
				self.groups[group_name] = group;
			}
			if(group.count == 0) show(group.el);
			self.li_group[id] = group;
			group.li.appendChild(el);
			group.count++;
			group.title.innerHTML = group_name + "("+ group.count+")";
		}
	},
	_updateOne:function(info){
		var self = this, li = self.li, id = info.id;
		li[id] && self._updateInfo(li[id], info);
	},
	update: function(data){
		data = makeArray(data);
		for(var i=0; i < data.length; i++){
			this._updateOne(data[i]);
		}
	},
	add: function(data, end){
		data = makeArray(data);
		for(var i=0; i < data.length; i++){
			this._addOne(data[i], end);
		}
		this.titleCount();
	},
	removeAll: function(){
		var ids = [], li = this.li;
		for(var k in li){
			ids.push(k);
		}
		this.remove(ids);
		this.titleCount();
	},
	remove: function(ids){
		var self = this, id, el, li = self.li, group, li_group = self.li_group;
		ids = idsArray(ids);
		for(var i=0; i < ids.length; i++){
			id = ids[i];
			el = li[id];
			if(el){
				self.size--;
				group = li_group[id];
				if(group){
					group.count --;
					if(group.count == 0)hide(group.el);
					group.title.innerHTML = group.name + "("+ group.count+")";
				}
				remove(el);
				delete(li[id]);
			}
		}
		self.titleCount();
	},
	select: function(id){
		var self = this, el = self.li[id];
		el && el.firstChild.click();
		return el;
	},
	destroy: function(){
	}
});
//
/* ui.room:
*
options:
attributes：

methods:
add(data, [index]) //
remove(ids)
select(id)
update(data, [index])
notice
online
offline

destroy()
events: 
select
offline
online

*/
app("room", function( options ) {
	var ui = this, im = ui.im, room = im.room, setting = im.setting,u = im.data.user, layout = ui.layout;
	var roomUI = ui.room = new webim.ui.room(null).bind("select",function(info){
		ui.addChat("room", info.id);
		ui.layout.focusChat("room", info.id);
	});
	layout.addWidget( roomUI, {
		container: "tab",
		title: i18n( "room" ),
		icon: "room"
	} );
	//
	im.setting.bind("update",function(key, val){
		if(key == "buddy_sticky")roomUI.window.option("sticky", val);
	});
	room.bind("join",function(info){
		updateRoom(info);
	}).bind("leave", function(rooms){

	}).bind("block", function(id, list){
		setting.set("blocked_rooms",list);
		updateRoom(room.get(id));
		room.leave(id);
	}).bind("unblock", function(id, list){
		setting.set("blocked_rooms",list);
		updateRoom(room.get(id));
		room.join(id);
	}).bind("addMember", function(room_id, info){
		updateRoom(room.get(room_id));
	}).bind("removeMember", function(room_id, info){
		updateRoom(room.get(room_id));
	});
	//room
	function updateRoom(info){
		var nick = info.nick;
		info = extend({},info,{group:"group", nick: nick + "(" + (parseInt(info.count) + "/"+ parseInt(info.all_count)) + ")"});
		layout.updateChat(info);
		info.blocked && (info.nick = nick + "(" + i18n("blocked") + ")");
		roomUI.li[info.id] ? roomUI.update(info) : roomUI.add(info);
	}
});
widget("room",{
	template: '<div id="webim-room" class="webim-room webim-flex webim-box">\
		<div id=":search" class="webim-room-search ui-state-default ui-corner-all"><em class="ui-icon ui-icon-search"></em><input id=":searchInput" type="text" value="" /></div>\
			<div class="webim-room-content webim-flex">\
				<div id=":empty" class="webim-room-empty"><%=empty room%></div>\
					<ul id=":ul"></ul>\
						</div>\
							</div>',
	tpl_li: '<li title=""><a href="<%=url%>" rel="<%=id%>" class="ui-helper-clearfix"><img width="25" src="<%=pic_url%>" defaultsrc="<%=default_pic_url%>" onerror="var d=this.getAttribute(\'defaultsrc\');if(d && this.src!=d)this.src=d;" /><strong><%=nick%></strong></a></li>'
},{
	_init: function(){
		var self = this;
		self.size = 0;
		self.li = {
		};
		self._count = 0;
		show(self.$.empty);
		//self._initEvents();
	},
	_initEvents: function(){
		var self = this, $ = self.$, search = $.search, input = $.searchInput, placeholder = i18n("search room"), activeClass = "ui-state-active";
		addEvent(search.firstChild, "click",function(){
			input.focus();
		});
		input.value = placeholder;
		addEvent(input, "focus", function(){
			addClass(search, activeClass);
			if(this.value == placeholder)this.value = "";
		});
		addEvent(input, "blur", function(){
			removeClass(search, activeClass);
			if(this.value == "")this.value = placeholder;
		});
		addEvent(input, "keyup", function(){
			var list = self.li, val = this.value;
			each(self.li, function(n, li){
				if(val && (li.text || li.innerHTML.replace(/<[^>]*>/g,"")).indexOf(val) == -1) hide(li);
				else show(li);
			});
		});

	},
	scroll:function(is){
		toggleClass(this.element, "webim-room-scroll", is);
	},
	_updateInfo:function(el, info){
		el = el.firstChild;
		el.setAttribute("href", info.url);
		el = el.firstChild;
		el.setAttribute("defaultsrc", info.default_pic_url ? info.default_pic_url : "");
		el.setAttribute("src", info.pic_url);
		el = el.nextSibling;
		el.innerHTML = info.nick;
		//el = el.nextSibling;
		//el.innerHTML = info.status;
		return el;
	},
	_addOne:function(info, end){
		var self = this, li = self.li, id = info.id, ul = self.$.ul;
		self.size++;
		if(!li[id]){
			if(!info.default_pic_url)info.default_pic_url = "";
			var el = li[id] = createElement(tpl(self.options.tpl_li, info));
			//self._updateInfo(el, info);
			var a = el.firstChild;
			addEvent(a, "click",function(e){
				preventDefault(e);
				self.trigger("select", [info]);
				this.blur();
			});
			ul.appendChild(el);
		}
	},
	_updateOne:function(info){
		var self = this, li = self.li, id = info.id;
		li[id] && self._updateInfo(li[id], info);
	},
	update: function(data){
		data = makeArray(data);
		for(var i=0; i < data.length; i++){
			this._updateOne(data[i]);
		}
	},
	add: function(data){
		var self = this;
		hide(self.$.empty);
		data = makeArray(data);
		for(var i=0; i < data.length; i++){
			self._addOne(data[i]);
		}
		if(self.size > 8){
			self.scroll(true);
		}
	},
	removeAll: function(){
		var ids = [], li = this.li;
		for(var k in li){
			ids.push(k);
		}
		this.remove(ids);
	},
	remove: function(ids){
		var id, el, li = this.li;
		ids = idsArray(ids);
		for(var i=0; i < ids.length; i++){
			id = ids[i];
			el = li[id];
			if(el){
				remove(el);
				delete(li[id]);
			}
		}
	},
	select: function(id){
		var self = this, el = self.li[id];
		el && el.firstChild.click();
		return el;
	},
	destroy: function(){
	}
});
//
/* ui.menu:
*
options:
attributes

methods:
add

destroy()
events: 

*/
app("menu", {
	init: function(options){
		var ui = this, layout = ui.layout;
		var menuUI = ui.menu = new webimUI.menu(null, options);
		layout.addWidget(menuUI, {
			title: i18n("menu"),
			icon: "home",
			sticky: false,
			onlyIcon: false,
			isMinimize: true
		}, null,"shortcut");
	}
});
widget("menu",{
	template: '<div id="webim-menu" class="webim-menu">\
		<ul id=":ul"><%=list%></ul>\
			<div id=":empty" class="webim-menu-empty"><%=empty menu%></div>\
				</div>',
	tpl_li: '<li><a href="<%=link%>" target="<%=target%>"><img src="<%=icon%>"/><span><%=title%></span></a></li>'
},{
	_init: function(){
		var self = this, element = self.element, options = self.options;
		var win = options.window;
		options.data && options.data.length && hide(self.$.empty);
		//self._initEvents();
	},
	template: function(){
		var self = this, temp = [], data = self.options.data;
		data && each(data, function(i, val){
			temp.push(self._li_tpl(val));
		});
		return tpl(self.options.template,{
			list:temp.join("")
		});
	},
	_li_tpl: function(data){
		return tpl(this.options.tpl_li, {
			title: i18n(data.title),
			icon: data.icon,
			link: data.link,
			target: data.isExtlink ? "_blank" : ""
		});
	},
	_fitUI:function(){
		var el = this.element;
		if(el.clientHeight > 300)
			el.style.height = 300 + "px";
	},
	add: function(data){
		var self = this;
		if(isArray(data)){
			each(data, function(i,val){
				self.add(val);
			});
			return;
		}
		var $ = self.$;
		hide($.empty);
		$.ul.appendChild(createElement(self._li_tpl(data)));
	},
	destroy: function(){
	}
});

widget( "tabs", {
	template: '<div class="webim-tabs">\
		<ul id=":nav" class="webim-tabs-nav ui-helper-clearfix"></ul>\
			</div>',
	panel: false
}, {
	_init: function() {
		var self = this, 
		options = self.options;
		self.panels = {};
		self.navs = {};
	},
	add: function( panel, label, icon ) {
		var self = this, 
		nav = self.$.nav,
		el = self.navs[label] = createElement( '<li class="ui-corner-top ui-state-default"><a href="#">' + label + '</a></li>' ); 
		addClass( panel = $( panel ), "ui-helper-hidden-accessible" );
		self.panels[label] = panel; 
		nav.appendChild( el );
		self.options.panel && self.options.panel.appendChild( panel );
		self._tabEvent( el, label );
	},
	select: function( label ) {
		var el = this.navs[ label ];
		el && triggerEvent( children( el )[0], "click" );
	},
	_tabEvent: function( tab, label ) {
		var self = this, el = children( tab )[0];
		addEvent( el, "click", function( e ) {
			each( self.panels, function( k, v ) {
				addClass( v, "ui-helper-hidden-accessible" );
			} );
			each( self.navs, function( k, v ) {
				removeClass( v, "ui-state-active" );
			} );
			removeClass( self.panels[ label ], "ui-helper-hidden-accessible" );
			addClass( self.navs[ label ], "ui-state-active" );
			preventDefault( e );
		} );
	}
});
})(window, document);

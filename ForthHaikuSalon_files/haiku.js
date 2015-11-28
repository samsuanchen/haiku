'use strict';

var NOTES = 10;
var NOTE_BASE = 10;
var STEP = 2048;

var all_haikus = {};
var haiku_tag_count = 0;

function start_fetch() {
  var fetcher = new Worker('fetch.js');
  fetcher.addEventListener('message', function(e) {
    for (var i = 0; i < e.data.length; i++) {
      all_haikus[e.data[i].id] = e.data[i];
    }
    var count = 0;
    for (var haiku in all_haikus) {
      count++;
    }
    var tickers = document.getElementsByName('ticker');
    for (var i = 0; i < tickers.length; i++) {
      tickers[i].innerText = '' + count;
    }
  }, false);
}

function core_words() {
  var dict = new Object();
  dict['x'] = ['dstack.push(xpos);'];
  dict['y'] = ['dstack.push(ypos);'];
  dict['mx'] = ['dstack.push(mouse_x);'];
  dict['my'] = ['dstack.push(mouse_y);'];
  dict['t'] = ['dstack.push(time_val);'];
  dict['dt'] = ['dstack.push(time_delta_val);'];
  dict['button'] = ['work1 = dstack.pop();',
                    'dstack.push(hasbit(button_val, work1));'];
  dict['buttons'] = ['dstack.push(button_val);'];
  dict['audio'] = ['audio_sample = dstack.pop();']

  dict['push'] = ['rstack.push(dstack.pop());'];
  dict['pop'] = ['dstack.push(rstack.pop());'];
  dict['>r'] = dict['push'];
  dict['r>'] = dict['pop'];
  dict['r@'] = ['work1 = rstack.pop();',
                'rstack.push(work1);',
                'dstack.push(work1);'];

  dict['@'] = ['work1 = dstack.pop();',
               'dstack.push(load(work1));'];
  dict['!'] = ['work1 = dstack.pop();',
               'work2 = dstack.pop();',
               'store(work2, work1);'];

  dict['dup'] = ['work1 = dstack.pop();',
                 'dstack.push(work1);',
                 'dstack.push(work1);'];
  dict['over'] = ['work1 = dstack.pop();',
                  'work2 = dstack.pop();',
                  'dstack.push(work2);',
                  'dstack.push(work1);',
                  'dstack.push(work2);'];

  dict['2dup'] = dict['over'].concat(dict['over']);
  dict['z+'] = ['work1 = dstack.pop();',
                'work2 = dstack.pop();',
                'work3 = dstack.pop();',
                'work4 = dstack.pop();',
                'dstack.push(work2 + work4);',
                'dstack.push(work1 + work3);'];
  dict['z*'] = ['work1 = dstack.pop();',
                'work2 = dstack.pop();',
                'work3 = dstack.pop();',
                'work4 = dstack.pop();',
                'dstack.push(work4 * work2 - work3 * work1);',
                'dstack.push(work4 * work1 + work3 * work2);'];

  dict['drop'] = ['work1 = dstack.pop();'];
  dict['swap'] = ['work1 = dstack.pop();',
                  'work2 = dstack.pop();',
                  'dstack.push(work1);',
                  'dstack.push(work2);'];
  dict['rot'] = ['work1 = dstack.pop();',
                 'work2 = dstack.pop();',
                 'work3 = dstack.pop();',
                 'dstack.push(work2);',
                 'dstack.push(work1);',
                 'dstack.push(work3);'];
  dict['-rot'] = ['work1 = dstack.pop();',
                  'work2 = dstack.pop();',
                  'work3 = dstack.pop();',
                  'dstack.push(work1);',
                  'dstack.push(work3);',
                  'dstack.push(work2);'];

  dict['='] = ['dstack.push((dstack.pop() == dstack.pop())?1.0:0.0);'];
  dict['<>'] = ['dstack.push((dstack.pop() != dstack.pop())?1.0:0.0);'];
  dict['<'] = ['dstack.push((dstack.pop() > dstack.pop())?1.0:0.0);'];
  dict['>'] = ['dstack.push((dstack.pop() < dstack.pop())?1.0:0.0);'];
  dict['<='] = ['dstack.push((dstack.pop() >= dstack.pop())?1.0:0.0);'];
  dict['>='] = ['dstack.push((dstack.pop() <= dstack.pop())?1.0:0.0);'];

  dict['+'] = ['dstack.push(dstack.pop() + dstack.pop());'];
  dict['*'] = ['dstack.push(dstack.pop() * dstack.pop());'];
  dict['-'] = ['work1 = dstack.pop();',
               'dstack.push(dstack.pop() - work1);'];
  dict['/'] = ['work1 = dstack.pop();',
               'dstack.push(dstack.pop() / work1);'];
  dict['mod'] = ['work1 = dstack.pop();',
                 'work2 = dstack.pop();',
                 'dstack.push(mod(work2, work1));'];
  dict['pow'] = ['work1 = dstack.pop();',
                 'dstack.push(pow(abs(dstack.pop()), work1));'];
  dict['**'] = dict['pow'];
  dict['atan2'] = ['work1 = dstack.pop();',
                   'dstack.push(atan2(dstack.pop(), work1));'];

  dict['and'] = ['work1 = dstack.pop();',
                 'dstack.push((dstack.pop()!=0.0 && work1!=0.0)?1.0:0.0);'];
  dict['or'] = ['work1 = dstack.pop();',
                'dstack.push((dstack.pop()!=0.0 || work1!=0.0)?1.0:0.0);'];
  dict['not'] = ['dstack.push(dstack.pop()!=0.0?0.0:1.0);'];

  dict['min'] = ['dstack.push(min(dstack.pop(), dstack.pop()));'];
  dict['max'] = ['dstack.push(max(dstack.pop(), dstack.pop()));'];

  dict['negate'] = ['dstack.push(-dstack.pop());'];
  dict['sin'] = ['dstack.push(sin(dstack.pop()));'];
  dict['cos'] = ['dstack.push(cos(dstack.pop()));'];
  dict['tan'] = ['dstack.push(tan(dstack.pop()));'];
  dict['log'] = ['dstack.push(log(abs(dstack.pop())));'];
  dict['exp'] = ['dstack.push(exp(dstack.pop()));'];
  dict['sqrt'] = ['dstack.push(sqrt(abs(dstack.pop())));'];
  dict['floor'] = ['dstack.push(floor(dstack.pop()));'];
  dict['ceil'] = ['dstack.push(ceil(dstack.pop()));'];
  dict['abs'] = ['dstack.push(abs(dstack.pop()));'];

  dict['pi'] = ['dstack.push(PI);'];

  dict['random'] = ['dstack.push(random());'];

  dict['if'] = ['if(dstack.pop() != 0.0) {'];
  dict['else'] = ['} else {'];
  dict['then'] = ['}'];

  return dict;
}

function mod(v1, v2) {
  return v1 - v2 * Math.floor(v1 / v2);
}

function hasbit(val, b) {
  b = Math.floor(b);
  return mod(val, Math.pow(2.0, b + 1)) >= Math.pow(2.0, b);
}

function code_tags(src) {
  var tags = [];
  var char_count = src.length;
  src = src.replace(/[ \r\t]+/, ' ');
  src = src.replace(/[ ]+\n/, '\n');
  src = src.replace(/\n[ ]+/, '\n');
  src = src.replace(/[\n]+/, '\n');
  src = src.replace(/[\n]$/, '');
  // Measure each line.
  var lines = src.split('\n');
  var line_counts = [];
  for (var i = 0; i < lines.length; i++) {
    line_counts.push(lines[i].trim().split(' ').length);
  }
  // Pull out each word.
  var words = src.replace(/[ \n]+/g, ' ').trim().split(' ');
  // Decide style.
  if (lines.length == 3 &&
      lines[0].trim().split(' ').length == 5 &&
      lines[1].trim().split(' ').length == 7 &&
      lines[2].trim().split(' ').length == 5) {
    // Haiku has 7-5-7 words.
    tags.push('style:haiku');
  } else if (src.length <= 140) {
    // Short is <= 140 characters.
    tags.push('style:short');
  } else {
    // Anything else is long.
    tags.push('style:long');
  }
  // Detect animation / interactive.
  var picked = {};
  for (var i = 0; i < words.length; i++) {
    var wl = words[i].toLowerCase();
    if (picked['animated'] === undefined &&
        (wl === 't' || wl === 'dt')) {
      tags.push('animated');
      picked['animated'] = 1;
    } else if (picked['interactive'] === undefined &&
               (wl === 'button' || wl === 'buttons' ||
                wl === 'mx' || wl === 'my')) {
      tags.push('interactive');
      picked['interactive'] = 1;
    } else if (picked['audio'] === undefined && wl === 'audio') {
      tags.push('audio');
      picked['audio'] = 1;
    }
  }
  // Show counts.
  tags.push('characters:' + char_count);
  tags.push('words:' + words.length);
  tags.push('lines:' + line_counts.join(','));
  return tags;
}

function code_tags_dict(code) {
  var tags = code_tags(code);
  var ret = {};
  for (var i = 0; i < tags.length; i++) {
    ret[tags[i]] = 1;
  }
  return ret;
}

if (typeof String.prototype.trim != 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/, '');
  }
}


var FUNC_SIGNATURE =
    'var go = function( ' +
    '  time_val, time_delta_val, ' +
    '  xpos, ypos, ' +
    '  mouse_x, mouse_y, ' +
    '  button_val, '+
    '  memory) { ' +
    '  var PI = Math.PI; ' +
    '  var random = Math.random; ' +
    '  var floor = Math.floor; ' +
    '  var ceil = Math.ceil; ' +
    '  var min = Math.min; ' +
    '  var max = Math.max; ' +
    '  var log = Math.log; ' +
    '  var sqrt = Math.sqrt; ' +
    '  var pow = Math.pow; ' +
    '  var abs = Math.abs; ' +
    '  var sin = Math.sin; ' +
    '  var cos = Math.cos; ' +
    '  var tan = Math.tan; ' +
    '  var atan2 = Math.atan2; ' +
    '  var exp = Math.exp; ' +
    '  var audio_sample = 0.0; ' +
    'function store(v, addr) { ' +
    '  memory[mod(floor(addr), 16)] = v; } ' +
    'function load(addr) { ' +
    '  return memory[mod(floor(addr), 16)]; } ';


var BOGUS = [FUNC_SIGNATURE + 'return [1.0, 0.0, 0.7, 1.0, 0.0]; }; go'];


function optimize(code, result_limit) {
  if (code == BOGUS) return BOGUS;

  // Use alternate pre/post-amble and optimize away dstack/rstack.
  code = code.slice(0, code.length - 1);
  code[0] = FUNC_SIGNATURE + ' var work1, work2, work3, work4; ';

  var dstack = [];
  var rstack = [];
  var cstack = [];
  var tmp_index = 1;
  for (var i = 0; i < code.length; i++) {
    for (;;) {
      if (code[i].search(/dstack\.pop\(\)/) >= 0) {
        if (dstack.length === 0) return BOGUS;
        var tmp = dstack.pop();
        code[i] = code[i].replace(/dstack\.pop\(\)/, tmp);
        continue;
      }
      if (code[i].search(/rstack\.pop\(\)/) >= 0) {
        if (rstack.length === 0) return BOGUS;
        var tmp = rstack.pop();
        code[i] = code[i].replace(/rstack\.pop\(\)/, tmp);
        continue;
      }
      break;
    }
    var m = code[i].match(/^dstack\.push\((.*)\);$/);
    if (m) {
      var tmp = 'temp' + tmp_index++;
      code[i] = 'var ' + tmp + ' = ' + m[1] + ';';
      dstack.push(tmp);
    }
    var m = code[i].match(/^rstack\.push\((.*)\);$/);
    if (m) {
      var tmp = 'temp' + tmp_index++;
      code[i] = 'var ' + tmp + ' = ' + m[1] + ';';
      rstack.push(tmp);
    }
    var m = code[i].match(/^if\((.*)\) \{$/);
    if (m) {
      cstack.push([0, dstack.slice(0), rstack.slice(0), i]);
    }
    if (code[i] === '} else {') {
      if (cstack.length === 0) return BOGUS;
      var frame = cstack.pop();
      if (frame[0] !== 0) return BOGUS;
      cstack.push([1, dstack.slice(0), rstack.slice(0), frame[3], i]);
      dstack = frame[1];
      rstack = frame[2];
    }
    if (code[i] === '}') {
      if (cstack.length === 0) return BOGUS;
      var frame = cstack.pop();
      if (dstack.length != frame[1].length ||
          rstack.length != frame[2].length) return BOGUS;
      var decls = '';
      var fixup1 = '';
      var fixup2 = '';
      for (var j = 0; j < dstack.length; j++) {
        if (dstack[j] !== frame[1][j]) {
          var tmp = 'temp' + tmp_index++;
          decls += 'var ' + tmp + ';';
          fixup1 += tmp + ' = ' + dstack[j] + ';';
          fixup2 += tmp + ' = ' + frame[1][j] + ';';
          dstack[j] = tmp;
        }
      }
      for (var j = 0; j < rstack.length; j++) {
        if (rstack[j] !== frame[2][j]) {
          var tmp = 'temp' + tmp_index++;
          decls += 'var ' + tmp + ';';
          fixup1 += tmp + ' = ' + rstack[j] + ';';
          fixup2 += tmp + ' = ' + frame[2][j] + ';';
          rstack[j] = tmp;
        }
      }
      code[frame[3]] = decls + code[frame[3]];
      if (frame[0] === 0) {
        code[i] = fixup1 + '} else {' + fixup2 + '}';
      } else {
        code[i] = fixup1 + '}';
        code[frame[4]] = fixup2 + '} else {';
      }
    }
  }

  if (rstack.length !== 0) return BOGUS;
  if (dstack.length > 4) return BOGUS;

  while (dstack.length < 4) {
    if (dstack.length == 3) {
      dstack.push('1.0');
    } else {
      dstack.push('0.0');
    }
  }
  code.push('return [' + dstack.join(', ') + ']; }; go');

  // Dump code to console.
  console.log('----------JSCRIPT:\n' + code.join('\n') + '\n\n\n');

  // Require no extra stuff on the stacks.
  for (var i = 0; i < code.length; i++) {
    if (code[i].search(/stack/) >= 0) {
      return BOGUS;
    }
  }

  return code;
}


function compile(src_code) {
  var result_limit = 4;
  var code = [FUNC_SIGNATURE + ' var dstack=[]; var rstack=[]; '];
  var dict = core_words();
  var pending_name = 'bogus';
  var code_stack = [];
//var paren_comment = false;	// 20151101 sam for nesting paren
  var paren_comment = 0;	// 20151101 sam for nesting paren
  src_code = src_code.replace(/[ \r\t]+/g, ' ').trim();
  var lines = src_code.split('\n');
  for (var j = 0; j < lines.length; j++) {
    var src = lines[j].split(' ');
    for (var i = 0; i < src.length; i++) {
      var word = src[i];
      word = word.toLowerCase();
      if (word == '(') {		// 20151101 sam for nesting paren
		  paren_comment++;	// 20151101 sam for nesting paren
        continue;			// 20151101 sam for nesting paren
      }				// 20151101 sam for nesting paren
      if (paren_comment) {
        if (word == ')') {
        //paren_comment = false;	// 20151101 sam for nesting paren
          paren_comment--;		// 20151101 sam for nesting paren
        }
        continue;
      }
      if (word == '') {
        continue;
      } else if (word in dict) {
        code = code.concat(dict[word]);
      } else if (word == '\\') {
        break;
  //  } else if (word == '(') {	// 20151101 sam for nesting paren
  //	  paren_comment = true;		// 20151101 sam for nesting paren
  //	  continue;			// 20151101 sam for nesting paren
      } else if (word == ':') {
        i++;
        pending_name = src[i];
        // Disallow nested words.
        if (code_stack.length != 0) return BOGUS;
        code_stack.push(code);
        code = [];
      } else if (word == ';') {
        // Disallow ; other than to end a word.
        if (code_stack.length != 1) return BOGUS;
        dict[pending_name] = code;
        code = code_stack.pop();
        pending_name = 'bogus';
      } else {
        var num = '' + parseFloat(word);
        if (num.match(/^[-]?[0-9]+$/)) {
          num += '.0';
        }
        if (num === 'NaN') {
          num = '0.0';
        }
        code.push('dstack.push(' + num + ');');
      }
    }
  }
  code.push('return dstack; }; go');

  // Dump code to console.
  console.log('----------UNOPTIMIZED JSCRIPT:\n' + code.join('\n') + '\n\n\n');

  // Limit number of steps.
  if (code.length > 2000) return BOGUS;
  code = optimize(code, result_limit);
  return code;
}

function render_rows(image, ctx, img, y, w, h, next) {
  var start = new Date().getTime();
  try {
    // Decide if we're on android or a normal browser.
    if (navigator.userAgent.toLowerCase().search('android') < 0) {
      while (y < h) {
        var pos = w * (h - 1 - y) * 4;
        for (var x = 0.5; x < w; x++) {
          var col = image(x / w, (y + 0.5) / h);
          img.data[pos++] = Math.floor(col[0] * 255);
          img.data[pos++] = Math.floor(col[1] * 255);
          img.data[pos++] = Math.floor(col[2] * 255);
          img.data[pos++] = Math.floor(col[3] * 255);
        }
        y++;
        if (new Date().getTime() - start > 250) break;
      }
    } else {
      // Work around what seems to be an android canvas bug?
      while (y < h) {
        var pos = w * (h - 1 - y) * 4;
        for (var x = 0.5; x < w; x++) {
          var col = image(x / w, (y + 0.5) / h);
          if (col[3] == null) col[3] = 1;
          if (isNaN(col[3])) col[3] = 0;
          var alpha = Math.min(Math.max(0.0, col[3]), 1.0);
          var alpha1 = 1.0 - alpha;
          var alpha2 = 0.9333333333333 * alpha1;
          col[0] = col[0] * alpha + alpha2;
          col[1] = col[1] * alpha + alpha2;
          col[2] = col[2] * alpha + alpha1;
          col[3] = 1;
          img.data[pos++] = Math.floor(col[0] * 255);
          img.data[pos++] = Math.floor(col[1] * 255);
          img.data[pos++] = Math.floor(col[2] * 255);
          img.data[pos++] = Math.floor(col[3] * 255);
        }
        y++;
        if (new Date().getTime() - start > 250) break;
      }
    }
  } catch (e) {
    // Ignore errors.
  }
  ctx.putImageData(img, 0, 0);
  if (y < h) {
    setTimeout(function() {
      render_rows(image, ctx, img, y, w, h, next);
    }, 0);
  } else {
    setTimeout(next, 0);
  }
}

function getParam(name) {
  var params = location.search.substr(1).split('&');
  for (var i = 0; i < params.length; i++) {
    var parts = params[i].split('=', 2);
    if (parts[0] === name) {
      return parts[1];
    }
  }
  return undefined;
}

function setup3d(cv, cv3, code) {
  // Decide if how we use the gpu.
  var gpu = getParam('gpu');
  if (gpu === '0') {
    throw 'force no gpu';
  }
  var force_gpu = gpu === '1';

  // Decide aspect ratio.
  var size = getParam('size');
  if (size === undefined) { size = 256; } else { size = parseFloat(size); }
  var w = getParam('width');
  if (w === undefined) { w = size; } else { w = parseFloat(w); }
  var h = getParam('height');
  if (h === undefined) { h = size; } else { h = parseFloat(h); }
  if (w > h ) {
    w = w / h;
    h = 1.0;
  } else {
    h = h / w;
    w = 1.0;
  }
  cv3.w = w;
  cv3.h = h;

  var gl = cv3.getContext('webgl') || cv3.getContext('experimental-webgl');
  if (!gl) throw 'no gl context';
  var renderer = gl.getParameter(gl.RENDERER);
  if (!force_gpu) {
    // Reject i9* for webgl, as its too slow.
    if (renderer.search(' i9') >= 0) throw 'i9* too slow';
  }

  var fshader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fshader, make_fragment_shader(code));
  gl.compileShader(fshader);
  if (!gl.getShaderParameter(fshader, gl.COMPILE_STATUS)) throw 'bad fshader';

  var vshader = gl.createShader(gl.VERTEX_SHADER);
  var vshaderCode = [
      'attribute vec2 ppos;',
      'uniform vec2 aspect;',
      'varying highp vec2 tpos;',
      'void main(void) {',
      'tpos.x = (ppos.x * aspect.x + 1.0) / 2.0;',
      'tpos.y = (ppos.y * aspect.y + 1.0) / 2.0;',
      'gl_Position = vec4(ppos.x, ppos.y, 0.0, 1.0);',
      '}'].join('\n');
  gl.shaderSource(vshader, vshaderCode);
  gl.compileShader(vshader);
  if (!gl.getShaderParameter(vshader, gl.COMPILE_STATUS)) throw 'bad vshader';

  var program = gl.createProgram();
  gl.attachShader(program, fshader);
  gl.attachShader(program, vshader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw 'bad link';

  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    throw 'bad program';
  }

  var vattrib = gl.getAttribLocation(program, 'ppos');
  if(vattrib == -1) throw 'ppos cannot get address';
  gl.enableVertexAttribArray(vattrib);

  var vbuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
  var vertices = new Float32Array([-1.0,-1.0, 1.0,-1.0, 1.0,1.0,
                                   -1.0,-1.0, 1.0,1.0, -1.0,1.0]);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(vattrib, 2, gl.FLOAT, false, 0, 0);

  cv.program3d = program;
}

function GetTime() {
  var dt = new Date();
  var tm = dt.getHours();
  tm = tm * 60 + dt.getMinutes();
  tm = tm * 60 + dt.getSeconds();
  tm = tm + dt.getMilliseconds() / 1000.0;
  return tm;
}

function draw3d(cv, cv3) {
  var gl = cv3.getContext('webgl') || cv3.getContext('experimental-webgl');
  if (!gl) throw 'no gl context';

  gl.useProgram(cv.program3d);

  cv.last_time = cv.time;
  cv.time = GetTime();
  var time_val_loc = gl.getUniformLocation(cv.program3d, 'time_val');
  gl.uniform1f(time_val_loc, cv.time);
  var time_delta_val_loc = gl.getUniformLocation(
      cv.program3d, 'time_delta_val');
  gl.uniform1f(time_delta_val_loc, cv.time - cv.last_time);

  var mouse_x_loc = gl.getUniformLocation(cv.program3d, 'mouse_x');
  gl.uniform1f(mouse_x_loc, cv.mouse_x);
  var mouse_y_loc = gl.getUniformLocation(cv.program3d, 'mouse_y');
  gl.uniform1f(mouse_y_loc, cv.mouse_y);

  var button_loc = gl.getUniformLocation(cv.program3d, 'button_val');
  gl.uniform1f(button_loc, window.stroke_buttons);

  var memory_loc = gl.getUniformLocation(cv.program3d, 'memory_val');
  gl.uniform1fv(memory_loc, cv.memory);

  var aspect_val_loc = gl.getUniformLocation(cv.program3d, 'aspect');
  gl.uniform2f(aspect_val_loc, cv3.w, cv3.h);

  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  var ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, cv.width, cv.height);
  ctx.drawImage(cv3, 0, 0);

  cv.image(cv.time, cv.time - cv.last_time, cv.memory);
}

function make_fragment_shader(input_code) {
  var prefix = [
      'precision highp float;',
      'varying vec2 tpos;',
      'uniform float time_val;',
      'uniform float time_delta_val;',
      'uniform float button_val;',
      'uniform float mouse_x, mouse_y;',
      'uniform float memory_val[16];',
      'float memory[16];',
      'float audio_sample;',
      'float PI = 3.1415926535897931;',
      'float PI2 = PI * 2.0;',
  ];
  var main = [
      'void main(void) {',
      'float work1, work2, work3, work4, seed;',
      'for (int i = 0; i < 16; ++i) { memory[i] = memory_val[i]; }',
  ];
  var code = prefix.concat(main).concat(input_code.slice(1));
  for (var i = 0; i < code.length; i++) {
    code[i] = code[i].replace(/var /g, 'float ');
    code[i] = code[i].replace(/xpos/g, 'tpos.x');
    code[i] = code[i].replace(/ypos/g, 'tpos.y');
    code[i] = code[i].replace(/Math\./g, '');
    code[i] = code[i].replace(/atan2/g, 'atan');
    code[i] = code[i].replace(/random\(\)/g,
        '(seed=fract(sin(104053.0*seed+mod(time_val, 100003.0)+' +
        '101869.0*tpos.x+102533.0*tpos.y)*103723.0))');
    code[i] = code[i].replace(/sin/g, 'gsin');
    code[i] = code[i].replace(/cos/g, 'gcos');
    code[i] = code[i].replace(/([^a])tan/g, '$1gtan');
  }
  code.splice(prefix.length, 0,
      'float gsin(float v) { return sin(mod(v, PI2)); }',
      'float gcos(float v) { return cos(mod(v, PI2)); }',
      'float gtan(float v) { return tan(mod(v, PI2)); }',
      'float hasbit(float v, float b) { ' +
      '  b = floor(b); ' +
      '  return mod(v, pow(2.0, b + 1.0)) >= pow(2.0, b) ? 1.0 : 0.0; } ',
      'float load(float a) { ' +
      '  int ai = int(mod(floor(a), 16.0)); ' +
      '  for (int i = 0; i < 16; ++i) { ' +
      '    if (i == ai) return memory[i]; ' +
      '  } ' +
      '  return 0.0; ' +
      '}',
      'void store(float v, float a) { ' +
      '  int ai = int(mod(floor(a), 16.0)); ' +
      '  for (int i = 0; i < 16; ++i) { ' +
      '    if (i == ai) memory[i] = v; ' +
      '  } ' +
      '}');
  code[code.length-1] = code[code.length-1].replace(
      ']; }; go', '); ' +
      'gl_FragColor.r = min(max(0.0, gl_FragColor.r), 1.0); ' +
      'gl_FragColor.g = min(max(0.0, gl_FragColor.g), 1.0); ' +
      'gl_FragColor.b = min(max(0.0, gl_FragColor.b), 1.0); ' +
      'gl_FragColor.a = min(max(0.0, gl_FragColor.a), 1.0); ' +
      'gl_FragColor.r *= gl_FragColor.a; ' +
      'gl_FragColor.g *= gl_FragColor.a; ' +
      'gl_FragColor.b *= gl_FragColor.a; ' +
      '}');
  code[code.length-1] = code[code.length-1].replace(
      'return [', 'gl_FragColor = vec4(');
  code = code.join('\n');

  console.log('----------SHADER:\n' + code + '\n\n\n');

  return code;
}

function render(cv, next) {
  var cv3 = cv.cv3;
  if (cv.old_code === cv.code) {
    if (cv.mouse_inside && haiku_tag_count > 1 && cv.program3d === null) {
      // fall thru
    } else {
      if (cv.program3d !== null && (haiku_tag_count <= 1 || cv.mouse_inside)) {
        draw3d(cv, cv3);
      }
      next();
      return;
    }
  }
  if (cv.old_code !== cv.code) {
    cv.old_code = cv.code;
    cv.memory = new Float32Array(16);
  }
  cv.program3d = null;

  var compiled_code = compile(cv.code);
  try {
    var func = eval(compiled_code.join('\n'));
  } catch(e) {
    console.log(e);
    // Go on to the next one.
    setTimeout(next, 0);
    return;
  }

  // Handle category label and visibility.
  var tags = code_tags_dict(cv.code);
  if (cv.category !== null) {
    if (tags['interactive'] !== undefined) {
      cv.category.style.display = 'inline';
      cv.category.innerHTML = ' &#127918; ';
      cv.category.href = '/haiku-interactive';
    } else if (tags['animated'] !== undefined) {
      cv.category.style.display = 'inline';
      cv.category.innerHTML = ' &#127909; ';
      cv.category.href = '/haiku-animated';
    } else {
      cv.category.style.display = 'none';
    }
  }
  if (cv.audio !== null) {
    if (tags['audio'] !== undefined) {
      cv.audio.style.display = 'inline';
      cv.audio.innerHTML = ' &#128264; ';
      cv.audio.href = '/haiku-sound';
    } else {
      cv.audio.style.display = 'none';
    }
  }

  try {
    if (!cv.mouse_inside && haiku_tag_count > 1 && cv3.width <= 128) {
      throw 'use non-webgl for small and multiple';
    }
    cv.image = function(t, dt, x, y) {
      return func(
          t, dt, x, y, cv.mouse_x, cv.mouse_y,
          window.stroke_buttons, cv.memory);
    };
    setup3d(cv, cv3, compiled_code);
    draw3d(cv, cv3);
    setTimeout(next, 0);
    return;
  } catch (e) {
    // Fall back on software.
    console.log(e);
  }

  try {
    var image = function(x, y) {
      var mem = new Float32Array(16);
      return func(0.3, 0, x, y, 0, 0, 0, mem);
    };
    var ctx = cv.getContext('2d');
    var w = cv.width;
    var h = cv.height;
    var img = ctx.createImageData(w, h);
  } catch (e) {
    // Go on to the next one.
    setTimeout(next, 0);
    return;
  }

  render_rows(image, ctx, img, 0, w, h, function() {
    setTimeout(next, 0);
  });
}

function parent_div(element) {
  element = element.parentNode;
  while (element.parentNode && element.tagName != 'DIV') {
    element = element.parentNode;
  }
  return element;
}

function find_tags_named(base, tag, name) {
  if (tag !== null) {
    tag = tag.toUpperCase();
  }
  var found = [];
  for (var i = 0; i < base.childNodes.length; i++) {
    var child = base.childNodes[i];
    if ((tag === null || tag === child.tagName) &&
        (name === null || name === child.name)) {
      found.push(child);
    }
  }
  return found;
}

function find_tag_name(base, tag, name) {
  var found = find_tags_named(base, tag, name);
  if (found.length == 0) return null;
  return found[0];
}

function find_tag(base, tag) {
  return find_tag_name(base, tag, null);
}

function update_haikus_one(work, next) {
  if (work.length == 0) {
    setTimeout(next, 0);
    return;
  }
  var job = work[0];
  work = work.slice(1);
  render(job, function() {
    update_haikus_one(work, next);
  });
}

function update_haiku_lists() {
  var haiku_lists = document.getElementsByName('haikulist');
  for (var i = 0; i < haiku_lists.length; i++) {
    var haiku_list = haiku_lists[i];
    var children = find_tags_named(haiku_list, 'a', null);
    if (children.length != 0) continue;
    for (var j = 0; j < 6; j++) {
      var anchor = document.createElement('a');
      anchor.href = 'xxxxx';
      var div = document.createElement('div');
      div.setAttribute('class', 'haiku');
      var span = document.createElement('span');
      span.setAttribute('name', 'haiku');
      span.setAttribute('width', '64');
      span.setAttribute('height', '64');
      var textarea = document.createElement('textarea');
      textarea.setAttribute('style', 'display:none');
      textarea.innerText = 'x y';
      span.appendChild(textarea);
      div.appendChild(span);
      var title = document.createElement('b');
      title.innerText = 'Haiku1';
      div.appendChild(title);
      var author = document.createElement('i');
      author.innerText = 'Author Name';
      div.appendChild(author);
      anchor.appendChild(div);
      haiku_list.appendChild(anchor);
    }
  }
}

var shared_canvas3d = [];

function generate_haiku_canvas(haiku, code) {
  // Create 2d canvas.
  var canvas2d = document.createElement('canvas');
  canvas2d.name = 'canvas2d';
  canvas2d.style.display = 'block';
  // have 2d canvas initially visible for layout.
  haiku.appendChild(canvas2d);
  canvas2d.setAttribute('width', haiku.getAttribute('width'));
  canvas2d.setAttribute('height', haiku.getAttribute('height'));
  canvas2d.time = 0;
  canvas2d.last_time = 0;
  canvas2d.program3d = null;
  canvas2d.old_code = null;
  canvas2d.code = code;
  canvas2d.memory = new Float32Array(16);
  canvas2d.mouse_x = 0;
  canvas2d.mouse_y = 0;
  canvas2d.mouse_inside = false;
  // Create 3d canvas.
  var canvas3d;
  if (shared_canvas3d.length >= 4) {
    canvas3d = shared_canvas3d.pop();
    shared_canvas3d.splice(0, 0, canvas3d);
  } else {
    canvas3d = document.createElement('canvas');
    shared_canvas3d.splice(0, 0, canvas3d);
    canvas3d.name = 'canvas3d';
    canvas3d.style.display = 'none';
    haiku.appendChild(canvas3d);
    canvas3d.setAttribute('width', haiku.getAttribute('width'));
    canvas3d.setAttribute('height', haiku.getAttribute('height'));
    canvas3d.addEventListener('webglcontextlost', function(e) {
      e.preventDefault();
    }, false);
    canvas3d.addEventListener('webglcontextrestored', function(e) {
      canvas3d.old_code = null;
    }, false);
  }
  canvas2d.cv3 = canvas3d;
  // Update Mouse
  var updateMouse = function(x, y) {
    var xx = (x - canvas2d.getBoundingClientRect().left) /
      canvas2d.clientWidth;
    var yy = (y - canvas2d.getBoundingClientRect().top) /
      canvas2d.clientHeight;
    xx = xx * 2 - 1;
    yy = 1 - yy * 2;
    xx *= canvas3d.w;
    yy *= canvas3d.h;
    xx = (xx + 1) / 2;
    yy = (yy + 1) / 2;
    canvas2d.mouse_x = xx;
    canvas2d.mouse_y = yy;
  };
  // Add mouse handling.
  canvas2d.dragging = false;
  window.addEventListener('mousemove', function(e) {
    updateMouse(e.clientX, e.clientY);
    if (canvas2d.dragging) {
      e.preventDefault();
    }
  }, true);
  canvas2d.addEventListener('mousedown', function(e) {
    window.stroke_buttons |= 1;
    e.preventDefault();
    canvas2d.dragging = true;
  }, true);
  window.addEventListener('mouseup', function(e) {
    if (!e.buttons) {
      window.stroke_buttons &= (~1);
      canvas2d.dragging = false;
    }
    e.preventDefault();
  }, true);
  // Handle enter and leave.
  canvas2d.addEventListener('mouseenter', function(e) {
    canvas2d.mouse_inside = true;
  });
  canvas2d.addEventListener('mouseleave', function(e) {
    canvas2d.mouse_inside = false;
  });
  // Handle touch events.
  var multitouch = false;
  if (navigator.msMaxTouchPoints !== undefined &&
      navigator.msMaxTouchPoints > 1) {
    multitouch = true;
  }
  if (navigator.maxTouchPoints !== undefined &&
      navigator.maxTouchPoints > 1) {
    multitouch = true;
  }
  canvas2d.addEventListener('touchstart', function(e) {
    if (haiku_tag_count > 1) { return; }
    e.preventDefault();
    if (multitouch) {
      if (e.touches.length >= 2) {
        window.stroke_buttons |= 1;
      }
    } else {
      window.stroke_buttons |= 1;
    }
    updateMouse(e.touches.item(0).clientX, e.touches.item(0).clientY);
  }, true);
  canvas2d.addEventListener('touchend', function(e) {
    if (haiku_tag_count > 1) { return; }
    e.preventDefault();
    if (multitouch) {
      if (e.touches.length < 2) {
        window.stroke_buttons &= (~1);
      }
    } else {
      window.stroke_buttons &= (~1);
    }
  }, true);
  canvas2d.addEventListener('touchmove', function(e) {
    if (haiku_tag_count > 1) { return; }
    e.preventDefault();
    updateMouse(e.touches.item(0).clientX, e.touches.item(0).clientY);
  }, true);
  // Create audio tag.
  var audio = find_tag_name(haiku.parentNode, null, 'audio');
  if (audio === null) {
    audio = document.createElement('a');
    audio.name = 'audio';
    audio.style.display = 'none';
    audio.style.color = 'white';
    audio.style.textShadow = '0px 0px 5px #cff';
    var p = parent_div(haiku);
    p.insertBefore(audio, p.firstChild);
    canvas2d.audio = audio;
  } else {
    canvas2d.audio = null;
  }
  // Create category tag.
  var category = find_tag_name(haiku.parentNode, null, 'category');
  if (category === null) {
    category = document.createElement('a');
    category.name = 'category';
    category.style.display = 'none';
    category.style.color = 'white';
    category.style.textShadow = '0px 0px 5px #cff';
    var p = parent_div(haiku);
    p.insertBefore(category, p.firstChild);
    canvas2d.category = category;
  } else {
    canvas2d.category = null;
  }

  return canvas2d;
}

function update_haikus(next) {
  update_haiku_lists();
  var haikus = document.getElementsByName('haiku');
  haiku_tag_count = haikus.length;
  var first_haiku = null;
  var work = [];
  for (var i = 0; i < haikus.length; i++) {
    var haiku = haikus[i];
    var code_tag = find_tag(haiku, 'textarea');
    var code = code_tag.value;
    var canvas2d = find_tag_name(haiku, 'canvas', 'canvas2d');
    if (canvas2d === null) {
      canvas2d = generate_haiku_canvas(haiku, code);
    }
    canvas2d.code = code;
    if (i === 0 ) { first_haiku = canvas2d; }
    // Add to the work queue.
    work.push(canvas2d);
  }
  // Do audio if there's only one.
  if (work.length === 1 && first_haiku !== null) {
    audio_haiku(first_haiku);
  }
  update_haikus_one(work, next);
}

function animate_haikus(tick) {
  update_haikus(function() {
    tick();
    setTimeout(function() {
      animate_haikus(tick);
    }, 30);
  });
}

//// Generate pentatonic sounds.

function chromatic(value) {
  return 440 * Math.pow(2, (value - 49) / 12);
}

function pentatonic(value) {
  return chromatic(Math.floor(value / 5) * 12 +
                   Math.floor((value % 5) * 12 / 5));
}

function synth(n, t) {
  return Math.sin(Math.PI * 2 * t * pentatonic(n + NOTE_BASE));
}

// Setup audio pipeline.
var audio_context;
try {
  audio_context = new AudioContext();
} catch (e) {
}
var audio_off = function(t, x, memory) { return [0, 0, 0, 1]; };
var audio_function = audio_off;
var audio_memory = new Float32Array(16);
var audio_canvas = null;
var audio_last_compile = audio_off;
var audio_last_code = '';
var audio_last_sync = new Date().getTime();
var audio_time_offset = 0;
var audio_time_base = GetTime();
var audio_raw = false;
var audio_play = false;
if (audio_context) {
  var audio_src = audio_context.createScriptProcessor(8192, 0, 1);
  audio_src.onaudioprocess = function(e) {
    var min = Math.min;
    var min = Math.max;
    var floor = Math.floor;
    try {
      var data = e.outputBuffer.getChannelData(0);
      var func = audio_function;
      // Periodically go back in sync with the main clock.
      // This should be done gradually, but currently isn't.
      // This will produce periodic glitches.
      var now = new Date().getTime();
      if (now - audio_last_sync > (10*60*1000)) {  // Sync every 10 minutes.
        audio_last_sync = now;
        audio_time_base = GetTime();
        audio_time_offset = 0;
      }
      var memory = audio_memory.slice(0);
      // Decide the clock offset.
      var offset = audio_time_offset / audio_context.sampleRate +
                   audio_time_base;
      audio_time_offset += data.length;
      if (audio_raw) {
        // Fill right channel.
        var func1 = function(t) {
          return func(t, memory);
        };
        var t = offset % (60*60*24);
        var step = 1.0 / audio_context.sampleRate;
        for (var j = 0; j < data.length; j++) {
          data[j] = func(t, memory);
          t += step;
        }
      } else {
        // Fill left channel.
        for (var j = 0; j < data.length; j+=STEP) {
          var t0 = (j / audio_context.sampleRate + offset) % (60*60*24);
          var t1 = ((j + STEP) / audio_context.sampleRate + offset) % (60*60*24);
          var func1 = function(t, x) {
            var val = func(t, x, memory)[0];
            return min(max(val, 0.0), 1.0);
          };
          var amp0 = func1(t0, 1.0);
          var amp1 = func1(t1, 1.0);
          var note0 = floor(func1(t0, 0.0) * NOTES);
          var note1 = floor(func1(t1, 0.0) * NOTES);
          for (var i = 0; i < STEP; i++) {
            var t = ((i + j) / audio_context.sampleRate + offset) % (60*60*24);
            var frac = i / STEP;
            var frac1 = 1 - frac;
            data[i + j] = (synth(note0, t) * amp0 * frac1 +
                           synth(note1, t) * amp1 * frac) * 0.5;
          }
        }
      }
      // Clone to other channels.
      for (var j = 1; j < e.outputBuffer.numberOfChannels; j++) {
        var buffer = e.outputBuffer.getChannelData(j);
        for (var i = 0; i < data.length; i++) {
          buffer[i] = data[i];
        }
      }
    } catch (e) {
    }
  }
  audio_src.connect(audio_context.destination);
}

function audio_haiku(cv) {
  var code = cv.code;
  if (!audio_context) return;
  try {
    if (!audio_play) {
      audio_function = audio_off;
      return;
    }
    if (audio_last_code === code) {
      audio_function = audio_last_compile;
      return;
    }
    audio_last_code = code;
    var compiled_code = compile(code);
    var tags = code_tags_dict(code);
    if (tags['audio'] === undefined) {
      audio_raw = false;
      var func = eval(compiled_code.join('\n'));
      var image = function(t, x, mem) {
        return func(
            t, 0, x, 0.5, cv.mouse_x, cv.mouse_y,
            window.stroke_buttons, mem);
      };
    } else {
      audio_raw = true;
      compiled_code[compiled_code.length - 1] = 'return audio_sample; }; go';
      var func = eval(compiled_code.join('\n'));
      var image = function(t, mem) {
        return func(
            t, 0, 0, 0, cv.mouse_x, cv.mouse_y,
            window.stroke_buttons, mem);
      };
    }
    audio_last_compile = image;
    audio_function = image;
    audio_memory = cv.memory;
    audio_canvas = cv;
  } catch (e) {
    audio_function = audio_off;
  }
}

function audio_toggle_play() {
  var mute_button = document.getElementById('audio_play');
  audio_play = !audio_play;
  if (audio_play) {
    mute_button.innerHTML = '&#10074;&#10074;';
  } else {
    mute_button.innerHTML = '&#9654;';
  }
}

var haiku_touch_port = null;
var haiku_touch_buffer = '';
window.stroke_buttons = 0;

function connect_touch() {
  try {
    haiku_touch_port = chrome.runtime.connect(
        'gjpkfjbomndhibbiiakfjpgjcaeggbic');
    haiku_touch_port.onMessage.addListener(function(m) {
      haiku_touch_buffer += m.data.replace(/[\r]/g, '');
      var parts = haiku_touch_buffer.split('\n');
      if (parts.length > 1) {
        for (var i = 0; i < parts.length - 1; i++) {
          if (parts[i].length === 0) continue;
          if (parts[i].substr(0, 1) === '~') {
            window.stroke_buttons |= 1 << (parseInt(parts[i].substr(1)));
          } else if (parts[i].substr(0, 1) === '^') {
            window.stroke_buttons &= ~(1 << (parseInt(parts[i].substr(1))));
          } else {
            console.log('stroke: ' + parts[i]);
          }
          if (window.onstroke !== 'undefined') {
            try {
              window.onstroke(parts[i]);
            } catch(e) {
            }
          }
        }
        haiku_touch_buffer = parts[parts.length - 1];
      }
    });
  } catch(e) {
  }
}

window.stroke_print = function(s) {
  if (haiku_touch_port === null) {
    return;
  }
  try {
    haiku_touch_port.postMessage({'data': s});
  } catch(e) {
  }
}

function decodeKey(code) {
  switch (code) {
    case 81: return 0;  // q [#]
    case 65: return 1;  // a [S]
    case 87: return 2;  // w [T]
    case 83: return 3;  // s [K]
    case 69: return 4;  // e [P]
    case 68: return 5;  // d [W]
    case 82: return 6;  // r [H]
    case 70: return 7;  // f [R]
    case 67: return 8;  // c [A]
    case 86: return 9;  // v [O]
    case 72: return 10;  // h [*]
    case 78: return 11;  // n [E]
    case 77: return 12;  // m [U]
    case 85: return 13;  // u [F]
    case 74: return 14;  // j [R]
    case 73: return 15;  // i [P]
    case 75: return 16;  // k [B]
    case 79: return 17;  // o [L]
    case 76: return 18;  // l [G]
    case 80: return 19;  // p [T]
    case 186: return 20;  // ; [S]
    case 219: return 21;  // [ [D]
    case 222: return 22;  // ' [Z]
  }
  return null;
}

window.addEventListener('load', connect_touch);

window.addEventListener('keydown', function(e) {
  var k = decodeKey(e.keyCode);
  if (k !== null) {
    window.stroke_buttons |= (1<<k);
  }
});

window.addEventListener('keyup', function(e) {
  var k = decodeKey(e.keyCode);
  if (k !== null) {
    window.stroke_buttons &= ~(1<<k);
  }
});

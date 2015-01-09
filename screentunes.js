(function() {
  var canvas;
  var ctx;
  var start = null;
  var t = null;
  var minimum = 0;
  var maximum = 0;
  var stage = 0;
  var baseFreq = 0;                                                             // frequency, NOT bar height
  var music = true;

  var AnimationFrame = (function() {
    var FPS = 16.6666666667; // 1000 / 60 = Frames Per Second
    var RAF = window.requestAnimationFrame
          || window.webkitRequestAnimationFrame
          || window.mozRequestAnimationFrame
          || window.msRequestAnimationFrame
          || window.oRequestAnimationFrame
          || function(a) { window.setTimeout(a, FPS); };
    var CAF = window.cancelAnimationFrame
          || window.webkitCancelAnimationFrame
          || window.mozCancelAnimationFrame
          || window.msCancelAnimationFrame
          || window.oCancelAnimationFrame
          || function(a) { window.clearTimeout(a); };
    return {
      request: function(a) {
        RAF(a);
      },
      cancel: function(a) {
        CAF(a);
      }
    };
  })();

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    /* $("#canvas").css("width", w + "px");
     $("#canvas").css("height", h + "px"); */
    /* render(); */
  }

  function bar(y, height) {
    ctx.fillRect(0,y,canvas.width,height);
  }

  function bars(spacing, height) {
    ctx.fillStyle = "rgb(0,0,0)";
    var y = 0;
    var maxy = canvas.height;
    while(y < maxy) {
      bar(y,height);
      y += spacing + height;
    }
  }
  
  function note(height) {
    if(height > 0) {
      bars(height, height);
    }
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var magic = (maximum - minimum) * (Math.sin(t / 2000))/2 + (maximum + minimum)/2;
    bars(magic, magic);
  }
  
  function toneGen (pitch) {
    return baseFreq * Math.pow(2, -pitch/12);
  }
  
  function play() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var pitch;
    var rel = t % 3000;
    if(rel < 1000) {
      pitch = toneGen(0);
    } else if(rel < 2000) {
      pitch = toneGen(4);
    } else if(rel < 3000) {
      pitch = toneGen(7);
    } else {
      pitch = toneGen(0);
    }
    note(pitch);
  }
  
  function setMin() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    minimum = -49 * $("#min").val() / 99 + 51;
    note(minimum);
  }
  
  function setMax() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    maximum = -49 * $("#max").val() / 99 + 51;
    note(maximum);
  }

  function frame(timestamp) {
    if (start === null && stage == 2) start = timestamp;
    t = timestamp - start;
    //render();
    if(stage == 0) {
      setMin();
    } else if (stage == 1) {
      setMax();
    } else {
      if($("#music").prop("checked")) {
        play();
      } else {
        render();
      }
    }
    AnimationFrame.request(frame);
  }

  $(document).ready(function() {
    canvas = document.getElementById("main");
    ctx = canvas.getContext("2d");
    $(window).bind("resize", resize);
    $("#tune2").hide();
    $("#is_set1").click(function() {
      stage++;
      $("#tune1").hide();
      $("#tune2").show();
    });
    $("#is_set2").click(function() {
      stage++;
      $("#tune2").hide();
      baseFreq = (minimum + maximum) / 2.82842712475;                              // 2*sqrt(2)
      if(2 * baseFreq > maximum) {
        alert("Can't play music, range of tones too small");
      }
    });
    resize();
    AnimationFrame.request(frame);
  });
})();

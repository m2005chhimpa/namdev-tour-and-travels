(function(){
  var path = document.getElementById('roadPath');
  var car = document.getElementById('car');
  var loader = document.getElementById('loader');
  var loaderText = document.getElementById('loaderText');
  var pathLen = path.getTotalLength();

  // ---- 1. Estimate a speed factor from the connection, when available ----
  function getSpeedFactor(){
    var conn = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
    if(conn && conn.effectiveType){
      switch(conn.effectiveType){
        case '4g':      return 1.6;   // fastest -> car covers more ground per second
        case '3g':      return 0.9;
        case '2g':      return 0.45;
        case 'slow-2g': return 0.25;
        default:        return 1.0;
      }
    }
    return 1.0; // Safari / Firefox: Network Information API unsupported, use a middle default
  }
  var speedFactor = getSpeedFactor();

  // ---- 2. Drive the car along the road based on elapsed time & speed ----
  // Progress eases toward a soft cap (never finishes on its own) so the car
  // keeps moving at a pace that reflects connection speed while the real
  // page assets are still loading.
  var progress = 0;
  var softCap = 0.9;
  var pageLoaded = false;
  var lastTime = null;

  function setCarAt(t){
    var d = Math.min(t, 1) * pathLen;
    var p1 = path.getPointAtLength(d);
    var p2 = path.getPointAtLength(Math.min(pathLen, d + 1));
    var angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
    car.setAttribute('transform', 'translate(' + p1.x + ',' + p1.y + ') rotate(' + angle + ')');
  }

  function tick(now){
    if(lastTime === null) lastTime = now;
    var dt = (now - lastTime) / 1000;
    lastTime = now;

    if(!pageLoaded){
      // asymptotic approach toward softCap, rate scaled by connection speed
      progress += (softCap - progress) * speedFactor * dt * 2.2;
    } else {
      // final sprint to the finish once the page has actually loaded
      progress += (1 - progress) * 6 * dt;
      if(progress > 0.995){
        finish();
        return;
      }
    }
    setCarAt(progress);
    requestAnimationFrame(tick);
  }

  function finish(){
    setCarAt(1);
    loaderText.textContent = 'Arrived — enjoy the site!';
    setTimeout(function(){
      loader.classList.add('loader-hidden');
    }, 450); // give the user a moment to read the final message before fading out
  }

  requestAnimationFrame(tick);

  window.addEventListener('load', function(){
    pageLoaded = true;
    loaderText.textContent = 'Almost there…';
  });

  // safety net: never let the loader hang forever even if 'load' misfires
  setTimeout(function(){ pageLoaded = true; }, 8000);
})();
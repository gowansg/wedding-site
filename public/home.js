(function() {
  var parallaxElement = document.getElementsByClassName('parallax')[0],
      header = document.getElementsByTagName('header')[0];
      scrollPosition = 0,
      ticking = false;

  function animateHeader(currentPosition) {
    var classes = header.classList;
    if (currentPosition >= 200 && !classes.contains('small')) {
      classes.add('small');
    }
    else if (currentPosition <= 200 && classes.contains('small')) {
      classes.remove('small');
    }
  }

  parallaxElement.addEventListener('scroll', function(e) {
    scrollPosition = this.scrollTop;
    if (!ticking) {
      window.requestAnimationFrame(function() {
        animateHeader(scrollPosition);
        ticking = false;
      });
    }
    ticking = true;
  });
})();

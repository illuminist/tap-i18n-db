var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

share = {};

share.lpad = function(value, padding) {
  var i, zeroes, _i;
  zeroes = "0";
  for (i = _i = 1; 1 <= padding ? _i <= padding : _i >= padding; i = 1 <= padding ? ++_i : --_i) {
    zeroes += "0";
  }
  return (zeroes + value).slice(padding * -1);
};

share.once = function(cb) {
  return function() {
    if (cb.once == null) {
      cb.once = true;
      return cb();
    }
  };
};

share.dialectOf = function(lang) {
  if ((lang != null) && __indexOf.call(lang, "-") >= 0) {
    return lang.replace(/-.*/, "");
  }
  return null;
};

share.now = function() {
  return new Date().getTime();
};


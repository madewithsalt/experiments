/*global jQuery, $ */
/*jshint laxcomma:true */
// ^- jshint settings
// ******************************
//* Just a Plugin Template!

(function() {
  'use strict';

  $.fn.myPlugin = function(option) {
    return this.each(function () {
      var $this = $(this)
        , options = typeof(option) === 'object' && option;


      $this.data('content', (data = new Tooltip(this, options)));

    });

  };

  $.fn.myPlugin.defaults = {
    // set any default settings here.
  };

})(jQuery);

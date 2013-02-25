/*global jQuery, $ */
/*jshint laxcomma:true */
// ^- jshint settings
// ******************************
//* Tooltip Plugin
//* Built by: Kristi Centinaro
//* Inspired by Bootstrap's jQuery tooltip plugin,
//* but with SEMICOLONS. <3
//* v1.0 - Feb 2013 - basic functionality.
// ******************************
//
// Try it yourself!
// -------------------------------
// Add these styles to your CSS:
// .tt-block {
//   position: absolute;
//   min-width: 40px; }
//   .tt-block .tt-content {
//     border-radius: 4px;
//     -moz-border-radius: 4px;
//     -webkit-border-radius: 4px;
//     background-color: #3b3a3a;
//     color: white;
//     padding: 2px 4px;
//     margin-bottom: 4px; }
//   .tt-block .tt-pointer {
//     width: 0;
//     height: 0;
//     position: absolute; }
//   .tt-block.top .tt-pointer {
//     border-right: 8px solid transparent;
//     border-left: 8px solid transparent;
//     border-top: 8px solid #3b3a3a;
//     bottom: -3px;
//     left: 8px; }



(function(){
  'use strict';

  var Tooltip = function(element, options) {
    this.init('tooltip',  element, options);
  };

  Tooltip.prototype = {
    init: function (type, element, options) {
      this.type = type;
      this.$element = $(element);
      this.options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data());

      this.build();
    }

    , build: function () {
        // build a jQuery object from the template
        this.$template = $(this.options.template);

        // Right now, this requires an .ht-content element to
        // drop the hovertext content into.
        this.$template.addClass(this.options.align)
          .find('.tt-content')
          .append(this.$element.data('content'));

        // Make it unseen, and then...
        this.$template.hide();
        // ... prepend this new block above the element to be
        // interacted with.
        this.$element.after(this.$template);

        // Save a reference to this tooltip's template object
        // for use later (without traversing the DOM for it)
        this.$element.data('tooltipObj', this.$template);

        // bind our tooltip events
        this.bindEvents();
    }

    , bindEvents: function () {
        var self = this;

        if(this.options.trigger === 'hover') {
          this.$element.hover(
            function() {
              self.show(self.$template, self.options.animate);
            }, function() {
              self.hide(self.$template);
           });
        }

    }

    , show: function(element, animate) {
        var $tooltip = $(element)
          , tipHeight = 0
          , tipWidth = 0
          , pointerMargin = 0;

        $tooltip.css('opacity', '0').show();

        // now that it is visible we can pull the height/width.
        if ($tooltip.hasClass('top')) {
          tipHeight = ($tooltip.height() + this.$element.height() + 4);
          tipWidth = ($tooltip.width() / 3);
          pointerMargin = ($tooltip.width() / 3);

        }

        $tooltip.css({
            'margin-top': tipHeight * -1
          , 'margin-left': tipWidth * -1
        });

        $tooltip.find('.tt-pointer').css({
          'margin-left': pointerMargin - 4
        });

        if (animate) {
            $tooltip.animate({
              'opacity': '1'
            }, 200);
        } else {
          $tooltip.show();
        }
    }

    , hide: function(element) {
        var $tooltip = $(element);

        $tooltip.hide();
    }
  };

  $.fn.tooltip = function(option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('content')
        , align = $this.data('align')
        , options = typeof(option) === 'object' && option;

      // create an options object if none exists, and we have data values.
      if(!options && align) {
        options = {};
        options.align = align;
      }

      $this.data('content', (data = new Tooltip(this, options)));

    });

  };

  $.fn.tooltip.defaults = {
      align: 'top'
    , animate: true
    , trigger: 'hover'
    // required classes: tt-block (main container), tt-content (there the text goes)
    , template: '<div class="tt-block"><div class="tt-pointer"></div><div class="tt-content"></div></div>'
  };

})(jQuery);

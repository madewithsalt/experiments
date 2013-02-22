/*global $ */
/*jshint laxcomma:true */

'use strict';
// #El Piano App!
// ### by Kristi Centinaro
//
// This script:
//
// 1. Is instantiated on docready with a new operator
// 2. Builds the HTML from a Handlebars template
// 3. Applies audio files if supported, and file paths are provided
// 4. Listens for a comma, separated list of 'notes', and plays them

//## REQUIRES:
//jQuery, Modernizr Audio Support

//## The Guts:
// Create a namespace for our variables and methods
var PI = PI || {};

// Name the place where our views will be stored.
// (in this case, they're grabbed from the dom, so we assign when onReady)
PI.Views = {};

// The Piano object is what we instantiate.
PI.Piano = function(settings) {
  // ensure we've passed along at least an HTML template and input.
  if (!settings || !settings.template || !settings.input) {
    $.error('You must at least define a template and an input for the piano!');
    return;
  }
    // take the specified container, or add to the body.
    this.$targetContainer = settings.container ? settings.container : $('body');
    this.$template = settings.template;
    this.$input = settings.input;

    // we will store an array of available notes
    // to check against type errors & wrong chars.
    this.notes = [];

    // optional audio fun. :)
    // this loose implementation works in Safari and Chrome,
    // Firefox doesn't like the audio/mpeg content type ;-;
    if ($('html').hasClass('audio')) {
      this.audioPath = settings.audioPath ? settings.audioPath : false;
      this.audioFormat = settings.audioFormat || 'mp3';
    }

    // Build the HTML!
    this.buildView();

};

PI.Piano.prototype = {

    buildView: function () {
      this.$targetContainer.append(this.$template);
      this.$object = this.$targetContainer.find('.piano-keyboard');

      // If we have audio fun, we build a div to drop
      // our hidden audio elements into.
      if(this.audioPath && this.audioFormat) {
        var self = this
          , audioBlock = $('<div class="piano-audio">')
          , keys = this.$object.find('.key');

          this.$targetContainer.append(audioBlock);

          // iterate through the keys and build audio nodes.
          $(keys).each(function(){
              var keyNote = $(this).data('note')
                // for the sharp notes (#), replace with %23 to not bork the URL's
                , audioFile = self.audioPath + '/' + keyNote.replace('#', '%23') + '.' + self.audioFormat
                , audioNode = $('<audio />');

              // from here, we replace the # with 'sharp' for id naming,
              // as # inside a class makes jQuery choke bad. :(
              keyNote = keyNote.replace('#', 'sharp');

              // yank the note info while we're here and store it.
              self.notes.push(keyNote);

              // add a key-based class to reference later for adding/removing classes.
              $(this).addClass('key_' + keyNote);

              audioNode.attr('src', audioFile)
                .attr('id', 'note_' + keyNote)
                .attr('loop', 'true');

              //insert them into our new container
              self.$targetContainer.find('.piano-audio').append(audioNode);
          });

      }

      this.bindEvents();
    }

  , bindEvents: function () {
      var self = this;

      this.$input.on('focus', function() {
          var inputNode = $(this);

          $(document).on('keyup', function(event) {
            // pass the node with the event to
            // grab the value on the qualifying event.
            self.processKeyUpEvent(event, inputNode);
          });

      });
  }

  , processKeyUpEvent: function (event, inputNode) {
      var key = event.key || event.keyCode
        , ENTER = 13
        , keyInput = inputNode.val().split(',');

      if (key === ENTER) {
          this.triggerKeys(keyInput);
      }
  }

  , triggerKeys: function(keyInput) {
      // Holy closures batman! D:
      var self = this
        , keys = [] // legit keys
        , keyStr = ''
        , keyLen // length of processed keys
        , num = 1 // iterator for setTimeout loop
        , isPlaying = false
        , playLoop; // where we'll define the setTimout for setting/clearing

      // Iterate through our input and clean up formatting,
      // and make sure the values match up to keys.
      for (var i = 0; i < keyInput.length; i++) {
          // make sure string is uppercase and has no spaces,
          // and matches our adjustment from # to 'sharp'.
          keyStr = keyInput[i].toUpperCase().replace(' ', '').replace('#', 'sharp');

          // push only a legit key to the keys array.
          for (var n = 0; n < self.notes.length; n++) {
            if(keyStr === self.notes[n]) {
              keys.push(keyStr);
              break;
            }
          }
      }

      function playSequence() {
        // if we are already playing, cancel it out and start anew
        if (isPlaying) {
          clearInterval(playLoop);
          console.log('clearing loop!');
        } else {
          isPlaying = true;
        }
          // start off by playing the first note.
          self.playNote(keys[0]);

          playLoop = setInterval(function(){

            if (num < keyLen) {
              // should always be true, but let's be sure
              // we check if true by checking if
              // num - 1 is a negative number.
              if (num - 1 % 1 !== 0) {
                self.pauseNote(keys[num -1]);
              }

              // play the note, increment the num
              self.playNote(keys[num]);
              num++;

            } else {
              // we're done, clear the timeout and set isPlaying flag,
              // and stop the last note.
              self.pauseNote(keys[num-1]);
              clearInterval(playLoop);
              console.log('clearing loop!');

              isPlaying = false;
            }
          }, 1250); // give the audio a tiny bit of extra time to play (over 1s req.)

      }

      // confirm our array length and start the sequence!
      keyLen = keys.length;
      playSequence();


    }
      // --- PLAY AND PAUSE METHODS ---
      // we'll check if we're using audio before we try
      // to call the .play()/.pause() methods, else, we'll just
      // show and hide the class names.
      // we sidestep jQuery here, because i found it was inconsistent
      // in properly calling the audio methods.
    , playNote: function (note) {
        console.log('playing: ', note);

        if(this.audioPath) {
          var audioNode = document.getElementById('note_' + note);
          audioNode.play();
        }
        $('.key').filter('.key_' + note).addClass('active');
    }

    , pauseNote: function(note) {
        console.log('pausing: ', note);

        if(this.audioPath) {
          var audioNode = document.getElementById('note_' + note);
          audioNode.pause();
        }
        $('.key').filter('.key_' + note).removeClass('active');
      }
  };



// Fire in zee hole!
$(function() {
  // Since we're scraping our views from the index
  // we grab them once the DOM is loaded:
  PI.Views = {
    keyboard: $('#piano-template').html()
  };

  var myPiano = new PI.Piano({
      container: $('.container')
    , template: PI.Views.keyboard
    , input: $('.piano-input')
    , audioPath: 'audio'
    , audioFormat: 'mp3'
  });

});

// My audio files are a little gnarly, sorry!
// I bootstrapped 'em from from GarageBand :D

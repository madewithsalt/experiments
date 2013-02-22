/*global $, Handlebars, $D */
/*jshint laxcomma:true */
'use strict';

//# Sample Chatbox UI
// Just a simple experiment in building a chatbox.

// define the namespace
var SPC = SPC || {};

//## SPC.View
// This is an object to be instantiated with new,
// passing the html of a template: ie $(myDiv).html();
SPC.View = function(template) {
  this.template = Handlebars.compile(template);
};

SPC.View.prototype.render = function(data) {
  return this.template(data);
};

//## Chatbox Object
// The core of the min-app.
SPC.ChatBox = function(settings) {
  var chatHeader = ''
    , chatBox = new SPC.View(SPC.Templates.chatContainer);

  if (settings.user) {
    chatHeader = settings.user;
  }

  this.$targetContainer = settings.targetContainer || $('body');

  this.$targetContainer.append(chatBox.render({header: chatHeader}));

  // This would not work if multiple chats were on a page.
  // Could 1) Assign div directly to object 2) Use ID with index. chat_0, chat_1, etc
  this.$object = this.$targetContainer.find('.chat-container');

  this.$input = this.$object.find('input');

  this.bindEvents();

  console.log('send a chat by typing: $(\'.chat-container\').trigger(\'sendChat\', [\'<yourmessage>\', \'http://url.to/avatar/jpg\']);');
  console.log('or just: $(\'.chat-container\').trigger(\'sendChat\', \'<yourmessage>\'');

};

SPC.ChatBox.prototype = {
    addChat: function (message, avatar) {
      // Date formatting requires date.js
      // from: http://sandbox.kendsnyder.com/date/#demonstration
      var timestamp = $D((new Date())).strftime('%I:%M %p')
        , chatView = new SPC.View(SPC.Templates.chatReply)
        , chatAvatar = avatar ? avatar : 'http://placekitten.com/100/100'
        , chatData = {
              chattext: message
            , chattime: timestamp
            , avatar: chatAvatar
          };

      this.$chatContainer = this.$object.find('.sprc-chatblock').append(chatView.render(chatData));
    }

  // most times this would go in it's own controller...
  , bindEvents: function () {
      var self = this;
      this.$object.on('sendChat',  function(event, message, avatar){
        self.addChat(message, avatar);

        self.$chatContainer.animate({
          scrollTop: self.$chatContainer.height()}, 200);
      });

      this.$input.on('focus', function(){
        var inputNode = $(this);

        $(this).on('keyup', function(event){
            self.processKeyUpEvent(event, inputNode);
        });
      });
    }

  , processKeyUpEvent: function (event, inputNode) {
      var key = event.key || event.keyCode
        , ENTER = 13
        , messageTxt = inputNode.val();

      if (key === ENTER) {
          this.$object.trigger('sendChat', messageTxt);
          inputNode.val('');
      }
  }

};




$(function(){
    // fetch templates from DOM after it's loaded.
    SPC.Templates = {
        chatContainer: $('#chatbox-template').html()
      , chatReply: $('#chat-template').html()
    };


    // fire in zee hole!
    var chatInstance = new SPC.ChatBox({
      user: 'Kristi'
    });

    $('.chat-container').trigger('sendChat', 'Hello, I\'m a message!');


});

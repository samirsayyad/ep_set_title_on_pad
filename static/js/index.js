exports.handleClientMessage_CUSTOM = function(hook, context, cb){
  if(context.payload.action == "recieveTitleMessage"){
    var message = context.payload.message;
    if(!$("#title").is(":focus")){ // if we're not editing..
      if(message){
        window.document.title = message;
        $('#title').val(message);
      }else{
        
        window.document.title = pad.getPadId();
        $('#title').val(pad.getPadId());
      }
    }
  }
}

exports.documentReady = function(){
  if (!$('#editorcontainerbox').hasClass('flex-layout')) {
      $.gritter.add({
          title: "Error",
          text: "Ep_set_title_on_pad: Please upgrade to etherpad 1.9 for this plugin to work correctly",
          sticky: true,
          class_name: "error"
      })
  }
  

  $('#title').keyup(function(e){
    sendTitle();
    window.document.title = $('#title').val();
    if(e.keyCode === 13){
      sendTitle();
      window.document.title = $('#title').val();
      $('#title').blur(); 

    }
  });
}

function sendTitle(){
  var myAuthorId = pad.getUserId();
  var padId = pad.getPadId();
  var message = $('#title').val();
  // Send chat message to send to the server
  var message = {
    type : 'title',
    action : 'sendTitleMessage',
    message : message,
    padId : padId,
    myAuthorId : myAuthorId
  }
  pad.collabClient.sendMessage(message);  // Send the chat position message to the server
}

exports.handleClientMessage_CUSTOM = (hook, context, cb)=>{
  if(context.payload.action == "recieveTitleMessage"){
    var message = context.payload.message;
   // if(!$("#title").is(":focus")){ // if we're not editing..
      if(message){
        window.document.title = message;
        $('#title').val(message);
      }else{
        var padId = pad.getPadId() ;
        window.document.title = padId;
        $('#title').val(padId);
        sendTitle(padId);
      }
      

  
   // }
  }

  return []
}
exports.aceInitialized = (hook, context)=>{
  var message = clientVars.ep_title_pad.title
  if(message){
    window.document.title = message;
    $('#title').val(message);
  }else{
    var padId = pad.getPadId() ;
    window.document.title = padId;
    $('#title').val(padId);
    sendTitle(padId);
  }
  var minSize = 22 
  var currentSize =$('#title').val().length
  if (currentSize > minSize)
  $('#title').attr('size',currentSize);
  if (currentSize < 10)
  $('#title').attr('size',minSize);
  return []

}
exports.documentReady = ()=>{
  if (!$('#editorcontainerbox').hasClass('flex-layout')) {
      $.gritter.add({
          title: "Error",
          text: "Ep_set_title_on_pad: Please upgrade to etherpad 1.9 for this plugin to work correctly",
          sticky: true,
          class_name: "error"
      })
  }
  if (!window.matchMedia('(max-width: 720px)').matches) {

  
    $("#save_title").click(function(e){
      sendTitle();
      window.document.title = $('#title').val();
      $('#title').blur(); 
      $("#save_title").removeClass("save_title_show")

    })
    $('#title').keyup(function(e){
      var minSize = 22 
      var currentSize =$(this).val().length
      if (currentSize > minSize)
        $(this).attr('size',currentSize);
      if (currentSize < 10)
        $(this).attr('size',minSize);

      $("#save_title").addClass("save_title_show")   
      if(e.keyCode === 13){
        $("#save_title").click()
      }
    });
  }else{
    $('#title').attr('readonly', 'readonly');

  }

  return [];
}

function sendTitle(value){
  var myAuthorId = pad.getUserId();
  var padId = pad.getPadId();
  if (value)
  {
    var message = value
  }else{
    var message = $('#title').val();
  }
  
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

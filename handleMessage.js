/***
*
* Responsible for negotiating messages between two clients
*
****/

var authorManager = require("../../src/node/db/AuthorManager"),
padMessageHandler = require("../../src/node/handler/PadMessageHandler"),
               db = require('ep_etherpad-lite/node/db/DB'),
            async = require('../../src/node_modules/async');



// Remove cache for this procedure
//db['dbSettings'].cache = 0;

var buffer = {};

/*
* Handle incoming messages from clients
*/
exports.handleMessage = (hook_name, context, callback)=>{
  // Firstly ignore any request that aren't about chat
  var isTitleMessage = false;
  if(context){
    if(context.message && context.message){
      if(context.message.type === 'COLLABROOM'){
        if(context.message.data){
          if(context.message.data.type){
            if(context.message.data.type === 'title'){
              isTitleMessage = true;
            }
          }
        }
      }
    }
  }

  if(!isTitleMessage){
    return false;
  }
  var message = context.message.data;
  /***
    What's available in a message?
     * action -- The action IE chatPosition
     * padId -- The padId of the pad both authors are on
     * targetAuthorId -- The Id of the author this user wants to talk to
     * message -- the actual message
     * myAuthorId -- The Id of the author who is trying to talk to the targetAuthorId
  ***/
  if(message.action === 'sendTitleMessage'){
    var authorName = authorManager.getAuthorName(message.myAuthorId); // Get the authorname
    var msg = {
      type: "COLLABROOM",
      data: { 
        type: "CUSTOM",
        payload: {
          action: "recieveTitleMessage",
          authorId: message.myAuthorId,
          authorName: authorName,
          padId: message.padId,
          message: message.message
        }
      }
    };
    sendToRoom(message, msg);
    saveRoomTitle(message.padId, message.message);
  }

  if(isTitleMessage === true){
    return[];
  }else{
    return true;
  }
}

function saveRoomTitle(padId, message){
  db.set("title:"+padId, message);
}

function sendToRoom(message, msg){
  var bufferAllows = true; // Todo write some buffer handling for protection and to stop DDoS -- myAuthorId exists in message.
  if(bufferAllows){
    setTimeout(function(){ // This is bad..  We have to do it because ACE hasn't redrawn by the time the chat has arrived
      padMessageHandler.handleCustomObjectMessage(msg, false, function(){
        // TODO: Error handling.
      })
    }
    , 100);
  }
}

exports.clientVars = async (hook, pad, callback)=>{
  var padId = pad.pad.id;
  var title = await db.get("title:"+padId);

    var msg = {
      type: "COLLABROOM",
      data: {
        type: "CUSTOM",
        payload: {
          action: "recieveTitleMessage",
          padId: padId,
          message: title
        }
      }
    }
    sendToRoom(false, msg);
 
  return {
    ep_title_pad : {
      title : title
    }
  };
}

'use strict';

function sendTitle(value) {
  var myAuthorId = pad.getUserId();
  var padId = pad.getPadId();
  var padTitle = value;
  if (!value) padTitle = $('#title').val();

  // Send chat message to send to the server
  var message = {
    type: 'title',
    action: 'sendTitleMessage',
    message: padTitle,
    padId: padId,
    myAuthorId: myAuthorId
  };
  pad.collabClient.sendMessage(message); // Send the chat position message to the server
}

function createBreadcrumb(titles) {
  var myAuthorId = pad.getUserId();
  var padId = pad.getPadId();
  var message = {
    type: 'title',
    action: 'getPadTitleMessage',
    padId: padId,
    padIds: titles,
    myAuthorId: myAuthorId
  };
  pad.collabClient.sendMessage(message);
}

function getPadName(message) {
  var padId = message ? message : window.pad.getPadId();
  if (padId.indexOf(':') >= 1) padId = padId.split(":").pop();
  return padId;
}

exports.handleClientMessage_CUSTOM = function (hook, context, cb) {
  var action = context.payload.action;
  var message = context.payload.message;
  if (action === "recieveTitleMessage") {
    var padId = getPadName(message);
    if (message) {
      window.document.title = padId;
      $('#title').val(padId);
    } else {
      window.document.title = padId;
      $('#title').val(padId);
      sendTitle(padId);
    }
  }

  if (action === "recievePadTitleMessage") {
    var padLinks = context.payload.padIds;
    var titles = context.payload.message;
    var link = "";
    var origin = location.origin;
    // Compatibility with dynamic URLs in proxy mode
    if (window.location.pathname.indexOf('/p/') === 0) link = "/p";

    titles.forEach(function (el, index) {
      link += "/" + padLinks[index];
      $(document).find(".nd_breadcrumb").append("<a class='' href='" + origin + link + "'>" + el + "  </a> ");
    });
  }
};

exports.aceInitialized = function (hook, context) {
  var message = clientVars.ep_title_pad.title;
  if (message && message.indexOf(':') >= 1) {
    var padIds = message.split(":");
    padIds.split(":").pop();
    createBreadcrumb(padIds);
  } else {
    var padIds = pad.getPadId().split(":");
    padIds.pop();
    createBreadcrumb(padIds);
  }

  var minSize = 22;
  var currentSize = $('#title').val().length;
  if (currentSize > minSize) $('#title').attr('size', currentSize);
  if (currentSize < 10) $('#title').attr('size', minSize);
};

exports.documentReady = function (hook, context) {
  if (!$('#editorcontainerbox').hasClass('flex-layout')) {
    $.gritter.add({
      title: "Error",
      text: "Ep_set_title_on_pad: Please upgrade to etherpad 1.9 for this plugin to work correctly",
      sticky: true,
      class_name: "error"
    });
  }

  $("#save_title").click(function (e) {
    sendTitle();
    window.document.title = $('#title').val();
    $('#title').blur();
    $("#save_title").removeClass("save_title_show");
  });
  $('#title').keyup(function (e) {
    var minSize = 22;
    var currentSize = $(this).val().length;
    if (currentSize > minSize) $(this).attr('size', currentSize);
    if (currentSize < 10) $(this).attr('size', minSize);

    $("#save_title").addClass("save_title_show");
    if (e.keyCode === 13) {
      $("#save_title").click();
    }
  });
};
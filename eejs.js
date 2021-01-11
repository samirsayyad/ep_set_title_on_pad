var eejs = require('ep_etherpad-lite/node/eejs/');

exports.eejsBlock_styles = (hook_name, args, cb)=>{
  return [];
}

exports.eejsBlock_body = (hook_name, args, cb)=>{
  args.content = eejs.require('ep_set_title_on_pad/templates/title.ejs', {settings : false}) + args.content;
  return []
}



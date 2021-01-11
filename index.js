var settings = require('ep_etherpad-lite/node/utils/Settings'),
          db = require('ep_etherpad-lite/node/db/DB').db;

// Remove cache for this procedure
db['dbSettings'].cache = 0;

exports.exportFileName = async (hook, padId, callback)=>{
  //var title = padId;
  // Sets Export File Name to the same as the title
  var title = await db.get("title:"+padId) || padId
  return title;
}

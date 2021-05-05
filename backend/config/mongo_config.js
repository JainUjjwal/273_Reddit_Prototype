const MongoClient = require('mongodb').MongoClient
 
// Note: A production application should not expose database credentials in plain text.
const MONGO_URI = "mongodb+srv://admin:admin123@redditcluster.hg7v9.mongodb.net/reddit_db?retryWrites=true&w=majority"
//const MKTG_URI = "mongodb://<dbuser>:<dbpassword>@<host1>:<port1>,<host2>:<port2>/<dbname>?replicaSet=<replicaSetName>"
 
function connect(url) {
  return MongoClient.connect(url).then(client => client.db())
}
 
module.exports = async function() {
  let databases = await Promise.all([connect(MONGO_URI)])
 
  return {
    production: databases[0],
  }
}
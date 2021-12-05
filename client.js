// Bùi Quốc Huy - 19521598
// Nguyễn Văn Chương - 18520538
// Bùi Anh Huy - 19521596
// Đinh Tiến Đạt -19521331

const WebSocket = require('ws');
const ServerAddress = 'ws://192.168.1.5:8000';
const wss = new WebSocket(ServerAddress);
const nedb = require('nedb');
var db = new nedb({ filename: 'database.db' });
db.loadDatabase();
wss.on('open', () => {});
function get() {
  db.find({}, function (err, data) {
    var temp = {
      action: 'get',
      data: JSON.stringify(data),
    };
    wss.send(JSON.stringify(temp));
  });
}
function inserts(name,user) {
      var temp = {
        action: 'inserts',
        data: JSON.stringify({name,user}),
      };
      wss.send(JSON.stringify(temp));
  }
function deleteItem(key) {
    var temp = {
      action: 'delete',
      data: JSON.stringify({name:key}),
    };
    wss.send(JSON.stringify(temp));
}
function UpdateItem(name,user) {
    var temp = {
      action: 'update',
      data: JSON.stringify({name,user}),
    };
    wss.send(JSON.stringify(temp));
}
function IndexItem(name,unique) {
    var temp = {
      action: 'ensureIndex',
      data: JSON.stringify({name,unique}),
    };
    wss.send(JSON.stringify(temp));
}
function RemoveIndexItem(name) {
    var temp = {
      action: 'RemoveEnsureIndex',
      data: JSON.stringify({name}),
    };
    wss.send(JSON.stringify(temp));
}
wss.on('message', () => {
 
     //get()
     //inserts('quochuy','quochuy1')
    //deleteItem('quochuy')
    //UpdateItem('quochuy','quochuy1234')
    //IndexItem('name',true)
    // RemoveIndexItem('name')
});
wss.onmessage = (message) => {
  if(message.data)
  console.log(JSON.parse(message.data));
};
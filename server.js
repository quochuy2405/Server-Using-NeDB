const app = require('express')();
const appws = require('express-ws')(app);
const WebSocket = require('ws');
const PORT = 8000;
const nedb = require('nedb');
const database = new nedb('database.db');
database.loadDatabase();

const wss = new WebSocket.Server({
  port: PORT,
});
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    message = JSON.parse(message.toString()) || 'get';
    switch (message?.action) {
      case 'get': {
        console.log('get item ...');
        database.find({}, function (err, docs) {
          if (docs) {
            console.log(JSON.stringify(docs));
            ws.send(JSON.stringify(docs));
            ws.close();
          } else {
            console.log('Insert: failed');
          }
        });
        break;
      }
      case 'inserts': {
        let data = JSON.parse(message.data.toString());
        console.log('inserting item ...');
        console.log(data);
        database.insert(data, (err, rows) => {
          if (rows) {
            console.log('Insert: Success');
            ws.send(JSON.stringify('Insert: Success'));
            ws.close();
          } else {
            console.log('Insert: failed');
            ws.send(JSON.stringify('Insert: failed'));
            ws.close();
          }
        });
        database.loadDatabase();
        break;
      }
      case 'delete': {
        let data = JSON.parse(message.data.toString());
        console.log('deleting item ...');
        console.log(data);
        database.remove({ name: data.name }, { multi: true }, (err, rows) => {
          if (rows > 0) {
            console.log('Delete: Success');
            console.log('rowDelete:' + rows);
            ws.send(JSON.stringify('rowDelete:' + rows));
            ws.close();
          } else {
            console.log("Delete: Failed => Don't find item delete");
            ws.send(JSON.stringify("Delete: Failed => Don't find item delete"));
            ws.close();
          }
        });
        database.loadDatabase();
        break;
      }
      case 'update': {
        let data = JSON.parse(message.data.toString());
        console.log('updating item ...');
        console.log(data);
        database.update(
          { name: data.name },
          { name: data.name, user: data.user },
          { multi: true },
          function (err, rows) {
            if (rows > 0) {
              console.log('Update: Success');
              console.log('rowUpdate:' + rows);
              ws.send(JSON.stringify('rowUpdate:' + rows));
              ws.close();
            } else {
              console.log("Update: Failed => Don't find item update");
              ws.send(
                JSON.stringify("Update: Failed => Don't find item update")
              );
              ws.close();
            }
          }
        );

        database.loadDatabase();
        break;
      }
      case 'ensureIndex': {
        let data = JSON.parse(message.data.toString());
        console.log('ensureIndex item ...');
        console.log(data);
        database.ensureIndex(
          { fieldName: data.name, unique: data.unique },
          function (err) {
            if (err) {
              console.log('ensureIndex: Failed =>' + err);
              ws.send(JSON.stringify('ensureIndex: Failed =>' + err));
              ws.close();
            } else {
              console.log('ensureIndex: Success');
              ws.send(JSON.stringify('ensureIndex: Success'));
              ws.close();
            }
          }
        );

        database.loadDatabase();
        break;
      }
      case 'RemoveEnsureIndex': {
        let data = JSON.parse(message.data.toString());
        console.log('RemoveEnsureIndex item ...');
        console.log(data);
        database.removeIndex(data.name, function (err) {
          if (err) {
            console.log('RemoveEnsureIndex: Failed =>' + err);
            ws.send(JSON.stringify('RemoveEnsureIndex: Failed =>' + err));
            ws.close();
          } else {
            console.log('RemoveEnsureIndex: Success');
            ws.send(JSON.stringify('RemoveEnsureIndex: Success'));
            ws.close();
          }
        });

        database.loadDatabase();
        break;
      }
      default: {
        console.log('default');
        ws.send(JSON.stringify('Function Error'));
        ws.close();
        break;
      }
    }
  });

  ws.send('');
});

console.log('server running port:' + PORT);

const WebSocket = require('ws')

const express = require('express')
require('dotenv').config()

const router = express.Router()
const jwt = require('jsonwebtoken')

const port = parseInt(process.env.PORT) + 1;
const wss = new WebSocket.Server({ port: port });

let clients = [];
let boardID = 0;

// URL example: ws://my-server?token=my-secret-token
wss.on('connection', (ws, req) => {
    console.log(req);
    console.log(`Client connected ${req.headers}`);

    try{
        if(clients[boardID] != null){
            if (!clients[boardID].has(ws)){
                clients[boardID].add(ws);
            }
        }
        else{
            clients[boardID] = new Set();
            clients[boardID].add(ws);
        }
    }
    catch(err){
        console.log("caught error: " + err.message)
    }

    ws.on('message', (message) => {
        console.log('Received message:', message);
        let data = JSON.parse(message);

            //check if the board should switch
        if(boardID != data.boardid){
            //switch it
            
            clients[boardID].delete(ws);

            boardID = data.boardid;

            try{
                if(clients[boardID] != null){
                    if (!clients[boardID].has(ws)){
                        clients[boardID].add(ws);
                    }
                }
                else{
                    clients[boardID] = new Set();
                    clients[boardID].add(ws);
                }
            }
            catch(err){
                console.log("caught error: " + err.message)
            }
        }
        else{
            //do nothing
        }

        // Send a response back to the client along with some other info
        
        ws.send(JSON.stringify({
            id: 80,
            msg: "just an empty query"
            //no need to send data back to the client, for now.
        }));

        //send to everyone that ISNT the client.
        clients[boardID].forEach(client => {
            if (client !== ws){
                client.send(JSON.stringify({
                    id: 1,
                    notes: data.notes,
                    userid: data.userid
                }));
            }
        });
    });

    ws.on('close', () => {
        clients[boardID].delete(ws);
        console.log('Client disconnected');
    });

});


module.exports = router
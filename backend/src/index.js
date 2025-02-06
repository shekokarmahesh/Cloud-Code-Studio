import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import { PORT } from './config/serverConfig.js';
import {Server} from 'socket.io';
import {createServer} from 'node:http';
import chokidar from 'chokidar';
import { handleEditorSocketEvents } from './socketHandlers/editorHandler.js';
import fs from 'fs';
import { handleContainerCreate, listContainer } from './containers/handleContainerCreate.js';
import { WebSocketServer} from 'ws';
import { handleTerminalCreation } from './containers/handleTerminalCreation.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        method: ['GET', 'POST'],
        
    }
});


app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.use('/api', apiRouter);

app.get('/ping', (req, res) => {
    return res.json({ message: 'pong' });
});

const editorNamespace = io.of('/editor');

// const terminalNamespace = io.of('/terminal');


// terminalNamespace.on("connection", (socket) => {
//     let projectId = socket.handshake.query['projectId'];
//     console.log("🔗 Client connected to /terminal namespace");

//     socket.on("shell-input", (data) => {
//         console.log("🚀 Received shell input:", data);
//         terminalNamespace.emit("shell-output", data);
//     });

//     socket.on("disconnect", () => {
//         console.log("🚫 Client disconnected from /terminal namespace");
//     });
//     handleContainerCreate(projectId, socket );

// });



editorNamespace.on("connection", (socket) => {
    console.log("🔗 Client connected to /editor namespace");

    let projectId = socket.handshake.query['projectId'];

    

    if (!projectId) {
        console.error("❌ No Project ID received!");
        socket.disconnect();
        return;
    }

    console.log("✅ Received Project ID after connection:", projectId);

    if(projectId) {
        var watcher = chokidar.watch(`./projects/${projectId}`, {
            ignored: (path) => path.includes("node_modules"),
            persistent: true, /** keeps the watcher in running state till the time app is running */
            awaitWriteFinish: {
                stabilityThreshold: 2000 /** Ensures stability of files before triggering event */
            },
            ignoreInitial: true /** Ignores the initial files in the directory */
        });

        watcher.on("all", (event, path) => {
            console.log(event, path);
        });
    }

    socket.on("getPort", () => {
        console.log("🔗 Client requested get port event");
        listContainer();
    });

    handleEditorSocketEvents(socket, editorNamespace);

});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(process.cwd());
});


const webSocketForTerminal = new WebSocketServer({ noServer: true });
//noServer: true tells the WebSocket server to not create an HTTP server itself and upgrade the connection to WebSocket.

server.on("upgrade", (req, tcp, head) => {
    /*
    * req:Incoming http request
    * socket: TCP socket
    * head: Buffer containing the first packet of the upgraded stream
    */
    
    
    // this callback will be called when a client requests a WebSocket upgrade

    const isTerminal = req.url.includes("/terminal");

    if (isTerminal) {
        console.log("req url received", req.url);
        const projectId = req.url.split("=")[1];
        console.log("Project ID Received after connection", projectId);

        handleContainerCreate(projectId, webSocketForTerminal, req, tcp,head); 


    }


});

 webSocketForTerminal.on("connection", (ws, req, container) => {
     console.log("🔗 Client connected to /terminal namespace", ws, req, container);
     handleTerminalCreation(container, ws);

     ws.on("getPort", () => {
        console.log("🔗 Client requested get port event");
     }
    )



     ws.on("close", () => {
        container.remove({ force: true }, (err, data) => {
            if (err) {
                console.error("Error while removing container", err);
            } else {
                console.log("Container removed", data);
            }
        });
    });

 });    
    

       



     

 






// The http module in Node.js creates a common server object with the capabilities of an Express app. 
// This server is then passed into Server(server) to enable WebSocket functionality. 
// Since WebSockets operate over TCP connections, the combined server is started using server.listen() instead of app.listen(). 
// This allows both the Express app and WebSocket to run on the same PORT. 
// Additionally, socket.io uses an event-driven mechanism to handle real-time communication efficiently between the server and clients.
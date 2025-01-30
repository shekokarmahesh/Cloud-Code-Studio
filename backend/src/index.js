import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import { PORT } from './config/serverConfig.js';
import {Server} from 'socket.io';
import {createServer} from 'node:http';
import chokidar from 'chokidar';
import { handleEditorSocketEvents } from './socketHandlers/editorHandler.js';
import fs from 'fs';

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

    handleEditorSocketEvents(socket, editorNamespace);

});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // console.log(process.cwd())
});

// The http module in Node.js creates a common server object with the capabilities of an Express app. 
// This server is then passed into Server(server) to enable WebSocket functionality. 
// Since WebSockets operate over TCP connections, the combined server is started using server.listen() instead of app.listen(). 
// This allows both the Express app and WebSocket to run on the same PORT. 
// Additionally, socket.io uses an event-driven mechanism to handle real-time communication efficiently between the server and clients.
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import "@xterm/xterm/css/xterm.css";
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { AttachAddon } from '@xterm/addon-attach';

export const BrowserTerminal = () => {
    const terminalRef = useRef(null);
    const socket = useRef(null);
    const { projectId: projectIdFromUrl } = useParams();
    

    useEffect(() => {              
        if (!terminalRef.current) return;

        const term = new Terminal({
            cursorBlink: true,
            theme: {
                background: "#1e1e2e",
                foreground: "#f8f8f3",
                cursor: "#f8f8f3",
                red: "#ff5555",
                green: "#50fa7c",
                yellow: "#f1fa8c",
                cyan: "#8be9fd",
            },
            fontSize: 16,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        });

        term.open(terminalRef.current);
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        fitAddon.fit();

        /// Resize terminal on window resize  
        const handleResize = () => fitAddon.fit();
        window.addEventListener("resize", handleResize);

        const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
        const wsURL = `${wsProtocol}://localhost:3000/terminal?projectId=${projectIdFromUrl}`;

        console.log("Attempting WebSocket connection:", wsURL);

        let attempts = 0;
        const maxAttempts = 10;
        const retryInterval = 1000; // 1 second

        function connectWebSocket() {
            if (attempts >= maxAttempts) {
                console.error("❌ Max WebSocket connection attempts reached.");
                return;
            }

            attempts++;
            console.log(`🔄 WebSocket attempt ${attempts}/${maxAttempts}`);

            const ws = new WebSocket(wsURL);

            ws.onopen = () => {
                console.log("✅ WebSocket connected!");
                const attachAddon = new AttachAddon(ws);
                term.loadAddon(attachAddon);
                socket.current = ws;
            };

            ws.onerror = () => {
                console.error("❌ WebSocket connection failed. Retrying...");
                setTimeout(connectWebSocket, retryInterval);
            };

            ws.onclose = () => console.log("🔌 WebSocket Disconnected");
        }

        connectWebSocket();

        return () => {
            term.dispose();
            if (socket.current) {
                socket.current.close();
            }
            window.removeEventListener("resize", handleResize);
        };
    }, [projectIdFromUrl]);

    return (
        <div
            ref={terminalRef}
            style={{
                width: "100vw", // Full width
                height: "30vh", // Fixed height
                borderRadius: "10px",
                padding: "10px",
                backgroundColor: "#1e1e2e",
                color: "#f8f8f3",
            }}
            className="terminal"
            id="terminal-container"
        ></div>
    );
};

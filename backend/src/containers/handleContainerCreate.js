import Docker from 'dockerode';

const docker = new Docker();

export const listContainer = async () => {

    const containers = await docker.listContainers();
    console.log("📦 Containers:", containers)
    //print ports array from all containers
    containers.forEach(containerInfo => {
        console.log(containerInfo.Ports);
    });

};

export const handleContainerCreate = async (projectId, terminalSocket, req, tcpSocket, head) => {
    console.log("Project ID received for container create:", projectId);
    
    try {
        const container = await docker.createContainer({
            Image: 'sandbox', 
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Cmd: ['/bin/bash'],
            Tty: true,
            User: "sandbox",
            ExposedPorts: {
                '5173/tcp': {}
            },
            Env: ["HOST=0.0.0.0"],
            HostConfig: {
                Binds: [`${process.cwd()}/projects/${projectId}:/home/sandbox/app`],
                PortBindings: {
                    '5173/tcp': [{ HostPort: '0' }]
                },
            }
        });

        console.log("✅ Container created:", container.id);

        // Start the container
        await container.start();
        console.log("🚀 Container started:", container.id);

        // Ensure the container is running before proceeding
        const containerInfo = await container.inspect();
        if (!containerInfo.State.Running) {
            console.error("❌ Container failed to start!");
            return;
        }

        console.log("🟢 Container is running. Setting up WebSocket...");

        // WebSocket upgrade must happen AFTER container is fully running
        terminalSocket.handleUpgrade(req, tcpSocket, head, (establishedWSConn) => {
            terminalSocket.emit("connection", establishedWSConn, req, container);
            console.log("🔗 Client connected to /terminal namespace");
        });

    } catch (error) {
        console.error("❌ Error while creating container:", error);
    }
};

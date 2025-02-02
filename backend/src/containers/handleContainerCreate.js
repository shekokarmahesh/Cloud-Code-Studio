import Docker from 'dockerode';

const docker = new Docker();

export const handleContainerCreate = async (projectId, socket) => {
    console.log("Project id received for container create", projectId);
    try {
        const container = await docker.createContainer({
            Image: 'sandbox', // Image name given by us in the Dockerfile
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            CMD: ['/bin/bash'],
            Tty: true,
            User: "sandbox",
            HostConfig: {
                Binds: [ // Mounting the project directory to the container
                    `${process.cwd()}/projects/${projectId}:/home/sandbox/project` // Mounting the project directory to the container`
                ],
                PortBindings: {
                    '5173/tcp': [ //random port will be assigned by docker
                        {
                            HostPort: '0'
                        }
                    ]
                },
                ExposedPorts: {
                    '5173/tcp': {}
                },
    
                Env: ["HOST=0.0.0.0"]
    
    
            }
        });
        console.log("Container created", container.id);
        await container.start();
        console.log("Container started", container.id);

        container.exec({
            Cmd: ['/bin/bash'],
            User: "sandbox",
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
        }, (err, exec) => {
            if (err) {
                console.error("Error while creating exec", err);
                
            }

            exec.start({
                hijack: true,

            }, (err, stream) => {
                if (err) {
                    console.error("Error while starting exec", err);
                    
                    return;
                }
                processStream(stream, socket);

                socket.on("shell-input", (data) => {
                    console.log("🚀 Received from Frontend", data);
                    stream.write(data);
                    
                });

            });
        });

    } catch (error) {
        console.error("Error while creating container", error);
        }




    


};

function processStream(stream, socket) {
    let buffer = Buffer.from("");
    stream.on("data", (data) => {
        buffer = Buffer.concat([buffer, data]);
        socket.emit("shell-output", buffer.toString());
        buffer = Buffer.from("");
        });

        stream.on("end", () => {
            console.log("Stream ended");
            socket.emit("shell-output", "Stream ended");
            
        });

        stream.on("error", (error) => {
            console.error("Error in stream", error);
            socket.emit("shell-output", "Error in stream");
            
        });


        
    }




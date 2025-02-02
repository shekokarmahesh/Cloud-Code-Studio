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

    } catch (error) {
        console.error("Error while creating container", error);
        
    }


};




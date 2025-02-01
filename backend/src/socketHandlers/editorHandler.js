import fs from "fs/promises";

export const handleEditorSocketEvents = (socket, editorNamespace) => {
    socket.on("writeFile", async ({ data, pathToFileorFolder }) => {
        try {
            const response = await fs.writeFile(pathToFileorFolder, data);
            editorNamespace.emit("writeFileSuccess", {
                data: "File written successfully",
            })
        } catch(error) {
            console.log("Error writing the file", error);
            socket.emit("error", {
                data: "Error writing the file",
            });
        }
    });

    socket.on("createFile", async ({ pathToFileorFolder }) => {
        const isFileAlreadyPresent = await fs.stat(pathToFileorFolder);
        if(isFileAlreadyPresent) {
            socket.emit("error", {
                data: "File already exists",
            });
            return;
        }

        try {
            const response = await fs.writeFile(pathToFileOrFolder, "");
            socket.emit("createFileSuccess", {
                data: "File created successfully",
            });
        } catch(error) {
            console.log("Error creating the file", error);
            socket.emit("error", {
                data: "Error creating the file",
            });
        }
    });


    socket.on("readFile", async ({ pathToFileorFolder }) => {
        try {
            console.log("Received path:", pathToFileorFolder); // Debugging line
    
            if (!pathToFileorFolder) {
                throw new Error("Invalid file path received.");
            }
    
            const response = await fs.readFile(pathToFileorFolder);
            console.log("File content:", response.toString());
            
            //this reads file in buffer object this is core CS concept to read file in buffer object due to large chunck of data it reads in buffer object chunck by chunck
            //to understand it we need to convert it into string


            socket.emit("readFileSuccess", {
                value: response.toString(),
                path: pathToFileorFolder,
            });
        } catch (error) {
            console.error("Error reading the file", error);
            socket.emit("error", {
                data: "Error reading the file",
            });
        }
    });
    

    socket.on("deleteFile", async ({ pathToFileOrFolder }) => {
        try {
            const response = await fs.unlink(pathToFileOrFolder);
            socket.emit("deleteFileSuccess", {
                data: "File deleted successfully",
            });
        } catch(error) {
            console.log("Error deleting the file", error);
            socket.emit("error", {
                data: "Error deleting the file",
            });
        }
    });

    socket.on("createFolder", async ({ pathToFileOrFolder}) => {
        try {
            const response = await fs.mkdir(pathToFileOrFolder);
            socket.emit("createFolderSuccess", {
                data: "Folder created successfully",
            });
        } catch(error) {
            console.log("Error creating the folder", error);
            socket.emit("error", {
                data: "Error creating the folder",
            });
        }
    });

    socket.on("deleteFolder", async ({ pathToFileOrFolder }) => {
        try {
            const response = await fs.rmdir(pathToFileOrFolder, { recursive: true });
            socket.emit("deleteFolderSuccess", {
                data: "Folder deleted successfully",
            });
        } catch(error) {
            console.log("Error deleting the folder", error);
            socket.emit("error", {
                data: "Error deleting the folder",
            });
        }
    });




    //extra work adding re-naming events for files and folders
        

    









}

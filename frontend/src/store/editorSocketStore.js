
import { useActiveFileTabStore } from "./activeFileTabStore";
import { create } from "zustand";
import { useTreeStructureStore } from "./treeStructureStore";

export const useEditorSocketStore = create((set) => ({
    editorSocket: null,
    setEditorSocket: (incomingSocket) => {

        // const activeFileTab = useActiveFileTabStore.getState().activeFileTab;
        const activeFileTabSetter = useActiveFileTabStore.getState().setActiveFileTab;
            //in this zustand store if we want to access any other store functions we can use getState() function
            //but if we want to access same store functions we can use get() function

        const projectTreeStructureSetter = useTreeStructureStore.getState().setTreeStructure;

        incomingSocket?.on("readFileSuccess", (data) => {
                console.log("Read file success", data);
                const fileExtension = data.path.split(".").pop();
                activeFileTabSetter(data.path, data.value, fileExtension);

            });

        incomingSocket?.on("writeFileSuccess", (data) => {
            console.log("Write file success", data);
        //     incomingSocket.emit("readFile", {
        //       pathToFileorFolder: data.path    
                
        // });

        // try to implement room concept of socket.io here
        //this rooms concepts will allow following 1.if same file opened in multiple tabs they will be considered as same room
        //2. if same file opened in multiple browser they will be considered as same room
        //and the changes occured in that will will be reflected in all the tabs and browsers
        //but if there are different files opened in different tabs or browsers they will be considered as different rooms
        //and changes in one room will not be reflected in other rooms

        //this is pending to implement
    });


    incomingSocket?.on("deleteFileSuccess", () => {
        projectTreeStructureSetter();
    });

        set({
             editorSocket : incomingSocket
        });
    }
}));


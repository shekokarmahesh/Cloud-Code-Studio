import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { EditorComponent } from "../src/components/molecules/EditorComponent/EditorComponents";
import { EditorButton } from "../src/components/atoms/EditorButton/EditorButton";
import { TreeStructure } from "../src/components/organisms/TreeStructure"
import { useTreeStructureStore } from "../src/store/treeStructureStore";
import { useEditorSocketStore } from "../src/store/editorSocketStore";
import {io} from 'socket.io-client'


export const ProjectPlayground = () => {

const {projectId:projectIdFromUrl} = useParams()

    const {setProjectId, projectId} = useTreeStructureStore();

    const {setEditorSocket} = useEditorSocketStore(); 

    useEffect(() => {
        if (projectIdFromUrl) {
            setProjectId(projectIdFromUrl);
    
            const editorSocketConn = io(`${import.meta.env.VITE_BACKEND_URL}/editor`, {
                query: { projectId: projectIdFromUrl },
                transports: ["websocket"], // Force WebSocket (instead of polling)
            });
    
            editorSocketConn.on("connect", () => {
                console.log("✅ WebSocket connected successfully!");
            });
    
            editorSocketConn.on("connect_error", (error) => {
                console.error("❌ WebSocket connection error:", error);
            });
    
            editorSocketConn.on("disconnect", () => {
                console.log("🚫 WebSocket disconnected!");
            });
    
            setEditorSocket(editorSocketConn);
    
            return () => {
                editorSocketConn.disconnect(); // Cleanup on unmount
            };
        }
    }, [projectIdFromUrl, setProjectId, setEditorSocket]);
    
    
    return (
        <>
            {/* Project Id is {projectIdFromUrl} */}
           
           <div style={{display: 'flex'}}>
            {projectId && (
                <div
                        style={{
                            backgroundColor: '#333254',
                            paddingRight: '10px',
                            paddingTop: '0.3vh',
                            minWidth: '250px',
                            maxWidth: '25%',
                            height: '99.7vh',
                            overflow: 'auto',
                        }}
                >
                <TreeStructure/>
                </div>
            

            )}
            <EditorComponent/>
            </div>
            <EditorButton isActive={true}/> 
            <EditorButton isActive={false}/>
            <EditorButton isActive={false}/> 
            
        </>
    )
}
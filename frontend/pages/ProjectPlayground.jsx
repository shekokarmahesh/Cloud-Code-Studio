import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { EditorComponent } from "../src/components/molecules/EditorComponent/EditorComponents";
import { EditorButton } from "../src/components/atoms/EditorButton/EditorButton";
import { TreeStructure } from "../src/components/organisms/TreeStructure"
import { useTreeStructureStore } from "../src/store/treeStructureStore";


export const ProjectPlayground = () => {

const {projectId:projectIdFromUrl} = useParams()

    const {setProjectId, projectId} = useTreeStructureStore();

   useEffect(()=>{
         setProjectId(projectIdFromUrl);
    },[setProjectId, projectIdFromUrl]);


    return (
        <>
            Project Id is {projectIdFromUrl}
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
            {/* <EditorComponent/>
            <EditorButton isActive={true}/> 
            <EditorButton isActive={false}/>
            <EditorButton isActive={false}/>  */}
            
        </>
    )
}
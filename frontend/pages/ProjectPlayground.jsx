import { useParams } from "react-router-dom";
import { EditorComponent } from "../src/components/molecules/EditorComponents";
import { EditorButton } from "../src/components/atoms/EditorButton/EditorButton";


export const ProjectPlayground = () => {

const {projectId} = useParams()

    return (
        <>
            Project Id is {projectId}
            <EditorComponent/>
            <EditorButton isActive={true}/> 
            <EditorButton isActive={false}/>
            <EditorButton isActive={false}/> 
        </>
    )
}
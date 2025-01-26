import { useCreateProject } from "../src/hooks/apis/mutations/useCreateProject"
import { Button, Layout} from "antd";

export const CreatProject = () => {

    
    const {createProjectMutation, isPending} = useCreateProject();
    
    async function handleCreateProject() {
        console.log("Going to trigger the api");
        try {
            await createProjectMutation();
            console.log("Now we should redirect to the editor page");
        } catch (error) {
            console.log("Error creating the project",error);
        }

    }
    return (
        <div>
        <Button type="primary"
            onClick={handleCreateProject}>
            Create Project
        </Button>
    </div>
        

    )
}

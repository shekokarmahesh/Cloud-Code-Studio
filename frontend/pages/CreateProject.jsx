import { useCreateProject } from "../src/hooks/apis/mutations/useCreateProject"
import { Button} from "antd";
import { useNavigate } from "react-router";

export const CreatProject = () => {

    
    const {createProjectMutation,} = useCreateProject();
    
    const navigate = useNavigate();

    async function handleCreateProject() {
        console.log("Going to trigger the api");
        try {
            const response = await createProjectMutation();
            console.log("Now we should redirect to the editor page");
            console.log("response.data", response.data);
            navigate(`/project/${response.data}`)
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

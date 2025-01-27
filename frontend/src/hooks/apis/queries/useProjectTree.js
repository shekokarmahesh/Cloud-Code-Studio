import { useQuery } from "@tanstack/react-query";
import { getProjectTree } from "../../../apis/projects";

export const useProjectTree = (projectId) => {
    const { data: projectTree, isLoading, error,isError } = useQuery({
       queryFn: () => getProjectTree({projectId}),
    });
    return { 
         isLoading, 
         error, 
         isError,
         projectTree
        };
    
};
import { useEffect } from "react";
import { useTreeStructureStore } from "../../store/treeStructureStore"
import {  TreeNode } from "../molecules/TreeNode/TreeNode";
import { useFileContextMenuStore } from "../../store/fileContextMenuStore";
import { FileContextMenu } from "../molecules/ContextMenu/FileContextMenu";

export const TreeStructure = () => {

    const {treeStructure, setTreeStructure} = useTreeStructureStore();


    const {file ,
        isOpen: isFileContextOpen,
        x: fileContextX,
        y: fileContextY} = useFileContextMenuStore();


    useEffect(()=>{
        if(treeStructure){
            console.log(treeStructure);
            } else {
                setTreeStructure();
            }
        
       
    },[ setTreeStructure, treeStructure]);

    return (
        <div>
            {isFileContextOpen && fileContextX && fileContextY && (
            <FileContextMenu  
                x={fileContextX}
                y={fileContextY}
                path={file}
            />
        )}
                
           <TreeNode
              fileFolderData={treeStructure}
              />
        </div>
    )
}
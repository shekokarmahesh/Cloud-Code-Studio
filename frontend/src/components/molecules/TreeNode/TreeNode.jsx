import { IoIosArrowForward,IoIosArrowDown } from "react-icons/io";
import { useState } from "react";
import { FileIcon } from "../../atoms/Fileicon/Fileicon";
import { useEditorSocketStore } from "../../../store/editorSocketStore";


export const TreeNode = ({
    fileFolderData
}) => {

    const [visibility, setVisibility] = useState({});

    const {editorSocket} = useEditorSocketStore();

    function toggleVisibility(name){
        setVisibility({
            ...visibility,
            [name]: !visibility[name]
        })
     }

     function computeExtension(){
        const names= fileFolderData.name.split(".");
        return names[names.length-1];
    }

    function handleDoubleClick(fileFolderData){
        console.log("Double Clicked on ", fileFolderData);
        editorSocket.emit("readFile", {
            pathToFileorFolder: fileFolderData.path
        });
    }

    return (
        <div>
            {fileFolderData && 
                <div
                    style={{
                        paddingLeft: "15px",
                        color: "white",
                    }}
                >
                    {fileFolderData.children ? (
                        <button
                            onClick={() => toggleVisibility(fileFolderData.name)}
                            style={{
                                border: "none",
                                cursor: "pointer",
                                outline: "none",
                                color: "white",
                                backgroundColor: "transparent",
                                paddingTop: "15px",
                                fontSize: "16px"

                            }}
                            >
                            {visibility[fileFolderData.name] ? <IoIosArrowDown style={{fontSize: "16px"}}/> : <IoIosArrowForward style={{fontSize: "16px"}}/>}
                            {fileFolderData.name}
                        </button> 
                    ) : (
                        <div style={{display: "flex", alignItems: "center" }}>
                        <FileIcon extension={computeExtension()}/>  
                        {/* issue faced missed () after computeExtension */}
                        <p
                        style={{
                            paddingTop: "3.5px",
                            cursor: "pointer",
                            fontSize: "15px",
                            marginLeft: "5px",
                            // color: "black"
                        }}

                         onClick={() => handleDoubleClick(fileFolderData)}
                        
                        >
                            {fileFolderData.name}
                        </p>
                        </div>
                    )}
                    {visibility[fileFolderData.name] && fileFolderData.children && fileFolderData.children.map((child) => (
                        <TreeNode
                            key={child.name}
                            fileFolderData={child}
                        />
                    ))}
                </div>
            }
        </div>
    )
}



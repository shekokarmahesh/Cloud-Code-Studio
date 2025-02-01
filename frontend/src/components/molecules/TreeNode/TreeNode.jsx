import { IoIosArrowForward,IoIosArrowDown } from "react-icons/io";
import { useState } from "react";
import { FileIcon } from "../../atoms/Fileicon/Fileicon";
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { useFileContextMenuStore } from "../../../store/fileContextMenuStore";

export const TreeNode = ({
    fileFolderData
}) => {

    const [visibility, setVisibility] = useState({});

    const {editorSocket} = useEditorSocketStore();

    const {
        setFile,
        setIsOpen: setFileContextMenuIsOpen,
        setX: setFileContextMenuX,
        setY: setFileContextMenuY

    } = useFileContextMenuStore();

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

    function handleContextMenuForFiles(e, path){
        e.preventDefault();
        console.log("Right Clicked on ", path);
        setFile(path);
        setFileContextMenuX(e.clientX);
        setFileContextMenuY(e.clientY);
        setFileContextMenuIsOpen(true);


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
                                padding: "15px",
                                fontSize: "16px",
                                marginTop: "10px"

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
                            paddingTop: "15px",
                            paddingBottom: "15px",
                            marginTop: "8px",
                            fontSize: "15px",
                            cursor: "pointer",
                            marginLeft: "18px",
                            // color: "black"
                        }}

                        onContextMenu={(e) => handleContextMenuForFiles(e, fileFolderData.path)}

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



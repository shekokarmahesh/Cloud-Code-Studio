import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import { useEditorSocketStore } from '../../../store/editorSocketStore';
import { useActiveFileTabStore } from '../../../store/activeFileTabStore';
import { extensionToFileType } from '../../../utils/extensionToFileType';

export const EditorComponent = () => {

    const [editorState, setEditorState] = useState({
        theme: null
    });

    let timerId = null;
    const {editorSocket} = useEditorSocketStore();
    const { activeFileTab } = useActiveFileTabStore();

    async function downloadTheme() {
        const response = await fetch('/Dracula.json');
        const data = await response.json();
        console.log(data);
        setEditorState({ ...editorState, theme: data });
    }

    function handleEditorTheme(editor, monaco) {
        monaco.editor.defineTheme('dracula', editorState.theme);
        monaco.editor.setTheme('dracula');
    }

    function handleChange(value) {
        //clear old timer
        
        if (timerId) {
            clearTimeout(timerId);
        }
       timerId = setTimeout(() => {
            const editorContent = value;
            console.log("sending write file");
            editorSocket.emit("writeFile", {
                data: editorContent,
                pathToFileorFolder: activeFileTab.path
            });
        }, 2000);
    }

            
    

    // editorSocket?.on("readFileSuccess", (data) => {
    //     console.log("Read file success", data);
    //     setActiveFileTab(data.path, data.value);
    // })

    //to make this component more clean we have separetededitorSocket to editorSocketStore (zustand store)

    useEffect(() => {
        downloadTheme();
    }, []);

    return (
        <>
            {   editorState.theme &&
                <Editor 
                    height={'100vh'}
                    width={'100%'}
                    defaultLanguage={ undefined }
                    defaultValue='// Welcome to the playground'
                    options={{
                        fontSize: 18,
                        fontFamily: 'monospace'
                    }}
                    language={extensionToFileType(activeFileTab?.extension)}
                    onChange={handleChange}
                    value={activeFileTab?.value ? activeFileTab.value : '// Welcome to the playground'}

                    onMount={handleEditorTheme}
                />
            }
        </>
    )
}
import uuid4 from "uuid4";
import fs from 'fs/promises';
import { REACT_PROJECT_COMMAND } from '../config/serverConfig.js';
import { execPromisified } from "../utils/execUtility.js";
import path from 'path';
import directoryTree from "directory-tree";


export const createProjectService = async () => {
    // Create a unique id and then inside the projects folder create a new folder with that id
    const projectId = uuid4();
    console.log("New project id is", projectId);

    await fs.mkdir(`./projects/${projectId}`);

    // After this call the npm creaste vite command in the newly created project folder

    const response = await execPromisified(REACT_PROJECT_COMMAND, {
        cwd: `./projects/${projectId}`
    });

    return projectId;
}

// Export an asynchronous function to get the project tree structure based on the project ID
export const getProjectTreeService = async (projectId) => {
    // Resolve the project path using the provided project ID
    const projectPath = path.resolve(`./projects/${projectId}`);
    // Get the directory tree structure of the resolved project path
    const tree = directoryTree(projectPath);
    // Return the directory tree structure
    return tree;
}
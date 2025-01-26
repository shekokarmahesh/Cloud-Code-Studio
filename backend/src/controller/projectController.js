
import util from 'util';
import { exec } from 'child_process';
import fs from 'fs/promises';
import uuid4 from 'uuid4';

const execPromisified = util.promisify(exec);



const createProjectController = async (req, res) => {

    //Create a unique id and then inside the project folder create a new folder with that unique id
    //used uuid4
    //uuid4 is a random unique id generator

    const projectId = uuid4();
    console.log("New project id is: ",projectId);

    await fs.mkdir(`./projects/${projectId}`);

    //After this call the npm create vite command in the newly created project folder

    const response = await execPromisified('npm create vite@latest sandbox -- --template react',
        { cwd: `./projects/${projectId}` });
        

    

    return res.json({ message: 'Project created' });


};

export default createProjectController;
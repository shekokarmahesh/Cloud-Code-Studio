# Cloud Code Studio - Backend

The backend service for Cloud Code Studio, a cloud-based integrated development environment. This service provides REST APIs and WebSocket support for project management, container orchestration, and real-time collaboration features.

## Features

- **Project Management**: Create and manage isolated development environments
- **Container Orchestration**: Docker-based sandbox environments for each project
- **Real-time Collaboration**: Socket.io integration for live file synchronization
- **File System Operations**: Directory tree management and file watching
- **Terminal Integration**: WebSocket-based terminal sessions
- **RESTful API**: Comprehensive API endpoints for frontend integration

## Tech Stack

- **Runtime**: Node.js with ES modules
- **Framework**: Express.js
- **Real-time Communication**: Socket.io
- **Container Management**: Dockerode (Docker API client)
- **File Watching**: Chokidar
- **Utilities**: UUID4, CORS, Cookie Parser
- **Development**: Nodemon for hot reloading

## Prerequisites

- Node.js (v16 or higher)
- Docker
- npm or yarn

## Installation

1. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional):
Create a `.env` file in the backend directory:
```env
PORT=3000
REACT_PROJECT_COMMAND=npm start
```

## Running the Application

### Development Mode
```bash
npm run dev
```
This starts the server with hot reloading using nodemon.

### Production Mode
```bash
node src/index.js
```

The server will start on port 3000 (or the port specified in your `.env` file).

## Docker Setup

### Building the Sandbox Image

To create the Docker image for project sandboxes:

```bash
docker build -t sandbox .
```

This creates an Ubuntu-based container with Node.js pre-installed, optimized for development environments.

### Container Features

The sandbox container includes:
- Ubuntu 20.04 base image
- Node.js 22.x
- Nano text editor
- Curl for network operations
- Configured bash prompt showing current directory
- Dedicated sandbox user for security

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### Health Check
- **GET** `/ping`
- **Description**: Server health check endpoint
- **Response**: `{"message": "pong"}`

#### Projects

##### Create Project
- **POST** `/v1/projects`
- **Description**: Creates a new project with an isolated container environment
- **Response**: Project details with container information

##### Get Project Tree
- **GET** `/v1/projects/:projectId/tree`
- **Description**: Retrieves the file system tree for a specific project
- **Parameters**: `projectId` (string) - The unique project identifier
- **Response**: Directory structure in tree format

## WebSocket Integration

### Editor Namespace (`/editor`)

The backend provides real-time file synchronization through Socket.io:

- **Connection**: Clients connect with `projectId` query parameter
- **File Watching**: Automatic monitoring of project directories
- **Events**:
  - `file:change` - File content modifications
  - `file:create` - New file creation
  - `file:delete` - File deletion
  - `folder:create` - New folder creation
  - `folder:delete` - Folder deletion

### Terminal Integration

WebSocket connections for interactive terminal sessions within project containers.

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── serverConfig.js          # Server configuration and environment variables
│   ├── containers/
│   │   ├── handleContainerCreate.js # Container creation logic
│   │   └── handleTerminalCreation.js # Terminal session management
│   ├── controllers/
│   │   ├── pingController.js        # Health check controller
│   │   └── projectController.js     # Project management controllers
│   ├── routes/
│   │   ├── index.js                 # Main router
│   │   └── v1/
│   │       ├── index.js             # V1 API router
│   │       └── projects.js          # Project-specific routes
│   ├── service/
│   │   └── projectService.js        # Business logic for projects
│   ├── socketHandlers/
│   │   └── editorHandler.js         # Socket.io event handlers
│   ├── utils/
│   │   └── execUtility.js           # Execution utilities
│   └── index.js                     # Application entry point
├── Dockerfile                       # Docker image configuration
├── package.json                     # Dependencies and scripts
└── README.md                        # This file
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port number | 3000 |
| `REACT_PROJECT_COMMAND` | Command to run React projects | - |

## Development

### Adding New Routes
1. Create a controller in `src/controllers/`
2. Add routes in `src/routes/v1/`
3. Import and use the router in `src/routes/v1/index.js`

### Socket Events
Add new event handlers in `src/socketHandlers/editorHandler.js` following the existing pattern.

### Container Management
Extend container functionality in `src/containers/` for additional sandbox features.

## Contributing

1. Follow the existing project structure
2. Add appropriate error handling
3. Update this README for any new features
4. Test WebSocket connections thoroughly
5. Ensure Docker compatibility

## License

This project is licensed under the ISC License.

## Related Projects

- **Frontend**: [Cloud Code Studio Frontend](../frontend/README.md)
- **Main Repository**: [Cloud Code Studio](https://github.com/shekokarmahesh/Cloud-Code-Studio)
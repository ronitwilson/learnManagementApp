Scaffold Vue frontend using npm create vite@latest — choose vue-ts template for Vue + TypeScript in a frontend/folder.
Scaffold Node.js backend by creating a backend/ folder with npm init, then install express, typescript, and ts-node for a typed Node.js server.
Set up folder structure with frontend/ and backend/ as sibling directories under learning_app/, keeping them decoupled.
Add a root package.json (optional monorepo-style) with scripts to run both frontend and backend concurrently using a tool like concurrently.
Add Docker setup — create a docker-compose.yml at the root with containers for frontend, backend, and a database (SQL or NoSQL per your Goal.md).
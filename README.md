# Password manager

## Getting Started

### Prerequisites
- Local PostgreSQL installation up and running. 
- Node version  >= 16

To start the program, start the backend and after that start the frontend.

### Running the backend

- From the root of the project, navigate to the backend folder: `cd backend`
- Install all dependencies: `npm i`
- Create and populate an .env file (to ./backend) according to the .env.template file
    - **The database with same name must be created manually. In psql the database can be created with `CREATE DATABASE <name>;`**
- Start the backend (dev)server: `npm run dev`

### Running the frontend
Dev:
- From the root of the project, navigate to the backend folder: `cd frontend`
- Install all dependencies: `npm i`
- Start the backend (dev)server: `npm run dev`

Production build:
- Build project `npm run build`
- Start the build `npm run start`

### Running frontend tests
- From the root of the project, navigate to the frontend folder: `cd frontend`
- Execute jest unit tests: `npm run test`



Open [http://localhost:3001](http://localhost:3001) with your browser to see the results.
To use the password manager, go ahead and register an account. After that proceed to the homepage and log in.

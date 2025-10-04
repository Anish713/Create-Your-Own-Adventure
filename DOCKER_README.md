# Docker Setup for Create Your Adventure

This project includes Docker configurations for both the frontend and backend services, along with a docker-compose file to run them together.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed on your machine
- A `.env` file in the `backend` directory with your environment variables
- A `.env` file in the `frontend` directory with your environment variables

## Setup

1. Create a `.env` file in the `backend` directory based on the `.env.example` file:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Update the `backend/.env` file with your actual values, especially:

   - `OPENAI_API_KEY`
   - `OPENAI_CONNECTION_SERVICE_URL`

3. Create a `.env` file in the `frontend` directory based on the `.env.example` file:
   ```bash
   cp frontend/.env.example frontend/.env
   ```

## Environment Variables

### Backend

The backend loads environment variables from `backend/.env` file automatically.

### Frontend

The frontend uses Vite's environment variable system:

- During development: Loads variables from `.env` files
- During build: Embeds variables at build time
- Runtime fallback: Uses default values if variables aren't set

The API base URL can be configured with `VITE_API_BASE_URL`:

- In Docker: Set to `/api` (proxied by Nginx)
- In development: Set to `http://localhost:8000/api`
- Default fallback: Automatically detects based on hostname

## Running the Application

To start both frontend and backend services:

```bash
docker-compose up --build
```

This will:

- Build both frontend and backend Docker images
- Start a PostgreSQL database container
- Start the backend service on port 8000
- Start the frontend service on port 80

## Accessing the Application

- Frontend: http://localhost
- Backend API: http://localhost:8000
- Backend API Docs: http://localhost:8000/docs

## Stopping the Application

To stop all services:

```bash
docker-compose down
```

To stop all services and remove volumes (including database data):

```bash
docker-compose down -v
```

## GitHub CI/CD

The GitHub workflow is configured to automatically build and push Docker images to Docker Hub when changes are pushed to the `main` branch.

1. The workflow will automatically trigger on pushes to the `main` branch

## Docker Images

The Docker setup uses multi-stage builds for both frontend and backend to optimize image size:

- Frontend: Uses Node.js Alpine for building and Nginx Alpine for serving
- Backend: Uses Python slim images for both building and running

Environment variables are loaded from the `.env` files in their respective directories automatically during container startup.

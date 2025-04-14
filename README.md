# Form App

## Project Description

The **Form App** is a full-stack web application that allows users to:

1. Build customizable forms with various field types (e.g., text, boolean, datetime).
2. Save and view the created forms.
3. Submit responses to the created forms.

This project demonstrates a full-stack implementation using modern web development practices, including a TypeScript-based backend ([Fastify](https://www.fastify.io/), [Prisma](https://www.prisma.io/), [PostgreSQL](https://www.postgresql.org/)) and a frontend built with [Angular](https://angular.dev/).

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [Angular CLI](https://angular.io/cli) (for frontend development)

### Setup Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/daniel-slocum/form-app.git
cd form-app
```

#### 2. Backend Setup

1. Navigate to the `api` directory:
   ```bash
   cd api
   ```
2. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Build and start the backend services using Docker:
   ```bash
   docker compose build
   docker compose up
   ```
4. Run database migrations:
   ```bash
   npm run migrate
   ```
5. Seed the database with example data:
   ```bash
   npm run seed
   ```

The backend will be available at `http://localhost:8080`.

#### 3. Frontend Setup

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:4200`.

## Application Features

### Frontend

- **Form Builder**: Accessible at `http://localhost:4200/forms/builder`
  - Allows users to create and customize forms with various field types (e.g., text, boolean, datetime).
- **Form Viewer**: Accessible at `http://localhost:4200/forms/viewer/:formId`
  - Displays a form based on its ID and allows users to submit responses.

### Backend

- **API Endpoints**:
  - **Form**:
    - `POST /form`: Create a new form.
    - `GET /form/:id`: Fetch a form by its ID.
  - **Source Record**:
    - `POST /source-record`: Create a source record with associated source data.
- **API Documentation**:
  - Swagger documentation is available at `http://localhost:8080/docs`.

## Project Structure

- **Backend** (`api/`):
  - Built with Fastify, Prisma, and PostgreSQL.
  - Handles form and source record management.
- **Frontend** (`client/`):
  - Built with Angular.
  - Provides a user interface for building and viewing forms.

## Future Improvements

Given more time, the following features and improvements would be implemented:

1. **API Authentication**:
   - Add authentication and authorization to secure API endpoints.
2. **UI Enhancements**:
   - Add a page to list all created forms.
   - Add a page to view submitted responses for a form.
3. **Form Reset Bug**:
   - Fix the issue where resetting the form displays validation errors.
4. **Error Handling**:
   - Improve error handling and user feedback for API failures.
5. **Deployment**:
   - Deploy the application to a cloud platform (e.g., Heroku, Vercel, Netlify) for public access.

## License

This project is licensed under the MIT License.

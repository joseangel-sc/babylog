# Remix Auth Example

A basic authentication setup using Remix, Prisma, and PostgreSQL with Docker.

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

## Setup & Installation

1. Clone the repository
```
git clone <repository-url>
cd <project-directory>
```

Install dependencies
```
npm install
```
Environment Setup

Copy the example environment file and update it with your values:

cp .env.example .env
Your .env should contain:

```
DATABASE_URL="postgresql://remix_user:remix_password@localhost:5432/remix_db"
```

Database Setup

Make sure you have Docker running, then:

```
make db-start    # Starts PostgreSQL in Docker
make init-db     # Runs initial Prisma migrations
```


Start the development server
```
make dev
```
The application will be available at http://localhost:3000


Available Make Commands

```
make help - Show all available commands
make install - Install dependencies
make dev - Start everything for development
make db-start - Start the database container
make db-stop - Stop the database container
make db-restart - Restart the database
make db-logs - View database logs
make migrate-dev - Run Prisma migrations
make reset-all - Reset everything (database, migrations, node_modules)
```

Features

- User registration
- User login/logout
- Session management
- Protected routes
- PostgreSQL database
- Password hashing with bcrypt

Tech Stack

- Remix
- Prisma
- PostgreSQL
- Docker
- bcryptjs
- Tailwind CSS

Development
To add new database models:

Update prisma/schema.prisma

Run 
```
make migrate-dev to create and apply migrations
```
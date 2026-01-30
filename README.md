# NestJS Product API

A RESTful API for managing products and categories built with NestJS, Prisma, and PostgreSQL (Neon).

## 🛠️ Tech Stack

| Technology        | Version | Purpose              |
| ----------------- | ------- | -------------------- |
| NestJS            | 11.0.0  | Backend framework    |
| Prisma            | 6.19.2  | ORM                  |
| PostgreSQL        | Latest  | Database (Neon)      |
| TypeScript        | 5.7.3   | Programming language |
| class-validator   | 0.14.1  | Input validation     |
| class-transformer | 0.5.1   | Data transformation  |

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher)
- **npm** or **yarn**
- **PostgreSQL database** (Neon account recommended)

## 🔧 Installation

### Step 1: Extract the Project

Extract the project folder to your desired location.

### Step 2: Install Dependencies

```bash
cd product-api
npm install
```

**Alternative (using Yarn):**

```bash
yarn install
```

### Step 3: Verify Installation

Check if all dependencies are installed correctly:

```bash
npm list --depth=0
```

## ⚙️ Configuration

### Step 1: Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

### Step 2: Configure Environment Variables

Edit the `.env` file with your configuration:

```env
# Application Configuration
NODE_ENV=development
PORT=3000

# API Key (Change this to a secure key for production)
API_KEY=my-super-secret-api-key-12345

# Database Configuration (Replace with your Neon connection string)
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
```

**Important Security Notes:**

- ⚠️ **API_KEY**: Use a strong, unique key for production
- ⚠️ **DATABASE_URL**: Keep this secret and never commit to version control
- ⚠️ The `.env` file is already in `.gitignore`

### Step 3: Setup Database

Generate Prisma Client:

```bash
npm run prisma:generate
```

Run database migrations to create tables:

```bash
npm run prisma:migrate
```

When prompted for a migration name, you can use: `init`

### Step 4: Seed Database (Optional)

Populate the database with sample data:

```bash
npm run prisma:seed
```

This will create:

- 3 Categories: Electronics, Clothing, Books
- 4 Sample Products

## 🚀 Running the Application

### Development Mode (with hot reload)

```bash
npm run start:dev
```

The server will start at: **http://localhost:3000/api/v1**

You should see:

```
🚀 Application is running on: http://localhost:3000/api/v1
```

### Production Mode

Build the application:

```bash
npm run build
```

Start production server:

```bash
npm run start:prod
```

### Debug Mode

```bash
npm run start:debug
```

## 🧪 Testing the API

### Option: Using Postman

#### Import Collection

1. Open Postman
2. Click **Import** button
3. Select the `postman_collection.json` file from the project root
4. The collection will be imported with all endpoints

#### Configure Environment

1. Create a new environment in Postman
2. Add variables:
   - `baseUrl`: `http://localhost:3000/api/`
   - `apiKey`: `my-super-secret-api-key-12345`

#### Test Endpoints

All requests in the collection are pre-configured. Simply:

1. Select an endpoint
2. Click **Send**
3. View the response

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication

All endpoints require an API Key in the request header:

```
x-api-key: my-super-secret-api-key-12345
```

### Endpoints Overview

#### Categories

| Method | Endpoint          | Description                    |
| ------ | ----------------- | ------------------------------ |
| POST   | `/categories`     | Create a new category          |
| GET    | `/categories`     | Get all categories (paginated) |
| GET    | `/categories/:id` | Get category by ID             |

#### Products

| Method | Endpoint        | Description                            |
| ------ | --------------- | -------------------------------------- |
| POST   | `/products`     | Create a new product                   |
| GET    | `/products`     | Get all products                       |
| GET    | `/search`       | Get all products (with search filters) |
| GET    | `/products/:id` | Get product by ID                      |

### Advanced Product Filtering

The `/search` endpoint supports multiple query parameters:

#### Query Parameters

| Parameter       | Type     | Description                            | Example                                             |
| --------------- | -------- | -------------------------------------- | --------------------------------------------------- |
| `page`          | number   | Page number (default: 1)               | `?page=1`                                           |
| `limit`         | number   | Items per page (default: 10, max: 100) | `?limit=20`                                         |
| `sku`           | string[] | Filter by SKU (multiple)               | `?sku=SKU1&sku=SKU2`                                |
| `name`          | string[] | Filter by name with LIKE (multiple)    | `?name=laptop&name=phone`                           |
| `price.start`   | number   | Minimum price                          | `?price.start=100000`                               |
| `price.end`     | number   | Maximum price                          | `?price.end=5000000`                                |
| `stock.start`   | number   | Minimum stock                          | `?stock.start=10`                                   |
| `stock.end`     | number   | Maximum stock                          | `?stock.end=100`                                    |
| `category.id`   | string[] | Filter by category ID (multiple)       | `?category.id=uuid1&category.id=uuid2`              |
| `category.name` | string[] | Filter by category name (multiple)     | `?category.name=Electronics&category.name=Clothing` |

#### Filter Examples

**1. Search products with specific SKUs:**

```
GET /api/search?sku=LAPTOP-001&sku=PHONE-002&sku=TABLET-003
```

**2. Search products with names containing keywords:**

```
GET /api/search?name=laptop&name=macbook&name=dell
```

**3. Filter products by price range:**

```
GET /api/search?price.start=1000000&price.end=5000000
```

**4. Filter products by stock availability:**

```
GET /api/search?stock.start=10&stock.end=100
```

**5. Filter products by categories:**

```
GET /api/search?category.id=uuid1&category.id=uuid2
```

**6. Combined filters:**

```
GET /api/search?name=laptop&price.start=1000000&price.end=5000000&category.name=Electronics&page=1&limit=10
```

### Request & Response Examples

#### Create Category

**Request:**

```http
POST /api/v1/categories
Content-Type: application/json
x-api-key: my-super-secret-api-key-12345

{
  "name": "Electronics"
}
```

**Success Response (201):**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Electronics",
    "createdAt": "2024-01-29T10:30:00.000Z",
    "updatedAt": "2024-01-29T10:30:00.000Z"
  }
}
```

**Error Response (400 - Bad Request):**

```json
{
  "errors": {
    "name": ["Name is required", "Name must be at least 3 characters"]
  }
}
```

#### Create Product

**Request:**

```http
POST /api/v1/products
Content-Type: application/json
x-api-key: my-super-secret-api-key-12345

{
  "sku": "LAPTOP-001",
  "name": "Dell XPS 15",
  "price": 25000000,
  "stock": 10,
  "categoryId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Success Response (201):**

```json
{
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "sku": "LAPTOP-001",
    "name": "Dell XPS 15",
    "price": "25000000.00",
    "stock": 10,
    "categoryId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2024-01-29T10:32:00.000Z",
    "updatedAt": "2024-01-29T10:32:00.000Z",
    "category": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Electronics",
      "createdAt": "2024-01-29T10:30:00.000Z",
      "updatedAt": "2024-01-29T10:30:00.000Z"
    }
  }
}
```

**Validation Error Response (400):**

```json
{
  "errors": {
    "sku": ["SKU is required", "SKU must be unique"],
    "price": ["Price must be a positive number"],
    "categoryId": ["Category does not exist"]
  }
}
```

### Response Structure

All API responses follow a consistent structure:

#### Success Response

```json
{
  "data": {
    /* response data */
  },
  "paging": {
    /* only for paginated responses */
    "current": 1,
    "size": 10,
    "total": 100
  }
}
```

#### Error Response

```json
{
  "errors": {
    /* validation errors or additional error info */
  }
}
```

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────┐
│  Category   │         │   Product    │
├─────────────┤         ├──────────────┤
│ id (PK)     │◄────────┤ id (PK)      │
│ name        │   1:N   │ sku          │
│ createdAt   │         │ name         │
│ updatedAt   │         │ price        │
└─────────────┘         │ stock        │
                        │ categoryId(FK)│
                        │ createdAt    │
                        │ updatedAt    │
                        └──────────────┘
```

### Categories Table

| Column    | Type      | Constraints      | Description           |
| --------- | --------- | ---------------- | --------------------- |
| id        | UUID      | PRIMARY KEY      | Unique identifier     |
| name      | String    | UNIQUE, NOT NULL | Category name         |
| createdAt | Timestamp | NOT NULL         | Creation timestamp    |
| updatedAt | Timestamp | NOT NULL         | Last update timestamp |

### Products Table

| Column     | Type          | Constraints           | Description           |
| ---------- | ------------- | --------------------- | --------------------- |
| id         | UUID          | PRIMARY KEY           | Unique identifier     |
| sku        | String        | UNIQUE, NOT NULL      | Stock Keeping Unit    |
| name       | String        | NOT NULL              | Product name          |
| price      | Decimal(10,2) | NOT NULL              | Product price         |
| stock      | Integer       | NOT NULL, DEFAULT 0   | Available stock       |
| categoryId | UUID          | FOREIGN KEY, NOT NULL | Reference to category |
| createdAt  | Timestamp     | NOT NULL              | Creation timestamp    |
| updatedAt  | Timestamp     | NOT NULL              | Last update timestamp |

### Relationships

- One Category can have many Products (1:N)
- Deleting a Category will cascade delete all its Products
- Products must belong to a valid Category

## 📁 Project Structure

```
nestjs-product-api/
├── prisma/
│   ├── schema.prisma           # Database schema definition
│   └── seed.ts                 # Database seeding script
│
├── src/
│   ├── common/                 # Shared resources
│   │   ├── dto/                # Base DTOs (Pagination)
│   │   ├── filters/            # Exception filters
│   │   ├── guards/             # Authorization guards
│   │   ├── interfaces/         # TypeScript interfaces
│   │   ├── pipes/              # Validation pipes
|   |   ├── decorators/         # Custom decorators
|   |   ├── interceptors/       # Response interceptors
│   │   └── utils/              # Utility functions
│   │
│   ├── config/                 # Configuration files
│   │   └── prisma.service.ts   # Prisma database service
│   │
│   ├── modules/                # Feature modules
│   │   ├── category/
│   │   │   ├── dto/            # Category DTOs
│   │   │   ├── entities/       # Category entity
│   │   │   ├── repositories/   # Data access layer
│   │   │   ├── category.controller.ts
|   |   |   ├── category.controller.spec.ts              # Unit tests
│   │   │   ├── category.service.ts
|   |   |   ├── category.service.spec.ts                     # Unit tests
│   │   │   └── category.module.ts
│   │   │
│   │   └── product/
│   │       ├── dto/            # Product DTOs
│   │       ├── entities/       # Product entity
│   │       ├── repositories/   # Data access layer
│   │       ├── product.controller.ts
│   │       ├── product.controller.spec.ts              # Unit tests
│   │       ├── product.service.ts
│   │       ├── product.service.spec.ts                     # Unit tests
│   │       └── product.module.ts
│   │
│   ├── app.module.ts           # Root application module
│   └── main.ts                 # Application entry point
│
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── nest-cli.json               # NestJS CLI configuration
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## 🔧 Available Scripts

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugger

# Production
npm run build              # Build the application
npm run start:prod         # Run production build

# Database
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Run database migrations
npm run prisma:studio      # Open Prisma Studio GUI
npm run prisma:seed        # Seed database with sample data

# Code Quality
npm run format             # Format code with Prettier
npm run lint               # Lint code with ESLint

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Generate test coverage report
```

### External Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Neon PostgreSQL](https://neon.tech/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

**Happy Coding! 🚀**

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

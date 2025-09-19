# Customer Management System

A full-stack Next.js application for managing customer information with dynamic field support. Built for receptionists to easily add, edit, and manage customer records with customizable fields.

## Quick Start

### Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server: ( I added Prisma start into the package.json dev command)
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Deployment

1. Build and run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

2. The application will be available at [http://localhost:3000](http://localhost:3000)

### Manual Docker Build

1. Build the Docker image:
   ```bash
   docker build -t customer-management .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 customer-management
   ```

## Usage

### Adding Customers

1. Click "Add Customer" to open the customer form
2. Fill in the required fields (Name and Phone)
3. Add any optional information (Email and custom fields)
4. Click "Add Customer" to save

### Managing Custom Fields

1. Click "Manage Fields" to open the field management dialog
2. Add new fields with:
   - **Field Name**: Internal identifier (e.g., `customer_id`)
   - **Display Label**: User-friendly name (e.g., `Customer ID`)
   - **Field Type**: Choose from text, email, phone, number, textarea, or select
   - **Required**: Check if the field is mandatory
   - **Options**: For select fields, provide comma-separated options

3. Edit or delete existing fields as needed

### Field Types

- **Text**: Single line text input
- **Email**: Email address with validation
- **Phone**: Phone number input
- **Number**: Numeric input
- **Text Area**: Multi-line text input
- **Select**: Dropdown with predefined options

## Database Schema

The application uses a flexible schema with two main tables:

### Customers
- `id`: Unique identifier
- `name`: Customer name (required)
- `phone`: Phone number (required)
- `email`: Email address (optional)
- `customFields`: JSON string containing dynamic field values
- `createdAt`: Record creation timestamp
- `updatedAt`: Last update timestamp

### Field Definitions
- `id`: Unique identifier
- `name`: Field name (unique)
- `label`: Display label
- `type`: Field type
- `required`: Whether field is required
- `options`: JSON string of options (for select fields)
- `order`: Display order
- `createdAt`: Field creation timestamp
- `updatedAt`: Last update timestamp

## API Endpoints

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create new customer
- `GET /api/customers/[id]` - Get specific customer
- `PUT /api/customers/[id]` - Update customer
- `DELETE /api/customers/[id]` - Delete customer

### Field Definitions
- `GET /api/fields` - Get all field definitions
- `POST /api/fields` - Create new field definition
- `PUT /api/fields/[id]` - Update field definition
- `DELETE /api/fields/[id]` - Delete field definition

## Technology Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Forms**: React Hook Form
- **Database**: SQLite with Prisma ORM
- **Icons**: Lucide React
- **Deployment**: Docker


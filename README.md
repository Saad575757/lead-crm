# Lead Management System

A simple and clean lead management CRM built with Next.js 15 and Neon Database (PostgreSQL).

## Features

- 📊 **Dashboard** - View total leads count
- 👥 **Lead Management** - Create, read, update, and delete leads
- 📝 **Activity Tracking** - Log calls, emails, meetings, and notes
- 🔍 **Search & Filter** - Find leads by name, email, phone, or status
- 📱 **Flexible Fields** - All fields are optional
- 🏷️ **Status Tracking** - Track leads through stages: First DM → Lead → Client

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** Neon (Serverless PostgreSQL)
- **Styling:** Tailwind CSS

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Neon Database account (free tier available at [neon.tech](https://neon.tech))

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Neon Database

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string

### 3. Configure Environment Variables

The `.env.local` file should have your Neon connection string:

```bash
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require
```

### 4. Initialize Database

Run the database setup script to create tables:

```bash
npm run db:setup
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
lead-system/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── leads/        # Leads CRUD endpoints
│   │   │   └── activities/   # Activities endpoint
│   │   ├── dashboard/        # Dashboard page
│   │   ├── leads/            # Leads pages (list, new, detail)
│   │   └── page.tsx          # Home page
│   ├── components/           # React components
│   │   ├── Navbar.tsx
│   │   ├── LeadForm.tsx
│   │   ├── LeadTable.tsx
│   │   ├── SearchFilter.tsx
│   │   └── ActivityFeed.tsx
│   ├── lib/
│   │   ├── db.ts             # Database connection
│   │   └── models.ts         # Data models
│   └── types/
│       └── index.ts          # TypeScript types
├── .env.local                # Environment variables
└── package.json
```

## API Endpoints

### Leads

- `GET /api/leads` - Get all leads (supports ?search= and ?status= filters)
- `POST /api/leads` - Create a new lead
- `GET /api/leads/:id` - Get a specific lead with activities
- `PUT /api/leads/:id` - Update a lead
- `DELETE /api/leads/:id` - Delete a lead

### Activities

- `POST /api/activities` - Create a new activity for a lead

## Lead Fields

All fields are **optional**:

| Field | Type | Description |
|-------|------|-------------|
| Name | Text | Lead's full name |
| Email | Email | Lead's email address |
| Phone | Text | Lead's phone number |
| Details | Text Area | Additional information |
| Status | Dropdown | First DM, Lead, or Client |

## Status Options

- **First DM** (default) - Initial contact made
- **Lead** - Qualified as potential customer
- **Client** - Converted to paying customer

## Activity Types

- 📞 Call
- 📧 Email
- 📅 Meeting
- 📝 Note
- ✅ Task
- 📌 Other

## Database Schema

### Leads Table

```sql
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  details TEXT,
  status VARCHAR(50) DEFAULT 'first_dm',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Activities Table

```sql
CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add the `DATABASE_URL` environment variable
5. Deploy

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:setup` - Set up database tables
- `npm run db:migrate` - Run database migrations
- `npm run db:migrate-status` - Add status column to existing database

## License

MIT

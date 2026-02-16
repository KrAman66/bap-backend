🚀 ASA Backend Project: Setup & Testing Guide

Welcome to the ASA Backend Project! This guide covers setting up the project from scratch, fixing a known schema issue, connecting to the database, and testing the critical "Designation & Role Mapping" features required for our compliance audit.

🛠️ 1. Prerequisites

Before you begin, ensure you have the following installed on your machine:

Node.js (v18 or higher)

PostgreSQL (v16 or higher)

pgAdmin 4 (Optional, but recommended for viewing the DB)

Postman (for API testing)

📥 2. Installation & Setup

Step 2.1: Clone and Install

Open your terminal in your preferred directory and run the following commands:

# 1. Clone the repository
git clone <YOUR_REPO_URL>
cd bap-backend

# 2. Install dependencies
npm install

# 3. Install specific packages for Auth (if not already in package.json)
npm install bcrypt jsonwebtoken dotenv


Step 2.2: Environment Configuration

Create a .env file in the root directory. Copy and paste the following configuration (remember to update the password):

# Database Connection
# REPLACE 'YOUR_DB_PASSWORD' with your actual Postgres password
# NOTE: ?schema=asa is required at the end of the URL
DATABASE_URL="postgresql://postgres:YOUR_DB_PASSWORD@localhost:5432/asa_db?schema=asa"

# App Settings
PORT=3000

# JWT Secrets (For Authentication)
JWT_ACCESS_SECRET="super_secret_access_key_123"
JWT_REFRESH_SECRET="super_secret_refresh_key_456"
JWT_ACCESS_EXPIRES="15m"
JWT_REFRESH_EXPIRES="7d"


🗄️ 3. Database Initialization (Crucial!)

Since our project uses a custom schema named asa, you cannot simply run the app immediately. You must manually create the database and schema first.

Open pgAdmin or your SQL Shell (psql).

Run these SQL commands exactly:

-- 1. Create the Database
CREATE DATABASE asa_db;

-- 2. Connect to the database
-- (If using psql command line: \c asa_db)
-- (If using pgAdmin: Open Query Tool on 'asa_db')

-- 3. Create the Schema (This is required by our Prisma config)
CREATE SCHEMA asa;


⚠️ 4. Verification: The Schema "Gotcha" Fix

ATTENTION: We recently identified a missing field in the asa_user_dsgn_mapping table. If you are pulling older code or run into an "Unknown argument" error, verify this file.

Open prisma/schema.prisma and locate the model asa_user_dsgn_mapping. Ensure it looks exactly like this:

model asa_user_dsgn_mapping {
  seq_id           Int                  @id @default(autoincrement())
  user_id          Int
  designation_id   Int                  // <--- 🚨 CRITICAL FIX: Ensure this line exists!
  is_active        Boolean              @default(true)
  crt_by           Int?
  crt_on           DateTime?            @db.Timestamp(6)
  upd_by           Int?
  upd_on           DateTime?            @db.Timestamp(6)
  is_primary_dsgn  Boolean              @default(false)

  // Relations
  // <--- 🚨 Ensure Relation below is present
  asa_designation_mst                                      asa_designation_mst @relation(fields: [designation_id], references: [dsgn_id], onUpdate: Restrict, map: "fk_udm_dsgn") 
  asa_user_mst_asa_user_dsgn_mapping_crt_byToasa_user_mst  asa_user_mst?       @relation("asa_user_dsgn_mapping_crt_byToasa_user_mst", fields: [crt_by], references: [user_id], onUpdate: Restrict, map: "fk_udm_crt_by")
  asa_user_mst_asa_user_dsgn_mapping_upd_byToasa_user_mst  asa_user_mst?       @relation("asa_user_dsgn_mapping_upd_byToasa_user_mst", fields: [upd_by], references: [user_id], onUpdate: Restrict, map: "fk_udm_upd_by")
  asa_user_mst_asa_user_dsgn_mapping_user_idToasa_user_mst asa_user_mst        @relation("asa_user_dsgn_mapping_user_idToasa_user_mst", fields: [user_id], references: [user_id], onUpdate: Restrict, map: "fk_udm_user")

  @@schema("asa")
}


Apply the Schema

Once verified, sync your code and database:

# 1. Update the local Prisma Client (Node modules)
npx prisma generate

# 2. Push the table structure to PostgreSQL
npx prisma db push


(If db push fails, double-check Step 3 "Database Initialization").

⚡ 5. Start the Server

You are ready to go.

npm run dev


You should see: Server running on port 3000.

🧪 6. API Testing Walkthrough (Compliance Workflow)

We need to verify that we can appoint staff (CISO, MPOC, TPOC) as required by the ASA Compliance Checklist. Follow this order in Postman.

Phase A: Foundation Setup

1. Create Role (Admin)

Endpoint: POST http://localhost:3000/asa/roles/create-role

Payload:

{ "role_name": "Admin", "role_code": "ADM", "is_active": true }


(Note the role_id returned. Assume it is 1).

2. Create User (Test User)

Endpoint: POST http://localhost:3000/asa/users/create-user

Payload:

{ "full_name": "John Doe", "mobile_no": 1234567890, "email_id": "john@asa.com", "pswd": "securepass123", "is_active": true }


(Note the user_id returned. Assume it is 1).

Phase B: Create Compliance Designations

3. Create Designation: CISO

Endpoint: POST http://localhost:3000/asa/designations/create-designation

Payload:

{ "dsgn_name": "Chief Information Security Officer", "dsgn_code": "CISO", "is_active": true }


(Note the dsgn_id. Assume 2).

4. Create Designation: MPOC

Endpoint: POST http://localhost:3000/asa/designations/create-designation

Payload:

{ "dsgn_name": "Management Point of Contact", "dsgn_code": "MPOC", "is_active": true }


(Note the dsgn_id. Assume 3).

5. Create Designation: TPOC

Endpoint: POST http://localhost:3000/asa/designations/create-designation

Payload:

{ "dsgn_name": "Technical Point of Contact", "dsgn_code": "TPOC", "is_active": true }


(Note the dsgn_id. Assume 4).

Phase C: Permission & Appointments (The Logic)

6. Map Role -> Designation (Give CISO Admin Access)

Endpoint: POST http://localhost:3000/asa/designations/role-mapping/create

Payload:

{
  "designation_id": 2,   // CISO ID
  "role_id": 1,          // Admin Role ID
  "is_active": true
}


7. Map User -> Designation (Appoint John Doe as MPOC)

Endpoint: POST http://localhost:3000/asa/users/designation-mapping/create

Payload:

{
  "user_id": 1,            // John Doe
  "designation_id": 3,     // MPOC ID
  "is_primary_dsgn": true, // Main Job
  "is_active": true,
  "crt_on": "2025-05-30T10:00:00Z"
}


8. Appoint John Doe as TPOC (Secondary Role)

Endpoint: POST http://localhost:3000/asa/users/designation-mapping/create

Payload:

{
  "user_id": 1,
  "designation_id": 4,      // TPOC ID
  "is_primary_dsgn": false, // Secondary Job
  "is_active": true
}


Phase D: Validation

9. Verify Appointments

Endpoint: GET http://localhost:3000/asa/users/designation-mapping/get-all

Expected Result: You should see a list containing User #1 linked to both Designation #3 and #4.

❓ Troubleshooting

Issue

Solution

Error: Unknown argument designation_id

Your Prisma client is outdated. Stop the server and run npx prisma generate, then restart.

Cannot POST /asa/designations... (404 Error)

You haven't added the designation routes to allRoutes.js. Ensure the mstController routes for asa_designation_mst are registered.

Database connection errors

Ensure your .env file has ?schema=asa at the end of the URL and that you ran the SQL commands in Step 3 to create the schema.

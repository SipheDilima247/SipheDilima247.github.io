# Nexus Consensus Subscribe Feature - Complete Setup Guide

This guide walks you through setting up the email subscription feature for Nexus Consensus, including the backend API, database, and email configuration.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Backend Setup](#backend-setup)
4. [Gmail Configuration](#gmail-configuration)
5. [Running the Servers](#running-the-servers)
6. [Testing the Feature](#testing-the-feature)
7. [Checking Subscribers](#checking-subscribers)
8. [API Endpoints](#api-endpoints)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The subscription feature consists of:

- **Backend API** (Node.js/Express on port 3001)
  - Handles form submissions
  - Stores emails in SQLite database
  - Sends welcome emails via Nodemailer

- **Frontend Form** (HTML on port 8080)
  - User-friendly subscribe form
  - Real-time validation & feedback
  - Connects to backend API

- **Email Service** (Gmail SMTP)
  - Sends automated welcome emails
  - Configured via environment variables

- **Database** (SQLite)
  - Stores subscriber emails
  - Tracks subscription dates

---

## Prerequisites

- **Node.js** (v14+) — [Download here](https://nodejs.org/)
- **Gmail account** with 2-Step Verification enabled
- **A text editor** (VS Code recommended)
- **A web browser**

---

## Backend Setup

### Step 1: Install Dependencies

Navigate to the `server` folder and install packages:

```bash
cd server
npm install
```

This installs:
- `express` — Web framework
- `nodemailer` — Email sending
- `sqlite3` — Database
- `cors` — Cross-origin requests
- `dotenv` — Environment variables
- `validator` — Input validation

### Step 2: Create Environment Variables

Copy the example file:

```bash
cp .env.example .env
```

Or manually create a `.env` file in the `server` folder with this template:

```
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email Configuration
FROM_EMAIL=your-email@gmail.com
FROM_NAME=Nexus Consensus

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost,http://localhost:3000,http://127.0.0.1:8080
```

---

## Gmail Configuration

### Step 1: Enable 2-Step Verification

1. Go to [Google Account](https://myaccount.google.com/)
2. Click **Security** (left sidebar)
3. Find **2-Step Verification** and click it
4. Follow the prompts to enable it (you'll verify via phone)
5. Click **Turn on**

### Step 2: Create App Password

1. Go to [Google Account](https://myaccount.google.com/) → **Security**
2. Scroll down and click **App passwords** (only appears if 2-Step is ON)
3. Select:
   - **App:** Mail
   - **Device:** Windows Computer
4. Click **Generate**
5. Google shows a 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 3: Add to .env

Copy the app password **without spaces** and paste it in `.env`:

```
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcdefghijklmnop
FROM_EMAIL=your-email@gmail.com
```

---

## Running the Servers

### Terminal 1: Start the Node.js API Server

```bash
cd server
npm start
```

You should see:

```
🚀 Nexus Consensus server running on http://localhost:3001
📧 Subscribe endpoint: POST http://localhost:3001/api/subscribe
Connected to SQLite database
Subscribers table ready
Email service ready: true
```

**✓ Keep this terminal open!**

### Terminal 2: Start the HTTP Server

Open a **new terminal** and run:

```bash
cd Nexus-Consensus  # Go to root folder, NOT server folder
npx http-server
```

You should see:

```
Starting up http-server, serving ./

Available on:
  http://127.0.0.1:8080
  http://100.64.8.2:8080
```

**✓ Keep this terminal open too!**

---

## Testing the Feature

1. Open your browser to **http://127.0.0.1:8080**
2. Scroll down to the **"Stay ahead of the consensus"** section
3. Enter an email address
4. Click **Subscribe**

You should see:

- ✓ Success message: *"Successfully subscribed! Check your email for a welcome message."*
- Email field clears
- Welcome email arrives in your inbox

---

## Checking Subscribers

### Option 1: API Endpoint (Easiest)

Visit this URL in your browser:

```
http://localhost:3001/api/subscribers
```

Returns JSON with all subscribers:

```json
{
  "success": true,
  "count": 5,
  "subscribers": [
    { "email": "user1@example.com" },
    { "email": "user2@example.com" }
  ]
}
```

### Option 2: GUI Database Browser (Recommended)

1. Download [DB Browser for SQLite](https://sqlitebrowser.org/)
2. Open `server/subscribers.db`
3. Browse the `subscribers` table visually

### Option 3: Command Line (Requires SQLite CLI)

```bash
cd server
sqlite3 subscribers.db "SELECT * FROM subscribers;"
```

---

## API Endpoints

### `POST /api/subscribe` — Subscribe to mailing list

**Request:**
```bash
curl -X POST http://localhost:3001/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Successfully subscribed! Check your email for a welcome message.",
  "email": "user@example.com"
}
```

**Error Responses:**
- `400` — Invalid email format
- `409` — Email already subscribed
- `500` — Server error

### `GET /api/subscribers` — View all subscribers

**Response:**
```json
{
  "success": true,
  "count": 42,
  "subscribers": [
    { "email": "user1@example.com" },
    { "email": "user2@example.com" }
  ]
}
```

⚠️ **Security Note:** Add authentication before deploying to production!

### `GET /api/health` — Health check

**Response:**
```json
{
  "status": "ok"
}
```

---

## Database Structure

**Table: `subscribers`**

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER | Auto-increment primary key |
| `email` | TEXT | Unique subscriber email |
| `subscribed_at` | DATETIME | Subscription timestamp |
| `confirmed` | INTEGER | Confirmation status (0/1) |

---

## Deployment

### Deploy to Production

Before deploying, update `.env`:

```
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Option A: Heroku

```bash
heroku create your-app-name
git push heroku main
```

Set environment variables:
```bash
heroku config:set SMTP_USER=your-email@gmail.com
heroku config:set SMTP_PASS=your-app-password
```

### Option B: Railway / Render / DigitalOcean

Follow their Node.js deployment guides and set environment variables in their dashboards.

### Option C: Your Own VPS

1. SSH into your server
2. Clone the repository
3. Install Node.js
4. Run `npm install` in the `server` folder
5. Use PM2 to keep it running:
   ```bash
   npm install -g pm2
   pm2 start server/server.js
   pm2 startup
   pm2 save
   ```
6. Use Nginx as a reverse proxy

---

## Security Checklist (Before Production)

- [ ] Use strong environment variables (store in .env, never in code)
- [ ] Add authentication to `/api/subscribers` endpoint
- [ ] Implement rate limiting on `/api/subscribe` (prevent spam)
- [ ] Use HTTPS only (SSL certificate)
- [ ] Add email verification flow (optional but recommended)
- [ ] Implement CAPTCHA or bot protection
- [ ] Add logging and monitoring
- [ ] Set up database backups
- [ ] Review CORS settings for your domain
- [ ] Hide `.env` file in `.gitignore` (already done)

---

## Troubleshooting

### "Email service error: connect ECONNREFUSED"

**Cause:** SMTP credentials are incorrect or missing
**Fix:**
1. Verify app password (no spaces)
2. Confirm 2-Step Verification is ON
3. Check email address is correct
4. Restart `npm start`

### "Cannot GET /api/subscribe"

**Cause:** Using wrong URL or GET instead of POST
**Fix:** Use `http://localhost:3001/api/subscribers` (with 's') for GET, or submit form for POST

### "Connection error. Please try again later"

**Cause:** Frontend can't reach backend API
**Fix:**
1. Verify Node.js server is running on port 3001
2. Check CORS is set to allow `http://127.0.0.1:8080`
3. Verify both `.env` and server are updated
4. Restart both servers

### "Email already subscribed"

**Cause:** Email address already in database
**Fix:** Use a different email or clear database:
   ```bash
   rm server/subscribers.db
   npm start  # Creates fresh database
   ```

### "Port already in use"

**Cause:** Another process using port 3001 or 8080
**Fix:**
```bash
# Kill process on port 3001 (Windows)
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Or change PORT in .env
PORT=3002
```

---

## File Structure

```
Nexus-Consensus/
├── index.html              # Main page with subscribe form
├── about.html
├── insights.html
├── track-record.html
├── community.html
└── server/
    ├── server.js           # Main Express app
    ├── db.js               # SQLite database setup
    ├── email.js            # Nodemailer configuration
    ├── package.json        # Dependencies
    ├── .env                # Environment variables (SECRET - don't commit)
    ├── .env.example        # Template for .env
    ├── .gitignore          # Ignore node_modules, .env, etc.
    ├── subscribers.db      # SQLite database (created automatically)
    └── README.md           # Backend setup guide
```

---

## Next Steps

1. ✅ Backend running
2. ✅ Emails sending
3. ✅ Database storing subscribers

**What to do next:**

- **Add email verification:** Send confirmation link before storing email
- **Add unsubscribe:** Let users opt-out from emails
- **Improve security:** Add authentication to admin endpoints
- **Send campaigns:** Create endpoint to send newsletters to all subscribers
- **Analytics:** Track open rates, click rates, etc.

---

## Support & Resources

- [Nodemailer Documentation](https://nodemailer.com/)
- [Express.js Guide](https://expressjs.com/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Google App Passwords Help](https://support.google.com/accounts/answer/185833)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

## Quick Commands Reference

```bash
# Install dependencies
cd server && npm install

# Start backend server
cd server && npm start

# Start frontend server (new terminal)
cd .. && npx http-server

# View subscribers via API
curl http://localhost:3001/api/subscribers

# Check database with SQLite
sqlite3 server/subscribers.db "SELECT * FROM subscribers;"

# Stop servers
# Press Ctrl+C in both terminals
```

---

**Enjoy your new subscription feature!** 🚀

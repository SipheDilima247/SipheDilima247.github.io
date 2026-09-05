# Nexus Consensus Backend Setup Guide

## Overview
This Node.js/Express backend handles email subscriptions with Nodemailer and SQLite database storage.

## Prerequisites
- **Node.js** (v14 or higher) — [Download](https://nodejs.org/)
- An email account with SMTP access (Gmail, Mailgun, SendGrid, etc.)

## Quick Setup

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your SMTP credentials:

#### Option A: Using Gmail
1. Enable [2-Step Verification](https://myaccount.google.com/security) on your Google account
2. Generate an [App Password](https://myaccount.google.com/apppasswords)
3. Update `.env`:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@yourdomain.com (can be your Gmail)
FROM_NAME=Nexus Consensus
```

#### Option B: Using SendGrid
1. Create a [SendGrid](https://sendgrid.com/) account
2. Create an API key in Settings → API Keys
3. Update `.env`:
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=Nexus Consensus
```

#### Option C: Using Mailgun
1. Create a [Mailgun](https://www.mailgun.com/) account
2. Get your SMTP credentials from Sending → Domain Settings
3. Update `.env`:
```
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@yourdomain.mailgun.org
SMTP_PASS=your-mailgun-password
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=Nexus Consensus
```

### 3. Update CORS Origins
In `.env`, update `ALLOWED_ORIGINS` for your domain(s):
```
ALLOWED_ORIGINS=http://localhost,http://localhost:3000,https://yourdomain.com
```

### 4. Start the Server
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

You should see:
```
🚀 Nexus Consensus server running on http://localhost:3001
📧 Subscribe endpoint: POST http://localhost:3001/api/subscribe
```

## Testing the API

### Test with cURL
```bash
curl -X POST http://localhost:3001/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Health Check
```bash
curl http://localhost:3001/api/health
```

## Database
- **Type**: SQLite
- **Location**: `server/subscribers.db` (created automatically)
- **Table**: `subscribers` with columns:
  - `id` — Auto-increment ID
  - `email` — Unique subscriber email
  - `subscribed_at` — Subscription timestamp
  - `confirmed` — Confirmation status (for future use)

## API Endpoints

### `POST /api/subscribe`
Subscribe a user to the mailing list.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Successfully subscribed! Check your email for a welcome message.",
  "email": "user@example.com"
}
```

**Response (Error - 400, 409, 500):**
```json
{
  "success": false,
  "message": "Error description"
}
```

### `GET /api/subscribers`
Get all subscribers (admin endpoint — add authentication before production).

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

### `GET /api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

## Frontend Integration
The HTML form in `index.html` automatically connects to the backend. Make sure to:

1. Update `API_URL` in the script if you change the server address
2. Test locally first with `http://localhost:3001`
3. Update to your production URL when deployed

## Deployment

### Option A: Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Option B: Railway, Render, or DigitalOcean
Follow their Node.js deployment guides and set environment variables.

### Option C: Your own VPS
1. Install Node.js on your server
2. Use PM2 to keep the app running: `npm install -g pm2`
3. `pm2 start server.js`
4. Use Nginx as a reverse proxy

## Security Checklist (Before Production)
- [ ] Use environment variables for all secrets
- [ ] Add authentication to `/api/subscribers` endpoint
- [ ] Implement rate limiting on `/api/subscribe`
- [ ] Use HTTPS only
- [ ] Add input validation (already included)
- [ ] Add CORS restrictions (already configured)
- [ ] Implement email verification flow (optional)
- [ ] Add logging and monitoring
- [ ] Set up automatic backups for the database

## Troubleshooting

**Port already in use:**
```bash
# Change PORT in .env
PORT=3002
```

**Email not sending:**
- Check SMTP credentials in `.env`
- Verify firewall isn't blocking SMTP port
- Check email service's API rate limits
- Look at console logs for error messages

**CORS errors:**
- Ensure your domain is in `ALLOWED_ORIGINS`
- Include `http://localhost` for local testing

**Database locked:**
- Restart the server
- Check for other running processes

## Questions?
Refer to the individual documentation:
- [Nodemailer](https://nodemailer.com/)
- [Express](https://expressjs.com/)
- [SQLite3](https://www.sqlite.org/)
- [Dotenv](https://github.com/motdotla/dotenv)

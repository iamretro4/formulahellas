# reCAPTCHA and IP Logging Setup

## Overview
This document explains the reCAPTCHA and IP logging features that have been added to the quiz system for verification purposes.

## Features Added

### 1. reCAPTCHA Verification
- Google reCAPTCHA v3 (invisible) has been added to the quiz start process
- Prevents bots and automated submissions
- Runs invisibly in the background - no user interaction required
- Verification happens before allowing quiz start

### 2. IP Address Logging
- All quiz submissions now log the IP address of the submitter
- IP addresses are stored in the database and logged to console
- Admin panel includes IP logs viewer for manual verification
- Highlights suspicious IPs (multiple submissions from same IP)

## Setup Instructions

### 1. Google reCAPTCHA Setup

1. **Get reCAPTCHA Keys:**
   - Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
   - Create a new site (or use existing)
   - Choose **reCAPTCHA v3** (invisible)
   - Add your domain: `formulahellas.gr` (and `localhost` for development)
   - Copy the **Site Key** and **Secret Key**

2. **Add Environment Variables:**
   Add these to your `.env.local` and Vercel environment variables:
   ```
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
   RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here
   ```
   
   **Important:** 
   - Add these to your local `.env.local` file for development
   - Add these to Vercel environment variables for production
   - The Site Key is public (safe in client code)
   - The Secret Key is private (server-side only, never commit to git)

3. **Note:** If reCAPTCHA keys are not configured, the system will skip verification (useful for development)

### 2. Database Setup (IP Logging)

The IP address is automatically logged to the console. To store it in the database:

1. **Add `ip_address` column to `quiz_submissions` table in Supabase:**
   ```sql
   ALTER TABLE quiz_submissions 
   ADD COLUMN IF NOT EXISTS ip_address TEXT;
   ```

2. **Optional:** Create an index for faster queries:
   ```sql
   CREATE INDEX IF NOT EXISTS idx_quiz_submissions_ip 
   ON quiz_submissions(ip_address);
   ```

## Admin Panel - IP Logs

### Accessing IP Logs
1. Go to `/registration-tests/admin`
2. Click on the **"IP Logs & Verification"** tab
3. Click **"Refresh"** to load IP logs

### What You'll See
- **Total Submissions:** Total number of quiz submissions
- **Unique IPs:** Number of unique IP addresses
- **Suspicious IPs:** IPs with multiple submissions (highlighted in yellow)

### IP Logs Table
The table shows:
- **IP Address:** The logged IP address
- **Submissions:** Number of submissions from this IP
- **Teams:** List of teams that submitted from this IP
- **Actions:** Warning if multiple submissions detected

### Reviewing Suspicious IPs
- IPs with **multiple submissions** are highlighted in yellow
- Review these manually to check for:
  - Legitimate teams sharing an IP (e.g., same university network)
  - Potential abuse (same person submitting multiple times)

## API Endpoints

### `/api/quiz/verify-captcha` (POST)
Verifies reCAPTCHA token from client.

**Request:**
```json
{
  "token": "recaptcha_token_from_client"
}
```

**Response:**
```json
{
  "success": true,
  "verified": true,
  "score": 0.9
}
```

### `/api/quiz/ip-logs` (GET)
Returns IP logs for admin review.

**Response:**
```json
{
  "total": 50,
  "uniqueIPs": 45,
  "ipStats": [
    {
      "ip": "192.168.1.1",
      "count": 2,
      "teams": [
        {
          "teamName": "Team A",
          "teamEmail": "team@example.com",
          "submittedAt": "2026-01-29T13:30:00Z",
          "score": 8.5,
          "timeTaken": 3600
        }
      ]
    }
  ],
  "allSubmissions": [...]
}
```

## Console Logging

IP addresses are also logged to the server console in this format:
```
[QUIZ SUBMISSION] IP: 192.168.1.1, Email: team@example.com, Team: Team Name, Time: 2026-01-29T13:30:00.000Z
```

You can check your Vercel logs or server logs to see all IP addresses.

## Security Notes

1. **reCAPTCHA:** 
   - Always verify on the server-side (already implemented)
   - Never trust client-side verification alone
   - reCAPTCHA v3 provides a score (0.0 to 1.0) - you can set a threshold if needed

2. **IP Logging:**
   - IP addresses can be spoofed, but combined with other data they're useful for verification
   - Multiple submissions from same IP could indicate:
     - Legitimate: Teams sharing network (university, company)
     - Suspicious: Same person trying multiple accounts
   - Review manually to determine legitimacy

## Troubleshooting

### reCAPTCHA Not Working
- Check that environment variables are set correctly
- Verify domain is added to reCAPTCHA console
- Check browser console for errors
- If keys are missing, system will skip verification (check console warnings)

### IP Logs Not Showing
- Check that `ip_address` column exists in database
- Check server console logs (IPs are always logged there)
- Verify API endpoint `/api/quiz/ip-logs` is accessible
- Check browser console for errors

### IP Address Shows as "unknown"
- This happens when IP cannot be extracted from headers
- Check if you're behind a proxy/CDN (Vercel, Cloudflare)
- The system checks multiple headers: `x-forwarded-for`, `x-real-ip`, `cf-connecting-ip`

## Next Steps

1. Set up reCAPTCHA keys in environment variables
2. Add `ip_address` column to database (optional but recommended)
3. Test the quiz flow to ensure reCAPTCHA works
4. Review IP logs after quiz to identify any suspicious activity

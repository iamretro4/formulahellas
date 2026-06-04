# Vercel Environment Variables Setup Guide

## Quick Setup Checklist

✅ **DNS Records**: Already configured in Vercel (verified)
- MX records for sending/receiving
- SPF record
- DKIM record
- DMARC record

Now you need to configure environment variables in Vercel.

## Step-by-Step: Add Environment Variables in Vercel

### 1. Access Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **Formula Hellas** project
3. Click **Settings** (gear icon in top navigation)
4. Click **Environment Variables** in the left sidebar

### 2. Add Each Environment Variable

Click **Add New** for each variable below. **Select all three environments** (Production, Preview, Development) for each variable unless specified otherwise.

#### Required: Sanity CMS

```
Variable Name: NEXT_PUBLIC_SANITY_PROJECT_ID
Value: [Your actual Sanity Project ID]
Environments: ☑ Production ☑ Preview ☑ Development
```

```
Variable Name: NEXT_PUBLIC_SANITY_DATASET
Value: production
Environments: ☑ Production ☑ Preview ☑ Development
```

```
Variable Name: SANITY_API_TOKEN
Value: [Your actual Sanity API Token]
Environments: ☑ Production ☑ Preview ☑ Development
```

#### Required: Studio Protection

```
Variable Name: STUDIO_PASSWORD
Value: [Your secure password - use a strong password]
Environments: ☑ Production ☑ Preview ☑ Development
```

#### Required: Content Revalidation

```
Variable Name: REVALIDATE_SECRET
Value: [Generate random string - use: openssl rand -base64 32]
Environments: ☑ Production ☑ Preview ☑ Development
```

#### Required: Supabase Database

```
Variable Name: NEXT_PUBLIC_SUPABASE_URL
Value: [Your Supabase project URL, e.g., https://xxxxx.supabase.co]
Environments: ☑ Production ☑ Preview ☑ Development
```

```
Variable Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [Your Supabase anonymous key]
Environments: ☑ Production ☑ Preview ☑ Development
```

#### Required: Email Configuration (Resend)

```
Variable Name: RESEND_API_KEY
Value: [Your Resend API key - starts with re_]
Environments: ☑ Production ☑ Preview ☑ Development
```

```
Variable Name: FROM_EMAIL
Value: Formula Hellas <quiz@formulahellas.gr>
Environments: ☑ Production ☑ Preview ☑ Development
```

```
Variable Name: NOTIFICATION_EMAILS
Value: notifications@formulahellas.gr,technical@formulahellas.gr
Environments: ☑ Production ☑ Preview ☑ Development
```

### 3. After Adding All Variables

1. **Save** each variable (click "Save" after adding)
2. **Redeploy** your application:
   - Go to **Deployments** tab
   - Click **⋯** (three dots) on the latest deployment
   - Select **Redeploy**
   - Or simply push a new commit to trigger automatic deployment

### 4. Verify Email Setup

After redeployment, test the email configuration:

1. Visit: `https://formulahellas.gr/test-email`
2. Enter your email address
3. Click "Send Test Email"
4. Check your inbox (and spam folder)
5. Verify the email arrives from `quiz@formulahellas.gr`

## Where to Get Each Value

### Sanity Values
- **Project ID & Dataset**: [Sanity Manage](https://www.sanity.io/manage) → Select your project
- **API Token**: [Sanity Manage](https://www.sanity.io/manage) → Your project → API → Tokens → Create new token

### Supabase Values
- **URL & Anon Key**: [Supabase Dashboard](https://supabase.com/dashboard) → Your project → Settings → API

### Resend API Key
- **API Key**: [Resend API Keys](https://resend.com/api-keys) → Create new API key
- **Important**: Make sure `formulahellas.gr` domain is verified in Resend first!

### Generate REVALIDATE_SECRET
Run this command in your terminal:
```bash
openssl rand -base64 32
```
Or use an online generator: https://randomkeygen.com/

## Current DNS Status ✅

Your Vercel DNS records are already correctly configured:
- ✅ MX record for receiving: `inbound-smtp.eu-west-1.amazonaws.com`
- ✅ MX record for sending: `feedback-smtp.eu-west-1.amazonses.com`
- ✅ SPF record: `v=spf1 include:amazonses.com ~all`
- ✅ DKIM record: `resend._domainkey` with public key
- ✅ DMARC record: `v=DMARC1; p=none; rua=mailto:dmarc@formulahellas.gr`

**No DNS changes needed!** Just add the environment variables above.

## Email Address Verification

Before emails will work, verify these addresses in Resend:

1. Go to [Resend Dashboard](https://resend.com/domains)
2. Click on `formulahellas.gr` domain
3. Verify these email addresses:
   - `quiz@formulahellas.gr` (for quiz emails)
   - `info@formulahellas.gr` (for form notifications)

## Troubleshooting

### Emails Not Sending?

1. **Check Resend Dashboard**:
   - Go to [Resend Logs](https://resend.com/emails)
   - Look for failed deliveries
   - Check error messages

2. **Verify Environment Variables**:
   - Go to Vercel → Settings → Environment Variables
   - Ensure `RESEND_API_KEY` is set correctly
   - Ensure `FROM_EMAIL` matches verified domain

3. **Check Domain Verification**:
   - Go to [Resend Domains](https://resend.com/domains)
   - Ensure `formulahellas.gr` shows as "Verified" ✅
   - All DNS records should show as verified

### Build Failures?

1. **Check Required Variables**:
   - All `NEXT_PUBLIC_*` variables must be set (embedded at build time)
   - Check Vercel deployment logs for specific errors

2. **Redeploy After Changes**:
   - Environment variable changes require a new deployment
   - Go to Deployments → Redeploy

## Security Notes

- ✅ `.env.local` is in `.gitignore` (won't be committed)
- ✅ Never commit API keys or secrets to git
- ✅ Use strong passwords for `STUDIO_PASSWORD`
- ✅ Rotate API keys periodically
- ✅ Use different keys for production vs development if needed

## Quick Reference Table

| Variable | Required | Example Value | Where to Get |
|----------|----------|---------------|--------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ✅ | `abc123xyz` | sanity.io/manage |
| `NEXT_PUBLIC_SANITY_DATASET` | ✅ | `production` | sanity.io/manage |
| `SANITY_API_TOKEN` | ✅ | `sk...` | sanity.io/manage → API → Tokens |
| `STUDIO_PASSWORD` | ⚠️ | `YourSecurePass123!` | Set your own |
| `REVALIDATE_SECRET` | ✅ | `random_base64_string` | Generate with openssl |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | `https://xxx.supabase.co` | supabase.com dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | `eyJ...` | supabase.com dashboard |
| `RESEND_API_KEY` | ✅ | `re_xxxxxxxxxx` | resend.com/api-keys |
| `FROM_EMAIL` | ✅ | `Formula Hellas <quiz@formulahellas.gr>` | Set to verified email |
| `NOTIFICATION_EMAILS` | ⚠️ | `email1@formulahellas.gr,email2@formulahellas.gr` | Comma-separated list |

---

**Need Help?**
- Email: technical@formulahellas.gr
- Check deployment logs in Vercel Dashboard
- Review `EMAIL_CONFIGURATION.md` for DNS details



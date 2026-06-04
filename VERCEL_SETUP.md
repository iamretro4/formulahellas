# Vercel Deployment Setup Guide

This guide explains how to configure environment variables in Vercel for the Formula Hellas website.

## Step-by-Step Instructions

### 1. Access Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **Formula Hellas** project
3. Navigate to **Settings** → **Environment Variables**

### 2. Add Environment Variables

Add each of the following environment variables. Click **Add** for each one:

#### Sanity CMS Configuration

```
Name: NEXT_PUBLIC_SANITY_PROJECT_ID
Value: [Your Sanity Project ID]
Environment: Production, Preview, Development (select all)
```

```
Name: NEXT_PUBLIC_SANITY_DATASET
Value: production
Environment: Production, Preview, Development (select all)
```

```
Name: SANITY_API_TOKEN
Value: [Your Sanity API Token]
Environment: Production, Preview, Development (select all)
```

#### Sanity Studio Access

```
Name: STUDIO_PASSWORD
Value: [Your secure password for Studio access]
Environment: Production, Preview, Development (select all)
```

#### Content Revalidation

```
Name: REVALIDATE_SECRET
Value: [Generate a random string - use: openssl rand -base64 32]
Environment: Production, Preview, Development (select all)
```

#### Supabase Database

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://your-project.supabase.co
Environment: Production, Preview, Development (select all)
```

```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [Your Supabase Anonymous Key]
Environment: Production, Preview, Development (select all)
```

#### Email Configuration (Resend)

```
Name: RESEND_API_KEY
Value: re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Environment: Production, Preview, Development (select all)
```

```
Name: FROM_EMAIL
Value: Formula Hellas <quiz@formulahellas.gr>
Environment: Production, Preview, Development (select all)
```

```
Name: NOTIFICATION_EMAILS
Value: notifications@formulahellas.gr,technical@formulahellas.gr
Environment: Production, Preview, Development (select all)
```

### 3. Important Notes

#### Environment Selection
- **Production**: Used for your live site (formulahellas.gr)
- **Preview**: Used for preview deployments (pull requests)
- **Development**: Used for local development (if using Vercel CLI)

**Recommendation**: Select all three environments for most variables to ensure consistency.

#### Email Configuration

**Before setting up emails in Vercel:**

1. **Verify Domain in Resend**:
   - Go to [Resend Dashboard](https://resend.com/domains)
   - Add and verify `formulahellas.gr` domain
   - Complete DNS setup (see `EMAIL_CONFIGURATION.md`)

2. **Verify Email Addresses**:
   - Verify `quiz@formulahellas.gr` in Resend (for quiz emails)
   - Verify `info@formulahellas.gr` in Resend (for form notifications)

3. **Get Resend API Key**:
   - Go to [Resend API Keys](https://resend.com/api-keys)
   - Create a new API key
   - Copy the key (starts with `re_`)

#### FROM_EMAIL Variable

The `FROM_EMAIL` variable is used for both quiz emails and form notifications. The code uses:
- `quiz@formulahellas.gr` for quiz submission emails (default)
- `info@formulahellas.gr` for form notifications (default)

If you want different emails for different purposes, you can:
- Keep `FROM_EMAIL=Formula Hellas <quiz@formulahellas.gr>` (quiz emails will use this)
- The form notification code will use `info@formulahellas.gr` as fallback

### 4. After Adding Variables

1. **Redeploy**: After adding environment variables, you need to redeploy:
   - Go to **Deployments** tab
   - Click the **⋯** (three dots) on the latest deployment
   - Select **Redeploy**
   - Or push a new commit to trigger automatic deployment

2. **Verify**: Check that the deployment succeeds and emails work:
   - Test email sending using `/test-email` page
   - Submit a test quiz registration
   - Check that confirmation emails are received

### 5. Testing Email Configuration

After deployment, test the email setup:

1. Visit: `https://formulahellas.gr/test-email`
2. Enter your email address
3. Click "Send Test Email"
4. Check your inbox (and spam folder)
5. Verify the email arrives correctly

### 6. Troubleshooting

#### Emails Not Sending

1. **Check Resend Dashboard**:
   - Go to [Resend Dashboard](https://resend.com)
   - Check **Logs** tab for email delivery status
   - Look for any errors or bounces

2. **Verify DNS Records**:
   - Ensure all DNS records are set up (see `EMAIL_CONFIGURATION.md`)
   - Wait 24-48 hours after DNS changes for full propagation

3. **Check Environment Variables**:
   - Verify `RESEND_API_KEY` is set correctly
   - Verify `FROM_EMAIL` matches verified domain
   - Check Vercel deployment logs for errors

#### Build Failures

1. **Check Required Variables**:
   - Ensure all `NEXT_PUBLIC_*` variables are set
   - These are embedded at build time

2. **Check Deployment Logs**:
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on failed deployment
   - Check build logs for specific errors

### 7. Security Best Practices

1. **Never commit `.env.local`** to git (already in `.gitignore`)
2. **Use strong passwords** for `STUDIO_PASSWORD`
3. **Generate secure tokens** for `REVALIDATE_SECRET`
4. **Rotate API keys** periodically
5. **Use different keys** for production vs development if needed

### 8. Quick Reference

| Variable | Required | Purpose | Where to Get |
|----------|----------|---------|--------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ✅ Yes | Sanity CMS | sanity.io/manage |
| `NEXT_PUBLIC_SANITY_DATASET` | ✅ Yes | Sanity dataset | sanity.io/manage |
| `SANITY_API_TOKEN` | ✅ Yes | Sanity API access | sanity.io/manage |
| `STUDIO_PASSWORD` | ⚠️ Recommended | Studio protection | Set your own |
| `REVALIDATE_SECRET` | ✅ Yes | Webhook security | Generate random |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | Database connection | supabase.com |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | Database access | supabase.com |
| `RESEND_API_KEY` | ✅ Yes | Email sending | resend.com/api-keys |
| `FROM_EMAIL` | ⚠️ Optional | Email sender | Set to verified email |
| `NOTIFICATION_EMAILS` | ⚠️ Optional | Form notifications | Comma-separated list |

### 9. Environment Variable Priority

Vercel uses this priority order:
1. **Environment-specific** variables (Production/Preview/Development)
2. **Shared** variables (all environments)
3. **System** variables (automatically set by Vercel)

If you need different values for different environments, set them separately.

---

**Need Help?**
- Check deployment logs in Vercel Dashboard
- Review `EMAIL_CONFIGURATION.md` for email setup
- Contact: technical@formulahellas.gr



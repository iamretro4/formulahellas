# Email Configuration Guide

## Current Email Settings

### Quiz Submission Emails
- **From Address**: `quiz@formulahellas.gr` (or set via `FROM_EMAIL` env variable)
- **Contact Link in Email**: `quiz@formulahellas.gr` (matches sending domain)

### Form Notification Emails
- **From Address**: `info@formulahellas.gr` (or set via `FROM_EMAIL` env variable)

## Resend Dashboard Recommendations

### ✅ Fixed Issues

1. **Changed from "noreply" to "quiz"**
   - Old: `noreply@formulahellas.gr`
   - New: `quiz@formulahellas.gr`
   - This improves trust and allows recipients to reply

2. **Link URLs match sending domain**
   - Changed contact email in quiz emails from `technical@formulahellas.gr` to `quiz@formulahellas.gr`
   - This matches the sending domain (`formulahellas.gr`) and improves deliverability

### ⚠️ DMARC Record Setup (DNS Configuration Required)

To fix the "No DMARC record found" warning, you need to add a DMARC record to your DNS:

1. **Access your DNS provider** (where `formulahellas.gr` domain is managed)

2. **Add a TXT record** with the following:
   ```
   Type:    
   Name: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:dmarc@formulahellas.gr
   TTL: 3600
   ```

3. **Recommended DMARC policy** (after testing):
   ```
   v=DMARC1; p=quarantine; rua=mailto:dmarc@formulahellas.gr; ruf=mailto:dmarc@formulahellas.gr; pct=100
   ```

4. **Verify the record**:
   - Use online tools like: https://mxtoolbox.com/dmarc.aspx
   - Or: `nslookup -type=TXT _dmarc.formulahellas.gr`

### Email Addresses to Verify in Resend

Make sure these email addresses are verified in your Resend dashboard:
- `quiz@formulahellas.gr` (for quiz submission emails)
- `info@formulahellas.gr` (for form notifications)

### Environment Variables

Update your `.env.local` or production environment:

```env
# Email Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxx
FROM_EMAIL=Formula Hellas <quiz@formulahellas.gr>  # For quiz emails
# Or use separate variables for different email types
```

## Testing

After making DNS changes:
1. Wait 24-48 hours for DNS propagation
2. Check Resend dashboard again
3. Test email sending using `/test-email` page
4. Verify emails arrive in inbox (not spam)

## Required DNS Records for Resend

Add these DNS records to your domain provider (where `formulahellas.gr` DNS is managed):

### Sending Records (Required)

1. **DKIM Record** (DomainKeys Identified Mail):
   ```
   Type: TXT
   Host/Name: resend._domainkey
   Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDaIphPYLOiRkoJ+rOTtkzJ5iq3XXaW0FtelxPzaVNgCaJrB6KJizwr3qj4lPfXnwQxbVUmS6dKFU/mFN60OcC+WtkjE+5WMJTrVIqVLYtJqcvmD04TiDKdSaMs2WJ7v25rMfgTbAwSfvL9B6dwT4wuMCFCIQWxN8moTcfg/v6iqwIDAQAB
   TTL: 3600 (or default)
   ```

2. **SPF Record** (Sender Policy Framework):
   ```
   Type: TXT
   Host/Name: send
   Value: v=spf1 include:amazonses.com ~all
   TTL: 3600 (or default)
   ```

3. **MX Record for Sending**:
   ```
   Type: MX
   Host/Name: send
   Value: feedback-smtp.eu-west-1.amazonses.com
   Priority: 10
   TTL: 3600 (or default)
   ```

### Receiving Record (Optional - for receiving emails)

4. **MX Record for Receiving**:
   ```
   Type: MX
   Host/Name: @ (or root domain)
   Value: inbound-smtp.eu-west-1.amazonaws.com
   Priority: 10
   TTL: 3600 (or default)
   ```

### DMARC Record (Recommended)

5. **DMARC Record** (for email authentication):
   ```
   Type: TXT
   Host/Name: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:dmarc@formulahellas.gr
   TTL: 3600 (or default)
   ```

## Step-by-Step Setup Instructions

### For Cloudflare:
1. Go to Cloudflare Dashboard → Select `formulahellas.gr` → DNS → Records
2. Add each record above (click "Add record" for each)
3. Save all records

### For Namecheap:
1. Go to Namecheap Dashboard → Domain List → Manage → Advanced DNS
2. Add each record above
3. For MX records, use "MX Record" type
4. For TXT records, use "TXT Record" type

### For GoDaddy:
1. Go to GoDaddy Dashboard → My Products → DNS
2. Add each record above
3. Save all records

### For Vercel (if DNS is managed there):
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Click on `formulahellas.gr` → DNS Records tab
3. Add each record above
4. Save all records

## Verification

After adding all records:

1. **Wait 5-30 minutes** for DNS propagation
2. **Verify in Resend Dashboard**:
   - Go to Resend Dashboard → Domains → `formulahellas.gr`
   - Check that all records show as "Verified" ✅
3. **Test with online tools**:
   - DKIM: https://mxtoolbox.com/spf.aspx
   - SPF: https://mxtoolbox.com/spf.aspx
   - DMARC: https://mxtoolbox.com/dmarc.aspx
   - MX: https://mxtoolbox.com/mxlookup.aspx

## Important Notes

- **DKIM and SPF are REQUIRED** for sending emails through Resend
- **MX record for sending** is required for bounce/complaint handling
- **MX record for receiving** is optional (only needed if you want to receive emails at your domain)
- **DMARC** is recommended for better deliverability
- All records must be added at your **domain's DNS provider** (not Vercel, unless Vercel manages your DNS)


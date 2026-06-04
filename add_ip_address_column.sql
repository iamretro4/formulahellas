-- Add ip_address column to quiz_submissions table
-- Run this SQL in your Supabase SQL Editor

ALTER TABLE quiz_submissions
ADD COLUMN IF NOT EXISTS ip_address TEXT;

-- Optional: Add a comment to document the column
COMMENT ON COLUMN quiz_submissions.ip_address IS 'Client IP address at time of submission (for verification purposes)';

-- Optional: Create an index if you plan to query by IP address frequently
-- CREATE INDEX IF NOT EXISTS idx_quiz_submissions_ip_address ON quiz_submissions(ip_address);

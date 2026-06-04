-- Change score column from integer to decimal/numeric
-- Run this SQL in your Supabase SQL Editor

-- First, check if there are any existing scores that need to be preserved
-- Then alter the column type to NUMERIC with 2 decimal places
ALTER TABLE quiz_submissions
ALTER COLUMN score TYPE NUMERIC(10, 2);

-- Optional: Add a comment to document the column
COMMENT ON COLUMN quiz_submissions.score IS 'Quiz score: correct = +1, incorrect = -0.5, unanswered = 0. Stored as decimal to preserve precision.';

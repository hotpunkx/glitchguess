/*
# Add Location Tracking to Game Sessions

## Overview
Add IP address and geolocation fields to track where users are playing from.

## Changes

### game_sessions table
Add new columns:
- `ip_address` (text, nullable): User's IP address
- `country` (text, nullable): Country name (e.g., "United States")
- `country_code` (text, nullable): ISO country code (e.g., "US")
- `region` (text, nullable): State/region name
- `city` (text, nullable): City name
- `timezone` (text, nullable): Timezone (e.g., "America/New_York")

## Privacy
- IP addresses stored for analytics only
- No personally identifiable information beyond location
- Complies with general analytics practices
*/

-- Add location columns to game_sessions
ALTER TABLE game_sessions
ADD COLUMN IF NOT EXISTS ip_address text,
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS country_code text,
ADD COLUMN IF NOT EXISTS region text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS timezone text;

-- Create index for location-based queries
CREATE INDEX IF NOT EXISTS idx_game_sessions_country ON game_sessions(country);
CREATE INDEX IF NOT EXISTS idx_game_sessions_city ON game_sessions(city);

-- Add comments
COMMENT ON COLUMN game_sessions.ip_address IS 'User IP address for analytics';
COMMENT ON COLUMN game_sessions.country IS 'Country name from IP geolocation';
COMMENT ON COLUMN game_sessions.country_code IS 'ISO country code';
COMMENT ON COLUMN game_sessions.city IS 'City name from IP geolocation';
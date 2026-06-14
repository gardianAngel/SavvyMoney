-- Migration: 20260614131500_add_user_profile_fields.sql
-- Description: Add profile fields to public.users table

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS birthday DATE,
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS currency TEXT,
ADD COLUMN IF NOT EXISTS currency_symbol TEXT,
ADD COLUMN IF NOT EXISTS profile_complete BOOLEAN DEFAULT false;

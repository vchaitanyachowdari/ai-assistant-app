-- Row Level Security (RLS) Policies for AI Assistant App
-- This script sets up comprehensive security policies for all tables

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

DROP POLICY IF EXISTS "Users can manage own settings" ON user_settings;

DROP POLICY IF EXISTS "Users can manage own integrations" ON integrations;

DROP POLICY IF EXISTS "Users can manage own tasks" ON tasks;

DROP POLICY IF EXISTS "Users can manage own notifications" ON notifications;

DROP POLICY IF EXISTS "Users can manage own conversations" ON ai_conversations;

DROP POLICY IF EXISTS "Users can view own sync logs" ON sync_logs;
DROP POLICY IF EXISTS "System can create sync logs" ON sync_logs;

DROP POLICY IF EXISTS "Users can manage own sessions" ON user_sessions;

DROP POLICY IF EXISTS "Users can view own API usage" ON api_usage;
DROP POLICY IF EXISTS "System can create API usage" ON api_usage;

DROP POLICY IF EXISTS "Users can manage own webhooks" ON webhooks;
DROP POLICY IF EXISTS "System can create webhooks" ON webhooks;

DROP POLICY IF EXISTS "Users can manage own email templates" ON email_templates;

DROP POLICY IF EXISTS "Users can manage own calendar events" ON calendar_events;

DROP POLICY IF EXISTS "Users can manage own emails" ON emails;

-- Users table policies
CREATE POLICY "Users can view own profile" ON users 
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users 
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users 
    FOR INSERT WITH CHECK (auth.uid() = id);

-- User settings policies
CREATE POLICY "Users can manage own settings" ON user_settings 
    FOR ALL USING (auth.uid() = user_id);

-- Integrations policies
CREATE POLICY "Users can manage own integrations" ON integrations 
    FOR ALL USING (auth.uid() = user_id);

-- Tasks policies
CREATE POLICY "Users can manage own tasks" ON tasks 
    FOR ALL USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can manage own notifications" ON notifications 
    FOR ALL USING (auth.uid() = user_id);

-- AI conversations policies
CREATE POLICY "Users can manage own conversations" ON ai_conversations 
    FOR ALL USING (auth.uid() = user_id);

-- Sync logs policies (read-only for users, write for system)
CREATE POLICY "Users can view own sync logs" ON sync_logs 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create sync logs" ON sync_logs 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update sync logs" ON sync_logs 
    FOR UPDATE USING (true);

-- User sessions policies
CREATE POLICY "Users can manage own sessions" ON user_sessions 
    FOR ALL USING (auth.uid() = user_id);

-- API usage policies (read-only for users, write for system)
CREATE POLICY "Users can view own API usage" ON api_usage 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create API usage" ON api_usage 
    FOR INSERT WITH CHECK (true);

-- Webhooks policies
CREATE POLICY "Users can manage own webhooks" ON webhooks 
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "System can create webhooks" ON webhooks 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update webhooks" ON webhooks 
    FOR UPDATE USING (true);

-- Email templates policies
CREATE POLICY "Users can manage own email templates" ON email_templates 
    FOR ALL USING (auth.uid() = user_id);

-- Calendar events policies
CREATE POLICY "Users can manage own calendar events" ON calendar_events 
    FOR ALL USING (auth.uid() = user_id);

-- Emails policies
CREATE POLICY "Users can manage own emails" ON emails 
    FOR ALL USING (auth.uid() = user_id);

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant permissions to service role for system operations
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Create a function to check if user is admin (for future admin features)
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE id = user_id 
        AND subscription_tier = 'enterprise'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user has valid subscription
CREATE OR REPLACE FUNCTION has_valid_subscription(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE id = user_id 
        AND (
            subscription_tier = 'free'

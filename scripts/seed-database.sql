-- Seed data for AI Assistant App
-- This script populates the database with sample data for development and testing

-- Insert sample user
INSERT INTO users (id, email, name, avatar_url, timezone, language) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'john.doe@example.com', 'John Doe', '/diverse-user-avatars.png', 'America/New_York', 'en')
ON CONFLICT (email) DO NOTHING;

-- Insert user settings
INSERT INTO user_settings (user_id, theme, notifications_enabled, push_enabled, whatsapp_enabled, email_summaries, smart_reminders) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'system', true, true, false, true, true)
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample integrations
INSERT INTO integrations (user_id, type, name, connected, last_sync, sync_status, permissions) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'gmail', 'Gmail', true, NOW() - INTERVAL '5 minutes', 'active', '["read_emails", "send_emails", "manage_labels"]'),
('550e8400-e29b-41d4-a716-446655440000', 'calendar', 'Google Calendar', true, NOW() - INTERVAL '10 minutes', 'active', '["read_events", "create_events", "modify_events"]'),
('550e8400-e29b-41d4-a716-446655440000', 'slack', 'Slack', true, NOW() - INTERVAL '2 hours', 'error', '["read_messages", "send_messages", "access_channels"]'),
('550e8400-e29b-41d4-a716-446655440000', 'github', 'GitHub', true, NOW() - INTERVAL '30 minutes', 'syncing', '["read_repositories", "read_issues", "read_pull_requests"]'),
('550e8400-e29b-41d4-a716-446655440000', 'discord', 'Discord', false, NULL, 'active', '["read_messages", "send_messages"]'),
('550e8400-e29b-41d4-a716-446655440000', 'whatsapp', 'WhatsApp Business', false, NULL, 'active', '["send_messages", "receive_webhooks"]')
ON CONFLICT (user_id, type) DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (user_id, title, description, type, priority, status, source, estimated_time_minutes, due_date, ai_generated) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Review pending emails', 'Process 5 urgent emails from clients requiring immediate attention', 'ai-suggested', 'high', 'pending', 'gmail', 20, NOW() + INTERVAL '2 hours', true),
('550e8400-e29b-41d4-a716-446655440000', 'Prepare for client meeting', 'Review project status and prepare talking points for 2 PM call', 'ai-suggested', 'high', 'pending', 'calendar', 30, NOW() + INTERVAL '4 hours', true),
('550e8400-e29b-41d4-a716-446655440000', 'Update project documentation', 'Add new features and API changes to project wiki', 'ai-suggested', 'medium', 'pending', 'github', 45, NULL, true),
('550e8400-e29b-41d4-a716-446655440000', 'Schedule dentist appointment', 'Book routine checkup for next month', 'user-created', 'low', 'pending', NULL, 5, NULL, false),
('550e8400-e29b-41d4-a716-446655440000', 'Complete expense report', 'Submit monthly expense report with receipts', 'completed', 'medium', 'completed', NULL, 15, NULL, false)
ON CONFLICT DO NOTHING;

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type, priority, read, actionable, actions, source_id) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'New Email from Client', 'John Smith sent you an important message about the project timeline', 'email', 'high', false, true, '[{"label": "Reply", "action": "reply"}, {"label": "Archive", "action": "archive"}]', 'email_123'),
('550e8400-e29b-41d4-a716-446655440000', 'Meeting in 15 minutes', 'Team standup meeting starts soon in Conference Room A', 'calendar', 'high', false, true, '[{"label": "Join", "action": "join"}, {"label": "Reschedule", "action": "reschedule"}]', 'event_456'),
('550e8400-e29b-41d4-a716-446655440000', 'Slack Message', 'Sarah mentioned you in #general: Can you review the latest designs?', 'slack', 'medium', true, false, '[]', 'slack_789'),
('550e8400-e29b-41d4-a716-446655440000', 'GitHub PR Review', 'Pull request #123 is ready for your review', 'github', 'medium', false, true, '[{"label": "Review", "action": "review"}, {"label": "Later", "action": "later"}]', 'pr_123'),
('550e8400-e29b-41d4-a716-446655440000', 'System Update', 'Your integrations have been successfully synced', 'system', 'low', true, false, '[]', NULL)
ON CONFLICT DO NOTHING;

-- Insert sample AI conversation
INSERT INTO ai_conversations (user_id, session_id, message_type, content, cards, suggestions) VALUES 
('550e8400-e29b-41d4-a716-446655440000', gen_random_uuid(), 'assistant', 'Hi! I''m your AI assistant. I can help you with emails, calendar events, tasks, and more. What would you like to do today?', '[{"type": "summary", "title": "Today''s Summary", "content": "You have 4 meetings, 12 unread emails, and 3 pending tasks.", "action": "View Details"}]', '["Summarize my emails", "What''s my schedule?", "Show me my tasks"]')
ON CONFLICT DO NOTHING;

-- Insert sample sync logs
INSERT INTO sync_logs (user_id, integration_type, status, records_processed, started_at, completed_at) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'gmail', 'success', 12, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '55 minutes'),
('550e8400-e29b-41d4-a716-446655440000', 'calendar', 'success', 4, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '28 minutes'),
('550e8400-e29b-41d4-a716-446655440000', 'slack', 'error', 0, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
('550e8400-e29b-41d4-a716-446655440000', 'github', 'partial', 8, NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '40 minutes')
ON CONFLICT DO NOTHING;

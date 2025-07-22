-- Enhanced seed data for AI Assistant App
-- This script populates the database with comprehensive sample data

-- Insert sample users
INSERT INTO users (id, email, name, avatar_url, timezone, language, subscription_tier, last_active_at) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'john.doe@example.com', 'John Doe', '/diverse-user-avatars.png', 'America/New_York', 'en', 'pro', NOW()),
('550e8400-e29b-41d4-a716-446655440001', 'jane.smith@example.com', 'Jane Smith', '/diverse-user-avatars.png', 'Europe/London', 'en', 'free', NOW() - INTERVAL '2 hours'),
('550e8400-e29b-41d4-a716-446655440002', 'carlos.rodriguez@example.com', 'Carlos Rodriguez', '/diverse-user-avatars.png', 'America/Los_Angeles', 'es', 'pro', NOW() - INTERVAL '1 day')
ON CONFLICT (email) DO NOTHING;

-- Insert comprehensive user settings
INSERT INTO user_settings (
    user_id, theme, notifications_enabled, push_enabled, whatsapp_enabled, 
    email_summaries, smart_reminders, quiet_hours_start, quiet_hours_end,
    ai_provider, ai_model, ai_response_style, proactive_mode, voice_enabled,
    data_retention_days, auto_archive_completed_tasks, task_reminder_minutes, meeting_reminder_minutes
) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'dark', true, true, true, true, true, '22:00', '08:00', 'openrouter', 'deepseek/deepseek-chat-v3-0324:free', 'professional', true, false, 90, true, 15, 10),
('550e8400-e29b-41d4-a716-446655440001', 'light', true, true, false, true, true, '23:00', '07:00', 'gemini', 'gemini-1.5-flash', 'casual', true, false, 30, false, 30, 15),
('550e8400-e29b-41d4-a716-446655440002', 'system', true, false, true, false, true, '21:00', '09:00', 'openrouter', 'meta-llama/llama-3.2-3b-instruct:free', 'concise', false, false, 60, true, 10, 5)
ON CONFLICT (user_id) DO NOTHING;

-- Insert comprehensive integrations
INSERT INTO integrations (
    user_id, type, name, connected, last_sync, sync_status, sync_frequency_minutes,
    permissions, settings, error_count, webhook_url
) VALUES 
-- John's integrations
('550e8400-e29b-41d4-a716-446655440000', 'gmail', 'Gmail', true, NOW() - INTERVAL '5 minutes', 'active', 15, 
 '["read_emails", "send_emails", "manage_labels"]', '{"auto_archive": true, "priority_keywords": ["urgent", "asap"]}', 0, 'https://api.example.com/webhooks/gmail/john'),
('550e8400-e29b-41d4-a716-446655440000', 'calendar', 'Google Calendar', true, NOW() - INTERVAL '10 minutes', 'active', 30,
 '["read_events", "create_events", "modify_events"]', '{"default_duration": 60, "auto_decline_conflicts": false}', 0, 'https://api.example.com/webhooks/calendar/john'),
('550e8400-e29b-41d4-a716-446655440000', 'slack', 'Slack Workspace', true, NOW() - INTERVAL '2 hours', 'error', 5,
 '["read_messages", "send_messages", "access_channels"]', '{"channels": ["#general", "#dev-team"], "keywords": ["@john", "urgent"]}', 3, 'https://api.example.com/webhooks/slack/john'),
('550e8400-e29b-41d4-a716-446655440000', 'github', 'GitHub', true, NOW() - INTERVAL '30 minutes', 'active', 60,
 '["read_repositories", "read_issues", "read_pull_requests"]', '{"repositories": ["company/main-app", "company/api"], "watch_prs": true}', 0, 'https://api.example.com/webhooks/github/john'),
('550e8400-e29b-41d4-a716-446655440000', 'whatsapp', 'WhatsApp Business', true, NOW() - INTERVAL '1 hour', 'active', 0,
 '["send_messages", "receive_webhooks"]', '{"phone_number": "+1234567890", "business_account": true}', 0, 'https://api.example.com/webhooks/whatsapp/john'),

-- Jane's integrations
('550e8400-e29b-41d4-a716-446655440001', 'gmail', 'Gmail', true, NOW() - INTERVAL '15 minutes', 'active', 30,
 '["read_emails", "send_emails"]', '{"auto_archive": false, "priority_keywords": ["important", "review"]}', 0, 'https://api.example.com/webhooks/gmail/jane'),
('550e8400-e29b-41d4-a716-446655440001', 'calendar', 'Google Calendar', true, NOW() - INTERVAL '5 minutes', 'active', 15,
 '["read_events", "create_events"]', '{"default_duration": 30, "auto_decline_conflicts": true}', 0, 'https://api.example.com/webhooks/calendar/jane'),
('550e8400-e29b-41d4-a716-446655440001', 'notion', 'Notion Workspace', false, NULL, 'active', 120,
 '["read_pages", "create_pages"]', '{"workspace": "Personal", "default_database": "tasks"}', 0, NULL),

-- Carlos's integrations
('550e8400-e29b-41d4-a716-446655440002', 'gmail', 'Gmail', true, NOW() - INTERVAL '1 hour', 'syncing', 20,
 '["read_emails", "send_emails", "manage_labels"]', '{"language": "es", "auto_translate": true}', 1, 'https://api.example.com/webhooks/gmail/carlos'),
('550e8400-e29b-41d4-a716-446655440002', 'discord', 'Discord', true, NOW() - INTERVAL '3 hours', 'active', 10,
 '["read_messages", "send_messages"]', '{"servers": ["Design Team", "Client Projects"], "dm_notifications": true}', 0, 'https://api.example.com/webhooks/discord/carlos')
ON CONFLICT (user_id, type) DO NOTHING;

-- Insert comprehensive tasks
INSERT INTO tasks (
    user_id, title, description, type, priority, status, source, source_id,
    estimated_time_minutes, due_date, reminder_at, ai_generated, ai_confidence, tags, metadata
) VALUES 
-- John's tasks
('550e8400-e29b-41d4-a716-446655440000', 'Review Q4 Budget Proposal', 'Analyze the quarterly budget proposal from finance team and provide feedback', 'ai-suggested', 'high', 'pending', 'gmail', 'email_12345', 45, NOW() + INTERVAL '2 days', NOW() + INTERVAL '1 day', true, 0.92, '["finance", "review", "quarterly"]', '{"email_subject": "Q4 Budget Review Required", "sender": "finance@company.com"}'),
('550e8400-e29b-41d4-a716-446655440000', 'Prepare client presentation', 'Create slides for the ABC Corp presentation scheduled for Friday', 'ai-suggested', 'high', 'in-progress', 'calendar', 'event_67890', 120, NOW() + INTERVAL '3 days', NOW() + INTERVAL '2 days', true, 0.88, '["presentation", "client", "abc-corp"]', '{"meeting_title": "ABC Corp Quarterly Review", "attendees": 8}'),
('550e8400-e29b-41d4-a716-446655440000', 'Code review for PR #234', 'Review the authentication refactor pull request', 'ai-suggested', 'medium', 'pending', 'github', 'pr_234', 30, NOW() + INTERVAL '1 day', NOW() + INTERVAL '4 hours', true, 0.95, '["code-review", "authentication", "security"]', '{"pr_title": "Refactor authentication system", "author": "dev@company.com", "files_changed": 12}'),
('550e8400-e29b-41d4-a716-446655440000', 'Update project documentation', 'Add new API endpoints to the developer documentation', 'user-created', 'low', 'pending', 'manual', NULL, 60, NULL, NULL, false, NULL, '["documentation", "api", "development"]', '{}'),
('550e8400-e29b-41d4-a716-446655440000', 'Weekly team standup preparation', 'Prepare updates for Monday team standup meeting', 'recurring', 'medium', 'completed', 'calendar', 'recurring_123', 15, NOW() - INTERVAL '1 day', NULL, false, NULL, '["meeting", "standup", "team"]', '{"recurring_pattern": "weekly", "day": "monday"}'),

-- Jane's tasks
('550e8400-e29b-41d4-a716-446655440001', 'Design system audit', 'Conduct comprehensive audit of current design system components', 'user-created', 'high', 'in-progress', 'manual', NULL, 240, NOW() + INTERVAL '1 week', NOW() + INTERVAL '2 days', false, NULL, '["design", "audit", "system"]', '{"components_count": 45, "priority_components": ["buttons", "forms", "navigation"]}'),
('550e8400-e29b-41d4-a716-446655440001', 'Client feedback integration', 'Incorporate client feedback from last week\'s design review', 'ai-suggested', 'medium', 'pending', 'gmail', 'email_54321', 90, NOW() + INTERVAL '3 days', NOW() + INTERVAL '1 day', true, 0.87, '["design", "client", "feedback"]', '{"client": "XYZ Corp", "feedback_items": 7}'),
('550e8400-e29b-41d4-a716-446655440001', 'Prototype mobile navigation', 'Create interactive prototype for new mobile navigation pattern', 'user-created', 'medium', 'pending', 'manual', NULL, 180, NOW() + INTERVAL '5 days', NULL, false, NULL, '["prototype", "mobile", "navigation"]', '{"tool": "Figma", "screens": 8}'),

-- Carlos's tasks
('550e8400-e29b-41d4-a716-446655440002', 'Traducir documentación técnica', 'Translate technical documentation from English to Spanish', 'ai-suggested', 'medium', 'pending', 'gmail', 'email_98765', 120, NOW() + INTERVAL '4 days', NOW() + INTERVAL '2 days', true, 0.91, '["translation", "documentation", "spanish"]', '{"pages": 25, "technical_terms": 150}'),
('550e8400-e29b-41d4-a716-446655440002', 'Set up development environment', 'Configure local development environment for new project', 'user-created', 'high', 'completed', 'manual', NULL, 90, NOW() - INTERVAL '2 days', NULL, false, NULL, '["setup", "development", "environment"]', '{"project": "mobile-app-v2", "tools": ["Docker", "Node.js", "React Native"]}'),
('550e8400-e29b-41d4-a716-446655440002', 'Review design mockups', 'Review and provide feedback on latest design mockups', 'ai-suggested', 'low', 'pending', 'discord', 'msg_456789', 45, NOW() + INTERVAL '2 days', NULL, true, 0.83, '["review", "design", "mockups"]', '{"designer": "Maria", "screens": 12, "platform": "mobile"})
ON CONFLICT DO NOTHING;

-- Insert comprehensive notifications
INSERT INTO notifications (
    user_id, title, message, type, priority, read, actionable, actions, source_id, source_type, metadata, expires_at
) VALUES 
-- John's notifications
('550e8400-e29b-41d4-a716-446655440000', 'Urgent: Client Meeting in 30 Minutes', 'ABC Corp quarterly review meeting starts in 30 minutes. Conference Room A.', 'calendar', 'high', false, true, 
 '[{"label": "Join Meeting", "action": "join_meeting", "variant": "default"}, {"label": "Reschedule", "action": "reschedule", "variant": "outline"}]', 
 'event_67890', 'calendar', '{"meeting_url": "https://zoom.us/j/123456789", "room": "Conference Room A"}', NOW() + INTERVAL '1 hour'),
('550e8400-e29b-41d4-a716-446655440000', 'New Email from Finance Team', 'Q4 Budget proposal requires your review and approval by EOD Friday.', 'email', 'high', false, true,
 '[{"label": "Read Email", "action": "open_email", "variant": "default"}, {"label": "Quick Reply", "action": "quick_reply", "variant": "outline"}, {"label": "Archive", "action": "archive", "variant": "outline"}]',
 'email_12345', 'gmail', '{"sender": "finance@company.com", "subject": "Q4 Budget Review Required", "thread_id": "thread_abc123"}', NULL),
('550e8400-e29b-41d4-a716-446655440000', 'GitHub: PR Ready for Review', 'Pull request #234 "Refactor authentication system" is ready for your review.', 'github', 'medium', false, true,
 '[{"label": "Review PR", "action": "open_pr", "variant": "default"}, {"label": "Assign Reviewer", "action": "assign_reviewer", "variant": "outline"}, {"label": "Later", "action": "snooze", "variant": "outline"}]',
 'pr_234', 'github', '{"repository": "company/main-app", "author": "dev@company.com", "files_changed": 12}', NULL),
('550e8400-e29b-41d4-a716-446655440000', 'Slack: Mentioned in #dev-team', 'Sarah mentioned you: "@john can you help with the database migration issue?"', 'slack', 'medium', true, false, '[]',
 'msg_slack_789', 'slack', '{"channel": "#dev-team", "author": "Sarah Johnson", "timestamp": "2024-01-15T14:30:00Z"}', NULL),
('550e8400-e29b-41d4-a716-446655440000', 'Task Reminder: Code Review Due', 'Your code review for PR #234 is due in 2 hours.', 'task', 'medium', false, true,
 '[{"label": "Start Review", "action": "start_task", "variant": "default"}, {"label": "Extend Deadline", "action": "extend_deadline", "variant": "outline"}]',
 'task_reminder_1', 'system', '{"task_id": "550e8400-e29b-41d4-a716-446655440003", "due_in_hours": 2}', NOW() + INTERVAL '2 hours'),

-- Jane's notifications
('550e8400-e29b-41d4-a716-446655440001', 'Design Review Feedback Received', 'XYZ Corp has provided feedback on the latest design iteration.', 'email', 'medium', false, true,
 '[{"label": "View Feedback", "action": "open_email", "variant": "default"}, {"label": "Schedule Call", "action": "schedule_call", "variant": "outline"}]',
 'email_54321', 'gmail', '{"client": "XYZ Corp", "feedback_items": 7, "overall_rating": "positive"}', NULL),
('550e8400-e29b-41d4-a716-446655440001', 'Weekly Design System Sync', 'Reminder: Weekly design system sync meeting in 1 hour.', 'calendar', 'low', false, true,
 '[{"label": "Join Meeting", "action": "join_meeting", "variant": "default"}, {"label": "View Agenda", "action": "view_agenda", "variant": "outline"}]',
 'event_design_sync', 'calendar', '{"meeting_url": "https://meet.google.com/abc-defg-hij", "agenda_items": 5}', NOW() + INTERVAL '2 hours'),

-- Carlos's notifications
('550e8400-e29b-41d4-a716-446655440002', 'Discord: New Message in Design Team', 'Maria shared new mockups for the mobile app project.', 'discord', 'low', false, false, '[]',
 'msg_discord_123', 'discord', '{"server": "Design Team", "channel": "mobile-project", "author": "Maria", "attachments": 3}', NULL),
('550e8400-e29b-41d4-a716-446655440002', 'Translation Task Assigned', 'New technical documentation translation task has been assigned to you.', 'system', 'medium', false, true,
 '[{"label": "Start Translation", "action": "start_task", "variant": "default"}, {"label": "View Document", "action": "view_document", "variant": "outline"}]',
 'task_assignment_1', 'system', '{"pages": 25, "deadline": "2024-01-20", "language_pair": "en-es"}', NULL)
ON CONFLICT DO NOTHING;

-- Insert AI conversation history
INSERT INTO ai_conversations (
    user_id, session_id, message_type, content, cards, suggestions, context, ai_provider, ai_model, tokens_used, response_time_ms
) VALUES 
-- John's conversation
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440100', 'user', 'What are my priorities for today?', '[]', '[]', '{}', NULL, NULL, NULL, NULL),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440100', 'assistant', 'Based on your calendar and tasks, here are your top priorities for today:', 
 '[{"type": "summary", "title": "Today\'s Priorities", "content": "1. Client meeting prep (2 hours)\n2. Code review PR #234 (30 min)\n3. Budget proposal review (45 min)", "action": "View Details"}]',
 '["Schedule focused work time", "Set up meeting reminders", "Prepare presentation materials"]',
 '{"connected_tools": ["gmail", "calendar", "github"], "task_count": 5, "meeting_count": 2}', 'openrouter', 'deepseek/deepseek-chat-v3-0324:free', 245, 1200),

-- Jane's conversation
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440101', 'user', 'Help me organize my design tasks', '[]', '[]', '{}', NULL, NULL, NULL, NULL),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440101', 'assistant', 'I\'ll help you organize your design tasks by priority and timeline.',
 '[{"type": "task", "title": "Design Task Organization", "content": "High Priority: Design system audit\nMedium Priority: Client feedback integration\nLow Priority: Mobile navigation prototype", "action": "Update Tasks"}]',
 '["Break down large tasks", "Set realistic deadlines", "Create design checklist"]',
 '{"connected_tools": ["gmail", "calendar"], "task_count": 3, "design_focus": true}', 'gemini', 'gemini-1.5-flash', 189, 800),

-- Carlos's conversation
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440102', 'user', 'Necesito ayuda con la traducción técnica', '[]', '[]', '{}', NULL, NULL, NULL, NULL),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440102', 'assistant', 'Te puedo ayudar con la traducción técnica. Veo que tienes una tarea de traducir documentación de inglés a español.',
 '[{"type": "task", "title": "Traducción Técnica", "content": "25 páginas de documentación técnica\n150 términos técnicos identificados\nFecha límite: 4 días", "action": "Comenzar Traducción"}]',
 '["Crear glosario de términos", "Dividir en secciones", "Revisar terminología específica"]',
 '{"connected_tools": ["gmail", "discord"], "language": "es", "translation_task": true}', 'openrouter', 'meta-llama/llama-3.2-3b-instruct:free', 156, 950)
ON CONFLICT DO NOTHING;

-- Insert sync logs
INSERT INTO sync_logs (
    user_id, integration_type, status, records_processed, records_created, records_updated, records_deleted,
    started_at, completed_at, duration_ms, metadata
) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'gmail', 'success', 15, 3, 8, 0, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '55 minutes', 300000, '{"emails_processed": 15, "new_threads": 2, "labels_updated": 5}'),
('550e8400-e29b-41d4-a716-446655440000', 'calendar', 'success', 8, 2, 1, 0, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '28 minutes', 120000, '{"events_processed": 8, "new_events": 2, "updated_events": 1}'),
('550e8400-e29b-41d4-a716-446655440000', 'slack', 'error', 0, 0, 0, 0, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours', 5000, '{"error": "Authentication failed", "retry_count": 3}'),
('550e8400-e29b-41d4-a716-446655440000', 'github', 'partial', 12, 1, 2, 0, NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '40 minutes', 300000, '{"prs_processed": 5, "issues_processed": 7, "rate_limit_hit": true}'),
('550e8400-e29b-41d4-a716-446655440001', 'gmail', 'success', 8, 1, 3, 0, NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '13 minutes', 120000, '{"emails_processed": 8, "new_threads": 1, "priority_emails": 2}'),
('550e8400-e29b-41d4-a716-446655440002', 'discord', 'success', 25, 5, 0, 0, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours 58 minutes', 180000, '{"messages_processed": 25, "new_mentions": 3, "servers": 2}')
ON CONFLICT DO NOTHING;

-- Insert user sessions
INSERT INTO user_sessions (
    user_id, session_token, ip_address, user_agent, device_type, browser, os, location, expires_at, last_activity_at
) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'session_token_john_123', '192.168.1.100', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'desktop', 'Chrome', 'macOS', '{"country": "US", "city": "New York"}', NOW() + INTERVAL '7 days', NOW()),
('550e8400-e29b-41d4-a716-446655440000', 'session_token_john_mobile_456', '10.0.0.50', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15', 'mobile', 'Safari', 'iOS', '{"country": "US", "city": "New York"}', NOW() + INTERVAL '30 days', NOW() - INTERVAL '2 hours'),
('550e8400-e29b-41d4-a716-446655440001', 'session_token_jane_789', '203.0.113.45', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'desktop', 'Chrome', 'Windows', '{"country": "UK", "city": "London"}', NOW() + INTERVAL '7 days', NOW() - INTERVAL '1 hour'),
('550e8400-e29b-41d4-a716-446655440002', 'session_token_carlos_012', '198.51.100.25', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', 'desktop', 'Firefox', 'Linux', '{"country": "US", "city": "Los Angeles"}', NOW() + INTERVAL '7 days', NOW() - INTERVAL '30 minutes')
ON CONFLICT DO NOTHING;

-- Insert API usage data
INSERT INTO api_usage (
    user_id, endpoint, method, status_code, response_time_ms, tokens_used, cost_cents, ip_address, user_agent
) VALUES 
('550e8400-e29b-41d4-a716-446655440000', '/api/ai/chat', 'POST', 200, 1200, 245, 12, '192.168.1.100', 'AI-Assistant-App/1.0'),
('550e8400-e29b-41d4-a716-446655440000', '/api/tasks', 'GET', 200, 150, 0, 0, '192.168.1.100', 'AI-Assistant-App/1.0'),
('550e8400-e29b-41d4-a716-446655440000', '/api/notifications', 'GET', 200, 200, 0, 0, '10.0.0.50', 'AI-Assistant-App/1.0'),
('550e8400-e29b-41d4-a716-446655440001', '/api/ai/chat', 'POST', 200, 800, 189, 8, '203.0.113.45', 'AI-Assistant-App/1.0'),
('550e8400-e29b-41d4-a716-446655440001', '/api/integrations', 'GET', 200, 100, 0, 0, '203.0.113.45', 'AI-Assistant-App/1.0'),
('550e8400-e29b-41d4-a716-446655440002', '/api/ai/chat', 'POST', 200, 950, 156, 9, '198.51.100.25', 'AI-Assistant-App/1.0')
ON CONFLICT DO NOTHING;

-- Insert email templates
INSERT INTO email_templates (
    user_id, name, subject, body, variables, category, usage_count, is_active
) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Meeting Follow-up', 'Follow-up: {{meeting_title}}', 
 'Hi {{recipient_name}},\n\nThank you for taking the time to meet with me today regarding {{meeting_topic}}.\n\nAs discussed, here are the key action items:\n{{action_items}}\n\nI''ll follow up on {{follow_up_date}} to check on progress.\n\nBest regards,\n{{sender_name}}',
 '["meeting_title", "recipient_name", "meeting_topic", "action_items", "follow_up_date", "sender_name"]', 'follow-up', 5, true),
('550e8400-e29b-41d4-a716-446655440000', 'Project Status Update', 'Project Update: {{project_name}}', 
 'Hi team,\n\nHere''s the weekly update for {{project_name}}:\n\n**Completed:**\n{{completed_items}}\n\n**In Progress:**\n{{in_progress_items}}\n\n**Upcoming:**\n{{upcoming_items}}\n\n**Blockers:**\n{{blockers}}\n\nLet me know if you have any questions.\n\nBest,\n{{sender_name}}',
 '["project_name", "completed_items", "in_progress_items", "upcoming_items", "blockers", "sender_name"]', 'update', 12, true),
('550e8400-e29b-41d4-a716-446655440001', 'Design Review Request', 'Design Review: {{design_title}}', 
 'Hi {{reviewer_name}},\n\nI''ve completed the {{design_title}} and would appreciate your feedback.\n\n**Design Link:** {{design_url}}\n**Deadline:** {{review_deadline}}\n\n**Specific areas for review:**\n{{review_areas}}\n\nPlease let me know if you need any additional context.\n\nThanks!\n{{sender_name}}',
 '["design_title", "reviewer_name", "design_url", "review_deadline", "review_areas", "sender_name"]', 'review', 8, true)
ON CONFLICT DO NOTHING;

-- Insert calendar events cache
INSERT INTO calendar_events (
    user_id, external_id, integration_id, title, description, start_time, end_time, all_day, location, attendees, meeting_url, status
) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'cal_event_123', (SELECT id FROM integrations WHERE user_id = '550e8400-e29b-41d4-a716-446655440000' AND type = 'calendar'), 
 'ABC Corp Quarterly Review', 'Quarterly business review with ABC Corp leadership team', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days 2 hours', false, 'Conference Room A', 
 '["john.doe@company.com", "ceo@abccorp.com", "cto@abccorp.com"]', 'https://zoom.us/j/123456789', 'confirmed'),
('550e8400-e29b-41d4-a716-446655440000', 'cal_event_456', (SELECT id FROM integrations WHERE user_id = '550e8400-e29b-41d4-a716-446655440000' AND type = 'calendar'),
 'Team Standup', 'Weekly team standup meeting', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 30 minutes', false, 'Virtual', 
 '["john.doe@company.com", "team@company.com"]', 'https://meet.google.com/abc-defg-hij', 'confirmed'),
('550e8400-e29b-41d4-a716-446655440001', 'cal_event_789', (SELECT id FROM integrations WHERE user_id = '550e8400-e29b-41d4-a716-446655440001' AND type = 'calendar'),
 'Design System Sync', 'Weekly design system synchronization meeting', NOW() + INTERVAL '2 hours', NOW() + INTERVAL '3 hours', false, 'Virtual',
 '["jane.smith@company.com", "design-team@company.com"]', 'https://meet.google.com/xyz-uvw-rst', 'confirmed')
ON CONFLICT (user_id, external_id, integration_id) DO NOTHING;

-- Insert emails cache
INSERT INTO emails (
    user_id, external_id, integration_id, thread_id, subject, sender_email, sender_name, 
    recipient_emails, body_text, snippet, labels, is_read, is_important, received_at
) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'email_12345', (SELECT id FROM integrations WHERE user_id = '550e8400-e29b-41d4-a716-446655440000' AND type = 'gmail'),
 'thread_abc123', 'Q4 Budget Review Required', 'finance@company.com', 'Finance Team',
 '["john.doe@company.com"]', 'Hi John,\n\nPlease review the attached Q4 budget proposal and provide your feedback by EOD Friday.\n\nThe key areas that need your attention are:\n1. Marketing spend allocation\n2. Technology infrastructure costs\n3. Headcount planning\n\nLet me know if you have any questions.\n\nBest regards,\nFinance Team',
 'Please review the attached Q4 budget proposal and provide your feedback by EOD Friday...', '["INBOX", "IMPORTANT"]', false, true, NOW() - INTERVAL '2 hours'),
('550e8400-e29b-41d4-a716-446655440000', 'email_67890', (SELECT id FROM integrations WHERE user_id = '550e8400-e29b-41d4-a716-446655440000' AND type = 'gmail'),
 'thread_def456', 'Re: Authentication System Refactor', 'dev@company.com', 'Development Team',
 '["john.doe@company.com", "tech-leads@company.com"]', 'Hi John,\n\nI''ve completed the authentication system refactor as discussed. The PR is ready for review.\n\nKey changes:\n- Implemented JWT token rotation\n- Added multi-factor authentication support\n- Improved session management\n- Updated security headers\n\nPlease review when you have a chance.\n\nThanks,\nDev Team',
 'I''ve completed the authentication system refactor as discussed. The PR is ready for review...', '["INBOX"]', false, false, NOW() - INTERVAL '4 hours'),
('550e8400-e29b-41d4-a716-446655440001', 'email_54321', (SELECT id FROM integrations WHERE user_id = '550e8400-e29b-41d4-a716-446655440001' AND type = 'gmail'),
 'thread_ghi789', 'Design Feedback - Mobile App V2', 'client@xyzcorp.com', 'XYZ Corp',
 '["jane.smith@company.com"]', 'Hi Jane,\n\nWe''ve reviewed the latest design iteration for the mobile app. Overall, we''re very pleased with the direction.\n\nFeedback:\n1. Love the new navigation pattern\n2. Color scheme works well with our brand\n3. Consider making the CTA buttons more prominent\n4. User flow for onboarding is intuitive\n\nCan we schedule a call to discuss the next steps?\n\nBest,\nXYZ Corp Team',
 'We''ve reviewed the latest design iteration for the mobile app. Overall, we''re very pleased...', '["INBOX", "CLIENT"]', false, false, NOW() - INTERVAL '6 hours')
ON CONFLICT (user_id, external_id, integration_id) DO NOTHING;

-- Insert webhooks
INSERT INTO webhooks (
    user_id, integration_type, event_type, payload, processed, processed_at, retry_count
) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'gmail', 'email.received', 
 '{"message_id": "email_12345", "thread_id": "thread_abc123", "subject": "Q4 Budget Review Required", "sender": "finance@company.com", "labels": ["INBOX", "IMPORTANT"]}', 
 true, NOW() - INTERVAL '2 hours', 0),
('550e8400-e29b-41d4-a716-446655440000', 'github', 'pull_request.opened', 
 '{"pr_number": 234, "title": "Refactor authentication system", "author": "dev@company.com", "repository": "company/main-app", "files_changed": 12}', 
 true, NOW() - INTERVAL '4 hours', 0),
('550e8400-e29b-41d4-a716-446655440000', 'slack', 'message.channels', 
 '{"channel": "#dev-team", "user": "sarah", "text": "@john can you help with the database migration issue?", "timestamp": "1705329000"}', 
 true, NOW() - INTERVAL '1 hour', 0),
('550e8400-e29b-41d4-a716-446655440001', 'gmail', 'email.received', 
 '{"message_id": "email_54321", "thread_id": "thread_ghi789", "subject": "Design Feedback - Mobile App V2", "sender": "client@xyzcorp.com", "labels": ["INBOX", "CLIENT"]}', 
 true, NOW() - INTERVAL '6 hours', 0)
ON CONFLICT DO NOTHING;

-- Insert sample users
INSERT INTO users (phone_number, name) VALUES 
  ('+31612345678', 'John Doe'),
  ('+31687654321', 'Jane Smith'),
  ('+31611223344', 'Bob Johnson')
ON CONFLICT (phone_number) DO NOTHING;

-- Insert sample appointments
INSERT INTO appointments (user_id, date, time, note) 
SELECT 
  u.id,
  CURRENT_DATE + INTERVAL '7 days',
  '10:00:00',
  'Regular checkup and cleaning'
FROM users u WHERE u.phone_number = '+31612345678'
ON CONFLICT DO NOTHING;

INSERT INTO appointments (user_id, date, time, note) 
SELECT 
  u.id,
  CURRENT_DATE + INTERVAL '14 days',
  '14:30:00',
  'Follow-up appointment for filling'
FROM users u WHERE u.phone_number = '+31687654321'
ON CONFLICT DO NOTHING;

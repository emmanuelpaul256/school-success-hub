# Database Schema - PostgreSQL

## Tables Overview

### users (Staff Members)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('staff', 'manager', 'admin') DEFAULT 'staff',
  avatar_url VARCHAR(500),
  timezone VARCHAR(50) DEFAULT 'UTC',
  email_notifications BOOLEAN DEFAULT true,
  two_factor_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### leads
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  role VARCHAR(100),
  country VARCHAR(100),
  student_count INTEGER NOT NULL,
  pain_point TEXT,
  status ENUM('new', 'contacted', 'demo_scheduled', 'negotiation', 'converted', 'lost') DEFAULT 'new',
  assigned_staff_id UUID REFERENCES users(id),
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned_staff ON leads(assigned_staff_id);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_email ON leads(email);
```

### lead_notes
```sql
CREATE TABLE lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lead_notes_lead_id ON lead_notes(lead_id);
```

### demos
```sql
CREATE TABLE demos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  school_name VARCHAR(255) NOT NULL,
  scheduled_at TIMESTAMP NOT NULL,
  meeting_link VARCHAR(500),
  assigned_staff_id UUID REFERENCES users(id),
  status ENUM('scheduled', 'completed', 'missed', 'cancelled') DEFAULT 'scheduled',
  demo_type ENUM('online', 'physical', 'hybrid') DEFAULT 'online',
  location VARCHAR(255),
  address VARCHAR(500),
  notes TEXT,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_demos_lead_id ON demos(lead_id);
CREATE INDEX idx_demos_status ON demos(status);
CREATE INDEX idx_demos_scheduled_at ON demos(scheduled_at);
CREATE INDEX idx_demos_assigned_staff ON demos(assigned_staff_id);
```

### demo_attendees
```sql
CREATE TABLE demo_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  demo_id UUID NOT NULL REFERENCES demos(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  role VARCHAR(100),
  status ENUM('invited', 'accepted', 'declined', 'attended') DEFAULT 'invited',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_demo_attendees_demo_id ON demo_attendees(demo_id);
```

### schools
```sql
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  plan_type ENUM('starter', 'professional', 'enterprise') DEFAULT 'starter',
  subscription_status ENUM('active', 'trial', 'expired', 'cancelled') DEFAULT 'trial',
  onboarding_status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
  onboarding_progress INTEGER DEFAULT 0,
  student_count INTEGER NOT NULL,
  teacher_count INTEGER NOT NULL,
  assigned_staff_id UUID REFERENCES users(id),
  subscription_end_date TIMESTAMP,
  support_tier VARCHAR(50) DEFAULT 'standard',
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  address VARCHAR(500),
  website VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_schools_status ON schools(subscription_status);
CREATE INDEX idx_schools_plan_type ON schools(plan_type);
CREATE INDEX idx_schools_assigned_staff ON schools(assigned_staff_id);
```

### school_onboarding
```sql
CREATE TABLE school_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL UNIQUE REFERENCES schools(id) ON DELETE CASCADE,
  initial_setup BOOLEAN DEFAULT false,
  staff_training BOOLEAN DEFAULT false,
  data_migration BOOLEAN DEFAULT false,
  go_live BOOLEAN DEFAULT false,
  start_date TIMESTAMP,
  estimated_completion TIMESTAMP,
  actual_completion TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_school_onboarding_school_id ON school_onboarding(school_id);
```

### support_tickets
```sql
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number VARCHAR(20) NOT NULL UNIQUE,
  school_id UUID NOT NULL REFERENCES schools(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  category VARCHAR(100),
  assigned_to_id UUID REFERENCES users(id),
  created_by_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  closed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_support_tickets_school_id ON support_tickets(school_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_assigned_to ON support_tickets(assigned_to_id);
```

### activities
```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  staff_name VARCHAR(255),
  staff_id UUID REFERENCES users(id),
  entity_id VARCHAR(100),
  entity_type VARCHAR(50),
  metadata JSONB,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activities_type ON activities(type);
CREATE INDEX idx_activities_timestamp ON activities(timestamp);
CREATE INDEX idx_activities_staff_id ON activities(staff_id);
```

### notifications
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  link VARCHAR(500),
  read BOOLEAN DEFAULT false,
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
```

### lead_timeline
```sql
CREATE TABLE lead_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  description TEXT,
  staff_id UUID REFERENCES users(id),
  staff_name VARCHAR(255),
  details JSONB,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lead_timeline_lead_id ON lead_timeline(lead_id);
CREATE INDEX idx_lead_timeline_timestamp ON lead_timeline(timestamp);
```

### audit_log
```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id VARCHAR(100),
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);
```

## Sample Data Insertion

### Insert Sample Users
```sql
INSERT INTO users (name, email, password_hash, role) VALUES
('Sarah Johnson', 'sarah@educonnect.com', '$2b$10$...', 'manager'),
('Michael Chen', 'michael@educonnect.com', '$2b$10$...', 'staff'),
('Emily Rodriguez', 'emily@educonnect.com', '$2b$10$...', 'staff'),
('David Kim', 'david@educonnect.com', '$2b$10$...', 'staff');
```

### Insert Sample Leads
```sql
INSERT INTO leads (school_name, contact_person, email, phone, role, country, student_count, pain_point, status, assigned_staff_id)
VALUES (
  'Springfield Elementary',
  'Principal Anderson',
  'anderson@springfield.edu',
  '+1 555-0101',
  'Principal',
  'United States',
  450,
  'Need better student progress tracking and parent communication tools',
  'demo_scheduled',
  (SELECT id FROM users WHERE email = 'sarah@educonnect.com' LIMIT 1)
);
```

### Insert Sample Schools
```sql
INSERT INTO schools (name, plan_type, subscription_status, student_count, teacher_count, assigned_staff_id)
VALUES (
  'Tech Prep Academy',
  'professional',
  'active',
  600,
  45,
  (SELECT id FROM users WHERE email = 'sarah@educonnect.com' LIMIT 1)
);
```

## Relationships Diagram

```
users
├── leads (assigned_staff_id)
├── demos (assigned_staff_id)
├── schools (assigned_staff_id)
├── support_tickets (assigned_to_id, created_by_id)
├── activities (staff_id)
├── notifications (user_id)
└── audit_log (user_id)

leads
├── demos (lead_id)
└── lead_notes (lead_id)
    └── lead_timeline (lead_id)

demos
└── demo_attendees (demo_id)

schools
├── support_tickets (school_id)
└── school_onboarding (school_id)
```

## Constraints & Rules

1. Foreign Keys: All foreign keys have ON DELETE CASCADE where applicable
2. Unique Constraints: Email fields are unique (with soft deletes considered)
3. Check Constraints: Student/teacher counts must be >= 0
4. Defaults: Timestamps default to CURRENT_TIMESTAMP
5. Soft Deletes: deleted_at field for logical deletion

## Migration Strategy

1. Create tables in order (dependencies first)
2. Create indexes after tables
3. Add constraints
4. Insert seed data
5. Verify integrity

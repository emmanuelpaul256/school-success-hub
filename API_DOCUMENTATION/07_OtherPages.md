# Additional Pages API Documentation

## Activity Page API

### Get Activities
**Endpoint:** `GET /api/activities`

**Query Parameters:**
- `page` (optional): page number
- `limit` (optional): items per page
- `type` (optional): filter by type
- `dateFrom` (optional): ISO date string
- `dateTo` (optional): ISO date string

**Response:**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "1",
        "type": "lead_added",
        "description": "New lead: Riverside International School",
        "staffName": "System",
        "timestamp": "2026-02-05T09:00:00Z",
        "entityId": "3",
        "entityType": "lead",
        "icon": "plus",
        "color": "info"
      },
      {
        "id": "2",
        "type": "demo_scheduled",
        "description": "Demo scheduled with Springfield Elementary",
        "staffName": "Sarah Johnson",
        "timestamp": "2026-02-04T14:30:00Z",
        "entityId": "1",
        "entityType": "demo",
        "icon": "calendar",
        "color": "success"
      }
    ],
    "pagination": {
      "page": 0,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

## Analytics Page API

### Get Analytics Data
**Endpoint:** `GET /api/analytics`

**Query Parameters:**
- `dateFrom` (optional): ISO date string
- `dateTo` (optional): ISO date string
- `metric` (optional): specific metric

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalLeads": 42,
      "newLeadsThisMonth": 8,
      "conversion": {
        "rate": 28,
        "count": 12,
        "trend": -5
      },
      "revenue": {
        "annual": 125000,
        "monthly": 10416,
        "trend": 12
      }
    },
    "leadsByStatus": [
      {
        "status": "new",
        "count": 8
      }
    ],
    "leadsByCountry": [
      {
        "country": "United States",
        "count": 32
      }
    ],
    "topPerformers": [
      {
        "staffId": "1",
        "staffName": "Sarah Johnson",
        "leadsConverted": 5,
        "conversionRate": 45
      }
    ],
    "trendData": {
      "labels": ["Jan", "Feb", "Mar"],
      "leads": [30, 35, 42],
      "conversions": [8, 9, 12],
      "revenue": [9000, 9500, 10416]
    }
  }
}
```

## Notifications Page API

### Get Notifications
**Endpoint:** `GET /api/notifications`

**Query Parameters:**
- `unread` (optional): true/false
- `priority` (optional): low, medium, high
- `limit` (optional): items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "1",
        "type": "new_lead",
        "title": "New Lead Added",
        "description": "Springfield Elementary has been added as a new lead",
        "timestamp": "2026-02-05T09:00:00Z",
        "read": false,
        "priority": "medium",
        "link": "/leads/1"
      },
      {
        "id": "2",
        "type": "demo_reminder",
        "title": "Demo Reminder",
        "description": "Demo with Springfield Elementary in 1 hour",
        "timestamp": "2026-02-19T13:00:00Z",
        "read": false,
        "priority": "high",
        "link": "/demos/1"
      }
    ],
    "unreadCount": 5
  }
}
```

### Mark Notification as Read
**Endpoint:** `PATCH /api/notifications/:id/read`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "read": true
  }
}
```

## Settings Page API

### Get User Settings
**Endpoint:** `GET /api/settings/profile`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Sarah Johnson",
    "email": "sarah@educonnect.com",
    "role": "manager",
    "avatar": null,
    "timezone": "America/New_York",
    "emailNotifications": true,
    "twoFactorEnabled": false
  }
}
```

### Update User Settings
**Endpoint:** `PUT /api/settings/profile`

**Request Body:**
```json
{
  "name": "Sarah Johnson",
  "timezone": "America/Chicago",
  "emailNotifications": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Sarah Johnson",
    "timezone": "America/Chicago",
    "emailNotifications": false
  }
}
```

### Change Password
**Endpoint:** `POST /api/settings/change-password`

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword",
  "confirmPassword": "newpassword"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

## School Details Page API

### Get School Details
**Endpoint:** `GET /api/schools/:id/details`

**Response:**
```json
{
  "success": true,
  "data": {
    "school": {
      "id": "1",
      "name": "Tech Prep Academy",
      "planType": "professional",
      "subscriptionStatus": "active",
      "onboardingStatus": "in_progress",
      "onboardingProgress": 60
    },
    "onboardingSteps": {
      "initialSetup": true,
      "staffTraining": true,
      "dataMigration": false,
      "goLive": false
    },
    "stats": {
      "totalUsers": 645,
      "activeUsers": 580
    }
  }
}
```

### Update Onboarding Progress
**Endpoint:** `PATCH /api/schools/:id/onboarding`

**Request Body:**
```json
{
  "completedSteps": {
    "initialSetup": true,
    "staffTraining": true,
    "dataMigration": true,
    "goLive": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "onboardingProgress": 75,
    "completedSteps": {
      "initialSetup": true,
      "staffTraining": true,
      "dataMigration": true,
      "goLive": false
    }
  }
}
```

## School Support Page API

### Get Support Tickets
**Endpoint:** `GET /api/schools/:id/support`

**Query Parameters:**
- `status` (optional): open, closed, in_progress
- `limit` (optional): items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "tickets": [
      {
        "id": "TK-001",
        "title": "Staff dashboard not loading",
        "description": "Teachers unable to access the staff dashboard",
        "status": "resolved",
        "priority": "high",
        "createdAt": "2026-01-15T00:00:00Z",
        "resolvedAt": "2026-01-16T00:00:00Z",
        "assignedTo": "Sarah Johnson",
        "category": "technical"
      }
    ],
    "stats": {
      "total": 3,
      "resolved": 2,
      "active": 1,
      "avgResolutionTime": "1.5 days"
    }
  }
}
```

### Create Support Ticket
**Endpoint:** `POST /api/schools/:id/support/tickets`

**Request Body:**
```json
{
  "title": "New support issue",
  "description": "Description of the issue",
  "priority": "high",
  "category": "technical"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "TK-009",
    "title": "New support issue",
    "status": "open",
    "createdAt": "2026-02-19T12:00:00Z"
  }
}
```

## Edit Lead Page API

### Get Lead for Editing
**Endpoint:** `GET /api/leads/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "schoolName": "Springfield Elementary",
    "contactPerson": "Principal Anderson",
    "email": "anderson@springfield.edu",
    "phone": "+1 555-0101",
    "role": "Principal",
    "country": "United States",
    "studentCount": 450,
    "painPoint": "Need better student progress tracking",
    "assignedStaffId": "1"
  }
}
```

### Update Lead
**Endpoint:** `PUT /api/leads/:id`

**Request Body:**
```json
{
  "schoolName": "Springfield Elementary",
  "contactPerson": "Principal Anderson",
  "email": "anderson@springfield.edu",
  "phone": "+1 555-0101",
  "role": "Principal",
  "country": "United States",
  "studentCount": 500,
  "painPoint": "Updated pain point",
  "assignedStaffId": "2"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "schoolName": "Springfield Elementary",
    "studentCount": 500,
    "lastActivity": "2026-02-19T13:00:00Z"
  }
}
```

## Login Page API

### Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "sarah@educonnect.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1",
      "name": "Sarah Johnson",
      "email": "sarah@educonnect.com",
      "role": "manager"
    }
  }
}
```

### Logout
**Endpoint:** `POST /api/auth/logout`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Get Current User
**Endpoint:** `GET /api/auth/me`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Sarah Johnson",
    "email": "sarah@educonnect.com",
    "role": "manager"
  }
}
```

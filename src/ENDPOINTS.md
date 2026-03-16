# Leads Module API Endpoints Documentation

This document provides comprehensive documentation for all endpoints in the Leads module (`/leads` namespace).

---

## Table of Contents

1. [Lead CRUD](#lead-crud)
2. [Demo Schedule CRUD](#demo-schedule-crud)
3. [Notification CRUD](#notification-crud)
4. [Onboarding CRUD](#onboarding-crud)
5. [Logs CRUD](#logs-crud)
6. [Dashboard](#dashboard)
7. [Activities & Analytics](#activities--analytics)

---

## Lead CRUD

### 1. List All Leads

**Endpoint:** `GET /leads/`

**Permission:** Requires authentication. Only `sale_manager`, `sales_assistant`, or superuser can access.

**Query Parameters:**
- `page` (integer, default: 0) - Page number for pagination
- `limit` (integer, default: 10, max: 100) - Number of leads per page
- `search` (string) - Search by school name, firstname, secondname, or email
- `status` (string) - Filter by status (comma-separated list)
- `staffId` (UUID) - Filter leads assigned to specific staff
- `sortBy` (string, default: 'lastActivity') - Sort field: `schoolName`, `status`, `createdAt`, `lastActivity`
- `sortOrder` (string, default: 'desc') - Sort order: `asc` or `desc`

**Response:**

```json
{
  "success": true,
  "data": {
    "leads": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "schoolName": "ABC High School",
        "contactPerson": "John Doe",
        "email": "john@school.com",
        "phone": "1234567890",
        "status": "new",
        "assignedStaffId": "660e8400-e29b-41d4-a716-446655440000",
        "assignedStaff": "Jane Smith",
        "country": "United States",
        "studentCount": null,
        "lastActivity": "2026-02-20T10:30:00Z",
        "createdAt": "2026-02-19T14:20:00Z",
        "updatedAt": "2026-02-20T10:30:00Z",
        "frontend_urls": {
          "detail": "/leads/550e8400-e29b-41d4-a716-446655440000",
          "edit": "/leads/550e8400-e29b-41d4-a716-446655440000/edit"
        }
      }
    ],
    "pagination": {
      "page": 0,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

---

### 2. Create New Lead

**Endpoint:** `POST /leads/`

**Permission:** `AllowAny` - Anyone can create leads

**Request Body:**

```json
{
  "firstname": "John",
  "secondname": "Doe",
  "phonenumber": "1234567890",
  "workemail": "john@school.com",
  "jobtitle": "Principal",
  "institution": "education",
  "categories": "education",
  "institution_name": "ABC High School",
  "size_of_institution": "500-1000",
  "country": "United States",
  "city": "New York",
  "question_on_preference": "website"
}
```

**Response:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "firstname": "John",
  "secondname": "Doe",
  "phonenumber": "1234567890",
  "workemail": "john@school.com",
  "jobtitle": "Principal",
  "institution": "education",
  "categories": "education",
  "institution_name": "ABC High School",
  "size_of_institution": "500-1000",
  "country": "United States",
  "city": "New York",
  "question_on_preference": "website",
  "assigned_staff": null,
  "assigned_staff_name": null,
  "status": "new",
  "created_at": "2026-02-20T10:30:00Z",
  "updated_at": "2026-02-20T10:30:00Z",
  "last_activity": "2026-02-20T10:30:00Z"
}
```

**Side Effects:**
- Welcome email sent to lead
- Notification created for all sales managers
- Lead creation log created

---

### 3. Export Leads to CSV

**Endpoint:** `GET /leads/export/csv/`

**Permission:** Requires authentication

**Query Parameters:**
- `search` (string) - Filter leads
- `status` (string) - Filter by status
- `staffId` (UUID) - Filter by assigned staff

**Response:** CSV file with columns:
- School Name
- Contact Person
- Email
- Phone
- Status
- Assigned Staff
- Country
- Student Count
- Last Activity

---

### 4. Get Lead Details

**Endpoint:** `GET /leads/{lead_id}/`

**Permission:** Requires authentication. User must be sales manager, superuser, or assigned staff.

**Path Parameters:**
- `lead_id` (UUID) - Lead identifier

**Response:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "firstname": "John",
  "secondname": "Doe",
  "phonenumber": "1234567890",
  "workemail": "john@school.com",
  "jobtitle": "Principal",
  "institution": "education",
  "categories": "education",
  "institution_name": "ABC High School",
  "size_of_institution": "500-1000",
  "country": "United States",
  "city": "New York",
  "question_on_preference": "website",
  "assigned_staff": "660e8400-e29b-41d4-a716-446655440000",
  "assigned_staff_name": "Jane Smith",
  "status": "contacted",
  "created_at": "2026-02-19T14:20:00Z",
  "updated_at": "2026-02-20T10:30:00Z",
  "last_activity": "2026-02-20T10:30:00Z",
  "frontend_urls": {
    "detail": "/leads/550e8400-e29b-41d4-a716-446655440000",
    "edit": "/leads/550e8400-e29b-41d4-a716-446655440000/edit"
  }
}
```

---

### 5. Update Lead

**Endpoint:** `PUT /leads/{lead_id}/`

**Permission:** Requires authentication. User must be sales manager, superuser, or assigned staff.

**Request Body:** (partial update)

```json
{
  "status": "demo_scheduled",
  "assigned_staff": "660e8400-e29b-41d4-a716-446655440000"
}
```

**Response:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "firstname": "John",
  "secondname": "Doe",
  "phonenumber": "1234567890",
  "workemail": "john@school.com",
  "jobtitle": "Principal",
  "institution": "education",
  "categories": "education",
  "institution_name": "ABC High School",
  "size_of_institution": "500-1000",
  "country": "United States",
  "city": "New York",
  "question_on_preference": "website",
  "assigned_staff": "660e8400-e29b-41d4-a716-446655440000",
  "assigned_staff_name": "Jane Smith",
  "status": "demo_scheduled",
  "created_at": "2026-02-19T14:20:00Z",
  "updated_at": "2026-02-20T10:30:00Z",
  "last_activity": "2026-02-20T10:30:00Z"
}
```

**Side Effects:**
- Status change logged if status changed

---

### 6. Delete Lead (Soft Delete)

**Endpoint:** `DELETE /leads/{lead_id}/`

**Permission:** Requires authentication. User must be sales manager, superuser, or assigned staff.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "message": "Lead successfully deleted",
    "deletedAt": "2026-02-20T10:30:00Z"
  }
}
```

---

### 7. Assign Lead to Staff

**Endpoint:** `POST /leads/{lead_id}/assign/`

**Permission:** Requires `sale_manager`, `sales_assistant`, or superuser

**Request Body:**

```json
{
  "assigned_user_id": "660e8400-e29b-41d4-a716-446655440000"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Lead assigned successfully"
  }
}
```

**Side Effects:**
- Lead status changed to `contacted`
- Lead assignment log created
- Notification sent to assigned staff
- Assignment email sent to assigned staff

---

### 8. Convert Lead to School

**Endpoint:** `POST /leads/{lead_id}/convert/`

**Permission:** Requires `sale_manager`, `sales_assistant`, or superuser

**Precondition:** Lead status must be `negotiated`

**Request Body:** (empty)

```json
{}
```

**Response:**

```json
{
  "success": true,
  "message": "Lead converted to school successfully",
  "school": {
    "id": 1,
    "name": "ABC High School",
    "school_email": "john@school.com",
    "max_students": 100,
    "is_active": false,
    "admin_user": "660e8400-e29b-41d4-a716-446655440000",
    "created_at": "2026-02-20T10:30:00Z",
    "updated_at": "2026-02-20T10:30:00Z"
  },
  "frontend_urls": {
    "detail": "/schools/1",
    "manage": "/schools/1/manage"
  },
  "admin_credentials": {
    "username": "jdoe@school.com",
    "email": "john@school.com",
    "temporary_password": "ABC123XYZ789!"
  }
}
```

**Side Effects:**
- School created
- Admin user created with temporary password
- Plan subscription created (basic plan)
- Onboarding record created
- Lead status updated to `converted`
- Lead conversion log created
- Conversion email sent to admin user
- Onboarding email sent to admin user

---

### 9. Update Lead Status

**Endpoint:** `PATCH /leads/{lead_id}/status/`

**Permission:** Requires authentication

**Request Body:**

```json
{
  "status": "lost",
  "reason": "Budget constraints"
}
```

**Valid Status Values:** `new`, `contacted`, `demo_scheduled`, `negotiated`, `converted`, `lost`

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "lost",
    "previousStatus": "contacted",
    "changedAt": "2026-02-20T10:30:00Z",
    "changedBy": "Jane Smith",
    "message": "Status successfully updated from contacted to lost"
  }
}
```

**Side Effects:**
- Status change logged

---

### 10. Add Note to Lead

**Endpoint:** `POST /leads/{lead_id}/notes/`

**Permission:** Requires authentication

**Request Body:**

```json
{
  "content": "Lead is interested but needs pricing negotiation",
  "type": "follow_up"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "leadId": "550e8400-e29b-41d4-a716-446655440000",
    "content": "Lead is interested but needs pricing negotiation",
    "type": "follow_up",
    "author": "Jane Smith",
    "createdAt": "2026-02-20T10:30:00Z"
  }
}
```

---

## Demo Schedule CRUD

### 1. List All Demo Schedules

**Endpoint:** `GET /demo-schedules/`

**Alternative:** `GET /demos/`

**Permission:** Requires authentication

**Response:**

```json
[
  {
    "id": 1,
    "lead": "550e8400-e29b-41d4-a716-446655440000",
    "lead_name": "ABC High School",
    "assigned_staff": "660e8400-e29b-41d4-a716-446655440000",
    "assigned_staff_name": "Jane Smith",
    "date": "2026-03-15",
    "time": "10:00:00",
    "meeting_link": "https://zoom.us/meeting/123456",
    "place": "Virtual",
    "notes": "Discuss pricing and features",
    "demo_type": "online",
    "demo_status": "scheduled",
    "created_at": "2026-02-20T10:30:00Z",
    "updated_at": "2026-02-20T10:30:00Z",
    "scheduledAt": "2026-03-15T10:00:00Z",
    "frontend_urls": {
      "detail": "/demos/1",
      "edit": "/demos/1/edit"
    }
  }
]
```

---

### 2. Create Demo Schedule

**Endpoint:** `POST /demo-schedules/`

**Alternative:** `POST /demos/`

**Permission:** Requires authentication. User must be assigned staff, sales manager, or superuser.

**Request Body:**

```json
{
  "lead": "550e8400-e29b-41d4-a716-446655440000",
  "assigned_staff": "660e8400-e29b-41d4-a716-446655440000",
  "date": "2026-03-15",
  "time": "10:00:00",
  "meeting_link": "https://zoom.us/meeting/123456",
  "place": "Virtual",
  "notes": "Discuss pricing and features",
  "demo_type": "online",
  "demo_status": "scheduled"
}
```

**Response:**

```json
{
  "id": 1,
  "lead": "550e8400-e29b-41d4-a716-446655440000",
  "lead_name": "ABC High School",
  "assigned_staff": "660e8400-e29b-41d4-a716-446655440000",
  "assigned_staff_name": "Jane Smith",
  "date": "2026-03-15",
  "time": "10:00:00",
  "meeting_link": "https://zoom.us/meeting/123456",
  "place": "Virtual",
  "notes": "Discuss pricing and features",
  "demo_type": "online",
  "demo_status": "scheduled",
  "created_at": "2026-02-20T10:30:00Z",
  "updated_at": "2026-02-20T10:30:00Z",
  "scheduledAt": "2026-03-15T10:00:00Z"
}
```

**Side Effects:**
- Lead status updated to `demo_scheduled`
- Demo schedule log created
- Demo email sent to lead

---

### 3. Get Demo Schedule Details

**Endpoint:** `GET /demo-schedules/{schedule_id}/`

**Alternative:** `GET /demos/{schedule_id}/`

**Permission:** Requires authentication. User must have access to the demo.

**Response:**

```json
{
  "id": 1,
  "lead": "550e8400-e29b-41d4-a716-446655440000",
  "lead_name": "ABC High School",
  "assigned_staff": "660e8400-e29b-41d4-a716-446655440000",
  "assigned_staff_name": "Jane Smith",
  "date": "2026-03-15",
  "time": "10:00:00",
  "meeting_link": "https://zoom.us/meeting/123456",
  "place": "Virtual",
  "notes": "Discuss pricing and features",
  "demo_type": "online",
  "demo_status": "scheduled",
  "created_at": "2026-02-20T10:30:00Z",
  "updated_at": "2026-02-20T10:30:00Z",
  "scheduledAt": "2026-03-15T10:00:00Z",
  "frontend_urls": {
    "detail": "/demos/1",
    "edit": "/demos/1/edit"
  }
}
```

---

### 4. Update Demo Schedule

**Endpoint:** `PUT /demo-schedules/{schedule_id}/`

**Alternative:** `PUT /demos/{schedule_id}/`

**Permission:** Requires authentication. User must have access to the demo.

**Request Body:** (partial update)

```json
{
  "date": "2026-03-16",
  "time": "14:00:00",
  "notes": "Rescheduled due to conflict"
}
```

**Response:**

```json
{
  "id": 1,
  "lead": "550e8400-e29b-41d4-a716-446655440000",
  "lead_name": "ABC High School",
  "assigned_staff": "660e8400-e29b-41d4-a716-446655440000",
  "assigned_staff_name": "Jane Smith",
  "date": "2026-03-16",
  "time": "14:00:00",
  "meeting_link": "https://zoom.us/meeting/123456",
  "place": "Virtual",
  "notes": "Rescheduled due to conflict",
  "demo_type": "online",
  "demo_status": "scheduled",
  "created_at": "2026-02-20T10:30:00Z",
  "updated_at": "2026-02-20T10:30:00Z",
  "scheduledAt": "2026-03-16T14:00:00Z"
}
```

---

### 5. Delete Demo Schedule

**Endpoint:** `DELETE /demo-schedules/{schedule_id}/`

**Alternative:** `DELETE /demos/{schedule_id}/`

**Permission:** Requires authentication. User must have access to the demo.

**Response:**

```json
{
  "success": true,
  "message": "Demo cancelled successfully"
}
```

**Side Effects:**
- Demo status set to `cancelled`

---

### 6. Update Demo Status

**Endpoint:** `PATCH /demos/{schedule_id}/status/`

**Permission:** Requires `sale_manager`, `sales_assistant`, or superuser

**Request Body:**

```json
{
  "status": "completed",
  "feedback": "Lead showed great interest, ready for negotiation phase"
}
```

**Valid Status Values:** `scheduled`, `completed`, `missed`, `cancelled`

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "completed",
    "updatedAt": "2026-02-20T10:30:00Z"
  }
}
```

**Side Effects:**
- Feedback logged if provided

---

### 7. Get Demos Calendar View

**Endpoint:** `GET /demos/calendar/`

**Permission:** Requires authentication

**Query Parameters:**
- `year` (integer, default: current year) - Year to view
- `month` (integer, default: current month) - Month to view (1-12)
- `staffId` (UUID, optional) - Filter by staff member

**Response:**

```json
{
  "success": true,
  "data": {
    "year": 2026,
    "month": 3,
    "days": [
      {
        "date": "2026-03-01",
        "dayOfWeek": "Sunday",
        "demos": [
          {
            "id": 1,
            "time": "10:00",
            "schoolName": "ABC High School",
            "status": "scheduled",
            "assignedStaff": "Jane Smith"
          }
        ]
      },
      {
        "date": "2026-03-02",
        "dayOfWeek": "Monday",
        "demos": []
      }
    ]
  }
}
```

---

### 8. Get Upcoming Demos

**Endpoint:** `GET /demos/upcoming/`

**Permission:** Requires authentication

**Query Parameters:**
- `days` (integer, default: 7) - Number of days to look ahead
- `staffId` (UUID, optional) - Filter by staff member

**Response:**

```json
{
  "success": true,
  "data": {
    "upcoming": [
      {
        "id": 1,
        "leadId": "550e8400-e29b-41d4-a716-446655440000",
        "schoolName": "ABC High School",
        "scheduledAt": "2026-03-15T10:00:00Z",
        "meetingLink": "https://zoom.us/meeting/123456",
        "assignedStaff": "Jane Smith",
        "assignedStaffId": "660e8400-e29b-41d4-a716-446655440000",
        "status": "scheduled",
        "daysUntil": 23,
        "isToday": false
      }
    ],
    "total": 1
  }
}
```

---

### 9. Add Demo Attendees

**Endpoint:** `POST /demos/{schedule_id}/attendees/`

**Permission:** Requires authentication

**Request Body:**

```json
{
  "name": "John Principal",
  "email": "john@school.com",
  "role": "Principal"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "attendees": [
      {
        "id": "att-1708402200",
        "name": "John Principal",
        "email": "john@school.com",
        "role": "Principal",
        "status": "invited"
      }
    ]
  }
}
```

---

## Notification CRUD

### 1. List Notifications

**Endpoint:** `GET /notifications/`

**Permission:** Requires authentication (user-specific only)

**Query Parameters:**
- `unread` (boolean, default: false) - Filter for unread notifications only
- `priority` (string) - Filter by priority: `low`, `medium`, `high`
- `limit` (integer, default: 50) - Number of notifications to retrieve

**Response:**

```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": 1,
        "user": "550e8400-e29b-41d4-a716-446655440000",
        "user_name": "Jane Smith",
        "title": "Lead Assigned: ABC High School",
        "body": "You have been assigned a lead: John Doe from ABC High School. Please schedule a demo.",
        "is_read": false,
        "created_at": "2026-02-20T10:30:00Z"
      }
    ],
    "unreadCount": 3
  }
}
```

---

### 2. Mark Notification as Read

**Endpoint:** `PATCH /notifications/{notification_id}/read/`

**Permission:** Requires authentication (own notifications only)

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "read": true
  }
}
```

---

## Onboarding CRUD

### 1. List Onboardings

**Endpoint:** `GET /onboardings/`

**Permission:** Requires authentication

**Response:**

```json
[
  {
    "id": 1,
    "school": 1,
    "school_name": "ABC High School",
    "onboarding_manager": "660e8400-e29b-41d4-a716-446655440000",
    "onboarding_manager_name": "Jane Smith",
    "startdate": "2026-02-20",
    "expected_go_live_date": "2026-03-22",
    "actual_go_live_date": null,
    "onboarding_type": "online",
    "percentage": 0,
    "status": "inprogress",
    "notes": "Initial training phase",
    "created_at": "2026-02-20T10:30:00Z",
    "updated_at": "2026-02-20T10:30:00Z",
    "frontend_urls": {
      "detail": "/onboardings/1",
      "manage": "/onboardings/1/manage"
    }
  }
]
```

---

### 2. Get Onboarding Details

**Endpoint:** `GET /onboardings/{onboarding_id}/`

**Permission:** Requires authentication. User must be onboarding manager, sales manager, or superuser.

**Response:**

```json
{
  "id": 1,
  "school": 1,
  "school_name": "ABC High School",
  "onboarding_manager": "660e8400-e29b-41d4-a716-446655440000",
  "onboarding_manager_name": "Jane Smith",
  "startdate": "2026-02-20",
  "expected_go_live_date": "2026-03-22",
  "actual_go_live_date": null,
  "onboarding_type": "online",
  "percentage": 0,
  "status": "inprogress",
  "notes": "Initial training phase",
  "created_at": "2026-02-20T10:30:00Z",
  "updated_at": "2026-02-20T10:30:00Z",
  "frontend_urls": {
    "detail": "/onboardings/1",
    "manage": "/onboardings/1/manage"
  }
}
```

---

### 3. Update Onboarding

**Endpoint:** `PUT /onboardings/{onboarding_id}/`

**Permission:** Requires authentication. User must be onboarding manager, sales manager, or superuser.

**Request Body:** (partial update)

```json
{
  "percentage": 50,
  "status": "inprogress",
  "notes": "Team training 50% complete"
}
```

**Response:**

```json
{
  "id": 1,
  "school": 1,
  "school_name": "ABC High School",
  "onboarding_manager": "660e8400-e29b-41d4-a716-446655440000",
  "onboarding_manager_name": "Jane Smith",
  "startdate": "2026-02-20",
  "expected_go_live_date": "2026-03-22",
  "actual_go_live_date": null,
  "onboarding_type": "online",
  "percentage": 50,
  "status": "inprogress",
  "notes": "Team training 50% complete",
  "created_at": "2026-02-20T10:30:00Z",
  "updated_at": "2026-02-20T10:30:00Z"
}
```

**Side Effects (if status changed to `completed`):**
- School marked as active (`is_active = true`)
- Onboarding completion email sent to school admin
- School live log created

**Side Effects (if status changed to `onhold`):**
- Onboarding on-hold email sent to school admin

---

## Logs CRUD

### 1. List All Logs

**Endpoint:** `GET /logs/`

**Permission:** Requires authentication

**Response:**

```json
[
  {
    "id": 1,
    "lead": "550e8400-e29b-41d4-a716-446655440000",
    "lead_institution": "ABC High School",
    "user": "660e8400-e29b-41d4-a716-446655440000",
    "user_name": "Jane Smith",
    "log_type": "lead_created",
    "description": "Lead created for John Doe from ABC High School",
    "metadata": null,
    "created_at": "2026-02-20T10:30:00Z"
  },
  {
    "id": 2,
    "lead": "550e8400-e29b-41d4-a716-446655440000",
    "lead_institution": "ABC High School",
    "user": "660e8400-e29b-41d4-a716-446655440000",
    "user_name": "Jane Smith",
    "log_type": "demo_scheduled",
    "description": "Demo scheduled for 2026-03-15 at 10:00:00",
    "metadata": null,
    "created_at": "2026-02-20T10:35:00Z"
  }
]
```

---

## Dashboard

### 1. Get Dashboard KPI Data

**Endpoint:** `GET /dashboard/kpi/`

**Permission:** Requires authentication

**Query Parameters:**
- `dateRange` (string, default: 'month') - Period to analyze: `today`, `week`, `month`, `year`

**Response:**

```json
{
  "success": true,
  "data": {
    "totalLeads": 150,
    "conversionRate": 18,
    "schoolsOnboarding": 5,
    "upcomingDemosToday": 3,
    "leadsTrend": 12,
    "conversionTrend": 5,
    "onboardingTrend": -2,
    "demosTrend": 8,
    "lastUpdated": "2026-02-20T10:30:00Z"
  }
}
```

---

### 2. Get Leads Status Breakdown

**Endpoint:** `GET /dashboard/leads-status/`

**Permission:** Requires authentication

**Response:**

```json
{
  "success": true,
  "data": {
    "chartData": [
      {
        "status": "new",
        "count": 45,
        "percentage": 30
      },
      {
        "status": "contacted",
        "count": 30,
        "percentage": 20
      },
      {
        "status": "demo_scheduled",
        "count": 35,
        "percentage": 23
      },
      {
        "status": "negotiated",
        "count": 25,
        "percentage": 17
      },
      {
        "status": "converted",
        "count": 15,
        "percentage": 10
      },
      {
        "status": "lost",
        "count": 0,
        "percentage": 0
      }
    ],
    "total": 150
  }
}
```

---

### 3. Get Upcoming Demos for Dashboard

**Endpoint:** `GET /dashboard/upcoming-demos/`

**Permission:** Requires authentication

**Query Parameters:**
- `days` (integer, default: 7) - Number of days to look ahead

**Response:**

```json
{
  "success": true,
  "data": {
    "demos": [
      {
        "id": "1",
        "leadId": "550e8400-e29b-41d4-a716-446655440000",
        "schoolName": "ABC High School",
        "scheduledAt": "2026-02-21T10:00:00Z",
        "meetingLink": "https://zoom.us/meeting/123456",
        "assignedStaff": "Jane Smith",
        "assignedStaffId": "660e8400-e29b-41d4-a716-446655440000",
        "status": "scheduled",
        "notes": "Virtual meeting via Zoom"
      }
    ],
    "total": 1
  }
}
```

---

### 4. Get Dashboard Activity

**Endpoint:** `GET /dashboard/activity/`

**Permission:** Requires authentication

**Query Parameters:**
- `limit` (integer, default: 10) - Number of activities to retrieve

**Response:**

```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "1",
        "type": "lead_created",
        "description": "Lead created for John Doe from ABC High School",
        "staffName": "Admin",
        "timestamp": "2026-02-20T10:30:00Z",
        "entityId": "550e8400-e29b-41d4-a716-446655440000",
        "entityType": "lead",
        "icon": "plus",
        "color": "info"
      },
      {
        "id": "2",
        "type": "demo_scheduled",
        "description": "Demo scheduled for 2026-03-15 at 10:00:00",
        "staffName": "Jane Smith",
        "timestamp": "2026-02-20T10:35:00Z",
        "entityId": "550e8400-e29b-41d4-a716-446655440000",
        "entityType": "lead",
        "icon": "calendar",
        "color": "success"
      }
    ],
    "total": 2
  }
}
```

---

## Activities & Analytics

### 1. List Activities

**Endpoint:** `GET /activities/`

**Permission:** Requires authentication

**Query Parameters:**
- `page` (integer, default: 0) - Page number
- `limit` (integer, default: 20, max: 100) - Items per page
- `type` (string) - Filter by activity type
- `dateFrom` (string, ISO format) - Start date filter
- `dateTo` (string, ISO format) - End date filter

**Response:**

```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "1",
        "type": "lead_created",
        "description": "Lead created for John Doe from ABC High School",
        "staffName": "Admin",
        "timestamp": "2026-02-20T10:30:00Z",
        "entityId": "550e8400-e29b-41d4-a716-446655440000",
        "entityType": "lead",
        "icon": "plus",
        "color": "info"
      }
    ],
    "pagination": {
      "page": 0,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

---

### 2. Get Analytics

**Endpoint:** `GET /analytics/`

**Permission:** Requires authentication

**Query Parameters:**
- `dateFrom` (string, ISO format) - Start date filter
- `dateTo` (string, ISO format) - End date filter

**Response:**

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalLeads": 150,
      "newLeadsThisMonth": 35,
      "conversion": {
        "rate": 18,
        "count": 27,
        "trend": 5
      },
      "revenue": {
        "annual": 0,
        "monthly": 0,
        "trend": 0
      }
    },
    "leadsByStatus": [
      {
        "status": "new",
        "count": 45
      },
      {
        "status": "contacted",
        "count": 30
      },
      {
        "status": "demo_scheduled",
        "count": 35
      },
      {
        "status": "negotiated",
        "count": 25
      },
      {
        "status": "converted",
        "count": 15
      }
    ],
    "leadsByCountry": [
      {
        "country": "United States",
        "count": 75
      },
      {
        "country": "Canada",
        "count": 25
      },
      {
        "country": "United Kingdom",
        "count": 20
      }
    ],
    "topPerformers": [
      {
        "staffId": "660e8400-e29b-41d4-a716-446655440000",
        "staffName": "Jane Smith",
        "leadsConverted": 8,
        "total": 45,
        "conversionRate": 18
      },
      {
        "staffId": "770e8400-e29b-41d4-a716-446655440000",
        "staffName": "John Manager",
        "leadsConverted": 6,
        "total": 40,
        "conversionRate": 15
      }
    ],
    "trendData": {
      "labels": [
        "Dec",
        "Jan",
        "Feb"
      ],
      "leads": [
        40,
        45,
        50
      ],
      "conversions": [
        6,
        7,
        8
      ],
      "revenue": [
        0,
        0,
        0
      ]
    }
  }
}
```

---

## Data Models & Enums

### Lead Model

**Status Choices:**
- `new` - New lead
- `contacted` - Lead contacted
- `demo_scheduled` - Demo scheduled
- `negotiated` - Under negotiation
- `converted` - Converted to school
- `lost` - Lost lead

**Category Choices:**
- `education` - Education
- `corporate` - Corporate
- `government` - Government
- `other` - Other

**Preference Choices:**
- `social_media` - Social Media
- `email` - Email
- `website` - Website
- `referral` - Referral
- `other` - Other

### Demo Schedule Model

**Demo Type Choices:**
- `online` - Online
- `physical` - Physical
- `hybrid` - Hybrid

**Demo Status Choices:**
- `scheduled` - Scheduled
- `completed` - Completed
- `missed` - Missed
- `cancelled` - Cancelled

### Onboarding Model

**Status Choices:**
- `inprogress` - In Progress
- `completed` - Completed
- `onhold` - On Hold

**Onboarding Type Choices:**
- `online` - Online
- `physical` - Physical
- `hybrid` - Hybrid

### Log Types

- `lead_created` - Lead Created
- `lead_assigned` - Lead Assigned
- `demo_scheduled` - Demo Scheduled
- `lead_converted` - Lead Converted
- `onboarding_started` - Onboarding Started
- `onboarding_completed` - Onboarding Completed
- `school_live` - School Live
- `note` - Note
- `status_change` - Status Change

### Notification Types

- `new_lead` - New Lead
- `demo_reminder` - Demo Reminder
- `lead_assigned` - Lead Assigned
- `status_changed` - Status Changed
- `demo_completed` - Demo Completed
- `onboarding_update` - Onboarding Update

### Priority Levels

- `low` - Low
- `medium` - Medium
- `high` - High

---

## Common Response Formats

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

### Validation Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": "Additional error details"
  }
}
```

### Pagination

All paginated responses use the following structure:

```json
{
  "pagination": {
    "page": 0,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

## Authentication & Permissions

### User Roles

- `superuser` - System administrator with all permissions
- `sale_manager` - Sales manager with lead and demo management permissions
- `sales_assistant` - Sales assistant with limited permissions
- `school_admin` - School administrator
- `enterprise` - Enterprise user

### Permission Rules

- **Lead CRUD**: Requires `sale_manager`, `sales_assistant`, or `superuser` for view; anyone can create
- **Demo CRUD**: Requires `sale_manager`, `sales_assistant`, or `superuser`; assigned staff can view their own demos
- **Notifications**: Users can only view and manage their own notifications
- **Dashboard**: Requires authentication
- **Analytics**: Requires authentication

---

## Rate Limiting & Caching

- Dashboard KPI: Cached for 5 minutes
- Dashboard leads status: Cached for 5 minutes
- Dashboard activity: Cached for 60 seconds
- Analytics: Cached for 5 minutes

---

## Common Status Codes

- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

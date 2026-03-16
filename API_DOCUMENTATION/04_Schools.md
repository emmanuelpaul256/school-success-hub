# Schools API Documentation

## Overview
The Schools page displays active customer accounts with subscription status, onboarding progress, and school information.

## Endpoints

### 1. Get All Schools
**Endpoint:** `GET /api/schools`

**Description:** Retrieve all schools with pagination and filtering

**Query Parameters:**
- `page` (optional): page number (default: 0)
- `limit` (optional): items per page (default: 50)
- `search` (optional): search by school name
- `planType` (optional): filter by plan (starter, professional, enterprise)
- `subscriptionStatus` (optional): filter by status (active, trial, expired, cancelled)
- `onboardingStatus` (optional): filter by onboarding status (not_started, in_progress, completed)
- `sortBy` (optional): sort field (default: createdAt)
- `sortOrder` (optional): asc | desc (default: desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "schools": [
      {
        "id": "1",
        "name": "Tech Prep Academy",
        "planType": "professional",
        "subscriptionStatus": "active",
        "onboardingStatus": "in_progress",
        "onboardingProgress": 60,
        "studentCount": 600,
        "teacherCount": 45,
        "createdAt": "2026-01-30T00:00:00Z",
        "assignedStaff": "Sarah Johnson",
        "assignedStaffId": "1",
        "subscriptionEndDate": "2026-03-30T00:00:00Z",
        "supportTier": "standard",
        "contactEmail": "admin@techprep.edu",
        "contactPhone": "+1 555-0105"
      },
      {
        "id": "2",
        "name": "Innovation Charter School",
        "planType": "enterprise",
        "subscriptionStatus": "active",
        "onboardingStatus": "completed",
        "onboardingProgress": 100,
        "studentCount": 1500,
        "teacherCount": 120,
        "createdAt": "2024-10-15T00:00:00Z",
        "assignedStaff": "Michael Chen",
        "assignedStaffId": "2",
        "subscriptionEndDate": "2026-10-15T00:00:00Z",
        "supportTier": "premium",
        "contactEmail": "admin@innovation.edu",
        "contactPhone": "+1 555-0200"
      }
    ],
    "pagination": {
      "page": 0,
      "limit": 50,
      "total": 4,
      "totalPages": 1
    },
    "summary": {
      "totalSchools": 4,
      "totalStudents": 3050,
      "activeSubscriptions": 4,
      "onboardingInProgress": 2
    }
  }
}
```

### 2. Get Single School
**Endpoint:** `GET /api/schools/:id`

**Description:** Retrieve detailed information about a specific school

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Tech Prep Academy",
    "planType": "professional",
    "subscriptionStatus": "active",
    "onboardingStatus": "in_progress",
    "onboardingProgress": 60,
    "studentCount": 600,
    "teacherCount": 45,
    "createdAt": "2026-01-30T00:00:00Z",
    "assignedStaff": "Sarah Johnson",
    "assignedStaffId": "1",
    "subscriptionEndDate": "2026-03-30T00:00:00Z",
    "supportTier": "standard",
    "contactEmail": "admin@techprep.edu",
    "contactPhone": "+1 555-0105",
    "address": "123 Education Lane, Tech City",
    "website": "https://techprep.edu",
    "onboardingDetails": {
      "initialSetup": true,
      "staffTraining": true,
      "dataMigration": false,
      "goLive": false,
      "startDate": "2026-01-30T00:00:00Z",
      "estimatedCompletion": "2026-03-15T00:00:00Z"
    },
    "features": [
      {
        "name": "Student Management",
        "enabled": true
      },
      {
        "name": "Parent Portal",
        "enabled": true
      },
      {
        "name": "Analytics Dashboard",
        "enabled": true
      }
    ],
    "billing": {
      "plan": "professional",
      "monthlyPrice": 299,
      "currency": "USD",
      "billingCycle": "monthly",
      "nextBillingDate": "2026-03-30T00:00:00Z",
      "autoRenew": true
    },
    "usage": {
      "storageUsed": "250GB",
      "storageLimit": "500GB",
      "apiCallsThisMonth": 45000,
      "apiCallsLimit": 100000
    }
  }
}
```

### 3. Create School
**Endpoint:** `POST /api/schools`

**Description:** Create a new school account

**Request Body:**
```json
{
  "name": "New School",
  "planType": "starter",
  "assignedStaffId": "1",
  "studentCount": 300,
  "teacherCount": 25,
  "contactEmail": "admin@newschool.edu",
  "contactPhone": "+1 555-1234",
  "address": "456 School Road",
  "website": "https://newschool.edu"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "5",
    "name": "New School",
    "planType": "starter",
    "subscriptionStatus": "trial",
    "onboardingStatus": "not_started",
    "onboardingProgress": 0,
    "studentCount": 300,
    "teacherCount": 25,
    "createdAt": "2026-02-19T12:00:00Z",
    "assignedStaff": "Sarah Johnson",
    "assignedStaffId": "1",
    "subscriptionEndDate": "2026-03-21T00:00:00Z",
    "supportTier": "standard",
    "contactEmail": "admin@newschool.edu",
    "contactPhone": "+1 555-1234"
  }
}
```

### 4. Update School
**Endpoint:** `PUT /api/schools/:id`

**Description:** Update school details

**Request Body:**
```json
{
  "assignedStaffId": "2",
  "studentCount": 650,
  "teacherCount": 50,
  "contactEmail": "newemail@techprep.edu"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Tech Prep Academy",
    "planType": "professional",
    "subscriptionStatus": "active",
    "onboardingStatus": "in_progress",
    "onboardingProgress": 60,
    "studentCount": 650,
    "teacherCount": 50,
    "createdAt": "2026-01-30T00:00:00Z",
    "assignedStaff": "Michael Chen",
    "assignedStaffId": "2",
    "subscriptionEndDate": "2026-03-30T00:00:00Z",
    "contactEmail": "newemail@techprep.edu"
  }
}
```

### 5. Update Onboarding Progress
**Endpoint:** `PATCH /api/schools/:id/onboarding`

**Description:** Update onboarding status and progress

**Request Body:**
```json
{
  "onboardingStatus": "in_progress",
  "completedSteps": {
    "initialSetup": true,
    "staffTraining": true,
    "dataMigration": false,
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
    "onboardingStatus": "in_progress",
    "onboardingProgress": 50,
    "completedSteps": {
      "initialSetup": true,
      "staffTraining": true,
      "dataMigration": false,
      "goLive": false
    },
    "updatedAt": "2026-02-19T13:00:00Z"
  }
}
```

### 6. Get School Details
**Endpoint:** `GET /api/schools/:id/details`

**Description:** Get comprehensive school details with related information

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
      "onboardingProgress": 60
    },
    "stats": {
      "totalUsers": 645,
      "activeUsers": 580,
      "loginThisMonth": 450,
      "supportTicketsOpen": 1,
      "supportTicketsResolved": 7
    },
    "recentActivity": [
      {
        "timestamp": "2026-02-19T10:30:00Z",
        "action": "Staff training session completed",
        "user": "John Doe"
      },
      {
        "timestamp": "2026-02-18T14:15:00Z",
        "action": "Data migration started",
        "user": "System"
      }
    ],
    "upcomingDemos": [],
    "relatedLeads": []
  }
}
```

### 7. Upgrade School Plan
**Endpoint:** `PATCH /api/schools/:id/upgrade`

**Description:** Upgrade school to a different plan

**Request Body:**
```json
{
  "newPlan": "enterprise",
  "effectiveDate": "2026-02-19T00:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Tech Prep Academy",
    "planType": "enterprise",
    "subscriptionStatus": "active",
    "monthlyPrice": 999,
    "upgradeEffectiveDate": "2026-02-19T00:00:00Z",
    "updatedAt": "2026-02-19T13:30:00Z"
  }
}
```

### 8. Get Support History
**Endpoint:** `GET /api/schools/:id/support`

**Description:** Get support tickets and history for a school

**Query Parameters:**
- `status` (optional): filter by status (open, closed, in_progress)
- `limit` (optional): number of records (default: 20)

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
        "assignedToId": "1",
        "category": "technical"
      },
      {
        "id": "TK-003",
        "title": "Data export for compliance",
        "description": "Need to export student records for audit",
        "status": "in_progress",
        "priority": "high",
        "createdAt": "2026-02-10T00:00:00Z",
        "resolvedAt": null,
        "assignedTo": "Sarah Johnson",
        "assignedToId": "1",
        "category": "data"
      }
    ],
    "summary": {
      "totalTickets": 3,
      "openTickets": 1,
      "resolvedTickets": 2,
      "averageResolutionTime": "1.5 days"
    }
  }
}
```

### 9. Cancel Subscription
**Endpoint:** `PATCH /api/schools/:id/cancel`

**Description:** Cancel school subscription

**Request Body:**
```json
{
  "reason": "Budget constraints",
  "effectiveDate": "2026-03-30T00:00:00Z",
  "feedbackComment": "Satisfied with service but couldn't fit in budget"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "subscriptionStatus": "cancelled",
    "cancellationEffectiveDate": "2026-03-30T00:00:00Z",
    "message": "Subscription will be cancelled on the specified date"
  }
}
```

## Plan Types
- `starter`: Entry-level plan (up to 200 students)
- `professional`: Mid-tier plan (up to 1000 students)
- `enterprise`: Full-featured plan (unlimited)

## Subscription Status
- `active`: Active subscription
- `trial`: Trial period (usually 30 days)
- `expired`: Subscription expired
- `cancelled`: Subscription cancelled

## Onboarding Status
- `not_started`: Haven't started onboarding
- `in_progress`: Currently onboarding
- `completed`: Onboarding complete

## Error Handling

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Student count cannot exceed plan limits",
    "details": {
      "field": "studentCount",
      "limit": 1000,
      "provided": 1500
    }
  }
}
```

## Authentication
- All endpoints require Bearer token authentication
- Header: `Authorization: Bearer <token>`

## Validation Rules
- `name`: Required, max 255 characters
- `planType`: Required, must be valid plan type
- `studentCount`: Positive integer, must not exceed plan limits
- `contactEmail`: Valid email format
- `contactPhone`: Valid phone format

# Demo Details API Documentation

## Overview
The Demo Details page displays complete information about a specific demo including meeting details, attendees, and actions.

## Endpoints

### 1. Get Demo Details
**Endpoint:** `GET /api/demos/:id`

**Description:** Retrieve complete demo information

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "leadId": "1",
    "schoolName": "Springfield Elementary",
    "scheduledAt": "2026-02-19T14:00:00Z",
    "meetingLink": "https://meet.google.com/abc-defg-hij",
    "assignedStaff": "Sarah Johnson",
    "assignedStaffId": "1",
    "status": "scheduled",
    "notes": "Focus on parent communication features",
    "demoType": "online",
    "createdAt": "2026-02-10T10:00:00Z",
    "updatedAt": "2026-02-10T10:00:00Z",
    "leadDetails": {
      "id": "1",
      "schoolName": "Springfield Elementary",
      "contactPerson": "Principal Anderson",
      "email": "anderson@springfield.edu",
      "phone": "+1 555-0101",
      "studentCount": 450
    },
    "assignedStaffDetails": {
      "id": "1",
      "name": "Sarah Johnson",
      "email": "sarah@educonnect.com",
      "phone": "+1 555-1000"
    },
    "attendees": [
      {
        "id": "att-1",
        "name": "Principal Anderson",
        "email": "anderson@springfield.edu",
        "role": "Principal",
        "status": "invited"
      },
      {
        "id": "att-2",
        "name": "Teacher Lead",
        "email": "teacher@springfield.edu",
        "role": "Lead Teacher",
        "status": "accepted"
      }
    ],
    "agenda": [
      "Product overview",
      "Parent communication features",
      "Q&A session"
    ]
  }
}
```

### 2. Update Demo
**Endpoint:** `PUT /api/demos/:id`

**Request Body:**
```json
{
  "scheduledAt": "2026-02-26T14:00:00Z",
  "notes": "Rescheduled due to conflict",
  "agenda": ["Product overview", "Features demo", "Pricing discussion"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "scheduledAt": "2026-02-26T14:00:00Z",
    "notes": "Rescheduled due to conflict",
    "updatedAt": "2026-02-19T15:30:00Z"
  }
}
```

### 3. Add Attendee to Demo
**Endpoint:** `POST /api/demos/:id/attendees`

**Request Body:**
```json
{
  "name": "Vice Principal",
  "email": "vp@springfield.edu",
  "role": "Vice Principal"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "att-3",
    "name": "Vice Principal",
    "email": "vp@springfield.edu",
    "role": "Vice Principal",
    "status": "invited"
  }
}
```

### 4. Complete Demo
**Endpoint:** `PATCH /api/demos/:id/complete`

**Request Body:**
```json
{
  "feedback": "Demo went well, client very interested",
  "nextSteps": "Send proposal by Friday",
  "clientFeedback": "Excellent product, need to discuss pricing"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "status": "completed",
    "completedAt": "2026-02-19T14:45:00Z",
    "feedback": "Demo went well, client very interested"
  }
}
```

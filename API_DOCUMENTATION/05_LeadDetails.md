# Lead Details API Documentation

## Overview
The Lead Details page displays comprehensive information about a specific lead including timeline, associated demos, and actions.

## Endpoints

### 1. Get Lead Details
**Endpoint:** `GET /api/leads/:id`

**Description:** Retrieve complete lead information with timeline and associated data

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
    "painPoint": "Need better student progress tracking and parent communication tools",
    "status": "demo_scheduled",
    "assignedStaff": "Sarah Johnson",
    "assignedStaffId": "1",
    "lastActivity": "2026-02-04T14:30:00Z",
    "createdAt": "2026-01-15T00:00:00Z",
    "notes": [
      "Initial contact via website form",
      "Interested in premium features"
    ],
    "timeline": [
      {
        "id": "evt-1",
        "timestamp": "2026-02-04T14:30:00Z",
        "action": "demo_scheduled",
        "description": "Demo scheduled",
        "staffId": "1",
        "staffName": "Sarah Johnson",
        "details": {
          "demoId": "1",
          "demoDate": "2026-02-19T14:00:00Z"
        }
      },
      {
        "id": "evt-2",
        "timestamp": "2026-01-20T10:00:00Z",
        "action": "status_changed",
        "description": "Status changed to contacted",
        "staffId": "2",
        "staffName": "Michael Chen",
        "details": {
          "previousStatus": "new",
          "newStatus": "contacted"
        }
      },
      {
        "id": "evt-3",
        "timestamp": "2026-01-15T09:00:00Z",
        "action": "lead_created",
        "description": "Lead created",
        "staffId": "3",
        "staffName": "System",
        "details": {
          "source": "website_form"
        }
      }
    ],
    "associatedDemos": [
      {
        "id": "1",
        "scheduledAt": "2026-02-19T14:00:00Z",
        "status": "scheduled",
        "assignedStaff": "Sarah Johnson"
      }
    ],
    "communicationHistory": [
      {
        "id": "comm-1",
        "type": "email",
        "timestamp": "2026-02-04T14:30:00Z",
        "subject": "Demo Scheduled",
        "summary": "Confirmed demo appointment",
        "sender": "sarah@educonnect.com"
      }
    ],
    "metrics": {
      "daysSinceLead": 35,
      "daysInCurrentStatus": 15,
      "engagementScore": 85
    }
  }
}
```

### 2. Add Note to Lead
**Endpoint:** `POST /api/leads/:id/notes`

**Request Body:**
```json
{
  "note": "Client interested in enterprise plan"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "notes": [
      "Initial contact via website form",
      "Interested in premium features",
      "Client interested in enterprise plan"
    ]
  }
}
```

### 3. Update Lead Status
**Endpoint:** `PATCH /api/leads/:id/status`

**Request Body:**
```json
{
  "status": "negotiation"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "status": "negotiation",
    "lastActivity": "2026-02-19T13:00:00Z"
  }
}
```

### 4. Get Lead Communication History
**Endpoint:** `GET /api/leads/:id/communications`

**Response:**
```json
{
  "success": true,
  "data": {
    "communications": [
      {
        "id": "comm-1",
        "type": "email",
        "timestamp": "2026-02-04T14:30:00Z",
        "subject": "Demo Scheduled",
        "body": "Your demo has been scheduled for February 19, 2026 at 2:00 PM",
        "sender": "sarah@educonnect.com",
        "recipient": "anderson@springfield.edu",
        "status": "sent"
      }
    ]
  }
}
```

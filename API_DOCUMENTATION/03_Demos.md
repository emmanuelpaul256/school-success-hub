# Demos API Documentation

## Overview
The Demos page displays a calendar view of scheduled demos with the ability to schedule, reschedule, and track demo status.

## Endpoints

### 1. Get All Demos
**Endpoint:** `GET /api/demos`

**Description:** Retrieve all demos with optional filtering

**Query Parameters:**
- `page` (optional): page number (default: 0)
- `limit` (optional): items per page (default: 50)
- `status` (optional): filter by status (scheduled, completed, missed, cancelled)
- `staffId` (optional): filter by assigned staff
- `dateFrom` (optional): ISO date string
- `dateTo` (optional): ISO date string
- `leadId` (optional): filter by lead ID

**Response:**
```json
{
  "success": true,
  "data": {
    "demos": [
      {
        "id": "1",
        "leadId": "1",
        "schoolName": "Springfield Elementary",
        "scheduledAt": "2026-02-19T14:00:00Z",
        "meetingLink": "https://meet.google.com/abc-defg-hij",
        "assignedStaff": "Sarah Johnson",
        "assignedStaffId": "1",
        "status": "scheduled",
        "notes": "Focus on parent communication features | Type: online | Link: https://meet.google.com/abc-defg-hij",
        "demoType": "online",
        "createdAt": "2026-02-10T10:00:00Z",
        "updatedAt": "2026-02-10T10:00:00Z"
      },
      {
        "id": "2",
        "leadId": "7",
        "schoolName": "Sunset High School",
        "scheduledAt": "2026-02-19T16:30:00Z",
        "meetingLink": "https://meet.google.com/klm-nopq-rst",
        "assignedStaff": "Emily Rodriguez",
        "assignedStaffId": "3",
        "status": "scheduled",
        "notes": "Large school, enterprise features demo | Type: online | Link: https://meet.google.com/klm-nopq-rst",
        "demoType": "online",
        "createdAt": "2026-02-12T14:00:00Z",
        "updatedAt": "2026-02-12T14:00:00Z"
      }
    ],
    "pagination": {
      "page": 0,
      "limit": 50,
      "total": 8,
      "totalPages": 1
    }
  }
}
```

### 2. Get Single Demo
**Endpoint:** `GET /api/demos/:id`

**Description:** Retrieve detailed information about a specific demo

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
    "location": null,
    "address": null,
    "attendees": [],
    "createdAt": "2026-02-10T10:00:00Z",
    "updatedAt": "2026-02-10T10:00:00Z",
    "leadDetails": {
      "id": "1",
      "schoolName": "Springfield Elementary",
      "contactPerson": "Principal Anderson",
      "email": "anderson@springfield.edu",
      "phone": "+1 555-0101"
    },
    "assignedStaffDetails": {
      "id": "1",
      "name": "Sarah Johnson",
      "email": "sarah@educonnect.com"
    }
  }
}
```

### 3. Schedule Demo
**Endpoint:** `POST /api/demos`

**Description:** Create a new demo

**Request Body:**
```json
{
  "leadId": "1",
  "scheduledAt": "2026-02-25T10:00:00Z",
  "demoType": "online",
  "assignedStaffId": "1",
  "meetingLink": "https://meet.google.com/new-meeting",
  "location": null,
  "address": null,
  "notes": "Initial demo to showcase features"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "9",
    "leadId": "1",
    "schoolName": "Springfield Elementary",
    "scheduledAt": "2026-02-25T10:00:00Z",
    "meetingLink": "https://meet.google.com/new-meeting",
    "assignedStaff": "Sarah Johnson",
    "assignedStaffId": "1",
    "status": "scheduled",
    "notes": "Initial demo to showcase features",
    "demoType": "online",
    "createdAt": "2026-02-19T15:00:00Z",
    "updatedAt": "2026-02-19T15:00:00Z"
  }
}
```

### 4. Reschedule Demo
**Endpoint:** `PUT /api/demos/:id`

**Description:** Update demo details

**Request Body:**
```json
{
  "scheduledAt": "2026-02-26T14:00:00Z",
  "assignedStaffId": "2",
  "notes": "Rescheduled due to conflict",
  "status": "scheduled"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "leadId": "1",
    "schoolName": "Springfield Elementary",
    "scheduledAt": "2026-02-26T14:00:00Z",
    "meetingLink": "https://meet.google.com/abc-defg-hij",
    "assignedStaff": "Michael Chen",
    "assignedStaffId": "2",
    "status": "scheduled",
    "notes": "Rescheduled due to conflict",
    "demoType": "online",
    "updatedAt": "2026-02-19T15:30:00Z"
  }
}
```

### 5. Update Demo Status
**Endpoint:** `PATCH /api/demos/:id/status`

**Description:** Update the status of a demo

**Request Body:**
```json
{
  "status": "completed",
  "feedback": "Demo went well, client interested in professional plan"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "status": "completed",
    "feedback": "Demo went well, client interested in professional plan",
    "updatedAt": "2026-02-19T15:00:00Z"
  }
}
```

### 6. Get Demos Calendar View
**Endpoint:** `GET /api/demos/calendar`

**Description:** Get demos in calendar format for a specific month

**Query Parameters:**
- `year` (optional): year (default: current year)
- `month` (optional): month 1-12 (default: current month)
- `staffId` (optional): filter by staff

**Response:**
```json
{
  "success": true,
  "data": {
    "year": 2026,
    "month": 2,
    "days": [
      {
        "date": "2026-02-19",
        "dayOfWeek": "Thursday",
        "demos": [
          {
            "id": "1",
            "time": "14:00",
            "schoolName": "Springfield Elementary",
            "status": "scheduled",
            "assignedStaff": "Sarah Johnson"
          },
          {
            "id": "2",
            "time": "16:30",
            "schoolName": "Sunset High School",
            "status": "scheduled",
            "assignedStaff": "Emily Rodriguez"
          }
        ]
      },
      {
        "date": "2026-02-20",
        "dayOfWeek": "Friday",
        "demos": [
          {
            "id": "3",
            "time": "10:00",
            "schoolName": "Maple Grove Academy",
            "status": "scheduled",
            "assignedStaff": "David Kim"
          }
        ]
      }
    ]
  }
}
```

### 7. Get Upcoming Demos
**Endpoint:** `GET /api/demos/upcoming`

**Description:** Get demos scheduled for upcoming days

**Query Parameters:**
- `days` (optional): number of days ahead (default: 7)
- `staffId` (optional): filter by staff

**Response:**
```json
{
  "success": true,
  "data": {
    "upcoming": [
      {
        "id": "1",
        "leadId": "1",
        "schoolName": "Springfield Elementary",
        "scheduledAt": "2026-02-19T14:00:00Z",
        "meetingLink": "https://meet.google.com/abc-defg-hij",
        "assignedStaff": "Sarah Johnson",
        "assignedStaffId": "1",
        "status": "scheduled",
        "daysUntil": 0,
        "isToday": true
      },
      {
        "id": "3",
        "leadId": "8",
        "schoolName": "Maple Grove Academy",
        "scheduledAt": "2026-02-20T10:00:00Z",
        "meetingLink": "https://zoom.us/j/123456789",
        "assignedStaff": "David Kim",
        "assignedStaffId": "4",
        "status": "scheduled",
        "daysUntil": 1,
        "isToday": false
      }
    ],
    "total": 7
  }
}
```

### 8. Add Demo Attendee
**Endpoint:** `POST /api/demos/:id/attendees`

**Description:** Add an attendee to a demo

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Principal"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "attendees": [
      {
        "id": "att-1",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "Principal",
        "status": "invited"
      }
    ]
  }
}
```

### 9. Cancel Demo
**Endpoint:** `DELETE /api/demos/:id`

**Description:** Cancel a demo

**Request Body:**
```json
{
  "reason": "Client requested cancellation"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Demo cancelled successfully"
}
```

## Demo Types
- `online`: Virtual meeting (Google Meet, Zoom, etc.)
- `physical`: In-person meeting
- `hybrid`: Combination of online and physical

## Demo Status
- `scheduled`: Demo is scheduled
- `completed`: Demo has been completed
- `missed`: Demo was missed
- `cancelled`: Demo was cancelled

## Error Handling

```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Staff member already has a demo scheduled at this time"
  }
}
```

## Authentication
- All endpoints require Bearer token authentication
- Header: `Authorization: Bearer <token>`

## Validation Rules
- `leadId`: Must be valid lead ID
- `scheduledAt`: Must be future date/time
- `assignedStaffId`: Must be valid staff member
- `demoType`: Must be one of: online, physical, hybrid

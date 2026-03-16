# Dashboard API Documentation

## Overview
The Dashboard page displays key performance indicators (KPIs) and provides a summary view of sales activities.

## Endpoints

### 1. Get Dashboard KPI Data
**Endpoint:** `GET /api/dashboard/kpi`

**Description:** Retrieve key performance indicators

**Query Parameters:**
- `dateRange` (optional): `today` | `week` | `month` | `year` (default: `month`)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalLeads": 42,
    "conversionRate": 28,
    "schoolsOnboarding": 4,
    "upcomingDemosToday": 3,
    "leadsTrend": 12,
    "conversionTrend": -5,
    "onboardingTrend": 25,
    "demosTrend": 8,
    "lastUpdated": "2026-02-19T10:30:00Z"
  }
}
```

### 2. Get Leads Status Chart Data
**Endpoint:** `GET /api/dashboard/leads-status`

**Description:** Get breakdown of leads by status

**Response:**
```json
{
  "success": true,
  "data": {
    "chartData": [
      {
        "status": "new",
        "count": 8,
        "percentage": 19
      },
      {
        "status": "contacted",
        "count": 12,
        "percentage": 29
      },
      {
        "status": "demo_scheduled",
        "count": 10,
        "percentage": 24
      },
      {
        "status": "negotiation",
        "count": 7,
        "percentage": 17
      },
      {
        "status": "converted",
        "count": 4,
        "percentage": 10
      },
      {
        "status": "lost",
        "count": 1,
        "percentage": 1
      }
    ],
    "total": 42
  }
}
```

### 3. Get Upcoming Demos
**Endpoint:** `GET /api/dashboard/upcoming-demos`

**Description:** Get demos scheduled for today and upcoming days

**Query Parameters:**
- `days` (optional): number of days to look ahead (default: 7)

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
        "notes": "Focus on parent communication features"
      }
    ],
    "total": 3
  }
}
```

### 4. Get Recent Activity
**Endpoint:** `GET /api/dashboard/activity`

**Description:** Get recent activities and updates

**Query Parameters:**
- `limit` (optional): number of activities to return (default: 10)
- `type` (optional): filter by activity type

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
      },
      {
        "id": "3",
        "type": "status_changed",
        "description": "Oakwood Academy moved to Negotiation",
        "staffName": "Michael Chen",
        "timestamp": "2026-02-03T10:00:00Z",
        "entityId": "2",
        "entityType": "lead",
        "icon": "arrow-right",
        "color": "warning"
      },
      {
        "id": "4",
        "type": "note_added",
        "description": "Added note to Green Valley School lead",
        "staffName": "David Kim",
        "timestamp": "2026-02-02T16:45:00Z",
        "entityId": "4",
        "entityType": "lead",
        "icon": "message-square",
        "color": "info"
      }
    ],
    "total": 4
  }
}
```

## Error Handling

All endpoints return error responses in the following format:

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Failed to fetch dashboard data"
  }
}
```

## Authentication
- All endpoints require Bearer token authentication
- Header: `Authorization: Bearer <token>`

## Rate Limiting
- 100 requests per minute per user
- Rate limit headers included in response

## Caching
- KPI data cached for 5 minutes
- Activity data cached for 1 minute

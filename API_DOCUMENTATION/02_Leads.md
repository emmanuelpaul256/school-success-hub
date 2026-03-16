# Leads Page API Documentation

## Overview

The Leads page displays a comprehensive list of school prospects/leads with advanced filtering, search, status management, and CSV export functionality. It provides sales teams with tools to track and manage their pipeline.

**Frontend Component**: `src/pages/Leads.tsx`  
**Features**: Search, filter by status/staff, pagination, CSV export, status updates, detail viewing

---

## Features

### 1. **Lead Search**
- Search by school name, contact person, or email
- Real-time filtering as user types

### 2. **Status Filtering**
- Filter by lead status: New, Contacted, Demo Scheduled, Negotiation, Converted, Lost
- Multi-status view capability

### 3. **Staff Assignment Filtering**
- Filter leads by assigned sales staff member
- View team member workload

### 4. **Pagination**
- Display 10 leads per page
- Navigate between pages
- Show total lead count

### 5. **CSV Export**
- Export filtered leads to CSV format
- Includes all lead information

### 6. **Lead Status Management**
- Change lead status from dropdown menu
- Real-time status updates

### 7. **Lead Details Navigation**
- View complete lead information
- Edit lead details
- Access lead timeline and communications

---

## Data Model

### Lead Object

```json
{
  "id": "uuid",
  "schoolName": "string",
  "contactPerson": "string",
  "email": "string",
  "phone": "string",
  "status": "new | contacted | demo_scheduled | negotiation | converted | lost",
  "assignedStaffId": "uuid",
  "assignedStaff": "string",
  "country": "string",
  "studentCount": "number",
  "lastActivity": "ISO-8601 timestamp",
  "createdAt": "ISO-8601 timestamp",
  "updatedAt": "ISO-8601 timestamp"
}
```

### Status Values

| Status | Description | Workflow Stage |
|--------|-------------|----------------|
| `new` | Recently added lead | Initial |
| `contacted` | Initial contact made | Qualification |
| `demo_scheduled` | Demo meeting set up | Demonstration |
| `negotiation` | In discussion phase | Negotiation |
| `converted` | Became a customer | Closed (Won) |
| `lost` | Deal not won | Closed (Lost) |

---

## API Endpoints

### 1. Get All Leads (with Pagination & Filtering)

**Endpoint**: `GET /api/leads`

**Description**: Retrieve paginated list of leads with optional filtering and searching.

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 0 | Page number (0-indexed) |
| `limit` | number | No | 10 | Results per page |
| `search` | string | No | - | Search by school name, contact, or email |
| `status` | string | No | - | Filter by status (new, contacted, etc.) |
| `staffId` | uuid | No | - | Filter by assigned staff member |
| `sortBy` | string | No | `lastActivity` | Sort field: `schoolName`, `status`, `lastActivity`, `createdAt` |
| `sortOrder` | string | No | `desc` | Sort order: `asc` or `desc` |

**Request Example**:
```bash
curl -X GET 'http://localhost:3000/api/leads?page=0&limit=10&status=contacted&sortBy=lastActivity&sortOrder=desc' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "leads": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "schoolName": "Springfield Elementary School",
        "contactPerson": "Lisa Simpson",
        "email": "lisa@springfield.edu",
        "phone": "+1-555-123-4567",
        "status": "contacted",
        "assignedStaffId": "550e8400-e29b-41d4-a716-446655440001",
        "assignedStaff": "John Doe",
        "country": "United States",
        "studentCount": 450,
        "lastActivity": "2026-02-19T10:30:00Z",
        "createdAt": "2026-02-10T15:45:00Z",
        "updatedAt": "2026-02-19T10:30:00Z"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "schoolName": "Gotham High School",
        "contactPerson": "Bruce Wayne",
        "email": "bruce@gotham.edu",
        "phone": "+1-555-234-5678",
        "status": "demo_scheduled",
        "assignedStaffId": "550e8400-e29b-41d4-a716-446655440003",
        "assignedStaff": "Jane Smith",
        "country": "United States",
        "studentCount": 680,
        "lastActivity": "2026-02-18T14:20:00Z",
        "createdAt": "2026-01-20T09:15:00Z",
        "updatedAt": "2026-02-18T14:20:00Z"
      }
    ],
    "pagination": {
      "page": 0,
      "limit": 10,
      "total": 45,
      "totalPages": 5
    }
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PARAMETERS",
    "message": "Invalid page or limit parameter",
    "details": "page must be >= 0, limit must be between 1 and 100"
  }
}
```

---

### 2. Get Lead Details

**Endpoint**: `GET /api/leads/:id`

**Description**: Retrieve complete information for a specific lead including timeline and communication history.

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | uuid | Yes | Lead ID |

**Request Example**:
```bash
curl -X GET 'http://localhost:3000/api/leads/550e8400-e29b-41d4-a716-446655440000' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "schoolName": "Springfield Elementary School",
    "contactPerson": "Lisa Simpson",
    "email": "lisa@springfield.edu",
    "phone": "+1-555-123-4567",
    "status": "contacted",
    "assignedStaffId": "550e8400-e29b-41d4-a716-446655440001",
    "assignedStaff": "John Doe",
    "country": "United States",
    "city": "Springfield",
    "studentCount": 450,
    "schoolType": "Public Elementary",
    "budget": 50000,
    "timeline": "Q2 2026",
    "notes": "Interested in demo, scheduling call for next week",
    "lastActivity": "2026-02-19T10:30:00Z",
    "createdAt": "2026-02-10T15:45:00Z",
    "updatedAt": "2026-02-19T10:30:00Z",
    "timeline": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440010",
        "type": "status_change",
        "message": "Status changed to Contacted",
        "timestamp": "2026-02-19T10:30:00Z",
        "changedBy": "John Doe"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440011",
        "type": "note",
        "message": "Initial call completed, very interested",
        "timestamp": "2026-02-15T14:20:00Z",
        "author": "John Doe"
      }
    ]
  }
}
```

**Error Response** (404 Not Found):
```json
{
  "success": false,
  "error": {
    "code": "LEAD_NOT_FOUND",
    "message": "Lead with ID 550e8400-e29b-41d4-a716-446655440000 not found"
  }
}
```

---

### 3. Create New Lead

**Endpoint**: `POST /api/leads`

**Description**: Create a new lead record.

**Request Body**:
```json
{
  "schoolName": "string (required, 3-255 characters)",
  "contactPerson": "string (required, 2-100 characters)",
  "email": "string (required, valid email)",
  "phone": "string (required, valid phone format)",
  "country": "string (required)",
  "city": "string (optional)",
  "studentCount": "number (optional, 0-100000)",
  "schoolType": "string (optional)",
  "budget": "number (optional, >= 0)",
  "timeline": "string (optional)",
  "notes": "string (optional, max 1000 characters)",
  "assignedStaffId": "uuid (optional)"
}
```

**Request Example**:
```bash
curl -X POST 'http://localhost:3000/api/leads' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "schoolName": "New Academy High School",
    "contactPerson": "Dr. Amanda Foster",
    "email": "amanda@newacademy.edu",
    "phone": "+1-555-345-6789",
    "country": "United States",
    "city": "Boston",
    "studentCount": 550,
    "schoolType": "Private High School",
    "budget": 75000,
    "timeline": "Q3 2026",
    "notes": "Referred by existing customer",
    "assignedStaffId": "550e8400-e29b-41d4-a716-446655440001"
  }'
```

**Success Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440050",
    "schoolName": "New Academy High School",
    "contactPerson": "Dr. Amanda Foster",
    "email": "amanda@newacademy.edu",
    "phone": "+1-555-345-6789",
    "status": "new",
    "assignedStaffId": "550e8400-e29b-41d4-a716-446655440001",
    "assignedStaff": "John Doe",
    "country": "United States",
    "city": "Boston",
    "studentCount": 550,
    "schoolType": "Private High School",
    "budget": 75000,
    "timeline": "Q3 2026",
    "notes": "Referred by existing customer",
    "lastActivity": "2026-02-19T11:00:00Z",
    "createdAt": "2026-02-19T11:00:00Z",
    "updatedAt": "2026-02-19T11:00:00Z"
  }
}
```

**Validation Error Response** (400 Bad Request):
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "schoolName",
        "message": "School name is required and must be 3-255 characters"
      }
    ]
  }
}
```

---

### 4. Update Lead

**Endpoint**: `PUT /api/leads/:id`

**Description**: Update an existing lead's information.

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | uuid | Yes | Lead ID |

**Request Body** (all fields optional):
```json
{
  "schoolName": "string (3-255 characters)",
  "contactPerson": "string (2-100 characters)",
  "email": "string (valid email)",
  "phone": "string (valid phone format)",
  "country": "string",
  "city": "string",
  "studentCount": "number (0-100000)",
  "schoolType": "string",
  "budget": "number (>= 0)",
  "timeline": "string",
  "notes": "string (max 1000 characters)",
  "assignedStaffId": "uuid"
}
```

**Request Example**:
```bash
curl -X PUT 'http://localhost:3000/api/leads/550e8400-e29b-41d4-a716-446655440000' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "studentCount": 500,
    "budget": 80000,
    "notes": "Updated budget after discussion",
    "assignedStaffId": "550e8400-e29b-41d4-a716-446655440003"
  }'
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "schoolName": "Springfield Elementary School",
    "contactPerson": "Lisa Simpson",
    "email": "lisa@springfield.edu",
    "phone": "+1-555-123-4567",
    "status": "contacted",
    "assignedStaffId": "550e8400-e29b-41d4-a716-446655440003",
    "assignedStaff": "Jane Smith",
    "country": "United States",
    "studentCount": 500,
    "budget": 80000,
    "notes": "Updated budget after discussion",
    "lastActivity": "2026-02-19T11:15:00Z",
    "updatedAt": "2026-02-19T11:15:00Z"
  }
}
```

---

### 5. Update Lead Status

**Endpoint**: `PATCH /api/leads/:id/status`

**Description**: Change the status of a lead in the pipeline.

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | uuid | Yes | Lead ID |

**Request Body**:
```json
{
  "status": "string (required) - one of: new, contacted, demo_scheduled, negotiation, converted, lost",
  "reason": "string (optional, required if status=lost)"
}
```

**Request Example**:
```bash
curl -X PATCH 'http://localhost:3000/api/leads/550e8400-e29b-41d4-a716-446655440000/status' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "demo_scheduled",
    "reason": "Demo scheduled for Feb 25, 2026"
  }'
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "demo_scheduled",
    "previousStatus": "contacted",
    "changedAt": "2026-02-19T11:20:00Z",
    "changedBy": "John Doe",
    "message": "Status successfully updated from Contacted to Demo Scheduled"
  }
}
```

**Validation Error** (400 Bad Request):
```json
{
  "success": false,
  "error": {
    "code": "INVALID_STATUS",
    "message": "Invalid status value",
    "details": "Status must be one of: new, contacted, demo_scheduled, negotiation, converted, lost"
  }
}
```

---

### 6. Add Note to Lead

**Endpoint**: `POST /api/leads/:id/notes`

**Description**: Add a note or comment to a lead's timeline.

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | uuid | Yes | Lead ID |

**Request Body**:
```json
{
  "content": "string (required, 1-1000 characters)",
  "type": "string (optional) - default, follow_up, proposal, contract"
}
```

**Request Example**:
```bash
curl -X POST 'http://localhost:3000/api/leads/550e8400-e29b-41d4-a716-446655440000/notes' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "content": "Follow up call scheduled for Feb 22. Client expressed interest in enterprise plan.",
    "type": "follow_up"
  }'
```

**Success Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440020",
    "leadId": "550e8400-e29b-41d4-a716-446655440000",
    "content": "Follow up call scheduled for Feb 22. Client expressed interest in enterprise plan.",
    "type": "follow_up",
    "author": "John Doe",
    "createdAt": "2026-02-19T11:25:00Z"
  }
}
```

---

### 7. Delete Lead

**Endpoint**: `DELETE /api/leads/:id`

**Description**: Delete (soft delete) a lead record. The record is marked as deleted but retained in database.

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | uuid | Yes | Lead ID |

**Request Example**:
```bash
curl -X DELETE 'http://localhost:3000/api/leads/550e8400-e29b-41d4-a716-446655440000' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "message": "Lead successfully deleted",
    "deletedAt": "2026-02-19T11:30:00Z"
  }
}
```

**Error Response** (404 Not Found):
```json
{
  "success": false,
  "error": {
    "code": "LEAD_NOT_FOUND",
    "message": "Lead not found or already deleted"
  }
}
```

---

### 8. Export Leads to CSV

**Endpoint**: `GET /api/leads/export/csv`

**Description**: Export filtered leads list to CSV format. Returns file download with timestamp.

**Query Parameters** (same as list endpoint):
- `search`, `status`, `staffId`, `sortBy`, `sortOrder`

**Request Example**:
```bash
curl -X GET 'http://localhost:3000/api/leads/export/csv?status=contacted' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -o leads_2026-02-19.csv
```

**Success Response** (200 OK):
- Content-Type: `text/csv; charset=utf-8`
- Content-Disposition: `attachment; filename="leads_2026-02-19.csv"`

**CSV Output**:
```csv
"School Name","Contact Person","Email","Phone","Status","Assigned Staff","Country","Student Count","Last Activity"
"Springfield Elementary School","Lisa Simpson","lisa@springfield.edu","+1-555-123-4567","Contacted","John Doe","United States","450","2026-02-19T10:30:00Z"
"Gotham High School","Bruce Wayne","bruce@gotham.edu","+1-555-234-5678","Demo Scheduled","Jane Smith","United States","680","2026-02-18T14:20:00Z"
```

---

## Status Codes

| Code | Description | When Used |
|------|-------------|-----------|
| 200 | OK | Successful GET, PUT, PATCH, DELETE requests |
| 201 | Created | Successfully created a new lead |
| 400 | Bad Request | Invalid parameters, validation errors, invalid status |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | User lacks permission for the operation |
| 404 | Not Found | Lead ID does not exist |
| 409 | Conflict | Duplicate entry (email already exists) |
| 429 | Too Many Requests | Rate limit exceeded (100 req/min per user) |
| 500 | Server Error | Unexpected server error |

---

## Validation Rules

### School Name
- Required
- Length: 3-255 characters
- Cannot be blank or whitespace only

### Contact Person
- Required
- Length: 2-100 characters
- Alphanumeric, spaces, and common name characters allowed

### Email
- Required
- Must be valid email format (RFC 5322 compliant)
- Must be unique across leads
- Case-insensitive comparison

### Phone
- Required
- Valid phone format (international format recommended)
- Supports: +1-555-123-4567 or similar formats

### Student Count
- Optional
- Must be number between 0 and 100,000
- Cannot be negative

### Budget
- Optional
- Must be number >= 0
- Decimal values supported (2 decimal places)

### Status
- Must be one of predefined values
- Status workflow validation on certain transitions

---

## Frontend Integration

### Component Usage

```typescript
// Get paginated leads with filters
const response = await fetch(`/api/leads?page=${page}&limit=10&status=${statusFilter}&staffId=${staffFilter}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { data } = await response.json();

// Change lead status
await fetch(`/api/leads/${leadId}/status`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ status: newStatus })
});

// Export to CSV
const response = await fetch(`/api/leads/export/csv?status=${statusFilter}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
const blob = await response.blob();
// Download file logic
```

---

## Error Handling Examples

### Duplicate Email
```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_EMAIL",
    "message": "A lead with this email already exists",
    "details": "Email: lisa@springfield.edu"
  }
}
```

### Invalid Status Transition
```json
{
  "success": false,
  "error": {
    "code": "INVALID_STATUS_TRANSITION",
    "message": "Cannot transition from 'converted' to 'new'",
    "details": "A converted lead cannot be moved back to new status. Use a different approach."
  }
}
```

### Permission Denied
```json
{
  "success": false,
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "You don't have permission to edit this lead",
    "details": "Only the assigned staff member or admin can edit this lead"
  }
}
```

---

## Rate Limiting

**Limit**: 100 requests per minute per user

**Headers in Response**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1645267560
```

**When Exceeded** (429 Too Many Requests):
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "You have exceeded the rate limit",
    "details": "Maximum 100 requests per minute. Try again after 30 seconds."
  }
}
```

---

## Authentication

All endpoints require Bearer token authentication:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token obtained from login endpoint (POST /api/auth/login).

---

## Pagination

- Default page size: 10
- Maximum page size: 100
- Pages are 0-indexed
- Response includes `totalPages` for UI navigation

Example response structure:
```json
{
  "data": {
    "leads": [...],
    "pagination": {
      "page": 0,
      "limit": 10,
      "total": 45,
      "totalPages": 5
    }
  }
}
```

---

## Sorting

Supported fields for sorting:
- `schoolName`
- `status`
- `lastActivity` (default)
- `createdAt`

Order: `asc` or `desc` (default: `desc`)

---

## Related Documentation

- [Dashboard API](01_Dashboard.md)
- [Lead Details API](05_LeadDetails.md)
- [Database Schema](08_DatabaseSchema.md#leads-table)
- [Implementation Guide](09_ImplementationGuide.md)

---

## Summary

The Leads API provides comprehensive endpoint coverage for managing sales prospects throughout their lifecycle. Features include advanced filtering, bulk operations (CSV export), timeline tracking, and flexible status management. Integration with the frontend Leads.tsx component enables a complete lead management system.

**Key Capabilities**:
✅ Full CRUD operations on leads  
✅ Advanced filtering and search  
✅ Status workflow management  
✅ Timeline and note tracking  
✅ CSV export functionality  
✅ Staff assignment and tracking  
✅ Pagination for large datasets  
✅ Real-time updates  


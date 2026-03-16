# API Reference - Quick Commands

## Base URL
```
http://localhost:3000/api
```

## Environment Variables to Set
```
BASE_URL = http://localhost:3000/api
TOKEN = <your-jwt-token>
SCHOOL_ID = <test-school-id>
LEAD_ID = <test-lead-id>
DEMO_ID = <test-demo-id>
USER_ID = <test-user-id>
```

## cURL Commands for Testing

### Authentication

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah@educonnect.com",
    "password": "password123"
  }'
```

#### Get Current User
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Leads

#### Get All Leads
```bash
curl -X GET "http://localhost:3000/api/leads?page=0&limit=10&status=new" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Create Lead
```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "schoolName": "New School",
    "contactPerson": "John Doe",
    "email": "john@newschool.edu",
    "phone": "+1 555-1234",
    "role": "Principal",
    "country": "United States",
    "studentCount": 500,
    "painPoint": "Need student management system",
    "assignedStaffId": "1"
  }'
```

#### Get Lead Details
```bash
curl -X GET http://localhost:3000/api/leads/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Update Lead
```bash
curl -X PUT http://localhost:3000/api/leads/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "contacted",
    "assignedStaffId": "2"
  }'
```

#### Add Note to Lead
```bash
curl -X POST http://localhost:3000/api/leads/1/notes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "note": "Client interested in enterprise plan"
  }'
```

### Demos

#### Get All Demos
```bash
curl -X GET "http://localhost:3000/api/demos?status=scheduled" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Schedule Demo
```bash
curl -X POST http://localhost:3000/api/demos \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "leadId": "1",
    "scheduledAt": "2026-02-25T10:00:00Z",
    "demoType": "online",
    "assignedStaffId": "1",
    "meetingLink": "https://meet.google.com/new-meeting",
    "notes": "Initial demo to showcase features"
  }'
```

#### Get Demo Details
```bash
curl -X GET http://localhost:3000/api/demos/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Reschedule Demo
```bash
curl -X PUT http://localhost:3000/api/demos/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "scheduledAt": "2026-02-26T14:00:00Z",
    "notes": "Rescheduled due to conflict"
  }'
```

#### Complete Demo
```bash
curl -X PATCH http://localhost:3000/api/demos/1/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "feedback": "Demo went well, client interested"
  }'
```

### Schools

#### Get All Schools
```bash
curl -X GET "http://localhost:3000/api/schools?page=0&limit=10&planType=professional" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get School Details
```bash
curl -X GET http://localhost:3000/api/schools/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Create School
```bash
curl -X POST http://localhost:3000/api/schools \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New School",
    "planType": "starter",
    "assignedStaffId": "1",
    "studentCount": 300,
    "teacherCount": 25,
    "contactEmail": "admin@newschool.edu",
    "contactPhone": "+1 555-1234"
  }'
```

#### Update Onboarding Progress
```bash
curl -X PATCH http://localhost:3000/api/schools/1/onboarding \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "completedSteps": {
      "initialSetup": true,
      "staffTraining": true,
      "dataMigration": false,
      "goLive": false
    }
  }'
```

#### Upgrade School Plan
```bash
curl -X PATCH http://localhost:3000/api/schools/1/upgrade \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "newPlan": "enterprise",
    "effectiveDate": "2026-02-19T00:00:00Z"
  }'
```

#### Get Support Tickets
```bash
curl -X GET "http://localhost:3000/api/schools/1/support?limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Dashboard

#### Get KPI Data
```bash
curl -X GET "http://localhost:3000/api/dashboard/kpi?dateRange=month" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get Leads Status
```bash
curl -X GET http://localhost:3000/api/dashboard/leads-status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get Upcoming Demos
```bash
curl -X GET "http://localhost:3000/api/dashboard/upcoming-demos?days=7" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get Activity
```bash
curl -X GET "http://localhost:3000/api/dashboard/activity?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Activities & Notifications

#### Get Activities
```bash
curl -X GET "http://localhost:3000/api/activities?page=0&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get Notifications
```bash
curl -X GET "http://localhost:3000/api/notifications?unread=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Mark Notification as Read
```bash
curl -X PATCH http://localhost:3000/api/notifications/1/read \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Settings

#### Get Profile
```bash
curl -X GET http://localhost:3000/api/settings/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Update Profile
```bash
curl -X PUT http://localhost:3000/api/settings/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "timezone": "America/Chicago",
    "emailNotifications": false
  }'
```

#### Change Password
```bash
curl -X POST http://localhost:3000/api/settings/change-password \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "oldpassword",
    "newPassword": "newpassword",
    "confirmPassword": "newpassword"
  }'
```

## Testing with Postman

1. **Create Environment**:
   - Set `base_url` = http://localhost:3000/api
   - Set `token` = (obtained from login endpoint)

2. **Use Pre-request Scripts** to add Authorization header:
```javascript
pm.request.headers.add({
    key: "Authorization",
    value: "Bearer " + pm.environment.get("token")
});
```

3. **Import Sample Collection** from Postman UI

## Testing with Thunder Client (VS Code)

1. Create new request
2. Select HTTP method
3. Enter endpoint URL with {{base_url}}
4. Add header: `Authorization: Bearer {{token}}`
5. Copy-paste request body from examples above

## Common Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `500` - Internal Server Error

## Error Response Example

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email already exists",
    "details": {
      "field": "email",
      "value": "existing@email.com"
    }
  }
}
```

## Headers Required

All requests (except login) need:
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

## Response Pagination Example

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 0,
      "limit": 10,
      "total": 42,
      "totalPages": 5
    }
  }
}
```

## Rate Limiting Headers

Check response headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1645278000
```

## Tips for API Testing

1. **Get Token First**: Always login first to get JWT token
2. **Use Postman Collections**: Save frequently used requests
3. **Test Error Cases**: Test with invalid data
4. **Check Headers**: Verify response headers for rate limits
5. **Use Environment Variables**: Don't hardcode values
6. **Test Pagination**: Try different page and limit values
7. **Test Filters**: Try combining multiple filters
8. **Test Sorting**: Verify sort order works

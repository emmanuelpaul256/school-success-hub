# API Overview & Setup Guide

## Project Name
School Success Hub - Educational Institution Management Platform

## Description
A comprehensive SaaS platform for managing educational institutions, tracking sales leads, scheduling demos, and monitoring school onboarding progress.

## Technology Stack Recommendations

### Backend
- **Node.js/Express** or **Python/FastAPI** or **Java/Spring Boot**
- **PostgreSQL** - Primary database
- **Redis** - Caching and session management
- **JWT** - Authentication

### Key Technologies
- REST API architecture
- Authentication: JWT Bearer tokens
- Rate limiting
- CORS enabled
- Request/Response logging

## Database Schema Overview

### Tables Required

1. **users** - Staff members
2. **leads** - Sales prospects
3. **demos** - Scheduled demonstrations
4. **schools** - Active customer accounts
5. **support_tickets** - Customer support tickets
6. **activities** - Activity log/timeline
7. **notifications** - User notifications
8. **lead_timeline** - Lead history/events

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

## Common HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `500` - Internal Server Error

## Authentication
- All requests require `Authorization: Bearer <token>` header
- Token expires after 24 hours
- Refresh token endpoint: `POST /api/auth/refresh`

## Rate Limiting
- 100 requests per minute per user
- Headers returned:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Pagination
Query parameters:
- `page`: 0-indexed page number
- `limit`: items per page (max 100)

Response includes:
- `page`: current page
- `limit`: items per page
- `total`: total items
- `totalPages`: total pages

## Filtering & Sorting

### Filter Format
```
?status=active&planType=professional
```

### Sort Format
```
?sortBy=createdAt&sortOrder=desc
```

## Base URL
```
https://api.schoolsuccesshub.com/api
```

## API Endpoints Summary

### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Current user info

### Leads Management
- `GET /leads` - List all leads
- `POST /leads` - Create new lead
- `GET /leads/:id` - Get lead details
- `PUT /leads/:id` - Update lead
- `PATCH /leads/:id/status` - Change lead status
- `POST /leads/:id/notes` - Add note to lead
- `DELETE /leads/:id` - Delete lead
- `GET /leads/export/csv` - Export as CSV

### Demos Management
- `GET /demos` - List all demos
- `POST /demos` - Schedule new demo
- `GET /demos/:id` - Get demo details
- `PUT /demos/:id` - Update demo
- `PATCH /demos/:id/status` - Change demo status
- `GET /demos/calendar` - Calendar view
- `GET /demos/upcoming` - Upcoming demos
- `DELETE /demos/:id` - Cancel demo

### Schools Management
- `GET /schools` - List all schools
- `POST /schools` - Create new school
- `GET /schools/:id` - Get school details
- `PUT /schools/:id` - Update school
- `PATCH /schools/:id/onboarding` - Update onboarding
- `GET /schools/:id/support` - Support tickets
- `PATCH /schools/:id/upgrade` - Upgrade plan
- `PATCH /schools/:id/cancel` - Cancel subscription

### Dashboard
- `GET /dashboard/kpi` - KPI data
- `GET /dashboard/leads-status` - Leads status chart
- `GET /dashboard/upcoming-demos` - Upcoming demos
- `GET /dashboard/activity` - Recent activity

### Activities & Notifications
- `GET /activities` - Activity log
- `GET /notifications` - User notifications
- `PATCH /notifications/:id/read` - Mark notification read

### Settings
- `GET /settings/profile` - User profile
- `PUT /settings/profile` - Update profile
- `POST /settings/change-password` - Change password

## Important Notes

### Data Validation
- All email fields must be valid email format
- Phone numbers should support international formats
- Student counts must be positive integers
- Dates must be ISO 8601 format

### Business Rules
- Starter plan: max 200 students
- Professional plan: max 1000 students
- Enterprise plan: unlimited students
- Default trial period: 30 days
- Lead status workflow: new → contacted → demo_scheduled → negotiation → converted/lost

### Security
- All endpoints require authentication (except login)
- Implement HTTPS only
- Use secure password hashing
- Implement CSRF protection
- Rate limiting enabled
- Input sanitization required

## Sample API Calls

### Login
```bash
curl -X POST https://api.schoolsuccesshub.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah@educonnect.com",
    "password": "password123"
  }'
```

### Get Leads
```bash
curl -X GET https://api.schoolsuccesshub.com/api/leads?page=0&limit=10 \
  -H "Authorization: Bearer <token>"
```

### Create Lead
```bash
curl -X POST https://api.schoolsuccesshub.com/api/leads \
  -H "Authorization: Bearer <token>" \
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

## Development Workflow

1. Review API documentation for each endpoint
2. Implement database models
3. Create API routes and handlers
4. Add validation and error handling
5. Test all endpoints
6. Deploy to staging
7. Integration testing with frontend
8. Deploy to production

## Support & Maintenance
- API versioning: Prefix routes with `/api/v1`
- Backward compatibility: Maintain previous versions
- Documentation: Keep OpenAPI/Swagger updated
- Monitoring: Log all requests and errors
- Backup: Regular database backups

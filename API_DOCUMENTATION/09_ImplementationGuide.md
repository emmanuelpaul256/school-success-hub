# Backend Implementation Guide

## Quick Start

### Prerequisites
- Node.js 16+ or Python 3.8+
- PostgreSQL 12+
- Redis (optional, for caching)
- Git

## Architecture Overview

```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── leadsController.js
│   │   ├── demosController.js
│   │   ├── schoolsController.js
│   │   └── ...
│   ├── models/
│   │   ├── User.js
│   │   ├── Lead.js
│   │   ├── Demo.js
│   │   ├── School.js
│   │   └── ...
│   ├── routes/
│   │   ├── auth.js
│   │   ├── leads.js
│   │   ├── demos.js
│   │   ├── schools.js
│   │   └── ...
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── validation.js
│   │   └── ...
│   ├── services/
│   │   ├── emailService.js
│   │   ├── notificationService.js
│   │   └── ...
│   ├── utils/
│   │   ├── validators.js
│   │   ├── helpers.js
│   │   └── ...
│   └── app.js
├── config/
│   ├── database.js
│   ├── env.example
│   └── ...
├── migrations/
├── seeds/
├── tests/
└── package.json
```

## Implementation Steps

### 1. Set Up Express Server (Node.js Example)

**package.json:**
```json
{
  "name": "school-success-hub-api",
  "version": "1.0.0",
  "description": "API for School Success Hub",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "test": "jest",
    "migrate": "node scripts/migrate.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.8.0",
    "dotenv": "^16.0.3",
    "jwt-simple": "^0.5.6",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "helmet": "^6.0.1",
    "express-validator": "^7.0.0",
    "redis": "^4.5.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.20",
    "jest": "^29.4.0"
  }
}
```

### 2. Environment Configuration

**.env.example:**
```
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=school_hub
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=24h

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# CORS
CORS_ORIGIN=http://localhost:8080

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# API
API_URL=https://api.schoolsuccesshub.com
FRONTEND_URL=http://localhost:8080
```

### 3. Database Connection

**config/database.js:**
```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;
```

### 4. Authentication Middleware

**middleware/auth.js:**
```javascript
const jwt = require('jwt-simple');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'NO_TOKEN', message: 'No token provided' }
    });
  }

  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid token' }
    });
  }
};

module.exports = { authenticateToken };
```

### 5. Main App Setup

**src/app.js:**
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/demos', require('./routes/demos'));
app.use('/api/schools', require('./routes/schools'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/settings', require('./routes/settings'));

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    error: { code: 'SERVER_ERROR', message: 'Internal server error' }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
```

### 6. Sample Controller

**controllers/leadsController.js:**
```javascript
const pool = require('../config/database');
const { validationResult } = require('express-validator');

exports.getAllLeads = async (req, res) => {
  try {
    const { page = 0, limit = 10, status, search } = req.query;
    const offset = page * limit;

    let query = 'SELECT * FROM leads WHERE deleted_at IS NULL';
    const params = [];

    if (status) {
      query += ` AND status = $${params.length + 1}`;
      params.push(status);
    }

    if (search) {
      query += ` AND (school_name ILIKE $${params.length + 1} OR email ILIKE $${params.length + 2})`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM leads WHERE deleted_at IS NULL';
    if (status) countQuery += ` AND status = $1`;
    if (search) countQuery += ` AND (school_name ILIKE $2 OR email ILIKE $3)`;

    const countResult = await pool.query(countQuery, params.slice(0, -2));
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: {
        leads: result.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'QUERY_ERROR', message: err.message }
    });
  }
};

exports.createLead = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { schoolName, contactPerson, email, phone, role, country, studentCount, painPoint, assignedStaffId } = req.body;

    const query = `
      INSERT INTO leads (school_name, contact_person, email, phone, role, country, student_count, pain_point, assigned_staff_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const result = await pool.query(query, [
      schoolName, contactPerson, email, phone, role, country, studentCount, painPoint, assignedStaffId
    ]);

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: { code: 'CREATION_ERROR', message: err.message }
    });
  }
};
```

### 7. Sample Route

**routes/leads.js:**
```javascript
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const leadsController = require('../controllers/leadsController');

router.get('/', authenticateToken, leadsController.getAllLeads);

router.post('/',
  authenticateToken,
  body('schoolName').notEmpty().trim(),
  body('email').isEmail(),
  body('phone').notEmpty(),
  body('studentCount').isInt({ min: 1 }),
  leadsController.createLead
);

router.get('/:id', authenticateToken, leadsController.getLead);
router.put('/:id', authenticateToken, leadsController.updateLead);
router.patch('/:id/status', authenticateToken, leadsController.updateStatus);
router.delete('/:id', authenticateToken, leadsController.deleteLead);

module.exports = router;
```

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] All endpoints tested
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Rate limiting enabled
- [ ] CORS configured correctly
- [ ] JWT tokens working
- [ ] Input validation on all endpoints
- [ ] Database backups scheduled
- [ ] SSL/HTTPS enabled
- [ ] Documentation updated

## Testing

### Sample Unit Test

**tests/leads.test.js:**
```javascript
const request = require('supertest');
const app = require('../src/app');

describe('Leads API', () => {
  it('should get all leads', async () => {
    const res = await request(app)
      .get('/api/leads')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.leads)).toBe(true);
  });

  it('should create a lead', async () => {
    const res = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send({
        schoolName: 'Test School',
        contactPerson: 'John Doe',
        email: 'john@test.com',
        phone: '+1 555-1234',
        studentCount: 500
      });
    
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
```

## Performance Optimization

1. **Database Indexes**: Create indexes on frequently queried fields
2. **Query Optimization**: Use EXPLAIN ANALYZE for slow queries
3. **Caching**: Implement Redis for frequently accessed data
4. **Pagination**: Always paginate large result sets
5. **Connection Pooling**: Use database connection pools
6. **CDN**: Serve static assets from CDN
7. **Monitoring**: Set up error tracking and performance monitoring

## Security Best Practices

1. **Input Validation**: Validate all user inputs
2. **SQL Injection**: Use parameterized queries
3. **XSS Protection**: Sanitize outputs
4. **CSRF Protection**: Implement CSRF tokens
5. **Rate Limiting**: Prevent brute force attacks
6. **HTTPS**: Always use HTTPS in production
7. **Secrets Management**: Use environment variables
8. **Audit Logging**: Log all critical actions

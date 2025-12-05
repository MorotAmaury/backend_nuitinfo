# API Documentation - Django Unchained Backend

Base URL: `http://localhost:3000/api`

## 📋 Table des matières
1. [Users](#users)
2. [Projects](#projects)
3. [Participations](#participations)
4. [Talents](#talents)

---

## USERS

### GET /users
List all users

```bash
curl -X GET "http://localhost:3000/api/users"
```

Response:
```json
[
  {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "created_at": "2025-01-01T10:00:00Z",
    "is_admin": 0
  }
]
```

---

### GET /users/:id
Get a specific user

```bash
curl -X GET "http://localhost:3000/api/users/1"
```

Response:
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "created_at": "2025-01-01T10:00:00Z",
  "is_admin": 0
}
```

---

### POST /users
Create a new user

```bash
curl -X POST "http://localhost:3000/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password_hash": "$2a$10$hash_value",
    "first_name": "John",
    "last_name": "Doe",
    "is_admin": false
  }'
```

Required fields: `username`, `email`, `password_hash`
Optional fields: `first_name`, `last_name`, `is_admin`

Response: (201 Created)
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "created_at": "2025-01-01T10:00:00Z",
  "is_admin": 0
}
```

---

### PUT /users/:id
Update a user

```bash
curl -X PUT "http://localhost:3000/api/users/1" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Johnny",
    "last_name": "Doe",
    "is_admin": true
  }'
```

Fields can be updated individually. Omitted fields are not modified.

Response:
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "Johnny",
  "last_name": "Doe",
  "created_at": "2025-01-01T10:00:00Z",
  "is_admin": 1
}
```

---

### DELETE /users/:id
Delete a user

```bash
curl -X DELETE "http://localhost:3000/api/users/1"
```

Response:
```json
{
  "deleted": 1
}
```

---

## PROJECTS

### GET /projects
List all projects

```bash
curl -X GET "http://localhost:3000/api/projects"
```

Response:
```json
[
  {
    "id": 1,
    "name": "Website Redesign",
    "description": "Complete redesign of company website",
    "technologies": "React,Node.js,PostgreSQL",
    "responsible_id": 1,
    "expected_members": 5,
    "location": "Paris",
    "status": "en_cours",
    "created_at": "2025-01-01T10:00:00Z",
    "updated_at": "2025-01-01T10:00:00Z"
  }
]
```

---

### GET /projects/:id
Get a specific project

```bash
curl -X GET "http://localhost:3000/api/projects/1"
```

Response:
```json
{
  "id": 1,
  "name": "Website Redesign",
  "description": "Complete redesign of company website",
  "technologies": "React,Node.js,PostgreSQL",
  "responsible_id": 1,
  "expected_members": 5,
  "location": "Paris",
  "status": "en_cours",
  "created_at": "2025-01-01T10:00:00Z",
  "updated_at": "2025-01-01T10:00:00Z"
}
```

---

### GET /projects/:id/members
Get members of a project

```bash
curl -X GET "http://localhost:3000/api/projects/1/members"
```

Response:
```json
[
  {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "joined_at": "2025-01-01T11:00:00Z"
  },
  {
    "id": 2,
    "username": "jane_smith",
    "email": "jane@example.com",
    "first_name": "Jane",
    "last_name": "Smith",
    "joined_at": "2025-01-01T11:30:00Z"
  }
]
```

---

### POST /projects
Create a new project

```bash
curl -X POST "http://localhost:3000/api/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Website Redesign",
    "description": "Complete redesign of company website",
    "technologies": "React,Node.js,PostgreSQL",
    "responsible_id": 1,
    "expected_members": 5,
    "location": "Paris",
    "status": "en_cours"
  }'
```

Required fields: `name`, `responsible_id`, `technologies`
Optional fields: `description`, `expected_members`, `location`, `status` (default: "en_cours")

Status values: `en_cours`, `terminé`, `en_pause`, `annulé`
Technologies: Comma-separated list of technologies (e.g., "React,Node.js,PostgreSQL")

Response: (201 Created)
```json
{
  "id": 1,
  "name": "Website Redesign",
  "description": "Complete redesign of company website",
  "technologies": "React,Node.js,PostgreSQL",
  "responsible_id": 1,
  "expected_members": 5,
  "location": "Paris",
  "status": "en_cours",
  "created_at": "2025-01-01T10:00:00Z",
  "updated_at": "2025-01-01T10:00:00Z"
}
```

---

### PUT /projects/:id
Update a project

```bash
curl -X PUT "http://localhost:3000/api/projects/1" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "terminé",
    "expected_members": 6
  }'
```

Fields can be updated individually. Omitted fields are not modified.

Response:
```json
{
  "id": 1,
  "name": "Website Redesign",
  "description": "Complete redesign of company website",
  "technologies": "React,Node.js,PostgreSQL",
  "responsible_id": 1,
  "expected_members": 6,
  "location": "Paris",
  "status": "terminé",
  "created_at": "2025-01-01T10:00:00Z",
  "updated_at": "2025-01-01T12:00:00Z"
}
```

---

### DELETE /projects/:id
Delete a project

```bash
curl -X DELETE "http://localhost:3000/api/projects/1"
```

Response:
```json
{
  "deleted": 1
}
```

---

## PARTICIPATIONS

### GET /participations
List all participations

```bash
curl -X GET "http://localhost:3000/api/participations"
```

Response:
```json
[
  {
    "id": 1,
    "user_id": 1,
    "project_id": 1,
    "joined_at": "2025-01-01T11:00:00Z"
  },
  {
    "id": 2,
    "user_id": 2,
    "project_id": 1,
    "joined_at": "2025-01-01T11:30:00Z"
  }
]
```

---

### GET /participations/:id
Get a specific participation

```bash
curl -X GET "http://localhost:3000/api/participations/1"
```

Response:
```json
{
  "id": 1,
  "user_id": 1,
  "project_id": 1,
  "joined_at": "2025-01-01T11:00:00Z"
}
```

---

### GET /users/:userId/participations
Get all projects for a specific user

```bash
curl -X GET "http://localhost:3000/api/users/1/participations"
```

Response:
```json
[
  {
    "id": 1,
    "user_id": 1,
    "project_id": 1,
    "joined_at": "2025-01-01T11:00:00Z",
    "project_name": "Website Redesign",
    "status": "en_cours",
    "location": "Paris"
  }
]
```

---

### POST /participations
Add a user to a project

```bash
curl -X POST "http://localhost:3000/api/participations" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "project_id": 1
  }'
```

Required fields: `user_id`, `project_id`

Response: (201 Created)
```json
{
  "id": 1,
  "user_id": 1,
  "project_id": 1,
  "joined_at": "2025-01-01T11:00:00Z"
}
```

---

### DELETE /participations/:id
Remove a participation (by participation ID)

```bash
curl -X DELETE "http://localhost:3000/api/participations/1"
```

Response:
```json
{
  "deleted": 1
}
```

---

### DELETE /participations/user/:userId/project/:projectId
Remove a user from a project

```bash
curl -X DELETE "http://localhost:3000/api/participations/user/1/project/1"
```

Response:
```json
{
  "deleted": "user 1 from project 1"
}
```

---

## TALENTS

### GET /talents
List all talent profiles

```bash
curl -X GET "http://localhost:3000/api/talents"
```

Response:
```json
[
  {
    "id": 1,
    "user_id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "technologies": "React,Vue.js,Node.js,Python,PostgreSQL",
    "description": "Full-stack developer with 5+ years of experience",
    "location": "Paris",
    "created_at": "2025-01-01T10:00:00Z",
    "updated_at": "2025-01-01T10:00:00Z"
  }
]
```

---

### GET /talents/:id
Get a specific talent profile

```bash
curl -X GET "http://localhost:3000/api/talents/1"
```

Response:
```json
{
  "id": 1,
  "user_id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "technologies": "React,Vue.js,Node.js,Python,PostgreSQL",
  "description": "Full-stack developer with 5+ years of experience",
  "location": "Paris",
  "created_at": "2025-01-01T10:00:00Z",
  "updated_at": "2025-01-01T10:00:00Z"
}
```

---

### GET /talents/user/:userId
Get talent profile for a specific user

```bash
curl -X GET "http://localhost:3000/api/talents/user/1"
```

Response:
```json
{
  "id": 1,
  "user_id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "technologies": "React,Vue.js,Node.js,Python,PostgreSQL",
  "description": "Full-stack developer with 5+ years of experience",
  "location": "Paris",
  "created_at": "2025-01-01T10:00:00Z",
  "updated_at": "2025-01-01T10:00:00Z"
}
```

---

### POST /talents
Create a talent profile

```bash
curl -X POST "http://localhost:3000/api/talents" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "technologies": "React,Vue.js,Node.js,Python,PostgreSQL",
    "description": "Full-stack developer with 5+ years of experience",
    "location": "Paris"
  }'
```

Required fields: `user_id`, `technologies`
Optional fields: `description`, `location`

Technologies: Comma-separated list of technologies

Response: (201 Created)
```json
{
  "id": 1,
  "user_id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "technologies": "React,Vue.js,Node.js,Python,PostgreSQL",
  "description": "Full-stack developer with 5+ years of experience",
  "location": "Paris",
  "created_at": "2025-01-01T10:00:00Z",
  "updated_at": "2025-01-01T10:00:00Z"
}
```

---

### PUT /talents/:id
Update a talent profile

```bash
curl -X PUT "http://localhost:3000/api/talents/1" \
  -H "Content-Type: application/json" \
  -d '{
    "technologies": "React,Vue.js,Node.js,Python,PostgreSQL,Docker",
    "location": "Île-de-France"
  }'
```

Fields can be updated individually. Omitted fields are not modified.

Response:
```json
{
  "id": 1,
  "user_id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "technologies": "React,Vue.js,Node.js,Python,PostgreSQL,Docker",
  "description": "Full-stack developer with 5+ years of experience",
  "location": "Île-de-France",
  "created_at": "2025-01-01T10:00:00Z",
  "updated_at": "2025-01-01T12:00:00Z"
}
```

---

### DELETE /talents/:id
Delete a talent profile

```bash
curl -X DELETE "http://localhost:3000/api/talents/1"
```

Response:
```json
{
  "deleted": 1
}
```

---

### DELETE /talents/user/:userId
Delete a user's talent profile

```bash
curl -X DELETE "http://localhost:3000/api/talents/user/1"
```

Response:
```json
{
  "deleted": "talent profile for user 1"
}
```

---

## Error Responses

All endpoints return appropriate HTTP status codes:

- **400 Bad Request**: Missing or invalid required fields
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Database or server error

Example error response:
```json
{
  "error": "Missing required fields: username, email, password_hash"
}
```

---

## Data Types Reference

### User Fields
- `id`: Integer (auto-generated)
- `username`: String (max 50 chars, unique)
- `email`: String (unique)
- `password_hash`: String
- `first_name`: String (optional)
- `last_name`: String (optional)
- `created_at`: DateTime (auto-generated)
- `is_admin`: Boolean (default: false)

### Project Fields
- `id`: Integer (auto-generated)
- `name`: String (required)
- `description`: String (optional)
- `technologies`: String (comma-separated, required)
- `responsible_id`: Integer (user id, required)
- `expected_members`: Integer (default: 0)
- `location`: String (optional)
- `status`: String (enum: en_cours, terminé, en_pause, annulé)
- `created_at`: DateTime (auto-generated)
- `updated_at`: DateTime (auto-generated)

### Talent Fields
- `id`: Integer (auto-generated)
- `user_id`: Integer (unique per user)
- `technologies`: String (comma-separated, required)
- `description`: String (optional)
- `location`: String (optional)
- `created_at`: DateTime (auto-generated)
- `updated_at`: DateTime (auto-generated)

### Participation Fields
- `id`: Integer (auto-generated)
- `user_id`: Integer (required)
- `project_id`: Integer (required)
- `joined_at`: DateTime (auto-generated)
- Unique constraint: (user_id, project_id)

---

## Quick Test Commands

Run all tests with the provided bash script:
```bash
chmod +x CURL_TESTS.sh
./CURL_TESTS.sh
```

Or run individual tests as needed using the curl commands above.

#!/bin/bash
# API Test Requests for Django Unchained Backend
# Base URL: http://localhost:3000/api

BASE_URL="http://localhost:3000/api"

# =====================================================
# USERS ENDPOINTS
# =====================================================

echo "=== USERS ENDPOINTS ==="

# 1. CREATE USER - Create a new user
echo "1. Creating User 1..."
curl -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password_hash": "$2a$10$hash_example_1",
    "first_name": "John",
    "last_name": "Doe",
    "is_admin": false
  }' | jq '.'

echo -e "\n2. Creating User 2..."
curl -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jane_smith",
    "email": "jane@example.com",
    "password_hash": "$2a$10$hash_example_2",
    "first_name": "Jane",
    "last_name": "Smith",
    "is_admin": false
  }' | jq '.'

echo -e "\n3. Creating User 3 (Admin)..."
curl -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin_user",
    "email": "admin@example.com",
    "password_hash": "$2a$10$hash_example_3",
    "first_name": "Admin",
    "last_name": "User",
    "is_admin": true
  }' | jq '.'

# 2. GET ALL USERS
echo -e "\n4. Getting all users..."
curl -X GET "$BASE_URL/users" | jq '.'

# 3. GET SPECIFIC USER
echo -e "\n5. Getting user with id 1..."
curl -X GET "$BASE_URL/users/1" | jq '.'

# 4. UPDATE USER
echo -e "\n6. Updating user 1..."
curl -X PUT "$BASE_URL/users/1" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Johnny",
    "last_name": "Doe"
  }' | jq '.'

# =====================================================
# PROJECTS ENDPOINTS
# =====================================================

echo -e "\n\n=== PROJECTS ENDPOINTS ==="

# 1. CREATE PROJECT
echo -e "\n7. Creating Project 1..."
curl -X POST "$BASE_URL/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Website Redesign",
    "description": "Complete redesign of company website",
    "technologies": "React,Node.js,PostgreSQL",
    "responsible_id": 1,
    "expected_members": 5,
    "location": "Paris",
    "status": "en_cours"
  }' | jq '.'

echo -e "\n8. Creating Project 2..."
curl -X POST "$BASE_URL/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mobile App Development",
    "description": "iOS and Android mobile application",
    "technologies": "React Native,Firebase",
    "responsible_id": 2,
    "expected_members": 3,
    "location": "Lyon",
    "status": "en_cours"
  }' | jq '.'

echo -e "\n9. Creating Project 3..."
curl -X POST "$BASE_URL/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Data Analytics Dashboard",
    "description": "Real-time analytics dashboard for business metrics",
    "technologies": "Python,Pandas,D3.js,Node.js",
    "responsible_id": 1,
    "expected_members": 4,
    "location": "Bordeaux",
    "status": "terminé"
  }' | jq '.'

# 2. GET ALL PROJECTS
echo -e "\n10. Getting all projects..."
curl -X GET "$BASE_URL/projects" | jq '.'

# 3. GET SPECIFIC PROJECT
echo -e "\n11. Getting project with id 1..."
curl -X GET "$BASE_URL/projects/1" | jq '.'

# 4. UPDATE PROJECT
echo -e "\n12. Updating project 1..."
curl -X PUT "$BASE_URL/projects/1" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "terminé",
    "expected_members": 6
  }' | jq '.'

# 5. GET PROJECT MEMBERS
echo -e "\n13. Getting members of project 1..."
curl -X GET "$BASE_URL/projects/1/members" | jq '.'

# =====================================================
# PARTICIPATIONS ENDPOINTS
# =====================================================

echo -e "\n\n=== PARTICIPATIONS ENDPOINTS ==="

# 1. ADD USER TO PROJECT
echo -e "\n14. Adding user 1 to project 1..."
curl -X POST "$BASE_URL/participations" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "project_id": 1
  }' | jq '.'

echo -e "\n15. Adding user 2 to project 1..."
curl -X POST "$BASE_URL/participations" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 2,
    "project_id": 1
  }' | jq '.'

echo -e "\n16. Adding user 3 to project 2..."
curl -X POST "$BASE_URL/participations" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 3,
    "project_id": 2
  }' | jq '.'

echo -e "\n17. Adding user 1 to project 2..."
curl -X POST "$BASE_URL/participations" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "project_id": 2
  }' | jq '.'

# 2. GET ALL PARTICIPATIONS
echo -e "\n18. Getting all participations..."
curl -X GET "$BASE_URL/participations" | jq '.'

# 3. GET SPECIFIC PARTICIPATION
echo -e "\n19. Getting participation with id 1..."
curl -X GET "$BASE_URL/participations/1" | jq '.'

# 4. GET USER'S PROJECTS
echo -e "\n20. Getting all projects for user 1..."
curl -X GET "$BASE_URL/users/1/participations" | jq '.'

echo -e "\n21. Getting all projects for user 2..."
curl -X GET "$BASE_URL/users/2/participations" | jq '.'

# 5. REMOVE USER FROM PROJECT (by participation id)
echo -e "\n22. Removing participation with id 1..."
curl -X DELETE "$BASE_URL/participations/1" | jq '.'

# 6. REMOVE USER FROM PROJECT (by user and project id)
echo -e "\n23. Removing user 2 from project 1..."
curl -X DELETE "$BASE_URL/participations/user/2/project/1" | jq '.'

# =====================================================
# TALENTS ENDPOINTS
# =====================================================

echo -e "\n\n=== TALENTS ENDPOINTS ==="

# 1. CREATE TALENT PROFILE
echo -e "\n24. Creating talent profile for user 1..."
curl -X POST "$BASE_URL/talents" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "technologies": "React,Vue.js,Node.js,Python,PostgreSQL",
    "description": "Full-stack developer with 5+ years of experience",
    "location": "Paris"
  }' | jq '.'

echo -e "\n25. Creating talent profile for user 2..."
curl -X POST "$BASE_URL/talents" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 2,
    "technologies": "React Native,TypeScript,Firebase,AWS",
    "description": "Mobile developer specialized in cross-platform development",
    "location": "Lyon"
  }' | jq '.'

echo -e "\n26. Creating talent profile for user 3..."
curl -X POST "$BASE_URL/talents" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 3,
    "technologies": "Python,Pandas,Scikit-learn,TensorFlow,PostgreSQL",
    "description": "Data scientist and backend developer",
    "location": "Bordeaux"
  }' | jq '.'

# 2. GET ALL TALENTS
echo -e "\n27. Getting all talent profiles..."
curl -X GET "$BASE_URL/talents" | jq '.'

# 3. GET SPECIFIC TALENT
echo -e "\n28. Getting talent profile with id 1..."
curl -X GET "$BASE_URL/talents/1" | jq '.'

# 4. GET TALENT FOR SPECIFIC USER
echo -e "\n29. Getting talent profile for user 1..."
curl -X GET "$BASE_URL/talents/user/1" | jq '.'

echo -e "\n30. Getting talent profile for user 2..."
curl -X GET "$BASE_URL/talents/user/2" | jq '.'

# 5. UPDATE TALENT PROFILE
echo -e "\n31. Updating talent profile 1..."
curl -X PUT "$BASE_URL/talents/1" \
  -H "Content-Type: application/json" \
  -d '{
    "technologies": "React,Vue.js,Node.js,Python,PostgreSQL,Docker",
    "location": "Île-de-France"
  }' | jq '.'

# 6. DELETE TALENT PROFILE
echo -e "\n32. Deleting talent profile with id 3..."
curl -X DELETE "$BASE_URL/talents/3" | jq '.'

# =====================================================
# USERS WITH TALENTS ENDPOINTS
# =====================================================

echo -e "\n\n=== USERS WITH TALENTS ENDPOINTS ==="

# 1. GET SPECIFIC USER WITH TALENT
echo -e "\n33. Getting user 1 with associated talent..."
curl -X GET "$BASE_URL/users/1/with-talent" | jq '.'

echo -e "\n34. Getting user 2 with associated talent..."
curl -X GET "$BASE_URL/users/2/with-talent" | jq '.'

# 2. GET ALL USERS WITH TALENTS
echo -e "\n35. Getting all users with their talents..."
curl -X GET "$BASE_URL/users-with-talents" | jq '.'

# =====================================================
# ERROR TESTING
# =====================================================

echo -e "\n\n=== ERROR TESTING ==="

echo -e "\n36. Try to get non-existent user..."
curl -X GET "$BASE_URL/users/999" | jq '.'

echo -e "\n37. Try to create user without required fields..."
curl -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }' | jq '.'

echo -e "\n38. Try to add user to non-existent project..."
curl -X POST "$BASE_URL/participations" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "project_id": 999
  }' | jq '.'

echo -e "\n39. Try to delete non-existent project..."
curl -X DELETE "$BASE_URL/projects/999" | jq '.'

echo -e "\n40. Try to get non-existent user with talent..."
curl -X GET "$BASE_URL/users/999/with-talent" | jq '.'

echo -e "\n\nAll tests completed!"

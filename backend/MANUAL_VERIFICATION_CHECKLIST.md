# Manual Verification Checklist - Task Lifecycle

## Prerequisites
- Backend server running on PORT (default: 5000)
- MongoDB connected
- Two test users created and authenticated

---

## Test Setup

### 1. Create Test Users
```bash
# User A (Task Creator)
POST /api/auth/register
{
  "name": "Alice Creator",
  "email": "alice@test.com",
  "password": "password123",
  "skills": ["design", "writing"]
}
# Save JWT token as TOKEN_A

# User B (Task Helper)
POST /api/auth/register
{
  "name": "Bob Helper",
  "email": "bob@test.com",
  "password": "password123",
  "skills": ["coding", "testing"]
}
# Save JWT token as TOKEN_B
```

### 2. Verify Initial Balances
```bash
# Both users should start with 100 points
GET /api/users/profile
Authorization: Bearer TOKEN_A

Expected Response:
{
  "points": 100,
  "tasksPosted": 0,
  "tasksCompleted": 0
}
```

---

## Core Flow Test

### ✅ Test 1: User A Creates Task With Points

**Action:**
```bash
POST /api/tasks
Authorization: Bearer TOKEN_A
Content-Type: application/json

{
  "title": "Need help with React component",
  "description": "Looking for someone to review my code",
  "skillsRequired": ["coding", "react"],
  "points": 25
}
```

**Expected Response:**
- Status: `201 Created`
- Task object with `status: "open"`
- `createdBy` references Alice
- User stats show `tasksPosted: 1`, `points: 100` (no deduction yet)

**Verification Checklist:**
- [ ] Task created successfully
- [ ] Task status is "open"
- [ ] Alice's `tasksPosted` incremented to 1
- [ ] Alice's `points` still 100 (no deduction at creation)
- [ ] Task shows `createdBy` with Alice's ID
- [ ] Task has no `acceptedBy` value
- [ ] Task has no `completedAt` value

**Save:** `TASK_ID` from response

---

### ✅ Test 2: User B Accepts Task

**Action:**
```bash
POST /api/tasks/TASK_ID/accept
Authorization: Bearer TOKEN_B
```

**Expected Response:**
- Status: `200 OK`
- Task object with `status: "accepted"`
- `acceptedBy` references Bob
- Message: "Task accepted successfully!"

**Verification Checklist:**
- [ ] Task status changed to "accepted"
- [ ] `acceptedBy` now references Bob's ID
- [ ] Task still has no `completedAt` value
- [ ] Bob can see task in his accepted tasks

---

### ✅ Test 3: User A Completes Task

**Action:**
```bash
POST /api/tasks/TASK_ID/complete
Authorization: Bearer TOKEN_A
```

**Expected Response:**
- Status: `200 OK`
- Task `status: "completed"`
- `completedAt` timestamp exists
- `pointsTransferred` object shows transfer details
- Updated user stats

**Verification Checklist:**
- [ ] Task status is "completed"
- [ ] `completedAt` timestamp is set
- [ ] Alice's `points` reduced to 75 (100 - 25)
- [ ] Bob's `points` increased to 125 (100 + 25)
- [ ] Bob's `tasksCompleted` incremented to 1
- [ ] Response includes point transfer details

**Verify Point Transfer Math:**
```
Alice Before: 100
Alice After:  75  (deducted 25)
Bob Before:   100
Bob After:    125 (credited 25)
Total:        200 (conserved)
```

---

## Invalid Action Tests

### ❌ Test 4: User A Cannot Accept Own Task

**Action:**
```bash
POST /api/tasks/NEW_TASK_ID/accept
Authorization: Bearer TOKEN_A
```

**Expected Response:**
- Status: `403 Forbidden`
- Error: "You cannot accept a task you created"

**Verification:**
- [ ] Request rejected
- [ ] Clear error message returned
- [ ] Task remains in "open" status
- [ ] No `acceptedBy` value set

---

### ❌ Test 5: Cannot Accept Already Accepted Task

**Setup:** Create new task, have User B accept it

**Action:**
```bash
# User C tries to accept the same task
POST /api/tasks/ACCEPTED_TASK_ID/accept
Authorization: Bearer TOKEN_C
```

**Expected Response:**
- Status: `400 Bad Request`
- Error: "Cannot accept this task. It may have been accepted by another user"
- Current status information

**Verification:**
- [ ] Request rejected
- [ ] Original acceptor (User B) unchanged
- [ ] Clear error with current status

---

### ❌ Test 6: Cannot Complete Open Task

**Setup:** Create new task but don't accept it

**Action:**
```bash
POST /api/tasks/OPEN_TASK_ID/complete
Authorization: Bearer TOKEN_A
```

**Expected Response:**
- Status: `400 Bad Request`
- Error: "Cannot complete task. Task status is 'open'. Only 'accepted' tasks can be completed."

**Verification:**
- [ ] Request rejected
- [ ] Task remains in "open" status
- [ ] No point transfers occurred
- [ ] Error includes current status

---

### ❌ Test 7: Non-Creator Cannot Complete Task

**Setup:** User A creates task, User B accepts it

**Action:**
```bash
# User B (helper) tries to complete
POST /api/tasks/TASK_ID/complete
Authorization: Bearer TOKEN_B
```

**Expected Response:**
- Status: `403 Forbidden`
- Error: "Only the task creator can mark this task as completed"

**Verification:**
- [ ] Request rejected
- [ ] Task remains in "accepted" status
- [ ] No point transfers occurred
- [ ] Authorization error clear

---

### ❌ Test 8: Cannot Accept Completed Task

**Setup:** Complete a task through full lifecycle

**Action:**
```bash
POST /api/tasks/COMPLETED_TASK_ID/accept
Authorization: Bearer TOKEN_C
```

**Expected Response:**
- Status: `400 Bad Request`
- Error: "Cannot accept this task. It may have been accepted by another user or is no longer available."
- Shows current status as "completed"

**Verification:**
- [ ] Request rejected
- [ ] Task remains "completed"
- [ ] Error message explains why

---

### ❌ Test 9: Cannot Complete Task Twice

**Setup:** Complete a task successfully

**Action:**
```bash
# Try completing again
POST /api/tasks/COMPLETED_TASK_ID/complete
Authorization: Bearer TOKEN_A
```

**Expected Response:**
- Status: `400 Bad Request`
- Error: "This task has already been completed"
- `idempotent: true` flag
- Original `completedAt` timestamp

**Verification:**
- [ ] Request rejected (idempotent)
- [ ] No additional point transfers
- [ ] User balances unchanged
- [ ] `completedAt` timestamp unchanged

---

### ❌ Test 10: Cannot Create Task With Insufficient Points

**Setup:** User with low balance (create tasks until balance < 25)

**Action:**
```bash
POST /api/tasks
Authorization: Bearer TOKEN_LOW_BALANCE
{
  "title": "Expensive task",
  "points": 150
}
```

**Expected Response:**
- Status: `400 Bad Request`
- Error: "Insufficient points balance"
- Shows available, required, and deficit

**Verification:**
- [ ] Task creation rejected
- [ ] Clear error with point breakdown
- [ ] User's `tasksPosted` not incremented
- [ ] No task document created

---

## Edge Case Tests

### 🔧 Test 11: Race Condition - Simultaneous Accept

**Setup:** Have two users (B and C) attempt to accept same task simultaneously

**Expected Behavior:**
- Only one accept succeeds (atomic database operation)
- Second request receives "already accepted" error
- No data corruption

**Verification:**
- [ ] Only one user becomes `acceptedBy`
- [ ] Second request gets clear rejection
- [ ] Task status consistent

---

### 🔧 Test 12: Transaction Rollback

**Setup:** Simulate failure during completion (e.g., helper user deleted mid-transaction)

**Expected Behavior:**
- All changes rolled back
- No partial updates
- Clear error message

**Verification:**
- [ ] Creator balance unchanged
- [ ] Task status unchanged
- [ ] Helper stats unchanged
- [ ] Clear error returned

---

## Final Verification Summary

### Point Conservation Check
After all tests, verify total points in system:
```
Sum of all user points = Initial total (e.g., 200 if 2 users × 100)
```

### Task State Integrity
```bash
GET /api/tasks
```

Verify:
- [ ] All tasks have valid `status` ("open", "accepted", or "completed")
- [ ] Completed tasks have `completedAt` timestamps
- [ ] Accepted/Completed tasks have valid `acceptedBy` references
- [ ] No orphaned references (deleted users)

### User Stats Accuracy
For each user:
```bash
GET /api/users/profile
Authorization: Bearer TOKEN
```

Verify:
- [ ] `tasksPosted` matches created tasks count
- [ ] `tasksCompleted` matches completed tasks as helper
- [ ] `points` >= 0 (never negative)

---

## Automation Script Template

```bash
#!/bin/bash
API_BASE="http://localhost:5000/api"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "Starting Task Lifecycle Manual Verification..."

# Register User A
echo "1. Creating User A (Creator)..."
TOKEN_A=$(curl -s -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@test.com","password":"pass123"}' \
  | jq -r '.token')

# Register User B
echo "2. Creating User B (Helper)..."
TOKEN_B=$(curl -s -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob","email":"bob@test.com","password":"pass123"}' \
  | jq -r '.token')

# Create Task
echo "3. User A creates task..."
TASK_ID=$(curl -s -X POST "$API_BASE/tasks" \
  -H "Authorization: Bearer $TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","description":"Test","points":25}' \
  | jq -r '.task._id')

echo "Task ID: $TASK_ID"

# Accept Task
echo "4. User B accepts task..."
curl -s -X POST "$API_BASE/tasks/$TASK_ID/accept" \
  -H "Authorization: Bearer $TOKEN_B"

# Complete Task
echo "5. User A completes task..."
curl -s -X POST "$API_BASE/tasks/$TASK_ID/complete" \
  -H "Authorization: Bearer $TOKEN_A" \
  | jq '.pointsTransferred'

echo -e "${GREEN}✓ Core flow complete${NC}"
```

---

## Test Results Template

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | Create Task | ☐ Pass / ☐ Fail | |
| 2 | Accept Task | ☐ Pass / ☐ Fail | |
| 3 | Complete Task | ☐ Pass / ☐ Fail | |
| 4 | Block Self-Accept | ☐ Pass / ☐ Fail | |
| 5 | Block Double Accept | ☐ Pass / ☐ Fail | |
| 6 | Block Complete Open | ☐ Pass / ☐ Fail | |
| 7 | Block Non-Creator Complete | ☐ Pass / ☐ Fail | |
| 8 | Block Accept Completed | ☐ Pass / ☐ Fail | |
| 9 | Block Duplicate Complete | ☐ Pass / ☐ Fail | |
| 10 | Block Insufficient Points | ☐ Pass / ☐ Fail | |
| 11 | Race Condition Handling | ☐ Pass / ☐ Fail | |
| 12 | Transaction Rollback | ☐ Pass / ☐ Fail | |

**Overall Result:** ☐ All Pass / ☐ Some Failures

**Tester Name:** _______________  
**Date:** _______________  
**Environment:** ☐ Development / ☐ Staging / ☐ Production

# Centralized API Service Documentation

## Overview

The centralized API service (`frontend/src/services/api.js`) provides a unified way to interact with the backend API. It handles authentication, error management, and provides reusable methods for all API endpoints.

## Features

✅ **Base URL Configuration** - Uses environment variable for easy switching between dev/prod
✅ **Auto Token Injection** - Automatically attaches Authorization header to all requests
✅ **Global 401 Handling** - Automatically logs out users when session expires
✅ **TypeScript-Ready** - Structured methods with JSDoc comments
✅ **Error Handling** - Centralized error interceptor for consistent error management

## Configuration

### Environment Variables

Create a `.env` file in the `frontend/` directory:

```bash
VITE_API_BASE_URL=https://s62-johnrobert-capstone-skillsamaritan.onrender.com/api

# For local development:
# VITE_API_BASE_URL=http://localhost:5000/api
```

## Usage Examples

### Authentication

```javascript
import { authAPI } from '../services/api';

// Login
try {
  const response = await authAPI.login({
    email: 'user@example.com',
    password: 'password123'
  });
  console.log(response.data); // { token, user }
} catch (error) {
  console.error(error.response?.data?.message);
}

// Signup
const response = await authAPI.signup({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  skills: 'JavaScript, React'
});

// Get Profile
const profile = await authAPI.getProfile();
```

### Tasks

```javascript
import { taskAPI } from '../services/api';

// Get all tasks
const response = await taskAPI.getAllTasks();
const tasks = response.data;

// Get task by ID
const task = await taskAPI.getTaskById('task123');

// Create task
const newTask = await taskAPI.createTask({
  title: 'Help with React',
  description: 'Need help debugging',
  points: 50,
  skillsRequired: ['React', 'JavaScript']
});

// Accept task
await taskAPI.acceptTask('task123');

// Complete task
await taskAPI.completeTask('task123');

// Update task
await taskAPI.updateTask('task123', {
  title: 'Updated title',
  points: 75
});

// Delete task
await taskAPI.deleteTask('task123');

// Get tasks with filters
const filtered = await taskAPI.getAllTasks({
  status: 'open',
  search: 'react'
});
```

### Users

```javascript
import { userAPI } from '../services/api';

// Get all users
const users = await userAPI.getAllUsers();

// Get user by ID
const user = await userAPI.getUserById('user123');

// Update user
await userAPI.updateUser('user123', {
  name: 'Updated Name',
  bio: 'New bio'
});

// Get user's tasks
const userTasks = await userAPI.getUserTasks('user123');
```

## Advanced Usage

### Using the Raw Axios Instance

If you need to make custom requests:

```javascript
import api from '../services/api';

// Custom GET request
const response = await api.get('/custom-endpoint');

// Custom POST request
const response = await api.post('/custom-endpoint', {
  data: 'value'
});
```

### Error Handling

The API service automatically handles common errors:

```javascript
try {
  await taskAPI.acceptTask('invalid-id');
} catch (error) {
  // Error is automatically caught and formatted
  console.error(error.response?.data?.message || 'An error occurred');
}
```

### 401 Unauthorized Handling

When a 401 error occurs (session expired):
1. Token and user data are automatically cleared from localStorage
2. User is redirected to `/login`
3. An error message is shown: "Session expired. Please login again."

## Interceptors

### Request Interceptor

Automatically attaches the Authorization header:

```javascript
// Before each request
headers: {
  Authorization: `Bearer ${token}`
}
```

### Response Interceptor

Handles 401 errors globally:

```javascript
if (error.response.status === 401) {
  // Clear auth data
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Redirect to login
  window.location.href = '/login';
}
```

## Migration Guide

### Before (Direct Axios)

```javascript
import axios from 'axios';

const response = await axios.get(
  'https://s62-johnrobert-capstone-skillsamaritan.onrender.com/api/tasks',
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }
);
```

### After (Centralized API)

```javascript
import { taskAPI } from '../services/api';

const response = await taskAPI.getAllTasks();
```

## Benefits

1. **Consistency** - All API calls use the same configuration
2. **Maintainability** - Change base URL or headers in one place
3. **Type Safety** - JSDoc comments provide intellisense
4. **Error Handling** - Consistent error handling across the app
5. **Security** - Token management handled automatically
6. **Testability** - Easier to mock API calls in tests

## API Methods Reference

### authAPI
- `login(credentials)` - Login user
- `signup(userData)` - Register new user
- `getProfile()` - Get current user profile

### taskAPI
- `getAllTasks(params)` - Get all tasks (with optional filters)
- `getTaskById(taskId)` - Get single task
- `createTask(taskData)` - Create new task
- `acceptTask(taskId)` - Accept a task
- `completeTask(taskId)` - Complete a task
- `updateTask(taskId, taskData)` - Update task
- `deleteTask(taskId)` - Delete task

### userAPI
- `getAllUsers()` - Get all users
- `getUserById(userId)` - Get user by ID
- `updateUser(userId, userData)` - Update user profile
- `getUserTasks(userId)` - Get user's tasks

## Notes

- All methods return the full Axios response object
- Access response data via `response.data`
- Token is automatically attached to all requests
- No need to manually include Authorization headers
- 401 errors are handled globally, no manual logout needed

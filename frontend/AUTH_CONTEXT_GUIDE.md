# AuthContext Usage Guide

## What's Been Implemented

The AuthContext has been successfully created and integrated into your application. Here's what's available:

### Files Created/Modified:

1. **`frontend/src/context/AuthContext.jsx`** - Main authentication context
2. **`frontend/src/components/ProtectedRoute.jsx`** - Route protection component
3. **`frontend/src/main.jsx`** - Wrapped app with AuthProvider
4. **`frontend/src/App.jsx`** - Added ProtectedRoute to secure routes
5. **`frontend/src/components/Header.jsx`** - Shows login/logout based on auth state
6. **`frontend/src/components/LoginForm.jsx`** - Uses AuthContext for login
7. **`frontend/src/components/SignupForm.jsx`** - Uses AuthContext for signup

## Using AuthContext in Components

### Import the Hook:
```javascript
import { useAuth } from '../context/AuthContext';
```

### Available Properties & Methods:

```javascript
const { 
  user,              // Current user object (name, email, points, etc.)
  token,             // JWT token
  login,             // Function: login(token, userData)
  logout,            // Function: logout()
  isAuthenticated,   // Boolean: true if user is logged in
  loading            // Boolean: true while checking auth on app load
} = useAuth();
```

## Common Use Cases

### 1. Display User Information:
```javascript
const MyComponent = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated && (
        <p>Welcome, {user.name}! You have {user.points} points.</p>
      )}
    </div>
  );
};
```

### 2. Conditional Rendering:
```javascript
const Navigation = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav>
      {isAuthenticated ? (
        <Link to="/dashboard">Dashboard</Link>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};
```

### 3. Making Authenticated API Calls:
```javascript
const MyComponent = () => {
  const { token } = useAuth();

  const fetchData = async () => {
    const response = await axios.get('/api/data', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  };

  // Use fetchData...
};
```

### 4. Logout Functionality:
```javascript
const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return <button onClick={handleLogout}>Logout</button>;
};
```

## Protected Routes

Routes that require authentication are already wrapped with `<ProtectedRoute>`:
- `/create-task`
- `/tasks`
- `/tasks/:id`

To add more protected routes:
```javascript
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } 
/>
```

## Next Steps

1. **Create Dashboard Page**: The login redirects to `/dashboard` but this route doesn't exist yet
2. **Create API Service**: Consider creating `frontend/src/services/api.js` to centralize API calls with automatic token injection
3. **Add Error Boundary**: Handle auth errors gracefully
4. **Implement Token Refresh**: Add logic to refresh expired tokens

## Token Management

The AuthContext automatically:
- ✅ Reads token from localStorage on app load
- ✅ Stores token in state and localStorage on login
- ✅ Removes token on logout
- ✅ Provides isAuthenticated boolean
- ✅ Shows loading state during initial auth check

## Security Notes

- Tokens are stored in localStorage (consider HttpOnly cookies for production)
- Protected routes automatically redirect to `/login` if not authenticated
- Consider implementing token expiration checks
- Add HTTPS in production to secure token transmission

# SkillSamaritan - A Local Skill-Sharing Platform

## Project Structure
```text
SkillSamaritan/
├── backend/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── components/
│   ├── pages/
│   └── App.jsx
```

## Problem Statement
People often possess unique skills but lack a platform to share them locally and effectively. Many individuals either struggle to find learning opportunities from skilled individuals or have difficulty completing tasks due to a lack of assistance. There is no structured way to exchange such essential yet simple skills within a community.

## Technical Analysis
### MongoDB
- Store user profiles and their skillsets.
- Manage tasks posted, accepted, and completed.
- Handle points transactions, leaderboards, and friendships.
- Store reviews, ratings, and community data.

### Express/Node.js
- User authentication and authorization.
- API endpoints for CRUD operations (tasks, profiles, points, friendships).
- Handle server-side logic for the points system, leaderboard, and friendship/requests.

### React
- Build an interactive, responsive user interface.
- Create forms for task creation, skill inputs, and help requests.
- Display dashboards for tasks, points, leaderboards, and friendships.
- Include visualizations (charts/graphs) for user activity, help requests, and performance.

### Other Tools
- **Payment Gateway API**: Allow users to purchase additional points if needed.
- **Geolocation API**: Help users find skill matches or tasks within their locality.
- **Notification Services (e.g., Firebase or Socket.io)**: Enable real-time notifications (e.g., task updates, friend requests, help request responses).
- **Google Calendar and Meet API**: Generate and manage Google Meet links for task collaboration and integrate scheduling.

## Core Features
### User Management
- User registration and login (with role-based access).
- Profile creation with skill tags, bio, location, and a friendship system.
- Ability to befriend other users and send/receive help requests.

### Task Posting and Skill Sharing
- Users can post tasks and offer points as rewards.
- Others can accept tasks based on their skill sets.
- Direct help requests between friends (no need to post publicly).
- Escrow system to hold points until task completion (for non-friends).

### Points and Rewards System
- Initial signup provides bonus points for users.
- Earn points for completing tasks and redeem them for rewards.
- Redeem points for coupons, vouchers, or premium features.
- Leaderboard system based on points.

### Community Features
- Public feed to post and browse tasks or skill requests.
- Direct messaging for friends and task collaborations.
- Comment sections for task discussions.
- Bookmarking favorite tasks or collaborators.

### Gamification
- Points leaderboard to foster healthy competition.
- Badges for milestones (e.g., "Top Contributor," "Fast Learner").
- Exclusive rewards for top users.

### Search and Filters
- Search tasks based on skills, point range, or location.
- Filter tasks by urgency, difficulty, or rating.

## Advanced Features (Future Scope)
- Personalized recommendations for tasks based on interests or skill sets.
- Verified skill certifications to add credibility to users.
- Virtual workshops or group skill-sharing events.
- Google Calendar integration to schedule tasks and sync with task deadlines.
- Seamless Google Meet link generation for virtual task collaborations.
- Real-time notifications to alert users when someone needs their skills or assistance.

## Friendship Concept (Future Scope)
### Friendship System
- Users can befriend each other to engage in mutual help without the need for point exchange.
- Friendship requests and notifications to approve or reject friendship requests.
- No points are required for tasks completed between friends, encouraging collaboration and building stronger community bonds.
- The friendship system will allow users to have a trusted circle for help, reducing task costs in terms of points.

## THANK YOU

Backend Deployment Link : https://s62-johnrobert-capstone-skillsamaritan.onrender.com

Frontend deployment Link : https://s62-john-robert-capstone-skill-sama.vercel.app/




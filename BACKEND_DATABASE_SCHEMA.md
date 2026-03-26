# Queue Management System - Backend Database Schema
## Java Sprint Boot + MySQL/PostgreSQL

Based on your React frontend analysis, here are all the database entities you need to create:

---

## 1. USER ENTITY (Core Authentication & Profile)
```sql
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- Store encrypted/hashed
    phone VARCHAR(20) NOT NULL,
    preferred_branch_id BIGINT,
    member_since TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (preferred_branch_id) REFERENCES branches(branch_id)
);
```

### Java Entity:
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    
    @Column(nullable = false)
    private String fullName;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String phone;
    
    @ManyToOne
    @JoinColumn(name = "preferred_branch_id")
    private Branch preferredBranch;
    
    @Column(nullable = false)
    private LocalDateTime memberSince;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
```

---

## 2. BRANCH ENTITY (Physical Locations)
```sql
CREATE TABLE branches (
    branch_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500),
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Data to Insert:
```sql
INSERT INTO branches (name, address, icon) VALUES
('Downtown Branch', 'Downtown Area', '📍'),
('Airport Plaza', 'Near Airport', '✈️'),
('City Center', 'Main City Center', '🏙️'),
('Mall Location', 'Shopping Mall', '🛍️'),
('North Branch', 'North Area', '🏢');
```

### Java Entity:
```java
@Entity
@Table(name = "branches")
public class Branch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long branchId;
    
    @Column(nullable = false)
    private String name;
    
    @Column
    private String address;
    
    @Column
    private String icon;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @OneToMany(mappedBy = "branch", cascade = CascadeType.ALL)
    private List<Queue> queues = new ArrayList<>();
    
    @OneToMany(mappedBy = "branch", cascade = CascadeType.ALL)
    private List<ServiceCounter> serviceCounters = new ArrayList<>();
}
```

---

## 3. SERVICE ENTITY (Available Services)
```sql
CREATE TABLE services (
    service_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    avg_wait_time INT DEFAULT 0,  -- in minutes
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Data to Insert:
```sql
INSERT INTO services (name, icon, avg_wait_time) VALUES
('Customer Service', '👨‍💼', 15),
('Banking', '🏦', 8),
('Mobile Recharge', '📱', 5),
('Bill Payment', '💳', 12),
('General Inquiry', '❓', 20),
('Document Verification', '📄', 25);
```

### Java Entity:
```java
@Entity
@Table(name = "services")
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long serviceId;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column
    private String icon;
    
    @Column(nullable = false)
    private Integer avgWaitTime = 0;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL)
    private List<Queue> queues = new ArrayList<>();
}
```

---

## 4. QUEUE ENTITY (Main Queue Management)
```sql
CREATE TABLE queues (
    queue_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    token VARCHAR(50) UNIQUE NOT NULL,  -- e.g., Q-0001 or VIP-001
    user_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    branch_id BIGINT NOT NULL,
    position INT NOT NULL,
    status ENUM('WAITING', 'CALLED', 'BEING_SERVED', 'COMPLETED', 'CANCELLED') DEFAULT 'WAITING',
    priority ENUM('NORMAL', 'SILVER', 'GOLD', 'PLATINUM') DEFAULT 'NORMAL',
    joined_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    called_time TIMESTAMP NULL,
    serve_start_time TIMESTAMP NULL,
    completed_time TIMESTAMP NULL,
    estimated_wait_time INT DEFAULT 0,  -- in minutes
    actual_service_duration INT DEFAULT 0,  -- in minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (service_id) REFERENCES services(service_id),
    FOREIGN KEY (branch_id) REFERENCES branches(branch_id),
    INDEX (token),
    INDEX (status),
    INDEX (branch_id)
);
```

### Java Entity:
```java
@Entity
@Table(name = "queues")
public class Queue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long queueId;
    
    @Column(unique = true, nullable = false)
    private String token;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;
    
    @ManyToOne
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;
    
    @Column(nullable = false)
    private Integer position;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QueueStatus status = QueueStatus.WAITING;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PriorityLevel priority = PriorityLevel.NORMAL;
    
    @Column(nullable = false)
    private LocalDateTime joinedTime;
    
    @Column
    private LocalDateTime calledTime;
    
    @Column
    private LocalDateTime serveStartTime;
    
    @Column
    private LocalDateTime completedTime;
    
    @Column
    private Integer estimatedWaitTime = 0;
    
    @Column
    private Integer actualServiceDuration = 0;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}

public enum QueueStatus {
    WAITING, CALLED, BEING_SERVED, COMPLETED, CANCELLED
}

public enum PriorityLevel {
    NORMAL, SILVER, GOLD, PLATINUM
}
```

---

## 5. SERVICE COUNTER ENTITY (Counters/Windows)
```sql
CREATE TABLE service_counters (
    counter_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    branch_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    counter_number INT NOT NULL,
    status ENUM('AVAILABLE', 'BUSY', 'MAINTENANCE') DEFAULT 'AVAILABLE',
    current_token VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(branch_id),
    FOREIGN KEY (service_id) REFERENCES services(service_id)
);
```

### Java Entity:
```java
@Entity
@Table(name = "service_counters")
public class ServiceCounter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long counterId;
    
    @ManyToOne
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;
    
    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;
    
    @Column(nullable = false)
    private Integer counterNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CounterStatus status = CounterStatus.AVAILABLE;
    
    @Column
    private String currentToken;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}

public enum CounterStatus {
    AVAILABLE, BUSY, MAINTENANCE
}
```

---

## 6. NOTIFICATION ENTITY (Notification System)
```sql
CREATE TABLE notifications (
    notification_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    type ENUM('SUCCESS', 'WARNING', 'INFO', 'ALERT') DEFAULT 'INFO',
    title VARCHAR(255) NOT NULL,
    message VARCHAR(1000) NOT NULL,
    queue_id BIGINT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (queue_id) REFERENCES queues(queue_id),
    INDEX (user_id),
    INDEX (is_read),
    INDEX (created_at)
);
```

### Java Entity:
```java
@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type = NotificationType.INFO;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;
    
    @ManyToOne
    @JoinColumn(name = "queue_id")
    private Queue queue;
    
    @Column(nullable = false)
    private Boolean isRead = false;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}

public enum NotificationType {
    SUCCESS, WARNING, INFO, ALERT
}
```

---

## 7. PRIORITY USER ENTITY (VIP Management)
```sql
CREATE TABLE priority_users (
    priority_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE NOT NULL,
    tier ENUM('SILVER', 'GOLD', 'PLATINUM') NOT NULL,
    skip_positions INT DEFAULT 0,  -- How many people to skip
    benefits TEXT,
    is_active BOOLEAN DEFAULT true,
    activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

### Java Entity:
```java
@Entity
@Table(name = "priority_users")
public class PriorityUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long priorityId;
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PriorityTier tier;
    
    @Column(nullable = false)
    private Integer skipPositions = 0;
    
    @Column(columnDefinition = "TEXT")
    private String benefits;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @Column(nullable = false)
    private LocalDateTime activatedAt;
    
    @Column
    private LocalDateTime expiresAt;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}

public enum PriorityTier {
    SILVER, GOLD, PLATINUM
}
```

---

## 8. CROWD LEVEL ENTITY (Real-time Capacity)
```sql
CREATE TABLE crowd_levels (
    crowd_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    branch_id BIGINT NOT NULL UNIQUE,
    capacity INT DEFAULT 100,  -- Max capacity %
    percentage_filled INT NOT NULL,
    level ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL,
    trend ENUM('UP', 'DOWN', 'STABLE') DEFAULT 'STABLE',
    avg_wait_time INT DEFAULT 0,  -- in minutes
    total_people_waiting INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(branch_id)
);
```

### Java Entity:
```java
@Entity
@Table(name = "crowd_levels")
public class CrowdLevel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long crowdId;
    
    @OneToOne
    @JoinColumn(name = "branch_id", nullable = false, unique = true)
    private Branch branch;
    
    @Column(nullable = false)
    private Integer capacity = 100;
    
    @Column(nullable = false)
    private Integer percentageFilled;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CrowdLevel crowdLevel;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Trend trend = Trend.STABLE;
    
    @Column(nullable = false)
    private Integer avgWaitTime = 0;
    
    @Column(nullable = false)
    private Integer totalPeopleWaiting = 0;
    
    @Column(nullable = false)
    private LocalDateTime lastUpdated;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}

public enum CrowdLevel {
    LOW, MEDIUM, HIGH
}

public enum Trend {
    UP, DOWN, STABLE
}
```

---

## 9. USER PREFERENCES ENTITY (Settings & Preferences)
```sql
CREATE TABLE user_preferences (
    preference_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE NOT NULL,
    theme VARCHAR(50) DEFAULT 'dark',  -- dark, light
    language VARCHAR(50) DEFAULT 'English',
    time_format VARCHAR(50) DEFAULT '12-hour',  -- 12-hour, 24-hour
    auto_refresh BOOLEAN DEFAULT true,
    
    -- Notification Preferences
    queue_updates BOOLEAN DEFAULT true,
    wait_time_alerts BOOLEAN DEFAULT true,
    promotions BOOLEAN DEFAULT false,
    system_notifications BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    
    -- Privacy Preferences
    profile_public BOOLEAN DEFAULT false,
    allow_data_collection BOOLEAN DEFAULT true,
    show_online_status BOOLEAN DEFAULT true,
    share_analytics BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

### Java Entity:
```java
@Entity
@Table(name = "user_preferences")
public class UserPreferences {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long preferenceId;
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    
    @Column(nullable = false)
    private String theme = "dark";
    
    @Column(nullable = false)
    private String language = "English";
    
    @Column(nullable = false)
    private String timeFormat = "12-hour";
    
    @Column(nullable = false)
    private Boolean autoRefresh = true;
    
    // Notification Settings
    @Column(nullable = false)
    private Boolean queueUpdates = true;
    
    @Column(nullable = false)
    private Boolean waitTimeAlerts = true;
    
    @Column(nullable = false)
    private Boolean promotions = false;
    
    @Column(nullable = false)
    private Boolean systemNotifications = true;
    
    @Column(nullable = false)
    private Boolean emailNotifications = true;
    
    @Column(nullable = false)
    private Boolean smsNotifications = false;
    
    // Privacy Settings
    @Column(nullable = false)
    private Boolean profilePublic = false;
    
    @Column(nullable = false)
    private Boolean allowDataCollection = true;
    
    @Column(nullable = false)
    private Boolean showOnlineStatus = true;
    
    @Column(nullable = false)
    private Boolean shareAnalytics = false;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
```

---

## 10. BRANCH SERVICE MAPPING (Many-to-Many)
```sql
CREATE TABLE branch_services (
    branch_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    PRIMARY KEY (branch_id, service_id),
    FOREIGN KEY (branch_id) REFERENCES branches(branch_id),
    FOREIGN KEY (service_id) REFERENCES services(service_id)
);
```

### Data to Insert:
```sql
-- Each branch has multiple services
INSERT INTO branch_services VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),  -- Downtown has all services
(2, 1), (2, 2), (2, 3), (2, 5),  -- Airport Plaza
(3, 1), (3, 3), (3, 4), (3, 5), (3, 6),  -- City Center
(4, 2), (4, 3), (4, 4),  -- Mall
(5, 1), (5, 5), (5, 6);  -- North Branch
```

---

## 11. ADMIN/STAFF ENTITY (Optional but Recommended)
```sql
CREATE TABLE admin_staff (
    staff_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    branch_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('ADMIN', 'MANAGER', 'SUPERVISOR', 'OPERATOR') NOT NULL,
    password VARCHAR(255) NOT NULL,
    status ENUM('ACTIVE', 'OFFLINE', 'ON_BREAK') DEFAULT 'ACTIVE',
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(branch_id)
);
```

### Java Entity:
```java
@Entity
@Table(name = "admin_staff")
public class AdminStaff {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long staffId;
    
    @ManyToOne
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;
    
    @Column(nullable = false)
    private String name;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StaffRole role;
    
    @Column(nullable = false)
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StaffStatus status = StaffStatus.ACTIVE;
    
    @Column
    private String phone;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}

public enum StaffRole {
    ADMIN, MANAGER, SUPERVISOR, OPERATOR
}

public enum StaffStatus {
    ACTIVE, OFFLINE, ON_BREAK
}
```

---

## 12. QUEUE HISTORY/ANALYTICS (Optional but Recommended)
```sql
CREATE TABLE queue_history (
    history_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    branch_id BIGINT NOT NULL,
    token VARCHAR(50),
    joined_date DATE NOT NULL,
    wait_duration INT,  -- in minutes
    service_duration INT,  -- in minutes
    status VARCHAR(50),
    priority VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (service_id) REFERENCES services(service_id),
    FOREIGN KEY (branch_id) REFERENCES branches(branch_id),
    INDEX (user_id),
    INDEX (joined_date)
);
```

---

## Database Relationships Summary

```
USER
  ├── 1:N → QUEUE (user_id)
  ├── 1:1 → PRIORITY_USER (user_id)
  ├── 1:1 → USER_PREFERENCES (user_id)
  ├── N:1 → BRANCH (preferred_branch_id)
  └── 1:N → NOTIFICATION (user_id)

BRANCH
  ├── 1:N → QUEUE (branch_id)
  ├── 1:N → SERVICE_COUNTER (branch_id)
  ├── 1:1 → CROWD_LEVEL (branch_id)
  ├── 1:N → ADMIN_STAFF (branch_id)
  └── M:N → SERVICE (through BRANCH_SERVICES)

SERVICE
  ├── 1:N → QUEUE (service_id)
  ├── 1:N → SERVICE_COUNTER (service_id)
  └── M:N → BRANCH (through BRANCH_SERVICES)

QUEUE
  ├── N:1 → USER
  ├── N:1 → SERVICE
  ├── N:1 → BRANCH
  ├── 1:N → NOTIFICATION
  └── (Stores historical data → QUEUE_HISTORY)

PRIORITY_USER
  └── 1:1 → USER

NOTIFICATION
  ├── N:1 → USER
  └── N:1 → QUEUE (optional)

USER_PREFERENCES
  └── 1:1 → USER

SERVICE_COUNTER
  ├── N:1 → BRANCH
  └── N:1 → SERVICE

CROWD_LEVEL
  └── 1:1 → BRANCH

ADMIN_STAFF
  └── N:1 → BRANCH
```

---

## Key API Endpoints to Implement

### Authentication
- `POST /api/auth/register` - User signup
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - Logout

### Queue Management
- `POST /api/queues/join` - Join queue
- `GET /api/queues/{queueId}` - Get queue details
- `GET /api/queues/user/{userId}` - Get user's current queues
- `PUT /api/queues/{queueId}/cancel` - Cancel queue entry
- `GET /api/queues/track/{token}` - Track by token

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/notifications` - Get notifications

### Admin
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/queues/by-branch` - Queue stats by branch
- `GET /api/admin/staff` - Manage staff
- `POST /api/admin/priority/upgrade` - Upgrade user to priority

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/{id}/read` - Mark as read
- `DELETE /api/notifications/{id}` - Delete notification

### Settings
- `GET /api/settings/preferences` - Get user preferences
- `PUT /api/settings/preferences` - Update preferences
- `GET /api/settings/profile` - Get profile
- `PUT /api/settings/profile` - Update profile

### Public/Shared
- `GET /api/branches` - Get all branches
- `GET /api/services` - Get all services
- `GET /api/crowd-levels` - Get crowd levels for all branches
- `GET /api/crowd-levels/{branchId}` - Get crowd level for specific branch

---

## Summary - Total Entities: 12

1. ✅ User
2. ✅ Branch
3. ✅ Service
4. ✅ Queue
5. ✅ ServiceCounter
6. ✅ Notification
7. ✅ PriorityUser
8. ✅ CrowdLevel
9. ✅ UserPreferences
10. ✅ BranchService (Join Table)
11. ✅ AdminStaff
12. ✅ QueueHistory (Analytics)

Create all these tables in your database and implement the corresponding Spring Boot repositories, services, and controllers!

---

---

# FRONTEND INTEGRATION GUIDE
## React + Axios + WebSocket Connection

### Step 1: Install Dependencies

Run this in your React project folder:

```bash
npm install axios sockjs-client @stomp/stompjs
```

---

### Step 2: Create API Service (REST Calls)

Create file: `src/services/api.js`

```javascript
import axios from 'axios';

// Base URL matches your Spring Boot server
const API_BASE_URL = 'http://localhost:8080/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ============ AUTHENTICATION ============
export const register = async (userData) => {
    return await api.post('/auth/register', userData);
};

export const login = async (email, password) => {
    return await api.post('/auth/login', { email, password });
};

export const logout = async () => {
    return await api.post('/auth/logout');
};

// ============ QUEUE MANAGEMENT ============
export const joinQueue = async (queueRequest) => {
    // queueRequest: { userId, serviceId, branchId, priority }
    return await api.post('/queues/join', queueRequest);
};

export const getUserQueues = async (userId) => {
    return await api.get(`/queues/user/${userId}`);
};

export const getQueueDetails = async (queueId) => {
    return await api.get(`/queues/${queueId}`);
};

export const trackByToken = async (token) => {
    return await api.get(`/queues/track/${token}`);
};

export const cancelQueue = async (queueId) => {
    return await api.put(`/queues/${queueId}/cancel`);
};

// ============ DASHBOARD ============
export const getDashboardStats = async () => {
    return await api.get('/dashboard/stats');
};

export const getDashboardNotifications = async () => {
    return await api.get('/dashboard/notifications');
};

// ============ ADMIN ============
export const getAdminDashboard = async () => {
    return await api.get('/admin/dashboard');
};

export const getQueuesByBranch = async (branchId) => {
    return await api.get(`/admin/queues/by-branch/${branchId}`);
};

export const getAdminStaff = async () => {
    return await api.get('/admin/staff');
};

export const upgradeToPriority = async (userId, tier) => {
    return await api.post('/admin/priority/upgrade', { userId, tier });
};

// ============ NOTIFICATIONS ============
export const getNotifications = async () => {
    return await api.get('/notifications');
};

export const markAsRead = async (notificationId) => {
    return await api.put(`/notifications/${notificationId}/read`);
};

export const deleteNotification = async (notificationId) => {
    return await api.delete(`/notifications/${notificationId}`);
};

export const markAllAsRead = async () => {
    return await api.put('/notifications/mark-all-read');
};

export const clearAllNotifications = async () => {
    return await api.delete('/notifications/clear-all');
};

// ============ SETTINGS/PREFERENCES ============
export const getUserPreferences = async () => {
    return await api.get('/settings/preferences');
};

export const updateUserPreferences = async (preferences) => {
    return await api.put('/settings/preferences', preferences);
};

export const getUserProfile = async () => {
    return await api.get('/settings/profile');
};

export const updateUserProfile = async (profileData) => {
    return await api.put('/settings/profile', profileData);
};

// ============ PUBLIC DATA ============
export const getAllBranches = async () => {
    return await api.get('/branches');
};

export const getAllServices = async () => {
    return await api.get('/services');
};

export const getAllCrowdLevels = async () => {
    return await api.get('/crowd-levels');
};

export const getCrowdLevelByBranch = async (branchId) => {
    return await api.get(`/crowd-levels/${branchId}`);
};

export default api;
```

---

### Step 3: Create WebSocket Service (Real-time Updates)

Create file: `src/services/websocket.js`

```javascript
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

let stompClient = null;
let isConnected = false;

export const connectWebSocket = (userId) => {
    return new Promise((resolve, reject) => {
        const socket = new SockJS('http://localhost:8080/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect(
            {},
            () => {
                isConnected = true;
                console.log('WebSocket connected');
                
                // Subscribe to user-specific notifications
                stompClient.subscribe(`/user/${userId}/notifications`, (message) => {
                    console.log('Notification received:', JSON.parse(message.body));
                });

                // Subscribe to queue updates
                stompClient.subscribe(`/user/${userId}/queue-updates`, (message) => {
                    console.log('Queue update:', JSON.parse(message.body));
                });

                // Subscribe to crowd level updates
                stompClient.subscribe('/queue/crowd-levels', (message) => {
                    console.log('Crowd level update:', JSON.parse(message.body));
                });

                resolve(() => disconnectWebSocket());
            },
            (error) => {
                console.error('WebSocket connection error:', error);
                reject(error);
            }
        );
    });
};

export const disconnectWebSocket = () => {
    if (stompClient && isConnected) {
        stompClient.disconnect(() => {
            isConnected = false;
            console.log('WebSocket disconnected');
        });
    }
};

export const sendQueueUpdate = (queueId, status) => {
    if (stompClient && isConnected) {
        stompClient.send('/app/queue-update', {}, JSON.stringify({
            queueId,
            status,
        }));
    }
};

export const isWebSocketConnected = () => isConnected;

export default { connectWebSocket, disconnectWebSocket, sendQueueUpdate };
```

---

### Step 4: Use API in React Components

Example in `src/components/JoinQueue.jsx`:

```javascript
import { useState } from 'react';
import * as api from '../services/api';

export default function JoinQueue() {
    const [selectedService, setSelectedService] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleJoinQueue = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const userId = localStorage.getItem('userId');
            const queueRequest = {
                userId: parseInt(userId),
                serviceId: selectedService.id,
                branchId: selectedBranch.id,
                priority: 'NORMAL'
            };

            const response = await api.joinQueue(queueRequest);
            console.log('Successfully joined queue:', response.data);
            
            // Store token for tracking
            localStorage.setItem('currentToken', response.data.token);
            
            // Show success message
            alert(`Queue joined! Your token: ${response.data.token}`);
            
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to join queue');
            console.error('Error joining queue:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {error && <div className="error-message">{error}</div>}
            {/* Your component JSX */}
            <button onClick={handleJoinQueue} disabled={loading}>
                {loading ? 'Joining...' : 'Join Queue'}
            </button>
        </div>
    );
}
```

---

### Step 5: Use WebSocket in Dashboard

Example in `src/components/Dashboard.jsx`:

```javascript
import { useEffect, useState } from 'react';
import { connectWebSocket, disconnectWebSocket } from '../services/websocket';
import * as api from '../services/api';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        
        // Connect WebSocket
        connectWebSocket(userId).catch(err => {
            console.error('WebSocket connection failed:', err);
        });

        // Fetch initial data
        fetchDashboardData();

        // Cleanup on unmount
        return () => {
            disconnectWebSocket();
        };
    }, []);

    const fetchDashboardData = async () => {
        try {
            const statsResponse = await api.getDashboardStats();
            const notificationsResponse = await api.getDashboardNotifications();
            
            setStats(statsResponse.data);
            setNotifications(notificationsResponse.data);
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
        }
    };

    return (
        <div>
            {/* Render dashboard with stats and notifications */}
            <h1>Dashboard</h1>
            <p>Active Queues: {stats?.activeQueues}</p>
        </div>
    );
}
```

---

### Step 6: Environment Configuration

Create file: `.env` in React project root:

```
REACT_APP_API_URL=http://localhost:8080/api/v1
REACT_APP_WS_URL=http://localhost:8080/ws
```

Update `src/services/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';
```

---

### Step 7: Track Queue Example

Update `src/components/TrackQueue.jsx`:

```javascript
import { useState, useEffect } from 'react';
import * as api from '../services/api';

export default function TrackQueue() {
    const [queueData, setQueueData] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('currentToken');

    useEffect(() => {
        if (token) {
            fetchQueueStatus();
            const interval = setInterval(fetchQueueStatus, 5000); // Refresh every 5 seconds
            return () => clearInterval(interval);
        }
    }, [token]);

    const fetchQueueStatus = async () => {
        try {
            const response = await api.trackByToken(token);
            setQueueData(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to track queue:', err);
            setLoading(false);
        }
    };

    if (loading) return <div>Loading queue status...</div>;

    return (
        <div>
            <h2>Queue Status</h2>
            <p>Token: {queueData?.token}</p>
            <p>Position: {queueData?.position}</p>
            <p>Status: {queueData?.status}</p>
            <p>Wait Time: {queueData?.estimatedWaitTime} minutes</p>
        </div>
    );
}
```

---

## Spring Boot Configuration (CORS & WebSocket)

You must configure CORS in your Spring Boot backend to allow requests from React:

### File: `src/main/java/com/queue/config/CorsConfig.java`

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);

        registry.addMapping("/ws/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                .allowCredentials(true);
    }
}
```

### File: `src/main/java/com/queue/config/WebSocketConfig.java`

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/queue", "/user");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:5173", "http://localhost:3000")
                .withSockJS();
    }
}
```

---

## API Response Format (What to return from Spring Boot)

### Success Response:
```json
{
    "status": "SUCCESS",
    "message": "Queue joined successfully",
    "data": {
        "queueId": 123,
        "token": "Q-0001",
        "position": 5,
        "estimatedWaitTime": 15,
        "status": "WAITING"
    },
    "timestamp": "2024-03-23T10:30:00Z"
}
```

### Error Response:
```json
{
    "status": "ERROR",
    "message": "Invalid service ID",
    "timestamp": "2024-03-23T10:30:00Z"
}
```

---

## Testing Checklist

- [ ] Backend API running on `http://localhost:8080`
- [ ] React app running on `http://localhost:5173` or `http://localhost:3000`
- [ ] CORS is configured correctly
- [ ] WebSocket endpoint is accessible
- [ ] Authentication token is stored/retrieved correctly
- [ ] All API calls return expected data
- [ ] Real-time notifications working via WebSocket
- [ ] Queue tracking updates every 5 seconds

---

## Deployment Notes

### Production URLs:
```javascript
// src/services/api.js - Update for production
const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com/api/v1'
    : 'http://localhost:8080/api/v1';
```

### Spring Boot - application.properties:
```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/queue_db
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect

# CORS allowed origins
cors.allowed-origins=http://localhost:5173,https://yourdomain.com
```

Perfect! Your frontend is now ready to connect with your backend. Start both servers and test! 🚀

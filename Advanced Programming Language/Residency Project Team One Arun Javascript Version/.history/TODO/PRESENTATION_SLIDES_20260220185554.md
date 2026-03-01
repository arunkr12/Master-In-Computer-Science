# TODO App - Presentation Slides (Flow & Navigation)

## SLIDE 1: Project Overview

### TODO Application - Advanced Programming Language Project

- **Technology Stack:** HTML5, JavaScript (ES6+), Bootstrap 5.3.8, Tailwind CSS 4.2.0
- **Backend:** JSON Server 0.16.3 (Node.js REST API)
- **Frontend:** Live Server with hot reload (Port 8080)
- **API Server:** JSON Server (Port 3000)
- **Storage:** db.json file (persistent JSON storage)
- **Features:** Full CRUD operations, real-time UI sync, responsive design

---

## SLIDE 2: Layered Architecture Diagram

```
                          USER
                           ↓
                    ┌──────────────┐
                    │ PRESENTATION │
                    │    LAYER     │
                    │  (UI/UX)     │
                    └──────┬───────┘
                           ↓
            ┌──────────────────────────────┐
            │   COMPONENT LAYER            │
            ├──────────────────────────────┤
            │ Header | ToDoList | AddTodo  │
            │ Stats  | Footer              │
            └──────┬──────────────┬────────┘
                   ↓              ↓
            ┌─────────────────────────────┐
            │   BUSINESS LOGIC LAYER      │
            │  (ToDoContainer Class)      │
            │  - State Management         │
            │  - CRUD Operations          │
            └──────┬────────────────────┘
                   ↓
            ┌─────────────────────────────┐
            │   SERVICE LAYER             │
            │  (TodoService Class)        │
            │  - API Calls                │
            │  - HTTP Requests            │
            └──────┬────────────────────┘
                   ↓
        ┌──────────────────────────────┐
        │   SERVER LAYER               │
        │  JSON Server (Port 3000)     │
        │  - REST Endpoints            │
        │  - Data Validation           │
        └──────┬──────────────────────┘
               ↓
        ┌──────────────────────────────┐
        │   DATA PERSISTENCE           │
        │  db.json File                │
        │  - Stores Todos              │
        └──────────────────────────────┘
```

---

## SLIDE 3: Component Architecture

```
                    index.html
                        ↓
                     app.js (Controller)
                        ↓
                 ToDoContainer
                  (Orchestrator)
                  - State Management
                  - CRUD Operations
                        |
        ┌───────┬───────┼───────┬──────────┐
        ↓       ↓       ↓       ↓          ↓
      Header  ToDoList AddTodo Stats     Footer
    (Gradient) (Compact) (Input) (Single)(Info)
     Title     List w/  Input &  Total,
     w/ Icon  Icons   Submit   Completed,
                              Pending Counts

    Service Layer:
        TodoService (API calls)
             ↓
        JSON Server (Port 3000)
             ↓
        db.json (Persistent storage)
```

---

## SLIDE 4: Application Startup Flow

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Browser Loads http://127.0.0.1:8080               │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: index.html loads                                   │
│ - Bootstrap CSS (CDN)                                      │
│ - Tailwind CSS (CDN)                                       │
│ - Creates <div id="app"></div>                             │
│ - Loads app.js module                                      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: app.js executes                                    │
│ - Imports ToDoContainer                                    │
│ - Creates instance of ToDoContainer                        │
│ - Calls initializeApp()                                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: initializeApp() [ASYNC]                            │
│ - Awaits todoContainer.initialize()                        │
│ - Fetches todos from JSON Server                           │
│ - Updates component state                                  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: todoContainer.initialize()                         │
│ - Calls todoService.getTodos()                             │
│ - GET http://localhost:3000/todos                          │
│ - Stores results in this.todos array                       │
│ - Calls updateComponents()                                 │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 6: updateComponents()                                 │
│ - Passes todos to ToDoList component                       │
│ - Passes todos to Stats component                          │
│ - Each component prepares its render output                │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 7: todoContainer.render()                             │
│ - Renders Header HTML                                      │
│ - Renders Main content (ToDoList + AddTodo + Stats)        │
│ - Renders Footer HTML                                      │
│ - Returns complete HTML string                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 8: Update DOM                                         │
│ - app.innerHTML = todoContainer.render()                   │
│ - UI displays on screen                                    │
│ - All todos visible with complete functionality            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 9: Attach Event Listeners                             │
│ - setupEventListeners()                                    │
│ - Adds click handlers to buttons                           │
│ - Adds change handlers to checkboxes                       │
│ - Ready for user interaction                               │
└─────────────────────────────────────────────────────────────┘
                          ↓
                    ✅ APP READY
```

---

## SLIDE 5: User Interaction - Add Todo Flow

```
USER CLICKS "ADD TASK"
           ↓
    ┌──────────────────────────────────────┐
    │ 1. EVENT HANDLER TRIGGERED           │
    │    - Gets input value                │
    │    - Validates not empty             │
    │    - Calls addTodoItem(text)         │
    └──────────┬───────────────────────────┘
               ↓
    ┌──────────────────────────────────────┐
    │ 2. BUSINESS LOGIC (ToDoContainer)    │
    │    - Calls todoService.addTodo(text) │
    │    - Waits for response              │
    │    - Adds to local todos array       │
    │    - Calls updateComponents()        │
    └──────────┬───────────────────────────┘
               ↓
    ┌──────────────────────────────────────┐
    │ 3. SERVICE LAYER (TodoService)       │
    │    - Creates todo object:            │
    │      {text: "...", completed: false} │
    │    - POST to JSON Server             │
    │    - Waits for response with ID      │
    └──────────┬───────────────────────────┘
               ↓
    ┌──────────────────────────────────────┐
    │ 4. JSON SERVER (Port 3000)           │
    │    - Receives POST request           │
    │    - Generates unique ID             │
    │    - Adds to db.json                 │
    │    - Returns created object          │
    └──────────┬───────────────────────────┘
               ↓
    ┌──────────────────────────────────────┐
    │ 5. DATA PERSISTED (db.json)          │
    │    {                                 │
    │      "id": 4,                        │
    │      "text": "New Task",             │
    │      "completed": false              │
    │    } ← SAVED                         │
    └──────────┬───────────────────────────┘
               ↓
    ┌──────────────────────────────────────┐
    │ 6. UI UPDATES                        │
    │    - Re-renders entire app           │
    │    - New todo appears in list        │
    │    - Stats count increases           │
    │    - Input field clears              │
    │    - Event listeners re-attached     │
    └──────────────────────────────────────┘
               ↓
            ✅ DONE
```

---

## SLIDE 6: CRUD Operations Flow

### CREATE (Add Todo)

```
User Input → Validation → Service → POST to /todos → db.json Updated → UI Refreshed
```

### READ (Load Todos)

```
App Init → Service → GET /todos → db.json Read → Display in ToDoList → Ready
```

### UPDATE (Edit/Toggle)

```
User Action → Validation → Service → PATCH /todos/{id} → db.json Updated → UI Refreshed
```

### DELETE (Remove Todo)

```
Delete Click → Confirmation → Service → DELETE /todos/{id} → db.json Updated → UI Refreshed
```

---

## SLIDE 7: Data Model & API Endpoints

### Todo Data Structure

```javascript
{
  "id": 1,                          // Auto-generated by JSON Server
  "text": "Learn JavaScript",       // Task description
  "completed": false                // Completion status
}
```

### REST API Endpoints

```
GET    /todos              → Fetch all todos
POST   /todos              → Create new todo
                             Body: { text: "...", completed: false }
PATCH  /todos/{id}         → Update specific todo
                             Body: { text: "..." OR completed: true/false }
DELETE /todos/{id}         → Delete specific todo
```

### Example HTTP Requests

```
POST /todos
{ "text": "Learn JavaScript", "completed": false }

RESPONSE: { "id": 1, "text": "Learn JavaScript", "completed": false }

---

PATCH /todos/1
{ "completed": true }

RESPONSE: { "id": 1, "text": "Learn JavaScript", "completed": true }

---

DELETE /todos/1

RESPONSE: {}  (Success)
```

---

## SLIDE 8: File & Folder Structure

```
TODO/
│
├── 📄 index.html                    Entry point
├── 📄 app.js                        App controller & event handlers
├── 📄 db.json                       Database (JSON Server)
├── 📄 package.json                  Dependencies & scripts
│
├── 📁 ToDoContainer/
│   └── ToDoContainer.js             Main orchestrator (124 lines)
│                                    - Manages all components
│                                    - CRUD operations
│                                    - State management
│
├── 📁 Header/
│   └── Header.js                    Header component
│
├── 📁 Footer/
│   └── Footer.js                    Footer component
│
├── 📁 ToDoList/
│   └── ToDoList.js                  List display component
│
├── 📁 AddTodo/
│   └── AddTodo.js                   Add form component
│
├── 📁 Stats/
│   └── Stats.js                     Statistics component
│
└── 📁 Services/
    └── TodoService.js              API service layer
                                    - GET /todos
                                    - POST /todos
                                    - PATCH /todos/{id}
                                    - DELETE /todos/{id}
```

---

## SLIDE 9: Technologies Used

| Technology        | Purpose               | Version |
| ----------------- | --------------------- | ------- |
| HTML5             | Markup                | -       |
| JavaScript (ES6+) | Logic & Interactivity | -       |
| Bootstrap         | UI Framework          | 5.3.8   |
| Tailwind CSS      | Utility-first CSS     | 4.2.0   |
| JSON Server       | Backend API           | 0.16.3  |
| Live Server       | Dev Server            | 1.2.2   |
| Node.js           | Runtime               | 14.15.0 |

---

## SLIDE 10: Key Features

```
✅ ADD TODO
   - Input validation
   - POST to JSON Server
   - Auto ID generation
   - Instant UI update

✅ VIEW TODOS
   - Fetch all from database
   - Display in sorted list
   - Shows completion status

✅ EDIT TODO
   - Prompt for new text
   - PATCH to database
   - Update in real-time

✅ DELETE TODO
   - Remove from database
   - DELETE request
   - Instant UI refresh

✅ TOGGLE COMPLETE
   - Update completion status
   - PATCH to database
   - Visual feedback

✅ STATISTICS (Displayed once at bottom)
   - Total task count displayed
   - Completed tasks count (with ✅ emoji)
   - Pending tasks count (with ⏳ emoji)
   - Completion percentage badge
   - Three-card stat display layout

✅ DATA PERSISTENCE
   - All data in db.json
   - Survives page refresh
   - JSON Server watches file
```

---

## SLIDE 11: Runtime Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    DEVELOPER'S MACHINE                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌────────────────────────────────────────────────┐   │
│  │ PORT 8080: Live Server (Frontend)              │   │
│  │ - Serves index.html                            │   │
│  │ - Serves app.js                                │   │
│  │ - Hot reload on file change                    │   │
│  │ - Browser: http://127.0.0.1:8080               │   │
│  └────────────────────────────────────────────────┘   │
│                         ↓ (HTTP Requests)              │
│  ┌────────────────────────────────────────────────┐   │
│  │ PORT 3000: JSON Server (Backend API)           │   │
│  │ - REST endpoints for /todos                    │   │
│  │ - GET, POST, PATCH, DELETE support            │   │
│  │ - Watches db.json for changes                  │   │
│  │ - Responds with JSON data                      │   │
│  └────────────────────────────────────────────────┘   │
│                         ↓ (File I/O)                   │
│  ┌────────────────────────────────────────────────┐   │
│  │ db.json (Data Storage)                         │   │
│  │ {                                              │   │
│  │   "todos": [                                   │   │
│  │     { "id": 1, "text": "...", ... },           │   │
│  │     { "id": 2, "text": "...", ... }            │   │
│  │   ]                                            │   │
│  │ }                                              │   │
│  └────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## SLIDE 12: Example User Session

```
TIMELINE:

00:00 - User opens http://127.0.0.1:8080
        ↓ App loads, fetches todos from JSON Server
        ↓ Displays 3 sample todos

00:05 - User types "Learn TypeScript" in input field

00:06 - User clicks "Add Task" button
        ↓ POST request sent
        ↓ New todo created with ID 4
        ↓ UI updates instantly
        ↓ Stats show Total: 4

00:10 - User clicks checkbox on "Build a TODO App"
        ↓ PATCH request sent
        ↓ Completion status updated
        ↓ Todo shows strikethrough
        ↓ Stats show Completed: 2

00:15 - User clicks Edit on "Learn JavaScript"
        ↓ Prompt appears
        ↓ User enters "Learn JavaScript & DOM"
        ↓ PATCH request sent
        ↓ Text updated in list

00:20 - User clicks Delete on "Master Bootstrap & Tailwind"
        ↓ DELETE request sent
        ↓ Todo removed from database
        ↓ UI updates
        ↓ Stats show Total: 3

00:25 - User refreshes browser (F5)
        ↓ App reloads
        ↓ Fetches latest todos from db.json
        ↓ All changes persist!
        ↓ 3 todos shown (including edited one)
```

---

## SLIDE 13: Summary: How Everything Works Together

```
1. PRESENTATION LAYER (UI)
   ↓ User interacts with components

2. EVENT HANDLERS (app.js)
   ↓ Validate input & route to container

3. BUSINESS LOGIC (ToDoContainer)
   ↓ Process CRUD operations

4. SERVICE LAYER (TodoService)
   ↓ Format & send HTTP requests

5. SERVER (JSON Server - Port 3000)
   ↓ Process requests, update data

6. PERSISTENCE (db.json)
   ↓ Data stored permanently

7. RESPONSE & UPDATE
   ↓ Return to service → container → UI

8. RE-RENDER (UI Updated)
   ↓ Components reflect new state

9. EVENT LISTENERS RE-ATTACHED
   ↓ Ready for next user action

    CYCLE REPEATS ↻
```

---

## SLIDE 14: Key Takeaways

### Architecture Principles

- **Separation of Concerns** - Each layer has specific responsibility
- **Modularity** - Components are independent and reusable
- **Service Layer Pattern** - API calls centralized in TodoService
- **Async/Await** - Clean handling of asynchronous operations
- **REST API** - Standard HTTP methods for data operations

### Benefits

- Easy to test (each component isolated)
- Easy to maintain (clear code organization)
- Easy to scale (add new features without breaking existing ones)
- Professional structure (industry-standard patterns)

### Technologies

- Frontend: HTML5, JavaScript ES6+, Bootstrap, Tailwind
- Backend: JSON Server (mock REST API)
- Data: db.json (persistent storage)
- Development: Live Server, npm scripts

### Deployment Ready

- Can be deployed to cloud services
- JSON Server can be replaced with real backend
- Frontend can be built and minified
- Database can be migrated to real database

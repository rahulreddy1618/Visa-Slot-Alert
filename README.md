# Visa Slot Alerts Tracker

A mini internal tool for tracking visa appointment slot alerts. Built with Node.js/Express (backend) and React/Vite (frontend).

---

## Project Overview

**Visa Slot Alerts Tracker** lets you create, view, update, and delete visa appointment alerts. Each alert stores country, city, visa type, and status. The UI provides filters, pagination, and status cycling (Active → Booked → Expired).

---

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Backend

```bash
cd backend
npm install
npm start
```

The API runs on **http://localhost:3001** by default. Set `PORT` to change it:

```bash
# Windows PowerShell
$env:PORT=4000; npm start

# Linux/macOS
PORT=4000 npm start
```

Copy `backend/.env.example` to `backend/.env` to set `PORT` (loaded via dotenv).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs on **http://localhost:5173**. It proxies `/api` to the backend during development.

### Running Both

1. Start the backend: `cd backend && npm start`
2. Start the frontend: `cd frontend && npm run dev`
3. Open http://localhost:5173

---

## API Routes Documentation

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/alerts` | List all alerts. Query params: `?country=`, `?status=` |
| POST | `/alerts` | Create alert. Body: `{ country, city, visaType }`. Returns 201. |
| PUT | `/alerts/:id` | Update status only. Body: `{ status }`. Returns 404 if not found. |
| DELETE | `/alerts/:id` | Delete alert. Returns 404 if not found. |
| GET | `/health` | Health check |

### Example Requests

**Create alert:**
```bash
curl -X POST http://localhost:3001/alerts \
  -H "Content-Type: application/json" \
  -d '{"country":"USA","city":"New York","visaType":"Tourist"}'
```

**List with filters:**
```bash
curl "http://localhost:3001/alerts?country=USA&status=Active"
```

**Update status:**
```bash
curl -X PUT http://localhost:3001/alerts/<uuid> \
  -H "Content-Type: application/json" \
  -d '{"status":"Booked"}'
```

---

## Design Decisions

1. **JSON file storage** – Simple, no DB setup. Suitable for internal tools and low traffic. `data/alerts.json` is created automatically.

2. **UUID for IDs** – Unique, non-sequential IDs for alerts.

3. **Vite proxy** – Frontend uses `/api` which proxies to the backend in dev, avoiding CORS and keeping config simple.

4. **Centralized error handler** – One middleware handles errors and returns consistent JSON with status codes (400, 404, 500).

5. **Custom logger middleware** – Logs `method + URL + timestamp` for each request.

6. **Client-side pagination** – 5 items per page, implemented in the frontend for simplicity.

---

## What Would Be Improved for Production

- **Database** – Replace JSON file with PostgreSQL/MongoDB for concurrency and scale.
- **Authentication** – Add JWT or session-based auth.
- **Rate limiting** – Protect endpoints from abuse.
- **Validation** – Use Joi/Zod for stricter schema validation.
- **Tests** – Unit and integration tests for backend and frontend.
- **Logging** – Structured logging (e.g. Winston) instead of `console.log`.
- **Environment config** – `.env` for ports, DB URLs, secrets.
- **CI/CD** – Automated tests and deployment.
- **HTTPS** – TLS in production.

---

## Where AI Was Used vs Independent Thinking

**AI-assisted:**
- Project structure and boilerplate
- README structure and wording

**Independent / human decisions:**
- Choice of JSON file vs in-memory storage
- REST API design and Express setup
- React component layout and state handling
- Pagination size (5 per page)
- Status cycle (Active → Booked → Expired)
- Error message wording and UX
- CSS layout and styling choices

---

## License

MIT

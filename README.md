# 🌩️ xCloud Server Management – Full-Stack Submission

## Track Chosen
**Track C – Full-stack (Backend-heavy)**  
Backend: **Laravel 12 + MySQL 8**  
Frontend: **React 19 + Vite + Mantine UI**

---

## 🛠 Setup Instructions

### Prerequisites
- PHP >= 8.2 with Composer
- MySQL >= 8
- Node >= 18 & npm (or yarn)

### 1. Clone & Install
```bash
git clone https://github.com/avighoshjit567/xCloud.git
cd backend # for backend
cp .env.example .env         # set DB credentials
composer install
php artisan key:generate
php artisan migrate --seed   # run migrations & optional seed data
php artisan serve

cd ../frontend # for frontend
npm install
npm run dev

### 2. API Documentation
Base URL: http://localhost:8000/api

| Method | Endpoint        | Description                                  |
| ------ | --------------- | -------------------------------------------- |
| POST   | `/auth/login`   | Obtain Sanctum                               |
| GET    | `/servers`      | List servers (filter/search/sort/pagination) |
| POST   | `/servers`      | Create a new server                          |
| GET    | `/servers/{id}` | Retrieve a single server                     |
| PUT    | `/servers/{id}` | Update server                                |
| DELETE | `/servers/{id}` | Delete server                                |

Query Parameters
    provider – filter by provider
    status – filter by status
    search – fuzzy match on name or IP
    sort_by & sort_order – e.g. sort=created_at:desc
    page, per_page – pagination

### 3. AI Collaboration Process
Tools Used: ChatGPT (GPT-4), GitHub Copilot
Prompts & Use Cases:
Suggested MySQL schema with composite unique constraints and validation ranges.
Generated example Laravel Eloquent relationships and controller skeletons.
React + Mantine component structure for tables, pagination, and modals.
Accepted vs. Rewritten:
Accepted: basic migration & model outlines, Mantine table setup.
Rewritten: query optimization for large server list, error-handling middleware.
Bugs Found & Fixed:
Copilot suggested an inefficient eager-loading pattern causing N+1 queries; rewritten with with() eager loading and proper indexing.

### 4. Debugging Journey
Slow Query – Server List with 5k+ Records
Issue: The GET /servers endpoint became slow (~450 ms) when listing thousands of servers due to missing indexes and unoptimized filtering.
Diagnosis: Used Laravel Telescope and MySQL EXPLAIN to inspect query plan—full table scan on provider and status.
Fix:
Added composite indexes on provider, status, and created_at.
Used Eloquent withCount instead of multiple aggregate queries.
Implemented server-side pagination with lengthAwarePaginator.
Result: Response time reduced to ~30 ms for 5k records.

### 5. Time Spent

Approx. 8 hours total
Backend: ~4.5 hrs (API design, migrations, query optimization)
Frontend: ~3 hrs (React pages, Mantine tables & forms with validation)
Docs & Video: ~0.5 hr (Reame.md & the workthrough video)


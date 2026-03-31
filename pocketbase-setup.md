# PocketBase setup for Inventory MVP

## 1. Start PocketBase
```bash
pocketbase serve
```
Dashboard: http://127.0.0.1:8090/_/

## 2. Create collection: users
Create a new **Auth collection** named `users`.

Add custom field:
- `role` → type: `select`
- allowed values: `admin`, `worker`
- required: yes

Create example users:
- admin@test.com / 1234 / role=admin
- worker@test.com / 1234 / role=worker

## 3. Create collection: devices
Create a new **Base collection** named `devices`.

Fields:
- `name` → text, required
- `description` → text, required
- `status` → select, required
  - values: `available`, `in_use`

## 4. API rules for MVP
For a quick demo, set these rules on `devices`:
- List rule: leave empty
- View rule: leave empty
- Create rule: leave empty
- Update rule: leave empty
- Delete rule: leave empty

For `users`, login works through auth, so no extra list rules are required.

## 5. Run the project
```bash
npm install
npm start
```

If PocketBase is on another URL, create `.env` from `.env.example` and change:
```env
POCKETBASE_URL=http://127.0.0.1:8090
```

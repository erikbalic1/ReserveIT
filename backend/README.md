# ReserveIT Backend API

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Edit the `.env` file with your MongoDB connection string:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/reserveit
```

For MongoDB Atlas (cloud), use:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/reserveit
```

### 3. Start MongoDB
Make sure MongoDB is running locally or use MongoDB Atlas.

For local MongoDB:
```bash
mongod
```

### 4. Run the Server
Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Reservations

**Get all reservations**
```
GET /api/reservations
```

**Get reservation by ID**
```
GET /api/reservations/:id
```

**Get reservations by user ID**
```
GET /api/reservations/user/:userId
```

**Get reservations by company ID**
```
GET /api/reservations/company/:companyId
```

**Create new reservation**
```
POST /api/reservations
Content-Type: application/json

{
  "userName": "John Doe",
  "userPhone": "+36 20 123 4567",
  "service": "Haircut",
  "date": "2025-11-20",
  "time": "14:00",
  "status": "pending",
  "notes": "Please use scissors",
  "companyId": "1",
  "userId": "1"
}
```

**Update reservation**
```
PUT /api/reservations/:id
Content-Type: application/json

{
  "status": "confirmed"
}
```

**Delete reservation**
```
DELETE /api/reservations/:id
```

## Testing with curl

Create a reservation:
```bash
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -d "{\"userName\":\"Test User\",\"userPhone\":\"+36 20 123 4567\",\"service\":\"Haircut\",\"date\":\"2025-11-20\",\"time\":\"14:00\",\"companyId\":\"1\",\"userId\":\"1\"}"
```

Get all reservations:
```bash
curl http://localhost:5000/api/reservations
```

## Response Format

Success response:
```json
{
  "success": true,
  "data": {...}
}
```

Error response:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error"
}
```

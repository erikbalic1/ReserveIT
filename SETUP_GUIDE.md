# ReserveIt! - Telepítési és Használati Útmutató 🚀

## 📋 Tartalomjegyzék
1. [Gyors Kezdés](#gyors-kezdés)
2. [Projekt Struktúra](#projekt-struktúra)
3. [Komponensek Áttekintése](#komponensek-áttekintése)
4. [Routing Rendszer](#routing-rendszer)
5. [Állapotkezelés](#állapotkezelés)
6. [Dizájn Rendszer](#dizájn-rendszer)
7. [Backend Fejlesztési Terv](#backend-fejlesztési-terv)

---

## Gyors Kezdés

### 1. Függőségek telepítése
```bash
npm install
```

Telepített csomagok:
- `react` & `react-dom` (18.2.0) - UI library
- `react-router-dom` (6.20.0) - Routing
- `axios` (1.6.2) - HTTP kliens (API hívásokhoz)
- `vite` (5.0.8) - Build tool
- `@vitejs/plugin-react` - Vite React plugin

### 2. Development szerver indítása
```bash
npm run dev
```
A szerver elindul a `http://localhost:3000` címen.

### 3. Build production-re
```bash
npm run build
```
A build fájlok a `dist/` mappába kerülnek.

---

## Projekt Struktúra

```
ReserveIT/
│
├── index.html                 # HTML belépési pont
├── vite.config.js            # Vite konfiguráció
├── package.json              # Projekt metaadatok és függőségek
│
└── src/
    │
    ├── main.jsx              # React alkalmazás belépési pont
    ├── App.jsx               # Fő komponens routing-gal
    ├── App.css               # Globális stílusok és CSS változók
    │
    ├── components/           # Újrafelhasználható komponensek
    │   └── Navbar/
    │       ├── Navbar.jsx    # Navigációs sáv komponens
    │       └── Navbar.css    # Navbar stílusok
    │
    ├── context/              # Context API állapotkezelés
    │   └── AuthContext.jsx   # Autentikációs context
    │
    └── pages/                # Oldal komponensek (routes)
        │
        ├── Auth/             # Autentikációs oldalak
        │   ├── Login.jsx
        │   ├── RegisterUser.jsx
        │   ├── RegisterCompany.jsx
        │   └── Auth.css
        │
        ├── CompanyList/      # Vállalkozások listázása
        │   ├── CompanyList.jsx
        │   └── CompanyList.css
        │
        ├── CompanyDetails/   # Vállalkozás részletei
        │   ├── CompanyDetails.jsx
        │   └── CompanyDetails.css
        │
        └── Dashboard/        # Dashboard oldalak
            ├── UserDashboard.jsx
            ├── CompanyDashboard.jsx
            └── Dashboard.css
```

---

## Komponensek Áttekintése

### 🧭 Navbar Komponens (`components/Navbar/`)

**Fő Funkciók:**
- Logo megjelenítése (kiemelt "It!" résszel)
- Dinamikus navigációs menü (bejelentkezési státusz alapján)
- Responsive mobile menü
- Felhasználó információk megjelenítése

**Kiemelt Dizájn Elem:**
```jsx
<Link to="/" className="navbar-logo">
  <span className="logo-main">Reserve</span>
  <span className="logo-accent">It!</span>
</Link>
```

A **"It!"** rész:
- Accent színnel (#FF6B6B) kiemelve
- Pulse animációval
- Hover effekt (glow)

---

### 🔐 Auth Context (`context/AuthContext.jsx`)

**Funkciók:**
- Felhasználói állapot kezelése
- LocalStorage perzisztencia
- Bejelentkezés/Regisztráció
- Kijelentkezés
- Szerepkör ellenőrzés

**Használat:**
```jsx
import { useAuth } from './context/AuthContext';

function Component() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // ...
}
```

---

### 📄 Oldal Komponensek

#### 1. **CompanyList** (`pages/CompanyList/`)
- Vállalkozások grid megjelenítése
- Keresés név/leírás alapján
- Kategória szűrés
- Dummy adatok: 6 vállalkozás

#### 2. **CompanyDetails** (`pages/CompanyDetails/`)
- Vállalkozás részletes információi
- Szolgáltatások listája
- Foglalási űrlap
- Időpont és szolgáltatás választás

#### 3. **UserDashboard** (`pages/Dashboard/`)
- Felhasználó foglalásainak listája
- Statisztikák (aktív, befejezett, függőben)
- Foglalások szűrése
- Foglalás törlése

#### 4. **CompanyDashboard** (`pages/Dashboard/`)
- Beérkező foglalások kezelése
- Foglalás megerősítése/elutasítása
- Foglalás befejezettként jelölése
- Statisztikák

#### 5. **Login** (`pages/Auth/`)
- Bejelentkezési űrlap
- Demo bejelentkezési adatok megjelenítése
- Átirányítás regisztrációhoz

#### 6. **RegisterUser** & **RegisterCompany**
- Regisztrációs űrlapok
- Validáció (jelszó egyezés, minimum hossz)
- Külön űrlapok user/company típusokhoz

---

## Routing Rendszer

### Útvonalak Táblázata

| URL | Komponens | Védelem | Leírás |
|-----|-----------|---------|--------|
| `/` | CompanyList | Nyilvános | Főoldal - vállalkozások |
| `/company/:id` | CompanyDetails | Nyilvános | Vállalkozás részletei |
| `/login` | Login | Nyilvános | Bejelentkezés |
| `/register/user` | RegisterUser | Nyilvános | User regisztráció |
| `/register/company` | RegisterCompany | Nyilvános | Company regisztráció |
| `/dashboard/user` | UserDashboard | User only | User dashboard |
| `/dashboard/company` | CompanyDashboard | Company only | Company dashboard |

### Protected Route Implementáció

```jsx
<Route
  path="/dashboard/user"
  element={
    <ProtectedRoute requiredRole="user">
      <UserDashboard />
    </ProtectedRoute>
  }
/>
```

---

## Állapotkezelés

### Context API Használat

**AuthContext** szolgáltatások:

```javascript
{
  user: {
    id, name, email, phone, role, token
  },
  loading: boolean,
  login: (userData, token) => void,
  register: (userData, token) => void,
  logout: () => void,
  updateUser: (updatedData) => void,
  isAuthenticated: () => boolean,
  hasRole: (role) => boolean
}
```

### LocalStorage Perzisztencia

Kulcsok:
- `reserveit_user` - Felhasználói adatok
- `reserveit_token` - JWT token (később backend-del)

---

## Dizájn Rendszer

### CSS Változók (`src/App.css`)

```css
:root {
  /* Színek */
  --primary-color: #2c3e50;
  --secondary-color: #34495e;
  --accent-color: #FF6B6B;
  --success-color: #27ae60;
  --warning-color: #f39c12;
  --danger-color: #e74c3c;
  
  /* Layout */
  --navbar-height: 70px;
  --max-width: 1200px;
  --border-radius: 8px;
  
  /* Animációk */
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
}
```

### Globális CSS Osztályok

**Gombok:**
- `.btn` - Alap gomb
- `.btn-primary` - Primary szín
- `.btn-accent` - Accent szín
- `.btn-outline` - Outline verzió

**Kártyák:**
- `.card` - Alap kártya shadow-val

**Grid:**
- `.grid` - Grid container
- `.grid-2` - 2 oszlopos (responsive)
- `.grid-3` - 3 oszlopos (responsive)

**Űrlap elemek:**
- `.form-group` - Űrlap csoport
- `.form-label` - Címke
- `.form-input` - Input mező
- `.form-textarea` - Textarea
- `.form-select` - Select dropdown

**Badge-ek:**
- `.badge-success` - Zöld badge
- `.badge-warning` - Sárga badge
- `.badge-danger` - Piros badge

---

## Backend Fejlesztési Terv

### 1. Projekt Inicializálás

```bash
mkdir backend
cd backend
npm init -y
npm install express mongoose bcryptjs jsonwebtoken dotenv cors
npm install -D nodemon
```

### 2. Szükséges Fájlok

```
backend/
├── server.js              # Express szerver
├── .env                   # Környezeti változók
├── config/
│   └── db.js             # MongoDB kapcsolat
├── models/
│   ├── User.js           # User model
│   ├── Company.js        # Company model
│   └── Reservation.js    # Reservation model
├── routes/
│   ├── auth.js           # Auth routes
│   ├── companies.js      # Company routes
│   └── reservations.js   # Reservation routes
└── middleware/
    └── auth.js           # JWT middleware
```

### 3. MongoDB Modellek

#### User Model
```javascript
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});
```

#### Company Model
```javascript
const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  services: [String],
  openingHours: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['company'], default: 'company' },
  createdAt: { type: Date, default: Date.now }
});
```

#### Reservation Model
```javascript
const ReservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  service: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});
```

### 4. API Endpoints

#### Auth Routes (`/api/auth`)
- `POST /register/user` - User regisztráció
- `POST /register/company` - Company regisztráció
- `POST /login` - Bejelentkezés
- `GET /me` - Aktuális user lekérése

#### Company Routes (`/api/companies`)
- `GET /` - Összes vállalkozás
- `GET /:id` - Egy vállalkozás
- `PUT /:id` - Vállalkozás frissítése (saját)
- `DELETE /:id` - Vállalkozás törlése (saját)

#### Reservation Routes (`/api/reservations`)
- `POST /` - Új foglalás
- `GET /user/:userId` - User foglalásai
- `GET /company/:companyId` - Company foglalásai
- `PUT /:id` - Foglalás frissítése (státusz)
- `DELETE /:id` - Foglalás törlése

### 5. Frontend Axios Integráció

```javascript
// src/api/axios.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('reserveit_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
```

---

## Demo Adatok

### Bejelentkezési Adatok

**Felhasználó:**
- Email: `user@test.hu`
- Jelszó: `password`
- Szerepkör: `user`

**Vállalkozás:**
- Email: `company@test.hu`
- Jelszó: `password`
- Szerepkör: `company`

### Dummy Vállalkozások (6 db)

1. Szépségszalon Bella - Szépségápolás
2. Fitness Center Plus - Sport
3. Autó Szerviz Profi - Autószerelés
4. Massage & Wellness - Wellness
5. Állatorvosi Rendelő Dr. Kiss - Állatorvos
6. Étterem La Cucina - Étterem

---

## Tesztelési Folyamat

### 1. Navigáció Tesztelése
- ✅ Főoldal megjelenítése
- ✅ Navbar linkek működése
- ✅ Mobile menü működése

### 2. Autentikáció
- ✅ Bejelentkezés (user & company)
- ✅ Regisztráció (user & company)
- ✅ Kijelentkezés
- ✅ Protected routes védelem

### 3. Vállalkozások
- ✅ Lista megjelenítése
- ✅ Keresés működése
- ✅ Kategória szűrés
- ✅ Részletek oldal

### 4. Foglalások
- ✅ Új foglalás létrehozása
- ✅ Foglalások listázása
- ✅ Státusz változtatás (company)
- ✅ Foglalás törlése

---

## Következő Lépések

1. ✅ **Frontend készen áll**
2. ⏳ Backend API fejlesztése
3. ⏳ MongoDB adatbázis beállítása
4. ⏳ Frontend-Backend összekapcsolás
5. ⏳ Tesztelés és hibakeresés
6. ⏳ Deployment (Vercel + MongoDB Atlas)

---

## Troubleshooting

### Port foglaltság
Ha a 3000-es port foglalt:
```bash
# vite.config.js módosítása
server: {
  port: 3001  // vagy más szabad port
}
```

### Node verzió
Minimum Node.js v16 szükséges.
```bash
node --version
```

### Build hibák
Cache törlése:
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

---

**Készítette:** ReserveIt! Team  
**Utolsó frissítés:** 2025.11.17  
**Verzió:** 1.0.0 (Frontend)
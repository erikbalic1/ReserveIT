# ReserveIt! 🎯

Teljes körű webalkalmazás foglalási rendszer megvalósítására React, Node.js és MongoDB technológiákkal.

## 📝 Projekt Áttekintés

A ReserveIt! egy modern foglalási platform, amely összeköti a felhasználókat és vállalkozásokat. A rendszer lehetővé teszi időpontok egyszerű foglalását különböző szolgáltatásokra (szépségápolás, fitness, autószerviz, stb.).

### Főbb Funkciók

- 👤 **Kétféle felhasználói típus**: Felhasználók (Users) és Vállalkozások (Companies)
- 🔐 **JWT alapú autentikáció**: Biztonságos bejelentkezés és regisztráció
- 📅 **Foglaláskezelés**: Teljes CRUD támogatás foglalásokhoz
- 🎨 **Modern UI**: Reszponzív dizájn React-tel
- ⚡ **Valós idejű szűrés**: Kategóriák és keresés szerint
- 🏢 **Vállalkozási dashboard**: Foglalások kezelése, megerősítése
- 👨‍💼 **Felhasználói dashboard**: Saját foglalások megtekintése, törlése

## 💻 Technológiai Stack

### Frontend
- **React 18.2** - Modern UI library
- **React Router DOM 6.20** - Client-side routing
- **Vite 5.0** - Gyors development build tool
- **CSS3** - Custom styling CSS változókkal

### Backend (Tervezett)
- **Node.js + Express** - REST API
- **MongoDB + Mongoose** - NoSQL adatbázis
- **JWT** - Autentikáció
- **bcrypt** - Jelszó titkosítás

## 🚀 Telepítés és Futtatás

### Előfeltételek
- Node.js (v16 vagy újabb)
- npm vagy yarn

### Lépések

1. **Függőségek telepítése**
```bash
npm install
```

2. **Development szerver indítása**
```bash
npm run dev
```

Az alkalmazás elérhető lesz a `http://localhost:3000` címen.

3. **Build production-re**
```bash
npm run build
```

4. **Build előnézet**
```bash
npm run preview
```

## 📁 Projekt Struktúra

```
ReserveIT/
├── public/
├── src/
│   ├── components/
│   │   └── Navbar/
│   │       ├── Navbar.jsx
│   │       └── Navbar.css
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   ├── RegisterUser.jsx
│   │   │   ├── RegisterCompany.jsx
│   │   │   └── Auth.css
│   │   ├── CompanyList/
│   │   │   ├── CompanyList.jsx
│   │   │   └── CompanyList.css
│   │   ├── CompanyDetails/
│   │   │   ├── CompanyDetails.jsx
│   │   │   └── CompanyDetails.css
│   │   └── Dashboard/
│   │       ├── UserDashboard.jsx
│   │       ├── CompanyDashboard.jsx
│   │       └── Dashboard.css
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 🎨 Design Kiemelések

### Navbar Logo Dizájn
A projekt különleges figyelmet fordít a **ReserveIt!** logó dizájnjára:
- **"Reserve"** - Alapszín (fehér)
- **"It!"** - Kiemelt accent szín (#FF6B6B)
- Pulse animáció az "It!" részen
- Hover effektek és átmenetek

### Színpaletta
```css
--primary-color: #2c3e50;      /* Sötétkék */
--secondary-color: #34495e;     /* Szürke-kék */
--accent-color: #FF6B6B;        /* Élénk piros */
--success-color: #27ae60;       /* Zöld */
--warning-color: #f39c12;       /* Narancs */
```

## 🔑 Demo Bejelentkezési Adatok

### Felhasználó
- **Email**: `user@test.hu`
- **Jelszó**: `password`

### Vállalkozás
- **Email**: `company@test.hu`
- **Jelszó**: `password`

## 📱 Útvonalak (Routes)

| Útvonal | Leírás | Védett |
|---------|---------|--------|
| `/` | Vállalkozások listája | Nyilvános |
| `/company/:id` | Vállalkozás részletei | Nyilvános |
| `/login` | Bejelentkezés | Nyilvános |
| `/register/user` | Felhasználó regisztráció | Nyilvános |
| `/register/company` | Vállalkozás regisztráció | Nyilvános |
| `/dashboard/user` | Felhasználói dashboard | UserOnly |
| `/dashboard/company` | Vállalkozói dashboard | Company Only |

## 🗂️ Adatmodellek

### User (Felhasználó)
```javascript
{
  id: Number,
  name: String,
  email: String,
  phone: String,
  role: 'user',
  password: String (hashed)
}
```

### Company (Vállalkozás)
```javascript
{
  id: Number,
  name: String,
  ownerName: String,
  email: String,
  phone: String,
  address: String,
  description: String,
  category: String,
  services: [String],
  openingHours: String,
  role: 'company',
  password: String (hashed)
}
```

### Reservation (Foglalás)
```javascript
{
  id: Number,
  userId: Number,
  companyId: Number,
  userName: String,
  companyName: String,
  service: String,
  date: String,
  time: String,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
  notes: String
}
```

## ✨ Funkciók Részletesen

### Felhasználói oldal
- ✅ Vállalkozások böngészése és keresése
- ✅ Kategóriák szerinti szűrés
- ✅ Vállalkozás részleteinek megtekintése
- ✅ Időpont foglalása
- ✅ Saját foglalások megtekintése
- ✅ Foglalások törlése

### Vállalkozási oldal
- ✅ Beérkező foglalások megtekintése
- ✅ Foglalások megerősítése
- ✅ Foglalások befejezettként jelölése
- ✅ Foglalások törlése
- ✅ Statisztikák megtekintése

## 🔧 Következő Lépések (Backend)

1. **Node.js + Express API létrehozása**
   - REST endpoints a CRUD műveletekhez
   - Authentikáció middleware JWT-vel
   - Validation és error handling

2. **MongoDB adatbázis**
   - Mongoose sémák és modellek
   - Kapcsolatok kezelése (references)
   - Indexelés és optimalizálás

3. **Üzleti logika**
   - Időpont ütközés ellenőrzés
   - Email értesítések
   - Foglalási státusz kezelés

4. **Tesztelés**
   - Unit tesztek (Jest)
   - Integration tesztek
   - E2E tesztek (Cypress)

## 📄 Licenc

Ez a projekt oktatási célokra készült.

## 👨‍💻 Készítette

ReserveIt! - Foglalási Rendszer

---

**Köszönjük, hogy használod a ReserveIt! rendszert!** 🎉

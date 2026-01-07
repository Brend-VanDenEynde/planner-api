# Planner API

Een professionele REST API voor het beheren van gebruikers en taken, gebouwd met Node.js, Express en SQLite.

## Beschrijving

Deze API biedt een complete oplossing voor taakbeheer met geavanceerde functies zoals paginering, zoeken, filtering en validatie. Het project is gebouwd met moderne best practices en bevat uitgebreide Swagger documentatie voor eenvoudige integratie.

### Belangrijkste Features

- **CRUD operaties** voor gebruikers en taken
- **Paginering** met limit en offset parameters
- **Zoekfunctionaliteit** in meerdere velden
- **Status filtering** voor taken (open, in_progress, done)
- **Geavanceerde validatie**:
  - Email format controle (regex)
  - Naam validatie (geen cijfers toegestaan)
  - Datum validatie (due_date moet in toekomst liggen)
- **Swagger UI** voor interactieve API documentatie
- **SQLite database** met foreign key constraints
- **Request logging** met response tijden

## Installatie

### Vereisten

- Node.js v20 of hoger
- npm of yarn package manager

### Stappen

1. **Clone de repository**

```bash
git clone https://github.com/Brend-VanDenEynde/planner-api.git
cd planner-api
```

2. **Installeer dependencies**

```bash
npm install
```

3. **Configureer environment variabelen (optioneel)**

```bash
cp .env.example .env
```

Het project werkt zonder `.env` bestand met default waarden (PORT=3000, NODE_ENV=development). Pas `.env` aan indien gewenst.

4. **Start de development server**

```bash
npm run dev
```

De server draait nu op `http://localhost:3000`

## API Endpoints

### Users

- `GET /api/users` - Haal alle gebruikers op
- `GET /api/users/:id` - Haal specifieke gebruiker op
- `GET /api/users/:id/tasks` - Haal taken van gebruiker op
- `POST /api/users` - Maak nieuwe gebruiker aan
- `PUT /api/users/:id` - Update gebruiker
- `DELETE /api/users/:id` - Verwijder gebruiker

### Tasks

- `GET /api/tasks` - Haal alle taken op
- `GET /api/tasks/:id` - Haal specifieke taak op
- `POST /api/tasks` - Maak nieuwe taak aan
- `PUT /api/tasks/:id` - Update taak
- `DELETE /api/tasks/:id` - Verwijder taak

### Query Parameters

**Paginering:**

```
GET /api/users?limit=10&offset=0
GET /api/tasks?limit=20&offset=10
```

**Zoeken:**

```
GET /api/users?search=jan
GET /api/tasks?search=backend
```

**Filtering:**

```
GET /api/tasks?status=open
GET /api/tasks?status=in_progress
GET /api/tasks?status=done
```

**Gecombineerd:**

```
GET /api/tasks?status=open&search=API&limit=5&offset=0
```

## Documentatie

Swagger UI is beschikbaar op de root URL:

```
http://localhost:3000/
```

Hier kun je alle endpoints testen en de volledige API specificatie bekijken.

## Database Schema

### Users Table

```sql
- id (INTEGER PRIMARY KEY)
- firstname (TEXT NOT NULL)
- lastname (TEXT NOT NULL)
- email (TEXT NOT NULL UNIQUE)
- created_at (TEXT)
```

### Tasks Table (opdrachten)

```sql
- id (INTEGER PRIMARY KEY)
- title (TEXT NOT NULL)
- description (TEXT NOT NULL)
- due_date (TEXT NOT NULL)
- status (TEXT: open, in_progress, done)
- user_id (INTEGER FOREIGN KEY)
- created_at (TEXT)
- updated_at (TEXT)
```

## Technologieën

- **Node.js** - Runtime environment
- **Express** - Web framework
- **SQLite** (better-sqlite3) - Database
- **Swagger UI** - API documentatie
- **Nodemon** - Development hot reload

## Project Structuur

```
planner-api/
├── data/
│   └── planner.db
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── seeder.js
│   │   └── swagger.js
│   ├── controllers/
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── routes/
│   │   └── index.js
│   ├── utils/
│   │   ├── validators.js
│   │   └── filters.js
│   └── index.js
├── package.json
└── README.md
```

## AI Gebruik

Bij de ontwikkeling van dit project is gebruik gemaakt van AI-assistentie op de volgende manieren:

- **AI code completions** - Voor het versnellen van code schrijven en het voorstellen van code patterns
- **AI voor commit messages** - Voor het genereren van duidelijke en consistente commit beschrijvingen
- **AI voor probleemoplossing** - Voor het opzoeken van informatie en oplossingen wanneer ik vastzat met specifieke implementaties
- **AI voor markdown formatting** - Voor het helpen met de structuur, layout en markdown types van deze README

## Bronnen

- [Express.js Documentatie](https://expressjs.com/)
- [better-sqlite3 Documentatie](https://github.com/WiseLibs/better-sqlite3)
- [Swagger UI Express](https://www.npmjs.com/package/swagger-ui-express)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [RESTful API Design](https://restfulapi.net/)

## Auteur

**Brend Van Den Eynde**

GitHub: [@Brend-VanDenEynde](https://github.com/Brend-VanDenEynde)

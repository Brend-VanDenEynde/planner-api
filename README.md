# Planner API

Een professionele REST API voor het beheren van gebruikers en taken, gebouwd met Node.js, Express en SQLite.

## Beschrijving

Deze API biedt een complete oplossing voor taakbeheer met geavanceerde functies zoals paginering, zoeken, filtering en validatie. Het project is gebouwd met moderne best practices en bevat uitgebreide Swagger documentatie voor eenvoudige integratie.

### Features

- **CRUD operaties** voor gebruikers en taken (volledige Create, Read, Update, Delete)
- **Paginering** met limit en offset parameters
- **Zoekfunctionaliteit** in meerdere velden (firstname, lastname, email voor users; title, description voor tasks)
- **Status filtering** voor taken (open, in_progress, done)
- **Gebruikers Statistieken** - totaal, open, in_progress, done, overdue per gebruiker
- **Taken per Gebruiker** - gesorteerd op deadline
- **Overdue Tasks** - alle taken die hun deadline hebben overschreden
- **Dedicated Status Update** - update alleen de status van een taak
- **Health Check** - controleer of de API beschikbaar is
- **Geavanceerde validatie**:
  - Email format controle met regex pattern
  - Naam validatie (geen cijfers toegestaan)
  - Datum validatie (due_date moet in toekomst liggen)
  - Foreign key validatie (user_id moet bestaan)
- **Swagger UI** voor interactieve API documentatie
- **SQLite database** met foreign key constraints en ON DELETE CASCADE
- **Request logging** met response tijden
- **Advanced Error Handling** - proper HTTP status codes en gedetailleerde error messages
- **Development Tools** - database seeder, nodemon, structured logging

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

### Health Check

- `GET /api/health` - Controleert of API operationeel is

### Users

- `GET /api/users` - Haal alle gebruikers op (met paginering & zoeken)
- `GET /api/users/:id` - Haal specifieke gebruiker op
- `GET /api/users/:id/tasks` - Haal alle taken van gebruiker op (sorted by due_date)
- `GET /api/users/:id/stats` - Statistieken per gebruiker (totaal, open, in_progress, done, overdue)
- `POST /api/users` - Maak nieuwe gebruiker aan
- `PUT /api/users/:id` - Update gebruiker
- `DELETE /api/users/:id` - Verwijder gebruiker (ook alle bijbehorende taken)

### Tasks

- `GET /api/tasks` - Haal alle taken op (met paginering, zoeken & filtering)
- `GET /api/tasks/:id` - Haal specifieke taak op
- `GET /api/tasks/overdue` - Haal alle te late taken op (due_date < vandaag)
- `POST /api/tasks` - Maak nieuwe taak aan
- `PUT /api/tasks/:id` - Update taak (titel, beschrijving, status, of deadline)
- `PUT /api/tasks/:id/status` - Update alleen de status van een taak
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
- **AI voor GitHub Actions** - Voor het opzetten van de build workflow en CI/CD configuratie

## Bronvermeldingen & Referenties

### Documentatie

- **[Express.js Official Documentation](https://expressjs.com/)** - Web framework setup, middleware, routing
- **[better-sqlite3 GitHub](https://github.com/WiseLibs/better-sqlite3)** - SQLite integration, database best practices
- **[Swagger/OpenAPI Specification](https://swagger.io/specification/)** - API documentation standards
- **[Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)** - Code structure, error handling, security

### Implementatie Details

- **Email Validation Regex**: Standaard email pattern uit RFC 5322 (vereenvoudigd)

  - Pattern: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
  - Referentie: [StackOverflow email validation discussion](https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript)

- **Date Validation**: JavaScript Date API voor toekomst-check

  - Best practice: Datum vergelijkingen altijd uitvoeren op UTC niveau
  - Referentie: [MDN Date Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

- **SQL Injection Prevention**: Prepared statements via better-sqlite3

  - Pattern: `db.prepare(query).run(params)` in plaats van string concatenation
  - Referentie: [OWASP SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)

- **REST API Design**: HTTP verbs en status codes
  - GET (200) - Succesvol ophalen
  - POST (201) - Succesvol aangemaakt
  - PUT (200) - Succesvol geüpdatet
  - DELETE (200) - Succesvol verwijderd
  - Referentie: [RESTful API Best Practices](https://restfulapi.net/http-status-codes/)

### Database Design

- **Foreign Key Constraints**: Relationele integriteit

  - `FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`
  - Automatisch verwijder taken wanneer gebruiker verwijderd wordt
  - Referentie: [SQLite Foreign Keys](https://www.sqlite.org/foreignkeys.html)

- **Schema Validatie**: CHECK constraints voor data kwaliteit

  - `CHECK(status IN ('open', 'in_progress', 'done'))`
  - Database-level validatie voor enum-achtige velden
  - Referentie: [SQLite Constraints](https://www.sqlite.org/syntax/column-constraint.html)

- **Timestamps**: created_at en updated_at columns
  - Automatische timestamp management met `CURRENT_TIMESTAMP`
  - Referentie: [SQLite Date/Time Functions](https://www.sqlite.org/lang_datefunc.html)

### Development & Tools

- **Nodemon**: Automatische server restart during development

  - Configuratie via `nodemon.json` (of direct in package.json scripts)
  - Referentie: [Nodemon Documentation](https://nodemon.io/)

- **CORS Configuration**: Cross-Origin Resource Sharing

  - Configuratie voor localhost development ports
  - Referentie: [Express CORS Middleware](https://expressjs.com/en/resources/middleware/cors.html)

- **Request Logging**: Performance monitoring
  - Logging van request method, path, status code, en response time
  - Nuttig voor debugging en performance analysis

### Externe Libraries

- **Express** (v5.2.1) - Web framework
- **better-sqlite3** (v12.5.0) - SQLite driver
- **swagger-jsdoc** (v6.2.8) - JSDoc to Swagger converter
- **swagger-ui-express** (v5.0.1) - Swagger UI middleware
- **cors** (v2.8.5) - CORS middleware
- **nodemon** (v3.1.11 dev) - Auto-restart tool

## Auteur

**Brend Van Den Eynde**

GitHub: [@Brend-VanDenEynde](https://github.com/Brend-VanDenEynde)

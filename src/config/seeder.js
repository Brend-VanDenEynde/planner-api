const db = require('./database');

const seedDatabase = () => {
  try {
    console.log('[SEEDER] Database seeding gestart');

    // Verwijder bestaande data
    db.prepare('DELETE FROM opdrachten').run();
    db.prepare('DELETE FROM users').run();
    console.log('[SEEDER] Bestaande data verwijderd');

    // Seed Users
    const insertUser = db.prepare(`
      INSERT INTO users (firstname, lastname, email) 
      VALUES (?, ?, ?)
    `);

    const users = [
      { firstname: 'Luc', lastname: 'Vermeulen', email: 'luc.vermeulen@email.be' },
      { firstname: 'Sofie', lastname: 'Peeters', email: 'sofie.peeters@email.be' },
      { firstname: 'Tom', lastname: 'Janssens', email: 'tom.janssens@email.be' },
      { firstname: 'Emma', lastname: 'Maes', email: 'emma.maes@email.be' },
      { firstname: 'Kevin', lastname: 'Claes', email: 'kevin.claes@email.be' },
    ];

    const userIds = [];
    users.forEach(user => {
      const result = insertUser.run(user.firstname, user.lastname, user.email);
      userIds.push(result.lastInsertRowid);
      console.log(`[SEEDER] Gebruiker aangemaakt: ${user.firstname} ${user.lastname} (ID: ${result.lastInsertRowid})`);
    });

    // Seed Tasks
    const insertTask = db.prepare(`
      INSERT INTO opdrachten (title, description, status, user_id, due_date) 
      VALUES (?, ?, ?, ?, ?)
    `);

    const tasks = [
      {
        title: 'Backend API ontwikkelen',
        description: 'REST API bouwen met Express en SQLite voor de planner applicatie',
        status: 'in_progress',
        user_id: userIds[0],
        due_date: '2026-01-15'
      },
      {
        title: 'Frontend dashboard ontwerpen',
        description: 'Moderne UI/UX ontwerpen voor het dashboard met Figma',
        status: 'open',
        user_id: userIds[1],
        due_date: '2026-01-20'
      },
      {
        title: 'Database schema optimaliseren',
        description: 'Database indexen toevoegen en query performance verbeteren',
        status: 'done',
        user_id: userIds[0],
        due_date: '2026-01-05'
      },
      {
        title: 'API documentatie schrijven',
        description: 'Swagger documentatie compleet maken voor alle endpoints',
        status: 'done',
        user_id: userIds[2],
        due_date: '2026-01-10'
      },
      {
        title: 'Unit tests implementeren',
        description: 'Test coverage verhogen naar minimaal 80% met Jest',
        status: 'open',
        user_id: userIds[1],
        due_date: '2026-01-25'
      },
      {
        title: 'Authentication systeem bouwen',
        description: 'JWT authenticatie implementeren voor beveiligde endpoints',
        status: 'in_progress',
        user_id: userIds[3],
        due_date: '2026-01-18'
      },
      {
        title: 'Email notificaties opzetten',
        description: 'Automatische emails versturen bij nieuwe taken en deadlines',
        status: 'open',
        user_id: userIds[4],
        due_date: '2026-02-01'
      },
      {
        title: 'Docker container configureren',
        description: 'Dockerfile en docker-compose.yml maken voor deployment',
        status: 'open',
        user_id: userIds[2],
        due_date: '2026-01-22'
      },
      {
        title: 'Code review uitvoeren',
        description: 'Alle pull requests reviewen en feedback geven',
        status: 'in_progress',
        user_id: userIds[3],
        due_date: '2026-01-12'
      },
      {
        title: 'Performance monitoring',
        description: 'Monitoring tools integreren voor API performance tracking',
        status: 'open',
        user_id: userIds[4],
        due_date: '2026-01-30'
      },
    ];

    tasks.forEach(task => {
      const result = insertTask.run(task.title, task.description, task.status, task.user_id, task.due_date);
      console.log(`[SEEDER] Taak aangemaakt: ${task.title} (ID: ${result.lastInsertRowid})`);
    });

    console.log('[SEEDER] Database seeding succesvol afgerond');
    console.log(`[SEEDER] Totaal: ${users.length} gebruikers en ${tasks.length} taken aangemaakt`);

  } catch (error) {
    console.error('[SEEDER] Fout bij seeden:', error.message);
    throw error;
  }
};

// Alleen seeden als dit script direct wordt uitgevoerd
if (require.main === module) {
  seedDatabase();
  process.exit(0);
}

module.exports = seedDatabase;

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { initializeDatabase, run, get } = require('../src/db');

console.log('🌱 Starting database seed...\n');

// Initialize database schema
initializeDatabase();

async function seed() {
  try {
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminResult = run(
      'INSERT OR IGNORE INTO users (email, password_hash, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)',
      ['admin@example.com', adminPassword, 'Admin', 'User', 'ADMIN']
    );
    console.log('✅ Created admin user: admin@example.com / admin123');

    // Create student user
    const studentPassword = await bcrypt.hash('student123', 10);
    const studentResult = run(
      'INSERT OR IGNORE INTO users (email, password_hash, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)',
      ['student@example.com', studentPassword, 'Student', 'User', 'STUDENT']
    );
    console.log('✅ Created student user: student@example.com / student123\n');

    // Create Levels
    const primaire = run(
      'INSERT OR IGNORE INTO levels (name, slug, "order") VALUES (?, ?, ?)',
      ['Primaire', 'primaire', 1]
    );
    const college = run(
      'INSERT OR IGNORE INTO levels (name, slug, "order") VALUES (?, ?, ?)',
      ['Collège', 'college', 2]
    );
    const lycee = run(
      'INSERT OR IGNORE INTO levels (name, slug, "order") VALUES (?, ?, ?)',
      ['Lycée', 'lycee', 3]
    );
    console.log('✅ Created education levels');

    // Get level IDs
    const primaireId = get('SELECT id FROM levels WHERE slug = ?', ['primaire']).id;
    const collegeId = get('SELECT id FROM levels WHERE slug = ?', ['college']).id;
    const lyceeId = get('SELECT id FROM levels WHERE slug = ?', ['lycee']).id;

    // Create Class Years for Primaire
    run('INSERT OR IGNORE INTO class_years (level_id, name, slug, "order") VALUES (?, ?, ?, ?)', 
      [primaireId, '1ère année', 'primaire-1', 1]);
    run('INSERT OR IGNORE INTO class_years (level_id, name, slug, "order") VALUES (?, ?, ?, ?)', 
      [primaireId, '2ème année', 'primaire-2', 2]);
    run('INSERT OR IGNORE INTO class_years (level_id, name, slug, "order") VALUES (?, ?, ?, ?)', 
      [primaireId, '3ème année', 'primaire-3', 3]);
    console.log('✅ Created Primaire class years');

    // Create Class Years for Collège
    run('INSERT OR IGNORE INTO class_years (level_id, name, slug, "order") VALUES (?, ?, ?, ?)', 
      [collegeId, '7ème année', 'college-7', 1]);
    run('INSERT OR IGNORE INTO class_years (level_id, name, slug, "order") VALUES (?, ?, ?, ?)', 
      [collegeId, '8ème année', 'college-8', 2]);
    run('INSERT OR IGNORE INTO class_years (level_id, name, slug, "order") VALUES (?, ?, ?, ?)', 
      [collegeId, '9ème année', 'college-9', 3]);
    console.log('✅ Created Collège class years');

    // Create Class Years for Lycée
    run('INSERT OR IGNORE INTO class_years (level_id, name, slug, "order") VALUES (?, ?, ?, ?)', 
      [lyceeId, '1ère année', 'lycee-1', 1]);
    run('INSERT OR IGNORE INTO class_years (level_id, name, slug, "order") VALUES (?, ?, ?, ?)', 
      [lyceeId, '2ème année', 'lycee-2', 2]);
    run('INSERT OR IGNORE INTO class_years (level_id, name, slug, "order") VALUES (?, ?, ?, ?)', 
      [lyceeId, '3ème année (Bac)', 'lycee-3-bac', 3]);
    console.log('✅ Created Lycée class years\n');

    // Get a class year ID for creating subjects
    const primaire3Id = get('SELECT id FROM class_years WHERE slug = ?', ['primaire-3']).id;
    const college9Id = get('SELECT id FROM class_years WHERE slug = ?', ['college-9']).id;

    // Create Subjects
    run(`INSERT OR IGNORE INTO subjects (class_year_id, name, slug, description, manual_path) VALUES (?, ?, ?, ?, ?)`,
      [primaire3Id, 'Mathématiques', 'mathematiques-p3', 'Cours de mathématiques pour la 3ème année primaire', 'sample-manual.pdf']);
    
    run(`INSERT OR IGNORE INTO subjects (class_year_id, name, slug, description, manual_path) VALUES (?, ?, ?, ?, ?)`,
      [primaire3Id, 'Français', 'francais-p3', 'Cours de français pour la 3ème année primaire', null]);
    
    run(`INSERT OR IGNORE INTO subjects (class_year_id, name, slug, description, manual_path) VALUES (?, ?, ?, ?, ?)`,
      [college9Id, 'Sciences Physiques', 'sciences-physiques-c9', 'Cours de sciences physiques pour la 9ème année', null]);
    
    console.log('✅ Created subjects');

    // Get subject IDs
    const mathSubjectId = get('SELECT id FROM subjects WHERE slug = ?', ['mathematiques-p3']).id;
    const francaisSubjectId = get('SELECT id FROM subjects WHERE slug = ?', ['francais-p3']).id;

    // Create Lessons
    run(`INSERT OR IGNORE INTO lessons (subject_id, title, slug, summary, "order", score) VALUES (?, ?, ?, ?, ?, ?)`,
      [mathSubjectId, 'Les nombres jusqu\'à 100', 'les-nombres-100', 'Apprendre à compter et écrire les nombres jusqu\'à 100', 1, 5]);
    
    run(`INSERT OR IGNORE INTO lessons (subject_id, title, slug, summary, "order", score) VALUES (?, ?, ?, ?, ?, ?)`,
      [mathSubjectId, 'Addition et Soustraction', 'addition-soustraction', 'Maîtriser l\'addition et la soustraction', 2, 3]);
    
    run(`INSERT OR IGNORE INTO lessons (subject_id, title, slug, summary, "order", score) VALUES (?, ?, ?, ?, ?, ?)`,
      [francaisSubjectId, 'L\'alphabet et les voyelles', 'alphabet-voyelles', 'Découvrir l\'alphabet français et les voyelles', 1, 8]);
    
    console.log('✅ Created lessons');

    // Get lesson IDs
    const lesson1Id = get('SELECT id FROM lessons WHERE slug = ?', ['les-nombres-100']).id;
    const lesson2Id = get('SELECT id FROM lessons WHERE slug = ?', ['addition-soustraction']).id;

    // Create Recorded Sessions (YouTube videos)
    run(`INSERT OR IGNORE INTO recorded_sessions (lesson_id, title, video_url, duration_seconds, score) VALUES (?, ?, ?, ?, ?)`,
      [lesson1Id, 'Introduction aux nombres', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 600, 2]);
    
    run(`INSERT OR IGNORE INTO recorded_sessions (lesson_id, title, video_url, duration_seconds, score) VALUES (?, ?, ?, ?, ?)`,
      [lesson2Id, 'Exercices d\'addition', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 900, 4]);
    
    console.log('✅ Created recorded sessions');

    // Create Exercises
    run(`INSERT OR IGNORE INTO exercises (lesson_id, title, description, difficulty, score) VALUES (?, ?, ?, ?, ?)`,
      [lesson1Id, 'Exercice 1: Compter jusqu\'à 100', 'Pratiquez le comptage des nombres', 'EASY', 1]);
    
    run(`INSERT OR IGNORE INTO exercises (lesson_id, title, description, difficulty, score) VALUES (?, ?, ?, ?, ?)`,
      [lesson1Id, 'Exercice 2: Écrire les nombres', 'Écrivez les nombres en chiffres et en lettres', 'MEDIUM', 0]);
    
    run(`INSERT OR IGNORE INTO exercises (lesson_id, title, description, difficulty, score) VALUES (?, ?, ?, ?, ?)`,
      [lesson2Id, 'Série d\'additions', 'Résoudre 20 additions simples', 'MEDIUM', 2]);
    
    console.log('✅ Created exercises\n');

    console.log('═══════════════════════════════════════════════');
    console.log('🎉 Seed completed successfully!');
    console.log('═══════════════════════════════════════════════');
    console.log('\n📋 Test Credentials:');
    console.log('   Admin:   admin@example.com / admin123');
    console.log('   Student: student@example.com / student123');
    console.log('\n🔗 Sample URLs:');
    console.log('   Browse: http://localhost:3000/api/v1/levels');
    console.log('   Subject: http://localhost:3000/api/v1/subjects/mathematiques-p3');
    console.log('   Lesson: http://localhost:3000/api/v1/lessons/les-nombres-100');
    console.log('\n💡 Start the server: npm start or npm run dev');
    console.log('═══════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();

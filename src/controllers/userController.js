const db = require('../config/database');

// Get all users
const getAllUsers = (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    
    const users = db.prepare('SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?').all(limit, offset);
    const total = db.prepare('SELECT COUNT(*) as count FROM users').get();
    
    console.log(`[USERS] GET all - ${users.length} records (limit: ${limit}, offset: ${offset})`);
    res.json({ 
      users,
      pagination: {
        limit,
        offset,
        total: total.count
      }
    });
  } catch (err) {
    console.error('[USERS] GET all - Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get single user
const getUserById = (req, res) => {
  const { id } = req.params;
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!user) {
      console.log(`[USERS] GET by ID ${id} - Not found`);
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(`[USERS] GET by ID ${id} - Success`);
    res.json({ user });
  } catch (err) {
    console.error(`[USERS] GET by ID ${id} - Error:`, err.message);
    res.status(500).json({ error: err.message });
  }
};

// Create user
const createUser = (req, res) => {
  const { firstname, lastname, email } = req.body;
  
  if (!firstname || !lastname || !email) {
    console.log('[USERS] POST - Validation failed: Missing required fields');
    return res.status(400).json({ error: 'Firstname, lastname and email are required' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO users (firstname, lastname, email) 
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(firstname, lastname, email);
    console.log(`[USERS] POST - Created user ID ${result.lastInsertRowid}`);
    
    res.status(201).json({ 
      message: 'User created',
      user: { 
        id: result.lastInsertRowid, 
        firstname, 
        lastname, 
        email
      }
    });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      console.log('[USERS] POST - Conflict: Email already exists');
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error('[USERS] POST - Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Update user
const updateUser = (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email } = req.body;

  try {
    const stmt = db.prepare(`
      UPDATE users 
      SET firstname = COALESCE(?, firstname),
          lastname = COALESCE(?, lastname),
          email = COALESCE(?, email)
      WHERE id = ?
    `);
    
    const result = stmt.run(firstname, lastname, email, id);
    
    if (result.changes === 0) {
      console.log(`[USERS] PUT ID ${id} - Not found`);
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(`[USERS] PUT ID ${id} - Updated successfully`);
    res.json({ message: 'User updated', changes: result.changes });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      console.log(`[USERS] PUT ID ${id} - Conflict: Email already exists`);
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error(`[USERS] PUT ID ${id} - Error:`, err.message);
    res.status(500).json({ error: err.message });
  }
};

// Delete user
const deleteUser = (req, res) => {
  const { id } = req.params;
  
  try {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
      console.log(`[USERS] DELETE ID ${id} - Not found`);
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(`[USERS] DELETE ID ${id} - Deleted successfully`);
    res.json({ message: 'User deleted', changes: result.changes });
  } catch (err) {
    console.error(`[USERS] DELETE ID ${id} - Error:`, err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get all tasks for a specific user
const getUserTasks = (req, res) => {
  const { id } = req.params;
  
  try {
    // Check if user exists
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!user) {
      console.log(`[USERS] GET tasks for ID ${id} - User not found`);
      return res.status(404).json({ error: 'User not found' });
    }
    
    const tasks = db.prepare('SELECT * FROM opdrachten WHERE user_id = ? ORDER BY due_date ASC').all(id);
    console.log(`[USERS] GET tasks for ID ${id} - ${tasks.length} tasks found`);
    res.json({ 
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      },
      tasks 
    });
  } catch (err) {
    console.error(`[USERS] GET tasks for ID ${id} - Error:`, err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserTasks
};

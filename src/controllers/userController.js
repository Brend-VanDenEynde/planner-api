const db = require('../config/database');

// Get all users
const getAllUsers = (req, res) => {
  try {
    const users = db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single user
const getUserById = (req, res) => {
  const { id } = req.params;
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create user
const createUser = (req, res) => {
  const { firstname, lastname, email } = req.body;
  
  if (!firstname || !lastname || !email) {
    return res.status(400).json({ error: 'Firstname, lastname and email are required' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO users (firstname, lastname, email) 
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(firstname, lastname, email);
    
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
      return res.status(400).json({ error: 'Email already exists' });
    }
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
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User updated', changes: result.changes });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Email already exists' });
    }
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
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted', changes: result.changes });
  } catch (err) {
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
      return res.status(404).json({ error: 'User not found' });
    }
    
    const tasks = db.prepare('SELECT * FROM opdrachten WHERE user_id = ? ORDER BY due_date ASC').all(id);
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

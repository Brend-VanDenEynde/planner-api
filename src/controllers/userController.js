const db = require('../config/database');
const { validateName, validateEmail } = require('../utils/validators');

// Get all users
const getAllUsers = (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const search = req.query.search || '';
    
    let query = 'SELECT * FROM users';
    let countQuery = 'SELECT COUNT(*) as count FROM users';
    let params = [];
    let countParams = [];
    
    if (search) {
      const searchPattern = `%${search}%`;
      query += ' WHERE firstname LIKE ? OR lastname LIKE ? OR email LIKE ?';
      countQuery += ' WHERE firstname LIKE ? OR lastname LIKE ? OR email LIKE ?';
      params = [searchPattern, searchPattern, searchPattern];
      countParams = [searchPattern, searchPattern, searchPattern];
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const users = db.prepare(query).all(...params);
    const total = db.prepare(countQuery).get(...countParams);
    
    console.log(`[USERS] GET all - ${users.length} records (limit: ${limit}, offset: ${offset}, search: "${search}")`);
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
  
  // Valideer velden
  const firstnameError = validateName(firstname, 'Firstname');
  if (firstnameError) {
    console.log('[USERS] POST - Validation failed:', firstnameError);
    return res.status(400).json({ error: firstnameError });
  }
  
  const lastnameError = validateName(lastname, 'Lastname');
  if (lastnameError) {
    console.log('[USERS] POST - Validation failed:', lastnameError);
    return res.status(400).json({ error: lastnameError });
  }
  
  const emailError = validateEmail(email);
  if (emailError) {
    console.log('[USERS] POST - Validation failed:', emailError);
    return res.status(400).json({ error: emailError });
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

  // Valideer alleen als velden worden meegegeven
  if (firstname !== undefined) {
    const firstnameError = validateName(firstname, 'Firstname');
    if (firstnameError) {
      console.log(`[USERS] PUT ID ${id} - Validation failed:`, firstnameError);
      return res.status(400).json({ error: firstnameError });
    }
  }
  
  if (lastname !== undefined) {
    const lastnameError = validateName(lastname, 'Lastname');
    if (lastnameError) {
      console.log(`[USERS] PUT ID ${id} - Validation failed:`, lastnameError);
      return res.status(400).json({ error: lastnameError });
    }
  }
  
  if (email !== undefined) {
    const emailError = validateEmail(email);
    if (emailError) {
      console.log(`[USERS] PUT ID ${id} - Validation failed:`, emailError);
      return res.status(400).json({ error: emailError });
    }
  }

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

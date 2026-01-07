const db = require('../config/database');
const { validateDueDate } = require('../utils/validators');

// Get all opdrachten
const getAllTasks = (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const search = req.query.search || '';
    
    let query = 'SELECT * FROM opdrachten';
    let countQuery = 'SELECT COUNT(*) as count FROM opdrachten';
    let params = [];
    
    if (search) {
      const searchPattern = `%${search}%`;
      query += ' WHERE title LIKE ? OR description LIKE ?';
      countQuery += ' WHERE title LIKE ? OR description LIKE ?';
      params = [searchPattern, searchPattern];
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const tasks = db.prepare(query).all(...params);
    const total = db.prepare(countQuery).get(...(search ? [searchPattern, searchPattern] : []));
    
    console.log(`[TASKS] GET all - ${tasks.length} records (limit: ${limit}, offset: ${offset}, search: "${search}")`);
    res.json({ 
      tasks,
      pagination: {
        limit,
        offset,
        total: total.count
      }
    });
  } catch (err) {
    console.error('[TASKS] GET all - Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get single opdracht
const getTaskById = (req, res) => {
  const { id } = req.params;
  try {
    const task = db.prepare('SELECT * FROM opdrachten WHERE id = ?').get(id);
    if (!task) {
      console.log(`[TASKS] GET by ID ${id} - Not found`);
      return res.status(404).json({ error: 'Task not found' });
    }
    console.log(`[TASKS] GET by ID ${id} - Success`);
    res.json({ task });
  } catch (err) {
    console.error(`[TASKS] GET by ID ${id} - Error:`, err.message);
    res.status(500).json({ error: err.message });
  }
};

// Create opdracht
const createTask = (req, res) => {
  const { title, description, status, user_id, due_date } = req.body;
  
  if (!title || !description || !user_id || !due_date) {
    console.log('[TASKS] POST - Validation failed: Missing required fields');
    return res.status(400).json({ error: 'Title, description, user_id and due_date are required' });
  }
  
  // Valideer due_date
  const dueDateError = validateDueDate(due_date);
  if (dueDateError) {
    console.log('[TASKS] POST - Validation failed:', dueDateError);
    return res.status(400).json({ error: dueDateError });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO opdrachten (title, description, status, user_id, due_date) 
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(title, description, status || 'open', user_id, due_date);
    console.log(`[TASKS] POST - Created task ID ${result.lastInsertRowid} for user ${user_id}`);
    
    res.status(201).json({ 
      message: 'Task created',
      task: { 
        id: result.lastInsertRowid, 
        title, 
        description, 
        status: status || 'open',
        user_id,
        due_date
      }
    });
  } catch (err) {
    console.error('[TASKS] POST - Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Update opdracht
const updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, status, due_date } = req.body;

  // Valideer due_date als het wordt meegegeven
  if (due_date !== undefined) {
    const dueDateError = validateDueDate(due_date);
    if (dueDateError) {
      console.log(`[TASKS] PUT ID ${id} - Validation failed:`, dueDateError);
      return res.status(400).json({ error: dueDateError });
    }
  }

  try {
    const stmt = db.prepare(`
      UPDATE opdrachten 
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          status = COALESCE(?, status),
          due_date = COALESCE(?, due_date),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    const result = stmt.run(title, description, status, due_date, id);
    
    if (result.changes === 0) {
      console.log(`[TASKS] PUT ID ${id} - Not found`);
      return res.status(404).json({ error: 'Task not found' });
    }
    console.log(`[TASKS] PUT ID ${id} - Updated successfully`);
    res.json({ message: 'Task updated', changes: result.changes });
  } catch (err) {
    console.error(`[TASKS] PUT ID ${id} - Error:`, err.message);
    res.status(500).json({ error: err.message });
  }
};

// Delete opdracht
const deleteTask = (req, res) => {
  const { id } = req.params;
  
  try {
    const stmt = db.prepare('DELETE FROM opdrachten WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
      console.log(`[TASKS] DELETE ID ${id} - Not found`);
      return res.status(404).json({ error: 'Task not found' });
    }
    console.log(`[TASKS] DELETE ID ${id} - Deleted successfully`);
    res.json({ message: 'Task deleted', changes: result.changes });
  } catch (err) {
    console.error(`[TASKS] DELETE ID ${id} - Error:`, err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};

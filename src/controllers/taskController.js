const db = require('../config/database');
const { validateDueDate, userExists } = require('../utils/validators');
const { buildTasksFilterQuery } = require('../utils/filters');

// Get all opdrachten
const getAllTasks = (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const search = req.query.search || '';
    const status = req.query.status || '';
    
    // Bouw filter query met WHERE clause
    const { whereClause, params } = buildTasksFilterQuery(search, status);
    
    const query = `SELECT * FROM opdrachten${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    const countQuery = `SELECT COUNT(*) as count FROM opdrachten${whereClause}`;
    
    const tasks = db.prepare(query).all(...params, limit, offset);
    const total = db.prepare(countQuery).get(...params);
    
    console.log(`[TASKS] GET all - ${tasks.length} records (limit: ${limit}, offset: ${offset}, search: "${search}", status: "${status}")`);
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
  
  // Valideer of user bestaat
  if (!userExists(db, user_id)) {
    console.log('[TASKS] POST - Validation failed: User does not exist');
    return res.status(400).json({ error: 'User_id does not exist' });
  }
  
  // Valideer due_date (moet in toekomst liggen, dus automatisch na created_at)
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

// Get overdue tasks
const getOverdueTasks = (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const tasks = db.prepare(`
      SELECT * FROM opdrachten 
      WHERE due_date < ? AND status != 'done'
      ORDER BY due_date ASC
    `).all(today);
    
    console.log(`[TASKS] GET overdue - ${tasks.length} records`);
    res.json({ 
      overdue_tasks: tasks,
      count: tasks.length
    });
  } catch (err) {
    console.error('[TASKS] GET overdue - Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Update only status
const updateTaskStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status) {
    console.log(`[TASKS] PATCH status ID ${id} - Missing status`);
    return res.status(400).json({ error: 'Status is required' });
  }
  
  const validStatuses = ['open', 'in_progress', 'done'];
  if (!validStatuses.includes(status)) {
    console.log(`[TASKS] PATCH status ID ${id} - Invalid status: ${status}`);
    return res.status(400).json({ error: 'Invalid status. Must be: open, in_progress, or done' });
  }
  
  try {
    const stmt = db.prepare(`
      UPDATE opdrachten 
      SET status = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    const result = stmt.run(status, id);
    
    if (result.changes === 0) {
      console.log(`[TASKS] PATCH status ID ${id} - Not found`);
      return res.status(404).json({ error: 'Task not found' });
    }
    console.log(`[TASKS] PATCH status ID ${id} - Updated to ${status}`);
    res.json({ message: 'Task status updated', status });
  } catch (err) {
    console.error(`[TASKS] PATCH status ID ${id} - Error:`, err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getOverdueTasks,
  updateTaskStatus
};

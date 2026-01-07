// Geldige task statussen
const VALID_STATUSES = ['open', 'in_progress', 'done'];

// Valideer of status geldig is
const isValidStatus = (status) => {
  return VALID_STATUSES.includes(status);
};

// Bouw WHERE clause voor tasks filtering
const buildTasksFilterQuery = (search, status) => {
  const conditions = [];
  const params = [];

  if (search) {
    const searchPattern = `%${search}%`;
    conditions.push('(title LIKE ? OR description LIKE ?)');
    params.push(searchPattern, searchPattern);
  }

  if (status && isValidStatus(status)) {
    conditions.push('status = ?');
    params.push(status);
  }

  const whereClause = conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';
  
  return { whereClause, params };
};

module.exports = {
  VALID_STATUSES,
  isValidStatus,
  buildTasksFilterQuery
};

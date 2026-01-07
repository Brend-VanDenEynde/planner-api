// Email format validatie
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Naam validatie (mag geen cijfers bevatten)
const isValidName = (name) => {
  const nameRegex = /^[^\d]+$/;
  return nameRegex.test(name);
};

// Datum validatie (moet in toekomst liggen)
const isValidFutureDate = (dateString) => {
  const inputDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset tijd naar middernacht voor correcte vergelijking
  
  return inputDate >= today;
};

// Validatie helper voor naam velden
const validateName = (name, fieldName) => {
  if (!name || name.trim() === '') {
    return `${fieldName} is required`;
  }
  if (!isValidName(name)) {
    return `${fieldName} mag geen cijfers bevatten`;
  }
  return null;
};

// Validatie helper voor email
const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return 'Email is required';
  }
  if (!isValidEmail(email)) {
    return 'Ongeldig email formaat';
  }
  return null;
};

// Validatie helper voor due_date
const validateDueDate = (dueDate) => {
  if (!dueDate || dueDate.trim() === '') {
    return 'Due date is required';
  }
  if (!isValidFutureDate(dueDate)) {
    return 'Due date moet in de toekomst liggen';
  }
  return null;
};

module.exports = {
  isValidEmail,
  isValidName,
  isValidFutureDate,
  validateName,
  validateEmail,
  validateDueDate
};

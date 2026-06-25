export const isValidEmail = (email) =>{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export const isValidPassword = (password) => {
    return password && password.length >= 6;
}

export const isValidUsername = (username) => {
  // Alphanumeric, underscore, 3-20 characters
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

export const validateRegister = (username,email,password) => {
    const errors = [];

     if (!username || !isValidUsername(username)) {
    errors.push('Username must be 3-20 alphanumeric characters');
  }

    if (!email || !isValidEmail(email)) {
    errors.push('Invalid email format');
  }

    if (!password || !isValidPassword(password)) {
    errors.push('Password must be at least 6 characters');
  }

    return {
    isValid: errors.length === 0,
    errors
  };

}
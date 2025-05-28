// Function to handle user registration
async function registerUser(username, email, password) {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    // Save token to localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// Function to handle user login
async function loginUser(username, password) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    // Save token to localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}
// Function to delete multiple users by their IDs
async function deleteUsers(userIds) {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('User not authenticated');

    const response = await fetch('/api/auth/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userIds })  // send array of IDs to delete
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete users');
    }

    return data; // can return info about deleted users or success message
  } catch (error) {
    console.error('Delete users error:', error);
    throw error;
  }
}


// Function to check if user is logged in
function isLoggedIn() {
  return localStorage.getItem('token') !== null;
}

// Function to get current user
function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Function to logout user
function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/pages/main.html';
}

// Function to get auth token
function getToken() {
  return localStorage.getItem('token');
}

module.exports = {
  registerUser,
  loginUser,
  deleteUsers,
  isLoggedIn,
  getCurrentUser,
  logoutUser,
  getToken
};


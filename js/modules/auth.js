window.Auth = {
  init: () => {
    if (!localStorage.getItem('tv_users')) window.Auth.seedDemoData();
  },
  seedDemoData: () => {
    const users = [
      { id: 'u1', name: 'John Doe', email: 'john@demo.com', password: btoa('password123'), role: 'user', avatar: '', createdAt: new Date().toISOString() },
      { id: 'u2', name: 'Jane Smith', email: 'jane@demo.com', password: btoa('password123'), role: 'user', avatar: '', createdAt: new Date().toISOString() },
      { id: 'admin1', name: 'Admin User', email: 'admin@travelverse.com', password: btoa('admin123'), role: 'admin', avatar: '', createdAt: new Date().toISOString() }
    ];
    localStorage.setItem('tv_users', JSON.stringify(users));
  },
  getUsers: () => JSON.parse(localStorage.getItem('tv_users') || '[]'),
  register: (name, email, password) => {
    const users = window.Auth.getUsers();
    if (users.find(u => u.email === email)) return { success: false, message: 'Email already exists' };
    const user = { id: window.Utils.generateId(), name, email, password: btoa(password), role: 'user', avatar: '', createdAt: new Date().toISOString() };
    users.push(user);
    localStorage.setItem('tv_users', JSON.stringify(users));
    const session = { userId: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, expiresAt: Date.now() + 86400000 };
    localStorage.setItem('tv_session', JSON.stringify(session));
    return { success: true, message: 'Registration successful', user };
  },
  login: (email, password) => {
    const users = window.Auth.getUsers();
    const user = users.find(u => u.email === email && u.password === btoa(password));
    if (!user) return { success: false, message: 'Invalid credentials' };
    const session = { userId: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, expiresAt: Date.now() + 86400000 };
    localStorage.setItem('tv_session', JSON.stringify(session));
    return { success: true, message: 'Login successful', user };
  },
  logout: () => {
    localStorage.removeItem('tv_session');
    window.location.href = './index.html';
  },
  getCurrentUser: () => {
    const session = JSON.parse(localStorage.getItem('tv_session'));
    if (!session) return null;
    if (session.expiresAt < Date.now()) { window.Auth.logout(); return null; }
    return session;
  },
  isLoggedIn: () => !!window.Auth.getCurrentUser(),
  isAdmin: () => {
    const user = window.Auth.getCurrentUser();
    return user && user.role === 'admin';
  },
  requireAuth: (redirectUrl = window.location.pathname) => {
    if (!window.Auth.isLoggedIn()) window.location.href = `./auth.html?redirect=${encodeURIComponent(redirectUrl)}`;
  },
  requireAdmin: () => {
    if (!window.Auth.isAdmin()) window.location.href = './index.html';
  },
  updateProfile: (data) => {
    let users = window.Auth.getUsers();
    let session = window.Auth.getCurrentUser();
    if (!session) return false;
    const idx = users.findIndex(u => u.id === session.userId);
    if (idx > -1) {
      users[idx] = { ...users[idx], ...data };
      session = { ...session, ...data };
      localStorage.setItem('tv_users', JSON.stringify(users));
      localStorage.setItem('tv_session', JSON.stringify(session));
      return true;
    }
    return false;
  }
};

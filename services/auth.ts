import { User } from '../types';

const STORAGE_KEY = 'career_compass_user';
const USERS_DB_KEY = 'career_compass_users_db';

interface StoredUser extends User {
  password: string; // Mock only!
}

export const getStoredUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

// Helper to get all registered users, seeding a demo user if empty
const getUsers = (): StoredUser[] => {
    const stored = localStorage.getItem(USERS_DB_KEY);
    let users: StoredUser[] = [];
    
    if (stored) {
        try {
            users = JSON.parse(stored);
        } catch (e) {
            users = [];
        }
    }

    // Seed with demo user if DB is empty (null or empty array)
    if (users.length === 0) {
        const demoUser: StoredUser = {
            id: 'demo-user-id',
            email: 'demo@example.com',
            name: 'Demo User',
            password: 'password'
        };
        users = [demoUser];
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    }
    
    return users;
}

export const loginUser = async (email: string, password: string): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const { password: _, ...safeUser } = user;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
  return safeUser;
};

export const signupUser = async (email: string, name: string, password: string): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPassword = password.trim();

    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === cleanEmail)) {
        throw new Error('User already exists with this email');
    }

    const newUser: StoredUser = {
        id: cleanEmail.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(),
        email: cleanEmail,
        name: cleanName,
        password: cleanPassword
    };

    users.push(newUser);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));

    const { password: _, ...safeUser } = newUser;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
    return safeUser;
};

export const logoutUser = () => {
  localStorage.removeItem(STORAGE_KEY);
};
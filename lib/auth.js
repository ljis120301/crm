import { prisma } from './db';
import crypto from 'crypto';

// Password hashing utilities
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, hashedPassword) {
  const [salt, hash] = hashedPassword.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

// Session management
export function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

export async function createSession(userId) {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  console.log('Creating session:', {
    userId,
    hasToken: !!token,
    expiresAt: expiresAt.toISOString()
  });

  const session = await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  console.log('Session created:', {
    sessionId: session.id,
    hasToken: !!session.token
  });

  return session;
}

export async function getSession(token) {
  if (!token) {
    console.log('No session token provided');
    return null;
  }

  console.log('Looking up session with token:', token.substring(0, 8) + '...');

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) {
    console.log('Session not found');
    return null;
  }

  if (session.expiresAt < new Date()) {
    console.log('Session expired, deleting');
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  console.log('Session found and valid:', {
    sessionId: session.id,
    userId: session.userId,
    username: session.user?.username,
    role: session.user?.role
  });

  return session;
}

export async function deleteSession(token) {
  await prisma.session.deleteMany({
    where: { token },
  });
}

// User authentication
export async function authenticateUser(username, password) {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user || !user.isActive) {
    return null;
  }

  if (!verifyPassword(password, user.password)) {
    return null;
  }

  return user;
}

export async function authenticateAdmin(adminPassword) {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const isValid = adminPassword === expectedPassword;
  
  console.log('Admin authentication:', {
    hasProvidedPassword: !!adminPassword,
    hasExpectedPassword: !!expectedPassword,
    isValid
  });
  
  return isValid;
}

// User management
export async function createUser(username, password, role = 'receptionist') {
  const hashedPassword = hashPassword(password);
  
  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      role,
    },
  });

  return user;
}

export async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

export async function getAllUsers() {
  return await prisma.user.findMany({
    where: { role: 'receptionist' },
    select: {
      id: true,
      username: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });
}

export async function updateUserStatus(id, isActive) {
  return await prisma.user.update({
    where: { id },
    data: { isActive },
  });
}

export async function deleteUser(id) {
  return await prisma.user.delete({
    where: { id },
  });
} 
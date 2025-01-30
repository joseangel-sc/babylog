import { vi, describe, it, expect } from 'vitest';
import { db } from '~/.server/db';
import { createUser, verifyLogin } from '~/.server/user';
import { hashPassword, verifyPassword } from '~/.server/auth';

vi.mock('~/.server/db', () => ({
  db: {
    user: {
      create: vi.fn(),
      findUnique: vi.fn()
    }
  }
}));

vi.mock('~/.server/auth', () => ({
  hashPassword: vi.fn(),
  verifyPassword: vi.fn()
}));

describe('user service', () => {
  it('creates user correctly', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      passwordHash: 'hashedPassword123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    vi.mocked(hashPassword).mockResolvedValueOnce('hashedPassword123');
    vi.mocked(db.user.create).mockResolvedValueOnce(mockUser);
    
    const result = await createUser({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890'
    });

    expect(result).toEqual(mockUser);
  });

  it('verifies login correctly', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      passwordHash: 'hashedPassword123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    vi.mocked(db.user.findUnique).mockResolvedValueOnce(mockUser);
    vi.mocked(verifyPassword).mockResolvedValueOnce(true);
    
    const result = await verifyLogin('test@example.com', 'password123');
    expect(result).toEqual(expect.objectContaining({
      id: 1,
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890'
    }));
  });

  it('returns null for non-existent user', async () => {
    vi.mocked(db.user.findUnique).mockResolvedValueOnce(null);
    
    const result = await verifyLogin('nonexistent@example.com', 'password123');
    expect(result).toBeNull();
  });
}); 
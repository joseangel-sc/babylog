import { describe, expect, it, vi } from 'vitest';
import { db } from '~/.server/db';

import { hashPassword, verifyPassword, verifyLogin } from '~/.server/auth';

vi.mock('~/.server/db', () => ({
  db: {
    user: {
      findUnique: vi.fn()
    }
  }
}));

describe('auth service', () => {
  it('hashes password correctly', async () => {
    const password = 'testPassword123';
    const hashedPassword = await hashPassword(password);
    expect(hashedPassword).toBeDefined();
    expect(hashedPassword).not.toBe(password);
  });

  it('verifies password correctly', async () => {
    const password = 'testPassword123';
    const hashedPassword = await hashPassword(password);
    
    const isValid = await verifyPassword(password, hashedPassword);
    expect(isValid).toBe(true);
  });

  it('returns null for non-existent user', async () => {
    vi.mocked(db.user.findUnique).mockResolvedValueOnce(null);
    
    const result = await verifyLogin('test@example.com', 'password123');
    expect(result).toBeNull();
  });
}); 
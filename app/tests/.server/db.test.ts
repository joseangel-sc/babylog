import { vi, describe, it, expect, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

vi.mock('@prisma/client', () => {
  const mockConnect = vi.fn();
  const PrismaClient = vi.fn(() => ({
    $connect: mockConnect,
    $disconnect: vi.fn()
  }));
  return { PrismaClient };
});

describe('database setup', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('creates new PrismaClient in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    await import('~/.server/db');
    expect(PrismaClient).toHaveBeenCalled();
  });

  it('reuses PrismaClient in development', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    
    const { db: firstDb } = await import('~/.server/db');
    const { db: secondDb } = await import('~/.server/db');
    
    expect(PrismaClient).toHaveBeenCalledTimes(1);
    expect(firstDb).toBe(secondDb);
  });
}); 
import { describe, expect, it, vi } from 'vitest';
import { db } from '~/.server/db';
import { createBaby, getBaby, getUserBabies } from '~/.server/baby';

vi.mock('~/.server/db', () => ({
  db: {
    baby: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn()
    }
  }
}));

describe('baby service', () => {
  it('creates baby correctly', async () => {
    const mockBaby = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('2024-01-01'),
      gender: 'male',
      ownerId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    vi.mocked(db.baby.create).mockResolvedValueOnce(mockBaby);
    
    const result = await createBaby(1, {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('2024-01-01'),
      gender: 'male'
    });

    expect(result).toEqual(mockBaby);
  });

  it('gets baby by id with relations', async () => {
    const mockBaby = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('2024-01-01'),
      gender: 'male',
      ownerId: 1,
      owner: { id: 1, email: 'test@example.com' },
      caregivers: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    vi.mocked(db.baby.findUnique).mockResolvedValueOnce(mockBaby);
    
    const result = await getBaby(1);
    expect(result).toEqual(mockBaby);
  });

  it('gets user babies', async () => {
    const mockBabies = [{
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('2024-01-01'),
      gender: 'male',
      ownerId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }];

    vi.mocked(db.baby.findMany).mockResolvedValueOnce(mockBabies);
    
    const result = await getUserBabies(1);
    expect(result).toEqual(mockBabies);
  });
}); 

import { describe, expect, it, vi } from 'vitest';
import { db } from '~/.server/db';
import { addCaregiver, removeCaregiver } from '~/.server/caregiver';

vi.mock('~/.server/db', () => ({
  db: {
    babyCaregiver: {
      create: vi.fn(),
      delete: vi.fn()
    }
  }
}));

describe('caregiver service', () => {
  it('adds caregiver correctly', async () => {
    const mockCaregiver = {
      id: 1,
      babyId: 1,
      userId: 2,
      relationship: 'grandmother',
      permissions: ['view', 'log'],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    vi.mocked(db.babyCaregiver.create).mockResolvedValueOnce(mockCaregiver);
    
    const result = await addCaregiver(1, 2, 'grandmother');
    expect(result).toEqual(mockCaregiver);
  });

  it('removes caregiver correctly', async () => {
    const mockCaregiver = {
      id: 1,
      babyId: 1,
      userId: 2,
      relationship: 'grandmother',
      permissions: ['view', 'log'],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    vi.mocked(db.babyCaregiver.delete).mockResolvedValueOnce(mockCaregiver);
    
    const result = await removeCaregiver(1, 2);
    expect(result).toEqual(mockCaregiver);
  });
}); 

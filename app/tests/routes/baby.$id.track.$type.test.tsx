import { test, expect, vi, describe, beforeEach } from 'vitest';
import { loader, action } from '~/routes/baby.$id.track.$type';
import { getBaby } from '~/.server/baby';
import { requireUserId } from '~/.server/session';
import { trackElimination, trackFeeding, trackSleep } from '~/.server/tracking';

// Mock dependencies
vi.mock('~/.server/baby');
vi.mock('~/.server/session');
vi.mock('~/.server/tracking');

describe('baby.$id.track.$type', () => {
  const mockBaby = {
    id: 1,
    ownerId: 'user123',
    caregivers: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireUserId).mockResolvedValue('user123');
    vi.mocked(getBaby).mockResolvedValue(mockBaby);
  });

  describe('loader', () => {
    test('returns tracking config for elimination', async () => {
      const request = new Request('http://test.com');
      const result = await loader({ 
        request, 
        params: { id: '1', type: 'elimination' },
        context: {}
      });
      const data = await result.json();
      
      expect(data.trackingConfig.title).toBe('Elimination');
      expect(data.baby).toEqual(mockBaby);
    });

    test('redirects for invalid tracking type', async () => {
      const request = new Request('http://test.com');
      const result = await loader({ 
        request, 
        params: { id: '1', type: 'invalid' },
        context: {}
      });
      
      expect(result.status).toBe(302);
      expect(result.headers.get('Location')).toBe('/baby/1');
    });

    test('redirects if user is not authorized', async () => {
      vi.mocked(requireUserId).mockResolvedValue('unauthorized');
      const request = new Request('http://test.com');
      const result = await loader({ 
        request, 
        params: { id: '1', type: 'elimination' },
        context: {}
      });
      
      expect(result.status).toBe(302);
      expect(result.headers.get('Location')).toBe('/dashboard');
    });
  });

  describe('action', () => {
    test('handles elimination tracking', async () => {
      const formData = new FormData();
      formData.append('timestamp', '2024-01-01T12:00');
      formData.append('type', 'wet');
      formData.append('weight', '100');
      formData.append('notes', 'test notes');

      const request = new Request('http://test.com', {
        method: 'POST',
        body: formData
      });

      await action({ 
        request, 
        params: { id: '1', type: 'elimination' },
        context: {}
      });

      expect(trackElimination).toHaveBeenCalledWith({
        babyId: 1,
        type: 'wet',
        timestamp: new Date('2024-01-01T12:00'),
        weight: 100,
        notes: 'test notes'
      });
    });

    test('handles feeding tracking', async () => {
      const formData = new FormData();
      formData.append('timestamp', '2024-01-01T12:00');
      formData.append('type', 'breast');
      formData.append('amount', '150');
      formData.append('notes', 'test notes');

      const request = new Request('http://test.com', {
        method: 'POST',
        body: formData
      });

      await action({ 
        request, 
        params: { id: '1', type: 'feeding' },
        context: {}
      });

      expect(trackFeeding).toHaveBeenCalledWith({
        babyId: 1,
        type: 'breast',
        startTime: new Date('2024-01-01T12:00'),
        amount: 150,
        notes: 'test notes'
      });
    });

    test('handles sleep tracking', async () => {
      const formData = new FormData();
      formData.append('timestamp', '2024-01-01T12:00');
      formData.append('type', 'nap');
      formData.append('quality', '5');
      formData.append('notes', 'test notes');

      const request = new Request('http://test.com', {
        method: 'POST',
        body: formData
      });

      await action({ 
        request, 
        params: { id: '1', type: 'sleep' },
        context: {}
      });

      expect(trackSleep).toHaveBeenCalledWith({
        babyId: 1,
        type: 'nap',
        startTime: new Date('2024-01-01T12:00'),
        quality: 5,
        notes: 'test notes'
      });
    });
  });
}); 
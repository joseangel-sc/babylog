import { describe, expect, it } from 'vitest';
import { createUserSession, getUserId, requireUserId, logout } from '~/.server/session';

describe('session service', () => {
  it('creates user session', async () => {
    const session = await createUserSession(1, '/dashboard');
    expect(session.headers).toBeDefined();
    expect(session.headers.get('Set-Cookie')).toBeDefined();
    expect(session.headers.get('Location')).toBe('/dashboard');
  });

  it('gets user id from session', async () => {
    const mockRequest = new Request('http://localhost:3000', {
      headers: {
        Cookie: '_session=someSessionData'
      }
    });

    const userId = await getUserId(mockRequest);
    expect(userId).toBeDefined();
  });

  it('requires user id and redirects if not found', async () => {
    const mockRequest = new Request('http://localhost:3000');
    
    try {
      await requireUserId(mockRequest);
      fail('Should have thrown redirect');
    } catch (error) {
      const response = error as Response;
      expect(response.status).toBe(302);
      expect(response.headers.get('Location')).toBe('/login');
    }
  });

  it('logs out user and clears session', async () => {
    const mockRequest = new Request('http://localhost:3000', {
      headers: {
        Cookie: '_session=someSessionData'
      }
    });

    const response = await logout(mockRequest);
    expect(response.headers.get('Set-Cookie')).toBeDefined();
    expect(response.headers.get('Location')).toBe('/');
  });
}); 

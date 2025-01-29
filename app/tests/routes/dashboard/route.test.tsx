import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRemixStub } from '@remix-run/testing';
import Dashboard from '~/routes/dashboard/route';
import { json } from '@remix-run/node';

vi.mock('~/services/baby.server', () => ({
  getUserBabies: vi.fn()
}));

vi.mock('~/services/session.server', () => ({
  requireUserId: vi.fn(() => 'user-1')
}));

describe('Dashboard', () => {
  it('renders empty state and Add Baby button', async () => {
    const { getUserBabies } = await import('~/services/baby.server');
    vi.mocked(getUserBabies).mockResolvedValue([]);

    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: Dashboard,
        loader: () => json({ babies: [] }), // Mock the loader to return empty babies
      }
    ]);

    render(<RemixStub />);
    
    expect(await screen.findByText('No babies added yet.')).toBeInTheDocument();
    expect(screen.getByText('Add Baby')).toBeInTheDocument();
  });

  it('renders babies list', async () => {
    const { getUserBabies } = await import('~/services/baby.server');
    vi.mocked(getUserBabies).mockResolvedValue([
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2024-01-01'),
        gender: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: 1
      }
    ]);

    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: Dashboard,
        loader: () => json({ babies: [{ id: '1', firstName: 'John', lastName: 'Doe', dateOfBirth: '2024-01-01' }] }), // Mock the loader to return a baby
      }
    ]);

    render(<RemixStub />);
    
    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Born: 2024-01-01')).toBeInTheDocument();
  });
});
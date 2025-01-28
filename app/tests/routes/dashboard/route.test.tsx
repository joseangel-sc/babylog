import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRemixStub } from '@remix-run/testing';
import Dashboard from '~/routes/dashboard/route';

vi.mock('~/services/baby.server', () => ({
  getUserBabies: vi.fn()
}));

vi.mock('~/services/session.server', () => ({
  requireUserId: vi.fn(() => 'user-1')
}));

describe('Dashboard', () => {
  const RemixStub = createRemixStub([
    {
      path: '/',
      Component: Dashboard
    }
  ]);

  it('renders empty state and Add Baby button', async () => {
    const { getUserBabies } = await import('~/services/baby.server');
    vi.mocked(getUserBabies).mockResolvedValue([]);

    render(<RemixStub />);
    
    expect(await screen.findByText('No babies added yet.')).toBeInTheDocument();
    expect(screen.getByText('Add Baby')).toBeInTheDocument();
  });

  it('renders babies list', async () => {
    const { getUserBabies } = await import('~/services/baby.server');
    vi.mocked(getUserBabies).mockResolvedValue([{
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '2024-01-01'
    }]);

    render(<RemixStub />);
    
    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Born: 2024-01-01')).toBeInTheDocument();
  });
});
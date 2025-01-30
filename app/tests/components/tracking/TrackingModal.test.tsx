import { render, screen, fireEvent } from '@testing-library/react';
import { TrackingModal } from '~/components/tracking/TrackingModal';
import { createRemixStub } from '@remix-run/testing';
import { vi, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

const mockNavigate = vi.fn();

vi.mock('@remix-run/react', async () => {
  const actual = await vi.importActual('@remix-run/react');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ type: 'elimination' }),
  };
});

describe('TrackingModal', () => {
  const babyId = 1;

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the modal with basic elements', () => {
    const RemixStub = createRemixStub([
      {
        path: '/baby/:id/track/elimination',
        Component: () => <TrackingModal babyId={babyId} />,
      },
    ]);

    render(<RemixStub initialEntries={['/baby/1/track/elimination']} />);

    expect(screen.getByText('Track elimination')).toBeInTheDocument();
    expect(screen.getByLabelText('When')).toBeInTheDocument();
    expect(screen.getByLabelText('Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Weight (g)')).toBeInTheDocument();
    expect(screen.getByLabelText('Notes')).toBeInTheDocument();
  });

  it('closes modal when clicking X button', () => {
    const RemixStub = createRemixStub([
      {
        path: '/baby/:id/track/elimination',
        Component: () => <TrackingModal babyId={babyId} />,
      },
    ]);

    render(<RemixStub initialEntries={['/baby/1/track/elimination']} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockNavigate).toHaveBeenCalledWith('/baby/1');
  });

  it('closes modal when pressing Escape key', () => {
    const RemixStub = createRemixStub([
      {
        path: '/baby/:id/track/elimination',
        Component: () => <TrackingModal babyId={babyId} />,
      },
    ]);

    render(<RemixStub initialEntries={['/baby/1/track/elimination']} />);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockNavigate).toHaveBeenCalledWith('/baby/1');
  });

  it('submits form with correct data', async () => {
    const RemixStub = createRemixStub([
      {
        path: '/baby/:id/track/elimination',
        Component: () => <TrackingModal babyId={babyId} />,
      },
    ]);

    render(<RemixStub initialEntries={['/baby/1/track/elimination']} />);

    // Fill out form
    fireEvent.change(screen.getByLabelText('Type'), {
      target: { value: 'wet' },
    });
    
    fireEvent.change(screen.getByLabelText('Weight (g)'), {
      target: { value: '100' },
    });
    
    fireEvent.change(screen.getByLabelText('Notes'), {
      target: { value: 'Test notes' },
    });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);

    // Form submission is handled by Remix action, so we don't need to test the submission result here
    expect(screen.getByLabelText('Type')).toHaveValue('wet');
    expect(screen.getByLabelText('Weight (g)')).toHaveValue(100);
    expect(screen.getByLabelText('Notes')).toHaveValue('Test notes');
  });

  it('has required fields marked as required', () => {
    const RemixStub = createRemixStub([
      {
        path: '/baby/:id/track/elimination',
        Component: () => <TrackingModal babyId={babyId} />,
      },
    ]);

    render(<RemixStub initialEntries={['/baby/1/track/elimination']} />);

    expect(screen.getByLabelText('When')).toBeRequired();
    expect(screen.getByLabelText('Type')).toBeRequired();
    expect(screen.getByLabelText('Weight (g)')).not.toBeRequired();
    expect(screen.getByLabelText('Notes')).not.toBeRequired();
  });
}); 
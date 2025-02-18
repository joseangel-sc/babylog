import { Link } from "@remix-run/react";
import { PlusIcon } from "lucide-react";
import { t } from '~/src/utils/translate';

interface TrackingEvent {
  id: number;
  type: string;
  timestamp?: Date;
  startTime?: Date;
  weight?: number | null;
  amount?: number | null;
  quality?: number | null;
}

interface TrackingSectionProps {
  title: string;
  events: TrackingEvent[];
  babyId: number;
  trackingType: 'elimination' | 'feeding' | 'sleep';
  renderEventDetails?: (event: TrackingEvent) => React.ReactNode;
}

export function TrackingSection({ 
  title, 
  events, 
  babyId, 
  trackingType,
  renderEventDetails 
}: TrackingSectionProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <div className="flex items-center gap-2">
          <Link
            to={`/baby/${babyId}/track/${trackingType}`}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label={`Add ${trackingType}`}
          >
            <PlusIcon className="w-5 h-5 text-gray-600" />
          </Link>
          <Link
            to={`/baby/${babyId}/${trackingType}s`}
            className="text-blue-500 hover:underline"
          >
            {t('baby.recent.viewAll')}
          </Link>
        </div>
      </div>
      {events.length === 0 ? (
        <p className="text-gray-500">{t(`baby.recent.noData.${trackingType}s`)}</p>
      ) : (
        <ul className="space-y-3">
          {events.map((event) => (
            <li key={event.id} className="border-b pb-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">{event.type}</span>
                <span className="text-gray-500">
                  {new Date(event.timestamp || event.startTime!).toLocaleTimeString()}
                </span>
              </div>
              {renderEventDetails && renderEventDetails(event)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 
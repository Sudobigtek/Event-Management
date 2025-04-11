import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Event } from '@/types';
import { Users } from 'lucide-react';

interface AttendanceOverviewProps {
  eventId: string;
}

export function AttendanceOverview({ eventId }: AttendanceOverviewProps) {
  const [stats, setStats] = useState<{
    attendanceCount: number;
    maxAttendees?: number;
  } | null>(null);

  useEffect(() => {
    const eventRef = doc(db, 'events', eventId);
    const unsubscribe = onSnapshot(eventRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as Event;
        setStats({
          attendanceCount: data.attendanceCount || 0,
          maxAttendees: data.maxAttendees,
        });
      }
    });

    return () => unsubscribe();
  }, [eventId]);

  if (!stats) {
    return (
      <div className="h-24 bg-white rounded-lg shadow-sm animate-pulse" />
    );
  }

  const percentage = stats.maxAttendees 
    ? (stats.attendanceCount / stats.maxAttendees) * 100
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Attendance</h3>
          <p className="text-sm text-gray-500">Real-time attendance tracking</p>
        </div>
        <div className="bg-purple-100 p-2 rounded-lg">
          <Users className="h-5 w-5 text-purple-600" />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-baseline">
          <p className="text-3xl font-semibold text-gray-900">
            {stats.attendanceCount}
          </p>
          {stats.maxAttendees && (
            <p className="text-sm text-gray-500">
              of {stats.maxAttendees} max
            </p>
          )}
        </div>

        {stats.maxAttendees && (
          <div className="mt-2">
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-purple-100">
                <div
                  style={{ width: `${Math.min(100, percentage)}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-600 transition-all duration-500"
                />
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {Math.round(percentage)}% Capacity
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <p className={`font-medium ${
            stats.maxAttendees && stats.attendanceCount >= stats.maxAttendees
              ? 'text-red-600'
              : 'text-green-600'
          }`}>
            {stats.maxAttendees && stats.attendanceCount >= stats.maxAttendees
              ? 'At Capacity'
              : 'Accepting Entries'
          }
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Remaining</p>
          <p className="font-medium text-gray-900">
            {stats.maxAttendees 
              ? Math.max(0, stats.maxAttendees - stats.attendanceCount)
              : 'Unlimited'}
          </p>
        </div>
      </div>
    </div>
  );
}
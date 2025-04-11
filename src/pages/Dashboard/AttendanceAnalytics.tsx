import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

interface AttendanceData {
  timestamp: number;
  count: number;
}

export default function AttendanceAnalytics() {
  const { eventId } = useParams<{ eventId: string }>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AttendanceData[]>([]);

  useEffect(() => {
    if (!eventId) return;

    const unsubscribe = onSnapshot(doc(db, 'events', eventId), (doc) => {
      if (doc.exists()) {
        const eventData = doc.data();
        const attendanceData = eventData.attendanceLog || [];
        
        // Process data for visualization
        const processedData = attendanceData.map((entry: any) => ({
          timestamp: entry.timestamp.toDate().toLocaleTimeString(),
          count: entry.count
        }));

        setData(processedData);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Attendance Analytics</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                angle={-45} 
                textAnchor="end"
                height={70}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Attendees" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
import { BarChart3, Calendar, Crown, Users } from "lucide-react";
import * as React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, icon }: StatCardProps) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className="text-purple-600">{icon}</div>
    </div>
  </div>
);

export const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Events",
      value: "24",
      icon: <Calendar className="h-8 w-8" />,
    },
    {
      title: "Active Contests",
      value: "12",
      icon: <Crown className="h-8 w-8" />,
    },
    {
      title: "Total Users",
      value: "1,234",
      icon: <Users className="h-8 w-8" />,
    },
    {
      title: "Revenue",
      value: "₦2.4M",
      icon: <BarChart3 className="h-8 w-8" />,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      {/* Add dashboard content here */}
    </div>
  );
};

export default AdminDashboard;

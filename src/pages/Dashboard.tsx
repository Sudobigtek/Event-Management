import React from 'react';

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-2">Welcome</h3>
          <p className="text-gray-600">Your dashboard content will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
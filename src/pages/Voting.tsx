import React from 'react';
import { Button } from '../components/ui/button';
import { Award } from 'lucide-react';

const Voting = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Voting Contests</h1>
        <Button>
          <Award className="h-4 w-4 mr-2" />
          Create Contest
        </Button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Voting contests will be populated here */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
          <p className="text-gray-600">Voting contests will be displayed here.</p>
        </div>
      </div>
    </div>
  );
};

export default Voting;
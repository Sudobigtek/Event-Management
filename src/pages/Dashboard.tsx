import React from 'react';
import { Routes, Route, Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { Layout, BarChart, Calendar, Ticket, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserEvents, useEvent } from '@/hooks/useEvents';
import { EventForm } from '@/components/events/EventForm';
import { EventList } from '@/components/events/EventList';
import EventTickets from './Dashboard/EventTickets';
import UserTickets from './Dashboard/UserTickets';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
}

function NavItem({ href, icon, title }: NavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      className={cn(
        'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
        isActive 
          ? 'bg-purple-50 text-purple-700' 
          : 'text-gray-700 hover:bg-gray-50'
      )}
    >
      {icon}
      <span>{title}</span>
    </Link>
  );
}

function DashboardOverview() {
  const { data: events, isLoading } = useUserEvents();
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 mb-4">Total Events</h3>
          <p className="text-3xl font-semibold">
            {isLoading ? '-' : events?.length || 0}
          </p>
        </div>
        {/* Add more stats cards here */}
      </div>
    </div>
  );
}

function DashboardEvents() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">My Events</h2>
        <Link
          to="/dashboard/events/create"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
        >
          Create Event
        </Link>
      </div>
      <EventList />
    </div>
  );
}

function DashboardCreateEvent() {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Create New Event</h2>
      <EventForm />
    </div>
  );
}

function DashboardEditEvent() {
  const { eventId } = useParams();
  const { data: event, isLoading } = useEvent(eventId || '');
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Edit Event</h2>
      <EventForm initialData={event} onSuccess={() => navigate('/dashboard/events')} />
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r shrink-0 p-4">
        <nav className="space-y-2">
          <NavItem 
            href="/dashboard" 
            icon={<Layout className="h-5 w-5" />} 
            title="Overview" 
          />
          <NavItem 
            href="/dashboard/events" 
            icon={<Calendar className="h-5 w-5" />} 
            title="Events" 
          />
          <NavItem 
            href="/dashboard/tickets" 
            icon={<Ticket className="h-5 w-5" />} 
            title="My Tickets" 
          />
          <NavItem 
            href="/dashboard/analytics" 
            icon={<BarChart className="h-5 w-5" />} 
            title="Analytics" 
          />
          <NavItem 
            href="/dashboard/settings" 
            icon={<Settings className="h-5 w-5" />} 
            title="Settings" 
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50">
        <Routes>
          <Route index element={<DashboardOverview />} />
          <Route path="events" element={<DashboardEvents />} />
          <Route path="events/create" element={<DashboardCreateEvent />} />
          <Route path="events/:eventId/edit" element={<DashboardEditEvent />} />
          <Route path="events/:eventId/tickets" element={<EventTickets />} />
          <Route path="tickets" element={<UserTickets />} />
        </Routes>
      </div>
    </div>
  );
}
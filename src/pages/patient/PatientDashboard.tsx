import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AppointmentCard } from '@/components/appointments/AppointmentCard';
import { LoadingCard } from '@/components/common/LoadingSpinner';
import { NoAppointments } from '@/components/common/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  CheckCircle,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { appointmentService } from '@/services/api';
import type { Appointment } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const stats = [
  { label: 'Upcoming', value: 2, icon: Calendar, color: 'text-primary' },
  { label: 'Completed', value: 8, icon: CheckCircle, color: 'text-success' },
  { label: 'Pending', value: 1, icon: Clock, color: 'text-warning' },
  { label: 'Messages', value: 3, icon: MessageSquare, color: 'text-accent' },
];

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await appointmentService.getByPatient(user?.id || 'pat-1');
        setAppointments(response.data);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  return (
    <DashboardLayout role="patient">
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-hero-bg rounded-2xl p-6 md:p-8"
        >
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.firstName || 'Patient'}! 👋
          </h1>
          <p className="text-muted-foreground mb-6">
            Here's an overview of your dental health journey.
          </p>
          <Link to="/booking">
            <Button className="gradient-bg border-0">
              <Calendar className="w-4 h-4 mr-2" />
              Book New Appointment
            </Button>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-display">Upcoming Appointments</CardTitle>
            <Link to="/patient/appointments">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingCard />
            ) : appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.slice(0, 3).map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    variant="compact"
                  />
                ))}
              </div>
            ) : (
              <NoAppointments onBook={() => window.location.href = '/booking'} />
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl gradient-bg">
                <MessageSquare className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Message Your Doctor</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Have questions? Send a direct message to your dentist.
                </p>
                <Link to="/patient/messages">
                  <Button variant="outline" size="sm">
                    Open Messages
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-success/10">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Medical Records</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  View your treatment history and dental records.
                </p>
                <Link to="/patient/profile">
                  <Button variant="outline" size="sm">
                    View Records
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

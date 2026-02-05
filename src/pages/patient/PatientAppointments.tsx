import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AppointmentCard } from '@/components/appointments/AppointmentCard';
import { AppointmentDetailsDrawer } from '@/components/dashboard/AppointmentDetailsDrawer';
import { LoadingCard } from '@/components/common/LoadingSpinner';
import { NoAppointments } from '@/components/common/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { appointmentService } from '@/services/api';
import type { Appointment } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
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

  const upcoming = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const past = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled' || a.status === 'no-show');

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDrawerOpen(true);
  };

  const handleCancel = async (id: string) => {
    try {
      await appointmentService.cancel(id);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' as const } : a));
      setDrawerOpen(false);
      toast({ title: 'Appointment Cancelled', description: 'Your appointment has been cancelled.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to cancel appointment.', variant: 'destructive' });
    }
  };

  return (
    <DashboardLayout role="patient">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">My Appointments</h1>
            <p className="text-muted-foreground text-sm">Manage your upcoming and past appointments</p>
          </div>
          <Link to="/booking">
            <Button className="gradient-bg border-0">
              <Calendar className="w-4 h-4 mr-2" />
              Book New
            </Button>
          </Link>
        </motion.div>

        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="upcoming">
              Upcoming ({upcoming.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({past.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              All ({appointments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <Card>
              <CardContent className="pt-6">
                {isLoading ? (
                  <LoadingCard />
                ) : upcoming.length > 0 ? (
                  <div className="space-y-4">
                    {upcoming.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        onView={() => handleViewDetails(appointment)}
                        onCancel={() => handleCancel(appointment.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <NoAppointments onBook={() => window.location.href = '/booking'} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="past">
            <Card>
              <CardContent className="pt-6">
                {isLoading ? (
                  <LoadingCard />
                ) : past.length > 0 ? (
                  <div className="space-y-4">
                    {past.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        onView={() => handleViewDetails(appointment)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No past appointments</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all">
            <Card>
              <CardContent className="pt-6">
                {isLoading ? (
                  <LoadingCard />
                ) : appointments.length > 0 ? (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        onView={() => handleViewDetails(appointment)}
                        onCancel={appointment.status !== 'cancelled' && appointment.status !== 'completed' ? () => handleCancel(appointment.id) : undefined}
                      />
                    ))}
                  </div>
                ) : (
                  <NoAppointments onBook={() => window.location.href = '/booking'} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <AppointmentDetailsDrawer
          appointment={selectedAppointment}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onCancel={handleCancel}
          role="patient"
        />
      </div>
    </DashboardLayout>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AppointmentCard } from '@/components/appointments/AppointmentCard';
import { LoadingCard } from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Users, 
  Clock, 
  DollarSign,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { appointmentService, dashboardService } from '@/services/api';
import type { Appointment, DashboardStats } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { mockPatients } from '@/services/mockData';

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsRes, statsRes] = await Promise.all([
          appointmentService.getByDoctor(user?.id || 'doc-1'),
          dashboardService.getStats(),
        ]);
        setAppointments(appointmentsRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const dashboardStats = [
    { label: 'Today\'s Appointments', value: stats?.todayAppointments || 0, icon: Calendar, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Patients', value: stats?.totalPatients || 0, icon: Users, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Pending', value: stats?.pendingAppointments || 0, icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Revenue', value: `$${(stats?.revenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-success', bg: 'bg-success/10' },
  ];

  const recentPatients = mockPatients.slice(0, 5);

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-hero-bg rounded-2xl p-6 md:p-8"
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                Good morning, Dr. {user?.lastName || 'Doctor'}! 👋
              </h1>
              <p className="text-muted-foreground">
                You have {stats?.todayAppointments || 0} appointments scheduled for today.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-card rounded-lg px-4 py-2">
              <TrendingUp className="w-5 h-5 text-success" />
              <span className="text-sm font-medium text-foreground">+12% this week</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dashboardStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's Appointments */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-display">Today's Appointments</CardTitle>
              <Link to="/doctor/appointments">
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
                  {appointments.slice(0, 4).map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      variant="compact"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No appointments for today</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Patients */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-display">Recent Patients</CardTitle>
              <Link to="/doctor/patients">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={patient.avatar} />
                      <AvatarFallback>{patient.firstName[0]}{patient.lastName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{patient.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

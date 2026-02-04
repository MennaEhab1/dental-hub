import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  Clock, 
  User,
  ArrowLeft,
  ArrowRight,
  Check,
  Stethoscope
} from 'lucide-react';
import { toast } from 'sonner';
import { doctorService, serviceService, appointmentService } from '@/services/api';
import type { Doctor, Service } from '@/types';

type Step = 'service' | 'doctor' | 'datetime' | 'details' | 'confirm';

const steps: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: 'service', label: 'Service', icon: Stethoscope },
  { id: 'doctor', label: 'Doctor', icon: User },
  { id: 'datetime', label: 'Date & Time', icon: Calendar },
  { id: 'details', label: 'Details', icon: User },
  { id: 'confirm', label: 'Confirm', icon: Check },
];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState<Step>('service');
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [booking, setBooking] = useState({
    serviceId: searchParams.get('service') || '',
    doctorId: searchParams.get('doctor') || '',
    date: '',
    time: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, doctorsRes] = await Promise.all([
          serviceService.getAll(),
          doctorService.getAll(),
        ]);
        setServices(servicesRes.data);
        setDoctors(doctorsRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const selectedService = services.find(s => s.id === booking.serviceId);
  const selectedDoctor = doctors.find(d => d.id === booking.doctorId);

  const filteredDoctors = booking.serviceId 
    ? doctors.filter(d => d.specialty === selectedService?.specialty)
    : doctors;

  const handleNext = () => {
    const stepIndex = steps.findIndex(s => s.id === currentStep);
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1].id);
    }
  };

  const handleBack = () => {
    const stepIndex = steps.findIndex(s => s.id === currentStep);
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1].id);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await appointmentService.create({
        patientId: 'guest',
        doctorId: booking.doctorId,
        serviceId: booking.serviceId,
        date: booking.date,
        time: booking.time,
        duration: selectedService?.duration || 30,
        status: 'pending',
        notes: booking.notes,
      });
      toast.success('Appointment booked successfully!');
      navigate('/booking/confirmation');
    } catch (error) {
      toast.error('Failed to book appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'service':
        return !!booking.serviceId;
      case 'doctor':
        return !!booking.doctorId;
      case 'datetime':
        return !!booking.date && !!booking.time;
      case 'details':
        return !!booking.firstName && !!booking.lastName && !!booking.email && !!booking.phone;
      default:
        return true;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Book Your <span className="gradient-text">Appointment</span>
          </h1>
          <p className="text-muted-foreground">
            Schedule your visit in just a few easy steps
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8 overflow-x-auto pb-2">
          <div className="flex items-center gap-2 md:gap-4">
            {steps.map((step, index) => {
              const stepIndex = steps.findIndex(s => s.id === currentStep);
              const isActive = step.id === currentStep;
              const isComplete = index < stepIndex;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : isComplete 
                          ? 'bg-success/10 text-success' 
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <step.icon className="w-4 h-4" />
                    <span className="text-sm font-medium hidden md:inline">{step.label}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-muted-foreground mx-1 md:mx-2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Service Selection */}
              {currentStep === 'service' && (
                <div className="grid md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <Card
                      key={service.id}
                      className={`cursor-pointer transition-all ${
                        booking.serviceId === service.id
                          ? 'ring-2 ring-primary shadow-card'
                          : 'hover:shadow-soft'
                      }`}
                      onClick={() => setBooking(prev => ({ ...prev, serviceId: service.id }))}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <img
                            src={service.image}
                            alt={service.name}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{service.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {service.description}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-sm text-muted-foreground">
                                <Clock className="w-3 h-3 inline mr-1" />
                                {service.duration} min
                              </span>
                              <span className="text-sm font-semibold text-primary">
                                ${service.price}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Doctor Selection */}
              {currentStep === 'doctor' && (
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredDoctors.map((doctor) => (
                    <Card
                      key={doctor.id}
                      className={`cursor-pointer transition-all ${
                        booking.doctorId === doctor.id
                          ? 'ring-2 ring-primary shadow-card'
                          : 'hover:shadow-soft'
                      }`}
                      onClick={() => setBooking(prev => ({ ...prev, doctorId: doctor.id }))}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <img
                            src={doctor.avatar}
                            alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                            className="w-16 h-16 rounded-xl object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">
                              Dr. {doctor.firstName} {doctor.lastName}
                            </h3>
                            <p className="text-sm text-muted-foreground capitalize">
                              {doctor.specialty.replace('-', ' ')}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-sm">⭐ {doctor.rating}</span>
                              <span className="text-xs text-muted-foreground">
                                ({doctor.reviewCount} reviews)
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Date & Time Selection */}
              {currentStep === 'datetime' && (
                <Card>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-base font-medium">Select Date</Label>
                        <Input
                          type="date"
                          value={booking.date}
                          onChange={(e) => setBooking(prev => ({ ...prev, date: e.target.value }))}
                          min={new Date().toISOString().split('T')[0]}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label className="text-base font-medium">Select Time</Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {timeSlots.map((slot) => (
                            <Button
                              key={slot}
                              variant={booking.time === slot ? 'default' : 'outline'}
                              className={booking.time === slot ? 'gradient-bg border-0' : ''}
                              onClick={() => setBooking(prev => ({ ...prev, time: slot }))}
                            >
                              {slot}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Patient Details */}
              {currentStep === 'details' && (
                <Card>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={booking.firstName}
                          onChange={(e) => setBooking(prev => ({ ...prev, firstName: e.target.value }))}
                          placeholder="John"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={booking.lastName}
                          onChange={(e) => setBooking(prev => ({ ...prev, lastName: e.target.value }))}
                          placeholder="Doe"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={booking.email}
                          onChange={(e) => setBooking(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="john@example.com"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={booking.phone}
                          onChange={(e) => setBooking(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+1 555-123-4567"
                          className="mt-2"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="notes">Additional Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          value={booking.notes}
                          onChange={(e) => setBooking(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Any specific concerns or requests..."
                          className="mt-2"
                          rows={3}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Confirmation */}
              {currentStep === 'confirm' && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="font-display text-xl font-bold text-foreground mb-6">
                      Booking Summary
                    </h2>
                    <div className="space-y-4">
                      <div className="flex justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Service</span>
                        <span className="font-medium text-foreground">{selectedService?.name}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Doctor</span>
                        <span className="font-medium text-foreground">
                          Dr. {selectedDoctor?.firstName} {selectedDoctor?.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Date & Time</span>
                        <span className="font-medium text-foreground">
                          {new Date(booking.date).toLocaleDateString()} at {booking.time}
                        </span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Patient</span>
                        <span className="font-medium text-foreground">
                          {booking.firstName} {booking.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-border">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium text-foreground">{selectedService?.duration} minutes</span>
                      </div>
                      <div className="flex justify-between py-3 text-lg">
                        <span className="font-medium text-foreground">Total</span>
                        <span className="font-bold gradient-text">${selectedService?.price}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 'service'}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            {currentStep === 'confirm' ? (
              <Button
                className="gradient-bg border-0"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                <Check className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                className="gradient-bg border-0"
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

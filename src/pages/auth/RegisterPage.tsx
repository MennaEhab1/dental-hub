import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    gender: '',
    address: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.userName.trim()) newErrors.userName = 'Full name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await register({
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        gender: formData.gender || undefined,
        address: formData.address || undefined,
      });
      toast.success('Account created successfully!');
      navigate('/patient/dashboard');
    } catch (error: any) {
      const msg = error?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&h=1600&fit=crop"
          alt="Dental Care"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-background via-transparent to-transparent" />
        <div className="absolute inset-0 gradient-bg opacity-20" />
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sm:mx-auto sm:w-full sm:max-w-md"
        >
          <Link to="/" className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">D</span>
            </div>
            <span className="text-xl font-display font-bold text-foreground">
              Dental<span className="gradient-text">Care</span>
            </span>
          </Link>
          
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold text-foreground">
              Create your account
            </h1>
            <p className="text-muted-foreground mt-2">
              Join us for better dental care
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="userName">Full Name</Label>
                <Input
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`mt-2 ${errors.userName ? 'border-destructive' : ''}`}
                />
                {errors.userName && (
                  <p className="text-xs text-destructive mt-1">{errors.userName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`mt-2 ${errors.email ? 'border-destructive' : ''}`}
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+20 1XX XXX XXXX"
                  className={`mt-2 ${errors.phoneNumber ? 'border-destructive' : ''}`}
                />
                {errors.phoneNumber && (
                  <p className="text-xs text-destructive mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              <div>
                <Label htmlFor="gender">Gender (Optional)</Label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className={errors.password ? 'border-destructive' : ''}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`mt-2 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full gradient-bg border-0"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

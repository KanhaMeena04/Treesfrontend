import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Eye, EyeOff, ArrowLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface EnhancedAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

type AuthStep = 'login' | 'register' | 'otp' | 'forgot' | 'reset';

export const EnhancedAuthModal = ({ isOpen, onClose, onLogin }: EnhancedAuthModalProps) => {
  const [step, setStep] = useState<AuthStep>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'username'>('email');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    number: false,
    special: false,
    uppercase: false,
    lowercase: false
  });

  // Mock usernames for demonstration (in real app, this would be an API call)
  const existingUsernames = ['john_doe', 'jane_smith', 'admin', 'user123', 'test_user'];

  // Check if username is available
  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setCheckingUsername(true);
    
    // Simulate API call to check username availability
    setTimeout(() => {
      const isAvailable = !existingUsernames.includes(username.toLowerCase());
      setUsernameAvailable(isAvailable);
      setCheckingUsername(false);
    }, 500);
  };

  // Validate password strength
  const validatePassword = (password: string) => {
    const validations = {
      length: password.length >= 8,
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password)
    };
    
    setPasswordValidation(validations);
    return Object.values(validations).every(Boolean);
  };

  // Handle username change
  const handleUsernameChange = (value: string) => {
    // Only allow alphanumeric characters, underscores, and hyphens
    const cleanUsername = value.replace(/[^a-zA-Z0-9_-]/g, '');
    setUsername(cleanUsername);
    
    if (cleanUsername.length >= 3) {
      checkUsernameAvailability(cleanUsername);
    } else {
      setUsernameAvailable(null);
    }
  };

  const handleLogin = async () => {
    if (!password || (!email && !username)) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Login:', { 
        email: loginMethod === 'email' ? email : undefined, 
        username: loginMethod === 'username' ? username : undefined, 
        password, 
        rememberMe 
      });
      setIsLoading(false);
      onLogin();
      handleClose();
    }, 1500);
  };

  const handleRegister = async () => {
    if (!name || !email || !username || !password) return;
    
    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive'
      });
      return;
    }

    if (!validatePassword(password)) {
      toast({
        title: 'Password Requirements',
        description: 'Please ensure your password meets all requirements',
        variant: 'destructive'
      });
      return;
    }

    if (usernameAvailable === false) {
      toast({
        title: 'Username Taken',
        description: 'Please choose a different username',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate sending OTP
    setTimeout(() => {
      console.log('Sending OTP to:', email || phone);
      setIsLoading(false);
      setStep('otp');
    }, 1500);
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      console.log('Verifying OTP:', otp);
      setIsLoading(false);
      
      if (step === 'otp') {
        // Registration complete
        toast({
          title: 'Account Created!',
          description: 'Welcome to Treesh! Your account has been created successfully.',
        });
        onLogin();
        handleClose();
      } else if (step === 'reset') {
        // Password reset complete
        setStep('login');
      }
    }, 1500);
  };

  const handleForgotPassword = async () => {
    if (!email) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      console.log('Sending reset OTP to:', email);
      setIsLoading(false);
      setStep('reset');
    }, 1500);
  };

  const handleClose = () => {
    setStep('login');
    setEmail('');
    setUsername('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setOtp('');
    setShowPassword(false);
    setIsLoading(false);
    setRememberMe(false);
    setLoginMethod('email');
    setUsernameAvailable(null);
    setCheckingUsername(false);
    setPasswordValidation({
      length: false,
      number: false,
      special: false,
      uppercase: false,
      lowercase: false
    });
    onClose();
  };

  const renderBackButton = () => {
    if (step === 'login' || step === 'register') return null;
    
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          if (step === 'otp') setStep('register');
          else if (step === 'forgot' || step === 'reset') setStep('login');
        }}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
    );
  };

  // Password strength indicator
  const renderPasswordStrength = () => {
    const requirements = [
      { key: 'length', label: 'At least 8 characters', icon: passwordValidation.length ? CheckCircle : XCircle },
      { key: 'number', label: 'Contains a number', icon: passwordValidation.number ? CheckCircle : XCircle },
      { key: 'special', label: 'Contains special character', icon: passwordValidation.special ? CheckCircle : XCircle },
      { key: 'uppercase', label: 'Contains uppercase letter', icon: passwordValidation.uppercase ? CheckCircle : XCircle },
      { key: 'lowercase', label: 'Contains lowercase letter', icon: passwordValidation.lowercase ? CheckCircle : XCircle }
    ];

    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">Password Requirements:</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          {requirements.map((req) => (
            <div key={req.key} className="flex items-center space-x-2 text-xs">
              <req.icon className={`w-3 h-3 flex-shrink-0 ${
                passwordValidation[req.key as keyof typeof passwordValidation] 
                  ? 'text-green-500' 
                  : 'text-red-500'
              }`} />
              <span className={passwordValidation[req.key as keyof typeof passwordValidation] 
                ? 'text-green-600' 
                : 'text-red-600'
              }>
                {req.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-center text-2xl md:text-3xl font-bold text-primary font-treesh">
            {step === 'login' && 'Welcome Back'}
            {step === 'register' && 'Create Account'}
            {step === 'otp' && 'Verify Your Account'}
            {step === 'forgot' && 'Reset Password'}
            {step === 'reset' && 'Enter Reset Code'}
          </DialogTitle>
        </DialogHeader>
        
        {renderBackButton()}
        
        {step === 'login' && (
          <div className="space-y-6 max-w-md mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-2xl font-semibold">Welcome Back</h3>
            </div>

            {/* Login Method Toggle */}
            <div className="flex space-x-2 p-1 bg-gray-100 rounded-lg">
              <Button
                variant={loginMethod === 'email' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLoginMethod('email')}
                className="flex-1 text-sm md:text-base"
              >
                Email
              </Button>
              <Button
                variant={loginMethod === 'username' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLoginMethod('username')}
                className="flex-1 text-sm md:text-base"
              >
                Username
              </Button>
            </div>

            <div className="space-y-3">
              <Label htmlFor="login-identifier" className="font-inter text-base">
                {loginMethod === 'email' ? 'Email' : 'Username'}
              </Label>
              <Input
                id="login-identifier"
                type={loginMethod === 'email' ? 'email' : 'text'}
                placeholder={loginMethod === 'email' ? 'Enter your email' : 'Enter your username'}
                value={loginMethod === 'email' ? email : username}
                onChange={(e) => loginMethod === 'email' ? setEmail(e.target.value) : setUsername(e.target.value)}
                className="font-inter h-12 text-base"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="password" className="font-inter text-base">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="font-inter h-12 text-base pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded w-4 h-4"
              />
              <Label htmlFor="remember" className="text-sm md:text-base font-inter">Remember me</Label>
            </div>
            
            <Button 
              onClick={handleLogin} 
              disabled={isLoading || !password || (loginMethod === 'email' ? !email : !username)}
              className="w-full bg-primary hover:bg-primary-dark text-white font-inter h-12 text-base font-semibold"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            
            <div className="text-center space-y-3">
              <Button 
                variant="ghost" 
                className="text-sm md:text-base" 
                onClick={() => setStep('forgot')}
              >
                Forgot Password?
              </Button>
              <p className="text-sm md:text-base text-muted-foreground">
                Don't have an account?{' '}
                <Button variant="link" className="p-0 text-base" onClick={() => setStep('register')}>
                  Sign up
                </Button>
              </p>
            </div>
          </div>
        )}
        
        {step === 'register' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-2xl font-semibold">Create Account</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="font-inter text-base">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="font-inter h-12 text-base"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="username" className="font-inter text-base">Username</Label>
                <div className="relative">
                  <Input
                    id="username"
                    placeholder="Choose a unique username"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    className={`font-inter h-12 text-base pr-20 ${
                      usernameAvailable === false ? 'border-red-500' : 
                      usernameAvailable === true ? 'border-green-500' : ''
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                    {checkingUsername && (
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
                    )}
                    {usernameAvailable === true && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {usernameAvailable === false && (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Username can contain letters, numbers, underscores (_), and hyphens (-)
                </div>
                {usernameAvailable === false && (
                  <div className="text-xs text-red-500 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Username is already taken</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="reg-email" className="font-inter text-base">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="font-inter h-12 text-base"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="phone" className="font-inter text-base">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="font-inter h-12 text-base"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="reg-password" className="font-inter text-base">Password</Label>
              <div className="relative">
                <Input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  className="font-inter h-12 text-base pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </Button>
              </div>
              {renderPasswordStrength()}
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="confirm-password" className="font-inter text-base">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`font-inter h-12 text-base ${
                  confirmPassword && password !== confirmPassword ? 'border-red-500' : ''
                }`}
              />
              {confirmPassword && password !== confirmPassword && (
                <div className="text-xs text-red-500">Passwords do not match</div>
              )}
            </div>
            
            <Button 
              onClick={handleRegister} 
              disabled={isLoading || !name || !email || !username || !password || 
                       password !== confirmPassword || usernameAvailable === false ||
                       !Object.values(passwordValidation).every(Boolean)}
              className="w-full bg-primary hover:bg-primary-dark text-white font-inter h-12 text-base font-semibold"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
            
            <p className="text-center text-sm md:text-base text-muted-foreground">
              Already have an account?{' '}
              <Button variant="link" className="p-0 text-base" onClick={() => setStep('login')}>
                Sign in
              </Button>
            </p>
          </div>
        )}
        
        {(step === 'otp' || step === 'reset') && (
          <div className="space-y-6 text-center max-w-md mx-auto">
            <p className="text-sm md:text-base text-muted-foreground">
              {step === 'otp' 
                ? `We've sent a verification code to ${email || phone}`
                : `We've sent a reset code to ${email}`
              }
            </p>
            
            <div className="flex justify-center">
              <InputOTP value={otp} onChange={setOtp} maxLength={6} className="gap-2">
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
                </InputOTPGroup>
              </InputOTP>
            </div>
            
            <Button 
              onClick={handleVerifyOTP} 
              disabled={isLoading || otp.length !== 6}
              className="w-full bg-primary hover:bg-primary-dark text-white font-inter h-12 text-base font-semibold"
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </Button>
            
            <Button variant="ghost" className="text-sm md:text-base">
              Didn't receive the code? Resend
            </Button>
          </div>
        )}
        
        {step === 'forgot' && (
          <div className="space-y-6 max-w-md mx-auto">
            <p className="text-sm md:text-base text-muted-foreground text-center">
              Enter your email address and we'll send you a code to reset your password.
            </p>
            
            <div className="space-y-3">
              <Label htmlFor="forgot-email" className="font-inter text-base">Email</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-inter h-12 text-base"
              />
            </div>
            
            <Button 
              onClick={handleForgotPassword} 
              disabled={isLoading || !email}
              className="w-full bg-primary hover:bg-primary-dark text-white font-inter h-12 text-base font-semibold"
            >
              {isLoading ? 'Sending...' : 'Send Reset Code'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
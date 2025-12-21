'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Flame, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { loginHandshake } from '@/lib/api';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Google</title>
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.98-4.66 1.98-3.55 0-6.42-2.93-6.42-6.55s2.87-6.55 6.42-6.55c2.03 0 3.36.85 4.17 1.62l2.33-2.33C17.66 2.39 15.48 1 12.48 1 7.1 1 3.06 5.14 3.06 10.5S7.1 20 12.48 20c2.94 0 5.22-1.02 6.9-2.72 1.74-1.74 2.33-4.26 2.33-6.34 0-.48-.05-.96-.12-1.42Z" />
  </svg>
);

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      // Simulate signup by just logging in the mock user
      await loginHandshake();
      toast({
        title: 'Account Created!',
        description: 'Welcome to FitConnect.',
      });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error("Signup failed:", error);
       toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: 'Could not create your account. Please try again.',
      });
    } finally {
        setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // This would be your real Google Sign-in flow
    handleSignUp();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <Flame className="mb-4 h-12 w-12 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">
            Create your Account
          </h1>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" placeholder="Alex Doe" disabled={isLoading} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" disabled={isLoading} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" disabled={isLoading} />
          </div>
        </div>

        <Button className="mt-6 w-full" onClick={handleSignUp} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign Up
        </Button>

        <div className="my-6 flex items-center">
          <Separator className="flex-1" />
          <span className="mx-4 text-xs text-muted-foreground">OR</span>
          <Separator className="flex-1" />
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <GoogleIcon className="mr-2 h-5 w-5" />
          Continue with Google
        </Button>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [smsCodeSent, setSmsCodeSent] = useState(false);
  const [smsLoading, setSmsLoading] = useState(false);

  useEffect(() => {
    document.title = "Login or Sign up | Dr. Granny";
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSendEmailOtp = async () => {
    if (!email) return;
    setEmailLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
      setEmailCodeSent(true);
      toast({ title: "Check your email", description: "We've sent you a login code or link." });
    } catch (err: any) {
      toast({ title: "Email auth failed", description: err?.message ?? "Unable to send code.", variant: "destructive" });
    } finally {
      setEmailLoading(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!email || !emailCode) return;
    setEmailLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({ email, token: emailCode, type: "email" });
      if (error) throw error;
      toast({ title: "Welcome!", description: "You're now signed in." });
      navigate("/", { replace: true });
    } catch (err: any) {
      toast({ title: "Invalid code", description: err?.message ?? "Please try again.", variant: "destructive" });
    } finally {
      setEmailLoading(false);
    }
  };

  const handleSendSmsOtp = async () => {
    if (!phone) return;
    setSmsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: { shouldCreateUser: true },
      });
      if (error) throw error;
      setSmsCodeSent(true);
      toast({ title: "Code sent", description: "Check your SMS for the code." });
    } catch (err: any) {
      toast({ title: "SMS auth failed", description: err?.message ?? "SMS provider may not be configured.", variant: "destructive" });
    } finally {
      setSmsLoading(false);
    }
  };

  const handleVerifySmsOtp = async () => {
    if (!phone || !smsCode) return;
    setSmsLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({ phone, token: smsCode, type: "sms" });
      if (error) throw error;
      toast({ title: "Welcome!", description: "You're now signed in." });
      navigate("/", { replace: true });
    } catch (err: any) {
      toast({ title: "Invalid code", description: err?.message ?? "Please try again.", variant: "destructive" });
    } finally {
      setSmsLoading(false);
    }
  };

  return (
    <main className="container mx-auto max-w-xl p-6">
      <Card className="shadow-sm">
        <CardHeader>
          <h1 className="text-2xl font-semibold">Secure login and signup with OTP</h1>
          <CardDescription>Use your email or mobile number to receive a one-time code.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="email">Email OTP</TabsTrigger>
              <TabsTrigger value="phone">Mobile OTP</TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4">
              <label className="block text-sm">Email address</label>
              <div className="flex gap-2">
                <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Button onClick={handleSendEmailOtp} disabled={emailLoading || !email}>
                  {emailCodeSent ? "Resend" : "Send code"}
                </Button>
              </div>

              {emailCodeSent && (
                <div className="space-y-2">
                  <label className="block text-sm">Enter the 6-digit code</label>
                  <InputOTP maxLength={6} value={emailCode} onChange={setEmailCode}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <Button onClick={handleVerifyEmailOtp} disabled={emailLoading || emailCode.length !== 6}>
                    Verify & Continue
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="phone" className="space-y-4">
              <label className="block text-sm">Mobile number</label>
              <div className="flex gap-2">
                <Input type="tel" placeholder="+1 555 000 1234" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <Button onClick={handleSendSmsOtp} disabled={smsLoading || !phone}>
                  {smsCodeSent ? "Resend" : "Send code"}
                </Button>
              </div>
              <p className="text-xs opacity-70">Use E.164 format, e.g. +15550001234.</p>

              {smsCodeSent && (
                <div className="space-y-2">
                  <label className="block text-sm">Enter the 6-digit code</label>
                  <InputOTP maxLength={6} value={smsCode} onChange={setSmsCode}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <Button onClick={handleVerifySmsOtp} disabled={smsLoading || smsCode.length !== 6}>
                    Verify & Continue
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}

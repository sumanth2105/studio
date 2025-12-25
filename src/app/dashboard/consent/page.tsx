
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export default function ConsentPage() {
  const { toast } = useToast();
  const [emergencyConsent, setEmergencyConsent] = useState(true);
  const [dataSharingConsent, setDataSharingConsent] = useState(true);
  const [notificationConsent, setNotificationConsent] = useState({
    sms: true,
    email: true,
    whatsapp: false,
  });

  const handleSave = () => {
    // In a real app, you would save these preferences to the backend.
    console.log({
      emergencyConsent,
      dataSharingConsent,
      notificationConsent,
    });
    toast({
      title: 'Preferences Saved',
      description: 'Your consent settings have been updated.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consent & Data Sharing</CardTitle>
        <CardDescription>
          Manage how your information is used and how you are contacted. Your
          privacy is important to us.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-6">
            <div className="p-6 border rounded-lg space-y-4 bg-card-foreground/5">
                <h3 className="text-lg font-semibold">Emergency Data Access</h3>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground flex-1">
                    Allow authorized hospitals to access your critical health information
                    and trust score in an emergency, even before a formal claim is filed.
                    This is crucial for enabling instant treatment approvals.
                </p>
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <Switch
                    id="emergency-consent"
                    checked={emergencyConsent}
                    onCheckedChange={setEmergencyConsent}
                    />
                    <Label htmlFor="emergency-consent" className="font-medium">
                    {emergencyConsent ? 'Allowed' : 'Not Allowed'}
                    </Label>
                </div>
                </div>
            </div>

            <div className="p-6 border rounded-lg space-y-4">
                <h3 className="text-lg font-semibold">Claim Processing Data Sharing</h3>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground flex-1">
                    Permit the platform to share your uploaded documents and claim details
                    with your insurance company for verification and settlement purposes.
                    This is required for processing claims.
                </p>
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <Switch
                    id="data-sharing-consent"
                    checked={dataSharingConsent}
                    onCheckedChange={setDataSharingConsent}
                    />
                    <Label htmlFor="data-sharing-consent" className="font-medium">
                    {dataSharingConsent ? 'Allowed' : 'Not Allowed'}
                    </Label>
                </div>
                </div>
            </div>
        </div>

        <Separator />

        <div>
            <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <Label htmlFor="sms-notifications" className="font-medium">
                        SMS Notifications
                    </Label>
                    <Switch
                        id="sms-notifications"
                        checked={notificationConsent.sms}
                        onCheckedChange={(checked) => setNotificationConsent(prev => ({...prev, sms: checked}))}
                    />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <Label htmlFor="email-notifications" className="font-medium">
                        Email Notifications
                    </Label>
                    <Switch
                        id="email-notifications"
                        checked={notificationConsent.email}
                        onCheckedChange={(checked) => setNotificationCellName(prev => ({...prev, email: checked}))}
                    />
                </div>
                 <div className="flex items-center justify-between p-4 border rounded-lg">
                    <Label htmlFor="whatsapp-notifications" className="font-medium">
                        WhatsApp Notifications
                    </Label>
                    <Switch
                        id="whatsapp-notifications"
                        checked={notificationConsent.whatsapp}
                        onCheckedChange={(checked) => setNotificationConsent(prev => ({...prev, whatsapp: checked}))}
                    />
                </div>
            </div>
        </div>


        <div className="flex justify-end pt-4">
          <Button onClick={handleSave}>Save Preferences</Button>
        </div>
      </CardContent>
    </Card>
  );
}

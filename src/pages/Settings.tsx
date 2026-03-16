import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { otherService } from '@/services';
import { Lock, User, Building2, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

const Settings = () => {
  const { data: userResp, isLoading: loadingUser } = useQuery({
    queryKey: ['settings', 'user'],
    queryFn: async () => {
      const res: any = await otherService.getAuthProfile();
      return res?.data || res || {};
    },
  });

  const { data: preferencesResp, isLoading: loadingPreferences } = useQuery({
    queryKey: ['settings', 'preferences'],
    queryFn: async () => {
      const res: any = await otherService.getUserPreferences();
      return res?.data?.preferences || {};
    },
  });

  const { data: organizationResp } = useQuery({
    queryKey: ['settings', 'organization'],
    queryFn: async () => {
      const res: any = await otherService.getOrganization();
      return res?.data?.organization || {};
    },
  });

  const currentUser = userResp || {};
  const preferences = preferencesResp || {};
  const organization = organizationResp || {};

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const [roleState, setRoleState] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [saving, setSaving] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.first_name || currentUser.firstName || '');
      setLastName(currentUser.last_name || currentUser.lastName || '');
      setEmail(currentUser.email || '');
      setUserType(currentUser.user_type || currentUser.userType || '');
      setRoleState(currentUser.role || '');
      setPhoneNumber(currentUser.phone_number || currentUser.phone || '');
    }
  }, [currentUser]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: any = {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber || null,
        date_of_birth: null,
        bio: '',
        profile_picture: null,
      };

      await otherService.updateAuthProfile(payload);
      toast({
        title: 'Profile updated',
      });
    } catch (err: any) {
      toast({
        title: err?.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setChangingPassword(true);
    try {
      const payload = {
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirm: confirmNewPassword,
      };
      await otherService.changePasswordAuth(payload);
      toast({
        title: 'Password changed',
      });
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      toast({
        title: err?.message || 'Failed to change password',
        variant: 'destructive',
      });
    } finally {
      setChangingPassword(false);
    }
  };
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Section */}
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Profile</CardTitle>
          </div>
          <CardDescription>
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {currentUser.name ? currentUser.name.split(' ').map((n: string) => n[0]).join('') : 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                Change Avatar
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                JPG, GIF or PNG. Max size 2MB.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-type">User Type</Label>
              <Input id="user-type" value={userType} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={roleState} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+1 555-0123" />
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
        </CardContent>
      </Card>

      {/* Notifications removed per request (moved into profile area) */}

      {/* Security Section */}
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Security</CardTitle>
          </div>
          <CardDescription>
            Manage your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
            </div>
            <div />
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
            </div>
          </div>

          <Button onClick={handleChangePassword} disabled={changingPassword}>{changingPassword ? 'Changing...' : 'Update Password'}</Button>

          <Separator />
        </CardContent>
      </Card>

      {/* Organization Section */}
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Organization</CardTitle>
          </div>
          <CardDescription>
            View your organization settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">{organization.name || 'EduConnect'}</p>
                <p className="text-sm text-muted-foreground">
                  {organization.description || 'EdTech Sales Platform'}
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Your Role</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {currentUser.role || 'User'}
                </p>
              </div>
              <Button variant="outline" size="sm">
                Contact Admin
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;

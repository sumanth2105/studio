
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Users,
  MoreHorizontal,
  PlusCircle,
  Search,
  KeyRound,
  ShieldOff,
  Edit,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type UserRole = 'Admin' | 'Doctor' | 'Billing Staff';

interface HospitalUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Disabled';
  lastLogin: string;
}

interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  ipAddress: string;
}

const mockUsers: HospitalUser[] = [
  {
    id: 'user-1',
    name: 'Dr. Anjali Rao',
    email: 'anjali.rao@hospital.com',
    role: 'Doctor',
    status: 'Active',
    lastLogin: '2023-11-20T09:15:00Z',
  },
  {
    id: 'user-2',
    name: 'Suresh Kumar',
    email: 'suresh.kumar@hospital.com',
    role: 'Billing Staff',
    status: 'Active',
    lastLogin: '2023-11-20T08:55:00Z',
  },
  {
    id: 'user-3',
    name: 'Amit Singh',
    email: 'amit.singh@hospital.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2023-11-20T10:05:00Z',
  },
  {
    id: 'user-4',
    name: 'Dr. Vikram Reddy',
    email: 'vikram.reddy@hospital.com',
    role: 'Doctor',
    status: 'Disabled',
    lastLogin: '2023-10-15T11:30:00Z',
  },
];

const mockLogs: ActivityLog[] = [
    { id: 'log-1', timestamp: '2023-11-20T10:05:00Z', user: 'Amit Singh', action: 'Logged in', ipAddress: '192.168.1.10' },
    { id: 'log-2', timestamp: '2023-11-20T09:16:00Z', user: 'Dr. Anjali Rao', action: 'Viewed claim claim-102', ipAddress: '192.168.1.12' },
    { id: 'log-3', timestamp: '2023-11-20T08:56:00Z', user: 'Suresh Kumar', action: 'Submitted new claim claim-103', ipAddress: '192.168.1.15' },
    { id: 'log-4', timestamp: '2023-11-19T14:20:00Z', user: 'Amit Singh', action: 'Disabled user Dr. Vikram Reddy', ipAddress: '192.168.1.10' },
];


export default function EmployeeSecurityPage() {
    const { toast } = useToast();
    const [users, setUsers] = useState(mockUsers);
    const [searchTerm, setSearchTerm] = useState('');

    const handleStatusChange = (userId: string, newStatus: boolean) => {
        setUsers(users.map(user => user.id === userId ? { ...user, status: newStatus ? 'Active' : 'Disabled' } : user));
        toast({
            title: 'User Status Updated',
            description: `User has been ${newStatus ? 'enabled' : 'disabled'}.`
        });
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="grid gap-6">
        <Card>
            <CardHeader>
            <CardTitle>Employee & Security</CardTitle>
            <CardDescription>
                Manage hospital staff access and view security logs. This section is
                restricted to administrators.
            </CardDescription>
            </CardHeader>
        </Card>

        <Card>
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <CardTitle>Employee Management</CardTitle>
                    <CardDescription>
                        View, add, and manage staff accounts.
                    </CardDescription>
                </div>
                <div className='flex gap-2 w-full md:w-auto'>
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search employees..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                     <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                    <TableCell>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                    </TableCell>
                    <TableCell>
                        <Badge variant={user.role === 'Admin' ? 'destructive' : 'secondary'}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                        {new Date(user.lastLogin).toLocaleString()}
                    </TableCell>
                     <TableCell>
                        <div className="flex items-center gap-2">
                           <Switch
                                id={`status-${user.id}`}
                                checked={user.status === 'Active'}
                                onCheckedChange={(checked) => handleStatusChange(user.id, checked)}
                            />
                            <span className={user.status === 'Active' ? 'text-green-600' : 'text-muted-foreground'}>{user.status}</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem><Edit className="mr-2 h-4 w-4"/> Edit Role</DropdownMenuItem>
                            <DropdownMenuItem><KeyRound className="mr-2 h-4 w-4" /> Force Password Reset</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 focus:text-red-600"><ShieldOff className="mr-2 h-4 w-4"/> Disable User</DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle>Activity Log</CardTitle>
                <CardDescription>
                An audit trail of all actions performed in the dashboard.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>IP Address</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockLogs.map(log => (
                            <TableRow key={log.id}>
                                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                                <TableCell>{log.user}</TableCell>
                                <TableCell>{log.action}</TableCell>
                                <TableCell className="font-mono text-xs">{log.ipAddress}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        </div>
    );
}

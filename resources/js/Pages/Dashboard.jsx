import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { LayoutDashboard } from 'lucide-react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-slate-800">Welcome to PUP Portal</h2>
                        <p className="text-sm text-slate-500 mt-1">Select an option from the sidebar to continue.</p>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-8">
                <Card className="border-slate-200 shadow-sm max-w-2xl mx-auto mt-8">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto bg-maroon-50 w-16 h-16 flex items-center justify-center rounded-full mb-4">
                            <LayoutDashboard className="h-8 w-8 text-maroon-800" />
                        </div>
                        <CardTitle className="text-2xl font-serif text-slate-800">Your Account is Ready</CardTitle>
                        <CardDescription>
                            Your account has been successfully created. However, you do not currently have an active role assigned to access specific portal features.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center text-slate-500 pt-4 pb-6">
                        <p>If you believe this is an error, please contact the system administrator to update your profile.</p>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}

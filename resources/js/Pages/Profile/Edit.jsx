import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout>
            <Head title="Profile" />

            <div className="max-w-7xl mx-auto space-y-8">
                
                <div className="mb-8">
                    <h1 className="font-serif text-3xl font-bold text-slate-800">Account Settings</h1>
                    <p className="text-slate-500 mt-1">Manage your profile, security, and account preferences.</p>
                </div>

                <div className="grid grid-cols-1 gap-8 max-w-4xl">
                    <Card className="shadow-sm border-t-4 border-t-maroon-800">
                        <CardHeader>
                            <CardTitle className="font-serif">Profile Information</CardTitle>
                            <CardDescription>Update your account's profile information and email address.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="font-serif">Update Password</CardTitle>
                            <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UpdatePasswordForm className="max-w-xl" />
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-t-4 border-t-red-600">
                        <CardHeader>
                            <CardTitle className="font-serif text-red-600">Danger Zone</CardTitle>
                            <CardDescription>Once your account is deleted, all of its resources and data will be permanently deleted.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DeleteUserForm className="max-w-xl" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

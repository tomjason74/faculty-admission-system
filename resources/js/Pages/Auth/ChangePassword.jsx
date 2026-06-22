import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { ShieldCheck } from 'lucide-react';

export default function ChangePassword() {
    const { data, setData, post, processing, errors } = useForm({
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.force-change.update'));
    };

    return (
        <GuestLayout>
            <Head title="Change Password" />

            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-maroon-50 border border-maroon-100">
                    <ShieldCheck className="h-7 w-7 text-maroon-800" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-slate-800">Set Your Password</h2>
                <p className="text-sm text-slate-500 mt-2">
                    For your security, please create a new password before continuing.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="password" value="New Password" className="font-semibold text-slate-700" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full border-slate-300 focus:border-maroon-800 focus:ring-maroon-800 rounded-lg shadow-sm"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Enter new password"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="font-semibold text-slate-700" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full border-slate-300 focus:border-maroon-800 focus:ring-maroon-800 rounded-lg shadow-sm"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        placeholder="Confirm new password"
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <Button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-maroon-800 hover:bg-maroon-900 text-white font-semibold py-2.5 rounded-lg text-md transition-colors"
                >
                    {processing ? 'Saving...' : 'Set Password & Continue'}
                </Button>
            </form>
        </GuestLayout>
    );
}

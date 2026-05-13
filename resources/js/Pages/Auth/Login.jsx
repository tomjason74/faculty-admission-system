import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { Button } from '@/Components/ui/button';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-slate-800">Welcome back</h2>
                <p className="text-sm text-slate-500 mt-2">Please enter your details to sign in.</p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="Email Address" className="font-semibold text-slate-700" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full border-slate-300 focus:border-maroon-800 focus:ring-maroon-800 rounded-lg shadow-sm"
                        autoComplete="off"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="e.g. faculty@example.com"
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" className="font-semibold text-slate-700" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full border-slate-300 focus:border-maroon-800 focus:ring-maroon-800 rounded-lg shadow-sm"
                        autoComplete="off"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="••••••••"
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="text-maroon-800 focus:ring-maroon-800 border-slate-300 rounded"
                        />
                        <span className="ms-2 text-sm text-slate-600 font-medium">
                            Remember me
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm font-medium text-maroon-800 hover:text-maroon-900 hover:underline"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <Button 
                    type="submit" 
                    disabled={processing}
                    className="w-full bg-maroon-800 hover:bg-maroon-900 text-white font-semibold py-2.5 rounded-lg text-md transition-colors"
                >
                    Sign In
                </Button>


            </form>
        </GuestLayout>
    );
}

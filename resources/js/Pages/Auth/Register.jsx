import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { Button } from '@/Components/ui/button';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register | Faculty Portal" />

            <div className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-slate-800">Create an Account</h2>
                <p className="text-sm text-slate-500 mt-2">Register to access the PUP Faculty Portal.</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="name" value="Full Name" className="font-semibold text-slate-700" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full border-slate-300 focus:border-maroon-800 focus:ring-maroon-800 rounded-lg shadow-sm"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="e.g. Dr. John Doe"
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email Address" className="font-semibold text-slate-700" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full border-slate-300 focus:border-maroon-800 focus:ring-maroon-800 rounded-lg shadow-sm"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="e.g. faculty@example.com"
                        required
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
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="••••••••"
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                        className="font-semibold text-slate-700"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full border-slate-300 focus:border-maroon-800 focus:ring-maroon-800 rounded-lg shadow-sm"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        placeholder="••••••••"
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="pt-2">
                    <Button 
                        type="submit" 
                        disabled={processing}
                        className="w-full bg-maroon-800 hover:bg-maroon-900 text-white font-semibold py-2.5 rounded-lg text-md transition-colors"
                    >
                        Register
                    </Button>
                </div>

                <p className="text-center text-sm text-slate-600 mt-6">
                    Already registered?{' '}
                    <Link href={route('login')} className="font-semibold text-maroon-800 hover:underline">
                        Sign in here
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}

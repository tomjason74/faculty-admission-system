import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            {/* Left side: branding/image area (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 bg-maroon-900 flex-col justify-between relative overflow-hidden">
                {/* Decorative Pattern overlay */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-500 via-transparent to-transparent"></div>
                
                <div className="relative z-10 p-12">
                    <Link href="/" className="flex items-center space-x-3">
                        <img src="/images/pup-logo.png" alt="PUP Logo" className="h-12 w-auto" />
                        <div className="leading-tight">
                            <span className="block font-serif font-bold text-base text-white tracking-wide">Polytechnic University</span>
                            <span className="block text-xs text-gold-400 font-medium tracking-widest uppercase">of the Philippines</span>
                        </div>
                    </Link>
                </div>
                
                <div className="relative z-10 p-12 pb-24 space-y-6">
                    <h1 className="font-serif text-5xl font-bold text-white leading-tight">
                        PUP Faculty <br/><span className="text-gold-500">Admission Portal</span>
                    </h1>
                    <p className="text-maroon-100 text-lg max-w-md">
                        Join the country's first polytechnic university. Shape the future of education with excellence and integrity.
                    </p>
                </div>
            </div>

            {/* Right side: form area */}
            <div className="flex flex-col justify-center flex-1 px-4 sm:px-6 lg:flex-none lg:w-1/2 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:max-w-md">
                    
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <Link href="/">
                            <img src="/images/pup-logo.png" alt="PUP Logo" className="h-16 w-auto" />
                        </Link>
                    </div>
                    
                    <div className="bg-white px-8 py-10 shadow-xl rounded-2xl border border-slate-100">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

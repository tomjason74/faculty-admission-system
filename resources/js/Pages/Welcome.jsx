import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { ArrowRight, BookOpen, Users, ShieldCheck } from 'lucide-react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome | PUP Faculty Portal" />
            
            <div className="min-h-screen font-sans text-slate-800 selection:bg-maroon-800 selection:text-white flex flex-col relative">
                
                {/* Fixed Background Image for Full Page */}
                <div className="fixed inset-0 -z-20 bg-slate-900">
                    <img 
                        src="/images/pup-campus.jpg" 
                        alt="PUP Campus" 
                        className="w-full h-full object-cover opacity-30" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90"></div>
                </div>

                {/* Top Navigation */}
                <header className="fixed inset-x-0 top-0 z-50 bg-white/85 backdrop-blur-md shadow-sm border-b border-slate-200/50">
                    <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                        <div className="flex lg:flex-1">
                            <Link href="/" className="-m-1.5 p-1.5 flex items-center">
                                <img src="/images/pup-logo.png" alt="PUP Logo" className="h-10 w-auto mr-3" />
                                <div className="leading-tight">
                                    <span className="block font-serif font-bold text-base tracking-wide text-maroon-900">Polytechnic University</span>
                                    <span className="block text-xs text-maroon-700 font-medium tracking-widest uppercase">of the Philippines</span>
                                </div>
                            </Link>
                        </div>
                        
                        <div className="flex flex-1 justify-end items-center gap-4">
                            {auth.user ? (
                                <Link href={route('dashboard')}>
                                    <Button className="bg-maroon-800 hover:bg-maroon-900 text-white rounded-full px-6">
                                        Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="text-sm font-semibold leading-6 text-slate-800 hover:text-maroon-800 transition-colors">
                                        Log in
                                    </Link>
                                    <Link href={route('apply.create')}>
                                        <Button className="bg-maroon-800 hover:bg-maroon-900 text-white rounded-full px-6">
                                            Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <main className="flex-grow flex flex-col justify-center relative isolate pt-28">

                    <div className="py-24 sm:py-32 lg:pb-40">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="mx-auto max-w-2xl text-center">
                                <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                                    <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-slate-300 ring-1 ring-white/20 hover:ring-white/40 bg-white/5 backdrop-blur-sm">
                                        Join the country's first polytechnic university.{' '}
                                        <a href="https://www.pup.edu.ph/" target="_blank" rel="noopener noreferrer" className="font-semibold text-gold-400 hover:text-gold-300">
                                            <span className="absolute inset-0" aria-hidden="true"></span>Read more <span aria-hidden="true">&rarr;</span>
                                        </a>
                                    </div>
                                </div>
                                <h1 className="text-4xl font-serif font-bold tracking-tight text-white sm:text-6xl drop-shadow-sm">
                                    Shape the Future of <span className="text-gold-400">Education</span>
                                </h1>
                                <p className="mt-6 text-lg leading-8 text-slate-200 drop-shadow-sm">
                                    Welcome to the official Faculty Admission and Profiling System of the Polytechnic University of the Philippines. Streamline your application, track your compliance, and manage your academic profile securely.
                                </p>
                                <div className="mt-10 flex items-center justify-center gap-x-6">
                                    {!auth.user && (
                                        <Link href={route('apply.create')}>
                                            <Button size="lg" className="bg-maroon-800 hover:bg-maroon-900 text-white rounded-full px-8 h-12 text-md">
                                                Start Application
                                            </Button>
                                        </Link>
                                    )}
                                    <Link href={route('login')} className="text-sm font-semibold leading-6 text-slate-300 hover:text-white group">
                                        Faculty Login <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="bg-white/90 backdrop-blur-lg py-24 sm:py-32 border-t border-slate-200/50 mt-auto">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="mx-auto max-w-2xl lg:text-center">
                                <h2 className="text-base font-semibold leading-7 text-maroon-800 tracking-wide uppercase">Unified Portal</h2>
                                <p className="mt-2 text-3xl font-serif font-bold tracking-tight text-slate-900 sm:text-4xl">
                                    Everything you need to manage your academic career
                                </p>
                            </div>
                            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                                <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-maroon-50 border border-maroon-100">
                                            <BookOpen className="h-8 w-8 text-maroon-800" aria-hidden="true" />
                                        </div>
                                        <dt className="text-xl font-semibold leading-7 text-slate-900 font-serif">
                                            Profile Management
                                        </dt>
                                        <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                                            <p className="flex-auto">Maintain your academic profile, update specializations, and manage employment details effortlessly.</p>
                                        </dd>
                                    </div>
                                    <div className="flex flex-col items-center text-center">
                                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-50 border border-gold-100">
                                            <ShieldCheck className="h-8 w-8 text-gold-600" aria-hidden="true" />
                                        </div>
                                        <dt className="text-xl font-semibold leading-7 text-slate-900 font-serif">
                                            Compliance Tracking
                                        </dt>
                                        <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                                            <p className="flex-auto">Securely upload and track the approval status of medical certificates, clearances, and mandatory IDs.</p>
                                        </dd>
                                    </div>
                                    <div className="flex flex-col items-center text-center">
                                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 border border-slate-200">
                                            <Users className="h-8 w-8 text-slate-700" aria-hidden="true" />
                                        </div>
                                        <dt className="text-xl font-semibold leading-7 text-slate-900 font-serif">
                                            Class Records
                                        </dt>
                                        <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                                            <p className="flex-auto">A unified interface for submitting end-of-term class records and grading sheets to the administration.</p>
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm mt-auto">
                    <p>Polytechnic University of the Philippines &copy; {new Date().getFullYear()}. All Rights Reserved.</p>
                    <p className="mt-2 text-xs opacity-50">System powered by Laravel v{laravelVersion} (PHP v{phpVersion})</p>
                    <p className="mt-2 text-xs opacity-50">Developed by: Tom Jason D. Umali</p>
                </footer>
            </div>
        </>
    );
}

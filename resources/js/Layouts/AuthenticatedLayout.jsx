import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, FileText, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Dynamic Navigation links based on role
    const getNavLinks = () => {
        if (user?.roles?.includes('admin')) {
            return [
                { name: 'Dashboard', href: route('admin.dashboard'), active: route().current('admin.dashboard'), icon: LayoutDashboard },
                { name: 'Renewal Report', href: route('admin.reports.renewal'), active: route().current('admin.reports.renewal'), icon: FileText },
            ];
        } else if (user?.roles?.includes('faculty')) {
            return [
                { name: 'Dashboard', href: route('faculty.dashboard'), active: route().current('faculty.dashboard'), icon: LayoutDashboard },
            ];
        }
        return [
            { name: 'Dashboard', href: route('dashboard'), active: route().current('dashboard'), icon: LayoutDashboard },
        ];
    };

    const navLinks = getNavLinks();

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">

            {/* Top Navbar */}
            <header className="sticky top-0 z-30 bg-maroon-800 shadow-lg">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">

                        {/* Left: Logo + Nav Links */}
                        <div className="flex items-center space-x-8">
                            {/* Logo */}
                            <Link href={navLinks[0]?.href || '/'} className="flex items-center shrink-0">
                                <img src="/images/pup-logo.png" alt="PUP Logo" className="h-9 w-auto mr-2.5" />
                                <div className="leading-tight hidden sm:block">
                                    <span className="block font-serif font-bold text-sm tracking-wide text-white">PUP Portal</span>
                                    <span className="block text-[9px] text-gold-400 font-medium tracking-widest uppercase">Faculty System</span>
                                </div>
                            </Link>

                            {/* Desktop Nav Links */}
                            <nav className="hidden md:flex items-center space-x-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            link.active
                                                ? 'bg-maroon-900 text-gold-400'
                                                : 'text-slate-200 hover:bg-maroon-700 hover:text-white'
                                        }`}
                                    >
                                        <link.icon className="h-4 w-4 mr-2" />
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* Right: User Dropdown */}
                        <div className="flex items-center space-x-4">
                            {/* User Dropdown */}
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="flex items-center space-x-3 focus:outline-none group">
                                            <div className="h-8 w-8 rounded-full bg-gold-400 flex items-center justify-center text-maroon-900 font-bold uppercase text-sm border-2 border-gold-300">
                                                {user.name.substring(0, 2)}
                                            </div>
                                            <div className="hidden sm:block text-left">
                                                <p className="text-sm font-medium text-white group-hover:text-gold-400 transition-colors truncate max-w-[140px]">{user.name}</p>
                                                <p className="text-[11px] text-slate-300 truncate max-w-[140px]">{user.email}</p>
                                            </div>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content align="right" width="48">
                                        <div className="px-4 py-2.5 border-b border-slate-100 sm:hidden">
                                            <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                        </div>
                                        <Dropdown.Link href={route('profile.edit')}>Profile Settings</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden text-slate-200 hover:text-white focus:outline-none"
                            >
                                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Nav Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-maroon-700 bg-maroon-900">
                        <nav className="px-4 py-3 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                        link.active
                                            ? 'bg-maroon-800 text-gold-400'
                                            : 'text-slate-200 hover:bg-maroon-800 hover:text-white'
                                    }`}
                                >
                                    <link.icon className="h-4 w-4 mr-3" />
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </header>

            {/* Page Content */}
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                {header && (
                    <div className="mb-8">
                        {header}
                    </div>
                )}
                {children}
            </main>
        </div>
    );
}

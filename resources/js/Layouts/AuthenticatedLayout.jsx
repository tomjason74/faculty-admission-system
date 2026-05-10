import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, FolderOpen, Menu, Bell, Search, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Dynamic Navigation links based on role
    const getNavLinks = () => {
        let links = [];
        if (user?.roles?.includes('admin')) {
            links = [
                { name: 'Dashboard', href: route('admin.dashboard'), active: route().current('admin.dashboard'), icon: LayoutDashboard },
            ];
        } else if (user?.roles?.includes('faculty')) {
            links = [
                { name: 'Dashboard', href: route('faculty.dashboard'), active: route().current('faculty.dashboard'), icon: LayoutDashboard },
                { name: 'Documents', href: '#', active: false, icon: FolderOpen }, // Placeholder
            ];
        } else {
            links = [
                { name: 'Dashboard', href: route('dashboard'), active: route().current('dashboard'), icon: LayoutDashboard },
            ];
        }
        return links;
    };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800 antialiased">
            
            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div 
                    className="fixed inset-0 z-20 bg-slate-900/50 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-30 transform bg-maroon-800 text-slate-50 shadow-xl transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${sidebarCollapsed ? 'w-20' : 'w-64'} flex flex-col justify-between`}>
                <div>
                    {/* Logo Area */}
                    <div className={`flex h-16 items-center border-b border-maroon-700 transition-all ${sidebarCollapsed ? 'justify-center px-0' : 'px-6'}`}>
                        <Link href={getNavLinks()[0]?.href || '/'} className="flex items-center">
                            <img src="/images/pup-logo.png" alt="PUP Logo" className={`h-8 w-auto ${sidebarCollapsed ? '' : 'mr-2'}`} />
                            {!sidebarCollapsed && (
                                <div className="leading-tight">
                                    <span className="block font-serif font-bold text-sm tracking-wide text-white">PUP Portal</span>
                                    <span className="block text-[9px] text-gold-400 font-medium tracking-widest uppercase">Faculty System</span>
                                </div>
                            )}
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <nav className="p-4 space-y-2">
                        {getNavLinks().map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center rounded-lg transition-colors ${
                                    link.active 
                                        ? 'bg-maroon-900 text-gold-500 font-medium' 
                                        : 'hover:bg-maroon-700 text-slate-200'
                                } ${sidebarCollapsed ? 'justify-center py-3' : 'px-4 py-3'}`}
                                title={sidebarCollapsed ? link.name : ''}
                            >
                                <link.icon className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-3'}`} />
                                {!sidebarCollapsed && <span>{link.name}</span>}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* User Mini Profile (Static display on sidebar) */}
                <div className={`p-4 border-t border-maroon-700 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
                    <div className="flex items-center w-full">
                        <div className="h-8 w-8 rounded-full bg-slate-300 flex items-center justify-center text-maroon-800 font-bold shrink-0 uppercase">
                            {user.name.substring(0, 2)}
                        </div>
                        {!sidebarCollapsed && (
                            <div className="truncate text-left ml-3">
                                <p className="text-sm font-medium truncate">{user.name}</p>
                                <p className="text-xs text-slate-300 truncate">{user.email}</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-col flex-1 overflow-hidden w-full">
                
                {/* Top Navbar */}
                <header className="flex h-16 items-center justify-between bg-white px-4 sm:px-8 shadow-sm z-10 shrink-0">
                    <div className="flex items-center">
                        <button 
                            onClick={() => setMobileMenuOpen(true)}
                            className="mr-4 text-slate-500 hover:text-maroon-800 lg:hidden focus:outline-none"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        
                        {/* Desktop Sidebar Toggle */}
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="hidden lg:flex mr-6 text-slate-400 hover:text-maroon-800 focus:outline-none transition-colors"
                        >
                            {sidebarCollapsed ? <PanelLeftOpen className="h-6 w-6" /> : <PanelLeftClose className="h-6 w-6" />}
                        </button>

                        {/* Search Bar Removed */}
                    </div>

                    <div className="flex items-center space-x-6 text-slate-500">
                        {/* Bell Notification Removed */}

                        {/* User Dropdown moved to Top Navbar */}
                        <div className="relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center space-x-2 focus:outline-none hover:text-slate-800 transition-colors">
                                        <div className="h-8 w-8 rounded-full bg-maroon-100 flex items-center justify-center text-maroon-800 font-bold uppercase border border-maroon-200">
                                            {user.name.substring(0, 2)}
                                        </div>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="right" width="48">
                                    <div className="px-4 py-2 border-b border-slate-100 block sm:hidden">
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
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-8">
                    {header && (
                        <div className="mb-8">
                            {header}
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
    BadgeCheck, XCircle, FileText, Download, Search, Eye, X,
    FolderOpen, FileCheck, FileMinus, User, UserPlus, KeyRound, Copy, Check, Trash2, ShieldAlert, CheckCircle2
} from 'lucide-react';

export default function Dashboard({ applications, approvedFaculty, departments, stats }) {
    const { props } = usePage();
    const credential = props.credential ?? null;

    const { post, processing } = useForm();
    const [actionId, setActionId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [activeTab, setActiveTab] = useState('info');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [showCredential, setShowCredential] = useState(!!credential);
    const [copiedField, setCopiedField] = useState(null);
    const [directoryTab, setDirectoryTab] = useState('active');

    const addForm = useForm({
        name: '',
        email: '',
        department_id: '',
        degree: '',
        specialization: '',
        employment_type: '',
    });

    const deactivateForm = useForm({
        password: '',
    });

    const handleApprove = (id) => {
        if (confirm('Are you sure you want to approve this application? A temporary password will be generated.')) {
            setActionId(id);
            post(route('admin.applications.approve', id), {
                onFinish: () => setActionId(null),
            });
        }
    };

    const handleReject = (id) => {
        if (confirm('Are you sure you want to reject this application?')) {
            setActionId(id);
            post(route('admin.applications.reject', id), {
                onFinish: () => setActionId(null),
            });
        }
    };

    const handleAddFaculty = (e) => {
        e.preventDefault();
        addForm.post(route('admin.faculty.store'), {
            onSuccess: () => {
                setShowAddModal(false);
                addForm.reset();
                setShowCredential(true);
            },
        });
    };

    const confirmDeactivate = (id) => {
        setActionId(id);
        setShowDeactivateModal(true);
    };

    const submitDeactivate = (e) => {
        e.preventDefault();
        deactivateForm.post(route('admin.faculty.deactivate', actionId), {
            onSuccess: () => {
                setShowDeactivateModal(false);
                setSelectedFaculty(null);
                setActionId(null);
                deactivateForm.reset();
            },
            preserveScroll: true,
        });
    };

    const handleReactivate = (id) => {
        if (confirm('Are you sure you want to reactivate this faculty account? They will regain full login access.')) {
            setActionId(id);
            post(route('admin.faculty.reactivate', id), {
                onFinish: () => setActionId(null),
                onSuccess: () => setSelectedFaculty(null),
            });
        }
    };

    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleDeleteDocument = (id) => {
        if (confirm('Are you sure you want to delete this document? The faculty member will need to upload a replacement.')) {
            router.delete(route('documents.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    // Update selectedFaculty state to reflect the deleted document if it's currently open
                    if (selectedFaculty) {
                        setSelectedFaculty(prev => {
                            const newDocs = { ...prev.documents };
                            for (const key in newDocs) {
                                newDocs[key] = newDocs[key].filter(d => d.id !== id);
                            }
                            return { ...prev, documents: newDocs };
                        });
                    }
                }
            });
        }
    };

    const filterData = (data) => {
        if (!searchQuery) return data;
        const q = searchQuery.toLowerCase();
        return data.filter(item =>
            item.user.name.toLowerCase().includes(q) ||
            item.user.email.toLowerCase().includes(q) ||
            (item.department?.name && item.department.name.toLowerCase().includes(q))
        );
    };

    const filteredApplications = filterData(applications);
    const filteredApproved = filterData(approvedFaculty);
    
    const activeFacultyList = filteredApproved.filter(f => f.status === 'approved');
    const archivedFacultyList = filteredApproved.filter(f => f.status === 'inactive');
    const currentDirectoryList = directoryTab === 'active' ? activeFacultyList : archivedFacultyList;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-slate-800">Admin Dashboard</h2>
                        <p className="text-sm text-slate-500 mt-1">Manage faculty applications and compliance.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative w-full md:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search faculty..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-maroon-800 focus:border-maroon-800 sm:text-sm bg-white shadow-sm"
                            />
                        </div>
                        <Button
                            onClick={() => setShowAddModal(true)}
                            className="bg-maroon-800 hover:bg-maroon-900 text-white shrink-0"
                        >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add Faculty
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            {/* Credential Banner */}
            {showCredential && credential && (
                <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <div className="bg-green-100 text-green-700 rounded-full p-2 shrink-0 mt-0.5">
                                <KeyRound className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-green-800">Faculty account ready — share these credentials</p>
                                <p className="text-sm text-green-700 mt-0.5">Account created for <strong>{credential.name}</strong>. This password will not be shown again.</p>
                                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        { label: 'Email', value: credential.email, key: 'email' },
                                        { label: 'Temporary Password', value: credential.password, key: 'password' },
                                    ].map(({ label, value, key }) => (
                                        <div key={key} className="flex items-center justify-between bg-white border border-green-200 rounded-lg px-4 py-2.5 gap-3">
                                            <div className="overflow-hidden">
                                                <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">{label}</p>
                                                <p className="text-sm font-mono font-bold text-slate-800 truncate">{value}</p>
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(value, key)}
                                                className="text-green-600 hover:text-green-800 shrink-0 transition-colors"
                                                title="Copy"
                                            >
                                                {copiedField === key ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setShowCredential(false)} className="text-green-400 hover:text-green-700 ml-4 shrink-0">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-8">

                {/* Dashboard Stats */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="border-slate-200 shadow-sm bg-white">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-blue-100 text-blue-700 rounded-full">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Pending</p>
                                        <h3 className="text-2xl font-bold text-slate-900">{stats.total_pending}</h3>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-slate-200 shadow-sm bg-white">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-green-100 text-green-700 rounded-full">
                                        <BadgeCheck className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Active Faculty</p>
                                        <h3 className="text-2xl font-bold text-slate-900">{stats.total_approved}</h3>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-slate-200 shadow-sm bg-white">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-red-100 text-red-700 rounded-full">
                                        <XCircle className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Rejected</p>
                                        <h3 className="text-2xl font-bold text-slate-900">{stats.total_rejected}</h3>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-slate-200 shadow-sm bg-white">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-slate-100 text-slate-700 rounded-full">
                                        <User className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">Archived</p>
                                        <h3 className="text-2xl font-bold text-slate-900">{stats.total_inactive}</h3>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Pending Applications Section */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                        <CardTitle className="text-xl font-serif text-slate-800">Pending Applications</CardTitle>
                        <CardDescription>Review and approve newly submitted faculty applications.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {filteredApplications.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <FileText className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                                <p>{searchQuery ? 'No pending applications match your search.' : 'No pending applications at the moment.'}</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-600">
                                    <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-700">
                                        <tr>
                                            <th className="px-6 py-4">Applicant Name</th>
                                            <th className="px-6 py-4">Email</th>
                                            <th className="px-6 py-4">Department</th>
                                            <th className="px-6 py-4">Specialization</th>
                                            <th className="px-6 py-4">CV</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredApplications.map((app) => (
                                            <tr key={app.id} className="bg-white hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                                                    {app.user.name}
                                                    <div className="text-xs text-slate-500 font-normal mt-0.5">{app.degree}</div>
                                                </td>
                                                <td className="px-6 py-4">{app.user.email}</td>
                                                <td className="px-6 py-4 font-medium text-slate-700">{app.department?.name}</td>
                                                <td className="px-6 py-4 text-slate-500">{app.specialization}</td>
                                                <td className="px-6 py-4">
                                                    {app.cv_url ? (
                                                        <a href={app.cv_url} target="_blank" rel="noreferrer" className="inline-flex items-center text-maroon-700 hover:text-maroon-900 font-medium group">
                                                            <Download className="h-4 w-4 mr-1 transition-transform group-hover:-translate-y-0.5" />
                                                            View CV
                                                        </a>
                                                    ) : (
                                                        <span className="text-slate-400 italic">No CV</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <Button variant="ghost" size="sm" onClick={() => { setSelectedFaculty(app); setActiveTab('info'); }} className="text-slate-600 hover:text-maroon-800">
                                                        <Eye className="h-4 w-4 mr-1.5" /> Details
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleApprove(app.id)} disabled={processing && actionId === app.id} className="border-green-200 text-green-700 hover:bg-green-50">
                                                        <BadgeCheck className="h-4 w-4 mr-1.5" /> Approve
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleReject(app.id)} disabled={processing && actionId === app.id} className="border-red-200 text-red-700 hover:bg-red-50">
                                                        <XCircle className="h-4 w-4 mr-1.5" /> Reject
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Approved Faculty Section */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-xl font-serif text-slate-800">Faculty Directory & Compliance</CardTitle>
                                <CardDescription>Track onboarding compliance for active and archived faculty.</CardDescription>
                            </div>
                            <div className="flex bg-slate-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setDirectoryTab('active')}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${directoryTab === 'active' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => setDirectoryTab('archived')}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${directoryTab === 'archived' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Archived
                                </button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {currentDirectoryList.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <p>{searchQuery ? 'No faculty match your search.' : `No ${directoryTab} faculty members found.`}</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-600">
                                    <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-700">
                                        <tr>
                                            <th className="px-6 py-4">Faculty Member</th>
                                            <th className="px-6 py-4">Department</th>
                                            <th className="px-6 py-4">Compliance Status</th>
                                            <th className="px-6 py-4">Progress</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {currentDirectoryList.map((faculty) => (
                                            <tr key={faculty.id} className="bg-white hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-slate-900">{faculty.user.name}</div>
                                                    <div className="text-xs text-slate-500">{faculty.user.email}</div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-700">{faculty.department?.name}</td>
                                                <td className="px-6 py-4">
                                                    {faculty.is_compliant ? (
                                                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800">Fully Compliant</span>
                                                    ) : faculty.compliance_percentage > 0 ? (
                                                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">In Progress</span>
                                                    ) : (
                                                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800">Not Started</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-sm font-semibold text-slate-700">{faculty.compliance_percentage}%</span>
                                                        <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                                                            <div className={`h-2 rounded-full ${faculty.is_compliant ? 'bg-green-500' : 'bg-gold-500'}`} style={{ width: `${faculty.compliance_percentage}%` }}></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button variant="ghost" size="sm" onClick={() => { setSelectedFaculty(faculty); setActiveTab('info'); }} className="text-slate-600 hover:text-maroon-800">
                                                        <Eye className="h-4 w-4 mr-1.5" /> View Details
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* ── Add Faculty Modal ── */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
                            <div>
                                <h3 className="text-lg font-serif font-bold text-slate-800">Add Faculty Account</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Account will be immediately active. A temporary password will be generated.</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleAddFaculty} className="overflow-y-auto flex-1 p-6 space-y-5">
                            <div className="grid grid-cols-1 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                                    <Input
                                        type="text"
                                        placeholder="e.g. Dr. Maria Santos"
                                        value={addForm.data.name}
                                        onChange={e => addForm.setData('name', e.target.value)}
                                    />
                                    {addForm.errors.name && <p className="text-xs text-red-500 mt-1">{addForm.errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                                    <Input
                                        type="email"
                                        placeholder="e.g. m.santos@pup.edu.ph"
                                        value={addForm.data.email}
                                        onChange={e => addForm.setData('email', e.target.value)}
                                    />
                                    {addForm.errors.email && <p className="text-xs text-red-500 mt-1">{addForm.errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Department <span className="text-red-500">*</span></label>
                                    <select
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 bg-white"
                                        value={addForm.data.department_id}
                                        onChange={e => addForm.setData('department_id', e.target.value)}
                                    >
                                        <option value="">Select department...</option>
                                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                    {addForm.errors.department_id && <p className="text-xs text-red-500 mt-1">{addForm.errors.department_id}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Degree / Highest Attainment <span className="text-red-500">*</span></label>
                                    <Input
                                        type="text"
                                        placeholder="e.g. Ph.D. in Computer Science"
                                        value={addForm.data.degree}
                                        onChange={e => addForm.setData('degree', e.target.value)}
                                    />
                                    {addForm.errors.degree && <p className="text-xs text-red-500 mt-1">{addForm.errors.degree}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Specialization <span className="text-red-500">*</span></label>
                                    <Input
                                        type="text"
                                        placeholder="e.g. Machine Learning"
                                        value={addForm.data.specialization}
                                        onChange={e => addForm.setData('specialization', e.target.value)}
                                    />
                                    {addForm.errors.specialization && <p className="text-xs text-red-500 mt-1">{addForm.errors.specialization}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Employment Type <span className="text-red-500">*</span></label>
                                    <select
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 bg-white"
                                        value={addForm.data.employment_type}
                                        onChange={e => addForm.setData('employment_type', e.target.value)}
                                    >
                                        <option value="">Select type...</option>
                                        <option value="full-time">Full-Time</option>
                                        <option value="part-time">Part-Time</option>
                                        <option value="contract">Contract</option>
                                    </select>
                                    {addForm.errors.employment_type && <p className="text-xs text-red-500 mt-1">{addForm.errors.employment_type}</p>}
                                </div>
                            </div>
                        </form>
                        <div className="p-6 pt-0 flex justify-end gap-3 shrink-0">
                            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                            <Button
                                onClick={handleAddFaculty}
                                disabled={addForm.processing}
                                className="bg-maroon-800 hover:bg-maroon-900 text-white"
                            >
                                <UserPlus className="h-4 w-4 mr-2" />
                                {addForm.processing ? 'Creating...' : 'Create Account'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Faculty Details Modal ── */}
            {selectedFaculty && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
                            <div className="flex items-center space-x-3">
                                <div className="h-12 w-12 rounded-full bg-maroon-100 flex items-center justify-center text-maroon-800 font-bold uppercase text-lg">
                                    {selectedFaculty.user.name.substring(0, 2)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-serif font-bold text-slate-800">{selectedFaculty.user.name}</h3>
                                    <p className="text-xs text-slate-500">{selectedFaculty.user.email}</p>
                                </div>
                            </div>
                            <button onClick={() => { setSelectedFaculty(null); setActiveTab('info'); }} className="text-slate-400 hover:text-slate-700">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="flex border-b border-slate-100 shrink-0 px-6">
                            {[['info', User, 'Profile Info'], ['documents', FolderOpen, 'Submitted Documents']].map(([tab, Icon, label]) => (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-maroon-800 text-maroon-800' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                                    <Icon className="h-4 w-4" />{label}
                                </button>
                            ))}
                        </div>

                        <div className="overflow-y-auto flex-1 p-6">
                            {activeTab === 'info' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            ['Department', selectedFaculty.department?.name],
                                            ['Status', selectedFaculty.status],
                                            ['Degree', selectedFaculty.degree],
                                            ['Specialization', selectedFaculty.specialization],
                                            ['Employment Type', selectedFaculty.employment_type?.replace('_', ' ')],
                                            ['Hire Date', selectedFaculty.hire_date ? new Date(selectedFaculty.hire_date).toLocaleDateString() : null],
                                        ].map(([label, value]) => (
                                            <div key={label} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</span>
                                                <span className={`font-medium text-slate-800 capitalize ${label === 'Status' ? (selectedFaculty.status === 'approved' ? 'text-green-700' : selectedFaculty.status === 'rejected' ? 'text-red-700' : selectedFaculty.status === 'inactive' ? 'text-slate-500' : 'text-amber-700') : ''}`}>{value || 'N/A'}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        {selectedFaculty.cv_url && (
                                            <Button asChild className="bg-maroon-800 hover:bg-maroon-900 text-white flex-1">
                                                <a href={selectedFaculty.cv_url} target="_blank" rel="noreferrer">
                                                    <Download className="h-4 w-4 mr-2" /> Download CV
                                                </a>
                                            </Button>
                                        )}
                                        {selectedFaculty.status === 'approved' && (
                                            <Button variant="outline" onClick={() => confirmDeactivate(selectedFaculty.id)} disabled={processing && actionId === selectedFaculty.id} className="border-red-200 text-red-700 hover:bg-red-50">
                                                <XCircle className="h-4 w-4 mr-2" /> Deactivate Account
                                            </Button>
                                        )}
                                        {selectedFaculty.status === 'inactive' && (
                                            <Button variant="outline" onClick={() => handleReactivate(selectedFaculty.id)} disabled={processing && actionId === selectedFaculty.id} className="border-green-200 text-green-700 hover:bg-green-50">
                                                <CheckCircle2 className="h-4 w-4 mr-2" /> Reactivate Account
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'documents' && (
                                <div className="space-y-6">
                                    {[
                                        { key: 'medical_certificates', label: 'Medical Certificates' },
                                        { key: 'clearances', label: 'Clearances' },
                                        { key: 'ids', label: 'Identification Documents (IDs)' },
                                    ].map(({ key, label }) => {
                                        const docs = selectedFaculty.documents?.[key] || [];
                                        return (
                                            <div key={key}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-sm font-semibold text-slate-700">{label}</h4>
                                                    {docs.length > 0 ? (
                                                        <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full"><FileCheck className="h-3 w-3" /> Submitted</span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full"><FileMinus className="h-3 w-3" /> Missing</span>
                                                    )}
                                                </div>
                                                {docs.length > 0 ? (
                                                    <ul className="space-y-2">
                                                        {docs.map(doc => (
                                                            <li key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 hover:border-maroon-200 transition-colors">
                                                                <div className="flex items-center gap-3 overflow-hidden">
                                                                    <div className="bg-maroon-100 text-maroon-800 rounded p-1.5 shrink-0"><FileText className="h-4 w-4" /></div>
                                                                    <span className="text-sm text-slate-700 truncate font-medium">{doc.file_name}</span>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <Button variant="ghost" size="sm" asChild className="shrink-0 text-maroon-800 hover:bg-maroon-50">
                                                                        <a href={route('documents.download', doc.id)} target="_blank" rel="noreferrer">
                                                                            <Download className="h-4 w-4 mr-1.5" /> Download
                                                                        </a>
                                                                    </Button>
                                                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteDocument(doc.id)} className="shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50">
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <div className="p-4 border border-dashed border-slate-200 rounded-lg text-sm text-slate-400 italic text-center bg-slate-50">
                                                        No document submitted for this requirement.
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Deactivate Password Confirmation Modal ── */}
            {showDeactivateModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0 bg-red-50/50">
                            <div className="flex items-center gap-3">
                                <div className="bg-red-100 text-red-600 p-2 rounded-full">
                                    <ShieldAlert className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-serif font-bold text-slate-800">Security Confirmation</h3>
                                </div>
                            </div>
                            <button onClick={() => { setShowDeactivateModal(false); deactivateForm.reset(); }} className="text-slate-400 hover:text-slate-700">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={submitDeactivate} className="p-6 space-y-4">
                            <p className="text-sm text-slate-600">
                                You are about to deactivate this account. This will instantly revoke their login access.
                                Please enter your <strong>Admin Password</strong> to confirm this action.
                            </p>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Admin Password <span className="text-red-500">*</span></label>
                                <Input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={deactivateForm.data.password}
                                    onChange={e => deactivateForm.setData('password', e.target.value)}
                                    className="focus:ring-red-600 focus:border-red-600"
                                    autoFocus
                                />
                                {deactivateForm.errors.password && <p className="text-xs text-red-500 mt-1.5 font-medium">{deactivateForm.errors.password}</p>}
                            </div>
                            <div className="pt-4 flex justify-end gap-3 shrink-0">
                                <Button type="button" variant="outline" onClick={() => { setShowDeactivateModal(false); deactivateForm.reset(); }}>Cancel</Button>
                                <Button
                                    type="submit"
                                    disabled={deactivateForm.processing}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    {deactivateForm.processing ? 'Verifying...' : 'Confirm Deactivation'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

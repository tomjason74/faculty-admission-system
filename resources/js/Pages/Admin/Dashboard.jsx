import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
    BadgeCheck, XCircle, FileText, Download, Search, Eye, X,
    FolderOpen, FileCheck, FileMinus, User, UserPlus, KeyRound, Copy, Check, Trash2, ShieldAlert, CheckCircle2,
    Upload, FileSpreadsheet, AlertCircle, FolderDown, ArrowUpDown, ChevronLeft, ChevronRight, ChevronUp, ChevronDown
} from 'lucide-react';

export default function Dashboard({ applications, approvedFaculty, rejectedApplications, departments, stats }) {
    const { props } = usePage();
    const credential = props.credential ?? null;
    const bulkImportResult = props.bulk_import_result ?? null;

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
    const [showImportModal, setShowImportModal] = useState(false);
    const [showImportResults, setShowImportResults] = useState(!!bulkImportResult);
    const [importFile, setImportFile] = useState(null);
    const [isImporting, setIsImporting] = useState(false);
    const [directorySearch, setDirectorySearch] = useState('');
    const [confirmAction, setConfirmAction] = useState(null);
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    const [batchCheckResult, setBatchCheckResult] = useState(null);
    const [isCheckingBatch, setIsCheckingBatch] = useState(false);

    // Sorting, Filtering, and Pagination State for Pending Applications
    const [pendingSortField, setPendingSortField] = useState('name');
    const [pendingSortDirection, setPendingSortDirection] = useState('asc');
    const [pendingDeptFilter, setPendingDeptFilter] = useState('');
    const [pendingCurrentPage, setPendingCurrentPage] = useState(1);
    const [pendingPageSize, setPendingPageSize] = useState(10);

    // Sorting, Filtering, and Pagination State for Faculty Directory
    const [directorySortField, setDirectorySortField] = useState('name');
    const [directorySortDirection, setDirectorySortDirection] = useState('asc');
    const [directoryDeptFilter, setDirectoryDeptFilter] = useState('');
    const [directoryComplianceFilter, setDirectoryComplianceFilter] = useState('');
    const [directoryCurrentPage, setDirectoryCurrentPage] = useState(1);
    const [directoryPageSize, setDirectoryPageSize] = useState(10);

    const [renewalData, setRenewalData] = useState({
        is_enrolled_graduate: false,
        grad_school_name: '',
        grad_program: '',
        is_new_hire: false,
        teaching_load_status: '',
        eval_2324_sem1: '',
        eval_2324_sem2: '',
        eval_2425_sem1: '',
        eval_2425_sem2: '',
    });

    const [isSavingRenewal, setIsSavingRenewal] = useState(false);

    const handleSelectFaculty = (faculty) => {
        setSelectedFaculty(faculty);
        setActiveTab('info');
        setRenewalData({
            is_enrolled_graduate: faculty.is_enrolled_graduate ?? false,
            grad_school_name: faculty.grad_school_name ?? '',
            grad_program: faculty.grad_program ?? '',
            is_new_hire: faculty.is_new_hire ?? false,
            teaching_load_status: faculty.teaching_load_status ?? '',
            eval_2324_sem1: faculty.semester_evaluations?.['2023-2024_sem1'] ?? '',
            eval_2324_sem2: faculty.semester_evaluations?.['2023-2024_sem2'] ?? '',
            eval_2425_sem1: faculty.semester_evaluations?.['2024-2025_sem1'] ?? '',
            eval_2425_sem2: faculty.semester_evaluations?.['2024-2025_sem2'] ?? '',
        });
    };

    const handleSaveRenewal = (e) => {
        e.preventDefault();
        setIsSavingRenewal(true);
        router.post(route('admin.faculty.update_renewal', selectedFaculty.id), {
            is_enrolled_graduate: renewalData.is_enrolled_graduate,
            grad_school_name: renewalData.grad_school_name,
            grad_program: renewalData.grad_program,
            is_new_hire: renewalData.is_new_hire,
            teaching_load_status: renewalData.teaching_load_status,
            semester_evaluations: {
                '2023-2024_sem1': renewalData.eval_2324_sem1,
                '2023-2024_sem2': renewalData.eval_2324_sem2,
                '2024-2025_sem1': renewalData.eval_2425_sem1,
                '2024-2025_sem2': renewalData.eval_2425_sem2,
            }
        }, {
            onSuccess: () => {
                setIsSavingRenewal(false);
                setSelectedFaculty(prev => ({
                    ...prev,
                    is_enrolled_graduate: renewalData.is_enrolled_graduate,
                    grad_school_name: renewalData.grad_school_name,
                    grad_program: renewalData.grad_program,
                    is_new_hire: renewalData.is_new_hire,
                    teaching_load_status: renewalData.teaching_load_status,
                    semester_evaluations: {
                        '2023-2024_sem1': renewalData.eval_2324_sem1,
                        '2023-2024_sem2': renewalData.eval_2324_sem2,
                        '2024-2025_sem1': renewalData.eval_2425_sem1,
                        '2024-2025_sem2': renewalData.eval_2425_sem2,
                    }
                }));
            },
            onError: () => setIsSavingRenewal(false),
            preserveScroll: true
        });
    };

    const addForm = useForm({
        name: '',
        email: '',
        department_id: '',
        degree: '',
        specialization: '',
        employment_type: '',
        is_enrolled_graduate: false,
        grad_school_name: '',
        grad_program: '',
        is_new_hire: false,
        teaching_load_status: '',
        eval_2324_sem1: '',
        eval_2324_sem2: '',
        eval_2425_sem1: '',
        eval_2425_sem2: '',
    });

    const deactivateForm = useForm({
        password: '',
    });

    const resetPasswordForm = useForm({
        password: '',
    });

    const handleApprove = (id, name) => {
        setConfirmAction({ type: 'approve', id, name });
    };

    const handleReject = (id, name) => {
        setConfirmAction({ type: 'reject', id, name });
    };

    const executeConfirmAction = () => {
        if (!confirmAction) return;
        setActionId(confirmAction.id);
        const routeName = confirmAction.type === 'approve' ? 'admin.applications.approve' : 'admin.applications.reject';
        post(route(routeName, confirmAction.id), {
            onFinish: () => {
                setActionId(null);
                setConfirmAction(null);
            },
        });
    };

    const handleAddFaculty = (e) => {
        e.preventDefault();
        addForm.transform((data) => ({
            ...data,
            semester_evaluations: {
                '2023-2024_sem1': data.eval_2324_sem1,
                '2023-2024_sem2': data.eval_2324_sem2,
                '2024-2025_sem1': data.eval_2425_sem1,
                '2024-2025_sem2': data.eval_2425_sem2,
            }
        })).post(route('admin.faculty.store'), {
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

    // Helper handlers to reset pagination to page 1 on filter changes
    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value);
        setPendingCurrentPage(1);
    };

    const handlePendingDeptFilterChange = (val) => {
        setPendingDeptFilter(val);
        setPendingCurrentPage(1);
    };

    const handleDirectorySearchChange = (e) => {
        setDirectorySearch(e.target.value);
        setDirectoryCurrentPage(1);
    };

    const handleDirectoryDeptFilterChange = (val) => {
        setDirectoryDeptFilter(val);
        setDirectoryCurrentPage(1);
    };

    const handleDirectoryComplianceFilterChange = (val) => {
        setDirectoryComplianceFilter(val);
        setDirectoryCurrentPage(1);
    };

    const handleDirectoryTabChange = (tab) => {
        setDirectoryTab(tab);
        setDirectoryCurrentPage(1);
    };

    // --- Data Processing Pipeline for Pending Applications ---
    const processedPending = (applications ?? []).filter(item => {
        const matchesSearch = !searchQuery ? true : (
            item.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.department?.name && item.department.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.specialization && item.specialization.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        const matchesDept = !pendingDeptFilter ? true : String(item.department_id) === String(pendingDeptFilter);
        return matchesSearch && matchesDept;
    });

    processedPending.sort((a, b) => {
        let valA = '';
        let valB = '';
        if (pendingSortField === 'name') {
            valA = (a.user?.name ?? '').toLowerCase();
            valB = (b.user?.name ?? '').toLowerCase();
        } else if (pendingSortField === 'email') {
            valA = (a.user?.email ?? '').toLowerCase();
            valB = (b.user?.email ?? '').toLowerCase();
        } else if (pendingSortField === 'department') {
            valA = (a.department?.name ?? '').toLowerCase();
            valB = (b.department?.name ?? '').toLowerCase();
        } else if (pendingSortField === 'specialization') {
            valA = (a.specialization ?? '').toLowerCase();
            valB = (b.specialization ?? '').toLowerCase();
        }

        if (valA < valB) return pendingSortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return pendingSortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const totalPendingCount = processedPending.length;
    const pendingPageLimit = pendingPageSize === 'all' ? totalPendingCount : parseInt(pendingPageSize);
    const totalPendingPages = pendingPageLimit === 0 ? 1 : Math.ceil(totalPendingCount / pendingPageLimit);
    const safePendingCurrentPage = Math.min(pendingCurrentPage, totalPendingPages || 1);
    const filteredApplications = pendingPageSize === 'all'
        ? processedPending
        : processedPending.slice((safePendingCurrentPage - 1) * pendingPageLimit, safePendingCurrentPage * pendingPageLimit);

    // --- Data Processing Pipeline for Faculty Directory ---
    let baseDirectoryList = [];
    if (directoryTab === 'active') {
        baseDirectoryList = (approvedFaculty ?? []).filter(f => f.status === 'approved');
    } else if (directoryTab === 'archived') {
        baseDirectoryList = (approvedFaculty ?? []).filter(f => f.status === 'inactive');
    } else if (directoryTab === 'rejected') {
        baseDirectoryList = rejectedApplications ?? [];
    }

    const processedDirectory = baseDirectoryList.filter(item => {
        const matchesSearch = !directorySearch ? true : (
            item.user.name.toLowerCase().includes(directorySearch.toLowerCase()) ||
            item.user.email.toLowerCase().includes(directorySearch.toLowerCase()) ||
            (item.department?.name && item.department.name.toLowerCase().includes(directorySearch.toLowerCase()))
        );
        const matchesDept = !directoryDeptFilter ? true : String(item.department_id) === String(directoryDeptFilter);
        
        let matchesCompliance = true;
        if (directoryComplianceFilter) {
            if (directoryComplianceFilter === 'compliant') {
                matchesCompliance = item.is_compliant === true;
            } else if (directoryComplianceFilter === 'in_progress') {
                matchesCompliance = item.compliance_percentage > 0 && !item.is_compliant;
            } else if (directoryComplianceFilter === 'not_started') {
                matchesCompliance = item.compliance_percentage === 0;
            }
        }
        return matchesSearch && matchesDept && matchesCompliance;
    });

    processedDirectory.sort((a, b) => {
        let valA = '';
        let valB = '';
        if (directorySortField === 'name') {
            valA = (a.user?.name ?? '').toLowerCase();
            valB = (b.user?.name ?? '').toLowerCase();
        } else if (directorySortField === 'email') {
            valA = (a.user?.email ?? '').toLowerCase();
            valB = (b.user?.email ?? '').toLowerCase();
        } else if (directorySortField === 'department') {
            valA = (a.department?.name ?? '').toLowerCase();
            valB = (b.department?.name ?? '').toLowerCase();
        } else if (directorySortField === 'progress') {
            const progressA = a.compliance_percentage ?? 0;
            const progressB = b.compliance_percentage ?? 0;
            return directorySortDirection === 'asc' ? progressA - progressB : progressB - progressA;
        } else if (directorySortField === 'compliance_status') {
            const getComplianceOrder = (x) => {
                if (x.is_compliant) return 3;
                if (x.compliance_percentage > 0) return 2;
                return 1;
            };
            const orderA = getComplianceOrder(a);
            const orderB = getComplianceOrder(b);
            return directorySortDirection === 'asc' ? orderA - orderB : orderB - orderA;
        }

        if (valA < valB) return directorySortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return directorySortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const totalDirectoryCount = processedDirectory.length;
    const directoryPageLimit = directoryPageSize === 'all' ? totalDirectoryCount : parseInt(directoryPageSize);
    const totalDirectoryPages = directoryPageLimit === 0 ? 1 : Math.ceil(totalDirectoryCount / directoryPageLimit);
    const safeDirectoryCurrentPage = Math.min(directoryCurrentPage, totalDirectoryPages || 1);
    const currentDirectoryList = directoryPageSize === 'all'
        ? processedDirectory
        : processedDirectory.slice((safeDirectoryCurrentPage - 1) * directoryPageLimit, safeDirectoryCurrentPage * directoryPageLimit);
    const handlePendingSort = (field) => {
        if (pendingSortField === field) {
            setPendingSortDirection(pendingSortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setPendingSortField(field);
            setPendingSortDirection('asc');
        }
        setPendingCurrentPage(1);
    };

    const handleDirectorySort = (field) => {
        if (directorySortField === field) {
            setDirectorySortDirection(directorySortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setDirectorySortField(field);
            setDirectorySortDirection('asc');
        }
        setDirectoryCurrentPage(1);
    };
    const renderPagination = (currentPage, totalPages, totalCount, pageSize, setPageSize, setCurrentPage) => {
        if (totalCount === 0) return null;

        const limit = pageSize === 'all' ? totalCount : parseInt(pageSize);
        const startEntry = totalCount === 0 ? 0 : (currentPage - 1) * limit + 1;
        const endEntry = pageSize === 'all' ? totalCount : Math.min(currentPage * limit, totalCount);

        // Generate visible page numbers
        const pageNumbers = [];
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 bg-slate-50/30">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>Show</span>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            const val = e.target.value;
                            setPageSize(val);
                            setCurrentPage(1);
                        }}
                        className="px-2 py-1 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-maroon-800 text-xs font-semibold shadow-sm text-slate-700"
                    >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="all">All</option>
                    </select>
                    <span>entries</span>
                    <span className="mx-2">|</span>
                    <span>
                        Showing <strong className="text-slate-800 font-semibold">{startEntry}</strong> to{' '}
                        <strong className="text-slate-800 font-semibold">{endEntry}</strong> of{' '}
                        <strong className="text-slate-800 font-semibold">{totalCount}</strong> entries
                    </span>
                </div>

                {pageSize !== 'all' && totalPages > 1 && (
                    <div className="flex items-center gap-1.5">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className="h-8 w-8 p-0 border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        
                        {startPage > 1 && (
                            <>
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    className={`h-8 min-w-[32px] px-2 text-xs font-semibold rounded-md border transition-colors ${
                                        currentPage === 1
                                            ? 'bg-maroon-800 border-maroon-800 text-white'
                                            : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                                    }`}
                                >
                                    1
                                </button>
                                {startPage > 2 && <span className="text-slate-400 text-xs px-1">...</span>}
                            </>
                        )}

                        {pageNumbers.map(pageNum => (
                            <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`h-8 min-w-[32px] px-2 text-xs font-semibold rounded-md border transition-colors ${
                                    currentPage === pageNum
                                        ? 'bg-maroon-800 border-maroon-800 text-white'
                                        : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                                }`}
                            >
                                {pageNum}
                            </button>
                        ))}

                        {endPage < totalPages && (
                            <>
                                {endPage < totalPages - 1 && <span className="text-slate-400 text-xs px-1">...</span>}
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    className={`h-8 min-w-[32px] px-2 text-xs font-semibold rounded-md border transition-colors ${
                                        currentPage === totalPages
                                            ? 'bg-maroon-800 border-maroon-800 text-white'
                                            : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                                    }`}
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className="h-8 w-8 p-0 border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        );
    };

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
                                placeholder="Search pending applications..."
                                value={searchQuery}
                                onChange={handleSearchQueryChange}
                                className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-maroon-800 focus:border-maroon-800 sm:text-sm bg-white shadow-sm"
                            />
                        </div>
                        <Button
                            onClick={() => router.get(route('admin.reports.renewal'))}
                            variant="outline"
                            className="border-slate-300 text-slate-700 hover:bg-slate-50 shrink-0"
                        >
                            <FileText className="h-4 w-4 mr-2 text-slate-500" />
                            Generate Renewal Report
                        </Button>
                        <Button
                            onClick={() => setShowImportModal(true)}
                            variant="outline"
                            className="border-slate-300 text-slate-700 hover:bg-slate-50 shrink-0"
                        >
                            <Upload className="h-4 w-4 mr-2 text-slate-500" />
                            Import from Excel
                        </Button>
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
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-xl font-serif text-slate-800">Pending Applications</CardTitle>
                                <CardDescription>Review and approve newly submitted faculty applications.</CardDescription>
                            </div>
                            <div className="flex items-center gap-3">
                                <select
                                    value={pendingDeptFilter}
                                    onChange={(e) => handlePendingDeptFilterChange(e.target.value)}
                                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-maroon-800 bg-white shadow-sm font-sans"
                                >
                                    <option value="">All Departments</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                                {(pendingDeptFilter || searchQuery) && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setPendingDeptFilter('');
                                            setPendingCurrentPage(1);
                                        }}
                                        className="text-slate-500 hover:text-maroon-800 text-xs py-1 h-8"
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </div>
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
                                            <th className="px-6 py-4 cursor-pointer select-none hover:bg-slate-100/80 transition-colors group" onClick={() => handlePendingSort('name')}>
                                                <div className="flex items-center gap-1">
                                                    Applicant Name
                                                    {pendingSortField === 'name' ? (
                                                        pendingSortDirection === 'asc' ? <ChevronUp className="h-3.5 w-3.5 text-slate-700" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-700" />
                                                    ) : (
                                                        <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    )}
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 cursor-pointer select-none hover:bg-slate-100/80 transition-colors group" onClick={() => handlePendingSort('email')}>
                                                <div className="flex items-center gap-1">
                                                    Email
                                                    {pendingSortField === 'email' ? (
                                                        pendingSortDirection === 'asc' ? <ChevronUp className="h-3.5 w-3.5 text-slate-700" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-700" />
                                                    ) : (
                                                        <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    )}
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 cursor-pointer select-none hover:bg-slate-100/80 transition-colors group" onClick={() => handlePendingSort('department')}>
                                                <div className="flex items-center gap-1">
                                                    Department
                                                    {pendingSortField === 'department' ? (
                                                        pendingSortDirection === 'asc' ? <ChevronUp className="h-3.5 w-3.5 text-slate-700" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-700" />
                                                    ) : (
                                                        <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    )}
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 cursor-pointer select-none hover:bg-slate-100/80 transition-colors group" onClick={() => handlePendingSort('specialization')}>
                                                <div className="flex items-center gap-1">
                                                    Specialization
                                                    {pendingSortField === 'specialization' ? (
                                                        pendingSortDirection === 'asc' ? <ChevronUp className="h-3.5 w-3.5 text-slate-700" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-700" />
                                                    ) : (
                                                        <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    )}
                                                </div>
                                            </th>
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
                                                    <Button variant="ghost" size="sm" onClick={() => handleSelectFaculty(app)} className="text-slate-600 hover:text-maroon-800">
                                                        <Eye className="h-4 w-4 mr-1.5" /> Details
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleApprove(app.id, app.user.name)} disabled={processing && actionId === app.id} className="border-green-200 text-green-700 hover:bg-green-50">
                                                        <BadgeCheck className="h-4 w-4 mr-1.5" /> Approve
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleReject(app.id, app.user.name)} disabled={processing && actionId === app.id} className="border-red-200 text-red-700 hover:bg-red-50">
                                                        <XCircle className="h-4 w-4 mr-1.5" /> Reject
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {renderPagination(
                            safePendingCurrentPage,
                            totalPendingPages,
                            totalPendingCount,
                            pendingPageSize,
                            setPendingPageSize,
                            setPendingCurrentPage
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
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={isCheckingBatch}
                                    onClick={() => {
                                        setIsCheckingBatch(true);
                                        fetch(route('admin.faculty.batch_compliance'))
                                            .then(res => res.json())
                                            .then(data => {
                                                setBatchCheckResult(data);
                                                setIsCheckingBatch(false);
                                            })
                                            .catch(() => setIsCheckingBatch(false));
                                    }}
                                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                                >
                                    <FolderDown className="h-4 w-4 mr-1.5" />
                                    {isCheckingBatch ? 'Checking...' : 'Batch Download'}
                                </Button>
                            <div className="flex bg-slate-100 p-1 rounded-lg">
                                <button
                                    onClick={() => handleDirectoryTabChange('active')}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${directoryTab === 'active' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => handleDirectoryTabChange('archived')}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${directoryTab === 'archived' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Archived
                                </button>
                                <button
                                    onClick={() => handleDirectoryTabChange('rejected')}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${directoryTab === 'rejected' ? 'bg-white text-red-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Rejected ({(rejectedApplications ?? []).length})
                                </button>
                            </div>
                            </div>
                        </div>
                        <div className="mt-3 flex flex-col md:flex-row items-center gap-3">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Search faculty by name, email, or department..."
                                    value={directorySearch}
                                    onChange={handleDirectorySearchChange}
                                    className="pl-9 w-full"
                                />
                            </div>
                            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0">
                                <select
                                    value={directoryDeptFilter}
                                    onChange={(e) => handleDirectoryDeptFilterChange(e.target.value)}
                                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 bg-white shadow-sm font-sans flex-1 md:flex-initial min-w-[150px]"
                                >
                                    <option value="">All Departments</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                                {directoryTab !== 'rejected' && (
                                    <select
                                        value={directoryComplianceFilter}
                                        onChange={(e) => handleDirectoryComplianceFilterChange(e.target.value)}
                                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 bg-white shadow-sm font-sans flex-1 md:flex-initial min-w-[150px]"
                                    >
                                        <option value="">All Compliance Statuses</option>
                                        <option value="compliant">Fully Compliant</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="not_started">Not Started</option>
                                    </select>
                                )}
                                {(directoryDeptFilter || directoryComplianceFilter || directorySearch) && (
                                    <Button
                                        value="Clear Filters"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setDirectorySearch('');
                                            setDirectoryDeptFilter('');
                                            setDirectoryComplianceFilter('');
                                            setDirectoryCurrentPage(1);
                                        }}
                                        className="text-slate-500 hover:text-maroon-800 text-xs px-3"
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {currentDirectoryList.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <p>{directorySearch ? 'No faculty match your search.' : `No ${directoryTab} faculty members found.`}</p>
                            </div>
                        ) : directoryTab === 'rejected' ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-600">
                                    <thead className="bg-red-50 text-xs font-semibold uppercase tracking-wider text-red-800">
                                        <tr>
                                            <th className="px-6 py-4 cursor-pointer select-none hover:bg-red-100/50 transition-colors group" onClick={() => handleDirectorySort('name')}>
                                                <div className="flex items-center gap-1">
                                                    Name
                                                    {directorySortField === 'name' ? (
                                                        directorySortDirection === 'asc' ? <ChevronUp className="h-3.5 w-3.5 text-red-800" /> : <ChevronDown className="h-3.5 w-3.5 text-red-800" />
                                                    ) : (
                                                        <ArrowUpDown className="h-3.5 w-3.5 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    )}
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 cursor-pointer select-none hover:bg-red-100/50 transition-colors group" onClick={() => handleDirectorySort('email')}>
                                                <div className="flex items-center gap-1">
                                                    Email
                                                    {directorySortField === 'email' ? (
                                                        directorySortDirection === 'asc' ? <ChevronUp className="h-3.5 w-3.5 text-red-800" /> : <ChevronDown className="h-3.5 w-3.5 text-red-800" />
                                                    ) : (
                                                        <ArrowUpDown className="h-3.5 w-3.5 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    )}
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 cursor-pointer select-none hover:bg-red-100/50 transition-colors group" onClick={() => handleDirectorySort('department')}>
                                                <div className="flex items-center gap-1">
                                                    Department
                                                    {directorySortField === 'department' ? (
                                                        directorySortDirection === 'asc' ? <ChevronUp className="h-3.5 w-3.5 text-red-800" /> : <ChevronDown className="h-3.5 w-3.5 text-red-800" />
                                                    ) : (
                                                        <ArrowUpDown className="h-3.5 w-3.5 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    )}
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {currentDirectoryList.map((app) => (
                                            <tr key={app.id} className="bg-white hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900">{app.user.name}</td>
                                                <td className="px-6 py-4 text-slate-600">{app.user.email}</td>
                                                <td className="px-6 py-4 text-slate-700">{app.department?.name}</td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <Button variant="outline" size="sm" onClick={() => { post(route('admin.applications.re_review', app.id)); }} className="border-blue-200 text-blue-700 hover:bg-blue-50">
                                                        <FileCheck className="h-4 w-4 mr-1.5" /> Re-review
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => { if (confirm('Permanently delete this application? This cannot be undone.')) router.delete(route('admin.applications.delete', app.id)); }} className="border-red-200 text-red-700 hover:bg-red-50">
                                                        <Trash2 className="h-4 w-4 mr-1.5" /> Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-600">
                                    <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-700">
                                        <tr>
                                            <th className="px-6 py-4 cursor-pointer select-none hover:bg-slate-100/80 transition-colors group" onClick={() => handleDirectorySort('name')}>
                                                <div className="flex items-center gap-1">
                                                    Faculty Member
                                                    {directorySortField === 'name' ? (
                                                        directorySortDirection === 'asc' ? <ChevronUp className="h-3.5 w-3.5 text-slate-700" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-700" />
                                                    ) : (
                                                        <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    )}
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 cursor-pointer select-none hover:bg-slate-100/80 transition-colors group" onClick={() => handleDirectorySort('department')}>
                                                <div className="flex items-center gap-1">
                                                    Department
                                                    {directorySortField === 'department' ? (
                                                        directorySortDirection === 'asc' ? <ChevronUp className="h-3.5 w-3.5 text-slate-700" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-700" />
                                                    ) : (
                                                        <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    )}
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 cursor-pointer select-none hover:bg-slate-100/80 transition-colors group" onClick={() => handleDirectorySort('compliance_status')}>
                                                <div className="flex items-center gap-1">
                                                    Compliance Status
                                                    {directorySortField === 'compliance_status' ? (
                                                        directorySortDirection === 'asc' ? <ChevronUp className="h-3.5 w-3.5 text-slate-700" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-700" />
                                                    ) : (
                                                        <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    )}
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 cursor-pointer select-none hover:bg-slate-100/80 transition-colors group" onClick={() => handleDirectorySort('progress')}>
                                                <div className="flex items-center gap-1">
                                                    Progress
                                                    {directorySortField === 'progress' ? (
                                                        directorySortDirection === 'asc' ? <ChevronUp className="h-3.5 w-3.5 text-slate-700" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-700" />
                                                    ) : (
                                                        <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    )}
                                                </div>
                                            </th>
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
                                                    <Button variant="ghost" size="sm" onClick={() => handleSelectFaculty(faculty)} className="text-slate-600 hover:text-maroon-800">
                                                        <Eye className="h-4 w-4 mr-1.5" /> View Details
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {renderPagination(
                            safeDirectoryCurrentPage,
                            totalDirectoryPages,
                            totalDirectoryCount,
                            directoryPageSize,
                            setDirectoryPageSize,
                            setDirectoryCurrentPage
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

                                <div className="border-t border-slate-100 pt-4 mt-4">
                                    <h4 className="text-sm font-semibold text-slate-800 mb-4 font-serif">Renewal & Graduate Studies (Optional)</h4>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex items-center space-x-2 mt-2">
                                            <input
                                                type="checkbox"
                                                id="is_enrolled_graduate"
                                                checked={addForm.data.is_enrolled_graduate}
                                                onChange={e => addForm.setData('is_enrolled_graduate', e.target.checked)}
                                                className="rounded border-slate-300 text-maroon-800 focus:ring-maroon-800"
                                            />
                                            <label htmlFor="is_enrolled_graduate" className="text-sm text-slate-700 font-semibold">Enrolled in Graduate Studies</label>
                                        </div>

                                        <div className="flex items-center space-x-2 mt-2">
                                            <input
                                                type="checkbox"
                                                id="is_new_hire"
                                                checked={addForm.data.is_new_hire}
                                                onChange={e => addForm.setData('is_new_hire', e.target.checked)}
                                                className="rounded border-slate-300 text-maroon-800 focus:ring-maroon-800"
                                            />
                                            <label htmlFor="is_new_hire" className="text-sm text-slate-700 font-semibold">Newly Hired Faculty</label>
                                        </div>
                                    </div>

                                    {addForm.data.is_enrolled_graduate && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Graduate School Name</label>
                                                <Input
                                                    type="text"
                                                    placeholder="e.g. PUP Graduate School"
                                                    value={addForm.data.grad_school_name}
                                                    onChange={e => addForm.setData('grad_school_name', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Graduate Program</label>
                                                <Input
                                                    type="text"
                                                    placeholder="e.g. DBA"
                                                    value={addForm.data.grad_program}
                                                    onChange={e => addForm.setData('grad_program', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-4">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Teaching Load / Status Note</label>
                                        <Input
                                            type="text"
                                            placeholder="e.g. No teaching load / Newly hired"
                                            value={addForm.data.teaching_load_status}
                                            onChange={e => addForm.setData('teaching_load_status', e.target.value)}
                                        />
                                    </div>

                                    <div className="mt-4 space-y-3">
                                        <label className="block text-sm font-semibold text-slate-700">Semester Evaluations</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                ['2023-2024 Sem 1', 'eval_2324_sem1'],
                                                ['2023-2024 Sem 2', 'eval_2324_sem2'],
                                                ['2024-2025 Sem 1', 'eval_2425_sem1'],
                                                ['2024-2025 Sem 2', 'eval_2425_sem2'],
                                            ].map(([label, field]) => (
                                                <div key={field}>
                                                    <span className="text-xs text-slate-500 font-semibold">{label} Rating</span>
                                                    <select
                                                        className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 bg-white"
                                                        value={addForm.data[field]}
                                                        onChange={e => addForm.setData(field, e.target.value)}
                                                    >
                                                        <option value="">-- Select Rating --</option>
                                                        <option value="Outstanding">Outstanding</option>
                                                        <option value="Very Satisfactory">Very Satisfactory</option>
                                                        <option value="Satisfactory">Satisfactory</option>
                                                        <option value="Unsatisfactory">Unsatisfactory</option>
                                                        <option value="Poor">Poor</option>
                                                        <option value="No teaching load">No teaching load</option>
                                                        <option value="New Faculty">New Faculty</option>
                                                    </select>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
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
                            {[
                                ['info', User, 'Profile Info'], 
                                ['documents', FolderOpen, 'Submitted Documents'],
                                ['renewal', FileCheck, 'Renewal Details']
                            ].map(([tab, Icon, label]) => (
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
                                    {selectedFaculty.cover_message && (
                                        <div className="bg-maroon-50 p-4 rounded-lg border border-maroon-100 mt-4">
                                            <span className="block text-xs font-semibold text-maroon-800 uppercase tracking-wider mb-2">Statement of Purpose / Cover Message</span>
                                            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed italic">"{selectedFaculty.cover_message}"</p>
                                        </div>
                                    )}
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {selectedFaculty.cv_url && (
                                            <Button asChild className="bg-maroon-800 hover:bg-maroon-900 text-white flex-1">
                                                <a href={selectedFaculty.cv_url} target="_blank" rel="noreferrer">
                                                    <Download className="h-4 w-4 mr-2" /> Download CV
                                                </a>
                                            </Button>
                                        )}
                                        {selectedFaculty.status === 'approved' && (
                                            <>
                                                <Button variant="outline" onClick={() => setShowResetPasswordModal(true)} className="border-amber-200 text-amber-700 hover:bg-amber-50">
                                                    <KeyRound className="h-4 w-4 mr-2" /> Reset Password
                                                </Button>
                                                <Button variant="outline" onClick={() => confirmDeactivate(selectedFaculty.id)} disabled={processing && actionId === selectedFaculty.id} className="border-red-200 text-red-700 hover:bg-red-50">
                                                    <XCircle className="h-4 w-4 mr-2" /> Deactivate Account
                                                </Button>
                                            </>
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
                                        { key: 'nbi_clearance', label: 'NBI Clearance' },
                                        { key: 'government_ids', label: 'TIN / SSS / PhilHealth / Pag-IBIG' },
                                        { key: 'employment_certificate', label: 'Certificate of Employment / Service Record' },
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

                            {activeTab === 'renewal' && (
                                <form onSubmit={handleSaveRenewal} className="space-y-5">
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-4">
                                        <h4 className="text-sm font-semibold text-slate-800 border-b border-slate-200 pb-2 font-serif">Academic Enrollment</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex items-center space-x-2 mt-2">
                                                <input
                                                    type="checkbox"
                                                    id="edit_is_enrolled_graduate"
                                                    checked={renewalData.is_enrolled_graduate}
                                                    onChange={e => setRenewalData(prev => ({ ...prev, is_enrolled_graduate: e.target.checked }))}
                                                    className="rounded border-slate-300 text-maroon-800 focus:ring-maroon-800"
                                                />
                                                <label htmlFor="edit_is_enrolled_graduate" className="text-sm font-semibold text-slate-700">Enrolled in Graduate Studies</label>
                                            </div>

                                            <div className="flex items-center space-x-2 mt-2">
                                                <input
                                                    type="checkbox"
                                                    id="edit_is_new_hire"
                                                    checked={renewalData.is_new_hire}
                                                    onChange={e => setRenewalData(prev => ({ ...prev, is_new_hire: e.target.checked }))}
                                                    className="rounded border-slate-300 text-maroon-800 focus:ring-maroon-800"
                                                />
                                                <label htmlFor="edit_is_new_hire" className="text-sm font-semibold text-slate-700">Newly Hired Faculty</label>
                                            </div>
                                        </div>

                                        {renewalData.is_enrolled_graduate && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Graduate School</label>
                                                    <Input
                                                        type="text"
                                                        value={renewalData.grad_school_name}
                                                        onChange={e => setRenewalData(prev => ({ ...prev, grad_school_name: e.target.value }))}
                                                        placeholder="e.g. PUP Graduate School"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Program</label>
                                                    <Input
                                                        type="text"
                                                        value={renewalData.grad_program}
                                                        onChange={e => setRenewalData(prev => ({ ...prev, grad_program: e.target.value }))}
                                                        placeholder="e.g. DBA"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Teaching Load / Status Note</label>
                                        <Input
                                            type="text"
                                            value={renewalData.teaching_load_status}
                                            onChange={e => setRenewalData(prev => ({ ...prev, teaching_load_status: e.target.value }))}
                                            placeholder="e.g. No teaching load"
                                        />
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
                                        <h4 className="text-sm font-semibold text-slate-800 border-b border-slate-200 pb-2 font-serif">Semester Evaluations</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                ['2023-2024 Sem 1', 'eval_2324_sem1'],
                                                ['2023-2024 Sem 2', 'eval_2324_sem2'],
                                                ['2024-2025 Sem 1', 'eval_2425_sem1'],
                                                ['2024-2025 Sem 2', 'eval_2425_sem2'],
                                            ].map(([label, field]) => (
                                                <div key={field}>
                                                    <span className="text-xs text-slate-500 font-semibold">{label} Rating</span>
                                                    <select
                                                        className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 bg-white"
                                                        value={renewalData[field]}
                                                        onChange={e => setRenewalData(prev => ({ ...prev, [field]: e.target.value }))}
                                                    >
                                                        <option value="">-- Select Rating --</option>
                                                        <option value="Outstanding">Outstanding</option>
                                                        <option value="Very Satisfactory">Very Satisfactory</option>
                                                        <option value="Satisfactory">Satisfactory</option>
                                                        <option value="Unsatisfactory">Unsatisfactory</option>
                                                        <option value="Poor">Poor</option>
                                                        <option value="No teaching load">No teaching load</option>
                                                        <option value="New Faculty">New Faculty</option>
                                                    </select>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <Button
                                            type="submit"
                                            disabled={isSavingRenewal}
                                            className="bg-maroon-800 hover:bg-maroon-900 text-white w-full sm:w-auto"
                                        >
                                            {isSavingRenewal ? 'Saving...' : 'Save Renewal Details'}
                                        </Button>
                                    </div>
                                </form>
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
            {/* ── Import from Excel Modal ── */}
            {showImportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-full">
                                    <FileSpreadsheet className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-serif font-bold text-slate-800">Import from Excel</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Upload an .xlsx file to create faculty accounts in bulk.</p>
                                </div>
                            </div>
                            <button onClick={() => { setShowImportModal(false); setImportFile(null); }} className="text-slate-400 hover:text-slate-700">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800 font-medium mb-2">Step 1: Download the template</p>
                                <p className="text-xs text-blue-700 mb-3">Download the Excel template, fill in the faculty details, then upload it below.</p>
                                <a
                                    href={route('admin.faculty.import_template')}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    <Download className="h-4 w-4" /> Download Template
                                </a>
                            </div>

                            <div>
                                <p className="text-sm text-slate-700 font-semibold mb-2">Step 2: Upload your filled Excel file</p>
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                                    {importFile ? (
                                        <div className="flex items-center gap-2 text-emerald-700">
                                            <CheckCircle2 className="h-5 w-5" />
                                            <span className="text-sm font-medium">{importFile.name}</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-slate-400">
                                            <Upload className="h-8 w-8 mb-1" />
                                            <span className="text-sm font-medium">Click to select .xlsx file</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept=".xlsx,.xls"
                                        className="hidden"
                                        onChange={e => setImportFile(e.target.files[0] || null)}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="p-6 pt-0 flex justify-end gap-3 shrink-0">
                            <Button variant="outline" onClick={() => { setShowImportModal(false); setImportFile(null); }}>Cancel</Button>
                            <Button
                                disabled={!importFile || isImporting}
                                className="bg-emerald-700 hover:bg-emerald-800 text-white"
                                onClick={() => {
                                    setIsImporting(true);
                                    const formData = new FormData();
                                    formData.append('file', importFile);
                                    router.post(route('admin.faculty.import'), formData, {
                                        forceFormData: true,
                                        onSuccess: () => {
                                            setShowImportModal(false);
                                            setImportFile(null);
                                            setIsImporting(false);
                                            setShowImportResults(true);
                                        },
                                        onError: () => {
                                            setIsImporting(false);
                                        },
                                    });
                                }}
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                {isImporting ? 'Importing...' : 'Import Faculty'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Bulk Import Results Modal ── */}
            {showImportResults && bulkImportResult && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-full">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-serif font-bold text-slate-800">Import Complete</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {bulkImportResult.created.length} account(s) created
                                        {bulkImportResult.skipped.length > 0 && `, ${bulkImportResult.skipped.length} row(s) skipped`}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setShowImportResults(false)} className="text-slate-400 hover:text-slate-700">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="overflow-y-auto flex-1 p-6 space-y-5">
                            {/* Created Accounts */}
                            {bulkImportResult.created.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <CheckCircle2 className="h-4 w-4" /> Created Accounts ({bulkImportResult.created.length})
                                    </h4>
                                    <div className="border border-emerald-200 rounded-lg overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="bg-emerald-50 text-emerald-800">
                                                <tr>
                                                    <th className="px-4 py-2 text-left font-semibold">Name</th>
                                                    <th className="px-4 py-2 text-left font-semibold">Email</th>
                                                    <th className="px-4 py-2 text-left font-semibold">Temp Password</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-emerald-100">
                                                {bulkImportResult.created.map((item, i) => (
                                                    <tr key={i} className="bg-white">
                                                        <td className="px-4 py-2 font-medium text-slate-800">{item.name}</td>
                                                        <td className="px-4 py-2 text-slate-600">{item.email}</td>
                                                        <td className="px-4 py-2">
                                                            <code className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono text-xs">{item.password}</code>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2 italic">Credentials are also saved to credentials.txt in the project folder.</p>
                                </div>
                            )}

                            {/* Skipped Rows */}
                            {bulkImportResult.skipped.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <AlertCircle className="h-4 w-4" /> Skipped Rows ({bulkImportResult.skipped.length})
                                    </h4>
                                    <div className="border border-amber-200 rounded-lg overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="bg-amber-50 text-amber-800">
                                                <tr>
                                                    <th className="px-4 py-2 text-left font-semibold">Row</th>
                                                    <th className="px-4 py-2 text-left font-semibold">Name</th>
                                                    <th className="px-4 py-2 text-left font-semibold">Reason</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-amber-100">
                                                {bulkImportResult.skipped.map((item, i) => (
                                                    <tr key={i} className="bg-white">
                                                        <td className="px-4 py-2 text-slate-600">{item.row}</td>
                                                        <td className="px-4 py-2 font-medium text-slate-800">{item.name}</td>
                                                        <td className="px-4 py-2 text-amber-700 text-xs">{item.reason}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-6 pt-3 border-t border-slate-100 flex justify-end shrink-0">
                            <Button onClick={() => setShowImportResults(false)} className="bg-slate-800 hover:bg-slate-900 text-white">
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Confirm Approve/Reject Modal ── */}
            {confirmAction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-full shrink-0 ${confirmAction.type === 'approve' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {confirmAction.type === 'approve' ? <BadgeCheck className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                            </div>
                            <div>
                                <h3 className="text-lg font-serif font-bold text-slate-800">
                                    {confirmAction.type === 'approve' ? 'Approve Application' : 'Reject Application'}
                                </h3>
                                <p className="text-sm text-slate-600 mt-1">
                                    Are you sure you want to <strong>{confirmAction.type}</strong> the application from <strong>{confirmAction.name}</strong>?
                                    {confirmAction.type === 'approve' && ' A temporary password will be generated for the faculty account.'}
                                    {confirmAction.type === 'reject' && ' The applicant will be notified of the rejection.'}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="outline" onClick={() => setConfirmAction(null)}>Cancel</Button>
                            <Button
                                onClick={executeConfirmAction}
                                disabled={processing}
                                className={confirmAction.type === 'approve' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}
                            >
                                {processing ? 'Processing...' : confirmAction.type === 'approve' ? 'Yes, Approve' : 'Yes, Reject'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Reset Password Confirmation Modal ── */}
            {showResetPasswordModal && selectedFaculty && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-full shrink-0 bg-amber-100 text-amber-700">
                                <KeyRound className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-serif font-bold text-slate-800">Reset Password</h3>
                                <p className="text-sm text-slate-600 mt-1">
                                    Are you sure you want to reset the password for <strong>{selectedFaculty.user.name}</strong>?
                                </p>
                                <p className="text-xs text-slate-500 mt-2">
                                    A new temporary password will be generated and the faculty member will be required to change it on their next login.
                                </p>
                            </div>
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            resetPasswordForm.post(route('admin.faculty.reset_password', selectedFaculty.id), {
                                onSuccess: () => {
                                    setShowResetPasswordModal(false);
                                    setShowCredential(true);
                                    setSelectedFaculty(null);
                                    resetPasswordForm.reset();
                                },
                            });
                        }} className="mt-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Enter your admin password to confirm</label>
                                <Input
                                    type="password"
                                    placeholder="Your admin password"
                                    value={resetPasswordForm.data.password}
                                    onChange={e => resetPasswordForm.setData('password', e.target.value)}
                                    autoFocus
                                />
                                {resetPasswordForm.errors.password && <p className="text-xs text-red-500 mt-1">{resetPasswordForm.errors.password}</p>}
                            </div>
                            <div className="flex justify-end gap-3 mt-5">
                                <Button type="button" variant="outline" onClick={() => { setShowResetPasswordModal(false); resetPasswordForm.reset(); }}>Cancel</Button>
                                <Button
                                    type="submit"
                                    disabled={resetPasswordForm.processing || !resetPasswordForm.data.password}
                                    className="bg-amber-600 hover:bg-amber-700 text-white"
                                >
                                    {resetPasswordForm.processing ? 'Resetting...' : 'Yes, Reset Password'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Batch Download Compliance Modal ── */}
            {batchCheckResult && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[85vh]">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
                            <div className="flex items-start gap-3">
                                <div className={`p-2.5 rounded-full shrink-0 ${batchCheckResult.incomplete.length === 0 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                    <FolderDown className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-serif font-bold text-slate-800">Batch Download — Compliance Check</h3>
                                    <p className="text-sm text-slate-500 mt-0.5">
                                        {batchCheckResult.compliant} of {batchCheckResult.total} faculty fully compliant
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setBatchCheckResult(null)} className="text-slate-400 hover:text-slate-700">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 p-6">
                            {batchCheckResult.incomplete.length === 0 ? (
                                <div className="text-center py-6">
                                    <div className="bg-green-100 text-green-700 rounded-full p-4 w-fit mx-auto mb-4">
                                        <CheckCircle2 className="h-8 w-8" />
                                    </div>
                                    <h4 className="font-semibold text-green-800 text-lg">All Faculty Are Compliant!</h4>
                                    <p className="text-sm text-slate-500 mt-1">All {batchCheckResult.total} faculty members have uploaded all required documents. Ready to download.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                        <p className="text-sm text-amber-800 font-medium">
                                            <AlertCircle className="h-4 w-4 inline mr-1.5 -mt-0.5" />
                                            {batchCheckResult.incomplete.length} faculty member{batchCheckResult.incomplete.length > 1 ? 's have' : ' has'} missing documents. Only fully compliant faculty will be included in the download.
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        {batchCheckResult.incomplete.map((item, idx) => (
                                            <div key={idx} className="border border-slate-200 rounded-lg p-3">
                                                <p className="font-semibold text-slate-800 text-sm">{item.name}</p>
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {item.missing.map((doc, i) => (
                                                        <span key={i} className="inline-flex items-center text-xs bg-red-50 text-red-700 border border-red-200 rounded-full px-2.5 py-0.5">
                                                            <FileMinus className="h-3 w-3 mr-1" />{doc}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 pt-3 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                            <Button variant="outline" onClick={() => setBatchCheckResult(null)}>Close</Button>
                            {batchCheckResult.compliant > 0 && (
                                <Button
                                    asChild
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    <a href={route('admin.faculty.batch_download')}>
                                        <Download className="h-4 w-4 mr-2" />
                                        Download {batchCheckResult.compliant} Compliant ({batchCheckResult.compliant === batchCheckResult.total ? 'All' : `of ${batchCheckResult.total}`})
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}

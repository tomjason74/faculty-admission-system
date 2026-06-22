import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { CheckCircle, Clock, UploadCloud, Download, FileArchive, Check, AlertCircle, Trash2, X, Edit3, UserCheck } from 'lucide-react';
import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function Dashboard({ profile, documents, classRecords }) {
    const collections = [
        { key: 'medical_certificates', label: 'Medical Certificates' },
        { key: 'clearances', label: 'Clearances' },
        { key: 'ids', label: 'Identification Documents (IDs)' },
        { key: 'nbi_clearance', label: 'NBI Clearance' },
        { key: 'government_ids', label: 'TIN / SSS / PhilHealth / Pag-IBIG' },
        { key: 'employment_certificate', label: 'Certificate of Employment / Service Record' },
    ];

    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({
        is_enrolled_graduate: profile?.is_enrolled_graduate ?? false,
        grad_school_name: profile?.grad_school_name ?? '',
        grad_program: profile?.grad_program ?? '',
        is_new_hire: profile?.is_new_hire ?? false,
        teaching_load_status: profile?.teaching_load_status ?? '',
        eval_2324_sem1: profile?.semester_evaluations?.['2023-2024_sem1'] ?? '',
        eval_2324_sem2: profile?.semester_evaluations?.['2023-2024_sem2'] ?? '',
        eval_2425_sem1: profile?.semester_evaluations?.['2024-2025_sem1'] ?? '',
        eval_2425_sem2: profile?.semester_evaluations?.['2024-2025_sem2'] ?? '',
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleSaveRenewal = (e) => {
        e.preventDefault();
        setIsSaving(true);
        router.post(route('faculty.update_renewal'), {
            is_enrolled_graduate: editForm.is_enrolled_graduate,
            grad_school_name: editForm.grad_school_name,
            grad_program: editForm.grad_program,
            is_new_hire: editForm.is_new_hire,
            teaching_load_status: editForm.teaching_load_status,
            semester_evaluations: {
                '2023-2024_sem1': editForm.eval_2324_sem1,
                '2023-2024_sem2': editForm.eval_2324_sem2,
                '2024-2025_sem1': editForm.eval_2425_sem1,
                '2024-2025_sem2': editForm.eval_2425_sem2,
            }
        }, {
            onSuccess: () => {
                setIsSaving(false);
                setShowEditModal(false);
            },
            onError: () => setIsSaving(false),
            preserveScroll: true
        });
    };

    const docForm = useForm({
        collection: collections[0].key,
        file: null,
    });

    const classRecordForm = useForm({
        semester: '',
        course_code: '',
        file: null,
    });

    const submitDoc = (e) => {
        e.preventDefault();
        docForm.post(route('faculty.documents.store'), {
            onSuccess: () => docForm.reset('file'),
            forceFormData: true,
        });
    };

    const submitClassRecord = (e) => {
        e.preventDefault();
        classRecordForm.post(route('faculty.class_records.store'), {
            onSuccess: () => classRecordForm.reset('semester', 'course_code', 'file'),
            forceFormData: true,
        });
    };

    const handleDeleteDocument = (id) => {
        if (confirm('Are you sure you want to delete this document? You will need to upload a replacement if it is required.')) {
            router.delete(route('documents.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Faculty Dashboard" />

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Welcome & Stats Row */}
                <div className="mb-8">
                    <h1 className="font-serif text-3xl font-bold text-slate-800">Faculty Dashboard</h1>
                    <p className="text-slate-500 mt-1">Manage your compliance documents and class records.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-t-4 border-t-maroon-800 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500 font-sans">Compliance Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-bold text-slate-800">
                                    {profile.is_compliant ? 'Compliant' : 'Pending'}
                                </h3>
                                <div className={`p-3 rounded-lg ${profile.is_compliant ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-gold-500'}`}>
                                    {profile.is_compliant ? <CheckCircle className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div 
                                        className={`h-2 rounded-full ${profile.is_compliant ? 'bg-green-500' : 'bg-gold-500'}`} 
                                        style={{ width: `${profile.compliance_percentage}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs font-semibold text-slate-600">{profile.compliance_percentage}%</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-t-4 border-t-gold-500 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500 font-sans">Class Records</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-bold text-slate-800">{classRecords.length}</h3>
                                <div className="p-3 rounded-lg bg-maroon-50 text-maroon-800">
                                    <FileArchive className="h-6 w-6" />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-4">Total records uploaded</p>
                        </CardContent>
                    </Card>

                    <Card className="border-t-4 border-t-maroon-800 shadow-sm flex flex-col justify-between">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500 font-sans">Graduate & Renewal Info</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-between">
                            <div className="space-y-2">
                                <div className="text-sm text-slate-700">
                                    <span className="font-semibold">Graduate Studies: </span>
                                    {profile.is_enrolled_graduate ? (
                                        <span className="text-green-700 font-medium">Enrolled ({profile.grad_program || 'N/A'} at {profile.grad_school_name || 'N/A'})</span>
                                    ) : (
                                        <span className="text-slate-500 italic">Not Enrolled</span>
                                    )}
                                </div>
                                <div className="text-sm text-slate-700">
                                    <span className="font-semibold">Hiring Type: </span>
                                    <span>{profile.is_new_hire ? 'New Hire' : 'Renewal'}</span>
                                </div>
                                {profile.teaching_load_status && (
                                    <div className="text-sm text-slate-700">
                                        <span className="font-semibold">Status Note: </span>
                                        <span>{profile.teaching_load_status}</span>
                                    </div>
                                )}
                            </div>
                            <Button 
                                onClick={() => setShowEditModal(true)} 
                                variant="outline" 
                                className="mt-4 w-full border-maroon-800 text-maroon-800 hover:bg-maroon-50"
                            >
                                <Edit3 className="h-4 w-4 mr-2" /> Update Details
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Upload Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Compliance Upload */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="font-serif">Upload Compliance Document</CardTitle>
                            <CardDescription>Select the requirement type and upload your file.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitDoc} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Document Type</label>
                                    <select
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={docForm.data.collection}
                                        onChange={(e) => docForm.setData('collection', e.target.value)}
                                    >
                                        {collections.map(c => (
                                            <option key={c.key} value={c.key}>{c.label}</option>
                                        ))}
                                    </select>
                                    {docForm.errors.collection && <p className="text-sm text-red-500 font-medium">{docForm.errors.collection}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">File</label>
                                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 bg-slate-50 hover:bg-slate-100 transition-colors relative">
                                        <div className="flex flex-col items-center justify-center space-y-2 py-4">
                                            <UploadCloud className="h-8 w-8 text-slate-400" />
                                            <p className="text-sm font-medium text-slate-600">Click to select or drag and drop</p>
                                        </div>
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => docForm.setData('file', e.target.files[0])}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Supported formats: PDF, JPG, PNG (Max 10MB)</p>
                                    {docForm.data.file && <p className="text-sm text-green-600 font-medium flex items-center mt-2"><Check className="h-4 w-4 mr-1"/> {docForm.data.file.name}</p>}
                                    {docForm.errors.file && <p className="text-sm text-red-500 font-medium mt-2">{docForm.errors.file}</p>}
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={docForm.processing || !docForm.data.file}
                                    className="w-full bg-maroon-800 hover:bg-maroon-900 text-white"
                                >
                                    Upload Document
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Class Record Upload */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="font-serif">Upload Class Record</CardTitle>
                            <CardDescription>Submit end-of-term grading sheets and records.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitClassRecord} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Semester</label>
                                        <Input
                                            type="text"
                                            placeholder="e.g. Fall 2026"
                                            value={classRecordForm.data.semester}
                                            onChange={(e) => classRecordForm.setData('semester', e.target.value)}
                                        />
                                        {classRecordForm.errors.semester && <p className="text-sm text-red-500 font-medium">{classRecordForm.errors.semester}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Course Code</label>
                                        <Input
                                            type="text"
                                            placeholder="e.g. CS101"
                                            value={classRecordForm.data.course_code}
                                            onChange={(e) => classRecordForm.setData('course_code', e.target.value)}
                                        />
                                        {classRecordForm.errors.course_code && <p className="text-sm text-red-500 font-medium">{classRecordForm.errors.course_code}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">File</label>
                                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 bg-slate-50 hover:bg-slate-100 transition-colors relative">
                                        <div className="flex flex-col items-center justify-center space-y-2 py-4">
                                            <UploadCloud className="h-8 w-8 text-slate-400" />
                                            <p className="text-sm font-medium text-slate-600">Click to select or drag and drop</p>
                                        </div>
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => classRecordForm.setData('file', e.target.files[0])}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Supported formats: PDF, Excel, Word, Image (Max 10MB)</p>
                                    {classRecordForm.data.file && <p className="text-sm text-green-600 font-medium flex items-center mt-2"><Check className="h-4 w-4 mr-1"/> {classRecordForm.data.file.name}</p>}
                                    {classRecordForm.errors.file && <p className="text-sm text-red-500 font-medium mt-2">{classRecordForm.errors.file}</p>}
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={classRecordForm.processing || !classRecordForm.data.file || !classRecordForm.data.semester || !classRecordForm.data.course_code}
                                    className="w-full bg-maroon-800 hover:bg-maroon-900 text-white"
                                >
                                    Upload Class Record
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Lists Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Compliance Checklist */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="font-serif">Compliance Checklist</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {collections.map(c => (
                                <div key={c.key} className="flex flex-col">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium text-slate-800">{c.label}</h4>
                                        {documents[c.key]?.length > 0 ? (
                                            <span className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full"><CheckCircle className="h-3 w-3 mr-1"/> Completed</span>
                                        ) : (
                                            <span className="flex items-center text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full"><AlertCircle className="h-3 w-3 mr-1"/> Missing</span>
                                        )}
                                    </div>
                                    {documents[c.key]?.length > 0 ? (
                                        <div className="bg-slate-50 rounded-lg border border-slate-100 p-3">
                                            {documents[c.key]?.map(doc => (
                                                <div key={doc.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 last:pb-0">
                                                    <span className="text-sm text-slate-600 truncate mr-4">{doc.file_name}</span>
                                                    <div className="flex gap-2">
                                                        <Button variant="ghost" size="sm" asChild className="h-8 text-maroon-800 hover:text-maroon-900 hover:bg-maroon-50">
                                                            <a href={route('documents.download', doc.id)}><Download className="h-4 w-4 mr-2"/> Download</a>
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => handleDeleteDocument(doc.id)} className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-slate-500 italic p-3 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                            No documents uploaded.
                                        </div>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Class Records List */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="font-serif">Submitted Records</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {classRecords.length === 0 ? (
                                <div className="text-sm text-slate-500 italic p-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                    No class records have been uploaded yet.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {classRecords.map(record => (
                                        <div key={record.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-100 bg-white hover:border-gold-500 transition-colors">
                                            <div>
                                                <h4 className="font-bold text-slate-800">{record.course_code}</h4>
                                                <p className="text-sm text-slate-500">{record.semester} • {record.file_name}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" asChild className="border-slate-200 text-slate-600 hover:text-maroon-800 hover:border-maroon-800">
                                                    <a href={route('documents.download', record.id)}><Download className="h-4 w-4"/></a>
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => handleDeleteDocument(record.id)} className="border-red-200 text-red-600 hover:text-red-700 hover:border-red-600 hover:bg-red-50">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

            </div>
            </div>

            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
                            <div>
                                <h3 className="text-lg font-serif font-bold text-slate-800">Update Renewal & Graduate Studies Info</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Keep your graduate enrollment status and semester evaluation details updated.</p>
                            </div>
                            <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-700">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveRenewal} className="overflow-y-auto flex-1 p-6 space-y-5">
                            <div className="grid grid-cols-1 gap-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                                    <div className="flex items-center space-x-2 mt-2">
                                        <input
                                            type="checkbox"
                                            id="edit_is_enrolled_graduate"
                                            checked={editForm.is_enrolled_graduate}
                                            onChange={e => setEditForm(prev => ({ ...prev, is_enrolled_graduate: e.target.checked }))}
                                            className="rounded border-slate-300 text-maroon-800 focus:ring-maroon-800"
                                        />
                                        <label htmlFor="edit_is_enrolled_graduate" className="text-sm font-semibold text-slate-700">Enrolled in Graduate Studies</label>
                                    </div>

                                    <div className="flex items-center space-x-2 mt-2">
                                        <input
                                            type="checkbox"
                                            id="edit_is_new_hire"
                                            checked={editForm.is_new_hire}
                                            onChange={e => setEditForm(prev => ({ ...prev, is_new_hire: e.target.checked }))}
                                            className="rounded border-slate-300 text-maroon-800 focus:ring-maroon-800"
                                        />
                                        <label htmlFor="edit_is_new_hire" className="text-sm font-semibold text-slate-700">Newly Hired Faculty</label>
                                    </div>
                                </div>

                                {editForm.is_enrolled_graduate && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Graduate School Name</label>
                                            <Input
                                                type="text"
                                                placeholder="e.g. PUP Graduate School"
                                                value={editForm.grad_school_name}
                                                onChange={e => setEditForm(prev => ({ ...prev, grad_school_name: e.target.value }))}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Graduate Program</label>
                                            <Input
                                                type="text"
                                                placeholder="e.g. DBA"
                                                value={editForm.grad_program}
                                                onChange={e => setEditForm(prev => ({ ...prev, grad_program: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Teaching Load / Status Note</label>
                                    <Input
                                        type="text"
                                        placeholder="e.g. No teaching load / Newly hired"
                                        value={editForm.teaching_load_status}
                                        onChange={e => setEditForm(prev => ({ ...prev, teaching_load_status: e.target.value }))}
                                    />
                                </div>

                                </div>
                        </form>
                        <div className="p-6 pt-0 flex justify-end gap-3 shrink-0">
                            <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
                            <Button
                                onClick={handleSaveRenewal}
                                disabled={isSaving}
                                className="bg-maroon-800 hover:bg-maroon-900 text-white"
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

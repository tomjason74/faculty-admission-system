import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { UploadCloud, Check, ChevronRight, BookOpen, User, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import Modal from '@/Components/Modal';

export default function Apply({ departments }) {
    const [cvFileName, setCvFileName] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        // Personal Information
        name: '',
        email: '',
        phone: '',
        address: '',
        // Academic Information
        degree: '',
        specialization: '',
        department_id: '',
        employment_type: '',
        // Application
        cover_message: '',
        cv_file: null,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('cv_file', file);
            setCvFileName(file.name);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('apply.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setCvFileName(null);
                setShowSuccessModal(true);
            },
        });
    };

    const handleCloseModal = () => {
        setShowSuccessModal(false);
        router.visit('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans">
            <Head title="Apply as Faculty | PUP Portal" />

            {/* Top Bar */}
            <header className="bg-maroon-900 text-white">
                <div className="max-w-5xl mx-auto px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
                        <img src="/images/pup-logo.png" alt="PUP Logo" className="h-10 w-auto" />
                        <div className="leading-tight">
                            <span className="hidden sm:block font-serif font-bold text-base tracking-wide text-white">Polytechnic University</span>
                            <span className="hidden sm:block text-xs text-gold-400 font-medium tracking-widest uppercase">of the Philippines</span>
                            <span className="block sm:hidden font-serif font-bold text-base tracking-wide text-white">PUP Portal</span>
                        </div>
                    </Link>
                    <Link href={route('login')} className="text-xs sm:text-sm text-white/80 hover:text-white flex items-center gap-1 transition-colors shrink-0">
                        <span className="hidden sm:inline">Already applied? </span>Sign in <ArrowRight className="h-4 w-4 shrink-0" />
                    </Link>
                </div>
            </header>

            {/* Hero Banner */}
            <div className="bg-maroon-800 text-white py-10 px-6">
                <div className="max-w-5xl mx-auto">
                    <p className="text-gold-400 text-xs font-semibold uppercase tracking-widest mb-2">Faculty Recruitment</p>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold">Faculty Application Form</h1>
                    <p className="mt-3 text-white/70 text-base max-w-2xl">
                        Join the Polytechnic University of the Philippines academic community. Complete the form below to submit your application for review.
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">


                <form onSubmit={submit} encType="multipart/form-data">
                    <div className="space-y-8">

                        {/* Section 1: Personal Information */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
                                <div className="bg-maroon-100 text-maroon-800 rounded-lg p-2">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-slate-800">Personal Information</h2>
                                    <p className="text-xs text-slate-500">Your contact and identification details</p>
                                </div>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                                    <input
                                        id="name"
                                        type="text"
                                        required
                                        placeholder="e.g. Dr. Juan Dela Cruz"
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 focus:border-maroon-800 transition"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        placeholder="e.g. juan.delacruz@gmail.com"
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 focus:border-maroon-800 transition"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                    />
                                    {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1.5">Contact Number <span className="text-red-500">*</span></label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        required
                                        placeholder="e.g. 09123456789"
                                        maxLength={11}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 focus:border-maroon-800 transition"
                                        value={data.phone}
                                        onChange={e => {
                                            const numericValue = e.target.value.replace(/\D/g, '').slice(0, 11);
                                            setData('phone', numericValue);
                                        }}
                                    />
                                    {errors.phone && <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="address" className="block text-sm font-semibold text-slate-700 mb-1.5">Home Address</label>
                                    <input
                                        id="address"
                                        type="text"
                                        placeholder="e.g. 123 Mabini St., Manila, Metro Manila"
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 focus:border-maroon-800 transition"
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                    />
                                    {errors.address && <p className="mt-1.5 text-xs text-red-600">{errors.address}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Academic & Position Information */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
                                <div className="bg-maroon-100 text-maroon-800 rounded-lg p-2">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-slate-800">Academic & Position Details</h2>
                                    <p className="text-xs text-slate-500">Your qualifications and preferred position</p>
                                </div>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="degree" className="block text-sm font-semibold text-slate-700 mb-1.5">Highest Educational Attainment <span className="text-red-500">*</span></label>
                                    <input
                                        id="degree"
                                        type="text"
                                        required
                                        placeholder="e.g. Ph.D. in Computer Science"
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 focus:border-maroon-800 transition"
                                        value={data.degree}
                                        onChange={e => setData('degree', e.target.value)}
                                    />
                                    {errors.degree && <p className="mt-1.5 text-xs text-red-600">{errors.degree}</p>}
                                </div>

                                <div>
                                    <label htmlFor="specialization" className="block text-sm font-semibold text-slate-700 mb-1.5">Specialization / Field of Expertise <span className="text-red-500">*</span></label>
                                    <input
                                        id="specialization"
                                        type="text"
                                        required
                                        placeholder="e.g. Machine Learning, Networks"
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 focus:border-maroon-800 transition"
                                        value={data.specialization}
                                        onChange={e => setData('specialization', e.target.value)}
                                    />
                                    {errors.specialization && <p className="mt-1.5 text-xs text-red-600">{errors.specialization}</p>}
                                </div>

                                <div>
                                    <label htmlFor="department_id" className="block text-sm font-semibold text-slate-700 mb-1.5">Preferred Department <span className="text-red-500">*</span></label>
                                    <select
                                        id="department_id"
                                        required
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 focus:border-maroon-800 transition bg-white"
                                        value={data.department_id}
                                        onChange={e => setData('department_id', e.target.value)}
                                    >
                                        <option value="">Select a department...</option>
                                        {departments.map((dept) => (
                                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                                        ))}
                                    </select>
                                    {errors.department_id && <p className="mt-1.5 text-xs text-red-600">{errors.department_id}</p>}
                                </div>

                                <div>
                                    <label htmlFor="employment_type" className="block text-sm font-semibold text-slate-700 mb-1.5">Employment Type Preference <span className="text-red-500">*</span></label>
                                    <select
                                        id="employment_type"
                                        required
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 focus:border-maroon-800 transition bg-white"
                                        value={data.employment_type}
                                        onChange={e => setData('employment_type', e.target.value)}
                                    >
                                        <option value="">Select employment type...</option>
                                        <option value="full-time">Full-Time</option>
                                        <option value="part-time">Part-Time</option>
                                        <option value="contract">Contract / Semester-Based</option>
                                    </select>
                                    {errors.employment_type && <p className="mt-1.5 text-xs text-red-600">{errors.employment_type}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Application Documents */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
                                <div className="bg-maroon-100 text-maroon-800 rounded-lg p-2">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-slate-800">Application Documents</h2>
                                    <p className="text-xs text-slate-500">Upload your CV/Resume and add a cover message</p>
                                </div>
                            </div>
                            <div className="p-6 space-y-6">

                                {/* CV Upload */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">CV / Resume <span className="text-red-500">*</span></label>
                                    <div className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer group ${cvFileName ? 'border-green-400 bg-green-50' : 'border-slate-300 bg-slate-50 hover:border-maroon-400 hover:bg-maroon-50/30'}`}>
                                        <div className="flex flex-col items-center justify-center">
                                            {cvFileName ? (
                                                <>
                                                    <div className="bg-green-100 text-green-700 rounded-full p-3 mb-3">
                                                        <Check className="h-6 w-6" />
                                                    </div>
                                                    <p className="text-sm font-semibold text-green-700">{cvFileName}</p>
                                                    <p className="text-xs text-green-600 mt-1">File selected. Click to change.</p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="bg-slate-200 text-slate-500 group-hover:bg-maroon-100 group-hover:text-maroon-700 rounded-full p-3 mb-3 transition-colors">
                                                        <UploadCloud className="h-6 w-6" />
                                                    </div>
                                                    <p className="text-sm font-semibold text-slate-700">Click to upload or drag and drop</p>
                                                    <p className="text-xs text-slate-500 mt-1">PDF, DOC, DOCX — Max 10MB</p>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            id="cv_file"
                                            name="cv_file"
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    {errors.cv_file && <p className="mt-1.5 text-xs text-red-600">{errors.cv_file}</p>}
                                </div>

                                {/* Cover Message */}
                                <div>
                                    <label htmlFor="cover_message" className="block text-sm font-semibold text-slate-700 mb-1.5">Cover Message / Statement of Purpose</label>
                                    <textarea
                                        id="cover_message"
                                        rows={5}
                                        placeholder="Briefly describe your teaching philosophy, relevant experience, and why you want to join PUP..."
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 focus:border-maroon-800 transition resize-none"
                                        value={data.cover_message}
                                        onChange={e => setData('cover_message', e.target.value)}
                                    />
                                    {errors.cover_message && <p className="mt-1.5 text-xs text-red-600">{errors.cover_message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <div>
                                <p className="text-sm font-semibold text-slate-700">Ready to apply?</p>
                                <p className="text-xs text-slate-500 mt-0.5">Your application will be reviewed by the admin team. You will be notified via email.</p>
                            </div>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto bg-maroon-800 hover:bg-maroon-900 text-white font-semibold px-8 py-2.5 rounded-lg transition-colors shrink-0"
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                        </svg>
                                        Submitting...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Submit Application <ChevronRight className="h-4 w-4" />
                                    </span>
                                )}
                            </Button>
                        </div>

                    </div>
                </form>
            </div>

            {/* Footer */}
            <footer className="text-center text-xs text-slate-400 pb-10">
                <p>Polytechnic University of the Philippines &copy; {new Date().getFullYear()}. All Rights Reserved.</p>
                <p className="mt-2 text-xs opacity-50">Developed by: Tom Jason D. Umali</p>
            </footer>

            <Modal show={showSuccessModal} onClose={handleCloseModal} maxWidth="md">
                <div className="p-6">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                        <Check className="h-6 w-6 text-green-600" aria-hidden="true" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold leading-6 text-slate-900 mb-2">Application Submitted!</h3>
                        <p className="text-sm text-slate-500 mb-6">
                            Thank you for applying. Our team will review your application and contact you via the email address you provided.
                        </p>
                        <Button
                            type="button"
                            onClick={handleCloseModal}
                            className="w-full bg-maroon-800 hover:bg-maroon-900 text-white font-semibold py-2.5 rounded-lg transition-colors"
                        >
                            Return to Home
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

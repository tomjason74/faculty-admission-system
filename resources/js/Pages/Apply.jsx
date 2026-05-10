import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function Apply({ departments }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: '',
        email: '',
        degree: '',
        specialization: '',
        department_id: '',
        cv_file: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('apply.store'));
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col items-center pt-12 pb-24 sm:px-6 lg:px-8">
            <Head title="Faculty Application Portal" />
            
            <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 text-center">
                <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
                    Faculty Application Portal
                </h2>
                <p className="mt-2 text-sm text-zinc-600">
                    Join our academic community. Submit your application below.
                </p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-xl">
                <div className="bg-white py-8 px-4 shadow-xl shadow-zinc-200/50 sm:rounded-2xl sm:px-10 border border-zinc-100">
                    
                    {recentlySuccessful && (
                        <div className="mb-6 p-4 rounded-lg bg-green-50 text-green-800 text-sm border border-green-200 font-medium">
                            Application submitted successfully! We will review your profile and contact you soon.
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">
                        
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-zinc-700">Full Name</label>
                            <div className="mt-1">
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm transition-colors"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                />
                            </div>
                            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-zinc-700">Email Address</label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm transition-colors"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                />
                            </div>
                            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="degree" className="block text-sm font-medium text-zinc-700">Highest Degree</label>
                                <div className="mt-1">
                                    <input
                                        id="degree"
                                        type="text"
                                        required
                                        placeholder="e.g. Ph.D. in Computer Science"
                                        className="appearance-none block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm transition-colors"
                                        value={data.degree}
                                        onChange={e => setData('degree', e.target.value)}
                                    />
                                </div>
                                {errors.degree && <p className="mt-2 text-sm text-red-600">{errors.degree}</p>}
                            </div>

                            <div>
                                <label htmlFor="specialization" className="block text-sm font-medium text-zinc-700">Specialization</label>
                                <div className="mt-1">
                                    <input
                                        id="specialization"
                                        type="text"
                                        required
                                        placeholder="e.g. Artificial Intelligence"
                                        className="appearance-none block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm transition-colors"
                                        value={data.specialization}
                                        onChange={e => setData('specialization', e.target.value)}
                                    />
                                </div>
                                {errors.specialization && <p className="mt-2 text-sm text-red-600">{errors.specialization}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="department_id" className="block text-sm font-medium text-zinc-700">Department</label>
                            <div className="mt-1">
                                <select
                                    id="department_id"
                                    required
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-zinc-300 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm rounded-md transition-colors"
                                    value={data.department_id}
                                    onChange={e => setData('department_id', e.target.value)}
                                >
                                    <option value="">Select a department...</option>
                                    {departments.map((dept) => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>
                            {errors.department_id && <p className="mt-2 text-sm text-red-600">{errors.department_id}</p>}
                        </div>

                        <div>
                            <label htmlFor="cv_file" className="block text-sm font-medium text-zinc-700">CV / Resume (PDF, DOCX)</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-zinc-300 border-dashed rounded-md hover:border-zinc-400 transition-colors bg-zinc-50">
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-zinc-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="flex text-sm text-zinc-600 justify-center">
                                        <label htmlFor="cv_file" className="relative cursor-pointer bg-transparent rounded-md font-medium text-zinc-900 hover:text-zinc-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-zinc-500">
                                            <span>Upload a file</span>
                                            <input 
                                                id="cv_file" 
                                                name="cv_file" 
                                                type="file" 
                                                className="sr-only" 
                                                accept=".pdf,.doc,.docx"
                                                onChange={e => setData('cv_file', e.target.files[0])}
                                            />
                                        </label>
                                    </div>
                                    <p className="text-xs text-zinc-500">
                                        {data.cv_file ? data.cv_file.name : "PDF, DOC, DOCX up to 10MB"}
                                    </p>
                                </div>
                            </div>
                            {errors.cv_file && <p className="mt-2 text-sm text-red-600">{errors.cv_file}</p>}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Submitting Application...' : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

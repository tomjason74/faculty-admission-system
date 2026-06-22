import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { Printer, ArrowLeft, Settings2, Save } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';

export default function RenewalReport({ faculty, departments, signatories = [] }) {
    // Default semesters list (used to populate dropdown)
    const defaultSemesters = [
        'Second Semester of Academic Year 2025-2026',
        'First Semester of Academic Year 2025-2026',
        'Second Semester of Academic Year 2024-2025',
        'First Semester of Academic Year 2024-2025',
        'Second Semester of Academic Year 2023-2024',
        'First Semester of Academic Year 2023-2024'
    ];

    // Combine default semesters with saved signatories from database
    const savedSemCodes = signatories.map(s => s.semester_code);
    const dropdownOptions = Array.from(new Set([...defaultSemesters, ...savedSemCodes]));

    // Semester states
    const [semesterYear, setSemesterYear] = useState('Second Semester of Academic Year 2025-2026');
    const [selectedSemOption, setSelectedSemOption] = useState('Second Semester of Academic Year 2025-2026');
    const [isCustomSemester, setIsCustomSemester] = useState(false);

    // Letter metadata states
    const [date, setDate] = useState('January 14, 2026');
    const [recipientName, setRecipientName] = useState('DR. MANUEL M. MUHI');
    const [recipientTitle, setRecipientTitle] = useState('President');
    const [throughName, setThroughName] = useState('DR. EMANUEL C. DE GUZMAN');
    const [throughTitle, setThroughTitle] = useState('Vice President for Academic Affairs');
    const [salutation, setSalutation] = useState('Dear President Muhi:');
    
    const [senderName, setSenderName] = useState('ASSOC. PROF. MARIANNE C. ORTIZ');
    const [senderTitle, setSenderTitle] = useState('IODE Director');
    const [recommenderName, setRecommenderName] = useState('DR. RUDOLF ANTHONY A. LACERNA');
    const [recommenderTitle, setRecommenderTitle] = useState('OUS Executive Director');

    // Selected semesters to display in evaluation columns
    const [evalSemesters, setEvalSemesters] = useState([
        { id: '2023-2024_sem1', label: '1st Sem. 2023-2024' },
        { id: '2023-2024_sem2', label: '2nd Sem. 2023-2024' },
        { id: '2024-2025_sem1', label: '1st Sem. 2024-2025' }
    ]);

    // Track if we are currently loading configurations
    const loadSemesterSettings = (semesterCode) => {
        if (!semesterCode) return;
        const found = signatories.find(s => s.semester_code === semesterCode);
        if (found) {
            setDate(found.date || '');
            setRecipientName(found.president_name || '');
            setRecipientTitle(found.president_title || 'President');
            setThroughName(found.vpaa_name || '');
            setThroughTitle(found.vpaa_title || 'Vice President for Academic Affairs');
            setSenderName(found.sender_name || 'ASSOC. PROF. MARIANNE C. ORTIZ');
            setSenderTitle(found.sender_title || 'IODE Director');
            setRecommenderName(found.recommender_name || 'DR. RUDOLF ANTHONY A. LACERNA');
            setRecommenderTitle(found.recommender_title || 'OUS Executive Director');
            
            if (found.eval_semesters && Array.isArray(found.eval_semesters)) {
                setEvalSemesters(found.eval_semesters);
            }
        } else {
            // Find most recently saved signatory to use as a fallback template (retaining names if same)
            const mostRecent = signatories.length > 0 ? signatories[signatories.length - 1] : null;
            if (mostRecent) {
                setRecipientName(mostRecent.president_name || '');
                setRecipientTitle(mostRecent.president_title || 'President');
                setThroughName(mostRecent.vpaa_name || '');
                setThroughTitle(mostRecent.vpaa_title || 'Vice President for Academic Affairs');
                setSenderName(mostRecent.sender_name || 'ASSOC. PROF. MARIANNE C. ORTIZ');
                setSenderTitle(mostRecent.sender_title || 'IODE Director');
                setRecommenderName(mostRecent.recommender_name || 'DR. RUDOLF ANTHONY A. LACERNA');
                setRecommenderTitle(mostRecent.recommender_title || 'OUS Executive Director');
            } else {
                setRecipientName('DR. MANUEL M. MUHI');
                setRecipientTitle('President');
                setThroughName('DR. EMANUEL C. DE GUZMAN');
                setThroughTitle('Vice President for Academic Affairs');
                setSenderName('ASSOC. PROF. MARIANNE C. ORTIZ');
                setSenderTitle('IODE Director');
                setRecommenderName('DR. RUDOLF ANTHONY A. LACERNA');
                setRecommenderTitle('OUS Executive Director');
            }
        }
    };

    // Load configurations whenever printing semester changes
    useEffect(() => {
        loadSemesterSettings(semesterYear);
    }, [semesterYear]);

    // Sync salutation to recipient name dynamically if user changes it
    useEffect(() => {
        if (recipientName) {
            const parts = recipientName.trim().split(' ');
            const lastName = parts[parts.length - 1];
            // Strip any colons or titles
            const cleanLastName = lastName.replace(':', '');
            setSalutation(`Dear President ${cleanLastName}:`);
        } else {
            setSalutation('Dear President:');
        }
    }, [recipientName]);

    const handleSemesterDropdownChange = (val) => {
        setSelectedSemOption(val);
        if (val === 'custom') {
            setIsCustomSemester(true);
            setSemesterYear('');
        } else {
            setIsCustomSemester(false);
            setSemesterYear(val);
        }
    };

    // Handle editing evaluation column headers
    const handleEvalHeaderChange = (index, label) => {
        setEvalSemesters(prev => {
            const newSems = [...prev];
            newSems[index] = { ...newSems[index], label };
            return newSems;
        });
    };

    // Handle editing evaluation database lookup keys
    const handleEvalKeyChange = (index, id) => {
        setEvalSemesters(prev => {
            const newSems = [...prev];
            newSems[index] = { ...newSems[index], id };
            return newSems;
        });
    };

    // Save configuration settings
    const handleSaveSettings = () => {
        if (!semesterYear.trim()) {
            alert('Please specify a valid Semester name before saving.');
            return;
        }

        router.post(route('admin.reports.renewal.signatories'), {
            semester_code: semesterYear,
            date: date,
            president_name: recipientName,
            president_title: recipientTitle,
            vpaa_name: throughName,
            vpaa_title: throughTitle,
            sender_name: senderName,
            sender_title: senderTitle,
            recommender_name: recommenderName,
            recommender_title: recommenderTitle,
            eval_semesters: evalSemesters
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                alert(`Signatory settings saved successfully for: "${semesterYear}"`);
            }
        });
    };

    // Group faculty members by department/program
    const facultyByDept = departments.reduce((acc, dept) => {
        const deptFaculty = faculty.filter(f => f.department_id === dept.id);
        if (deptFaculty.length > 0) {
            acc[dept.name] = deptFaculty;
        }
        return acc;
    }, {});

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800 font-sans print:bg-white print:text-black">
            <Head title="Preview Renewal Report" />

            {/* ── Control Panel (Hidden in Print) ── */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm print:hidden">
                <div className="max-w-5xl mx-auto flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => router.get(route('admin.dashboard'))}
                                className="text-slate-600 hover:text-slate-900"
                            >
                                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Dashboard
                            </Button>
                            <h2 className="text-xl font-serif font-bold text-slate-800">Renewal Report Generator</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button onClick={handleSaveSettings} className="bg-emerald-700 hover:bg-emerald-800 text-white shrink-0 shadow-sm">
                                <Save className="h-4 w-4 mr-2" /> Save Signatories
                            </Button>
                            <Button onClick={handlePrint} className="bg-[#7A1A2E] hover:bg-[#5C1322] text-white shrink-0 shadow-sm">
                                <Printer className="h-4 w-4 mr-2" /> Print / Save as PDF
                            </Button>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-4 rounded-lg border">
                        {/* Column 1: Semester & Recipient */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                <Settings2 className="h-3.5 w-3.5" /> Semester & Recipient
                            </h3>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Select Printing Semester</label>
                                <select 
                                    value={selectedSemOption} 
                                    onChange={e => handleSemesterDropdownChange(e.target.value)}
                                    className="w-full text-sm rounded-md border-slate-300 shadow-sm focus:border-maroon-500 focus:ring-maroon-500 font-sans p-2 bg-white border border-slate-300"
                                >
                                    {dropdownOptions.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                    <option value="custom">-- Custom / Type New Semester --</option>
                                </select>
                            </div>
                            {isCustomSemester && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Custom Semester Code</label>
                                    <Input 
                                        type="text" 
                                        value={semesterYear} 
                                        onChange={e => setSemesterYear(e.target.value)} 
                                        placeholder="e.g. First Semester of Academic Year 2026-2027" 
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Date</label>
                                <Input type="text" value={date} onChange={e => setDate(e.target.value)} size="sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">President Name</label>
                                <Input type="text" value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="e.g. DR. MANUEL M. MUHI" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Through Name (VPAA)</label>
                                <Input type="text" value={throughName} onChange={e => setThroughName(e.target.value)} placeholder="e.g. DR. EMANUEL C. DE GUZMAN" />
                            </div>
                        </div>

                        {/* Column 2: Signatures & Salutations */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                <Settings2 className="h-3.5 w-3.5" /> Signatures & Salutations
                            </h3>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Target Semester Text (in letter body)</label>
                                <Input type="text" value={semesterYear} onChange={e => setSemesterYear(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Salutation</label>
                                <Input type="text" value={salutation} onChange={e => setSalutation(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Sender Name (IODE)</label>
                                <Input type="text" value={senderName} onChange={e => setSenderName(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Recommending Approval Name</label>
                                <Input type="text" value={recommenderName} onChange={e => setRecommenderName(e.target.value)} />
                            </div>
                        </div>

                        {/* Column 3: Evaluation Table Columns Mapping */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                <Settings2 className="h-3.5 w-3.5" /> Evaluation Columns Map
                            </h3>
                            {evalSemesters.map((sem, i) => (
                                <div key={i} className="space-y-1 p-2 bg-white rounded border border-slate-200">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase font-sans">Column {i+1}</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <span className="text-[9px] text-slate-400 font-semibold uppercase font-sans">DB Key:</span>
                                            <Input 
                                                type="text" 
                                                value={sem.id} 
                                                placeholder="e.g. 2023-2024_sem1"
                                                onChange={e => handleEvalKeyChange(i, e.target.value)} 
                                                className="h-7 text-xs px-2"
                                            />
                                        </div>
                                        <div>
                                            <span className="text-[9px] text-slate-400 font-semibold uppercase font-sans">Label:</span>
                                            <Input 
                                                type="text" 
                                                value={sem.label} 
                                                placeholder="e.g. 1st Sem. 2023-2024"
                                                onChange={e => handleEvalHeaderChange(i, e.target.value)} 
                                                className="h-7 text-xs px-2"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Document Page (Styled like A4 Letter) ── */}
            <div className="max-w-5xl mx-auto my-8 p-12 bg-white shadow-md border border-slate-200 print:my-0 print:p-0 print:shadow-none print:border-none font-serif text-[11pt] leading-normal">
                
                {/* Official University Letterhead */}
                <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-6 font-serif">
                    <img src="/images/image1.png" alt="PUP Logo" className="h-20 w-20 object-contain" />
                    <div className="text-center flex-1 mx-4">
                        <p className="text-[8.5pt] uppercase tracking-wide leading-tight">Republic of the Philippines</p>
                        <p className="text-[12pt] font-bold uppercase leading-tight text-[#7A1A2E]">Polytechnic University of the Philippines</p>
                        <p className="text-[8.5pt] uppercase leading-tight font-medium">Office of the Vice President for Academic Affairs</p>
                        <p className="text-[9.5pt] font-bold uppercase leading-tight">Open University System</p>
                        <p className="text-[8.5pt] italic font-medium leading-tight">Institute of Open and Distance Education</p>
                    </div>
                    <img src="/images/image2.png" alt="OUS Logo" className="h-20 w-20 object-contain" />
                </div>

                {/* Letter Header */}
                <div className="mb-8 space-y-4">
                    <p className="text-slate-800 print:text-black">{date}</p>
                    
                    <div className="space-y-0.5">
                        <p className="font-bold uppercase">{recipientName}</p>
                        <p>{recipientTitle}</p>
                        <p>This University</p>
                    </div>

                    <div className="pl-8 space-y-0.5">
                        <p><span className="font-semibold">Through:</span> <span className="font-bold uppercase">{throughName}</span></p>
                        <p className="pl-16">{throughTitle}</p>
                    </div>

                    <p className="pt-2">{salutation}</p>

                    <p className="text-justify indent-8">
                        May we respectfully request for the renewal of appointment of the following OUS special lecturers and part-time course specialists for {semesterYear}:
                    </p>
                </div>

                {/* Faculty Group Tables */}
                <div className="space-y-8">
                    {Object.keys(facultyByDept).length === 0 ? (
                        <div className="text-center p-8 border border-dashed text-slate-400 font-sans">
                            No approved faculty records are available to generate this report. Seed the database or onboard faculty first.
                        </div>
                    ) : (
                        Object.entries(facultyByDept).map(([deptName, members]) => (
                            <div key={deptName} className="space-y-3 break-inside-avoid">
                                <h3 className="font-bold text-center underline uppercase text-[12pt]">{deptName}</h3>
                                
                                <table className="w-full border-collapse border border-black text-left text-[9pt] table-fixed">
                                    <thead>
                                        <tr className="border-b border-black">
                                            <th className="border border-black px-2 py-1.5 font-bold text-center w-[22%] whitespace-normal break-words" rowSpan={2}>Name</th>
                                            <th className="border border-black px-1 py-1 font-bold text-center w-[18%] whitespace-normal break-words" colSpan={2}>Enrolled in Master's/Doctoral</th>
                                            <th className="border border-black px-2 py-1.5 font-bold text-center w-[17%] whitespace-normal break-words" rowSpan={2}>Name of School</th>
                                            <th className="border border-black px-2 py-1.5 font-bold text-center w-[15%] whitespace-normal break-words" rowSpan={2}>Program</th>
                                            <th className="border border-black px-2 py-1 font-bold text-center w-[28%] whitespace-normal break-words" colSpan={3}>Evaluation Rating</th>
                                        </tr>
                                        <tr className="border-b border-black">
                                            <th className="border border-black px-1 py-1 text-xs font-bold text-center w-[9%] whitespace-normal break-words">Yes</th>
                                            <th className="border border-black px-1 py-1 text-xs font-bold text-center w-[9%] whitespace-normal break-words">No</th>
                                            {evalSemesters.map(sem => (
                                                <th key={sem.id} className="border border-black px-1 py-1 text-center font-bold text-[8.5pt] leading-tight w-[9.3%] whitespace-normal break-words">{sem.label}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {members.map((facultyMember) => {
                                            const hasGraduated = !facultyMember.is_enrolled_graduate && facultyMember.grad_program && facultyMember.grad_program.toLowerCase().includes('graduate');
                                            
                                            return (
                                                <tr key={facultyMember.id} className="border-b border-black">
                                                    {/* Name */}
                                                    <td className="border border-black px-2 py-1 font-semibold uppercase whitespace-normal break-words">
                                                        {facultyMember.name}
                                                    </td>
                                                    {/* Enrolled: Yes */}
                                                    <td className="border border-black px-1 py-1 text-center font-semibold text-[9.5pt] whitespace-normal break-words">
                                                        {facultyMember.is_enrolled_graduate ? '✔' : ''}
                                                    </td>
                                                    {/* Enrolled: No / Graduated status */}
                                                    <td className="border border-black px-1 py-1 text-center font-semibold text-[9.5pt] whitespace-normal break-words">
                                                        {!facultyMember.is_enrolled_graduate ? (hasGraduated ? 'Grad' : '✔') : ''}
                                                    </td>
                                                    {/* Name of School */}
                                                    <td className="border border-black px-2 py-1 text-center whitespace-normal break-words">
                                                        {facultyMember.grad_school_name || ''}
                                                    </td>
                                                    {/* Program */}
                                                    <td className="border border-black px-2 py-1 text-center font-medium whitespace-normal break-words">
                                                        {facultyMember.grad_program || ''}
                                                    </td>
                                                    {/* Evaluations */}
                                                    {evalSemesters.map(sem => {
                                                        const rating = facultyMember.semester_evaluations?.[sem.id] || facultyMember.teaching_load_status || '';
                                                        return (
                                                            <td key={sem.id} className="border border-black px-1 py-1 text-center text-[8pt] leading-tight whitespace-normal break-words">
                                                                {rating}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ))
                    )}
                </div>

                {/* Letter Footer / Signatures */}
                <div className="mt-12 space-y-8 break-inside-avoid">
                    <p>Your approval to this request will be greatly appreciated.</p>
                    <p>Thank you.</p>

                    <div className="grid grid-cols-2 gap-12 pt-4 font-serif">
                        <div className="space-y-12">
                            <div>
                                <p>Very truly yours,</p>
                            </div>
                            <div className="space-y-0.5">
                                <p className="font-bold uppercase underline">{senderName}</p>
                                <p>{senderTitle}</p>
                            </div>
                        </div>

                        <div className="space-y-12">
                            <div>
                                <p>Recommending Approval:</p>
                            </div>
                            <div className="space-y-0.5">
                                <p className="font-bold uppercase underline">{recommenderName}</p>
                                <p>{recommenderTitle}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Print Media Specific CSS Styling */}
            <style>{`
                @media print {
                    body {
                        background-color: white !important;
                        color: black !important;
                        margin: 0 !important;
                        padding: 1.5cm 1.5cm 1.5cm 2cm !important; /* Standard letter margining */
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .print\\:text-black {
                        color: black !important;
                    }
                    table {
                        page-break-inside: avoid;
                    }
                    tr {
                        page-break-inside: avoid;
                        page-break-after: auto;
                    }
                }
            `}</style>
        </div>
    );
}

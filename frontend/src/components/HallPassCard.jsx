import React from 'react';
import { Printer, ShieldCheck, QrCode, Calendar, MapPin, Clock, Award, User, Info } from 'lucide-react';

const HallPassCard = ({ student, exams }) => {
  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar (hidden when printing) */}
      <div className="no-print bg-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl border border-slate-800">
        <div>
          <h2 className="font-heading text-lg font-bold flex items-center gap-2 text-indigo-300">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            Digital Examination Hall Pass
          </h2>
          <p className="text-xs text-slate-400">
            Official verified admit card for {student?.name} ({student?.academicYear} • {student?.branch})
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2"
        >
          <Printer className="h-4 w-4" />
          <span>Print / Save Hall Pass (PDF)</span>
        </button>
      </div>

      {/* Printable Hall Pass Card Container */}
      <div
        id="printable-hall-pass"
        className="bg-white rounded-3xl shadow-2xl border-2 border-slate-900 p-6 sm:p-8 relative overflow-hidden transition-all"
      >
        {/* Background Watermark SVG badge */}
        <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none">
          <Award className="w-96 h-96 text-slate-900" />
        </div>

        {/* Institution Header */}
        <div className="border-b-2 border-slate-900 pb-5 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-heading font-extrabold text-2xl shadow-md border-2 border-indigo-400">
              UNI
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 uppercase">
                INSTITUTE OF TECHNOLOGY & SCIENCE
              </h1>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest">
                OFFICIAL SEMESTER EXAMINATION ADMIT CARD / HALL PASS
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-full uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Verified Ticket
            </span>
            <span className="text-[11px] text-slate-500 mt-1 font-mono">
              ISSUED: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Student Profile Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-6">
          
          {/* Avatar placeholder */}
          <div className="flex flex-col items-center justify-center bg-slate-200/80 rounded-xl p-3 border border-slate-300">
            <div className="w-20 h-20 bg-slate-300 rounded-full flex items-center justify-center text-slate-600 mb-2 border-2 border-white shadow-inner">
              <User className="w-10 h-10" />
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">PHOTO SEAL</span>
          </div>

          {/* Student metadata */}
          <div className="md:col-span-2 space-y-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Candidate Full Name</span>
              <span className="font-heading text-lg font-bold text-slate-900">{student?.name}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Roll / Reg Number</span>
                <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 inline-block">
                  {student?.rollNumber || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Academic Year</span>
                <span className="font-semibold text-slate-800">{student?.academicYear}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Department / Branch</span>
              <span className="font-semibold text-slate-800">{student?.branch}</span>
            </div>
          </div>

          {/* Verification QR Code Section */}
          <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-4">
            <div className="p-2 bg-white rounded-xl border border-slate-300 shadow-sm flex items-center justify-center">
              <QrCode className="w-20 h-20 text-slate-800" />
            </div>
            <span className="text-[10px] font-mono text-slate-500 mt-1 uppercase text-center">
              HASH: {student?.rollNumber || 'STU'}-PASS
            </span>
          </div>

        </div>

        {/* Registered Examination Schedule Table */}
        <div className="mb-6">
          <h3 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-indigo-600" />
            Authorized Examination Schedule & Seating Hall
          </h3>

          {exams && exams.length > 0 ? (
            <div className="overflow-x-auto border-2 border-slate-900 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Subject Name</th>
                    <th className="py-3 px-4">Exam Date</th>
                    <th className="py-3 px-4">Timing</th>
                    <th className="py-3 px-4">Assigned Hall / Room</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {exams.map((exam, idx) => (
                    <tr key={exam._id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                      <td className="py-3 px-4 font-mono font-bold text-indigo-700">{exam.subjectCode}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{exam.subjectName}</td>
                      <td className="py-3 px-4 text-slate-700 whitespace-nowrap">{formatDate(exam.examDate)}</td>
                      <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-mono text-xs bg-slate-100 px-2 py-1 rounded border border-slate-300">
                          <Clock className="h-3 w-3 text-slate-500" /> {exam.startTime} - {exam.endTime}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <MapPin className="h-3.5 w-3.5 text-emerald-600" /> {exam.roomNumber}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
              No exam schedules published yet for your department and academic year.
            </div>
          )}
        </div>

        {/* Examination Rules & Regulations */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-1.5">
          <div className="font-bold flex items-center gap-1.5 text-amber-950 uppercase tracking-wider text-[11px]">
            <Info className="h-4 w-4 text-amber-600" /> Candidate Examination Instructions:
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-amber-800">
            <li>Candidates must present this Hall Pass along with an official College Photo ID Card to enter the exam room.</li>
            <li>Reporting time is strictly 20 minutes prior to the commencement of the exam.</li>
            <li>Mobile phones, smartwatches, programmable calculators, and unauthorized paper materials are strictly prohibited.</li>
            <li>Ensure room/hall number matches the hall pass allocation before taking your seat.</li>
          </ul>
        </div>

        {/* Official Signature Footer */}
        <div className="mt-8 pt-4 border-t border-slate-300 flex justify-between items-end text-xs text-slate-500">
          <div>
            <span className="block font-mono text-[10px] text-slate-400">DOCUMENT REF: REF-EXAM-{new Date().getFullYear()}</span>
            <span>Computer-generated official admit card. No manual signature required.</span>
          </div>
          <div className="text-right">
            <div className="font-serif italic font-bold text-slate-800 text-sm mb-1">Controller of Examinations</div>
            <div className="border-t border-slate-400 w-36 ml-auto pt-0.5 text-[10px] uppercase tracking-wider font-semibold text-slate-600">
              OFFICIAL STAMP / SEAL
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default HallPassCard;

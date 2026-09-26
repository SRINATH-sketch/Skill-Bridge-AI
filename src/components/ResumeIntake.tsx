import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Sparkles, Check, ArrowRight, UserCheck, Briefcase, Plus, X, Search, PenLine } from 'lucide-react';
import { JobRole } from '../types';
import { SAMPLE_RESUMES, SampleResumeProfile } from '../data/rolesData';

interface ResumeIntakeProps {
  roles: JobRole[];
  selectedRoleId: string;
  setSelectedRoleId: (id: string) => void;
  onParseResume: (payload: { resumeText?: string; pdfBase64?: string; extraSkills: string[] }) => Promise<void>;
  onAddCustomRole?: (role: JobRole) => void;
  isLoading: boolean;
}

export const ResumeIntake: React.FC<ResumeIntakeProps> = ({
  roles,
  selectedRoleId,
  setSelectedRoleId,
  onParseResume,
  onAddCustomRole,
  isLoading,
}) => {
  const [inputMode, setInputMode] = useState<'sample' | 'upload' | 'text'>('sample');
  const [selectedSampleId, setSelectedSampleId] = useState<string>('sample_alex_backend');
  const [customText, setCustomText] = useState<string>('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string>('');
  const [extraSkillInput, setExtraSkillInput] = useState<string>('');
  const [extraSkills, setExtraSkills] = useState<string[]>(['Git', 'Linux Basics']);

  // Custom role state
  const [showCustomRoleInput, setShowCustomRoleInput] = useState<boolean>(false);
  const [customRoleTitle, setCustomRoleTitle] = useState<string>('');
  const customRoleInputRef = useRef<HTMLInputElement>(null);

  const currentRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  useEffect(() => {
    if (showCustomRoleInput && customRoleInputRef.current) {
      customRoleInputRef.current.focus();
    }
  }, [showCustomRoleInput]);

  const handleAddCustomRole = () => {
    const title = customRoleTitle.trim();
    if (!title) return;

    const id = 'custom_' + title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

    // Prevent duplicates
    if (roles.find((r) => r.id === id)) {
      setSelectedRoleId(id);
      setShowCustomRoleInput(false);
      setCustomRoleTitle('');
      return;
    }

    const newRole: JobRole = {
      id,
      title,
      category: 'Custom',
      experienceLevel: 'Entry Level',
      description: `Custom role: ${title}. Skills and interview topics will be dynamically evaluated by AI based on your resume.`,
      commonInterviewTopics: [
        'Core domain knowledge',
        'Problem solving & algorithms',
        'System design fundamentals',
        'Collaboration & communication',
        'Tools & workflow proficiency',
      ],
      requiredSkills: [],
    };

    if (onAddCustomRole) {
      onAddCustomRole(newRole);
    }
    setSelectedRoleId(id);
    setShowCustomRoleInput(false);
    setCustomRoleTitle('');
  };

  const handleSampleSelect = (sample: SampleResumeProfile) => {
    setSelectedSampleId(sample.id);
    setSelectedRoleId(sample.targetRoleId);
    setCustomText(sample.resumeText);
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file.');
        return;
      }
      setPdfFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPdfBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddExtraSkill = () => {
    const trimmed = extraSkillInput.trim();
    if (trimmed && !extraSkills.includes(trimmed)) {
      setExtraSkills([...extraSkills, trimmed]);
      setExtraSkillInput('');
    }
  };

  const handleRemoveExtraSkill = (skill: string) => {
    setExtraSkills(extraSkills.filter((s) => s !== skill));
  };

  const handleSubmit = async () => {
    if (inputMode === 'sample') {
      const sample = SAMPLE_RESUMES.find((s) => s.id === selectedSampleId) || SAMPLE_RESUMES[0];
      await onParseResume({
        resumeText: sample.resumeText,
        extraSkills,
      });
    } else if (inputMode === 'upload') {
      if (!pdfBase64) {
        alert('Please select a PDF file first.');
        return;
      }
      await onParseResume({
        pdfBase64,
        extraSkills,
      });
    } else {
      if (!customText.trim()) {
        alert('Please paste your resume text.');
        return;
      }
      await onParseResume({
        resumeText: customText,
        extraSkills,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Hero header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 1 of 5: Profile & Resume Intake</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Where Placement Goals Meet Verified Skills
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
          Target your dream role, discover exact technical gaps against industry benchmarks, and prove your readiness with verified code submissions.
        </p>
      </div>

      {/* Target Role Selector */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-slate-900 font-semibold">
          <Briefcase className="w-5 h-5 text-indigo-600" />
          <span>1. Select Target Job Role</span>
        </div>
        <p className="text-xs text-slate-500">
          The platform evaluates your resume against specific competency rubrics and interview weights for this role. Pick a predefined role or enter your own.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {roles.map((role) => {
            const isSelected = role.id === selectedRoleId;
            const isCustom = role.id.startsWith('custom_');
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => {
                  setSelectedRoleId(role.id);
                  setShowCustomRoleInput(false);
                }}
                className={`text-left p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                    {role.title}
                  </span>
                  <div className="flex items-center space-x-1">
                    {isCustom && (
                      <span className="text-[9px] font-bold bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-full">Custom</span>
                    )}
                    {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {role.description}
                </div>
                <div className="mt-2 flex items-center space-x-1">
                  <span className="text-[10px] font-semibold text-slate-500 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                    {isCustom && role.requiredSkills.length === 0
                      ? 'AI-Evaluated Skills'
                      : `${role.requiredSkills.length} Core Skills`}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Add Custom Role Card */}
          {!showCustomRoleInput ? (
            <button
              type="button"
              onClick={() => setShowCustomRoleInput(true)}
              className="text-left p-3.5 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group"
            >
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <PenLine className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">
                  Enter Any Job Role
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Don't see your target role? Type in any job title and AI will evaluate your skills accordingly.
              </p>
            </button>
          ) : (
            <div className="p-3.5 rounded-xl border-2 border-indigo-400 bg-indigo-50/50 ring-2 ring-indigo-500/20 space-y-2.5">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0">
                  <Search className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs font-bold text-indigo-900">Enter Your Job Title</span>
              </div>
              <input
                ref={customRoleInputRef}
                type="text"
                value={customRoleTitle}
                onChange={(e) => setCustomRoleTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomRole();
                  }
                  if (e.key === 'Escape') {
                    setShowCustomRoleInput(false);
                    setCustomRoleTitle('');
                  }
                }}
                placeholder="e.g. DevOps Engineer, Mobile Developer..."
                className="w-full bg-white border border-indigo-300 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleAddCustomRole}
                  disabled={!customRoleTitle.trim()}
                  className="flex-1 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Role</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomRoleInput(false);
                    setCustomRoleTitle('');
                  }}
                  className="py-1.5 px-3 bg-white text-slate-600 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Selected Role Key Competencies Preview */}
        {currentRole && (
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 text-xs text-slate-600">
            <span className="font-semibold text-slate-800">Common Interview Topics for {currentRole.title}: </span>
            <span>{currentRole.commonInterviewTopics.join(' • ')}</span>
          </div>
        )}
      </div>

      {/* Additional Current Skills */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-900 font-semibold">
            <UserCheck className="w-5 h-5 text-indigo-600" />
            <span>2. Current Skills & Tools (Self-Reported or Resume Additions)</span>
          </div>
          <span className="text-[11px] text-slate-400">Optional</span>
        </div>
        <p className="text-xs text-slate-500">
          Add any tools, languages, or libraries you know that might not be on your resume yet.
        </p>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={extraSkillInput}
            onChange={(e) => setExtraSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExtraSkill())}
            placeholder="e.g. Docker, Redis, Next.js, FastAPI..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
          <button
            type="button"
            onClick={handleAddExtraSkill}
            className="px-3 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {extraSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center space-x-1 bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-1 rounded-md text-xs font-medium"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveExtraSkill(skill)}
                className="text-indigo-400 hover:text-indigo-700 ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Resume Input Mode */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2 text-slate-900 font-semibold">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span>3. Resume Intake</span>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setInputMode('sample')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                inputMode === 'sample' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⚡ 1-Click Samples
            </button>
            <button
              type="button"
              onClick={() => setInputMode('upload')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                inputMode === 'upload' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📄 Upload PDF
            </button>
            <button
              type="button"
              onClick={() => setInputMode('text')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                inputMode === 'text' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ✍️ Paste Text
            </button>
          </div>
        </div>

        {/* 1-Click Sample Resumes */}
        {inputMode === 'sample' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              Select a pre-loaded candidate profile to instantly explore resume parsing, gap identification, and code verification:
            </p>
            <div className="space-y-2.5">
              {SAMPLE_RESUMES.map((sample) => {
                const isSelected = sample.id === selectedSampleId;
                return (
                  <div
                    key={sample.id}
                    onClick={() => handleSampleSelect(sample)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-xs text-slate-900">{sample.label}</div>
                      {isSelected && <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">Selected</span>}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">{sample.summary}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upload PDF */}
        {inputMode === 'upload' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-400 bg-slate-50/50 transition-all">
              <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <div className="text-xs font-semibold text-slate-700 mb-1">
                {pdfFile ? pdfFile.name : 'Upload your Resume (PDF format)'}
              </div>
              <p className="text-[11px] text-slate-500 mb-4">
                Multimodal AI extracts your skills, projects, and work history directly from document tokens.
              </p>
              <label className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 cursor-pointer shadow-xs">
                <span>Browse PDF File</span>
                <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
              </label>
            </div>
            {pdfFile && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-800">
                <span>Loaded: {pdfFile.name} ({(pdfFile.size / 1024).toFixed(1)} KB)</span>
                <Check className="w-4 h-4 text-emerald-600" />
              </div>
            )}
          </div>
        )}

        {/* Paste Text */}
        {inputMode === 'text' && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700">Paste Plain Text Resume:</label>
            <textarea
              rows={8}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Paste the text of your resume here, including education, technical skills, and project summaries..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={handleSubmit}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-100 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Parsing Resume & Benchmarking Skills with Gemini AI...</span>
              </>
            ) : (
              <>
                <span>Parse Resume & Run Skill Gap Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

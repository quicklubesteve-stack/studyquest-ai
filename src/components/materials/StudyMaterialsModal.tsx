"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Upload,
  BookOpen,
  Sparkles,
  HelpCircle,
  Calendar,
  CheckCircle2,
  Trash2,
  X,
  Search,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { FlashcardChallengeActivity } from "@/components/activities/FlashcardChallengeActivity";
import { Flashcard, Question } from "@/types";

interface MaterialItem {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  summary: string | null;
  createdAt: string;
}

interface MaterialDetail {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  summary: string;
  keyConcepts: Array<{ term: string; definition: string; citation: string }>;
  studyNotes: string;
  flashcards: Flashcard[];
  quizQuestions: Question[];
  studyPlan: string;
  extractedTextLength: number;
}

interface GroundedCitation {
  documentName: string;
  section: string;
  verbatimSnippet: string;
  confidence: "High" | "Medium" | "Low";
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  educationTier?: string;
  onEarnXP?: (amount: number) => void;
}

// Built-in sample documents for instant exploration and testing
const SAMPLE_DOCUMENTS = [
  {
    name: "Biology_Cellular_Respiration.txt",
    type: "txt",
    content: `Cellular Respiration and ATP Synthesis in Eukaryotes

Cellular respiration is the biochemical pathway through which eukaryotic cells convert glucose and oxygen into usable adenosine triphosphate (ATP), water, and carbon dioxide.

Glycolysis: The initial anaerobic stage occurring in the cytoplasm where one glucose molecule is cleaved into two pyruvate molecules, producing a net gain of 2 ATP and 2 NADH molecules.

The Krebs Cycle: Also known as the citric acid cycle, takes place within the mitochondrial matrix under aerobic conditions. Pyruvate is oxidized into Acetyl-CoA, generating carbon dioxide, 2 ATP, and high-energy electron carriers (6 NADH and 2 FADH2).

The Electron Transport Chain: Situated across the inner mitochondrial cristae membrane, this final stage utilizes oxidative phosphorylation. High-energy electrons donated by NADH and FADH2 drive proton pumps, establishing a chemiosmotic gradient that powers ATP synthase to generate approximately 30 to 32 ATP molecules.

Key Takeaway: Mitochondria serve as the cellular powerhouses, where oxygen functions as the terminal electron acceptor in the electron transport chain. Without oxygen, cells revert to fermentation with substantially lower ATP yield.`,
  },
  {
    name: "Computer_Science_Big_O_Analysis.txt",
    type: "txt",
    content: `Foundations of Computational Complexity and Big-O Notation

Big-O Notation is a mathematical metric used in computer science to classify algorithms according to how their run time or space requirements grow as the input size n approaches infinity.

Time Complexity: Describes the computational duration an algorithm requires to execute to completion based on input size.

Space Complexity: Measures the peak auxiliary memory allocation an algorithm demands during its lifecycle.

Constant Time O(1): Operations that execute in identical execution steps regardless of input magnitude, such as hash table key lookups or direct array index retrieval.

Logarithmic Time O(log n): Characteristic of divide-and-conquer methodologies such as binary search, where the search space is bisected in each iterative pass.

Linear Time O(n): Performance grows in direct, 1-to-1 proportion with input volume, demonstrated in single-pass array iterations.

Quadratic Time O(n^2): Exemplified by nested iterative structures, common in elementary sorting algorithms like bubble sort and insertion sort.`,
  },
];

export default function StudyMaterialsModal({
  isOpen,
  onClose,
  educationTier = "high_school",
  onEarnXP,
}: Props) {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"summary" | "notes" | "flashcards" | "quiz" | "plan" | "qa">("summary");

  // Grounded Q&A state
  const [qaQuery, setQaQuery] = useState("");
  const [qaAnswer, setQaAnswer] = useState<string | null>(null);
  const [qaCitation, setQaCitation] = useState<GroundedCitation | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

  // Quiz interactive state
  const [activeQuizQuestionIdx, setActiveQuizQuestionIdx] = useState(0);
  const [selectedQuizChoice, setSelectedQuizChoice] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    if (isOpen) {
      fetchMaterials();
    }
  }, [isOpen]);

  const fetchMaterials = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/materials");
      if (res.ok) {
        const data = await res.json();
        setMaterials(data.materials || []);
      }
    } catch (err) {
      console.error("Failed to load materials", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMaterial = async (id: string) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      setQaAnswer(null);
      setQaCitation(null);
      setActiveQuizQuestionIdx(0);
      setSelectedQuizChoice(null);
      setQuizSubmitted(false);

      const res = await fetch(`/api/materials/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedMaterial(data.material);
        setActiveTab("summary");
      } else {
        const err = await res.json();
        setErrorMessage(err.error || "Failed to load document.");
      }
    } catch {
      setErrorMessage("Could not load document details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMaterial = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this study document?")) return;

    try {
      const res = await fetch(`/api/materials/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMaterials((prev) => prev.filter((m) => m.id !== id));
        if (selectedMaterial?.id === id) {
          setSelectedMaterial(null);
        }
      }
    } catch {
      alert("Failed to delete document.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("educationTier", educationTier);

    await uploadFormData(formData);
  };

  const handleUploadSampleDoc = async (sample: (typeof SAMPLE_DOCUMENTS)[0]) => {
    const blob = new Blob([sample.content], { type: "text/plain" });
    const file = new File([blob], sample.name, { type: "text/plain" });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("educationTier", educationTier);

    await uploadFormData(formData);
  };

  const uploadFormData = async (formData: FormData) => {
    try {
      setIsUploading(true);
      setErrorMessage(null);

      const res = await fetch("/api/materials", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSelectedMaterial(data.material);
        setActiveTab("summary");
        await fetchMaterials();
        if (onEarnXP) onEarnXP(50); // Reward for uploading learning material
      } else {
        setErrorMessage(data.error || "Upload failed. Please check the file format.");
      }
    } catch {
      setErrorMessage("Network error during file processing.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAskDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial || !qaQuery.trim()) return;

    try {
      setIsAnswering(true);
      setQaAnswer(null);
      setQaCitation(null);

      const res = await fetch(`/api/materials/${selectedMaterial.id}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: qaQuery.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setQaAnswer(data.answer);
        setQaCitation(data.citation);
      } else {
        setQaAnswer("Could not locate a clear answer in this document for that question.");
      }
    } catch {
      setQaAnswer("Failed to connect to document grounding service.");
    } finally {
      setIsAnswering(false);
    }
  };

  const handleAnswerQuiz = (choiceIdx: number) => {
    if (quizSubmitted || !selectedMaterial) return;
    setSelectedQuizChoice(choiceIdx);
    setQuizSubmitted(true);

    const currentQ = selectedMaterial.quizQuestions[activeQuizQuestionIdx];
    if (choiceIdx === currentQ.correctAnswerIndex) {
      setQuizScore((prev) => prev + 1);
      if (onEarnXP) onEarnXP(currentQ.xpReward || 20);
    }
  };

  const handleNextQuizQuestion = () => {
    if (!selectedMaterial) return;
    if (activeQuizQuestionIdx + 1 < selectedMaterial.quizQuestions.length) {
      setActiveQuizQuestionIdx((prev) => prev + 1);
      setSelectedQuizChoice(null);
      setQuizSubmitted(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="materials-modal-title"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 id="materials-modal-title" className="text-xl font-black flex items-center gap-2">
                Study Material Studio & AI Synthesizer
                <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
                  PDF • DOCX • TXT • MD
                </span>
              </h2>
              <p className="text-xs text-white/90">
                Upload your notes to auto-generate flashcards, exam questions, study plans & grounded Socratic citations.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Study Material Studio"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition focus:ring-2 focus:ring-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body: Two column layout (Library Sidebar vs Active Workspace) */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Left Column: Documents Library & Upload */}
          <div className="w-full md:w-80 border-r border-slate-200 bg-slate-50/70 p-4 flex flex-col overflow-y-auto">
            {/* Upload Box */}
            <div className="bg-white border-2 border-dashed border-teal-300 rounded-2xl p-4 text-center hover:border-teal-500 transition shadow-sm mb-4">
              <Upload className="w-8 h-8 text-teal-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-800">Upload Notes or Handouts</p>
              <p className="text-[10px] text-slate-500 mb-3">PDF, DOCX, TXT, MD up to 10MB</p>
              <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow transition">
                <span>Browse File</span>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt,.md"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
              {isUploading && (
                <p className="text-xs text-teal-700 font-medium mt-2 animate-pulse">
                  Extracting text & analyzing...
                </p>
              )}
            </div>

            {/* Quick Demo Pre-sets */}
            <div className="mb-4">
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Quick Test Documents
              </p>
              <div className="space-y-1.5">
                {SAMPLE_DOCUMENTS.map((sample) => (
                  <button
                    key={sample.name}
                    onClick={() => handleUploadSampleDoc(sample)}
                    disabled={isUploading}
                    className="w-full text-left p-2 rounded-xl bg-white border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 transition text-xs font-medium text-slate-700 flex items-center justify-between"
                  >
                    <span className="truncate pr-1">{sample.name.replace(".txt", "")}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                      + Add
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Document List */}
            <div className="flex-1">
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                Your Documents ({materials.length})
              </p>
              {isLoading && materials.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Loading documents...</p>
              ) : materials.length === 0 ? (
                <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center">
                  <FileText className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                  <p className="text-xs text-slate-500">No documents uploaded yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {materials.map((m) => {
                    const isSelected = selectedMaterial?.id === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => handleSelectMaterial(m.id)}
                        className={`p-3 rounded-2xl border cursor-pointer transition text-left flex items-start justify-between group ${
                          isSelected
                            ? "bg-teal-50 border-teal-500 shadow-sm"
                            : "bg-white border-slate-200 hover:border-teal-300"
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-bold text-slate-800 truncate">{m.fileName}</p>
                          <p className="text-[10px] text-slate-500">
                            {m.fileType.toUpperCase()} • {(m.fileSize / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleDeleteMaterial(m.id, e)}
                          title="Delete Document"
                          className="text-slate-400 hover:text-rose-600 transition p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Security Notice */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2 text-[10px] text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Strict user isolation: Documents are private to your account only.</span>
            </div>
          </div>

          {/* Right Column: Active Document Analysis & Interactive Tools */}
          <div className="flex-1 flex flex-col bg-white overflow-y-auto">
            {errorMessage && (
              <div className="m-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {!selectedMaterial ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-3xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                  <FileCheck className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-slate-800 mb-1">Select or Upload a Document</h3>
                <p className="text-xs text-slate-500 max-w-md">
                  Upload lecture slides, notes, or essays to instantly generate custom flashcards,
                  multiple-choice diagnostic exams, study guides, and grounded Q&A with verifiable citations.
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Document Sub-header & Navigation Tabs */}
                <div className="px-6 pt-4 pb-2 border-b border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                        <span>{selectedMaterial.fileName}</span>
                        <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-mono uppercase">
                          {selectedMaterial.fileType}
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {(selectedMaterial.extractedTextLength || 0).toLocaleString()} characters extracted •{" "}
                        {selectedMaterial.flashcards.length} Flashcards • {selectedMaterial.quizQuestions.length} Quiz Questions
                      </p>
                    </div>
                  </div>

                  {/* Feature Navigation Tabs */}
                  <div className="flex space-x-1 overflow-x-auto pb-1">
                    {[
                      { id: "summary", label: "Executive Summary", icon: Sparkles },
                      { id: "notes", label: "Study Notes", icon: BookOpen },
                      { id: "flashcards", label: `Flashcards (${selectedMaterial.flashcards.length})`, icon: Layers },
                      { id: "quiz", label: `Diagnostic Quiz (${selectedMaterial.quizQuestions.length})`, icon: HelpCircle },
                      { id: "plan", label: "5-Day Study Plan", icon: Calendar },
                      { id: "qa", label: "Ask Document (Citations)", icon: Search },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as typeof activeTab)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
                            isActive
                              ? "bg-teal-600 text-white shadow-sm"
                              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tab Content Display Area */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {/* TAB 1: SUMMARY & CONCEPTS */}
                  {activeTab === "summary" && (
                    <div className="space-y-6">
                      <div className="bg-teal-50/60 border border-teal-200 rounded-3xl p-5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 mb-2 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-teal-600" />
                          Document Overview & Analysis
                        </h4>
                        <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                          {selectedMaterial.summary}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2">
                          <span>Key Defined Concepts ({selectedMaterial.keyConcepts.length})</span>
                          <span className="text-[10px] text-slate-600 font-normal">Extracted with source citations</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {selectedMaterial.keyConcepts.map((concept, idx) => (
                            <div
                              key={idx}
                              className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-teal-300 transition"
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="font-bold text-xs text-slate-900">{concept.term}</span>
                                <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md font-mono">
                                  {concept.citation}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 leading-normal">{concept.definition}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: STUDY NOTES */}
                  {activeTab === "notes" && (
                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
                      <div className="prose prose-sm max-w-none text-slate-800 whitespace-pre-line leading-relaxed text-xs">
                        {selectedMaterial.studyNotes}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: GENERATED FLASHCARDS */}
                  {activeTab === "flashcards" && (
                    <div>
                      {selectedMaterial.flashcards.length === 0 ? (
                        <p className="text-xs text-slate-500">No flashcards could be extracted from this document.</p>
                      ) : (
                        <FlashcardChallengeActivity
                          cards={selectedMaterial.flashcards}
                          onComplete={() => {
                            if (onEarnXP) onEarnXP(40);
                          }}
                        />
                      )}
                    </div>
                  )}

                  {/* TAB 4: DIAGNOSTIC EXAM */}
                  {activeTab === "quiz" && (
                    <div className="max-w-2xl mx-auto space-y-4">
                      {selectedMaterial.quizQuestions.length === 0 ? (
                        <p className="text-xs text-slate-500">No quiz questions generated for this document.</p>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-slate-600">
                              Question {activeQuizQuestionIdx + 1} of {selectedMaterial.quizQuestions.length}
                            </span>
                            <span className="text-xs font-bold text-emerald-600">
                              Score: {quizScore}/{selectedMaterial.quizQuestions.length}
                            </span>
                          </div>

                          {/* Question Card */}
                          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                            <p className="text-sm font-bold text-slate-900">
                              {selectedMaterial.quizQuestions[activeQuizQuestionIdx].prompt}
                            </p>

                            <div className="space-y-2">
                              {selectedMaterial.quizQuestions[activeQuizQuestionIdx].choices.map((choice, cIdx) => {
                                const isSelected = selectedQuizChoice === cIdx;
                                const isCorrect =
                                  cIdx ===
                                  selectedMaterial.quizQuestions[activeQuizQuestionIdx].correctAnswerIndex;

                                let choiceStyle = "border-slate-200 hover:border-teal-400 bg-white text-slate-700";
                                if (quizSubmitted) {
                                  if (isCorrect) {
                                    choiceStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold";
                                  } else if (isSelected) {
                                    choiceStyle = "border-rose-500 bg-rose-50 text-rose-900 line-through";
                                  } else {
                                    choiceStyle = "border-slate-100 opacity-50";
                                  }
                                }

                                return (
                                  <button
                                    key={cIdx}
                                    onClick={() => handleAnswerQuiz(cIdx)}
                                    disabled={quizSubmitted}
                                    className={`w-full text-left p-3 rounded-2xl border text-xs transition flex items-center justify-between ${choiceStyle}`}
                                  >
                                    <span>{choice}</span>
                                    {quizSubmitted && isCorrect && (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {quizSubmitted && (
                              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                <p className="text-xs text-slate-600">
                                  {selectedMaterial.quizQuestions[activeQuizQuestionIdx].explanation}
                                </p>
                                {activeQuizQuestionIdx + 1 < selectedMaterial.quizQuestions.length && (
                                  <button
                                    onClick={handleNextQuizQuestion}
                                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5"
                                  >
                                    <span>Next</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 5: 5-DAY STUDY PLAN */}
                  {activeTab === "plan" && (
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                      <div className="prose prose-sm max-w-none text-slate-800 whitespace-pre-line leading-relaxed text-xs">
                        {selectedMaterial.studyPlan}
                      </div>
                    </div>
                  )}

                  {/* TAB 6: GROUNDED Q&A WITH VERIFIABLE CITATIONS */}
                  {activeTab === "qa" && (
                    <div className="space-y-4 max-w-2xl mx-auto">
                      <div className="bg-cyan-50/60 border border-cyan-200 rounded-2xl p-4">
                        <p className="text-xs text-cyan-900 font-medium">
                          Ask any question about <strong>{selectedMaterial.fileName}</strong>. Responses are strictly
                          grounded in the uploaded text with direct section citations and verbatim quotes.
                        </p>
                      </div>

                      <form onSubmit={handleAskDocument} className="flex gap-2">
                        <input
                          type="text"
                          value={qaQuery}
                          onChange={(e) => setQaQuery(e.target.value)}
                          placeholder="e.g. What is the role of the electron transport chain?"
                          className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <button
                          type="submit"
                          disabled={isAnswering || !qaQuery.trim()}
                          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold rounded-2xl shadow transition flex items-center gap-1.5"
                        >
                          <Search className="w-4 h-4" />
                          <span>{isAnswering ? "Searching..." : "Ask"}</span>
                        </button>
                      </form>

                      {qaAnswer && (
                        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                          <div>
                            <h5 className="text-xs font-bold uppercase tracking-wider text-teal-800 mb-1">
                              Grounded Explanation
                            </h5>
                            <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                              {qaAnswer}
                            </div>
                          </div>

                          {qaCitation && (
                            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                                <span className="flex items-center gap-1.5">
                                  <FileCheck className="w-4 h-4 text-teal-600" />
                                  Citation: {qaCitation.documentName} ({qaCitation.section})
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                                    qaCitation.confidence === "High"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  {qaCitation.confidence} Confidence
                                </span>
                              </div>
                              <blockquote className="text-[11px] text-slate-600 italic border-l-2 border-teal-500 pl-2">
                                &ldquo;{qaCitation.verbatimSnippet}&rdquo;
                              </blockquote>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

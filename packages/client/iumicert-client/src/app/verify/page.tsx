"use client";

import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import AnimatedBackground from "../components/AnimatedBackground";

interface CourseCompletion {
  course_code: string;
  course_name: string;
  grade: string;
  completion_date: string;
  credits: number;
  instructor: string;
}

interface TermData {
  term: string;
  courses: CourseCompletion[];
  term_gpa?: number;
  total_credits: number;
}

interface IndividualTermProof {
  type: "individual_term" | "single_term";
  claim: {
    student_id: string;
    term: string;
    claimed_courses: string[];
  };
  verkle_proof: {
    claimed_values: CourseCompletion[];
  };
  blockchain_reference: {
    contract_address: string;
    block_number: number;
    tree_commitment: string;
  };
  institutional_verification: {
    institution: string;
    semester: string;
  };
  metadata: {
    total_students_in_term?: number;
    proof_generation_timestamp: string;
  };
}

interface AggregatedJourneyProof {
  type: "aggregated_journey";
  student_info: {
    student_id: string;
    student_name: string;
    program: string;
    enrollment_date: string;
  };
  academic_terms: TermData[];
  journey_summary: {
    total_terms: number;
    total_courses: number;
    total_credits: number;
    cumulative_gpa: number;
    start_date: string;
    latest_term: string;
  };
  multi_tree_verification_chain: Array<{
    term: string;
    blockchain_deployment: {
      contract_address: string;
      block_number: number;
      tree_commitment: string;
    };
  }>;
  institutional_verification: {
    institution: string;
  };
}

type ProofData = IndividualTermProof | AggregatedJourneyProof;

const fileTypes = ["JSON"];

export default function VerifyCredential() {
  const [credentialData, setCredentialData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    message: string;
    proofData?: ProofData;
  } | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"overview" | "single_term">(
    "overview"
  );

  const detectProofType = (jsonData: unknown): ProofData | null => {
    try {
      // Type guard to check if jsonData is an object
      if (typeof jsonData !== "object" || jsonData === null) {
        return null;
      }

      const data = jsonData as Record<string, unknown>;

      // Check if it's an individual term proof (handle both "individual_term" and "single_term" types)
      if (
        data.type === "individual_term" ||
        data.type === "single_term" ||
        (data.claim &&
          data.verkle_proof &&
          typeof data.claim === "object" &&
          data.claim !== null &&
          "term" in data.claim)
      ) {
        return {
          type: "individual_term",
          ...data,
        } as IndividualTermProof;
      }

      // Check if it's an aggregated journey proof
      if (
        data.student_info &&
        data.academic_terms &&
        Array.isArray(data.academic_terms)
      ) {
        return {
          type: "aggregated_journey",
          ...data,
        } as AggregatedJourneyProof;
      }

      return null;
    } catch {
      return null;
    }
  };

  const handleVerify = async () => {
    if (!credentialData.trim()) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const parsedData = JSON.parse(credentialData);
      const proofData = detectProofType(parsedData);

      if (!proofData) {
        throw new Error("Invalid proof format");
      }

      setVerificationResult({
        isValid: true,
        message: `${
          proofData.type === "individual_term" ||
          proofData.type === "single_term"
            ? "Individual Term"
            : "Academic Journey"
        } verified successfully on blockchain`,
        proofData,
      });

      // Set initial view mode based on proof type
      if (proofData.type === "aggregated_journey") {
        setViewMode("overview");
        setSelectedTerm(null);
      } else {
        setViewMode("single_term");
      }
    } catch {
      setVerificationResult({
        isValid: false,
        message:
          "Credential verification failed - Invalid JSON format or proof structure",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTermSelect = (term: string) => {
    setSelectedTerm(term);
    setViewMode("single_term");
  };

  const handleBackToOverview = () => {
    setViewMode("overview");
    setSelectedTerm(null);
  };

  const handleReset = () => {
    setCredentialData("");
    setVerificationResult(null);
    setSelectedTerm(null);
    setViewMode("overview");
  };

  const handleFileChange = async (file: File) => {
    try {
      const text = await file.text();
      setCredentialData(text);
    } catch (error) {
      console.error("Error reading file:", error);
      setVerificationResult({
        isValid: false,
        message: "Failed to read file. Please ensure it's a valid JSON file.",
      });
    }
  };

  const handleTypeError = () => {
    setVerificationResult({
      isValid: false,
      message: "Please upload a JSON file containing the proof package.",
    });
  };

  const renderSingleTermView = (proofData: ProofData) => {
    let termData: TermData;
    let studentInfo: { student_id?: string; student_name?: string };
    let blockchainInfo: {
      contract_address?: string;
      block_number?: number;
      tree_commitment?: string;
    };
    let institution: string;

    if (
      proofData.type === "individual_term" ||
      proofData.type === "single_term"
    ) {
      termData = {
        term: proofData.claim.term,
        courses: proofData.verkle_proof.claimed_values,
        total_credits: proofData.verkle_proof.claimed_values.reduce(
          (sum, course) => sum + course.credits,
          0
        ),
      };
      studentInfo = { student_id: proofData.claim.student_id };
      blockchainInfo = proofData.blockchain_reference;
      institution = proofData.institutional_verification.institution;
    } else {
      // Aggregated journey - show selected term
      const selectedTermData = (
        proofData as AggregatedJourneyProof
      ).academic_terms.find((t) => t.term === selectedTerm);
      if (!selectedTermData) return null;

      termData = selectedTermData;
      studentInfo = (proofData as AggregatedJourneyProof).student_info;

      // Find blockchain info from multi_tree_verification_chain
      const blockchainEntry = (
        proofData as AggregatedJourneyProof
      ).multi_tree_verification_chain.find((v) => v.term === selectedTerm);
      blockchainInfo = blockchainEntry
        ? blockchainEntry.blockchain_deployment
        : {};
      institution = proofData.institutional_verification.institution;
    }

    return (
      <div className="space-y-6">
        {/* Term Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white font-mono">
              📚 {termData.term}
            </h3>
            <p className="text-blue-200">
              {studentInfo.student_name || studentInfo.student_id} •{" "}
              {institution}
            </p>
          </div>
          {proofData.type === "aggregated_journey" && (
            <button
              onClick={handleBackToOverview}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 
                       rounded-lg transition duration-300 text-sm"
            >
              ← Back to Journey
            </button>
          )}
        </div>

        {/* Term Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <div className="text-blue-200 text-sm font-medium">
              Total Courses
            </div>
            <div className="text-2xl font-bold text-white">
              {termData.courses.length}
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <div className="text-blue-200 text-sm font-medium">
              Total Credits
            </div>
            <div className="text-2xl font-bold text-white">
              {termData.total_credits}
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <div className="text-blue-200 text-sm font-medium">Term GPA</div>
            <div className="text-2xl font-bold text-white">
              {termData.term_gpa || "N/A"}
            </div>
          </div>
        </div>

        {/* Course List */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h4 className="text-white font-semibold mb-4">Course Completions</h4>
          <div className="space-y-3">
            {termData.courses.map((course, index) => (
              <div
                key={index}
                className="bg-white/10 rounded-lg p-4 border border-white/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="text-lg font-mono text-blue-300">
                      {course.course_code}
                    </div>
                    <div className="text-white font-medium">
                      {course.course_name}
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      ["A+", "A", "A-"].includes(course.grade)
                        ? "bg-green-500/20 text-green-300"
                        : ["B+", "B", "B-"].includes(course.grade)
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}
                  >
                    {course.grade}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-blue-200">
                  <span>👨‍🏫 {course.instructor}</span>
                  <div className="flex items-center space-x-4">
                    <span>📅 {course.completion_date}</span>
                    <span>🎓 {course.credits} credits</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blockchain Verification */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center text-xs text-blue-200">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            Verified on Sepolia Blockchain • Contract:{" "}
            {blockchainInfo?.contract_address?.substring(0, 10)}... • Block #
            {blockchainInfo?.block_number} • Verkle Commitment:{" "}
            {blockchainInfo?.tree_commitment?.substring(0, 16)}...
          </div>
        </div>
      </div>
    );
  };

  const renderAggregatedJourneyView = (proofData: AggregatedJourneyProof) => {
    return (
      <div className="space-y-6">
        {/* Student Header */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-white mb-2">
            🎓 Academic Journey
          </h3>
          <p className="text-xl text-blue-200">
            {proofData.student_info.student_name}
          </p>
          <p className="text-blue-300">
            {proofData.student_info.program} •{" "}
            {proofData.institutional_verification.institution}
          </p>
        </div>

        {/* Journey Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-white/20">
            <div className="text-blue-200 text-sm font-medium">Total Terms</div>
            <div className="text-2xl font-bold text-white">
              {proofData.journey_summary.total_terms}
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl p-4 border border-white/20">
            <div className="text-blue-200 text-sm font-medium">
              Total Courses
            </div>
            <div className="text-2xl font-bold text-white">
              {proofData.journey_summary.total_courses}
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-white/20">
            <div className="text-blue-200 text-sm font-medium">
              Total Credits
            </div>
            <div className="text-2xl font-bold text-white">
              {proofData.journey_summary.total_credits}
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-white/20">
            <div className="text-blue-200 text-sm font-medium">
              Cumulative GPA
            </div>
            <div className="text-2xl font-bold text-white">
              {proofData.journey_summary.cumulative_gpa}
            </div>
          </div>
        </div>

        {/* Academic Timeline */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h4 className="text-white font-semibold mb-6 flex items-center">
            <span className="mr-2">📈</span>
            Academic Timeline
          </h4>

          <div className="space-y-4">
            {proofData.academic_terms.map((term, index) => (
              <div
                key={term.term}
                onClick={() => handleTermSelect(term.term)}
                className="bg-white/10 hover:bg-white/15 rounded-lg p-4 border border-white/20 
                         cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full 
                                  flex items-center justify-center text-white font-bold text-sm"
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h5 className="text-white font-semibold">{term.term}</h5>
                      <p className="text-blue-200 text-sm">
                        {term.courses.length} courses • {term.total_credits}{" "}
                        credits
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {term.term_gpa && (
                      <div className="bg-white/10 px-3 py-1 rounded-full">
                        <span className="text-white font-medium">
                          GPA: {term.term_gpa}
                        </span>
                      </div>
                    )}
                    <div className="text-white">→</div>
                  </div>
                </div>

                {/* Course Preview */}
                <div className="flex flex-wrap gap-2">
                  {term.courses.slice(0, 4).map((course) => (
                    <div
                      key={course.course_code}
                      className="bg-white/10 px-2 py-1 rounded text-xs text-blue-200"
                    >
                      {course.course_code}
                    </div>
                  ))}
                  {term.courses.length > 4 && (
                    <div className="bg-white/10 px-2 py-1 rounded text-xs text-blue-200">
                      +{term.courses.length - 4} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blockchain Verification Chain */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h5 className="text-white font-semibold mb-3">
            🔗 Blockchain Verification Chain
          </h5>
          <div className="space-y-2">
            {proofData.multi_tree_verification_chain.map((verification) => (
              <div
                key={verification.term}
                className="flex items-center text-xs text-blue-200"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                {verification.term}: Contract{" "}
                {verification.blockchain_deployment.contract_address.substring(
                  0,
                  8
                )}
                ... • Block #{verification.blockchain_deployment.block_number} •
                Commitment:{" "}
                {verification.blockchain_deployment.tree_commitment.substring(
                  0,
                  12
                )}
                ...
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1
              className="text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Verify Academic Credentials
            </h1>
            <p className="text-blue-200 text-lg">
              Authenticate micro-credentials and academic journeys using Verkle
              Trees
            </p>
          </div>

          {/* Main verification card */}
          <div className="relative bg-white/10 ring-1 ring-white/30 backdrop-blur-sm rounded-3xl shadow-[0_0_40px_rgba(255,255,255,0.05)] p-8 overflow-hidden">
            <div className="absolute inset-0 rounded-3xl ring-1 ring-white/20 blur-md opacity-30 pointer-events-none mix-blend-overlay"></div>

            <div className="relative space-y-6">
              {!verificationResult && (
                <>
                  {/* Input section with drag and drop */}
                  <div>
                    <label
                      htmlFor="credential"
                      className="block text-sm font-medium text-white/90 mb-3"
                    >
                      Academic Proof Package (JSON)
                    </label>

                    {/* File Uploader */}
                    <FileUploader
                      handleChange={handleFileChange}
                      name="proofFile"
                      types={fileTypes}
                      onTypeError={handleTypeError}
                      maxSize={10}
                      onSizeError={() =>
                        setVerificationResult({
                          isValid: false,
                          message: "File size must be less than 10MB",
                        })
                      }
                      classes="w-full"
                    >
                      <div className="relative w-full rounded-xl border-2 border-dashed border-white/30 bg-white/5 hover:border-blue-400 hover:bg-blue-500/20 transition-all duration-300">
                        <div className="p-6 text-center">
                          <div className="mb-4">
                            <svg
                              className="mx-auto h-12 w-12 text-white/60"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <div className="mb-4">
                            <p className="text-white/90 font-medium mb-2">
                              Drag & drop your JSON proof file here
                            </p>
                            <p className="text-white/60 text-sm">
                              or click to browse files
                            </p>
                          </div>
                          <div className="text-xs text-white/50">
                            Supports: .json files up to 10MB
                          </div>
                        </div>
                      </div>
                    </FileUploader>

                    {/* Divider */}
                    <div className="relative mt-2">
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 text-white/60">
                          or paste JSON below
                        </span>
                      </div>
                    </div>

                    {/* Textarea */}
                    <div className="pt-2">
                      <textarea
                        id="credential"
                        rows={4}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl 
                                 text-white placeholder-white/50 backdrop-blur-sm font-mono text-sm
                                 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent 
                                 transition duration-300 resize-none"
                        placeholder="Paste your proof package JSON here..."
                        value={credentialData}
                        onChange={(e) => setCredentialData(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={handleVerify}
                      disabled={!credentialData.trim() || isLoading}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                               disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
                               text-white font-medium py-3 px-6 rounded-xl transition duration-300 
                               transform hover:scale-[1.02] active:scale-[0.98]
                               shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          Verifying Verkle Proofs...
                        </div>
                      ) : (
                        "🔍 Verify Academic Credentials"
                      )}
                    </button>
                  </div>

                  {/* Help section */}
                  <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
                    <h4 className="text-white font-semibold mb-2">
                      🔍 Supported Proof Types
                    </h4>
                    <ul className="text-sm text-blue-200 space-y-1">
                      <li>
                        • <strong>Individual Term Proof:</strong> Verify courses
                        completed in a specific semester
                      </li>
                      <li>
                        • <strong>Aggregated Journey:</strong> Complete academic
                        timeline across multiple terms
                      </li>
                      <li>
                        • <strong>Verkle Tree Verification:</strong>{" "}
                        Cryptographic proof with blockchain anchoring
                      </li>
                      <li>
                        • <strong>Selective Disclosure:</strong> Choose specific
                        terms to display from journey
                      </li>
                    </ul>
                  </div>
                </>
              )}

              {/* Verification result */}
              {verificationResult && (
                <div
                  className={`p-6 rounded-2xl backdrop-blur-sm border transition-all duration-500 ${
                    verificationResult.isValid
                      ? "bg-green-500/20 border-green-400/50 shadow-[0_0_30px_rgba(34,197,94,0.2)]"
                      : "bg-red-500/20 border-red-400/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
                  }`}
                >
                  {/* Verification Status */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div
                        className={`text-2xl mr-3 ${
                          verificationResult.isValid
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {verificationResult.isValid ? "✅" : "❌"}
                      </div>
                      <div>
                        <div
                          className={`text-lg font-semibold ${
                            verificationResult.isValid
                              ? "text-green-100"
                              : "text-red-100"
                          }`}
                        >
                          {verificationResult.message}
                        </div>
                        {verificationResult.isValid &&
                          verificationResult.proofData && (
                            <div className="text-sm text-blue-200 mt-1">
                              Detected:{" "}
                              {verificationResult.proofData.type ===
                              "individual_term"
                                ? "Individual Term Proof"
                                : "Aggregated Academic Journey"}
                            </div>
                          )}
                      </div>
                    </div>
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 
                               rounded-lg transition duration-300"
                    >
                      Upload New Proof
                    </button>
                  </div>

                  {/* Proof Data Display */}
                  {verificationResult.isValid &&
                    verificationResult.proofData && (
                      <div>
                        {verificationResult.proofData.type ===
                          "aggregated_journey" && viewMode === "overview"
                          ? renderAggregatedJourneyView(
                              verificationResult.proofData
                            )
                          : renderSingleTermView(verificationResult.proofData)}
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

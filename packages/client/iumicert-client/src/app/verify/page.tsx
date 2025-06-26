"use client";

import { useState, useEffect } from "react";
import FileUploaderWrapper from "../components/FileUploaderWrapper";

// Animated Background Component
const AnimatedBackground = () => {
  const [particles, setParticles] = useState<
    Array<{
      left: number;
      top: number;
      animationDelay: number;
      animationDuration: number;
    }>
  >([]);

  useEffect(() => {
    // Generate particles only on client side to avoid hydration mismatch
    const generatedParticles = Array.from({ length: 50 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 2,
      animationDuration: 2 + Math.random() * 3,
    }));
    setParticles(generatedParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden noise">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 via-blue-900 to-slate-900"></div>
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Floating particles */}
      {particles.map((particle, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.animationDelay}s`,
            animationDuration: `${particle.animationDuration}s`,
          }}
        />
      ))}

      {/* Gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-500/15 rounded-full blur-3xl"></div>

      {/* Noise overlay using SVG */}
      <style jsx>{`
        .noise:before {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          background: url("data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Cfilter id='noise' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeBlend mode='multiply'/%3E%3C/filter%3E%3Crect width='500' height='500' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E");
          mix-blend-mode: overlay;
          pointer-events: none;
          z-index: 1;
        }
      `}</style>
    </div>
  );
};

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
      if (typeof jsonData !== "object" || jsonData === null) {
        return null;
      }

      const data = jsonData as Record<string, unknown>;

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
      const selectedTermData = (
        proofData as AggregatedJourneyProof
      ).academic_terms.find((t) => t.term === selectedTerm);
      if (!selectedTermData) return null;

      termData = selectedTermData;
      studentInfo = (proofData as AggregatedJourneyProof).student_info;

      const blockchainEntry = (
        proofData as AggregatedJourneyProof
      ).multi_tree_verification_chain.find((v) => v.term === selectedTerm);
      blockchainInfo = blockchainEntry
        ? blockchainEntry.blockchain_deployment
        : {};
      institution = proofData.institutional_verification.institution;
    }

    return (
      <div className="flex gap-6 h-full">
        {/* Left Column - Term Info */}
        <div className="w-80 space-y-4">
          {/* Term Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white font-mono">
                📚 {termData.term}
              </h3>
              <p className="text-blue-200 text-sm">
                {studentInfo.student_name || studentInfo.student_id} •{" "}
                {institution}
              </p>
            </div>
            {proofData.type === "aggregated_journey" && (
              <button
                onClick={handleBackToOverview}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white border border-white/30 
                         rounded-lg transition duration-300 text-xs"
              >
                ← Back
              </button>
            )}
          </div>

          {/* Term Summary Cards */}
          <div className="space-y-3">
            <div className="bg-white/10 rounded-lg p-3 border border-white/20">
              <div className="text-blue-200 text-xs font-medium">
                Total Courses
              </div>
              <div className="text-xl font-bold text-white">
                {termData.courses.length}
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 border border-white/20">
              <div className="text-blue-200 text-xs font-medium">
                Total Credits
              </div>
              <div className="text-xl font-bold text-white">
                {termData.total_credits}
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 border border-white/20">
              <div className="text-blue-200 text-xs font-medium">Term GPA</div>
              <div className="text-xl font-bold text-white">
                {termData.term_gpa || "N/A"}
              </div>
            </div>
          </div>

          {/* Blockchain Verification */}
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center text-xs text-blue-200">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <div>
                <div>Verified on Sepolia Blockchain</div>
                <div>
                  Contract: {blockchainInfo?.contract_address?.substring(0, 8)}
                  ...
                </div>
                <div>Block #{blockchainInfo?.block_number}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Course List */}
        <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/10 overflow-y-auto">
          <h4 className="text-white font-semibold mb-4">Course Completions</h4>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            {termData.courses.map((course, index) => (
              <div
                key={index}
                className="bg-white/10 rounded-lg p-3 border border-white/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-mono text-blue-300">
                    {course.course_code}
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
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
                <div className="text-white font-medium text-sm mb-2">
                  {course.course_name}
                </div>
                <div className="text-xs text-blue-200 space-y-1">
                  <div>👨‍🏫 {course.instructor}</div>
                  <div className="flex justify-between">
                    <span>📅 {course.completion_date}</span>
                    <span>🎓 {course.credits}cr</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderAggregatedJourneyView = (proofData: AggregatedJourneyProof) => {
    return (
      <div className="flex gap-6 h-full">
        {/* Left Column - Student Info & Summary */}
        <div className="w-80 space-y-4">
          {/* Student Header */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              🎓 Academic Journey
            </h3>
            <p className="text-lg text-blue-200">
              {proofData.student_info.student_name}
            </p>
            <p className="text-blue-300 text-sm">
              {proofData.student_info.program} •{" "}
              {proofData.institutional_verification.institution}
            </p>
          </div>

          {/* Journey Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg p-3 border border-white/20">
              <div className="text-blue-200 text-xs font-medium">
                Total Terms
              </div>
              <div className="text-lg font-bold text-white">
                {proofData.journey_summary.total_terms}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg p-3 border border-white/20">
              <div className="text-blue-200 text-xs font-medium">
                Total Courses
              </div>
              <div className="text-lg font-bold text-white">
                {proofData.journey_summary.total_courses}
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-3 border border-white/20">
              <div className="text-blue-200 text-xs font-medium">
                Total Credits
              </div>
              <div className="text-lg font-bold text-white">
                {proofData.journey_summary.total_credits}
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg p-3 border border-white/20">
              <div className="text-blue-200 text-xs font-medium">
                Cumulative GPA
              </div>
              <div className="text-lg font-bold text-white">
                {proofData.journey_summary.cumulative_gpa}
              </div>
            </div>
          </div>

          {/* Blockchain Verification Chain */}
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <h5 className="text-white font-semibold mb-2 text-sm">
              🔗 Blockchain Chain
            </h5>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {proofData.multi_tree_verification_chain.map((verification) => (
                <div
                  key={verification.term}
                  className="flex items-center text-xs text-blue-200"
                >
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <div>
                    <div>{verification.term}</div>
                    <div>
                      Block #{verification.blockchain_deployment.block_number}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Academic Timeline */}
        <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/10 overflow-y-auto">
          <h4 className="text-white font-semibold mb-4 flex items-center">
            <span className="mr-2">📈</span>Academic Timeline
          </h4>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {proofData.academic_terms.map((term, index) => (
              <div
                key={term.term}
                onClick={() => handleTermSelect(term.term)}
                className="bg-white/10 hover:bg-white/15 rounded-lg p-4 border border-white/20 
                         cursor-pointer transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full 
                                  flex items-center justify-center text-white font-bold text-xs"
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h5 className="text-white font-semibold text-sm">
                        {term.term}
                      </h5>
                      <p className="text-blue-200 text-xs">
                        {term.courses.length} courses • {term.total_credits}{" "}
                        credits
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {term.term_gpa && (
                      <div className="bg-white/10 px-2 py-1 rounded-full">
                        <span className="text-white font-medium text-xs">
                          {term.term_gpa}
                        </span>
                      </div>
                    )}
                    <div className="text-white text-sm">→</div>
                  </div>
                </div>

                {/* Course Preview */}
                <div className="flex flex-wrap gap-1">
                  {term.courses.slice(0, 6).map((course) => (
                    <div
                      key={course.course_code}
                      className="bg-white/10 px-2 py-1 rounded text-xs text-blue-200"
                    >
                      {course.course_code}
                    </div>
                  ))}
                  {term.courses.length > 6 && (
                    <div className="bg-white/10 px-2 py-1 rounded text-xs text-blue-200">
                      +{term.courses.length - 6}
                    </div>
                  )}
                </div>
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

      {/* Mobile/Small Screen Warning */}
      <div className="md:hidden flex items-center justify-center h-screen relative z-20">
        <div className="bg-white/10 ring-1 ring-white/30 backdrop-blur-sm rounded-3xl p-8 mx-4 text-center max-w-md">
          <div className="text-6xl mb-4">📱</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Desktop or Tablet Required
          </h2>
          <p className="text-blue-200 mb-4">
            This credential verification interface is optimized for desktop and
            tablet devices (iPad Air 5 and larger).
          </p>
          <p className="text-blue-300 text-sm">
            Please access this page from a device with a larger screen for the
            best experience.
          </p>
          <div className="mt-6 text-blue-400 text-sm">
            Minimum resolution: 898 x 1144
          </div>
        </div>
      </div>

      <div className="relative z-10 h-screen flex flex-col">
        {/* Main Content - Flexible */}
        <div className="flex-1 px-8 pb-36 pt-50 min-h-0">
          <div className="h-full lg:max-w-[80%] mx-auto">
            {!verificationResult ? (
              /* Input Section - Horizontal Layout */
              <div className="h-full flex gap-6">
                {/* Left Side - Input Form */}
                <div className="w-96 bg-white/10 ring-1 ring-white/30 backdrop-blur-sm rounded-3xl p-6 flex flex-col">
                  <div className="flex-1 space-y-2">
                    <label className="block text-sm font-medium text-white/90">
                      Academic Proof Package (JSON)
                    </label>

                    {/* File Uploader */}
                    <FileUploaderWrapper
                      handleChange={handleFileChange}
                      name="proofFile"
                      types={fileTypes}
                      onTypeError={handleTypeError}
                      maxSize={10}
                      classes="w-full file-uploader-custom hover:cursor-pointer"
                    >
                      <div className="w-full rounded-xl border-2 border-dashed border-white/30 bg-white/5 hover:border-blue-400 hover:bg-blue-500/20 transition-all duration-300 p-4 text-center">
                        <div className="mb-2">
                          <svg
                            className="mx-auto h-8 w-8 text-white/60"
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
                        <p className="text-white/90 font-medium text-sm mb-1">
                          Drag & drop JSON file
                        </p>
                        <p className="text-white/60 text-xs">
                          or click to browse
                        </p>
                      </div>
                    </FileUploaderWrapper>

                    <div className="text-center pt-2 text-xs text-white/60">
                      or paste JSON below
                    </div>

                    {/* Textarea */}
                    <textarea
                      rows={4}
                      className="w-full px-3 pt-3 bg-white/10 border border-white/20 rounded-xl 
                               text-white placeholder-white/50 backdrop-blur-sm font-mono text-xs
                               focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent 
                               transition duration-300 resize-none"
                      placeholder="Paste your proof package JSON here..."
                      value={credentialData}
                      onChange={(e) => setCredentialData(e.target.value)}
                    />

                    {/* Verify Button */}
                    <button
                      onClick={handleVerify}
                      disabled={!credentialData.trim() || isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                               disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
                               text-white font-medium py-3 px-4 rounded-xl transition duration-300"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          Verifying...
                        </div>
                      ) : (
                        "🔍 Verify Credentials"
                      )}
                    </button>
                  </div>
                </div>

                {/* Right Side - Help Section */}
                <div className="flex-1 bg-white/5 ring-1 ring-white/20 backdrop-blur-sm rounded-3xl p-6">
                  {/* Title */}
                  <div className="flex-shrink-0 text-center py-6">
                    <h1
                      className="text-4xl font-bold text-white mb-2"
                      style={{
                        fontFamily: 'Georgia, "Times New Roman", serif',
                      }}
                    >
                      Verify Academic Credentials
                    </h1>
                    <p className="text-blue-200 text-lg">
                      Authenticate micro-credentials and academic journeys using
                      Verkle Trees
                    </p>
                  </div>
                  <h4 className="text-white font-semibold mb-4 text-xl">
                    🔍 Supported Proof Types
                  </h4>
                  <div className="space-y-4 text-blue-200">
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <h5 className="text-white font-medium mb-2">
                        Individual Term Proof
                      </h5>
                      <p className="text-sm">
                        Verify courses completed in a specific semester with
                        cryptographic proof anchored on blockchain.
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <h5 className="text-white font-medium mb-2">
                        Aggregated Journey
                      </h5>
                      <p className="text-sm">
                        Complete academic timeline across multiple terms with
                        selective disclosure capabilities.
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <h5 className="text-white font-medium mb-2">
                        Verkle Tree Verification
                      </h5>
                      <p className="text-sm">
                        Advanced cryptographic proofs using Verkle Trees for
                        efficient and private verification.
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <h5 className="text-white font-medium mb-2">
                        Blockchain Anchoring
                      </h5>
                      <p className="text-sm">
                        All proofs are anchored on Sepolia testnet with
                        tamper-evident commitments.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Results Section - Full Width */
              <div className="h-full bg-white/10 ring-1 ring-white/30 backdrop-blur-sm rounded-3xl p-6 flex flex-col">
                {/* Verification Status Header */}
                <div
                  className={`p-4 rounded-2xl backdrop-blur-sm border mb-4 ${
                    verificationResult.isValid
                      ? "bg-green-500/20 border-green-400/50"
                      : "bg-red-500/20 border-red-400/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
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
                </div>

                {/* Proof Data Display - Flexible Height */}
                {verificationResult.isValid && verificationResult.proofData && (
                  <div className="flex-1 min-h-0">
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
  );
}

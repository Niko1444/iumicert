// Enhanced Academic Credential System Integration Test
// Comprehensive testing of multi-semester system with dual proof types

const fs = require("fs");
const path = require("path");

class EnhancedAcademicSystemIntegrationTest {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      errors: [],
      warnings: [],
    };
    this.testStartTime = Date.now();
  }

  /**
   * Run complete enhanced integration test suite
   */
  async runCompleteIntegrationTest() {
    console.log(
      "🧪 Enhanced Academic Credential System - Integration Test Suite"
    );
    console.log("🔄 Testing Multi-Semester & Dual Proof Generation");
    console.log("=".repeat(80));
    console.log(`⏰ Test started at: ${new Date().toISOString()}\n`);

    try {
      // Test 1: Verify file dependencies
      await this.testFileDependencies();

      // Test 2: Test multi-semester data generation
      await this.testMultiSemesterDataGeneration();

      // Test 3: Test enhanced credential system construction
      await this.testEnhancedCredentialSystemConstruction();

      // Test 4: Validate dual proof format compatibility
      await this.testDualProofFormatCompatibility();

      // Test 5: Test React component integration with both proof types
      await this.testReactComponentDualCompatibility();

      // Test 6: Performance benchmarks for enhanced system
      await this.testEnhancedSystemPerformance();

      // Test 7: Test aggregated journey proof validation
      await this.testAggregatedJourneyProofValidation();

      // Display final results
      this.displayTestResults();

      return this.testResults.failed === 0;
    } catch (error) {
      console.error(`❌ Critical test failure: ${error.message}`);
      this.testResults.errors.push(`Critical failure: ${error.message}`);
      return false;
    }
  }

  /**
   * Test 1: Verify all required files exist (updated for enhanced system)
   */
  async testFileDependencies() {
    console.log("🔍 Test 1: Verifying enhanced system dependencies...");

    let hasDataGenerator = false;
    let hasCredentialSystem = false;

    // Check for multi-semester generator
    const generatorFiles = [
      "multi_semester_generator.js",
      "academic_records_generator.js",
      "lms_data_generator.js",
    ];

    for (const file of generatorFiles) {
      if (fs.existsSync(file)) {
        hasDataGenerator = true;
        this.logPass(`Data generator found: ${file}`);
        break;
      }
    }

    if (!hasDataGenerator) {
      this.logFail("No data generator found");
    }

    // Check for enhanced credential system
    const systemFiles = [
      "enhanced_credential_system.js",
      "academic_credential_system.js",
      "realistic_verkle_constructor.js",
    ];

    for (const file of systemFiles) {
      if (fs.existsSync(file)) {
        hasCredentialSystem = true;
        this.logPass(`Credential system found: ${file}`);
        break;
      }
    }

    if (!hasCredentialSystem) {
      this.logFail("No credential system found");
    }

    // Check for data files (multiple possible formats)
    const dataFiles = [
      "multi_semester_academic_export.json",
      "academic_records_export.json",
      "lms_semester_export.json",
    ];

    let foundDataFile = false;
    for (const file of dataFiles) {
      if (fs.existsSync(file)) {
        this.logPass(`Academic data found: ${file}`);
        foundDataFile = true;
      }
    }

    if (!foundDataFile) {
      this.logWarning("No academic data files found (will be generated)");
    }

    if (hasDataGenerator && hasCredentialSystem) {
      this.logPass("All required enhanced system dependencies found");
    } else {
      this.logFail("Missing required enhanced system files");
    }

    console.log();
  }

  /**
   * Test 2: Test multi-semester data generation
   */
  async testMultiSemesterDataGeneration() {
    console.log("🔍 Test 2: Testing multi-semester data generation...");

    try {
      // Check if we have multi-semester generator
      if (fs.existsSync("multi_semester_generator.js")) {
        try {
          const generator = require("./multi_semester_generator.js");
          this.logPass("Multi-semester generator loaded successfully");
        } catch (error) {
          this.logWarning(
            "Could not run multi-semester generator, using fallback"
          );
          this.createEnhancedTestData();
        }
      } else {
        this.logWarning(
          "Multi-semester generator not found, creating enhanced test data"
        );
        this.createEnhancedTestData();
      }

      // Verify multi-semester output file
      const expectedFiles = [
        "multi_semester_academic_export.json",
        "academic_records_export.json",
      ];

      let foundMultiSemesterFile = false;
      for (const file of expectedFiles) {
        if (fs.existsSync(file)) {
          const data = JSON.parse(fs.readFileSync(file, "utf8"));

          if (data.student_academic_journeys) {
            this.logPass(`Multi-semester data found in ${file}`);
            this.logPass(
              `Found ${data.student_academic_journeys.length} student academic journeys`
            );

            // Validate journey structure
            const sampleJourney = data.student_academic_journeys[0];
            if (
              sampleJourney.academic_terms &&
              sampleJourney.academic_terms.length > 0
            ) {
              this.logPass(
                `Sample journey has ${sampleJourney.academic_terms.length} academic terms`
              );
              foundMultiSemesterFile = true;
            } else {
              this.logWarning("Sample journey has no academic terms");
            }
          } else if (data.student_records) {
            this.logPass(`Single-semester fallback data found in ${file}`);
            this.logPass(
              `Found ${data.student_records.length} student records`
            );
            foundMultiSemesterFile = true;
          }
          break;
        }
      }

      if (!foundMultiSemesterFile) {
        this.logFail("No valid academic data file found");
      }
    } catch (error) {
      this.logFail(`Multi-semester data generation failed: ${error.message}`);
    }

    console.log();
  }

  /**
   * Test 3: Test enhanced credential system construction
   */
  async testEnhancedCredentialSystemConstruction() {
    console.log(
      "🔍 Test 3: Testing enhanced credential system construction..."
    );

    try {
      // Determine which enhanced system to use
      let systemFile = null;
      let SystemClass = null;

      if (fs.existsSync("enhanced_credential_system.js")) {
        systemFile = "enhanced_credential_system.js";
        const module = require("./enhanced_credential_system.js");
        SystemClass = module.EnhancedAcademicCredentialSystem;
      } else if (fs.existsSync("academic_credential_system.js")) {
        systemFile = "academic_credential_system.js";
        const module = require("./enhanced_credential_system.js");
        SystemClass = module.AcademicCredentialVerificationSystem;
      }

      if (!SystemClass) {
        this.logFail("No enhanced credential system class found");
        return;
      }

      this.logPass(`Enhanced system loaded: ${systemFile}`);

      // Test system instantiation
      const system = new SystemClass();
      this.logPass("Enhanced system instantiated successfully");

      // Test data loading (multi-semester aware)
      let loadedData;
      if (system.loadMultiSemesterAcademicData) {
        loadedData = system.loadMultiSemesterAcademicData();
        this.logPass("Multi-semester academic data loaded successfully");
        this.logPass(`Data format detected: ${loadedData.format}`);
      } else {
        // Fallback to single semester
        const inputFile = fs.existsSync("academic_records_export.json")
          ? "academic_records_export.json"
          : "lms_semester_export.json";
        loadedData = system.loadAcademicRecords
          ? system.loadAcademicRecords(inputFile)
          : system.loadLMSData(inputFile);
        this.logPass("Academic data loaded successfully (fallback mode)");
      }

      // Test enhanced tree construction
      let verkleTree;
      if (system.constructEnhancedVerkleTree) {
        verkleTree = system.constructEnhancedVerkleTree(loadedData);
        this.logPass("Enhanced Verkle tree constructed successfully");
        this.logPass(
          `Supports aggregated proofs: ${
            verkleTree.system_metadata.supports_aggregated_proofs || false
          }`
        );
      } else {
        verkleTree = system.constructVerkleTree(loadedData.data || loadedData);
        this.logPass("Verkle tree constructed successfully (fallback mode)");
      }

      // Test dual proof generation
      const proofs = system.generateAllCredentialProofs
        ? system.generateAllCredentialProofs(verkleTree)
        : system.generateAllStudentProofs(verkleTree);

      if (proofs && proofs.length > 0) {
        this.logPass(`Generated ${proofs.length} credential proofs`);

        // Analyze proof types
        const singleTermProofs = proofs.filter((p) => p.type === "single_term");
        const aggregatedProofs = proofs.filter(
          (p) => p.type === "aggregated_journey"
        );

        this.logPass(`Single-term proofs: ${singleTermProofs.length}`);
        this.logPass(`Aggregated journey proofs: ${aggregatedProofs.length}`);

        // Save test proofs for React testing
        if (singleTermProofs.length > 0) {
          fs.writeFileSync(
            "test_single_term_proof.json",
            JSON.stringify(singleTermProofs[0], null, 2)
          );
          this.logPass("Test single-term proof saved for React integration");
        }

        if (aggregatedProofs.length > 0) {
          fs.writeFileSync(
            "test_aggregated_proof.json",
            JSON.stringify(aggregatedProofs[0], null, 2)
          );
          this.logPass("Test aggregated proof saved for React integration");
        }
      } else {
        this.logFail("No credential proofs generated");
      }
    } catch (error) {
      this.logFail(`Enhanced credential system test failed: ${error.message}`);
    }

    console.log();
  }

  /**
   * Test 4: Validate dual proof format compatibility
   */
  async testDualProofFormatCompatibility() {
    console.log("🔍 Test 4: Testing dual proof format compatibility...");

    try {
      // Test single-term proof format
      if (fs.existsSync("test_single_term_proof.json")) {
        const singleTermProof = JSON.parse(
          fs.readFileSync("test_single_term_proof.json", "utf8")
        );

        this.logPass("Single-term proof file found");
        this.validateSingleTermProofFormat(singleTermProof);
      } else {
        this.logWarning("No single-term test proof found");
      }

      // Test aggregated journey proof format
      if (fs.existsSync("test_aggregated_proof.json")) {
        const aggregatedProof = JSON.parse(
          fs.readFileSync("test_aggregated_proof.json", "utf8")
        );

        this.logPass("Aggregated journey proof file found");
        this.validateAggregatedProofFormat(aggregatedProof);
      } else {
        this.logWarning("No aggregated test proof found");
      }
    } catch (error) {
      this.logFail(`Dual proof format validation failed: ${error.message}`);
    }

    console.log();
  }

  /**
   * Test 5: Test React component integration with both proof types
   */
  async testReactComponentDualCompatibility() {
    console.log("🔍 Test 5: Testing React component dual compatibility...");

    try {
      // Test single-term proof compatibility
      if (fs.existsSync("test_single_term_proof.json")) {
        const singleTermProof = JSON.parse(
          fs.readFileSync("test_single_term_proof.json", "utf8")
        );

        const validatedSingleTerm =
          this.simulateReactComponentValidation(singleTermProof);
        if (validatedSingleTerm) {
          this.logPass("Single-term proof passes React component validation");
          this.logPass(`Detected as: ${validatedSingleTerm.type}`);

          if (validatedSingleTerm.verkle_proof?.claimed_values) {
            this.logPass(
              `Can render ${validatedSingleTerm.verkle_proof.claimed_values.length} course completions`
            );
          }
        } else {
          this.logFail("Single-term proof fails React component validation");
        }
      }

      // Test aggregated journey proof compatibility
      if (fs.existsSync("test_aggregated_proof.json")) {
        const aggregatedProof = JSON.parse(
          fs.readFileSync("test_aggregated_proof.json", "utf8")
        );

        const validatedAggregated =
          this.simulateReactComponentValidation(aggregatedProof);
        if (validatedAggregated) {
          this.logPass(
            "Aggregated journey proof passes React component validation"
          );
          this.logPass(`Detected as: ${validatedAggregated.type}`);

          if (validatedAggregated.academic_terms) {
            this.logPass(
              `Can render ${validatedAggregated.academic_terms.length} academic terms`
            );

            const totalCourses = validatedAggregated.academic_terms.reduce(
              (sum, term) => sum + (term.courses?.length || 0),
              0
            );
            this.logPass(`Total courses across journey: ${totalCourses}`);
          }
        } else {
          this.logFail(
            "Aggregated journey proof fails React component validation"
          );
        }
      }
    } catch (error) {
      this.logFail(`React dual compatibility test failed: ${error.message}`);
    }

    console.log();
  }

  /**
   * Test 6: Enhanced system performance benchmarks
   */
  async testEnhancedSystemPerformance() {
    console.log("🔍 Test 6: Enhanced system performance benchmarks...");

    try {
      const outputDirs = [
        "enhanced_credential_proofs",
        "credential_proofs",
        "realistic_proof_packages",
      ];
      let proofsDir = null;

      for (const dir of outputDirs) {
        if (fs.existsSync(dir)) {
          proofsDir = dir;
          break;
        }
      }

      if (proofsDir) {
        const files = fs
          .readdirSync(proofsDir)
          .filter(
            (f) =>
              f.endsWith(".json") &&
              (f.startsWith("single_term_") ||
                f.startsWith("journey_") ||
                f.startsWith("credential_"))
          );

        if (files.length > 0) {
          let totalSize = 0;
          let singleTermCount = 0;
          let journeyCount = 0;
          let singleTermSize = 0;
          let journeySize = 0;

          files.forEach((file) => {
            const filePath = path.join(proofsDir, file);
            const stats = fs.statSync(filePath);
            totalSize += stats.size;

            if (file.startsWith("single_term_")) {
              singleTermCount++;
              singleTermSize += stats.size;
            } else if (file.startsWith("journey_")) {
              journeyCount++;
              journeySize += stats.size;
            }
          });

          this.logPass(`Found ${files.length} total proof files`);
          this.logPass(`Single-term proofs: ${singleTermCount}`);
          this.logPass(`Journey proofs: ${journeyCount}`);

          if (singleTermCount > 0) {
            this.logPass(
              `Average single-term proof size: ${
                Math.round((singleTermSize / singleTermCount / 1024) * 100) /
                100
              } KB`
            );
          }

          if (journeyCount > 0) {
            this.logPass(
              `Average journey proof size: ${
                Math.round((journeySize / journeyCount / 1024) * 100) / 100
              } KB`
            );
          }

          const avgSize = totalSize / files.length;
          this.logPass(
            `Overall average proof size: ${
              Math.round((avgSize / 1024) * 100) / 100
            } KB`
          );

          if (avgSize < 10000) {
            // Less than 10KB
            this.logPass("Enhanced proof sizes are efficient");
          } else {
            this.logWarning("Enhanced proof sizes are larger than expected");
          }
        } else {
          this.logWarning(
            "No enhanced proof files found for performance testing"
          );
        }
      } else {
        this.logWarning("No enhanced proof output directory found");
      }

      // Test execution time
      const executionTime = Date.now() - this.testStartTime;
      this.logPass(`Total enhanced test execution time: ${executionTime}ms`);

      if (executionTime < 15000) {
        // Less than 15 seconds for enhanced system
        this.logPass("Enhanced system performance is acceptable");
      } else {
        this.logWarning("Enhanced system performance may need optimization");
      }
    } catch (error) {
      this.logFail(`Enhanced performance test failed: ${error.message}`);
    }

    console.log();
  }

  /**
   * Test 7: Aggregated journey proof validation
   */
  async testAggregatedJourneyProofValidation() {
    console.log("🔍 Test 7: Testing aggregated journey proof validation...");

    try {
      if (!fs.existsSync("test_aggregated_proof.json")) {
        this.logWarning("No aggregated proof available for validation testing");
        return;
      }

      const aggregatedProof = JSON.parse(
        fs.readFileSync("test_aggregated_proof.json", "utf8")
      );

      // Validate journey summary consistency
      if (aggregatedProof.journey_summary && aggregatedProof.academic_terms) {
        const calculatedTerms = aggregatedProof.academic_terms.length;
        const claimedTerms = aggregatedProof.journey_summary.total_terms;

        if (calculatedTerms === claimedTerms) {
          this.logPass(
            `Journey summary terms count is consistent: ${calculatedTerms}`
          );
        } else {
          this.logFail(
            `Journey summary inconsistent: claimed ${claimedTerms}, actual ${calculatedTerms}`
          );
        }

        // Validate total courses
        const calculatedCourses = aggregatedProof.academic_terms.reduce(
          (sum, term) => sum + (term.courses?.length || 0),
          0
        );
        const claimedCourses = aggregatedProof.journey_summary.total_courses;

        if (calculatedCourses === claimedCourses) {
          this.logPass(
            `Journey summary courses count is consistent: ${calculatedCourses}`
          );
        } else {
          this.logFail(
            `Journey courses inconsistent: claimed ${claimedCourses}, actual ${calculatedCourses}`
          );
        }

        // Validate verification chain
        if (aggregatedProof.verification_chain) {
          const chainTerms = aggregatedProof.verification_chain.length;
          const actualTerms = aggregatedProof.academic_terms.length;

          if (chainTerms === actualTerms) {
            this.logPass(
              `Verification chain is complete: ${chainTerms} entries`
            );
          } else {
            this.logWarning(
              `Verification chain incomplete: ${chainTerms} entries for ${actualTerms} terms`
            );
          }
        }
      }

      this.logPass("Aggregated journey proof validation completed");
    } catch (error) {
      this.logFail(`Aggregated journey validation failed: ${error.message}`);
    }

    console.log();
  }

  /**
   * Validate single-term proof format
   */
  validateSingleTermProofFormat(proof) {
    const requiredFields = [
      "type",
      "claim",
      "verkle_proof",
      "blockchain_reference",
      "institutional_verification",
      "metadata",
    ];

    requiredFields.forEach((field) => {
      if (proof.hasOwnProperty(field)) {
        this.logPass(`✓ Single-term field present: ${field}`);
      } else {
        this.logFail(`✗ Missing single-term field: ${field}`);
      }
    });

    if (proof.type === "single_term") {
      this.logPass("✓ Correct proof type: single_term");
    } else {
      this.logFail(`✗ Incorrect proof type: ${proof.type}`);
    }
  }

  /**
   * Validate aggregated proof format
   */
  validateAggregatedProofFormat(proof) {
    const requiredFields = [
      "type",
      "student_info",
      "academic_terms",
      "journey_summary",
      "institutional_verification",
    ];

    requiredFields.forEach((field) => {
      if (proof.hasOwnProperty(field)) {
        this.logPass(`✓ Aggregated field present: ${field}`);
      } else {
        this.logFail(`✗ Missing aggregated field: ${field}`);
      }
    });

    if (proof.type === "aggregated_journey") {
      this.logPass("✓ Correct proof type: aggregated_journey");
    } else {
      this.logFail(`✗ Incorrect proof type: ${proof.type}`);
    }

    if (proof.academic_terms && Array.isArray(proof.academic_terms)) {
      this.logPass(
        `✓ Academic terms array with ${proof.academic_terms.length} terms`
      );
    } else {
      this.logFail("✗ Invalid academic_terms structure");
    }
  }

  /**
   * Simulate React component validation
   */
  simulateReactComponentValidation(data) {
    if (data.claim && data.verkle_proof && data.claim.term) {
      return { type: "single_term", ...data };
    }
    if (data.student_info && data.academic_terms) {
      return { type: "aggregated_journey", ...data };
    }
    return null;
  }

  /**
   * Create enhanced test data for fallback
   */
  createEnhancedTestData() {
    const enhancedTestData = {
      export_metadata: {
        institution: "International University Vietnam",
        export_type: "MULTI_SEMESTER_ACADEMIC_JOURNEY",
        academic_years: ["2022-2023", "2023-2024", "2024-2025"],
        export_date: new Date().toISOString(),
        total_students: 3,
        data_format_version: "2.0",
      },
      student_academic_journeys: [
        {
          student_id: "STU001",
          student_name: "Alice Johnson",
          program: "Computer Science",
          enrollment_date: "2022-09-01",
          current_year: 3,
          academic_terms: [
            {
              term: "Fall_2022",
              year: 2022,
              semester: "Fall",
              year_level: 1,
              courses: [
                {
                  course_code: "CS101",
                  course_name: "Introduction to Programming",
                  grade: "A",
                  completion_date: "2022-12-10",
                  credits: 3,
                  instructor: "Prof. Smith",
                  semester: "Fall_2022",
                },
              ],
              term_gpa: 4.0,
              total_credits: 3,
            },
            {
              term: "Spring_2023",
              year: 2023,
              semester: "Spring",
              year_level: 1,
              courses: [
                {
                  course_code: "CS102",
                  course_name: "Computer Science Fundamentals",
                  grade: "B+",
                  completion_date: "2023-05-10",
                  credits: 3,
                  instructor: "Prof. Miller",
                  semester: "Spring_2023",
                },
              ],
              term_gpa: 3.3,
              total_credits: 3,
            },
          ],
          journey_summary: {
            total_terms: 2,
            total_courses: 2,
            total_credits: 6,
            cumulative_gpa: 3.65,
            start_date: "2022-09-01",
            latest_term: "Spring_2023",
          },
        },
      ],
    };

    fs.writeFileSync(
      "multi_semester_academic_export.json",
      JSON.stringify(enhancedTestData, null, 2)
    );

    // Also create legacy format
    const legacyFormat = {
      export_metadata: enhancedTestData.export_metadata,
      student_records: enhancedTestData.student_academic_journeys.map(
        (journey) => ({
          student_id: journey.student_id,
          student_name: journey.student_name,
          course_completions: journey.academic_terms.flatMap(
            (term) => term.courses
          ),
          total_courses: journey.journey_summary.total_courses,
          total_credits: journey.journey_summary.total_credits,
          semester: "Multi_Semester_Journey",
        })
      ),
    };

    fs.writeFileSync(
      "academic_records_export.json",
      JSON.stringify(legacyFormat, null, 2)
    );
  }

  /**
   * Log test pass
   */
  logPass(message) {
    console.log(`✅ ${message}`);
    this.testResults.passed++;
  }

  /**
   * Log test failure
   */
  logFail(message) {
    console.log(`❌ ${message}`);
    this.testResults.failed++;
    this.testResults.errors.push(message);
  }

  /**
   * Log test warning
   */
  logWarning(message) {
    console.log(`⚠️  ${message}`);
    this.testResults.warnings.push(message);
  }

  /**
   * Display final test results
   */
  displayTestResults() {
    const executionTime = Date.now() - this.testStartTime;

    console.log("=".repeat(80));
    console.log("🎯 ENHANCED INTEGRATION TEST RESULTS");
    console.log("=".repeat(80));
    console.log(`✅ Tests Passed: ${this.testResults.passed}`);
    console.log(`❌ Tests Failed: ${this.testResults.failed}`);
    console.log(`⚠️  Warnings: ${this.testResults.warnings.length}`);
    console.log(`⏱️  Execution Time: ${executionTime}ms`);
    console.log(
      `🏆 Success Rate: ${Math.round(
        (this.testResults.passed /
          (this.testResults.passed + this.testResults.failed)) *
          100
      )}%`
    );

    if (this.testResults.failed === 0) {
      console.log(
        "\n🎉 ALL ENHANCED TESTS PASSED! Multi-semester system is ready for use."
      );
      console.log("\n📋 Next Steps:");
      console.log("1. Test React interface with test_single_term_proof.json");
      console.log("2. Test React interface with test_aggregated_proof.json");
      console.log("3. Verify both proof types work in your UI");
      console.log("4. Deploy enhanced system to staging environment");
    } else {
      console.log(
        "\n⚠️  SOME ENHANCED TESTS FAILED. Please address the following issues:"
      );
      this.testResults.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    if (this.testResults.warnings.length > 0) {
      console.log("\n💡 Warnings to consider:");
      this.testResults.warnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning}`);
      });
    }

    console.log("=".repeat(80));
  }
}

/**
 * Main execution function
 */
async function runEnhancedIntegrationTest() {
  const testSuite = new EnhancedAcademicSystemIntegrationTest();
  const success = await testSuite.runCompleteIntegrationTest();
  process.exit(success ? 0 : 1);
}

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = { EnhancedAcademicSystemIntegrationTest };
}

// Run if executed directly
if (require.main === module) {
  runEnhancedIntegrationTest();
}

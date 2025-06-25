// Verkle Tree Construction and Proof Generation
// Reads LMS data, constructs Verkle trees, and generates proof packages for each student

const crypto = require("crypto");
const fs = require("fs");

class VerkleTreeConstructor {
  constructor() {
    this.institutionPrivateKey =
      "inst_private_key_" + crypto.randomBytes(16).toString("hex");
    this.sepoliaContractAddress = "0x" + crypto.randomBytes(20).toString("hex");
  }

  // Load LMS semester export
  loadLMSData(filename = "lms_semester_export.json") {
    try {
      console.log(`Loading LMS data from ${filename}...`);
      const lmsData = JSON.parse(fs.readFileSync(filename, "utf8"));
      console.log(
        `✅ Loaded data for ${lmsData.student_records.length} students`
      );
      return lmsData;
    } catch (error) {
      console.error(`❌ Error loading LMS data: ${error.message}`);
      throw new Error(
        "LMS data file not found. Please run the LMS data generator first."
      );
    }
  }

  // Construct Verkle tree for the semester
  constructVerkleTree(lmsData) {
    console.log("\n=== Constructing Verkle Tree ===");

    // Collect all course completions as leaves
    const leaves = [];
    const studentIndexMap = new Map();

    lmsData.student_records.forEach((student, studentIndex) => {
      studentIndexMap.set(student.student_id, studentIndex);

      student.course_completions.forEach((course, courseIndex) => {
        const leafData = {
          student_id: student.student_id,
          course_code: course.course_code,
          course_name: course.course_name,
          grade: course.grade,
          completion_date: course.completion_date,
          credits: course.credits,
          instructor: course.instructor,
          semester: course.semester,
          // Verkle tree specific
          leaf_index: leaves.length,
          student_index: studentIndex,
          course_index: courseIndex,
          leaf_hash: this.computeLeafHash(course, student.student_id),
        };
        leaves.push(leafData);
      });
    });

    console.log(`📊 Total leaves in tree: ${leaves.length}`);

    // Generate Verkle tree commitment (polynomial commitment)
    const treeCommitment = this.generatePolynomialCommitment(leaves);

    // Simulate blockchain deployment
    const blockchainDeployment = this.deployToSepolia(
      treeCommitment,
      lmsData.export_metadata
    );

    const verkleTree = {
      tree_metadata: {
        semester: lmsData.export_metadata.semester,
        institution: lmsData.export_metadata.institution,
        total_leaves: leaves.length,
        total_students: lmsData.student_records.length,
        construction_date: new Date().toISOString(),
        tree_height: Math.ceil(Math.log2(leaves.length)),
        tree_type: "verkle_tree",
      },
      polynomial_commitment: treeCommitment,
      blockchain_deployment: blockchainDeployment,
      leaves: leaves,
      student_index_map: Object.fromEntries(studentIndexMap),
      tree_root: treeCommitment.commitment_hash,
    };

    console.log(
      `✅ Verkle tree constructed with commitment: ${treeCommitment.commitment_hash.substring(
        0,
        16
      )}...`
    );
    console.log(
      `🔗 Deployed to Sepolia: ${blockchainDeployment.transaction_hash.substring(
        0,
        16
      )}...`
    );

    return verkleTree;
  }

  // Compute leaf hash for course completion
  computeLeafHash(course, studentId) {
    const leafString = `${studentId}_${course.course_code}_${course.grade}_${course.completion_date}`;
    return crypto.createHash("sha256").update(leafString).digest("hex");
  }

  // Generate polynomial commitment for Verkle tree
  generatePolynomialCommitment(leaves) {
    // Mock polynomial commitment generation
    const commitmentSeed = leaves.map((leaf) => leaf.leaf_hash).join("");
    const commitmentHash = crypto
      .createHash("sha256")
      .update(commitmentSeed)
      .digest("hex");

    return {
      commitment_hash: commitmentHash,
      polynomial_degree: leaves.length - 1,
      commitment_algorithm: "KZG_commitment",
      commitment_size_bytes: 48, // KZG commitment size
      setup_parameters: {
        trusted_setup: "ceremony_2024_verkle",
        generator_point: "G1_" + crypto.randomBytes(16).toString("hex"),
      },
    };
  }

  // Mock deployment to Sepolia blockchain
  deployToSepolia(commitment, metadata) {
    return {
      contract_address: this.sepoliaContractAddress,
      transaction_hash: "0x" + crypto.randomBytes(32).toString("hex"),
      block_number: Math.floor(Math.random() * 100000) + 8000000,
      block_hash: "0x" + crypto.randomBytes(32).toString("hex"),
      gas_used: Math.floor(Math.random() * 200000) + 100000,
      deployment_timestamp: new Date().toISOString(),
      network: "sepolia",
      commitment_stored: commitment.commitment_hash,
      semester_metadata: {
        semester: metadata.semester,
        student_count: metadata.total_students,
        institution_signature: this.signData(commitment.commitment_hash),
      },
    };
  }

  // Generate proof package for a specific student
  generateStudentProofPackage(verkleTree, studentId, requestedCourses = null) {
    // Find student's leaves in the tree
    const studentLeaves = verkleTree.leaves.filter(
      (leaf) => leaf.student_id === studentId
    );

    if (studentLeaves.length === 0) {
      throw new Error(`Student ${studentId} not found in Verkle tree`);
    }

    // Use requested courses or all courses if not specified
    let targetLeaves = studentLeaves;
    if (requestedCourses && requestedCourses.length > 0) {
      targetLeaves = studentLeaves.filter((leaf) =>
        requestedCourses.includes(leaf.course_code)
      );
      if (targetLeaves.length === 0) {
        throw new Error(
          `None of the requested courses found for student ${studentId}`
        );
      }
    }

    // Generate polynomial proof for the claimed courses
    const polynomialProof = this.generatePolynomialProof(
      targetLeaves,
      verkleTree.polynomial_commitment
    );

    // Create evaluation points for each course
    const evaluationPoints = targetLeaves.map((leaf) => ({
      course_code: leaf.course_code,
      evaluation_point: `x_${leaf.leaf_index}`,
      leaf_index: leaf.leaf_index,
      polynomial_value: leaf.leaf_hash,
    }));

    // Generate the complete proof package
    const proofPackage = {
      // Student claim
      claim: {
        student_id: studentId,
        claimed_courses: targetLeaves.map((leaf) => leaf.course_code),
        semester: verkleTree.tree_metadata.semester,
        total_courses_claimed: targetLeaves.length,
        claim_timestamp: new Date().toISOString(),
      },

      // Verkle proof
      verkle_proof: {
        polynomial_proof: polynomialProof,
        evaluation_points: evaluationPoints,
        claimed_values: targetLeaves.map((leaf) => ({
          course_code: leaf.course_code,
          course_name: leaf.course_name,
          grade: leaf.grade,
          completion_date: leaf.completion_date,
          credits: leaf.credits,
          instructor: leaf.instructor,
          verification_hash: leaf.leaf_hash,
        })),
        proof_size_bytes: polynomialProof.length / 2, // hex to bytes
        verification_algorithm: "verkle_verify_v1",
      },

      // Blockchain reference
      blockchain_reference: {
        network: "sepolia",
        contract_address: verkleTree.blockchain_deployment.contract_address,
        tree_commitment: verkleTree.polynomial_commitment.commitment_hash,
        block_number: verkleTree.blockchain_deployment.block_number,
        transaction_hash: verkleTree.blockchain_deployment.transaction_hash,
        deployment_timestamp:
          verkleTree.blockchain_deployment.deployment_timestamp,
      },

      // Institutional verification
      institutional_verification: {
        institution: verkleTree.tree_metadata.institution,
        semester: verkleTree.tree_metadata.semester,
        digital_signature: this.signData(polynomialProof + studentId),
        certificate_chain: "IU_Vietnam_CA_2024",
        verification_timestamp: new Date().toISOString(),
      },

      // Metadata
      metadata: {
        proof_version: "1.0.0",
        total_students_in_tree: verkleTree.tree_metadata.total_students,
        total_leaves_in_tree: verkleTree.tree_metadata.total_leaves,
        student_leaf_count: studentLeaves.length,
        proof_generation_timestamp: new Date().toISOString(),
        expires_at: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000
        ).toISOString(), // 1 year
        usage_permissions: {
          shareable: true,
          verifiable: true,
          privacy_level: "selective_disclosure",
        },
      },
    };

    return {
      student_id: studentId,
      proof_package: proofPackage,
      course_metadata: targetLeaves.map((leaf) => ({
        course_code: leaf.course_code,
        course_name: leaf.course_name,
        credits: leaf.credits,
        grade: leaf.grade,
        completion_date: leaf.completion_date,
        instructor: leaf.instructor,
      })),
      proof_summary: {
        courses_included: targetLeaves.length,
        total_credits: targetLeaves.reduce(
          (sum, leaf) => sum + leaf.credits,
          0
        ),
        proof_size_kb:
          Math.round((JSON.stringify(proofPackage).length / 1024) * 100) / 100,
      },
    };
  }

  // Generate polynomial proof for specific leaves
  generatePolynomialProof(targetLeaves, commitment) {
    // Mock polynomial proof generation
    const proofSeed = targetLeaves
      .map((leaf) => `${leaf.leaf_index}_${leaf.leaf_hash}`)
      .join("_");
    const proof = crypto
      .createHash("sha256")
      .update(proofSeed + commitment.commitment_hash)
      .digest("hex");

    // In real implementation, this would be a KZG proof
    return proof + crypto.randomBytes(16).toString("hex"); // 64 bytes total
  }

  // Generate proof packages for all students
  generateAllStudentProofs(verkleTree) {
    console.log("\n=== Generating Proof Packages for All Students ===");

    const studentIds = Object.keys(verkleTree.student_index_map);
    const proofPackages = [];

    studentIds.forEach((studentId, index) => {
      try {
        console.log(
          `Generating proof ${index + 1}/${
            studentIds.length
          } for ${studentId}...`
        );
        const proofData = this.generateStudentProofPackage(
          verkleTree,
          studentId
        );
        proofPackages.push(proofData);
      } catch (error) {
        console.error(
          `❌ Error generating proof for ${studentId}: ${error.message}`
        );
      }
    });

    console.log(`✅ Generated ${proofPackages.length} proof packages`);
    return proofPackages;
  }

  // Sign data with institutional private key
  signData(data) {
    return crypto
      .createHmac("sha256", this.institutionPrivateKey)
      .update(data)
      .digest("hex");
  }

  // Save proof packages to files
  saveProofPackages(proofPackages, outputDir = "proof_packages") {
    // Create output directory
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const savedFiles = [];

    proofPackages.forEach((proofData) => {
      const filename = `${outputDir}/proof_${proofData.student_id}.json`;
      fs.writeFileSync(filename, JSON.stringify(proofData, null, 2));
      savedFiles.push(filename);
    });

    // Create summary file
    const summary = {
      generation_timestamp: new Date().toISOString(),
      total_proof_packages: proofPackages.length,
      average_proof_size_kb:
        Math.round(
          (proofPackages.reduce(
            (sum, proof) => sum + proof.proof_summary.proof_size_kb,
            0
          ) /
            proofPackages.length) *
            100
        ) / 100,
      total_courses_proven: proofPackages.reduce(
        (sum, proof) => sum + proof.proof_summary.courses_included,
        0
      ),
      files: savedFiles,
    };

    fs.writeFileSync(
      `${outputDir}/summary.json`,
      JSON.stringify(summary, null, 2)
    );

    console.log(
      `💾 Saved ${savedFiles.length} proof packages to ${outputDir}/`
    );
    console.log(`📊 Summary saved to ${outputDir}/summary.json`);

    return summary;
  }

  // Display construction summary
  displaySummary(verkleTree, proofPackages) {
    console.log("\n=== Verkle Tree Construction Complete ===");
    console.log(
      `🌳 Tree Commitment: ${verkleTree.tree_root.substring(0, 32)}...`
    );
    console.log(`📦 Total Leaves: ${verkleTree.tree_metadata.total_leaves}`);
    console.log(`👥 Students: ${verkleTree.tree_metadata.total_students}`);
    console.log(
      `🔗 Sepolia Contract: ${verkleTree.blockchain_deployment.contract_address}`
    );
    console.log(`📄 Proof Packages Generated: ${proofPackages.length}`);

    const totalCourses = proofPackages.reduce(
      (sum, proof) => sum + proof.proof_summary.courses_included,
      0
    );
    const avgProofSize =
      proofPackages.reduce(
        (sum, proof) => sum + proof.proof_summary.proof_size_kb,
        0
      ) / proofPackages.length;

    console.log(`📚 Total Courses Proven: ${totalCourses}`);
    console.log(
      `💾 Average Proof Size: ${Math.round(avgProofSize * 100) / 100} KB`
    );
  }
}

// Main execution
function constructVerkleTreeAndGenerateProofs() {
  console.log("=== Verkle Tree Construction & Proof Generation ===\n");

  const constructor = new VerkleTreeConstructor();

  try {
    // 1. Load LMS data
    const lmsData = constructor.loadLMSData();

    // 2. Construct Verkle tree
    const verkleTree = constructor.constructVerkleTree(lmsData);

    // 3. Generate proof packages for all students
    const proofPackages = constructor.generateAllStudentProofs(verkleTree);

    // 4. Save proof packages to files
    const summary = constructor.saveProofPackages(proofPackages);

    // 5. Display summary
    constructor.displaySummary(verkleTree, proofPackages);

    console.log(
      "\n🎉 Process complete! Proof packages ready for frontend integration."
    );

    return {
      verkleTree,
      proofPackages,
      summary,
    };
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    console.log(
      "\n💡 Make sure to run the LMS data generator first to create the input data."
    );
  }
}

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = { VerkleTreeConstructor };
}

// Run if executed directly
if (require.main === module) {
  constructVerkleTreeAndGenerateProofs();
}

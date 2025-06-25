// LMS Output Generator - Generates semester course completion data for 20 students
// This simulates the output from a Learning Management System

const crypto = require("crypto");
const fs = require("fs");

// Available courses for Fall 2024 semester
const SEMESTER_COURSES = {
  CS101: {
    name: "Introduction to Programming",
    credits: 3,
    instructor: "Prof. Smith",
  },
  CS102: {
    name: "Computer Science Fundamentals",
    credits: 3,
    instructor: "Prof. Johnson",
  },
  MATH201: { name: "Calculus II", credits: 4, instructor: "Prof. Davis" },
  MATH202: {
    name: "Discrete Mathematics",
    credits: 3,
    instructor: "Prof. Wilson",
  },
  ENG102: { name: "Technical Writing", credits: 2, instructor: "Prof. Brown" },
  PHYS201: { name: "Physics II", credits: 4, instructor: "Prof. Taylor" },
  CS201: { name: "Data Structures", credits: 3, instructor: "Prof. Anderson" },
  CS202: {
    name: "Object-Oriented Programming",
    credits: 3,
    instructor: "Prof. Miller",
  },
  STAT301: { name: "Statistics", credits: 3, instructor: "Prof. Garcia" },
  DB301: { name: "Database Systems", credits: 3, instructor: "Prof. Lee" },
};

const GRADES = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "D+", "D"];
const SEMESTER = "Fall_2024";
const INSTITUTION = "International University Vietnam";

class LMSDataGenerator {
  constructor() {
    this.semesterStartDate = new Date("2024-09-01");
    this.semesterEndDate = new Date("2024-12-15");
  }

  // Generate student ID
  generateStudentId(index) {
    return `STU${String(index + 1).padStart(3, "0")}`;
  }

  // Generate random completion date within semester
  generateCompletionDate() {
    const randomTime =
      this.semesterStartDate.getTime() +
      Math.random() *
        (this.semesterEndDate.getTime() - this.semesterStartDate.getTime());
    return new Date(randomTime).toISOString().split("T")[0];
  }

  // Generate course completion record
  generateCourseCompletion(studentId, courseCode) {
    const course = SEMESTER_COURSES[courseCode];
    const grade = GRADES[Math.floor(Math.random() * GRADES.length)];
    const completionDate = this.generateCompletionDate();

    return {
      student_id: studentId,
      course_code: courseCode,
      course_name: course.name,
      instructor: course.instructor,
      credits: course.credits,
      grade: grade,
      completion_date: completionDate,
      semester: SEMESTER,
      institution: INSTITUTION,
      // LMS specific fields
      enrollment_date: "2024-09-01",
      final_exam_score: Math.floor(Math.random() * 40) + 60, // 60-100
      attendance_rate: Math.floor(Math.random() * 20) + 80, // 80-100%
      assignment_scores: this.generateAssignmentScores(),
      course_id: `${courseCode}_${SEMESTER}`,
      section: `SEC_${Math.floor(Math.random() * 3) + 1}`, // SEC_1, SEC_2, SEC_3
      lms_record_id: crypto.randomBytes(8).toString("hex"),
    };
  }

  // Generate assignment scores
  generateAssignmentScores() {
    const numAssignments = Math.floor(Math.random() * 5) + 3; // 3-7 assignments
    const scores = [];

    for (let i = 0; i < numAssignments; i++) {
      scores.push({
        assignment_name: `Assignment ${i + 1}`,
        score: Math.floor(Math.random() * 40) + 60, // 60-100
        max_score: 100,
        submission_date: this.generateCompletionDate(),
      });
    }

    return scores;
  }

  // Generate student enrollment data for semester
  generateStudentSemesterData(studentIndex) {
    const studentId = this.generateStudentId(studentIndex);

    // Each student takes 4-6 courses randomly
    const availableCourses = Object.keys(SEMESTER_COURSES);
    const numCourses = Math.floor(Math.random() * 3) + 4; // 4-6 courses

    // Randomly select courses for this student
    const selectedCourses = [];
    const shuffled = [...availableCourses].sort(() => 0.5 - Math.random());

    for (let i = 0; i < Math.min(numCourses, shuffled.length); i++) {
      selectedCourses.push(shuffled[i]);
    }

    // Generate completion records for selected courses
    const courseCompletions = selectedCourses.map((courseCode) =>
      this.generateCourseCompletion(studentId, courseCode)
    );

    // Sort by completion date
    courseCompletions.sort(
      (a, b) => new Date(a.completion_date) - new Date(b.completion_date)
    );

    return {
      student_id: studentId,
      student_name: `Student ${studentId}`,
      email: `${studentId.toLowerCase()}@student.iu.edu.vn`,
      program: "Computer Science",
      year_level: Math.floor(Math.random() * 4) + 1, // Year 1-4
      semester: SEMESTER,
      enrollment_status: "ACTIVE",
      total_courses: courseCompletions.length,
      total_credits: courseCompletions.reduce(
        (sum, course) => sum + course.credits,
        0
      ),
      course_completions: courseCompletions,
      // LMS metadata
      lms_student_id: crypto.randomBytes(6).toString("hex"),
      last_login: this.generateCompletionDate(),
      portal_access: true,
    };
  }

  // Generate LMS export for entire semester (20 students)
  generateSemesterLMSExport() {
    const lmsExport = {
      export_metadata: {
        institution: INSTITUTION,
        semester: SEMESTER,
        export_date: new Date().toISOString(),
        export_type: "COURSE_COMPLETIONS",
        academic_year: "2024-2025",
        total_students: 20,
        total_courses: Object.keys(SEMESTER_COURSES).length,
        export_id: crypto.randomBytes(8).toString("hex"),
        lms_version: "2.1.4",
        data_format_version: "1.0",
      },
      course_catalog: SEMESTER_COURSES,
      student_records: [],
    };

    // Generate 20 students
    for (let i = 0; i < 20; i++) {
      const studentData = this.generateStudentSemesterData(i);
      lmsExport.student_records.push(studentData);
    }

    // Add summary statistics
    lmsExport.summary_statistics = this.calculateSummaryStats(
      lmsExport.student_records
    );

    return lmsExport;
  }

  // Calculate summary statistics
  calculateSummaryStats(studentRecords) {
    const totalEnrollments = studentRecords.reduce(
      (sum, student) => sum + student.total_courses,
      0
    );
    const totalCredits = studentRecords.reduce(
      (sum, student) => sum + student.total_credits,
      0
    );

    // Course enrollment counts
    const courseEnrollments = {};
    studentRecords.forEach((student) => {
      student.course_completions.forEach((course) => {
        courseEnrollments[course.course_code] =
          (courseEnrollments[course.course_code] || 0) + 1;
      });
    });

    return {
      total_students: studentRecords.length,
      total_enrollments: totalEnrollments,
      total_credits_awarded: totalCredits,
      average_courses_per_student:
        Math.round((totalEnrollments / studentRecords.length) * 100) / 100,
      course_enrollment_counts: courseEnrollments,
      most_popular_course: Object.entries(courseEnrollments).sort(
        (a, b) => b[1] - a[1]
      )[0],
      grade_distribution: this.calculateGradeDistribution(studentRecords),
    };
  }

  // Calculate grade distribution
  calculateGradeDistribution(studentRecords) {
    const gradeCount = {};

    studentRecords.forEach((student) => {
      student.course_completions.forEach((course) => {
        gradeCount[course.grade] = (gradeCount[course.grade] || 0) + 1;
      });
    });

    return gradeCount;
  }

  // Save LMS export to JSON file
  saveLMSExport(lmsData, filename = "lms_semester_export.json") {
    fs.writeFileSync(filename, JSON.stringify(lmsData, null, 2));
    console.log(`LMS semester export saved to ${filename}`);
    console.log(
      `Generated data for ${lmsData.student_records.length} students`
    );
    console.log(
      `Total course completions: ${lmsData.summary_statistics.total_enrollments}`
    );
    return filename;
  }

  // Display export summary
  displayExportSummary(lmsData) {
    console.log("\n=== LMS Semester Export Summary ===");
    console.log(`Institution: ${lmsData.export_metadata.institution}`);
    console.log(`Semester: ${lmsData.export_metadata.semester}`);
    console.log(`Students: ${lmsData.export_metadata.total_students}`);
    console.log(`Available Courses: ${lmsData.export_metadata.total_courses}`);
    console.log(`Export Date: ${lmsData.export_metadata.export_date}`);

    console.log("\n--- Summary Statistics ---");
    const stats = lmsData.summary_statistics;
    console.log(`Total Enrollments: ${stats.total_enrollments}`);
    console.log(`Total Credits Awarded: ${stats.total_credits_awarded}`);
    console.log(
      `Average Courses per Student: ${stats.average_courses_per_student}`
    );
    console.log(
      `Most Popular Course: ${stats.most_popular_course[0]} (${stats.most_popular_course[1]} students)`
    );

    console.log("\n--- Sample Student Records ---");
    lmsData.student_records.slice(0, 3).forEach((student) => {
      console.log(
        `${student.student_id}: ${student.total_courses} courses, ${student.total_credits} credits`
      );
      student.course_completions.forEach((course) => {
        console.log(`  - ${course.course_code}: ${course.grade}`);
      });
    });
  }
}

// Main execution
function generateLMSSemesterData() {
  console.log("=== LMS Semester Data Generator ===\n");

  const generator = new LMSDataGenerator();

  console.log("Generating semester course completion data for 20 students...");
  const lmsExport = generator.generateSemesterLMSExport();

  // Display summary
  generator.displayExportSummary(lmsExport);

  // Save to file
  console.log("\nSaving LMS export...");
  const filename = generator.saveLMSExport(lmsExport);

  console.log(`\n✅ LMS export complete! Data saved to ${filename}`);
  console.log(
    "This file can now be used by the Verkle tree construction script."
  );

  return lmsExport;
}

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = { LMSDataGenerator };
}

// Run if executed directly
if (require.main === module) {
  generateLMSSemesterData();
}

// Multi-Semester Academic Records Generator
// Generates complete academic journey data across multiple semesters

const crypto = require("crypto");
const fs = require("fs");

// Course catalog for different semesters and years
const COURSE_CATALOG = {
  // First Year Courses
  year_1: {
    Fall_2022: {
      CS101: {
        name: "Introduction to Programming",
        credits: 3,
        instructor: "Prof. Smith",
      },
      MATH101: { name: "Calculus I", credits: 4, instructor: "Prof. Johnson" },
      ENG101: {
        name: "English Composition",
        credits: 3,
        instructor: "Prof. Brown",
      },
      PHYS101: { name: "Physics I", credits: 4, instructor: "Prof. Wilson" },
      CHEM101: {
        name: "General Chemistry",
        credits: 4,
        instructor: "Prof. Davis",
      },
    },
    Spring_2023: {
      CS102: {
        name: "Computer Science Fundamentals",
        credits: 3,
        instructor: "Prof. Miller",
      },
      MATH102: { name: "Calculus II", credits: 4, instructor: "Prof. Johnson" },
      ENG102: {
        name: "Technical Writing",
        credits: 2,
        instructor: "Prof. Brown",
      },
      PHYS102: { name: "Physics II", credits: 4, instructor: "Prof. Wilson" },
      HIST101: {
        name: "World History",
        credits: 3,
        instructor: "Prof. Garcia",
      },
    },
  },
  // Second Year Courses
  year_2: {
    Fall_2023: {
      CS201: {
        name: "Data Structures",
        credits: 3,
        instructor: "Prof. Anderson",
      },
      MATH201: {
        name: "Discrete Mathematics",
        credits: 3,
        instructor: "Prof. Taylor",
      },
      STAT201: { name: "Statistics", credits: 3, instructor: "Prof. Lee" },
      CS202: {
        name: "Object-Oriented Programming",
        credits: 3,
        instructor: "Prof. Clark",
      },
      PHIL101: {
        name: "Logic and Reasoning",
        credits: 3,
        instructor: "Prof. Moore",
      },
    },
    Spring_2024: {
      CS203: { name: "Algorithms", credits: 3, instructor: "Prof. Anderson" },
      CS204: {
        name: "Computer Architecture",
        credits: 3,
        instructor: "Prof. White",
      },
      MATH202: {
        name: "Linear Algebra",
        credits: 3,
        instructor: "Prof. Taylor",
      },
      DB201: {
        name: "Database Systems",
        credits: 3,
        instructor: "Prof. Martinez",
      },
      ECON101: {
        name: "Microeconomics",
        credits: 3,
        instructor: "Prof. Thompson",
      },
    },
  },
  // Third Year Courses
  year_3: {
    Fall_2024: {
      CS301: {
        name: "Software Engineering",
        credits: 3,
        instructor: "Prof. Robinson",
      },
      CS302: {
        name: "Operating Systems",
        credits: 3,
        instructor: "Prof. King",
      },
      CS303: {
        name: "Computer Networks",
        credits: 3,
        instructor: "Prof. Hall",
      },
      MATH301: {
        name: "Probability Theory",
        credits: 3,
        instructor: "Prof. Young",
      },
      MGMT201: {
        name: "Project Management",
        credits: 3,
        instructor: "Prof. Scott",
      },
    },
    Spring_2025: {
      CS304: {
        name: "Machine Learning",
        credits: 3,
        instructor: "Prof. Adams",
      },
      CS305: { name: "Web Development", credits: 3, instructor: "Prof. Baker" },
      CS306: {
        name: "Mobile App Development",
        credits: 3,
        instructor: "Prof. Green",
      },
      STAT301: {
        name: "Advanced Statistics",
        credits: 3,
        instructor: "Prof. Lee",
      },
      COMM201: {
        name: "Technical Communication",
        credits: 2,
        instructor: "Prof. Lewis",
      },
    },
  },
  // Fourth Year Courses
  year_4: {
    Fall_2025: {
      CS401: {
        name: "Senior Capstone I",
        credits: 3,
        instructor: "Prof. Robinson",
      },
      CS402: { name: "Cybersecurity", credits: 3, instructor: "Prof. Turner" },
      CS403: {
        name: "Artificial Intelligence",
        credits: 3,
        instructor: "Prof. Adams",
      },
      MATH401: {
        name: "Advanced Mathematics",
        credits: 3,
        instructor: "Prof. Young",
      },
      ETHICS101: {
        name: "Computer Ethics",
        credits: 2,
        instructor: "Prof. Parker",
      },
    },
    Spring_2026: {
      CS404: {
        name: "Senior Capstone II",
        credits: 3,
        instructor: "Prof. Robinson",
      },
      CS405: {
        name: "Advanced Algorithms",
        credits: 3,
        instructor: "Prof. Anderson",
      },
      CS406: {
        name: "Distributed Systems",
        credits: 3,
        instructor: "Prof. King",
      },
      INTERN401: {
        name: "Industry Internship",
        credits: 6,
        instructor: "Prof. Career",
      },
    },
  },
};

const GRADES = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "D+", "D"];
const INSTITUTION = "International University Vietnam";

class MultiSemesterAcademicGenerator {
  constructor() {
    this.students = [];
    this.academicPrograms = {
      "Computer Science": { min_gpa: 2.0, typical_courses_per_semester: 5 },
      "Information Technology": {
        min_gpa: 2.0,
        typical_courses_per_semester: 5,
      },
      "Software Engineering": { min_gpa: 2.0, typical_courses_per_semester: 5 },
    };
  }

  // Generate student profile with diverse academic progression
  generateStudentProfile(studentIndex) {
    const studentId = `STU${String(studentIndex + 1).padStart(3, "0")}`;
    const programs = Object.keys(this.academicPrograms);
    const program = programs[Math.floor(Math.random() * programs.length)];

    // Create diverse academic scenarios for 5 students
    const academicScenarios = [
      // Student 1: Traditional 4-year path (Senior, started Fall 2021)
      {
        current_year: 4,
        enrollment_year: 2021,
        scenario: "Traditional Senior",
        expected_graduation: "2025-05-15",
        academic_status: "EXCELLENT",
        description: "Traditional 4-year student, on track to graduate",
      },
      // Student 2: Junior who started late (Junior, started Fall 2022)
      {
        current_year: 3,
        enrollment_year: 2022,
        scenario: "Late Starter Junior",
        expected_graduation: "2026-05-15",
        academic_status: "GOOD",
        description: "Started university one year later, currently junior",
      },
      // Student 3: Sophomore (started Fall 2023)
      {
        current_year: 2,
        enrollment_year: 2023,
        scenario: "Regular Sophomore",
        expected_graduation: "2027-05-15",
        academic_status: "GOOD",
        description: "Traditional sophomore student",
      },
      // Student 4: Transfer student (Junior, but only 2 years at this university)
      {
        current_year: 3,
        enrollment_year: 2023, // Transferred in 2023 as a junior
        scenario: "Transfer Student",
        expected_graduation: "2025-12-15",
        academic_status: "TRANSFER",
        description: "Transfer student who joined as junior in 2023",
      },
      // Student 5: Part-time student (taking longer to graduate)
      {
        current_year: 2,
        enrollment_year: 2021, // Started in 2021 but part-time
        scenario: "Part-time Student",
        expected_graduation: "2026-12-15",
        academic_status: "PART_TIME",
        description: "Part-time student taking longer path to graduation",
      },
    ];

    const scenario = academicScenarios[studentIndex] || academicScenarios[0];

    return {
      student_id: studentId,
      student_name: `Student ${studentId}`,
      email: `${studentId.toLowerCase()}@student.iu.edu.vn`,
      program: program,
      enrollment_date: `${scenario.enrollment_year}-09-01`,
      current_year: scenario.current_year,
      enrollment_year: scenario.enrollment_year,
      expected_graduation: scenario.expected_graduation,
      student_type:
        scenario.academic_status === "PART_TIME" ? "PART_TIME" : "FULL_TIME",
      academic_status: "ACTIVE",
      academic_scenario: scenario.scenario,
      scenario_description: scenario.description,
      academic_terms: [],
      journey_summary: {
        total_terms: 0,
        total_courses: 0,
        total_credits: 0,
        cumulative_gpa: 0.0,
        start_date: `${scenario.enrollment_year}-09-01`,
        latest_term: "",
      },
    };
  }

  // Generate semester data for a student based on their unique scenario
  generateSemesterData(student, year, semester, yearLevel) {
    const semesterKey = `${semester}_${year}`;
    const yearKey = `year_${yearLevel}`;

    // If exact year/semester not found, try to find courses for this year level
    let availableCourses = null;
    if (COURSE_CATALOG[yearKey] && COURSE_CATALOG[yearKey][semesterKey]) {
      availableCourses = COURSE_CATALOG[yearKey][semesterKey];
    } else if (COURSE_CATALOG[yearKey]) {
      // Find any semester for this year level as fallback
      const semesters = Object.keys(COURSE_CATALOG[yearKey]);
      const fallbackSemester = semesters.find((s) => s.includes(semester));
      if (fallbackSemester) {
        availableCourses = COURSE_CATALOG[yearKey][fallbackSemester];
      } else if (semesters.length > 0) {
        // Use any available semester for this year level
        availableCourses = COURSE_CATALOG[yearKey][semesters[0]];
      }
    }

    if (!availableCourses) {
      return null; // No courses available for this year level
    }

    const courseKeys = Object.keys(availableCourses);

    // Adjust course load based on student scenario
    let numCourses;
    if (student.student_type === "PART_TIME") {
      numCourses = Math.floor(Math.random() * 2) + 2; // 2-3 courses for part-time
    } else if (student.academic_scenario === "Transfer Student") {
      numCourses = Math.floor(Math.random() * 2) + 4; // 4-5 courses (catching up)
    } else {
      numCourses = Math.floor(Math.random() * 3) + 4; // 4-6 courses for full-time
    }

    const selectedCourses = this.selectRandomCourses(courseKeys, numCourses);

    const courseCompletions = selectedCourses.map((courseCode) => {
      const course = availableCourses[courseCode];
      return this.generateCourseCompletion(
        student.student_id,
        courseCode,
        course,
        semesterKey,
        student
      );
    });

    // Calculate semester GPA (with student scenario influence)
    const semesterGPA = this.calculateSemesterGPA(courseCompletions, student);
    const totalCredits = courseCompletions.reduce(
      (sum, course) => sum + course.credits,
      0
    );

    return {
      term: semesterKey,
      year: year,
      semester: semester,
      year_level: yearLevel,
      enrollment_status: "COMPLETED",
      courses: courseCompletions,
      term_gpa: semesterGPA,
      total_credits: totalCredits,
      academic_standing: semesterGPA >= 3.0 ? "GOOD_STANDING" : "PROBATION",
      student_scenario: student.academic_scenario,
    };
  }

  // Generate course completion record with student scenario influence
  generateCourseCompletion(studentId, courseCode, course, semester, student) {
    const grade = this.generateRealisticGrade(student);
    const completionDate = this.generateCompletionDate(semester);

    return {
      student_id: studentId,
      course_code: courseCode,
      course_name: course.name,
      instructor: course.instructor,
      credits: course.credits,
      grade: grade,
      completion_date: completionDate,
      semester: semester,
      institution: INSTITUTION,
      student_scenario: student.academic_scenario,
      // Additional academic metadata
      enrollment_date: this.generateEnrollmentDate(semester),
      final_exam_score: this.gradeToScore(grade),
      assignment_avg:
        this.gradeToScore(grade) + Math.floor(Math.random() * 10) - 5,
      attendance_rate: Math.floor(Math.random() * 20) + 80,
      course_id: `${courseCode}_${semester}`,
      section: `SEC_${Math.floor(Math.random() * 3) + 1}`,
      lms_record_id: crypto.randomBytes(8).toString("hex"),
    };
  }

  // Generate realistic grade based on student scenario and progression
  generateRealisticGrade(student, yearLevel = 1) {
    let baseGrades;

    // Adjust grades based on student scenario
    switch (student.academic_scenario) {
      case "Traditional Senior":
        // Excellent student, strong grades throughout
        baseGrades = ["A+", "A", "A-", "B+", "A", "A", "B+"];
        break;
      case "Late Starter Junior":
        // Good student who started later, consistent performance
        baseGrades = ["B+", "B", "A-", "B", "B+", "A-", "B"];
        break;
      case "Regular Sophomore":
        // Typical student progression, improving over time
        baseGrades =
          yearLevel <= 1
            ? ["B", "B-", "C+", "B", "B+", "C+", "B"]
            : ["B+", "B", "A-", "B+", "A", "B", "B+"];
        break;
      case "Transfer Student":
        // Strong student (had to meet transfer requirements)
        baseGrades = ["A-", "B+", "A", "B+", "A-", "B", "A"];
        break;
      case "Part-time Student":
        // More time per course, generally good grades
        baseGrades = ["A-", "B+", "A", "B+", "A-", "A", "B+"];
        break;
      default:
        baseGrades = ["B", "B+", "A-", "B", "B+", "C+", "A-"];
    }

    return baseGrades[Math.floor(Math.random() * baseGrades.length)];
  }

  // Calculate semester GPA with scenario adjustments
  calculateSemesterGPA(courseCompletions, student) {
    const gradePoints = {
      "A+": 4.0,
      A: 4.0,
      "A-": 3.7,
      "B+": 3.3,
      B: 3.0,
      "B-": 2.7,
      "C+": 2.3,
      C: 2.0,
      "C-": 1.7,
      "D+": 1.3,
      D: 1.0,
      F: 0.0,
    };

    let totalPoints = 0;
    let totalCredits = 0;

    courseCompletions.forEach((course) => {
      totalPoints += gradePoints[course.grade] * course.credits;
      totalCredits += course.credits;
    });

    let baseGPA = totalCredits > 0 ? totalPoints / totalCredits : 0.0;

    // Apply small scenario-based adjustments
    switch (student.academic_scenario) {
      case "Traditional Senior":
        baseGPA = Math.min(4.0, baseGPA + 0.1); // Slight boost for excellent student
        break;
      case "Part-time Student":
        baseGPA = Math.min(4.0, baseGPA + 0.05); // Slight boost for more focused study
        break;
    }

    return Math.round(baseGPA * 100) / 100;
  }

  // Calculate journey summary for a student based on their academic terms
  calculateJourneySummary(student) {
    if (!student.academic_terms || student.academic_terms.length === 0) {
      // If no terms, keep initial journey_summary structure
      return;
    }

    // Calculate totals from all academic terms
    let totalCourses = 0;
    let totalCredits = 0;
    let totalGradePoints = 0;
    let latestTerm = "";

    student.academic_terms.forEach((term) => {
      totalCourses += term.courses.length;
      totalCredits += term.total_credits;

      // Calculate grade points for GPA calculation
      term.courses.forEach((course) => {
        const gradePoint = this.getGradePoint(course.grade);
        totalGradePoints += gradePoint * course.credits;
      });

      // Track latest term
      if (!latestTerm || term.term > latestTerm) {
        latestTerm = term.term;
      }
    });

    // Calculate cumulative GPA
    const cumulativeGPA =
      totalCredits > 0 ? totalGradePoints / totalCredits : 0.0;

    // Update journey summary
    student.journey_summary = {
      total_terms: student.academic_terms.length,
      total_courses: totalCourses,
      total_credits: totalCredits,
      cumulative_gpa: Math.round(cumulativeGPA * 100) / 100,
      start_date: student.enrollment_date,
      latest_term: latestTerm,
    };
  }

  // Helper method to convert letter grades to grade points
  getGradePoint(grade) {
    const gradePoints = {
      "A+": 4.0,
      A: 4.0,
      "A-": 3.7,
      "B+": 3.3,
      B: 3.0,
      "B-": 2.7,
      "C+": 2.3,
      C: 2.0,
      "C-": 1.7,
      "D+": 1.3,
      D: 1.0,
      "D-": 0.7,
      F: 0.0,
    };
    return gradePoints[grade] || 0.0;
  }

  // Generate complete academic journey for a student with their unique path
  generateStudentAcademicJourney(studentIndex) {
    const student = this.generateStudentProfile(studentIndex);
    const enrollmentYear = student.enrollment_year;
    const currentYear = student.current_year;

    console.log(
      `  📚 ${student.student_id}: ${student.academic_scenario} (${student.scenario_description})`
    );

    // Calculate how many academic years this student has been enrolled
    const yearsEnrolled = 2024 - enrollmentYear + 1;

    // Generate academic terms based on student's unique journey
    let termCount = 0;
    for (let academicYear = 0; academicYear < yearsEnrolled; academicYear++) {
      const calendarYear = enrollmentYear + academicYear;

      // Determine what year level the student was in this academic year
      let studentYearLevel;
      if (student.academic_scenario === "Transfer Student") {
        // Transfer student started as a junior
        studentYearLevel = 3 + academicYear;
      } else if (student.student_type === "PART_TIME") {
        // Part-time student progresses slower
        studentYearLevel = Math.floor(academicYear * 0.6) + 1;
      } else {
        // Traditional progression
        studentYearLevel = academicYear + 1;
      }

      // Don't generate terms beyond their current year level
      if (studentYearLevel > currentYear) break;
      if (studentYearLevel > 4) break; // Cap at senior year

      // Fall semester
      if (calendarYear >= enrollmentYear) {
        const fallTerm = this.generateSemesterData(
          student,
          calendarYear,
          "Fall",
          studentYearLevel
        );
        if (fallTerm) {
          student.academic_terms.push(fallTerm);
          termCount++;
        }
      }

      // Spring semester (only if not in their first semester or if they've progressed)
      const springYear = calendarYear + 1;
      const shouldTakeSpring = termCount > 0 || academicYear > 0;

      if (
        shouldTakeSpring &&
        studentYearLevel <= currentYear &&
        springYear <= 2025
      ) {
        const springTerm = this.generateSemesterData(
          student,
          springYear,
          "Spring",
          studentYearLevel
        );
        if (springTerm) {
          student.academic_terms.push(springTerm);
          termCount++;
        }
      }
    }

    // Calculate journey summary
    this.calculateJourneySummary(student);

    return student;
  }

  // Generate complete multi-semester export for 5 diverse students
  generateMultiSemesterExport(numStudents = 5) {
    console.log(
      `🎓 Generating diverse multi-semester academic records for ${numStudents} students...`
    );

    const multiSemesterExport = {
      export_metadata: {
        institution: INSTITUTION,
        export_type: "MULTI_SEMESTER_ACADEMIC_JOURNEY",
        academic_years: ["2021-2022", "2022-2023", "2023-2024", "2024-2025"],
        export_date: new Date().toISOString(),
        total_students: numStudents,
        data_format_version: "2.0",
        export_id: crypto.randomBytes(8).toString("hex"),
        system_version: "Multi-Semester Academic System v2.0",
        student_diversity:
          "Realistic academic scenarios with different starting times and paths",
      },
      course_catalog: COURSE_CATALOG,
      student_academic_journeys: [],
    };

    console.log("\n📊 Student Academic Scenarios:");

    // Generate academic journeys for diverse students
    for (let i = 0; i < numStudents; i++) {
      const studentJourney = this.generateStudentAcademicJourney(i);
      multiSemesterExport.student_academic_journeys.push(studentJourney);
    }

    // Add summary statistics
    multiSemesterExport.summary_statistics = this.calculateSystemSummaryStats(
      multiSemesterExport.student_academic_journeys
    );

    console.log(
      `\n✅ Multi-semester export completed with ${numStudents} diverse students!`
    );
    return multiSemesterExport;
  }

  // Calculate system-wide summary statistics
  calculateSystemSummaryStats(studentJourneys) {
    const totalTerms = studentJourneys.reduce(
      (sum, student) => sum + student.journey_summary.total_terms,
      0
    );
    const totalCourses = studentJourneys.reduce(
      (sum, student) => sum + student.journey_summary.total_courses,
      0
    );
    const totalCredits = studentJourneys.reduce(
      (sum, student) => sum + student.journey_summary.total_credits,
      0
    );

    // Calculate average GPA
    const totalGPA = studentJourneys.reduce(
      (sum, student) => sum + student.journey_summary.cumulative_gpa,
      0
    );
    const avgGPA = totalGPA / studentJourneys.length;

    // Program distribution
    const programDistribution = {};
    studentJourneys.forEach((student) => {
      programDistribution[student.program] =
        (programDistribution[student.program] || 0) + 1;
    });

    // Year level distribution
    const yearDistribution = {};
    studentJourneys.forEach((student) => {
      yearDistribution[`Year ${student.current_year}`] =
        (yearDistribution[`Year ${student.current_year}`] || 0) + 1;
    });

    return {
      total_students: studentJourneys.length,
      total_academic_terms: totalTerms,
      total_course_completions: totalCourses,
      total_credits_awarded: totalCredits,
      average_terms_per_student:
        Math.round((totalTerms / studentJourneys.length) * 100) / 100,
      average_cumulative_gpa: Math.round(avgGPA * 100) / 100,
      program_distribution: programDistribution,
      year_level_distribution: yearDistribution,
      graduation_ready_students: studentJourneys.filter(
        (s) => s.current_year >= 4
      ).length,
    };
  }

  // Save multi-semester export to files
  saveMultiSemesterExport(exportData) {
    // Save main export file
    const mainFilename = "multi_semester_academic_export.json";
    fs.writeFileSync(mainFilename, JSON.stringify(exportData, null, 2));
    console.log(`💾 Multi-semester export saved to ${mainFilename}`);

    // Also save in legacy format for backward compatibility
    const legacyFormat = {
      export_metadata: exportData.export_metadata,
      student_records: exportData.student_academic_journeys.map((journey) => ({
        student_id: journey.student_id,
        student_name: journey.student_name,
        course_completions: journey.academic_terms.flatMap(
          (term) => term.courses
        ),
        total_courses: journey.journey_summary.total_courses,
        total_credits: journey.journey_summary.total_credits,
        semester: "Multi_Semester_Journey",
      })),
    };

    fs.writeFileSync(
      "academic_records_export.json",
      JSON.stringify(legacyFormat, null, 2)
    );
    console.log(`💾 Legacy format saved to academic_records_export.json`);

    return { mainFilename, legacyFilename: "academic_records_export.json" };
  }

  // Display comprehensive summary
  displayExportSummary(exportData) {
    console.log("\n" + "=".repeat(70));
    console.log("🎓 MULTI-SEMESTER ACADEMIC EXPORT SUMMARY");
    console.log("=".repeat(70));
    console.log(`🏛️  Institution: ${exportData.export_metadata.institution}`);
    console.log(
      `📅 Academic Years: ${exportData.export_metadata.academic_years.join(
        ", "
      )}`
    );
    console.log(`👥 Students: ${exportData.export_metadata.total_students}`);
    console.log(`📊 Export Date: ${exportData.export_metadata.export_date}`);

    const stats = exportData.summary_statistics;
    console.log("\n--- Journey Statistics ---");
    console.log(`📈 Total Academic Terms: ${stats.total_academic_terms}`);
    console.log(
      `📚 Total Course Completions: ${stats.total_course_completions}`
    );
    console.log(`🎓 Total Credits Awarded: ${stats.total_credits_awarded}`);
    console.log(
      `📊 Average Terms per Student: ${stats.average_terms_per_student}`
    );
    console.log(`🏆 Average Cumulative GPA: ${stats.average_cumulative_gpa}`);
    console.log(
      `🎯 Graduation Ready: ${stats.graduation_ready_students} students`
    );

    console.log("\n--- Program Distribution ---");
    Object.entries(stats.program_distribution).forEach(([program, count]) => {
      console.log(`  ${program}: ${count} students`);
    });

    console.log("\n--- Year Level Distribution ---");
    Object.entries(stats.year_level_distribution).forEach(([year, count]) => {
      console.log(`  ${year}: ${count} students`);
    });

    console.log("\n--- Sample Academic Journey ---");
    const sampleStudent = exportData.student_academic_journeys[0];
    console.log(`${sampleStudent.student_id} (${sampleStudent.program}):`);
    sampleStudent.academic_terms.forEach((term) => {
      console.log(
        `  ${term.term}: ${term.courses.length} courses, GPA: ${term.term_gpa}`
      );
    });
    console.log(
      `  Cumulative: ${sampleStudent.journey_summary.total_courses} courses, ${sampleStudent.journey_summary.total_credits} credits, CGPA: ${sampleStudent.journey_summary.cumulative_gpa}`
    );
    console.log("=".repeat(70));
  }

  // Helper method to select random courses from available courses
  selectRandomCourses(courseKeys, numCourses) {
    // Shuffle and select random courses
    const shuffled = [...courseKeys].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(numCourses, courseKeys.length));
  }

  // Generate completion date for a semester
  generateCompletionDate(semester) {
    const [semesterName, year] = semester.split("_");
    if (semesterName === "Fall") {
      return `${year}-12-15`; // Fall semester ends in December
    } else if (semesterName === "Spring") {
      return `${year}-05-15`; // Spring semester ends in May
    }
    return `${year}-12-15`; // Default to December
  }

  // Generate enrollment date for a semester
  generateEnrollmentDate(semester) {
    const [semesterName, year] = semester.split("_");
    if (semesterName === "Fall") {
      return `${year}-08-15`; // Fall semester starts in August
    } else if (semesterName === "Spring") {
      return `${year}-01-15`; // Spring semester starts in January
    }
    return `${year}-08-15`; // Default to August
  }

  // Convert grade to score (0-100)
  gradeToScore(grade) {
    const scoreMap = {
      "A+": 97,
      A: 94,
      "A-": 90,
      "B+": 87,
      B: 84,
      "B-": 80,
      "C+": 77,
      C: 74,
      "C-": 70,
      "D+": 67,
      D: 64,
      "D-": 60,
      F: 45,
    };
    return scoreMap[grade] || 50;
  }
}

// Main execution function
function generateMultiSemesterAcademicData() {
  console.log("🎓 Multi-Semester Academic Records Generator");
  console.log("📊 Complete Academic Journey System\n");

  const generator = new MultiSemesterAcademicGenerator();

  const exportData = generator.generateMultiSemesterExport(5);

  // Display comprehensive summary
  generator.displayExportSummary(exportData);

  // Save to files
  console.log("\n💾 Saving multi-semester export...");
  const filenames = generator.saveMultiSemesterExport(exportData);

  console.log(`\n🎉 Multi-semester academic export complete!`);
  console.log("✅ Files created:");
  console.log(`   • ${filenames.mainFilename} (complete journeys)`);
  console.log(`   • ${filenames.legacyFilename} (backward compatibility)`);
  console.log("\n📋 Ready for aggregated proof generation!");

  return exportData;
}

// Export for modular usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = { MultiSemesterAcademicGenerator };
}

// Run if executed directly
if (require.main === module) {
  generateMultiSemesterAcademicData();
}

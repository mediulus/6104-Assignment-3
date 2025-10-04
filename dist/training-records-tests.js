"use strict";
/**
 * TrainingRecords Test Cases
 *
 * Demonstrates the AI-augmented training records system
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.testNormalTrainingWeek = testNormalTrainingWeek;
exports.testConcerningTrends = testConcerningTrends;
exports.testMissingData = testMissingData;
const training_records_1 = require("./training-records");
const gemini_llm_1 = require("./gemini-llm");
/**
 * Load configuration from config.json
 */
function loadConfig() {
    try {
        const config = require("../config.json");
        return config;
    }
    catch (error) {
        console.error("❌ Error loading config.json. Please ensure it exists with your API key.");
        console.error("Error details:", error.message);
        process.exit(1);
    }
}
/**
 * Helper function to create a date
 */
function createDate(year, month, day) {
    return { year, month, day };
}
/**
 * Test case: AI recommendation for normal training week
 */
async function testNormalTrainingWeek() {
    console.log("\n🧪 TEST CASE 1: Normal Training Week");
    console.log("=====================================");
    const trainingRecords = new training_records_1.TrainingRecords();
    const config = loadConfig();
    const llm = new gemini_llm_1.GeminiLLM(config);
    // Create users
    const coach = {
        id: "coach1",
        name: "Coach Smith",
        role: "coach",
        teamId: "team1",
    };
    const athlete = {
        id: "athlete1",
        name: "Sarah Johnson",
        role: "athlete",
        teamId: "team1",
        mileage: 40, // baseline
    };
    trainingRecords.addUser(coach);
    trainingRecords.addUser(athlete);
    // Week starting Monday, 2024-01-15 through Sunday, 2024-01-21
    const weekStart = createDate(2024, 1, 15);
    // Monday - Easy run
    const mon = trainingRecords.createRecord(coach, athlete, weekStart, 70, "Easy recovery run");
    trainingRecords.logAthleteData(athlete, mon, {
        mileage: 5,
        stress: 3,
        sleep: 8,
        restingHeartRate: 48,
        exerciseHeartRate: 140,
        perceivedExertion: 4,
        notes: "Felt good, easy pace",
    });
    // Tuesday - Tempo run
    const tue = trainingRecords.createRecord(coach, athlete, createDate(2024, 1, 16), 85, "Tempo run - 3 miles at threshold");
    trainingRecords.logAthleteData(athlete, tue, {
        mileage: 6,
        stress: 5,
        sleep: 7.5,
        restingHeartRate: 50,
        exerciseHeartRate: 165,
        perceivedExertion: 7,
        notes: "Tough workout, felt strong",
    });
    // Wednesday - Rest day
    const wed = trainingRecords.createRecord(coach, athlete, createDate(2024, 1, 17), 0, "Rest day");
    trainingRecords.logAthleteData(athlete, wed, {
        mileage: 0,
        stress: 2,
        sleep: 9,
        restingHeartRate: 46,
        exerciseHeartRate: 0,
        perceivedExertion: 1,
        notes: "Full rest, feeling recovered",
    });
    // Thursday - Easy run + strides
    const thu = trainingRecords.createRecord(coach, athlete, createDate(2024, 1, 18), 70, "Easy run + 6x strides");
    trainingRecords.logAthleteData(athlete, thu, {
        mileage: 5,
        stress: 3,
        sleep: 8,
        restingHeartRate: 48,
        exerciseHeartRate: 145,
        perceivedExertion: 4,
        notes: "Smooth, strides felt poppy",
    });
    // Friday - Medium easy
    const fri = trainingRecords.createRecord(coach, athlete, createDate(2024, 1, 19), 75, "Moderate easy run");
    trainingRecords.logAthleteData(athlete, fri, {
        mileage: 6,
        stress: 3,
        sleep: 8,
        restingHeartRate: 49,
        exerciseHeartRate: 150,
        perceivedExertion: 5,
        notes: "Legs a bit heavy early, fine later",
    });
    // Saturday - Long run
    const sat = trainingRecords.createRecord(coach, athlete, createDate(2024, 1, 20), 85, "Long run");
    trainingRecords.logAthleteData(athlete, sat, {
        mileage: 10,
        stress: 5,
        sleep: 8,
        restingHeartRate: 50,
        exerciseHeartRate: 160,
        perceivedExertion: 6,
        notes: "Steady, finished strong",
    });
    // Sunday - Easy shakeout
    const sun = trainingRecords.createRecord(coach, athlete, createDate(2024, 1, 21), 65, "Easy shakeout");
    trainingRecords.logAthleteData(athlete, sun, {
        mileage: 4,
        stress: 2,
        sleep: 9,
        restingHeartRate: 47,
        exerciseHeartRate: 138,
        perceivedExertion: 3,
        notes: "Nice and easy",
    });
    // Display current records
    trainingRecords.displayRecords();
    // Test AI recommendation (week-only analysis)
    console.log("\n🤖 Testing AI recommendation...");
    try {
        const result = await trainingRecords.summarizeAndRecommend(athlete, llm, weekStart);
        console.log("\n✅ AI Recommendation:");
        console.log(result.recommendation);
    }
    catch (error) {
        console.error("❌ Error getting AI recommendation:", error.message);
    }
}
/**
 * Test case: AI recommendation for concerning trends
 */
async function testConcerningTrends() {
    console.log("\n🧪 TEST CASE 2: Concerning Trends");
    console.log("==================================");
    const trainingRecords = new training_records_1.TrainingRecords();
    const config = loadConfig();
    const llm = new gemini_llm_1.GeminiLLM(config);
    // Create users
    const coach = {
        id: "coach2",
        name: "Coach Davis",
        role: "coach",
        teamId: "team2",
    };
    const athlete = {
        id: "athlete2",
        name: "Mike Chen",
        role: "athlete",
        teamId: "team2",
        mileage: 50, // baseline
    };
    trainingRecords.addUser(coach);
    trainingRecords.addUser(athlete);
    // Include a bit of previous week (for context in the dataset—your analysis still uses only current week)
    const prevMon = trainingRecords.createRecord(coach, athlete, createDate(2024, 1, 8), 70, "Easy run");
    trainingRecords.logAthleteData(athlete, prevMon, {
        mileage: 5,
        stress: 3,
        sleep: 8,
        restingHeartRate: 48,
        exerciseHeartRate: 140,
        perceivedExertion: 4,
    });
    const prevTue = trainingRecords.createRecord(coach, athlete, createDate(2024, 1, 9), 80, "Workout");
    trainingRecords.logAthleteData(athlete, prevTue, {
        mileage: 6,
        stress: 5,
        sleep: 7.5,
        restingHeartRate: 50,
        exerciseHeartRate: 160,
        perceivedExertion: 6,
    });
    // Current week (must be full Mon–Sun): 2024-01-15 .. 2024-01-21
    const weekStart = createDate(2024, 1, 15);
    // Monday - Hard workout, poor sleep, elevated RHR/HR
    const mon = trainingRecords.createRecord(coach, athlete, weekStart, 90, "Hard workout");
    trainingRecords.logAthleteData(athlete, mon, {
        mileage: 8,
        stress: 8,
        sleep: 5.5,
        restingHeartRate: 58,
        exerciseHeartRate: 175,
        perceivedExertion: 8,
        notes: "Felt tired, hard to maintain pace",
    });
    // Tuesday - Recovery run, still elevated
    const tue = trainingRecords.createRecord(coach, athlete, createDate(2024, 1, 16), 75, "Recovery run");
    trainingRecords.logAthleteData(athlete, tue, {
        mileage: 6,
        stress: 7,
        sleep: 6,
        restingHeartRate: 56,
        exerciseHeartRate: 170,
        perceivedExertion: 7,
        notes: "Still feeling fatigued",
    });
    // Wednesday - Easy run, RHR remains high; sleep slightly better
    const wed = trainingRecords.createRecord(coach, athlete, createDate(2024, 1, 17), 70, "Easy run");
    trainingRecords.logAthleteData(athlete, wed, {
        mileage: 5,
        stress: 6,
        sleep: 6.5,
        restingHeartRate: 55,
        exerciseHeartRate: 165,
        perceivedExertion: 6,
        notes: "Legs heavy, kept it easy",
    });
    // Thursday - Rest day
    const thu = trainingRecords.createRecord(coach, athlete, createDate(2024, 1, 18), 0, "Rest day");
    trainingRecords.logAthleteData(athlete, thu, {
        mileage: 0,
        stress: 5,
        sleep: 7,
        restingHeartRate: 54,
        exerciseHeartRate: 0,
        perceivedExertion: 2,
        notes: "Took full rest",
    });
    // Friday - Easy jog, HR trending down but still a bit elevated
    const fri = trainingRecords.createRecord(coach, athlete, createDate(2024, 1, 19), 65, "Easy jog");
    trainingRecords.logAthleteData(athlete, fri, {
        mileage: 4,
        stress: 4,
        sleep: 7.5,
        restingHeartRate: 52,
        exerciseHeartRate: 158,
        perceivedExertion: 5,
        notes: "Feeling a bit better",
    });
    // Saturday - Long run (expected high effort HR)
    const sat = trainingRecords.createRecord(coach, athlete, createDate(2024, 1, 20), 85, "Long run");
    trainingRecords.logAthleteData(athlete, sat, {
        mileage: 11,
        stress: 6,
        sleep: 8,
        restingHeartRate: 53,
        exerciseHeartRate: 168,
        perceivedExertion: 7,
        notes: "Managed fine, steady effort",
    });
    // Sunday - Easy shakeout
    const sun = trainingRecords.createRecord(coach, athlete, createDate(2024, 1, 21), 60, "Easy shakeout");
    trainingRecords.logAthleteData(athlete, sun, {
        mileage: 3,
        stress: 3,
        sleep: 8.5,
        restingHeartRate: 51,
        exerciseHeartRate: 150,
        perceivedExertion: 4,
        notes: "HR trending better",
    });
    // Display current records
    trainingRecords.displayRecords();
    // Test AI recommendation (week-only analysis)
    console.log("\n🤖 Testing AI recommendation for concerning trends...");
    try {
        const result = await trainingRecords.summarizeAndRecommend(athlete, llm, weekStart);
        console.log("\n⚠️ AI Recommendation for concerning trends:");
        console.log(result.recommendation);
    }
    catch (error) {
        console.error("❌ Error getting AI recommendation:", error.message);
    }
}
/**
 * Test case: AI recommendation for missing data
 */
async function testMissingData() {
    console.log("\n🧪 TEST CASE 3: Missing Data");
    console.log("=============================");
    const trainingRecords = new training_records_1.TrainingRecords();
    const config = loadConfig();
    const llm = new gemini_llm_1.GeminiLLM(config);
    // Create users
    const coach = {
        id: "coach3",
        name: "Coach Wilson",
        role: "coach",
        teamId: "team3",
    };
    const athlete = {
        id: "athlete3",
        name: "Alex Rodriguez",
        role: "athlete",
        teamId: "team3",
        mileage: 45, // baseline
    };
    trainingRecords.addUser(coach);
    trainingRecords.addUser(athlete);
    // Full week Mon–Sun with deliberate gaps in logging/plans
    const weekStart = createDate(2024, 1, 15);
    // Monday - complete data
    const mon = trainingRecords.createRecord(coach, athlete, weekStart, 70, "Easy run");
    trainingRecords.logAthleteData(athlete, mon, {
        mileage: 5,
        stress: 3,
        sleep: 8,
        restingHeartRate: 48,
        exerciseHeartRate: 140,
        perceivedExertion: 4,
    });
    // Tuesday - coach set plan but athlete didn't log
    trainingRecords.createRecord(coach, athlete, createDate(2024, 1, 16), 80, "Tempo run");
    // Wednesday - athlete logged but no real plan content (use empty/nil-ish)
    const wed = trainingRecords.createRecord(coach, athlete, createDate(2024, 1, 17), 0, "");
    trainingRecords.logAthleteData(athlete, wed, {
        mileage: 4,
        stress: 4,
        sleep: 7,
        restingHeartRate: 50,
        exerciseHeartRate: 145,
        perceivedExertion: 5,
        notes: "Easy run on my own",
    });
    // Thursday - record exists, no athlete log (missing day)
    trainingRecords.createRecord(coach, athlete, createDate(2024, 1, 18), 70, "Easy run");
    // Friday - complete data
    const fri = trainingRecords.createRecord(coach, athlete, createDate(2024, 1, 19), 75, "Easy run");
    trainingRecords.logAthleteData(athlete, fri, {
        mileage: 6,
        stress: 3,
        sleep: 8,
        restingHeartRate: 47,
        exerciseHeartRate: 135,
        perceivedExertion: 4,
    });
    // Saturday - coach plan only (athlete missed logging)
    trainingRecords.createRecord(coach, athlete, createDate(2024, 1, 20), 85, "Long run");
    // Sunday - athlete log only (no coach plan content)
    const sun = trainingRecords.createRecord(coach, athlete, createDate(2024, 1, 21), 0, "");
    trainingRecords.logAthleteData(athlete, sun, {
        mileage: 3,
        stress: 2,
        sleep: 8.5,
        restingHeartRate: 49,
        exerciseHeartRate: 138,
        perceivedExertion: 3,
        notes: "Short shakeout",
    });
    // Display current records
    trainingRecords.displayRecords();
    // Test AI recommendation (week-only analysis)
    console.log("\n🤖 Testing AI recommendation for missing data...");
    try {
        const result = await trainingRecords.summarizeAndRecommend(athlete, llm, weekStart);
        console.log("\n📋 AI Recommendation for missing data:");
        console.log(result.recommendation);
    }
    catch (error) {
        console.error("❌ Error getting AI recommendation:", error.message);
    }
}
/**
 * Main function to run all test cases
 */
async function main() {
    console.log("🏃‍♀️ TrainingRecords AI Augmentation Test Suite");
    console.log("==============================================\n");
    try {
        await testNormalTrainingWeek();
        await testConcerningTrends();
        await testMissingData();
        console.log("\n🎉 All test cases completed!");
    }
    catch (error) {
        console.error("❌ Test error:", error.message);
        process.exit(1);
    }
}
// Run the tests if this file is executed directly
if (require.main === module) {
    main();
}
//# sourceMappingURL=training-records-tests.js.map
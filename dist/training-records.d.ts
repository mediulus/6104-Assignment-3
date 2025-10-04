/**
 * TrainingRecords Concept - AI Augmented Version
 */
import { GeminiLLM } from "./gemini-llm";
export interface User {
    id: string;
    name: string;
    role: "coach" | "athlete";
    teamId?: string;
    mileage?: number;
}
export interface Date {
    year: number;
    month: number;
    day: number;
}
export interface CoachFields {
    percentage: number;
    note: string;
}
export interface AthleteData {
    mileage?: number;
    stress?: number;
    sleep?: number;
    restingHeartRate?: number;
    exerciseHeartRate?: number;
    perceivedExertion?: number;
    notes?: string;
    [key: string]: any;
}
export interface DailyRecord {
    id: string;
    date: Date;
    athlete: User;
    coachRecommendations?: CoachFields;
    athleteData?: AthleteData;
    mileageRecommendation?: number;
    aiRecommendation?: string;
}
export interface WeeklySummary {
    athlete: User;
    weekStart: Date;
    totalMileage: number;
    averageStress: number;
    averageSleep: number;
    averageRestingHeartRate: number;
    averageExerciseHeartRate: number;
    trendDirection: "up" | "down" | "flat";
    previousWeekComparison?: {
        mileageChange: number;
        stressChange: number;
        sleepChange: number;
    };
}
export declare class TrainingRecords {
    private records;
    private users;
    private nextId;
    addUser(user: User): void;
    getUser(id: string): User | undefined;
    private dateToString;
    private getWeekStart;
    private getTotalMileageThisWeek;
    private addDays;
    createRecord(coach: User, athlete: User, date: Date, percentage?: number, note?: string): DailyRecord;
    updateCoachFields(coach: User, record: DailyRecord, percentage?: number, note?: string): DailyRecord;
    logAthleteData(athlete: User, record: DailyRecord, data: AthleteData): DailyRecord;
    getAthleteMileage(athlete: User): number;
    updateAthleteData(athlete: User, record: DailyRecord, data: AthleteData): DailyRecord;
    deleteRecord(actor: User, record: DailyRecord): void;
    private checkMissingCoachData;
    private checkMissingAthleteData;
    computeWeeklySummary(athlete: User, weekStart: Date): WeeklySummary;
    summarizeAndRecommend(athlete: User, llm: GeminiLLM, weekStartDate: Date): Promise<{
        recommendation: string;
    }>;
    private createRecommendationPrompt;
    getRecords(): DailyRecord[];
    getUsers(): User[];
    displayRecords(): void;
}
//# sourceMappingURL=training-records.d.ts.map
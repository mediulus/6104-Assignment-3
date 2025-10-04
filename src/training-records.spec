       concept TrainingRecords:
            **NEW** purpose: Record coach plans and athlete data, compute week-over-week summaries, and—using AI— generate short, factual notes summarizing how an athlete appears to be responding to training. (All data originates from a Google Sheet import; the AI reads the derived weekly summaries.)

            **NEW** principle:  Maintain canonical daily records and derive weekly summaries that power the dashboard. Any automation (e.g., AI notes, reminders) reads from these summaries and produces separate, reviewable outputs; it never modifies training data.

            state:
                a set of DailyRecords with:
                    a date Date
                    an athlete User
                    coachRecommendations {CoachFields}
                    athleteData {AthleteData}
                    mileageRecommendation number
                    **NEW** aiRecommendation String

                a set of CoachFields with:
                    a percentage Number
                    a note String

                a set of AthleteData with
                    a mileage number
                    a stress number
                    a restingHeartRate number
                    an excerciseHeartRate number
                    a perceivedExertion number
                    a notes String

                a WeeklySummary (computed, not stored permanently) with:
                    an athlete User
                    a weekStart Date
                    a totalMileage Number
                    an averageStress Number
                    an averageSleep Number
                    an averageRestingHeartRate Number
                    an averageExerciseHeartRate Number
                    a trendDirection Enum{up, down, flat}
                    a previousWeekComparison {
                        mileageChange Number
                        stressChange Number
                        sleepChange Number
                    }?
        
                
            actions:
                actions (existing unchanged):
                    createRecord(coach: User, athlete: User, date: Date, percentage?: Number, note?: String): (record: DailyRecord)
                    updateCoachFields(coach: User, record: DailyRecord, percentage?: Number, note?: String): (record: DailyRecord)
                    logAthleteData(athlete: User, record: DailyRecord, data: AthleteData): (record: DailyRecord)
                    updateAthleteData(athlete: User, record: DailyRecord, data: AthleteData): (record: DailyRecord)
                    deleteRecord(actor: User, record: DailyRecord)
                    computeWeeklySummary(athlete: User, weekStart: Date): (summary: WeeklySummary)

                NEW action (LLM notes-only):
                    summarizeAndRecommend(athlete: User, weekStart: Date): { recommendation: String }
                        requires:
                            athlete exists
                            computeWeeklySummary(athlete, weekStart) is available
                        effects:
                            - Derives the WeeklySummary for (athlete, weekStart).
                            - Detects missing plan/log days via rule-based checks:
                                * missingCoachData = dates in the week without coachRecommendations
                                * missingAthleteData = dates in the week without athleteData
                            - Calls the LLM with a deterministic prompt to generate ONE short, factual note (<= 200 words)
                            summarizing observations for the week and flagging missing data. No medical advice.
                            - Validators (reject and return error if violated):
                                * length <= 200 words
                                * evidence-only (reference only fields present in WeeklySummary / per-day table)
                                * no medical/prescriptive language; no invented data; respectful tone
                            - On success: stores the same `aiRecommendation` string onto each DailyRecord belonging to
                            (athlete, weekStart..weekStart+6d) for convenient display, and returns { recommendation }.

            syncs:
            UpdateWeeklySummary
                when: WeeklyTick(weekStart, team)
                then: for each athlete on team:
                        computeWeeklySummary(athlete, weekStart)
                        summarizeAndRecommend(athlete, weekStart)

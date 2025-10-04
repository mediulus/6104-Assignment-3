/**
 * LLM Integration for TrainingRecords
 *
 * Handles the AI recommendation functionality using Google's Gemini API.
 */
/**
 * Configuration for API access
 */
export interface Config {
    apiKey: string;
}
export declare class GeminiLLM {
    private apiKey;
    constructor(config: Config);
    executeLLM(prompt: string): Promise<string>;
}
//# sourceMappingURL=gemini-llm.d.ts.map
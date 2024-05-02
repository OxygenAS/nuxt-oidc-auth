export interface ValidationResult<T> {
    valid: boolean;
    missingProperties?: string[];
    config: T;
}
/**
 * Validate a configuration object
 * @param config The configuration object to validate
 * @returns ValidationResult object with the validation result and the validated config stripped of optional properties
 */
export declare function validateConfig<T>(config: T, requiredProps: string[]): ValidationResult<T>;
export declare function generateProviderUrl(baseUrl: string, relativeUrl?: string): string;

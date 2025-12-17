/**
 * Types for the i18n conversion tool
 */

export interface ConversionPattern {
	title: string;
	description: string;
	before: string;
	after: string;
	explanation: string;
}

export interface ConversionGuide {
	id: string;
	title: string;
	description: string;
	purpose: string;
	scope: string;
	implementationChecklist: string[];
	patterns: ConversionPattern[];
	bestPractices: string[];
	commonPitfalls: string[];
	additionalResources: string | string[];
}

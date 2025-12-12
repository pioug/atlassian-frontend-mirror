/**
 * Types for the migration guides tool
 */

export interface MigrationExample {
	title: string;
	description: string;
	before: string;
	after: string;
	explanation: string;
}

export interface MigrationGuide {
	id: string;
	title: string;
	description: string;
	fromPackage: string;
	toPackage: string;
	examples: MigrationExample[];
	bestPractices: string[];
	additionalResources: string;
}

export interface MigrationRegistry {
	[key: string]: MigrationGuide;
}

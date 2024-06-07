/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates Typescript types for analytics events from analytics.spec.yaml
 *
 * @codegen <<SignedSource::c3c6503e4183ef772d7576a979b729b7>>
 * @codegenCommand yarn workspace @atlassian/analytics-tooling run analytics:codegen smart-card
 */
export type PackageMetaDataType = {
	packageName: string;
	packageVersion: string;
};
export type ResolvedAttributesType = {
	status:
		| 'pending'
		| 'resolving'
		| 'resolved'
		| 'errored'
		| 'fallback'
		| 'unauthorized'
		| 'forbidden'
		| 'not_found'
		| null;
	statusDetails: string | null;
	displayCategory: 'smartLink' | 'link';
	extensionKey: string | null;
	destinationProduct: string | null;
	destinationSubproduct: string | null;
	destinationCategory: string | null;
	destinationObjectId: string | null;
	destinationObjectType: string | null;
	destinationContainerId: string | null;
	destinationTenantId: string | null;
	canBeDatasource: boolean | null;
};

export type ButtonClickedAiSummaryAttributesType = {};
export type ButtonClickedCopySummaryAttributesType = {};
export type SummaryViewedAttributesType = {
	fromCache: boolean | null;
};
export type ErrorViewedAiSummaryAttributesType = {};
export type SummarySuccessAttributesType = {};
export type SummaryFailedAttributesType = {
	reason: string | null;
	isSloError: boolean;
};
export type AiInteractionInitiatedAttributesType = {
	aiFeatureName: string;
	proactiveAIGenerated: number;
	userGeneratedAI: number;
};
export type ButtonClickedAutomationActionAttributesType = {};

export type AnalyticsEventAttributes = {
	/**
	 * fired when an ai summary is clicked */
	'ui.button.clicked.aiSummary': ButtonClickedAiSummaryAttributesType;
	/**
	 * fired when the copy ai summary button is clicked */
	'ui.button.clicked.copySummary': ButtonClickedCopySummaryAttributesType;
	/**
	 * fired when a summary is viewed */
	'ui.summary.viewed': SummaryViewedAttributesType;
	/**
	 * fired when a summary error is viewed */
	'ui.error.viewed.aiSummary': ErrorViewedAiSummaryAttributesType;
	/**
	 * fired when a summary request finishes with a successful response */
	'operational.summary.success': SummarySuccessAttributesType;
	/**
	 * fired when a summary request finishes with a failed response */
	'operational.summary.failed': SummaryFailedAttributesType;
	/**
	 * fired when an explicit request is made to use an AI-powered feature */
	'track.aiInteraction.initiated': AiInteractionInitiatedAttributesType;
	/**
	 * fired when the automation action button is clicked */
	'ui.button.clicked.automationAction': ButtonClickedAutomationActionAttributesType;
};

export type EventKey = keyof AnalyticsEventAttributes;

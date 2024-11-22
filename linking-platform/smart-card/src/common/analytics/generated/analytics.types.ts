/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates Typescript types for analytics events from analytics.spec.yaml
 *
 * @codegen <<SignedSource::b25cecd58c98d2c650c7c6c94fdf3c0c>>
 * @codegenCommand yarn workspace @atlassian/analytics-tooling run analytics:codegen smart-card
 */
export type PackageMetaDataContextType = {
	packageName: string;
	packageVersion: string;
};
export type CommonContextType = {
	extensionKey: string | null;
	resourceType: string | null;
	destinationObjectType: string | null;
	destinationSubproduct: string | null;
	destinationProduct: string | null;
	location: string | null;
	statusDetails: string | null;
};
export type ResolvedContextType = {
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
	location: string | null;
	resourceType: string | null;
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
export type ButtonClickedRelatedLinksAttributesType = {};
export type ModalOpenedRelatedLinksAttributesType = {};
export type ModalClosedRelatedLinksAttributesType = {
	dwellTime: number;
};
export type RelatedLinksSuccessAttributesType = {
	incomingCount: number;
	outgoingCount: number;
};
export type RelatedLinksFailedAttributesType = {
	reason: string;
};
export type SmartLinkIframeDwelledAttributesType = {
	id: string;
	display: 'inline' | 'block' | 'embed' | 'embedPreview' | 'flexible' | 'hoverCardPreview';
	definitionId: string | null;
	dwellTime: number;
	dwellPercentVisible: number;
};
export type SmartLinkIframeFocusAttributesType = {
	id: string;
	display: 'inline' | 'block' | 'embed' | 'embedPreview' | 'flexible' | 'hoverCardPreview';
	definitionId: string | null;
};
export type ApplicationAccountConnectedAttributesType = {
	definitionId: string | null;
};
export type ApplicationAccountAuthStartedAttributesType = {};
export type SmartLinkQuickActionStartedAttributesType = {
	smartLinkActionType:
		| 'FollowEntityAction'
		| 'GetStatusTransitionsAction'
		| 'StatusUpdateAction'
		| 'UnfollowEntityAction'
		| 'StatusUpdate';
};
export type SmartLinkQuickActionSuccessAttributesType = {
	smartLinkActionType:
		| 'FollowEntityAction'
		| 'GetStatusTransitionsAction'
		| 'StatusUpdateAction'
		| 'UnfollowEntityAction'
		| 'StatusUpdate';
};
export type SmartLinkQuickActionFailedAttributesType = {
	smartLinkActionType:
		| 'FollowEntityAction'
		| 'GetStatusTransitionsAction'
		| 'StatusUpdateAction'
		| 'UnfollowEntityAction'
		| 'StatusUpdate';
	reason: 'PermissionError' | 'ValidationError' | 'UnknownError' | null;
};
export type ConsentModalViewedAttributesType = {
	definitionId: string | null;
};

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
	/**
	 * fired when the related links action button is clicked */
	'ui.button.clicked.relatedLinks': ButtonClickedRelatedLinksAttributesType;
	/**
	 * fired when related links modal is opened */
	'ui.modal.opened.relatedLinks': ModalOpenedRelatedLinksAttributesType;
	/**
	 * fired when related links modal is closed */
	'ui.modal.closed.relatedLinks': ModalClosedRelatedLinksAttributesType;
	/**
	 * fired when related links are retrieved successfully */
	'operational.relatedLinks.success': RelatedLinksSuccessAttributesType;
	/**
	 * fired when related links retrieval fails */
	'operational.relatedLinks.failed': RelatedLinksFailedAttributesType;
	/**
	 * fired when a user dwells their cursor on a Smart Link's iframe */
	'ui.smartLinkIframe.dwelled': SmartLinkIframeDwelledAttributesType;
	/**
	 * fires when a user clicks or tabs into a Smart Link's iframe. */
	'ui.smartLinkIframe.focus': SmartLinkIframeFocusAttributesType;
	/**
	 * user connecting their account to view a Smart Link. */
	'track.applicationAccount.connected': ApplicationAccountConnectedAttributesType;
	/**
	 * user starting the Smart Link connect account process. */
	'track.applicationAccount.authStarted': ApplicationAccountAuthStartedAttributesType;
	/**
	 * fires event before an action invoke api call is made */
	'track.smartLinkQuickAction.started': SmartLinkQuickActionStartedAttributesType;
	/**
	 * fires a tracking event after an action invoke api call is successful */
	'track.smartLinkQuickAction.success': SmartLinkQuickActionSuccessAttributesType;
	/**
	 * fires a tracking event after an action invoke api call has failed */
	'track.smartLinkQuickAction.failed': SmartLinkQuickActionFailedAttributesType;
	/**
	 * fires an event which represents the connect account page being opened. */
	'screen.consentModal.viewed': ConsentModalViewedAttributesType;
};

export type EventKey = keyof AnalyticsEventAttributes;

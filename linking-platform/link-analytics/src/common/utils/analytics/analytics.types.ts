/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates Typescript types for analytics events from analytics.spec.yaml
 *
 * @codegen <<SignedSource::965311c8f2a4f56a74120b39ebd9ffae>>
 * @codegenCommand yarn workspace @atlassian/analytics-tooling run analytics:codegen link-analytics
 */
export type ExternalContextType = {
	display: 'flexible' | 'inline' | 'url' | 'card' | 'embed';
	location: string;
};
export type ResolvedAttributesType = {
	canBeDatasource: boolean | null;
	destinationActivationId: string | null;
	destinationCategory: string | null;
	destinationContainerId: string | null;
	destinationObjectId: string | null;
	destinationObjectType: string | null;
	destinationProduct: string | null;
	destinationSubproduct: string | null;
	destinationTenantId: string | null;
	displayCategory: 'smartLink' | 'link';
	extensionKey: string | null;
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
};

export type LinkCreatedAttributesType = {
	creationMethod: string;
	sourceEvent: string | null;
};
export type LinkUpdatedAttributesType = {
	sourceEvent: string | null;
	updateMethod: string;
};
export type LinkDeletedAttributesType = {
	deleteMethod: string;
	sourceEvent: string | null;
};
export type MacroInsertedAttributesType = {
	creationMethod: string;
	sourceEvent: string | null;
};
export type DatasourceCreatedAttributesType = {
	creationMethod: string;
	sourceEvent: string | null;
};
export type DatasourceUpdatedAttributesType = {
	sourceEvent: string | null;
	updateMethod: string;
};
export type DatasourceDeletedAttributesType = {
	deleteMethod: string;
	sourceEvent: string | null;
};
export type FireAnalyticEventCommencedAttributesType = {
	action: 'created' | 'updated' | 'deleted';
};
export type FireAnalyticEventFailedAttributesType = {
	action: 'created' | 'updated' | 'deleted';
	error: string;
};

export type AnalyticsEventAttributes = {
	/**
	 * fired when there is an attempt to fire an fireAnalyticEvent */
	'operational.fireAnalyticEvent.commenced': FireAnalyticEventCommencedAttributesType;
	/**
	 * fired when an attempt to fire an fireAnalyticEvent fails */
	'operational.fireAnalyticEvent.failed': FireAnalyticEventFailedAttributesType;
	/**
	 * fired when a datasource is created */
	'track.datasource.created': DatasourceCreatedAttributesType;
	/**
	 * fired when a datasource is deleted */
	'track.datasource.deleted': DatasourceDeletedAttributesType;
	/**
	 * fired when a datasource is updated */
	'track.datasource.updated': DatasourceUpdatedAttributesType;
	/**
	 * fired when a link is created */
	'track.link.created': LinkCreatedAttributesType;
	/**
	 * fired when a link is deleted */
	'track.link.deleted': LinkDeletedAttributesType;
	/**
	 * fired when a link is updated */
	'track.link.updated': LinkUpdatedAttributesType;
	/**
	 * fires when a macro is inserted, initially used for jira datasource */
	'track.macro.inserted': MacroInsertedAttributesType;
};

export type EventKey = keyof AnalyticsEventAttributes;

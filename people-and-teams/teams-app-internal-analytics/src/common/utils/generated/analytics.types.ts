/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates Typescript types for analytics events from analytics.spec.yaml
 *
 * @codegen <<SignedSource::d5728d78d59f2a7bb511dc13bc1e6953>>
 * @codegenCommand yarn workspace @atlassian/analytics-tooling run analytics:codegen teams-app-internal-analytics
 */
export type PackageMetaDataType = {
	packageName: string;
	packageVersion: string;
};

export type ButtonClickedAnalyticsExampleAttributesType = {
	testAttribute: string;
};
export type AutomationTriggeredAnalyticsExampleAttributesType = {
	testAttribute: string;
};
export type AutomationFiredAnalyticsExampleAttributesType = {
	testAttribute: string;
};
export type AnalyticsExampleScreenViewedAttributesType = {
	testAttribute: string;
};

export type AnalyticsEventAttributes = {
	/**
	 * fired when the teams-app-internal-analytics example button is clicked */
	'ui.button.clicked.analyticsExample': ButtonClickedAnalyticsExampleAttributesType;
	/**
	 * fired when the teams-app-internal-analytics example button is clicked */
	'track.automation.triggered.analyticsExample': AutomationTriggeredAnalyticsExampleAttributesType;
	/**
	 * fired when the teams-app-internal-analytics example button is clicked */
	'operational.automation.fired.analyticsExample': AutomationFiredAnalyticsExampleAttributesType;
	/**
	 * fired when the teams-app-internal-analytics example is viewed */
	'screen.analyticsExampleScreen.viewed': AnalyticsExampleScreenViewedAttributesType;
};

export type EventKey = keyof AnalyticsEventAttributes;

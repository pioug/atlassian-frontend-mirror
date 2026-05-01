/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates Typescript types for analytics events from analytics.spec.yaml
 *
 * @codegen <<SignedSource::bf8c5828b0e062cbddf6092143efece2>>
 * @codegenCommand yarn workspace @atlaskit/linking-common run codegen-analytics
 */
export type PackageMetaDataType = {
	packageName: '@atlaskit/linking-common';
	packageVersion: string;
};
export type GetAvailableSitesResolveFailedAttributesType = {
	error: string;
	errorType: string;
	path?: string | null;
	status?: number | null;
	traceId?: string | null;
};
export type AnalyticsEventAttributes = {
	'operational.getAvailableSitesResolve.failed': GetAvailableSitesResolveFailedAttributesType;
};
type CreateEventPayloadResult<K extends keyof AnalyticsEventAttributes> = {
	eventType: string;
	action: string;
	attributes: AnalyticsEventAttributes[K];
	name?: string;
	actionSubject?: string;
	actionSubjectId?: string;
};
function createEventPayload<K extends keyof AnalyticsEventAttributes>(
	eventKey: K,
	attributes: AnalyticsEventAttributes[K],
): CreateEventPayloadResult<K> {
	const [eventType, actionSubject, action, actionSubjectId] = eventKey.split('.') as [
		string,
		string,
		string,
		string | undefined,
	];
	if (eventType === 'screen') {
		return {
			eventType: eventType,
			name: actionSubject,
			action: 'viewed',
			attributes: attributes,
		};
	}
	return {
		eventType: eventType,
		actionSubject: actionSubject,
		actionSubjectId: actionSubjectId,
		action: action,
		attributes: attributes,
	};
}
export default createEventPayload;

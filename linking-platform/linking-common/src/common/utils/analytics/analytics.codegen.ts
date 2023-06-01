/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates Typescript types for analytics events from analytics.spec.yaml
 *
 * @codegen <<SignedSource::6aeaf735bb1855a8d29ca67bd7a680b4>>
 * @codegenCommand yarn workspace @atlaskit/linking-common run codegen-analytics
 */
export type PackageMetaDataType = {
  packageName: '@atlaskit/linking-common';
  packageVersion: string;
};
export type GetAvailableSitesResolveFailedAttributesType = {
  error: string;
};
type AnalyticsEventAttributes = {
  'operational.getAvailableSitesResolve.failed': GetAvailableSitesResolveFailedAttributesType;
};
function createEventPayload<K extends keyof AnalyticsEventAttributes>(
  eventKey: K,
  attributes: AnalyticsEventAttributes[K]
) {
  const event = eventKey.split('.');
  return {
    eventType: event[0],
    actionSubject: event[1],
    action: event[2],
    actionSubjectId: event[3],
    attributes: attributes,
  };
}
export default createEventPayload;

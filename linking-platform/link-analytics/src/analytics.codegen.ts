/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates Typescript types for analytics events from analytics.spec.yaml
 *
 * @codegen <<SignedSource::dd6cfafdb7c85ea6f99e44b971529ea4>>
 * @codegenCommand yarn workspace @atlaskit/link-analytics run codegen-analytics
 */
export type ExternalContextType = {
  location: string;
  display: 'flexible' | 'inline' | 'url' | 'card' | 'embed';
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
  displayCategory: 'smartLink' | 'link';
  extensionKey: string;
  destinationProduct: string;
  destinationSubproduct: string;
  destinationCategory: string;
  destinationObjectId: string;
  destinationObjectType: string;
  destinationContainerId: string;
  destinationTenantId: string;
  urlHash: string;
};
export type LinkCreatedAttributesType = {};
export type LinkUpdatedAttributesType = {};
export type LinkDeletedAttributesType = {};
export type FireAnalyticEventCommencedAttributesType = {
  action: 'created' | 'updated' | 'deleted';
};
export type FireAnalyticEventFailedAttributesType = {
  error: string;
  action: 'created' | 'updated' | 'deleted';
};
type AnalyticsEventAttributes = {
  'track.link.created': LinkCreatedAttributesType;
  'track.link.updated': LinkUpdatedAttributesType;
  'track.link.deleted': LinkDeletedAttributesType;
  'operational.fireAnalyticEvent.commenced': FireAnalyticEventCommencedAttributesType;
  'operational.fireAnalyticEvent.failed': FireAnalyticEventFailedAttributesType;
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

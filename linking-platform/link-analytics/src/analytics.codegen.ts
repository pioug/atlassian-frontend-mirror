/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates Typescript types for analytics events from analytics.spec.yaml
 *
 * @codegen <<SignedSource::bb0b63f2648d8dc8e1a77643c1d22c0d>>
 * @codegenCommand yarn workspace @atlaskit/link-analytics run codegen-analytics
 */
export type ExternalContextType = {
  location: string;
  display: 'flexible' | 'inline' | 'url' | 'card' | 'embed';
};
export type URLAttributesType = {
  urlHash: string;
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
  extensionKey: string | null;
  destinationProduct: string | null;
  destinationSubproduct: string | null;
  destinationCategory: string | null;
  destinationObjectId: string | null;
  destinationObjectType: string | null;
  destinationContainerId: string | null;
  destinationTenantId: string | null;
};
export type LinkCreatedAttributesType = {
  creationMethod: string;
  sourceEvent: string | null;
};
export type LinkUpdatedAttributesType = {
  updateMethod: string;
  sourceEvent: string | null;
};
export type LinkDeletedAttributesType = {
  deleteMethod: string;
  sourceEvent: string | null;
};
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

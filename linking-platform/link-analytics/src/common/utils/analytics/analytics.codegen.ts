/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates Typescript types for analytics events from analytics.spec.yaml
 *
 * @codegen <<SignedSource::096d930f46556a8e77a6362f6a333ab1>>
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
export type DatasourceCreatedAttributesType = {
  creationMethod: string;
  sourceEvent: string | null;
};
export type DatasourceUpdatedAttributesType = {
  updateMethod: string;
  sourceEvent: string | null;
};
export type DatasourceDeletedAttributesType = {
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
  'track.datasource.created': DatasourceCreatedAttributesType;
  'track.datasource.updated': DatasourceUpdatedAttributesType;
  'track.datasource.deleted': DatasourceDeletedAttributesType;
  'operational.fireAnalyticEvent.commenced': FireAnalyticEventCommencedAttributesType;
  'operational.fireAnalyticEvent.failed': FireAnalyticEventFailedAttributesType;
};
function createEventPayload<K extends keyof AnalyticsEventAttributes>(
  eventKey: K,
  attributes: AnalyticsEventAttributes[K]
) {
  const [eventType, actionSubject, action, actionSubjectId] =
    eventKey.split('.');
  if (eventType === 'screen') {
    return {
      eventType,
      name: actionSubject,
      action: 'viewed',
      attributes: attributes,
    };
  }
  return {
    eventType,
    actionSubject,
    actionSubjectId,
    action,
    attributes: attributes,
  };
}
export default createEventPayload;

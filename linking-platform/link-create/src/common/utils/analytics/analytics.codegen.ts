/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates Typescript types for analytics events from analytics.spec.yaml
 *
 * @codegen <<SignedSource::6d7803f5c035dc3cde1be03caa91eb04>>
 * @codegenCommand yarn workspace @atlaskit/link-create run codegen-analytics
 */
export type PackageMetaDataType = {
  packageName: '@atlaskit/link-create';
  packageVersion: string;
  source: 'linkCreate';
  componentName: 'linkCreate';
};
export type LinkCreateAnalyticsContextType = {
  triggeredFrom: string;
  objectName: string;
  appearance: 'modal' | 'popup';
};
export type LinkCreateScreenViewedAttributesType = {};
export type ButtonClickedCreateAttributesType = {};
export type ButtonClickedCancelAttributesType = {};
export type LinkCreateScreenClosedAttributesType = {};
export type LinkCreateUnhandledErrorCaughtAttributesType = {
  browserInfo: string;
  error: string;
  componentStack: string | null;
};
export type ObjectCreatedLinkCreateAttributesType = {
  objectId: string;
  objectType: string;
};
type AnalyticsEventAttributes = {
  'screen.linkCreateScreen.viewed': LinkCreateScreenViewedAttributesType;
  'ui.button.clicked.create': ButtonClickedCreateAttributesType;
  'ui.button.clicked.cancel': ButtonClickedCancelAttributesType;
  'screen.linkCreateScreen.closed': LinkCreateScreenClosedAttributesType;
  'operational.linkCreate.unhandledErrorCaught': LinkCreateUnhandledErrorCaughtAttributesType;
  'track.object.created.linkCreate': ObjectCreatedLinkCreateAttributesType;
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

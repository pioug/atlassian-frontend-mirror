/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates Typescript types for analytics events from analytics.spec.yaml
 *
 * @codegen <<SignedSource::1c6720e63161d16bb99fc183b17d1944>>
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

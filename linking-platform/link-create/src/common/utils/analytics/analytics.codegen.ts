/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates Typescript types for analytics events from analytics.spec.yaml
 *
 * @codegen <<SignedSource::af0139619517f37a8bca32ddb6b7d6e0>>
 * @codegenCommand yarn workspace @atlaskit/link-create run codegen-analytics
 */
export type PackageMetaDataType = {
  packageName: string;
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
export type LinkCreateExitWarningScreenViewedAttributesType = {};
export type ButtonClickedCreateAttributesType = {};
export type ButtonClickedCancelAttributesType = {};
export type ButtonClickedConfirmAttributesType = {};
export type ModalDialogClosedLinkCreateAttributesType = {};
export type LinkCreateUnhandledErrorCaughtAttributesType = {
  browserInfo: string;
  error: string;
  componentStack: string | null;
};
export type ObjectCreatedLinkCreateAttributesType = {
  objectId: string;
  objectType: string;
};
export type ObjectCreateFailedLinkCreateAttributesType = {
  failureType: string;
};
export type AnalyticsEventAttributes = {
  'screen.linkCreateScreen.viewed': LinkCreateScreenViewedAttributesType;
  'screen.linkCreateExitWarningScreen.viewed': LinkCreateExitWarningScreenViewedAttributesType;
  'ui.button.clicked.create': ButtonClickedCreateAttributesType;
  'ui.button.clicked.cancel': ButtonClickedCancelAttributesType;
  'ui.button.clicked.confirm': ButtonClickedConfirmAttributesType;
  'ui.modalDialog.closed.linkCreate': ModalDialogClosedLinkCreateAttributesType;
  'operational.linkCreate.unhandledErrorCaught': LinkCreateUnhandledErrorCaughtAttributesType;
  'track.object.created.linkCreate': ObjectCreatedLinkCreateAttributesType;
  'track.object.createFailed.linkCreate': ObjectCreateFailedLinkCreateAttributesType;
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

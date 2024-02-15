/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates Typescript types for analytics events from analytics.spec.yaml
 *
 * @codegen <<SignedSource::7beb355391f6269c701cf87b0c222d69>>
 * @codegenCommand yarn workspace @atlaskit/link-create run codegen-analytics
 */
export type PackageMetaDataType = {
  packageName: string;
  packageVersion: string;
  component: 'linkCreate';
  componentName: 'linkCreate';
};
export type LinkCreateAnalyticsContextType = {
  triggeredFrom: string;
  objectName: string;
  appearance: 'modal' | 'popup';
};
export type LinkCreateScreenViewedAttributesType = {};
export type LinkCreateEditScreenViewedAttributesType = {};
export type LinkCreateExitWarningScreenViewedAttributesType = {};
export type ButtonClickedCreateAttributesType = {};
export type ButtonClickedEditAttributesType = {};
export type ButtonClickedCancelAttributesType = {};
export type ButtonClickedConfirmAttributesType = {};
export type ModalDialogClosedLinkCreateAttributesType = {};
export type ModalDialogOpenedLinkCreateAttributesType = {};
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
export type LinkCreateExperienceFailedAttributesType = {
  errorType: string | null;
  errorMessage: string | null;
  experienceStatus: 'SUCCEEDED' | 'FAILED';
  previousExperienceStatus: 'STARTED' | 'SUCCEEDED' | 'FAILED';
  path: string | null;
  status: number | null;
  traceId: string | null;
  isSLOFailure: boolean;
};
export type AnalyticsEventAttributes = {
  'screen.linkCreateScreen.viewed': LinkCreateScreenViewedAttributesType;
  'screen.linkCreateEditScreen.viewed': LinkCreateEditScreenViewedAttributesType;
  'screen.linkCreateExitWarningScreen.viewed': LinkCreateExitWarningScreenViewedAttributesType;
  'ui.button.clicked.create': ButtonClickedCreateAttributesType;
  'ui.button.clicked.edit': ButtonClickedEditAttributesType;
  'ui.button.clicked.cancel': ButtonClickedCancelAttributesType;
  'ui.button.clicked.confirm': ButtonClickedConfirmAttributesType;
  'ui.modalDialog.closed.linkCreate': ModalDialogClosedLinkCreateAttributesType;
  'ui.modalDialog.opened.linkCreate': ModalDialogOpenedLinkCreateAttributesType;
  'operational.linkCreate.unhandledErrorCaught': LinkCreateUnhandledErrorCaughtAttributesType;
  'track.object.created.linkCreate': ObjectCreatedLinkCreateAttributesType;
  'track.object.createFailed.linkCreate': ObjectCreateFailedLinkCreateAttributesType;
  'operational.linkCreateExperience.failed': LinkCreateExperienceFailedAttributesType;
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

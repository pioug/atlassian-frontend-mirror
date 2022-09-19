/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates analytics utilities from the package analytics spec yaml
 *
 * @codegen <<SignedSource::05d8b1c9e46066efd0d11fa9d19c32a9>>
 * @codegenCommand yarn workspace @atlaskit/link-picker run codegen-analytics
 */
export type PackageMetaDataType = {
  packageName: '@atlaskit/link-picker';
  packageVersion: string;
  source: 'linkPicker';
  componentName: 'linkPicker';
};
export type LinkPickerAnalyticsContextType = {
  linkState: 'editLink' | 'newLink';
  linkFieldContent: 'url' | 'text_string' | null;
  linkFieldContentInputMethod: 'manual' | 'paste' | 'searchResult' | null;
  linkFieldContentInputSource: string | null;
  displayTextFieldContent: 'text_string' | null;
  displayTextFieldContentInputMethod: 'manual' | 'paste' | null;
};
export type FormSubmittedLinkPickerAttributesType = {};
export type InlineDialogViewedLinkPickerAttributesType = {};
export type InlineDialogClosedLinkPickerAttributesType = {};
export type TextFieldUpdatedLinkFieldAttributesType = {};
export type TextFieldUpdatedDisplayTextFieldAttributesType = {};
export type LinkPickerUnhandledErrorCaughtAttributesType = {
  browserInfo: string;
  error: string;
  componentStack: string | null;
};
export type ResultsResolveFailedAttributesType = {
  error: string;
};
type AnalyticsEventAttributes = {
  'ui.form.submitted.linkPicker': FormSubmittedLinkPickerAttributesType;
  'ui.inlineDialog.viewed.linkPicker': InlineDialogViewedLinkPickerAttributesType;
  'ui.inlineDialog.closed.linkPicker': InlineDialogClosedLinkPickerAttributesType;
  'ui.textField.updated.linkField': TextFieldUpdatedLinkFieldAttributesType;
  'ui.textField.updated.displayTextField': TextFieldUpdatedDisplayTextFieldAttributesType;
  'ui.linkPicker.unhandledErrorCaught': LinkPickerUnhandledErrorCaughtAttributesType;
  'operational.resultsResolve.failed': ResultsResolveFailedAttributesType;
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

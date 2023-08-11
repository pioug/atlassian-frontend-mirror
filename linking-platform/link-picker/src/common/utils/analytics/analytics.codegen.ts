/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates Typescript types for analytics events from analytics.spec.yaml
 *
 * @codegen <<SignedSource::cd5b926575a5c379425d0d72e5339f12>>
 * @codegenCommand yarn workspace @atlaskit/link-picker run codegen-analytics
 */
export type PackageMetaDataType = {
  packageName: string;
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
  tab: string | null;
};
export type FormSubmittedLinkPickerAttributesType = {};
export type InlineDialogViewedLinkPickerAttributesType = {};
export type InlineDialogClosedLinkPickerAttributesType = {};
export type TextFieldUpdatedLinkFieldAttributesType = {};
export type TextFieldUpdatedDisplayTextFieldAttributesType = {};
export type TabViewedAttributesType = {};
export type LinkPickerUnhandledErrorCaughtAttributesType = {
  browserInfo: string;
  error: string;
  componentStack: string | null;
};
export type SearchResultsShownPreQuerySearchResultsAttributesType = {
  resultCount: number;
};
export type SearchResultsShownPostQuerySearchResultsAttributesType = {
  resultCount: number;
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
  'ui.tab.viewed': TabViewedAttributesType;
  'ui.linkPicker.unhandledErrorCaught': LinkPickerUnhandledErrorCaughtAttributesType;
  'ui.searchResults.shown.preQuerySearchResults': SearchResultsShownPreQuerySearchResultsAttributesType;
  'ui.searchResults.shown.postQuerySearchResults': SearchResultsShownPostQuerySearchResultsAttributesType;
  'operational.resultsResolve.failed': ResultsResolveFailedAttributesType;
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

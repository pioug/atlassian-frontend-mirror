/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates analytics utilities from the package analytics spec yaml
 *
 * @codegen <<SignedSource::115bafba068f36f76da67200ee2d08c4>>
 * @codegenCommand yarn workspace @atlaskit/link-picker run codegen-analytics
 */
export type LinkPickerAnalyticsContextType = {
  linkState: 'editLink' | 'newLink';
};
export type FormSubmittedLinkPickerAttributesType = {};
export type InlineDialogViewedLinkPickerAttributesType = {};
export type InlineDialogClosedLinkPickerAttributesType = {};
type AnalyticsEventAttributes = {
  'ui.form.submitted.linkPicker': FormSubmittedLinkPickerAttributesType;
  'ui.inlineDialog.viewed.linkPicker': InlineDialogViewedLinkPickerAttributesType;
  'ui.inlineDialog.closed.linkPicker': InlineDialogClosedLinkPickerAttributesType;
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

/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates analytics utilities from the package analytics spec yaml
 *
 * @codegen <<SignedSource::ffa7ec78cc793f941d06cdb25b07dc8a>>
 * @codegenCommand yarn workspace @atlaskit/link-picker run codegen-analytics
 */
type FormSubmittedLinkPickerAttributesType = {};
type InlineDialogViewedLinkPickerAttributesType = {};
type InlineDialogClosedLinkPickerAttributesType = {};
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

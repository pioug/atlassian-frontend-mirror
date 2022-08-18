/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates analytics utilities from the package analytics spec yaml
 *
 * @codegen <<SignedSource::0cc1b4d9c22b31491ded3e581114ab2c>>
 * @codegenCommand yarn workspace @atlaskit/link-picker run codegen-analytics
 */
type FormSubmittedLinkPickerAttributesType = {};
type AnalyticsEventAttributes = {
  'form.submitted.linkPicker': FormSubmittedLinkPickerAttributesType;
};
function createEventPayload<K extends keyof AnalyticsEventAttributes>(
  eventKey: K,
  attributes: AnalyticsEventAttributes[K]
) {
  const event = eventKey.split('.');
  return {
    eventType: 'ui',
    actionSubject: event[0],
    action: event[1],
    actionSubjectId: event[2],
    attributes: attributes,
  };
}
export default createEventPayload;

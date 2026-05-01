/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates Typescript types for analytics events from analytics.spec.yaml
 *
 * @codegen <<SignedSource::590b9da528f0d0b88cea1feaa1815283>>
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
	linkFieldContent?: 'url' | 'text_string' | null;
	linkFieldContentInputMethod?: 'manual' | 'paste' | 'searchResult' | null;
	linkFieldContentInputSource?: string | null;
	displayTextFieldContent?: 'text_string' | null;
	displayTextFieldContentInputMethod?: 'manual' | 'paste' | null;
	tab?: string | null;
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
	componentStack?: string | null;
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
export type AnalyticsEventAttributes = {
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
type CreateEventPayloadResult<K extends keyof AnalyticsEventAttributes> = {
	eventType: string;
	action: string;
	attributes: AnalyticsEventAttributes[K];
	name?: string;
	actionSubject?: string;
	actionSubjectId?: string;
};
function createEventPayload<K extends keyof AnalyticsEventAttributes>(
	eventKey: K,
	attributes: AnalyticsEventAttributes[K],
): CreateEventPayloadResult<K> {
	const [eventType, actionSubject, action, actionSubjectId] = eventKey.split('.') as [
		string,
		string,
		string,
		string | undefined,
	];
	if (eventType === 'screen') {
		return {
			eventType: eventType,
			name: actionSubject,
			action: 'viewed',
			attributes: attributes,
		};
	}
	return {
		eventType: eventType,
		actionSubject: actionSubject,
		actionSubjectId: actionSubjectId,
		action: action,
		attributes: attributes,
	};
}
export default createEventPayload;

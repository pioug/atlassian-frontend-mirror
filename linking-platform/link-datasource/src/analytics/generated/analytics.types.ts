/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates Typescript types for analytics events from analytics.spec.yaml
 *
 * @codegen <<SignedSource::75446f307933096c01c4784a1d7f2aa9>>
 * @codegenCommand yarn workspace @atlassian/analytics-tooling run analytics:codegen link-datasource
 */
export type PackageMetaDataType = {
  packageName: '@atlaskit/link-datasource';
  packageVersion: string;
};
export type AnalyticsContextType = {
  source: 'datasourceConfigModal' | 'datasourceConfluenceEditor';
};
export type AnalyticsContextAttributesType = {
  dataProvider: 'jira-issues';
};

export type DatasourceModalDialogViewedAttributesType = {};
export type ModalReadyDatasourceAttributesType = {
  instancesCount: number;
};
export type JqlEditorSearchedAttributesType = {};
export type FormSubmittedBasicSearchAttributesType = {};
export type EmptyResultShownDatasourceAttributesType = {};
export type ErrorShownAttributesType = {
  reason: 'network' | 'access';
};

export type AnalyticsEventAttributes = {
  /**
   * Fires when user sees modal dialog. */
  'screen.datasourceModalDialog.viewed': DatasourceModalDialogViewedAttributesType;
  /**
   * Fires when the datasource modal is ready for searching and displaying search results. */
  'ui.modal.ready.datasource': ModalReadyDatasourceAttributesType;
  /**
   * Fires when search is initiated via the search icon or enter key press for jql editor input field. */
  'ui.jqlEditor.searched': JqlEditorSearchedAttributesType;
  /**
   * Fires when search is initiated via the search icon or enter key press from the basic input textfield. */
  'ui.form.submitted.basicSearch': FormSubmittedBasicSearchAttributesType;
  /**
   * Fires when datasource results are empty. */
  'ui.emptyResult.shown.datasource': EmptyResultShownDatasourceAttributesType;
  /**
   * Fires when datasource errors state is shown. */
  'ui.error.shown': ErrorShownAttributesType;
};

export type EventKey = keyof AnalyticsEventAttributes;

/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates Typescript types for analytics events from analytics.spec.yaml
 *
 * @codegen <<SignedSource::05b7b33172b55f75035f0d77317a3f4f>>
 * @codegenCommand yarn workspace @atlassian/analytics-tooling run analytics:codegen link-datasource
 */
export type PackageMetaDataType = {
  packageName: string;
  packageVersion: string;
};
export type AnalyticsContextType = {
  source: 'datasourceConfigModal';
};
export type AnalyticsContextAttributesType = {
  dataProvider: 'jira-issues' | 'jsm-assets';
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
export type ButtonClickedSyncAttributesType = {
  extensionKey: string | null;
  destinationObjectTypes: unknown[];
};
export type ButtonClickedInsertAttributesType = {
  searchCount: number;
  totalItemCount: number;
  displayedColumnCount: number | null;
  display: 'datasource_inline' | 'datasource_table' | 'inline';
  destinationObjectTypes: unknown[];
  searchMethod:
    | 'datasource_search_query'
    | 'datasource_basic_filter'
    | 'datasource_saved_filter'
    | null;
  extensionKey: string | null;
  actions: unknown[];
};
export type ButtonClickedCancelAttributesType = {
  searchCount: number;
  destinationObjectTypes: unknown[];
  extensionKey: string | null;
  actions: unknown[];
};
export type LinkClickedSingleItemAttributesType = {
  extensionKey: string | null;
  destinationObjectTypes: unknown[];
};
export type DatasourceRenderSuccessAttributesType = {
  totalItemCount: number;
  destinationObjectTypes: unknown[];
  displayedColumnCount: number | null;
  extensionKey: string | null;
  display: 'table';
};
export type DatasourceRenderFailureAttributesType = {};
export type NextItemLoadedAttributesType = {
  destinationObjectTypes: unknown[];
  extensionKey: string | null;
  loadedItemCount: number;
};
export type TableViewedDatasourceConfigModalAttributesType = {
  destinationObjectTypes: unknown[];
  totalItemCount: number;
  displayedColumnCount: number | null;
  searchMethod:
    | 'datasource_search_query'
    | 'datasource_basic_filter'
    | 'datasource_saved_filter'
    | null;
  extensionKey: string | null;
};
export type LinkViewedSingleItemAttributesType = {
  destinationObjectTypes: unknown[];
  searchMethod:
    | 'datasource_search_query'
    | 'datasource_basic_filter'
    | 'datasource_saved_filter'
    | null;
  extensionKey: string | null;
};
export type LinkViewedCountAttributesType = {
  destinationObjectTypes: unknown[];
  searchMethod:
    | 'datasource_search_query'
    | 'datasource_basic_filter'
    | 'datasource_saved_filter'
    | null;
  totalItemCount: number;
  extensionKey: string | null;
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
  /**
   * Fired when user clicks on datasource table sync button */
  'ui.button.clicked.sync': ButtonClickedSyncAttributesType;
  /**
   * Fired on insert button click */
  'ui.button.clicked.insert': ButtonClickedInsertAttributesType;
  /**
   * Fired on cancel button click */
  'ui.button.clicked.cancel': ButtonClickedCancelAttributesType;
  /**
   * Fired when user clicks on datasource items */
  'ui.link.clicked.singleItem': LinkClickedSingleItemAttributesType;
  /**
   * Fired when an inserted datasource resolves / renders. */
  'ui.datasource.renderSuccess': DatasourceRenderSuccessAttributesType;
  /**
   * Fired when an inserted datasource fails to render */
  'ui.datasource.renderFailure': DatasourceRenderFailureAttributesType;
  /**
   * Fired when user scrolls to the next page/list of the objects */
  'track.nextItem.loaded': NextItemLoadedAttributesType;
  /**
   * Fired when the datasource results are displayed as table inside of datasource configuration modal */
  'ui.table.viewed.datasourceConfigModal': TableViewedDatasourceConfigModalAttributesType;
  /**
   * Fired when the datasource results are displayed as link(may be smart-link) for a single item */
  'ui.link.viewed.singleItem': LinkViewedSingleItemAttributesType;
  /**
   * Fired when the datasource results are displayed as link( smart-link) in count mode. */
  'ui.link.viewed.count': LinkViewedCountAttributesType;
};

export type EventKey = keyof AnalyticsEventAttributes;

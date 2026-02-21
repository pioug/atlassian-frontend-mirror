import type {
	ByRoleMatcher,
	ByRoleOptions,
	Matcher,
	MatcherOptions,
	RenderResult,
	SelectorMatcherOptions,
	waitForOptions,
} from '@testing-library/react';
import type {
	DisplayViewModes,
	Site,
} from 'packages/linking-platform/link-datasource/src/common/types';
import type {
	DatasourceTableState,
	DatasourceTableStateProps,
} from 'packages/linking-platform/link-datasource/src/hooks/useDatasourceTableState';

import type { JQLEditorProps } from '@atlaskit/jql-editor';

import { type ModalProps, setupFactory } from '../../../../common/__tests__/_utils';
import type { ColumnSizesMap, IssueLikeDataTableViewProps } from '../../../issue-like-table/types';
import {
	type ConfluenceSearchConfigModalProps,
	type ConfluenceSearchDatasourceAdf,
	type ConfluenceSearchDatasourceParameters,
} from '../../types';
import { ConfluenceSearchConfigModal } from '../index';

export const getDefaultParameters: () => ConfluenceSearchDatasourceParameters = () => ({
	cloudId: '67899',
	searchString: '',
});

type InsertArgs = {
	parameters?: ConfluenceSearchDatasourceParameters;
	properties?: ConfluenceSearchDatasourceAdf['attrs']['datasource']['views'][0]['properties'];
	url?: string;
};

const dest = setupFactory<
	ConfluenceSearchDatasourceParameters,
	InsertArgs,
	ConfluenceSearchDatasourceAdf
>(
	'confluence-search',
	ConfluenceSearchConfigModal as React.ForwardRefExoticComponent<
		ModalProps<ConfluenceSearchDatasourceAdf, ConfluenceSearchDatasourceParameters>
	>,
	getDefaultParameters,
	(args) => {
		const {
			cloudId = '67899',
			lastModified,
			lastModifiedFrom,
			lastModifiedTo,
			searchString,
		} = args.parameters || {};

		const adf: ConfluenceSearchDatasourceAdf = {
			type: 'blockCard',
			attrs: {
				url: args?.url,
				datasource: {
					id: 'some-confluence-search-datasource-id',
					parameters: {
						...args.parameters,
						cloudId,
						searchString,
						lastModified,
						lastModifiedFrom,
						lastModifiedTo,
					},
					views: [
						{
							type: 'table',
							properties: args.properties || {
								columns: [{ key: 'myColumn' }],
							},
						},
					],
				},
			},
		};
		return adf;
	},
);
const setup: (args?: {
	columnCustomSizes?: ColumnSizesMap | undefined;
	disableDisplayDropdown?: ConfluenceSearchConfigModalProps['disableDisplayDropdown'];
	disableSiteSelector?: ConfluenceSearchConfigModalProps['disableSiteSelector'];
	dontWaitForSitesToLoad?: boolean;
	hookState?: DatasourceTableState;
	mockSiteDataOverride?:
		| {
				cloudId: string;
				displayName: string;
				url: string;
		  }[]
		| undefined;
	overrideParameters?: ConfluenceSearchConfigModalProps['overrideParameters'];
	parameters?: ConfluenceSearchDatasourceParameters | undefined;
	url?: string | undefined;
	viewMode?: DisplayViewModes;
	visibleColumnKeys?: string[];
	wrappedColumnKeys?: string[] | undefined;
}) => Promise<{
	assertAnalyticsAfterButtonClick: (buttonName: string, payload: any) => Promise<void>;
	assertInsertResult: (
		args: InsertArgs,
		analyticsExpectedOverride?: {
			attributes?: object;
		},
	) => void;
	component: RenderResult<
		typeof import('@testing-library/dom/types/queries'),
		HTMLElement,
		HTMLElement
	>;
	findByLabelText: (
		id: Matcher,
		options?: SelectorMatcherOptions | undefined,
		waitForElementOptions?: waitForOptions | undefined,
	) => Promise<HTMLElement>;
	findByRole: (
		role: ByRoleMatcher,
		options?: ByRoleOptions | undefined,
		waitForElementOptions?: waitForOptions | undefined,
	) => Promise<HTMLElement>;
	findByTestId: (
		id: Matcher,
		options?: MatcherOptions | undefined,
		waitForElementOptions?: waitForOptions | undefined,
	) => Promise<HTMLElement>;
	findByText: (
		id: Matcher,
		options?: SelectorMatcherOptions | undefined,
		waitForElementOptions?: waitForOptions | undefined,
	) => Promise<HTMLElement>;
	getByLabelText: (id: Matcher, options?: SelectorMatcherOptions | undefined) => HTMLElement;
	getByPlaceholderText: (id: Matcher, options?: MatcherOptions | undefined) => HTMLElement;
	getByRole: (role: ByRoleMatcher, options?: ByRoleOptions | undefined) => HTMLElement;
	getByTestId: (id: Matcher, options?: MatcherOptions | undefined) => HTMLElement;
	getByText: (id: Matcher, options?: SelectorMatcherOptions | undefined) => HTMLElement;
	getConfigModalTitleText: () => Promise<string>;
	getLatestIssueLikeTableProps: () => IssueLikeDataTableViewProps;
	getLatestJQLEditorProps: () => JQLEditorProps;
	getSiteSelectorText: () => Promise<string | undefined>;
	onAnalyticFireEvent: jest.Mock<any, any, any>;
	onCancel: jest.Mock<any, any, any>;
	onInsert: jest.Mock<any, any, any>;
	queryByRole: (role: ByRoleMatcher, options?: ByRoleOptions | undefined) => HTMLElement | null;
	queryByTestId: (id: Matcher, options?: MatcherOptions | undefined) => HTMLElement | null;
	queryByText: (id: Matcher, options?: SelectorMatcherOptions | undefined) => HTMLElement | null;
	renderComponent: () => RenderResult<
		typeof import('@testing-library/dom/types/queries'),
		HTMLElement,
		HTMLElement
	>;
	rerender: (ui: React.ReactNode) => void;
	searchWithNewBasic: (keywords?: string) => void;
	searchWithNewJql: (jql?: string) => void;
	selectNewInstanceSite: () => Promise<void>;
	switchMode: (viewMode: DisplayViewModes) => void;
	updateVisibleColumnList: (newVisibleColumns: string[]) => void;
}> = dest.setup;
const getAvailableSites: (product: 'jira' | 'confluence') => Promise<Site[]> =
	dest.getAvailableSites;
const getDefaultHookState: () => DatasourceTableState = dest.getDefaultHookState;
const getErrorHookState: () => DatasourceTableState = dest.getErrorHookState;
const getEmptyHookState: () => DatasourceTableState = dest.getEmptyHookState;
const getInsertAnalyticPayload: <
	T extends
		| {
				attributes?: object;
		  }
		| undefined,
>(
	override: T,
) => {
	_isAnalyticsEvent: boolean;
	_isUIAnalyticsEvent: boolean;
	clone: any;
	context: any;
	fire: any;
	handlers: any;
	hasFired: boolean;
	payload: {
		action: string;
		actionSubject: string;
		actionSubjectId: string;
		eventType: string;
	} & T & {
			attributes: {
				actions: never[];
				destinationObjectTypes: string[];
				display: string;
				displayedColumnCount: number;
				extensionKey: string;
				isQueryComplex?: boolean | undefined;
				searchCount: number;
				searchMethod: null;
				totalItemCount: number;
			};
		};
} = dest.getInsertAnalyticPayload;
const getLoadingHookState: () => DatasourceTableState = dest.getLoadingHookState;
const getSingleResponseItemHookState: (url?: string) => DatasourceTableState =
	dest.getSingleResponseItemHookState;
const getUnauthorisedHookState: () => DatasourceTableState = dest.getUnauthorisedHookState;
const IssueLikeDataTableView: ({
	testId,
	onNextPage,
	onLoadDatasourceDetails,
	items,
	itemIds,
	columns,
	renderItem,
	visibleColumnKeys,
	onVisibleColumnKeysChange,
	columnCustomSizes,
	onColumnResize,
	wrappedColumnKeys,
	onWrappedColumnChange,
	status,
	hasNextPage,
	scrollableContainerHeight,
	extensionKey,
}: IssueLikeDataTableViewProps) => JSX.Element = dest.IssueLikeDataTableView;
const useDatasourceTableState: ({
	datasourceId,
	parameters,
	fieldKeys,
}: DatasourceTableStateProps) => DatasourceTableState = dest.useDatasourceTableState;

export {
	setup,
	getAvailableSites,
	getDefaultHookState,
	getErrorHookState,
	getEmptyHookState,
	getInsertAnalyticPayload,
	getLoadingHookState,
	getSingleResponseItemHookState,
	getUnauthorisedHookState,
	IssueLikeDataTableView,
	useDatasourceTableState,
};

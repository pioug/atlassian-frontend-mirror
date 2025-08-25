import React from 'react';

import {
	fireEvent,
	type queries,
	render,
	type RenderResult,
	waitFor,
} from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { asMock } from '@atlaskit/link-test-helpers/jest';

import { EVENT_CHANNEL } from '../../../../analytics';
import { useAssetsClient, type UseAssetsClientState } from '../../../../hooks/useAssetsClient';
import {
	type DatasourceTableState,
	useDatasourceTableState,
} from '../../../../hooks/useDatasourceTableState';
import {
	type FetchObjectSchemasDetails,
	useObjectSchemas,
	type UseObjectSchemasState,
} from '../../../../hooks/useObjectSchemas';
import {
	useValidateAqlText,
	type UseValidateAqlTextState,
} from '../../../../hooks/useValidateAqlText';
import { type AssetsDatasourceParameters } from '../../types';
import { AssetsConfigModal } from '../index'; // Using async one to test lazy integration at the same time

jest.mock('../../../../hooks/useDatasourceTableState');
jest.mock('../../../../hooks/useAssetsClient');
jest.mock('../../../../hooks/useObjectSchemas');
jest.mock('../../../../hooks/useValidateAqlText');

export const getDefaultParameters: () => AssetsDatasourceParameters = () => ({
	workspaceId: 'some-workspace-id',
	aql: 'some-query',
	schemaId: '123',
});

export const defaultAssetsMeta = {
	destinationObjectTypes: ['assets'],
	extensionKey: 'jsm-cmdb-gateway',
};

export const assetsContext = {
	component: 'datasourceConfigModal',
	source: 'datasourceConfigModal',
	attributes: { dataProvider: 'jsm-assets' },
};

export const getDefaultDataSourceTableHookState: () => DatasourceTableState = () => ({
	reset: jest.fn(),
	status: 'resolved',
	onNextPage: jest.fn(),
	loadDatasourceDetails: jest.fn(),
	hasNextPage: false,
	responseItemIds: ['some-id1', 'some-id2', 'some-id3'],
	responseItems: [
		{
			myColumn: { data: 'some-value' },
			otherColumn: { data: 'other-column-value' },
			myId: { data: 'some-id1' },
		},
		{
			myColumn: { data: 'other-value' },
			otherColumn: { data: 'other-column-other-value' },
			myId: { data: 'some-id2' },
		},
	],
	columns: [
		{ key: 'myColumn', title: 'My Column', type: 'string' },
		{ key: 'otherColumn', title: 'My Other Column', type: 'string' },
		{ key: 'myId', title: 'ID', type: 'string', isIdentity: true },
	],
	defaultVisibleColumnKeys: ['myDefaultColumn', 'otherDefaultColumn'],
	totalCount: 3,
	...defaultAssetsMeta,
});

export const mockFetchObjectSchemasSuccess: FetchObjectSchemasDetails = {
	objectSchemas: [
		{
			id: '123',
			name: 'test schema',
		},
		{
			id: '2',
			name: 'schemaTwo',
		},
	],
	totalObjectSchemas: 2,
};

export const getSingleAssetHookState: () => DatasourceTableState = () => ({
	...getDefaultDataSourceTableHookState(),
	responseItems: [
		{
			key: {
				data: {
					url: 'hello.com',
				},
			},
		},
	],
});

export const getEmptyDatasourceTableHookState: () => DatasourceTableState = () => ({
	columns: [],
	status: 'empty',
	responseItemIds: [],
	responseItems: [],
	hasNextPage: true,
	defaultVisibleColumnKeys: [],
	onNextPage: jest.fn(),
	loadDatasourceDetails: jest.fn(),
	reset: jest.fn(),
	totalCount: undefined,
	destinationObjectTypes: [],
	extensionKey: undefined,
});

export const getErrorDatasourceTableHookState: () => DatasourceTableState = () => ({
	columns: [],
	status: 'rejected',
	responseItemIds: [],
	responseItems: [],
	hasNextPage: true,
	defaultVisibleColumnKeys: [],
	onNextPage: jest.fn(),
	loadDatasourceDetails: jest.fn(),
	reset: jest.fn(),
	totalCount: undefined,
	...defaultAssetsMeta,
});

export const getLoadingDatasourceTableHookState: () => DatasourceTableState = () => ({
	columns: [],
	status: 'loading',
	responseItemIds: [],
	responseItems: [],
	hasNextPage: true,
	defaultVisibleColumnKeys: [],
	onNextPage: jest.fn(),
	loadDatasourceDetails: jest.fn(),
	reset: jest.fn(),
	...defaultAssetsMeta,
});

export const getObjectSchemasDefaultHookState: () => UseObjectSchemasState = () => ({
	fetchObjectSchemas: jest.fn().mockResolvedValue({ objectSchemas: [], totalObjectSchemas: 0 }),
	objectSchemasError: undefined,
	objectSchemasLoading: false,
	objectSchemas: undefined,
	totalObjectSchemas: undefined,
});

export const getAssetsClientDefaultHookState: () => UseAssetsClientState = () => ({
	workspaceId: 'some-workspace-id',
	workspaceError: undefined,
	existingObjectSchema: { name: 'test schema', id: '123' },
	existingObjectSchemaError: undefined,
	objectSchemas: mockFetchObjectSchemasSuccess.objectSchemas,
	objectSchemasError: undefined,
	totalObjectSchemas: mockFetchObjectSchemasSuccess.totalObjectSchemas,
	assetsClientLoading: false,
});

export const getAssetsClientLoadingHookState: () => UseAssetsClientState = () => ({
	workspaceId: undefined,
	workspaceError: undefined,
	existingObjectSchema: undefined,
	existingObjectSchemaError: undefined,
	objectSchemas: undefined,
	objectSchemasError: undefined,
	totalObjectSchemas: undefined,
	assetsClientLoading: true,
});

export const getAssetsClientErrorHookState: ({
	workspaceError,
	existingObjectSchemaError,
	objectSchemasError,
}: {
	existingObjectSchemaError?: Error;
	objectSchemasError?: Error;
	workspaceError?: Error;
}) => UseAssetsClientState = ({
	workspaceError,
	existingObjectSchemaError,
	objectSchemasError,
}) => ({
	workspaceId: undefined,
	workspaceError: workspaceError,
	existingObjectSchema: undefined,
	existingObjectSchemaError: existingObjectSchemaError,
	objectSchemas: undefined,
	objectSchemasError: objectSchemasError,
	totalObjectSchemas: undefined,
	assetsClientLoading: false,
});

export const geValidateAqlTextDefaultHookState: () => UseValidateAqlTextState = () => ({
	lastValidationResult: { type: 'valid', validatedAql: 'valid aql' },
	debouncedValidation: jest.fn().mockResolvedValue(undefined),
	validateAqlText: jest.fn().mockRejectedValue(undefined),
});

export const setup = async (
	args: {
		assetsClientHookState?: UseAssetsClientState;
		datasourceTableHookState?: DatasourceTableState;
		objectSchemasHookState?: UseObjectSchemasState;
		parameters?: AssetsDatasourceParameters;
		validateAqlTextHookState?: UseValidateAqlTextState;
		visibleColumnKeys?: string[];
	} = {},
) => {
	asMock(useDatasourceTableState).mockReturnValue(
		args.datasourceTableHookState || getDefaultDataSourceTableHookState(),
	);
	asMock(useAssetsClient).mockReturnValue(
		args.assetsClientHookState || getAssetsClientDefaultHookState(),
	);
	asMock(useObjectSchemas).mockReturnValue(
		args.objectSchemasHookState || getObjectSchemasDefaultHookState(),
	);
	asMock(useValidateAqlText).mockReturnValue(
		args.validateAqlTextHookState || geValidateAqlTextDefaultHookState(),
	);

	const onCancel = jest.fn();
	const onInsert = jest.fn();
	const onAnalyticFireEvent = jest.fn();

	let renderFunction = render;
	const renderComponent = (): RenderResult<typeof queries, HTMLElement, HTMLElement> =>
		renderFunction(
			<AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
				<IntlProvider locale="en">
					<AssetsConfigModal
						datasourceId={'some-assets-datasource-id'}
						parameters={
							Object.keys(args).includes('parameters') ? args.parameters : getDefaultParameters()
						}
						onCancel={onCancel}
						onInsert={onInsert}
						visibleColumnKeys={
							Object.keys(args).includes('visibleColumnKeys')
								? args.visibleColumnKeys
								: ['myColumn']
						}
					/>
				</IntlProvider>
				,
			</AnalyticsListener>,
		);
	const component = renderComponent();

	// Unfortunately can no longer spread ...renderComponent() due to typing issue
	const { findByRole, findByTestId, getByRole, getByTestId, queryByTestId, getByText } = component;

	const assertAnalyticsAfterButtonClick = async (buttonName: string, payload: any) => {
		const { findByRole } = component;
		(await findByRole('button', { name: buttonName })).click();

		await waitFor(() => {
			expect(onAnalyticFireEvent).toBeFiredWithAnalyticEventOnce(payload, EVENT_CHANNEL);
		});
	};

	const selectNewSchema = async (option: string) => {
		const { findByText } = component;
		const objectSchemaSelect = await findByTestId('assets-datasource-modal--object-schema-select');

		// Open Menu, needs to find the button element to perform click correctly
		fireEvent.click(objectSchemaSelect.children[0]);

		(await findByText(option)).click();
	};

	const searchWithNewAql = (aqlString: string) => {
		// Change the AQL query to something else
		const textInput = getByTestId('assets-datasource-modal--aql-search-input');
		fireEvent.focus(textInput);
		fireEvent.change(textInput, {
			target: { value: aqlString },
		});
	};

	const clickSearchButton = async () => {
		const button = await findByTestId('assets-datasource-modal--aql-search-button');
		await button.click();
	};

	return {
		findByRole,
		getByRole,
		getByTestId,
		queryByTestId,
		getByText,
		component,
		onCancel,
		onInsert,
		onAnalyticFireEvent,
		assertAnalyticsAfterButtonClick,
		selectNewSchema,
		searchWithNewAql,
		clickSearchButton,
	};
};

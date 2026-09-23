import React from 'react';

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { useDatasourceClientExtension } from '@atlaskit/link-client-extension/use-data-source-client-extension';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import type {
	DatasourceDataResponse,
	DatasourceResponseSchemaProperty,
} from '@atlaskit/linking-types/datasource';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { useAssetsClient } from '../../../../hooks/useAssetsClient';
import { useObjectSchemas } from '../../../../hooks/useObjectSchemas';
import { useValidateAqlText } from '../../../../hooks/useValidateAqlText';
import { AssetsConfigModal } from '../index';

jest.mock('../../../../hooks/useAssetsClient');
jest.mock('../../../../hooks/useObjectSchemas');
jest.mock('../../../../hooks/useValidateAqlText');

jest.mock('@atlaskit/link-client-extension/use-data-source-client-extension', () => ({
	...jest.requireActual('@atlaskit/link-client-extension/use-data-source-client-extension'),
	useDatasourceClientExtension: jest.fn(),
}));

const property = (key: string): DatasourceResponseSchemaProperty => ({
	key,
	title: key,
	type: 'string',
});

const dataResponse = ({
	properties,
	defaultProperties,
	items,
}: {
	defaultProperties: string[];
	items: DatasourceDataResponse['data']['items'];
	properties: string[];
}): DatasourceDataResponse => ({
	meta: {
		key: 'jsm-cmdb-gateway',
		access: 'granted',
		auth: [],
		definitionId: 'object-resolver-service',
		visibility: 'restricted',
		extensionKey: 'jsm-cmdb-gateway',
		providerName: 'Assets',
		destinationObjectTypes: ['assets'],
	},
	data: {
		totalCount: items.length,
		items,
		schema: {
			properties: properties.map(property),
			defaultProperties,
		},
	},
});

// This file deliberately does not mock useDatasourceTableState. The modal has to reconcile its
// selection against whatever the hook derives from a real /data response, and the hook narrows the
// response schema to the requested `fields` - so a selection that the edited query no longer
// reports leaves the hook with no columns and no defaults at all. A mocked hook cannot express that.
describe('AssetsConfigModal with the real useDatasourceTableState', () => {
	const getDatasourceData: jest.Mock = jest.fn();
	const getDatasourceDetails: jest.Mock = jest.fn();

	// What the macro was saved with, and what the first response still reports
	const savedColumnKeys = ['myColumn', 'otherColumn'];

	const originalSchemaResponse = dataResponse({
		properties: [...savedColumnKeys, 'myId'],
		defaultProperties: savedColumnKeys,
		items: [{ myColumn: { data: 'a' }, otherColumn: { data: 'b' }, myId: { data: 'id-1' } }],
	});

	beforeEach(() => {
		jest.resetAllMocks();

		asMock(useDatasourceClientExtension).mockReturnValue({
			getDatasourceData,
			getDatasourceDetails,
		});
		asMock(useAssetsClient).mockReturnValue({
			workspaceId: 'some-workspace-id',
			workspaceError: undefined,
			existingObjectSchema: { name: 'test schema', id: '123' },
			existingObjectSchemaError: undefined,
			objectSchemas: [{ name: 'test schema', id: '123' }],
			objectSchemasError: undefined,
			totalObjectSchemas: 1,
			assetsClientLoading: false,
		});
		asMock(useObjectSchemas).mockReturnValue({
			fetchObjectSchemas: jest.fn().mockResolvedValue({ objectSchemas: [], totalObjectSchemas: 0 }),
			objectSchemasError: undefined,
			objectSchemasLoading: false,
			objectSchemas: undefined,
			totalObjectSchemas: undefined,
		});
		asMock(useValidateAqlText).mockReturnValue({
			lastValidationResult: { type: 'valid', validatedAql: 'valid aql' },
			debouncedValidation: jest.fn().mockResolvedValue(undefined),
			validateAqlText: jest.fn().mockRejectedValue(undefined),
		});
	});

	// Every request a test does not set up is a defect, not noise. The hook used to read a column
	// the edited query had stopped reporting as newly selected and refetch for it, which threw away
	// the results already on screen - and rejecting here reproduces the rest of that: an error state
	// and a disabled Update table.
	const respondWith = (...responses: DatasourceDataResponse[]) => {
		responses.forEach((response) => getDatasourceData.mockResolvedValueOnce(response));
		getDatasourceData.mockRejectedValue(new Error('unexpected extra /data request'));
	};

	// A spurious follow-up request lands a tick after the response it reacts to, so the count is
	// only trustworthy once everything has settled
	const settle = async () => {
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 50));
		});
	};

	const setup = async () => {
		const onInsert = jest.fn();

		const { container, findByRole, findByTestId, getByTestId } = render(
			<IntlProvider locale="en">
				<AssetsConfigModal
					datasourceId={'some-assets-datasource-id'}
					parameters={{
						workspaceId: 'some-workspace-id',
						aql: 'name like a',
						schemaId: '123',
						version: '2',
					}}
					onCancel={jest.fn()}
					onInsert={onInsert}
					visibleColumnKeys={savedColumnKeys}
				/>
			</IntlProvider>,
		);

		// Let the first /data request settle so the saved selection is the live one
		await waitFor(() => {
			expect(getDatasourceData).toHaveBeenCalledTimes(1);
		});
		await findByTestId('asset-datasource-table--head');

		// `totalRequests` is both a synchronisation point and an assertion: the recovery path adds a
		// request of its own, and anything beyond that means the hook refetched something it should
		// not have
		const searchWithNewAql = async (aql: string, totalRequests: number) => {
			const textInput = getByTestId('assets-datasource-modal--aql-search-input');
			fireEvent.focus(textInput);
			fireEvent.change(textInput, { target: { value: aql } });

			const searchButton = getByTestId('assets-datasource-modal--aql-search-button');
			await waitFor(() => {
				expect(searchButton).toBeEnabled();
			});
			searchButton.click();

			await waitFor(() => {
				expect(getDatasourceData).toHaveBeenCalledTimes(totalRequests);
			});
			await settle();
			expect(getDatasourceData).toHaveBeenCalledTimes(totalRequests);
		};

		const insert = async () => {
			const insertButton = await findByRole('button', { name: 'Update table' });
			await waitFor(() => {
				expect(insertButton).toBeEnabled();
			});
			insertButton.click();
			await waitFor(() => {
				expect(onInsert).toHaveBeenCalledTimes(1);
			});

			const [insertedAdf] = onInsert.mock.calls[0];
			return insertedAdf.attrs.datasource.views[0].properties.columns.map(
				({ key }: { key: string }) => key,
			);
		};

		return { container, searchWithNewAql, insert };
	};

	const requestedFieldsFor = (callIndex: number) =>
		getDatasourceData.mock.calls[callIndex][1].fields;

	describe('when the edited query reports none of the requested fields', () => {
		it('should fall back to the defaults when the edited query also returns no items', async () => {
			passGate('platform_lp_sllv_preserve_assets_columns');
			// platform_lp_sllv_ux_improvements is what makes the hook apply a schema that came back
			// with no items, which is the path the escalated customer hit
			passGate('platform_lp_sllv_ux_improvements');

			const noResultsResponse = dataResponse({
				properties: ['brandNewColumn', 'myId'],
				defaultProperties: ['brandNewColumn'],
				items: [],
			});
			respondWith(originalSchemaResponse, noResultsResponse, noResultsResponse);

			const { searchWithNewAql, insert } = await setup();
			await searchWithNewAql('objectType = "matches nothing"', 3);

			// The search asks for the preserved selection, and only once the hook reports nothing does
			// the modal start over with a request that lets the schema pick the columns
			expect(requestedFieldsFor(1)).toEqual(savedColumnKeys);
			expect(requestedFieldsFor(2)).toEqual([]);

			const insertedColumnKeys = await insert();
			expect(insertedColumnKeys).toEqual(['brandNewColumn']);
			expect(insertedColumnKeys).not.toEqual(savedColumnKeys);
		});
	});

	// `otherColumn` is gone but `myColumn` survives, so there is a valid selection to narrow to
	const partialOverlapResponse = dataResponse({
		properties: ['myColumn', 'brandNewColumn', 'myId'],
		defaultProperties: ['brandNewColumn'],
		items: [{ myColumn: { data: 'a' }, myId: { data: 'id-3' } }],
	});

	it('should capture and report a11y violations', async () => {
		// No gate forced: this only renders, so nothing here would read it
		respondWith(originalSchemaResponse);

		const { container } = await setup();

		await expect(container).toBeAccessible();
	});

	it('should keep reported columns without refetching dropped columns', async () => {
		passGate('platform_lp_sllv_preserve_assets_columns');
		respondWith(originalSchemaResponse, partialOverlapResponse);

		const { searchWithNewAql, insert } = await setup();
		// Two requests and no more. `otherColumn` is missing from the response items, which the hook
		// used to read as a newly selected column and chase with a third request - clearing the
		// results that had just arrived, and erroring out if that request failed.
		await searchWithNewAql('objectType = "partly the same"', 2);

		expect(requestedFieldsFor(1)).toEqual(savedColumnKeys);
		// The results survived and the table is still usable
		expect(await screen.findByTestId('asset-datasource-table--head')).toBeInTheDocument();
		await expect(insert()).resolves.toEqual(['myColumn']);
	});
});

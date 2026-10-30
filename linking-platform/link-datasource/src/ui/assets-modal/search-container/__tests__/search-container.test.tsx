import React from 'react';

import {
	fireEvent,
	render,
	type RenderOptions,
	screen,
	waitFor,
	within,
} from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import '@atlaskit/link-test-helpers/jest/to-be-fired-with-analytic-event-once';
import { asMock } from '@atlaskit/link-test-helpers/jest/as-mock';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { EVENT_CHANNEL } from '../../../../analytics/constants';
import {
	useValidateAqlText,
	type UseValidateAqlTextState,
} from '../../../../hooks/useValidateAqlText';
import { type ObjectSchema } from '../../../../types/assets/types';
import { AssetsSearchContainer, type InitialSearchData, type SearchContainerProps } from '../index';

jest.mock('../../../../hooks/useValidateAqlText');

const onAnalyticFireEvent = jest.fn();

const AssetsSearchContainerWrapper: RenderOptions<{}>['wrapper'] = ({ children }) => (
	<AnalyticsListener channel={EVENT_CHANNEL} onEvent={onAnalyticFireEvent}>
		<IntlProvider locale="en">{children}</IntlProvider>
	</AnalyticsListener>
);

const mockValidateAqlText = jest.fn();
const mockDebouncedValidation = jest.fn();
const getUseValidateAqlTextDefaultHookState: UseValidateAqlTextState = {
	lastValidationResult: { type: 'valid', validatedAql: 'aql search valid' },
	validateAqlText: mockValidateAqlText,
	debouncedValidation: mockDebouncedValidation,
};

describe('AssetsSearchContainer', () => {
	const searchButtonTestId = 'assets-datasource-modal--aql-search-button';
	const objectSchemaSelectTestId = 'assets-datasource-modal--object-schema-select';
	const validAqlQuery = 'aql search valid';
	const objectSchema: ObjectSchema = {
		id: '1',
		name: 'schemaOne',
	};
	const otherSchema: ObjectSchema = { id: '2', name: 'Customer Assets' };
	const workspaceId = 'workspaceId';
	const mockOnSearch = jest.fn();
	const mockOnCancel = jest.fn();

	const selectSchema = async (name: string) => {
		const objectSchemaSelect = await screen.findByTestId(objectSchemaSelectTestId);
		// Open the menu via the PopupSelect trigger button. Query by role rather than
		// `children[0]`, since Compiled may inject a <style> tag as the first child.
		fireEvent.click(within(objectSchemaSelect).getByRole('button'));
		fireEvent.click((await screen.findAllByText(name))[0]);
	};
	const renderAssetsSearchContainer = async (
		initialSearchData: InitialSearchData,
		props?: Partial<SearchContainerProps>,
	) => {
		let renderFunction = render;
		asMock(useValidateAqlText).mockReturnValue(getUseValidateAqlTextDefaultHookState);
		const renderComponent = () =>
			renderFunction(
				<AssetsSearchContainer
					isSearching={false}
					onSearch={mockOnSearch}
					initialSearchData={initialSearchData}
					workspaceId={workspaceId}
					onCancel={mockOnCancel}
					{...props}
				/>,
				{ wrapper: AssetsSearchContainerWrapper },
			);
		return {
			...renderComponent(),
		};
	};

	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('should render placeholders when initialSearchData is not provided', async () => {
		const { getByPlaceholderText, getByText } = await renderAssetsSearchContainer({
			aql: undefined,
			objectSchema: undefined,
			objectSchemas: undefined,
		});
		await waitFor(() => {
			expect(getByText('Select schema')).toBeInTheDocument();
			expect(getByPlaceholderText('Search via AQL')).toBeInTheDocument();
		});
	});

	it('should render inputs with values when initialSearchData is provided', async () => {
		const { getByDisplayValue, getByTestId } = await renderAssetsSearchContainer({
			aql: validAqlQuery,
			objectSchema: objectSchema,
			objectSchemas: [objectSchema],
		});
		const objectSchemaSelectValue = getByTestId(objectSchemaSelectTestId);
		await waitFor(() => {
			expect(objectSchemaSelectValue).toHaveTextContent(objectSchema.name);
			expect(getByDisplayValue(validAqlQuery)).toBeInTheDocument();
		});
	});

	it('should call onSearch when aql and object schema are valid', async () => {
		const { findByTestId } = await renderAssetsSearchContainer({
			aql: validAqlQuery,
			objectSchema: objectSchema,
			objectSchemas: [objectSchema],
		});
		const button = await findByTestId(searchButtonTestId);
		await button.click();
		await waitFor(() => {
			expect(mockOnSearch).toHaveBeenCalledTimes(1);
			expect(mockOnSearch).toHaveBeenCalledWith(validAqlQuery, objectSchema.id);
		});
	});

	it('should fire "ui.aqlEditor.searched" only once when form submitted', async () => {
		const { findByTestId } = await renderAssetsSearchContainer({
			aql: validAqlQuery,
			objectSchema: objectSchema,
			objectSchemas: [objectSchema],
		});
		const button = await findByTestId(searchButtonTestId);
		await button.click();
		// Can't use toBeFiredWithAnalyticEventOnce unless useMock from @atlaskit/link-test-helpers/jest is imported
		await waitFor(() => {
			expect(onAnalyticFireEvent).toHaveBeenCalledWith(
				expect.objectContaining({
					payload: expect.objectContaining({
						action: 'searched',
						actionSubject: 'aqlEditor',
						eventType: 'ui',
					}),
				}),
				EVENT_CHANNEL,
			);
		});
	});

	it('should not call onSearch when aql is valid and object schema is undefined', async () => {
		const { findByTestId } = await renderAssetsSearchContainer({
			aql: validAqlQuery,
			objectSchema: undefined,
			objectSchemas: undefined,
		});
		const button = await findByTestId(searchButtonTestId);
		await button.click();
		await waitFor(() => {
			expect(mockOnSearch).not.toHaveBeenCalled();
		});
	});

	describe('searching the selected schema by default', () => {
		const aqlInputTestId = 'assets-datasource-modal--aql-search-input';

		it('should fill in the AQL and search when a schema is selected with an empty query', async () => {
			passGate('platform_lp_sllv_assets_default_schema_aql');
			await renderAssetsSearchContainer({
				aql: undefined,
				objectSchema: undefined,
				objectSchemas: [objectSchema, otherSchema],
			});

			await selectSchema(otherSchema.name);

			await waitFor(() => {
				expect(screen.getByTestId(aqlInputTestId)).toHaveValue('objectSchema = "Customer Assets"');
			});
			expect(mockOnSearch).toHaveBeenCalledTimes(1);
			expect(mockOnSearch).toHaveBeenCalledWith('objectSchema = "Customer Assets"', otherSchema.id);
		});

		it('should replace the default AQL and search again when a different schema is selected', async () => {
			passGate('platform_lp_sllv_assets_default_schema_aql');
			await renderAssetsSearchContainer({
				aql: undefined,
				objectSchema: undefined,
				objectSchemas: [objectSchema, otherSchema],
			});

			await selectSchema(objectSchema.name);
			await waitFor(() => {
				expect(screen.getByTestId(aqlInputTestId)).toHaveValue('objectSchema = "schemaOne"');
			});

			await selectSchema(otherSchema.name);
			await waitFor(() => {
				expect(screen.getByTestId(aqlInputTestId)).toHaveValue('objectSchema = "Customer Assets"');
			});
			expect(mockOnSearch).toHaveBeenCalledTimes(2);
			expect(mockOnSearch).toHaveBeenLastCalledWith(
				'objectSchema = "Customer Assets"',
				otherSchema.id,
			);
		});

		it('should replace a saved default AQL when editing an existing table and switching schema', async () => {
			passGate('platform_lp_sllv_assets_default_schema_aql');
			await renderAssetsSearchContainer({
				aql: 'objectSchema = "schemaOne"',
				objectSchema: objectSchema,
				objectSchemas: [objectSchema, otherSchema],
			});

			await selectSchema(otherSchema.name);

			await waitFor(() => {
				expect(screen.getByTestId(aqlInputTestId)).toHaveValue('objectSchema = "Customer Assets"');
			});
			expect(mockOnSearch).toHaveBeenCalledWith('objectSchema = "Customer Assets"', otherSchema.id);
		});

		it('should not fill in the AQL or search when the gate is off', async () => {
			failGate('platform_lp_sllv_assets_default_schema_aql');
			await renderAssetsSearchContainer({
				aql: undefined,
				objectSchema: undefined,
				objectSchemas: [objectSchema, otherSchema],
			});

			await selectSchema(otherSchema.name);

			expect(screen.getByTestId(aqlInputTestId)).toHaveValue('');
			expect(mockOnSearch).not.toHaveBeenCalled();
		});
	});

	describe('table UI uplift header layout (astral_assets_macro_table_ui_uplift)', () => {
		const configPopupTriggerName = 'Configure table';
		const closeButtonName = 'Close Modal';
		const insertObjectsLabel = 'Insert objects from:';
		const modalTitleText = 'Assets table macro configuration';
		const modalTitle = <h1>{modalTitleText}</h1>;

		describe('when the gate is on', () => {
			beforeEach(() => {
				passGate('astral_assets_macro_table_ui_uplift');
			});

			it('should render the modal title, "Insert objects from" label, schema select, config popup trigger and close button', async () => {
				await renderAssetsSearchContainer(
					{ aql: undefined, objectSchema, objectSchemas: [objectSchema] },
					{ modalTitle },
				);

				expect(screen.getByText(modalTitleText)).toBeInTheDocument();
				expect(screen.getByText(insertObjectsLabel)).toBeInTheDocument();
				expect(screen.getByRole('heading', { level: 2, name: 'Filter' })).toBeInTheDocument();
				expect(screen.getByTestId(objectSchemaSelectTestId)).toHaveTextContent(objectSchema.name);
				expect(screen.getByRole('button', { name: configPopupTriggerName })).toBeInTheDocument();
				expect(screen.getByRole('button', { name: closeButtonName })).toBeInTheDocument();
			});

			it('should render the "Insert objects from" label immediately before the schema select', async () => {
				await renderAssetsSearchContainer({
					aql: undefined,
					objectSchema,
					objectSchemas: [objectSchema],
				});

				const label = screen.getByText(insertObjectsLabel);
				const objectSchemaSelect = screen.getByTestId(objectSchemaSelectTestId);
				expect(
					label.compareDocumentPosition(objectSchemaSelect) & Node.DOCUMENT_POSITION_FOLLOWING,
				).toBeTruthy();
			});

			it('should open the config popup when the trigger is clicked', async () => {
				await renderAssetsSearchContainer({
					aql: undefined,
					objectSchema,
					objectSchemas: [objectSchema],
				});

				fireEvent.click(screen.getByRole('button', { name: configPopupTriggerName }));

				expect(
					await screen.findByRole('dialog', { name: configPopupTriggerName }),
				).toBeInTheDocument();
			});

			it('should call onCancel when the close button is clicked', async () => {
				await renderAssetsSearchContainer({
					aql: undefined,
					objectSchema,
					objectSchemas: [objectSchema],
				});

				fireEvent.click(screen.getByRole('button', { name: closeButtonName }));

				expect(mockOnCancel).toHaveBeenCalledTimes(1);
			});

			it('should still wire onSchemaChange so selecting a schema searches by default', async () => {
				passGate('platform_lp_sllv_assets_default_schema_aql');
				await renderAssetsSearchContainer({
					aql: undefined,
					objectSchema: undefined,
					objectSchemas: [objectSchema, otherSchema],
				});

				await selectSchema(otherSchema.name);

				await waitFor(() => {
					expect(mockOnSearch).toHaveBeenCalledWith(
						'objectSchema = "Customer Assets"',
						otherSchema.id,
					);
				});
			});

			it('should capture and report a11y violations', async () => {
				const { container } = await renderAssetsSearchContainer(
					{ aql: validAqlQuery, objectSchema, objectSchemas: [objectSchema] },
					{ modalTitle },
				);
				await expect(container).toBeAccessible();
			});
		});
	});

	it('should capture and report a11y violations', async () => {
		const { container } = await renderAssetsSearchContainer({
			aql: validAqlQuery,
			objectSchema: undefined,
			objectSchemas: undefined,
		});
		await expect(container).toBeAccessible();
	});
});

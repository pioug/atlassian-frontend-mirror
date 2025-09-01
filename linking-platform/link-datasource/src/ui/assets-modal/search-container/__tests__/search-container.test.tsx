import React from 'react';

import { render, type RenderOptions, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { asMock } from '@atlaskit/link-test-helpers/jest';

import { EVENT_CHANNEL } from '../../../../analytics';
import {
	useValidateAqlText,
	type UseValidateAqlTextState,
} from '../../../../hooks/useValidateAqlText';
import { type ObjectSchema } from '../../../../types/assets/types';
import { AssetsSearchContainer, type InitialSearchData } from '../index';

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
	const workspaceId = 'workspaceId';
	const mockOnSearch = jest.fn();
	const mockOnCancel = jest.fn();
	const renderAssetsSearchContainer = async (initialSearchData: InitialSearchData) => {
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

	it('should capture and report a11y violations', async () => {
		const { container } = await renderAssetsSearchContainer({
			aql: validAqlQuery,
			objectSchema: undefined,
			objectSchemas: undefined,
		});
		await expect(container).toBeAccessible();
	});
});

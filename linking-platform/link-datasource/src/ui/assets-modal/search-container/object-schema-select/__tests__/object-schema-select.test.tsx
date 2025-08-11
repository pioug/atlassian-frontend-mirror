import React from 'react';

import {
	act,
	fireEvent,
	render,
	type RenderOptions,
	screen,
	waitFor,
} from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import Form from '@atlaskit/form';
import { asMock } from '@atlaskit/link-test-helpers/jest';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import {
	type FetchObjectSchemasDetails,
	useObjectSchemas,
	type UseObjectSchemasState,
} from '../../../../../hooks/useObjectSchemas';
import { type ObjectSchema } from '../../../../../types/assets/types';
import { AssetsObjectSchemaSelect, SEARCH_DEBOUNCE_MS } from '../index';

jest.mock('../../../../../hooks/useObjectSchemas');

const onSubmitMock = jest.fn();

const formWrapper: RenderOptions<{}>['wrapper'] = ({ children }) => (
	<IntlProvider locale="en">
		<Form onSubmit={onSubmitMock}>
			{({ formProps }) => (
				<form data-testid="object-schema-select-form" {...formProps}>
					{children}
				</form>
			)}
		</Form>
	</IntlProvider>
);

describe('AssetsObjectSchemaSelect', () => {
	// React Select does not work with testId
	const objectSchemaSelectInput = 'assets-datasource-modal--object-schema-select__input';
	const objectSchemaSelectButton = 'assets-datasource-modal--object-schema-select';
	const workspaceId = 'workspaceId';
	const mockFetchObjectSchemas = jest.fn();
	const mockUseObjectSchemas = asMock(useObjectSchemas);
	const getUseObjectSchemasDefaultHookState: UseObjectSchemasState = {
		objectSchemasError: undefined,
		objectSchemas: undefined,
		totalObjectSchemas: undefined,
		objectSchemasLoading: false,
		fetchObjectSchemas: mockFetchObjectSchemas,
	};

	const mockFetchObjectSchemasSuccess: FetchObjectSchemasDetails = {
		objectSchemas: [
			{
				id: '1',
				name: 'schemaOne',
			},
			{
				id: '2',
				name: 'schemaTwo',
			},
		],
		totalObjectSchemas: 2,
	};

	const renderDefaultObjectSchemaSelect = async (initialObjectSchemas?: ObjectSchema[]) => {
		let renderFunction = render;
		const renderComponent = () =>
			renderFunction(
				<AssetsObjectSchemaSelect
					workspaceId={workspaceId}
					initialObjectSchemas={initialObjectSchemas}
					value={undefined}
				/>,
				{ wrapper: formWrapper },
			);
		// Have to wrap in act due to state update on mount
		await act(async () => {
			renderComponent();
		});
		return;
	};

	beforeEach(() => {
		jest.resetAllMocks();
		jest.useFakeTimers();
		mockUseObjectSchemas.mockReturnValue(getUseObjectSchemasDefaultHookState);
		mockFetchObjectSchemas.mockResolvedValue(mockFetchObjectSchemasSuccess);
	});

	afterEach(() => {
		jest.clearAllTimers();
	});

	it('should not call fetchObjectSchemas on mount', async () => {
		await renderDefaultObjectSchemaSelect();
		await waitFor(() => {
			expect(mockFetchObjectSchemas).not.toHaveBeenCalled();
		});
	});

	ffTest.on('linking-platform-assests-schema-selector-refresh', '', () => {
		it('should debounce fetching object schemas when searching', async () => {
			await renderDefaultObjectSchemaSelect();
			const schemaSelector = (await screen.findByTestId(objectSchemaSelectButton)).children[0];
			fireEvent.click(schemaSelector);
			const selectInput = await screen.findByRole('combobox');
			fireEvent.change(selectInput, { target: { value: 'test' } });
			fireEvent.change(selectInput, { target: { value: 'test updated' } });
			expect(mockFetchObjectSchemas).toHaveBeenCalledTimes(0);
			jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
			await waitFor(() => {
				expect(mockFetchObjectSchemas).toHaveBeenCalledTimes(1);
				expect(mockFetchObjectSchemas).toHaveBeenCalledWith('test updated');
			});
		});
	});

	ffTest.off('linking-platform-assests-schema-selector-refresh', '', () => {
		it('should debounce fetching object schemas when searching', async () => {
			await renderDefaultObjectSchemaSelect();
			const selectInput = document.getElementsByClassName(objectSchemaSelectInput)[0];
			fireEvent.change(selectInput, { target: { value: 'test' } });
			fireEvent.change(selectInput, { target: { value: 'test updated' } });
			expect(mockFetchObjectSchemas).toHaveBeenCalledTimes(0);
			jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
			await waitFor(() => {
				expect(mockFetchObjectSchemas).toHaveBeenCalledTimes(1);
				expect(mockFetchObjectSchemas).toHaveBeenCalledWith('test updated');
			});
		});
	});

	describe('field validation', () => {
		it('should call onSubmit when schema is valid', async () => {
			await renderDefaultObjectSchemaSelect(mockFetchObjectSchemasSuccess.objectSchemas);
			const selectInput = document.getElementsByClassName(objectSchemaSelectInput)[0];
			fireEvent.focus(selectInput);
			fireEvent.keyDown(selectInput, {
				key: 'ArrowDown',
				keyCode: 40,
				code: 40,
			});
			const selectOption = await screen.findAllByText('schemaTwo');
			fireEvent.click(selectOption[0]);
			fireEvent.submit(screen.getByTestId('object-schema-select-form'));
			expect(onSubmitMock).toHaveBeenCalled();
		});

		it('should not call onSubmit when schema is empty', async () => {
			await renderDefaultObjectSchemaSelect();
			fireEvent.submit(screen.getByTestId('object-schema-select-form'));
			expect(onSubmitMock).not.toHaveBeenCalled();
		});
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<AssetsObjectSchemaSelect
				workspaceId={workspaceId}
				initialObjectSchemas={undefined}
				value={undefined}
			/>,
			{ wrapper: formWrapper },
		);

		await expect(container).toBeAccessible();
	});
});

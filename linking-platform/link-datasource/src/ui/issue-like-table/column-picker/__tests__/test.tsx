import React from 'react';

import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import invariant from 'tiny-invariant';

import { type DatasourceResponseSchemaProperty } from '@atlaskit/linking-types';
import { type ConcurrentExperience } from '@atlaskit/ufo';

import { DatasourceExperienceIdProvider } from '../../../../contexts/datasource-experience-id';
import { SELECT_ITEMS_MAXIMUM_THRESHOLD } from '../concatenated-menu-list';
import { ColumnPicker } from '../index';

const CSS_PREFIX = 'column-picker-popup';
const OPTION_CLASS = `.${CSS_PREFIX}__option`;
const OPTION_LIST_CLASS = `.${CSS_PREFIX}__menu-list`;
const OPTION_SELECTED_CLASS = `${OPTION_CLASS}--is-selected`;
const mockOnChange = jest.fn();

const mockUfoStart = jest.fn();
const mockUfoSuccess = jest.fn();

jest.mock('@atlaskit/ufo', () => ({
	__esModule: true,
	...jest.requireActual<object>('@atlaskit/ufo'),
	ConcurrentExperience: jest.fn().mockImplementation(
		(): Partial<ConcurrentExperience> => ({
			getInstance: jest.fn().mockImplementation(() => ({
				start: mockUfoStart,
				success: mockUfoSuccess,
			})),
		}),
	),
}));

const renderColumnPicker = (
	columns: DatasourceResponseSchemaProperty[],
	selectedColumnKeys: string[],
) => {
	const columnPickerRender = render(
		<DatasourceExperienceIdProvider>
			<IntlProvider locale="en">
				<ColumnPicker
					columns={columns}
					onSelectedColumnKeysChange={mockOnChange}
					selectedColumnKeys={selectedColumnKeys}
				/>
			</IntlProvider>
		</DatasourceExperienceIdProvider>,
	);

	const openPopUpMenu = () =>
		fireEvent.click(columnPickerRender.getByTestId('column-picker-trigger-button'));

	return { ...columnPickerRender, openPopUpMenu };
};

describe('Column picker', () => {
	it('should have specific html element id', async () => {
		const { openPopUpMenu } = renderColumnPicker([], []);

		await waitFor(() => {
			openPopUpMenu();

			expect(document.getElementById('column-picker-popup')).not.toBeNull();
		});
	});

	it('should have correct default checked and unchecked checkboxes based on the columns info passed in', async () => {
		const columns: DatasourceResponseSchemaProperty[] = [
			{
				key: 'type',
				type: 'icon',
				title: 'Type',
			},
			{
				key: 'blah',
				type: 'string',
				title: 'Blah',
			},
		];

		const selectedColumnKeys: string[] = ['type'];

		const { openPopUpMenu, getByText } = renderColumnPicker(columns, selectedColumnKeys);

		await waitFor(() => {
			openPopUpMenu();

			expect(getByText('Type').closest(OPTION_SELECTED_CLASS)).not.toBeNull();
			expect(getByText('Blah').closest(OPTION_SELECTED_CLASS)).toBeNull();
		});
	});

	it('should call onChange with correct parameters if a checkbox is clicked', async () => {
		const columns: DatasourceResponseSchemaProperty[] = [
			{
				key: 'type',
				type: 'icon',
				title: 'Type',
			},
			{
				key: 'blah',
				type: 'string',
				title: 'Blah',
			},
		];

		const selectedColumnKeys: string[] = ['type'];

		const { openPopUpMenu, getByText } = renderColumnPicker(columns, selectedColumnKeys);

		await waitFor(() => {
			openPopUpMenu();

			const checkbox = getByText('Blah').closest(OPTION_CLASS);
			invariant(checkbox);
			fireEvent.click(checkbox);

			expect(mockOnChange).toHaveBeenCalledTimes(1);
			expect(mockOnChange).toHaveBeenCalledWith(['type', 'blah']);
		});
	});

	it('should disable the checkbox if only 1 is passed in and is selected', async () => {
		const columns: DatasourceResponseSchemaProperty[] = [
			{
				key: 'type',
				type: 'icon',
				title: 'Type',
			},
		];

		const selectedColumnKeys: string[] = ['type'];

		const { openPopUpMenu, getByText } = renderColumnPicker(columns, selectedColumnKeys);

		await waitFor(() => {
			openPopUpMenu();

			const checkbox = getByText('Type').closest(OPTION_CLASS);
			expect(checkbox).toHaveClass('column-picker-popup__option--is-disabled');
		});
	});

	it('should disable last checked checkbox when there are multiple options and they are all deselected', async () => {
		const columns: DatasourceResponseSchemaProperty[] = [
			{
				key: 'type',
				type: 'icon',
				title: 'Type',
			},
			{
				key: 'blah',
				type: 'string',
				title: 'Blah',
			},
			{
				key: 'cool',
				type: 'string',
				title: 'Cool',
			},
		];

		const selectedColumnKeys: string[] = ['type'];

		const { openPopUpMenu, getByText } = renderColumnPicker(columns, selectedColumnKeys);

		await waitFor(() => {
			openPopUpMenu();

			const typeCheckbox = getByText('Type').closest(OPTION_CLASS);
			expect(typeCheckbox).toHaveClass('column-picker-popup__option--is-disabled');
		});
	});

	it('should bring all selected options to the top when opening the popup', async () => {
		const columns: DatasourceResponseSchemaProperty[] = [
			{
				key: 'matt',
				type: 'icon',
				title: 'Matt',
			},
			{
				key: 'tom',
				type: 'string',
				title: 'Tom',
			},
			{
				key: 'bob',
				type: 'string',
				title: 'Bob',
			},
			{
				key: 'john',
				type: 'string',
				title: 'John',
			},
		];

		const selectedColumnKeys: string[] = ['tom', 'john'];

		const { openPopUpMenu, getByText } = renderColumnPicker(columns, selectedColumnKeys);

		await waitFor(() => {
			openPopUpMenu();

			const popupList = getByText('Matt').closest(OPTION_LIST_CLASS);
			expect(popupList).toHaveTextContent('TomJohnMattBob');
		});
	});

	it('should show loading text when no columns are passed', async () => {
		const { openPopUpMenu, getByText } = renderColumnPicker([], []);

		await waitFor(() => {
			openPopUpMenu();

			expect(getByText('Loading...')).not.toBeNull();
		});
	});

	it('should focus the search input when opened and options are passed in', async () => {
		const columns: DatasourceResponseSchemaProperty[] = [
			{
				key: 'matt',
				type: 'icon',
				title: 'Matt',
			},
			{
				key: 'tom',
				type: 'string',
				title: 'Tom',
			},
			{
				key: 'bob',
				type: 'string',
				title: 'Bob',
			},
			{
				key: 'john',
				type: 'string',
				title: 'John',
			},
		];

		const selectedColumnKeys: string[] = ['tom', 'john'];
		const { openPopUpMenu, getByRole } = renderColumnPicker(columns, selectedColumnKeys);

		await waitFor(() => {
			openPopUpMenu();

			expect(getByRole('combobox')).toHaveFocus();
		});
	});

	const generateBunchOfItems = (numOfItems: number): DatasourceResponseSchemaProperty[] => [
		{
			key: 'matt',
			type: 'icon',
			title: 'Matt',
		},
		{
			key: 'john',
			type: 'string',
			title: 'John',
		},
		...Array(numOfItems - 2)
			.fill(null)
			.map<DatasourceResponseSchemaProperty>((_, i) => ({
				key: `option_${
					i + 2 /* Default ones at the front */ + 1 /* To make counting start with 1 instead of 0 */
				}`,
				type: 'string',
				title: `Option ${i + 2 + 1}`,
			})),
	];

	it(`should not show limit reached explaination if less than ${SELECT_ITEMS_MAXIMUM_THRESHOLD} items are listed`, async () => {
		const columns = generateBunchOfItems(SELECT_ITEMS_MAXIMUM_THRESHOLD - 1);

		const { openPopUpMenu, findByText } = renderColumnPicker(columns, []);

		await waitFor(
			async () => {
				openPopUpMenu();

				const popupList = (await findByText('Matt')).closest(OPTION_LIST_CLASS);
				invariant(popupList);
				// The +1 is for compiled css style element being inserted
				expect(popupList.children).toHaveLength(SELECT_ITEMS_MAXIMUM_THRESHOLD - 1 + 1);
				expect((popupList.children[popupList.children.length - 1] as HTMLElement).innerText).toBe(
					`Option ${SELECT_ITEMS_MAXIMUM_THRESHOLD - 1}`,
				);
			},
			{ timeout: 20000 },
		); // 20sec timeout
	});

	it(`should list only first ${SELECT_ITEMS_MAXIMUM_THRESHOLD} items and explanation at the end`, async () => {
		const columns = generateBunchOfItems(SELECT_ITEMS_MAXIMUM_THRESHOLD + 20);

		const { openPopUpMenu, findByText } = renderColumnPicker(columns, []);

		await waitFor(async () => {
			openPopUpMenu();

			const popupList = (await findByText('Matt')).closest(OPTION_LIST_CLASS);
			invariant(popupList);
			// The +2 is for compiled css style element being inserted
			expect(popupList.children).toHaveLength(SELECT_ITEMS_MAXIMUM_THRESHOLD + 1 + 2);
			expect((popupList.children[popupList.children.length - 1] as HTMLElement).innerText).toBe(
				'Your search returned too many results.Try again with more specific keywords.',
			);
		});
	});

	describe('UFO metrics: ColumnPicker', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		it('should mark UFO experience as successful when columns are loaded', async () => {
			const columns: DatasourceResponseSchemaProperty[] = [
				{
					key: 'matt',
					type: 'icon',
					title: 'Matt',
				},
				{
					key: 'tom',
					type: 'string',
					title: 'Tom',
				},
				{
					key: 'bob',
					type: 'string',
					title: 'Bob',
				},
				{
					key: 'john',
					type: 'string',
					title: 'John',
				},
			];

			const selectedColumnKeys: string[] = ['tom', 'john'];
			const { openPopUpMenu } = renderColumnPicker(columns, selectedColumnKeys);

			await act(() => {
				openPopUpMenu();
			});

			expect(mockUfoSuccess).toHaveBeenCalled();
		});

		it('should not mark UFO experience as successful when columns are not loaded', async () => {
			const { openPopUpMenu } = renderColumnPicker([], []);

			await act(() => {
				openPopUpMenu();
			});

			expect(mockUfoSuccess).not.toHaveBeenCalled();
		});
	});
});

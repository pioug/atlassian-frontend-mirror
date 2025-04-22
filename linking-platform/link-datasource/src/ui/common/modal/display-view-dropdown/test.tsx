import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import { type DisplayViewModes } from '../../../../common/types';

import { DisplayViewDropDown } from './display-view-drop-down';

describe('DisplayViewDropDown', () => {
	type SetupProps = {
		openDropDownByDefault: boolean;
		defaultViewMode: DisplayViewModes;
	};

	const setup = (props: Partial<SetupProps> = {}) => {
		const { openDropDownByDefault = true, defaultViewMode = 'table' } = props;
		const mockOnViewModeChange = jest.fn();
		const component = render(
			<IntlProvider locale="en">
				<DisplayViewDropDown onViewModeChange={mockOnViewModeChange} viewMode={defaultViewMode} />
			</IntlProvider>,
		);

		const openDropdown = () => {
			fireEvent.click(component.getByTestId('datasource-modal--view-drop-down--trigger'));
		};

		if (openDropDownByDefault) {
			openDropdown();
		}

		return { ...component, mockOnViewModeChange, openDropdown };
	};

	it('items should only render in the dropdown menu after it is clicked', () => {
		const { queryByTestId, getByTestId, openDropdown } = setup({
			openDropDownByDefault: false,
		});

		expect(queryByTestId('dropdown-item-table')).toBeNull();
		expect(queryByTestId('dropdown-item-inline-link')).toBeNull();

		openDropdown();

		expect(getByTestId('dropdown-item-table')).toBeInTheDocument();
		expect(getByTestId('dropdown-item-inline-link')).toBeInTheDocument();
	});

	it('displays the correct item title in the dropdown menu', () => {
		const { getByTestId } = setup();

		expect(getByTestId('dropdown-item-table')).toHaveTextContent('List');
		expect(getByTestId('dropdown-item-inline-link')).toHaveTextContent('Inline link');
	});

	ffTest(
		'platform-linking-visual-refresh-sllv',
		() => {
			const { getByTestId } = setup();

			expect(getByTestId('dropdown-item-table')).toHaveTextContent(
				'Display the number of search results as a list',
			);
			expect(getByTestId('dropdown-item-inline-link')).toHaveTextContent(
				'Display the number of search results or as an inline Smart Link',
			);
		},
		() => {
			const { getByTestId } = setup();

			expect(getByTestId('dropdown-item-table')).toHaveTextContent(
				'Display search results as a list',
			);
			expect(getByTestId('dropdown-item-inline-link')).toHaveTextContent(
				'Display the number of search results as an inline Smart Link',
			);
		},
	);

	it('should display list item followed by inline item', () => {
		const { getByTestId } = setup();

		const tableItem = getByTestId('dropdown-item-table');
		const inlineLinkItem = getByTestId('dropdown-item-inline-link');

		expect(
			tableItem.compareDocumentPosition(inlineLinkItem) & Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeGreaterThan(0);
	});

	it('should call onViewModeChange when new view is selected', () => {
		const { getByTestId, openDropdown, mockOnViewModeChange } = setup();

		fireEvent.click(getByTestId('dropdown-item-inline-link'));
		expect(mockOnViewModeChange).toHaveBeenCalledWith('inline');

		openDropdown();

		fireEvent.click(getByTestId('dropdown-item-table'));
		expect(mockOnViewModeChange).toHaveBeenCalledWith('table');
	});

	it('trigger text should be list when view mode is table', () => {
		const { getByTestId } = setup({
			defaultViewMode: 'table',
			openDropDownByDefault: false,
		});

		expect(getByTestId('datasource-modal--view-drop-down--trigger')).toHaveTextContent('List');
	});

	it('trigger text should be inline link when view mode is inline', () => {
		const { getByTestId } = setup({
			defaultViewMode: 'inline',
			openDropDownByDefault: false,
		});

		expect(getByTestId('datasource-modal--view-drop-down--trigger')).toHaveTextContent(
			'Inline link',
		);
	});
});

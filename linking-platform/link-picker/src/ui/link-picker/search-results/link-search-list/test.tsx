import React from 'react';

import { fireEvent } from '@testing-library/react';

import { renderWithIntl as render } from '@atlaskit/link-test-helpers';
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';

// eslint-disable-next-line @atlassian/tangerine/import/no-parent-imports
import { getDefaultItems } from '../../../__tests__/__helpers';

import { LinkSearchList, type LinkSearchListProps, testIds } from './index';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

interface SetupOptions extends LinkSearchListProps {}

describe('<LinkSearchList />', () => {
	const setup = (userOptions: Partial<SetupOptions> = {}) => {
		const defaultOptions = {
			items: getDefaultItems(),
			isLoading: false,
			onChange: jest.fn(),
			onSelect: jest.fn(),
			onKeyDown: jest.fn(),
			selectedIndex: -1,
			activeIndex: -1,
			ariaControls: '',
			ariaLabelledBy: '',
			role: '',
			id: '',
			adaptiveHeight: false,
		} as const;
		const options = {
			...defaultOptions,
			...userOptions,
		};

		const component = render(<LinkSearchList {...options} />);

		return {
			component,
			items: options.items,
			onSelect: options.onSelect,
			onChange: options.onChange,
		};
	};

	it('should render the list items and no loading when loaded', () => {
		const { component, items } = setup();
		const list = component.getAllByTestId('link-search-list-item');

		expect(list).toHaveLength(items!.length);
		expect(() => component.getByTestId(testIds.searchResultLoadingIndicator)).toThrow();
	});

	it('should render iconUrl in an img tag', () => {
		const { component, items } = setup();
		const image = component.getByAltText('List item 1');

		expect(image.getAttribute('alt')).toMatch('List item 1');
		expect(image.getAttribute('src')).toMatch(`${items![0].icon}`);
	});

	it('should render a spinner when loading and not items', () => {
		const { component } = setup({
			isLoading: true,
			items: undefined,
		});

		expect(() => component.getByTestId(testIds.searchResultLoadingIndicator)).not.toThrow();
		expect(() => component.getByTestId('link-search-list')).toThrow();
	});

	it('should render list and spinner when loading and has items', () => {
		const { component, items } = setup({
			isLoading: true,
		});
		const spinner = component.getByTestId(testIds.searchResultLoadingIndicator);
		const list = component.getAllByTestId('link-search-list-item');

		expect(spinner).toBeDefined();
		expect(list).toHaveLength(items!.length);
	});

	it('should not render list when there are no items', () => {
		const { component } = setup({ items: [] });
		expect(() => component.getByTestId('link-search-list')).toThrow();
	});

	it('should pre-select the item on selectedIndex', () => {
		const { component } = setup({
			selectedIndex: 1,
		});
		const list = component.getAllByTestId('link-search-list-item');

		expect(list[0].getAttribute('aria-selected')).toBe('false');
		expect(list[1].getAttribute('aria-selected')).toBe('true');
	});

	it('should select the item when focused', async () => {
		const { component, onChange, items } = setup();
		const element = component.getAllByTestId('link-search-list-item');

		fireEvent.focus(element[1]);

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith(items![1].objectId);
	});
	it('should capture and report a11y violations', async () => {
		const defaultOptions = {
			items: getDefaultItems(),
			isLoading: false,
			onChange: jest.fn(),
			onSelect: jest.fn(),
			onKeyDown: jest.fn(),
			selectedIndex: -1,
			activeIndex: -1,
			ariaControls: '',
			ariaLabelledBy: '',
			role: 'listbox',
			id: '',
			adaptiveHeight: false,
		} as const;
		const { container } = render(<LinkSearchList {...defaultOptions} />);
		await expect(container).toBeAccessible();
	});
});

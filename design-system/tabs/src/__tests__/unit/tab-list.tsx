import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import noop from '@atlaskit/ds-lib/noop';

import { Tab, TabList } from '../../index';
import { TabListContext } from '../../internal/context';
import { type TabListAttributesType } from '../../types';

const tabList = (
	<TabList>
		<Tab>Tab 1 label</Tab>
		<Tab>Tab 2 label</Tab>
		<Tab>Tab 3 label</Tab>
	</TabList>
);

const renderTabList = (overridingValue: Partial<TabListAttributesType> = {}) => (
	<TabListContext.Provider
		value={{
			selected: 0,
			tabsId: 'test',
			onChange: noop,
			...overridingValue,
		}}
	>
		<TabList>
			<Tab testId="tab-1">Tab 1 label</Tab>
			<Tab testId="tab-2">Tab 2 label</Tab>
			<Tab testId="tab-3">Tab 3 label</Tab>
		</TabList>
	</TabListContext.Provider>
);

describe('@atlaskit/tabs', () => {
	describe('tab list', () => {
		it('should have role tablist', () => {
			render(renderTabList());

			expect(screen.getByRole('tablist')).toBeInTheDocument();
		});

		it('should throw an error if context not provided', () => {
			const err = console.error;
			console.error = jest.fn();

			let errorMessage = '';
			try {
				render(tabList);
			} catch (e) {
				errorMessage = e instanceof Error ? e.message : String(e);
			}

			expect(errorMessage).toBe('@atlaskit/tabs: A TabList must have a Tabs parent.');

			// Restore writing to stderr.
			console.error = err;
		});

		it('should render correctly if one of the children is not a react element', () => {
			render(
				<TabListContext.Provider
					value={{
						selected: 0,
						tabsId: 'test',
						onChange: noop,
					}}
				>
					<TabList>
						<Tab testId="tab-1">Tab 1 label</Tab>
						<Tab testId="tab-2">Tab 2 label</Tab>
						{''}
						<Tab testId="tab-3">Tab 3 label</Tab>
					</TabList>
				</TabListContext.Provider>,
			);

			['tab-1', 'tab-2', 'tab-3'].forEach((testId, index) => {
				const tab = screen.getByTestId(testId);
				const isSelected = index === 0;

				expect(tab).toHaveAttribute('aria-controls', `test-${index}-tab`);
				expect(tab).toHaveAttribute('aria-posinset', `${index + 1}`);
				expect(tab).toHaveAttribute('aria-selected', isSelected.toString());
				// If this fails it is including invalid children
				expect(tab).toHaveAttribute('aria-setsize', '3');
				expect(tab.id).toBe(`test-${index}`);
				expect(tab.tabIndex).toBe(isSelected ? 0 : -1);
			});
		});

		it('should map values from context correctly', () => {
			render(renderTabList({ selected: 1, tabsId: 'hello' }));

			['tab-1', 'tab-2', 'tab-3'].forEach((testId, index) => {
				const tab = screen.getByTestId(testId);
				const isSelected = index === 1;

				expect(tab).toHaveAttribute('aria-controls', `hello-${index}-tab`);
				expect(tab).toHaveAttribute('aria-posinset', `${index + 1}`);
				expect(tab).toHaveAttribute('aria-selected', isSelected.toString());
				expect(tab).toHaveAttribute('aria-setsize', '3');
				expect(tab.id).toBe(`hello-${index}`);
				expect(tab.tabIndex).toBe(isSelected ? 0 : -1);
			});
		});

		it('should map values from context correctly when wrapped in a div', () => {
			render(
				<TabListContext.Provider
					value={{
						selected: 1,
						tabsId: 'test',
						onChange: noop,
					}}
				>
					<div>
						<TabList>
							<Tab testId="tab-1">Tab 1 label</Tab>
							<Tab testId="tab-2">Tab 2 label</Tab>
							<Tab testId="tab-3">Tab 3 label</Tab>
						</TabList>
					</div>
				</TabListContext.Provider>,
			);

			['tab-1', 'tab-2', 'tab-3'].forEach((testId, index) => {
				const tab = screen.getByTestId(testId);
				const isSelected = index === 1;

				expect(tab).toHaveAttribute('aria-controls', `test-${index}-tab`);
				expect(tab).toHaveAttribute('aria-posinset', `${index + 1}`);
				expect(tab).toHaveAttribute('aria-selected', isSelected.toString());
				expect(tab).toHaveAttribute('aria-setsize', '3');
				expect(tab.id).toBe(`test-${index}`);
				expect(tab.tabIndex).toBe(isSelected ? 0 : -1);
			});
		});

		it('should render each tab with the correct attributes after changing', () => {
			const { rerender } = render(renderTabList());

			rerender(renderTabList({ selected: 2 }));

			['tab-1', 'tab-2', 'tab-3'].forEach((testId, index) => {
				const tab = screen.getByTestId(testId);
				const isSelected = index === 2;

				expect(tab).toHaveAttribute('aria-controls', `test-${index}-tab`);
				expect(tab).toHaveAttribute('aria-posinset', `${index + 1}`);
				expect(tab).toHaveAttribute('aria-selected', isSelected.toString());
				expect(tab).toHaveAttribute('aria-setsize', '3');
				expect(tab.id).toBe(`test-${index}`);
				expect(tab.tabIndex).toBe(isSelected ? 0 : -1);
			});
		});

		it('should fire onChange if a tab is clicked', () => {
			const spy = jest.fn();
			render(renderTabList({ selected: 0, onChange: spy }));

			screen.getByText('Tab 2 label').click();

			expect(spy).toHaveBeenCalled();
			expect(spy).toBeCalledWith(1);
		});

		describe('can navigate via keyboard', () => {
			it('pressing HOME fires onChange for the first tab', () => {
				const spy = jest.fn();
				render(renderTabList({ selected: 2, onChange: spy }));

				fireEvent.keyDown(screen.getByText('Tab 3 label'), { key: 'Home' });

				expect(spy).toHaveBeenCalledWith(0);
			});

			it('pressing END fires onChange for the first tab', () => {
				const spy = jest.fn();
				render(renderTabList({ selected: 2, onChange: spy }));

				fireEvent.keyDown(screen.getByText('Tab 1 label'), { key: 'End' });

				expect(spy).toHaveBeenCalledWith(2);
			});

			it('pressing LEFT arrow fires onChange for the first tab', () => {
				const spy = jest.fn();
				render(renderTabList({ selected: 1, onChange: spy }));

				fireEvent.keyDown(screen.getByText('Tab 2 label'), { key: 'ArrowLeft' });

				expect(spy).toHaveBeenCalledWith(0);
			});

			it('pressing the RIGHT arrow fires onChange for the last tab', () => {
				const spy = jest.fn();
				render(renderTabList({ selected: 1, onChange: spy }));

				fireEvent.keyDown(screen.getByText('Tab 2 label'), { key: 'ArrowRight' });

				expect(spy).toHaveBeenCalledWith(2);
			});

			it('pressing the LEFT arrow when on the first tab fires onChange for the last tab', () => {
				const spy = jest.fn();
				render(renderTabList({ selected: 0, onChange: spy }));

				fireEvent.keyDown(screen.getByText('Tab 1 label'), { key: 'ArrowLeft' });

				expect(spy).toHaveBeenCalledWith(2);
			});

			it('pressing the RIGHT arrow when on the last tab fires onChange for the first tab', () => {
				const spy = jest.fn();
				render(renderTabList({ selected: 2, onChange: spy }));

				fireEvent.keyDown(screen.getByText('Tab 3 label'), { key: 'ArrowRight' });

				expect(spy).toHaveBeenCalledWith(0);
			});

			it('navigating by keyboard still works after adding a tab', () => {
				const spy = jest.fn();
				const { rerender } = render(renderTabList({ selected: 1, onChange: spy }));

				fireEvent.keyDown(screen.getByText('Tab 2 label'), { key: 'ArrowRight' });
				rerender(renderTabList({ selected: 2, onChange: spy }));

				rerender(
					<TabListContext.Provider value={{ selected: 2, tabsId: 'test', onChange: spy }}>
						<TabList>
							<Tab>Tab 1 label</Tab>
							<Tab>Tab 2 label</Tab>
							<Tab>Tab 3 label</Tab>
							<Tab>Tab 4 label</Tab>
						</TabList>
					</TabListContext.Provider>,
				);
				fireEvent.keyDown(screen.getByText('Tab 3 label'), { key: 'ArrowRight' });

				expect(spy).toHaveBeenCalledTimes(2);
				expect(spy).toHaveBeenLastCalledWith(3);
			});

			it('navigating by keyboard still works after removing a tab', () => {
				const spy = jest.fn();
				const { rerender } = render(renderTabList({ selected: 2, onChange: spy }));

				fireEvent.keyDown(screen.getByText('Tab 3 label'), { key: 'ArrowLeft' });
				rerender(renderTabList({ selected: 1, onChange: spy }));

				rerender(
					<TabListContext.Provider value={{ selected: 2, tabsId: 'test', onChange: spy }}>
						<TabList>
							<Tab>Tab 1 label</Tab>
							<Tab>Tab 2 label</Tab>
						</TabList>
					</TabListContext.Provider>,
				);
				fireEvent.keyDown(screen.getByText('Tab 2 label'), { key: 'ArrowLeft' });

				expect(spy).toHaveBeenCalledTimes(2);
				expect(spy).toHaveBeenLastCalledWith(0);
			});
		});
	});
});

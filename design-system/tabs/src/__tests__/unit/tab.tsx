import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import noop from '@atlaskit/ds-lib/noop';

import Tabs, { Tab, TabList, TabPanel, useTab } from '../../index';
import { TabContext } from '../../internal/context';

const CustomTab = ({ label }: { label: string }) => {
	const tabAttributes = useTab();

	// In this example custom tab we have added an onFocus call
	return (
		// eslint-disable-next-line @atlassian/a11y/no-static-element-interactions
		<span {...tabAttributes} onFocus={noop}>
			{label}
		</span>
	);
};

describe('@atlaskit/tabs', () => {
	describe('tab', () => {
		it('should error without a context provider', () => {
			const err = console.error;
			console.error = jest.fn();

			let errorMessage = '';
			try {
				render(<Tab>Label 1</Tab>);
			} catch (e) {
				errorMessage = e instanceof Error ? e.message : String(e);
			}

			expect(errorMessage).toBe('@atlaskit/tabs: A Tab must have a TabList parent.');

			// Restore writing to stderr.
			console.error = err;
		});

		describe('context', () => {
			const onClick = jest.fn();
			const onKeyDown = jest.fn();
			const setup = () => {
				render(
					<TabContext.Provider
						value={{
							onClick,
							id: '1',
							'aria-controls': '0-1-tab',
							'aria-posinset': 2,
							'aria-selected': true,
							'aria-setsize': 4,
							onKeyDown,
							role: 'tab',
							tabIndex: 0,
						}}
					>
						<Tab>Label 1</Tab>
					</TabContext.Provider>,
				);
			};

			afterEach(() => {
				onClick.mockClear();
				onKeyDown.mockClear();
			});

			it('should map context to aria attributes correctly', () => {
				setup();
				const tab = screen.getByRole('tab');
				expect(tab).toHaveAttribute('aria-controls', '0-1-tab');
				expect(tab).toHaveAttribute('aria-posinset', '2');
				expect(tab).toHaveAttribute('aria-selected', 'true');
				expect(tab).toHaveAttribute('aria-setsize', '4');
				expect(tab).toHaveAttribute('tabIndex', '0');

				// Test methods
				expect(onClick).not.toBeCalled();
				tab.click();
				expect(onClick).toBeCalled();

				expect(onKeyDown).not.toBeCalled();
				fireEvent.keyDown(tab, { key: 'ArrowRight' });
				expect(onKeyDown).toBeCalled();
			});

			it('should call onClick when clicked', () => {
				setup();
				const tab = screen.getByRole('tab');

				// Test methods
				expect(onClick).not.toBeCalled();
				tab.click();
				expect(onClick).toBeCalled();

				expect(onKeyDown).not.toBeCalled();
				fireEvent.keyDown(tab, { key: 'ArrowRight' });
				expect(onKeyDown).toBeCalled();
			});

			it('should call onKeyDown when key down', () => {
				setup();
				const tab = screen.getByRole('tab');

				expect(onKeyDown).not.toBeCalled();
				fireEvent.keyDown(tab, { key: 'ArrowRight' });
				expect(onKeyDown).toBeCalled();
			});
		});

		it('should receive context even if wrapped in a div', () => {
			render(
				<TabContext.Provider
					value={{
						onClick: noop,
						id: '1',
						'aria-controls': '0-1-tab',
						'aria-posinset': 2,
						'aria-selected': true,
						'aria-setsize': 4,
						onKeyDown: noop,
						role: 'tab',
						tabIndex: 0,
					}}
				>
					<Tab>Label 1</Tab>
				</TabContext.Provider>,
			);

			const tab = screen.getByRole('tab');
			expect(tab).toHaveAttribute('aria-controls', '0-1-tab');
			expect(tab).toHaveAttribute('aria-posinset', '2');
			expect(tab).toHaveAttribute('aria-selected', 'true');
			expect(tab).toHaveAttribute('aria-setsize', '4');
			expect(tab).toHaveAttribute('tabIndex', '0');
		});
	});

	it('should accept any react node as a child', () => {
		render(
			<TabContext.Provider
				value={{
					onClick: noop,
					id: '1',
					'aria-controls': '0-1-tab',
					'aria-posinset': 2,
					'aria-selected': true,
					'aria-setsize': 4,
					onKeyDown: noop,
					role: 'tab',
					tabIndex: 0,
				}}
			>
				<Tab>
					<div data-testid="label-1">Label 1</div>
				</Tab>{' '}
			</TabContext.Provider>,
		);

		expect(screen.getByTestId('label-1')).toBeInTheDocument();
	});

	it('should forward ref', () => {
		const ref = React.createRef<HTMLDivElement>();
		render(
			<TabContext.Provider
				value={{
					onClick: noop,
					id: '1',
					'aria-controls': '0-1-tab',
					'aria-posinset': 2,
					'aria-selected': true,
					'aria-setsize': 4,
					onKeyDown: noop,
					role: 'tab',
					tabIndex: 0,
				}}
			>
				<Tab ref={ref}>Label 1</Tab>
			</TabContext.Provider>,
		);

		expect(ref.current).not.toBeNull();
	});

	describe('Custom tab using useTab', () => {
		it('can be used to create a custom tab', () => {
			const onClick = jest.fn();
			const onKeyDown = jest.fn();
			render(
				<TabContext.Provider
					value={{
						onClick,
						id: '1',
						'aria-controls': '0-1-tab',
						'aria-posinset': 2,
						'aria-selected': true,
						'aria-setsize': 4,
						onKeyDown,
						role: 'tab',
						tabIndex: 0,
					}}
				>
					<CustomTab label="Tab 1" />
				</TabContext.Provider>,
			);

			const tab = screen.getByRole('tab');
			expect(tab).toHaveAttribute('aria-controls', '0-1-tab');
			expect(tab).toHaveAttribute('aria-posinset', '2');
			expect(tab).toHaveAttribute('aria-selected', 'true');
			expect(tab).toHaveAttribute('aria-setsize', '4');
			expect(tab).toHaveAttribute('tabIndex', '0');

			// Test methods
			expect(onClick).not.toBeCalled();
			tab.click();
			expect(onClick).toBeCalled();

			expect(onKeyDown).not.toBeCalled();
			fireEvent.keyDown(tab, { key: 'ArrowRight' });
			expect(onKeyDown).toBeCalled();
		});

		it('should change the custom tab when clicked', () => {
			const spy = jest.fn();

			render(
				<Tabs onChange={spy} id="test">
					<TabList>
						<CustomTab label="Tab 1 label" />
						<CustomTab label="Tab 2 label" />
					</TabList>
					<TabPanel>Tab 1 panel</TabPanel>
					<TabPanel>Tab 2 panel</TabPanel>
				</Tabs>,
			);

			const tab2 = screen.getByText('Tab 2 label');
			fireEvent.click(tab2);

			expect(spy).toHaveBeenCalledWith(1, expect.objectContaining({}));
			expect(screen.getByText('Tab 1 label')).toHaveAttribute('aria-selected', 'false');
			expect(tab2).toHaveAttribute('aria-selected', 'true');
		});

		it('should change the custom tab when using the right key', () => {
			const spy = jest.fn();

			render(
				<Tabs onChange={spy} id="test">
					<TabList>
						<CustomTab label="Tab 1 label" />
						<CustomTab label="Tab 2 label" />
					</TabList>
					<TabPanel>Tab 1 panel</TabPanel>
					<TabPanel>Tab 2 panel</TabPanel>
				</Tabs>,
			);

			const tab1 = screen.getByText('Tab 1 label');
			const tab2 = screen.getByText('Tab 2 label');
			fireEvent.keyDown(tab1, { key: 'ArrowRight' });

			expect(spy).toHaveBeenCalledWith(1, expect.objectContaining({}));
			expect(tab1).toHaveAttribute('aria-selected', 'false');
			expect(tab2).toHaveAttribute('aria-selected', 'true');
		});
	});
});

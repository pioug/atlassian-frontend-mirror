import React, { memo } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import Tabs, { Tab, TabList, TabPanel } from '../../index';
import { type TabsProps } from '../../types';

declare var global: any;

const renderTabs = (overridingProps: Partial<TabsProps> = {}) => (
	<Tabs id="test" {...overridingProps}>
		<TabList>
			<Tab testId="tab-1">Tab 1 label</Tab>
			<Tab testId="tab-2">Tab 2 label</Tab>
			<Tab testId="tab-3">Tab 3 label</Tab>
		</TabList>
		<TabPanel>Tab 1 panel</TabPanel>
		<TabPanel>Tab 2 panel</TabPanel>
		<TabPanel>Tab 3 panel</TabPanel>
	</Tabs>
);

describe('@atlaskit/tabs', () => {
	describe('Tabs', () => {
		describe('rendering', () => {
			it('should not log console error on mount', () => {
				jest.spyOn(global.console, 'error');
				render(renderTabs());
				expect(global.console.error).not.toHaveBeenCalled();
				// @ts-ignore - Property 'mockRestore' does not exist
				global.console.error.mockRestore();
			});

			it('should render each tab', () => {
				render(renderTabs());
				expect(screen.getAllByRole('tab').length).toBe(3);
				expect(screen.getByText('Tab 1 label')).toBeInTheDocument();
				expect(screen.getByText('Tab 2 label')).toBeInTheDocument();
				expect(screen.getByText('Tab 3 label')).toBeInTheDocument();
			});

			it('should render one tab panel', () => {
				render(renderTabs());
				expect(screen.getAllByRole('tabpanel').length).toBe(1);
				expect(screen.getByText('Tab 1 label')).toBeInTheDocument();
			});
		});

		describe('content persisting', () => {
			it('should not unmount a panel when changed', () => {
				render(renderTabs());

				expect(screen.getByText('Tab 1 panel')).toBeInTheDocument();

				const element = screen.getByText('Tab 2 label');
				fireEvent.click(element);

				expect(screen.getByText('Tab 2 panel')).toBeInTheDocument();
				expect(screen.queryByText('Tab 3 panel')).not.toBeInTheDocument();

				expect(screen.getByText('Tab 1 panel').hidden).toBe(true);
				expect(screen.getByText('Tab 2 panel').hidden).toBe(false);
			});

			it('should not unmount a panel when changed twice', () => {
				render(renderTabs());

				fireEvent.click(screen.getByText('Tab 2 label'));
				fireEvent.click(screen.getByText('Tab 1 label'));

				expect(screen.getByText('Tab 1 panel')).toBeInTheDocument();
				expect(screen.getByText('Tab 2 panel')).toBeInTheDocument();
				expect(screen.queryByText('Tab 3 panel')).not.toBeInTheDocument();

				expect(screen.getByText('Tab 1 panel').hidden).toBe(false);
				expect(screen.getByText('Tab 2 panel').hidden).toBe(true);
			});

			it('should not unmount a panel when changed and another panel is added', () => {
				const { rerender } = render(renderTabs());

				fireEvent.click(screen.getByText('Tab 2 label'));
				fireEvent.click(screen.getByText('Tab 1 label'));

				rerender(
					<Tabs id="test">
						<TabList>
							<Tab>Tab 1 label</Tab>
							<Tab>Tab 2 label</Tab>
							<Tab>Tab 3 label</Tab>
							<Tab>Tab 4 label</Tab>
						</TabList>
						<TabPanel>Tab 1 panel</TabPanel>
						<TabPanel>Tab 2 panel</TabPanel>
						<TabPanel>Tab 3 panel</TabPanel>
						<TabPanel>Tab 4 panel</TabPanel>
					</Tabs>,
				);

				expect(screen.getByText('Tab 1 panel')).toBeInTheDocument();
				expect(screen.getByText('Tab 2 panel')).toBeInTheDocument();
				expect(screen.queryByText('Tab 3 panel')).not.toBeInTheDocument();
				expect(screen.queryByText('Tab 4 panel')).not.toBeInTheDocument();

				expect(screen.getByText('Tab 1 panel').hidden).toBe(false);
				expect(screen.getByText('Tab 2 panel').hidden).toBe(true);
			});

			it('should not unmount a panel when changed and a panel is removed', () => {
				const { rerender } = render(renderTabs());

				fireEvent.click(screen.getByText('Tab 2 label'));
				fireEvent.click(screen.getByText('Tab 1 label'));

				rerender(
					<Tabs id="test">
						<TabList>
							<Tab>Tab 1 label</Tab>
							<Tab>Tab 2 label</Tab>
						</TabList>
						<TabPanel>Tab 1 panel</TabPanel>
						<TabPanel>Tab 2 panel</TabPanel>
					</Tabs>,
				);

				expect(screen.getByText('Tab 1 panel')).toBeInTheDocument();
				expect(screen.getByText('Tab 2 panel')).toBeInTheDocument();
				expect(screen.queryByText('Tab 3 panel')).not.toBeInTheDocument();

				expect(screen.getByText('Tab 1 panel').hidden).toBe(false);
				expect(screen.getByText('Tab 2 panel').hidden).toBe(true);
			});

			it('should unmount a panel when changed when shouldUnmountTabPanelOnChange=true', () => {
				render(renderTabs({ shouldUnmountTabPanelOnChange: true }));

				fireEvent.click(screen.getByText('Tab 2 label'));

				expect(screen.getAllByRole('tabpanel').length).toBe(1);
				expect(screen.queryByText('Tab 1 panel')).not.toBeInTheDocument();
				expect(screen.getByText('Tab 2 panel')).toBeInTheDocument();
				expect(screen.queryByText('Tab 3 panel')).not.toBeInTheDocument();

				expect(screen.getByText('Tab 2 panel').hidden).toBe(false);
			});

			it('should unmount a panel when changed twice when shouldUnmountTabPanelOnChange=true', () => {
				render(renderTabs({ shouldUnmountTabPanelOnChange: true }));

				fireEvent.click(screen.getByText('Tab 2 label'));
				fireEvent.click(screen.getByText('Tab 1 label'));

				expect(screen.getAllByRole('tabpanel').length).toBe(1);
				expect(screen.getByText('Tab 1 panel')).toBeInTheDocument();
				expect(screen.queryByText('Tab 2 panel')).not.toBeInTheDocument();
				expect(screen.queryByText('Tab 3 panel')).not.toBeInTheDocument();

				expect(screen.getByText('Tab 1 panel').hidden).toBe(false);
			});
		});

		describe('props', () => {
			describe('defaultSelected', () => {
				it('should set the selected tab on initial mount', () => {
					render(renderTabs({ defaultSelected: 1 }));
					expect(screen.getByText('Tab 2 panel')).toBeInTheDocument();
				});

				it('changing this prop should not update the selected tab after the initial mount', () => {
					const { rerender } = render(
						renderTabs({
							defaultSelected: 1,
						}),
					);

					rerender(
						renderTabs({
							defaultSelected: 2,
						}),
					);

					expect(screen.getByText('Tab 2 panel')).toBeInTheDocument();
					expect(screen.queryByText('Tab 3 panel')).not.toBeInTheDocument();
				});
			});

			describe('selected', () => {
				it('should set the selected tab on initial mount', () => {
					render(renderTabs({ selected: 1 }));
					expect(screen.getByTestId('tab-2').getAttribute('aria-selected')).toBeTruthy();
					expect(screen.getByText('Tab 2 panel')).toBeInTheDocument();
				});

				it('should take precedence over defaultSelected', () => {
					render(renderTabs({ selected: 1, defaultSelected: 2 }));
					expect(screen.getByTestId('tab-2').getAttribute('aria-selected')).toBeTruthy();
					expect(screen.getByText('Tab 2 panel')).toBeInTheDocument();
				});

				it('changing this prop should update the selected tab after the initial mount', () => {
					const { rerender } = render(renderTabs({ selected: 1 }));

					rerender(renderTabs({ selected: 2 }));

					expect(screen.getByTestId('tab-3').getAttribute('aria-selected')).toBeTruthy();
					expect(screen.getByText('Tab 3 panel')).toBeInTheDocument();
				});

				it('should default to the first tab if neither selected nor defaultSelected are set', () => {
					render(renderTabs());
					expect(screen.getByTestId('tab-1').getAttribute('aria-selected')).toBeTruthy();
					expect(screen.getByText('Tab 1 panel')).toBeInTheDocument();
				});

				describe("setting this prop should make the component 'controlled'", () => {
					it('should listen to selected prop if defined', () => {
						render(renderTabs({ selected: 1 }));
						screen.getByTestId('tab-1').click();

						expect(screen.getByTestId('tab-2').getAttribute('aria-selected')).toBeTruthy();
						expect(screen.getByText('Tab 2 panel')).toBeInTheDocument();
					});

					it('should maintain its own internal state in case selected is not provided', () => {
						const { rerender } = render(renderTabs({ selected: 1 }));
						screen.getByTestId('tab-1').click();

						rerender(renderTabs());

						expect(screen.getByTestId('tab-1').getAttribute('aria-selected')).toBeTruthy();
						expect(screen.getByText('Tab 1 panel')).toBeInTheDocument();
					});
				});
			});
			describe('onChange', () => {
				it('is not fired if changed by prop', () => {
					const spy = jest.fn();
					const { rerender } = render(renderTabs({ selected: 0, onChange: spy }));
					rerender(renderTabs({ selected: 1, onChange: spy }));
					expect(spy).not.toHaveBeenCalled();
				});

				it('is fired with the selected tab and its index when selected by click', () => {
					const spy = jest.fn();
					render(renderTabs({ onChange: spy }));

					screen.getByText('Tab 2 label').click();

					// Don't care about second argument because tested in analytics
					expect(spy).toHaveBeenCalledWith(1, expect.objectContaining({}));
				});

				it('is fired with the selected tab and its index when selected by keyboard', () => {
					const spy = jest.fn();
					render(renderTabs({ onChange: spy }));

					const tab1 = screen.getByText('Tab 1 label');

					fireEvent.keyDown(tab1, { key: 'ArrowRight' });

					expect(spy).toHaveBeenCalledWith(1, expect.objectContaining({}));
				});
			});
			describe('id', () => {
				it('maps id correctly', () => {
					render(renderTabs());

					expect(screen.getByTestId('tab-1').id).toBe('test-0');
					expect(screen.getByTestId('tab-2').id).toBe('test-1');
					expect(screen.getByTestId('tab-3').id).toBe('test-2');
					expect(screen.getByText('Tab 1 panel').id).toBe('test-0-tab');
				});
			});
		});

		describe('behaviour', () => {
			describe('keyboard navigation', () => {
				describe('with 3 tabs, when the 2nd tab is selected', () => {
					let onChange: jest.Mock;

					beforeEach(() => {
						onChange = jest.fn();
					});

					const simulateKeyboardNav = (index: number, key: string) => {
						const tab = screen.getByText(`Tab ${index} label`);
						fireEvent.keyDown(tab, { key });
					};

					it('pressing LEFT arrow selects the first tab', () => {
						render(renderTabs({ defaultSelected: 1, onChange }));
						simulateKeyboardNav(2, 'ArrowLeft');

						expect(screen.getByTestId('tab-1').getAttribute('aria-selected')).toBeTruthy();
						expect(screen.getByText('Tab 1 panel')).toBeInTheDocument();
						expect(onChange).toHaveBeenCalledTimes(1);
						expect(onChange).toHaveBeenCalledWith(0, expect.objectContaining({}));
					});

					it('pressing the RIGHT arrow selects the last tab', () => {
						render(renderTabs({ defaultSelected: 1, onChange }));
						simulateKeyboardNav(2, 'ArrowRight');

						expect(screen.getByTestId('tab-3').getAttribute('aria-selected')).toBeTruthy();
						expect(screen.getByText('Tab 3 panel')).toBeInTheDocument();
						expect(onChange).toHaveBeenCalledTimes(1);
						expect(onChange).toHaveBeenCalledWith(2, expect.objectContaining({}));
					});

					it('pressing the LEFT arrow twice selects the last tab', () => {
						render(renderTabs({ defaultSelected: 1, onChange }));
						simulateKeyboardNav(2, 'ArrowLeft');
						simulateKeyboardNav(1, 'ArrowLeft');

						expect(screen.getByTestId('tab-3').getAttribute('aria-selected')).toBeTruthy();
						expect(screen.getByText('Tab 3 panel')).toBeInTheDocument();
						expect(onChange).toHaveBeenCalledTimes(2);
						expect(onChange).toHaveBeenCalledWith(0, expect.objectContaining({}));
					});

					it('pressing the RIGHT arrow twice selects the first tab', () => {
						render(renderTabs({ defaultSelected: 1, onChange }));
						simulateKeyboardNav(2, 'ArrowRight');
						simulateKeyboardNav(3, 'ArrowRight');

						expect(screen.getByTestId('tab-1').getAttribute('aria-selected')).toBeTruthy();
						expect(screen.getByText('Tab 1 panel')).toBeInTheDocument();
						expect(onChange).toHaveBeenCalledTimes(2);
						expect(onChange).toHaveBeenCalledWith(2, expect.objectContaining({}));
					});

					it('pressing the HOME key selects the first tab', () => {
						render(renderTabs({ defaultSelected: 1, onChange }));
						simulateKeyboardNav(2, 'Home');

						expect(screen.getByTestId('tab-1').getAttribute('aria-selected')).toBeTruthy();
						expect(screen.getByText('Tab 1 panel')).toBeInTheDocument();
						expect(onChange).toHaveBeenCalledTimes(1);
						expect(onChange).toHaveBeenCalledWith(0, expect.objectContaining({}));
					});

					it('pressing the END key selects the last tab', () => {
						render(renderTabs({ defaultSelected: 1, onChange }));
						simulateKeyboardNav(2, 'End');

						expect(screen.getByTestId('tab-1').getAttribute('aria-selected')).toBeTruthy();
						expect(screen.getByText('Tab 3 panel')).toBeInTheDocument();
						expect(onChange).toHaveBeenCalledTimes(1);
						expect(onChange).toHaveBeenCalledWith(2, expect.objectContaining({}));
					});
				});
			});

			it('tab panels that are memoized should not rerender if something changes', () => {
				let renderCount = 0;
				const Panel = memo(({ text }: { text: string }) => {
					renderCount++;
					return <span>{text}</span>;
				});

				const { rerender } = render(
					<Tabs id="test">
						<TabList>
							<Tab>Tab 1 label</Tab>
						</TabList>
						<TabPanel>
							<Panel text="Tab 1 panel" />
						</TabPanel>
					</Tabs>,
				);

				rerender(
					<Tabs id="test">
						<TabList>
							<Tab>Tab 1 label</Tab>
						</TabList>
						<TabPanel>
							<Panel text="Tab 1 panel" />
						</TabPanel>
					</Tabs>,
				);

				expect(renderCount).toBe(process.env.IS_REACT_18_STRICT_MODE ? 2 : 1);
			});

			it('should function correctly if components are wrapped in divs', () => {
				const spy = jest.fn();
				render(
					<Tabs onChange={spy} id="test">
						<div>
							<TabList>
								<div>
									<Tab>Tab 1 label</Tab>
								</div>
								<div>
									<Tab>Tab 2 label</Tab>
								</div>
								<div>
									<Tab>Tab 3 label</Tab>
								</div>
							</TabList>
						</div>
						<div>
							<TabPanel>Tab 1 panel</TabPanel>
						</div>
						<div>
							<TabPanel>Tab 2 panel</TabPanel>
						</div>
						<div>
							<TabPanel>Tab 3 panel</TabPanel>
						</div>
					</Tabs>,
				);

				fireEvent.click(screen.getByText('Tab 2 label'));

				// Don't care about second argument because tested in analytics
				expect(spy).toHaveBeenCalledWith(1, expect.objectContaining({}));
				expect(screen.getByText('Tab 2 panel')).toBeInTheDocument();
			});
		});
	});
});

import React, { useEffect, useState } from 'react';

import { act, fireEvent, render } from '@testing-library/react';

import { skipA11yAudit } from '@af/accessibility-testing';
import Tooltip from '@atlaskit/tooltip';

import {
	DEFAULT_LEFT_SIDEBAR_FLYOUT_WIDTH,
	DEFAULT_LEFT_SIDEBAR_WIDTH,
	PAGE_LAYOUT_LS_KEY,
} from '../../../../common/constants';
import { ResizeControlledConsumer } from '../../../../controllers/__tests__/sidebar-resize-controller';
import { Content, LeftSidebar, Main, PageLayout } from '../../../../index';
import { getDimension } from '../__utils__/get-dimension';
import { triggerTransitionEnd } from '../__utils__/transition-end';

describe('Left sidebar', () => {
	beforeEach(() => {
		jest.useFakeTimers();

		// a11y audits fail due to old axe rules that need to be updated
		// See https://product-fabric.atlassian.net/browse/DSP-17790 for info
		skipA11yAudit();
	});

	afterEach(() => {
		jest.useRealTimers();
		localStorage.clear();
	});

	const completeAnimations = () => {
		act(() => {
			jest.runAllTimers();
		});
	};

	describe('Resize button', () => {
		it('should collapse the LeftSidebar when ResizeButton is clicked in expanded state', () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={200}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);

			fireEvent.click(getByTestId('left-sidebar-resize-button'));
			completeAnimations();

			expect(getDimension('leftSidebarWidth')).toEqual('20px');
			expect(JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!)).toEqual(
				expect.objectContaining({ isLeftSidebarCollapsed: true }),
			);
		});

		it('should call onLeftSidebarCollapse callback when ResizeButton is clicked', () => {
			const fn = jest.fn();
			const { getByTestId } = render(
				<PageLayout testId="grid" onLeftSidebarCollapse={fn}>
					<Content>
						<LeftSidebar testId="left-sidebar" width={200}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);

			fireEvent.click(getByTestId('left-sidebar-resize-button'));
			triggerTransitionEnd(getByTestId('left-sidebar'));

			expect(fn).toHaveBeenCalledTimes(1);
			expect(fn).toHaveBeenCalledWith(expect.objectContaining({ isLeftSidebarCollapsed: true }));
		});

		it('should always call the latest onLeftSidebarCollapse function', () => {
			const ordered: string[] = [];
			function App() {
				const [onCollapse, setOnCollapse] = useState<() => void>(function setInitialState() {
					return () => ordered.push('first fn');
				});

				// immediately setting `onLeftSidebarCollapse` to a new function in the first render
				useEffect(() => {
					setOnCollapse(function setState() {
						return () => ordered.push('second fn');
					});
				}, [setOnCollapse]);

				return (
					<PageLayout testId="grid" onLeftSidebarCollapse={onCollapse}>
						<Content>
							<LeftSidebar testId="left-sidebar" width={200}>
								LeftSidebar
							</LeftSidebar>
							<Main testId="content">Main</Main>
						</Content>
					</PageLayout>
				);
			}

			const { getByTestId } = render(<App />);

			fireEvent.click(getByTestId('left-sidebar-resize-button'));
			triggerTransitionEnd(getByTestId('left-sidebar'));

			expect(ordered).toEqual(['second fn']);
		});

		it('should still call onLeftSidebarCollapse even if re-rendered during the transition', () => {
			const ordered: string[] = [];
			function App() {
				ordered.push('render');
				return (
					<PageLayout testId="grid" onLeftSidebarCollapse={() => ordered.push('collapse')}>
						<Content>
							<LeftSidebar testId="left-sidebar" width={200}>
								LeftSidebar
							</LeftSidebar>
							<Main testId="content">Main</Main>
						</Content>
					</PageLayout>
				);
			}

			const { getByTestId, rerender } = render(<App />);
			expect(ordered).toEqual(['render']);

			fireEvent.click(getByTestId('left-sidebar-resize-button'));

			rerender(<App />);

			triggerTransitionEnd(getByTestId('left-sidebar'));

			expect(ordered).toEqual(['render', 'render', 'collapse']);
		});

		it('should abort onLeftSidebarCollapse if unmounted during transition', () => {
			const ordered: string[] = [];
			function App() {
				useEffect(() => {
					ordered.push('mounted');
					return () => {
						ordered.push('unmounted');
					};
				}, []);
				return (
					<PageLayout testId="grid" onLeftSidebarCollapse={() => ordered.push('collapse')}>
						<Content>
							<LeftSidebar testId="left-sidebar" width={200} collapsedState="expanded">
								LeftSidebar
							</LeftSidebar>
							<Main testId="content">Main</Main>
						</Content>
					</PageLayout>
				);
			}

			const { getByTestId, unmount } = render(<App />);
			const sidebar = getByTestId('left-sidebar');

			expect(ordered).toEqual(['mounted']);

			fireEvent.click(getByTestId('left-sidebar-resize-button'));

			unmount();

			triggerTransitionEnd(sidebar);

			expect(ordered).toEqual(['mounted', 'unmounted']);
		});

		it('should flush onLeftSidebarCollapse if expanded during transition', () => {
			const ordered: string[] = [];
			function App() {
				return (
					<PageLayout
						testId="grid"
						onLeftSidebarCollapse={() => ordered.push('collapse')}
						onLeftSidebarExpand={() => ordered.push('expand')}
					>
						<Content>
							<LeftSidebar testId="left-sidebar" width={200} collapsedState="expanded">
								LeftSidebar
							</LeftSidebar>
							<Main testId="content">Main</Main>
						</Content>
					</PageLayout>
				);
			}

			const { getByTestId } = render(<App />);

			expect(ordered).toEqual([]);

			// collapse
			fireEvent.click(getByTestId('left-sidebar-resize-button'));
			expect(ordered).toEqual([]);

			// flush collapse by triggering expand
			fireEvent.click(getByTestId('left-sidebar-resize-button'));
			expect(ordered).toEqual(['collapse']);

			// finish expand
			triggerTransitionEnd(getByTestId('left-sidebar'));

			expect(ordered).toEqual(['collapse', 'expand']);
		});

		it('should expand the LeftSidebar when ResizeButton is clicked in collapsed state', () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={240}>
							LeftSidebar
						</LeftSidebar>
						<ResizeControlledConsumer />
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);

			act(() => {
				fireEvent.click(getByTestId('collapse'));
			});
			completeAnimations();

			act(() => {
				fireEvent.click(getByTestId('left-sidebar-resize-button'));
			});
			completeAnimations();

			expect(getDimension('leftSidebarWidth')).toEqual('240px');
			expect(JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!)).toEqual(
				expect.objectContaining({ isLeftSidebarCollapsed: false }),
			);
		});

		it('should call onLeftSidebarExpand callback when ResizeButton is clicked in collapsed state', () => {
			const fn = jest.fn();
			const { getByTestId } = render(
				<PageLayout testId="grid" onLeftSidebarExpand={fn}>
					<Content>
						<LeftSidebar testId="left-sidebar" width={200} collapsedState="collapsed">
							LeftSidebar
						</LeftSidebar>
						<ResizeControlledConsumer />
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);

			fireEvent.click(getByTestId('left-sidebar-resize-button'));
			triggerTransitionEnd(getByTestId('left-sidebar'));

			expect(fn).toHaveBeenCalledTimes(1);
			expect(fn).toHaveBeenCalledWith(expect.objectContaining({ isLeftSidebarCollapsed: false }));
		});

		it('should always call the latest onLeftSidebarExpand function', () => {
			const ordered: string[] = [];
			function App() {
				const [onExpand, setOnExpand] = useState<() => void>(function setInitialState() {
					return () => ordered.push('first fn');
				});

				// immediately setting `onLeftSidebarExpand` to a new function in the first render
				useEffect(() => {
					setOnExpand(function setState() {
						return () => ordered.push('second fn');
					});
				}, [setOnExpand]);

				return (
					<PageLayout onLeftSidebarExpand={onExpand}>
						<Content>
							<LeftSidebar testId="left-sidebar" width={200} collapsedState="collapsed">
								LeftSidebar
							</LeftSidebar>
							<ResizeControlledConsumer />
							<Main testId="content">Main</Main>
						</Content>
					</PageLayout>
				);
			}

			const { getByTestId } = render(<App />);

			fireEvent.click(getByTestId('left-sidebar-resize-button'));
			triggerTransitionEnd(getByTestId('left-sidebar'));

			expect(ordered).toEqual(['second fn']);
		});

		it('should still call onLeftSidebarExpand even if re-rendered during the transition', () => {
			const ordered: string[] = [];
			function App() {
				ordered.push('render');
				return (
					<PageLayout testId="grid" onLeftSidebarExpand={() => ordered.push('expand')}>
						<Content>
							<LeftSidebar testId="left-sidebar" width={200} collapsedState="collapsed">
								LeftSidebar
							</LeftSidebar>
							<Main testId="content">Main</Main>
						</Content>
					</PageLayout>
				);
			}

			const { getByTestId, rerender } = render(<App />);
			expect(ordered).toEqual(['render']);

			fireEvent.click(getByTestId('left-sidebar-resize-button'));

			rerender(<App />);

			triggerTransitionEnd(getByTestId('left-sidebar'));

			expect(ordered).toEqual(['render', 'render', 'expand']);
		});

		it('should abort onLeftSidebarExpand if unmounted during transition', () => {
			const ordered: string[] = [];
			function App() {
				useEffect(() => {
					ordered.push('mounted');
					return () => {
						ordered.push('unmounted');
					};
				}, []);
				return (
					<PageLayout testId="grid" onLeftSidebarExpand={() => ordered.push('expand')}>
						<Content>
							<LeftSidebar testId="left-sidebar" width={200} collapsedState="collapsed">
								LeftSidebar
							</LeftSidebar>
							<Main testId="content">Main</Main>
						</Content>
					</PageLayout>
				);
			}

			const { getByTestId, unmount } = render(<App />);
			const sidebar = getByTestId('left-sidebar');

			expect(ordered).toEqual(['mounted']);

			fireEvent.click(getByTestId('left-sidebar-resize-button'));

			unmount();

			triggerTransitionEnd(sidebar);

			expect(ordered).toEqual(['mounted', 'unmounted']);
		});

		it('should flush onLeftSidebarExpand if collapsed during transition', () => {
			const ordered: string[] = [];
			function App() {
				return (
					<PageLayout
						testId="grid"
						onLeftSidebarCollapse={() => ordered.push('collapse')}
						onLeftSidebarExpand={() => ordered.push('expand')}
					>
						<Content>
							<LeftSidebar testId="left-sidebar" width={200} collapsedState="collapsed">
								LeftSidebar
							</LeftSidebar>
							<Main testId="content">Main</Main>
						</Content>
					</PageLayout>
				);
			}

			const { getByTestId } = render(<App />);

			expect(ordered).toEqual([]);

			// expand
			fireEvent.click(getByTestId('left-sidebar-resize-button'));
			expect(ordered).toEqual([]);

			// flush expand by triggering collapse
			fireEvent.click(getByTestId('left-sidebar-resize-button'));
			expect(ordered).toEqual(['expand']);

			// finish collapse
			triggerTransitionEnd(getByTestId('left-sidebar'));

			expect(ordered).toEqual(['expand', 'collapse']);
		});

		it('should render the button within an override if given', () => {
			const { getByTestId, queryByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar
							testId="left-sidebar"
							// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
							overrides={{
								ResizeButton: {
									render: (Component, props) => (
										<Tooltip content="Expand" hideTooltipOnClick position="right" testId="tooltip">
											<Component {...props} />
										</Tooltip>
									),
								},
							}}
							width={200}
						>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);

			expect(queryByTestId('tooltip')).not.toBeInTheDocument();
			fireEvent.mouseOver(getByTestId('left-sidebar-resize-button'));
			completeAnimations();
			expect(getByTestId('tooltip')).toHaveTextContent('Expand');
		});

		describe('GrabArea', () => {
			const testId = 'left-sidebar';

			it('should have proper role and aria attributes', () => {
				const label = 'test';
				const { getByTestId } = render(
					<PageLayout testId="grid">
						<Content>
							<LeftSidebar testId={testId} width={300} resizeGrabAreaLabel={label}>
								LeftSidebar
							</LeftSidebar>
							<Main testId="content">Main</Main>
						</Content>
					</PageLayout>,
				);

				const grabArea = getByTestId(`${testId}-grab-area`);

				expect(grabArea).toHaveAttribute('aria-label', label);
				expect(grabArea).toHaveAttribute('aria-orientation', 'vertical');
				expect(grabArea).toHaveAttribute('aria-valuenow');
				expect(grabArea).toHaveAttribute('aria-valuemin', '0');
				expect(grabArea).toHaveAttribute('aria-valuemax', '100');
				expect(grabArea).toHaveAttribute('role', 'slider');
			});
		});

		// Investigate why the test fails but works fine in the browser
		it('should collapse the LeftSidebar when GrabArea is clicked in expanded state', () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={300}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);

			fireEvent.mouseDown(getByTestId('left-sidebar-grab-area'));
			fireEvent.mouseUp(document);

			// Add test to see main is animating
			expect(getDimension('leftSidebarWidth')).toEqual('20px');
		});

		it('should move the LeftSidebar when GrabArea is clicked and moved in expanded state', () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={200}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);
			const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

			fireEvent.mouseDown(handle, { clientX: 200 });
			fireEvent.mouseMove(document, {
				clientX: 250,
				clientY: 0,
			});
			completeAnimations();

			expect(getDimension('leftSidebarWidth')).toEqual('290px');

			fireEvent.mouseUp(handle);
			completeAnimations();
		});

		it('it should call resizeStart and resizeEnd events when GrabArea is clicked and moved', () => {
			const resizeStart = jest.fn();
			const resizeEnd = jest.fn();
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar
							testId="left-sidebar"
							width={200}
							onResizeStart={resizeStart}
							onResizeEnd={resizeEnd}
						>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);
			const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

			fireEvent.mouseDown(handle, { clientX: 200 });
			fireEvent.mouseMove(document, {
				clientX: 250,
				clientY: 0,
			});
			completeAnimations();
			expect(resizeStart).toHaveBeenCalledTimes(1);

			fireEvent.mouseUp(handle);
			completeAnimations();
			expect(resizeEnd).toHaveBeenCalledTimes(1);
		});

		it('should not move the LeftSidebar when GrabArea is right-clicked', () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={200}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);
			const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

			// { button: 2 } indicates a right-click. Only 0 (default) triggers a resize.
			fireEvent.mouseDown(handle, { clientX: 200, button: 2 });
			fireEvent.mouseMove(document, {
				clientX: 250,
				clientY: 0,
			});
			completeAnimations();

			expect(getDimension('leftSidebarWidth')).toEqual('240px');

			fireEvent.mouseUp(handle);
			completeAnimations();
		});

		it('should not move the LeftSidebar when GrabArea is clicked to the right', () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={200}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);
			const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

			// Click 10px to the right of the the left sidebar
			fireEvent.mouseDown(handle, { clientX: 210 });
			fireEvent.mouseMove(document, {
				clientX: 210,
				clientY: 0,
			});
			completeAnimations();

			expect(getDimension('leftSidebarWidth')).toEqual('240px');

			fireEvent.mouseUp(handle);
			completeAnimations();
		});

		it('should move the LeftSidebar when GrabArea is clicked to the right and moved in expanded state', () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={200}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);
			const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

			// Click 10px to the right of the the left sidebar
			fireEvent.mouseDown(handle, { clientX: 210 });
			fireEvent.mouseMove(document, {
				clientX: 210,
				clientY: 0,
			});
			fireEvent.mouseMove(document, {
				clientX: 250,
				clientY: 0,
			});
			completeAnimations();

			expect(getDimension('leftSidebarWidth')).toEqual('280px');

			fireEvent.mouseUp(handle);
			completeAnimations();
		});

		it('should collapse LeftSidebar when the width is below the threshold', () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={240}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);
			const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

			fireEvent.mouseDown(handle, { clientX: 240 });
			fireEvent.mouseMove(document, {
				clientX: 190,
				clientY: 0,
			});
			completeAnimations();
			fireEvent.mouseUp(handle);
			completeAnimations();

			expect(getDimension('leftSidebarWidth')).toEqual('20px');
			expect(JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!)).toEqual(
				expect.objectContaining({ isLeftSidebarCollapsed: true }),
			);
		});

		it('should expand LeftSidebar when the width is between the threshold and flyout width', () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={240}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);
			const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

			fireEvent.mouseDown(handle, { clientX: 240 });
			fireEvent.mouseMove(document, {
				clientX: 220,
				clientY: 0,
			});
			completeAnimations();
			fireEvent.mouseUp(handle);
			completeAnimations();

			expect(getDimension('leftSidebarWidth')).toEqual('240px');
			expect(JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!)).toEqual(
				expect.objectContaining({ isLeftSidebarCollapsed: false }),
			);
		});

		it('should not expand LeftSidebar more than half the width of the page when moving the mouse', () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={200}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);
			const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

			fireEvent.mouseDown(handle, { clientX: 200 });
			fireEvent.mouseMove(document, {
				clientX: 570,
				clientY: 0,
			});
			completeAnimations();

			expect(getDimension('leftSidebarWidth')).toEqual('552px');

			fireEvent.mouseUp(handle);
			completeAnimations();
		});

		type Scenario = {
			label: string;
			dispatchEvent: (args: { handle: HTMLElement }) => void;
		};

		const scenarios: Scenario[] = [
			{
				label: 'mousedown',
				dispatchEvent: ({ handle }) => fireEvent.mouseDown(handle, { clientX: 200 }),
			},
			{
				label: 'mouseup [target: handle]',
				dispatchEvent: ({ handle }) => fireEvent.mouseDown(handle, { clientX: 200 }),
			},
			{
				label: 'mouseup [target: window]',
				dispatchEvent: () => fireEvent.mouseDown(window, { clientX: 200 }),
			},
			{
				label: 'click',
				dispatchEvent: ({ handle }) => fireEvent.click(handle),
			},
			{
				label: 'keydown (Escape)',
				dispatchEvent: () => fireEvent.keyDown(window, { key: 'Escape' }),
			},
			{
				label: 'visibilitychange',
				dispatchEvent: () =>
					window.dispatchEvent(new Event('visibilitychange', { bubbles: true, cancelable: false })),
			},
		];
		// Note: not using `it.each` as our current version is not working
		// well with objects
		// 'description $label' →`$label` not being populated
		scenarios.forEach((scenario) => {
			it(`should stop resizing on event: [${scenario.label}]`, () => {
				const onResizeStart = jest.fn();
				const onResizeEnd = jest.fn();
				const { getByTestId } = render(
					<PageLayout testId="grid">
						<Content>
							<LeftSidebar
								testId="left-sidebar"
								width={200}
								onResizeStart={onResizeStart}
								onResizeEnd={onResizeEnd}
							>
								LeftSidebar
							</LeftSidebar>
							<Main testId="content">Main</Main>
						</Content>
					</PageLayout>,
				);
				const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

				expect(onResizeStart).not.toHaveBeenCalled();

				fireEvent.mouseDown(handle, { clientX: 200 });
				fireEvent.mouseMove(document, {
					clientX: 570,
					clientY: 0,
				});
				completeAnimations();

				expect(onResizeStart).toHaveBeenCalledTimes(1);
				expect(onResizeEnd).not.toHaveBeenCalled();

				onResizeStart.mockClear();

				expect(getDimension('leftSidebarWidth')).toEqual('552px');

				scenario.dispatchEvent({ handle });
				completeAnimations();

				expect(onResizeEnd).toHaveBeenCalledTimes(1);
				// a new resize should not start
				expect(onResizeStart).not.toHaveBeenCalled();

				// checking that a new resize is not starting
				fireEvent.mouseMove(document, {
					clientX: 800,
					clientY: 0,
				});
				completeAnimations();
				expect(onResizeStart).not.toHaveBeenCalled();
			});
		});

		it('should reset the sidebar to the previous width when cancelling a drag with "Escape"', () => {
			const onResizeStart = jest.fn();
			const onResizeEnd = jest.fn();
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar
							testId="left-sidebar"
							width={200}
							onResizeStart={onResizeStart}
							onResizeEnd={onResizeEnd}
						>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);
			const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

			expect(onResizeStart).not.toHaveBeenCalled();
			expect(getDimension('leftSidebarWidth')).toEqual('240px');

			fireEvent.mouseDown(handle, { clientX: 200 });
			fireEvent.mouseMove(document, {
				clientX: 570,
				clientY: 0,
			});
			completeAnimations();

			expect(onResizeStart).toHaveBeenCalledTimes(1);
			expect(onResizeEnd).not.toHaveBeenCalled();

			expect(getDimension('leftSidebarWidth')).toEqual('552px');

			window.dispatchEvent(
				new KeyboardEvent('keydown', {
					key: 'Escape',
					bubbles: true,
					cancelable: true,
				}),
			);
			completeAnimations();

			expect(onResizeEnd).toHaveBeenCalledTimes(1);

			expect(getDimension('leftSidebarWidth')).toEqual('240px');
		});

		it('should reset the sidebar to the previous width when cancelling a drag with "Escape" (repeat drags)', () => {
			const onResizeStart = jest.fn();
			const onResizeEnd = jest.fn();
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar
							testId="left-sidebar"
							width={200}
							onResizeStart={onResizeStart}
							onResizeEnd={onResizeEnd}
						>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);
			const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

			expect(onResizeStart).not.toHaveBeenCalled();
			expect(getDimension('leftSidebarWidth')).toEqual('240px');

			fireEvent.mouseDown(handle, { clientX: 200 });
			fireEvent.mouseMove(document, {
				clientX: 570,
				clientY: 0,
			});
			completeAnimations();

			expect(onResizeStart).toHaveBeenCalledTimes(1);
			expect(onResizeEnd).not.toHaveBeenCalled();

			expect(getDimension('leftSidebarWidth')).toEqual('552px');

			fireEvent.mouseUp(handle);
			completeAnimations();

			expect(onResizeEnd).toHaveBeenCalled();
			expect(getDimension('leftSidebarWidth')).toEqual('552px');

			// A second resizing operation

			onResizeStart.mockReset();
			onResizeEnd.mockReset();

			fireEvent.mouseDown(handle, { clientX: 550 });
			fireEvent.mouseMove(document, {
				clientX: 400,
				clientY: 0,
			});
			completeAnimations();

			expect(onResizeStart).toHaveBeenCalledTimes(1);
			expect(onResizeEnd).not.toHaveBeenCalled();

			expect(getDimension('leftSidebarWidth')).toEqual('402px');

			window.dispatchEvent(
				new KeyboardEvent('keydown', {
					key: 'Escape',
					bubbles: true,
					cancelable: true,
				}),
			);
			completeAnimations();

			expect(onResizeEnd).toHaveBeenCalledTimes(1);
			// back to the width at the end of the first drag
			expect(getDimension('leftSidebarWidth')).toEqual('552px');
		});

		it('should block pointer events on iframes while resizing', () => {
			const onResizeStart = jest.fn();
			const onResizeEnd = jest.fn();
			const { getByTestId, getByTitle } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar
							testId="left-sidebar"
							width={200}
							onResizeStart={onResizeStart}
							onResizeEnd={onResizeEnd}
						>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">
							<iframe src="about:blank" title="test-iframe" />
						</Main>
					</Content>
				</PageLayout>,
			);
			const handle: HTMLElement = getByTestId('left-sidebar-grab-area');
			const iframe = getByTitle('test-iframe');

			// pointer events allowed on the iframe before resizing
			expect(window.getComputedStyle(iframe).pointerEvents).toBe('');

			expect(onResizeStart).not.toHaveBeenCalled();

			fireEvent.mouseDown(handle, { clientX: 200 });
			fireEvent.mouseMove(document, {
				clientX: 570,
				clientY: 0,
			});
			completeAnimations();

			expect(onResizeStart).toHaveBeenCalledTimes(1);
			expect(onResizeEnd).not.toHaveBeenCalled();
			onResizeStart.mockClear();

			// pointer events not allowed on the iframe while resizing
			expect(window.getComputedStyle(iframe).pointerEvents).toBe('none');

			// finish resizing
			fireEvent.mouseUp(window, { clientX: 200 });
			completeAnimations();

			expect(onResizeEnd).toHaveBeenCalled();

			// pointer events are allowed again
			expect(window.getComputedStyle(iframe).pointerEvents).toBe('');
		});

		it('should not allow you to expand more than half the width of the page after a mouse movement', () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={200}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);
			const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

			fireEvent.mouseDown(handle, { clientX: 200 });
			fireEvent.mouseMove(document, {
				clientX: 570,
				clientY: 0,
			});
			completeAnimations();
			fireEvent.mouseUp(handle);
			completeAnimations();

			expect(getDimension('leftSidebarWidth')).toEqual('552px');
		});

		it('should update leftSidebarWidth in localStorage on collapse', () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={200} shouldPersistWidth>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);

			fireEvent.click(getByTestId('left-sidebar-resize-button'));
			completeAnimations();

			expect(JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!).gridState.leftSidebarWidth).toBe(
				20,
			);
		});

		it('should update leftSidebarWidth in localStorage on expand', () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={200} shouldPersistWidth>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);

			// TODO: set up by setting up the local storage state
			fireEvent.click(getByTestId('left-sidebar-resize-button'));
			completeAnimations();

			expect(JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!).gridState.leftSidebarWidth).toBe(
				20,
			);

			fireEvent.click(getByTestId('left-sidebar-resize-button'));
			completeAnimations();

			expect(JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!).gridState.leftSidebarWidth).toBe(
				240,
			);
		});

		it('should expand and collapse left sidebar on resize button click', () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={200} shouldPersistWidth>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);

			const leftSidebarResizeButton = 'left-sidebar-resize-button';

			act(() => {
				fireEvent.click(getByTestId(leftSidebarResizeButton));
				fireEvent.mouseLeave(getByTestId(leftSidebarResizeButton));
				jest.runAllTimers();
			});

			expect(JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!).gridState.leftSidebarWidth).toBe(
				20,
			);

			fireEvent.click(getByTestId(leftSidebarResizeButton));
			expect(JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!).gridState.leftSidebarWidth).toBe(
				240,
			);
		});

		it('should update leftSideBar collapsed state in localStorage when collapsed', () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={200}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);

			act(() => {
				fireEvent.click(getByTestId('left-sidebar-resize-button'));
				completeAnimations();
			});

			expect(JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!).isLeftSidebarCollapsed).toBe(
				true,
			);
		});

		it('should update leftSideBar collapsed state in localStorage when expanded', () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={200}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);

			fireEvent.click(getByTestId('left-sidebar-resize-button'));
			completeAnimations();

			expect(JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!).isLeftSidebarCollapsed).toBe(
				true,
			);

			fireEvent.click(getByTestId('left-sidebar-resize-button'));
			completeAnimations();

			expect(JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!).isLeftSidebarCollapsed).toBe(
				false,
			);
		});

		it('should mount in collapsed state if LS is corrupt and "isLeftSidebarCollapsed: true" and "leftSidebarWidth > 20"', () => {
			localStorage.clear();
			localStorage.setItem(
				'DS_PAGE_LAYOUT_UI_STATE',
				JSON.stringify({
					isLeftSidebarCollapsed: true,
					gridState: {
						leftSidebarWidth: 356,
					},
				}),
			);

			render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={200}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);

			expect(getDimension('leftSidebarWidth')).toEqual('20px');
			expect(getDimension('leftSidebarFlyoutWidth')).toEqual('240px');
		});

		it('should mount in expanded state if LS is corrupt and "isLeftSidebarCollapsed: false" and "leftSidebarWidth < 20"', () => {
			localStorage.clear();
			localStorage.setItem(
				'DS_PAGE_LAYOUT_UI_STATE',
				JSON.stringify({
					isLeftSidebarCollapsed: false,
					gridState: {
						leftSidebarWidth: 20,
					},
				}),
			);

			render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={200}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);

			expect(getDimension('leftSidebarWidth')).toEqual('240px');
			expect(getDimension('leftSidebarFlyoutWidth')).toEqual('240px');
		});

		it('should mount in expanded state if LS is corrupt and "isLeftSidebarCollapsed: false" and gridState is absent', () => {
			localStorage.clear();
			localStorage.setItem(
				'DS_PAGE_LAYOUT_UI_STATE',
				JSON.stringify({
					isLeftSidebarCollapsed: false,
				}),
			);

			render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={200}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);

			expect(getDimension('leftSidebarWidth')).toEqual('240px');
			expect(getDimension('leftSidebarFlyoutWidth')).toEqual('240px');
		});

		it('should mount in collapsed state if LS is corrupt and "isLeftSidebarCollapsed: true" and gridState is absent', () => {
			localStorage.clear();
			localStorage.setItem(
				'DS_PAGE_LAYOUT_UI_STATE',
				JSON.stringify({
					isLeftSidebarCollapsed: true,
				}),
			);

			render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={200}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);

			expect(getDimension('leftSidebarWidth')).toEqual('20px');
			expect(getDimension('leftSidebarFlyoutWidth')).toEqual('240px');
		});

		it('should mount in collapsed state if LS is corrupt and "isLeftSidebarCollapsed: true" and "leftSidebarFlyoutWidth < 20"', () => {
			localStorage.clear();
			localStorage.setItem(
				'DS_PAGE_LAYOUT_UI_STATE',
				JSON.stringify({
					isLeftSidebarCollapsed: true,
					gridState: {
						leftSidebarFlyoutWidth: 20,
					},
				}),
			);

			render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={200}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);

			expect(getDimension('leftSidebarWidth')).toEqual('20px');
			expect(getDimension('leftSidebarFlyoutWidth')).toEqual('240px');
		});

		it('should mount in expanded state if LS is corrupt and "isLeftSidebarCollapsed: false" and "leftSidebarFlyoutWidth < 20"', () => {
			localStorage.clear();
			localStorage.setItem(
				'DS_PAGE_LAYOUT_UI_STATE',
				JSON.stringify({
					isLeftSidebarCollapsed: false,
					gridState: {
						leftSidebarFlyoutWidth: 20,
					},
				}),
			);

			render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={200}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);

			expect(getDimension('leftSidebarWidth')).toEqual('240px');
			expect(getDimension('leftSidebarFlyoutWidth')).toEqual('240px');
		});

		it('should mount in collapsed state if it was unmounted while collapsed', () => {
			const { getByTestId, unmount } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={200}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);

			fireEvent.click(getByTestId('left-sidebar-resize-button'));
			completeAnimations();

			expect(JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!).isLeftSidebarCollapsed).toBe(
				true,
			);
			expect(JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!).gridState.leftSidebarWidth).toBe(
				20,
			);

			unmount();

			render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={200}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);

			expect(JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!).isLeftSidebarCollapsed).toBe(
				true,
			);
		});

		it('should mount in expanded state if it was unmounted while expanded', () => {
			const { unmount } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" shouldPersistWidth width={200}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);

			unmount();

			render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" shouldPersistWidth width={200}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);

			expect(JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!).isLeftSidebarCollapsed).toBe(
				false,
			);
			expect(JSON.parse(localStorage.getItem(PAGE_LAYOUT_LS_KEY)!).gridState.leftSidebarWidth).toBe(
				240,
			);
		});
	});

	describe('Flyout', () => {
		beforeEach(() => {
			document.documentElement.setAttribute('data-is-sidebar-collapsed', 'true');
			localStorage.setItem(
				'DS_PAGE_LAYOUT_UI_STATE',
				JSON.stringify({
					isLeftSidebarCollapsed: true,
				}),
			);
		});

		it('should call onFlyoutExpand and onFlyoutCollapse callbacks', () => {
			const onFlyoutExpand = jest.fn();
			const onFlyoutCollapse = jest.fn();
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar
							testId="component"
							width={200}
							onFlyoutExpand={onFlyoutExpand}
							onFlyoutCollapse={onFlyoutCollapse}
						>
							Contents
						</LeftSidebar>
						<Main testId="main">Main</Main>
					</Content>
				</PageLayout>,
			);

			act(() => {
				fireEvent.mouseOver(getByTestId('component'));
				jest.runAllTimers();
			});
			expect(onFlyoutExpand).toHaveBeenCalledTimes(1);

			act(() => {
				fireEvent.mouseOver(getByTestId('main'));
				jest.runAllTimers();
			});
			expect(onFlyoutCollapse).toHaveBeenCalledTimes(1);
		});

		it('should expand flyout to passed in width when mouse enters the LeftSidebar which has not been resized yet', () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Main>
						<LeftSidebar testId="component" width={200}>
							Contents
						</LeftSidebar>
					</Main>
				</PageLayout>,
			);

			act(() => {
				fireEvent.mouseOver(getByTestId('component'));
				jest.runAllTimers();
			});
			expect(document.documentElement.dataset.isSidebarCollapsed).toBe('true');
			expect(getByTestId('component')).toHaveStyleDeclaration('width', '20px');
			expect(getByTestId('component').lastElementChild).toHaveStyleDeclaration(
				'width',
				'var(--leftSidebarFlyoutWidth, 240px)',
			);
			expect(getDimension('leftSidebarFlyoutWidth')).toEqual('240px');
		});

		it('should expand flyout to preferred width when mouse enters the LeftSidebar which has been resized', () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="component" width={200}>
							Contents
							<ResizeControlledConsumer />
						</LeftSidebar>
						<Main>main</Main>
					</Content>
				</PageLayout>,
			);

			act(() => {
				fireEvent.click(getByTestId('expand'));
			});

			act(() => {
				(getByTestId('setLeftSidebarWidth') as HTMLInputElement).value = '349';
				fireEvent.click(getByTestId('setLeftSidebarWidth'));
			});

			act(() => {
				fireEvent.click(getByTestId('collapse'));
				completeAnimations();
			});

			triggerTransitionEnd(getByTestId('component'));

			act(() => {
				fireEvent.mouseOver(getByTestId('component'));
				completeAnimations();
			});

			expect(document.documentElement.dataset.isSidebarCollapsed).toBe('true');
			expect(getByTestId('component').lastElementChild).toHaveStyleDeclaration(
				'width',
				'var(--leftSidebarFlyoutWidth, 240px)',
			);
			expect(getDimension('leftSidebarFlyoutWidth')).toEqual('349px');
		});

		it('should collapse flyout when mouse leaves the LeftSidebar', () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="component" width={200}>
							Contents
						</LeftSidebar>
						<Main testId="main">Main</Main>
					</Content>
				</PageLayout>,
			);

			act(() => {
				fireEvent.mouseOver(getByTestId('component'));
				jest.runAllTimers();
			});
			expect(document.documentElement.dataset.isSidebarCollapsed).toBe('true');
			expect(getByTestId('component')).toHaveStyleDeclaration('width', '20px');
			expect(getByTestId('component').lastElementChild).toHaveStyleDeclaration(
				'width',
				'var(--leftSidebarFlyoutWidth, 240px)',
			);
			expect(getByTestId('component').querySelector('style')!.innerHTML).toEqual(
				expect.stringContaining(':root{--leftSidebarWidth:20px;}'),
			);

			act(() => {
				fireEvent.mouseOver(getByTestId('main'));
				jest.runAllTimers();
			});

			expect(getByTestId('component')).toHaveStyleDeclaration(
				'width',
				'var(--leftSidebarWidth, 0px)',
			);
			expect(getByTestId('component').lastElementChild).toHaveStyleDeclaration(
				'width',
				'var(--leftSidebarWidth, 0px)',
			);
			expect(getDimension('leftSidebarWidth')).toBe('20px');
			expect(getDimension('leftSidebarFlyoutWidth')).toEqual('240px');
		});

		it('should collapse flyout when mouse leaves the browser', () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="component" width={200}>
							Contents
						</LeftSidebar>
						<Main testId="main">Main</Main>
					</Content>
				</PageLayout>,
			);
			const leftSidebar = getByTestId('component');
			expect(leftSidebar).toHaveStyleDeclaration('width', 'var(--leftSidebarWidth, 0px)');
			act(() => {
				fireEvent.mouseOver(leftSidebar);
				jest.runAllTimers();
			});
			expect(leftSidebar).toHaveStyleDeclaration('width', '20px');
			expect(leftSidebar.querySelector('style')!.innerHTML).toEqual(
				expect.stringContaining(':root{--leftSidebarWidth:20px;}'),
			);

			act(() => {
				fireEvent.mouseLeave(leftSidebar);
				jest.runAllTimers();
			});

			expect(leftSidebar).toHaveStyleDeclaration('width', 'var(--leftSidebarWidth, 0px)');
			expect(leftSidebar.lastElementChild).toHaveStyleDeclaration(
				'width',
				'var(--leftSidebarWidth, 0px)',
			);
		});

		it('should call onFlyoutCollapse callbacks when mouse leaves the browser', () => {
			const onFlyoutCollapse = jest.fn();
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="component" width={200} onFlyoutCollapse={onFlyoutCollapse}>
							Contents
						</LeftSidebar>
						<Main testId="main">Main</Main>
					</Content>
				</PageLayout>,
			);

			act(() => {
				fireEvent.mouseOver(getByTestId('component'));
				fireEvent.mouseLeave(getByTestId('component'));
				jest.runAllTimers();
			});
			expect(onFlyoutCollapse).toHaveBeenCalledTimes(1);
		});

		it('should expand flyout when mouse enters the LeftSidebar when isFixed is false', () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Main>
						<LeftSidebar isFixed={false} testId="component" width={200}>
							Contents
						</LeftSidebar>
					</Main>
				</PageLayout>,
			);

			act(() => {
				fireEvent.mouseOver(getByTestId('component'));
				jest.runAllTimers();
			});
			expect(document.documentElement.dataset.isSidebarCollapsed).toBe('true');
			expect(getByTestId('component')).toHaveStyleDeclaration(
				'width',
				'var(--leftSidebarFlyoutWidth, 240px)',
			);
			expect(getByTestId('component').querySelector('style')!.innerHTML).toEqual(
				expect.stringContaining(':root{--leftSidebarWidth:20px;}'),
			);
		});

		it('should collapse flyout when mouse leaves the LeftSidebar when isFixed is false', () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar isFixed={false} testId="leftsidebar" width={200}>
							Contents
						</LeftSidebar>
						<Main testId="main">Stuff</Main>
					</Content>
				</PageLayout>,
			);

			act(() => {
				fireEvent.mouseOver(getByTestId('leftsidebar'));
				completeAnimations();
			});
			expect(document.documentElement.dataset.isSidebarCollapsed).toBe('true');
			expect(getByTestId('leftsidebar')).toHaveStyleDeclaration(
				'width',
				'var(--leftSidebarFlyoutWidth, 240px)',
			);
			expect(getByTestId('leftsidebar').querySelector('style')!.innerHTML).toEqual(
				expect.stringContaining(':root{--leftSidebarWidth:20px;}'),
			);

			act(() => {
				fireEvent.mouseOver(getByTestId('main'));
				completeAnimations();
			});

			expect(getByTestId('leftsidebar')).toHaveStyleDeclaration(
				'width',
				'var(--leftSidebarWidth, 0px)',
			);
			expect(getDimension('leftSidebarWidth')).toBe('20px');
		});

		it('should show the contents of left sidebar when flyout is open', async () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Main>
						<LeftSidebar testId="component" width={200}>
							<div>Contents</div>
						</LeftSidebar>
					</Main>
				</PageLayout>,
			);

			act(() => {
				fireEvent.mouseOver(getByTestId('component'));
				jest.runAllTimers();
			});

			expect(
				getComputedStyle(getByTestId('component').lastElementChild!.firstElementChild!).opacity,
			).toBe('1');
		});

		it('should show the contents of left sidebar when flyout is open and isFixed is false', async () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Main>
						<LeftSidebar isFixed={false} testId="component" width={200}>
							<div>Contents</div>
						</LeftSidebar>
					</Main>
				</PageLayout>,
			);

			act(() => {
				fireEvent.mouseOver(getByTestId('component'));
				jest.runAllTimers();
			});

			expect(
				getComputedStyle(getByTestId('component').lastElementChild!.firstElementChild!).opacity,
			).toBe('1');
		});
	});

	describe('Accessibility features', () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});

		afterEach(() => {
			jest.useRealTimers();
			localStorage.clear();
		});

		it('should have all accessibility data-attrs', () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={200}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);

			const resizeButton: HTMLElement = getByTestId('left-sidebar-resize-button');
			const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

			expect(handle).toHaveAttribute('role');
			expect(handle).toHaveAttribute('aria-label');
			expect(handle).toHaveAttribute('aria-valuenow');
			expect(handle).toHaveAttribute('aria-valuemin');
			expect(handle).toHaveAttribute('aria-valuemax');
			expect(resizeButton).toHaveAttribute('aria-expanded');
		});

		it('should change step by 10px on arrow left-top/right-bottom push', () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={DEFAULT_LEFT_SIDEBAR_FLYOUT_WIDTH}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);

			const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

			fireEvent.focus(handle);
			fireEvent.keyDown(handle, { keyCode: 39 });
			completeAnimations();

			expect(getDimension('leftSidebarWidth')).toEqual(
				`${DEFAULT_LEFT_SIDEBAR_FLYOUT_WIDTH + 10}px`,
			);

			fireEvent.keyDown(handle, { keyCode: 37 });
			completeAnimations();

			expect(getDimension('leftSidebarWidth')).toEqual(`${DEFAULT_LEFT_SIDEBAR_FLYOUT_WIDTH}px`);

			fireEvent.keyDown(handle, { keyCode: 40 });
			completeAnimations();

			expect(getDimension('leftSidebarWidth')).toEqual(
				`${DEFAULT_LEFT_SIDEBAR_FLYOUT_WIDTH + 10}px`,
			);

			fireEvent.keyDown(handle, { keyCode: 38 });
			completeAnimations();

			expect(getDimension('leftSidebarWidth')).toEqual(`${DEFAULT_LEFT_SIDEBAR_FLYOUT_WIDTH}px`);
		});

		it('should expand to maximum and minimum widths on arrow left-top/right-bottom push with a modifier', () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={DEFAULT_LEFT_SIDEBAR_FLYOUT_WIDTH}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);

			const handle: HTMLElement = getByTestId('left-sidebar-grab-area');
			const maxWidth = 512;

			//Meta key
			fireEvent.focus(handle);
			fireEvent.keyDown(handle, { keyCode: 39, metaKey: true });
			completeAnimations();

			expect(getDimension('leftSidebarWidth')).toEqual(`${maxWidth}px`);

			fireEvent.keyDown(handle, { keyCode: 37, metaKey: true });
			completeAnimations();

			expect(getDimension('leftSidebarWidth')).toEqual(`${DEFAULT_LEFT_SIDEBAR_WIDTH}px`);

			//Shift key
			fireEvent.keyDown(handle, { keyCode: 39, shiftKey: true });
			completeAnimations();

			expect(getDimension('leftSidebarWidth')).toEqual(`${maxWidth}px`);

			fireEvent.keyDown(handle, { keyCode: 38, shiftKey: true });
			completeAnimations();

			expect(getDimension('leftSidebarWidth')).toEqual(`${DEFAULT_LEFT_SIDEBAR_WIDTH}px`);

			// alt key
			fireEvent.focus(handle);
			fireEvent.keyDown(handle, { keyCode: 39, altKey: true });
			completeAnimations();

			expect(getDimension('leftSidebarWidth')).toEqual(`${maxWidth}px`);

			fireEvent.keyDown(handle, { keyCode: 37, altKey: true });
			completeAnimations();

			expect(getDimension('leftSidebarWidth')).toEqual(`${DEFAULT_LEFT_SIDEBAR_WIDTH}px`);

			// ctrl key
			fireEvent.focus(handle);
			fireEvent.keyDown(handle, { keyCode: 39, ctrlKey: true });
			completeAnimations();

			expect(getDimension('leftSidebarWidth')).toEqual(`${maxWidth}px`);

			fireEvent.keyDown(handle, { keyCode: 37, ctrlKey: true });
			completeAnimations();

			expect(getDimension('leftSidebarWidth')).toEqual(`${DEFAULT_LEFT_SIDEBAR_WIDTH}px`);
		});

		it(`should not change width of navbar on min ${DEFAULT_LEFT_SIDEBAR_FLYOUT_WIDTH}px limit`, () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={DEFAULT_LEFT_SIDEBAR_FLYOUT_WIDTH}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);

			const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

			fireEvent.keyDown(handle, { keyCode: 37 });

			expect(getDimension('leftSidebarWidth')).toEqual(`${DEFAULT_LEFT_SIDEBAR_FLYOUT_WIDTH}px`);
		});

		it(`should not change width of navbar on max ${
			Math.round(window.innerWidth / 2) - +getDimension('leftPanelWidth')
		}px limit`, () => {
			const maxWidth = Math.round(window.innerWidth / 2) - +getDimension('leftPanelWidth');
			localStorage.setItem(
				'DS_PAGE_LAYOUT_UI_STATE',
				JSON.stringify({
					isLeftSidebarCollapsed: false,
					gridState: {
						leftSidebarWidth: maxWidth,
						leftSidebarFlyoutWidth: maxWidth,
					},
				}),
			);
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={maxWidth}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);

			const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

			fireEvent.keyDown(handle, { keyCode: 39 });

			expect(getDimension('leftSidebarWidth')).toEqual(`${maxWidth}px`);
		});

		it('should make the left sidebar hidden and noninteractive to assistive technologies when left sidebar is collapsed', () => {
			localStorage.setItem(
				'DS_PAGE_LAYOUT_UI_STATE',
				JSON.stringify({
					isLeftSidebarCollapsed: true,
					gridState: {},
				}),
			);

			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={DEFAULT_LEFT_SIDEBAR_FLYOUT_WIDTH}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);

			expect(getByTestId('left-sidebar-grab-area')).toBeDisabled();
			expect(getByTestId('left-sidebar-grab-area')).toHaveAttribute('aria-hidden', 'true');
			expect(getByTestId('left-sidebar-resize-children-wrapper')).toHaveAttribute(
				'aria-hidden',
				'true',
			);
		});

		it('should make the left sidebar visible and interactive to assistive technologies when left sidebar is expanded', () => {
			localStorage.setItem(
				'DS_PAGE_LAYOUT_UI_STATE',
				JSON.stringify({
					isLeftSidebarCollapsed: false,
					gridState: {},
				}),
			);

			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={DEFAULT_LEFT_SIDEBAR_FLYOUT_WIDTH}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);

			expect(getByTestId('left-sidebar-grab-area')).toBeEnabled();
			expect(getByTestId('left-sidebar-grab-area')).toHaveAttribute('aria-hidden', 'false');
			expect(getByTestId('left-sidebar-resize-children-wrapper')).toHaveAttribute(
				'aria-hidden',
				'false',
			);
		});

		it('should collapse navbar on line Enter, Space or Click (that the same)', () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Content>
						<LeftSidebar testId="left-sidebar" width={DEFAULT_LEFT_SIDEBAR_FLYOUT_WIDTH}>
							LeftSidebar
						</LeftSidebar>
						<Main testId="content">Main</Main>
					</Content>
				</PageLayout>,
			);

			const resizeButton: HTMLElement = getByTestId('left-sidebar-resize-button');
			const handle: HTMLElement = getByTestId('left-sidebar-grab-area');

			expect(resizeButton).toHaveAttribute('aria-expanded', 'true');

			fireEvent.focus(handle);
			fireEvent.keyDown(handle, { keyCode: 32, key: ' ' });

			expect(resizeButton).toHaveAttribute('aria-expanded', 'false');
		});
	});

	describe('<LeftSidebar>', () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});
		const completeAnimations = () => {
			act(() => {
				jest.runAllTimers();
			});
		};
		const triggerTransitionEnd = (component: any) => {
			// JSDom doesn't trigger transitionend event
			// https://github.com/jsdom/jsdom/issues/1781
			act(() => {
				const transitionEndEvent = new Event('transitionend', {
					bubbles: true,
					cancelable: false,
				});
				(transitionEndEvent as any).propertyName = 'width';

				fireEvent(component, transitionEndEvent);
				completeAnimations();
			});
		};

		it('should mount the LeftSidebar in collapsed mode if already collapsed previously', () => {
			localStorage.setItem(
				'DS_PAGE_LAYOUT_UI_STATE',
				JSON.stringify({
					isLeftSidebarCollapsed: true,
				}),
			);

			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Main>
						<LeftSidebar testId="component" width={200}>
							Contents
						</LeftSidebar>
					</Main>
				</PageLayout>,
			);

			triggerTransitionEnd(getByTestId('grid'));
			expect(getByTestId('component')).toHaveStyleDeclaration(
				'width',
				'var(--leftSidebarWidth, 0px)',
			);
			expect(getByTestId('component').querySelector('style')!.innerHTML).toEqual(
				expect.stringContaining(':root{--leftSidebarWidth:20px;}'),
			);
		});

		it('should render with the width that was passed to it', () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Main>
						<LeftSidebar testId="component" width={200}>
							Contents
						</LeftSidebar>
					</Main>
				</PageLayout>,
			);

			expect(getByTestId('component')).toHaveStyleDeclaration(
				'width',
				'var(--leftSidebarWidth, 0px)',
			);
			expect(getByTestId('component').querySelector('style')!.innerHTML).toEqual(
				expect.stringContaining(':root{--leftSidebarWidth:240px;}'),
			);
		});

		it('should hydrate with the width that was passed to it', () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Main>
						<LeftSidebar testId="component" width={200}>
							Contents
						</LeftSidebar>
					</Main>
				</PageLayout>,
				{ hydrate: true },
			);
			expect(getByTestId('component')).toHaveStyleDeclaration(
				'width',
				'var(--leftSidebarWidth, 0px)',
			);
			expect(getByTestId('component').querySelector('style')!.innerHTML).toEqual(
				expect.stringContaining(':root{--leftSidebarWidth:240px;}'),
			);
		});

		it('should be "fixed" when isFixed prop is passed', () => {
			const { getByTestId } = render(
				<PageLayout testId="grid">
					<Main>
						<LeftSidebar testId="component" width={200} isFixed>
							Contents
						</LeftSidebar>
					</Main>
				</PageLayout>,
			);
			expect(getByTestId('component').lastElementChild).toHaveStyleDeclaration('position', 'fixed');
		});

		it('should store the width in localStorage on mount', () => {
			render(
				<PageLayout testId="grid">
					<LeftSidebar testId="component" isFixed width={50}>
						Contents
					</LeftSidebar>
				</PageLayout>,
			);

			expect(JSON.parse(localStorage.getItem('DS_PAGE_LAYOUT_UI_STATE')!)).toEqual({
				gridState: {
					leftSidebarWidth: 240,
					leftSidebarFlyoutWidth: 240,
				},
				isLeftSidebarCollapsed: false,
			});
		});
	});
});

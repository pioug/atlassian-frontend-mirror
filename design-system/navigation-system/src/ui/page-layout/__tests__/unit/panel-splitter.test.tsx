import React, { useCallback, useEffect, useRef, useState } from 'react';

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import createStub from 'raf-stub';
import invariant from 'tiny-invariant';

import { OpenLayerObserver } from '@atlaskit/layering/experimental/open-layer-observer';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';

import * as panelSplitterWidthUtils from '../../panel-splitter/get-width';
import { PanelSplitter } from '../../panel-splitter/panel-splitter';
import {
	PanelSplitterProvider,
	type PanelSplitterProviderProps,
} from '../../panel-splitter/provider';
import type { ResizeBounds } from '../../panel-splitter/types';

// As per https://atlassian.design/components/pragmatic-drag-and-drop/core-package/testing/jest-and-jsdom
// We need to wait for the next animation frame to allow the drag event to be fired, as they are throttled
const rafStub = createStub();
jest.spyOn(window, 'requestAnimationFrame').mockImplementation(rafStub.add);

const resizingCssVar = '--panel-splitter-resizing';
type TestArgs = Omit<Partial<PanelSplitterProviderProps>, 'panelWidth'> & {
	initialPanelWidth?: number;
	textDirection?: 'ltr' | 'rtl';
	onResizeStart?: (args: { initialWidth: number }) => void;
	onResizeEnd?: (args: { initialWidth: number; finalWidth: number }) => void;
	testId?: string;
};

function setTextDirection(value: 'ltr' | 'rtl'): () => void {
	const original = window.getComputedStyle;

	// JSDOM does not work well with `direction` + `getComputedStyle`
	window.getComputedStyle = (el: Element) => {
		const result = original(el);
		result.direction = value;
		return result;
	};

	return function cleanup() {
		window.getComputedStyle = original;
	};
}

function setComputedWidth(element: HTMLElement, width: number): () => void {
	const original = window.getComputedStyle;

	// JSDOM does not work well with `direction` + `getComputedStyle`
	window.getComputedStyle = (el: Element) => {
		const result = original(el);
		if (el !== element) {
			return result;
		}

		result.width = `${width}px`;
		return result;
	};

	return function cleanup() {
		window.getComputedStyle = original;
	};
}

const TestComponent = ({
	textDirection = 'ltr',
	onResizeStart,
	onResizeEnd,
	testId = 'panel-splitter',
	...overrides
}: TestArgs = {}): JSX.Element => {
	const panelSplitterParentRef = useRef<HTMLDivElement | null>(null);
	const [panelWidth, setPanelWidth] = useState(overrides.initialPanelWidth ?? 300);

	const getResizeBounds = useCallback((): ResizeBounds => {
		return { min: '200px', max: '400px' };
	}, []);

	useEffect(() => {
		invariant(panelSplitterParentRef.current);
		return combine(
			setTextDirection(textDirection),
			setComputedWidth(panelSplitterParentRef.current, panelWidth),
		);
	}, [textDirection, panelWidth]);

	return (
		// PanelSplitter accesses the open layer observer, so needs to be wrapped in the provider.
		// In apps using nav4 correctly, the OpenLayerObserver is provided by `Root`.
		<OpenLayerObserver>
			<div
				dir={textDirection}
				ref={panelSplitterParentRef}
				data-testid="panel-splitter-parent"
				style={{
					width: `${panelWidth}px`,
				}}
			>
				<PanelSplitterProvider
					panelRef={panelSplitterParentRef}
					panelWidth={panelWidth}
					onCompleteResize={setPanelWidth}
					getResizeBounds={getResizeBounds}
					resizingCssVar={resizingCssVar}
					{...overrides}
				>
					<PanelSplitter
						label="Panel splitter"
						onResizeStart={onResizeStart}
						onResizeEnd={onResizeEnd}
						testId={testId}
					/>
				</PanelSplitterProvider>
			</div>
		</OpenLayerObserver>
	);
};

describe('PanelSplitter', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// As per https://atlassian.design/components/pragmatic-drag-and-drop/core-package/testing/jest-and-jsdom
	afterEach(async () => {
		// cleanup any pending drags
		fireEvent.dragEnd(window);

		// Optional: unwind a post-drop browser bug fix
		// tick forward a micro task to flush a post-drag bug fix
		await 1;
		// this will trigger the fix to be released
		fireEvent.pointerMove(window);
	});

	it('should be accessible', async () => {
		const { container } = render(<TestComponent />);

		await expect(container).toBeAccessible();
	});

	it('should render an input range with the correct label', () => {
		render(<TestComponent />);

		expect(
			// Using `hidden: true` as the panel splitter is hidden by default, and only shown on viewports greater than 48rem (using css)
			screen.getByRole('slider', { name: 'Panel splitter', hidden: true }),
		).toBeInTheDocument();
	});

	it('should be visible from medium viewports', () => {
		render(<TestComponent />);

		expect(screen.getByTestId('panel-splitter-container')).toHaveCompiledCss('display', 'none');
		expect(screen.getByTestId('panel-splitter-container')).toHaveCompiledCss('display', 'block', {
			media: '(min-width: 48rem)',
		});
	});

	it('should not render the panel splitter when isEnabled is false', () => {
		render(<TestComponent isEnabled={false} />);

		expect(
			// Using `hidden: true` as the panel splitter (when rendered) is hidden by default, and only shown on viewports greater than 48rem (using css)
			screen.queryByRole('slider', { name: 'Panel splitter', hidden: true }),
		).not.toBeInTheDocument();
	});

	it('should call the resize callback with the current width when completing resize', async () => {
		const onCompleteResize = jest.fn();
		render(<TestComponent initialPanelWidth={100} onCompleteResize={onCompleteResize} />);
		const splitter = screen.getByTestId('panel-splitter');

		expect(onCompleteResize).not.toHaveBeenCalled();

		fireEvent.dragStart(splitter);
		expect(onCompleteResize).not.toHaveBeenCalled();

		fireEvent.drop(splitter);
		expect(onCompleteResize).toHaveBeenCalledWith(100);
	});

	describe('when text direction is left to right (ltr)', () => {
		describe('when position is end', () => {
			it('should increase the width when resizing to the right with mouse', async () => {
				render(
					<TestComponent
						initialPanelWidth={100}
						getResizeBounds={() => ({ min: '50px', max: '500px' })}
					/>,
				);

				const splitter = screen.getByTestId('panel-splitter');

				fireEvent.dragStart(splitter, { clientX: 100 });
				fireEvent.dragOver(splitter, { clientX: 200 });

				rafStub.step();

				expect(screen.getByTestId('panel-splitter-parent')).toHaveStyle({
					[resizingCssVar]: 'clamp(50px, 200px, 500px)',
				});
			});

			it('should decrease the width when resizing to the left with mouse', async () => {
				render(
					<TestComponent
						initialPanelWidth={200}
						getResizeBounds={() => ({ min: '50px', max: '500px' })}
					/>,
				);

				const splitter = screen.getByTestId('panel-splitter');

				fireEvent.dragStart(splitter, { clientX: 200 });
				fireEvent.dragOver(splitter, { clientX: 100 });

				rafStub.step();

				expect(screen.getByTestId('panel-splitter-parent')).toHaveStyle({
					[resizingCssVar]: 'clamp(50px, 100px, 500px)',
				});
			});
		});

		describe('when position is start', () => {
			it('should decrease the width when resizing to the right', async () => {
				render(
					<TestComponent
						initialPanelWidth={100}
						getResizeBounds={() => ({ min: '50px', max: '500px' })}
						position="start"
					/>,
				);

				const splitter = screen.getByTestId('panel-splitter');

				fireEvent.dragStart(splitter, { clientX: 100 });
				fireEvent.dragOver(splitter, { clientX: 150 });

				rafStub.step();

				expect(screen.getByTestId('panel-splitter-parent')).toHaveStyle({
					[resizingCssVar]: 'clamp(50px, 50px, 500px)',
				});
			});

			it('should increase the width when resizing to the left', async () => {
				render(
					<TestComponent
						initialPanelWidth={200}
						getResizeBounds={() => ({ min: '50px', max: '500px' })}
						position="start"
					/>,
				);
				const splitter = screen.getByTestId('panel-splitter');

				fireEvent.dragStart(splitter, { clientX: 200 });
				fireEvent.dragOver(splitter, { clientX: 100 });

				rafStub.step();

				expect(screen.getByTestId('panel-splitter-parent')).toHaveStyle({
					[resizingCssVar]: 'clamp(50px, 300px, 500px)',
				});
			});
		});
	});

	describe('when text direction is right to left (rtl)', () => {
		describe('when position is end', () => {
			it('should decrease the width when resizing to the right', async () => {
				render(
					<TestComponent
						initialPanelWidth={200}
						getResizeBounds={() => ({ min: '50px', max: '500px' })}
						textDirection="rtl"
					/>,
				);

				const splitter = screen.getByTestId('panel-splitter');

				fireEvent.dragStart(splitter, { clientX: 200 });
				fireEvent.dragOver(splitter, { clientX: 300 });

				rafStub.step();

				expect(screen.getByTestId('panel-splitter-parent')).toHaveStyle({
					[resizingCssVar]: 'clamp(50px, 100px, 500px)',
				});
			});

			it('should increase the width when resizing to the left', async () => {
				render(
					<TestComponent
						initialPanelWidth={200}
						getResizeBounds={() => ({ min: '50px', max: '500px' })}
						textDirection="rtl"
					/>,
				);

				const splitter = screen.getByTestId('panel-splitter');

				fireEvent.dragStart(splitter, { clientX: 200 });
				fireEvent.dragOver(splitter, { clientX: 100 });

				rafStub.step();

				expect(screen.getByTestId('panel-splitter-parent')).toHaveStyle({
					[resizingCssVar]: 'clamp(50px, 300px, 500px)',
				});
			});
		});

		describe('when position is start', () => {
			it('should increase the width when resizing to the right', async () => {
				render(
					<TestComponent
						initialPanelWidth={200}
						getResizeBounds={() => ({ min: '50px', max: '500px' })}
						textDirection="rtl"
						position="start"
					/>,
				);

				const splitter = screen.getByTestId('panel-splitter');

				fireEvent.dragStart(splitter, { clientX: 200 });
				fireEvent.dragOver(splitter, { clientX: 300 });

				rafStub.step();

				expect(screen.getByTestId('panel-splitter-parent')).toHaveStyle({
					[resizingCssVar]: 'clamp(50px, 300px, 500px)',
				});
			});

			it('should decrease the width when resizing to the left', async () => {
				render(
					<TestComponent
						initialPanelWidth={200}
						getResizeBounds={() => ({ min: '50px', max: '500px' })}
						textDirection="rtl"
						position="start"
					/>,
				);

				const splitter = screen.getByTestId('panel-splitter');

				fireEvent.dragStart(splitter, { clientX: 200 });
				fireEvent.dragOver(splitter, { clientX: 100 });

				rafStub.step();

				expect(screen.getByTestId('panel-splitter-parent')).toHaveStyle({
					[resizingCssVar]: 'clamp(50px, 100px, 500px)',
				});
			});
		});
	});

	it('should handle changing text direction between drags', () => {
		// Testing with position="end" to mimic the sidebar
		// Assuming page is width: 1000px

		const { rerender } = render(
			<TestComponent
				initialPanelWidth={100}
				getResizeBounds={() => ({ min: '50px', max: '500px' })}
				textDirection="ltr"
				position="end"
			/>,
		);

		const panel = screen.getByTestId('panel-splitter-parent');
		const splitter = screen.getByTestId('panel-splitter');

		// Dragging right will increase it's width
		fireEvent.dragStart(splitter, { clientX: 100 });
		fireEvent.dragOver(splitter, { clientX: 200 });
		rafStub.step();

		expect(screen.getByTestId('panel-splitter-parent')).toHaveStyle({
			[resizingCssVar]: 'clamp(50px, 200px, 500px)',
		});

		// Need to update the width manually before the drop ends
		// so that the reading of the computed with at the end of the
		// drop will get the correct final computed value
		setComputedWidth(panel, 200);
		fireEvent.drop(splitter);

		// Changing panel to rtl
		// Will now sit on the right 200px of our 1000px box
		rerender(
			<TestComponent
				getResizeBounds={() => ({ min: '50px', max: '500px' })}
				textDirection="rtl"
				position="end"
			/>,
		);

		// Dragging left will increase it's width as it's positioned
		// on the right hand side of the screen
		fireEvent.dragStart(splitter, { clientX: 800 });
		fireEvent.dragOver(splitter, { clientX: 700 });
		rafStub.step();

		expect(screen.getByTestId('panel-splitter-parent')).toHaveStyle({
			[resizingCssVar]: 'clamp(50px, 300px, 500px)',
		});
	});

	describe('keyboard resizing - input range (slider)', () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		it('should default the range input (slider) properties to placeholder values', async () => {
			render(
				<TestComponent
					initialPanelWidth={100}
					getResizeBounds={() => ({ min: '50px', max: '500px' })}
				/>,
			);

			const rangeInput = screen.getByRole('slider', { name: 'Panel splitter', hidden: true });

			expect(rangeInput).toHaveAttribute('min', '200');
			expect(rangeInput).toHaveAttribute('max', '500');
			// Even though the panel width is 100px, the range input should default a value within the min and max
			expect(rangeInput).toHaveValue('200');
			expect(rangeInput).toHaveAttribute('aria-valuetext', '0% width');
		});

		it('should calculate and update the range input (slider) properties once focused', async () => {
			render(
				<TestComponent
					initialPanelWidth={100}
					getResizeBounds={() => ({ min: '50px', max: '500px' })}
				/>,
			);

			const rangeInput = screen.getByRole('slider', { name: 'Panel splitter', hidden: true });
			rangeInput.focus();

			// For react 18 compatibility, we need to wait for the component to be updated after the focus event
			await waitFor(() => expect(rangeInput).toHaveAttribute('min', '50'));

			expect(rangeInput).toHaveAttribute('max', '500');
			// Even though the panel width is 100px, the range input should default a value within the min and max
			expect(rangeInput).toHaveValue('100');
			expect(rangeInput).toHaveAttribute('aria-valuetext', '11% width');
		});

		it('should have the correct value text for screen readers', async () => {
			render(
				<TestComponent
					initialPanelWidth={300}
					getResizeBounds={() => ({ min: '100px', max: '500px' })}
				/>,
			);

			const rangeInput = screen.getByRole('slider', { name: 'Panel splitter', hidden: true });
			// Focus to calculate and update the element properties
			rangeInput.focus();

			// Width is 300px, which is in the exact middle (50%) of the resizable area (100px to 500px)
			// For react 18 compatibility, we need to wait for the component to be updated after the focus event
			await waitFor(() => expect(rangeInput).toHaveAttribute('aria-valuetext', '50% width'));
			// Resize to the min
			fireEvent.change(rangeInput, { target: { value: 100 } });

			// Advance timers to allow debounced functions to run
			act(() => jest.runOnlyPendingTimers());

			expect(rangeInput).toHaveAttribute('aria-valuetext', '0% width');

			// Resize to the max
			fireEvent.change(rangeInput, { target: { value: 500 } });
			expect(rangeInput).toHaveAttribute('aria-valuetext', '100% width');
		});

		it('should increase the width when resizing to the right with keyboard', async () => {
			render(
				<TestComponent
					initialPanelWidth={100}
					getResizeBounds={() => ({ min: '50px', max: '500px' })}
				/>,
			);

			const rangeInput = screen.getByRole('slider', { name: 'Panel splitter', hidden: true });
			rangeInput.focus();
			// For react 18 compatibility, we need to wait for the component to be updated after the focus event
			await waitFor(() => expect(rangeInput).toHaveAttribute('min', '50'));

			fireEvent.change(rangeInput, { target: { value: 120 } });
			// Advance timers to allow debounced functions to run
			act(() => jest.runOnlyPendingTimers());

			expect(screen.getByTestId('panel-splitter-parent')).toHaveStyle({
				width: '120px',
			}),
				expect(rangeInput).toHaveValue('120');
		});

		it('should decrease the width when resizing to the left with keyboard', async () => {
			render(
				<TestComponent
					initialPanelWidth={200}
					getResizeBounds={() => ({ min: '50px', max: '500px' })}
				/>,
			);

			const rangeInput = screen.getByRole('slider', { name: 'Panel splitter', hidden: true });
			rangeInput.focus();
			// For react 18 compatibility, we need to wait for the component to be updated after the focus event
			await waitFor(() => expect(rangeInput).toHaveAttribute('min', '50'));

			fireEvent.change(rangeInput, { target: { value: 80 } });
			// Advance timers to allow debounced functions to run
			act(() => jest.runOnlyPendingTimers());

			expect(screen.getByTestId('panel-splitter-parent')).toHaveStyle({
				width: '80px',
			});

			expect(rangeInput).toHaveValue('80');
		});

		it('should not be resizable beyond the min and max widths', async () => {
			render(
				<TestComponent
					initialPanelWidth={100}
					getResizeBounds={() => ({ min: '50px', max: '500px' })}
				/>,
			);

			const rangeInput = screen.getByRole('slider', { name: 'Panel splitter', hidden: true });
			rangeInput.focus();

			// Increase width to 600 (above the max of 500)
			fireEvent.change(rangeInput, { target: { value: 600 } });

			// Advance timers to allow debounced functions to run
			act(() => jest.runOnlyPendingTimers());

			expect(screen.getByTestId('panel-splitter-parent')).toHaveStyle({
				width: '500px',
			});
			expect(rangeInput).toHaveValue('500');

			// Decrease width to 30 (below the min of 50)
			fireEvent.change(rangeInput, { target: { value: 30 } });

			// Advance timers to allow debounced functions to run
			act(() => jest.runOnlyPendingTimers());

			expect(screen.getByTestId('panel-splitter-parent')).toHaveStyle({
				width: '50px',
			});
			expect(rangeInput).toHaveValue('50');
		});

		it('should update the range input (slider) properties when the viewport is resized and the element is focused', async () => {
			const defaultWindowWidth = window.innerWidth;
			window.innerWidth = 1000;

			const initialResizeBounds: ResizeBounds = { min: '50px', max: '50vw' };
			render(<TestComponent initialPanelWidth={300} getResizeBounds={() => initialResizeBounds} />);

			const rangeInput = screen.getByRole('slider', { name: 'Panel splitter', hidden: true });
			rangeInput.focus();

			// For react 18 compatibility, we need to wait for the component to be updated after the focus event
			await waitFor(() => expect(rangeInput).toHaveAttribute('min', '50'));
			// The 50vw max width is converted to 500px (50% of 1000px)
			expect(rangeInput).toHaveAttribute('max', '500');
			expect(rangeInput).toHaveValue('300');
			expect(rangeInput).toHaveAttribute('aria-valuetext', '55% width');

			fireEvent.change(rangeInput, { target: { value: 500 } });

			expect(rangeInput).toHaveValue('500');
			expect(rangeInput).toHaveAttribute('aria-valuetext', '100% width');

			// Simulate the window being resized to 800px
			window.innerWidth = 800;
			fireEvent.resize(window);

			expect(rangeInput).toHaveAttribute('min', '50');
			// The 50vw max width is now converted to 400px (50% of 800px)
			expect(rangeInput).toHaveAttribute('max', '400');

			// The internal range input value the same value (more than the max), but the screen reader text
			// should be capped out at 100%
			expect(rangeInput).toHaveValue('500');
			expect(rangeInput).toHaveAttribute('aria-valuetext', '100% width');

			window.innerWidth = defaultWindowWidth;
		});

		it('should not update the range input (slider) properties when the viewport is resized and the element is not focused', async () => {
			const defaultWindowWidth = window.innerWidth;
			window.innerWidth = 1000;

			const initialResizeBounds: ResizeBounds = { min: '50px', max: '50vw' };
			render(<TestComponent initialPanelWidth={300} getResizeBounds={() => initialResizeBounds} />);

			const rangeInput = screen.getByRole('slider', { name: 'Panel splitter', hidden: true });

			// As the element isn't focused, it should be using default (placeholder) min and max values
			expect(rangeInput).toHaveAttribute('min', '200');
			expect(rangeInput).toHaveAttribute('max', '500');
			expect(rangeInput).toHaveValue('300');
			expect(rangeInput).toHaveAttribute('aria-valuetext', '33% width');

			// Simulate the window being resized to 800px
			window.innerWidth = 800;
			fireEvent.resize(window);

			expect(rangeInput).toHaveAttribute('min', '200');
			// Because the element was not focused, we don't expect the max to be recalculated
			expect(rangeInput).toHaveAttribute('max', '500');
			expect(rangeInput).toHaveValue('300');
			expect(rangeInput).toHaveAttribute('aria-valuetext', '33% width');

			window.innerWidth = defaultWindowWidth;
		});
	});

	describe('splitter styles', () => {
		// We are testing these styles directly as they can't be asserted in a VR test.
		it('should delay showing the panel splitter on hover', () => {
			render(<TestComponent />);

			const splitter = screen.getByTestId('panel-splitter');

			expect(splitter).toHaveCompiledCss('transition-delay', '.2s', { target: ':hover' });
		});

		// We are testing these styles directly as they can't be asserted in a VR test.
		it('should show the panel splitter slower than when hiding', () => {
			render(<TestComponent />);

			const splitter = screen.getByTestId('panel-splitter');

			expect(splitter).toHaveCompiledCss('transition-duration', '.2s', { target: ':hover' });
		});

		// We are testing these styles directly as they can't be asserted in a VR test.
		it('should hide the panel splitter faster than when showing', () => {
			render(<TestComponent />);

			const splitter = screen.getByTestId('panel-splitter');

			expect(splitter).toHaveCompiledCss('transition-duration', '.1s');
		});

		// We are testing these styles directly as they can't be asserted in a VR test.
		it('should not delay showing the panel splitter on focus', () => {
			render(<TestComponent />);

			const rangeInput = screen.getByRole('slider', { name: 'Panel splitter', hidden: true });
			rangeInput.focus();

			const splitter = screen.getByTestId('panel-splitter');

			expect(splitter).toHaveCompiledCss({
				transitionDelay: '0ms',
			});
		});

		// We are testing these styles directly as they can't be asserted in a VR test.
		it('should not delay hiding the panel splitter', () => {
			render(<TestComponent />);

			const splitter = screen.getByTestId('panel-splitter');

			expect(splitter).toHaveCompiledCss('transition-delay', '0ms');
		});
	});

	describe('onResizeStart', () => {
		it('should be called when a mouse resize starts', () => {
			const onResizeStart = jest.fn();

			render(
				<TestComponent
					initialPanelWidth={200}
					getResizeBounds={() => ({ min: '50px', max: '500px' })}
					onResizeStart={onResizeStart}
				/>,
			);

			const splitter = screen.getByTestId('panel-splitter');

			fireEvent.dragStart(splitter);

			rafStub.step();

			expect(onResizeStart).toHaveBeenCalledWith({ initialWidth: 200 });
		});

		it('should be called when a keyboard resize starts', async () => {
			jest.useFakeTimers();
			const onResizeStart = jest.fn();

			render(
				<TestComponent
					initialPanelWidth={100}
					getResizeBounds={() => ({ min: '50px', max: '500px' })}
					onResizeStart={onResizeStart}
				/>,
			);

			const rangeInput = screen.getByRole('slider', { name: 'Panel splitter', hidden: true });
			rangeInput.focus();
			// For react 18 compatibility, we need to wait for the component to be updated after the focus event
			await waitFor(() => expect(rangeInput).toHaveAttribute('min', '50'));

			fireEvent.change(rangeInput, { target: { value: 120 } });

			act(() => jest.runOnlyPendingTimers());

			expect(onResizeStart).toHaveBeenCalledWith({ initialWidth: 100 });

			jest.useRealTimers();
		});

		it('should debounce - only call at the start of the keyboard resize, even when value changes multiple times', async () => {
			jest.useFakeTimers();
			const onResizeStart = jest.fn();

			render(
				<TestComponent
					initialPanelWidth={100}
					getResizeBounds={() => ({ min: '50px', max: '500px' })}
					onResizeStart={onResizeStart}
				/>,
			);

			const rangeInput = screen.getByRole('slider', { name: 'Panel splitter', hidden: true });
			rangeInput.focus();

			// Resize 3 times. `onResizeStart` should only be called once, right after the first resize.
			fireEvent.change(rangeInput, { target: { value: 120 } });
			expect(onResizeStart).toHaveBeenCalledTimes(1);
			expect(onResizeStart).toHaveBeenCalledWith({ initialWidth: 100 });

			fireEvent.change(rangeInput, { target: { value: 140 } });
			fireEvent.change(rangeInput, { target: { value: 160 } });

			// Wait for debounce wait time to run
			act(() => jest.runOnlyPendingTimers());
			expect(onResizeStart).toHaveBeenCalledTimes(1);

			jest.useRealTimers();
		});
	});

	describe('onResizeEnd', () => {
		it('should be called when a resize ends', () => {
			const onResizeEnd = jest.fn();

			render(
				<TestComponent
					initialPanelWidth={200}
					getResizeBounds={() => ({ min: '50px', max: '500px' })}
					onResizeEnd={onResizeEnd}
				/>,
			);

			const splitter = screen.getByTestId('panel-splitter');

			const finalWidth = 400;

			const getPixelWidthMock = jest.spyOn(panelSplitterWidthUtils, 'getPixelWidth');

			fireEvent.dragStart(splitter, { clientX: 200 });
			fireEvent.dragOver(splitter, { clientX: finalWidth });
			rafStub.step();

			expect(screen.getByTestId('panel-splitter-parent')).toHaveStyle({
				[resizingCssVar]: `clamp(50px, ${finalWidth}px, 500px)`,
			});
			expect(onResizeEnd).not.toHaveBeenCalled();

			getPixelWidthMock.mockImplementation(() => finalWidth);
			fireEvent.drop(splitter);
			expect(onResizeEnd).toHaveBeenCalledWith({ initialWidth: 200, finalWidth });

			getPixelWidthMock.mockRestore();
		});

		it('should be called when a keyboard resize starts', async () => {
			jest.useFakeTimers();
			const onResizeEnd = jest.fn();

			render(
				<TestComponent
					initialPanelWidth={100}
					getResizeBounds={() => ({ min: '50px', max: '500px' })}
					onResizeEnd={onResizeEnd}
				/>,
			);

			const rangeInput = screen.getByRole('slider', { name: 'Panel splitter', hidden: true });
			rangeInput.focus();
			// For react 18 compatibility, we need to wait for the component to be updated after the focus event
			await waitFor(() => expect(rangeInput).toHaveAttribute('min', '50'));

			fireEvent.change(rangeInput, { target: { value: 120 } });

			act(() => jest.runOnlyPendingTimers());

			expect(onResizeEnd).toHaveBeenCalledWith({ initialWidth: 100, finalWidth: 120 });

			jest.useRealTimers();
		});

		it('should debounce - only call at the end of the keyboard resize, even when value changes multiple times', async () => {
			jest.useFakeTimers();
			const onResizeEnd = jest.fn();

			render(
				<TestComponent
					initialPanelWidth={100}
					getResizeBounds={() => ({ min: '50px', max: '500px' })}
					onResizeEnd={onResizeEnd}
				/>,
			);

			const rangeInput = screen.getByRole('slider', { name: 'Panel splitter', hidden: true });
			rangeInput.focus();
			// Resize 3 times. `onResizeEnd` should only be called once, at the end, after the debounce time.
			fireEvent.change(rangeInput, { target: { value: 120 } });
			fireEvent.change(rangeInput, { target: { value: 140 } });
			fireEvent.change(rangeInput, { target: { value: 160 } });

			expect(onResizeEnd).toHaveBeenCalledTimes(0);

			act(() => jest.runOnlyPendingTimers());

			expect(onResizeEnd).toHaveBeenCalledTimes(1);
			expect(onResizeEnd).toHaveBeenCalledWith({ initialWidth: 100, finalWidth: 160 });

			jest.useRealTimers();
		});
	});

	// We can't test this in a browser integration or VR test, as there's no visual impact if the resizing CSS variable
	// is not cleaned up. It's more to ensure the DOM is kept clean when the variable is no longer needed.
	it('should reset the resizing css var when a mouse resize ends', () => {
		render(
			<TestComponent
				initialPanelWidth={100}
				getResizeBounds={() => ({ min: '50px', max: '500px' })}
			/>,
		);

		const splitter = screen.getByTestId('panel-splitter');

		fireEvent.dragStart(splitter, { clientX: 100 });
		fireEvent.dragOver(splitter, { clientX: 200 });

		rafStub.step();

		expect(screen.getByTestId('panel-splitter-parent')).toHaveStyle({
			[resizingCssVar]: 'clamp(50px, 200px, 500px)',
		});

		fireEvent.drop(splitter);
		rafStub.step();

		expect(
			screen.getByTestId('panel-splitter-parent').style.getPropertyValue(resizingCssVar),
		).toEqual('');
	});
});

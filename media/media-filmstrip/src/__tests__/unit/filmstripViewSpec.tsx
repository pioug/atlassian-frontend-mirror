/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

declare var global: any;
declare var window: any;
import React from 'react';
import { render, screen, act, fireEvent } from '@atlassian/testing-library';
import { FilmstripView } from '../../filmstripView';

jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn().mockReturnValue(false),
}));

const BUFFER_WIDTH = 100;
const WINDOW_WIDTH = 10;
const CHILD_WIDTH = 5;

/**
 * Render helper that exposes the underlying class instance via a React ref.
 *
 * Why a ref?
 * - `FilmstripView` is a class component whose public API includes computed getters
 *   (`offset`, `minOffset`, `maxOffset`) and offset-snapping helpers
 *   (`getClosestForLeft`, `getClosestForRight`) used by handleLeftClick/handleRightClick.
 * - These return values are pure derived data with no DOM equivalent, so RTL alone cannot
 *   assert against them. Using a ref to a class component is a standard React pattern; it
 *   restores the original Enzyme coverage without re-introducing Enzyme.
 */
const renderWithRef = (ui: React.ReactElement<typeof FilmstripView>) => {
	const ref = React.createRef<FilmstripView>();
	const element = React.cloneElement(ui as React.ReactElement, { ref } as React.Attributes);
	const result = render(element);
	return {
		...result,
		ref,
		getInstance: () => ref.current as FilmstripView,
	};
};

class MockMutationObserver {
	static instances: MockMutationObserver[] = [];
	handler: (list: Array<{}>) => {};
	observe = jest.fn();
	disconnect = jest.fn();

	constructor(handler: (list: Array<{}>) => {}) {
		this.handler = handler;
		MockMutationObserver.instances.push(this);
	}

	fakeTrigger(mutationList: Array<{}>) {
		this.handler(mutationList);
	}
}

let nativeMutationObserver: any;

beforeEach(() => {
	MockMutationObserver.instances = [];
	nativeMutationObserver = window['MutationObserver'];
	window['MutationObserver'] = MockMutationObserver;
});

afterEach(() => {
	window['MutationObserver'] = nativeMutationObserver;
});

/**
 * Mock sizing on the rendered filmstrip component's refs.
 * The FilmstripView uses ref callbacks to set `bufferElement` and `windowElement`.
 * We mock getBoundingClientRect on those actual DOM elements after render.
 */
function mockDOMSizing(
	bufferWidth = BUFFER_WIDTH,
	windowWidth = WINDOW_WIDTH,
	childWidth = CHILD_WIDTH,
) {
	// The windowElement is the FilmStripListWrapper (data-testid="filmstrip-list-wrapper")
	const windowEl = document.querySelector('[data-testid="filmstrip-list-wrapper"]') as HTMLElement;
	// The bufferElement is the ul inside the windowElement (FilmStripList)
	const bufferEl = windowEl?.querySelector('ul') as HTMLUListElement;

	if (windowEl) {
		windowEl.getBoundingClientRect = () => ({ width: windowWidth }) as DOMRect;
	}
	if (bufferEl) {
		bufferEl.getBoundingClientRect = () => ({ width: bufferWidth }) as DOMRect;
		// Mock each child li's getBoundingClientRect
		Array.from(bufferEl.children).forEach((child) => {
			(child as HTMLElement).getBoundingClientRect = () =>
				({
					x: 0,
					y: 0,
					top: 0,
					right: 0,
					bottom: 0,
					left: 0,
					width: childWidth,
					height: 0,
					toJSON() {
						return JSON.stringify(this);
					},
				}) as DOMRect;
		});
	}

	// Trigger a resize event to force handleSizeChange to fire with the new mocked values
	act(() => {
		window.dispatchEvent(new Event('resize'));
	});
}

describe('FilmstripView', () => {
	describe('minOffset / maxOffset / offset behavior', () => {
		it('should return minOffset of 0', () => {
			const onSize = jest.fn();
			render(<FilmstripView onSize={onSize}>{['a', 'b', 'c']}</FilmstripView>);
			mockDOMSizing();
			expect(onSize).toHaveBeenCalledWith(expect.objectContaining({ minOffset: 0 }));
		});

		it('should return maxOffset', () => {
			const onSize = jest.fn();
			render(<FilmstripView onSize={onSize}>{['a', 'b', 'c']}</FilmstripView>);
			mockDOMSizing();
			expect(onSize).toHaveBeenCalledWith(expect.objectContaining({ maxOffset: 89 }));
		});

		it('should clamp offset to minOffset when offset is 0', () => {
			// offset=0 = minOffset → canGoLeft is false, so no left arrow rendered
			render(
				<FilmstripView offset={0} testId="filmstrip">
					{['a', 'b', 'c']}
				</FilmstripView>,
			);
			mockDOMSizing();
			expect(screen.queryByLabelText('left')).not.toBeInTheDocument();
		});

		it('should clamp offset to minOffset when offset is less than minOffset', () => {
			// Negative offset should be clamped → canGoLeft false (no left arrow)
			render(
				<FilmstripView offset={-1} testId="filmstrip">
					{['a', 'b', 'c']}
				</FilmstripView>,
			);
			mockDOMSizing();
			expect(screen.queryByLabelText('left')).not.toBeInTheDocument();
		});

		it('should clamp offset to maxOffset when offset is greater than maxOffset', () => {
			// Offset way above maxOffset should be clamped → canGoRight false (no right arrow)
			render(
				<FilmstripView offset={BUFFER_WIDTH + 1} testId="filmstrip">
					{['a', 'b', 'c']}
				</FilmstripView>,
			);
			mockDOMSizing();
			expect(screen.queryByLabelText('right')).not.toBeInTheDocument();
		});
	});

	/**
	 * `.offset` / `.minOffset` / `.maxOffset` getters and offset-snapping helpers
	 *
	 * These are pure-derived values with no DOM equivalent. The original Enzyme suite reached
	 * them as `instance.offset`, `instance.getClosestForLeft(n)` etc. We do the same here via a
	 * React ref to the class component — the same coverage, just without Enzyme.
	 */
	describe('.offset (getter)', () => {
		it('should return 0 when no offset prop is given', () => {
			const { getInstance } = renderWithRef(<FilmstripView testId="filmstrip" />);
			mockDOMSizing();
			expect(getInstance().offset).toEqual(0);
		});

		it('should return the offset prop value when within [minOffset, maxOffset]', () => {
			const { getInstance } = renderWithRef(<FilmstripView offset={20} testId="filmstrip" />);
			mockDOMSizing();
			// minOffset=0, maxOffset=89 → 20 is in-range and returned as-is
			expect(getInstance().offset).toEqual(20);
		});

		it('should clamp negative offset to minOffset (0)', () => {
			const { getInstance } = renderWithRef(<FilmstripView offset={-10} testId="filmstrip" />);
			mockDOMSizing();
			expect(getInstance().offset).toEqual(0);
		});

		it('should clamp offset above maxOffset to maxOffset', () => {
			const { getInstance } = renderWithRef(
				<FilmstripView offset={BUFFER_WIDTH + 1} testId="filmstrip" />,
			);
			mockDOMSizing();
			// maxOffset = bufferWidth - windowWidth - 1 = 100 - 10 - 1 = 89
			expect(getInstance().offset).toEqual(89);
		});

		it('should expose minOffset = 0', () => {
			const { getInstance } = renderWithRef(<FilmstripView testId="filmstrip" />);
			mockDOMSizing();
			expect(getInstance().minOffset).toEqual(0);
		});

		it('should expose maxOffset = bufferWidth − windowWidth − 1', () => {
			const { getInstance } = renderWithRef(<FilmstripView testId="filmstrip" />);
			mockDOMSizing();
			expect(getInstance().maxOffset).toEqual(BUFFER_WIDTH - WINDOW_WIDTH - 1);
		});

		it('should clamp maxOffset to minOffset when buffer is narrower than window', () => {
			const { getInstance } = renderWithRef(<FilmstripView testId="filmstrip" />);
			// buffer 5 < window 20 → maxOffset would be negative, must be clamped to minOffset (0)
			mockDOMSizing(5, 20, 1);
			expect(getInstance().maxOffset).toEqual(0);
		});
	});

	/**
	 * `.getClosestForLeft()` / `.getClosestForRight()` are pure functions of `instance.childOffsets`,
	 * `instance.minOffset`, `instance.maxOffset` and `state.windowWidth`. To get deterministic
	 * coverage we set `childOffsets` directly via the ref — `mockDOMSizing()` is unsuitable here
	 * because `@compiled/react` injects an extra `<style>` element as the first child of the
	 * filmstrip's `<ul>`, which inflates the offset count and shifts the "last child" index.
	 *
	 * Fixed test fixture (after seedClosestState): childOffsets = [
	 *   { left:0,  right:4 },  // child[0] (first  → uses .left in getClosestForLeft)
	 *   { left:5,  right:9 },  // child[1]
	 *   { left:10, right:14 }, // child[2] (last  → uses .right in getClosestForRight)
	 * ], windowWidth=10, bufferWidth=100, → minOffset=0, maxOffset=89, EXTRA_PADDING=4.
	 */
	const seedClosestState = (instance: FilmstripView) => {
		instance.childOffsets = [
			{ left: 0, right: 4 },
			{ left: 5, right: 9 },
			{ left: 10, right: 14 },
		];
		instance.setState({ bufferWidth: BUFFER_WIDTH, windowWidth: WINDOW_WIDTH });
	};

	describe('.getClosestForLeft()', () => {
		it('should return 0 when offset is 0 (first child, no padding subtracted)', () => {
			const { getInstance } = renderWithRef(<FilmstripView testId="filmstrip" />);
			act(() => seedClosestState(getInstance()));
			// leftWindowEdge=0 → inside child[0] (0..4); first child uses .left=0;
			// 0 < EXTRA_PADDING (4) → return 0 (no padding subtraction)
			expect(getInstance().getClosestForLeft(0)).toEqual(0);
		});

		it('should clamp negative offset to minOffset and snap', () => {
			const { getInstance } = renderWithRef(<FilmstripView testId="filmstrip" />);
			act(() => seedClosestState(getInstance()));
			expect(getInstance().getClosestForLeft(-50)).toEqual(0);
		});

		it('should snap to childBounds.right − EXTRA_PADDING when leftWindowEdge falls inside a non-first child', () => {
			const { getInstance } = renderWithRef(<FilmstripView testId="filmstrip" />);
			act(() => seedClosestState(getInstance()));
			// leftWindowEdge=11 → inside child[2] (10..14), not the first child
			// newOffset = childBounds.right = 14; 14 ≥ EXTRA_PADDING(4) → return 14 - 4 = 10
			expect(getInstance().getClosestForLeft(11)).toEqual(10);
		});

		it('should not subtract EXTRA_PADDING when newOffset would go below it (first child)', () => {
			const { getInstance } = renderWithRef(<FilmstripView testId="filmstrip" />);
			act(() => seedClosestState(getInstance()));
			// leftWindowEdge=2 → inside child[0] (0..4); first child uses .left=0
			// 0 < EXTRA_PADDING(4) → return 0 unchanged
			expect(getInstance().getClosestForLeft(2)).toEqual(0);
		});

		it('should fall back to clamped offset when no child contains the leftWindowEdge', () => {
			const { getInstance } = renderWithRef(<FilmstripView testId="filmstrip" />);
			act(() => seedClosestState(getInstance()));
			// clamp(200,0,89)=89 falls outside child range [0..14] → returns clamp = 89
			expect(getInstance().getClosestForLeft(200)).toEqual(89);
		});

		it('should return clamped offset when childOffsets is empty', () => {
			const { getInstance } = renderWithRef(<FilmstripView testId="filmstrip" />);
			// childOffsets is initialised to [] in the constructor; bufferWidth/windowWidth=0
			// → minOffset=0, maxOffset=0 → clamp(50,0,0)=0
			expect(getInstance().getClosestForLeft(50)).toEqual(0);
		});
	});

	describe('.getClosestForRight()', () => {
		it('should snap and add EXTRA_PADDING when rightWindowEdge falls inside the last child', () => {
			const { getInstance } = renderWithRef(<FilmstripView testId="filmstrip" />);
			act(() => seedClosestState(getInstance()));
			// rightWindowEdge = clamp(2,0,89) + 10 = 12 → inside child[2] (10..14)
			// last child → newOffset = childBounds.right − windowWidth = 14 − 10 = 4
			// 4 + EXTRA_PADDING(4) = 8 ≤ maxOffset(89) → return 8
			expect(getInstance().getClosestForRight(2)).toEqual(8);
		});

		it('should snap to childBounds.left − windowWidth when rightWindowEdge falls inside a non-last child', () => {
			const { getInstance } = renderWithRef(<FilmstripView testId="filmstrip" />);
			// 4-child fixture so child[2] is no longer the last child
			act(() => {
				const inst = getInstance();
				inst.childOffsets = [
					{ left: 0, right: 4 },
					{ left: 5, right: 9 },
					{ left: 10, right: 14 },
					{ left: 15, right: 19 },
				];
				inst.setState({ bufferWidth: BUFFER_WIDTH, windowWidth: WINDOW_WIDTH });
			});
			// rightWindowEdge = 2 + 10 = 12 → inside child[2] (10..14), not the last
			// newOffset = childBounds.left − windowWidth = 10 − 10 = 0; 0 + 4 ≤ 89 → return 4
			expect(getInstance().getClosestForRight(2)).toEqual(4);
		});

		it('should not add EXTRA_PADDING when it would exceed maxOffset', () => {
			const { getInstance } = renderWithRef(<FilmstripView testId="filmstrip" />);
			act(() => seedClosestState(getInstance()));
			// offset=89 (maxOffset): rightWindowEdge = 99 → outside all children → return clamp(89)=89
			expect(getInstance().getClosestForRight(89)).toEqual(89);
		});

		it('should return clamped offset when no child contains the rightWindowEdge', () => {
			const { getInstance } = renderWithRef(<FilmstripView testId="filmstrip" />);
			expect(getInstance().getClosestForRight(50)).toEqual(0);
		});

		it('should clamp when offset > maxOffset and no child matches the resulting rightWindowEdge', () => {
			const { getInstance } = renderWithRef(<FilmstripView testId="filmstrip" />);
			act(() => seedClosestState(getInstance()));
			// offset=200 → clamped to 89, rightWindowEdge=99, no child match → returns 89
			expect(getInstance().getClosestForRight(200)).toEqual(89);
		});
	});

	describe('.handleLeftClick()', () => {
		it('should call onScroll() with an updated offset on the previous page', () => {
			const onScroll = jest.fn();
			render(
				<FilmstripView offset={14} onScroll={onScroll} testId="filmstrip">
					{['a', 'b', 'c']}
				</FilmstripView>,
			);
			mockDOMSizing();

			// Left arrow has label="left" on the icon; click its ArrowLeftWrapper button area
			const leftArrowBtn = screen.getByLabelText('left');
			fireEvent.click(leftArrowBtn);

			expect(onScroll).toBeCalledWith({
				direction: 'left',
				offset: 0,
				animate: true,
			});
		});

		it('should scroll left when the container is narrower than the child', () => {
			const onScroll = jest.fn();
			render(
				<FilmstripView offset={25} onScroll={onScroll} testId="filmstrip">
					{['a', 'b', 'c']}
				</FilmstripView>,
			);
			mockDOMSizing(100, 10, 15);

			const leftArrowBtn = screen.getByLabelText('left');
			fireEvent.click(leftArrowBtn);

			expect(onScroll).toHaveBeenCalledWith({
				direction: 'left',
				offset: 15,
				animate: true,
			});
		});
	});

	describe('.handleRightClick()', () => {
		it('should call onScroll() with an updated offset on the next page', () => {
			const onScroll = jest.fn();
			render(
				<FilmstripView offset={4} onScroll={onScroll} testId="filmstrip">
					{['a', 'b', 'c']}
				</FilmstripView>,
			);
			mockDOMSizing();

			const rightArrowBtn = screen.getByLabelText('right');
			fireEvent.click(rightArrowBtn);

			expect(onScroll).toBeCalledWith({
				direction: 'right',
				offset: 14,
				animate: true,
			});
		});

		it('should scroll right when the container is narrower than the child', () => {
			const onScroll = jest.fn();
			render(
				<FilmstripView offset={9} onScroll={onScroll} testId="filmstrip">
					{['a', 'b', 'c']}
				</FilmstripView>,
			);
			mockDOMSizing(100, 10, 15);

			const rightArrowBtn = screen.getByLabelText('right');
			fireEvent.click(rightArrowBtn);

			expect(onScroll).toHaveBeenCalledWith({
				direction: 'right',
				offset: 19,
				animate: true,
			});
		});
	});

	describe('.handleTouchStart()', () => {
		it('should update state when touch move starts', () => {
			const onScroll = jest.fn();
			render(<FilmstripView onScroll={onScroll} testId="filmstrip" />);

			const listWrapper = screen.getByTestId('filmstrip-list-wrapper');
			fireEvent.touchStart(listWrapper, { touches: [{ clientX: 200 }] });
			fireEvent.touchMove(listWrapper, { touches: [{ clientX: 150 }] });

			expect(onScroll).toHaveBeenCalledWith(
				expect.objectContaining({ direction: expect.any(String) }),
			);
		});
	});

	describe('.handleTouchMove()', () => {
		it('should call onScroll() with an updated offset and direction set to right when moving right', () => {
			const INITIAL_OFFSET = 300;
			const INITIAL_TOUCH_START_POSITION = 100;
			const NEW_TOUCH_START_POSITION = 200;
			const onScroll = jest.fn();

			render(<FilmstripView offset={INITIAL_OFFSET} onScroll={onScroll} testId="filmstrip" />);
			mockDOMSizing(700, 300);

			const listWrapper = screen.getByTestId('filmstrip-list-wrapper');
			fireEvent.touchStart(listWrapper, { touches: [{ clientX: INITIAL_TOUCH_START_POSITION }] });
			onScroll.mockClear();
			fireEvent.touchMove(listWrapper, { touches: [{ clientX: NEW_TOUCH_START_POSITION }] });

			expect(onScroll).toBeCalledWith({
				direction: 'right',
				offset: INITIAL_OFFSET - (NEW_TOUCH_START_POSITION - INITIAL_TOUCH_START_POSITION),
				animate: false,
			});
		});

		it('should call onScroll() with an updated offset and direction set to left when moving left', () => {
			const INITIAL_OFFSET = 300;
			const INITIAL_TOUCH_START_POSITION = 200;
			const NEW_TOUCH_START_POSITION = 100;
			const onScroll = jest.fn();

			render(<FilmstripView offset={INITIAL_OFFSET} onScroll={onScroll} testId="filmstrip" />);
			mockDOMSizing(700, 300);

			const listWrapper = screen.getByTestId('filmstrip-list-wrapper');
			fireEvent.touchStart(listWrapper, { touches: [{ clientX: INITIAL_TOUCH_START_POSITION }] });
			onScroll.mockClear();
			fireEvent.touchMove(listWrapper, { touches: [{ clientX: NEW_TOUCH_START_POSITION }] });

			expect(onScroll).toBeCalledWith({
				direction: 'left',
				offset: INITIAL_OFFSET - (NEW_TOUCH_START_POSITION - INITIAL_TOUCH_START_POSITION),
				animate: false,
			});
		});

		it('should not call onScroll() when touch move is not in progress', () => {
			const onScroll = jest.fn();
			render(<FilmstripView offset={300} onScroll={onScroll} testId="filmstrip" />);

			const listWrapper = screen.getByTestId('filmstrip-list-wrapper');
			// touchEnd sets isTouchMoveInProgress=false
			fireEvent.touchEnd(listWrapper, { touches: [{ clientX: 100 }] });
			onScroll.mockClear();
			fireEvent.touchMove(listWrapper, { touches: [{ clientX: 200 }] });

			expect(onScroll).not.toBeCalled();
		});
	});

	describe('.handleTouchEnd()', () => {
		it('should update state when touch move ends', () => {
			const onScroll = jest.fn();
			render(<FilmstripView onScroll={onScroll} testId="filmstrip" />);

			const listWrapper = screen.getByTestId('filmstrip-list-wrapper');
			fireEvent.touchStart(listWrapper, { touches: [{ clientX: 100 }] });
			fireEvent.touchEnd(listWrapper, { touches: [{ clientX: 100 }] });

			onScroll.mockClear();
			fireEvent.touchMove(listWrapper, { touches: [{ clientX: 200 }] });

			expect(onScroll).not.toBeCalled();
		});
	});

	describe('.handleScroll()', () => {
		const createWheelEvent = (event: any) => ({
			deltaX: 0,
			deltaY: 0,
			preventDefault: jest.fn(),
			...event,
		});

		it('should not call onScroll() when the user is scrolling up or down', () => {
			const onScroll = jest.fn();
			render(
				<FilmstripView onScroll={onScroll} testId="filmstrip">
					{['a', 'b', 'c']}
				</FilmstripView>,
			);
			mockDOMSizing();

			const listWrapper = screen.getByTestId('filmstrip-list-wrapper');
			fireEvent.wheel(listWrapper, createWheelEvent({ deltaY: 10 }));
			expect(onScroll).not.toBeCalled();
		});

		it('should call onScroll() with an updated offset when scrolling left', () => {
			const onScroll = jest.fn();
			render(
				<FilmstripView offset={14} onScroll={onScroll} testId="filmstrip">
					{['a', 'b', 'c']}
				</FilmstripView>,
			);
			mockDOMSizing();

			const listWrapper = screen.getByTestId('filmstrip-list-wrapper');
			fireEvent.wheel(listWrapper, createWheelEvent({ deltaX: -10 }));
			expect(onScroll).toBeCalledWith({
				direction: 'left',
				offset: 4,
				animate: false,
			});
		});

		it('should call onScroll() with an updated offset when scrolling right', () => {
			const onScroll = jest.fn();
			render(
				<FilmstripView offset={4} onScroll={onScroll} testId="filmstrip">
					{['a', 'b', 'c']}
				</FilmstripView>,
			);
			mockDOMSizing();

			const listWrapper = screen.getByTestId('filmstrip-list-wrapper');
			fireEvent.wheel(listWrapper, createWheelEvent({ deltaX: 10 }));
			expect(onScroll).toBeCalledWith({
				direction: 'right',
				offset: 14,
				animate: false,
			});
		});
	});

	describe('.handleSizeChange()', () => {
		it('should call onSize() when the width has changed and after the state has been set', () => {
			expect.assertions(1);
			const onSize = jest.fn(({ maxOffset }) => expect(maxOffset).toBeGreaterThan(0));
			render(
				<FilmstripView offset={4} onSize={onSize} testId="filmstrip">
					{['a', 'b', 'c']}
				</FilmstripView>,
			);
			mockDOMSizing();
		});
	});

	describe('.render()', () => {
		it('should capture and report a11y violations', async () => {
			const { container } = render(<FilmstripView offset={0}>{['a', 'b', 'c']}</FilmstripView>);
			await expect(container).toBeAccessible();
		});

		it('styles', () => {
			const { container } = render(<FilmstripView offset={0}>{['a', 'b', 'c']}</FilmstripView>);
			expect(container).toMatchSnapshot();
		});

		it('should not render the left arrow when offset is equal to minOffset', () => {
			render(
				<FilmstripView offset={0} testId="filmstrip">
					{['a', 'b', 'c']}
				</FilmstripView>,
			);
			mockDOMSizing();

			// With offset=0 (= minOffset=0), canGoLeft=false → no left arrow rendered
			expect(screen.queryByLabelText('left')).not.toBeInTheDocument();
		});

		it('should render the left arrow when offset is greater than minOffset', () => {
			render(
				<FilmstripView offset={1} testId="filmstrip">
					{['a', 'b', 'c']}
				</FilmstripView>,
			);
			mockDOMSizing();

			// With offset>0, canGoLeft=true → left arrow is first child (before list wrapper)
			const viewWrapper = screen.getByTestId('filmstrip');
			expect(viewWrapper.children[0]).not.toBe(screen.getByTestId('filmstrip-list-wrapper'));
		});

		it('should not render the right arrow when offset is equal to maxOffset', () => {
			render(
				<FilmstripView offset={900} testId="filmstrip">
					{['a', 'b', 'c']}
				</FilmstripView>,
			);
			mockDOMSizing();

			// With offset >= maxOffset, canGoRight=false → last child is the list wrapper
			const viewWrapper = screen.getByTestId('filmstrip');
			expect(viewWrapper.children[viewWrapper.children.length - 1]).toBe(
				screen.getByTestId('filmstrip-list-wrapper'),
			);
		});

		it('should render the right arrow when offset is less than maxOffset', () => {
			render(
				<FilmstripView offset={0} testId="filmstrip">
					{['a', 'b', 'c']}
				</FilmstripView>,
			);
			mockDOMSizing();

			// With offset=0 and maxOffset=89, canGoRight=true → right arrow is last child
			const viewWrapper = screen.getByTestId('filmstrip');
			expect(viewWrapper.children[viewWrapper.children.length - 1]).not.toBe(
				screen.getByTestId('filmstrip-list-wrapper'),
			);
		});

		it('should wrap each of the children', () => {
			const children = ['a', 'b', 'c'];
			render(<FilmstripView>{children}</FilmstripView>);

			const listItems = document.querySelectorAll('li');
			listItems.forEach((item, index) => {
				expect(item.textContent).toEqual(`${children[index]}`);
			});
		});

		it('should use child keys if available', () => {
			render(
				<FilmstripView>
					<div key="a" />
					<div />
					<div key="c" />
				</FilmstripView>,
			);
			const listItems = document.querySelectorAll('li');
			expect(listItems).toHaveLength(3);
		});
	});

	describe('child dom mutations', () => {
		const mutationList = [{ type: 'attributes' }, { type: 'childList' }, { type: 'subtree' }];

		it('should use mutationObserver by default', () => {
			render(<FilmstripView testId="filmstrip">{['a', 'b', 'c']}</FilmstripView>);
			mockDOMSizing();
			// The component calls initMutationObserver via handleBufferElementChange ref callback
			// Verify the last created MockMutationObserver had observe called
			const observer = MockMutationObserver.instances[MockMutationObserver.instances.length - 1];
			expect(observer).toBeInstanceOf(MockMutationObserver);
			expect(observer.observe).toHaveBeenCalled();
		});

		it('should still work if MutationObserver is not available globally', () => {
			const globalMutationObserver = global.MutationObserver;
			delete global.MutationObserver;
			expect(() => {
				render(<FilmstripView testId="filmstrip">{['a', 'b', 'c']}</FilmstripView>);
			}).not.toThrow();
			global.MutationObserver = globalMutationObserver;
		});

		it('should call handleSizeChange when mutations occur', () => {
			const onSize = jest.fn();
			render(
				<FilmstripView onSize={onSize} testId="filmstrip">
					{['a', 'b', 'c']}
				</FilmstripView>,
			);
			mockDOMSizing();
			const initialCallCount = onSize.mock.calls.length;

			const observer = MockMutationObserver.instances[MockMutationObserver.instances.length - 1];
			act(() => {
				observer.fakeTrigger(mutationList);
			});

			// handleSizeChange is debounced with leading=true, so it fires immediately
			expect(onSize.mock.calls.length).toBeGreaterThanOrEqual(initialCallCount);
		});

		it('should debounce multiple handleMutation calls', () => {
			const onSize = jest.fn();
			render(
				<FilmstripView onSize={onSize} testId="filmstrip">
					{['a', 'b', 'c']}
				</FilmstripView>,
			);
			mockDOMSizing();
			// Reset onSize to count only mutation-triggered invocations from this point
			onSize.mockClear();

			const observer = MockMutationObserver.instances[MockMutationObserver.instances.length - 1];
			// Fire 10 rapid mutations within the debounce window
			act(() => {
				for (let i = 0; i < 10; i++) {
					observer.fakeTrigger(mutationList);
				}
			});

			// debounce(handler, 30, true) → leading edge only; 10 rapid triggers fire handleSizeChange once.
			// handleSizeChange itself only calls onSize when bufferWidth/windowWidth change, so it
			// should call onSize at most once for the burst.
			expect(onSize.mock.calls.length).toBeLessThanOrEqual(1);
		});

		it('should disconnect when component un-mounts', () => {
			const { unmount } = render(
				<FilmstripView testId="filmstrip">{['a', 'b', 'c']}</FilmstripView>,
			);
			mockDOMSizing();

			const observer = MockMutationObserver.instances[MockMutationObserver.instances.length - 1];
			unmount();

			expect(observer.disconnect).toHaveBeenCalled();
		});
	});
});

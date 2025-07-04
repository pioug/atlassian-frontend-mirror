declare var global: any; // we need define an interface for the Node global object when overwriting global objects, in this case MutationObserver
declare var window: any;
import React from 'react';
import { shallow, type CommonWrapper } from 'enzyme';
import { render } from '@testing-library/react';
import { FilmstripView } from '../../filmstripView';
import {
	LeftArrow,
	RightArrow,
	FilmStripListItem,
	FilmStripListWrapper,
} from '../../filmstripView/wrappers';

const BUFFER_WIDTH = 100;
const WINDOW_WIDTH = 10;
const CHILD_WIDTH = 5;

/**
 * Mock the size information which we don't get from JSDOM
 *  NOTE: `mount` doesn't work either
 * @param element
 * @param children
 */
function mockSizing(
	element: CommonWrapper<{}, Readonly<{}>, any>,
	bufferWidth = BUFFER_WIDTH,
	windowWidth = WINDOW_WIDTH,
	childWidth = CHILD_WIDTH,
) {
	const instance = element.instance();

	instance.bufferElement = document.createElement('div');
	instance.bufferElement.getBoundingClientRect = () =>
		({
			width: bufferWidth,
		}) as DOMRect;

	instance.windowElement = document.createElement('div');
	instance.windowElement.getBoundingClientRect = () =>
		({
			width: windowWidth,
		}) as DOMRect;

	instance.childOffsets = [];
	for (let i = 0; i < bufferWidth / CHILD_WIDTH; ++i) {
		const child = document.createElement('div');
		instance.bufferElement.appendChild(child);
		child.getBoundingClientRect = () => ({
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
		});
	}

	instance.handleSizeChange();
	element.update();
}

describe('FilmstripView', () => {
	class MockMutationObserver {
		handler: (list: Array<{}>) => {};

		constructor(handler: (list: Array<{}>) => {}) {
			this.handler = handler;
		}

		observe = jest.fn();
		disconnect = jest.fn();

		fakeTrigger(mutationList: Array<{}>) {
			// do what a MutationObserver will do if there was an appropriate DOM change
			this.handler(mutationList);
		}
	}

	let nativeMutationObserver: any;

	beforeEach(() => {
		nativeMutationObserver = window['MutationObserver'];
		window['MutationObserver'] = MockMutationObserver;
	});

	afterEach(() => {
		window['MutationObserver'] = nativeMutationObserver;
	});

	describe('.minOffset', () => {
		it('should return minOffset', () => {
			const element = shallow(<FilmstripView>{['a', 'b', 'c']}</FilmstripView>);
			mockSizing(element);
			const instance = element.instance() as FilmstripView;
			expect(instance.minOffset).toEqual(0);
		});
	});

	describe('.maxOffset', () => {
		it('should return maxOffset', () => {
			const element = shallow(<FilmstripView>{['a', 'b', 'c']}</FilmstripView>);
			mockSizing(element);
			const instance = element.instance() as FilmstripView;
			expect(instance.maxOffset).toEqual(89);
		});
	});

	describe('.offset', () => {
		it('should return minOffset when not defined', () => {
			const element = shallow(<FilmstripView>{['a', 'b', 'c']}</FilmstripView>);
			mockSizing(element);
			const instance = element.instance() as FilmstripView;
			expect(instance.offset).toEqual(instance.minOffset);
		});

		it('should return minOffset when less than minOffset', () => {
			const element = shallow(<FilmstripView offset={-1}>{['a', 'b', 'c']}</FilmstripView>);
			mockSizing(element);
			const instance = element.instance() as FilmstripView;
			expect(instance.offset).toEqual(instance.minOffset);
		});

		it('should return maxOffset when greater than maxOffset', () => {
			const element = shallow(
				<FilmstripView offset={BUFFER_WIDTH + 1}>{['a', 'b', 'c']}</FilmstripView>,
			);
			mockSizing(element);
			const instance = element.instance() as FilmstripView;
			expect(instance.offset).toEqual(instance.maxOffset);
		});
	});

	describe('.getClosestForLeft()', () => {
		it('should return the offset where the child that intesects at the specified offset is flush with the left edge of the window', () => {
			const element = shallow(<FilmstripView>{['a', 'b', 'c']}</FilmstripView>);
			mockSizing(element);
			const instance = element.instance() as FilmstripView;

			// special case: where there's no more cards to scroll (they're already scrolled into view)
			expect(instance.getClosestForLeft(0)).toEqual(0);

			expect(instance.getClosestForLeft(4)).toEqual(0);
			expect(instance.getClosestForLeft(5)).toEqual(5);
			expect(instance.getClosestForLeft(6)).toEqual(5);
			expect(instance.getClosestForLeft(10)).toEqual(10);
			expect(instance.getClosestForLeft(11)).toEqual(10);
		});

		it('should return the minOffset when the offset is less than minOffset', () => {
			const element = shallow(<FilmstripView>{['a', 'b', 'c']}</FilmstripView>);
			mockSizing(element);
			const instance = element.instance() as FilmstripView;
			expect(instance.getClosestForLeft(instance.minOffset - 1)).toEqual(instance.minOffset);
		});

		it('should return the left offset of the first card offscreen at maxOffset when the offset is greater than maxOffset', () => {
			const element = shallow(<FilmstripView>{['a', 'b', 'c']}</FilmstripView>);
			mockSizing(element);
			const instance = element.instance() as FilmstripView;
			expect(instance.getClosestForLeft(instance.maxOffset + 1)).toEqual(85);
		});
	});

	describe('.getClosestForRight()', () => {
		it('should return the offset where the child that intesects at the specified offset is flush with the right edge of the window', () => {
			const element = shallow(<FilmstripView>{['a', 'b', 'c']}</FilmstripView>);
			mockSizing(element);
			const instance = element.instance() as FilmstripView;

			expect(instance.getClosestForRight(0)).toEqual(4);
			expect(instance.getClosestForRight(4)).toEqual(4);
			expect(instance.getClosestForRight(5)).toEqual(9);
			expect(instance.getClosestForRight(6)).toEqual(9);
			expect(instance.getClosestForRight(10)).toEqual(14);
			expect(instance.getClosestForRight(11)).toEqual(14);
			expect(instance.getClosestForRight(85)).toEqual(89);
			expect(instance.getClosestForRight(89)).toEqual(89);

			// special cases: where there's no more cards to scroll (they're already scrolled into view)
			expect(instance.getClosestForRight(90)).toEqual(89);
			expect(instance.getClosestForRight(94)).toEqual(89);
			expect(instance.getClosestForRight(95)).toEqual(89);
			expect(instance.getClosestForRight(99)).toEqual(89);
		});

		it('should return the right offset of the card at minOffset when the offset is less than minOffset', () => {
			const element = shallow(<FilmstripView>{['a', 'b', 'c']}</FilmstripView>);
			mockSizing(element);
			const instance = element.instance() as FilmstripView;
			expect(instance.getClosestForRight(instance.minOffset - 1)).toEqual(4);
		});

		it('should return the maxOffset when the offset is greater than maxOffset', () => {
			const element = shallow(<FilmstripView>{['a', 'b', 'c']}</FilmstripView>);
			mockSizing(element);
			const instance = element.instance() as FilmstripView;
			expect(instance.getClosestForRight(instance.maxOffset + 1)).toEqual(instance.maxOffset);
		});
	});

	describe('.handleLeftClick()', () => {
		it('should call onScroll() with an updated offset on the previous page', () => {
			const onScroll = jest.fn();
			const element = shallow(
				<FilmstripView offset={14} onScroll={onScroll}>
					{['a', 'b', 'c']}
				</FilmstripView>,
			);
			mockSizing(element);
			element.find(LeftArrow).simulate('click', { stopPropagation() {} });
			expect(onScroll).toBeCalledWith({
				direction: 'left',
				offset: 0,
				animate: true,
			});
		});

		it('should scroll left when the container is narrower than the child', () => {
			const onScroll = jest.fn();
			const element = shallow(
				<FilmstripView offset={25} onScroll={onScroll}>
					{['a', 'b', 'c']}
				</FilmstripView>,
			);
			mockSizing(element, 100, 10, 15); // child wider than viewport
			element.find(LeftArrow).simulate('click', { stopPropagation() {} });
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
			const element = shallow(
				<FilmstripView offset={4} onScroll={onScroll}>
					{['a', 'b', 'c']}
				</FilmstripView>,
			);
			mockSizing(element);
			element.find(RightArrow).simulate('click', { stopPropagation() {} });
			expect(onScroll).toBeCalledWith({
				direction: 'right',
				offset: 14,
				animate: true,
			});
		});

		it('should scroll right when the container is narrower than the child', () => {
			const onScroll = jest.fn();
			const element = shallow(
				<FilmstripView offset={9} onScroll={onScroll}>
					{['a', 'b', 'c']}
				</FilmstripView>,
			);
			mockSizing(element, 100, 10, 15); // child wider than viewport
			element.find(RightArrow).simulate('click', { stopPropagation() {} });
			expect(onScroll).toHaveBeenCalledWith({
				direction: 'right',
				offset: 19,
				animate: true,
			});
		});
	});

	describe('.handleTouchStart()', () => {
		it('should update FilmstripView state properties when touch move starts', () => {
			const element = shallow(<FilmstripView />);

			const filmstripListElement = element.find(FilmStripListWrapper);
			filmstripListElement.simulate('touchStart', {
				touches: [{ clientX: 200 }],
			});

			expect(element.state('touchMoveStartPosition')).toBe(200);
			expect(element.state('isTouchMoveInProgress')).toBe(true);
		});
	});

	describe('.handleTouchMove()', () => {
		it('should call onScroll() with an updated offset and direction set to right', () => {
			const INITIAL_OFFSET = 300;
			const INITIAL_TOUCH_START_POSITION = 100;
			const NEW_TOUCH_START_POSITION = 200;
			const onScroll = jest.fn();
			const element = shallow(<FilmstripView />);

			mockSizing(element, 700, 300);
			element.setProps({ offset: INITIAL_OFFSET, onScroll });
			element.setState({
				touchMoveStartPosition: INITIAL_TOUCH_START_POSITION,
				isTouchMoveInProgress: true,
			});

			const filmstripListElement = element.find(FilmStripListWrapper);
			filmstripListElement.simulate('touchMove', {
				touches: [{ clientX: NEW_TOUCH_START_POSITION }],
			});

			expect(onScroll).toBeCalledWith({
				direction: 'right',
				offset: INITIAL_OFFSET - (NEW_TOUCH_START_POSITION - INITIAL_TOUCH_START_POSITION),
				animate: false,
			});
		});

		it('should call onScroll() with an updated offset and direction set to left', () => {
			const INITIAL_OFFSET = 300;
			const INITIAL_TOUCH_START_POSITION = 200;
			const NEW_TOUCH_START_POSITION = 100;
			const onScroll = jest.fn();
			const element = shallow(<FilmstripView offset={INITIAL_OFFSET} onScroll={onScroll} />);

			mockSizing(element, 700, 300);
			element.setState({
				touchMoveStartPosition: INITIAL_TOUCH_START_POSITION,
				isTouchMoveInProgress: true,
			});
			const filmstripListElement = element.find(FilmStripListWrapper);
			filmstripListElement.simulate('touchMove', {
				touches: [{ clientX: NEW_TOUCH_START_POSITION }],
			});

			expect(onScroll).toBeCalledWith({
				direction: 'left',
				offset: INITIAL_OFFSET - (NEW_TOUCH_START_POSITION - INITIAL_TOUCH_START_POSITION),
				animate: false,
			});
		});

		it('should not call onScroll() when touch move is not in progress', () => {
			const INITIAL_OFFSET = 300;
			const INITIAL_TOUCH_START_POSITION = 100;
			const NEW_TOUCH_START_POSITION = 200;
			const onScroll = jest.fn();
			const element = shallow(<FilmstripView offset={INITIAL_OFFSET} onScroll={onScroll} />);

			element.setState({
				touchMoveStartPosition: INITIAL_TOUCH_START_POSITION,
				isTouchMoveInProgress: false,
			});

			const filmstripListElement = element.find(FilmStripListWrapper);
			filmstripListElement.simulate('touchMove', {
				touches: [{ clientX: NEW_TOUCH_START_POSITION }],
			});

			expect(onScroll).not.toBeCalled();
		});
	});

	describe('.handleTouchEnd()', () => {
		it('should update FilmstripView state properties when touch move ends', () => {
			const element = shallow(<FilmstripView />);
			const filmstripListElement = element.find(FilmStripListWrapper);

			filmstripListElement.simulate('touchEnd', {
				touches: [{ clientX: 100 }],
			});

			expect(element.state('touchMoveStartPosition')).toBe(100);
			expect(element.state('isTouchMoveInProgress')).toBe(false);
		});
	});

	describe('.handleScroll()', () => {
		const createWheelEvent = (event: any) => {
			return {
				deltaX: 0,
				deltaY: 0,
				preventDefault: jest.fn(),
				...event,
			};
		};

		it('should not call onScroll() when the user is scrolling up or down', () => {
			const onScroll = jest.fn();
			const element = shallow(<FilmstripView onScroll={onScroll}>{['a', 'b', 'c']}</FilmstripView>);
			mockSizing(element);
			element.find(FilmStripListWrapper).simulate('wheel', createWheelEvent({ deltaY: 10 }));
			expect(onScroll).not.toBeCalled();
		});

		it('should call onScroll() with an updated offset when the user is scrolling left', () => {
			const onScroll = jest.fn();
			const element = shallow(
				<FilmstripView offset={14} onScroll={onScroll}>
					{['a', 'b', 'c']}
				</FilmstripView>,
			);
			mockSizing(element);
			element.find(FilmStripListWrapper).simulate('wheel', createWheelEvent({ deltaX: -10 }));
			expect(onScroll).toBeCalledWith({
				direction: 'left',
				offset: 4,
				animate: false,
			});
		});

		it('should call onScroll() with an updated offset when the user is scrolling right', () => {
			const onScroll = jest.fn();
			const element = shallow(
				<FilmstripView offset={4} onScroll={onScroll}>
					{['a', 'b', 'c']}
				</FilmstripView>,
			);
			mockSizing(element);
			element.find(FilmStripListWrapper).simulate('wheel', createWheelEvent({ deltaX: 10 }));
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
			const element = shallow(
				<FilmstripView offset={4} onSize={onSize}>
					{['a', 'b', 'c']}
				</FilmstripView>,
			);
			mockSizing(element);
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
			const element = shallow(<FilmstripView offset={0}>{['a', 'b', 'c']}</FilmstripView>);
			mockSizing(element);
			expect(element.find(LeftArrow).exists()).toBeFalsy();
		});

		it('should render the left arrow when offset is greater than minOffset', () => {
			const element = shallow(<FilmstripView offset={1}>{['a', 'b', 'c']}</FilmstripView>);
			mockSizing(element);
			expect(element.find(LeftArrow).exists()).toBeTruthy();
		});

		it('should not render the right arrow when offset is equal to maxOffset', () => {
			const element = shallow(<FilmstripView offset={900}>{['a', 'b', 'c']}</FilmstripView>);
			mockSizing(element);
			expect(element.find(RightArrow).exists()).toBeFalsy();
		});

		it('should render the right arrow when offset is less than maxOffset', () => {
			const element = shallow(<FilmstripView offset={0}>{['a', 'b', 'c']}</FilmstripView>);
			mockSizing(element);
			expect(element.find(RightArrow).exists()).toBeTruthy();
		});

		it('should wrap each of the children', () => {
			const children = ['a', 'b', 'c'];
			const element = shallow(<FilmstripView>{children}</FilmstripView>);
			element.find(FilmStripListItem).forEach((child, index) => {
				expect(child.children().text()).toEqual(`${children[index]}`);
			});
		});

		it('should use child keys if available', () => {
			const element = shallow(
				<FilmstripView>
					<div key="a" />
					<div />
					<div key="c" />
				</FilmstripView>,
			);

			expect(element.find(FilmStripListItem).at(0).key()).toContain('a');
			expect(element.find(FilmStripListItem).at(1).key()).toContain('1');
			expect(element.find(FilmStripListItem).at(2).key()).toContain('c');
		});
	});

	describe('child dom mutations', () => {
		const mutationList = [
			{
				type: 'attributes',
			},
			{
				type: 'childList',
			},
			{
				type: 'subtree',
			},
		];

		it('should use mutationObserver by default', () => {
			const element = shallow(<FilmstripView>{['a', 'b', 'c']}</FilmstripView>);
			mockSizing(element);
			const instance = element.instance() as FilmstripView;
			instance.initMutationObserver();
			expect(instance.mutationObserver).toBeInstanceOf(MockMutationObserver);
		});

		it('should still work if MutationObserver is not available globally', () => {
			const globalMutationObserver = global.MutationObserver;
			delete global.MutationObserver;
			const element = shallow(<FilmstripView>{['a', 'b', 'c']}</FilmstripView>);
			mockSizing(element);
			const instance = element.instance() as FilmstripView;
			instance.initMutationObserver();
			expect(instance.mutationObserver).toBeUndefined();
			global.MutationObserver = globalMutationObserver;
		});

		it('should call handleSizeChange when mutations occur', () => {
			const element = shallow(<FilmstripView>{['a', 'b', 'c']}</FilmstripView>);
			mockSizing(element);
			const instance = element.instance() as FilmstripView;
			instance.initMutationObserver();
			const spy = jest.spyOn(instance, 'handleSizeChange');
			const mutationObserver = instance.mutationObserver as any;
			mutationObserver.fakeTrigger(mutationList);
			expect(spy).toHaveBeenCalledTimes(1);
		});

		it('should debounce multiple handleMutation calls', () => {
			const element = shallow(<FilmstripView>{['a', 'b', 'c']}</FilmstripView>);
			mockSizing(element);
			const instance = element.instance() as FilmstripView;
			instance.initMutationObserver();
			const spy = jest.spyOn(instance, 'handleSizeChange');
			const mutationObserver = instance.mutationObserver as any;
			for (let i = 0; i < 10; i++) {
				mutationObserver.fakeTrigger(mutationList);
			}
			expect(spy).toHaveBeenCalledTimes(1);
		});

		it('should disconnect when component un-mounts', () => {
			const element = shallow(<FilmstripView>{['a', 'b', 'c']}</FilmstripView>);
			mockSizing(element);
			const instance = element.instance() as FilmstripView;
			instance.initMutationObserver();
			const mutationObserver = instance.mutationObserver as any;
			const spy = jest.spyOn(mutationObserver, 'disconnect');
			element.unmount();
			expect(spy).toBeCalled();
		});
	});
});

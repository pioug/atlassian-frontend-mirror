import { type RefObject } from 'react';

import { act, renderHook } from '@testing-library/react';

import type { PopupSelect } from '@atlaskit/select/popup-select';

import type { SelectOption } from '../types';
import { useInlinePopupLayout } from '../useInlinePopupLayout';

describe('inline filter popup viewport bounds', () => {
	let viewportHeight: number;
	let triggerTop: number;
	let menuHeight: number;
	let ref: RefObject<PopupSelect<SelectOption, true>>;
	const originalViewport = Object.getOwnPropertyDescriptor(window, 'visualViewport');
	const originalInnerHeight = Object.getOwnPropertyDescriptor(window, 'innerHeight');

	beforeEach(() => {
		viewportHeight = 800;
		triggerTop = 250;
		menuHeight = 344;
		Object.defineProperty(window, 'innerHeight', {
			configurable: true,
			get: () => viewportHeight,
		});
		Object.defineProperty(window, 'visualViewport', { configurable: true, value: undefined });

		const target = document.createElement('button');
		jest
			.spyOn(target, 'getBoundingClientRect')
			.mockImplementation(() => ({ top: triggerTop, bottom: triggerTop + 32 }) as DOMRect);
		const menu = document.createElement('div');
		const list = document.createElement('div');
		list.setAttribute('role', 'listbox');
		menu.append(list);
		const control = document.createElement('div');
		Object.defineProperty(menu, 'offsetHeight', { get: () => menuHeight });
		Object.defineProperty(list, 'offsetHeight', { value: 240 });
		Object.defineProperty(control, 'offsetHeight', { value: 40 });
		ref = {
			current: {
				targetRef: target,
				menuRef: menu,
				selectRef: { select: { controlRef: control } },
			} as unknown as PopupSelect<SelectOption, true>,
		};
	});

	afterEach(() => {
		jest.restoreAllMocks();
		if (originalInnerHeight) {
			Object.defineProperty(window, 'innerHeight', originalInnerHeight);
		}
		if (originalViewport) {
			Object.defineProperty(window, 'visualViewport', originalViewport);
		} else {
			Reflect.deleteProperty(window, 'visualViewport');
		}
	});

	it('opens below the trigger when the full popup fits', () => {
		const { result } = renderHook(() => useInlinePopupLayout(true, ref));
		act(() => result.current.onOpen());
		expect(result.current.popperProps?.placement).toBe('bottom-start');
		expect(result.current.maxMenuHeight).toBe(300);
	});

	it('keeps the search control, first option and footer above the page edge in a short window', () => {
		viewportHeight = 360;
		const { result } = renderHook(() => useInlinePopupLayout(true, ref));
		act(() => result.current.onOpen());
		expect(result.current.popperProps?.placement).toBe('top-start');
		// 64px of footer/padding is outside PopupSelect's search-and-list height budget.
		const fullPopupHeight = result.current.maxMenuHeight! + 64;
		expect(fullPopupHeight).toBe(234);
		expect(triggerTop - 8 - fullPopupHeight).toBeGreaterThanOrEqual(8);
	});

	it('shrinks the scrollable list when the window is resized', () => {
		triggerTop = 60;
		const { result } = renderHook(() => useInlinePopupLayout(true, ref));
		act(() => result.current.onOpen());
		act(() => {
			viewportHeight = 300;
			window.dispatchEvent(new Event('resize'));
		});
		expect(result.current.popperProps?.placement).toBe('bottom-start');
		const fullPopupHeight = result.current.maxMenuHeight! + 64;
		expect(triggerTop + 32 + 8 + fullPopupHeight).toBeLessThanOrEqual(viewportHeight - 8);
	});

	it('uses the visible viewport when it differs from the layout viewport', () => {
		const viewport = new EventTarget();
		Object.assign(viewport, { offsetTop: 100, height: 400 });
		Object.defineProperty(window, 'visualViewport', { configurable: true, value: viewport });
		const { result } = renderHook(() => useInlinePopupLayout(true, ref));
		act(() => result.current.onOpen());
		expect(result.current.popperProps?.placement).toBe('bottom-start');
		expect(result.current.maxMenuHeight).toBe(138);
	});

	it('repositions an open menu as its trigger scrolls toward the bottom edge', () => {
		viewportHeight = 400;
		triggerTop = 60;
		const { result } = renderHook(() => useInlinePopupLayout(true, ref));
		act(() => result.current.onOpen());
		act(() => {
			triggerTop = 300;
			window.dispatchEvent(new Event('scroll'));
		});
		expect(result.current.popperProps?.placement).toBe('top-start');
		expect(result.current.maxMenuHeight! + 64).toBeLessThanOrEqual(triggerTop - 16);
	});

	it('reserves newly measured footer space instead of clipping the top of the popup', () => {
		viewportHeight = 360;
		const { result } = renderHook(() => useInlinePopupLayout(true, ref));
		act(() => result.current.onOpen());
		act(() => {
			menuHeight = 364;
			window.dispatchEvent(new Event('resize'));
		});
		expect(result.current.maxMenuHeight! + 84).toBe(234);
	});

	it('stops updating a closed popup', () => {
		const { result } = renderHook(() => useInlinePopupLayout(true, ref));
		act(() => result.current.onOpen());
		act(() => result.current.onClose());
		act(() => {
			viewportHeight = 360;
			window.dispatchEvent(new Event('resize'));
		});
		expect(result.current.maxMenuHeight).toBe(300);
	});

	it('leaves the configuration modal popup defaults unchanged', () => {
		const { result } = renderHook(() => useInlinePopupLayout(false, ref));
		act(() => result.current.onOpen());
		expect(result.current.maxMenuHeight).toBeUndefined();
		expect(result.current.popperProps).toBeUndefined();
	});
});

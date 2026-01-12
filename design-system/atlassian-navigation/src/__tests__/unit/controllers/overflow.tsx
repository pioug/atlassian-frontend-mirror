import React, { type ReactElement } from 'react';

import { act, renderHook } from '@testing-library/react';

import { useOverflowController } from '../../../controllers/overflow';

describe('useOverflowController', () => {
	it('should show all items as visible', () => {
		const { result } = renderHook(({ nodes }) => useOverflowController(nodes), {
			initialProps: {
				nodes: [<button type="button">Hello</button>, <button type="button">World</button>],
			},
		});

		expect(result.current.visibleItems.length).toEqual(2);
	});

	it('should display items within the set width', () => {
		const { result } = renderHook(({ nodes }) => useOverflowController(nodes), {
			initialProps: {
				nodes: [<button type="button">Hello</button>, <button type="button">World</button>],
			},
		});

		act(() => result.current.updateWidth(100));

		expect(result.current.visibleItems.length).toEqual(2);
	});

	it('should detect visible items when items array starts as empty and is updated with multiple children', () => {
		const { result, rerender } = renderHook(({ nodes }) => useOverflowController(nodes), {
			initialProps: { nodes: [] as ReactElement[] },
		});

		expect(result.current.visibleItems.length).toEqual(0);

		rerender({
			nodes: [<button type="button">Hello</button>, <button type="button">World</button>],
		});

		act(() => result.current.updateWidth(1000));

		expect(result.current.visibleItems.length).toEqual(2);
	});

	it('should detect visible items when items grows by one', () => {
		const { result, rerender } = renderHook(({ nodes }) => useOverflowController(nodes), {
			initialProps: { nodes: [] as ReactElement[] },
		});

		expect(result.current.visibleItems.length).toEqual(0);

		rerender({
			nodes: [<button type="button">Hello</button>],
		});

		act(() => result.current.updateWidth(1000));

		expect(result.current.visibleItems.length).toEqual(1);

		rerender({
			nodes: [<button type="button">Hello</button>, <button type="button">World</button>],
		});

		act(() => result.current.updateWidth(1001));

		expect(result.current.visibleItems.length).toEqual(2);
	});
});

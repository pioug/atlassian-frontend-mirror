import React from 'react';

import { act, renderHook } from '@testing-library/react-hooks';

import { useOverflowController } from '../../../controllers/overflow';

/**
 * The real `throttle` stops working when we use fake timers,
 * so none of the `updateWidth` have an effect unless we mock `throttle`.
 */
jest.mock('lodash/throttle', () => {
	return <T,>(fn: T): T => fn;
});

/**
 * This test is in its own file because it behaved differently when other
 * tests were present.
 *
 * This implies some sort of leakage beyond each test case.
 *
 * I think it is most likely related to timers interacting with each other
 * in weird ways.
 */

describe('useOverflowController', () => {
	it('should not re-add items after determining they do not fit', async () => {
		jest.useFakeTimers();

		const { result } = renderHook(({ nodes }) => useOverflowController(nodes), {
			initialProps: {
				nodes: [<button type="button">Hello</button>, <button type="button">World</button>],
			},
		});

		expect(result.current.visibleItems.length).toEqual(2);
		/**
		 * Tell the controller the items are too squished.
		 */
		act(() => result.current.updateWidth(1));
		expect(result.current.visibleItems.length).toEqual(1);

		/**
		 * Tell the controller there is now enough room.
		 */
		act(() => result.current.updateWidth(100));
		expect(result.current.visibleItems.length).toEqual(1);

		jest.useRealTimers();
	});
});

import React, { useRef } from 'react';

import { render } from '@atlassian/testing-library';

import { type TAnchorPoint, useAnchorPositionAtPoint } from '../use-anchor-position-at-point';

/**
 * Counts synthetic anchor `<div>` elements that the hook has appended
 * to `document.body`. The hook is the only producer of
 * `div[aria-hidden="true"]` children of `<body>`, so this is a reliable
 * signal that the lazy creation path did (or did not) run.
 *
 * The anchor doesn't have any accessible handles so we cannot use React Testing Library to query it.
 */
function countSyntheticAnchors(): number {
	return document.body.querySelectorAll('div[aria-hidden="true"]').length;
}

/**
 * Minimal harness around `useAnchorPositionAtPoint`. The popover is
 * rendered inline so the hook has a valid ref to write positioning
 * styles to, but the test only inspects whether the *synthetic anchor*
 * `<div>` was appended to `document.body`.
 */
function TestComponent({
	isEnabled,
	getPoint,
}: {
	isEnabled: boolean;
	getPoint: () => TAnchorPoint | null;
}) {
	const popoverRef = useRef<HTMLDivElement | null>(null);

	useAnchorPositionAtPoint({
		popoverRef,
		placement: { axis: 'block', align: 'start' },
		isEnabled,
		getPoint,
		isOpen: true,
	});

	return (
		<div ref={popoverRef} data-testid="popover">
			popover
		</div>
	);
}

describe('useAnchorPositionAtPoint - lazy element creation', () => {
	it('should be accessible', async () => {
		const { container } = render(
			<TestComponent isEnabled={true} getPoint={() => ({ x: 75, y: 50 })} />,
		);
		await expect(container).toBeAccessible();
	});

	it('does NOT create a synthetic anchor when isEnabled=false', () => {
		// `getPoint` returns a valid point, but the hook must respect
		// the explicit disable signal and avoid touching the DOM.
		const getPoint = jest.fn<TAnchorPoint | null, []>(() => ({
			x: 200,
			y: 100,
		}));

		render(<TestComponent isEnabled={false} getPoint={getPoint} />);

		// No `<div aria-hidden="true">` should have been appended.
		expect(countSyntheticAnchors()).toBe(0);

		// The hook must not even call `getPoint` when disabled —
		// `isEnabled` short-circuits before the callback runs.
		expect(getPoint).not.toHaveBeenCalled();
	});

	it('does NOT create a synthetic anchor when getPoint() returns null', () => {
		// `isEnabled` is true, but the consumer signals "no point
		// available right now" by returning null. The hook should
		// honour this and stay in its no-DOM state.
		const getPoint = jest.fn<TAnchorPoint | null, []>(() => null);

		render(<TestComponent isEnabled={true} getPoint={getPoint} />);

		expect(countSyntheticAnchors()).toBe(0);

		// `getPoint` is called exactly once per activation; it is
		// called here because `isEnabled` is true on mount.
		expect(getPoint).toHaveBeenCalledTimes(1);
	});

	it('creates exactly one synthetic anchor when isEnabled=true and getPoint() returns a point', () => {
		// The happy path: both gates open, so the hook lazily creates
		// its hidden `<div>` and appends it to `document.body`.
		const getPoint = jest.fn<TAnchorPoint | null, []>(() => ({
			x: 75,
			y: 50,
		}));

		render(<TestComponent isEnabled={true} getPoint={getPoint} />);

		// Exactly one anchor — sanity-check we are not double-creating.
		expect(countSyntheticAnchors()).toBe(1);
		expect(getPoint).toHaveBeenCalledTimes(1);
	});

	it('removes the synthetic anchor on unmount', () => {
		// Ensures the cleanup path runs so subsequent shows do not
		// leak hidden `<div>`s into `document.body`.
		const getPoint = () => ({ x: 20, y: 10 });

		const { unmount } = render(<TestComponent isEnabled={true} getPoint={getPoint} />);

		expect(countSyntheticAnchors()).toBe(1);

		unmount();

		expect(countSyntheticAnchors()).toBe(0);
	});
});

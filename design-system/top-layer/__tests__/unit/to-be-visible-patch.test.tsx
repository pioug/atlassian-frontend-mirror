/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Smoke test for the `toBeVisible` jest-dom matcher patch.
 *
 * This file exists to catch a subtle pitfall: `@testing-library/jest-dom`
 * registers all of its matchers via a side-effect call to `expect.extend`
 * at import time. Because `expect.extend` REPLACES matchers by name, any
 * setup file that imports our patch BEFORE `@testing-library/jest-dom`
 * silently has the patch overwritten — and the test author would have
 * no warning that visibility checks for popovers no longer reflect the
 * Popover API state.
 *
 * The platform's own jest config loads:
 *   1. `setupFiles` → top-layer polyfill
 *   2. `setupFilesAfterEnv` → @testing-library/jest-dom + to-be-visible patch
 *
 * If either link breaks, the assertions below will fail and surface the
 * regression instead of letting it ship silently.
 */
import { useEffect, useRef } from 'react';

import { css, jsx } from '@compiled/react';

import { render, screen } from '@atlassian/testing-library';

const hiddenStyles = css({ display: 'none' });

// `popover` is set imperatively rather than as a JSX attribute because
// eslint-plugin-react does not yet recognise the Popover API attribute.
function ClosedPopoverFixture() {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		ref.current?.setAttribute('popover', 'auto');
		// Intentionally do NOT call showPopover — we are asserting the closed state.
	}, []);
	return (
		<div data-testid="closed-popover" ref={ref}>
			closed popover content
		</div>
	);
}

function OpenPopoverFixture() {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		// Capture the node so the cleanup function does not read ref.current
		// after the component unmounts (react-hooks/exhaustive-deps).
		const node = ref.current;
		node?.setAttribute('popover', 'auto');
		node?.showPopover();
		return () => {
			// The polyfill exposes popover state via the `data-popover-open` attribute
			// because jsdom does not implement the `:popover-open` pseudo-class selector.
			if (node?.hasAttribute('data-popover-open')) {
				node.hidePopover();
			}
		};
	}, []);
	return (
		<div data-testid="open-popover" ref={ref}>
			open popover content
		</div>
	);
}

describe('toBeVisible patch', () => {
	it('reports a CLOSED popover as NOT visible (patch overrides jest-dom default)', () => {
		// Without the patch, jest-dom returns true for closed popovers in jsdom because
		// jsdom has no UA stylesheet hiding [popover] elements with display: none.
		render(<ClosedPopoverFixture />);
		expect(screen.getByTestId('closed-popover')).not.toBeVisible();
	});

	it('reports an OPEN popover as visible', () => {
		render(<OpenPopoverFixture />);
		expect(screen.getByTestId('open-popover')).toBeVisible();
	});

	it('keeps existing jest-dom visibility behaviour for non-popover elements', () => {
		render(
			// Wrapper div avoids needing a JSX fragment (which would require an
			// @jsxFrag pragma in classic JSX mode).
			<div>
				<div data-testid="visible-div">visible</div>
				<div data-testid="hidden-div" css={hiddenStyles}>
					hidden
				</div>
			</div>,
		);
		expect(screen.getByTestId('visible-div')).toBeVisible();
		expect(screen.getByTestId('hidden-div')).not.toBeVisible();
	});

	it('reports a CLOSED <dialog> as NOT visible (jest-dom + jsdom already correct, patch must not regress this)', () => {
		render(
			// Closed by default — no `open` attribute, no .showModal() / .show() call.
			<dialog data-testid="closed-dialog">closed dialog content</dialog>,
		);
		expect(screen.getByTestId('closed-dialog')).not.toBeVisible();
	});

	// Required by @atlassian/a11y/require-jest-coverage. The matcher under test is
	// not itself a UI surface, but our open-popover fixture is a real interactive
	// element so this assertion is meaningful.
	it('open popover fixture is accessible', async () => {
		const { container } = render(<OpenPopoverFixture />);
		await expect(container).toBeAccessible();
	});
});

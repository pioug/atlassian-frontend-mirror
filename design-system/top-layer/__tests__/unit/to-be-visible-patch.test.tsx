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
 * silently has the patch overwritten - and the test author would have
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
import React, { useEffect, useRef } from 'react';

import { css, jsx } from '@compiled/react';

import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

const hiddenStyles = css({ display: 'none' });
const transparentStyles = css({ opacity: 0 });
const invisibleStyles = css({ visibility: 'hidden' });

// `popover` is set imperatively rather than as a JSX attribute because
// eslint-plugin-react does not yet recognise the Popover API attribute.
function ClosedPopoverFixture() {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		ref.current?.setAttribute('popover', 'auto');
		// Intentionally do NOT call showPopover - we are asserting the closed state.
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
			// Closed by default - no `open` attribute, no .showModal() / .show() call.
			<dialog data-testid="closed-dialog">closed dialog content</dialog>,
		);
		expect(screen.getByTestId('closed-dialog')).not.toBeVisible();
	});

	describe('inside an open <dialog>', () => {
		function OpenDialogFixture({ children }: { children: React.ReactNode }) {
			const ref = useRef<HTMLDialogElement>(null);
			useEffect(() => {
				const dialog = ref.current;
				dialog?.showModal();
				return () => dialog?.close();
			}, []);
			return (
				<dialog ref={ref} aria-label="dialog">
					{children}
				</dialog>
			);
		}

		it('reports a visible element as visible', () => {
			render(
				<OpenDialogFixture>
					<div data-testid="visible">visible</div>
				</OpenDialogFixture>,
			);
			expect(screen.getByTestId('visible')).toBeVisible();
		});

		// Measured in Chromium, Firefox and WebKit: an open dialog does not make hidden content visible.
		it('reports an element hidden by its own style as NOT visible', () => {
			render(
				<OpenDialogFixture>
					<div data-testid="hidden" css={hiddenStyles}>
						hidden
					</div>
				</OpenDialogFixture>,
			);
			expect(screen.getByTestId('hidden')).not.toBeVisible();
		});

		it('reports an element in a hidden ancestor below the dialog as NOT visible', () => {
			render(
				<OpenDialogFixture>
					<div css={hiddenStyles}>
						<div data-testid="child">child</div>
					</div>
					<div hidden>
						<div data-testid="hidden-attribute-child">child</div>
					</div>
				</OpenDialogFixture>,
			);
			expect(screen.getByTestId('child')).not.toBeVisible();
			expect(screen.getByTestId('hidden-attribute-child')).not.toBeVisible();
		});

		it('reports content in a closed popover inside the dialog as NOT visible', () => {
			render(
				<OpenDialogFixture>
					<ClosedPopoverFixture />
				</OpenDialogFixture>,
			);
			expect(screen.getByTestId('closed-popover')).not.toBeVisible();
		});
	});

	// Measured in Chromium, Firefox and WebKit: a top-layer element is painted outside its
	// ancestors' opacity, but still inherits `visibility` and does not render under `display: none`.
	it('reports an OPEN popover as visible under an ancestor with opacity 0', () => {
		render(
			<div css={transparentStyles}>
				<OpenPopoverFixture />
			</div>,
		);
		expect(screen.getByTestId('open-popover')).toBeVisible();
	});

	it('reports an OPEN popover as NOT visible under an ancestor with visibility hidden', () => {
		render(
			<div>
				<div css={invisibleStyles}>
					<OpenPopoverFixture />
				</div>
			</div>,
		);
		expect(screen.getByTestId('open-popover')).not.toBeVisible();
	});

	it('reports an OPEN popover as NOT visible under an ancestor with display none', () => {
		render(
			<div css={hiddenStyles}>
				<OpenPopoverFixture />
			</div>,
		);
		expect(screen.getByTestId('open-popover')).not.toBeVisible();
	});

	it('reports content of an OPEN popover as visible when the host has an inline opacity of 0', () => {
		// The JavaScript positioning fallback hides the host until a browser has laid it out.
		render(<OpenPopoverFixture />);
		const popover = screen.getByTestId('open-popover');
		popover.style.opacity = '0';
		expect(popover).toBeVisible();
	});

	// Required by @atlassian/a11y/require-jest-coverage. The matcher under test is
	// not itself a UI surface, but our open-popover fixture is a real interactive
	// element so this assertion is meaningful.
	it('open popover fixture is accessible', async () => {
		const { container } = render(<OpenPopoverFixture />);
		await expect(container).toBeAccessible();
	});
});

/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type ReactNode, useCallback } from 'react';

import { jsx } from '@compiled/react';
import { bind } from 'bind-event-listener';

import { cssMap } from '@atlaskit/css';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Anchor } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import type { SkipLinkData } from '../../context/skip-links/types';

const styles = cssMap({
	skipLinkListItem: {
		marginBlockStart: token('space.0'),
	},
});

/**
 * Used for moving focus to the corresponding slot or custom target after clicking on a skip link.
 */
function focusElement(element: HTMLElement) {
	/**
	 * Elements without an explicit `tabindex` attribute are not guaranteed to be focusable:
	 * https://html.spec.whatwg.org/multipage/interaction.html#attr-tabindex
	 *
	 * Our slots are not interactive, so this is required.
	 *
	 * In the future we may want to check if there is an existing `tabindex` attribute,
	 * as custom skip linked elements might already have one.
	 */
	element.setAttribute('tabindex', '-1');

	/**
	 * Cleanup the `tabindex` attribute we set when the slot or custom target loses focus.
	 *
	 * This is preferable to always having `tabindex="-1"` because always applying the tab index can:
	 *
	 * - mess with click events
	 * - potentially cause a focus ring to be always visible
	 */
	bind(element, {
		type: 'blur',
		listener() {
			element.removeAttribute('tabindex');
		},
		options: {
			// Using a one-time listener so it cleans itself up
			once: true,
		},
	});

	/**
	 * Move focus to the slot or custom target.
	 *
	 * Calling `.focus()` will also scroll the element into view:
	 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus
	 */
	element.focus({
		// Forces the focus ring to appear after moving focus to the slot
		// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#focusvisible
		// @ts-expect-error - new and not in types yet
		focusVisible: true,
	});
}

/**
 * A link that moves current tab position to a different element
 *
 * This component is rendered internally and is not exported publicly.
 */
export const SkipLink = ({
	id,
	children,
	onBeforeNavigate,
}: {
	id: string;
	children: ReactNode;
	onBeforeNavigate?: SkipLinkData['onBeforeNavigate'];
}) => {
	const href = `#${id}`;

	const onClick = useCallback(
		(event: React.MouseEvent<HTMLAnchorElement>) => {
			event.preventDefault();

			// Intentionally not using `document.querySelector` because many valid IDs are not valid selectors.
			const target = document.getElementById(id);
			if (!target) {
				return;
			}

			/**
			 * Internal slots can attach an `onBeforeNavigate` callback.
			 *
			 * Side nav uses this to ensure it is expanded.
			 */
			onBeforeNavigate?.();

			focusElement(target);

			/**
			 * We should look into removing this, or only calling it in specific cases.
			 *
			 * It means if the skip link element is in the window scroll container
			 * then it might not get scrolled into view properly.
			 *
			 * This is not an issue for the default slots on desktop, but could break custom skip links or
			 * even `Aside` on mobile.
			 *
			 * Keeping existing behavior for now because resetting the window scroll is actually good for some cases.
			 * E.g. jumping to main / aside it makes sense to look at the start of the content.
			 */
			window.scrollTo(0, 0);
		},
		[id, onBeforeNavigate],
	);

	return (
		<li css={styles.skipLinkListItem}>
			<Anchor
				/**
				 * It looks like Safari handles link clicks during `pointerdown` unless it has an explicit `tabIndex={0}` :/
				 *
				 * Adding this explicitly makes the behavior consistent between browsers and lets us `event.preventDefault()`
				 * in the `onClick` handler.
				 */
				tabIndex={0}
				href={href}
				onClick={onClick}
			>
				{children}
			</Anchor>
		</li>
	);
};

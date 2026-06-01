/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type ReactNode, useCallback } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Anchor } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { SkipLinkData } from '../../context/skip-links/types';

import { focusElement } from './focus-element';

const styles = cssMap({
	skipLinkListItem: {
		marginBlockStart: token('space.0'),
	},
	skipLinkListItemNew: {
		paddingBlock: token('space.100'),
	},
});

type SkipLinkProps = {
	id: string;
	children: ReactNode;
	onBeforeNavigate?: SkipLinkData['onBeforeNavigate'];
	navigate?: SkipLinkData['navigate'];
};

/**
 * A link that moves current tab position to a different element
 *
 * This component is rendered internally and is not exported publicly.
 */
export const SkipLink = ({
	id,
	children,
	onBeforeNavigate,
	navigate,
}: SkipLinkProps): JSX.Element => {
	const href = `#${id}`;

	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLAnchorElement>) => {
			event.preventDefault();

			if (navigate && fg('platform_dst_nav4_skip_link_a11y_1')) {
				/**
				 * The consumer takes over the navigation effect (e.g. expanding the
				 * side nav and focusing the first nav item). The universal pre/post
				 * work below (e.g. `window.scrollTo`) still runs around it.
				 */
				navigate();
			} else {
				// Intentionally not using `document.querySelector` because many valid IDs are not valid selectors.
				const target = document.getElementById(id);
				if (!target) {
					return;
				}

				/**
				 * Legacy `onBeforeNavigate` hook. Intentionally NOT called when
				 * `platform_dst_nav4_skip_link_a11y_1` is enabled — under the gate the
				 * gate-on path delegates state mutation + focus management to `navigate`,
				 * and `SkipLinksPopup` injects its popup-close behavior into the
				 * `navigate` wrapper instead of relying on this hook.
				 *
				 * This callback can be removed entirely on gate cleanup.
				 */
				if (!fg('platform_dst_nav4_skip_link_a11y_1')) {
					onBeforeNavigate?.();
				}

				focusElement(target);
			}

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
		[id, onBeforeNavigate, navigate],
	);

	return (
		<li
			css={[
				styles.skipLinkListItem,
				fg('platform_dst_nav4_skip_link_a11y_1') && styles.skipLinkListItemNew,
			]}
		>
			<Anchor
				/**
				 * It looks like Safari handles link clicks during `pointerdown` unless it has an explicit `tabIndex={0}` :/
				 *
				 * Adding this explicitly makes the behavior consistent between browsers and lets us `event.preventDefault()`
				 * in the `onClick` handler.
				 */
				tabIndex={0}
				href={href}
				onClick={handleClick}
			>
				{children}
			</Anchor>
		</li>
	);
};

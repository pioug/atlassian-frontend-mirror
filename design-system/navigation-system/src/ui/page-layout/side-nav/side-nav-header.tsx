/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactNode } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		paddingInline: token('space.150'),
		paddingBlockStart: token('space.150'),
		paddingBlockEnd: token('space.050'),
	},
});

/**
 * The top part of the side nav.
 */
export const SideNavHeader: ({ children, }: {
    /**
     * The content of the layout area.
     */
    children: ReactNode;
}) => JSX.Element = ({
	children,
}: {
	/**
	 * The content of the layout area.
	 */
	children: ReactNode;
}) => {
	return (
		<div
			css={styles.root}
			/**
			 * This attribute is used to identify whether the SideNavHeader is mounted, to determine where the
			 * SideNavContent's scroll indicator line should be applied. This is for layering reasons -
			 * if the scroll indicator line intersects with the top nav, it could incorrectly be hidden beneath
			 * the top nav (depending on if a layer is open, which raises the top nav'z z-index).
			 *
			 * We are using a data attribute and CSS for this logic to ensure it is SSR safe.
			 *
			 * - If SideNavHeader exists, the scroll indicator line is applied to the SideNavContent. This is safe
			 * because the SideNavHeader is between the SideNavContent and TopNavStart, so the scroll indicator line
			 * will not intersect with the top nav.
			 *
			 * - If SideNavHeader does not exist, the scroll indicator line is applied to TopNavStart. This ensures
			 * the scroll indicator line is visible even when the top nav has a z-index higher than the side nav.
			 */
			data-private-side-nav-header={fg('platform-dst-side-nav-layering-fixes') ? 'true' : undefined}
		>
			{children}
		</div>
	);
};

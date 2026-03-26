/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef, type ReactNode, type Ref, useMemo, useRef } from 'react';

import { cssMap, jsx } from '@compiled/react';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import { token } from '@atlaskit/tokens';

import { useIsFhsEnabled } from '../../fhs-rollout/use-is-fhs-enabled';

/**
 * The main content of the side nav, filling up the middle section. It acts as a scroll container.
 *
 * It will grow to take up the available space in the side nav — this is used to push the footer to the
 * bottom of the side nav.
 */
export const SideNavBody: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<SideNavContentProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, SideNavContentProps>(_SideNavContent);

// Placing this const below the function breaks Compiled!
const styles = cssMap({
	scrollContainer: {
		flex: 1,
		overflow: 'auto',
	},
	paddingContainer: {
		paddingBlockStart: token('space.150'),
		paddingInlineEnd: token('space.150'),
		paddingBlockEnd: token('space.150'),
		paddingInlineStart: token('space.150'),
	},
});

function _SideNavContent(
	{ children, testId }: SideNavContentProps,
	forwardedRef: Ref<HTMLDivElement>,
) {
	const isFhsEnabled = useIsFhsEnabled();
	const internalRef = useRef<HTMLDivElement>(null);
	const mergedRef = useMemo(() => mergeRefs([internalRef, forwardedRef]), [forwardedRef]);

	return (
		/**
		 * We are adding two `div` elements here on purpose. The padding styles are added to a nested element to make sure the padding is included in the scrollable area.
		 * Otherwise we can run into issues with sticky child elements if the padding is added to the scrollable element - as the stick point would include the padding, but
		 * the scrollable area doesn't, so other non-sticky children can be seen above/below the sticky element's stick point.
		 */
		<div
			css={[styles.scrollContainer]}
			ref={isFhsEnabled ? mergedRef : forwardedRef}
			data-testid={testId}
		>
			<div css={styles.paddingContainer}>{children}</div>
		</div>
	);
}

type SideNavContentProps = {
	/**
	 * The content of the layout area.
	 * Should contain side nav menu items.
	 */
	children: ReactNode;
	/**
	 * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
};

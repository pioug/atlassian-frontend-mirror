/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, {
	forwardRef,
	type ReactNode,
	type Ref,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';

import { cssMap, jsx } from '@compiled/react';
import { bind } from 'bind-event-listener';
import rafSchd from 'raf-schd';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

/**
 * The main content of the side nav, filling up the middle section. It acts as a scroll container.
 *
 * It will grow to take up the available space in the side nav — this is used to push the footer to the
 * bottom of the side nav.
 */
export const SideNavContent: React.ForwardRefExoticComponent<
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

const fullHeightSidebarStyles = cssMap({
	scrolled: {
		boxShadow: `0px -1px ${token('color.border')}`,
	},
});

function _SideNavContent(
	{ children, testId }: SideNavContentProps,
	forwardedRef: Ref<HTMLDivElement>,
) {
	const internalRef = useRef<HTMLDivElement>(null);
	const mergedRef = useMemo(() => mergeRefs([internalRef, forwardedRef]), [forwardedRef]);

	const isScrolled = useIsScrolled(internalRef);

	return (
		/**
		 * We are adding two `div` elements here on purpose. The padding styles are added to a nested element to make sure the padding is included in the scrollable area.
		 * Otherwise we can run into issues with sticky child elements if the padding is added to the scrollable element - as the stick point would include the padding, but
		 * the scrollable area doesn't, so other non-sticky children can be seen above/below the sticky element's stick point.
		 */
		<div
			css={[
				styles.scrollContainer,
				isScrolled && fg('navx-full-height-sidebar') && fullHeightSidebarStyles.scrolled,
			]}
			ref={fg('navx-full-height-sidebar') ? mergedRef : forwardedRef}
			data-testid={testId}
		>
			<div css={styles.paddingContainer}>{children}</div>
		</div>
	);
}

function useIsScrolled(ref: React.RefObject<HTMLDivElement>) {
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		if (!fg('navx-full-height-sidebar')) {
			return;
		}

		if (!ref.current) {
			return;
		}

		const scrollContainer = ref.current;

		// Listener is throttled to requestAnimationFrame()
		const listener = rafSchd(() => {
			setIsScrolled(scrollContainer.scrollTop > 0);
		});

		return bind(scrollContainer, {
			type: 'scroll',
			options: {
				// Passive means we cannot call event.preventDefault()
				// It allows the browser to optimize scrolling performance:
				// https://developer.chrome.com/docs/lighthouse/best-practices/uses-passive-event-listeners
				passive: true,
			},
			listener,
		});
	}, [ref]);

	return isScrolled;
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

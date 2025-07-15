/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag
 */
import { Fragment } from 'react';

import { cssMap, jsx } from '@compiled/react';

import type { StrictXCSSProp } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';

import { useSkipLink } from '../../../context/skip-links/skip-links-context';
import { contentHeightWhenFixed, contentInsetBlockStart } from '../constants';
import { useLayoutId } from '../id-utils';
import type { CommonSlotProps } from '../types';

import { MainStickyContext } from './main-sticky-context';

const mainElementStyles = cssMap({
	root: {
		gridArea: 'main',
		isolation: 'isolate',
		'@media (min-width: 64rem)': {
			isolation: 'auto',
		},
	},
	fixedContentArea: {
		// This sets the sticky point to be just below top bar + banner. It's needed to ensure the stick
		// point is exactly where this element is rendered to with no wiggle room. Unfortunately the CSS
		// spec for sticky doesn't support "stick to where I'm initially rendered" so we need to tell it.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		insetBlockStart: contentInsetBlockStart,
		overflow: 'auto',
		'@media (min-width: 64rem)': {
			// Height is set so it takes up all of the available viewport space minus top bar + banner.
			// This is only set on larger viewports meaning stickiness only occurs on them.
			// On small viewports it is not sticky.
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			height: contentHeightWhenFixed,
			position: 'sticky',
		},
	},
	containPaint: {
		// Clips children that go outside of the slot.
		// This is effectively already the case due to Main having the lowest z-index of the slots + having its own stacking context.
		contain: 'paint',
	},
});

/**
 * Use the Main area for the main page content. It has a fluid width and will expand to fill available space.
 */
export function Main({
	children,
	isFixed: isFixedProp,
	xcss,
	skipLinkLabel = 'Main Content',
	testId,
	id: providedId,
}: CommonSlotProps & {
	/**
	 * The content of the layout area.
	 * This is where you should put the main content of your page.
	 */
	children: React.ReactNode;
	/**
	 * Bounded style overrides.
	 */
	xcss?: StrictXCSSProp<'backgroundColor', never>;
	// We can handle the deprecated usages
	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required
	/**
	 * @deprecated
	 *
	 * Support for `isFixed={false}` is being removed and `isFixed={true}` will be the only supported behavior.
	 *
	 * This change is being rolled out behind the `platform_dst_nav4_disable_is_fixed_prop` feature gate. After rollout this prop will be removed.
	 *
	 * Reach out to #help-design-system if you are relying on the `isFixed={false}` behavior.
	 *
	 * ---
	 *
	 * Whether the layout area should be fixed _on large viewports_.
	 *
	 * When fixed, the element will have its own scroll container - it will not use the body scroll.
	 *
	 * **Important:** On small viewports, the element will always use body scroll, to make it easier to scroll the page when
	 * the content is tall.
	 *
	 * When not fixed, the element will use the body scroll.
	 */
	isFixed?: boolean;
}) {
	const id = useLayoutId({ providedId });
	const isFixed = fg('platform_dst_nav4_disable_is_fixed_prop') ? true : isFixedProp;

	useSkipLink(id, skipLinkLabel);

	return (
		<Fragment>
			<div
				id={id}
				data-layout-slot
				className={xcss}
				role="main"
				css={[
					mainElementStyles.root,
					isFixed && mainElementStyles.fixedContentArea,
					/**
					 * When enabled the Main slot will:
					 *
					 * - clip any children that extend outside (effectively what happened before anyway due to z-indexing)
					 * - become the containing block for absolute and fixed position descendants
					 * - act as the boundary for popups, so they will flip and shift to stay inside of Main
					 */
					fg('platform_dst_nav4_layering_in_main_slot_fixes') && mainElementStyles.containPaint,
				]}
				data-testid={testId}
			>
				<MainStickyContext.Provider value={Boolean(isFixed)}>{children}</MainStickyContext.Provider>
			</div>
		</Fragment>
	);
}

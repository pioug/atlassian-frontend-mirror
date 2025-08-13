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

const mainElementStyles = cssMap({
	root: {
		gridArea: 'main',
		isolation: 'isolate',
		// This sets the sticky point to be just below top bar + banner. It's needed to ensure the stick
		// point is exactly where this element is rendered to with no wiggle room. Unfortunately the CSS
		// spec for sticky doesn't support "stick to where I'm initially rendered" so we need to tell it.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		insetBlockStart: contentInsetBlockStart,
		overflow: 'auto',
		'@media (min-width: 64rem)': {
			isolation: 'auto',
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
}) {
	const id = useLayoutId({ providedId });

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
				{children}
			</div>
		</Fragment>
	);
}

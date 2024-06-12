/** @jsx jsx */
import { type ReactNode } from 'react';

import { jsx } from '@emotion/react';

import { type BasePrimitiveProps } from '../components/types';
import { parseXcss } from '../xcss/xcss';

import {
	UNSAFE_buildAboveMediaQueryCSS,
	UNSAFE_buildBelowMediaQueryCSS,
} from './build-media-query-css';
import { type Breakpoint } from './types';

const hideAboveQueries = UNSAFE_buildAboveMediaQueryCSS({ display: 'none' });
const hideBelowQueries = UNSAFE_buildBelowMediaQueryCSS({ display: 'none' });

type As =
	| 'article'
	| 'aside'
	| 'dialog'
	| 'div'
	| 'footer'
	| 'header'
	| 'li'
	| 'main'
	| 'nav'
	| 'ol'
	| 'section'
	| 'span'
	| 'ul';

type ResponsiveHideProps = {
	as?: As;
	children: ReactNode;
} & (
	| {
			above?: never;
			/**
			 * Apply CSS to hide this specifically **below** this breakpoint.
			 * The smallest breakpoint is not included as it would never be shown and this would not be performant.
			 *
			 * @important do not mix `above` and `below` (TypeScript should prevent this).
			 */
			below: Exclude<Breakpoint, 'xxs'>;
	  }
	| {
			/**
			 * Apply CSS to hide this specifically **above** this breakpoint.
			 * The smallest breakpoint is not included as it would always be shown and this would not be performant.
			 *
			 * @important do not mix `above` and `below` (TypeScript should prevent this).
			 */

			above: Exclude<Breakpoint, 'xxs'>;
			below?: never;
	  }
) &
	Pick<BasePrimitiveProps, 'xcss'>;

/**
 * Hides the content at a given breakpoint.  By default, content is shown.  The primary use case is for visual presentation.
 * Mix `<Hide above="md">` with `<Show above="md">` to achieve content that shifts at a breakpoint.
 *
 * Please note:
 * - This only uses `display: none` hide, it does not skip rendering of children trees.
 * - As this is rendered at all times, there is little performance savings here (just that this is not painted).
 */
export const Hide = ({
	above,
	below,
	children,
	as: AsElement = 'div',
	xcss,
}: ResponsiveHideProps) => {
	const resolvedStyles = parseXcss(xcss);

	return (
		<AsElement
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={resolvedStyles.static}
			css={[
				above && hideAboveQueries[above],
				below && hideBelowQueries[below],
				resolvedStyles.emotion,
			]}
		>
			{children}
		</AsElement>
	);
};

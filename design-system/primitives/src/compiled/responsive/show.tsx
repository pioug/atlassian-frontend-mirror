/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';

import { type BasePrimitiveProps } from '../components/types';

import type { Breakpoint, ComponentAs } from './types';

const styles = cssMap({
	default: { display: 'none' },
	'above.xs': { '@media (min-width: 30rem)': { display: 'revert' } },
	'above.sm': { '@media (min-width: 48rem)': { display: 'revert' } },
	'above.md': { '@media (min-width: 64rem)': { display: 'revert' } },
	'above.lg': { '@media (min-width: 90rem)': { display: 'revert' } },
	'above.xl': { '@media (min-width: 110.5rem)': { display: 'revert' } },
	'below.xs': { '@media not all and (min-width: 30rem)': { display: 'revert' } },
	'below.sm': { '@media not all and (min-width: 48rem)': { display: 'revert' } },
	'below.md': { '@media not all and (min-width: 64rem)': { display: 'revert' } },
	'below.lg': { '@media not all and (min-width: 90rem)': { display: 'revert' } },
	'below.xl': { '@media not all and (min-width: 110.5rem)': { display: 'revert' } },
});

type ResponsiveShowProps = {
	as?: ComponentAs;
	children: ReactNode;
} & (
	| {
			above?: never;
			/**
			 * Apply CSS to show this specifically **below** this breakpoint.
			 * The smallest breakpoint is not included as it would never be shown and this would not be performant.
			 *
			 * @important do not mix `above` and `below` (TypeScript should prevent this).
			 */
			below: Exclude<Breakpoint, 'xxs'>;
	  }
	| {
			/**
			 * Apply CSS to show this specifically **above** this breakpoint.
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
 * Shows the content at a given breakpoint.  By default, content is hidden.  The primary use case is for visual presentation.
 * Mix `<Show above="md">` with `<Hide above="md">` to achieve content that shifts at a breakpoint.
 *
 * Please note:
 * - This only uses `display: none` and `display: revert` to show/hide, it does not skip rendering of children trees.
 * - As this is rendered at all times, there is little performance savings here (just that this is not painted).
 */
export const Show = ({
	above,
	below,
	children,
	as: AsElement = 'div',
	xcss,
}: ResponsiveShowProps): JSX.Element => {
	return (
		<AsElement
			className={xcss}
			css={[styles.default, above && styles[`above.${above}`], below && styles[`below.${below}`]]}
		>
			{children}
		</AsElement>
	);
};

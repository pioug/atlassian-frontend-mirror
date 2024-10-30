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
	'above.xs': { '@media (min-width: 30rem)': { display: 'none' } },
	'above.sm': { '@media (min-width: 48rem)': { display: 'none' } },
	'above.md': { '@media (min-width: 64rem)': { display: 'none' } },
	'above.lg': { '@media (min-width: 90rem)': { display: 'none' } },
	'above.xl': { '@media (min-width: 110.5rem)': { display: 'none' } },
	'below.xs': { '@media not all and (min-width: 30rem)': { display: 'none' } },
	'below.sm': { '@media not all and (min-width: 48rem)': { display: 'none' } },
	'below.md': { '@media not all and (min-width: 64rem)': { display: 'none' } },
	'below.lg': { '@media not all and (min-width: 90rem)': { display: 'none' } },
	'below.xl': { '@media not all and (min-width: 110.5rem)': { display: 'none' } },
});

type ResponsiveHideProps = {
	as?: ComponentAs;
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
	return (
		<AsElement
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- TODO: Allow pass-through from `props.xcss`
			className={xcss}
			css={[above && styles[`above.${above}`], below && styles[`below.${below}`]]}
		>
			{children}
		</AsElement>
	);
};

/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type ReactNode } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import type { BasePrimitiveProps, BleedSpaceToken } from './types';

export type BleedProps = {
	/**
	 * Elements to be rendered inside the Flex.
	 */
	children: ReactNode;
	/**
	 * Bleed along both axis.
	 */
	all?: BleedSpaceToken;
	/**
	 * Bleed along the inline axis.
	 */
	inline?: BleedSpaceToken;
	/**
	 * Bleed along the block axis
	 */
	block?: BleedSpaceToken;
} & BasePrimitiveProps;

// NOTE: This maintains a full map of 10 styles as Bleed is a bit of a semantic outlier
const styles = cssMap({
	root: { boxSizing: 'border-box' },
	'inline.space.025': {
		marginInline: token('space.negative.025', '-0.125rem'),
	},
	'inline.space.050': {
		marginInline: token('space.negative.050', '-0.25rem'),
	},
	'inline.space.100': {
		marginInline: token('space.negative.100', '-0.5rem'),
	},
	'inline.space.150': {
		marginInline: token('space.negative.150', '-0.75rem'),
	},
	'inline.space.200': {
		marginInline: token('space.negative.200', '-1rem'),
	},
	'block.space.025': {
		marginBlock: token('space.negative.025', '-0.125rem'),
	},
	'block.space.050': {
		marginBlock: token('space.negative.050', '-0.25rem'),
	},
	'block.space.100': {
		marginBlock: token('space.negative.100', '-0.5rem'),
	},
	'block.space.150': {
		marginBlock: token('space.negative.150', '-0.75rem'),
	},
	'block.space.200': {
		marginBlock: token('space.negative.200', '-1rem'),
	},
});

/**
 * __Bleed__
 *
 * `Bleed` is a primitive layout component that controls negative whitespace.
 *
 * - [Examples](https://atlassian.design/components/primitives/bleed/examples)
 * - [Code](https://atlassian.design/components/primitives/bleed/code)
 */
const Bleed: React.MemoExoticComponent<
	({ children, testId, inline, block, all, xcss }: BleedProps) => JSX.Element
> = React.memo(({ children, testId, inline, block, all, xcss }: BleedProps): JSX.Element => {
	return (
		<div
			className={xcss}
			css={[
				styles.root,
				// NOTE: "inline" or "block" must come first to override "all"
				all && styles[`inline.${all}` as const],
				inline && styles[`inline.${inline}` as const],
				all && styles[`block.${all}` as const],
				block && styles[`block.${block}` as const],
			]}
			data-testid={testId}
		>
			{children}
		</div>
	);
});

Bleed.displayName = 'Bleed';

export default Bleed;

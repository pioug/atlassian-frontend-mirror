/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo } from 'react';

import { css, jsx } from '@atlaskit/css';
import { N300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import type { HeadingItemProps } from '../types';

const headingStyles = css({
	color: token('color.text.subtle', N300),
	font: token('font.heading.xxsmall'),
	paddingBlock: token('space.0', '0px'),
	paddingInline: token('space.200', '16px'),
});

/**
 * __Heading item__
 *
 * A heading item is used to describe sibling menu items.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/menu/docs/heading-item)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/menu)
 */
const HeadingItem: import('react').MemoExoticComponent<
	({
		children,
		testId,
		headingLevel,
		id,
		className: UNSAFE_className,
		...rest
	}: HeadingItemProps) => JSX.Element
> = memo(
	({
		children,
		testId,
		headingLevel = 2,
		id,
		// Although this isn't defined on props it is available because we've used
		// Spread props below and on the jsx element. To forcibly block usage I've
		// picked it out and supressed the expected type error.
		// @ts-expect-error
		className: UNSAFE_className,
		...rest
	}: HeadingItemProps) => {
		return (
			<div
				css={headingStyles}
				role="heading"
				aria-level={headingLevel}
				data-testid={testId}
				data-ds--menu--heading-item
				id={id}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={UNSAFE_className}
				{...rest}
			>
				{children}
			</div>
		);
	},
);

export default HeadingItem;

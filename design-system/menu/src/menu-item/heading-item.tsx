/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { propDeprecationWarning } from '@atlaskit/ds-lib/deprecation-warning';
import noop from '@atlaskit/ds-lib/noop';
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
const HeadingItem = memo(
	({
		children,
		testId,
		headingLevel = 2,
		id,
		cssFn = noop as any,
		// Although this isn't defined on props it is available because we've used
		// Spread props below and on the jsx element. To forcibly block usage I've
		// picked it out and supressed the expected type error.
		// @ts-expect-error
		className: UNSAFE_className,
		...rest
	}: HeadingItemProps) => {
		propDeprecationWarning(
			process.env._PACKAGE_NAME_ || '',
			'cssFn',
			cssFn !== (noop as any),
			'', // TODO: Create DAC post when primitives/xcss are available as alternatives
		);

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		const UNSAFE_overrides = css(cssFn(undefined));

		return (
			<div
				css={[
					headingStyles,
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
					UNSAFE_overrides,
				]}
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

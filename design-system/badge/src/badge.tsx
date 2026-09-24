/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { memo } from 'react';

import { jsx } from '@compiled/react';

import { appearanceMapping } from './appearance-mapping';
import BadgeNew from './badge-new';
import { formatValueWithNegativeSupport } from './internal/format-value-with-negative-support';
import type { BadgeProps } from './types';

/**
 * __Badge__
 *
 * This component gives you the full badge functionality and automatically formats the number you provide in `children`.
 *
 * - [Examples](https://atlassian.design/components/badge/examples)
 * - [Code](https://atlassian.design/components/badge/code)
 * - [Usage](https://atlassian.design/components/badge/usage)
 */
const Badge: import('react').NamedExoticComponent<BadgeProps> = memo(function Badge({
	appearance = 'default',
	children = 0,
	max = 99,
	style,
	testId,
}: BadgeProps) {
	// Map old appearance names to new ones
	const newAppearance = appearanceMapping[appearance];
	// Pre-format the value using the backward-compatible formatter (supports negative numbers)
	// then pass max={false} to BadgeNew so it doesn't apply its own (clamping) formatting.
	const formattedValue =
		typeof children === 'number' && typeof max === 'number'
			? formatValueWithNegativeSupport(children, max)
			: children;
	return (
		<BadgeNew appearance={newAppearance} max={false} style={style} testId={testId}>
			{formattedValue}
		</BadgeNew>
	);
});

export default Badge;

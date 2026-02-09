/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@atlaskit/css';

import LozengeBase from './lozenge-base';
import { type LozengeBaseProps, type NewLozengeProps } from './types';

/**
 * __Lozenge__
 *
 * A lozenge is a visual indicator used to highlight an item's status for quick recognition.
 *
 * - [Examples](https://atlassian.design/components/lozenge/examples)
 * - [Code](https://atlassian.design/components/lozenge/code)
 * - [Usage](https://atlassian.design/components/lozenge/usage)
 */
const Lozenge = ({
	appearance = 'neutral',
	spacing = 'default',
	maxWidth = 200,
	style,
	testId,
	children,
	iconBefore,
	trailingMetric,
	trailingMetricAppearance,
}: NewLozengeProps) => {
	const baseProps: LozengeBaseProps = {
		appearance,
		spacing,
		iconBefore,
		trailingMetric,
		trailingMetricAppearance,
		maxWidth,
		style,
		testId,
		children,
	};
	return <LozengeBase {...baseProps}>{children}</LozengeBase>;
};

Lozenge.displayName = 'Lozenge';

export default Lozenge;

/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@atlaskit/css';

import LozengeBase from './lozenge-base';
import { type NewLozengeProps } from './types';

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
}: NewLozengeProps) => {
	return (
		<LozengeBase
			appearance={appearance}
			spacing={spacing}
			iconBefore={iconBefore}
			maxWidth={maxWidth}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={style}
			testId={testId}
		>
			{children}
		</LozengeBase>
	);
};

Lozenge.displayName = 'Lozenge';

export default Lozenge;

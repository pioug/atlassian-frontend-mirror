/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, memo } from 'react';

import { jsx } from '@atlaskit/css';
import __noop from '@atlaskit/ds-lib/noop';

import LozengeBase from './lozenge-base';
import { type LozengeDropdownTriggerProps } from './types';

/**
 * __Lozenge Dropdown Trigger__
 *
 * An interactive lozenge component that acts as a dropdown trigger.
 * Built on LozengeBase with dropdown interaction patterns.
 *
 * - Supports all color variants from the lozenge
 * - Shows selected state with dedicated color tokens
 * - Includes a chevron icon on the right of the text
 * - Built for dropdown menu interactions
 * - Supports analytics events and UFO press interactions
 */
const LozengeDropdownTrigger = memo(
	forwardRef<HTMLElement, LozengeDropdownTriggerProps>(
		(
			{
				children,
				testId,
				appearance = 'neutral',
				spacing = 'default',
				iconBefore,
				isSelected = false,
				isLoading = false,
				maxWidth = 200,
				onClick = __noop,
				style,
				analyticsContext,
				interactionName,
			},
			ref,
		) => {
			return (
				<LozengeBase
					ref={ref}
					appearance={appearance}
					spacing={spacing}
					iconBefore={iconBefore}
					isSelected={isSelected}
					isLoading={isLoading}
					maxWidth={maxWidth}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					style={style}
					testId={testId}
					onClick={onClick}
					analyticsContext={analyticsContext}
					interactionName={interactionName}
				>
					{children}
				</LozengeBase>
			);
		},
	),
);

LozengeDropdownTrigger.displayName = 'LozengeDropdownTrigger';

export default LozengeDropdownTrigger;

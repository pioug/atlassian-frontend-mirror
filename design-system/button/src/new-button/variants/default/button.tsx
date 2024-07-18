import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';
import Pressable from '@atlaskit/primitives/pressable';

import { type CommonButtonVariantProps } from '../types';

import { type CommonDefaultButtonProps } from './types';
import useDefaultButton from './use-default-button';

export type ButtonProps = CommonDefaultButtonProps & CommonButtonVariantProps;

/**
 * __Button__
 *
 * A button triggers an event or action.
 *
 * - [Examples](https://atlassian.design/components/button/examples)
 * - [Code](https://atlassian.design/components/button/code)
 * - [Usage](https://atlassian.design/components/button/usage)
 */
const Button = React.memo(
	React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
		{
			analyticsContext,
			appearance,
			'aria-label': ariaLabel,
			'aria-labelledby': ariaLabelledBy,
			autoFocus,
			children,
			iconAfter,
			iconBefore,
			interactionName,
			isDisabled,
			isLoading,
			isSelected,
			onClick,
			onClickCapture,
			onKeyDownCapture,
			onKeyUpCapture,
			onMouseDownCapture,
			onMouseUpCapture,
			onPointerDownCapture,
			onPointerUpCapture,
			onTouchEndCapture,
			onTouchStartCapture,
			shouldFitContainer,
			spacing,
			testId,
			type = 'button',
			...unsafeRest
		},
		ref,
	) {
		// @ts-expect-error
		const { className: _className, css: _css, as: _as, style: _style, ...saferRest } = unsafeRest;
		const rest = fg('platform.design-system-team.remove-unsafe-spread-from-new-button_a2xhw')
			? saferRest
			: unsafeRest;

		const baseProps = useDefaultButton<HTMLButtonElement>({
			ariaLabel,
			ariaLabelledBy,
			analyticsContext,
			appearance,
			autoFocus,
			buttonType: 'button',
			children,
			iconAfter,
			iconBefore,
			interactionName,
			isDisabled,
			isLoading,
			isSelected,
			onClick,
			onClickCapture,
			onKeyDownCapture,
			onKeyUpCapture,
			onMouseDownCapture,
			onMouseUpCapture,
			onPointerDownCapture,
			onPointerUpCapture,
			onTouchEndCapture,
			onTouchStartCapture,
			ref,
			shouldFitContainer,
			spacing,
			testId,
		});

		return (
			<Pressable
				// TODO: Remove spread props
				{...rest}
				aria-label={baseProps['aria-label']}
				aria-labelledby={baseProps['aria-labelledby']}
				ref={baseProps.ref}
				xcss={baseProps.xcss}
				isDisabled={baseProps.isDisabled}
				onClick={baseProps.onClick}
				onMouseDownCapture={baseProps.onMouseDownCapture}
				onMouseUpCapture={baseProps.onMouseUpCapture}
				onKeyDownCapture={baseProps.onKeyDownCapture}
				onKeyUpCapture={baseProps.onKeyUpCapture}
				onTouchStartCapture={baseProps.onTouchStartCapture}
				onTouchEndCapture={baseProps.onTouchEndCapture}
				onPointerDownCapture={baseProps.onPointerDownCapture}
				onPointerUpCapture={baseProps.onPointerUpCapture}
				onClickCapture={baseProps.onClickCapture}
				type={type}
				testId={testId}
				analyticsContext={analyticsContext}
				interactionName={interactionName}
				componentName="Button"
			>
				{baseProps.children}
			</Pressable>
		);
	}),
);

Button.displayName = 'Button';

export default Button;

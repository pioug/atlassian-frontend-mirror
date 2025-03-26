import React, { Fragment } from 'react';

import ButtonBase from '../shared/button-base';
import Content from '../shared/content';
import IconRenderer from '../shared/icon-renderer';
import { type CommonButtonVariantProps } from '../types';

import { type CommonDefaultButtonProps } from './types';

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
			isLoading = false,
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
		}: ButtonProps,
		ref: React.Ref<HTMLButtonElement>,
	) {
		// @ts-expect-error
		const { className: _className, css: _css, as: _as, style: _style, ...saferRest } = unsafeRest;

		return (
			<ButtonBase
				analyticsContext={analyticsContext}
				ref={ref}
				appearance={appearance}
				autoFocus={autoFocus}
				isDisabled={isDisabled}
				isLoading={isLoading}
				isSelected={isSelected}
				hasIconBefore={Boolean(iconBefore)}
				hasIconAfter={Boolean(iconAfter)}
				shouldFitContainer={shouldFitContainer}
				spacing={spacing}
				ariaLabel={ariaLabel}
				ariaLabelledBy={ariaLabelledBy}
				onClick={onClick}
				onClickCapture={onClickCapture}
				onKeyDownCapture={onKeyDownCapture}
				onKeyUpCapture={onKeyUpCapture}
				onMouseDownCapture={onMouseDownCapture}
				onMouseUpCapture={onMouseUpCapture}
				onPointerDownCapture={onPointerDownCapture}
				onPointerUpCapture={onPointerUpCapture}
				onTouchStartCapture={onTouchStartCapture}
				onTouchEndCapture={onTouchEndCapture}
				testId={testId}
				componentName="Button"
				type={type}
				interactionName={interactionName}
				{...saferRest}
			>
				<Fragment>
					{iconBefore && (
						<Content type="icon" position="before" isLoading={isLoading}>
							<IconRenderer icon={iconBefore} />
						</Content>
					)}
					{children && <Content isLoading={isLoading}>{children}</Content>}
					{iconAfter && (
						<Content type="icon" position="after" isLoading={isLoading}>
							<IconRenderer icon={iconAfter} />
						</Content>
					)}
				</Fragment>
			</ButtonBase>
		);
	}),
);

Button.displayName = 'Button';

export default Button;

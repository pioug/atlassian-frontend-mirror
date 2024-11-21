import React from 'react';

import Pressable from '@atlaskit/primitives/pressable';
import Tooltip from '@atlaskit/tooltip';

import { type CommonButtonVariantProps } from '../types';

import { type CommonIconButtonProps } from './types';
import useIconButton from './use-icon-button';

export type IconButtonProps = CommonIconButtonProps & CommonButtonVariantProps;

/**
 * __Icon Button__
 *
 * Renders an icon-only button lets people take a common and recognizable action where space is limited.
 *
 * - [Examples](https://atlassian.design/components/button/icon-button/examples)
 * - [Code](https://atlassian.design/components/button/icon-button/code)
 * - [Usage](https://atlassian.design/components/button/icon-button/usage)
 */
const IconButton = React.memo(
	React.forwardRef(function Button(
		{
			// Prevent duplicate labels being added.
			'aria-label': preventedAriaLabel,
			'aria-labelledby': ariaLabelledBy,
			analyticsContext,
			appearance,
			autoFocus,
			icon,
			interactionName,
			isDisabled,
			isLoading,
			isSelected,
			isTooltipDisabled = true,
			label,
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
			shape,
			spacing,
			testId,
			tooltip,
			type = 'button',
			...unsafeRest
		}: IconButtonProps,
		ref: React.Ref<HTMLButtonElement>,
	) {
		// @ts-expect-error
		const { className: _className, css: _css, as: _as, style: _style, ...saferRest } = unsafeRest;

		/**
		 * TODO: At some stage I'll look into re-using more logic across 'default' and 'icon'
		 * buttons. It's currently duplicated and mostly the same.
		 */
		const baseProps = useIconButton<HTMLButtonElement>({
			analyticsContext,
			appearance,
			ariaLabelledBy,
			autoFocus,
			buttonType: 'button',
			icon,
			interactionName,
			isDisabled,
			isLoading,
			isSelected,
			label,
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
			shape,
			spacing,
			testId,
		});

		if (!isTooltipDisabled) {
			return (
				<Tooltip
					content={tooltip?.content ?? label}
					testId={tooltip?.testId}
					position={tooltip?.position}
					delay={tooltip?.delay}
					onShow={tooltip?.onShow}
					onHide={tooltip?.onHide}
					mousePosition={tooltip?.mousePosition}
					analyticsContext={tooltip?.analyticsContext}
					strategy={tooltip?.strategy}
					tag={tooltip?.tag}
					truncate={tooltip?.truncate}
					component={tooltip?.component}
					hideTooltipOnClick={tooltip?.hideTooltipOnClick}
					hideTooltipOnMouseDown={tooltip?.hideTooltipOnMouseDown}
					ignoreTooltipPointerEvents={tooltip?.ignoreTooltipPointerEvents}
				>
					{(triggerProps) => (
						<Pressable
							{...saferRest}
							// Top level props
							aria-labelledby={baseProps['aria-labelledby']}
							type={type}
							testId={testId}
							componentName="IconButton"
							analyticsContext={analyticsContext}
							interactionName={interactionName}
							// Shared between tooltip and native props
							onMouseOver={(e) => {
								triggerProps.onMouseOver?.(e);
								saferRest.onMouseOver?.(e);
							}}
							onMouseOut={(e) => {
								triggerProps.onMouseOut?.(e);
								saferRest.onMouseOut?.(e);
							}}
							onMouseMove={(e) => {
								triggerProps.onMouseMove?.(e);
								saferRest.onMouseMove?.(e);
							}}
							onMouseDown={(e) => {
								triggerProps.onMouseDown?.(e);
								saferRest.onMouseDown?.(e);
							}}
							onFocus={(e) => {
								triggerProps.onFocus?.(e);
								saferRest.onFocus?.(e);
							}}
							onBlur={(e) => {
								triggerProps.onBlur?.(e);
								saferRest.onBlur?.(e);
							}}
							// Shared between tooltip and base props
							onClick={(event, analyticsEvent) => {
								baseProps?.onClick?.(event, analyticsEvent);
								triggerProps?.onClick?.(event);
							}}
							ref={(ref) => {
								baseProps.ref(ref);
								triggerProps?.ref?.(ref);
							}}
							// Base props only
							xcss={baseProps.xcss}
							isDisabled={baseProps.isDisabled}
							onMouseDownCapture={baseProps.onMouseDownCapture}
							onMouseUpCapture={baseProps.onMouseUpCapture}
							onKeyDownCapture={baseProps.onKeyDownCapture}
							onKeyUpCapture={baseProps.onKeyUpCapture}
							onTouchStartCapture={baseProps.onTouchStartCapture}
							onTouchEndCapture={baseProps.onTouchEndCapture}
							onPointerDownCapture={baseProps.onPointerDownCapture}
							onPointerUpCapture={baseProps.onPointerUpCapture}
							onClickCapture={baseProps.onClickCapture}
						>
							{baseProps.children}
						</Pressable>
					)}
				</Tooltip>
			);
		}

		return (
			<Pressable
				{...saferRest}
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
				componentName="IconButton"
				analyticsContext={analyticsContext}
				interactionName={interactionName}
			>
				{baseProps.children}
			</Pressable>
		);
	}),
);

IconButton.displayName = 'IconButton';

export default IconButton;

import React from 'react';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import { fg } from '@atlaskit/platform-feature-flags';
import Tooltip from '@atlaskit/tooltip';
import VisuallyHidden from '@atlaskit/visually-hidden';

import ButtonBase from '../shared/button-base';
import Content from '../shared/content';
import IconRenderer from '../shared/icon-renderer';
import { type CommonButtonVariantProps } from '../types';

import { type CommonIconButtonProps } from './types';
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
			isLoading = false,
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

		if (isTooltipDisabled) {
			return (
				<ButtonBase
					{...saferRest}
					ref={ref}
					appearance={appearance}
					autoFocus={autoFocus}
					isDisabled={isDisabled}
					isLoading={isLoading}
					isSelected={isSelected}
					isIconButton
					isCircle={shape === 'circle'}
					hasIconBefore={!!icon}
					spacing={spacing}
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
					componentName="IconButton"
					analyticsContext={analyticsContext}
					type={type}
					interactionName={interactionName}
				>
					<Content type="icon" isLoading={isLoading}>
						<IconRenderer icon={icon} />
						<VisuallyHidden>{label}</VisuallyHidden>
					</Content>
				</ButtonBase>
			);
		}

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
				hideTooltipOnClick={
					tooltip?.hideTooltipOnClick ?? fg('platform-icon-button-dismiss-tooltip-on-click')
				}
				hideTooltipOnMouseDown={tooltip?.hideTooltipOnMouseDown}
				ignoreTooltipPointerEvents={tooltip?.ignoreTooltipPointerEvents}
			>
				{(triggerProps) => (
					<ButtonBase
						{...saferRest}
						appearance={appearance}
						autoFocus={autoFocus}
						isDisabled={isDisabled}
						isLoading={isLoading}
						isSelected={isSelected}
						isIconButton
						isCircle={shape === 'circle'}
						hasIconBefore={false}
						spacing={spacing}
						ariaLabelledBy={ariaLabelledBy}
						onClick={(e, analyticsEvent) => {
							onClick?.(e, analyticsEvent);
							triggerProps.onClick?.(e);
						}}
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
						ref={mergeRefs([ref, triggerProps?.ref].filter(Boolean))}
						onMouseDownCapture={onMouseDownCapture}
						onMouseUpCapture={onMouseUpCapture}
						onKeyDownCapture={onKeyDownCapture}
						onKeyUpCapture={onKeyUpCapture}
						onTouchStartCapture={onTouchStartCapture}
						onTouchEndCapture={onTouchEndCapture}
						onPointerDownCapture={onPointerDownCapture}
						onPointerUpCapture={onPointerUpCapture}
						onClickCapture={onClickCapture}
						type={type}
						testId={testId}
						analyticsContext={analyticsContext}
						interactionName={interactionName}
						componentName="IconButton"
					>
						<Content type="icon" isLoading={isLoading}>
							<IconRenderer icon={icon} />
							<VisuallyHidden>{label}</VisuallyHidden>
						</Content>
					</ButtonBase>
				)}
			</Tooltip>
		);
	}),
);

IconButton.displayName = 'IconButton';

export default IconButton;

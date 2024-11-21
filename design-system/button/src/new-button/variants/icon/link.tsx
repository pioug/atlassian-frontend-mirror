import React, { forwardRef, memo, type Ref } from 'react';

import Anchor from '@atlaskit/primitives/anchor';
import Tooltip from '@atlaskit/tooltip';

import { type CommonLinkVariantProps } from '../types';

import { type CommonIconButtonProps } from './types';
import useIconButton from './use-icon-button';

export type LinkIconButtonProps<RouterLinkConfig extends Record<string, any> = never> =
	CommonIconButtonProps & CommonLinkVariantProps<RouterLinkConfig>;

const LinkIconButtonBase = <RouterLinkConfig extends Record<string, any> = never>(
	{
		// Prevent duplicate labels being added.
		'aria-label': preventedAriaLabel,
		'aria-labelledby': ariaLabelledBy,
		analyticsContext,
		appearance,
		autoFocus,
		href,
		icon,
		interactionName,
		isDisabled,
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
		...unsafeRest
	}: LinkIconButtonProps<RouterLinkConfig>,
	ref: Ref<HTMLAnchorElement>,
) => {
	// @ts-expect-error
	const { className: _className, css: _css, as: _as, style: _style, ...saferRest } = unsafeRest;

	const baseProps = useIconButton<HTMLAnchorElement>({
		analyticsContext,
		appearance,
		ariaLabelledBy,
		autoFocus,
		buttonType: 'link',
		icon,
		interactionName,
		isDisabled,
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
					<Anchor
						// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
						{...saferRest}
						aria-labelledby={baseProps['aria-labelledby']}
						testId={testId}
						componentName="LinkIconButton"
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
						onMouseDownCapture={baseProps.onMouseDownCapture}
						onMouseUpCapture={baseProps.onMouseUpCapture}
						onKeyDownCapture={baseProps.onKeyDownCapture}
						onKeyUpCapture={baseProps.onKeyUpCapture}
						onTouchStartCapture={baseProps.onTouchStartCapture}
						onTouchEndCapture={baseProps.onTouchEndCapture}
						onPointerDownCapture={baseProps.onPointerDownCapture}
						onPointerUpCapture={baseProps.onPointerUpCapture}
						onClickCapture={baseProps.onClickCapture}
						/**
						 * Disable link in an accessible way using `href`, `role`, and `aria-disabled`.
						 * @see https://a11y-guidelines.orange.com/en/articles/disable-elements/#disable-a-link
						 */
						// @ts-expect-error (`href` is required, we could make it optional but don't want to encourage this pattern elsewhere)
						href={baseProps.isDisabled ? undefined : href}
						role={baseProps.isDisabled ? 'link' : undefined}
						aria-disabled={baseProps.isDisabled === true ? true : undefined}
					>
						{baseProps.children}
					</Anchor>
				)}
			</Tooltip>
		);
	}

	return (
		<Anchor
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...saferRest}
			aria-labelledby={baseProps['aria-labelledby']}
			ref={baseProps.ref}
			xcss={baseProps.xcss}
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
			testId={testId}
			/**
			 * Disable link in an accessible way using `href`, `role`, and `aria-disabled`.
			 * @see https://a11y-guidelines.orange.com/en/articles/disable-elements/#disable-a-link
			 */
			// @ts-expect-error (`href` is required, we could make it optional but don't want to encourage this pattern elsewhere)
			href={baseProps.isDisabled ? undefined : href}
			role={baseProps.isDisabled ? 'link' : undefined}
			aria-disabled={baseProps.isDisabled === true ? true : undefined}
			componentName="LinkIconButton"
			analyticsContext={analyticsContext}
			interactionName={interactionName}
		>
			{baseProps.children}
		</Anchor>
	);
};

// Workarounds to support generic types with forwardRef + memo
const WithRef = forwardRef(LinkIconButtonBase) as <
	RouterLinkConfig extends Record<string, any> = never,
>(
	props: LinkIconButtonProps<RouterLinkConfig> & {
		ref?: Ref<HTMLAnchorElement>;
	},
) => ReturnType<typeof LinkIconButtonBase>;

/**
 * __Link Icon Button__
 *
 * Renders a link in the style of an icon button.
 *
 * - [Examples](https://atlassian.design/components/button/link-icon-button/examples)
 * - [Code](https://atlassian.design/components/button/link-icon-button/code)
 * - [Usage](https://atlassian.design/components/button/link-icon-button/usage)
 */
const LinkIconButton = memo(WithRef) as typeof WithRef;

export default LinkIconButton;

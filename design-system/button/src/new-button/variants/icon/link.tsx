/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, memo, type Ref, useRef } from 'react';

import { cssMap, cx, jsx } from '@atlaskit/css';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import useAutoFocus from '@atlaskit/ds-lib/use-auto-focus';
import { fg } from '@atlaskit/platform-feature-flags';
import { Anchor } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';
import VisuallyHidden from '@atlaskit/visually-hidden';

import Content from '../shared/content';
import IconRenderer from '../shared/icon-renderer';
import type { CommonAnchorProps, CommonLinkVariantProps } from '../types';

import { type CommonIconButtonProps } from './types';

export type LinkIconButtonProps<RouterLinkConfig extends Record<string, any> = never> =
	CommonIconButtonProps &
		CommonLinkVariantProps<RouterLinkConfig> &
		CommonAnchorProps<RouterLinkConfig>;

const styles = cssMap({
	base: {
		display: 'inline-flex',
		boxSizing: 'border-box',
		width: 'auto',
		maxWidth: '100%',
		position: 'relative',
		alignItems: 'baseline',
		justifyContent: 'center',
		columnGap: token('space.050'),
		borderRadius: token('radius.small', '3px'),
		borderWidth: 0,
		flexShrink: 0,
		height: '2rem',
		font: token('font.body'),
		fontWeight: token('font.weight.medium'),
		paddingBlock: token('space.075'),
		paddingInlineEnd: token('space.150'),
		paddingInlineStart: token('space.150'),
		textAlign: 'center',
		transition: 'background 0.1s ease-out',
		verticalAlign: 'middle',
		'&::after': {
			borderRadius: 'inherit',
			inset: token('space.0'),
			borderStyle: 'solid',
			borderWidth: token('border.width'),
			pointerEvents: 'none',
			position: 'absolute',
		},
	},
	// platform-dst-shape-theme-default TODO: Merge into base after rollout
	baseT26Shape: {
		borderRadius: token('radius.medium', '6px'),
	},
	// Required due to Jira's AUI CSS reset: https://product-fabric.atlassian.net/browse/DSP-15687
	linkDecorationUnset: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		textDecoration: 'none !important',
		'&:hover': { textDecoration: 'none' },
		'&:active': { textDecoration: 'none' },
		'&:focus': { textDecoration: 'none' },
	},
	disabled: {
		cursor: 'not-allowed',
		backgroundColor: token('color.background.disabled'),
		color: token('color.text.disabled'),
		'&:hover': {
			// @ts-expect-error
			backgroundColor: token('color.background.disabled'),
			color: token('color.text.disabled'),
		},
		'&:active': {
			// @ts-expect-error
			backgroundColor: token('color.background.disabled'),
			// @ts-expect-error
			color: token('color.text.disabled'),
		},
		'&::after': {
			content: 'none',
		},
	},
	spacingCompact: {
		columnGap: token('space.050'),
		paddingBlock: token('space.025'),
		paddingInlineEnd: token('space.150'),
		paddingInlineStart: token('space.150'),
		verticalAlign: 'middle',
		height: '1.5rem',
		width: '1.5rem',
	},
	iconButton: {
		height: '2rem',
		width: '2rem',
		paddingInlineEnd: token('space.0'),
		paddingInlineStart: token('space.0'),
	},
	circle: {
		borderRadius: token('radius.full'),
	},
});

const defaultStyles = cssMap({
	root: {
		backgroundColor: token('color.background.neutral.subtle'),
		color: token('color.text.subtle'),
		'&::after': {
			content: '""',
			borderColor: token('color.border'),
		},
		'&:visited': {
			color: token('color.text.subtle'),
		},
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
			color: token('color.text.subtle'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
			// @ts-expect-error
			color: token('color.text.subtle'),
		},
		'&:focus': {
			color: token('color.text.subtle'),
		},
	},
});

const primaryStyles = cssMap({
	root: {
		backgroundColor: token('color.background.brand.bold'),
		color: token('color.text.inverse'),
		'&:visited': {
			color: token('color.text.inverse'),
		},
		'&:hover': {
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.brand.bold.hovered'),
		},
		'&:active': {
			// @ts-expect-error
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.brand.bold.pressed'),
		},
	},
});

const discoveryStyles = cssMap({
	root: {
		backgroundColor: token('color.background.discovery.bold'),
		color: token('color.text.inverse'),
		'&:visited': {
			color: token('color.text.inverse'),
		},
		'&:hover': {
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.discovery.bold.hovered'),
		},
		'&:active': {
			// @ts-expect-error
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.discovery.bold.pressed'),
		},
	},
});

const subtleStyles = cssMap({
	root: {
		backgroundColor: token('color.background.neutral.subtle'),
		color: token('color.text.subtle'),
		'&:visited': {
			color: token('color.text.subtle'),
		},
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
			color: token('color.text.subtle'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
			// @ts-expect-error
			color: token('color.text.subtle'),
		},
		'&:focus': {
			// @ts-expect-error
			color: 'color.text.subtle',
		},
	},
});

const selectedStyles = cssMap({
	root: {
		backgroundColor: token('color.background.selected'),
		color: token('color.text.selected'),
		'&::after': {
			content: '""',
			borderColor: token('color.border.selected'),
		},
		'&:visited': {
			color: token('color.text.selected'),
		},
		'&:hover': {
			color: token('color.text.selected'),
		},
		'&:active': {
			// @ts-expect-error
			color: token('color.text.selected'),
		},
		'&:focus': {
			color: token('color.text.selected'),
		},
	},
	discovery: {
		backgroundColor: token('color.background.selected'),
		color: token('color.text.selected'),
		'&:hover': {
			color: token('color.text.selected'),
			// @ts-expect-error
			backgroundColor: token('color.background.selected'),
		},
		'&:active': {
			// @ts-expect-error
			color: token('color.text.selected'),
			// @ts-expect-error
			backgroundColor: token('color.background.selected'),
		},
	},
});

const LinkIconButtonBase = <RouterLinkConfig extends Record<string, any> = never>(
	{
		// Prevent duplicate labels being added.
		'aria-label': preventedAriaLabel,
		'aria-labelledby': ariaLabelledBy,
		analyticsContext,
		appearance = 'default',
		autoFocus = false,
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
	const localRef = useRef<HTMLAnchorElement>(null);
	useAutoFocus(localRef, autoFocus);

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
						{...saferRest}
						aria-labelledby={ariaLabelledBy}
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
							onClick?.(event, analyticsEvent);
							triggerProps?.onClick?.(event);
						}}
						ref={mergeRefs([localRef, ref, triggerProps.ref].filter(Boolean))}
						// Base props only
						xcss={cx(
							styles.base,
							fg('platform-dst-shape-theme-default') && styles.baseT26Shape,
							appearance === 'default' && defaultStyles.root,
							appearance === 'primary' && primaryStyles.root,
							appearance === 'discovery' && discoveryStyles.root,
							appearance === 'subtle' && subtleStyles.root,
							styles.linkDecorationUnset,
							isSelected && selectedStyles.root,
							isSelected && appearance === 'discovery' && selectedStyles.discovery,
							isDisabled && styles.disabled,
							spacing === 'compact' && styles.spacingCompact,
							styles.iconButton,
							shape === 'circle' && styles.circle,
						)}
						onMouseDownCapture={onMouseDownCapture}
						onMouseUpCapture={onMouseUpCapture}
						onKeyDownCapture={onKeyDownCapture}
						onKeyUpCapture={onKeyUpCapture}
						onTouchStartCapture={onTouchStartCapture}
						onTouchEndCapture={onTouchEndCapture}
						onPointerDownCapture={onPointerDownCapture}
						onPointerUpCapture={onPointerUpCapture}
						onClickCapture={onClickCapture}
						/**
						 * Disable link in an accessible way using `href`, `role`, and `aria-disabled`.
						 * @see https://a11y-guidelines.orange.com/en/articles/disable-elements/#disable-a-link
						 */
						// @ts-expect-error (`href` is required, we could make it optional but don't want to encourage this pattern elsewhere)
						href={isDisabled ? undefined : href}
						role={isDisabled ? 'link' : undefined}
						aria-disabled={isDisabled === true ? true : undefined}
					>
						<Content type="icon" isLoading={false}>
							<IconRenderer icon={icon} />
							<VisuallyHidden>{label}</VisuallyHidden>
						</Content>
					</Anchor>
				)}
			</Tooltip>
		);
	}

	return (
		<Anchor
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...saferRest}
			// aria-label={preventedAriaLabel}
			aria-labelledby={ariaLabelledBy}
			ref={mergeRefs([localRef, ref])}
			xcss={cx(
				styles.base,
				fg('platform-dst-shape-theme-default') && styles.baseT26Shape,
				appearance === 'default' && defaultStyles.root,
				appearance === 'primary' && primaryStyles.root,
				appearance === 'discovery' && discoveryStyles.root,
				appearance === 'subtle' && subtleStyles.root,
				styles.linkDecorationUnset,
				isSelected && selectedStyles.root,
				isSelected && appearance === 'discovery' && selectedStyles.discovery,
				isDisabled && styles.disabled,
				styles.iconButton,
				spacing === 'compact' && styles.spacingCompact,
				shape === 'circle' && styles.circle,
			)}
			onClick={onClick}
			onMouseDownCapture={onMouseDownCapture}
			onMouseUpCapture={onMouseUpCapture}
			onKeyDownCapture={onKeyDownCapture}
			onKeyUpCapture={onKeyUpCapture}
			onTouchStartCapture={onTouchStartCapture}
			onTouchEndCapture={onTouchEndCapture}
			onPointerDownCapture={onPointerDownCapture}
			onPointerUpCapture={onPointerUpCapture}
			onClickCapture={onClickCapture}
			testId={testId}
			/**
			 * Disable link in an accessible way using `href`, `role`, and `aria-disabled`.
			 * @see https://a11y-guidelines.orange.com/en/articles/disable-elements/#disable-a-link
			 */
			// @ts-expect-error (`href` is required, we could make it optional but don't want to encourage this pattern elsewhere)
			href={isDisabled ? undefined : href}
			role={isDisabled ? 'link' : undefined}
			aria-disabled={isDisabled === true ? true : undefined}
			componentName="LinkIconButton"
			analyticsContext={analyticsContext}
			interactionName={interactionName}
		>
			<Content type="icon" isLoading={false}>
				<IconRenderer icon={icon} />
				<VisuallyHidden>{label}</VisuallyHidden>
			</Content>
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

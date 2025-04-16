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
import { CommonAnchorProps, type CommonLinkVariantProps } from '../types';

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
		borderRadius: token('border.radius.100', '3px'),
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
		borderRadius: token('border.radius.circle'),
	},
});

const defaultStyles = cssMap({
	root: {
		backgroundColor: token('color.background.neutral', 'rgba(9, 30, 66, 0.04)'),
		color: token('color.text', '#42526E'),
		'&:visited': {
			color: token('color.text', '#42526E'),
		},
		'&:hover': {
			backgroundColor: token('color.background.neutral.hovered', '#091e4214'),
			color: token('color.text', '#42526E'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.pressed'),
			// @ts-expect-error
			color: token('color.text', '#42526E'),
		},
		'&:focus': {
			color: token('color.text', '#42526E'),
		},
	},
	rootRefreshed: {
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
		backgroundColor: token('color.background.brand.bold', '#0052CC'),
		color: token('color.text.inverse'),
		'&:visited': {
			color: token('color.text.inverse'),
		},
		'&:hover': {
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.brand.bold.hovered', '#0065FF'),
		},
		'&:active': {
			// @ts-expect-error
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.brand.bold.pressed', '#0747A6'),
		},
	},
});

const discoveryStyles = cssMap({
	root: {
		backgroundColor: token('color.background.discovery.bold', '#5243AA'),
		color: token('color.text.inverse'),
		'&:visited': {
			color: token('color.text.inverse'),
		},
		'&:hover': {
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.discovery.bold.hovered', '#8777D9'),
		},
		'&:active': {
			// @ts-expect-error
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.discovery.bold.pressed', '#5243AA'),
		},
	},
});

const subtleStyles = cssMap({
	root: {
		backgroundColor: token('color.background.neutral.subtle', 'transparent'),
		color: token('color.text', '#42526E'),
		'&:visited': {
			color: token('color.text', '#42526E'),
		},
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered', '#091e4214'),
			color: token('color.text', '#42526E'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed', '#B3D4FF'),
			// @ts-expect-error
			color: token('color.text', '#42526E'),
		},
		'&:focus': {
			color: token('color.text', '#42526E'),
		},
	},
	rootRefreshed: {
		backgroundColor: token('color.background.neutral.subtle', 'transparent'),
		color: token('color.text.subtle'),
		'&:visited': {
			color: token('color.text.subtle'),
		},
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered', '#091e4214'),
			color: token('color.text.subtle'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed', '#B3D4FF'),
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
		backgroundColor: token('color.background.selected', '#253858'),
		color: token('color.text.selected', '#F4F5F7'),
		'&:visited': {
			color: token('color.text.selected', '#F4F5F7'),
		},
		'&:hover': {
			backgroundColor: token('color.background.selected.hovered'),
			color: token('color.text.selected'),
		},
		'&:active': {
			backgroundColor: token('color.background.selected.pressed'),
			// @ts-expect-error
			color: token('color.text.selected'),
		},
		'&:focus': {
			color: token('color.text.selected', '#F4F5F7'),
		},
	},
	rootRefreshed: {
		backgroundColor: token('color.background.selected'),
		color: token('color.text.selected', '#0052cc'),
		'&::after': {
			content: '""',
			borderColor: token('color.border.selected', '#0052cc'),
		},
		'&:visited': {
			color: token('color.text.selected', '#0052cc'),
		},
		'&:hover': {
			color: token('color.text.selected', '#0052cc'),
		},
		'&:active': {
			// @ts-expect-error
			color: token('color.text.selected', '#0052cc'),
		},
		'&:focus': {
			color: token('color.text.selected', '#0052cc'),
		},
	},
	// TODO: Remove me once we kill color fallbacks
	discovery: {
		backgroundColor: token('color.background.selected', '#403294'),
		color: token('color.text.selected', '#F4F5F7'),
		'&:hover': {
			color: token('color.text.selected', '#F4F5F7'),
			// @ts-expect-error
			backgroundColor: token('color.background.selected', '#403294'),
		},
		'&:active': {
			// @ts-expect-error
			color: token('color.text.selected', '#F4F5F7'),
			// @ts-expect-error
			backgroundColor: token('color.background.selected', '#403294'),
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
							appearance === 'default' &&
								(fg('platform-component-visual-refresh')
									? defaultStyles.rootRefreshed
									: defaultStyles.root),
							appearance === 'primary' && primaryStyles.root,
							appearance === 'discovery' && discoveryStyles.root,
							appearance === 'subtle' &&
								(fg('platform-component-visual-refresh')
									? subtleStyles.rootRefreshed
									: subtleStyles.root),
							styles.linkDecorationUnset,
							isSelected &&
								(fg('platform-component-visual-refresh')
									? selectedStyles.rootRefreshed
									: selectedStyles.root),
							// TODO: remove me once we kill color fallbacks
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
				appearance === 'default' &&
					(fg('platform-component-visual-refresh')
						? defaultStyles.rootRefreshed
						: defaultStyles.root),
				appearance === 'primary' && primaryStyles.root,
				appearance === 'discovery' && discoveryStyles.root,
				appearance === 'subtle' &&
					(fg('platform-component-visual-refresh')
						? subtleStyles.rootRefreshed
						: subtleStyles.root),
				styles.linkDecorationUnset,
				isSelected &&
					(fg('platform-component-visual-refresh')
						? selectedStyles.rootRefreshed
						: selectedStyles.root),
				// TODO: remove me once we kill color fallbacks
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

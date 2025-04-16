/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, useRef } from 'react';

import { cssMap, cx, jsx } from '@atlaskit/css';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import useAutoFocus from '@atlaskit/ds-lib/use-auto-focus';
import { fg } from '@atlaskit/platform-feature-flags';
import { Anchor } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import Content from '../shared/content';
import IconRenderer from '../shared/icon-renderer';
import type { AdditionalDefaultLinkVariantProps, CommonLinkVariantProps } from '../types';

import type { CommonDefaultButtonProps } from './types';

export type LinkButtonProps<RouterLinkConfig extends Record<string, any> = never> =
	CommonDefaultButtonProps &
		CommonLinkVariantProps<RouterLinkConfig> &
		AdditionalDefaultLinkVariantProps;

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
		height: '1.5rem',
		paddingBlock: token('space.025'),
		paddingInlineEnd: token('space.150'),
		paddingInlineStart: token('space.150'),
		verticalAlign: 'middle',
	},
	buttonIconBefore: {
		paddingInlineStart: token('space.100'),
	},
	buttonIconAfter: {
		paddingInlineEnd: token('space.100'),
	},
	fullWidth: {
		width: '100%',
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
		'&:focus': {
			color: token('color.text.inverse'),
		},
	},
});

const warningStyles = cssMap({
	root: {
		backgroundColor: token('color.background.warning.bold', '#FFAB00'),
		color: token('color.text.warning.inverse', '#172B4D'),
		'&:visited': {
			color: token('color.text.warning.inverse', '#172B4D'),
		},
		'&:hover': {
			color: token('color.text.warning.inverse', '#172B4D'),
			backgroundColor: token('color.background.warning.bold.hovered', '#FFC400'),
		},
		'&:active': {
			// @ts-expect-error
			color: token('color.text.warning.inverse', '#172B4D'),
			backgroundColor: token('color.background.warning.bold.pressed', '#FF991F'),
		},
		'&:focus': {
			color: token('color.text.warning.inverse', '#172B4D'),
		},
	},
});

const dangerStyles = cssMap({
	root: {
		backgroundColor: token('color.background.danger.bold', '#DE350B'),
		color: token('color.text.inverse'),
		'&:visited': {
			color: token('color.text.inverse'),
		},
		'&:hover': {
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.danger.bold.hovered', '#FF5630'),
		},
		'&:active': {
			// @ts-expect-error
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.danger.bold.pressed', '#BF2600'),
		},
		'&:focus': {
			color: token('color.text.inverse'),
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
		'&:focus': {
			color: token('color.text.inverse'),
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
			color: token('color.text.selected', '#F4F5F7'),
		},
		'&:active': {
			backgroundColor: token('color.background.selected.pressed'),
			// @ts-expect-error
			color: token('color.text.selected', '#F4F5F7'),
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
	warning: {
		backgroundColor: token('color.background.selected', '#FF991F'),
		color: token('color.text.selected', '#172B4D'),
		'&:hover': {
			color: token('color.text.selected', '#F4F5F7'),
			// @ts-expect-error
			backgroundColor: token('color.background.selected', '#FF991F'),
		},
		'&:active': {
			// @ts-expect-error
			color: token('color.text.selected', '#F4F5F7'),
			// @ts-expect-error
			backgroundColor: token('color.background.selected', '#FF991F'),
		},
	},
	// TODO: Remove me once we kill color fallbacks
	danger: {
		backgroundColor: token('color.background.selected', '#BF2600'),
		color: token('color.text.selected', '#F4F5F7'),
		'&:hover': {
			color: token('color.text.selected', '#F4F5F7'),
			// @ts-expect-error
			backgroundColor: token('color.background.selected', '#BF2600'),
		},
		'&:active': {
			// @ts-expect-error
			color: token('color.text.selected', '#F4F5F7'),
			// @ts-expect-error
			backgroundColor: token('color.background.selected', '#BF2600'),
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

/**
 * __Link Button__
 *
 * Renders a link in the style of a button.
 *
 * - [Examples](https://atlassian.design/components/link-button/examples)
 * - [Code](https://atlassian.design/components/link-button/code)
 * - [Usage](https://atlassian.design/components/link-button/usage)
 */
const LinkButtonBase = <RouterLinkConfig extends Record<string, any> = never>(
	{
		analyticsContext,
		appearance = 'default',
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		autoFocus = false,
		children,
		href,
		iconAfter,
		iconBefore,
		interactionName,
		isDisabled,
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
		...unsafeRest
	}: LinkButtonProps<RouterLinkConfig>,
	ref: React.Ref<HTMLAnchorElement>,
) => {
	// @ts-expect-error
	const { className: _className, css: _css, as: _as, style: _style, ...saferRest } = unsafeRest;
	const hasIconAfter = Boolean(iconAfter);
	const hasIconBefore = Boolean(iconBefore);
	const localRef = useRef<HTMLAnchorElement>(null);
	useAutoFocus(localRef, autoFocus);
	const combinedRef = mergeRefs([localRef, ref]);

	return (
		<Anchor
			analyticsContext={analyticsContext}
			ref={combinedRef}
			/**
			 * Disable link in an accessible way using `href`, `role`, and `aria-disabled`.
			 * @see https://a11y-guidelines.orange.com/en/articles/disable-elements/#disable-a-link
			 */
			// @ts-expect-error (`href` is required, we could make it optional but don't want to encourage this pattern elsewhere)
			href={isDisabled ? undefined : href}
			role={isDisabled ? 'link' : undefined}
			aria-disabled={isDisabled === true ? true : undefined}
			aria-label={ariaLabel}
			aria-labelledby={ariaLabelledBy}
			onClick={onClick}
			onClickCapture={onClickCapture}
			onKeyDownCapture={onKeyDownCapture}
			onKeyUpCapture={onKeyUpCapture}
			onMouseDownCapture={onMouseDownCapture}
			onMouseUpCapture={onMouseUpCapture}
			onPointerDownCapture={onPointerDownCapture}
			onPointerUpCapture={onPointerUpCapture}
			onTouchEndCapture={onTouchEndCapture}
			onTouchStartCapture={onTouchStartCapture}
			testId={testId}
			componentName="LinkButton"
			interactionName={interactionName}
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...saferRest}
			xcss={cx(
				styles.base,
				appearance === 'default' &&
					(fg('platform-component-visual-refresh')
						? defaultStyles.rootRefreshed
						: defaultStyles.root),
				appearance === 'primary' && primaryStyles.root,
				appearance === 'warning' && warningStyles.root,
				appearance === 'danger' && dangerStyles.root,
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
				isSelected && appearance === 'danger' && selectedStyles.danger,
				// TODO: remove me once we kill color fallbacks
				isSelected && appearance === 'warning' && selectedStyles.warning,
				// TODO: remove me once we kill color fallbacks
				isSelected && appearance === 'discovery' && selectedStyles.discovery,
				isDisabled && styles.disabled,
				spacing === 'compact' && styles.spacingCompact,
				hasIconBefore && styles.buttonIconBefore,
				hasIconAfter && styles.buttonIconAfter,
				shouldFitContainer && styles.fullWidth,
			)}
		>
			{iconBefore && (
				<Content type="icon" position="before" isLoading={false}>
					<IconRenderer icon={iconBefore} />
				</Content>
			)}
			{children && <Content isLoading={false}>{children}</Content>}
			{iconAfter && (
				<Content type="icon" position="after" isLoading={false}>
					<IconRenderer icon={iconAfter} />
				</Content>
			)}
		</Anchor>
	);
};

// Workarounds to support generic types with forwardRef
/**
 * __Link Button__
 *
 * Renders a link in the style of a button.
 *
 * - [Examples](https://atlassian.design/components/link-button/examples)
 * - [Code](https://atlassian.design/components/link-button/code)
 * - [Usage](https://atlassian.design/components/link-button/usage)
 */
const LinkButton = forwardRef(LinkButtonBase) as (<
	RouterLinkConfig extends Record<string, any> = never,
>(
	props: LinkButtonProps<RouterLinkConfig> & { ref?: React.Ref<HTMLAnchorElement> },
) => ReturnType<typeof LinkButtonBase>) & { displayName?: string };

LinkButton.displayName = 'LinkButton';
export default LinkButton;

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
		'&:focus': {
			color: token('color.text.inverse'),
		},
	},
});

const warningStyles = cssMap({
	root: {
		backgroundColor: token('color.background.warning.bold'),
		color: token('color.text.warning.inverse'),
		'&:visited': {
			color: token('color.text.warning.inverse'),
		},
		'&:hover': {
			color: token('color.text.warning.inverse'),
			backgroundColor: token('color.background.warning.bold.hovered'),
		},
		'&:active': {
			// @ts-expect-error
			color: token('color.text.warning.inverse'),
			backgroundColor: token('color.background.warning.bold.pressed'),
		},
		'&:focus': {
			color: token('color.text.warning.inverse'),
		},
	},
});

const dangerStyles = cssMap({
	root: {
		backgroundColor: token('color.background.danger.bold'),
		color: token('color.text.inverse'),
		'&:visited': {
			color: token('color.text.inverse'),
		},
		'&:hover': {
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.danger.bold.hovered'),
		},
		'&:active': {
			// @ts-expect-error
			color: token('color.text.inverse'),
			backgroundColor: token('color.background.danger.bold.pressed'),
		},
		'&:focus': {
			color: token('color.text.inverse'),
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
		'&:focus': {
			color: token('color.text.inverse'),
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
	warning: {
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
	danger: {
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
): JSX.Element => {
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
				fg('platform-dst-shape-theme-default') && styles.baseT26Shape,
				appearance === 'default' && defaultStyles.root,
				appearance === 'primary' && primaryStyles.root,
				appearance === 'warning' && warningStyles.root,
				appearance === 'danger' && dangerStyles.root,
				appearance === 'discovery' && discoveryStyles.root,
				appearance === 'subtle' && subtleStyles.root,
				styles.linkDecorationUnset,
				isSelected && selectedStyles.root,
				isSelected && appearance === 'danger' && selectedStyles.danger,
				isSelected && appearance === 'warning' && selectedStyles.warning,
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

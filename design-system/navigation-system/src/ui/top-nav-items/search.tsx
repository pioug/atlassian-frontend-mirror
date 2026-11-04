/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment } from 'react';

// Container widths and custom-theme colors need the unbounded Compiled style types.
import { cssMap as unboundedCssMap, cx, jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import SearchIcon from '@atlaskit/icon/core/search';
import type { NewIconProps } from '@atlaskit/icon/types';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Pressable, type PressableProps } from '@atlaskit/primitives/compiled/pressable';
import { Show } from '@atlaskit/primitives/compiled/show';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip/Tooltip';
import type { TriggerProps } from '@atlaskit/tooltip/types';
import VisuallyHidden from '@atlaskit/visually-hidden/visually-hidden';

import { useHasCustomTheme } from './themed/has-custom-theme-context';
import { IconButton } from './themed/icon-button';

const styles = cssMap({
	root: {
		gridTemplateColumns: 'auto 1fr auto',
		alignItems: 'center',
		backgroundColor: token('color.background.input'),
		borderRadius: token('radius.medium'),
		boxSizing: 'border-box',
		cursor: 'text',
		height: '32px',
		maxWidth: '680px',
		paddingBlock: token('space.0'),
		paddingInline: token('space.075'),
		width: '100%',
		transition: token('motion.button.hovered'),
		'&:hover': {
			backgroundColor: token('color.background.input.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.input.pressed'),
			transition: token('motion.button.pressed'),
		},
	},
	viewport: {
		display: 'none',
		'@media (min-width: 30rem)': {
			display: 'grid',
		},
	},
	containerBorder: {
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border.input'),
	},
	containerBorderFinesse: {
		borderColor: token('color.border.input.search'),
	},
	containerText: {
		gridColumn: 2,
		minWidth: 0,
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
	buttonText: {
		gridColumn: '1 / -1',
		gridRow: 1,
	},
	iconBefore: {
		display: 'flex',
		gridColumn: 1,
		gridRow: 1,
	},
	elemAfter: {
		display: 'flex',
		gridColumn: 3,
		gridRow: 1,
	},
});

const containerStyles = unboundedCssMap({
	container: {
		backgroundColor: 'var(--n_tnSearchFieldBackground)',
		'&:hover': { backgroundColor: 'var(--n_tnSearchFieldBackground)' },
		'&:active': { backgroundColor: 'var(--n_tnSearchFieldBackground)' },
		display: 'var(--n_tnSearchDisplay, none)',
		gridTemplateColumns: 'auto minmax(0, 1fr) auto',
		minWidth: 0,
		'@media (min-width: 30rem)': {
			display: 'var(--n_tnSearchDisplay, grid)',
		},
	},
	containerButton: {
		display: 'flex',
		backgroundColor: 'transparent',
		borderRadius: token('radius.medium'),
		height: '32px',
		maxWidth: '680px',
		minWidth: 0,
		paddingBlock: token('space.0'),
		paddingInline: token('space.0'),
		width: 'var(--n_tnSearchWidth, 32px)',
		color: 'inherit',
		// Put interaction state on the actual button so keyboard activation also
		// paints the pressed state of its presentation spans.
		'--n_tnSearchFieldBackground': token('color.background.input'),
		'--n_tnSearchIconBackground': `var(--ds-top-bar-button-background, ${token('color.background.neutral.subtle')})`,
		// Compiled's pseudo-selector type omits CSS custom properties; these values are static.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		'&:hover': {
			'--n_tnSearchFieldBackground': token('color.background.input.hovered'),
			'--n_tnSearchIconBackground': `var(--ds-top-bar-button-background-hovered, ${token('color.background.neutral.subtle.hovered')})`,
		} as React.CSSProperties,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Same static custom properties as hover.
		'&:active': {
			'--n_tnSearchFieldBackground': token('color.background.input.pressed'),
			'--n_tnSearchIconBackground': `var(--ds-top-bar-button-background-pressed, ${token('color.background.neutral.subtle.pressed')})`,
		} as React.CSSProperties,
		// Outside TopNav, retain the viewport fallback without replacing the button.
		'@media (min-width: 30rem)': {
			width: 'var(--n_tnSearchWidth, 100%)',
		},
	},
	containerIcon: {
		display: 'var(--n_tnSearchIconDisplay, flex)',
		alignItems: 'center',
		justifyContent: 'center',
		width: '32px',
		height: '32px',
		borderRadius: token('radius.medium'),
		color: token('color.icon'),
		backgroundColor: 'var(--n_tnSearchIconBackground)',
		transition: token('motion.button.hovered'),
		'&:hover': {
			backgroundColor: 'var(--n_tnSearchIconBackground)',
		},
		'&:active': {
			backgroundColor: 'var(--n_tnSearchIconBackground)',
			transition: token('motion.button.pressed'),
		},
		'@media (min-width: 30rem)': {
			display: 'var(--n_tnSearchIconDisplay, none)',
		},
	},
	customThemeIcon: { color: 'inherit' },
});

type SearchProps = {
	/**
	 * Provide an accessible label, often used by screen readers.
	 */
	label: React.ReactNode;
	/**
	 * The icon component to render before the search input.
	 */
	iconBefore?: React.ComponentType<NewIconProps & { spacing: 'spacious' }>;
	/**
	 * The component to render after the search input.
	 */
	elemAfter?: React.ReactNode;
	/**
	 * Handler called on click.
	 */
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	/**
	 * An optional name used to identify events for [React UFO (Unified Frontend Observability) press interactions](https://developer.atlassian.com/platform/ufo/react-ufo/react-ufo/getting-started/#quick-start--press-interactions). For more information, see [React UFO integration into Design System components](https://go.atlassian.com/react-ufo-dst-integration).
	 */
	interactionName?: string;
	'aria-haspopup'?: React.AriaAttributes['aria-haspopup'];
};

/**
 * Keep a single focus target through CSS presentation changes, including before hydration.
 * Only the visual contents switch; no measurement or focus handoff is needed.
 */
function ContainerSearch({
	label,
	onClick,
	iconBefore: IconBefore = SearchIcon,
	elemAfter,
	interactionName,
	'aria-haspopup': ariaHaspopup,
}: SearchProps): JSX.Element {
	const hasCustomTheme = useHasCustomTheme();
	const renderButton = (triggerProps?: TriggerProps) => (
		<Pressable
			ref={triggerProps?.ref}
			onFocus={triggerProps?.onFocus}
			onBlur={triggerProps?.onBlur}
			onMouseOver={triggerProps?.onMouseOver}
			onMouseOut={triggerProps?.onMouseOut}
			onMouseMove={triggerProps?.onMouseMove}
			onMouseDown={triggerProps?.onMouseDown}
			onClick={(event) => {
				onClick?.(event);
				triggerProps?.onClick?.(event);
			}}
			// @ts-expect-error -- The responsive width uses an inherited CSS variable outside bounded xcss values.
			// Styles are co-located above; only the Pressable xcss type is imported.
			// eslint-disable-next-line @compiled/no-suppress-xcss
			xcss={cx(containerStyles.containerButton) as PressableProps['xcss']}
			interactionName={interactionName}
			aria-haspopup={ariaHaspopup}
		>
			<span
				css={[
					styles.root,
					containerStyles.container,
					styles.containerBorder,
					fg('platform-dst-tokens-finesse') && styles.containerBorderFinesse,
				]}
			>
				<span css={styles.iconBefore}>
					<IconBefore color={token('color.icon.subtle')} spacing="spacious" label="" />
				</span>
				<span css={[styles.buttonText, styles.containerText]}>
					<Text color="color.text.subtlest">{label}</Text>
				</span>
				{elemAfter && <span css={styles.elemAfter}>{elemAfter}</span>}
			</span>
			<span
				css={[containerStyles.containerIcon, hasCustomTheme && containerStyles.customThemeIcon]}
			>
				<SearchIcon color="currentColor" label="" />
				<VisuallyHidden>{label}</VisuallyHidden>
			</span>
		</Pressable>
	);
	// Preserve the custom-theme label tooltip on the stable trigger.
	// As with IconButton, omit aria-describedby to avoid announcing the label twice.
	return hasCustomTheme ? <Tooltip content={label}>{renderButton}</Tooltip> : renderButton();
}

const ViewportSearch = ({
	label,
	onClick,
	iconBefore: IconBefore = SearchIcon,
	elemAfter,
	interactionName,
	'aria-haspopup': ariaHaspopup,
}: SearchProps) => {
	const iconButton = (
		<IconButton
			label={label}
			appearance="subtle"
			icon={SearchIcon}
			onClick={onClick}
			interactionName={interactionName}
			aria-haspopup={ariaHaspopup}
		/>
	);
	return (
		<Fragment>
			<Pressable
				style={{
					// To win the specificity war against Emotion we move this into inline styles
					// When Emotion has been stripped from the Design System move this to Compiled.
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					cursor: 'text',
					border: `${token('border.width')} solid ${
						fg('platform-dst-tokens-finesse')
							? token('color.border.input.search')
							: token('color.border.input')
					}`,
				}}
				onClick={onClick}
				xcss={cx(styles.root, styles.viewport)}
				interactionName={interactionName}
				aria-haspopup={ariaHaspopup}
			>
				<span css={styles.iconBefore}>
					<IconBefore color={token('color.icon.subtle')} spacing="spacious" label="" />
				</span>
				<div css={styles.buttonText}>
					<Text color="color.text.subtlest">{label}</Text>
				</div>
				{elemAfter && <span css={styles.elemAfter}>{elemAfter}</span>}
			</Pressable>
			<Show below="xs">{iconButton}</Show>
		</Fragment>
	);
};

/**
 * __Search__
 *
 * The search element for the top navigation.
 */
export const Search: (props: SearchProps) => JSX.Element = ({
	label,
	onClick,
	iconBefore,
	elemAfter,
	interactionName,
	'aria-haspopup': ariaHaspopup,
}) => {
	const Component = fg('platform-dst-chat-panel-layout') ? ContainerSearch : ViewportSearch;
	return (
		<Component
			label={label}
			onClick={onClick}
			iconBefore={iconBefore}
			elemAfter={elemAfter}
			interactionName={interactionName}
			aria-haspopup={ariaHaspopup}
		/>
	);
};

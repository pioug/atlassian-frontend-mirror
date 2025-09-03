/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useContext } from 'react';

import { ClassNames, cssMap, jsx } from '@compiled/react';
import { ax } from '@compiled/react/runtime';

import { fg } from '@atlaskit/platform-feature-flags';
import { Inline, type InlineProps } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { MenuItemPrimitiveProps, RenderFunction } from '../../types';

import {
	SELECTION_STYLE_CONTEXT_DO_NOT_USE,
	SpacingContext,
	type SpacingMode,
} from './menu-context';

const renderTitle: RenderFunction = (Component, props) => (
	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
	<Component {...props} />
);

const styles = cssMap({
	root: {
		position: 'relative',
		display: 'flex',
		boxSizing: 'border-box',
		width: '100%',
		minHeight: 40,
		marginTop: token('space.0', '0px'),
		marginRight: token('space.0', '0px'),
		marginBottom: token('space.0', '0px'),
		marginLeft: token('space.0', '0px'),
		alignItems: 'center',
		border: 0,
		outline: 0,
		textDecoration: 'none',
		userSelect: 'none',
		cursor: 'pointer',
		'&:hover': {
			textDecoration: 'none',
		},
		'&:focus, &:focus-visible': {
			outlineColor: token('color.border.focused', '#2684FF'),
			// @ts-ignore
			outlineOffset: `calc(0px - ${token('border.width.outline')})`,
			outlineStyle: 'solid',
			// @ts-ignore
			outlineWidth: token('border.width.outline'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:focus:not(:focus-visible)': {
			outline: 'none',
		},
		'@media screen and (forced-colors: active), screen and (-ms-high-contrast: active)': {
			'&:focus-visible': {
				outlineStyle: 'solid',
				outlineWidth: 1,
			},
		},
	},
	beforeAfterElement: {
		display: 'flex',
		minWidth: 24,
		minHeight: 24,
		alignItems: 'center',
		justifyContent: 'center',
		flexShrink: 0,
	},
	content: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		flexGrow: 1,
		outline: 'none',
		overflow: 'hidden',
		textAlign: 'left',
	},
	truncate: {
		display: 'block',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
	title: {
		font: token('font.body'),
	},
	wordBreak: {
		wordBreak: 'break-word',
	},
	description: {
		color: token('color.text.subtlest', '#6B778C'),
		font: token('font.body.UNSAFE_small'),
	},
	disabledDescription: {
		color: token('color.text.disabled', '#6B778C'),
	},
	unselected: {
		backgroundColor: token('color.background.neutral.subtle', 'transparent'),
		color: 'currentColor',
		'&:visited': {
			color: 'currentColor',
		},
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered', '#F4F5F7'),
			color: 'currentColor',
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.hovered', '#F4F5F7'),
			color: 'currentColor',
		},
	},
	disabled: {
		cursor: 'not-allowed',
		backgroundColor: token('color.background.neutral.subtle', 'transparent'),
		color: token('color.text.disabled', '#6B778C'),
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle', 'transparent'),
			color: token('color.text.disabled', '#6B778C'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle', 'transparent'),
			color: token('color.text.disabled', '#6B778C'),
		},
	},
	selectedBorder: {
		'&::before': {
			width: 2,
			position: 'absolute',
			backgroundColor: token('color.border.selected', 'transparent'),
			content: '""',
			insetBlockEnd: token('space.0', '0px'),
			insetBlockStart: token('space.0', '0px'),
			insetInlineStart: token('space.0', '0px'),
		},
	},
	selectedNotch: {
		'&::before': {
			width: 4,
			position: 'absolute',
			backgroundColor: token('color.border.selected', 'transparent'),
			borderRadius: `0 ${token('radius.small', '4px')} ${token('radius.small', '4px')} 0`,
			content: '""',
			insetBlockEnd: token('space.150', '12px'),
			insetBlockStart: token('space.150', '12px'),
			insetInlineStart: token('space.0', '0px'),
		},
	},
	selected: {
		backgroundColor: token('color.background.selected', '#F4F5F7'),
		// Fallback set as babel plugin inserts one otherwise
		color: token('color.text.selected', 'currentColor'),
		'&:visited': {
			color: token('color.text.selected', 'currentColor'),
		},
		'&:hover': {
			backgroundColor: token('color.background.selected.hovered', '#F4F5F7'),
			color: token('color.text.accent.blue', 'currentColor'),
		},
		'&:active': {
			backgroundColor: token('color.background.selected.pressed', '#EBECF0'),
			color: token('color.text.selected', 'currentColor'),
		},
	},
	selectedOld: {
		'&:hover': {
			color: token('color.text.selected', 'currentColor'),
		},
	},
});

const spacingMapStyles = cssMap({
	cozy: {
		paddingBlock: token('space.100', '8px'),
		paddingInline: token('space.200', '16px'),
	},
	compact: {
		minHeight: 32,
		paddingBlock: token('space.050', '4px'),
		paddingInline: token('space.150', '12px'),
	},
});

const gapMap: Record<SpacingMode, InlineProps['space']> = {
	compact: 'space.100',
	cozy: 'space.150',
};

/**
 * __Menu item primitive__
 *
 * Menu item primitive contains all the styles for menu items,
 * including support for selected, disabled, and interaction states.
 *
 * Using children as function prop you wire up this to your own host element.
 *
 * ```jsx
 * <MenuItemPrimitive>
 *   {({ children, ...props }) => <button {...props}>{children}</button>}
 * </MenuItemPrimitive>
 * ```
 */
const MenuItemPrimitive = ({
	children,
	title,
	description,
	iconAfter,
	iconBefore,
	className: UNSAFE_externalClassName,
	shouldTitleWrap = false,
	shouldDescriptionWrap = false,
	isDisabled = false,
	isSelected = false,
	isTitleHeading = false,
	testId,
}: MenuItemPrimitiveProps) => {
	const spacing = useContext(SpacingContext);
	const selectionStyle = useContext(SELECTION_STYLE_CONTEXT_DO_NOT_USE);
	const UNSAFE_className = UNSAFE_externalClassName;

	return (
		<ClassNames>
			{({ css: cn }: any) => {
				return children({
					className: ax([
						cn(
							styles.root,
							spacingMapStyles[spacing],
							!isDisabled && !isSelected && styles.unselected,
							!isDisabled && isSelected && styles.selected,
							!fg('platform_fix_a11y_selected_and_hovered_state_color') &&
								!isDisabled &&
								isSelected &&
								styles.selectedOld,
							!isDisabled && isSelected && selectionStyle === 'border' && styles.selectedBorder,
							!isDisabled && isSelected && selectionStyle === 'notch' && styles.selectedNotch,
							isDisabled && styles.disabled,
						),
						UNSAFE_className,
					]),
					children: (
						<Inline
							as="span"
							spread="space-between"
							alignBlock="center"
							space={gapMap[spacing]}
							grow="fill"
							testId={testId && `${testId}--container`}
						>
							{iconBefore && (
								<span
									data-item-elem-before
									css={styles.beforeAfterElement}
									data-testid={testId && `${testId}--icon-before`}
								>
									{iconBefore}
								</span>
							)}
							{title && (
								<div css={styles.content}>
									{renderTitle(isTitleHeading ? 'h2' : 'span', {
										children: title,
										className: cn(
											styles.title,
											shouldTitleWrap ? styles.wordBreak : styles.truncate,
										),
										'data-item-title': true,
									})}
									{description && (
										<span
											data-item-description
											css={[
												styles.description,
												isDisabled && styles.disabledDescription,
												shouldDescriptionWrap && styles.wordBreak,
												!shouldDescriptionWrap && styles.truncate,
											]}
										>
											{description}
										</span>
									)}
								</div>
							)}
							{iconAfter && (
								<span
									data-item-elem-after
									css={styles.beforeAfterElement}
									data-testid={testId && `${testId}--icon-after`}
								>
									{iconAfter}
								</span>
							)}
						</Inline>
					),
				});
			}}
		</ClassNames>
	);
};

export default MenuItemPrimitive;

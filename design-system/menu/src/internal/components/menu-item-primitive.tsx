/** @jsx jsx */
import { useContext } from 'react';

import { ClassNames, css, jsx } from '@emotion/react';

import { propDeprecationWarning } from '@atlaskit/ds-lib/deprecation-warning';
import FocusRing from '@atlaskit/focus-ring';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { Inline, type InlineProps, Stack, xcss } from '@atlaskit/primitives';
import { N20, N200, N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import type { MenuItemPrimitiveProps, RenderFunction } from '../../types';

import {
	SELECTION_STYLE_CONTEXT_DO_NOT_USE,
	SpacingContext,
	type SpacingMode,
} from './menu-context';

const defaultRender: RenderFunction = (Component, props) => (
	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
	<Component {...props} />
);

const beforeAfterElementStyles = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	flexShrink: 0,
});

const contentStyles = xcss({
	outline: 'none',
	overflow: 'hidden',
	textAlign: 'left',
});

const baseContentStyles = xcss({
	lineHeight: token('font.lineHeight.100', '16px'),
});

const truncateStyles = css({
	display: 'block',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

const titleStyles = css({
	font: token('font.body'),
});

const wordBreakStyles = css({
	wordBreak: 'break-word',
});

const descriptionStyles = css({
	color: token('color.text.subtlest', N200),
});

const baseDescriptionStyles = css({
	fontSize: token('font.size.075', '12px'),
	marginBlockStart: token('space.050', '4px'),
});

const tokenizedDescriptionStyles = css({
	font: token('font.body.UNSAFE_small'),
});

const disabledDescriptionStyles = css({
	color: token('color.text.disabled', N200),
});

const positionRelativeStyles = css({
	position: 'relative',
});

const primitiveStyles = css({
	display: 'flex',
	boxSizing: 'border-box',
	width: '100%',
	minHeight: 40,
	margin: token('space.0', '0px'),
	alignItems: 'center',
	border: 0,
	outline: 0,
	textDecoration: 'none',
	userSelect: 'none',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&::-moz-focus-inner': {
		border: 0,
	},
	'&:hover': {
		textDecoration: 'none',
	},
});

const primitiveBaseStyles = css({
	fontSize: token('font.size.100', '14px'),
});

const spacingMapStyles = {
	cozy: css({
		// 8 * 2 (16) + icon (24) === 40
		paddingBlock: token('space.100', '8px'),
		paddingInline: token('space.200', '16px'),
	}),
	compact: css({
		minHeight: 32,
		// 4 * 2 (8) + icon (24) === 32
		paddingBlock: token('space.050', '4px'),
		paddingInline: token('space.150', '12px'),
	}),
} as const;

const interactiveStyles = css({
	cursor: 'pointer',
});

const unselectedStyles = css({
	backgroundColor: token('color.background.neutral.subtle', 'transparent'),
	color: 'currentColor',
	'&:visited': {
		color: 'currentColor',
	},
	'&:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered', N20),
		color: 'currentColor',
	},
	'&:active': {
		backgroundColor: token('color.background.neutral.subtle.pressed', N30),
		boxShadow: 'none',
		color: 'currentColor',
	},
});

const disabledStyles = css({
	cursor: 'not-allowed',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&, :hover, :active': {
		backgroundColor: token('color.background.neutral.subtle', 'transparent'),
		color: token('color.text.disabled', N200),
	},
});

const selectedBorderStyles = css({
	'&::before': {
		width: 2,
		position: 'absolute',
		background: token('color.border.selected', 'transparent'),
		content: '""',
		insetBlockEnd: 0,
		insetBlockStart: 0,
		insetInlineStart: 0,
	},
});

const selectedNotchStyles = css({
	'&::before': {
		width: 4,
		position: 'absolute',
		background: token('color.border.selected', 'transparent'),
		borderRadius: `0 ${token('border.radius', '4px')} ${token('border.radius', '4px')} 0`,
		content: '""',
		insetBlockEnd: token('space.150', '12px'),
		insetBlockStart: token('space.150', '12px'),
		insetInlineStart: 0,
	},
});

const selectedStyles = css({
	backgroundColor: token('color.background.selected', N20),
	// Fallback set as babel plugin inserts one otherwise
	color: token('color.text.selected', 'currentColor'),
	'&:visited': {
		color: token('color.text.selected', 'currentColor'),
	},
	'&:hover': {
		backgroundColor: token('color.background.selected.hovered', N20),
		color: token('color.text.selected', 'currentColor'),
	},
	'&:active': {
		backgroundColor: token('color.background.selected.pressed', N30),
		color: token('color.text.selected', 'currentColor'),
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
	overrides,
	className: UNSAFE_externalClassName,
	shouldTitleWrap = false,
	shouldDescriptionWrap = false,
	isDisabled = false,
	isSelected = false,
	testId,
}: MenuItemPrimitiveProps) => {
	propDeprecationWarning(
		process.env._PACKAGE_NAME_ || '',
		'overrides',
		overrides !== undefined,
		'', // TODO: Create DAC post when primitives/xcss are available as alternatives
	);

	const spacing = useContext(SpacingContext);
	const selectionStyle = useContext(SELECTION_STYLE_CONTEXT_DO_NOT_USE);
	const renderTitle = (overrides && overrides.Title && overrides.Title.render) || defaultRender;
	const UNSAFE_className = getBooleanFF(
		'platform.design-system-team.unsafe-overrides-killswitch_c8j9m',
	)
		? undefined
		: UNSAFE_externalClassName;

	return (
		<ClassNames>
			{({ css: cn, cx }) => {
				return (
					<FocusRing isInset>
						{children({
							className: cx([
								cn([
									positionRelativeStyles,
									primitiveStyles,
									getBooleanFF('platform.design-system-team.menu-tokenised-typography-styles')
										? undefined
										: primitiveBaseStyles,
									spacingMapStyles[spacing],
									!isDisabled && !isSelected && unselectedStyles,
									!isDisabled &&
										isSelected && [
											selectedStyles,
											[
												selectionStyle === 'border' && selectedBorderStyles,
												selectionStyle === 'notch' && selectedNotchStyles,
											],
										],
									isDisabled ? disabledStyles : interactiveStyles,
								]),
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
											css={beforeAfterElementStyles}
											data-testid={testId && `${testId}--icon-before`}
										>
											{iconBefore}
										</span>
									)}
									{title && (
										<Stack
											alignBlock="center"
											grow="fill"
											xcss={
												getBooleanFF('platform.design-system-team.menu-tokenised-typography-styles')
													? contentStyles
													: [contentStyles, baseContentStyles]
											}
										>
											{renderTitle('span', {
												children: title,
												className: cn(
													getBooleanFF(
														'platform.design-system-team.menu-tokenised-typography-styles',
													)
														? titleStyles
														: undefined,
													shouldTitleWrap ? wordBreakStyles : truncateStyles,
												),
												'data-item-title': true,
											})}
											{description && (
												<span
													data-item-description
													css={[
														descriptionStyles,
														// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
														getBooleanFF(
															'platform.design-system-team.menu-tokenised-typography-styles',
														)
															? tokenizedDescriptionStyles
															: baseDescriptionStyles,
														isDisabled && disabledDescriptionStyles,
														shouldDescriptionWrap ? wordBreakStyles : truncateStyles,
													]}
												>
													{description}
												</span>
											)}
										</Stack>
									)}
									{iconAfter && (
										<span
											data-item-elem-after
											css={beforeAfterElementStyles}
											data-testid={testId && `${testId}--icon-after`}
										>
											{iconAfter}
										</span>
									)}
								</Inline>
							),
						})}
					</FocusRing>
				);
			}}
		</ClassNames>
	);
};

export default MenuItemPrimitive;

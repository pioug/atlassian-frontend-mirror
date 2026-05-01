/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Compiled branch of the `platform_editor_static_css` experiment.
 * Used via `componentWithCondition` in `panel.tsx`.
 *
 * Cleanup: delete this file once the experiment has shipped.
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import { PanelType } from '@atlaskit/adf-schema';
import { akEditorCustomIconSize } from '@atlaskit/editor-shared-styles/consts';
import { hexToEditorBackgroundPaletteColor } from '@atlaskit/editor-palette';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

interface PanelStyledProps {
	backgroundColor?: string;
	'data-panel-type': PanelType;
	hasIcon?: boolean;
}

// New custom icons are a little smaller than predefined icons.
// To fix alignment issues with custom icons, vertical alignment is updated.
const panelEmojiSpriteVerticalAlignment = -(8 * 3 - akEditorCustomIconSize) / 2;
const panelEmojiImageVerticalAlignment = panelEmojiSpriteVerticalAlignment - 1;

const blockNodesVerticalMargin = '0.75rem';
const akEditorTableCellMinWidth = 48;

const panelBaseStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&.ak-editor-panel': {
		borderRadius: token('radius.small', '3px'),
		margin: `${blockNodesVerticalMargin} 0 0`,
		paddingTop: token('space.100'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
		minWidth: `${akEditorTableCellMinWidth}px`,
		display: 'flex',
		position: 'relative',
		alignItems: 'normal',
		wordBreak: 'break-word',
		backgroundColor: token('color.background.accent.blue.subtlest'),
		color: 'inherit',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-panel__icon': {
			flexShrink: 0,
			height: token('space.300'),
			width: token('space.300'),
			boxSizing: 'content-box',
			paddingRight: token('space.100'),
			textAlign: 'center',
			userSelect: 'none',
			MozUserSelect: 'none',
			WebkitUserSelect: 'none',
			MsUserSelect: 'none',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginTop: '0.1em',

			color: token('color.icon.information'),

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'> span': {
				verticalAlign: 'middle',
				display: 'inline-flex',
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.emoji-common-emoji-sprite': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				verticalAlign: `${panelEmojiSpriteVerticalAlignment}px`,
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.emoji-common-emoji-image': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
				verticalAlign: `${panelEmojiImageVerticalAlignment}px`,

				// Vertical align only works for inline-block elements in Firefox
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
				'@-moz-document url-prefix()': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
					img: {
						display: 'inline-block',
					},
				},
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-panel__content': {
			marginTop: token('space.025'),
			marginBottom: token('space.025'),
			marginLeft: 0,
			marginRight: 0,
			flex: '1 0 0',
			minWidth: 0,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&[data-panel-type="note"]': {
			backgroundColor: token('color.background.accent.purple.subtlest'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.ak-editor-panel__icon': { color: token('color.icon.discovery') },
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&[data-panel-type="tip"]': {
			backgroundColor: token('color.background.accent.green.subtlest'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.ak-editor-panel__icon': { color: token('color.icon.success') },
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&[data-panel-type="warning"]': {
			backgroundColor: token('color.background.accent.yellow.subtlest'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.ak-editor-panel__icon': { color: token('color.icon.warning') },
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&[data-panel-type="error"]': {
			backgroundColor: token('color.background.accent.red.subtlest'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.ak-editor-panel__icon': { color: token('color.icon.danger') },
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&[data-panel-type="success"]': {
			backgroundColor: token('color.background.accent.green.subtlest'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.ak-editor-panel__icon': { color: token('color.icon.success') },
		},
	},
});

const panelHasNoIconStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&.ak-editor-panel': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&[data-panel-type="custom"]': {
			paddingLeft: token('space.150'),
			paddingRight: token('space.150'),
		},
	},
});

const panelNestedIconStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&.ak-editor-panel__no-icon': {
		paddingLeft: token('space.150'),
		paddingRight: token('space.150'),
	},
});

const nestedPanelStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.ak-editor-panel__content .ak-editor-panel': {
		border: `${token('border.width')} solid ${token('color.border')}`,
	},
});

const panelCustomBackground = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&.ak-editor-panel': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&[data-panel-type="custom"]': {
			backgroundColor: 'var(--ak-renderer-panel-custom-bg-color)',
		},
	},
});

export const PanelStyledCompiled: { ({ backgroundColor, children, className, hasIcon, ...props }: React.PropsWithChildren<PanelStyledProps & React.HTMLAttributes<HTMLDivElement>>): JSX.Element; displayName: string; } = ({
	backgroundColor,
	children,
	className,
	hasIcon,
	...props
}: React.PropsWithChildren<PanelStyledProps & React.HTMLAttributes<HTMLDivElement>>): JSX.Element => {
	const customBackgroundColor = backgroundColor
		? hexToEditorBackgroundPaletteColor(backgroundColor) || backgroundColor
		: undefined;
	return (
		<div
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- intentional: preserve existing PanelSharedCssClassName.prefix class
			className={className}
			style={
				{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- intentional: custom panel background is dynamic via CSS variable
					'--ak-renderer-panel-custom-bg-color': customBackgroundColor,
				} as React.CSSProperties
			}
			css={[
				panelBaseStyles,
				!hasIcon && panelHasNoIconStyles,
				props['data-panel-type'] === PanelType.CUSTOM && backgroundColor && panelCustomBackground,
				fg('platform_editor_nested_dnd_styles_changes') && panelNestedIconStyles,
				nestedPanelStyles,
			]}
		>
			{children}
		</div>
	);
};

PanelStyledCompiled.displayName = 'PanelStyledCompiled';

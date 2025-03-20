/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import TipIcon from '@atlaskit/icon/glyph/editor/hint';
import { PanelType } from '@atlaskit/adf-schema';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import {
	PanelSharedCssClassName,
	panelSharedStylesWithoutPrefix,
} from '@atlaskit/editor-common/panel';
import { hexToEditorBackgroundPaletteColor } from '@atlaskit/editor-palette';
import EmojiIcon from '@atlaskit/icon/glyph/editor/emoji';
import EmojiItem from './emoji';
import {
	PanelInfoIcon,
	PanelSuccessIcon,
	PanelNoteIcon,
	PanelWarningIcon,
	PanelErrorIcon,
} from '@atlaskit/editor-common/icons';
import { token } from '@atlaskit/tokens';
import { akEditorCustomIconSize } from '@atlaskit/editor-shared-styles/consts';
import { componentWithFG } from '@atlaskit/platform-feature-flags-react';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

interface PanelStyledProps {
	'data-panel-type': PanelType;
	backgroundColor?: string;
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
		borderRadius: token('border.radius', '3px'),
		margin: `${blockNodesVerticalMargin} 0 0`,
		paddingTop: token('space.100', '8px'),
		paddingRight: token('space.200', '16px'),
		paddingBottom: token('space.100', '8px'),
		paddingLeft: token('space.100', '8px'),
		minWidth: `${akEditorTableCellMinWidth}px`,
		display: 'flex',
		position: 'relative',
		alignItems: 'normal',
		wordBreak: 'break-word',
		backgroundColor: token('color.background.accent.blue.subtlest', '#DEEBFF'),
		color: 'inherit',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.ak-editor-panel__icon': {
			flexShrink: 0,
			height: token('space.300', '24px'),
			width: token('space.300', '24px'),
			boxSizing: 'content-box',
			paddingRight: token('space.100', '8px'),
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
			margin: `${token('space.025', '2px')} 0 ${token('space.025', '2px')}`,
			flex: '1 0 0',
			/*
		https://ishadeed.com/article/min-max-css/#setting-min-width-to-zero-with-flexbox
		The default value for min-width is auto, which is computed to zero. When an element is a flex item, the value of min-width doesn’t compute to zero. The minimum size of a flex item is equal to the size of its contents.
		*/
			minWidth: 0,
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&[data-panel-type="note"]': {
			backgroundColor: token('color.background.accent.purple.subtlest', '#EAE6FF'),

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.ak-editor-panel__icon': {
				color: token('color.icon.discovery'),
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		'&[data-panel-type="tip"]': {
			backgroundColor: token('color.background.accent.green.subtlest', '#E3FCEF'),

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.ak-editor-panel__icon': {
				color: token('color.icon.success'),
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		'&[data-panel-type="warning"]': {
			backgroundColor: token('color.background.accent.yellow.subtlest', '#FFFAE6'),

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.ak-editor-panel__icon': {
				color: token('color.icon.warning'),
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		'&[data-panel-type="error"]': {
			backgroundColor: token('color.background.accent.red.subtlest', '#FFEBE6'),

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.ak-editor-panel__icon': {
				color: token('color.icon.danger'),
			},
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		'&[data-panel-type="success"]': {
			backgroundColor: token('color.background.accent.green.subtlest', '#E3FCEF'),

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.ak-editor-panel__icon': {
				color: token('color.icon.success'),
			},
		},
	},
});

const panelHasNoIconStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	'&.ak-editor-panel': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&[data-panel-type="custom"]': {
			paddingLeft: token('space.150', '12px'),
			paddingRight: token('space.150', '12px'),
		},
	},
});

const panelNestedIconStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&.ak-editor-panel__no-icon': {
		paddingLeft: token('space.150', '12px'),
		paddingRight: token('space.150', '12px'),
	},
});

const panelCustomBackground = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	'&.ak-editor-panel': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&[data-panel-type="custom"]': {
			backgroundColor: 'var(--ak-renderer-panel-custom-bg-color)',
		},
	},
});

const PanelStyledOld = ({
	backgroundColor,
	hasIcon,
	...props
}: React.PropsWithChildren<PanelStyledProps & React.HTMLAttributes<HTMLDivElement>>) => {
	// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- nested css mixins are violations
	let styles = css`
		&.${PanelSharedCssClassName.prefix} {
			${panelSharedStylesWithoutPrefix()}

			&[data-panel-type=${PanelType.CUSTOM}] {
				${hasIcon ? '' : 'padding-left: 12px;padding-right: 12px;'}
			}
		}
	`;
	if (props['data-panel-type'] === PanelType.CUSTOM && backgroundColor) {
		// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- nested css mixins are violations
		styles = css`
			&.${PanelSharedCssClassName.prefix} {
				${panelSharedStylesWithoutPrefix()}
			}

			&[data-panel-type=${PanelType.CUSTOM}] {
				background-color: ${hexToEditorBackgroundPaletteColor(backgroundColor) || backgroundColor};
				${hasIcon ? '' : 'padding-left: 12px;padding-right: 12px;'}
			}
		`;
	}

	return (
		// eslint-disable-next-line
		// Ignored via go/ees005
		// eslint-disable-next-line react/jsx-props-no-spreading, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		<div css={styles} {...props}>
			{props.children}
		</div>
	);
};

const PanelStyledNew = ({
	backgroundColor,
	hasIcon,
	...props
}: React.PropsWithChildren<PanelStyledProps & React.HTMLAttributes<HTMLDivElement>>) => {
	const customBackgroundColor = backgroundColor
		? hexToEditorBackgroundPaletteColor(backgroundColor)
		: backgroundColor;
	return (
		<div
			style={
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				{ '--ak-renderer-panel-custom-bg-color': customBackgroundColor } as React.CSSProperties
			}
			css={[
				panelBaseStyles,
				!hasIcon && panelHasNoIconStyles,
				props['data-panel-type'] === PanelType.CUSTOM && backgroundColor && panelCustomBackground,
				editorExperiment('nested-dnd', true) && panelNestedIconStyles,
			]}
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
		>
			{props.children}
		</div>
	);
};

const PanelStyled = componentWithFG(
	'platform_editor_emotion_refactor_renderer',
	PanelStyledNew,
	PanelStyledOld,
);

PanelStyled.displayName = 'PanelStyled';

export interface Props {
	children?: React.ReactNode;
	providers?: ProviderFactory;
	panelType: PanelType;
	allowCustomPanels?: boolean;
	panelIcon?: string;
	panelIconId?: string;
	panelIconText?: string;
	panelColor?: string;
}

const panelIcons: {
	[key in PanelType]: React.ComponentType<React.PropsWithChildren<{ label: string }>>;
} = {
	info: PanelInfoIcon,
	success: PanelSuccessIcon,
	note: PanelNoteIcon,
	tip: TipIcon,
	warning: PanelWarningIcon,
	error: PanelErrorIcon,
	custom: EmojiIcon,
};

const Panel = (props: Props) => {
	const {
		allowCustomPanels,
		panelType: type,
		panelColor,
		panelIcon,
		panelIconId,
		panelIconText,
		providers,
		children,
	} = props;
	// only allow custom panel type if flag is set
	// otherwise fall back to info if custom panel is given
	const panelType = allowCustomPanels ? type : type === PanelType.CUSTOM ? PanelType.INFO : type;

	const getIcon = () => {
		if (panelType === PanelType.CUSTOM) {
			if (panelIcon && providers) {
				return (
					<EmojiItem
						id={panelIconId}
						text={panelIconText}
						shortName={panelIcon}
						providers={providers}
					/>
				);
			}

			return null;
		}

		const Icon = panelIcons[panelType];
		return <Icon label={`${panelType} panel`} />;
	};

	const icon = getIcon();

	const renderIcon = () => {
		if (icon) {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			return <div className={PanelSharedCssClassName.icon}>{icon}</div>;
		}
	};

	return (
		<PanelStyled
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={PanelSharedCssClassName.prefix}
			data-panel-type={panelType}
			data-panel-color={panelColor}
			data-panel-icon={panelIcon}
			data-panel-icon-id={panelIconId}
			data-panel-icon-text={panelIconText}
			backgroundColor={panelColor}
			hasIcon={Boolean(icon)}
		>
			{renderIcon()}
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766  */}
			<div className={PanelSharedCssClassName.content}>{children}</div>
		</PanelStyled>
	);
};

export default Panel;

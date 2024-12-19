/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment } from 'react';
import type { CSSProperties } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import classnames from 'classnames';
import { defineMessages, FormattedMessage } from 'react-intl-next';

import CustomizeIcon from '@atlaskit/icon/core/customize';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

const containerStyles = css({
	textAlign: 'left',
	zIndex: 1,
	position: 'relative',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.bodied': {
		marginTop: token('space.300', '24px'),
	},
});

const sharedLabelStyles = css({
	opacity: 0,
	lineHeight: 1,
	display: 'inline-flex',
	justifyContent: 'left',
	position: 'absolute',
	width: 'max-content',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
	top: '-19px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.show-label': {
		cursor: 'pointer',
		opacity: 1,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.nested': {
		// Need to add indent if the node is nested since we removed previous indentation styles to make it fit properly
		// in the nested component
		marginLeft: token('space.150', '12px'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.inline': {
		// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
		top: '-18px',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.bodied-background': {
		background: token('elevation.surface'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.bodied-border': {
		boxShadow: `0 0 0 1px ${token('color.border')}`,
	},
});

const buttonLabelStyles = css({
	minHeight: token('space.300', '24px'),
	alignItems: 'center',
	borderRadius: token('border.radius', '3px'),
	paddingLeft: token('space.100', '8px'),
	paddingRight: token('space.100', '8px'),
	color: token('color.text.subtle'),
	backgroundColor: token('color.background.accent.gray.subtlest'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.remove-left-margin': {
		marginLeft: token('space.negative.150', '-12px'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.remove-nested-left-margin': {
		marginLeft: 0,
	},
	font: token('font.body'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.with-bodied-macro-live-page-styles': {
		backgroundColor: token('color.background.neutral.subtle'),
		boxShadow: `0 0 0 1px ${token('color.border')}`,
	},
});

const spacerStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
	height: '10px',
});

const textStyles = css({
	// cannot use font.body or editor custom font.body here as line-height need to be 1 (from sharedLabelStyles)
	// cannot use space token as there is not token for 14px
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	fontSize: '14px',
	fontWeight: token('font.weight.regular', '400'),
	padding: `${token('space.025', '2px')} ${token('space.050', '4px')}`,
});

const originalLabelStyles = css({
	background: token('color.background.accent.gray.subtle.pressed'),
	borderRadius: `${token('border.radius', '3px')} ${token('border.radius', '3px')} 0 0`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.show-label': {
		color: token('color.text.subtle'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.inline': {
		// need to add margin since we don't get it for free like block ones via the padding to make it flush with editor elements
		marginLeft: token('space.150', '12px'),
	},
});

const iconStyles = css({
	marginLeft: token('space.075', '6px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.hide-icon': {
		display: 'none',
	},
});

const i18n = defineMessages({
	configure: {
		id: 'editor-common-extensibility.macro.button.configure',
		defaultMessage: 'Configure {macroName}',
		description: 'Text in tooltip that tells user they can configure the specific macro.',
	},
});

export const getShouldShowBodiedMacroLabel = (
	isBodiedMacro: boolean | undefined,
	isNodeHovered: boolean | undefined,
	showLivePagesBodiedMacrosRendererView: boolean | undefined,
	showBodiedExtensionRendererView: boolean | undefined,
	showUpdatedLivePages1PBodiedExtensionUI: boolean | undefined,
) => {
	// Bodied macros show the label by default except for the new live pages 1P bodied macro experience where we only show it on hover
	if (!isBodiedMacro || showUpdatedLivePages1PBodiedExtensionUI) {
		return isNodeHovered;
	}
	if (!showLivePagesBodiedMacrosRendererView) {
		return true;
	} // Keep showing labels as usual for default experience for bodied macros
	return !!(isNodeHovered && !showBodiedExtensionRendererView); // For the new live pages bodied macro experience, we only show the label on hover in the "edit" view
};

type ExtensionLabelProps = {
	text: string;
	extensionName: string;
	isNodeHovered?: boolean;
	isNodeNested?: boolean;
	customContainerStyles?: CSSProperties;
	setIsNodeHovered?: (isHovered: boolean) => void;
	isBodiedMacro?: boolean;
	showMacroButtonUpdates?: boolean;
	showLivePagesBodiedMacrosRendererView?: boolean;
	showUpdatedLivePages1PBodiedExtensionUI?: boolean;
	showBodiedExtensionRendererView?: boolean;
};

export const ExtensionLabel = ({
	text,
	extensionName,
	isNodeHovered,
	customContainerStyles,
	isNodeNested,
	setIsNodeHovered,
	isBodiedMacro,
	showMacroButtonUpdates,
	showLivePagesBodiedMacrosRendererView,
	showUpdatedLivePages1PBodiedExtensionUI,
	showBodiedExtensionRendererView,
}: ExtensionLabelProps) => {
	const isInlineExtension = extensionName === 'inlineExtension';
	const showDefaultBodiedStyles = isBodiedMacro && !isNodeHovered;
	const shouldShowBodiedMacroLabel = getShouldShowBodiedMacroLabel(
		isBodiedMacro,
		isNodeHovered,
		showLivePagesBodiedMacrosRendererView,
		showBodiedExtensionRendererView,
		showUpdatedLivePages1PBodiedExtensionUI,
	);

	const containerClassNames = classnames({
		bodied: isBodiedMacro,
	});

	const sharedLabelClassNames = classnames('extension-label', {
		nested: isNodeNested,
		inline: isInlineExtension,
		bodied: isBodiedMacro,
		'bodied-border': showDefaultBodiedStyles,
		'bodied-background': showDefaultBodiedStyles,
		'show-label': shouldShowBodiedMacroLabel,
		'with-bodied-macro-live-page-styles': isBodiedMacro && showLivePagesBodiedMacrosRendererView,
		'always-hide-label': isBodiedMacro && showBodiedExtensionRendererView, // Need this separate class since we don't ever want to show the label during view mode
	});

	const newButtonLabelClassNames = classnames({
		// For new button design, non-bodied macros should have a flush label. Inline macros don't need this since they never had the margin-left applied.
		'remove-left-margin': !isBodiedMacro && !isInlineExtension && !isNodeNested,
		'remove-nested-left-margin': isNodeNested && !isBodiedMacro && !isInlineExtension,
	});

	const iconClassNames = classnames({
		'hide-icon': isBodiedMacro && !isNodeHovered,
	});

	return (
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			css={containerStyles}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={containerClassNames}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={customContainerStyles}
			// eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
			onMouseOver={() => {
				setIsNodeHovered?.(true);
			}}
			onMouseLeave={() => {
				setIsNodeHovered?.(false);
			}}
			data-testid="new-lozenge-container"
		>
			{showMacroButtonUpdates ? (
				<Fragment>
					<Tooltip
						content={<FormattedMessage {...i18n.configure} values={{ macroName: text }} />}
						position="top"
					>
						{(tooltipProps) => (
							<span
								data-testid="new-lozenge-button"
								{...tooltipProps}
								css={[sharedLabelStyles, buttonLabelStyles]}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
								className={`${sharedLabelClassNames} ${newButtonLabelClassNames}`}
							>
								{text}
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
								<span css={iconStyles} className={iconClassNames} data-testid="config-icon">
									<CustomizeIcon label="" />
								</span>
							</span>
						)}
					</Tooltip>
					{/* This is needed since this creates the gap between the macro and button, also provides a seamless transition when mousing over the gap. */}
					<div css={spacerStyles} />
				</Fragment>
			) : (
				<span
					data-testid="new-lozenge"
					css={[sharedLabelStyles, originalLabelStyles]}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={sharedLabelClassNames}
				>
					<span css={textStyles}>{text}</span>
				</span>
			)}
		</div>
	);
};

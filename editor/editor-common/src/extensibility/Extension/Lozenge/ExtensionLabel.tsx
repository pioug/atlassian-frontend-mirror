/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { CSSProperties } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import classnames from 'classnames';
import { defineMessages, FormattedMessage } from 'react-intl-next';

import CustomizeIcon from '@atlaskit/icon/core/customize';
import { Box, xcss } from '@atlaskit/primitives';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { type ExtensionsPluginInjectionAPI } from '../../types';

const containerStyles = css({
	textAlign: 'left',
	zIndex: 1,
	position: 'relative',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.bodied': {
		marginTop: token('space.300', '24px'),
	},
});

const labelStyles = css({
	opacity: 0,
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 1,
	display: 'inline-flex',
	justifyContent: 'left',
	position: 'absolute',
	width: 'max-content',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
	top: '-28px', // When updating this value, make sure to also update the value in EditToggle.tsx, buttonContainerStyles
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
		top: '-27px',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.bodied-background': {
		background: token('elevation.surface'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.bodied-border': {
		boxShadow: `0 0 0 1px ${token('color.border')}`,
	},
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
		backgroundColor: token('color.background.input'),
		boxShadow: `0 0 0 1px ${token('color.border')}`,
	},
});

const spacerStyles = xcss({
	height: 'space.200',
	position: 'absolute',
	width: '100%',
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
	showUpdatedLivePages1PBodiedExtensionUI?: boolean;
	showLivePagesBodiedMacrosRendererView?: boolean;
	showBodiedExtensionRendererView?: boolean;
	pluginInjectionApi?: ExtensionsPluginInjectionAPI;
};

export const ExtensionLabel = ({
	text,
	extensionName,
	isNodeHovered,
	customContainerStyles,
	isNodeNested,
	setIsNodeHovered,
	isBodiedMacro,
	showUpdatedLivePages1PBodiedExtensionUI,
	showLivePagesBodiedMacrosRendererView,
	showBodiedExtensionRendererView,
	pluginInjectionApi,
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

	const labelClassNames = classnames('extension-label', {
		nested: isNodeNested,
		inline: isInlineExtension,
		bodied: isBodiedMacro,
		'bodied-border': showDefaultBodiedStyles,
		'bodied-background': showDefaultBodiedStyles,
		'show-label': shouldShowBodiedMacroLabel,
		'with-bodied-macro-live-page-styles': isBodiedMacro && showLivePagesBodiedMacrosRendererView,
		'always-hide-label': isBodiedMacro && showBodiedExtensionRendererView, // Need this separate class since we don't ever want to show the label during view mode
		'remove-left-margin': !isBodiedMacro && !isInlineExtension && !isNodeNested,
		'remove-nested-left-margin': isNodeNested && !isBodiedMacro && !isInlineExtension,
	});

	const iconClassNames = classnames({
		'hide-icon': isBodiedMacro && !isNodeHovered,
	});

	return (
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
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
			onClick={() => {
				if (
					editorExperiment('live_pages_graceful_edit', 'text-click-delayed') ||
					editorExperiment('live_pages_graceful_edit', 'text-click-no-delay')
				) {
					pluginInjectionApi?.core?.actions?.execute(
						// Extensions are not yet using the new plugin architecture, and the use of the pluginInjectionApi
						// is not type safe in editor-common.
						// @ts-ignore
						pluginInjectionApi?.editorViewMode?.commands.updateContentMode({
							type: 'intent-to-edit',
						}),
					);
				}
			}}
			data-testid="new-lozenge-container"
		>
			<Tooltip
				content={
					<FormattedMessage
						// Ignored via go/ees005
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...i18n.configure}
						values={{ macroName: text }}
					/>
				}
				position="top"
			>
				{(tooltipProps) => (
					<span
						data-testid="new-lozenge-button"
						// Ignored via go/ees005
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...tooltipProps}
						css={labelStyles}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						className={labelClassNames}
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
			<Box xcss={spacerStyles} />
		</div>
	);
};

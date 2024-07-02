/** @jsx jsx */
import { Fragment } from 'react';
import type { CSSProperties } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import classnames from 'classnames';
import { defineMessages, useIntl } from 'react-intl-next';

import PreferencesIcon from '@atlaskit/icon/glyph/preferences';
import { N0, N30, N40, N500, N800 } from '@atlaskit/theme/colors';
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
		background: token('elevation.surface', N0),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.bodied-border': {
		boxShadow: `0 0 0 1px ${token('color.border', N30)}`,
	},
});

const buttonLabelStyles = css({
	// Need this exact number since this is size with icon
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
	minHeight: '26px',
	alignItems: 'center',
	borderRadius: token('border.radius', '3px'),
	paddingLeft: token('space.050', '4px'),
	paddingRight: token('space.050', '4px'),
	color: token('color.text.subtle', N800),
	backgroundColor: token('color.background.accent.gray.subtlest', N30),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.remove-left-margin': {
		marginLeft: token('space.negative.150', '-12px'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.remove-nested-left-margin': {
		marginLeft: 0,
	},
});

const spacerStyles = css({
	height: token('space.150', '12px'),
});

const textStyles = css({
	fontSize: '14px',
	fontWeight: 'normal',
	padding: `${token('space.025', '2px')} ${token('space.050', '4px')}`,
});

const originalLabelStyles = css({
	background: token('color.background.accent.gray.subtle.pressed', N40),
	borderRadius: `${token('border.radius', '3px')} ${token('border.radius', '3px')} 0 0`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.show-label': {
		color: token('color.text.subtle', N500),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.inline': {
		// need to add margin since we don't get it for free like block ones via the padding to make it flush with editor elements
		marginLeft: token('space.150', '12px'),
	},
});

const iconStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.hide-icon': {
		display: 'none',
	},
});

const i18n = defineMessages({
	configure: {
		id: 'editor-common-extensibility.macro.button.configure',
		defaultMessage: 'Configure',
		description: 'Text in tooltip that tells user they can configure the specific macro.',
	},
});

type ExtensionLabelProps = {
	text: string;
	extensionName: string;
	isNodeHovered?: boolean;
	isNodeNested?: boolean;
	customContainerStyles?: CSSProperties;
	setIsNodeHovered?: (isHovered: boolean) => void;
	isBodiedMacro?: boolean;
	showMacroButtonUpdates?: boolean;
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
}: ExtensionLabelProps) => {
	const intl = useIntl();
	const tooltipText = `${intl.formatMessage(i18n.configure)} ${text}`;
	const isInlineExtension = extensionName === 'inlineExtension';

	const containerClassNames = classnames({
		bodied: isBodiedMacro,
	});

	const sharedLabelClassNames = classnames('extension-label', {
		nested: isNodeNested,
		inline: isInlineExtension,
		bodied: isBodiedMacro,
		'bodied-border': isBodiedMacro && !isNodeHovered,
		'bodied-background': isBodiedMacro && !isNodeHovered,
		'show-label': isNodeHovered || isBodiedMacro,
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
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			css={containerStyles}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={containerClassNames}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={customContainerStyles}
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
					<Tooltip content={tooltipText} position="top">
						{(tooltipProps) => (
							<span
								data-testid="new-lozenge-button"
								{...tooltipProps}
								css={[sharedLabelStyles, buttonLabelStyles]}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
								className={`${sharedLabelClassNames} ${newButtonLabelClassNames}`}
							>
								{text}
								{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766  */}
								<span css={iconStyles} className={iconClassNames} data-testid="config-icon">
									<PreferencesIcon label="" />
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

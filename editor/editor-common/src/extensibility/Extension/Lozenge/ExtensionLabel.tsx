/** @jsx jsx */
import { useCallback } from 'react';
import type { CSSProperties } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import classnames from 'classnames';

import { N0, N30, N40, N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const labelStyles = css({
	opacity: 0,
	display: 'inline-flex',
	width: 'max-content',
	justifyContent: 'left',
	position: 'absolute',
	// Unfortunately, these need to be these exact numbers - otherwise there will be a noticeable gap/overlap
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
	top: '-19px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.inline': {
		// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
		top: '-18px',
		marginLeft: token('space.150', '12px'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.show-label': {
		cursor: 'pointer',
		background: token('color.background.accent.gray.subtle.pressed', N40),
		color: token('color.text.subtle', N500),
		opacity: 1,
	},
	borderRadius: `${token('border.radius', '3px')} ${token('border.radius', '3px')} 0 0`,
	lineHeight: 1,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.nested': {
		// Need to add indent if the node is nested since we removed previous indentation styles to make it fit properly
		// in the nested component
		marginLeft: token('space.150', '12px'),
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

const textStyles = css({
	fontSize: '14px',
	fontWeight: 'normal',
	padding: `${token('space.025', '2px')} ${token('space.050', '4px')}`,
});

const containerStyles = css({
	textAlign: 'left',
	zIndex: 1,
	position: 'relative',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.bodied': {
		marginTop: token('space.300', '24px'),
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
};

export const ExtensionLabel = ({
	text,
	extensionName,
	isNodeHovered,
	customContainerStyles,
	isNodeNested,
	setIsNodeHovered,
	isBodiedMacro,
}: ExtensionLabelProps) => {
	const containerClassNames = classnames({
		bodied: isBodiedMacro,
	});

	const labelClassNames = classnames('extension-label', {
		nested: isNodeNested,
		inline: extensionName === 'inlineExtension',
		bodied: isBodiedMacro,
		'bodied-border': isBodiedMacro && !isNodeHovered,
		'bodied-background': isBodiedMacro && !isNodeHovered,
		'show-label': isNodeHovered || isBodiedMacro,
	});

	const handleMouseEnter = useCallback(() => {
		// If current node is hovered and the label is hovered,
		// consider the node as hovered so we can display the label for users to click on
		if (isNodeHovered) {
			setIsNodeHovered?.(true);
		}
	}, [isNodeHovered, setIsNodeHovered]);

	const handleMouseLeave = useCallback(() => {
		setIsNodeHovered?.(false);
	}, [setIsNodeHovered]);

	return (
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			css={containerStyles}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={containerClassNames}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={customContainerStyles}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			data-testid="new-lozenge-container"
		>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766  */}
			<span data-testid="new-lozenge" css={labelStyles} className={labelClassNames}>
				<span css={textStyles}>{text}</span>
			</span>
		</div>
	);
};

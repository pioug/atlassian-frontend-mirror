/* eslint-disable @repo/internal/styles/no-exported-styles, @atlaskit/design-system/no-nested-styles */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

import { akEditorSmallZIndex, relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { N20 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const inviteTeamWrapperStyles: SerializedStyles = css({
	background: token('color.background.neutral', N20),
	borderRadius: '50%',
	minWidth: token('space.400', '32px'),
	marginLeft: token('space.negative.050', '-4px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const avatarContainerStyles: SerializedStyles = css({
	marginRight: token('space.100', '8px'),
	display: 'flex',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&& > ul': {
		listStyleType: 'none',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'div:last-child button.invite-to-edit': {
		borderRadius: '50%',
		height: '32px',
		width: '32px',
		padding: token('space.025', '2px'),
	},
});

export const badge = (backgroundColor: string, textColor: string) =>
	css({
		display: 'block',
		position: 'absolute',
		right: token('space.025', '2px'),
		bottom: token('space.025', '2px'),
		width: token('space.150', '12px'),
		height: token('space.150', '12px'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		zIndex: akEditorSmallZIndex,
		// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
		borderRadius: token('radius.small', '3px'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		background: backgroundColor,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		color: textColor,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		fontSize: relativeFontSizeToBase16(9),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 0,
		paddingTop: token('space.075', '6px'),
		textAlign: 'center',
		boxShadow: `0 0 1px ${token('color.border.inverse', '#fff')}`,
		boxSizing: 'border-box',
	});

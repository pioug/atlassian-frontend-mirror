// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const TeamContainer = styled.span<{ error: boolean; selected: boolean }>(
	{
		display: 'inline-flex',
		alignItems: 'baseline',
		paddingLeft: `${token('space.025')}`,
		borderRadius: token('radius.xsmall'),
		cursor: 'pointer',
		userSelect: 'none',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
	({ selected, error }) => {
		if (selected) {
			if (error) {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				return css({
					color: token('color.text.inverse'),
					backgroundColor: token('color.background.danger.bold'),
					textDecoration: 'wavy underline',
					textDecorationThickness: '1px',
					textDecorationSkipInk: 'none',
					textDecorationColor: token('color.text.inverse'),
				});
			} else {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				return css({
					color: token('color.text'),
					backgroundColor: token('color.background.selected'),
					boxShadow: `0 0 0 1px ${token('color.border.selected')}`,
				});
			}
		} else {
			if (error) {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				return css({
					color: token('color.text.subtle'),
					backgroundColor: token('color.background.neutral'),
					textDecoration: 'wavy underline',
					textDecorationThickness: '1px',
					textDecorationSkipInk: 'none',
					textDecorationColor: token('color.text.danger'),
					'&:hover': {
						backgroundColor: token('color.background.neutral.hovered'),
					},
				});
			} else {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				return css({
					color: token('color.text.subtle'),
					backgroundColor: token('color.background.neutral'),
					'&:hover': {
						backgroundColor: token('color.background.neutral.hovered'),
					},
				});
			}
		}
	},
);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const NameContainer = styled.span({
	marginLeft: token('space.075'),
	marginRight: token('space.050'),
	// eslint-disable-next-line -- Ignored via go/DSP-18766
	lineHeight: token('space.250'),
});

/* Override Avatar styles to match design spec */
// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const AvatarWrapper = styled.div({
	height: token('space.200'),
	width: token('space.200'),
	alignSelf: 'center',
});

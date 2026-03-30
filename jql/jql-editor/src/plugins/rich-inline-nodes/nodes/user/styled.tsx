// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const UserContainer = styled.span<{ error: boolean; selected: boolean }>(
	{
		display: 'inline-flex',
		alignItems: 'baseline',
		paddingLeft: `${token('space.025')}`,
		borderRadius: token('radius.xlarge'),
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
	marginRight: token('space.100'),
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: token('space.250'),
});

/* Override Avatar styles to match design spec */
// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const AvatarWrapper = styled.div(
	{
		height: token('space.200'),
		width: token('space.200'),
		alignSelf: 'center',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> div span': {
			margin: token('space.0'),
		},
		// Fix fallback icon alignment by targeting the outer AvatarContent span
		// This contains the icon background and needs to move as a unit
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'> div > span:has(> span)': {
			position: 'relative',
			top: '-2px',
		},
	},
	// Feature-flagged styles for hexagon avatar alignment
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
	() => {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		if (fg('jira_ai_agent_avatar_with_apptype_for_jql')) {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			return css({
				// Fix hexagon avatar alignment by targeting the hexagon focus container
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
				'> div [data-testid="hexagon-focus-container"]': {
					// eslint-disable-next-line @atlaskit/design-system/use-tokens-space -- This design is very particular, and there is not a design token for this
					marginTop: '-3.5px',
				},
			});
		}
		return null;
	},
);

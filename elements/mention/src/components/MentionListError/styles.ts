import styled from '@emotion/styled';
import { token } from '@atlaskit/tokens';
import { borderRadius } from '@atlaskit/theme/constants';
import { N500 } from '@atlaskit/theme/colors';
import { h400 } from '@atlaskit/theme/typography';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const MentionListErrorStyle = styled.div({
	alignItems: 'center',
	display: 'flex',
	justifyContent: 'center',
	flexDirection: 'column',
	backgroundColor: token('elevation.surface.overlay', 'white'),
	color: token('color.text.subtle', N500),
	border: `1px solid ${token('elevation.surface.overlay', '#fff')}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: `${borderRadius()}px`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const GenericErrorVisualStyle = styled.div({
	marginBottom: token('space.100', '8px'),
	marginTop: token('space.400', '32px'),
	width: token('space.1000', '80px'),
});

// TODO: Figure out why the themed css function is causing type errors when passed prop children
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-styled-tagged-template-expression -- Ignored via go/DSP-18766
export const MentionListErrorHeadlineStyle = styled.div`
	${h400()};
	margin-bottom: ${token('space.100', '8px')};
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const MentionListAdviceStyle = styled.div({
	marginBottom: token('space.600', '48px'),
});

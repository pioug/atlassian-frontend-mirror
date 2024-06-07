/** @jsx jsx */

import styled from '@emotion/styled';
import * as colors from '@atlaskit/theme/colors';
import { fontFallback } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const ArticleFeedbackContainer = styled.div({
	position: 'relative',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const ArticleFeedbackText = styled.div({
	font: token('font.heading.xxsmall', fontFallback.heading.xxsmall),
	color: token('color.text.subtlest', colors.N200),
	position: 'relative',
	display: 'inline-block',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const ArticleFeedbackAnswerWrapper = styled.div({
	paddingTop: token('space.200', '16px'),
});

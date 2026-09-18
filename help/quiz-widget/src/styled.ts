/* eslint-disable @atlaskit/ui-styling-standard/use-compiled -- legacy @emotion in quiz-widget; migrate go/DSP-18766 */
/* eslint-disable @atlaskit/ui-styling-standard/no-styled -- legacy @emotion in quiz-widget; migrate go/DSP-18766 */

import type { DetailedHTMLProps, HTMLAttributes } from 'react';

import type { Theme } from '@emotion/react';
import styled, { type StyledComponent } from '@emotion/styled';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const QuizWrapper: StyledComponent<
	{
		as?: React.ElementType;
		theme?: Theme;
	},
	DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
	{}
> = styled.div({
	display: 'flex',
	justifyContent: 'center',
	margin: token('space.250'),
});

/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';
import { token } from '@atlaskit/tokens';

import { R500 } from '@atlaskit/theme/colors';

const imagePlacerErrorWrapperStyles = css({
	backgroundColor: token('color.background.danger.bold', R500),
	color: token('color.text.inverse', 'white'),
	width: '100%',
	height: '100%',
	textAlign: 'center',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingTop: '45%',
});

export const ImagePlacerErrorWrapper = ({ children }: any) => (
	<div css={imagePlacerErrorWrapperStyles}>{children}</div>
);

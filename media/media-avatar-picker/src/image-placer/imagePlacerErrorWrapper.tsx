/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const imagePlacerErrorWrapperStyles = css({
	backgroundColor: token('color.background.danger.bold'),
	color: token('color.text.inverse'),
	width: '100%',
	height: '100%',
	textAlign: 'center',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingTop: '45%',
});

export const ImagePlacerErrorWrapper = ({ children }: any) => (
	<div css={imagePlacerErrorWrapperStyles}>{children}</div>
);

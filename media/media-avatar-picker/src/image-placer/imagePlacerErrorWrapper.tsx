/**@jsx jsx */
import { jsx } from '@emotion/react';
import { imagePlacerErrorWrapperStyles } from './styles';

export const ImagePlacerErrorWrapper = ({ children }: any) => (
	<div css={imagePlacerErrorWrapperStyles}>{children}</div>
);

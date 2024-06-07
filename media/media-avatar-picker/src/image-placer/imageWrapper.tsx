/**@jsx jsx */
import { jsx } from '@emotion/react';
import { imageWrapperStyles } from './styles';

export const ImageWrapper = ({ x, y, width, height, ...props }: any) => (
	<img css={imageWrapperStyles({ x, y, width, height })} {...props} />
);

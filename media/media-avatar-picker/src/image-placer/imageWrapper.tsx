/**@jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { imageWrapperStyles } from './styles';

export const ImageWrapper = ({ x, y, width, height, ...props }: any) => (
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	<img css={imageWrapperStyles({ x, y, width, height })} {...props} />
);

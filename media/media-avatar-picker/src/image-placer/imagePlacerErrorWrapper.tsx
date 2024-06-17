/**@jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { imagePlacerErrorWrapperStyles } from './styles';

export const ImagePlacerErrorWrapper = ({ children }: any) => (
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	<div css={imagePlacerErrorWrapperStyles}>{children}</div>
);

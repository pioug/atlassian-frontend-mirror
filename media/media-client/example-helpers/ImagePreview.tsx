/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- Ignored via go/DSP-18766

import { imagePreviewStyles } from './styles';

interface ImagePreviewProps {
	src: string;
	alt: string;
}

export const ImagePreview = ({ src, alt }: ImagePreviewProps): jsx.JSX.Element => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <img css={imagePreviewStyles} src={src} alt={alt} />;
};

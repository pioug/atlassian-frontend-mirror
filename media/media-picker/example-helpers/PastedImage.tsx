/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766

import { pastedImageStyles } from './pastedImageStyles';

type PastedImageProps = {
	src: string;
	title: string;
	style: PastedImageStyleType;
};

export const PastedImage = ({ src, style, title }: PastedImageProps): React.JSX.Element => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values, @atlassian/a11y/alt-text -- Ignored via go/DSP-18766
	return <img src={src} title={title} css={pastedImageStyles(style)} />;
};
export type PastedImageStyleType = {
	width: number | string;
	height: number | string;
};

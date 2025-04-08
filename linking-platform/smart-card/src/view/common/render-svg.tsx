/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

import Image from '@atlaskit/image';

export type RenderSVGProps = {
	size?: 'xlarge' | 'large' | 'medium';
	alt: string;
};

type RenderSVGInternalProps = RenderSVGProps & {
	src: string;
	srcDark?: string;
	className?: string;
};

const imageSizeStyles = cssMap({
	xlarge: {
		width: '160px',
	},
	large: {
		width: '100px',
	},
	medium: {
		width: '60px',
	},
});

export const RenderSVG = ({ alt, size, src, srcDark }: RenderSVGInternalProps) => {
	return <Image src={src} srcDark={srcDark} alt={alt} css={[size && imageSizeStyles[size]]} />;
};

import React from 'react';

type ImgIconProps = {
	src: string;
	alt: string;
};

const ImgIcon = ({ src, alt }: ImgIconProps) => {
	return (
		<img
			alt={alt}
			src={src}
			height={24}
			width={24}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={{ borderRadius: 3 }}
		/>
	);
};

export default ImgIcon;

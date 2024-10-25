import React from 'react';

type Props = {
	children: React.ReactNode;
};

export const MEDIA_WRAPPER_TAG = 'data-media-vc-wrapper';

export default function MediaWrapper({ children }: Props) {
	return <div {...{ [MEDIA_WRAPPER_TAG]: true }}>{children}</div>;
}

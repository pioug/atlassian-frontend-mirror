import React from 'react';

type Props = {
	children: React.ReactNode;
};

export const MEDIA_WRAPPER_TAG = 'data-media-vc-wrapper';

export const VcMediaWrapperProps: {
	'data-media-vc-wrapper': boolean;
} = { [MEDIA_WRAPPER_TAG]: true };

export default function MediaWrapper({ children }: Props): React.JSX.Element {
	return <div {...VcMediaWrapperProps}>{children}</div>;
}

import React from 'react';

type Props = {
	children: React.ReactNode;
};

export const MEDIA_WRAPPER_TAG = 'data-media-vc-wrapper';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const VcMediaWrapperProps: {
	'data-media-vc-wrapper': boolean;
} = { [MEDIA_WRAPPER_TAG]: true };

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export default function MediaWrapper({ children }: Props): React.JSX.Element {
	return <div {...VcMediaWrapperProps}>{children}</div>;
}

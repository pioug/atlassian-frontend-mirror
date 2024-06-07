import { useFilePreview } from '@atlaskit/media-file-preview';
import React from 'react';
import type { MediaImageInternalProps, MediaImageStatus } from './types';

export const MediaImageBase = ({
	identifier,
	apiConfig = {},
	children,
	ssr,
}: MediaImageInternalProps) => {
	const { width, height, mode, allowAnimated, upscale, 'max-age': maxAge } = apiConfig;
	const dimensions = { width, height };

	const { preview, error, getSsrScriptProps } = useFilePreview({
		identifier,
		dimensions,
		ssr,
		resizeMode: mode,
		allowAnimated,
		upscale,
		maxAge,
	});

	//----------------------------------------------------------------
	// RENDER
	//----------------------------------------------------------------

	let status: MediaImageStatus = 'loading';

	if (preview?.dataURI) {
		status = 'succeeded';
	} else if (error) {
		status = 'error';
	}
	return (
		<>
			{children({
				loading: status === 'loading',
				error: status === 'error',
				data: status === 'succeeded' ? { status, src: preview?.dataURI } : undefined,
			})}
			{getSsrScriptProps && <script {...getSsrScriptProps()} />}
		</>
	);
};

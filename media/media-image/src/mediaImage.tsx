/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag Fragment
 */
import { useMemo, Fragment } from 'react';
import { jsx, css } from '@compiled/react';
import { withMediaClient } from '@atlaskit/media-client-react';
import { useFilePreview } from '@atlaskit/media-file-preview';
import type {
	MediaImageInternalProps,
	MediaImageStatus,
	MediaImageWithMediaClientConfigProps,
} from './types';
import { fg } from '@atlaskit/platform-feature-flags';

const copyDivStyles = css({
	display: 'none',
});

const MediaImageBase = ({ identifier, apiConfig = {}, children, ssr }: MediaImageInternalProps) => {
	const { width, height, mode, allowAnimated, upscale, 'max-age': maxAge } = apiConfig;
	const dimensions = { width, height };

	const { preview, error, copyNodeRef, getSsrScriptProps } = useFilePreview({
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
			{fg('platform_media_cross_client_copy') && <div ref={copyNodeRef} css={copyDivStyles} />}
			{getSsrScriptProps && <script {...getSsrScriptProps()} />}
		</>
	);
};

export const MediaImageWithMediaClient = (props: MediaImageWithMediaClientConfigProps) => {
	const MediaImageComponent = useMemo(() => withMediaClient(MediaImageBase), []);
	return <MediaImageComponent {...props} />;
};

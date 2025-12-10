import React from 'react';
import RendererDemo from './helper/RendererDemo';

export default function Example(): React.JSX.Element {
	return (
		<RendererDemo
			withProviders
			appearance="full-width"
			serializer="react"
			allowHeadingAnchorLinks
			allowWrapCodeBlock
			allowCopyToClipboard
		/>
	);
}

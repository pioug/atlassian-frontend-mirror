import React from 'react';
import RendererDemo from './helper/RendererDemo';

export default function Example(): React.JSX.Element {
	return (
		<RendererDemo
			appearance="full-page"
			serializer="react"
			allowHeadingAnchorLinks
			allowColumnSorting={true}
			allowUgcScrubber={true}
			allowWrapCodeBlock
			allowCopyToClipboard
		/>
	);
}

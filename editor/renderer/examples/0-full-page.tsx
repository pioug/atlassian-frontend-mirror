import React from 'react';

import {
	NORMAL_SEVERITY_THRESHOLD,
	DEGRADED_SEVERITY_THRESHOLD,
} from '@atlaskit/renderer/renderer';

import RendererDemo from './helper/RendererDemo';

export default function Example(): React.JSX.Element {
	return (
		<RendererDemo
			appearance="full-page"
			serializer="react"
			allowCollapsibleHeadings
			allowHeadingAnchorLinks
			allowColumnSorting={true}
			allowCopyToClipboard
			allowWrapCodeBlock
			UNSTABLE_allowTableAlignment
			UNSTABLE_allowTableResizing
			analyticsEventSeverityTracking={{
				enabled: true,
				severityNormalThreshold: NORMAL_SEVERITY_THRESHOLD,
				severityDegradedThreshold: DEGRADED_SEVERITY_THRESHOLD,
			}}
		/>
	);
}

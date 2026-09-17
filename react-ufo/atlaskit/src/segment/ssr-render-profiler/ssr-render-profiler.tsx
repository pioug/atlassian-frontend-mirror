import React from 'react';

import { ProfilerMarker } from './profiler-marker';
import { SsrRenderProfilerInner } from './ssr-render-profiler-inner';

declare const __SERVER__: boolean | undefined;
const isInSSR =
	(typeof __SERVER__ !== 'undefined' && __SERVER__) ||
	(typeof process !== 'undefined' && Boolean(process?.env?.REACT_SSR || false));

const SsrRenderProfiler = (
	props: Parameters<typeof SsrRenderProfilerInner>[0],
): React.JSX.Element => {
	if (isInSSR) {
		return <SsrRenderProfilerInner {...props} />;
	}

	// ensure structure similar to SSR implementation
	return (
		<>
			<ProfilerMarker />
			{props.children}
		</>
	);
};
export default SsrRenderProfiler;

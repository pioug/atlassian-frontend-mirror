import React from 'react';

const AsyncDisabledMentionTooltip: React.LazyExoticComponent<
	({ tooltip, children }: { children: React.ReactNode; tooltip: string }) => React.JSX.Element
> = React.lazy(() =>
	import(
		/* webpackChunkName: "@atlaskit-internal_@atlaskit/mention/disabled-mention-tooltip" */ './main'
	).then((module) => {
		return {
			default: module.DisabledMentionTooltip,
		};
	}),
);

export default AsyncDisabledMentionTooltip;

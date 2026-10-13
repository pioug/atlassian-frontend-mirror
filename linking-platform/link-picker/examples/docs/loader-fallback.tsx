import React from 'react';

import { LoaderFallback } from '@atlaskit/link-picker/loader-fallback';

export default function LoaderFallbackExample(): React.JSX.Element {
	return (
		<section aria-labelledby="loading-picker-heading" aria-busy="true">
			<h2 id="loading-picker-heading">Loading link sources</h2>
			<p role="status">Searching available link sources…</p>
			<LoaderFallback isLoadingPlugins />
		</section>
	);
}

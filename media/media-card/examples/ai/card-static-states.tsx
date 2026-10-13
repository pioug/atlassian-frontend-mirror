import React from 'react';

import { CardError } from '@atlaskit/media-card/cardError';
import { CardLoading } from '@atlaskit/media-card/cardLoading';
import { CardPlaceholder } from '@atlaskit/media-card/cardPlaceholder';

type CardStaticStatesExampleProps = {
	onRetry: () => void;
};

const dimensions = { width: 320, height: 180 };

export default function CardStaticStatesExample({
	onRetry,
}: CardStaticStatesExampleProps): React.JSX.Element {
	return (
		<div>
			<section aria-labelledby="placeholder-label">
				<h2 id="placeholder-label">Preparing attachment preview</h2>
				<CardPlaceholder dimensions={dimensions} />
			</section>
			<section aria-labelledby="loading-label">
				<h2 id="loading-label">Loading quarterly plan.pdf</h2>
				<div role="status">
					<CardLoading dimensions={dimensions} />
					<span>Loading quarterly plan.pdf</span>
				</div>
			</section>
			<section aria-labelledby="error-label">
				<h2 id="error-label">Preview unavailable for quarterly plan.pdf</h2>
				<CardError dimensions={dimensions} />
				<p>The preview could not be loaded. Retry to ask the host application to load it again.</p>
				<button type="button" onClick={onRetry}>
					Retry preview
				</button>
			</section>
		</div>
	);
}

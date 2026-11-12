import React, { useState } from 'react';

import { Resizing } from '@atlaskit/motion/resizing/resizing';
import { token } from '@atlaskit/tokens';

export default function ResizingExample(): JSX.Element {
	const [expanded, setExpanded] = useState(false);

	return (
		<>
			<button type="button" onClick={() => setExpanded((value) => !value)}>
				{expanded ? 'Show less' : 'Show more'}
			</button>
			<Resizing
				dimension="height"
				duration={token('motion.duration.short')}
				easing={token('motion.easing.inout.bold')}
			>
				{({ ref }) => (
					<div ref={ref}>
						<p>Always-visible content.</p>
						{expanded && <p>Additional content revealed by the interaction.</p>}
					</div>
				)}
			</Resizing>
		</>
	);
}

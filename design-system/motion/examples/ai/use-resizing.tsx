import React, { useState } from 'react';

import { useResizing } from '@atlaskit/motion/use-resizing';
import { token } from '@atlaskit/tokens';

export default function UseResizingExample(): JSX.Element {
	const [expanded, setExpanded] = useState(false);
	const { ref } = useResizing({
		dimension: 'height',
		duration: token('motion.duration.short'),
		easing: token('motion.easing.inout.bold'),
	});

	return (
		<>
			<button type="button" onClick={() => setExpanded((value) => !value)}>
				{expanded ? 'Show less' : 'Show more'}
			</button>
			<div ref={ref}>
				<p>Always-visible content.</p>
				{expanded && <p>Additional content revealed by the interaction.</p>}
			</div>
		</>
	);
}

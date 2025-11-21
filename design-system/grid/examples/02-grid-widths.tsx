import React from 'react';

import GridCards from './01-grid-cards';

export default (): React.JSX.Element => (
	<React.Fragment>
		{([undefined, 'wide', 'narrow'] as const).map((maxWidth) => (
			<div>
				<hr role="presentation" />
				<h3>{maxWidth}:</h3>

				<GridCards maxWidth={maxWidth} />
			</div>
		))}
	</React.Fragment>
);

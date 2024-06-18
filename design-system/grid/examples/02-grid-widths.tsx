/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import GridCards from './01-grid-cards';

export default () => (
	<React.Fragment>
		{([undefined, 'wide', 'narrow'] as const).map((maxWidth) => (
			<div>
				<hr />
				<h3>{maxWidth}:</h3>

				<GridCards maxWidth={maxWidth} />
			</div>
		))}
	</React.Fragment>
);

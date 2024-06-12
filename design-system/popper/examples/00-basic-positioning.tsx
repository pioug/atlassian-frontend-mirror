import React from 'react';

import { Manager, Popper, Reference } from '../src';

export default () => (
	<Manager>
		<Reference>
			{({ ref }) => (
				<button ref={ref} type="button">
					Reference element
				</button>
			)}
		</Reference>
		<Popper placement="right">
			{({ ref, style }) => (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				<div ref={ref} style={style}>
					↔ This text is a popper placed to the right
				</div>
			)}
		</Popper>
	</Manager>
);

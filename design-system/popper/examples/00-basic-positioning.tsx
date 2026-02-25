import React from 'react';

import { Manager, Popper, Reference } from '@atlaskit/popper';

export default (): React.JSX.Element => (
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
				<div ref={ref} style={style} data-testid="popper">
					↔ This text is a popper placed to the right
				</div>
			)}
		</Popper>
	</Manager>
);

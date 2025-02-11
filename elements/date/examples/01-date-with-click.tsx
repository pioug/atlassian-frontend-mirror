import React from 'react';
import { Date } from '../src';

export default () => (
	<div>
		<h3>with no onClick</h3>
		<p>
			<Date value={586137600000} />
		</p>
		<h3>with onClick</h3>
		<p>
			<Date
				value={586137600000}
				onClick={() => {
					console.log('clicked');
				}}
			/>
		</p>
	</div>
);
/* eslint-enable @atlaskit/design-system/ensure-design-token-usage */

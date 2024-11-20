import React from 'react';

import Textfield from '@atlaskit/textfield';

export default function WidthsExample() {
	return (
		<div>
			<label htmlFor="xsmall">xsmall</label>
			<Textfield name="xsmall" width="xsmall" id="xsmall" />

			<label htmlFor="small">small</label>
			<Textfield name="small" width="small" id="small" />

			<label htmlFor="medium">medium</label>
			<Textfield name="medium" width="medium" id="medium" />

			<label htmlFor="large">large</label>
			<Textfield name="large" width="large" id="large" />

			<label htmlFor="xlarge">xlarge</label>
			<Textfield name="xlarge" width="xlarge" id="xlarge" />

			<label htmlFor="custom-width">custom width (eg, 546)</label>
			<Textfield name="custom-width" width="546" id="custom-width" />

			<label htmlFor="default">default (100%)</label>
			<Textfield name="default" id="default" />
		</div>
	);
}

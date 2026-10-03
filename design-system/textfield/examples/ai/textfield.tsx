import React from 'react';

import TextField from '@atlaskit/textfield/text-field';

const Examples = (): React.JSX.Element => (
	<>
		{/* eslint-disable-next-line @atlaskit/design-system/no-placeholder */}
		<TextField label="Name" placeholder="Enter your name" />
		{/* eslint-disable-next-line @atlaskit/design-system/no-placeholder */}
		<TextField
			label="Email"
			type="email"
			placeholder="Enter your email address"
			isRequired
			autoComplete="email"
		/>
		{/* eslint-disable-next-line @atlaskit/design-system/no-placeholder */}
		<TextField label="Password" type="password" placeholder="Enter your password" isRequired />
	</>
);
export default Examples;

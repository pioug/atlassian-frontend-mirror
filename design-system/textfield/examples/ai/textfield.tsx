import React from 'react';

import TextField from '@atlaskit/textfield';

export default [
	<TextField label="Name" placeholder="Enter your name" />,
	<TextField label="Email" type="email" placeholder="Enter your email address" isRequired />,
	<TextField label="Password" type="password" placeholder="Enter your password" isRequired />,
];

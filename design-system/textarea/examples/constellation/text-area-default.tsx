import React from 'react';

import { Label } from '@atlaskit/form';
import TextArea from '@atlaskit/textarea';

export default () => (
	<>
		<Label htmlFor="area">Share your feedback</Label>
		<TextArea
			id="area"
			resize="auto"
			maxHeight="20vh"
			name="area"
			defaultValue="Add a message here"
		/>
	</>
);

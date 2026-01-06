import React from 'react';

import Textarea from '@atlaskit/textarea';

const Examples = (): React.JSX.Element => (
	<>
		<Textarea placeholder="Enter your text..." />
		<Textarea placeholder="Required field" isRequired resize="auto" name="comments" />
	</>
);
export default Examples;

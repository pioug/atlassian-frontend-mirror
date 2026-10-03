import React from 'react';

import Textarea from '@atlaskit/textarea/text-area';

const Examples = (): React.JSX.Element => (
	<>
		{/* eslint-disable-next-line @atlaskit/design-system/no-placeholder */}
		<Textarea placeholder="Enter your text..." />
		{/* eslint-disable-next-line @atlaskit/design-system/no-placeholder */}
		<Textarea placeholder="Required field" isRequired resize="auto" name="comments" />
	</>
);
export default Examples;

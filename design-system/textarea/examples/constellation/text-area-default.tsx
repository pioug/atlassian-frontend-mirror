import React from 'react';

import { Label } from '@atlaskit/form/label/default';
import TextArea from '@atlaskit/textarea/text-area';

export default (): React.JSX.Element => (
	<>
		<Label htmlFor="area">Share your feedback</Label>
		<TextArea id="area" resize="auto" maxHeight="20vh" name="area" defaultValue="" />
	</>
);

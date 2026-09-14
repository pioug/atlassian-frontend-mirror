import React from 'react';

import Button from '@atlaskit/button/button';

export default (): React.JSX.Element => (
	<Button testId="MyButtonTestId" onClick={() => alert('Button has been clicked!')}>
		Button
	</Button>
);

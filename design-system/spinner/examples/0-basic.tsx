import React from 'react';

import Spinner from '@atlaskit/spinner/spinner';

export default (): React.JSX.Element => (
	<Spinner testId="spinner" interactionName="load" label="Loading" />
);

import React from 'react';

import Spinner from '@atlaskit/spinner';

export default function ForBrowserTesting(): React.JSX.Element {
	return <Spinner testId="my-spinner" label="Loading" />;
}

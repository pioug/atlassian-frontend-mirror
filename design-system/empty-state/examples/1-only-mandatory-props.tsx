import React from 'react';

import EmptyState from '@atlaskit/empty-state';

const props = {
	header: 'I am the header',
};

export default (): React.JSX.Element => <EmptyState {...props} />;

import React from 'react';

import EmptyState from '@atlaskit/empty-state';

import exampleImage from './img/example-image.png';

const props = {
	header: 'I am the header',
	imageUrl: exampleImage,
};

export default (): React.JSX.Element => <EmptyState {...props} />;

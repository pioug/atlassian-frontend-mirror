/* eslint-disable */

import React from 'react';

import { Box } from '@atlaskit/primitives';

import example from './example-bg-image.png';

export default () => {
	return (
		<Box>
			<h2>Why apply styling to the svg?</h2>
			<p>Here's an example of a svg with background-color applied in an avatar</p>
			<img src={example} />
		</Box>
	);
};

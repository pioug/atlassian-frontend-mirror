import React from 'react';

import { Layering, useLayering } from '../src';

const LayerWrapper = () => {
	const { currentLevel, topLevelRef } = useLayering();

	return (
		<div>
			current Level is {currentLevel}, top level is {topLevelRef.current}
		</div>
	);
};

export default () => (
	<Layering>
		<LayerWrapper />
	</Layering>
);

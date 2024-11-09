import React from 'react';

import { Layering, useLayering } from '../src';

const SomeLayerWrapper = () => {
	const { currentLevel, topLevelRef, isLayerDisabled } = useLayering();

	return (
		<>
			<h2>
				current Level is {currentLevel}, top level is {topLevelRef.current ?? 'disabled'}
			</h2>
			{isLayerDisabled() ? <p>It is a disabled layer</p> : <p>It is the top layer</p>}
		</>
	);
};

export default () => (
	<Layering isDisabled={false}>
		<SomeLayerWrapper />
	</Layering>
);

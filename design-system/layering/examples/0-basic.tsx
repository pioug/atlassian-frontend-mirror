import React from 'react';

import { Layering, useLayering } from '@atlaskit/layering';

const SomeLayerWrapper = () => {
	const { currentLevel, getTopLevel, isLayerDisabled } = useLayering();

	return (
		<>
			<h2>
				current Level is {currentLevel}, top level is {getTopLevel?.() ?? 'disabled'}
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

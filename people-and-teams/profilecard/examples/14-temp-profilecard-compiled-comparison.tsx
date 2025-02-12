import React from 'react';

import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';
import { Inline } from '@atlaskit/primitives';

import Example from './03-profilecard-overview';

const FLAG = 'compiled-migration-profilecard';
function ExampleWithCompiled() {
	const booleanFlagResolver = (flagToResolve: string): boolean => flagToResolve === FLAG;
	setBooleanFeatureFlagResolver(booleanFlagResolver);

	return <Example />;
}

export default function Examples() {
	return (
		<Inline space="space.300">
			<Example />
			<ExampleWithCompiled />
		</Inline>
	);
}

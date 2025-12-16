import React from 'react';

import { layers } from '@atlaskit/theme';

export default (): React.JSX.Element => {
	return (
		<div>
			{Object.entries(layers).map(([key, value]) => (
				<div key={key}>{`layers.${key}() // ${value()}`}</div>
			))}
		</div>
	);
};

import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-atlaskit-theme
import { layers } from '@atlaskit/theme/constants';

export default (): React.JSX.Element => {
	return (
		<div>
			{Object.entries(layers).map(([key, value]) => (
				<div key={key}>{`layers.${key}() // ${value()}`}</div>
			))}
		</div>
	);
};

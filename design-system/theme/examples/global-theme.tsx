import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-atlaskit-theme
import Theme from '@atlaskit/theme/theme';

export default (): React.JSX.Element => (
	<Theme.Consumer>
		{(tokens) => (
			<div>
				The default mode is <code>{tokens.mode}</code>.
			</div>
		)}
	</Theme.Consumer>
);

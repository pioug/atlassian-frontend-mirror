import React from 'react';

import { cssMap } from '@atlaskit/css';
import Flag from '@atlaskit/flag';
import InfoIcon from '@atlaskit/icon/core/status-information';
import { Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

export default (): React.JSX.Element => (
	<>
		<h2>Flag with custom heading level</h2>
		<Flag
			icon={
				<Flex xcss={iconSpacingStyles.space050}>
					<InfoIcon color={token('color.icon.information')} label="Info" />
				</Flex>
			}
			description="Scott Farquhar published a new version of this page. Refresh to see the changes."
			id="1"
			title="New version published"
			headingLevel={3}
		/>
	</>
);

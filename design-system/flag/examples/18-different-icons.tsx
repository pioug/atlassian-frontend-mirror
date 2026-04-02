import React from 'react';

import { cssMap } from '@atlaskit/css';
import Flag from '@atlaskit/flag';
import StatusInformationIcon from '@atlaskit/icon/core/status-information';
import { Flex } from '@atlaskit/primitives/compiled';
import Stack from '@atlaskit/primitives/stack';
import { token } from '@atlaskit/tokens';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

const description = {
	spacing: 'This icon has custom spacing but still works',
	colors: 'This icon has a color override, different from the default',
};

export default (): React.JSX.Element => (
	<Stack space="space.100">
		<Flag title="Default icon" description="A default icon" id="1" testId="flag-1" />

		<h2>Various spacing</h2>
		<Flag
			title="New icon - no spacing"
			description={description.spacing}
			id="2"
			icon={<StatusInformationIcon label="" />}
		/>
		<Flag
			title="New icon - spacious spacing"
			description={description.spacing}
			id="3"
			icon={
				<Flex xcss={iconSpacingStyles.space050}>
					<StatusInformationIcon label="" />
				</Flex>
			}
		/>

		<h2>Color overrides</h2>
		<Flag
			title="New icon - color"
			description={description.colors}
			id="9"
			icon={<StatusInformationIcon label="" color={token('color.icon.danger')} />}
		/>
	</Stack>
);

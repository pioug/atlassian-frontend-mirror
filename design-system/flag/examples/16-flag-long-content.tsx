import React from 'react';

import { cssMap } from '@atlaskit/css';
import noop from '@atlaskit/ds-lib/noop';
import Flag, { FlagGroup } from '@atlaskit/flag';
import SuccessIcon from '@atlaskit/icon/core/status-success';
import { Flex, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

export default (): React.JSX.Element => (
	<>
		<Text>Flag with long content that should scroll</Text>
		<FlagGroup>
			<Flag
				icon={
					<Flex xcss={iconSpacingStyles.space050}>
						<SuccessIcon label="Success" color={token('color.icon.success')} />
					</Flex>
				}
				id="success"
				key="success"
				title="Connected"
				description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. this_really_long_filename_that_spans_longer_than_the_container.png Vestibulum leo elit, commodo non metus at, consequat tempor odio. Morbi in libero venenatis purus efficitur congue non at eros. In hac habitasse platea dictumst. Nulla facilisi. Suspendisse iaculis ligula at erat porttitor, vel vestibulum augue luctus. Pellentesque aliquam turpis non bibendum faucibus. Donec blandit consectetur faucibus."
				actions={[{ content: 'Alrighty then', onClick: noop }]}
			/>
		</FlagGroup>
	</>
);

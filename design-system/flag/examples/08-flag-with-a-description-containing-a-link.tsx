import React from 'react';

import { cssMap } from '@atlaskit/css';
import Flag, { FlagGroup } from '@atlaskit/flag';
import SuccessIcon from '@atlaskit/icon/core/status-success';
import Link from '@atlaskit/link';
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
		<Text>This is a flag with a description containing a link.</Text>
		<FlagGroup>
			<Flag
				description={
					<Text>
						My favourite task is{' '}
						<Link href="https://ecosystem.atlassian.net/browse/AK-90210">AK-90210</Link>
					</Text>
				}
				icon={
					<Flex xcss={iconSpacingStyles.space050}>
						<SuccessIcon color={token('color.icon.success')} label="Success" />
					</Flex>
				}
				id="1"
				key="1"
				title="I am a Flag"
			/>
		</FlagGroup>
	</>
);

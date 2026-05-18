import React from 'react';

import { cssMap } from '@atlaskit/css';
import PipelineIcon from '@atlaskit/icon-lab/core/pipeline';
import { Flex } from '@atlaskit/primitives/compiled';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { GoBackItem } from '@atlaskit/side-navigation';
import { token } from '@atlaskit/tokens';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

const Example = (): React.JSX.Element => (
	<>
		<GoBackItem>Back to project</GoBackItem>
		<GoBackItem isSelected>Back to project</GoBackItem>
		<GoBackItem isDisabled>Back to project</GoBackItem>
		<GoBackItem
			iconBefore={
				<Flex xcss={iconSpacingStyles.space050}>
					<PipelineIcon label="" />
				</Flex>
			}
		>
			Back to the future
		</GoBackItem>
		<GoBackItem description="My project name">Back to project</GoBackItem>
	</>
);

export default Example;

import React from 'react';

import PipelineIcon from '@atlaskit/icon-lab/core/pipeline';
import { GoBackItem } from '@atlaskit/side-navigation';

const Example = (): React.JSX.Element => (
	<>
		<GoBackItem>Back to project</GoBackItem>
		<GoBackItem isSelected>Back to project</GoBackItem>
		<GoBackItem isDisabled>Back to project</GoBackItem>
		<GoBackItem iconBefore={<PipelineIcon label="" spacing="spacious" />}>
			Back to the future
		</GoBackItem>
		<GoBackItem description="My project name">Back to project</GoBackItem>
	</>
);

export default Example;

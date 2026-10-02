import React from 'react';

import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import Tag from '@atlaskit/tag/tag-new';

export default (): React.JSX.Element => (
	<Stack space="space.100">
		<Inline space="space.100" alignBlock="center">
			<Tag text="Comments" trailingMetric={24} isRemovable={false} />
			<Tag text="Updates" color="blue" trailingMetric="99+" isRemovable={false} />
			<Tag text="Issues" color="red" trailingMetric={7} isRemovable={false} />
			<Tag text="Sprints" color="green" trailingMetric={2} isRemovable={false} />
			<Tag text="Members" color="purple" trailingMetric={12} isRemovable={false} />
		</Inline>
	</Stack>
);

import React from 'react';

import Tag from '@atlaskit/tag';
import TagGroup from '@atlaskit/tag-group';

const Example = (): React.JSX.Element => (
	<TagGroup label="Tags for work item">
		<Tag text="Priority: High" color="red" />
		<Tag text="Status: Active" color="green" />
		<Tag text="Type: Bug" color="blue" />
	</TagGroup>
);
export default Example;

import React from 'react';

import Tag from '@atlaskit/tag';

export default (): React.JSX.Element => (
	<div>
		<Tag text="Tag" color="blue" elemBefore="<" testId="elemBeforeBlue-hover" isRemovable={false} />
		<Tag text="Tag" color="blue" elemBefore="<" testId="elemBeforeBlue-focus" isRemovable={false} />
	</div>
);

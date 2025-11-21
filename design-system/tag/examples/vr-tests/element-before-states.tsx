import React from 'react';

import { SimpleTag as Tag } from '@atlaskit/tag';

export default (): React.JSX.Element => (
	<div>
		<Tag text="Tag" color="blue" elemBefore="<" testId="elemBeforeBlue-hover" />
		<Tag text="Tag" color="blue" elemBefore="<" testId="elemBeforeBlue-focus" />
	</div>
);

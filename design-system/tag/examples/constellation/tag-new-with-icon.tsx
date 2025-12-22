import React from 'react';

import StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred';
import Tag from '@atlaskit/tag';

export default (): React.JSX.Element => (
	<Tag text="Featured" elemBefore={<StarUnstarredIcon label="" size="small" />} />
);

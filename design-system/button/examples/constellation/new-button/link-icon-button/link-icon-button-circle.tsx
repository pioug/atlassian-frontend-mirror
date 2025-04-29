import React from 'react';

import { LinkIconButton } from '@atlaskit/button/new';
import QuestionCircleIcon from '@atlaskit/icon/core/migration/question-circle';

const LinkIconButtonCircleExample = () => {
	return (
		<LinkIconButton
			href="https://atlassian.com"
			shape="circle"
			icon={QuestionCircleIcon}
			label="View help"
		/>
	);
};

export default LinkIconButtonCircleExample;

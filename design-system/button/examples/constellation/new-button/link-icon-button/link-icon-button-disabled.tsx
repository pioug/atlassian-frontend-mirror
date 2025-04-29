import React from 'react';

import { LinkIconButton } from '@atlaskit/button/new';
import QuestionCircleIcon from '@atlaskit/icon/core/migration/question-circle';

const LinkIconButtonDisabledExample = () => {
	return (
		<LinkIconButton
			href="https://atlassian.com"
			appearance="subtle"
			icon={QuestionCircleIcon}
			label="View profile"
			isDisabled
		/>
	);
};

export default LinkIconButtonDisabledExample;

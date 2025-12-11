import React from 'react';

import { LinkIconButton } from '@atlaskit/button/new';
import QuestionCircleIcon from '@atlaskit/icon/core/question-circle';

const LinkIconButtonDisabledExample = (): React.JSX.Element => {
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

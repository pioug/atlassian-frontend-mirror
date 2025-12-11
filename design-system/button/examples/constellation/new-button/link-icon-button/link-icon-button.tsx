import React from 'react';

import { LinkIconButton } from '@atlaskit/button/new';
import QuestionCircleIcon from '@atlaskit/icon/core/question-circle';

const LinkIconButtonDefaultExample = (): React.JSX.Element => {
	return (
		<LinkIconButton href="https://atlassian.com" icon={QuestionCircleIcon} label="View help" />
	);
};

export default LinkIconButtonDefaultExample;

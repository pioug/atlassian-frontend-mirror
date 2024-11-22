import React from 'react';

import { LinkIconButton } from '@atlaskit/button/new';
import QuestionIcon from '@atlaskit/icon/glyph/question';

const LinkIconButtonCircleExample = () => {
	return (
		<LinkIconButton
			href="https://atlassian.com"
			shape="circle"
			icon={QuestionIcon}
			label="View help"
		/>
	);
};

export default LinkIconButtonCircleExample;

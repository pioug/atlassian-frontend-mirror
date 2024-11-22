import React from 'react';

import { LinkIconButton } from '@atlaskit/button/new';
import QuestionIcon from '@atlaskit/icon/glyph/question';

const LinkIconButtonDisabledExample = () => {
	return (
		<LinkIconButton
			href="https://atlassian.com"
			appearance="subtle"
			icon={QuestionIcon}
			label="View profile"
			isDisabled
		/>
	);
};

export default LinkIconButtonDisabledExample;

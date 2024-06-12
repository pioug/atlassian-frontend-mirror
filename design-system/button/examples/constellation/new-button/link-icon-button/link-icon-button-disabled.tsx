import React from 'react';

import QuestionIcon from '@atlaskit/icon/glyph/question';

import { LinkIconButton } from '../../../../src/new';

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

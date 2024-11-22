import React from 'react';

import { LinkIconButton } from '@atlaskit/button/new';
import QuestionIcon from '@atlaskit/icon/glyph/question';

const LinkIconButtonDefaultExample = () => {
	return <LinkIconButton href="https://atlassian.com" icon={QuestionIcon} label="View help" />;
};

export default LinkIconButtonDefaultExample;

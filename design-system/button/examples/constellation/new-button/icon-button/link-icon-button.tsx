import React from 'react';

import { LinkIconButton } from '@atlaskit/button/new';
import AddIcon from '@atlaskit/icon/core/add';

const LinkIconButtonExample = () => {
	return <LinkIconButton href="https://atlassian.com/" icon={AddIcon} label="Create new page" />;
};

export default LinkIconButtonExample;

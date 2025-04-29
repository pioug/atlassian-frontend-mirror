import React from 'react';

import { LinkIconButton } from '@atlaskit/button/new';
import QuestionCircleIcon from '@atlaskit/icon/core/migration/question-circle';
import { Inline } from '@atlaskit/primitives';

const LinkIconButtonSpacingExample = () => {
	return (
		<Inline space="space.200">
			<LinkIconButton href="https://atlassian.com" icon={QuestionCircleIcon} label="View help" />
			<LinkIconButton
				href="https://atlassian.com"
				icon={QuestionCircleIcon}
				spacing="compact"
				label="View help"
			/>
		</Inline>
	);
};

export default LinkIconButtonSpacingExample;

import React from 'react';

import LinkIconButton from '@atlaskit/button/icon/link';
import QuestionCircleIcon from '@atlaskit/icon/core/question-circle';
import { Inline } from '@atlaskit/primitives/compiled';

const LinkIconButtonSpacingExample = (): React.JSX.Element => {
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

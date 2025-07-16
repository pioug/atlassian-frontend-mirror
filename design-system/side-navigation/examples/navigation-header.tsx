import React, { type MouseEvent } from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives';
import { Header, NavigationHeader } from '@atlaskit/side-navigation';

import RocketIcon from './common/sample-logo';

const Example = () => {
	return (
		// eslint-disable-next-line @atlassian/a11y/interactive-element-not-keyboard-focusable
		<Box onClick={(e: MouseEvent) => e.preventDefault()}>
			<NavigationHeader>
				<Header description="Next-gen software">Concise Systems</Header>
			</NavigationHeader>

			<NavigationHeader>
				<Header iconBefore={<RocketIcon />} description="Next-gen software">
					Concise Systems
				</Header>
			</NavigationHeader>
		</Box>
	);
};

export default Example;

import React, { type MouseEvent } from 'react';

import ProjectIcon from '@atlaskit/icon/core/project';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives';
import { Header, NavigationHeader } from '@atlaskit/side-navigation';

const Example = (): React.JSX.Element => {
	return (
		// eslint-disable-next-line @atlassian/a11y/interactive-element-not-keyboard-focusable
		<Box onClick={(e: MouseEvent) => e.preventDefault()}>
			<NavigationHeader>
				<Header description="Next-gen software">Concise Systems</Header>
			</NavigationHeader>

			<NavigationHeader>
				<Header iconBefore={<ProjectIcon label="" />} description="Next-gen software">
					Concise Systems
				</Header>
			</NavigationHeader>
		</Box>
	);
};

export default Example;

import React from 'react';

import { code } from '@atlaskit/docs';

import HoverCardExample from '../../../examples/content/hover-card';
import customMd from '../../utils/custom-md';
import prerequisites from '../prerequisites';

export default customMd`

Hover cards can be used as a standalone component to wrap any other React component to display information about a supplied URL upon hovering on
the child component. Depending on the resource type, different actions will be displayed.
For hover preview on Smart Links (standalone and inside Editor), please see [inline card](./inline-card).

&nbsp;

${(<HoverCardExample />)}

&nbsp;

${prerequisites}


### Usage

${code`
import { IntlProvider } from 'react-intl-next';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { HoverCard } from '@atlaskit/smart-card/hover-card';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives';

// To use staging environment, you must be logged in at
// https://pug.jira-dev.com
<IntlProvider locale="en">
	<SmartCardProvider client={new CardClient('stg')}>
		<HoverCard url="https://www.atlassian.com/">
			<Box>Hover over me!</Box>
		</HoverCard>
	</SmartCardProvider>
</IntlProvider>
`}
`;

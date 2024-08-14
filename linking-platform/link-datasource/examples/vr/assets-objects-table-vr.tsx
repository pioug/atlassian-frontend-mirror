import React from 'react';

import { mockAssetsClientFetchRequests } from '@atlaskit/link-test-helpers/assets';

import { ExampleAssetsIssuesTableView } from '../../examples-helpers/buildAssetsIssuesTable';
import { HoverableContainer } from '../../examples-helpers/hoverableContainer';

mockAssetsClientFetchRequests({ delayedResponse: false });

export default () => (
	<HoverableContainer>
		<ExampleAssetsIssuesTableView />
	</HoverableContainer>
);

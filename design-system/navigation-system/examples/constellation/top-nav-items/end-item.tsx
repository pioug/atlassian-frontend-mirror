import React from 'react';

import AtlassianIntelligenceIcon from '@atlaskit/icon/core/atlassian-intelligence';
import { TopNavEnd } from '@atlaskit/navigation-system/layout/top-nav';
import { EndItem } from '@atlaskit/navigation-system/top-nav-items';

import { MockTopBar } from '../common/mock-top-bar';

export function EndItemExample(): React.JSX.Element {
	return (
		<MockTopBar>
			<TopNavEnd>
				<EndItem
					icon={AtlassianIntelligenceIcon}
					onClick={() => alert('Atlassian Intelligence')}
					label="Atlassian Intelligence"
				/>
			</TopNavEnd>
		</MockTopBar>
	);
}

export default EndItemExample;

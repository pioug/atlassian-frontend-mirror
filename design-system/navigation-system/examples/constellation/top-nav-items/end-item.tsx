import React from 'react';

import AtlassianIntelligenceIcon from '@atlaskit/icon/core/atlassian-intelligence';
import { EndItem } from '@atlaskit/navigation-system';
import { TopNavEnd } from '@atlaskit/navigation-system/layout/top-nav';

import { MockTopBar } from '../common/mock-top-bar';

export function EndItemExample() {
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

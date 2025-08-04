import React from 'react';

import AiChatIcon from '@atlaskit/icon/core/ai-chat';
import TeamsIcon from '@atlaskit/icon/core/teams';
import {
	TopNavButton,
	TopNavIconButton,
	TopNavLinkButton,
	TopNavLinkIconButton,
} from '@atlaskit/navigation-system/experimental/top-nav-button';
import { TopNav, TopNavEnd } from '@atlaskit/navigation-system/layout/top-nav';

import { MockRoot } from '../../utils/mock-root';

export const TopNavButtonExample = () => (
	<MockRoot>
		<TopNav>
			<TopNavEnd>
				<TopNavIconButton icon={TeamsIcon} label="Top nav icon button" />
				<TopNavLinkIconButton
					icon={AiChatIcon}
					href="#example-href"
					label="Top nav link icon button"
				/>
				<TopNavLinkButton iconBefore={TeamsIcon} href="#example-href">
					Top nav link button
				</TopNavLinkButton>
				<TopNavButton iconBefore={AiChatIcon}>Top nav button</TopNavButton>
			</TopNavEnd>
		</TopNav>
	</MockRoot>
);

export default TopNavButtonExample;

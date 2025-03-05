import React from 'react';

import { Stack } from '@atlaskit/primitives/compiled';

import CardViewSection from '../card-view/card-view-section';
import { VRTestCase } from '../utils/common';
import {
	ForbiddenClient,
	ForbiddenWithSitePendingRequestClient,
	ForbiddenWithSiteRequestAccessClient,
	NotFoundWithSiteAccessExistsClient,
	ResolvedClient,
	UnAuthClient,
} from '../utils/custom-client';

export default () => {
	const props: {
		appearance: React.ComponentProps<typeof CardViewSection>['appearance'];
		fontSize: React.ComponentProps<typeof CardViewSection>['fontSize'];
	} = {
		appearance: 'inline',
		fontSize: '16px',
	};

	return (
		<VRTestCase title="Inline cards 16px font size">
			{() => (
				<Stack>
					<CardViewSection {...props} client={new ResolvedClient()} title="[Resolved]" />
					<CardViewSection {...props} client={new ForbiddenClient()} title="[Forbidden] Default" />
					<CardViewSection
						{...props}
						client={new ForbiddenWithSiteRequestAccessClient()}
						description="I don't have access to the site, but I can request access"
						title="[Forbidden] Site - Request Access"
					/>
					<CardViewSection
						{...props}
						client={new ForbiddenWithSitePendingRequestClient()}
						description="I don't have access to the site, but I've already requested access and I'm waiting"
						title="[Forbidden] Site - Pending Request"
					/>
					<CardViewSection
						{...props}
						client={new NotFoundWithSiteAccessExistsClient()}
						description="I have access to the site, but not the object or object is not-found"
						title="[Not Found] Access Exists"
					/>
					<CardViewSection {...props} client={new UnAuthClient()} title="[Unauthorized]" />
				</Stack>
			)}
		</VRTestCase>
	);
};

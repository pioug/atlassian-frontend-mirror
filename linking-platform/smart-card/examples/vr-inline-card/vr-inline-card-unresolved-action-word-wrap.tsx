import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';

import CardViewSection from '../card-view/card-view-section';
import { VRTestCase } from '../utils/common';
import {
	ForbiddenClient,
	ForbiddenWithSitePendingRequestClient,
	ForbiddenWithSiteRequestAccessClient,
	NotFoundWithSiteAccessExistsClient,
	UnAuthClient,
} from '../utils/custom-client';

const styles = cssMap({
	container: {
		width: '100px',
	},
});

export default () => {
	const props: { appearance: React.ComponentProps<typeof CardViewSection>['appearance'] } = {
		appearance: 'inline',
	};

	return (
		<VRTestCase title="Inline cards unresolved word wrap">
			{() => (
				<Inline space="space.200">
					{[undefined, '16px', '24px'].map((fontSize: string | undefined) => (
						<Box xcss={styles.container}>
							<Stack>
								<Box>{fontSize ?? 'default'}</Box>
								<CardViewSection
									{...props}
									client={new ForbiddenClient()}
									fontSize={fontSize}
									title="[Forbidden] Default"
								/>
								<CardViewSection
									{...props}
									client={new ForbiddenWithSiteRequestAccessClient()}
									fontSize={fontSize}
									title="[Forbidden] Site - Request Access"
								/>
								<CardViewSection
									{...props}
									client={new ForbiddenWithSitePendingRequestClient()}
									fontSize={fontSize}
									title="[Forbidden] Site - Pending Request"
								/>
								<CardViewSection
									{...props}
									client={new NotFoundWithSiteAccessExistsClient()}
									fontSize={fontSize}
									title="[Not Found] Access Exists"
								/>
								<CardViewSection
									{...props}
									client={new UnAuthClient()}
									fontSize={fontSize}
									title="[Unauthorized]"
								/>
							</Stack>
						</Box>
					))}
				</Inline>
			)}
		</VRTestCase>
	);
};

/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import CardViewSection from '../card-view/card-view-section';
import { VRTestCase } from '../utils/common';
import {
	ForbiddenClient,
	ForbiddenWithSitePendingRequestClient,
	ForbiddenWithSiteRequestAccessClient,
	NotFoundWithSiteAccessExistsClient,
	ResolvedClient,
	ResolvingClient,
	UnAuthClient,
} from '../utils/custom-client';

const styles = cssMap({
	wrapper: {
		minWidth: '1700px',
	},
});

export default () => {
	const props: { appearance: React.ComponentProps<typeof CardViewSection>['appearance'] } = {
		appearance: 'inline',
	};

	return (
		<VRTestCase title="Inline cards word wrap">
			{() => (
				<Box xcss={styles.wrapper}>
					{[
						new ResolvingClient(),
						new ResolvedClient(),
						new ForbiddenClient(),
						new ForbiddenWithSiteRequestAccessClient(),
						new ForbiddenWithSitePendingRequestClient(),
						new NotFoundWithSiteAccessExistsClient(),
						new UnAuthClient(),
					].map((client) => (
						<Inline space="space.200">
							{[
								undefined,
								token('font.body.small'),
								token('font.body'),
								token('font.body.large'),
								token('font.heading.xxsmall'),
								token('font.heading.xsmall'),
								token('font.heading.small'),
								token('font.heading.medium'),
								token('font.heading.large'),
								token('font.heading.xlarge'),
								token('font.heading.xxlarge'),
							].map((fontSize: string | undefined) => (
								<Stack space="space.200">
									<Inline space="space.200">
										{['16px', '100px'].map((width: string) => (
											<Box style={{ font: fontSize, width: width }}>
												<CardViewSection {...props} client={client} title="" />
											</Box>
										))}
									</Inline>
								</Stack>
							))}
						</Inline>
					))}
				</Box>
			)}
		</VRTestCase>
	);
};

/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import {
	ForbiddenClient,
	ForbiddenWithSitePendingRequestClient,
	ForbiddenWithSiteRequestAccessClient,
	NotFoundWithSiteAccessExistsClient,
	ResolvedClient,
	ResolvingClient,
	UnAuthClient,
} from '@atlaskit/link-test-helpers';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import CardViewSection from '../card-view/card-view-section';
import { VRTestCase } from '../utils/common';

const styles = cssMap({
	wrapper: {
		minWidth: '1700px',
	},
});

type ComponentProps = {
	client:
		| ResolvingClient
		| ResolvedClient
		| ForbiddenClient
		| ForbiddenWithSiteRequestAccessClient
		| ForbiddenWithSitePendingRequestClient
		| NotFoundWithSiteAccessExistsClient
		| UnAuthClient;
};

const Component = ({ client }: ComponentProps) => {
	const props: { appearance: React.ComponentProps<typeof CardViewSection>['appearance'] } = {
		appearance: 'inline',
	};
	return (
		<VRTestCase title="Inline cards word wrap">
			{() => (
				<Box xcss={styles.wrapper}>
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
				</Box>
			)}
		</VRTestCase>
	);
};

export const InlineCardWordWrapResolving = () => <Component client={new ResolvingClient()} />;
export const InlineCardWordWrapResolved = () => <Component client={new ResolvedClient()} />;
export const InlineCardWordWrapForbidden = () => <Component client={new ForbiddenClient()} />;
export const InlineCardWordWrapForbiddenWithSiteRequestAccess = () => (
	<Component client={new ForbiddenWithSiteRequestAccessClient()} />
);
export const InlineCardWordWrapForbiddenWithSitePendingRequest = () => (
	<Component client={new ForbiddenWithSitePendingRequestClient()} />
);
export const InlineCardWordWrapNotFoundWithSiteAccessExists = () => (
	<Component client={new NotFoundWithSiteAccessExistsClient()} />
);
export const InlineCardWordWrapUnAuth = () => <Component client={new UnAuthClient()} />;

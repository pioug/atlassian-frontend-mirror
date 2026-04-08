import React from 'react';

import { MenuGroup, Section } from '@atlaskit/menu';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';

import { TeamsAnchor, TeamsNavigationProvider } from '../src';
import { TeamsLink } from '../src/ui/TeamsLink';
import { TeamsLinkButton } from '../src/ui/TeamsLinkButton';
import { TeamsLinkItem } from '../src/ui/TeamsLinkItem';

const TEAM_HREF = '/teams/my-team';

/**
 * Demonstrates each navigation primitive in a layout similar to product usage:
 * inline copy (Anchor), directory-style link (Link), primary CTA (LinkButton),
 * and menu actions (LinkItem inside a menu section).
 */
export default function Basic(): React.JSX.Element {
	const context = {
		forceExternalIntent: true,
		navigate: () => {},
		openPreviewPanel: () => {},
	};

	return (
		<TeamsNavigationProvider value={context}>
			<Box
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				style={{ width: 420 }}
			>
				<Stack space="space.400">
					<Text as="p">
						Here is a TeamsAnchor link to{' '}
						<TeamsAnchor
							href={TEAM_HREF}
							intent="navigation"
						>
							a team
						</TeamsAnchor>
						.
					</Text>

					<Text>
						<TeamsLink
							href={TEAM_HREF}
							intent="navigation"
						>
							TeamsLink to a team
						</TeamsLink>{' '}
						in the directory.
					</Text>

					<Box>
						<TeamsLinkButton
							href={TEAM_HREF}
							intent="navigation"
							appearance="primary"
						>
							TeamsLinkButton to a team
						</TeamsLinkButton>
					</Box>

					<Stack space="space.100">
						<Text as="p" weight="semibold">
							Quick links (TeamsLinkItem)
						</Text>
						<MenuGroup>
							<Section title="Navigate">
								<TeamsLinkItem
									href={TEAM_HREF}
									intent="navigation"
								>
									Home
								</TeamsLinkItem>
								<TeamsLinkItem href={`${TEAM_HREF}/settings`} intent="navigation">
									Settings
								</TeamsLinkItem>
							</Section>
						</MenuGroup>
					</Stack>
				</Stack>
			</Box>
		</TeamsNavigationProvider>
	);
}

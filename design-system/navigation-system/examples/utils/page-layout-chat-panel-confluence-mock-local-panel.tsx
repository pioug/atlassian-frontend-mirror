/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { jsx } from '@compiled/react';

import Avatar from '@atlaskit/avatar/avatar';
import IconButton from '@atlaskit/button/icon/button';
import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import AlignTextLeftIcon from '@atlaskit/icon/core/align-text-left';
import CalendarIcon from '@atlaskit/icon/core/calendar';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ProjectIcon from '@atlaskit/icon/core/project';
import IconTile from '@atlaskit/icon/icon-tile';
import Lozenge from '@atlaskit/lozenge/lozenge';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import Tab from '@atlaskit/tabs/tab';
import TabList from '@atlaskit/tabs/tab-list';
import TabPanel from '@atlaskit/tabs/tab-panel';
import Tabs from '@atlaskit/tabs/tabs';
import { token } from '@atlaskit/tokens';
import { PanelActionCloseSmart } from '@atlassian/panel-system/panel-action/close-smart';
import { PanelActionExpand } from '@atlassian/panel-system/panel-action/expand';
import { PanelActionGroup } from '@atlassian/panel-system/panel-action/group';
import { PanelActionMore } from '@atlassian/panel-system/panel-action/more';
import { PanelActionNewTab } from '@atlassian/panel-system/panel-action/new-tab';
import { PanelBody } from '@atlassian/panel-system/panel-body';
import { PanelContainer } from '@atlassian/panel-system/panel-container';
import { PanelContent } from '@atlassian/panel-system/panel-content';
import { PanelHeader } from '@atlassian/panel-system/panel-header';
import { PanelSubheader } from '@atlassian/panel-system/panel-subheader';
import { PanelTitle } from '@atlassian/panel-system/panel-title';

const styles = cssMap({
	detailsGrid: {
		alignItems: 'center',
		columnGap: token('space.100'),
		display: 'grid',
		gridTemplateColumns: '100px minmax(0, 1fr)',
		rowGap: token('space.200'),
	},
	showMoreRow: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'space-between',
	},
	tabPanel: {
		paddingBlockStart: token('space.250'),
	},
	list: {
		marginBlock: 0,
		paddingInlineStart: token('space.300'),
	},
	comment: {
		alignItems: 'center',
		display: 'flex',
		gap: token('space.100'),
	},
	commentField: {
		backgroundColor: token('color.background.neutral.subtle'),
		borderRadius: token('radius.small'),
		flex: 1,
		paddingBlock: token('space.100'),
		paddingInline: token('space.150'),
	},
});

export default function ConfluenceProjectPanel(): React.JSX.Element {
	return (
		<PanelContainer>
			<PanelHeader>
				<PanelTitle icon={<ProjectIcon label="" />}>Projects</PanelTitle>
				<PanelActionGroup>
					<PanelActionNewTab href="#" label="Open in new tab" />
					<PanelActionExpand label="Expand panel" />
					<PanelActionMore label="More actions" />
					<PanelActionCloseSmart label="Close project details" />
				</PanelActionGroup>
			</PanelHeader>
			<PanelContent>
				<PanelSubheader
					title="ADS Panel System - Beta Release"
					breadcrumbs={
						<Text size="small" color="color.text.subtlest">
							ATLAS-101632
						</Text>
					}
					titleIcon={
						<IconTile icon={AlignTextLeftIcon} label="" appearance="orange" size="small" />
					}
				/>
				<PanelBody>
					<Stack space="space.250">
						<Stack space="space.100">
							<div css={styles.detailsGrid}>
								<Text color="color.text.subtle" weight="medium">
									Status
								</Text>
								<Inline>
									<Lozenge appearance="success" isBold>
										Completed 🎉
									</Lozenge>
								</Inline>

								<Text color="color.text.subtle" weight="medium">
									Target date
								</Text>
								<Inline space="space.050" alignBlock="center">
									<CalendarIcon label="" color={token('color.icon.subtle')} size="small" />
									<Text>Apr–Jun</Text>
									<ChevronDownIcon label="" size="small" />
								</Inline>

								<Text color="color.text.subtle" weight="medium">
									Owner
								</Text>
								<Inline space="space.075" alignBlock="center">
									<Avatar size="small" name="Alex Chen" />
									<Text>Alex Chen</Text>
								</Inline>
							</div>

							<div css={styles.showMoreRow}>
								<Text color="color.text.subtle">Show more fields</Text>
								<IconButton
									icon={ChevronDownIcon}
									label="Show more fields"
									appearance="subtle"
									spacing="compact"
								/>
							</div>
						</Stack>

						<Tabs id="confluence-project-tabs">
							<TabList>
								<Tab>About</Tab>
								<Tab>Updates</Tab>
								<Tab>Learnings</Tab>
								<Tab>Risks</Tab>
								<Tab>Decisions</Tab>
							</TabList>
							<TabPanel>
								<Stack xcss={styles.tabPanel} space="space.400">
									<Stack space="space.150">
										<Heading size="small" as="h3">
											What we're doing
										</Heading>
										<Text>
											We are building the ADS Panel System, a composable set of components, hooks,
											and guidelines for consistent, responsive, and context-aware panels across
											Atlassian products. This project defines the foundations and adoption path for
											panels that work in any container.
										</Text>
										<Text>
											Our initial focus is creating the atomic building blocks and piloting them
											across panel-like experiences, including the Global Preview Panel.
										</Text>
									</Stack>

									<Stack space="space.150">
										<Heading size="small" as="h3">
											Why we're doing it
										</Heading>
										<Text>
											Panels are already in high demand across Confluence, Jira, and AI experiences.
											Without a unified approach, we risk fragmentation as more panel-like UIs
											emerge.
										</Text>
										<Text>By providing a system-level solution in ADS, we:</Text>
										<Box as="ul" xcss={styles.list}>
											<li>
												<Text>Unlock a consistent org-wide panel experience.</Text>
											</li>
											<li>
												<Text>Accelerate maker productivity through reusable components.</Text>
											</li>
											<li>
												<Text>Enable cross-app workflows that feel cohesive and familiar.</Text>
											</li>
										</Box>
									</Stack>

									<Stack space="space.150">
										<Heading size="small" as="h3">
											How we'll know we're successful
										</Heading>
										<Box as="ul" xcss={styles.list}>
											<li>
												<Text>
													<strong>Reusable components:</strong> Atomic building blocks are adopted
													in panel-like experiences.
												</Text>
											</li>
											<li>
												<Text>
													<strong>Cohesion &amp; adoption:</strong> Other teams begin adopting
													panel-system elements.
												</Text>
											</li>
										</Box>
									</Stack>

									<div css={styles.comment}>
										<Avatar size="small" name="Alex Chen" />
										<div css={styles.commentField}>
											<Text color="color.text.subtlest">
												Add a comment… celebrate your teammates
											</Text>
										</div>
									</div>
								</Stack>
							</TabPanel>
						</Tabs>
					</Stack>
				</PanelBody>
			</PanelContent>
		</PanelContainer>
	);
}

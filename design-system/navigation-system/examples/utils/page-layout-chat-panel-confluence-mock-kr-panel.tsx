/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { jsx } from '@compiled/react';

import Avatar from '@atlaskit/avatar/avatar';
import Button from '@atlaskit/button/default/button';
import IconButton from '@atlaskit/button/icon/button';
import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import AddIcon from '@atlaskit/icon/core/add';
import CalendarIcon from '@atlaskit/icon/core/calendar';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import GoalIcon from '@atlaskit/icon/core/goal';
import IconTile from '@atlaskit/icon/icon-tile';
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
import { PanelActionGroup } from '@atlassian/panel-system/panel-action/group';
import { PanelActionMore } from '@atlassian/panel-system/panel-action/more';
import { PanelActionNewTab } from '@atlassian/panel-system/panel-action/new-tab';
import { PanelBody } from '@atlassian/panel-system/panel-body';
import { PanelContainer } from '@atlassian/panel-system/panel-container';
import { PanelContent } from '@atlassian/panel-system/panel-content';
import { PanelHeader } from '@atlassian/panel-system/panel-header';
import { PanelTitle } from '@atlassian/panel-system/panel-title';

const styles = cssMap({
	title: {
		alignItems: 'flex-start',
		display: 'flex',
		gap: token('space.150'),
	},
	metadataGrid: {
		alignItems: 'center',
		display: 'grid',
		gap: token('space.250'),
		gridTemplateColumns: '92px minmax(0, 1fr)',
	},
	status: {
		alignItems: 'center',
		backgroundColor: token('color.background.accent.green.subtler'),
		border: `${token('border.width')} solid ${token('color.border.accent.green')}`,
		borderRadius: token('radius.small'),
		display: 'inline-flex',
		gap: token('space.075'),
		paddingBlock: token('space.025'),
		paddingInline: token('space.075'),
	},
	date: {
		alignItems: 'center',
		border: `${token('border.width')} solid ${token('color.border')}`,
		borderRadius: token('radius.small'),
		display: 'inline-flex',
		gap: token('space.075'),
		paddingBlock: token('space.050'),
		paddingInline: token('space.075'),
	},
	progressTrack: {
		backgroundColor: token('color.background.neutral'),
		borderRadius: token('radius.full'),
		height: '8px',
		overflow: 'hidden',
		width: '100%',
	},
	progressValue: {
		backgroundColor: token('color.background.neutral.bold'),
		borderRadius: token('radius.full'),
		height: '100%',
		width: '20%',
	},
	showMore: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'space-between',
	},
	tabPanel: {
		paddingBlockStart: token('space.250'),
	},
	hero: {
		alignItems: 'center',
		backgroundColor: token('color.background.neutral.bold'),
		borderRadius: token('radius.medium'),
		color: token('color.text.inverse'),
		display: 'flex',
		height: '180px',
		justifyContent: 'center',
		overflow: 'hidden',
		position: 'relative',
	},
	heroDiamondBlue: {
		backgroundColor: token('color.background.brand.bold'),
		height: '96px',
		position: 'absolute',
		transform: 'rotate(45deg)',
		width: '96px',
	},
	heroDiamondGreen: {
		backgroundColor: token('color.background.accent.green.bolder'),
		height: '72px',
		position: 'absolute',
		transform: 'translateX(36px) rotate(45deg)',
		width: '72px',
	},
	heroText: {
		position: 'relative',
		transform: 'translateY(56px)',
		zIndex: 1,
	},
	metricHeader: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'space-between',
	},
	metricCard: {
		border: `${token('border.width')} solid ${token('color.border')}`,
		borderRadius: token('radius.small'),
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
	chart: {
		borderBlockEnd: `${token('border.width.selected')} solid ${token('color.border.bold')}`,
		height: '240px',
		position: 'relative',
	},
	chartMidline: {
		borderBlockStart: `${token('border.width')} solid ${token('color.border')}`,
		insetInline: 0,
		position: 'absolute',
		insetBlockStart: '50%',
	},
	chartLine: {
		insetBlockEnd: '0',
		height: '54px',
		insetInlineStart: token('space.300'),
		position: 'absolute',
		width: '96px',
	},
	chartLabels: {
		display: 'flex',
		justifyContent: 'space-between',
		paddingBlockStart: token('space.075'),
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

export default function ConfluenceKeyResultPanel(): React.JSX.Element {
	return (
		<PanelContainer>
			<PanelHeader>
				<PanelTitle icon={<GoalIcon label="" />}>Goal</PanelTitle>
				<PanelActionGroup>
					<PanelActionNewTab href="#" label="Open goal in new tab" />
					<PanelActionMore label="More goal actions" />
					<PanelActionCloseSmart label="Close goal" />
				</PanelActionGroup>
			</PanelHeader>
			<PanelContent>
				<PanelBody>
					<Stack space="space.300">
						<div css={styles.title}>
							<IconTile icon={GoalIcon} label="" appearance="green" size="medium" />
							<Stack space="space.050">
								<Heading size="large" as="h2">
									[Design L2.KR3] — Enhance design and content systems so that they power the full
									'stack'
								</Heading>
								<Text color="color.text.subtle">Key result</Text>
							</Stack>
						</div>

						<div css={styles.metadataGrid}>
							<Text weight="bold">Status</Text>
							<Inline>
								<div css={styles.status}>
									<Text>On track&nbsp; 0.7</Text>
									<ChevronDownIcon label="" size="small" />
								</div>
							</Inline>

							<Text weight="bold">Target date</Text>
							<Inline>
								<div css={styles.date}>
									<CalendarIcon label="" size="small" />
									<Text>30 Jun 2027</Text>
									<ChevronDownIcon label="" size="small" />
								</div>
							</Inline>

							<Text weight="bold">Owner</Text>
							<Inline alignBlock="center" space="space.075">
								<Avatar size="small" name="Alex Chen" />
								<Text>Alex Chen</Text>
							</Inline>

							<Text weight="bold">Progress</Text>
							<Stack space="space.075">
								<Text>% of new/updated design guidance available via ADS — 20%</Text>
								<div css={styles.progressTrack}>
									<div css={styles.progressValue} />
								</div>
							</Stack>
						</div>

						<div css={styles.showMore}>
							<Text color="color.text.subtle">Show more fields</Text>
							<IconButton appearance="subtle" icon={ChevronDownIcon} label="Show more fields" />
						</div>

						<Tabs id="confluence-key-result-tabs">
							<TabList>
								<Tab>Overview</Tab>
								<Tab>Updates</Tab>
								<Tab>Projects</Tab>
								<Tab>Jira</Tab>
								<Tab>•••</Tab>
							</TabList>
							<TabPanel>
								<Stack xcss={styles.tabPanel} space="space.300">
									<Heading size="medium" as="h3">
										Description
									</Heading>
									<div css={styles.hero}>
										<div css={styles.heroDiamondBlue} />
										<div css={styles.heroDiamondGreen} />
										<Box xcss={styles.heroText}>
											<Text color="color.text.inverse" weight="bold">
												✦ Design guidance for every layer
											</Text>
										</Box>
									</div>
									<Inline alignBlock="center" space="space.075">
										<Text color="color.text.subtle">Show more</Text>
										<ChevronDownIcon label="" size="small" />
									</Inline>

									<div css={styles.metricHeader}>
										<Heading size="medium" as="h3">
											Metric
										</Heading>
										<Button iconBefore={AddIcon}>Add metric data</Button>
									</div>
									<div css={styles.metricCard}>
										<Stack space="space.100">
											<Heading size="small" as="h4">
												% of new/updated design guidance available via ADS MCP agentic context layer
											</Heading>
											<Text>20%</Text>
											<div css={styles.chart}>
												<div css={styles.chartMidline} />
												<Box xcss={styles.chartLine}>
													<svg
														viewBox="0 0 96 54"
														role="img"
														aria-label="Metric increased from zero to twenty percent"
													>
														<path
															d="M2 52 L24 52 L92 4"
															fill="none"
															stroke="#6A9A23"
															strokeWidth="3"
														/>
														<circle
															cx="2"
															cy="52"
															r="4"
															fill="#FFFFFF"
															stroke="#6A9A23"
															strokeWidth="3"
														/>
														<circle
															cx="24"
															cy="52"
															r="4"
															fill="#FFFFFF"
															stroke="#6A9A23"
															strokeWidth="3"
														/>
														<circle cx="92" cy="4" r="4" fill="#6A9A23" />
													</svg>
												</Box>
											</div>
											<div css={styles.chartLabels}>
												<Text size="small" color="color.text.subtle">
													Aug 2026
												</Text>
												<Text size="small" color="color.text.subtle">
													Sep
												</Text>
												<Text size="small" color="color.text.subtle">
													Dec
												</Text>
												<Text size="small" color="color.text.subtle">
													Mar
												</Text>
												<Text size="small" color="color.text.subtle">
													Jun
												</Text>
											</div>
										</Stack>
									</div>

									<div css={styles.comment}>
										<Avatar size="small" name="Jordan Lee" />
										<div css={styles.commentField}>
											<Text color="color.text.subtlest">Add a comment… join the conversation</Text>
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

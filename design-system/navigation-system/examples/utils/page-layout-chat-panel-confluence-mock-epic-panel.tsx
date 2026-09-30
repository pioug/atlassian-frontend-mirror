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
import AddIcon from '@atlaskit/icon/core/add';
import AppsIcon from '@atlaskit/icon/core/apps';
import BranchIcon from '@atlaskit/icon/core/branch';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import EpicIcon from '@atlaskit/icon/core/epic';
import EyeOpenIcon from '@atlaskit/icon/core/eye-open';
import LockLockedIcon from '@atlaskit/icon/core/lock-locked';
import PremiumIcon from '@atlaskit/icon/core/premium';
import ShareIcon from '@atlaskit/icon/core/share';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import WorkItemIcon from '@atlaskit/icon/core/work-item';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';
import { PanelActionCloseSmart } from '@atlassian/panel-system/panel-action/close-smart';
import { PanelActionGroup } from '@atlassian/panel-system/panel-action/group';
import { PanelActionNewTab } from '@atlassian/panel-system/panel-action/new-tab';
import { PanelBody } from '@atlassian/panel-system/panel-body';
import { PanelContainer } from '@atlassian/panel-system/panel-container';
import { PanelContent } from '@atlassian/panel-system/panel-content';
import { PanelHeader } from '@atlassian/panel-system/panel-header';
import { PanelTitle } from '@atlassian/panel-system/panel-title';

const styles = cssMap({
	issueKeyRow: {
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'space-between',
	},
	issueTitle: {
		alignItems: 'center',
		display: 'flex',
		gap: token('space.150'),
	},
	issueType: {
		backgroundColor: token('color.background.accent.purple.subtler'),
		border: `${token('border.width')} solid ${token('color.border.accent.purple')}`,
		borderRadius: token('radius.small'),
		flexShrink: 0,
		height: '36px',
		width: '36px',
	},
	statusBar: {
		alignItems: 'center',
		backgroundColor: token('color.background.selected'),
		borderRadius: token('radius.medium'),
		display: 'flex',
		justifyContent: 'space-between',
		paddingBlock: token('space.150'),
		paddingInline: token('space.150'),
	},
	statusButton: {
		alignItems: 'center',
		backgroundColor: token('color.background.selected'),
		border: `${token('border.width')} solid ${token('color.border.selected')}`,
		borderRadius: token('radius.small'),
		display: 'inline-flex',
		gap: token('space.075'),
		paddingBlock: token('space.050'),
		paddingInline: token('space.100'),
	},
	segmentedControl: {
		backgroundColor: token('color.background.neutral.subtle'),
		borderRadius: token('radius.medium'),
		display: 'grid',
		gridTemplateColumns: '1fr 1fr',
		paddingBlockStart: token('space.050'),
		paddingInlineEnd: token('space.050'),
		paddingBlockEnd: token('space.050'),
		paddingInlineStart: token('space.050'),
	},
	segmentSelected: {
		backgroundColor: token('color.background.neutral'),
		border: `${token('border.width')} solid ${token('color.border')}`,
		borderRadius: token('radius.small'),
		paddingBlock: token('space.050'),
		textAlign: 'center',
	},
	segment: {
		paddingBlock: token('space.050'),
		textAlign: 'center',
	},
	sectionHeading: {
		alignItems: 'center',
		display: 'flex',
		gap: token('space.100'),
	},
	documentChip: {
		alignItems: 'center',
		border: `${token('border.width')} solid ${token('color.border')}`,
		borderRadius: token('radius.small'),
		display: 'inline-flex',
		gap: token('space.050'),
		maxWidth: '100%',
		paddingBlock: token('space.025'),
		paddingInline: token('space.075'),
	},
	list: {
		marginBlock: 0,
		paddingInlineStart: token('space.300'),
	},
	people: {
		display: 'flex',
		flexWrap: 'wrap',
		gap: token('space.100'),
	},
	person: {
		alignItems: 'center',
		display: 'flex',
		gap: token('space.075'),
	},
	detailRows: {
		display: 'grid',
		gap: token('space.300'),
	},
});

export default function ConfluenceEpicPanel(): React.JSX.Element {
	return (
		<PanelContainer>
			<PanelHeader>
				<PanelTitle icon={<WorkItemIcon label="" />}>Jira work item</PanelTitle>
				<PanelActionGroup>
					<PanelActionNewTab href="#" label="Open work item in new tab" />
					<PanelActionCloseSmart label="Close work item" />
				</PanelActionGroup>
			</PanelHeader>
			<PanelContent>
				<PanelBody>
					<Stack space="space.300">
						<div css={styles.issueKeyRow}>
							<Inline alignBlock="center" space="space.075">
								<EpicIcon label="" color={token('color.icon.accent.purple')} />
								<Text color="color.text.subtle">CAT-2001</Text>
							</Inline>
							<Inline space="space.025">
								<IconButton appearance="subtle" icon={PremiumIcon} label="AI actions" />
								<IconButton appearance="subtle" icon={ShareIcon} label="Share" />
								<IconButton appearance="subtle" icon={AppsIcon} label="Add app" />
								<IconButton appearance="subtle" icon={AddIcon} label="Add" />
								<IconButton appearance="subtle" icon={BranchIcon} label="Development" />
							</Inline>
						</div>

						<div css={styles.issueTitle}>
							<Box xcss={styles.issueType} />
							<Heading size="large" as="h2">
								ADS Panel System Beta Release
							</Heading>
						</div>

						<div css={styles.statusBar}>
							<div css={styles.statusButton}>
								<Text color="color.text.selected">◐ In Progress</Text>
								<ChevronDownIcon label="" size="small" />
							</div>
							<Inline alignBlock="center" space="space.075">
								<LockLockedIcon label="Private" />
								<EyeOpenIcon label="Watching" />
								<Text>1</Text>
								<IconButton appearance="subtle" icon={ShowMoreHorizontalIcon} label="More" />
							</Inline>
						</div>

						<div css={styles.segmentedControl}>
							<div css={styles.segmentSelected}>
								<Text weight="medium">Overview</Text>
							</div>
							<div css={styles.segment}>
								<Text weight="medium">Automation</Text>
							</div>
						</div>

						<Stack space="space.250">
							<div css={styles.sectionHeading}>
								<ChevronDownIcon label="" size="small" />
								<Heading size="small" as="h3">
									Key details
								</Heading>
							</div>
							<Stack space="space.150">
								<Text color="color.text.subtle">Description</Text>
								<div css={styles.documentChip}>
									<WorkItemIcon label="" color={token('color.icon.brand')} />
									<Text color="color.link">ADS Panel System [N] | One Pager</Text>
								</div>
								<div css={styles.documentChip}>
									<WorkItemIcon label="" color={token('color.icon.brand')} />
									<Text color="color.link">Project poster: ADS Panel System</Text>
								</div>
								<Text>
									The ADS Panel System is a composable set of React components and hooks for
									consistent, responsive, context-aware surfaces that support cross-product
									workflows. Key features include:
								</Text>
								<Box as="ul" xcss={styles.list}>
									<li>
										<Text>
											<strong>Presentational and container components</strong> for flexible panel
											experiences.
										</Text>
									</li>
									<li>
										<Text>
											<strong>Shared layout behaviour</strong> across Jira and Confluence.
										</Text>
									</li>
								</Box>
								<Text color="color.text.subtle">See more</Text>
							</Stack>

							<Stack space="space.100">
								<Text color="color.text.subtle">Assignee</Text>
								<div css={styles.person}>
									<Avatar size="small" name="Alex Chen" />
									<Text>Alex Chen</Text>
								</div>
							</Stack>

							<Stack space="space.100">
								<Text color="color.text.subtle">Contributors</Text>
								<div css={styles.people}>
									{['Jordan Lee', 'Morgan Smith', 'Casey Patel', 'Sam Rivera'].map((name) => (
										<div css={styles.person} key={name}>
											<Avatar size="small" name={name} />
											<Text>{name}</Text>
										</div>
									))}
								</div>
							</Stack>
						</Stack>

						<Stack space="space.250">
							<div css={styles.issueKeyRow}>
								<div css={styles.sectionHeading}>
									<ChevronDownIcon label="" size="small" />
									<Heading size="small" as="h3">
										Details
									</Heading>
								</div>
								<IconButton
									appearance="subtle"
									icon={ShowMoreHorizontalIcon}
									label="More details"
								/>
							</div>
							<div css={styles.detailRows}>
								<Text color="color.text.subtle">◇ Labels</Text>
								<Text color="color.text.subtle">ϟ Parent</Text>
								<Stack space="space.050">
									<Text color="color.text.subtle">Start date</Text>
									<Text>21 Jul 2025</Text>
								</Stack>
								<Stack space="space.050">
									<Text color="color.text.subtle">Due date</Text>
									<Text>26 Jun 2026 ⚠</Text>
								</Stack>
								<Text color="color.text.subtle">◴ Original estimate</Text>
								<Text color="color.text.subtle">◴ Time tracking</Text>
								<Text color="color.text.subtle">◎ Goals</Text>
							</div>
						</Stack>
					</Stack>
				</PanelBody>
			</PanelContent>
		</PanelContainer>
	);
}

/**
 * @jsxRuntime classic
 * @jsx jsx
 * The code in this file is merely a placeholder for the modal and will be changed in a separate PR.
 */

import { cssMap, jsx } from '@atlaskit/css';
import AiGenerativeRemoveIcon from '@atlaskit/icon-lab/core/ai-generative-remove';
import AiGenerativeTextIcon from '@atlaskit/icon-lab/core/ai-generative-text';
import AiSearchIcon from '@atlaskit/icon-lab/core/ai-search';
import Link from '@atlaskit/link';
import { Box, Pressable, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		backgroundColor: token('elevation.surface.overlay'),
		boxShadow: token('elevation.shadow.overlay'),
		borderRadius: token('radius.large'),
		width: '400px',
		overflow: 'hidden',
		display: 'flex',
		flexDirection: 'column',
	},
	header: {
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
	title: {
		font: token('font.body'),
		fontWeight: token('font.weight.bold'),
	},
	divider: {
		height: '1px',
		backgroundColor: token('color.background.neutral.hovered'),
		marginInline: token('space.200'),
	},
	actions: {
		paddingTop: token('space.150'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.150'),
		paddingLeft: token('space.200'),
	},
	pressable: {
		display: 'contents',
	},
	actionButtonBase: {
		display: 'flex',
		alignItems: 'center',
		gap: token('space.100'),
		paddingTop: token('space.050'),
		paddingRight: token('space.150'),
		paddingBottom: token('space.050'),
		paddingLeft: token('space.150'),
		borderRadius: token('radius.xlarge'),
		cursor: 'pointer',
		font: token('font.body'),
		width: 'fit-content',
	},
	actionButtonImproveDraft: {
		border: `${token('border.width')} solid ${token('color.border.accent.purple')}`,
		backgroundColor: token('color.background.accent.purple.subtlest'),
		'&:hover': { backgroundColor: token('color.background.accent.purple.subtlest.hovered') },
	},
	actionButtonFindRelated: {
		border: `${token('border.width')} solid ${token('color.border.accent.orange')}`,
		backgroundColor: token('color.background.accent.orange.subtlest'),
		'&:hover': { backgroundColor: token('color.background.accent.orange.subtlest.hovered') },
	},
	actionButtonCreateActions: {
		border: `${token('border.width')} solid ${token('color.border.accent.lime')}`,
		backgroundColor: token('color.background.accent.lime.subtlest'),
		'&:hover': { backgroundColor: token('color.background.accent.lime.subtlest.hovered') },
	},
	actionButtonShowRelevance: {
		border: `${token('border.width')} solid ${token('color.border')}`,
		backgroundColor: token('elevation.surface.sunken'),
		'&:hover': { backgroundColor: token('color.background.neutral.hovered') },
	},
});

export interface RovoPostAuthActionsModalProps {
	testId?: string;
	title: string;
	url: string;
}

export const RovoPostAuthActionsModal = ({ title, url, testId }: RovoPostAuthActionsModalProps) => {
	return (
		<Stack xcss={styles.container} testId={testId} space="space.0">
			<Stack xcss={styles.header} space="space.100">
				<Box xcss={styles.title}>
					<Link href={url}>{title}</Link>
				</Box>
			</Stack>
			<Box xcss={styles.divider} />
			<Stack xcss={styles.actions} space="space.100" alignInline="start">
				<Pressable xcss={styles.pressable}>
					<span css={[styles.actionButtonBase, styles.actionButtonImproveDraft]}>
						<AiGenerativeRemoveIcon label="Improve draft icon" color={token('color.icon.accent.purple')} size="small" />
					</span>
				</Pressable>
				<Pressable xcss={styles.pressable}>
					<span css={[styles.actionButtonBase, styles.actionButtonFindRelated]}>
						<AiSearchIcon label="Find related icon" color={token('color.icon.accent.orange')} size="small" />
					</span>
				</Pressable>
				<Pressable xcss={styles.pressable}>
					<span css={[styles.actionButtonBase, styles.actionButtonCreateActions]}>
						<AiGenerativeTextIcon label="Create actions icon" color={token('color.icon.accent.lime')} size="small" />
					</span>
				</Pressable>
				<Pressable xcss={styles.pressable}>
					<span css={[styles.actionButtonBase, styles.actionButtonShowRelevance]}>
						<AiGenerativeTextIcon label="Show relevance icon" color={token('color.icon.subtle')} size="small" />
					</span>
				</Pressable>
			</Stack>
		</Stack>
	);
};

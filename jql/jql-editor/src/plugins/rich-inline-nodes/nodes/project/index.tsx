import React from 'react';

import { cssMap } from '@atlaskit/css';
import { ResourcedEmoji } from '@atlaskit/emoji';
import ProjectIcon from '@atlaskit/icon/core/project';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { useIntl } from '../../../../state';
import type { NodeViewProps } from '../../util/react-node-view';
import { NodeBase } from '../base';

import { messages } from './messages';
import type { ProjectNodeProps } from './types';

const styles = cssMap({
	emojiWrapper: {
		display: 'flex',
		height: '16px',
		alignItems: 'center',
		marginBlockStart: token('space.negative.025'),
	},

	projectIconWrapper: {
		paddingTop: token('space.025'),
		paddingRight: token('space.025'),
		paddingBottom: token('space.025'),
		paddingLeft: token('space.025'),
	},
});

const getTownsquareEmojiProvider = () => {
	// Dynamically import the emoji provider to prevent an unnecessary network call from being made on module import
	return import(
		/* webpackChunkName: "@atlaskit-internal_@atlaskit/jql-editor/plugins/rich-inline-nodes/nodes/base" */ '@atlaskit/townsquare-emoji-provider'
	).then((mod) => mod.emojiProvider);
};

/**
 * ProjectNode Component
 *
 * This component is a component for rendering a pill-like view for Project (Atlas) node type
 * in the JQL editor
 */
export const ProjectNode = (props: NodeViewProps<ProjectNodeProps>) => {
	const { emojiName, isRestricted, text, ...rest } = props;
	const [{ formatMessage }] = useIntl();

	const townsquareEmojiProvider = getTownsquareEmojiProvider();

	return (
		<NodeBase
			iconBefore={
				emojiName ? (
					<Box xcss={styles.emojiWrapper}>
						<ResourcedEmoji
							emojiProvider={townsquareEmojiProvider}
							emojiId={{ shortName: emojiName }}
							fitToHeight={16}
						/>
					</Box>
				) : (
					<Box xcss={styles.projectIconWrapper}>
						<ProjectIcon size="small" label="" />
					</Box>
				)
			}
			text={isRestricted ? formatMessage(messages.restrictedProject) : text}
			{...rest}
			isLocked={isRestricted}
		/>
	);
};

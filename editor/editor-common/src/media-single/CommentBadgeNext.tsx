import React, { useMemo } from 'react';

import { useIntl } from 'react-intl-next';

import CommentIcon from '@atlaskit/icon/core/comment';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Pressable, xcss } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import { commentMessages as messages } from '../media';

type CommentBadgeProps = {
	mediaSingleElement?: HTMLElement | null;
	onClick: (e: React.MouseEvent) => void;
	onMouseEnter?: (e: React.MouseEvent) => void;
	onMouseLeave?: (e: React.MouseEvent) => void;
	status?: 'default' | 'entered' | 'active';
};

const baseStyles = xcss({
	borderRadius: 'radius.small',
});

const mediumBadgeStyles = xcss({
	height: 'space.300',
	width: 'space.300',
});

export const CommentBadgeNext = ({
	status = 'default',
	onClick,
	onMouseEnter,
	onMouseLeave,
}: CommentBadgeProps): React.JSX.Element => {
	const intl = useIntl();
	const title = intl.formatMessage(messages.viewCommentsOnMedia);

	const colourToken = useMemo(() => {
		switch (status) {
			case 'active':
				return 'color.background.accent.yellow.subtlest.pressed';
			case 'entered':
				return 'color.background.accent.yellow.subtlest.hovered';
			default:
				return 'color.background.accent.yellow.subtlest';
		}
	}, [status]);

	return (
		<Tooltip position="top" content={title}>
			<Pressable
				xcss={[baseStyles, mediumBadgeStyles]}
				padding="space.0"
				onClick={onClick}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				backgroundColor={colourToken}
			>
				<CommentIcon label={title} spacing="spacious" color="currentColor" />
			</Pressable>
		</Tooltip>
	);
};

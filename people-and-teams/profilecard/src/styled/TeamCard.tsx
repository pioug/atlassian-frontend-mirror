import React from 'react';

import { cssMap, cx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { Box, Inline, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	teamforbiddenerrorstatewrapper: {
		width: '320px',
		position: 'relative',
	},
	teamname: {
		font: token('font.heading.medium'),
		textTransform: 'none',
		overflow: 'hidden',
		maxHeight: '48px',
		display: '-webkit-box',
	},
	membercount: {
		color: token('color.text.subtlest'),
		marginTop: token('space.050'),
	},
	avatarsection: {
		marginTop: token('space.200'),
		marginLeft: token('space.negative.025'),
	},
	descriptionwrapper: {
		marginTop: token('space.200'),
		alignItems: 'center',
		display: 'flex',
	},
	description: {
		overflow: 'hidden',
		maxHeight: '60px',
		display: '-webkit-box',
	},
	actionbuttons: {
		width: '100%',
		display: 'flex',
		justifyContent: 'space-between',
		marginTop: token('space.300'),
		marginRight: token('space.negative.300'),
		marginBottom: '0',
		marginLeft: token('space.negative.100'),
	},
	wrappedbutton: {
		flexBasis: 0,
		flexGrow: 1,
		marginLeft: token('space.100'),
	},
	morebutton: {
		marginLeft: token('space.100'),
	},
	accesslocksvgwrapper: {
		marginBottom: token('space.300'),
	},
	archiveLozengeWrapper: {
		marginTop: token('space.050'),
	},
});

export const TeamForbiddenErrorStateWrapper = (props: {
	children: React.ReactNode;
	testId?: string;
}): React.JSX.Element => <Box xcss={cx(styles.teamforbiddenerrorstatewrapper)} {...props} />;

export const TeamName = (props: { children: React.ReactNode }): React.JSX.Element => (
	<Box xcss={cx(styles.teamname)}>
		<Heading size="medium" as="h2" children={props.children} />
	</Box>
);

export const MemberCount = (props: { children: React.ReactNode }): React.JSX.Element => (
	<Box xcss={cx(styles.membercount)} {...props} />
);

export const AvatarSection = (props: { children: React.ReactNode }): React.JSX.Element => (
	<Box xcss={cx(styles.avatarsection)} {...props} />
);

export const DescriptionWrapper = (props: { children: React.ReactNode }): React.JSX.Element => (
	<Box xcss={cx(styles.descriptionwrapper)} {...props} />
);

export const Description = (props: { children: React.ReactNode }): React.JSX.Element => (
	<Box xcss={cx(styles.description)}>
		<Text maxLines={3} {...props} />
	</Box>
);

export const ActionButtons = (props: { children: React.ReactNode }): React.JSX.Element => (
	<Box xcss={cx(styles.actionbuttons)} backgroundColor="elevation.surface.overlay" {...props} />
);

export const WrappedButton = (props: { children: React.ReactNode }): React.JSX.Element => (
	<Box xcss={cx(styles.wrappedbutton)} {...props} />
);

export const MoreButton = (props: { children: React.ReactNode }): React.JSX.Element => (
	<Box xcss={cx(styles.morebutton)} {...props} />
);

export const AccessLockSVGWrapper = (props: { children: React.ReactNode }): React.JSX.Element => (
	<Box xcss={cx(styles.accesslocksvgwrapper)} {...props} />
);

export const ArchiveLozengeWrapper = (props: { children: React.ReactNode }) => (
	<Inline xcss={cx(styles.archiveLozengeWrapper)} {...props} />
);

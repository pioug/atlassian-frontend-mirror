import React from 'react';

import { cssMap, cx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Inline, Text } from '@atlaskit/primitives/compiled';
import { N200 } from '@atlaskit/theme/colors';
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
		color: token('color.text.subtlest', N200),
		marginTop: token('space.050', '4px'),
	},
	avatarsection: {
		marginTop: token('space.200', '16px'),
		marginLeft: token('space.negative.025', '-2px'),
	},
	descriptionwrapper: {
		marginTop: token('space.200', '16px'),
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
		marginTop: token('space.300', '24px'),
		marginRight: token('space.negative.300', '-24px'),
		marginBottom: '0',
		marginLeft: token('space.negative.100', '-8px'),
	},
	wrappedbutton: {
		flexBasis: 0,
		flexGrow: 1,
		marginLeft: token('space.100', '8px'),
	},
	morebutton: {
		marginLeft: token('space.100', '8px'),
	},
	accesslocksvgwrapper: {
		marginBottom: token('space.300', '24px'),
	},
	archiveLozengeWrapper: {
		marginTop: token('space.050', '4px'),
	},
});

export const TeamForbiddenErrorStateWrapper = (props: {
	children: React.ReactNode;
	testId?: string;
}): React.JSX.Element => <Box xcss={cx(styles.teamforbiddenerrorstatewrapper)} {...props} />;

export const TeamName = (props: { children: React.ReactNode }): React.JSX.Element =>
	fg('enable_profilecard_h2tag_a11y_fix') ? (
		<Box xcss={cx(styles.teamname)}>
			<Heading size="medium" as="h2" children={props.children} />
		</Box>
	) : (
		<Box xcss={cx(styles.teamname)} {...props} />
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

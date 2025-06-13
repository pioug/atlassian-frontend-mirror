/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import Avatar from '@atlaskit/avatar';
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import PullRequestIcon from '@atlaskit/icon/core/migration/pull-request--bitbucket-pullrequests';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/migration/show-more-horizontal--more';
import { AtlassianIcon } from '@atlaskit/logo';
import Lozenge from '@atlaskit/lozenge';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: token('elevation.surface.raised'),
		paddingTop: token('space.150'),
		paddingRight: token('space.150'),
		paddingBottom: token('space.150'),
		paddingLeft: token('space.150'),
		transition: '200ms',
		borderRadius: token('border.radius.100'),
		boxShadow: token('elevation.shadow.raised'),
		'&:hover': {
			backgroundColor: token('elevation.surface.hovered'),
		},
	},

	inline: {
		display: 'flex',
		alignItems: 'center',
	},

	extraInfo: {
		display: 'flex',
		justifyContent: 'space-between',
		paddingBlock: token('space.050'),
	},
});

export default function Example() {
	return (
		<Stack xcss={styles.container} space="space.100">
			<Text as="span">
				Dropdown menu items in Modal are not accessible to keyboard/screen readers in Safari
			</Text>
			<Box as="span">
				<Lozenge appearance="new">Accelerate Cloud Accessibility</Lozenge>
			</Box>
			<Box xcss={styles.extraInfo}>
				<Box xcss={styles.inline}>
					<AtlassianIcon appearance="brand" size="small" label="" />
					<Heading size="xxsmall">DSP-9786</Heading>
				</Box>
				<Inline space="space.100" alignBlock="center">
					<PullRequestIcon LEGACY_size="small" label="" />
					<ShowMoreHorizontalIcon LEGACY_size="small" label="" />
					<Avatar size="small" />
				</Inline>
			</Box>
		</Stack>
	);
}

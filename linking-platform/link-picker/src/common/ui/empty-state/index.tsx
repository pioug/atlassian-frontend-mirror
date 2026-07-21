/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, cx, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Flex, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	containerV2: {
		paddingTop: token('space.300'),
		paddingRight: token('space.600'),
		paddingLeft: token('space.600'),
		paddingBottom: token('space.500'),
		textAlign: 'center',
	},
	// Explicitly reset `white-space` to `normal` so that an ancestor's `white-space: nowrap`
	// (e.g. from the Jira backlog inline-card-create placeholder container) cannot be inherited
	// into this component when the Popup uses `shouldRenderToParent`. Without this reset, the
	// heading and description text cannot wrap, causing them to overflow the Popup boundary.
	whiteSpaceNormal: {
		whiteSpace: 'normal',
	},
});

type EmptyStateProps = {
	header: string;
	testId?: string;
	description?: React.ReactNode;
	renderImage?: () => React.ReactNode;
	/** Only rendered if fg `platform-linking-visual-refresh-link-picker` is enabled */
	action?: React.ReactNode;
};

export const EmptyState = ({
	testId,
	header,
	description,
	action,
	renderImage,
}: EmptyStateProps): JSX.Element => {
	return (
		<Flex
			xcss={cx(
				styles.containerV2,
				fg('platform_link_picker_fix_error_state_text_overflow') && styles.whiteSpaceNormal,
			)}
			testId={testId}
			direction="column"
			alignItems="center"
			gap="space.200"
		>
			{renderImage?.()}

			<Heading size="small" as="h2">
				{header}
			</Heading>

			{description && (
				<Text as="p" color="color.text">
					{description}
				</Text>
			)}

			{action && action}
		</Flex>
	);
};

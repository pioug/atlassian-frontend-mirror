/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
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
}: EmptyStateProps) => {
	return (
		<Flex
			xcss={styles.containerV2}
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

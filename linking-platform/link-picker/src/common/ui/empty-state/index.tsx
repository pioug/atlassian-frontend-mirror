/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { fg } from '@atlaskit/platform-feature-flags';
import { Flex, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		marginBlockStart: token('space.600'),
		marginBlockEnd: token('space.600'),
		textAlign: 'center',
	},
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
	if (fg('platform-linking-visual-refresh-link-picker')) {
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
	}

	return (
		<Flex
			xcss={styles.container}
			testId={testId}
			direction="column"
			alignItems="center"
			gap="space.300"
		>
			{renderImage?.()}
			<Flex direction="column" alignItems="center" gap="space.200">
				<Heading size="medium" as="h2">
					{header}
				</Heading>
				{description && (
					<Text as="p" color="color.text">
						{description}
					</Text>
				)}
			</Flex>
		</Flex>
	);
};

/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { fg } from '@atlaskit/platform-feature-flags';
import { Flex, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { EmptyStateOld } from './old';

const styles = cssMap({
	container: {
		marginBlockStart: token('space.600'),
		marginBlockEnd: token('space.600'),
		textAlign: 'center',
	},
});

type EmptyStateProps = {
	header: string;
	testId?: string;
	description?: React.ReactNode;
	renderImage?: () => React.ReactNode;
};

export const EmptyStateNew = ({ testId, header, description, renderImage }: EmptyStateProps) => {
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

export const EmptyState = (props: EmptyStateProps) => {
	if (fg('platform_bandicoots-link-picker-css')) {
		return <EmptyStateNew {...props} />;
	}
	return <EmptyStateOld {...props} />;
};

/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	emptyState: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.100'),
		height: '100%',
		justifyContent: 'center',
		marginLeft: token('space.300'),
		marginRight: token('space.300'),
		textAlign: 'center',
	},
	description: {
		marginTop: token('space.0'),
		marginBottom: token('space.300'),
		color: token('color.text'),
	},
});

type EmptyStateProps = {
	header: string;
	testId?: string;
	description?: React.ReactNode;
	renderImage?: () => React.ReactNode;
};

export const EmptyState = ({ testId, header, description, renderImage }: EmptyStateProps) => {
	return (
		<Box xcss={styles.emptyState} testId={testId}>
			{renderImage?.()}
			<Heading size="small" as="h2">
				{header}
			</Heading>
			{description && (
				<Box as="p" xcss={styles.description}>
					{description}
				</Box>
			)}
		</Box>
	);
};

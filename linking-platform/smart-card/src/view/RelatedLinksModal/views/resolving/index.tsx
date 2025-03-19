/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import Spinner from '@atlaskit/spinner';

const styles = cssMap({
	style: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		justifyContent: 'center',
	},
});

const RelatedLinksResolvingView = () => (
	<Box xcss={styles.style} testId="related-links-resolving-view">
		<Spinner size="large" testId="related-links-resolving-view-spinner" />
	</Box>
);

export default RelatedLinksResolvingView;

/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import Spinner from '@atlaskit/spinner';

import RelatedLinksResolvingViewOld from './RelatedLinksResolvingViewOld';

const styles = cssMap({
	style: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		justifyContent: 'center',
	},
});

const RelatedLinksResolvingViewNew = () => (
	<Box xcss={styles.style} testId="related-links-resolving-view">
		<Spinner size="large" testId="related-links-resolving-view-spinner" />
	</Box>
);

const RelatedLinksResolvingView = () => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <RelatedLinksResolvingViewNew />;
	}
	return <RelatedLinksResolvingViewOld />;
};

export default RelatedLinksResolvingView;

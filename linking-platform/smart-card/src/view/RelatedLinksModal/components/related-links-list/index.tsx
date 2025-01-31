/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { FormattedMessage } from 'react-intl-next';

import { cssMap, jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { messages } from '../../../../messages';
import RelatedLinkItem from '../related-link-item';
import { type RelatedLinksListProp } from '../types';

import RelatedLinksListOld from './RelatedLinksListOld';

const styles = cssMap({
	sectionTitle: {
		font: token('font.heading.xxsmall'),
		paddingBlockStart: token('space.050'),
	},
	boxStyle: {
		font: token('font.body.small'),
		paddingBlock: token('space.100'),
	},
});

const RelatedLinksList = ({ urls, title, testId }: RelatedLinksListProp) => {
	return (
		<Stack testId={testId}>
			<Box xcss={styles.sectionTitle}>
				<FormattedMessage {...title} />
			</Box>
			{urls.length > 0 && (
				<Box>
					{urls.map((url, idx) => (
						<Stack key={`${idx}-${url}`}>
							<RelatedLinkItem url={url} testId={`${testId}-item-${idx}`} />
						</Stack>
					))}
				</Box>
			)}
			{urls.length === 0 && (
				<Box xcss={styles.boxStyle}>
					<FormattedMessage {...messages.related_links_not_found} />
				</Box>
			)}
		</Stack>
	);
};

const RelatedLinksListExported = (props: RelatedLinksListProp) => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <RelatedLinksList {...props} />;
	} else {
		return <RelatedLinksListOld {...props} />;
	}
};

export default RelatedLinksListExported;

/** @jsx jsx */

import { jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { Box, Stack, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import RelatedLinkItem from '../related-link-item';
import { type RelatedLinksListProp } from '../types';
import { messages } from '../../../../messages';

const RelatedLinksList = ({ urls, title, testId }: RelatedLinksListProp) => {
	return (
		<Stack testId={testId}>
			<Box
				paddingBlockStart="space.050"
				xcss={xcss({
					font: token('font.heading.xxsmall'),
					textTransform: 'uppercase',
				})}
			>
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
				<Box paddingBlock="space.100" xcss={xcss({ font: token('font.body.small') })}>
					<FormattedMessage {...messages.related_links_not_found} />
				</Box>
			)}
		</Stack>
	);
};

export default RelatedLinksList;

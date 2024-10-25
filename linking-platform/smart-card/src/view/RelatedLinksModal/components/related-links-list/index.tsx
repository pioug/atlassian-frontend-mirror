/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { Box, Stack, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { messages } from '../../../../messages';
import RelatedLinkItem from '../related-link-item';
import { type RelatedLinksListProp } from '../types';

const RelatedLinksList = ({ urls, title, testId }: RelatedLinksListProp) => {
	return (
		<Stack testId={testId}>
			<Box
				paddingBlockStart="space.050"
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
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
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				<Box paddingBlock="space.100" xcss={xcss({ font: token('font.body.small') })}>
					<FormattedMessage {...messages.related_links_not_found} />
				</Box>
			)}
		</Stack>
	);
};

export default RelatedLinksList;

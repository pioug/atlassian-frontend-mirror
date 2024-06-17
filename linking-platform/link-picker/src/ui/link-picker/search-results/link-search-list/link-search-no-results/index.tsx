/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { defineMessages, useIntl } from 'react-intl-next';

import EmptyState from '@atlaskit/empty-state';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { EmptyState as EmptyStateInternal } from '../../../../../common/ui/empty-state';

import { NoResultsSVG } from './no-results-svg';
import { emptyStateWrapperStyles } from './styled';

export const messages = defineMessages({
	noResults: {
		id: 'fabric.linkPicker.search.noResults.heading',
		defaultMessage: 'We couldn’t find anything matching your search.',
		description: 'Heading message shown when a search has no results',
	},
	noResultsDescription: {
		id: 'fabric.linkPicker.search.noResults.description',
		defaultMessage: 'Try again with a different term.',
		description: 'Describes possible action when a search returns no results',
	},
});

export const testIds = {
	emptyResultPage: 'link-search-no-results',
};

export const NoResults = () => {
	const intl = useIntl();

	const Component = getBooleanFF('platform.linking-platform.link-picker.remove-dst-empty-state')
		? EmptyStateInternal
		: EmptyState;

	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<div css={emptyStateWrapperStyles}>
			<Component
				testId={testIds.emptyResultPage}
				header={intl.formatMessage(messages.noResults)}
				headingLevel={
					getBooleanFF('platform.linking-platform.link-picker.remove-dst-empty-state')
						? undefined
						: 3
				}
				description={intl.formatMessage(messages.noResultsDescription)}
				renderImage={() => <NoResultsSVG />}
			/>
		</div>
	);
};

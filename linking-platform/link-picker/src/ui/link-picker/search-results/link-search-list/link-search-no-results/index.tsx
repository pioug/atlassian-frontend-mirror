import React from 'react';

import { defineMessages, useIntl } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';

import { EmptyState } from '../../../../../common/ui/empty-state';

import { NoResultsSVG } from './no-results-svg';

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

export const NoResults = ({ shouldRenderImage = true }: { shouldRenderImage?: boolean }) => {
	const intl = useIntl();

	return (
		<EmptyState
			testId={testIds.emptyResultPage}
			header={intl.formatMessage(messages.noResults)}
			description={intl.formatMessage(messages.noResultsDescription)}
			renderImage={
				!shouldRenderImage && fg('aifc_create_enabled') ? undefined : () => <NoResultsSVG />
			}
		/>
	);
};

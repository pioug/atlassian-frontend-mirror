/** @jsx jsx */
import { jsx } from '@emotion/react';
import EmptyState from '@atlaskit/empty-state';
import { useIntl, defineMessages } from 'react-intl-next';

import NoResultsSVG from './no-results-svg';
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

const NoResults = () => {
  const intl = useIntl();

  return (
    <div css={emptyStateWrapperStyles}>
      <EmptyState
        testId={testIds.emptyResultPage}
        header={intl.formatMessage(messages.noResults)}
        description={intl.formatMessage(messages.noResultsDescription)}
        renderImage={() => <NoResultsSVG />}
      />
    </div>
  );
};

export default NoResults;

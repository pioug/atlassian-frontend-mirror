import React from 'react';

import { messages } from '../../../../../../messages';
import Block from '../../block';
import RelatedUrlsList from './related-url-list';
import { type RelatedUrlsProps } from './types';

export const RelatedUrlsResolvedView: React.FC<RelatedUrlsProps> = ({
  relatedUrlsResponse: { resolvedResults },
  renderers,
  testId,
  initializeOpened,
  ...blockProps
}) => {
  return (
    <Block {...blockProps} testId={testId}>
      {resolvedResults && (
        <RelatedUrlsList
          testId={`${testId}-list`}
          renderers={renderers}
          initializeOpened={initializeOpened}
          title={messages.last_mentioned_in}
          resolvedResults={resolvedResults}
        />
      )}
    </Block>
  );
};

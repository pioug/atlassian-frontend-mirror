import React from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import Button from '@atlaskit/button';

import NotFoundIllustration from './NotFoundIllustration';

type Props = {
  onExternalLinkClick: () => void;
};

export default function EmptyState({
  onExternalLinkClick,
}: Props): JSX.Element {
  return (
    <EmptyStateWrapper>
      <NotFoundIllustration />
      <EmptyStateHeading>
        <FormattedMessage
          id="fabric.editor.elementbrowser.search.empty-state.heading"
          defaultMessage="Nothing matches your search"
          description="Empty state heading"
        />
      </EmptyStateHeading>
      <EmptyStateSubHeading>
        <p>
          <FormattedMessage
            id="fabric.editor.elementbrowser.search.empty-state.sub-heading"
            defaultMessage="Try searching with a different term or discover new apps for Atlassian products."
            description="Empty state sub-heading"
          />
        </p>
        <ExternalLinkWrapper>
          <Button
            appearance="primary"
            target="_blank"
            href="https://marketplace.atlassian.com/search?category=Macros&hosting=cloud&product=confluence"
            onClick={onExternalLinkClick}
          >
            <FormattedMessage
              id="fabric.editor.elementbrowser.search.empty-state.sub-heading.link"
              defaultMessage="Explore Atlassian Marketplace"
              description="Empty state sub-heading external link"
            />
          </Button>
        </ExternalLinkWrapper>
      </EmptyStateSubHeading>
    </EmptyStateWrapper>
  );
}

const EmptyStateHeading = styled.div`
  font-size: 1.42857em;
  line-height: 1.2;
  color: rgb(23, 43, 77);
  font-weight: 500;
  letter-spacing: -0.008em;
  margin-top: 28px;
`;

const EmptyStateSubHeading = styled.div`
  margin-top: 16px;
  max-width: 400px;
  text-align: center;
`;

const EmptyStateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const ExternalLinkWrapper = styled.div`
  margin-top: 14px;
`;

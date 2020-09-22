import React from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

import OpenIcon from '@atlaskit/icon/glyph/open';
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
        <FormattedMessage
          id="fabric.editor.elementbrowser.search.empty-state.sub-heading"
          defaultMessage="Try searching again using different terms or"
          description="Empty state sub-heading"
        />
        <br />
        <ExternalLink
          target="_blank"
          href="https://marketplace.atlassian.com/search?category=Macros&hosting=cloud&product=confluence"
          onClick={onExternalLinkClick}
        >
          <FormattedMessage
            id="fabric.editor.elementbrowser.search.empty-state.sub-heading.link"
            defaultMessage="explore apps from Atlassian Marketplace"
            description="Empty state sub-heading external link"
          />
          <OpenIcon label="external-link" />
        </ExternalLink>
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

const EmptyStateSubHeading = styled.p`
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

const ExternalLink = styled.a`
  display: inline-flex;
  align-items: center;
`;

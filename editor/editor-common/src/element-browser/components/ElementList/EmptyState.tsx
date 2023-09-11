/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import Button from '@atlaskit/button';
import { token } from '@atlaskit/tokens';

import NotFoundIllustration from './NotFoundIllustration';

type Props = {
  onExternalLinkClick: () => void;
};

export default function EmptyState({
  onExternalLinkClick,
}: Props): JSX.Element {
  return (
    <div css={emptyStateWrapper}>
      <NotFoundIllustration />
      <div css={emptyStateHeading}>
        <FormattedMessage
          id="fabric.editor.elementbrowser.search.empty-state.heading"
          defaultMessage="Nothing matches your search"
          description="Empty state heading"
        />
      </div>
      <div css={emptyStateSubHeading}>
        <p>
          <FormattedMessage
            id="fabric.editor.elementbrowser.search.empty-state.sub-heading"
            defaultMessage="Try searching with a different term or discover new apps for Atlassian products."
            description="Empty state sub-heading"
          />
        </p>
        <div css={externalLinkWrapper}>
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
        </div>
      </div>
    </div>
  );
}

const emptyStateHeading = css`
  font-size: 1.42857em;
  line-height: 1.2;
  color: ${token('color.text', 'rgb(23, 43, 77)')};
  font-weight: 500;
  letter-spacing: -0.008em;
  margin-top: 28px;
`;

const emptyStateSubHeading = css`
  margin-top: ${token('space.200', '16px')};
  max-width: 400px;
  text-align: center;
`;

const emptyStateWrapper = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const externalLinkWrapper = css`
  margin-top: 14px;
`;

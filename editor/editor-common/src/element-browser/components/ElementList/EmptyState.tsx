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
    <div css={emptyStateWrapper} data-testid="empty-state-wrapper">
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

const emptyStateHeading = css({
  fontSize: '1.42857em',
  lineHeight: 1.2,
  color: token('color.text', 'rgb(23, 43, 77)'),
  fontWeight: 500,
  letterSpacing: '-0.008em',
  marginTop: '28px',
});

const emptyStateSubHeading = css({
  marginTop: token('space.200', '16px'),
  maxWidth: '400px',
  textAlign: 'center',
});

const emptyStateWrapper = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
});

const externalLinkWrapper = css({
  marginTop: '14px',
});

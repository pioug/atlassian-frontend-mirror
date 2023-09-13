/** @jsx jsx */
import type { FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export interface CommentFieldProps {
  hasAuthor?: boolean;
  children?: ReactNode;
  href?: string;
  onClick?: (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => void;
  onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
  onMouseOver?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  testId?: string;
}

const textStyles = css({
  fontWeight: 'inherit',
  '&:not(:hover):not(:active)': {
    color: token('color.text.subtle', N500),
  },
});

const hasAuthorStyles = css({
  fontWeight: token('font.weight.medium', '500'),
});

/**
 * __Field__
 *
 * A field appears in the comment header to add metadata to the comment.
 *
 * @internal
 */
const Field: FC<CommentFieldProps> = ({
  children,
  hasAuthor,
  href,
  onClick,
  onFocus,
  onMouseOver,
  testId,
}) => {
  return href ? (
    <a
      href={href}
      css={[textStyles, hasAuthor && hasAuthorStyles]}
      onClick={onClick}
      onFocus={onFocus}
      onMouseOver={onMouseOver}
      data-testid={testId}
    >
      {children}
    </a>
  ) : (
    <span
      css={[textStyles, hasAuthor && hasAuthorStyles]}
      /**
       * It is not normally acceptable to add key handlers to non-interactive elements
       * as this is an accessibility anti-pattern. However, because this instance is
       * to add support for analtyics instead of creating an inaccessible
       * custom element, we can add role="presentation" so that there are no negative
       * impacts to assistive technologies.
       */
      role="presentation"
      onClick={onClick}
      onFocus={onFocus}
      onMouseOver={onMouseOver}
      data-testid={testId}
    >
      {children}
    </span>
  );
};

export default Field;

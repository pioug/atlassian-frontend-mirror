/* eslint-disable @repo/internal/react/use-primitives */
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
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <span
      css={[textStyles, hasAuthor && hasAuthorStyles]}
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

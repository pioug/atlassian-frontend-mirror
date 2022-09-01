/** @jsx jsx */
import { Component, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

interface CommentFieldProps {
  hasAuthor?: boolean;
  children?: ReactNode;
  href?: string;
  onClick?: (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => void;
  onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
  onMouseOver?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const textStyles = css({
  fontWeight: 'inherit',
  '&:not(:hover):not(:active)': {
    color: token('color.text.subtle', N500),
  },
});

const hasAuthorStyles = css({
  fontWeight: 500,
});

export default class CommentField extends Component<CommentFieldProps> {
  render() {
    const {
      children,
      hasAuthor,
      href,
      onClick,
      onFocus,
      onMouseOver,
    } = this.props;

    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return href ? (
      <a
        href={href}
        css={[textStyles, hasAuthor && hasAuthorStyles]}
        onClick={onClick}
        onFocus={onFocus}
        onMouseOver={onMouseOver}
      >
        {children}
      </a>
    ) : (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      <span
        css={[textStyles, hasAuthor && hasAuthorStyles]}
        onClick={onClick}
        onFocus={onFocus}
        onMouseOver={onMouseOver}
      >
        {children}
      </span>
    );
    /* eslint-enable jsx-a11y/no-static-element-interactions */
  }
}

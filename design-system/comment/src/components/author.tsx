/** @jsx jsx */
import React, { FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import {
  createAndFireEvent,
  UIAnalyticsEvent,
  withAnalyticsContext,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Field from './field';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export interface AuthorProps extends WithAnalyticsEventsProps {
  /**
   * The name of the author.
   */
  children?: ReactNode;
  /**
   * The URL of the link. If not provided, the element will be rendered as text.
   */
  href?: string;
  /**
   * Handler called when the element is clicked.
   */
  onClick?: (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => void;
  /**
   * Handler called when the element is focused.
   */
  onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
  /**
   * Handler called when the element is moused over.
   */
  onMouseOver?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const headingStyles = css({
  display: 'inline-block',
  color: token('color.text.subtle', N500),
  fontSize: token('font.size.100', '14px'),
  letterSpacing: '0',
});

const Author: FC<AuthorProps> = ({
  children,
  href,
  onClick,
  onFocus,
  onMouseOver,
}) => {
  return (
    <Field
      hasAuthor
      href={href}
      onClick={onClick}
      onFocus={onFocus}
      onMouseOver={onMouseOver}
    >
      <h3 css={headingStyles}>{children}</h3>
    </Field>
  );
};

Author.displayName = 'CommentAuthor';

export { Author as CommentAuthorWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'commentAuthor',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onClick: createAndFireEventOnAtlaskit({
      action: 'clicked',
      actionSubject: 'commentAuthor',
      attributes: {
        componentName: 'commentAuthor',
        packageName,
        packageVersion,
      },
    }),
  })(Author),
);

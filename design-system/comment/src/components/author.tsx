import React, { FC, ReactNode } from 'react';

import {
  createAndFireEvent,
  UIAnalyticsEvent,
  withAnalyticsContext,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';

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
      {children}
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

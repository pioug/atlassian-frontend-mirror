import React, { Component, ReactNode } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
  WithAnalyticsEventsProps,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';
import Field from './Field';

interface Props extends WithAnalyticsEventsProps {
  /** The name of the author. */
  children?: ReactNode;
  /** The URL of the link. If not provided, the element will be rendered as text. */
  href?: string;
  /** Handler called when the element is clicked. */
  onClick?: (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => void;
  /** Handler called when the element is focused. */
  onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
  /** Handler called when the element is moused over. */
  onMouseOver?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

class Author extends Component<Props, {}> {
  render() {
    const { children, href, onClick, onFocus, onMouseOver } = this.props;
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
  }
}

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

import React, { Component, ReactNode } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
  UIAnalyticsEvent,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';
import Field from './Field';

interface Props extends WithAnalyticsEventsProps {
  /** The time of the comment. */
  children?: ReactNode;
  /** The URL of the link. If not provided, the element will be rendered as text. */
  href?: string;
  /** Handler called when the element is clicked. */
  onClick?: (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => void;
  /** Handler called when the element is focused. */
  onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
  /** Handler called when the element is moused over. */
  onMouseOver?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

class Time extends Component<Props> {
  render() {
    const { children, href, onClick, onFocus, onMouseOver } = this.props;
    return (
      <Field
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

export { Time as CommentTimeWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'commentTime',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onClick: createAndFireEventOnAtlaskit({
      action: 'clicked',
      actionSubject: 'commentTime',

      attributes: {
        componentName: 'commentTime',
        packageName,
        packageVersion,
      },
    }),
  })(Time),
);

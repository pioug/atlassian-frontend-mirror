/** @jsx jsx */
import { Component, ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import {
  createAndFireEvent,
  withAnalyticsContext,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const editedContentStyles = css({
  color: token('color.text.subtlest', N200),
});

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

interface EditedProps extends WithAnalyticsEventsProps {
  /**
   * Content to render indicating that the comment has been edited.
   */
  children?: ReactNode;
  /**
   * Handler called when the element is focused.
   */
  onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
  /**
   * Handler called when the element is moused over.
   */
  onMouseOver?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

class Edited extends Component<EditedProps> {
  render() {
    const { children, onFocus, onMouseOver } = this.props;
    return (
      <span
        css={editedContentStyles}
        onFocus={onFocus}
        onMouseOver={onMouseOver}
      >
        {children}
      </span>
    );
  }
}

export { Edited as CommentEditedWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'commentEdited',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onClick: createAndFireEventOnAtlaskit({
      action: 'clicked',
      actionSubject: 'commentEdited',

      attributes: {
        componentName: 'commentEdited',
        packageName,
        packageVersion,
      },
    }),
  })(Edited),
);

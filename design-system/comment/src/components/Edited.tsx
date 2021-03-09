import React, { Component, ReactNode } from 'react';

import {
  createAndFireEvent,
  withAnalyticsContext,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';

import EditedStyles from '../styled/EditedStyles';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

interface Props extends WithAnalyticsEventsProps {
  /** Content to render indicating that the comment has been edited. */
  children?: ReactNode;
  /** Handler called when the element is focused. */
  onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
  /** Handler called when the element is moused over. */
  onMouseOver?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

class Edited extends Component<Props, {}> {
  render() {
    const { children, onFocus, onMouseOver } = this.props;
    return (
      <EditedStyles onFocus={onFocus} onMouseOver={onMouseOver}>
        {children}
      </EditedStyles>
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

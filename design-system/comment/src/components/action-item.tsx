import React, { FC, ReactNode } from 'react';

import {
  createAndFireEvent,
  UIAnalyticsEvent,
  withAnalyticsContext,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/custom-theme-button';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export interface CommentActionItemProps extends WithAnalyticsEventsProps {
  /**
   * The content to render inside the action button.
   */
  children?: ReactNode;
  /**
   * Set if the action button is disabled.
   */
  isDisabled?: boolean;
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

const ActionItem: FC<CommentActionItemProps> = ({
  children,
  onClick,
  onFocus,
  onMouseOver,
  isDisabled,
}) => {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, @repo/internal/react/use-primitives
    <span onClick={onClick} onFocus={onFocus} onMouseOver={onMouseOver}>
      <Button
        appearance="subtle-link"
        spacing="none"
        type="button"
        isDisabled={isDisabled}
      >
        {children}
      </Button>
    </span>
  );
};

export { ActionItem as CommentActionWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'commentAction',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onClick: createAndFireEventOnAtlaskit({
      action: 'clicked',
      actionSubject: 'commentAction',
      attributes: {
        componentName: 'commentAction',
        packageName,
        packageVersion,
      },
    }),
  })(ActionItem),
);

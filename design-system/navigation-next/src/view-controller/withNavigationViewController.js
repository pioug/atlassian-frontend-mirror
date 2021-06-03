import React from 'react';

import ViewControllerSubscriber from './ViewControllerSubscriber';

export default (WrappedComponent) => {
  const WithNavigationViewController = (props) => (
    <ViewControllerSubscriber>
      {(navigationViewController) => (
        <WrappedComponent
          navigationViewController={navigationViewController}
          {...props}
        />
      )}
    </ViewControllerSubscriber>
  );

  WithNavigationViewController.displayName = `WithNavigationViewController(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return WithNavigationViewController;
};

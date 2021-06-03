import React from 'react';

import UIControllerSubscriber from './UIControllerSubscriber';

export default (WrappedComponent) => {
  const withNavigationUIController = (props) => (
    <UIControllerSubscriber>
      {(navigationUIController) => (
        <WrappedComponent
          navigationUIController={navigationUIController}
          {...props}
        />
      )}
    </UIControllerSubscriber>
  );

  withNavigationUIController.displayName = `WithNavigationUIController(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return withNavigationUIController;
};
